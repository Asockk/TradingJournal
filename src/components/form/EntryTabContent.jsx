// src/components/form/EntryTabContent.jsx
import React from 'react';
import { getFieldStyle } from '../../utils/formUtils';
import EmotionSelector from './EmotionSelector';
import FavoriteButton from '../favorites/FavoriteButton';
import FavoritesSelector from '../favorites/FavoritesSelector';
import WinProbabilityInput from './WinProbabilityInput';
import { predictWinProbability } from '../../utils/winProbabilityPredictor';

const EntryTabContent = ({ 
  currentTrade, 
  handleInputChange, 
  setCurrentTrade,
  allTrades = []
}) => {
  // Handle favorit selection
  const handleSelectFavorite = (fieldName, value) => {
    setCurrentTrade(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Handle auto-suggest for win probability
  const handleAutoSuggestWinProbability = () => {
    const predictedValue = predictWinProbability(allTrades, currentTrade);
    setCurrentTrade(prev => ({
      ...prev,
      winProbability: predictedValue
    }));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 bg-blue-50/30 rounded-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entry-Datum <span className="text-amber-500">*</span>
          </label>
          <input
            type="date"
            name="entryDate"
            value={currentTrade.entryDate}
            onChange={handleInputChange}
            className={getFieldStyle('entryDate', currentTrade, true)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entry-Uhrzeit
          </label>
          <input
            type="time"
            name="entryTime"
            value={currentTrade.entryTime}
            onChange={handleInputChange}
            className={getFieldStyle('entryTime', currentTrade)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position <span className="text-amber-500">*</span>
          </label>
          <div className="relative">
            <select
              name="position"
              value={currentTrade.position}
              onChange={handleInputChange}
              className={getFieldStyle('position', currentTrade, true)}
              required
            >
              <option value="Long">Long</option>
              <option value="Short">Short</option>
            </select>
            <div className={`absolute inset-y-0 left-0 w-1 rounded-l-md ${currentTrade.position === 'Long' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
        </div>
        
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
          <div className="relative">
            <input
              type="text"
              name="asset"
              value={currentTrade.asset}
              onChange={handleInputChange}
              className={getFieldStyle('asset', currentTrade, true)}
              placeholder="z.B. BTC, ETH, AAPL"
              required
            />
          </div>
          <FavoritesSelector 
            category="assets" 
            onSelect={(value) => handleSelectFavorite('asset', value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asset-Klasse
            </label>
            <FavoriteButton 
              category="assetClasses"
              item={currentTrade.assetClass}
              size={14}
            />
          </div>
          <select
            name="assetClass"
            value={currentTrade.assetClass}
            onChange={handleInputChange}
            className={getFieldStyle('assetClass', currentTrade)}
          >
            <option value="Crypto">Crypto</option>
            <option value="Aktien">Aktien</option>
            <option value="Forex">Forex</option>
            <option value="Rohstoffe">Rohstoffe</option>
          </select>
          <FavoritesSelector 
            category="assetClasses" 
            onSelect={(value) => handleSelectFavorite('assetClass', value)}
            className="mt-1"
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
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marktbedingungen
          </label>
          <select
            name="marketCondition"
            value={currentTrade.marketCondition}
            onChange={handleInputChange}
            className={getFieldStyle('marketCondition', currentTrade)}
          >
            <option value="Bullish">Bullish</option>
            <option value="Bearish">Bearish</option>
            <option value="Ranging">Seitwärts</option>
            <option value="High-Volatility">Hoch Volatil</option>
            <option value="Low-Volatility">Niedrig Volatil</option>
            <option value="Neutral">Neutral</option>
          </select>
        </div>
        
        <div className="lg:col-span-2">
          <EmotionSelector
            value={currentTrade.preTradeEmotion}
            onChange={(value) => setCurrentTrade(prev => ({ ...prev, preTradeEmotion: value }))}
            type="pre"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Überzeugung (1-5)
          </label>
          <input
            type="range"
            name="conviction"
            min="1"
            max="5"
            value={currentTrade.conviction}
            onChange={handleInputChange}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hebel
          </label>
          <input
            type="number"
            name="leverage"
            min="1"
            step="0.1"
            value={currentTrade.leverage}
            onChange={handleInputChange}
            className={getFieldStyle('leverage', currentTrade)}
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
            Währung
          </label>
          <select
            name="currency"
            value={currentTrade.currency}
            onChange={handleInputChange}
            className={getFieldStyle('currency', currentTrade)}
          >
            <option value="€">EUR (€)</option>
            <option value="$">USD ($)</option>
            <option value="£">GBP (£)</option>
          </select>
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
            Stop Loss
          </label>
          <div className={`relative ${currentTrade.position === 'Long' ? 'group' : ''}`}>
            <input
              type="number"
              name="stopLoss"
              step="0.000001"
              value={currentTrade.stopLoss}
              onChange={handleInputChange}
              className={getFieldStyle('stopLoss', currentTrade)}
            />
            {currentTrade.position === 'Long' && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition bg-red-50 text-red-500 text-xs px-1 py-0.5 rounded">
                Unter Entry
              </div>
            )}
            {currentTrade.position === 'Short' && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition bg-red-50 text-red-500 text-xs px-1 py-0.5 rounded">
                Über Entry
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Take Profit
          </label>
          <div className={`relative ${currentTrade.position === 'Long' ? 'group' : ''}`}>
            <input
              type="number"
              name="takeProfit"
              step="0.000001"
              value={currentTrade.takeProfit}
              onChange={handleInputChange}
              className={getFieldStyle('takeProfit', currentTrade)}
            />
            {currentTrade.position === 'Long' && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition bg-green-50 text-green-500 text-xs px-1 py-0.5 rounded">
                Über Entry
              </div>
            )}
            {currentTrade.position === 'Short' && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition bg-green-50 text-green-500 text-xs px-1 py-0.5 rounded">
                Unter Entry
              </div>
            )}
          </div>
        </div>
        
        {/* Win Probability Input - Now passing the expectedValue */}
        <div className="lg:col-span-3">
          <WinProbabilityInput
            value={currentTrade.winProbability || 50}
            onChange={(value) => setCurrentTrade(prev => ({ ...prev, winProbability: value }))}
            onAutoSuggest={handleAutoSuggestWinProbability}
            hasHistoricalData={allTrades && allTrades.length >= 10}
            expectedValue={currentTrade.expectedValue} // Pass the expected value for correct EV indication
          />
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            Risk/Reward bei Entry
            <span className="ml-1 px-1 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">Berechnet</span>
          </label>
          <input
            type="number"
            name="entryRiskReward"
            step="0.01"
            value={currentTrade.entryRiskReward}
            readOnly
            className={getFieldStyle('entryRiskReward', currentTrade, false, true)}
          />
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            Erwarteter Gewinn/Verlust
            <span className="ml-1 px-1 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">Berechnet</span>
          </label>
          <input
            type="number"
            name="expectedPnL"
            step="0.01"
            value={currentTrade.expectedPnL}
            readOnly
            className={getFieldStyle('expectedPnL', currentTrade, false, true)}
          />
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            Erwartungswert (EV)
            <span className="ml-1 px-1 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">Berechnet</span>
          </label>
          <input
            type="number"
            name="expectedValue"
            step="0.01"
            value={currentTrade.expectedValue}
            readOnly
            className={`w-full p-2 border rounded-md ${
              parseFloat(currentTrade.expectedValue) > 0 
                ? 'bg-green-50 text-green-700 border-green-300' 
                : parseFloat(currentTrade.expectedValue) < 0 
                  ? 'bg-red-50 text-red-700 border-red-300' 
                  : 'bg-gray-50 border-gray-300'
            }`}
          />
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            R-Multiple
            <span className="ml-1 px-1 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">Berechnet</span>
          </label>
          <input
            type="number"
            name="rMultiple"
            step="0.01"
            value={currentTrade.rMultiple}
            readOnly
            className={`w-full p-2 border rounded-md ${
              parseFloat(currentTrade.rMultiple) > 0 
                ? 'bg-green-50 text-green-700 border-green-300' 
                : parseFloat(currentTrade.rMultiple) < 0 
                  ? 'bg-red-50 text-red-700 border-red-300' 
                  : 'bg-gray-50 border-gray-300'
            }`}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trade-Plan (vor Einstieg)
            </label>
            <textarea
              name="tradePlan"
              value={currentTrade.tradePlan}
              onChange={handleInputChange}
              className={getFieldStyle('tradePlan', currentTrade)}
              rows="3"
              placeholder="Detaillierter Plan für diesen Trade inkl. Setup, Risikomanagement..."
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ausstiegskriterien
            </label>
            <textarea
              name="exitCriteria"
              value={currentTrade.exitCriteria}
              onChange={handleInputChange}
              className={getFieldStyle('exitCriteria', currentTrade)}
              rows="3"
              placeholder="Konkrete Bedingungen, unter denen der Trade beendet wird..."
            ></textarea>
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500 bg-amber-50 p-2 rounded">
        <span className="text-amber-500">*</span> Pflichtfelder
      </div>
    </>
  );
};

export default EntryTabContent;