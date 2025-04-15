// src/components/charts/EmotionPerformanceChart.jsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { getEmotionColor, getEmotionInsights } from '../../utils/emotionStatsUtils';

const EmotionPerformanceChart = ({ emotionData }) => {
  if (!emotionData || emotionData.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-base font-medium mb-2">Performance nach emotionalem Zustand</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Keine Daten verfügbar</p>
        </div>
      </div>
    );
  }

  const insights = getEmotionInsights(emotionData);
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{`Emotion: ${data.title}`}</p>
          <p className="text-sm text-gray-700">{`Trades: ${data.tradeCount}`}</p>
          <p className="text-sm text-gray-700">{`Winrate: ${data.winRate.toFixed(1)}%`}</p>
          <p className={`text-sm font-medium ${data.averagePnL > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {`Durchschn. PnL: ${data.averagePnL.toFixed(2)}`}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <h3 className="text-base font-medium mb-2">Performance nach emotionalem Zustand (Pre-Trade)</h3>
      
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={emotionData}
            margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
            barSize={36}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="title" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              orientation="left" 
              label={{ 
                value: 'Winrate (%)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: 12, fill: '#6b7280' }
              }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right" 
              label={{ 
                value: 'Trades', 
                angle: -90, 
                position: 'insideRight', 
                style: { textAnchor: 'middle', fontSize: 12, fill: '#6b7280' }
              }}
              domain={[0, 'dataMax + 5']}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={50} yAxisId="left" stroke="#9ca3af" strokeDasharray="3 3" />
            <Bar 
              dataKey="winRate" 
              yAxisId="left"
              name="Winrate"
              radius={[4, 4, 0, 0]}
            >
              {emotionData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getEmotionColor('pre', entry.level)} 
                  fillOpacity={entry.tradeCount === 0 ? 0.3 : 0.8}
                />
              ))}
            </Bar>
            <Bar 
              dataKey="tradeCount" 
              yAxisId="right"
              name="Anzahl Trades"
              fill="#94a3b8"
              radius={[4, 4, 0, 0]}
              fillOpacity={0.4}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-sm text-gray-600 mt-3">
        {insights.description}
        {insights.bestEmotion && insights.bestPnLEmotion && insights.bestEmotion !== insights.bestPnLEmotion && (
          <div className="mt-1">
            <span className="font-medium">Höchste Gewinnrate:</span> {insights.bestEmotion.title} Gefühl ({insights.bestEmotion.winRate.toFixed(1)}% aus {insights.bestEmotion.tradeCount} Trades)
          </div>
        )}
        {insights.bestPnLEmotion && (
          <div className="mt-1">
            <span className="font-medium">Höchster Durchschnittsgewinn:</span> {insights.bestPnLEmotion.title} Gefühl ({insights.bestPnLEmotion.averagePnL.toFixed(2)})
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionPerformanceChart;