import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  BookOpenIcon, 
  LightBulbIcon,
  MagnifyingGlassIcon,
  LockClosedIcon,
  ExclamationCircleIcon,
  SparklesIcon
} from '../components/icons/InterfaceIcons';

// Component for each guide card
const GuideCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ 
  icon, 
  title, 
  description 
}) => (
  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col items-start text-left">
    <div className="bg-slate-100 rounded-full p-3 mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Component for each section (Tutorials and Tips)
const GuideSection: React.FC<{ 
  title: string; 
  subtitle: string; 
  icon: React.ReactNode; 
  children: React.ReactNode 
}> = ({ title, subtitle, icon, children }) => (
  <div className="mb-16">
    <div className="flex items-center mb-8">
      <div className="bg-slate-800 rounded-full p-3 mr-4">
        {icon}
      </div>
      <div>
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {children}
    </div>
  </div>
);

const GuidesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-gray-800">
      <section className="py-20 sm:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6">Edukasi & Panduan Penggunaan</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tingkatkan pemahaman Anda tentang penggunaan SpamGuard dan cara melindungi diri dari spam dengan panduan komprehensif kami.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GuideSection 
            title="Tutorial Penggunaan SpamGuard" 
            subtitle="Pelajari cara mengatur dan mengonfigurasi SpamGuard untuk kinerja optimal."
            icon={<BookOpenIcon className="h-8 w-8 text-white" />}
          >
            <GuideCard 
              icon={<ShieldCheckIcon className="h-6 w-6 text-slate-600" />}
              title="Memulai dengan SpamGuard"
              description="Pelajari cara mengatur dan mengonfigurasi SpamGuard untuk kinerja optimal."
            />
            <GuideCard 
              icon={<MagnifyingGlassIcon className="h-6 w-6 text-slate-600" />}
              title="Memahami Laporan Spam"
              description="Jelajahi laporan spam terperinci untuk menganalisis dan meningkatkan deteksi spam Anda."
            />
            <GuideCard 
              icon={<SparklesIcon className="h-6 w-6 text-slate-600" />}
              title="Menyesuaikan Filter Spam"
              description="Sesuaikan pengaturan filter spam Anda untuk memenuhi kebutuhan dan preferensi spesifik Anda."
            />
          </GuideSection>

          <GuideSection 
            title="Tips Menghindari Spam" 
            subtitle="Panduan praktis untuk melindungi diri Anda dari spam dan aktivitas mencurigakan."
            icon={<LightBulbIcon className="h-8 w-8 text-white" />}
          >
            <GuideCard 
              icon={<ExclamationCircleIcon className="h-6 w-6 text-slate-600" />}
              title="Mengenali Upaya Phishing"
              description="Pelajari cara mengidentifikasi dan menghindari email dan situs web phishing yang mencoba mencuri informasi Anda."
            />
            <GuideCard 
              icon={<LockClosedIcon className="h-6 w-6 text-slate-600" />}
              title="Membuat Kata Sandi yang Kuat"
              description="Ikuti praktik terbaik untuk membuat kata sandi yang kuat dan aman untuk melindungi akun Anda."
            />
            <GuideCard 
              icon={<ShieldCheckIcon className="h-6 w-6 text-slate-600" />}
              title="Melindungi Informasi Pribadi Anda"
              description="Pahami cara melindungi data pribadi Anda dari spam dan aktivitas berbahaya."
            />
          </GuideSection>
        </div>
      </section>
    </div>
  );
};

export default GuidesPage;