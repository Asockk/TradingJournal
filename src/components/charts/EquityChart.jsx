import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '../ui/card';

const EquityChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <h3 className="text-base font-medium mb-4">Equity Curve</h3>
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
        <h3 className="text-base font-medium mb-4">Equity Curve</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`${value.toFixed(2)}`, `PnL`]} 
                labelFormatter={(label) => `Datum: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="pnl" 
                stroke="#3B82F6" 
                dot={{ r: 1 }} 
                activeDot={{ r: 5 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquityChart;