import React from 'react';
import { Home, Settings, BarChart2, LogOut, X } from 'lucide-react';

const  Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside className={`fixed top-0 left-0 h-full w-44 bg-white dark:bg-gray-800 shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 z-50 md:relative md:translate-x-0 md:shadow-none`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center md:hidden">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <button className="text-gray-500 dark:text-gray-400" onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      <nav className="p-4 space-y-3">
        <a href="#" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-600">
          <Home size={20} /> <span>Home</span>
        </a>
        <a href="#" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-600">
          <BarChart2 size={20} /> <span>Analytics</span>
        </a>
        <a href="#" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-600">
          <Settings size={20} /> <span>Settings</span>
        </a>
        <a href="#" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-red-500">
          <LogOut size={20} /> <span>Logout</span>
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;