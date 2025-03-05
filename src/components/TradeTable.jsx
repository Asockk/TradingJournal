import React, { useState, useMemo } from 'react';
import { Edit, Trash2, ChevronDown, ChevronUp, BarChart2, DollarSign, TrendingUp, ArrowUpDown, BookOpen, Thermometer } from 'lucide-react';
import { getPnLColorClass, getPositionBgClass } from '../utils/styleUtils';

const TradeTable = ({ trades, onEdit, onDelete, allTrades }) => {
  const [expandedTrade, setExpandedTrade] = useState(null);
  const [sortField, setSortField] = useState('entryDate'); // Default sort field
  const [sortDirection, setSortDirection] = useState('desc'); // Default sort direction (newest first)

  const toggleExpand = (id) => {
    setExpandedTrade(expandedTrade === id ? null : id);
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if clicking on the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };

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

  // Sort indicator component
  const SortIndicator = ({ field }) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} className="ml-1 opacity-30" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp size={12} className="ml-1" /> 
      : <ChevronDown size={12} className="ml-1" />;
  };

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
          <tr key={trade.id} className="hover:bg-gray-50">
            <td className="px-4 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="font-medium text-gray-900">{trade.asset}</div>
                <div className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  getPositionBgClass(trade.position)
                }`}>
                  {trade.position}
                </div>
              </div>
              <div className="text-xs text-gray-500">{trade.assetClass}</div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                {trade.leverage > 1 ? `${trade.leverage}x` : 'Spot'}
              </div>
              <div className="text-xs text-gray-500">
                {/* Alpha Trader: Trade-Typ anzeigen */}
                {trade.tradeType || 'Other'}
              </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{trade.entryDate}</div>
              <div className="text-xs text-gray-500">{trade.entryTime}</div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{trade.exitDate || '-'}</div>
              <div className="text-xs text-gray-500">{trade.exitTime || '-'}</div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-right">
              <div className="text-sm text-gray-900">
                {trade.positionSize} {trade.currency}
              </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-right">
              <div className={`text-sm font-medium ${getPnLColorClass(trade.pnl)}`}>
                {trade.pnl ? `${parseFloat(trade.pnl) > 0 ? '+' : ''}${parseFloat(trade.pnl).toFixed(2)} ${trade.currency}` : '-'}
              </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-center">
              <div className="text-sm text-gray-900">
                {trade.actualRiskReward || '-'}
              </div>
            </td>
            {/* Alpha Trader: Plan-Befolgung visualisieren */}
            <td className="px-4 py-4 whitespace-nowrap text-center">
              {trade.followedPlan !== undefined && (
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  trade.followedPlan ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {trade.followedPlan ? 'Ja' : 'Nein'}
                </div>
              )}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex space-x-2 justify-end">
                <button
                  onClick={() => onEdit(trade.id)}
                  className="text-blue-600 hover:text-blue-900"
                  aria-label="Edit"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(trade.id)}
                  className="text-red-600 hover:text-red-900"
                  aria-label="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
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
        <div key={trade.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div 
            className="flex justify-between items-center p-3 cursor-pointer"
            onClick={() => toggleExpand(trade.id)}
          >
            <div className="flex items-center space-x-2">
              <div className="font-medium">{trade.asset}</div>
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPositionBgClass(trade.position)}`}>
                {trade.position}
              </div>
              {/* Alpha Trader: Trade-Typ Badge */}
              {trade.tradeType && (
                <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {trade.tradeType}
                </div>
              )}
            </div>
            <div className="flex items-center">
              <div className={`mr-2 font-medium ${getPnLColorClass(trade.pnl)}`}>
                {trade.pnl ? `${parseFloat(trade.pnl) > 0 ? '+' : ''}${parseFloat(trade.pnl).toFixed(2)} ${trade.currency}` : '-'}
              </div>
              <button className="text-gray-500">
                {expandedTrade === trade.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
          </div>
          
          {/* Card Summary (always visible) */}
          <div className="px-3 pb-3 pt-0 border-t border-gray-100 grid grid-cols-3 gap-2 text-sm">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 flex items-center">
                <BarChart2 size={12} className="mr-1" />Entry
              </span>
              <span>{trade.entryDate}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 flex items-center">
                <DollarSign size={12} className="mr-1" />Size
              </span>
              <span>{trade.positionSize}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 flex items-center">
                <TrendingUp size={12} className="mr-1" />R:R
              </span>
              <span>{trade.actualRiskReward || '-'}</span>
            </div>
          </div>
          
          {/* Expanded Details */}
          {expandedTrade === trade.id && (
            <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Entry Time</p>
                  <p>{trade.entryTime || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Exit Date/Time</p>
                  <p>{trade.exitDate ? `${trade.exitDate} ${trade.exitTime || ''}` : '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Entry Price</p>
                  <p>{trade.entryPrice}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Exit Price</p>
                  <p>{trade.exitPrice || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Leverage</p>
                  <p>{trade.leverage}x</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Conviction</p>
                  <p>{trade.conviction}/5</p>
                </div>
                {/* Alpha Trader: Zusätzliche Felder */}
                <div>
                  <p className="text-xs text-gray-500 flex items-center">
                    <BookOpen size={12} className="mr-1" />Plan befolgt
                  </p>
                  <p className={`font-medium ${trade.followedPlan ? 'text-green-600' : 'text-yellow-600'}`}>
                    {trade.followedPlan ? 'Ja' : 'Nein'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Thermometer size={12} className="mr-1" />Marktbedingung
                  </p>
                  <p>{trade.marketCondition || 'Neutral'}</p>
                </div>
              </div>
              
              {/* Alpha Trader: Plan und Reflexion */}
              {(trade.tradePlan || trade.whatWorked || trade.whatDidntWork) && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  {trade.tradePlan && (
                    <div className="mb-1">
                      <p className="text-xs text-gray-500">Trade-Plan</p>
                      <p className="text-sm">{trade.tradePlan}</p>
                    </div>
                  )}
                  {trade.whatWorked && (
                    <div className="mt-1">
                      <p className="text-xs text-gray-500">Was hat funktioniert</p>
                      <p className="text-sm">{trade.whatWorked}</p>
                    </div>
                  )}
                  {trade.whatDidntWork && (
                    <div className="mt-1">
                      <p className="text-xs text-gray-500">Was hat nicht funktioniert</p>
                      <p className="text-sm">{trade.whatDidntWork}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Rationale/Notes (if present) */}
              {(trade.rationale || trade.notes) && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  {trade.rationale && (
                    <div className="mb-1">
                      <p className="text-xs text-gray-500">Rationale</p>
                      <p className="text-sm">{trade.rationale}</p>
                    </div>
                  )}
                  {trade.notes && (
                    <div className="mt-1">
                      <p className="text-xs text-gray-500">Notes</p>
                      <p className="text-sm">{trade.notes}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="mt-3 flex justify-end space-x-2 pt-2 border-t border-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onEdit(trade.id);
                  }}
                  className="px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded-md bg-blue-50"
                >
                  <Edit size={14} className="inline mr-1" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(trade.id);
                  }}
                  className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded-md bg-red-50"
                >
                  <Trash2 size={14} className="inline mr-1" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
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