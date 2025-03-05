import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const PlanFollowedChart = ({ planStats }) => {
  if (!planStats || (!planStats.followedPlanStats && !planStats.notFollowedPlanStats)) {
    return (
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-base font-medium mb-2">Plan-Befolgung Performance</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Nicht genügend Daten verfügbar</p>
        </div>
      </div>
    );
  }

  // Daten für das Chart vorbereiten
  const data = [
    {
      name: 'Plan befolgt',
      value: planStats.followedPlanStats ? planStats.followedPlanStats.count : 0,
      winRate: planStats.followedPlanStats ? planStats.followedPlanStats.winRate : 0,
      avgPnL: planStats.followedPlanStats ? planStats.followedPlanStats.avgPnL : 0,
      fill: '#10b981' // Grün
    },
    {
      name: 'Plan nicht befolgt',
      value: planStats.notFollowedPlanStats ? planStats.notFollowedPlanStats.count : 0,
      winRate: planStats.notFollowedPlanStats ? planStats.notFollowedPlanStats.winRate : 0,
      avgPnL: planStats.notFollowedPlanStats ? planStats.notFollowedPlanStats.avgPnL : 0,
      fill: '#f59e0b' // Gelb
    }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <h3 className="text-base font-medium mb-2">Plan-Befolgung Performance</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip 
              formatter={(value, name, props) => {
                if (name === 'Anzahl') return [value, 'Trades'];
                if (name === 'Winrate') return [`${value.toFixed(1)}%`, name];
                if (name === 'Durchschn. PnL') return [`${value.toFixed(2)}`, name];
                return [value, name];
              }}
            />
            <Legend />
            <Bar 
              dataKey="value" 
              name="Anzahl" 
              radius={[0, 4, 4, 0]}
              barSize={20}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
            <Bar 
              dataKey="winRate" 
              name="Winrate" 
              fill="#3b82f6"
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
            <Bar 
              dataKey="avgPnL" 
              name="Durchschn. PnL" 
              fill="#6366f1"
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-3 text-sm text-gray-600">
        <p className="font-medium">{planStats.conclusion}</p>
        {planStats.followedPlanStats && planStats.notFollowedPlanStats && (
          <p className="mt-1">
            Differenz im durchschnittlichen PnL: 
            <span className={`font-medium ${
              planStats.followedPlanStats.avgPnL > planStats.notFollowedPlanStats.avgPnL
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              {' '}{planStats.followedPlanStats.avgPnL > planStats.notFollowedPlanStats.avgPnL ? '+' : ''}
              {(planStats.followedPlanStats.avgPnL - planStats.notFollowedPlanStats.avgPnL).toFixed(2)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default PlanFollowedChart;