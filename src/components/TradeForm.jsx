// src/components/TradeForm.jsx
import React, { useState } from 'react';
import { X, Save, Plus, ArrowUp, ArrowDown, Maximize, Minimize } from 'lucide-react';
import { useTradeForm } from '../hooks/useTradeForm';
import QuickModeToggle from './form/QuickModeToggle';
import QuickEntryForm from './form/QuickEntryForm';
import TabButton from './form/TabButton';
import EntryTabContent from './form/EntryTabContent';
import ExitTabContent from './form/ExitTabContent';
import AnalysisTabContent from './form/AnalysisTabContent';

const TradeForm = ({ trade, onClose, onSubmit, isEditing }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const {
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
  } = useTradeForm(trade, onSubmit, onClose, isEditing);

  // Bestimme Modal-Größe basierend auf isFullScreen
  const modalSizeClasses = isFullScreen
    ? "fixed inset-0 max-w-full max-h-full m-0 rounded-none"
    : "max-w-4xl w-full max-h-[85vh] mx-auto my-8 rounded-lg";

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/30 backdrop-blur-sm flex justify-center items-start pt-4 pb-4">
      <div className={`bg-white shadow-2xl overflow-auto transition-all duration-300 ${modalSizeClasses}`}>
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b bg-white">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Trade bearbeiten' : 'Neuer Trade'}
          </h2>
          <div className="flex space-x-3 items-center">
            <div className="hidden sm:block text-xs text-gray-500 bg-gray-100 rounded p-1">
              <div>Strg+Enter: Speichern</div>
              <div>Strg+Shift+Enter: Speichern & Neu</div>
            </div>
            
            {/* Toggle Vollbild-Modus */}
            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={isFullScreen ? "Minimieren" : "Maximieren"}
            >
              {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
            
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <form ref={formRef} onSubmit={handleSubmit} className="p-4">
          {/* Keyboard shortcuts info for mobile */}
          <div className="sm:hidden mb-2 text-xs text-gray-500 bg-gray-100 rounded p-2">
            Tastaturkürzel:
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>• Strg+Enter: Speichern</div>
              <div>• Strg+Shift+Enter: Speichern & Neu</div>
              <div>• Strg+→/←: Tab wechseln</div>
            </div>
          </div>
          
          {/* Modustoggle (Schnell vs. Detailliert) */}
          <QuickModeToggle isQuickMode={isQuickMode} setIsQuickMode={setIsQuickMode} />
          
          {/* Mobile Navigation: Vorheriges Feld */}
          <div className="sm:hidden mb-2">
            <button
              type="button"
              onClick={goToPreviousField}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md border border-gray-300"
            >
              <ArrowUp size={14} />
              Vorheriges Feld
            </button>
          </div>
          
          {/* Zeige Schnellmodus oder Tab-Modus */}
          {isQuickMode ? (
            <QuickEntryForm 
              currentTrade={currentTrade} 
              handleInputChange={handleInputChange} 
              setCurrentTrade={setCurrentTrade}
              setIsQuickMode={setIsQuickMode} 
            />
          ) : (
            <>
              {/* Tab-Navigation */}
              <div className="flex sticky top-[73px] z-10 border-b mb-4 bg-white">
                <TabButton tab="entry" label="Entry" activeTab={activeTab} onClick={setActiveTab} />
                <TabButton tab="exit" label="Exit" activeTab={activeTab} onClick={setActiveTab} />
                <TabButton tab="analysis" label="Analyse" activeTab={activeTab} onClick={setActiveTab} />
              </div>
              
              {/* Tab-Inhalte */}
              {activeTab === 'entry' && (
                <EntryTabContent 
                  currentTrade={currentTrade} 
                  handleInputChange={handleInputChange} 
                  setCurrentTrade={setCurrentTrade} 
                />
              )}
              {activeTab === 'exit' && (
                <ExitTabContent 
                  currentTrade={currentTrade} 
                  handleInputChange={handleInputChange} 
                  setCurrentTrade={setCurrentTrade} 
                />
              )}
              {activeTab === 'analysis' && (
                <AnalysisTabContent 
                  currentTrade={currentTrade} 
                  handleInputChange={handleInputChange} 
                  setCurrentTrade={setCurrentTrade} 
                />
              )}
            </>
          )}
          
          <div className="mt-4 flex justify-end gap-2 sticky bottom-0 bg-white p-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={handleSaveAndAddNew}
              className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-1 hover:bg-green-700 transition-colors shadow-sm"
            >
              <Save size={16} />
              <Plus size={16} />
              Speichern & Neu
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-1 hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Save size={16} />
              {isEditing ? 'Aktualisieren' : 'Speichern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeForm;