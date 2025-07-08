
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon } from '../icons/InterfaceIcons';
import { Notification } from '../../types';

const kpiData = [
  { title: 'Total Messages Processed', value: '12,345', change: '+10%', changeType: 'increase' as const },
  { title: 'Spam Messages Detected', value: '2,567', change: '-5%', changeType: 'decrease' as const },
  { title: 'Model Accuracy', value: '98.5%', change: '+0.2%', changeType: 'increase' as const },
];

const spamTrendData = [
  { name: 'Jan', value: 2400 }, { name: 'Feb', value: 1398 }, { name: 'Mar', value: 3800 },
  { name: 'Apr', value: 2908 }, { name: 'May', value: 4800 }, { name: 'Jun', value: 3800 },
];

const spamCategoryData = [
  { name: 'Phishing', value: 400 }, { name: 'Malware', value: 300 },
  { name: 'Scams', value: 200 }, { name: 'Other', value: 278 },
];

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
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">Overview of your system's performance and key metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiData.map((item) => (
          <KpiCard key={item.title} {...item} />
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Fraud Trends</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">Spam Detection Rate Over Time</h3>
            <p className="text-3xl font-bold text-gray-900">15%</p>
            <p className="text-sm text-green-600">Last 30 Days +2%</p>
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
            <h3 className="text-lg font-semibold text-gray-800">Spam Categories</h3>
            <p className="text-3xl font-bold text-gray-900">20%</p>
            <p className="text-sm text-red-600">Last 30 Days -3%</p>
            <div className="h-60 mt-4">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={spamCategoryData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill: '#6b7280'}} />
                    <YAxis axisLine={false} tickLine={false} tick={false} />
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
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
