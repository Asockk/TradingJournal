import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

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

const TradeRow = ({ trade, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50">
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
  );
};

// Export memoized component
export default React.memo(TradeRow);