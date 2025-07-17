import React, { useState, useEffect, useRef } from 'react';
import { LightningBoltIcon, ShieldCheckIcon as ShieldIcon, UserGroupIcon, CheckCircleIcon, UploadIcon, ExclamationCircleIcon, XCircleIcon } from '../components/icons/InterfaceIcons';
import Tesseract from 'tesseract.js';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-sm text-center items-center flex flex-col">
    <div className="bg-slate-100 rounded-full p-4 mb-4 inline-flex">{icon}</div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const HowItWorksStep: React.FC<{ number: number; title: string; description: string }> = ({ number, title, description }) => (
  <div className="text-center">
    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-slate-800 text-white flex items-center justify-center text-xl font-bold">{number}</div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 max-w-xs mx-auto">{description}</p>
  </div>
);

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <p className="text-4xl font-bold text-slate-800">{value}</p>
    <p className="text-gray-500 mt-1">{label}</p>
  </div>
);

interface AnalysisResultData {
  status: 'Fraud/SPAM/Hoax' | 'PROMO (Bukan Spam)' | 'Normal (Bukan Spam)' | 'MENCURIGAKAN';
  tingkat_akurasi: string;
  analisis: string[];
  rekomendasi: string[];
  fraudType?: string; 
}

const cleanText = (text: string) => {
  return text
    .replace(/\s*\[\d+\]\s*/g, '')     
    .replace(/\s*\(\d+\)\s*/g, '')     
    .replace(/\d+(,\s*\d+)+/g, '')     
    .replace(/\d+\.\s*/g, '')          
    .replace(/\b\d+\s*-\s*\d+\b/g, '') 
    .replace(/\s*\[\]\s*/g, '')        
    .replace(/\s{2,}/g, ' ')           
    .trim();
};

