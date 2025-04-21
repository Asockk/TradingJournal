import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Legend } from 'recharts';

/**
 * Component for visualizing the accuracy of Expected Value predictions
 * Compares expected win rates with actual results
 */
const ExpectedValuePerformanceChart = ({ evData }) => {
  if (!evData || !evData.evRanges || evData.evRanges.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-base font-medium mb-2">Expected Value Performance</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Keine ausreichenden Daten für die Analyse verfügbar</p>
        </div>
      </div>
    );
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{`EV Range: ${data.range}`}</p>
          <p className="text-sm text-gray-700">{`Trades: ${data.count}`}</p>
          <p className="text-sm text-gray-700">{`Erwartete Hitrate: ${data.expectedWinRate.toFixed(1)}%`}</p>
          <p className="text-sm text-gray-700">{`Tatsächliche Hitrate: ${data.actualWinRate.toFixed(1)}%`}</p>
          <p className={`text-sm font-medium ${data.avgPnL > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {`Durchschn. PnL: ${data.avgPnL.toFixed(2)}`}
          </p>
          <p className={`text-sm ${data.evAccuracy > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {`EV Genauigkeit: ${data.evAccuracy > 0 ? '+' : ''}${data.evAccuracy.toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <h3 className="text-base font-medium mb-2">Expected Value Performance</h3>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={evData.evRanges}
            margin={{ top: 10, right: 30, left: 10, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="range" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine y={0} yAxisId="left" stroke="#000" />
            
            <Bar 
              dataKey="expectedWinRate" 
              yAxisId="right"
              name="Erwartete Hitrate"
              fill="#94a3b8"
              fillOpacity={0.4}
            />
            
            <Bar 
              dataKey="actualWinRate" 
              yAxisId="right"
              name="Tatsächliche Hitrate"
              fill="#3b82f6"
            />
            
            <Bar 
              dataKey="evAccuracy" 
              yAxisId="left"
              name="EV Genauigkeit"
              radius={[4, 4, 0, 0]}
            >
              {evData.evRanges.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.evAccuracy > 0 ? '#10b981' : '#ef4444'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-3 text-sm text-gray-600">
        <p>
          Diese Analyse zeigt, wie präzise deine Gewinnwahrscheinlichkeits-Einschätzungen waren. 
          Eine hohe EV-Genauigkeit bedeutet, dass deine Prognosen zuverlässig sind.
        </p>
        
        {evData.overallBias > 5 && (
          <p className="mt-1 text-amber-600">
            <strong>Achtung:</strong> Du schätzt deine Gewinnchancen tendenziell zu hoch ein (um ca. {evData.overallBias.toFixed(1)}%).
          </p>
        )}
        
        {evData.overallBias < -5 && (
          <p className="mt-1 text-amber-600">
            <strong>Achtung:</strong> Du schätzt deine Gewinnchancen tendenziell zu niedrig ein (um ca. {Math.abs(evData.overallBias).toFixed(1)}%).
          </p>
        )}
        
        {Math.abs(evData.overallBias) <= 5 && (
          <p className="mt-1 text-green-600">
            <strong>Gut:</strong> Deine Gewinnwahrscheinlichkeits-Einschätzungen sind sehr ausgewogen.
          </p>
        )}
      </div>
    </div>
  );
};

export default ExpectedValuePerformanceChart;