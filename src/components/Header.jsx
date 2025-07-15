import React, { useState } from 'react';
import { Upload, Download, Database } from 'lucide-react';
import { importCSV, exportCSV } from '../utils/csvUtils';
import ExchangeImportModal from './ExchangeImportModal';
import ThemeToggle from './ThemeToggle';

const Header = ({ onImport, trades }) => {
  const [isExchangeImportOpen, setIsExchangeImportOpen] = useState(false);

  const handleImportClick = (e) => {
    const file = e.target.files[0];
    if (file) {
      importCSV(file, onImport);
    }
  };

  const handleExportClick = () => {
    exportCSV(trades);
  };

  const handleExchangeImport = (importedTrades) => {
    // This will add the imported trades to the existing ones
    onImport(importedTrades);
  };

  return (
    <>
      <header className="bg-gray-900 dark:bg-dark-surface text-white p-4 md:p-6 transition-colors">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">Trading Journal</h1>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <div className="h-6 w-px bg-gray-600 mx-1" />
            <button
              onClick={() => setIsExchangeImportOpen(true)}
              className="bg-gray-700 dark:bg-gray-800 p-2 rounded-md flex items-center hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
              title="Exchange-Daten importieren"
            >
              <Database size={20} />
            </button>
            <label htmlFor="csv-import" className="cursor-pointer bg-gray-700 dark:bg-gray-800 p-2 rounded-md hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors">
              <Upload size={20} />
              <input 
                id="csv-import" 
                type="file" 
                accept=".csv" 
                className="hidden" 
                onChange={handleImportClick} 
              />
            </label>
            <button 
              onClick={handleExportClick}
              className="bg-gray-700 dark:bg-gray-800 p-2 rounded-md hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
              title="Export als CSV"
            >
              <Download size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Exchange Import Modal */}
      <ExchangeImportModal
        isOpen={isExchangeImportOpen}
        onClose={() => setIsExchangeImportOpen(false)}
        existingTrades={trades}
        onImportComplete={handleExchangeImport}
      />
    </>
  );
};

export default Header;