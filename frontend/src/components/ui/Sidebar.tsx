import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShieldCheckIcon, HomeIcon, MessageIcon, FeedbackIcon, SettingsIcon, LogoutIcon } from '../icons/InterfaceIcons';

interface SidebarProps {
  onLogout: () => void;
  onNavigate?: () => void; // Add this new prop
}

const NavItem: React.FC<{ 
  to: string; 
  icon: React.ReactNode; 
  label: string;
  onClick?: () => void;
}> = ({ to, icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-gray-200 text-gray-900'
          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
      }`
    }
  >
    {icon}
    <span className="ml-3">{label}</span>
  </NavLink>
);

const Sidebar: React.FC<SidebarProps> = ({ onLogout, onNavigate }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
    onNavigate?.(); // Close sidebar on logout too
  };

  const handleNavClick = () => {
    onNavigate?.(); // Close sidebar when any nav item is clicked
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex items-center justify-center h-20 border-b border-gray-200">
        <ShieldCheckIcon className="h-8 w-8 text-slate-800" />
        <span className="ml-2 text-2xl font-bold text-slate-800">SpamGuard</span>
      </div>
      <div className="flex-grow p-4">
        <nav className="space-y-2">
          <NavItem 
            to="/dashboard" 
            icon={<HomeIcon className="h-5 w-5" />} 
            label="Dashboard" 
            onClick={handleNavClick}
          />
          <NavItem 
            to="/messages" 
            icon={<MessageIcon className="h-5 w-5" />} 
            label="Messages" 
            onClick={handleNavClick}
          />
          <NavItem 
            to="/feedback" 
            icon={<FeedbackIcon className="h-5 w-5" />} 
            label="Feedback" 
            onClick={handleNavClick}
          />
          <NavItem 
            to="/settings" 
            icon={<SettingsIcon className="h-5 w-5" />} 
            label="Settings" 
            onClick={handleNavClick}
          />
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogoutClick}
          className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-200 hover:text-gray-900"
        >
          <LogoutIcon className="h-5 w-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;