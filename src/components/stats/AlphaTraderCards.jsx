import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Calendar, CheckCircle2, TrendingUp, Activity, Flame, Clock, BarChart2, Cloud } from 'lucide-react';

const StatisticCard = ({ title, value, subValue, icon }) => {
  const Icon = icon;
  
  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-gray-500 flex items-center">
          {Icon && <Icon size={16} className="mr-1 text-blue-500" />}
          {title}
        </h3>
        <p className="text-2xl font-bold mt-1">{value || 'N/A'}</p>
        {subValue && <p className="text-sm text-gray-500 mt-1">{subValue}</p>}
      </CardContent>
    </Card>
  );
};

const AlphaTraderCards = ({ stats, currency }) => {
  if (!stats) return null;
  
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
      <StatisticCard
        title="Profit Factor"
        value={profitFactor.toFixed(2)}
        subValue="Verhältnis Gewinne/Verluste"
        icon={Activity}
      />
      
      <StatisticCard
        title="Win/Loss Streaks"
        value={hasStreaks ? `${stats.streaks.maxWinStreak} / ${stats.streaks.maxLossStreak}` : 'N/A'}
        subValue="Beste Gewinn-/Verluststrecken"
        icon={Flame}
      />
      
      <StatisticCard
        title="Sharpe / Sortino"
        value={`${sharpe.toFixed(2)} / ${sortino.toFixed(2)}`}
        subValue="Risikoadjustierte Rendite"
        icon={TrendingUp}
      />
      
      <StatisticCard
        title="Plan befolgt"
        value={hasPlanStats && stats.planStats.followedPlanCount > 0 ? 
          `${planFollowPercent.toFixed(1)}%` : 'N/A'}
        subValue={planPnLDiff !== null ? 
          `${planPnLDiff > 0 ? '+' : ''}${planPnLDiff.toFixed(2)} ${currency}/Trade` : 
          'Keine Daten'}
        icon={CheckCircle2}
      />
      
      <StatisticCard
        title="Bester Wochentag"
        value={hasWeekdayStats ? stats.weekdayStats.bestWeekday : 'N/A'}
        subValue={bestWeekdayWinRate !== null ? `${bestWeekdayWinRate.toFixed(1)}% Winrate` : 'Keine Daten'}
        icon={Calendar}
      />
      
      <StatisticCard
        title="Beste Trade-Dauer"
        value={hasDurationStats ? stats.durationStats.bestDuration : 'N/A'}
        subValue={bestDurationAvgPnL !== null ? `${bestDurationAvgPnL.toFixed(2)} ${currency}/Trade` : 'Keine Daten'}
        icon={Clock}
      />
      
      <StatisticCard
        title="Beste Strategie"
        value={hasTradeTypeStats ? stats.tradeTypeStats[0]?.type || 'N/A' : 'N/A'}
        subValue={hasTradeTypeStats && stats.tradeTypeStats[0] ? 
          `${stats.tradeTypeStats[0].avgPnL.toFixed(2)} ${currency}/Trade` : 
          'Keine Daten'}
        icon={BarChart2}
      />
      
      <StatisticCard
        title="Beste Marktbedingung"
        value={hasMarketConditionStats ? stats.marketConditionStats[0]?.condition || 'N/A' : 'N/A'}
        subValue={hasMarketConditionStats && stats.marketConditionStats[0] ? 
          `${stats.marketConditionStats[0].winRate.toFixed(1)}% Winrate` : 
          'Keine Daten'}
        icon={Cloud}
      />
    </div>
  );
};

export default AlphaTraderCards;