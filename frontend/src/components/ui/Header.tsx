import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheckIcon} from '../icons/InterfaceIcons';
import MenuIcon from '../icons/MenuIcon'; 

interface HeaderProps {
  onNavClick?: () => void; 
}

const Header: React.FC<HeaderProps> = ({ onNavClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    onNavClick?.(); 
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
    onNavClick?.(); 
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a href="/" onClick={handleLogoClick} className="flex items-center cursor-pointer">
            <ShieldCheckIcon className="h-8 w-8 text-slate-800" />
            <span className="ml-2 text-2xl font-bold text-slate-800">SpamGuard</span>
          </a>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              onClick={(e) => handleNavClick(e, '#features')} 
              className="text-gray-600 hover:text-slate-800 font-medium"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => handleNavClick(e, '#how-it-works')} 
              className="text-gray-600 hover:text-slate-800 font-medium"
            >
              How It Works
            </a>
            <a 
              onClick={() => navigate('/guides')}
              className="text-gray-600 hover:text-slate-800 font-medium hover:cursor-pointer"
            >
              Guides
            </a>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={() => navigate('/login')} className="text-gray-600 hover:text-slate-800 font-medium">
              Login
            </button>
            <button onClick={() => navigate('/register')} className="bg-slate-800 text-white px-4 py-2 rounded-md font-medium hover:bg-slate-700 transition-colors">
              Register
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <a 
                href="#features" 
                onClick={(e) => {
                  handleNavClick(e, '#features');
                  setMobileMenuOpen(false);
                }} 
                className="text-gray-600 hover:text-slate-800 font-medium"
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                onClick={(e) => {
                  handleNavClick(e, '#how-it-works');
                  setMobileMenuOpen(false);
                }} 
                className="text-gray-600 hover:text-slate-800 font-medium"
              >
                How It Works
              </a>
              <a 
                onClick={() => navigate('/guides')} 
                className="text-gray-600 hover:text-slate-800 font-medium hover:cursor-pointer"
              >
                Guides
              </a>
            </div>
            <div className="flex space-x-4 mt-4">
              <button 
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }} 
                className="flex-1 py-2 bg-slate-800 text-white rounded-md"
              >
                Login
              </button>
              <button 
                onClick={() => {
                  navigate('/register');
                  setMobileMenuOpen(false);
                }} 
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-md"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;