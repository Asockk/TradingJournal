import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { calculateDuration, calculateExpectedPnL, calculateEntryRiskReward, 
         calculatePnL, calculateActualRiskReward } from '../utils/calculations';

const TradeForm = ({ trade, onClose, onSubmit, isEditing }) => {
  const [currentTrade, setCurrentTrade] = useState(trade);

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTrade(prev => ({ ...prev, [name]: value }));
  };

  // Calculated fields
  useEffect(() => {
    const newTrade = { ...currentTrade };
    
    // Calculate duration if we have both entry and exit dates
    if (currentTrade.entryDate && currentTrade.exitDate) {
      newTrade.duration = calculateDuration(currentTrade.entryDate, currentTrade.exitDate);
    }
    
    // Calculate expected PnL
    if (currentTrade.entryPrice && currentTrade.takeProfit && currentTrade.positionSize) {
      newTrade.expectedPnL = calculateExpectedPnL(
        currentTrade.entryPrice,
        currentTrade.takeProfit,
        currentTrade.positionSize,
        currentTrade.position,
        currentTrade.leverage
      );
    }
    
    // Calculate entry risk/reward ratio
    if (currentTrade.entryPrice && currentTrade.takeProfit && currentTrade.stopLoss) {
      newTrade.entryRiskReward = calculateEntryRiskReward(
        currentTrade.entryPrice,
        currentTrade.takeProfit,
        currentTrade.stopLoss,
        currentTrade.position
      );
    }
    
    // Calculate actual PnL
    if (currentTrade.entryPrice && currentTrade.exitPrice && currentTrade.positionSize) {
      newTrade.pnl = calculatePnL(
        currentTrade.entryPrice,
        currentTrade.exitPrice,
        currentTrade.positionSize,
        currentTrade.position,
        currentTrade.leverage,
        currentTrade.fees
      );
    }
    
    // Calculate actual risk/reward ratio
    if (currentTrade.pnl && currentTrade.entryPrice && currentTrade.stopLoss && 
        currentTrade.positionSize && currentTrade.leverage) {
      newTrade.actualRiskReward = calculateActualRiskReward(
        currentTrade.entryPrice,
        currentTrade.stopLoss,
        currentTrade.pnl,
        currentTrade.positionSize,
        currentTrade.position,
        currentTrade.leverage
      );
    }
    
    if (JSON.stringify(currentTrade) !== JSON.stringify(newTrade)) {
      setCurrentTrade(newTrade);
    }
  }, [
    currentTrade.entryDate, 
    currentTrade.exitDate,
    currentTrade.entryPrice,
    currentTrade.takeProfit,
    currentTrade.stopLoss,
    currentTrade.positionSize,
    currentTrade.exitPrice,
    currentTrade.fees,
    currentTrade.position,
    currentTrade.leverage
  ]);

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(currentTrade);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-start pt-4 pb-20">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-full overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Trade bearbeiten' : 'Neuer Trade'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Entry Details */}
            <div className="md:col-span-2 lg:col-span-3 border-b pb-2 mb-2">
              <h3 className="font-medium mb-2">Entry-Details</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entry-Datum
              </label>
              <input
                type="date"
                name="entryDate"
                value={currentTrade.entryDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
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
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <select
                name="position"
                value={currentTrade.position}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="Long">Long</option>
                <option value="Short">Short</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset
              </label>
              <input
                type="text"
                name="asset"
                value={currentTrade.asset}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="z.B. BTC, ETH, AAPL"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset-Klasse
              </label>
              <select
                name="assetClass"
                value={currentTrade.assetClass}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Crypto">Crypto</option>
                <option value="Aktien">Aktien</option>
                <option value="Forex">Forex</option>
                <option value="Rohstoffe">Rohstoffe</option>
              </select>
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
                className="w-full"
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
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Positionsgröße
              </label>
              <input
                type="number"
                name="positionSize"
                step="0.01"
                value={currentTrade.positionSize}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
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
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="€">EUR (€)</option>
                <option value="$">USD ($)</option>
                <option value="£">GBP (£)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Einstiegskurs
              </label>
              <input
                type="number"
                name="entryPrice"
                step="0.000001"
                value={currentTrade.entryPrice}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stop Loss
              </label>
              <input
                type="number"
                name="stopLoss"
                step="0.000001"
                value={currentTrade.stopLoss}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Take Profit
              </label>
              <input
                type="number"
                name="takeProfit"
                step="0.000001"
                value={currentTrade.takeProfit}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Risk/Reward bei Entry
              </label>
              <input
                type="number"
                name="entryRiskReward"
                step="0.01"
                value={currentTrade.entryRiskReward}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Erwarteter Gewinn/Verlust
              </label>
              <input
                type="number"
                name="expectedPnL"
                step="0.01"
                value={currentTrade.expectedPnL}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Begründung (Rationale)
              </label>
              <textarea
                name="rationale"
                value={currentTrade.rationale}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="2"
              ></textarea>
            </div>
            
            {/* Exit Details */}
            <div className="md:col-span-2 lg:col-span-3 border-b pb-2 mb-2 mt-4">
              <h3 className="font-medium mb-2">Exit-Details</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exit-Datum
              </label>
              <input
                type="date"
                name="exitDate"
                value={currentTrade.exitDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exit-Uhrzeit
              </label>
              <input
                type="time"
                name="exitTime"
                value={currentTrade.exitTime}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dauer (Tage)
              </label>
              <input
                type="number"
                name="duration"
                value={currentTrade.duration}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exit-Kurs
              </label>
              <input
                type="number"
                name="exitPrice"
                step="0.000001"
                value={currentTrade.exitPrice}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gebühren
              </label>
              <input
                type="number"
                name="fees"
                step="0.01"
                value={currentTrade.fees}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profit/Loss
              </label>
              <input
                type="number"
                name="pnl"
                step="0.01"
                value={currentTrade.pnl}
                readOnly
                className={`w-full p-2 border rounded-md ${
                  parseFloat(currentTrade.pnl) > 0 
                    ? 'bg-green-50 text-green-700 border-green-300' 
                    : parseFloat(currentTrade.pnl) < 0 
                      ? 'bg-red-50 text-red-700 border-red-300' 
                      : 'bg-gray-50 border-gray-300'
                }`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actual Risk/Reward
              </label>
              <input
                type="number"
                name="actualRiskReward"
                step="0.01"
                value={currentTrade.actualRiskReward}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reassessment-Triggers
              </label>
              <textarea
                name="reassessmentTriggers"
                value={currentTrade.reassessmentTriggers}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="2"
              ></textarea>
            </div>
            
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notizen nach Trade-Abschluss
              </label>
              <textarea
                name="notes"
                value={currentTrade.notes}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              {isEditing ? 'Aktualisieren' : 'Speichern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeForm;