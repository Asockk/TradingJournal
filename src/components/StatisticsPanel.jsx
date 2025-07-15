// src/components/StatisticsPanel.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import StatisticsCards from './stats/StatisticsCards';
import AlphaTraderCards from './stats/AlphaTraderCards';
import AssetPerformanceTable from './stats/AssetPerformanceTable';
import PeriodComparisonCard from './stats/PeriodComparisonCard';
import PositionSizeOptimizationPanel from './stats/PositionSizeOptimizationPanel';
import { calculateExpectedValuePerformance, calculateRMultiplePerformance } from '../utils/expectedValueStats';
import { calculateStats } from '../utils/statsCalculations';
import { ArrowLeft } from 'lucide-react';
// Import memoized charts
import {
  EquityChart,
  AssetPerformanceChart,
  HourlyPerformanceHeatmap,
  ConvictionPerformanceChart,
  WeekdayPerformanceChart,
  PlanFollowedChart,
  TradeTypePerformanceChart,
  DurationPerformanceChart,
  EmotionPerformanceChart,
  EmotionTransitionChart,
  RiskRewardComparisonChart,
  StopLossAdherenceChart,
  DrawdownAnalysisChart,
  ExpectedValuePerformanceChart
} from './charts';

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
  console.log("StatisticsPanel wird gerendert - KORRIGIERTE VERSION");
  
  // Zeitraum-Auswahl (Standard: "All")
  const [timeRange, setTimeRange] = useState('all');
  const [prevStats, setPrevStats] = useState(null);
  const [hasNoData, setHasNoData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Debug-Logging für Zeitraum-Änderungen
  useEffect(() => {
    console.log("Zeitraum geändert:", timeRange);
  }, [timeRange]);
  
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
    console.log("Berechnete Statistiken:", calculatedStats ? "Verfügbar" : "Nicht verfügbar");
    return calculatedStats;
  }, [timeFilteredTrades]);

  // Expected Value Analyse
  const evStats = React.useMemo(() => {
    if (!timeFilteredTrades.length) return null;
    return calculateExpectedValuePerformance(timeFilteredTrades);
  }, [timeFilteredTrades]);

  const rMultipleStats = React.useMemo(() => {
    if (!timeFilteredTrades.length) return null;
    return calculateRMultiplePerformance(timeFilteredTrades);
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

  // Stelle sicher, dass wir immer ein stats-Objekt haben
  const safeStats = stats || {
    cumulativePnL: [],
    assetPnL: [],
    emotionPerformance: [],
    emotionTransitions: {},
    planStats: {},
    tradeTypeStats: [],
    weekdayStats: {},
    durationStats: {},
    hourlyPerformance: [],
    convictionPerformance: [],
    riskRewardComparison: { distribution: [] },
    stopLossAdherence: { data: [] },
    drawdownAnalysis: { equityCurve: [] }
  };

  return (
    <>
      {/* Zeitraum-Auswahl */}
      <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
      
      {/* KPI Cards */}
      <StatisticsCards stats={safeStats} currency={currency} />
      
      {/* Period Comparison (neu) */}
      {prevStats && timeRange !== 'all' && (
        <PeriodComparisonCard 
          currentStats={safeStats} 
          prevStats={prevStats} 
          timeRange={timeRange} 
          currency={currency} 
        />
      )}
      
      {/* Alpha Trader Cards */}
      <AlphaTraderCards stats={safeStats} currency={currency} />
      
      {/* Charts and Detailed Stats */}
      <ChartWrapper mdCols={2}>
        {/* Equity Curve */}
        <EquityChart data={safeStats.cumulativePnL} />
        
        {/* Asset Performance */}
        <AssetPerformanceChart data={safeStats.assetPnL.slice(0, 10)} />
      </ChartWrapper>

      {/* Expected Value Analyse */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Erwartungswert-Analyse</h3>
      </div>
      
      <ChartWrapper mdCols={2}>
        {/* Expected Value Performance Chart */}
        <ExpectedValuePerformanceChart evData={evStats} />
        
        {/* R-Multiple Übersicht */}
        <Card className="bg-white">
          <CardContent className="p-4">
            <h3 className="text-base font-medium mb-2">R-Multiple Performance</h3>
            
            {rMultipleStats && rMultipleStats.rRanges.length > 0 ? (
              <>
                <table className="min-w-full divide-y divide-gray-200 mt-2">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">R-Bereich</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Trades</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Winrate</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Ø PnL</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rMultipleStats.rRanges.map((range, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm">{range.range}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-center">{range.count}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-center">{range.winRate.toFixed(1)}%</td>
                        <td className={`px-3 py-2 whitespace-nowrap text-sm text-right font-medium ${
                          range.avgPnL > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {range.avgPnL.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md">
                  <p className="text-sm">
                    <strong>Durchschnittliches R-Multiple:</strong> {rMultipleStats.averageRMultiple.toFixed(2)}
                    {rMultipleStats.averageRMultiple > 0 
                      ? ' (positiv: Strategiemix ist profitabel)' 
                      : ' (negativ: Strategiemix ist nicht profitabel)'}
                  </p>
                  {rMultipleStats.bestPerformingRRange && (
                    <p className="text-sm mt-1">
                      <strong>Beste Performance:</strong> Trades mit {rMultipleStats.bestPerformingRRange} R-Multiple
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">Keine R-Multiple Daten verfügbar</p>
              </div>
            )}
          </CardContent>
        </Card>
      </ChartWrapper>
      
      {/* Emotion Analysis Charts */}
      <ChartWrapper mdCols={2}>
        {/* Emotion Performance Chart */}
        <EmotionPerformanceChart emotionData={safeStats.emotionPerformance} />
        
        {/* Emotion Transition Chart */}
        <EmotionTransitionChart transitionData={safeStats.emotionTransitions} />
      </ChartWrapper>
      
      {/* Alpha Trader Charts */}
      <ChartWrapper mdCols={2}>
        {/* Plan Followed Performance */}
        <PlanFollowedChart planStats={safeStats.planStats} />
        
        {/* Trade Type Performance */}
        <TradeTypePerformanceChart tradeTypeStats={safeStats.tradeTypeStats} />
      </ChartWrapper>
      
      {/* More Alpha Trader Charts */}
      <ChartWrapper mdCols={2}>
        {/* Weekday Performance Chart */}
        <WeekdayPerformanceChart weekdayStats={safeStats.weekdayStats} />
        
        {/* Duration Performance Chart */}
        <DurationPerformanceChart durationStats={safeStats.durationStats} />
      </ChartWrapper>
      
      {/* Statistics Charts */}
      <ChartWrapper mdCols={2}>
        {/* Hourly Performance Heatmap */}
        <HourlyPerformanceHeatmap hourlyData={safeStats.hourlyPerformance} />
        
        {/* Conviction Performance Chart */}
        <ConvictionPerformanceChart convictionData={safeStats.convictionPerformance} />
      </ChartWrapper>
      
      {/* RISK MANAGEMENT - IMMER ANZEIGEN */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Erweitertes Risikomanagement</h2>
        <p className="text-gray-600 text-sm mt-1">
          Analyse Ihrer Risk-Reward Verhältnisse, Stop-Loss Einhaltung und Drawdowns
        </p>
      </div>
      
      <ChartWrapper mdCols={2}>
        {/* Risk-Reward Comparison */}
        <RiskRewardComparisonChart comparisonData={safeStats.riskRewardComparison} />
        
        {/* Stop Loss Adherence */}
        <StopLossAdherenceChart adherenceData={safeStats.stopLossAdherence} />
      </ChartWrapper>
      
      {/* Drawdown Analysis - Full width for this one */}
      <ChartWrapper mdCols={1}>
        <DrawdownAnalysisChart drawdownData={safeStats.drawdownAnalysis} />
      </ChartWrapper>
      
      {/* POSITIONS-GRÖSSEN OPTIMIERUNG*/}      
      <ChartWrapper mdCols={1}>
        <PositionSizeOptimizationPanel trades={timeFilteredTrades} />
      </ChartWrapper>
      
      {/* Asset Performance Table - IMMER ANZEIGEN */}
      <AssetPerformanceTable 
        assetData={safeStats.assetPnL} 
        currency={currency} 
      />
      
      {/* DEBUG-INFORMATION */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-500">
        <p>Debug: Anzeige-Version 1.0 | Zeitraum: {timeRange} | Trades: {timeFilteredTrades.length}</p>
        <p>Stats berechnet: {stats ? "Ja" : "Nein"} | Komponenten: Mit unbedingtem Rendering</p>
      </div>
    </>
  );
};

export default StatisticsPanel;