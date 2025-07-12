
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheckIcon } from '../icons/InterfaceIcons';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSmoothScroll = (hash: string) => {
    setTimeout(() => {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    }
    handleSmoothScroll(hash);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        navigate('/');
    }
  };


  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a href="/" onClick={handleLogoClick} className="flex items-center cursor-pointer">
            <ShieldCheckIcon className="h-8 w-8 text-slate-800" />
            <span className="ml-2 text-2xl font-bold text-slate-800">SpamGuard</span>
          </a>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" onClick={(e) => handleNavClick(e, '#features')} className="text-gray-600 hover:text-slate-800 font-medium">Features</a>
            <a href="#how-it-works" onClick={(e) => handleNavClick(e, '#how-it-works')} className="text-gray-600 hover:text-slate-800 font-medium">How It Works</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="text-gray-600 hover:text-slate-800 font-medium">Contact</a>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/login')} className="text-gray-600 hover:text-slate-800 font-medium">Login</button>
            <button onClick={() => navigate('/register')} className="bg-slate-800 text-white px-4 py-2 rounded-md font-medium hover:bg-slate-700 transition-colors">Register</button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;