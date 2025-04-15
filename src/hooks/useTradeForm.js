// src/hooks/useTradeForm.js
import { useState, useEffect, useRef } from 'react';
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
  
  // Referenz zum Formular für Keyboard-Fokus
  const formRef = useRef(null);
  
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
  
  // Speichern und neuen Trade hinzufügen
  const handleSaveAndAddNew = (e) => {
    e.preventDefault();
    
    // Bestehenden Trade speichern
    onSubmit(currentTrade);
    
    // Formular zurücksetzen, aber einige Werte beibehalten für bessere UX
    setCurrentTrade({
      ...initialTrade,
      entryDate: new Date().toISOString().split('T')[0], // Heutiges Datum
      assetClass: currentTrade.assetClass, // Asset-Klasse beibehalten
      currency: currentTrade.currency, // Währung beibehalten
      position: currentTrade.position, // Position beibehalten
      leverage: currentTrade.leverage, // Hebel beibehalten
      marketCondition: currentTrade.marketCondition, // Marktbedingung beibehalten
      tradeType: currentTrade.tradeType, // Trade-Typ beibehalten
      preTradeEmotion: 3, // Neutral
      postTradeEmotion: 3, // Neutral
      followedPlan: true,
      wouldTakeAgain: true
    });
    
    // Zur Entry-Tab wechseln und ersten Input fokussieren
    setActiveTab('entry');
    setIsQuickMode(false);
    
    // Fokus auf das erste Input-Element setzen (mit Timeout für DOM-Update)
    setTimeout(() => {
      if (formRef.current) {
        const firstInput = formRef.current.querySelector('input:not([readonly]), select, textarea');
        if (firstInput) firstInput.focus();
      }
    }, 100);
  };
  
  // Zurück zum vorherigen Feld (für mobile Nutzer)
  const goToPreviousField = (e) => {
    if (!formRef.current) return;
    
    // Aktuelles fokussiertes Element finden
    const focusedElement = document.activeElement;
    
    // Alle Input-Elemente im Formular finden
    const formElements = Array.from(formRef.current.querySelectorAll(
      'input:not([type="hidden"]):not([readonly]), select, textarea'
    ));
    
    // Index des aktuellen Elements finden
    const currentIndex = formElements.indexOf(focusedElement);
    
    // Wenn es ein fokussiertes Element gibt und es nicht das erste ist
    if (currentIndex > 0) {
      // Vorheriges Element fokussieren
      formElements[currentIndex - 1].focus();
    }
  };
  
  // Tastaturkürzel-Handler
  const handleKeyboardShortcuts = (e) => {
    // Strg+Enter für Speichern
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit(e);
    }
    
    // Strg+Shift+Enter für Speichern und Neuen Trade
    if (e.ctrlKey && e.shiftKey && e.key === 'Enter') {
      handleSaveAndAddNew(e);
    }
    
    // Tab-Navigation zwischen Tabs mit Strg+Pfeiltasten
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
  
  // Keyboard-Event-Listener hinzufügen/entfernen
  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardShortcuts);
    return () => {
      window.removeEventListener('keydown', handleKeyboardShortcuts);
    };
  }, [activeTab]);

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
    handleSubmit,
    handleSaveAndAddNew,
    goToPreviousField,
    formRef
  };
};