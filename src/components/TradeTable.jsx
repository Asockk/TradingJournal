import React, { useState } from 'react';
import { Edit, Trash2, ChevronDown, ChevronUp, BarChart2, DollarSign, TrendingUp } from 'lucide-react';
import { getPnLColorClass, getPositionBgClass } from '../utils/styleUtils';

const TradeTable = ({ trades, onEdit, onDelete, allTrades }) => {
  const [expandedTrade, setExpandedTrade] = useState(null);

  const toggleExpand = (id) => {
    setExpandedTrade(expandedTrade === id ? null : id);
  };

  // Desktop Table View
  const DesktopTable = () => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Asset
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Typ
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Entry
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Exit
          </th>
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Size
          </th>
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            PnL
          </th>
          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            R:R
          </th>
          <th className="px-4 py-3"></th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {trades.map(trade => (
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
                Conv: {trade.conviction}/5
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
      {trades.map(trade => (
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
              </div>
              
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