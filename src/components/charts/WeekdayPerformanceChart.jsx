import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const WeekdayPerformanceChart = ({ weekdayStats }) => {
  if (!weekdayStats || !weekdayStats.weekdayStats) return null;

  // Nur Tage mit Trades anzeigen
  const data = weekdayStats.weekdayStats
    .filter(day => day.count > 0)
    .map(day => ({
      ...day,
      dayShort: day.day.substring(0, 2) // Kürzere Namen für die X-Achse
    }));

  // Farben basierend auf PnL
  const getBarColor = (pnl) => {
    if (pnl > 0) return '#10b981'; // Grün für Gewinn
    return '#ef4444'; // Rot für Verlust
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <h3 className="text-base font-medium mb-2">Performance nach Wochentag</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="dayShort" 
              tickFormatter={(value) => value}
            />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'avgPnL') return [`${value.toFixed(2)}`, 'Durchschn. PnL'];
                if (name === 'winRate') return [`${value.toFixed(1)}%`, 'Winrate'];
                return [value, name];
              }}
              labelFormatter={(label) => {
                const day = data.find(d => d.dayShort === label);
                return `${day.day} (${day.count} Trades)`;
              }}
            />
            <Bar 
              dataKey="avgPnL" 
              yAxisId="left"
              name="Durchschn. PnL" 
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.avgPnL)} />
              ))}
            </Bar>
            <Bar 
              dataKey="winRate" 
              yAxisId="right"
              name="Winrate" 
              fill="#9ca3af"
              radius={[4, 4, 0, 0]}
              fillOpacity={0.4}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {weekdayStats.bestWeekday && weekdayStats.worstWeekday && (
        <div className="mt-3 text-sm text-gray-600">
          <p>Bester Wochentag: <span className="font-medium">{weekdayStats.bestWeekday}</span></p>
          <p>Schlechtester Wochentag: <span className="font-medium">{weekdayStats.worstWeekday}</span></p>
        </div>
      )}
    </div>
  );
};

export default WeekdayPerformanceChart;