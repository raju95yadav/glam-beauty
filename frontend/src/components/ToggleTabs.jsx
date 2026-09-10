import React from 'react';
import { motion } from 'framer-motion';

const ToggleTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex p-1 bg-gray-50/50 dark:bg-gray-800/20 backdrop-blur-sm rounded-full mb-6 border border-gray-100 dark:border-gray-800/50">
      <button
        onClick={() => onTabChange('user')}
        className={`relative flex-1 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
          activeTab === 'user' ? 'text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
      >
        {activeTab === 'user' && (
          <motion.div
            layoutId="active-tab-glow"
            className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full shadow-lg shadow-rose-200 dark:shadow-none"
            transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
          />
        )}
        <span className="relative z-10">Client Access</span>
      </button>
      <button
        onClick={() => onTabChange('admin')}
        className={`relative flex-1 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
          activeTab === 'admin' ? 'text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
      >
        {activeTab === 'admin' && (
          <motion.div
            layoutId="active-tab-glow"
            className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-full shadow-lg"
            transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
          />
        )}
        <span className="relative z-10">Management</span>
      </button>
    </div>
  );
};

export default ToggleTabs;
