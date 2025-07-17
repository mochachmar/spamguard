import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../ui/Sidebar';
import { BellIcon } from '../icons/InterfaceIcons';
import MenuIcon from '../icons/MenuIcon'; 

interface DashboardLayoutProps {
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Mobile sidebar toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-white shadow-md"
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      >
        <MenuIcon className="h-6 w-6 text-gray-700" />
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed md:relative inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transform ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar onLogout={onLogout} onNavigate={closeSidebar} />
      </div>

      {/* Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

    {/* Rest of the layout */}
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="flex justify-end items-center p-4 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <Link to="/notifications">
              <BellIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </Link>
            <Link to="/settings">
              <img 
                className="h-9 w-9 rounded-full object-cover cursor-pointer" 
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
                alt="User profile picture" 
              />
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;