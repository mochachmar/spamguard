import React, { useState } from 'react';

const SettingsPage: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-600">Manage your application and profile settings.</p>
      </div>
      
      {/* Notifications Settings */}
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Notifications</h2>
        <div className="flex items-center justify-between pt-6">
          <div>
            <h3 className="font-semibold text-gray-800">Email Notifications</h3>
            <p className="text-sm text-gray-500">Receive email notifications when spam is detected.</p>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${notificationsEnabled ? 'bg-slate-700' : 'bg-gray-200'}`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </div>
      
      {/* Model Settings */}
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Model Settings</h2>
        <div className="flex items-center justify-between pt-6">
          <div>
            <h3 className="font-semibold text-gray-800">Retrain Model</h3>
            <p className="text-sm text-gray-500">Retrain the spam detection model with new data.</p>
          </div>
          <button className="px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200 transition-colors border border-gray-300">
            Retrain
          </button>
        </div>
      </div>

      {/* Admin Profile Settings */}
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Admin Profile</h2>
        <div className="pt-6">
            <div className="flex items-center space-x-6 mb-8">
                <img className="h-24 w-24 rounded-full" src="https://i.pravatar.cc/150?u=ethan" alt="Profile" />
                <div>
                    <p className="text-lg font-bold text-gray-800">Ethan Carter</p>
                    <p className="text-sm text-gray-500">ethan.carter@example.com</p>
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200 transition-colors border border-gray-300 ml-auto">
                    Change Photo
                </button>
            </div>
            <form className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" id="name" defaultValue="Ethan Carter" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" defaultValue="ethan.carter@example.com" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password" placeholder="••••••••" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div className="flex justify-end pt-4">
                     <button type="submit" className="px-6 py-2 bg-slate-700 text-white font-medium rounded-md hover:bg-slate-600 transition-colors">
                        Update Profile
                    </button>
                </div>
            </form>
        </div>
      </div>

    </div>
  );
};

export default SettingsPage;