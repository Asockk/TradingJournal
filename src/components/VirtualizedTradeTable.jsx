import React, { useState, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import TradeRow from './TradeRow';

const VirtualizedTradeTable = ({ trades, onEdit, onDelete, allTrades }) => {
  const [sortField, setSortField] = useState('entryDate');
  const [sortDirection, setSortDirection] = useState('desc');

  // Handle sorting
  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
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
      } else if (sortField === 'positionSize') {
        aValue = parseFloat(aValue || 0);
        bValue = parseFloat(bValue || 0);
      } else if (sortField === 'entryDate' || sortField === 'exitDate') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      } else if (sortField === 'actualRiskReward') {
        aValue = parseFloat(aValue || 0);
        bValue = parseFloat(bValue || 0);
      }
      
      // Handle null/undefined values
      if (!aValue && !bValue) return 0;
      if (!aValue) return sortDirection === 'asc' ? -1 : 1;
      if (!bValue) return sortDirection === 'asc' ? 1 : -1;
      
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

  // Row renderer for virtual list
  const Row = ({ index, style }) => {
    const trade = sortedTrades[index];
    return (
      <div style={style}>
        <table className="min-w-full">
          <tbody className="bg-white divide-y divide-gray-200">
            <TradeRow 
              trade={trade} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          </tbody>
        </table>
      </div>
    );
  };

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

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      {/* Table Header */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('asset')}
            >
              <div className="flex items-center">
                Asset <SortIndicator field="asset" />
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('leverage')}
            >
              <div className="flex items-center">
                Leverage <SortIndicator field="leverage" />
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('entryDate')}
            >
              <div className="flex items-center">
                Einstieg <SortIndicator field="entryDate" />
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('exitDate')}
            >
              <div className="flex items-center">
                Ausstieg <SortIndicator field="exitDate" />
              </div>
            </th>
            <th 
              className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('positionSize')}
            >
              <div className="flex items-center justify-end">
                Größe <SortIndicator field="positionSize" />
              </div>
            </th>
            <th 
              className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('pnl')}
            >
              <div className="flex items-center justify-end">
                P&L <SortIndicator field="pnl" />
              </div>
            </th>
            <th 
              className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('actualRiskReward')}
            >
              <div className="flex items-center justify-center">
                R:R <SortIndicator field="actualRiskReward" />
              </div>
            </th>
            <th 
              className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('followedPlan')}
            >
              <div className="flex items-center justify-center">
                Plan <SortIndicator field="followedPlan" />
              </div>
            </th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
      </table>
      
      {/* Virtualized Table Body */}
      <List
        height={600} // Height of the scrollable area
        itemCount={sortedTrades.length}
        itemSize={73} // Height of each row
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
};

export default VirtualizedTradeTable;