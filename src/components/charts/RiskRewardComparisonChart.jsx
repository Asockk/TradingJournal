// src/components/charts/RiskRewardComparisonChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, ReferenceLine } from 'recharts';
import { Card, CardContent } from '../ui/card';

const RiskRewardComparisonChart = ({ comparisonData }) => {
  if (!comparisonData || !comparisonData.distribution) {
    return (
      <Card>
        <CardContent className="p-4">
          <h3 className="text-base font-medium mb-2">Risk-Reward Vergleich</h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Nicht genügend Daten verfügbar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { distribution, averages, categories } = comparisonData;
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm">{`Trades: ${data.count} (${data.percentage.toFixed(1)}%)`}</p>
          <p className="text-sm">{`Ø Erwartet: ${data.avgExpected.toFixed(2)}`}</p>
          <p className="text-sm">{`Ø Tatsächlich: ${data.avgActual.toFixed(2)}`}</p>
          <p className="text-sm text-gray-600">{`Differenz: ${data.averageDifference > 0 ? '+' : ''}${data.averageDifference.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  // Get color based on performance category
  const getCategoryColor = (category) => {
    switch(category) {
      case 'Besser als erwartet': return '#10b981'; // Green
      case 'Wie erwartet': return '#6366f1';       // Indigo
      case 'Schlechter als erwartet': return '#f59e0b'; // Amber
      case 'Stop Loss gerissen': return '#ef4444';    // Red
      default: return '#9ca3af';                    // Gray
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-base font-medium mb-2">Risk-Reward Vergleich</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={distribution}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="category" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine y={0} stroke="#000" />
              <Bar 
                dataKey="averageDifference" 
                name="R:R Differenz" 
                yAxisId="left"
                radius={[4, 4, 0, 0]}
              >
                {distribution.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getCategoryColor(entry.category)} 
                  />
                ))}
              </Bar>
              <Bar 
                dataKey="percentage" 
                name="% der Trades" 
                yAxisId="right" 
                fill="#94a3b8"
                radius={[4, 4, 0, 0]}
                fillOpacity={0.4}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-3 text-sm text-gray-600">
          <p>
            Durchschnittlich geplantes R:R: <span className="font-medium">{averages.expectedRR.toFixed(2)}</span>, 
            tatsächlich erreicht: <span className="font-medium">{averages.actualRR.toFixed(2)}</span>
          </p>
          <p className="mt-1">
            <span className="font-medium">{categories.betterCount}</span> Trades ({categories.betterPercentage.toFixed(1)}%) haben ein besseres R:R als geplant erreicht, 
            <span className="font-medium"> {categories.worseCount}</span> ({categories.worsePercentage.toFixed(1)}%) ein schlechteres.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskRewardComparisonChart;