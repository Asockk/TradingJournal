// src/components/charts/StopLossAdherenceChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent } from '../ui/card';

const StopLossAdherenceChart = ({ adherenceData }) => {
  if (!adherenceData || !adherenceData.data || adherenceData.data.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <h3 className="text-base font-medium mb-2">Stop-Loss Einhaltung</h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Nicht genügend Daten verfügbar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { data, insights } = adherenceData;
  
  // Colors for the pie chart segments
  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">{`${data.value} Trades (${data.percentage.toFixed(1)}%)`}</p>
          <p className="text-sm text-gray-600">{data.description}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-base font-medium mb-2">Stop-Loss Einhaltung</h3>
        <div className="h-64 flex items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-3 text-sm text-gray-600">
          <p>{insights.description}</p>
          
          {insights.mainInsight && (
            <div className="mt-2 p-3 rounded-md bg-blue-50 text-blue-800">
              <p className="font-medium">Trading-Tipp:</p>
              <p>{insights.mainInsight}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StopLossAdherenceChart;