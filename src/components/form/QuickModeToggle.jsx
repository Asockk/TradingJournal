import React from 'react';

const QuickModeToggle = ({ isQuickMode, setIsQuickMode }) => (
  <div className="flex flex-col sm:flex-row sm:items-center mb-4 bg-gray-50 p-2 rounded-lg border border-gray-200">
    <span className="mr-2 text-sm font-medium text-gray-700 mb-2 sm:mb-0">Eingabemodus:</span>
    <div className="flex border border-gray-300 rounded-md overflow-hidden shadow-sm">
      <button
        type="button"
        className={`flex-1 px-3 py-2 text-sm transition-colors ${
          !isQuickMode 
            ? 'bg-blue-600 text-white font-medium' 
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => setIsQuickMode(false)}
      >
        <span className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          Detailliert
        </span>
      </button>
      <button
        type="button"
        className={`flex-1 px-3 py-2 text-sm transition-colors ${
          isQuickMode 
            ? 'bg-blue-600 text-white font-medium' 
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => setIsQuickMode(true)}
      >
        <span className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Schnelleingabe
        </span>
      </button>
    </div>
  </div>
);

export default QuickModeToggle;