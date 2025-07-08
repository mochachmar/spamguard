import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../ui/Sidebar';
import { BellIcon, UserCircleIcon } from '../icons/InterfaceIcons';

interface DashboardLayoutProps {
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar onLogout={onLogout} />
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