const AnalysisResult: React.FC<{ result: AnalysisResultData }> = ({ result }) => {
  const isSpam = ['Fraud', 'SPAM', 'Hoax', 'Mencurigakan'].includes(result.status);
  const cleanedAnalisis = result.analisis.map(cleanText);
  const cleanedRekomendasi = result.rekomendasi.map(cleanText);
  
  let bgColor = 'bg-green-50';
  let borderColor = 'border-green-500';
  let titleColor = 'text-green-700';
  let icon = <CheckCircleIcon className="h-5 w-5 text-green-500" />;
  
  if (result.status.includes('Hoax')) {
    bgColor = 'bg-red-50';
    borderColor = 'border-red-500';
    titleColor = 'text-red-700';
    icon = <XCircleIcon className="h-5 w-5 text-red-500" />;
  }
  if (result.status.includes('SPAM')) {
    bgColor = 'bg-red-50';
    borderColor = 'border-red-500';
    titleColor = 'text-red-700';
    icon = <XCircleIcon className="h-5 w-5 text-red-500" />;
  }
  if (result.status.includes('Fraud')) {
    bgColor = 'bg-red-50';
    borderColor = 'border-red-500';
    titleColor = 'text-red-700';
    icon = <XCircleIcon className="h-5 w-5 text-red-500" />;
  }
  if (result.status.includes('PROMO')) {
    bgColor = 'bg-blue-50';
    borderColor = 'border-blue-500';
    titleColor = 'text-blue-700';
    icon = <ShieldIcon className="h-5 w-5 text-blue-500" />;
  }
  if (result.status.includes('MENCURIGAKAN')) {
    bgColor = 'bg-yellow-50';
    borderColor = 'border-yellow-500';
    titleColor = 'text-yellow-700';
    icon = <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />;
  }

  return (
    <div className={`mt-6 border-l-4 ${borderColor} ${bgColor} rounded-r-lg p-6 transition-all duration-300`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <div>
            <h3 className={`text-lg font-bold ${titleColor}`}>{result.status}</h3>
            {isSpam && (
              <p className="text-sm text-gray-700 mt-1">
                Kategori: {result.status} | Jenis: {result.fraudType}
              </p>
            )}
          </div>
        </div>
        <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 border border-gray-200">
          Akurasi: {result.tingkat_akurasi}
        </span>
      </div>

       <div className="mt-4">
        <h4 className="font-semibold text-gray-900 mb-2">Analisis AI:</h4>
         <ul className="list-disc list-inside text-gray-700 space-y-1">
        {cleanedAnalisis.map((p, i) => <li key={i}>{p}</li>)}
       </ul>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold text-gray-900 mb-2">Rekomendasi:</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
        {cleanedRekomendasi.map((p, i) => <li key={i}>{p}</li>)}
       </ul>
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [result, setResult] = useState<AnalysisResultData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedImage(file); 
    processImageFile(file);
  };

  const processImageFile = async (file: File) => {
    setIsLoading(true);
    setLoadingStatus('Mengekstrak teks dari gambar...');
    
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'ind');
      setMessage(text);
      setLoadingStatus('Teks berhasil diekstrak!');
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Gagal membaca teks dari gambar.");
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedImage(file); 
      processImageFile(file);
    }
  };

  const handleDetectSpam = async () => {
    if (!message.trim()) return;
    setIsLoading(true);
    setResult(null);
    let uploadedImageUrl = null;

    try {
      setLoadingStatus('Menganalisis dengan AI...');

      if (selectedImage) {
        setLoadingStatus('Mengunggah gambar...');
        const formData = new FormData();
        formData.append('image', selectedImage);
        
        const uploadRes = await fetch('http://localhost:5000/api/uploads/upload', {
          method: 'POST',
          body: formData
        });

        if (!uploadRes.ok) throw new Error('Gagal mengunggah gambar');
        
        const { fileName } = await uploadRes.json();
        uploadedImageUrl = fileName;
      }

      setLoadingStatus('Menganalisis pesan...');
      const res = await fetch('http://localhost:5000/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: message,
          imageUrl: uploadedImageUrl 
        }),
      });

      if (!res.ok) throw new Error('Gagal mendapatkan analisis dari server AI');
      const analysisData = await res.json();
      setResult(analysisData);
    } catch (error) {
      console.error('Detection Error:', error);
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan.');
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
      setSelectedImage(null); 
    }
  };

  return (
    <div className={`bg-white text-gray-800 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      <section className="text-center py-20 sm:py-32">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              <CheckCircleIcon className="h-3 w-3" /> 99% Accuracy
            </span>
            <span className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              <CheckCircleIcon className="h-3 w-3" /> Instant
            </span>
            <span className="flex items-center gap-1 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              <CheckCircleIcon className="h-3 w-3" /> Privacy First
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">Detect Spam Messages Instantly</h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">Protect yourself from unwanted messages with our advanced spam detection. Simple, fast, and secure.</p>
        </div>
      </section>
      
      <section className="pb-20 sm:pb-32">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Periksa Pesan Anda</h2>
            
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 cursor-pointer transition-all
                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <UploadIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="font-medium text-gray-700 mb-1">Klik untuk mengunggah gambar</p>
              <p className="text-gray-500 text-sm">atau drag and drop file di sini</p>
              <p className="text-gray-400 text-xs mt-2">Format: JPG, PNG (maks. 5MB)</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Atau tempel teks pesan disini:
              </label>
              <textarea 
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tempel teks pesan disini..."
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            
            <button 
              onClick={handleDetectSpam} 
              disabled={isLoading || !message.trim()}
              className={`w-full py-3 px-6 text-white font-medium rounded-lg transition-colors flex items-center justify-center
                ${isLoading || !message.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {loadingStatus || 'Menganalisis...'}
                </>
              ) : 'Deteksi Pesan'}
            </button>
            
            {isLoading && !loadingStatus.includes('OCR') && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-600">Menganalisis pesan...</p>
              </div>
            )}
            
            {result && <AnalysisResult result={result} />}
          </div>
        </div>
      </section>

      <section id="features" className="bg-gray-50 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Why Choose SpamGuard?</h2>
            <p className="mt-4 text-lg text-gray-600">Advanced features to keep you protected from spam messages.</p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <FeatureCard icon={<LightningBoltIcon className="h-8 w-8 text-slate-600" />} title="Lightning Fast" description="Get instant results with our optimized detection algorithms. No waiting, no delays." />
            <FeatureCard icon={<ShieldIcon className="h-8 w-8 text-slate-600" />} title="High Accuracy" description="Our AI model achieves 99% accuracy in distinguishing between spam and legitimate messages." />
            <FeatureCard icon={<UserGroupIcon className="h-8 w-8 text-slate-600" />} title="Privacy First" description="Your messages are processed securely and never stored. Complete privacy guaranteed." />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Simple, fast, and effective spam detection in three steps.</p>
          </div>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            <HowItWorksStep number={1} title="Input Message" description="Paste or type the message you want to analyze into our secure text box." />
            <HowItWorksStep number={2} title="AI Analysis" description="Our advanced AI analyzes the message for spam indicators and patterns." />
            <HowItWorksStep number={3} title="Get Results" description="Receive instant results with confidence scores and detailed information." />
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value="1M+" label="Messages Analyzed" />
            <StatItem value="99%" label="Accuracy Rate" />
            <StatItem value="50K+" label="Happy Users" />
            <StatItem value="24/7" label="Available" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
