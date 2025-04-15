import React from 'react';
import { Card, CardContent } from '../ui/card';

const AssetPerformanceTable = ({ assetData, currency }) => {
  if (!assetData || assetData.length === 0) {
    return (
      <Card className="bg-white mb-6">
        <CardContent className="p-4">
          <h3 className="text-base font-medium mb-4">Asset Performance Details</h3>
          <p className="text-gray-500 text-center p-4">Keine Asset-Daten verfügbar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white mb-6">
      <CardContent className="p-4">
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
      </CardContent>
    </Card>
  );
};

export default AssetPerformanceTable;