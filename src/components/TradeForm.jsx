// src/components/TradeForm.jsx
import React from 'react';
import { X, Save, Plus, ArrowUp, ArrowDown } from 'lucide-react';
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
    handleSubmit,
    handleSaveAndAddNew,
    goToPreviousField,
    formRef
  } = useTradeForm(trade, onSubmit, onClose, isEditing);

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-start pt-4 pb-20">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-full overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Trade bearbeiten' : 'Neuer Trade'}
          </h2>
          <div className="flex space-x-2">
            <div className="hidden sm:block text-xs text-gray-500 bg-gray-100 rounded p-1">
              <div>Strg+Enter: Speichern</div>
              <div>Strg+Shift+Enter: Speichern & Neu</div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
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
              type="button"
              onClick={handleSaveAndAddNew}
              className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-1"
            >
              <Save size={16} />
              <Plus size={16} />
              Speichern & Neu
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-1"
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