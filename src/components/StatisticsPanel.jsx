import React, { useState, useEffect } from 'react';
import StatisticsCards from './stats/StatisticsCards';
import AlphaTraderCards from './stats/AlphaTraderCards';
import EquityChart from './charts/EquityChart';
import AssetPerformanceChart from './charts/AssetPerformanceChart';
import AssetPerformanceTable from './stats/AssetPerformanceTable';
import HourlyPerformanceHeatmap from './charts/HourlyPerformanceHeatmap';
import ConvictionPerformanceChart from './charts/ConvictionPerformanceChart';
import WeekdayPerformanceChart from './charts/WeekdayPerformanceChart';
import PlanFollowedChart from './charts/PlanFollowedChart';
import TradeTypePerformanceChart from './charts/TradeTypePerformanceChart';
import DurationPerformanceChart from './charts/DurationPerformanceChart';
import PeriodComparisonCard from './stats/PeriodComparisonCard';
import EmotionPerformanceChart from './charts/EmotionPerformanceChart';
import EmotionTransitionChart from './charts/EmotionTransitionChart';
import { calculateStats } from '../utils/statsCalculations';
import { ArrowLeft } from 'lucide-react';

const StatisticsPanel = ({ trades, filters, filteredTrades }) => {
  // Zeitraum-Auswahl (Standard: "All")
  const [timeRange, setTimeRange] = useState('all');
  const [prevStats, setPrevStats] = useState(null);
  const [hasNoData, setHasNoData] = useState(false);
  
  // Berechne gefilterte Trades basierend auf Zeitraum
  const timeFilteredTrades = React.useMemo(() => {
    if (timeRange === 'all') return filteredTrades;
    
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 90);
        break;
      case 'ytd':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return filteredTrades;
    }
    
    return filteredTrades.filter(trade => 
      new Date(trade.entryDate) >= startDate
    );
  }, [filteredTrades, timeRange]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!timeFilteredTrades.length) {
      setHasNoData(true);
      return null;
    }
    setHasNoData(false);
    return calculateStats(timeFilteredTrades);
  }, [timeFilteredTrades]);

  // Calculate previous period stats for comparison
  useEffect(() => {
    if (timeRange === 'all' || !filteredTrades.length) {
      setPrevStats(null);
      return;
    }
    
    const now = new Date();
    let currentPeriodStart, previousPeriodStart, previousPeriodEnd;
    
    switch (timeRange) {
      case '7d':
        currentPeriodStart = new Date(now);
        currentPeriodStart.setDate(now.getDate() - 7);
        previousPeriodStart = new Date(currentPeriodStart);
        previousPeriodStart.setDate(currentPeriodStart.getDate() - 7);
        break;
      case '30d':
        currentPeriodStart = new Date(now);
        currentPeriodStart.setDate(now.getDate() - 30);
        previousPeriodStart = new Date(currentPeriodStart);
        previousPeriodStart.setDate(currentPeriodStart.getDate() - 30);
        break;
      case '90d':
        currentPeriodStart = new Date(now);
        currentPeriodStart.setDate(now.getDate() - 90);
        previousPeriodStart = new Date(currentPeriodStart);
        previousPeriodStart.setDate(currentPeriodStart.getDate() - 90);
        break;
      case 'ytd':
        currentPeriodStart = new Date(now.getFullYear(), 0, 1);
        previousPeriodStart = new Date(now.getFullYear() - 1, 0, 1);
        previousPeriodEnd = new Date(now.getFullYear() - 1, 11, 31);
        break;
      default:
        setPrevStats(null);
        return;
    }
    
    // Filtere Trades für die Vorperiode
    const previousPeriodTrades = filteredTrades.filter(trade => {
      const tradeDate = new Date(trade.entryDate);
      
      // Für "ytd" verwenden wir das ganze Vorjahr
      if (timeRange === 'ytd') {
        return tradeDate >= previousPeriodStart && tradeDate <= previousPeriodEnd;
      }
      
      // Für andere Zeiträume verwenden wir den gleichen Zeitraum vor der aktuellen Periode
      return tradeDate >= previousPeriodStart && tradeDate < currentPeriodStart;
    });
    
    if (previousPeriodTrades.length > 0) {
      const prevPeriodStats = calculateStats(previousPeriodTrades);
      setPrevStats(prevPeriodStats);
    } else {
      setPrevStats(null);
    }
  }, [timeRange, filteredTrades]);

  if (!stats && !hasNoData) {
    return (
      <div className="bg-white p-8 text-center text-gray-500 rounded-lg shadow">
        <p className="text-xl">Berechne Statistiken...</p>
      </div>
    );
  }

  if (!stats && hasNoData) {
    return (
      <div className="bg-white p-8 text-center text-gray-500 rounded-lg shadow">
        <p className="mb-4">Keine Daten für den gewählten Zeitraum verfügbar.</p>
        <button 
          onClick={() => setTimeRange('all')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center mx-auto"
        >
          <ArrowLeft size={16} className="mr-2" />
          Alle Daten anzeigen
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Zeitraum-Auswahl */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-4 py-2 text-sm font-medium ${
              timeRange === '7d' 
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-300 rounded-l-md`}
          >
            7 Tage
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-4 py-2 text-sm font-medium ${
              timeRange === '30d' 
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border-t border-b border-r border-gray-300`}
          >
            30 Tage
          </button>
          <button
            onClick={() => setTimeRange('90d')}
            className={`px-4 py-2 text-sm font-medium ${
              timeRange === '90d' 
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border-t border-b border-r border-gray-300`}
          >
            90 Tage
          </button>
          <button
            onClick={() => setTimeRange('ytd')}
            className={`px-4 py-2 text-sm font-medium ${
              timeRange === 'ytd' 
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border-t border-b border-r border-gray-300`}
          >
            YTD
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-4 py-2 text-sm font-medium ${
              timeRange === 'all' 
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border-t border-b border-r border-gray-300 rounded-r-md`}
          >
            Alle
          </button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <StatisticsCards stats={stats} currency={timeFilteredTrades[0]?.currency || '€'} />
      
      {/* Period Comparison (neu) */}
      {prevStats && timeRange !== 'all' && (
        <PeriodComparisonCard 
          currentStats={stats} 
          prevStats={prevStats} 
          timeRange={timeRange} 
          currency={timeFilteredTrades[0]?.currency || '€'} 
        />
      )}
      
      {/* Alpha Trader Cards */}
      <AlphaTraderCards stats={stats} currency={timeFilteredTrades[0]?.currency || '€'} />
      
      {/* Charts and Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Equity Curve */}
        <EquityChart data={stats.cumulativePnL} />
        
        {/* Asset Performance */}
        <AssetPerformanceChart data={stats.assetPnL.slice(0, 10)} />
      </div>
      
      {/* Emotion Analysis Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Emotion Performance Chart */}
        <EmotionPerformanceChart emotionData={stats.emotionPerformance} />
        
        {/* Emotion Transition Chart */}
        <EmotionTransitionChart transitionData={stats.emotionTransitions} />
      </div>
      
      {/* Alpha Trader Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Plan Followed Performance */}
        <PlanFollowedChart planStats={stats.planStats} />
        
        {/* Trade Type Performance */}
        <TradeTypePerformanceChart tradeTypeStats={stats.tradeTypeStats} />
      </div>
      
      {/* More Alpha Trader Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Weekday Performance Chart */}
        <WeekdayPerformanceChart weekdayStats={stats.weekdayStats} />
        
        {/* Duration Performance Chart */}
        <DurationPerformanceChart durationStats={stats.durationStats} />
      </div>
      
      {/* Statistics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Hourly Performance Heatmap */}
        <HourlyPerformanceHeatmap hourlyData={stats.hourlyPerformance} />
        
        {/* Conviction Performance Chart */}
        <ConvictionPerformanceChart convictionData={stats.convictionPerformance} />
      </div>
      
      {/* Asset Performance Table */}
      <AssetPerformanceTable 
        assetData={stats.assetPnL} 
        currency={timeFilteredTrades[0]?.currency || '€'} 
      />
    </>
  );
};

export default StatisticsPanel;