import React from 'react';
import { Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

// Utility functions
const getPositionBgClass = (position) => {
  return position === 'Long' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
};

const getPnLColorClass = (pnl) => {
  const value = parseFloat(pnl || 0);
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-600';
};

const MobileTradeCard = ({ trade, onEdit, onDelete, isExpanded, onToggleExpand, allTrades }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => onToggleExpand(trade.id)}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center">
              <div className="font-medium text-gray-900">{trade.asset}</div>
              <div className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                getPositionBgClass(trade.position)
              }`}>
                {trade.position}
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{trade.assetClass}</div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`text-sm font-medium ${getPnLColorClass(trade.pnl)}`}>
              {trade.pnl ? `${parseFloat(trade.pnl) > 0 ? '+' : ''}${parseFloat(trade.pnl).toFixed(2)} ${trade.currency}` : '-'}
            </div>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Einstieg:</span>
            <span className="ml-1 text-gray-900">{trade.entryDate}</span>
          </div>
          <div>
            <span className="text-gray-500">Größe:</span>
            <span className="ml-1 text-gray-900">{trade.positionSize} {trade.currency}</span>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Entry Time:</span>
              <span className="ml-1 text-gray-900">{trade.entryTime}</span>
            </div>
            <div>
              <span className="text-gray-500">Exit:</span>
              <span className="ml-1 text-gray-900">{trade.exitDate || '-'}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Entry Price:</span>
              <span className="ml-1 text-gray-900">{trade.entryPrice}</span>
            </div>
            <div>
              <span className="text-gray-500">Exit Price:</span>
              <span className="ml-1 text-gray-900">{trade.exitPrice || '-'}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Stop Loss:</span>
              <span className="ml-1 text-gray-900">{trade.stopLoss}</span>
            </div>
            <div>
              <span className="text-gray-500">Take Profit:</span>
              <span className="ml-1 text-gray-900">{trade.takeProfit}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">R/R (Plan):</span>
              <span className="ml-1 text-gray-900">{trade.entryRiskReward || '-'}</span>
            </div>
            <div>
              <span className="text-gray-500">R/R (Ist):</span>
              <span className="ml-1 text-gray-900">{trade.actualRiskReward || '-'}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Leverage:</span>
              <span className="ml-1 text-gray-900">{trade.leverage > 1 ? `${trade.leverage}x` : 'Spot'}</span>
            </div>
            <div>
              <span className="text-gray-500">Trade Typ:</span>
              <span className="ml-1 text-gray-900">{trade.tradeType || 'Other'}</span>
            </div>
          </div>
          
          {trade.emotion && (
            <div>
              <span className="text-gray-500 text-sm">Emotion:</span>
              <span className="ml-1">{trade.emotion}</span>
            </div>
          )}
          
          {trade.followedPlan !== undefined && (
            <div>
              <span className="text-gray-500 text-sm">Plan befolgt:</span>
              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                trade.followedPlan ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {trade.followedPlan ? 'Ja' : 'Nein'}
              </span>
            </div>
          )}
          
          {trade.conviction && (
            <div>
              <span className="text-gray-500 text-sm">Überzeugung:</span>
              <span className="ml-1 text-gray-900">{trade.conviction}/5</span>
            </div>
          )}
          
          {trade.winProbability && (
            <div>
              <span className="text-gray-500 text-sm">Win %:</span>
              <span className="ml-1 text-gray-900">{trade.winProbability}%</span>
            </div>
          )}
          
          {trade.notes && (
            <div className="mt-3">
              <div className="text-gray-500 text-sm mb-1">Notizen:</div>
              <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{trade.notes}</div>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 mt-4 pt-3 border-t">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(trade.id);
              }}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-900 text-sm"
            >
              <Edit size={16} />
              Bearbeiten
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(trade.id);
              }}
              className="flex items-center gap-1 text-red-600 hover:text-red-900 text-sm"
            >
              <Trash2 size={16} />
              Löschen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Export memoized component
export default React.memo(MobileTradeCard);