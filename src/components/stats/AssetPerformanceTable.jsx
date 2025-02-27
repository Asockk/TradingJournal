import React from 'react';

const AssetPerformanceTable = ({ assetData, currency }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
      <h3 className="text-base font-medium mb-4">Asset Performance Details</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Win Rate
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                # Trades
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total PnL
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {assetData.map(asset => (
              <tr key={asset.asset} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap font-medium">
                  {asset.asset}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  {asset.winRate.toFixed(1)}%
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  {asset.tradeCount}
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-right font-medium ${
                  asset.totalPnL > 0 ? 'text-green-600' : asset.totalPnL < 0 ? 'text-red-600' : ''
                }`}>
                  {asset.totalPnL > 0 ? '+' : ''}{asset.totalPnL.toFixed(2)} {currency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetPerformanceTable;