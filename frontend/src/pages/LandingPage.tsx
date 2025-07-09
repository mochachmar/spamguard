import React, { useState, useEffect } from 'react';
import { LightningBoltIcon, ShieldCheckIcon as ShieldIcon, UserGroupIcon, UploadIcon, CheckCircleIcon } from '../components/icons/InterfaceIcons';

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
            <button onClick={handleDetectSpam} disabled={isLoading} className="w-full mt-4 bg-slate-800 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 disabled:bg-slate-400 transition-colors">
              {isLoading ? 'Detecting...' : 'Detect Spam'}
            </button>
            {result && (
              <div className={`mt-4 p-4 rounded-lg text-center font-medium ${result === 'Spam' ? 'bg-red-100 text-red-800' : result === 'NotSpam' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {result === 'Spam' && 'Result: This message is likely Spam.'}
                {result === 'NotSpam' && 'Result: This message appears to be Not Spam.'}
                {result === 'Error' && 'An error occurred. Please try again.'}
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
