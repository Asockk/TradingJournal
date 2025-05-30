import React from 'react';
import { getFieldStyle } from '../../utils/formUtils';
import FavoriteButton from '../favorites/FavoriteButton';
import FavoritesSelector from '../favorites/FavoritesSelector';

const QuickEntryForm = ({ currentTrade, handleInputChange, setCurrentTrade, setIsQuickMode }) => {
  // Favoriten-Handler
  const handleSelectFavorite = (fieldName, value) => {
    setCurrentTrade(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-white rounded-lg p-4 border border-blue-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asset <span className="text-amber-500">*</span>
            </label>
            <FavoriteButton 
              category="assets"
              item={currentTrade.asset}
              size={14}
            />
          </div>
          <input
            type="text"
            name="asset"
            value={currentTrade.asset}
            onChange={handleInputChange}
            className={getFieldStyle('asset', currentTrade, true)}
            placeholder="z.B. BTC, ETH, AAPL"
            required
          />
          <FavoritesSelector 
            category="assets" 
            onSelect={(value) => handleSelectFavorite('asset', value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position <span className="text-amber-500">*</span>
          </label>
          <div className="flex">
            <button
              type="button"
              className={`flex-1 p-2 rounded-l-md border border-r-0 ${
                currentTrade.position === 'Long'
                ? 'bg-green-100 text-green-700 border-green-300 font-medium'
                : 'bg-white text-gray-500 border-gray-300 hover:bg-green-50'
              }`}
              onClick={() => setCurrentTrade(prev => ({ ...prev, position: 'Long' }))}
            >
              Long
            </button>
            <button
              type="button"
              className={`flex-1 p-2 rounded-r-md border ${
                currentTrade.position === 'Short'
                ? 'bg-red-100 text-red-700 border-red-300 font-medium'
                : 'bg-white text-gray-500 border-gray-300 hover:bg-red-50'
              }`}
              onClick={() => setCurrentTrade(prev => ({ ...prev, position: 'Short' }))}
            >
              Short
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Einstiegskurs <span className="text-amber-500">*</span>
          </label>
          <input
            type="number"
            name="entryPrice"
            step="0.000001"
            value={currentTrade.entryPrice}
            onChange={handleInputChange}
            className={getFieldStyle('entryPrice', currentTrade, true)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Positionsgröße <span className="text-amber-500">*</span>
          </label>
          <input
            type="number"
            name="positionSize"
            step="0.01"
            value={currentTrade.positionSize}
            onChange={handleInputChange}
            className={getFieldStyle('positionSize', currentTrade, true)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entry-Datum
          </label>
          <input
            type="date"
            name="entryDate"
            value={currentTrade.entryDate || new Date().toISOString().split('T')[0]}
            onChange={handleInputChange}
            className={getFieldStyle('entryDate', currentTrade)}
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trade-Typ
            </label>
            <FavoriteButton 
              category="tradeTypes"
              item={currentTrade.tradeType}
              size={14}
            />
          </div>
          <select
            name="tradeType"
            value={currentTrade.tradeType}
            onChange={handleInputChange}
            className={getFieldStyle('tradeType', currentTrade)}
          >
            <option value="Trend-Following">Trend-Following</option>
            <option value="Mean-Reversion">Mean-Reversion</option>
            <option value="Breakout">Breakout</option>
            <option value="News">News-basiert</option>
            <option value="Technical">Technische Analyse</option>
            <option value="Fundamental">Fundamental</option>
            <option value="Other">Sonstige</option>
          </select>
          <FavoritesSelector 
            category="tradeTypes" 
            onSelect={(value) => handleSelectFavorite('tradeType', value)}
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-between border-t border-blue-100 pt-4">
        <div className="bg-amber-50 text-amber-700 text-sm px-3 py-1 rounded-md">
          <span className="text-amber-500">*</span> Pflichtfelder für Schnelleingabe
        </div>
        <button
          type="button"
          className="px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors"
          onClick={() => setIsQuickMode(false)}
        >
          Zu detaillierter Ansicht wechseln
        </button>
      </div>
    </div>
  );
};

export default QuickEntryForm;