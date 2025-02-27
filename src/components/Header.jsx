import React from 'react';
import { Upload, Download } from 'lucide-react';
import { importCSV, exportCSV } from '../utils/csvUtils';

const Header = ({ onImport, trades }) => {
  const handleImportClick = (e) => {
    const file = e.target.files[0];
    if (file) {
      importCSV(file, onImport);
    }
  };

  const handleExportClick = () => {
    exportCSV(trades);
  };

  return (
    <header className="bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">Trading Journal</h1>
        <div className="flex space-x-2">
          <label htmlFor="csv-import" className="cursor-pointer bg-gray-700 p-2 rounded-md">
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
            className="bg-gray-700 p-2 rounded-md"
            title="Export als CSV"
          >
            <Download size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;