import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Download, Filter, BarChart2, Upload, Plus, BookMarked } from 'lucide-react';
import Header from './components/Header';
import TradeTable from './components/TradeTable';
import TradeForm from './components/TradeForm';
import FilterPanel from './components/FilterPanel';
import StatisticsPanel from './components/StatisticsPanel';
import TemplateModal from './components/templates/TemplateModal';
import { loadTrades, saveTrades } from './utils/storageUtils';
import { filterTrades } from './utils/filterUtils';
import { initialTradeState, initialFilterState } from './utils/constants';

// Main App Component
const App = () => {
  // State
  const [trades, setTrades] = useState([]);
  const [currentTrade, setCurrentTrade] = useState(initialTradeState);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('trades');
  const [filters, setFilters] = useState(initialFilterState);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Load trades from localStorage on initial render
  useEffect(() => {
    const savedTrades = loadTrades();
    if (savedTrades) {
      setTrades(savedTrades);
    }
  }, []);

  // Save trades to localStorage whenever they change
  useEffect(() => {
    saveTrades(trades);
  }, [trades]);

  // Filtered trades based on current filters
  const filteredTradesList = React.useMemo(() => {
    return filterTrades(trades, filters);
  }, [trades, filters]);

  // Form submission handler
  const handleSubmit = (trade) => {
    const newTrade = {
      ...trade,
      id: editingId || Date.now().toString()
    };
    
    if (editingId) {
      // Update existing trade
      setTrades(prev => 
        prev.map(t => t.id === editingId ? newTrade : t)
      );
      setEditingId(null);
    } else {
      // Add new trade
      setTrades(prev => [...prev, newTrade]);
    }
    
    // Reset form
    setCurrentTrade(initialTradeState);
    setIsFormOpen(false);
  };

  // Edit trade handler
  const handleEdit = (id) => {
    const tradeToEdit = trades.find(trade => trade.id === id);
    setCurrentTrade(tradeToEdit);
    setEditingId(id);
    setIsFormOpen(true);
  };

  // Delete trade handler
  const handleDelete = (id) => {
    if (window.confirm('Bist du sicher, dass du diesen Trade löschen möchtest?')) {
      setTrades(prev => prev.filter(trade => trade.id !== id));
    }
  };

  // CSV import handler
  const handleImport = (parsedTrades) => {
    setTrades(prev => [...prev, ...parsedTrades]);
  };

  // Filter change handler
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters(initialFilterState);
  };
  
  // Template application handler
  const handleApplyTemplate = (templateData) => {
    setCurrentTrade(prev => ({
      ...initialTradeState,
      ...templateData,
      entryDate: new Date().toISOString().split('T')[0] // Use today's date as default
    }));
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header with Import/Export buttons */}
      <Header 
        onImport={handleImport}
        trades={trades}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'trades' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('trades')}
          >
            Trades
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'stats' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistiken
          </button>
        </div>

        {/* Trades Tab */}
        {activeTab === 'trades' && (
          <div>
            {/* Filters and Actions Row */}
            <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-1 bg-white p-2 rounded-md border border-gray-300 shadow-sm"
                >
                  <Filter size={18} />
                  Filter
                  <ChevronDown size={16} />
                </button>
                
                {Object.values(filters).some(val => 
                  (typeof val === 'string' && val !== '') || 
                  (typeof val === 'boolean' && val) || 
                  (typeof val === 'number' && val !== 1 && val !== 5)
                ) && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-blue-600"
                  >
                    Filter zurücksetzen
                  </button>
                )}
                
                {/* Vorlagen-Button */}
                <button
                  onClick={() => setIsTemplateModalOpen(true)}
                  className="flex items-center gap-1 bg-white p-2 rounded-md border border-gray-300 shadow-sm"
                >
                  <BookMarked size={18} />
                  Vorlagen
                </button>
              </div>
              
              <button
                onClick={() => {
                  setCurrentTrade(initialTradeState);
                  setEditingId(null);
                  setIsFormOpen(true);
                }}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-md"
              >
                <Plus size={18} />
                Neuer Trade
              </button>
            </div>
            
            {/* Filter Panel */}
            {isFilterOpen && (
              <FilterPanel 
                filters={filters} 
                onFilterChange={handleFilterChange} 
              />
            )}
            
            {/* Trade Form Modal */}
            {isFormOpen && (
              <TradeForm
                trade={currentTrade}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
                isEditing={!!editingId}
                trades={trades}
              />
            )}
            
            {/* Templates Modal */}
            <TemplateModal
              isOpen={isTemplateModalOpen}
              onClose={() => setIsTemplateModalOpen(false)}
              onApplyTemplate={handleApplyTemplate}
            />
            
            {/* Trades Table */}
            <TradeTable 
              trades={filteredTradesList} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              allTrades={trades}
            />
          </div>
        )}
        
        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <StatisticsPanel 
            trades={trades} 
            filters={filters} 
            filteredTrades={filteredTradesList} 
          />
        )}
      </main>
    </div>
  );
};

export default App;