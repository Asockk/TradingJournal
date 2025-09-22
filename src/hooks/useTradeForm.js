// src/hooks/useTradeForm.js
import { useState, useEffect, useRef } from 'react';
import { 
  calculateDuration, 
  calculateExpectedPnL, 
  calculateEntryRiskReward, 
  calculatePnL, 
  calculateActualRiskReward,
  calculateExpectedValue,
  calculateRMultiple
} from '../utils/calculations';
import { validateTradeForm } from '../utils/formUtils';

/**
 * Custom hook for managing trade form state and calculations
 */
export const useTradeForm = (initialTrade, onSubmit, onClose, isEditing) => {
  const [currentTrade, setCurrentTrade] = useState({
    ...initialTrade,
    // Default values for Alpha Trader fields
    tradePlan: initialTrade.tradePlan || '',
    exitCriteria: initialTrade.exitCriteria || '',
    preTradeEmotion: initialTrade.preTradeEmotion || 3,
    postTradeEmotion: initialTrade.postTradeEmotion || 3,
    followedPlan: initialTrade.followedPlan !== undefined ? initialTrade.followedPlan : true,
    marketCondition: initialTrade.marketCondition || 'Neutral',
    tradeType: initialTrade.tradeType || 'Other',
    whatWorked: initialTrade.whatWorked || '',
    whatDidntWork: initialTrade.whatDidntWork || '',
    wouldTakeAgain: initialTrade.wouldTakeAgain !== undefined ? initialTrade.wouldTakeAgain : true,
    
    // Expected Value fields
    winProbability: initialTrade.winProbability || 50,
    expectedValue: initialTrade.expectedValue || '',
    rMultiple: initialTrade.rMultiple || ''
  });
  
  // State for tabs and quick mode
  const [activeTab, setActiveTab] = useState('entry');
  const [isQuickMode, setIsQuickMode] = useState(false);
  
  // Reference to form for keyboard focus
  const formRef = useRef(null);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentTrade(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form before submission
    const errors = validateTradeForm(currentTrade);
    if (Object.keys(errors).length > 0) {
      // Show first error as alert (in production, use proper error UI)
      const firstError = Object.values(errors)[0];
      alert(firstError);
      return;
    }
    
    onSubmit(currentTrade);
  };
  
  // Save and add new trade
  const handleSaveAndAddNew = (e) => {
    e.preventDefault();
    
    // Validate form before submission
    const errors = validateTradeForm(currentTrade);
    if (Object.keys(errors).length > 0) {
      // Show first error as alert (in production, use proper error UI)
      const firstError = Object.values(errors)[0];
      alert(firstError);
      return;
    }
    
    // Save existing trade
    onSubmit(currentTrade);
    
    // Reset form but keep some values for better UX
    setCurrentTrade({
      ...initialTrade,
      entryDate: new Date().toISOString().split('T')[0], // Today's date
      assetClass: currentTrade.assetClass, // Keep asset class
      currency: currentTrade.currency, // Keep currency
      position: currentTrade.position, // Keep position
      leverage: currentTrade.leverage, // Keep leverage
      marketCondition: currentTrade.marketCondition, // Keep market condition
      tradeType: currentTrade.tradeType, // Keep trade type
      preTradeEmotion: 3, // Neutral
      postTradeEmotion: 3, // Neutral
      followedPlan: undefined, // Reset to undefined (not auto-set)
      wouldTakeAgain: undefined, // Reset to undefined (not auto-set)
      winProbability: 50 // Reset to default
    });
    
    // Switch to entry tab and focus first input
    setActiveTab('entry');
    setIsQuickMode(false);
    
    // Focus the first input element (with timeout for DOM update)
    setTimeout(() => {
      if (formRef.current) {
        const firstInput = formRef.current.querySelector('input:not([readonly]), select, textarea');
        if (firstInput) firstInput.focus();
      }
    }, 100);
  };
  
  // Go to previous field (for mobile users)
  const goToPreviousField = () => {
    if (!formRef.current) return;
    
    // Find focused element
    const focusedElement = document.activeElement;
    
    // Find all form elements
    const formElements = Array.from(formRef.current.querySelectorAll(
      'input:not([type="hidden"]):not([readonly]), select, textarea'
    ));
    
    // Find index of current element
    const currentIndex = formElements.indexOf(focusedElement);
    
    // Focus previous element if possible
    if (currentIndex > 0) {
      formElements[currentIndex - 1].focus();
    }
  };
  
  // Keyboard shortcut handler
  const handleKeyboardShortcuts = (e) => {
    // Ctrl+Enter to save
    if (e.ctrlKey && e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
    
    // Ctrl+Shift+Enter to save and add new
    if (e.ctrlKey && e.shiftKey && e.key === 'Enter') {
      handleSaveAndAddNew(e);
    }
    
    // Tab navigation with Ctrl+arrows
    if (e.ctrlKey) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (activeTab === 'entry') setActiveTab('exit');
        else if (activeTab === 'exit') setActiveTab('analysis');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (activeTab === 'analysis') setActiveTab('exit');
        else if (activeTab === 'exit') setActiveTab('entry');
      }
    }
  };
  
  // Add/remove keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardShortcuts);
    return () => {
      window.removeEventListener('keydown', handleKeyboardShortcuts);
    };
  }, [activeTab]);

  // Calculate derived values when relevant inputs change
  useEffect(() => {
    const newTrade = { ...currentTrade };
    let hasChanges = false;
    
    // Calculate duration if we have both dates
    if (currentTrade.entryDate && currentTrade.exitDate) {
      const duration = calculateDuration(
        currentTrade.entryDate,
        currentTrade.exitDate,
        currentTrade.entryTime,
        currentTrade.exitTime
      );
      if (newTrade.duration !== duration) {
        newTrade.duration = duration;
        hasChanges = true;
      }
    }
    
    // Calculate expected PnL
    if (currentTrade.entryPrice && currentTrade.takeProfit && currentTrade.positionSize) {
      const expectedPnL = calculateExpectedPnL(
        currentTrade.entryPrice,
        currentTrade.takeProfit,
        currentTrade.positionSize,
        currentTrade.position,
        currentTrade.leverage
      );
      
      if (newTrade.expectedPnL !== expectedPnL) {
        newTrade.expectedPnL = expectedPnL;
        hasChanges = true;
      }
    }
    
    // Calculate entry risk/reward ratio
    if (currentTrade.entryPrice && currentTrade.takeProfit && currentTrade.stopLoss) {
      const entryRiskReward = calculateEntryRiskReward(
        currentTrade.entryPrice,
        currentTrade.takeProfit,
        currentTrade.stopLoss,
        currentTrade.position
      );
      
      if (newTrade.entryRiskReward !== entryRiskReward) {
        newTrade.entryRiskReward = entryRiskReward;
        hasChanges = true;
      }
    }
    
    // Calculate actual PnL
    if (currentTrade.entryPrice && currentTrade.exitPrice && currentTrade.positionSize) {
      const pnl = calculatePnL(
        currentTrade.entryPrice,
        currentTrade.exitPrice,
        currentTrade.positionSize,
        currentTrade.position,
        currentTrade.leverage,
        currentTrade.fees
      );
      
      if (newTrade.pnl !== pnl) {
        newTrade.pnl = pnl;
        hasChanges = true;
      }
    }
    
    // Calculate actual risk/reward ratio
    if (currentTrade.pnl && currentTrade.entryPrice && currentTrade.stopLoss && 
        currentTrade.positionSize && currentTrade.leverage) {
      const actualRiskReward = calculateActualRiskReward(
        currentTrade.entryPrice,
        currentTrade.stopLoss,
        currentTrade.pnl,
        currentTrade.positionSize,
        currentTrade.position,
        currentTrade.leverage
      );
      
      if (newTrade.actualRiskReward !== actualRiskReward) {
        newTrade.actualRiskReward = actualRiskReward;
        hasChanges = true;
      }
    }
    
    // Calculate expected value
    if (currentTrade.entryPrice && currentTrade.takeProfit && 
        currentTrade.stopLoss && currentTrade.positionSize) {
      
      const winProb = currentTrade.winProbability || 50;
      
      const expectedValue = calculateExpectedValue(
        currentTrade.entryPrice,
        currentTrade.takeProfit,
        currentTrade.stopLoss,
        currentTrade.positionSize,
        currentTrade.position,
        currentTrade.leverage,
        winProb,
        currentTrade.fees || 0
      );
      
      if (newTrade.expectedValue !== expectedValue) {
        newTrade.expectedValue = expectedValue;
        hasChanges = true;
      }
      
      // Calculate R-Multiple if entryRiskReward is available
      if (currentTrade.entryRiskReward) {
        // FIX: Added position parameter to correctly calculate R-Multiple
        const rMultiple = calculateRMultiple(
          currentTrade.entryRiskReward,
          winProb,
          currentTrade.position
        );
        
        if (newTrade.rMultiple !== rMultiple) {
          newTrade.rMultiple = rMultiple;
          hasChanges = true;
        }
      }
    }
    
    // Update state if changes were made
    if (hasChanges) {
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
    currentTrade.leverage,
    currentTrade.winProbability,
    currentTrade.entryRiskReward
  ]);

  return {
    currentTrade,
    setCurrentTrade,
    activeTab,
    setActiveTab,
    isQuickMode,
    setIsQuickMode,
    handleInputChange,
    handleSubmit,
    handleSaveAndAddNew,
    goToPreviousField,
    formRef
  };
};
