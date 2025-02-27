import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { getPnLColorClass } from '../utils/styleUtils';

const TradeTable = ({ trades, onEdit, onDelete, allTrades }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      {trades.length > 0 ? (
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
                      trade.position === 'Long' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(trade.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="p-8 text-center text-gray-500">
          {allTrades.length > 0 ? 
            'Keine Trades mit den aktuellen Filtern gefunden.' : 
            'Noch keine Trades vorhanden. Füge deinen ersten Trade hinzu!'}
        </div>
      )}
    </div>
  );
};

export default TradeTable;