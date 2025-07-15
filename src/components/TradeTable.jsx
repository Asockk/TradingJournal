import React, { useState, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import TradeRow from './TradeRow';
import MobileTradeCard from './MobileTradeCard';
import VirtualizedTradeTable from './VirtualizedTradeTable';

const TradeTable = ({ trades, onEdit, onDelete, allTrades }) => {
  const [expandedTrade, setExpandedTrade] = useState(null);
  const [sortField, setSortField] = useState('entryDate'); // Default sort field
  const [sortDirection, setSortDirection] = useState('desc'); // Default sort direction (newest first)

  const toggleExpand = useCallback((id) => {
    setExpandedTrade(expandedTrade === id ? null : id);
  }, [expandedTrade]);

  // Handle sorting
  const handleSort = useCallback((field) => {
    if (sortField === field) {
      // Toggle direction if clicking on the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  }, [sortField, sortDirection]);

  // Sort trades based on current sort field and direction
  const sortedTrades = useMemo(() => {
    if (!trades.length) return [];
    
    return [...trades].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle special fields
      if (sortField === 'pnl') {
        aValue = parseFloat(aValue || 0);
        bValue = parseFloat(bValue || 0);
      } else if (sortField === 'entryDate' || sortField === 'exitDate') {
        // Convert dates to timestamps for comparison
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }
      
      // Default comparison for strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      // Handle undefined or null values
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;
      
      // Apply sort direction
      const direction = sortDirection === 'asc' ? 1 : -1;
      return aValue < bValue ? -1 * direction : aValue > bValue ? 1 * direction : 0;
    });
  }, [trades, sortField, sortDirection]);

  // Sort indicator component - memoized
  const SortIndicator = React.memo(({ field }) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} className="ml-1 opacity-30" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp size={12} className="ml-1" /> 
      : <ChevronDown size={12} className="ml-1" />;
  });

  // Desktop Table View
  const DesktopTable = () => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th 
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => handleSort('asset')}
          >
            <div className="flex items-center">
              Asset <SortIndicator field="asset" />
            </div>
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Typ
          </th>
          <th 
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => handleSort('entryDate')}
          >
            <div className="flex items-center">
              Entry <SortIndicator field="entryDate" />
            </div>
          </th>
          <th 
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => handleSort('exitDate')}
          >
            <div className="flex items-center">
              Exit <SortIndicator field="exitDate" />
            </div>
          </th>
          <th 
            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => handleSort('positionSize')}
          >
            <div className="flex items-center justify-end">
              Size <SortIndicator field="positionSize" />
            </div>
          </th>
          <th 
            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => handleSort('pnl')}
          >
            <div className="flex items-center justify-end">
              PnL <SortIndicator field="pnl" />
            </div>
          </th>
          <th 
            className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => handleSort('actualRiskReward')}
          >
            <div className="flex items-center justify-center">
              R:R <SortIndicator field="actualRiskReward" />
            </div>
          </th>
          {/* Alpha Trader: Neue Spalte für Plan-Befolgung */}
          <th 
            className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => handleSort('followedPlan')}
          >
            <div className="flex items-center justify-center">
              Plan <SortIndicator field="followedPlan" />
            </div>
          </th>
          <th className="px-4 py-3"></th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {sortedTrades.map(trade => (
          <TradeRow 
            key={trade.id} 
            trade={trade} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
      </tbody>
    </table>
  );

  // Mobile Card View
  const MobileCardView = () => (
    <div className="space-y-4">
      {/* Mobile Sort Controls */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-sm font-medium text-gray-700">Sortieren nach</span>
        <div className="flex">
          <select 
            className="text-sm border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
            value={sortField}
            onChange={(e) => {
              setSortField(e.target.value);
              // Reset to descending when changing fields
              setSortDirection('desc');
            }}
          >
            <option value="entryDate">Datum</option>
            <option value="asset">Asset</option>
            <option value="pnl">PnL</option>
            <option value="positionSize">Größe</option>
            <option value="actualRiskReward">Risk/Reward</option>
            {/* Alpha Trader: Sortieren nach Trade-Typ und Plan-Befolgung */}
            <option value="tradeType">Trade-Typ</option>
            <option value="followedPlan">Plan befolgt</option>
          </select>
          <button 
            className="px-2 py-1 border border-l-0 border-gray-300 rounded-r-md bg-white text-gray-700"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            {sortDirection === 'asc' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Sorted Trades */}
      {sortedTrades.map(trade => (
        <MobileTradeCard
          key={trade.id}
          trade={trade}
          onEdit={onEdit}
          onDelete={onDelete}
          isExpanded={expandedTrade === trade.id}
          onToggleExpand={toggleExpand}
          allTrades={allTrades}
        />
      ))}
    </div>
  );

  // Empty state
  if (trades.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        {allTrades.length > 0 ? 
          'Keine Trades mit den aktuellen Filtern gefunden.' : 
          'Noch keine Trades vorhanden. Füge deinen ersten Trade hinzu!'}
      </div>
    );
  }

  // Use virtualized table for large datasets
  if (trades.length > 50) {
    return (
      <div>
        {/* Desktop view with virtualization */}
        <div className="hidden md:block">
          <VirtualizedTradeTable 
            trades={trades} 
            onEdit={onEdit} 
            onDelete={onDelete} 
            allTrades={allTrades} 
          />
        </div>
        
        {/* Mobile view (hidden on medium and larger screens) */}
        <div className="md:hidden">
          <MobileCardView />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      {/* Desktop view (hidden on small screens) */}
      <div className="hidden md:block">
        <DesktopTable />
      </div>
      
      {/* Mobile view (hidden on medium and larger screens) */}
      <div className="md:hidden">
        <MobileCardView />
      </div>
    </div>
  );
};

export default TradeTable;