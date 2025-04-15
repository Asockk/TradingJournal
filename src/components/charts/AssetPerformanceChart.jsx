import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '../ui/card';

const AssetPerformanceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <h3 className="text-base font-medium mb-4">Asset Performance</h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Keine Daten verfügbar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-base font-medium mb-4">Asset Performance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 5, bottom: 20, left: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="asset" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`${value.toFixed(2)}`, `PnL`]} 
                labelFormatter={(label) => `Asset: ${label}`}
              />
              <Bar 
                dataKey="totalPnL" 
                fill="#3B82F6" 
                name="PnL"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetPerformanceChart;