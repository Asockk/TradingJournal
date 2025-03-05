import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

const TradeTypePerformanceChart = ({ tradeTypeStats }) => {
  if (!tradeTypeStats || tradeTypeStats.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-base font-medium mb-2">Trade-Typ Performance</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Nicht genügend Daten verfügbar</p>
        </div>
      </div>
    );
  }

  // Sortiere nach durchschnittlichem PnL
  const sortedData = [...tradeTypeStats]
    .sort((a, b) => b.avgPnL - a.avgPnL)
    .slice(0, 6); // Begrenze auf die 6 besten/schlechtesten

  // Farben basierend auf PnL
  const getBarColor = (pnl) => {
    if (pnl > 0) return '#10b981'; // Grün für Gewinn
    return '#ef4444'; // Rot für Verlust
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <h3 className="text-base font-medium mb-2">Trade-Typ Performance</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" />
            <YAxis 
              dataKey="type" 
              type="category" 
              width={120}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'Avg PnL') return [`${value.toFixed(2)}`, 'Durchschn. PnL'];
                if (name === 'Winrate') return [`${value.toFixed(1)}%`, 'Winrate'];
                return [value, name];
              }}
              labelFormatter={(label) => `Strategie: ${label}`}
            />
            <Bar 
              dataKey="avgPnL" 
              name="Avg PnL" 
              radius={[0, 4, 4, 0]}
            >
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.avgPnL)} />
              ))}
              <LabelList dataKey="count" position="right" formatter={(value) => `${value} Trades`} />
            </Bar>
            <Bar 
              dataKey="winRate" 
              name="Winrate" 
              fill="#3b82f6"
              radius={[0, 4, 4, 0]}
              fillOpacity={0.6}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {sortedData.length > 0 && (
        <div className="mt-3 text-sm text-gray-600">
          <p>
            Beste Strategie: <span className="font-medium">{sortedData[0].type}</span> 
            {sortedData[0].count > 1 && ` (${sortedData[0].count} Trades)`}
          </p>
          <p>
            Ø PnL: <span className={`font-medium ${sortedData[0].avgPnL > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {sortedData[0].avgPnL.toFixed(2)}
            </span>, 
            Winrate: <span className="font-medium">{sortedData[0].winRate.toFixed(1)}%</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default TradeTypePerformanceChart;