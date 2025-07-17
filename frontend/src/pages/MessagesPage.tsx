import React, { useState, useEffect } from 'react';
import { Message } from '../../types';
import { SearchIcon, ChevronDownIcon } from '../components/icons/InterfaceIcons';

const categoryColors: { [key: string]: string } = {
    'Fraud': 'bg-red-100 text-red-800',
    'SPAM': 'bg-purple-100 text-purple-800',
    'Mencurigakan': 'bg-yellow-100 text-yellow-800',
    'Hoax': 'bg-blue-100 text-blue-800',
};

const fraudTypeColors: { [key: string]: string } = {
    'Phishing': 'bg-red-100 text-red-800',
    'Malware': 'bg-orange-100 text-orange-800',
    'Scams': 'bg-purple-100 text-purple-800',
    'Other': 'bg-gray-100 text-gray-800',
};

const CategoryBadge: React.FC<{ category: Message['category'] }> = ({ category }) => {
    const badgeStyle = categoryColors[category] || 'bg-gray-100 text-gray-800';
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full leading-tight";
    return <span className={`${baseClasses} ${badgeStyle}`}>{category}</span>;
}

const FraudTypeBadge: React.FC<{ fraudType: Message['fraudType'] }> = ({ fraudType }) => {
    const badgeStyle = fraudTypeColors[fraudType] || 'bg-gray-100 text-gray-800';
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full leading-tight";
    return <span className={`${baseClasses} ${badgeStyle}`}>{fraudType}</span>;
}

const MessageDetails: React.FC<{ message: Message | null 
  onDelete: (id: string) => void }> = ({ message, onDelete }) => {
    if (!message) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm h-full flex items-center justify-center">
                <p className="text-gray-500">Select a message to see details</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Message Details</h3>
            <div className="space-y-3 text-sm">
                <p className="text-gray-900"><span className="font-semibold text-gray-900">Date:</span> {message.date}</p>
                <p className="text-gray-900"><span className="font-semibold text-gray-900">Category:</span> <CategoryBadge category={message.category} /></p>
                <p className="text-gray-900"><span className="font-semibold text-gray-900">Fraud Type:</span> <FraudTypeBadge fraudType={message.fraudType} /></p>
            </div>
            <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-2">Message Content</h4>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md border">{message.content}</p>
            </div>
            <div className="mt-6 bg-gray-50 p-4 rounded-md border flex items-center justify-center">
  {message.imageUrl ? (
    <img 
  src={`http://localhost:5000/messages/${message.imageUrl}`}
  alt="Document preview" 
  className="rounded-md shadow-md max-w-full h-auto"
/>
  ) : (
    <p className="text-gray-500">No image available</p>
  )}
</div>
            <div className="flex justify-end space-x-3 mt-8">
                <button className="px-4 py-2 bg-slate-700 text-white text-sm font-medium rounded-md hover:bg-slate-600">Edit</button>
                <button 
                    onClick={() => message && onDelete(message.id)} 
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-500"
                    >
                    Delete
                </button>
            </div>
        </div>
    );
};

const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Gagal menghapus pesan');
      
      setMessages(messages.filter(msg => msg.id !== id));
      
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(messages.length > 1 ? messages[0] : null);
      }
      
      alert('Pesan berhasil dihapus');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Gagal menghapus pesan');
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/messages');
        const data: Message[] = await response.json();
        setMessages(data);
        if (data.length > 0) setSelectedMessage(data[0]);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                <p className="mt-1 text-gray-600">View all messages received and processed by the system.</p>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/2 xl:w-2/3">
                    <div className="bg-white rounded-lg shadow-sm flex flex-col">
                        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200">
                            <div className="relative w-full sm:w-auto flex-grow max-w-xs">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input type="text" placeholder="Search messages" className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500" />
                            </div>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Category <ChevronDownIcon className="h-4 w-4" /></button>
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Fraud Type <ChevronDownIcon className="h-4 w-4" /></button>
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Date <ChevronDownIcon className="h-4 w-4" /></button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        {['Message ID', 'Category', 'Fraud Type', 'Date of Receipt', 'Action'].map(header => (
                                            <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {messages.map((message) => (
                                        <tr key={message.id} className={`${selectedMessage?.id === message.id ? 'bg-indigo-50' : ''} hover:bg-gray-50`}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{message.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap"><CategoryBadge category={message.category} /></td>
                                            <td className="px-6 py-4 whitespace-nowrap"><FraudTypeBadge fraudType={message.fraudType} /></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{message.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button onClick={() => setSelectedMessage(message)} className="text-indigo-600 hover:text-indigo-900">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className={`w-full lg:w-1/2 xl:w-1/3 ${selectedMessage ? 'block' : 'hidden lg:block'}`}>
                    <MessageDetails 
                        message={selectedMessage} 
                        onDelete={handleDelete} 
                        />
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
