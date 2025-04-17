import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import StatisticsCards from './StatisticsCards';
import AlphaTraderCards from './AlphaTraderCards';
import EquityChart from '../charts/EquityChart';
import AssetPerformanceChart from '../charts/AssetPerformanceChart';
import AssetPerformanceTable from './AssetPerformanceTable';
import HourlyPerformanceHeatmap from '../charts/HourlyPerformanceHeatmap';
import ConvictionPerformanceChart from '../charts/ConvictionPerformanceChart';
import WeekdayPerformanceChart from '../charts/WeekdayPerformanceChart';
import PlanFollowedChart from '../charts/PlanFollowedChart';
import TradeTypePerformanceChart from '../charts/TradeTypePerformanceChart';
import DurationPerformanceChart from '../charts/DurationPerformanceChart';
import EmotionPerformanceChart from '../charts/EmotionPerformanceChart';
import EmotionTransitionChart from '../charts/EmotionTransitionChart';
import PeriodComparisonCard from './PeriodComparisonCard';
import RiskRewardComparisonChart from '../charts/RiskRewardComparisonChart';
import StopLossAdherenceChart from '../charts/StopLossAdherenceChart';
import DrawdownAnalysisChart from '../charts/DrawdownAnalysisChart';
import PositionSizeOptimizationPanel from './PositionSizeOptimizationPanel'; // HIER: Neuer Import
import { calculateStats } from '../../utils/statsCalculations';
import { ArrowLeft } from 'lucide-react';

// Komponente für Zeitbereichsauswahl
const TimeRangeSelector = ({ timeRange, setTimeRange }) => (
  <div className="flex justify-end mb-4">
    <div className="inline-flex rounded-md shadow-sm">
      {['7d', '30d', '90d', 'ytd', 'all'].map((range) => {
        const labels = {
          '7d': '7 Tage',
          '30d': '30 Tage',
          '90d': '90 Tage',
          'ytd': 'YTD',
          'all': 'Alle'
        };
        
        // Bestimme Klassen basierend auf Auswahl
        const isActive = timeRange === range;
        const baseClasses = `px-4 py-2 text-sm font-medium border`;
        const activeClasses = isActive 
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-700 hover:bg-gray-50';
        
        // Bestimme Rand-Klassen
        const borderClasses = 
          range === '7d' ? 'rounded-l-md border-gray-300' :
          range === 'all' ? 'rounded-r-md border-t border-b border-r border-gray-300' :
          'border-t border-b border-r border-gray-300';
        
        return (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`${baseClasses} ${activeClasses} ${borderClasses}`}
          >
            {labels[range]}
          </button>
        );
      })}
    </div>
  </div>
);

// Komponente für Keine-Daten-Anzeige
const NoDataView = ({ onReset }) => (
  <Card className="bg-white p-8 text-center text-gray-500 rounded-lg shadow">
    <CardContent>
      <p className="mb-4">Keine Daten für den gewählten Zeitraum verfügbar.</p>
      <button 
        onClick={onReset}
        className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center mx-auto"
      >
        <ArrowLeft size={16} className="mr-2" />
        Alle Daten anzeigen
      </button>
    </CardContent>
  </Card>
);

// Wrapper für Chart-Komponenten mit einheitlichem Layout
const ChartWrapper = ({ children, mdCols = 1 }) => (
  <div className={`grid grid-cols-1 ${mdCols > 1 ? 'md:grid-cols-2' : ''} gap-6 mb-6`}>
    {children}
  </div>
);

