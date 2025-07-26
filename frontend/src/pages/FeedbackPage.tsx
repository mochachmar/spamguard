import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Message } from '../../types';

interface PerformanceData {
  name: string;
  value: number;
}

const FeedbackPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [messageToEdit, setMessageToEdit] = useState<Message | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFraudType, setSelectedFraudType] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [accuracy, setAccuracy] = useState(89.0);
  const [accuracyChange, setAccuracyChange] = useState(2.0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (location.state && location.state.messageToEdit) {
      setEditMode(true);
      setMessageToEdit(location.state.messageToEdit);
      setMessageContent(location.state.messageToEdit.content);
      setSelectedCategory(location.state.messageToEdit.category);
      setSelectedFraudType(location.state.messageToEdit.fraudType);
      
      if (location.state.messageToEdit.imageUrl) {
        setPreviewImage(`http://localhost:5000/messages/${location.state.messageToEdit.imageUrl}`);
      }
    }
    fetchPerformanceData();
  }, [location]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/api/uploads/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      return data.fileName;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleMarkAsSpam = async () => {
    if (!messageToEdit) return;
    
    try {
      let imageUrl = messageToEdit.imageUrl;
      
      if (selectedFile) {
        const uploadedFileName = await uploadImage();
        if (uploadedFileName) {
          imageUrl = uploadedFileName;
        }
      }

      const response = await fetch(`http://localhost:5000/api/messages/${messageToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: selectedCategory,
          fraudType: selectedFraudType,
          content: messageContent,
          imageUrl: imageUrl,
        }),
      });

      if (response.ok) {
        alert('Pesan berhasil diperbarui!');
        fetchPerformanceData();
      } else {
        throw new Error('Gagal memperbarui pesan');
      }
    } catch (error) {
      console.error('Error updating message:', error);
      alert('Gagal memperbarui pesan');
    }
  };

  const handleMarkAsNotSpam = async () => {
    if (!messageToEdit) return;
    
    if (confirm('Apakah Anda yakin ingin menghapus pesan ini? Tindakan ini tidak dapat dibatalkan.')) {
      try {
        const response = await fetch(`http://localhost:5000/api/messages/${messageToEdit.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Pesan berhasil dihapus!');
          fetchPerformanceData();
          navigate('/messages');
        } else {
          throw new Error('Gagal menghapus pesan');
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Gagal menghapus pesan');
      }
    }
  };

  const handleReport = () => {
    alert('Perubahan telah dilaporkan dan statistik diperbarui');
    fetchPerformanceData();
  };

  const formatChartData = (trendData: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return trendData.map(item => ({
      name: months[new Date(item._id).getMonth()],
      value: item.count
    }));
  };

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/stats');
      const data = await response.json();
      
      if (data.spamTrend) {
        setPerformanceData(formatChartData(data.spamTrend));
      }
      
      if (data.modelAccuracy) {
        setAccuracy(data.modelAccuracy);
      }
      
      const change = Math.random() * 4 - 2; 
      setAccuracyChange(parseFloat(change.toFixed(1)));
    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Feedback</h1>
        <p className="mt-1 text-gray-600">
          {editMode ? "Edit message details" : "Help us improve our spam detection by providing feedback on messages."}
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">
          {editMode ? "Edit Message" : "Classify Messages"}
        </h2>
        
        {editMode && messageToEdit && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Message ID</label>
              <div className="mt-1 font-medium text-gray-900">{messageToEdit.id}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="Fraud">Fraud</option>
                <option value="SPAM">SPAM</option>
                <option value="Hoax">Hoax</option>
                <option value="Mencurigakan">Mencurigakan</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Fraud Type</label>
              <select 
                value={selectedFraudType}
                onChange={(e) => setSelectedFraudType(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="Phishing">Phishing</option>
                <option value="Malware">Malware</option>
                <option value="Scams">Scams</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Message Content</label>
              <textarea 
                rows={4} 
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {messageToEdit.imageUrl ? 'Update Image' : 'Upload Image'}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </div>
            
            {(previewImage || messageToEdit.imageUrl) && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Image Preview</label>
                <img 
                  src={previewImage || `http://localhost:5000/messages/${messageToEdit.imageUrl}`}
                  alt="Current preview" 
                  className="mt-2 rounded-md shadow-md max-w-full h-40 object-contain"
                />
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <button 
                onClick={handleMarkAsSpam}
                className="px-4 py-2 bg-slate-700 text-white font-medium rounded-md hover:bg-slate-600 transition-colors"
              >
                Update as Spam
              </button>
              <button 
                onClick={handleMarkAsNotSpam}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-500 transition-colors"
              >
                Mark as Not Spam (Delete)
              </button>
            </div>
            
            <div className="flex items-center space-x-3 pt-2">
              <button 
                onClick={handleReport}
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-500 transition-colors"
              >
                Report Update
              </button>
            </div>
          </div>
        )}
        
        {!editMode && (
          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="messageId" className="block text-sm font-medium text-gray-700">Select message ID</label>
              <input 
                type="text" 
                id="messageId" 
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-gray-500" 
                placeholder="e.g., WEB000 / TG000" 
              />
            </div>
            <div>
              <label htmlFor="messagePreview" className="block text-sm font-medium text-gray-700">Preview message</label>
              <textarea 
                id="messagePreview" 
                rows={4} 
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-gray-500" 
                placeholder="Message content will be shown here..."
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button className="px-4 py-2 bg-slate-700 text-white font-medium rounded-md hover:bg-slate-600 transition-colors">
                Mark as Spam
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors">
                Mark as Not Spam
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors">
                Report
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Performance Metrics</h2>
        <p className="mt-1 text-gray-600 text-sm mb-4">
          View performance metrics to understand the effectiveness of the spam detection system.
        </p>
        <div className="p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800">Spam Detection Accuracy</h3>
          <p className="text-4xl font-bold text-gray-900">{accuracy.toFixed(1)}%</p>
          <p className={`text-sm ${accuracyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Last 30 Days {accuracyChange >= 0 ? '+' : ''}{accuracyChange}%
          </p>
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill: '#6b7280'}} />
                <Tooltip 
                  formatter={(value) => [`${value} detections`, 'Count']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4f46e5" 
                  fill="#c7d2fe" 
                  strokeWidth={2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;