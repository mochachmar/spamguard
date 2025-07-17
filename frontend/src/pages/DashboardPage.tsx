import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon } from '../components/icons/InterfaceIcons';
import { Notification } from '../../types';

interface DashboardStats {
  totalProcessed: number;
  spamDetected: number;
  modelAccuracy: number;
  spamTrend: { _id: string; count: number }[];
  fraudDistribution: { _id: string; count: number }[];
  totalChange: number; // Added property
}

const notificationsData: Notification[] = [
  { id: 1, date: '2024-07-15', type: 'Warning', description: 'Unusual activity detected from IP address 192.168.1.100' },
  { id: 2, date: '2024-07-14', type: 'Info', description: 'System updated to version 2.1.3' },
  { id: 3, date: '2024-07-13', type: 'Alert', description: 'High volume of spam detected from domain example.com' },
];

const KpiCard: React.FC<{ title: string; value: string; change: string; changeType: 'increase' | 'decrease' }> = ({ title, value, change, changeType }) => {
    const isIncrease = changeType === 'increase';
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            <div className={`flex items-center text-sm mt-2 ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                {isIncrease ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                <span className="ml-1">{change}</span>
            </div>
        </div>
    );
};

const NotificationBadge: React.FC<{ type: Notification['type'] }> = ({ type }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
  const styles = {
    Warning: 'bg-yellow-100 text-yellow-800',
    Info: 'bg-blue-100 text-blue-800',
    Alert: 'bg-red-100 text-red-800',
  };
  return <span className={`${baseClasses} ${styles[type]}`}>{type}</span>;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh setiap 30 detik
    
    return () => clearInterval(interval);
  }, []);

  // Format data untuk chart
  const spamTrendData = stats?.spamTrend.map(item => ({
    name: new Date(item._id).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    value: item.count
  })) || [];

  const spamCategoryData = stats?.fraudDistribution.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  // Hitung perubahan spam 30 hari
  const spamChange = stats?.spamTrend && stats.spamTrend.length > 0 
    ? ((stats.spamTrend[stats.spamTrend.length - 1].count - stats.spamTrend[0].count) / stats.spamTrend[0].count) * 100
    : 0;

  const kpiData: { title: string; value: string; change: string; changeType: "increase" | "decrease" }[] = [
    { 
      title: 'Total Messages Processed', 
      value: stats?.totalProcessed.toLocaleString() || '0', 
      change: stats ? `${stats.totalChange.toFixed(1)}%` : '0%', 
      changeType: stats?.totalChange && stats.totalChange >= 0 ? "increase" : "decrease"
    },
    { 
      title: 'Spam Messages Detected', 
      value: stats?.spamDetected.toLocaleString() || '0', 
      change: stats ? `${spamChange.toFixed(1)}%` : '0%', 
      changeType: spamChange >= 0 ? "increase" : "decrease"
    },
    { 
      title: 'Model Accuracy', 
      value: stats ? `${stats.modelAccuracy.toFixed(1)}%` : '0%', 
      change: '+0.5%', 
      changeType: "increase"
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">Overview of your system's performance and key metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {kpiData.map((item) => (
          <KpiCard key={item.title} {...item} />
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Fraud Trends</h2>
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">Spam Detection Rate Over Time</h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.spamTrend ? stats.spamTrend.reduce((sum, day) => sum + day.count, 0) : 0}
            </p>
            <p className={`text-sm ${spamChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Last 30 Days {spamChange >= 0 ? '+' : ''}{spamChange.toFixed(1)}%
            </p>
            <div className="h-60 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spamTrendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill: '#6b7280'}}/>
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="#c7d2fe" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">Percentage Value Fraud Type</h3>
            <p className="text-3xl font-bold text-gray-900">30 Days</p>
            <div className="h-60 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spamCategoryData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill: '#6b7280'}} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'rgba(239, 246, 255, 0.5)'}} />
                  <Bar dataKey="value" fill="#a5b4fc" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Notifications</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notificationsData.map((notification) => (
                <tr key={notification.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{notification.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <NotificationBadge type={notification.type} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{notification.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
