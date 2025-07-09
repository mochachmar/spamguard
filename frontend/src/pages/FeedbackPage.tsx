import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';

const performanceData = [
    { name: 'Jan', value: 92 },
    { name: 'Feb', value: 94 },
    { name: 'Mar', value: 91 },
    { name: 'Apr', value: 93 },
    { name: 'May', value: 95 },
    { name: 'Jun', value: 96 },
    { name: 'Jul', value: 95 },
];


const FeedbackPage: React.FC = () => {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Feedback</h1>
                <p className="mt-1 text-gray-600">Help us improve our spam detection by providing feedback on messages.</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">Classify Messages</h2>
                <p className="mt-1 text-gray-600 text-sm">Classify messages as spam or suspicious to improve detection accuracy. Use the 'Report' button for unknown messages.</p>
                <div className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="messageId" className="block text-sm font-medium text-gray-700">Select message ID</label>
                        <input type="text" id="messageId" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-gray-500" placeholder="e.g., MSG001" />
                    </div>
                    <div>
                        <label htmlFor="messagePreview" className="block text-sm font-medium text-gray-700">Preview message</label>
                        <textarea id="messagePreview" rows={4} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-gray-500" placeholder="Message content will be shown here..."></textarea>
                    </div>
                    <div className="flex items-center space-x-3">
                         <button className="px-4 py-2 bg-slate-700 text-white font-medium rounded-md hover:bg-slate-600 transition-colors">Mark as Spam</button>
                         <button className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors">Mark as Not Spam</button>
                    </div>
                    <div className="flex items-center space-x-3">
                         <button className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors">Report</button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">Performance Metrics</h2>
                <p className="mt-1 text-gray-600 text-sm mb-4">View performance metrics to understand the effectiveness of the spam detection system.</p>
                 <div className="p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800">Spam Detection Accuracy</h3>
                    <p className="text-4xl font-bold text-gray-900">95%</p>
                    <p className="text-sm text-green-600">Last 30 Days +2%</p>
                    <div className="h-80 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill: '#6b7280'}} />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="#c7d2fe" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;