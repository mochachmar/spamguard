import React, { useState, useEffect } from 'react';
import { LightningBoltIcon, ShieldCheckIcon as ShieldIcon, UserGroupIcon, UploadIcon, CheckCircleIcon, ExclamationCircleIcon, XCircleIcon} from '../components/icons/InterfaceIcons';

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

const AnalysisResult: React.FC<{ 
  type: 'Normal' | 'Promo' | 'Fraud';
  title: string;
  accuracy: string;
  analysisPoints: string[];
  recommendations: string[];
}> = ({ type, title, accuracy, analysisPoints, recommendations }) => {
  // Determine styling based on result type
  let bgColor, borderColor, textColor, icon;
  switch (type) {
    case 'Normal':
      bgColor = 'bg-green-50';
      borderColor = 'border-green-200';
      textColor = 'text-green-800';
      icon = <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      break;
    case 'Promo':
      bgColor = 'bg-blue-50';
      borderColor = 'border-blue-200';
      textColor = 'text-blue-800';
      icon = <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      break;
    case 'Fraud':
      bgColor = 'bg-red-50';
      borderColor = 'border-red-200';
      textColor = 'text-red-800';
      icon = <XCircleIcon className="h-5 w-5 text-red-500" />;
      break;
    default:
      bgColor = 'bg-gray-50';
      borderColor = 'border-gray-200';
      textColor = 'text-gray-800';
  }

  return (
    <div className={`mt-6 border rounded-lg p-6 ${bgColor} ${borderColor}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className={`text-lg font-bold ${textColor}`}>{title}</h3>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-white">
          Accuracy: {accuracy}
        </span>
      </div>

      <h4 className="font-semibold text-gray-900 mb-2">AI Analysis</h4>
      <ol className="list-decimal pl-5 space-y-2 mb-4">
        {analysisPoints.map((point, index) => (
          <li key={index} className="text-gray-700">{point}</li>
        ))}
      </ol>

      <hr className="my-4 border-gray-300" />

      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Recommendation</h4>
        <ol className="list-decimal pl-5 space-y-1">
          {recommendations.map((rec, index) => (
            <li key={index} className="text-gray-700">{rec}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<'Spam' | 'NotSpam' | 'Error' | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation on component mount
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

const handleDetectSpam = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    setResult(null);

    // Simulate API call with timeout
    setTimeout(() => {
      // Determine result type based on message content (dummy logic)
      let detectionResult: 'Normal' | 'Promo' | 'Fraud';
      
      if (message.includes('wawancara') || message.includes('interview')) {
        detectionResult = 'Normal';
      } else if (message.includes('promo') || message.includes('discount')) {
        detectionResult = 'Promo';
      } else if (message.includes('transfer') || message.includes('klik')) {
        detectionResult = 'Fraud';
      } else {
        // Random result if no keywords match
        const results: ('Normal' | 'Promo' | 'Fraud')[] = ['Normal', 'Promo', 'Fraud'];
        detectionResult = results[Math.floor(Math.random() * results.length)];
      }

      setResult(detectionResult);
      setIsLoading(false);
    }, 1500);
  };

  // Dummy data for different result types
  const normalResult = {
    type: 'Normal' as const,
    title: 'Normal (Not Spam)',
    accuracy: 'Tinggi (99%)',
    analysisPoints: [
      'Pesan ini menggunakan bahasa formal, menyebutkan posisi yang spesifik ("Staff Administrasi"), dan memberikan detali waktu serta lokasi wawancara.',
      'Terdeteksi nama perusahaan "PT. Jaya Abadi" dan pengirim "HRD PT. Jaya Abadi".',
      'Tidak ada indikator mencurigakan seperti permintaan transfer uang, klaim gaji tidak masuk akal, atau tautan yang mencurigakan.'
    ],
    recommendations: [
      'Anda dapat membalas pesan ini untuk mengonfirmasi kehadiran wawancara Anda.'
    ]
  };

  const promoResult = {
    type: 'Promo' as const,
    title: 'Promo (Not Spam)',
    accuracy: 'Tinggi (98%)',
    analysisPoints: [
      'Menggunakan bahasa sopan dan profesional serta mencantumkan nama penerima secara personal.',
      'Menawarkan promo realistis dengan informasi yang jelas: jenis layanan, harga, kecepatan, dan masa berlaku promo.',
      'Tautan yang diberikan terlihat aman (domain perusahaan resmi), tidak ada unsur penipuan atau desakan tidak wajar.'
    ],
    recommendations: [
      'Jika Anda tertarik, Anda dapat menghubungi nomor resmi atau mengunjungi tautan yang disediakan untuk informasi lebih lanjut.',
      'Pastikan koneksi aman saat mengakses situs atau memberikan data pribadi.'
    ]
  };

  const fraudResult = {
    type: 'Fraud' as const,
    title: 'Fraud/SPAM/Hoax',
    accuracy: 'Tinggi (98%)',
    analysisPoints: [
      'Pesan ini mengandung ciri-ciri umum spam seperti klaim "gaji fantastis", urgensi ("pelatihan online wajib besok"), penggunaan alamat email non-perusahaan (@gmail.com), dan instruksi untuk mengklik tautan eksternal.',
      'Tidak ditemukan lowongan "Manajer Area" dari "PT. Makmur Jaya" di situs resmi perusahaan atau platform lowongan kerja terpercaya.',
      'Ditemukan beberapa laporan penipuan yang terkait dengan nama perusahaan dan pola rekrutmen serupa.',
      'Tautan bit.ly/lowongan-palsu-makmurjaya sangat mencurigakan, kemungkinan mengarah ke situs phishing atau pengunduhan malware.'
    ],
    recommendations: [
      'JANGAN membalas pesan ini atau mengklik tautan yang diberikan.',
      'JANGAN memberikan informasi pribadi atau finansial Anda.'
    ]
  };

  return (
    <div className={`bg-white text-gray-800 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      {/* Hero Section */}
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

      {/* Test Your Message Section */}
      <section className="pb-20 sm:pb-32">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Test Your Message</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <UploadIcon className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="mt-2 text-gray-600">
                Drag and drop a file here, or <span className="font-medium text-slate-700 cursor-pointer">Browse files</span>
              </p>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-slate-500 focus:outline-none placeholder-gray-500"
              rows={5}
              placeholder="Enter your message here..."
            ></textarea>
            <button 
              onClick={handleDetectSpam} 
              disabled={isLoading}
              className="w-full mt-4 bg-slate-800 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 disabled:bg-slate-400 transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : 'Detect'}
            </button>
            
            {result && result !== 'Error' && (
              <AnalysisResult
                type={result}
                title={
                  result === 'Normal' ? normalResult.title :
                  result === 'Promo' ? promoResult.title :
                  fraudResult.title
                }
                accuracy={
                  result === 'Normal' ? normalResult.accuracy :
                  result === 'Promo' ? promoResult.accuracy :
                  fraudResult.accuracy
                }
                analysisPoints={
                  result === 'Normal' ? normalResult.analysisPoints :
                  result === 'Promo' ? promoResult.analysisPoints :
                  fraudResult.analysisPoints
                }
                recommendations={
                  result === 'Normal' ? normalResult.recommendations :
                  result === 'Promo' ? promoResult.recommendations :
                  fraudResult.recommendations
                }
              />
            )}

            {result === 'Error' && (
              <div className="mt-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
                <div className="flex items-center">
                  <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">Analysis Error</h3>
                </div>
                <p className="mt-2">Could not analyze the message. Please try again with different content.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* How It Works Section */}
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

      {/* Stats Section */}
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
