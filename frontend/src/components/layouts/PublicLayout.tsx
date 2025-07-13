import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../ui/Header';

const PublicLayout: React.FC = () => {
  const currentYear = new Date().getFullYear(); 

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer id="contact" className="w-full bg-white py-6 border-t border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
    <span className="mb-4 md:mb-0">© {currentYear} SpamGuard. All rights reserved.</span>
    <div className="flex space-x-4">
      <a href="#" className="hover:text-gray-700">Terms</a>
      <a href="#" className="hover:text-gray-700">Privacy</a>
      <a href="#" className="hover:text-gray-700">Contact</a>
    </div>
  </div>
</footer>
    </div>
  );
};

export default PublicLayout;
