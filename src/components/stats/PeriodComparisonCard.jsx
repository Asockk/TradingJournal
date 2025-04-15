import React from 'react';
import { Card, CardContent } from '../ui/card';
import { TrendingUp, TrendingDown, History } from 'lucide-react';

const getPeriodName = (timeRange) => {
  switch (timeRange) {
    case '7d': return 'letzte 7 Tage';
    case '30d': return 'letzten 30 Tage';
    case '90d': return 'letzten 90 Tage';
    case 'ytd': return 'Jahr bis dato';
    default: return 'aktuelle Periode';
  }
};

const getPrevPeriodName = (timeRange) => {
  switch (timeRange) {
    case '7d': return 'vorherige 7 Tage';
    case '30d': return 'vorherigen 30 Tage';
    case '90d': return 'vorherigen 90 Tage';
    case 'ytd': return 'letztes Jahr';
    default: return 'vorherige Periode';
  }
};

const ComparisonCard = ({ title, value, subValue, icon, isPositive = true }) => {
  const Icon = icon;
  
  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="flex items-center mt-1">
          {Icon && <Icon className={`${isPositive ? 'text-green-500' : 'text-red-500'} mr-2`} size={20} />}
          <p className={`text-xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {value}
          </p>
        </div>
        {subValue && <p className="text-sm text-gray-500 mt-1">{subValue}</p>}
      </CardContent>
    </Card>
  );
};

const PeriodComparisonCard = ({ currentStats, prevStats, timeRange, currency }) => {
  // Keine Vergleiche, wenn keine Statistiken verfügbar sind
  if (!currentStats || !prevStats) return null;
  
  // Berechne prozentuale Veränderungen
  const pnlChange = currentStats.totalPnL !== 0 && prevStats.totalPnL !== 0 ? 
    ((currentStats.totalPnL - prevStats.totalPnL) / Math.abs(prevStats.totalPnL)) * 100 : 0;
  
  const winRateChange = currentStats.winRate - prevStats.winRate;
  
  const profitFactorChange = currentStats.profitFactor !== 0 && prevStats.profitFactor !== 0 ?
    ((currentStats.profitFactor - prevStats.profitFactor) / prevStats.profitFactor) * 100 : 0;
  
  // Entscheide, ob die Änderungen positiv oder negativ sind
  const isPnlChangePositive = pnlChange > 0;
  const isWinRateChangePositive = winRateChange > 0;
  const isProfitFactorChangePositive = profitFactorChange > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-white">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-500 flex items-center">
            <History size={16} className="mr-1 text-blue-500" />
            Perioden-Vergleich
          </h3>
          <p className="text-sm text-gray-700 mt-2">
            Vergleich der {getPeriodName(timeRange)} mit den {getPrevPeriodName(timeRange)}
          </p>
        </CardContent>
      </Card>
      
      <ComparisonCard
        title="Total PnL-Änderung"
        value={`${isPnlChangePositive ? '+' : ''}${pnlChange.toFixed(1)}%`}
        subValue={`${currentStats.totalPnL.toFixed(2)} ${currency} vs. ${prevStats.totalPnL.toFixed(2)} ${currency}`}
        icon={isPnlChangePositive ? TrendingUp : TrendingDown}
        isPositive={isPnlChangePositive}
      />
      
      <Card className="bg-white">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Performance-Metriken</h3>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <p className="text-xs text-gray-500">Winrate:</p>
              <p className={`font-medium ${isWinRateChangePositive ? 'text-green-600' : 'text-red-600'}`}>
                {isWinRateChangePositive ? '+' : ''}{winRateChange.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Profit Factor:</p>
              <p className={`font-medium ${isProfitFactorChangePositive ? 'text-green-600' : 'text-red-600'}`}>
                {isProfitFactorChangePositive ? '+' : ''}{profitFactorChange.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PeriodComparisonCard;