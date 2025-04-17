// src/components/charts/DrawdownAnalysisChart.jsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent } from '../ui/card';

const DrawdownAnalysisChart = ({ drawdownData }) => {
  if (!drawdownData || !drawdownData.equityCurve || drawdownData.equityCurve.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <h3 className="text-base font-medium mb-2">Drawdown-Analyse</h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Nicht genügend Daten verfügbar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { equityCurve, drawdowns, insights } = drawdownData;
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      // Find if this point is in a drawdown
      const activeDrawdown = drawdowns.find(dd => 
        new Date(dd.startDate) <= new Date(data.date) && 
        new Date(dd.endDate) >= new Date(data.date)
      );
      
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{data.date}</p>
          <p className="text-sm">{`Equity: ${data.value.toFixed(2)}`}</p>
          {activeDrawdown && (
            <>
              <p className="text-sm text-red-600 font-medium">In Drawdown:</p>
              <p className="text-sm">{`Tiefe: ${activeDrawdown.depthPercentage.toFixed(1)}%`}</p>
              <p className="text-sm">{`Dauer: ${activeDrawdown.durationDays} Tage`}</p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-base font-medium mb-2">Drawdown-Analyse</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={equityCurve}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Draw reference lines for major drawdowns */}
              {drawdowns
                .filter(dd => dd.depthPercentage > 5) // Only show significant drawdowns
                .map((dd, index) => (
                  <ReferenceLine 
                    key={`dd-${index}`}
                    x={dd.lowestPointDate} 
                    stroke="#ef4444" 
                    strokeDasharray="3 3" 
                  />
                ))
              }
              
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-3 text-sm">
          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[200px] p-3 bg-red-50 text-red-800 rounded-md">
              <p className="font-medium">Maximaler Drawdown</p>
              <p className="text-xl font-bold">{insights.maxDrawdownPercentage.toFixed(1)}%</p>
              <p className="text-sm">Dauer: {insights.maxDrawdownDuration} Tage</p>
              <p className="text-sm">Erholung: {insights.maxDrawdownRecovery || 'Noch nicht erholt'}</p>
            </div>
            
            <div className="flex-1 min-w-[200px] p-3 bg-amber-50 text-amber-800 rounded-md">
              <p className="font-medium">Durchschnittlicher Drawdown</p>
              <p className="text-xl font-bold">{insights.avgDrawdownPercentage.toFixed(1)}%</p>
              <p className="text-sm">Durchschn. Dauer: {insights.avgDrawdownDuration} Tage</p>
              <p className="text-sm">Anzahl: {drawdowns.length} Drawdowns</p>
            </div>
          </div>
          
          <p className="mt-3">{insights.summary}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DrawdownAnalysisChart;