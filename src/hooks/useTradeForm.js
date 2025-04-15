import { useState, useEffect } from 'react';
import { calculateDuration, calculateExpectedPnL, calculateEntryRiskReward, 
         calculatePnL, calculateActualRiskReward } from '../utils/calculations';

export const useTradeForm = (initialTrade, onSubmit, onClose, isEditing) => {
  const [currentTrade, setCurrentTrade] = useState({
    ...initialTrade,
    // Default-Werte für neue Alpha Trader Felder
    tradePlan: initialTrade.tradePlan || '',
    exitCriteria: initialTrade.exitCriteria || '',
    preTradeEmotion: initialTrade.preTradeEmotion || 3,
    postTradeEmotion: initialTrade.postTradeEmotion || 3,
    followedPlan: initialTrade.followedPlan !== undefined ? initialTrade.followedPlan : true,
    marketCondition: initialTrade.marketCondition || 'Neutral',
    tradeType: initialTrade.tradeType || 'Other',
    whatWorked: initialTrade.whatWorked || '',
    whatDidntWork: initialTrade.whatDidntWork || '',
    wouldTakeAgain: initialTrade.wouldTakeAgain !== undefined ? initialTrade.wouldTakeAgain : true
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
  
  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(currentTrade);
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

  return {
    currentTrade,
    setCurrentTrade,
    activeTab,
    setActiveTab,
    isQuickMode,
    setIsQuickMode,
    handleInputChange,
    handleSubmit
  };
};