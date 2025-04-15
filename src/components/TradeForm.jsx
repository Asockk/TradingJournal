import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { calculateDuration, calculateExpectedPnL, calculateEntryRiskReward, 
         calculatePnL, calculateActualRiskReward } from '../utils/calculations';

const TradeForm = ({ trade, onClose, onSubmit, isEditing }) => {
  const [currentTrade, setCurrentTrade] = useState({
    ...trade,
    // Default-Werte für neue Alpha Trader Felder
    tradePlan: trade.tradePlan || '',
    exitCriteria: trade.exitCriteria || '',
    preTradeEmotion: trade.preTradeEmotion || 3,
    postTradeEmotion: trade.postTradeEmotion || 3,
    followedPlan: trade.followedPlan !== undefined ? trade.followedPlan : true,
    marketCondition: trade.marketCondition || 'Neutral',
    tradeType: trade.tradeType || 'Other',
    whatWorked: trade.whatWorked || '',
    whatDidntWork: trade.whatDidntWork || '',
    wouldTakeAgain: trade.wouldTakeAgain !== undefined ? trade.wouldTakeAgain : true
  });
  
  // State für Tabs und Schnelleingabe-Modus
  const [activeTab, setActiveTab] = useState('entry');
  const [isQuickMode, setIsQuickMode] = useState(false);

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentTrade(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
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

  // Tab-Button-Komponente für sauberen Code
  const TabButton = ({ tab, label }) => (
    <button
      type="button"
      className={`px-4 py-2 font-medium rounded-t-md ${
        activeTab === tab 
          ? 'bg-white border-b-2 border-blue-500 text-blue-600' 
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
      onClick={() => setActiveTab(tab)}
    >
      {label}
    </button>
  );

  // Schnelleingabe-Toggle
  const QuickModeToggle = () => (
    <div className="flex items-center mb-4">
      <span className="mr-2 text-sm text-gray-600">Modus:</span>
      <button
        type="button"
        className={`px-3 py-1 text-sm rounded-l-md ${
          !isQuickMode 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={() => setIsQuickMode(false)}
      >
        Detailliert
      </button>
      <button
        type="button"
        className={`px-3 py-1 text-sm rounded-r-md ${
          isQuickMode 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={() => setIsQuickMode(true)}
      >
        Schnelleingabe
      </button>
    </div>
  );

  // Schnelleingabe-Formular
  const QuickEntryForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Asset *
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
          Position *
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
          Einstiegskurs *
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
          Positionsgröße *
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
          Entry-Datum
        </label>
        <input
          type="date"
          name="entryDate"
          value={currentTrade.entryDate}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
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
      
      <div className="md:col-span-2 text-right mt-4">
        <p className="text-sm text-gray-500 mb-2">
          * Pflichtfelder für Schnelleingabe
        </p>
        <button
          type="button"
          className="px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-md bg-blue-50 hover:bg-blue-100 mr-2"
          onClick={() => setIsQuickMode(false)}
        >
          Zu detaillierter Ansicht wechseln
        </button>
      </div>
    </div>
  );

  // Entry Tab Inhalt
  const EntryTabContent = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            Trade-Typ
          </label>
          <select
            name="tradeType"
            value={currentTrade.tradeType}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Trend-Following">Trend-Following</option>
            <option value="Mean-Reversion">Mean-Reversion</option>
            <option value="Breakout">Breakout</option>
            <option value="News">News-basiert</option>
            <option value="Technical">Technische Analyse</option>
            <option value="Fundamental">Fundamental</option>
            <option value="Other">Sonstige</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marktbedingungen
          </label>
          <select
            name="marketCondition"
            value={currentTrade.marketCondition}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emotionaler Zustand (vor Trade)
          </label>
          <div className="flex flex-wrap gap-2">
            <button 
              type="button"
              className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs cursor-pointer transition-colors ${currentTrade.preTradeEmotion == 1 ? 'bg-red-100 text-red-800 font-medium' : 'bg-gray-50 text-gray-700 hover:bg-red-50'}`}
              onClick={() => setCurrentTrade(prev => ({ ...prev, preTradeEmotion: 1 }))}
            >
              <span className="text-base">😰</span>
              <span>Ängstlich</span>
            </button>
            <button 
              type="button"
              className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs cursor-pointer transition-colors ${currentTrade.preTradeEmotion == 2 ? 'bg-orange-100 text-orange-800 font-medium' : 'bg-gray-50 text-gray-700 hover:bg-orange-50'}`}
              onClick={() => setCurrentTrade(prev => ({ ...prev, preTradeEmotion: 2 }))}
            >
              <span className="text-base">😟</span>
              <span>Unsicher</span>
            </button>
            <button 
              type="button"
              className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs cursor-pointer transition-colors ${currentTrade.preTradeEmotion == 3 ? 'bg-yellow-100 text-yellow-800 font-medium' : 'bg-gray-50 text-gray-700 hover:bg-yellow-50'}`}
              onClick={() => setCurrentTrade(prev => ({ ...prev, preTradeEmotion: 3 }))}
            >
              <span className="text-base">😐</span>
              <span>Neutral</span>
            </button>
            <button 
              type="button"
              className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs cursor-pointer transition-colors ${currentTrade.preTradeEmotion == 4 ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-gray-50 text-gray-700 hover:bg-blue-50'}`}
              onClick={() => setCurrentTrade(prev => ({ ...prev, preTradeEmotion: 4 }))}
            >
              <span className="text-base">🙂</span>
              <span>Sicher</span>
            </button>
            <button 
              type="button"
              className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs cursor-pointer transition-colors ${currentTrade.preTradeEmotion == 5 ? 'bg-green-100 text-green-800 font-medium' : 'bg-gray-50 text-gray-700 hover:bg-green-50'}`}
              onClick={() => setCurrentTrade(prev => ({ ...prev, preTradeEmotion: 5 }))}
            >
              <span className="text-base">😄</span>
              <span>Übermütig</span>
            </button>
          </div>
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
              className="w-full p-2 border border-gray-300 rounded-md"
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
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
              placeholder="Konkrete Bedingungen, unter denen der Trade beendet wird..."
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );

  // Exit Tab Inhalt
  const ExitTabContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      
      <div className="lg:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Emotionaler Zustand (nach Trade)
        </label>
        <div className="flex flex-wrap gap-2">
          <button 
            type="button"
            className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs cursor-pointer transition-colors ${currentTrade.postTradeEmotion == 1 ? 'bg-red-100 text-red-800 font-medium' : 'bg-gray-50 text-gray-700 hover:bg-red-50'}`}
            onClick={() => setCurrentTrade(prev => ({ ...prev, postTradeEmotion: 1 }))}
          >
            <span className="text-base">😠</span>
            <span>Frustriert</span>
          </button>
          <button 
            type="button"
            className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs cursor-pointer transition-colors ${currentTrade.postTradeEmotion == 2 ? 'bg-orange-100 text-orange-800 font-medium' : 'bg-gray-50 text-gray-700 hover:bg-orange-50'}`}
            onClick={() => setCurrentTrade(prev => ({ ...prev, postTradeEmotion: 2 }))}
          >
            <span className="text-base">😕</span>
            <span>Unzufrieden</span>
          </button>
          <button 
            type="button"
            className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs cursor-pointer transition-colors ${currentTrade.postTradeEmotion == 3 ? 'bg-yellow-100 text-yellow-800 font-medium' : 'bg-gray-50 text-gray-700 hover:bg-yellow-50'}`}
            onClick={() => setCurrentTrade(prev => ({ ...prev, postTradeEmotion: 3 }))}
          >
            <span className="text-base">😐</span>
            <span>Neutral</span>
          </button>
          <button 
            type="button"
            className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs cursor-pointer transition-colors ${currentTrade.postTradeEmotion == 4 ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-gray-50 text-gray-700 hover:bg-blue-50'}`}
            onClick={() => setCurrentTrade(prev => ({ ...prev, postTradeEmotion: 4 }))}
          >
            <span className="text-base">🙂</span>
            <span>Zufrieden</span>
          </button>
          <button 
            type="button"
            className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs cursor-pointer transition-colors ${currentTrade.postTradeEmotion == 5 ? 'bg-green-100 text-green-800 font-medium' : 'bg-gray-50 text-gray-700 hover:bg-green-50'}`}
            onClick={() => setCurrentTrade(prev => ({ ...prev, postTradeEmotion: 5 }))}
          >
            <span className="text-base">😁</span>
            <span>Euphorisch</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Analyse Tab Inhalt
  const AnalysisTabContent = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center">
          <label className="text-sm font-medium text-gray-700 mr-2">
            Habe ich den Plan befolgt?
          </label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="followedPlan"
                checked={currentTrade.followedPlan === true}
                onChange={() => setCurrentTrade(prev => ({ ...prev, followedPlan: true }))}
                className="mr-1"
              />
              <span>Ja</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="followedPlan"
                checked={currentTrade.followedPlan === false}
                onChange={() => setCurrentTrade(prev => ({ ...prev, followedPlan: false }))}
                className="mr-1"
              />
              <span>Nein</span>
            </label>
          </div>
        </div>
        
        <div className="flex items-center">
          <label className="text-sm font-medium text-gray-700 mr-2">
            Würde ich diesen Trade wieder machen?
          </label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="wouldTakeAgain"
                checked={currentTrade.wouldTakeAgain === true}
                onChange={() => setCurrentTrade(prev => ({ ...prev, wouldTakeAgain: true }))}
                className="mr-1"
              />
              <span>Ja</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="wouldTakeAgain"
                checked={currentTrade.wouldTakeAgain === false}
                onChange={() => setCurrentTrade(prev => ({ ...prev, wouldTakeAgain: false }))}
                className="mr-1"
              />
              <span>Nein</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Was hat funktioniert?
          </label>
          <textarea
            name="whatWorked"
            value={currentTrade.whatWorked}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="2"
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Was hat nicht funktioniert?
          </label>
          <textarea
            name="whatDidntWork"
            value={currentTrade.whatDidntWork}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="2"
          ></textarea>
        </div>
      </div>
      
      <div className="mt-4">
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
      
      <div className="mt-4">
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
  );

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
          {/* Modustoggle (Schnell vs. Detailliert) */}
          <QuickModeToggle />
          
          {/* Zeige Schnellmodus oder Tab-Modus */}
          {isQuickMode ? (
            <QuickEntryForm />
          ) : (
            <>
              {/* Tab-Navigation */}
              <div className="flex border-b mb-4">
                <TabButton tab="entry" label="Entry" />
                <TabButton tab="exit" label="Exit" />
                <TabButton tab="analysis" label="Analyse" />
              </div>
              
              {/* Tab-Inhalte */}
              {activeTab === 'entry' && <EntryTabContent />}
              {activeTab === 'exit' && <ExitTabContent />}
              {activeTab === 'analysis' && <AnalysisTabContent />}
            </>
          )}
          
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