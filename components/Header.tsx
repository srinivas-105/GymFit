
import React from 'react';
import type { Page } from '../types';

interface NavItem {
  page: Page;
  label: string;
  // Fix: Changed JSX.Element to React.ReactElement to resolve namespace error.
  icon: React.ReactElement;
}

interface HeaderProps {
  navItems: NavItem[];
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ navItems, currentPage, setCurrentPage }) => {
  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400">
              FitGenius AI
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => setCurrentPage(item.page)}
                className={`flex items-center px-4 py-2 text-lg font-medium rounded-md transition-colors duration-200 ${
                  currentPage === item.page
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {React.cloneElement(item.icon, { className: 'h-5 w-5 mr-2' })}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        {/* Mobile Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
          <div className="flex justify-around py-2">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => setCurrentPage(item.page)}
                className={`flex flex-col items-center w-full py-1 text-xs sm:text-sm font-medium transition-colors duration-200 ${
                  currentPage === item.page ? 'text-cyan-400' : 'text-gray-400'
                }`}
              >
                {React.cloneElement(item.icon, { className: 'h-6 w-6 mb-1' })}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;