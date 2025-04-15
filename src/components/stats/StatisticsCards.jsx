import React from 'react';
import { Card, CardContent } from '../ui/card';

const StatisticCard = ({ title, value, subValue, valueClass }) => (
  <Card className="bg-white">
    <CardContent className="p-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className={`text-2xl font-bold mt-1 ${valueClass || ''}`}>{value}</p>
      {subValue && <p className="text-sm text-gray-500 mt-1">{subValue}</p>}
    </CardContent>
  </Card>
);

const StatisticsCards = ({ stats, currency }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatisticCard 
        title="Trefferquote"
        value={`${stats.winRate.toFixed(1)}%`}
        subValue={`${Math.round(stats.tradeCount * stats.winRate / 100)} von ${stats.tradeCount} Trades`}
      />
      
      <StatisticCard 
        title="Durchschn. Gewinn/Verlust"
        value={`${stats.avgPnL > 0 ? '+' : ''}${stats.avgPnL.toFixed(2)} ${currency}`}
        subValue="pro Trade"
        valueClass={stats.avgPnL > 0 ? 'text-green-600' : 'text-red-600'}
      />
      
      <StatisticCard 
        title="Risk/Reward (Median)"
        value={stats.medianRR.toFixed(2)}
        subValue={`Ø ${stats.avgRiskReward.toFixed(2)}`}
      />
      
      <StatisticCard 
        title="Total PnL"
        value={`${stats.totalPnL > 0 ? '+' : ''}${stats.totalPnL.toFixed(2)} ${currency}`}
        subValue={`Max Drawdown: ${stats.maxDrawdown.toFixed(1)}%`}
        valueClass={stats.totalPnL > 0 ? 'text-green-600' : 'text-red-600'}
      />
    </div>
  );
};

export default StatisticsCards;