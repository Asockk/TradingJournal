import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DurationPerformanceChart = ({ durationStats }) => {
  if (!durationStats || !durationStats.durationStats) {
    return (
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-base font-medium mb-2">Trade-Dauer Performance</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Nicht genügend Daten verfügbar</p>
        </div>
      </div>
    );
  }

  // Bereinige Daten und sortiere nach der natürlichen Reihenfolge der Dauer
  const validData = durationStats.durationStats.filter(d => d.count > 0);
  
  // Natürliche Reihenfolge von Dauern definieren
  const durationOrder = [
    'Intraday',
    '1-3 Tage',
    '4-7 Tage',
    '1-2 Wochen',
    '2-4 Wochen',
    '1-3 Monate',
    '3+ Monate'
  ];
  
  // Sortierte Daten
  const sortedData = [...validData].sort((a, b) => 
    durationOrder.indexOf(a.label) - durationOrder.indexOf(b.label)
  );

  // Farben basierend auf PnL
  const getBarColor = (pnl) => {
    if (pnl > 0) return '#10b981'; // Grün für Gewinn
    return '#ef4444'; // Rot für Verlust
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <h3 className="text-base font-medium mb-2">Trade-Dauer Performance</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="label" 
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{ fontSize: 12 }}
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
                if (name === 'count') return [value, 'Anzahl Trades'];
                return [value, name];
              }}
              labelFormatter={(label) => `Dauer: ${label}`}
            />
            <Bar 
              dataKey="avgPnL" 
              yAxisId="left"
              name="avgPnL" 
              radius={[4, 4, 0, 0]}
            >
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.avgPnL)} />
              ))}
            </Bar>
            <Bar 
              dataKey="winRate" 
              yAxisId="right"
              name="winRate" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              fillOpacity={0.6}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {durationStats.bestDuration && (
        <div className="mt-3 text-sm text-gray-600">
          <p>
            Beste Trade-Dauer: <span className="font-medium">{durationStats.bestDuration}</span>
          </p>
          {sortedData.find(d => d.label === durationStats.bestDuration) && (
            <p>
              Ø PnL: <span className={`font-medium ${
                sortedData.find(d => d.label === durationStats.bestDuration).avgPnL > 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {sortedData.find(d => d.label === durationStats.bestDuration).avgPnL.toFixed(2)}
              </span>, 
              Winrate: <span className="font-medium">
                {sortedData.find(d => d.label === durationStats.bestDuration).winRate.toFixed(1)}%
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DurationPerformanceChart;