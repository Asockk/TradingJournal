import React from 'react';
import { X } from 'lucide-react';
import { useTradeForm } from '../hooks/useTradeForm';
import QuickModeToggle from './form/QuickModeToggle';
import QuickEntryForm from './form/QuickEntryForm';
import TabButton from './form/TabButton';
import EntryTabContent from './form/EntryTabContent';
import ExitTabContent from './form/ExitTabContent';
import AnalysisTabContent from './form/AnalysisTabContent';

const TradeForm = ({ trade, onClose, onSubmit, isEditing }) => {
  const {
    currentTrade,
    setCurrentTrade,
    activeTab,
    setActiveTab,
    isQuickMode,
    setIsQuickMode,
    handleInputChange,
    handleSubmit
  } = useTradeForm(trade, onSubmit, onClose, isEditing);

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
          <QuickModeToggle isQuickMode={isQuickMode} setIsQuickMode={setIsQuickMode} />
          
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
              <div className="flex border-b mb-4">
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