const StatisticsPanel = ({ trades, filters, filteredTrades }) => {
  // Zeitraum-Auswahl (Standard: "All")
  const [timeRange, setTimeRange] = useState('all');
  const [prevStats, setPrevStats] = useState(null);
  const [hasNoData, setHasNoData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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
    setIsLoading(true);
    
    if (!timeFilteredTrades.length) {
      setHasNoData(true);
      setIsLoading(false);
      return null;
    }
    
    setHasNoData(false);
    const calculatedStats = calculateStats(timeFilteredTrades);
    setIsLoading(false);
    return calculatedStats;
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

  if (isLoading) {
    return (
      <Card className="bg-white p-8 text-center text-gray-500 rounded-lg shadow">
        <CardContent>
          <p className="text-xl">Berechne Statistiken...</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats && hasNoData) {
    return <NoDataView onReset={() => setTimeRange('all')} />;
  }

  // Gemeinsame Währungs-Eigenschaft, die wir überall verwenden
  const currency = timeFilteredTrades[0]?.currency || '€';

  return (
    <>
      {/* Zeitraum-Auswahl */}
      <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
      
      {/* KPI Cards */}
      <StatisticsCards stats={stats} currency={currency} />
      
      {/* Period Comparison (neu) */}
      {prevStats && timeRange !== 'all' && (
        <PeriodComparisonCard 
          currentStats={stats} 
          prevStats={prevStats} 
          timeRange={timeRange} 
          currency={currency} 
        />
      )}
      
      {/* Alpha Trader Cards */}
      <AlphaTraderCards stats={stats} currency={currency} />
      
      {/* Charts and Detailed Stats */}
      <ChartWrapper mdCols={2}>
        {/* Equity Curve */}
        <EquityChart data={stats.cumulativePnL} />
        
        {/* Asset Performance */}
        <AssetPerformanceChart data={stats.assetPnL.slice(0, 10)} />
      </ChartWrapper>
      
      {/* Emotion Analysis Charts */}
      <ChartWrapper mdCols={2}>
        {/* Emotion Performance Chart */}
        <EmotionPerformanceChart emotionData={stats.emotionPerformance} />
        
        {/* Emotion Transition Chart */}
        <EmotionTransitionChart transitionData={stats.emotionTransitions} />
      </ChartWrapper>
      
      {/* Alpha Trader Charts */}
      <ChartWrapper mdCols={2}>
        {/* Plan Followed Performance */}
        <PlanFollowedChart planStats={stats.planStats} />
        
        {/* Trade Type Performance */}
        <TradeTypePerformanceChart tradeTypeStats={stats.tradeTypeStats} />
      </ChartWrapper>
      
      {/* More Alpha Trader Charts */}
      <ChartWrapper mdCols={2}>
        {/* Weekday Performance Chart */}
        <WeekdayPerformanceChart weekdayStats={stats.weekdayStats} />
        
        {/* Duration Performance Chart */}
        <DurationPerformanceChart durationStats={stats.durationStats} />
      </ChartWrapper>
      
      {/* Statistics Charts */}
      <ChartWrapper mdCols={2}>
        {/* Hourly Performance Heatmap */}
        <HourlyPerformanceHeatmap hourlyData={stats.hourlyPerformance} />
        
        {/* Conviction Performance Chart */}
        <ConvictionPerformanceChart convictionData={stats.convictionPerformance} />
      </ChartWrapper>
      
      {/* Risk Management Analysis */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Erweitertes Risikomanagement</h3>
      </div>
      
      <ChartWrapper mdCols={2}>
        {/* Risk-Reward Comparison */}
        <RiskRewardComparisonChart comparisonData={stats.riskRewardComparison} />
        
        {/* Stop Loss Adherence */}
        <StopLossAdherenceChart adherenceData={stats.stopLossAdherence} />
      </ChartWrapper>
      
      {/* Drawdown Analysis - Full width for this one */}
      <ChartWrapper mdCols={1}>
        <DrawdownAnalysisChart drawdownData={stats.drawdownAnalysis} />
      </ChartWrapper>
      
      {/* NEUER ABSCHNITT: Position Size Optimization */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Positionsgrößen-Optimierung</h3>
      </div>
      
      {/* NEUE KOMPONENTE: Position Size Optimization Panel */}
      <ChartWrapper mdCols={1}>
        <PositionSizeOptimizationPanel trades={timeFilteredTrades} />
      </ChartWrapper>
      
      {/* Asset Performance Table */}
      <AssetPerformanceTable 
        assetData={stats.assetPnL} 
        currency={currency} 
      />
    </>
  );
};

export default StatisticsPanel;