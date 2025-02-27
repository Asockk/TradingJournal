import React from 'react';
import { getWinRateColor, getContrastTextColor, getHourlyInsights } from '../../utils/timeStatsUtils';

const HourlyPerformanceHeatmap = ({ hourlyData }) => {
  const insights = getHourlyInsights(hourlyData);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <h3 className="text-base font-medium mb-2">Performance nach Uhrzeit</h3>
      
      <div className="grid grid-cols-6 gap-1 sm:gap-2 mb-4">
        {hourlyData.map((data) => (
          <div 
            key={data.hour}
            className="aspect-square flex flex-col items-center justify-center rounded-md relative overflow-hidden"
            style={{ 
              backgroundColor: getWinRateColor(data.winRate),
              color: getContrastTextColor(data.winRate)
            }}
          >
            <div className="text-xs sm:text-sm font-semibold">{data.displayHour}</div>
            {data.tradeCount > 0 && (
              <>
                <div className="text-xs font-bold">{data.winRate.toFixed(0)}%</div>
                <div className="text-xs opacity-75">{data.tradeCount} trades</div>
              </>
            )}
            {data.tradeCount === 0 && (
              <div className="text-xs opacity-75">No data</div>
            )}
          </div>
        ))}
      </div>
      
      <div className="text-sm text-gray-600 mt-2">
        {insights.description}
      </div>
      
      <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-sm mr-1" style={{ backgroundColor: getWinRateColor(20) }}></span>
          <span>Niedrige Winrate</span>
        </div>
        <div className="h-1 w-24 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded mx-2"></div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-sm mr-1" style={{ backgroundColor: getWinRateColor(70) }}></span>
          <span>Hohe Winrate</span>
        </div>
      </div>
    </div>
  );
};

export default HourlyPerformanceHeatmap;