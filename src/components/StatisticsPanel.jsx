import React from 'react';
import StatisticsCards from './stats/StatisticsCards';
import EquityChart from './charts/EquityChart';
import AssetPerformanceChart from './charts/AssetPerformanceChart';
import AssetPerformanceTable from './stats/AssetPerformanceTable';
import { calculateStats } from '../utils/statsCalculations';

const StatisticsPanel = ({ trades, filters, filteredTrades }) => {
  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!filteredTrades.length) return null;
    return calculateStats(filteredTrades);
  }, [filteredTrades]);

  if (!stats) {
    return (
      <div className="bg-white p-8 text-center text-gray-500 rounded-lg shadow">
        Keine Daten verfügbar. Erfasse zuerst einige Trades.
      </div>
    );
  }

  return (
    <>
      {/* KPI Cards */}
      <StatisticsCards stats={stats} currency={filteredTrades[0]?.currency || '€'} />
      
      {/* Charts and Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Equity Curve */}
        <EquityChart data={stats.cumulativePnL} />
        
        {/* Asset Performance */}
        <AssetPerformanceChart data={stats.assetPnL.slice(0, 10)} />
      </div>
      
      {/* Asset Performance Table */}
      <AssetPerformanceTable 
        assetData={stats.assetPnL} 
        currency={filteredTrades[0]?.currency || '€'} 
      />
    </>
  );
};

export default StatisticsPanel;