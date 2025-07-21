import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const getBotSettings = async () => {
  const response = await axios.get('/api/settings');
  return response.data;
};

export const updateBotSettings = async (settings: any) => {
  const response = await axios.put('/api/settings', settings);
  return response.data;
};

const SettingsPage: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [botSettings, setBotSettings] = useState({
    minCharLength: 20,
    activeHours: { 
      start: 8, 
      end: 17   
    }
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getBotSettings();
        setBotSettings({
          minCharLength: settings.minCharLength,
          activeHours: {
            start: settings.activeHours?.start || 8,
            end: settings.activeHours?.end || 17
          }
        });
      } catch (error) {
        console.error("Gagal memuat pengaturan:", error);
      }
    };
    loadSettings();
  }, []);

  const handleSaveBotSettings = async () => {
    try {
      await updateBotSettings(botSettings);
      alert('Pengaturan bot berhasil disimpan!');
    } catch (error) {
      console.error("Gagal menyimpan pengaturan:", error);
      alert('Gagal menyimpan pengaturan bot!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-600">Manage your application and profile settings.</p>
      </div>
      
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
      
      <div className="bg-white p-8 rounded-lg shadow-sm">
  <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Bot Settings</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Minimal Karakter
      </label>
      <input
        type="number"
        value={botSettings.minCharLength}
        onChange={(e) => setBotSettings({...botSettings, minCharLength: parseInt(e.target.value) || 20})}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Jam Aktif Bot
      </label>
      <div className="flex space-x-2">
        <input
          type="number"
          value={botSettings.activeHours.start}
          onChange={(e) => setBotSettings({
            ...botSettings, 
            activeHours: {
              ...botSettings.activeHours,
              start: parseInt(e.target.value) || 0
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          min="0"
          max="23"
        />
        <span className="self-center">-</span>
        <input
          type="number"
          value={botSettings.activeHours.end}
          onChange={(e) => setBotSettings({
            ...botSettings, 
            activeHours: {
              ...botSettings.activeHours,
              end: parseInt(e.target.value) || 23
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          min="0"
          max="23"
        />
      </div>
    </div>
  </div>
  
    <div className="flex justify-end pt-6">
    <button
      onClick={handleSaveBotSettings}
      className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600"
    >
      Simpan Pengaturan Bot
    </button>
    </div>
  </div>

      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Admin Profile</h2>
        <div className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                <img className="h-24 w-24 rounded-full" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" />
                <div className="flex-grow">
                    <p className="text-lg font-bold text-gray-800">Moch Achmar</p>
                    <p className="text-sm text-gray-500">mochachmar@gmail.com</p>
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200">
                    Change Photo
                </button>
            </div>
            <form className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" id="name" defaultValue="Moch Achmar" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" defaultValue="mochachmar@gmail.com" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
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