import React from 'react';
import { getFieldStyle, EmotionButton } from '../../utils/formUtils';

const ExitTabContent = ({ currentTrade, handleInputChange, setCurrentTrade }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 bg-red-50/20 rounded-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Exit-Datum
        </label>
        <input
          type="date"
          name="exitDate"
          value={currentTrade.exitDate}
          onChange={handleInputChange}
          className={getFieldStyle('exitDate', currentTrade)}
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
          className={getFieldStyle('exitTime', currentTrade)}
        />
      </div>
      
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Dauer (Tage)
          <span className="ml-1 px-1 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">Berechnet</span>
        </label>
        <input
          type="number"
          name="duration"
          value={currentTrade.duration}
          readOnly
          className={getFieldStyle('duration', currentTrade, false, true)}
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
          className={getFieldStyle('exitPrice', currentTrade)}
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
          className={getFieldStyle('fees', currentTrade)}
        />
      </div>
      
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Profit/Loss
          <span className="ml-1 px-1 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">Berechnet</span>
        </label>
        <div className="relative">
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
          {parseFloat(currentTrade.pnl) > 0 && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500">+</div>
          )}
        </div>
      </div>
      
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Actual Risk/Reward
          <span className="ml-1 px-1 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">Berechnet</span>
        </label>
        <input
          type="number"
          name="actualRiskReward"
          step="0.01"
          value={currentTrade.actualRiskReward}
          readOnly
          className={getFieldStyle('actualRiskReward', currentTrade, false, true)}
        />
      </div>
      
      <div className="lg:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Emotionaler Zustand (nach Trade)
        </label>
        <div className="flex flex-wrap gap-2">
          <EmotionButton 
            value={1}
            currentValue={currentTrade.postTradeEmotion}
            onClick={() => setCurrentTrade(prev => ({ ...prev, postTradeEmotion: 1 }))}
            emoji="😠"
            label="Frustriert"
            colorClass="bg-red-100 text-red-800"
          />
          <EmotionButton 
            value={2}
            currentValue={currentTrade.postTradeEmotion}
            onClick={() => setCurrentTrade(prev => ({ ...prev, postTradeEmotion: 2 }))}
            emoji="😕"
            label="Unzufrieden"
            colorClass="bg-orange-100 text-orange-800"
          />
          <EmotionButton 
            value={3}
            currentValue={currentTrade.postTradeEmotion}
            onClick={() => setCurrentTrade(prev => ({ ...prev, postTradeEmotion: 3 }))}
            emoji="😐"
            label="Neutral"
            colorClass="bg-yellow-100 text-yellow-800"
          />
          <EmotionButton 
            value={4}
            currentValue={currentTrade.postTradeEmotion}
            onClick={() => setCurrentTrade(prev => ({ ...prev, postTradeEmotion: 4 }))}
            emoji="🙂"
            label="Zufrieden"
            colorClass="bg-blue-100 text-blue-800"
          />
          <EmotionButton 
            value={5}
            currentValue={currentTrade.postTradeEmotion}
            onClick={() => setCurrentTrade(prev => ({ ...prev, postTradeEmotion: 5 }))}
            emoji="😁"
            label="Euphorisch"
            colorClass="bg-green-100 text-green-800"
          />
        </div>
      </div>
    </div>
  );
};

export default ExitTabContent;