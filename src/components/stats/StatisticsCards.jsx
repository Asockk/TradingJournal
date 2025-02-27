import React from 'react';

const StatisticsCards = ({ stats, currency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500">Trefferquote</h3>
        <p className="text-2xl font-bold mt-1">{stats.winRate.toFixed(1)}%</p>
        <p className="text-sm text-gray-500 mt-1">
          {Math.round(stats.tradeCount * stats.winRate / 100)} von {stats.tradeCount} Trades
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500">Durchschn. Gewinn/Verlust</h3>
        <p className={`text-2xl font-bold mt-1 ${stats.avgPnL > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stats.avgPnL > 0 ? '+' : ''}{stats.avgPnL.toFixed(2)} {currency}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          pro Trade
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500">Risk/Reward (Median)</h3>
        <p className="text-2xl font-bold mt-1">{stats.medianRR.toFixed(2)}</p>
        <p className="text-sm text-gray-500 mt-1">
          Ø {stats.avgRiskReward.toFixed(2)}
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500">Total PnL</h3>
        <p className={`text-2xl font-bold mt-1 ${stats.totalPnL > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stats.totalPnL > 0 ? '+' : ''}{stats.totalPnL.toFixed(2)} {currency}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Max Drawdown: {stats.maxDrawdown.toFixed(1)}%
        </p>
      </div>
    </div>
  );
};

export default StatisticsCards;