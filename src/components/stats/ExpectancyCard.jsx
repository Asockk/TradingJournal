import React from 'react';
import { Card, CardContent } from '../ui/card';
import { TrendingUp } from 'lucide-react';

const ExpectancyCard = ({ expectancy, avgWin, avgLoss, winRate, currency }) => {
  const isPositive = expectancy > 0;
  
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-dark-muted flex items-center">
          <TrendingUp size={16} className="mr-1 text-blue-500 dark:text-blue-400" />
          Erwartungswert pro Trade
        </h3>
        <p className={`text-2xl font-bold mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {expectancy >= 0 ? '+' : ''}{expectancy.toFixed(2)} {currency}
        </p>
        <div className="mt-2 space-y-1 text-xs text-gray-500 dark:text-dark-muted">
          <div className="flex justify-between">
            <span>Ø Gewinn:</span>
            <span className="text-green-600">+{avgWin.toFixed(2)} {currency}</span>
          </div>
          <div className="flex justify-between">
            <span>Ø Verlust:</span>
            <span className="text-red-600">{avgLoss.toFixed(2)} {currency}</span>
          </div>
          <div className="flex justify-between">
            <span>Win Rate:</span>
            <span>{winRate.toFixed(1)}%</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-dark-border">
          <p className="text-xs text-gray-500 dark:text-dark-muted">
            {isPositive 
              ? 'Dein Trading-System ist profitabel' 
              : 'Dein Trading-System braucht Verbesserung'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpectancyCard;