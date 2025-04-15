import React from 'react';

const TabButton = ({ tab, label, activeTab, onClick }) => (
  <button
    type="button"
    className={`px-4 py-2 font-medium rounded-t-md transition-colors ${
      activeTab === tab 
        ? 'bg-white border-t-2 border-l-2 border-r-2 border-blue-500 text-blue-600 shadow-sm' 
        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border-transparent border-t-2 border-l-2 border-r-2'
    }`}
    onClick={() => onClick(tab)}
  >
    {label}
  </button>
);

export default TabButton;