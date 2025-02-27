import React from 'react';

const FilterPanel = ({ filters, onFilterChange }) => {
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFilterChange({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md mb-4 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Asset
          </label>
          <input
            type="text"
            name="asset"
            value={filters.asset}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="z.B. BTC, ETH..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position
          </label>
          <select
            name="position"
            value={filters.position}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Alle</option>
            <option value="Long">Long</option>
            <option value="Short">Short</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Asset-Klasse
          </label>
          <select
            name="assetClass"
            value={filters.assetClass}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Alle</option>
            <option value="Crypto">Crypto</option>
            <option value="Aktien">Aktien</option>
            <option value="Forex">Forex</option>
            <option value="Rohstoffe">Rohstoffe</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Von Datum
          </label>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bis Datum
          </label>
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="flex gap-2 items-center mt-2">
          <label className="block text-sm text-gray-700">
            <input
              type="checkbox"
              name="profitOnly"
              checked={filters.profitOnly}
              onChange={handleFilterChange}
              className="mr-2"
            />
            Nur Gewinne
          </label>
          
          <label className="block text-sm text-gray-700">
            <input
              type="checkbox"
              name="lossOnly"
              checked={filters.lossOnly}
              onChange={handleFilterChange}
              className="mr-2"
            />
            Nur Verluste
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;