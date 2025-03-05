import React from 'react';
import { Calendar, CircleCheck, TrendingUp, Activity, Flame, Clock, BarChart2, Cloud } from 'lucide-react';

const AlphaTraderCards = ({ stats, currency }) => {
  // Sicherheitsüberprüfungen für alle Statistiken
  const profitFactor = stats.profitFactor !== undefined ? stats.profitFactor : 0;
  const sharpe = stats.sharpe !== undefined ? stats.sharpe : 0;
  const sortino = stats.sortino !== undefined ? stats.sortino : 0;
  
  // Streaks
  const hasStreaks = stats.streaks && 
    stats.streaks.maxWinStreak !== undefined && 
    stats.streaks.maxLossStreak !== undefined;
  
  // Plan stats
  const hasPlanStats = stats.planStats && 
    stats.planStats.followedPlanCount !== undefined && 
    stats.planStats.notFollowedPlanCount !== undefined;
  
  const planFollowPercent = hasPlanStats && 
    (stats.planStats.followedPlanCount + stats.planStats.notFollowedPlanCount > 0) ? 
    ((stats.planStats.followedPlanCount / 
     (stats.planStats.followedPlanCount + stats.planStats.notFollowedPlanCount)) * 100) : 0;
  
  const planPnLDiff = hasPlanStats && 
    stats.planStats.followedPlanStats && 
    stats.planStats.notFollowedPlanStats ? 
    (stats.planStats.followedPlanStats.avgPnL - stats.planStats.notFollowedPlanStats.avgPnL) : null;
  
  // Weekday stats
  const hasWeekdayStats = stats.weekdayStats && stats.weekdayStats.bestWeekday;
  
  const bestWeekdayWinRate = hasWeekdayStats && stats.weekdayStats.weekdayStats ? 
    stats.weekdayStats.weekdayStats.find(s => s.day === stats.weekdayStats.bestWeekday)?.winRate : null;
  
  // Duration stats
  const hasDurationStats = stats.durationStats && stats.durationStats.bestDuration;
  
  const bestDurationAvgPnL = hasDurationStats && stats.durationStats.durationStats ? 
    stats.durationStats.durationStats.find(s => s.label === stats.durationStats.bestDuration)?.avgPnL : null;
  
  // Trade type stats
  const hasTradeTypeStats = stats.tradeTypeStats && stats.tradeTypeStats.length > 0;
  
  // Market condition stats
  const hasMarketConditionStats = stats.marketConditionStats && stats.marketConditionStats.length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Profit Factor */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 flex items-center">
          <Activity size={16} className="mr-1 text-blue-500" />
          Profit Factor
        </h3>
        <p className="text-2xl font-bold mt-1">{profitFactor.toFixed(2)}</p>
        <p className="text-sm text-gray-500 mt-1">
          Verhältnis Gewinne/Verluste
        </p>
      </div>
      
      {/* Streaks */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 flex items-center">
          <Flame size={16} className="mr-1 text-blue-500" />
          Win/Loss Streaks
        </h3>
        <p className="text-2xl font-bold mt-1">
          {hasStreaks ? `${stats.streaks.maxWinStreak} / ${stats.streaks.maxLossStreak}` : 'N/A'}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Beste Gewinn-/Verluststrecken
        </p>
      </div>
      
      {/* Sharpe & Sortino */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 flex items-center">
          <TrendingUp size={16} className="mr-1 text-blue-500" />
          Sharpe / Sortino
        </h3>
        <p className="text-2xl font-bold mt-1">{sharpe.toFixed(2)} / {sortino.toFixed(2)}</p>
        <p className="text-sm text-gray-500 mt-1">
          Risikoadjustierte Rendite
        </p>
      </div>
      
      {/* Plan Followed */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 flex items-center">
          <CircleCheck size={16} className="mr-1 text-blue-500" />
          Plan befolgt
        </h3>
        <p className="text-2xl font-bold mt-1">
          {hasPlanStats && stats.planStats.followedPlanCount > 0 ? 
            `${planFollowPercent.toFixed(1)}%` : 
            'N/A'}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {planPnLDiff !== null ? 
            `${planPnLDiff > 0 ? '+' : ''}${planPnLDiff.toFixed(2)} ${currency}/Trade` : 
            'Keine Daten'}
        </p>
      </div>
      
      {/* Best Weekday */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 flex items-center">
          <Calendar size={16} className="mr-1 text-blue-500" />
          Bester Wochentag
        </h3>
        <p className="text-2xl font-bold mt-1">{hasWeekdayStats ? stats.weekdayStats.bestWeekday : 'N/A'}</p>
        <p className="text-sm text-gray-500 mt-1">
          {bestWeekdayWinRate !== null ? `${bestWeekdayWinRate.toFixed(1)}% Winrate` : 'Keine Daten'}
        </p>
      </div>
      
      {/* Best Duration */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 flex items-center">
          <Clock size={16} className="mr-1 text-blue-500" />
          Beste Trade-Dauer
        </h3>
        <p className="text-2xl font-bold mt-1">{hasDurationStats ? stats.durationStats.bestDuration : 'N/A'}</p>
        <p className="text-sm text-gray-500 mt-1">
          {bestDurationAvgPnL !== null ? `${bestDurationAvgPnL.toFixed(2)} ${currency}/Trade` : 'Keine Daten'}
        </p>
      </div>
      
      {/* Best Trade Type */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 flex items-center">
          <BarChart2 size={16} className="mr-1 text-blue-500" />
          Beste Strategie
        </h3>
        <p className="text-2xl font-bold mt-1">{hasTradeTypeStats ? stats.tradeTypeStats[0]?.type || 'N/A' : 'N/A'}</p>
        <p className="text-sm text-gray-500 mt-1">
          {hasTradeTypeStats && stats.tradeTypeStats[0] ? 
            `${stats.tradeTypeStats[0].avgPnL.toFixed(2)} ${currency}/Trade` : 
            'Keine Daten'}
        </p>
      </div>
      
      {/* Best Market Condition */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 flex items-center">
          <Cloud size={16} className="mr-1 text-blue-500" />
          Beste Marktbedingung
        </h3>
        <p className="text-2xl font-bold mt-1">
          {hasMarketConditionStats ? stats.marketConditionStats[0]?.condition || 'N/A' : 'N/A'}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {hasMarketConditionStats && stats.marketConditionStats[0] ? 
            `${stats.marketConditionStats[0].winRate.toFixed(1)}% Winrate` : 
            'Keine Daten'}
        </p>
      </div>
    </div>
  );
};

export default AlphaTraderCards;