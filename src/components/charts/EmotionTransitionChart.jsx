// src/components/charts/EmotionTransitionChart.jsx

import React from 'react';
import { getTransitionInsights } from '../../utils/emotionStatsUtils';

const EmotionTransitionChart = ({ transitionData }) => {
  if (!transitionData || !transitionData.transitions || transitionData.transitions.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-base font-medium mb-2">Emotionale Übergänge</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Keine Daten verfügbar</p>
        </div>
      </div>
    );
  }

  const insights = getTransitionInsights(transitionData);
  const topTransitions = transitionData.transitions.slice(0, 5); // Top 5 most common transitions
  
  const getArrowColor = (change) => {
    if (change > 0) return 'text-green-600'; // Improved mood
    if (change < 0) return 'text-red-600';   // Worsened mood
    return 'text-blue-600';                  // Unchanged mood
  };
  
  const getArrowChar = (change) => {
    if (change > 0) return '↑';
    if (change < 0) return '↓';
    return '→';
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <h3 className="text-base font-medium mb-2">Emotionale Übergänge</h3>
      
      <div className="overflow-hidden">
        <div className="mb-4">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Übergang</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Trades</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Win Rate</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. PnL</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topTransitions.map((transition, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-medium">{transition.fromLabel}</span>
                      <span className={`mx-1 ${getArrowColor(transition.change)}`}>{getArrowChar(transition.change)}</span>
                      <span className="font-medium">{transition.toLabel}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right">{transition.tradeCount}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-right">{transition.winRate.toFixed(1)}%</td>
                  <td className={`px-4 py-2 whitespace-nowrap text-right ${
                    transition.averagePnL > 0 ? 'text-green-600' : transition.averagePnL < 0 ? 'text-red-600' : ''
                  }`}>
                    {transition.averagePnL.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transitionData.topPositive && (
            <div className="p-3 bg-green-50 text-green-800 rounded-md">
              <p className="font-medium">Beste Emotion-Kombination:</p>
              <div className="flex items-center mt-1">
                <span>{transitionData.topPositive.fromLabel}</span>
                <span className="mx-1">→</span>
                <span>{transitionData.topPositive.toLabel}</span>
                <span className="ml-2">({transitionData.topPositive.winRate.toFixed(1)}% WR, Ø {transitionData.topPositive.averagePnL.toFixed(2)})</span>
              </div>
            </div>
          )}
          
          {transitionData.topNegative && (
            <div className="p-3 bg-red-50 text-red-800 rounded-md">
              <p className="font-medium">Schlechteste Emotion-Kombination:</p>
              <div className="flex items-center mt-1">
                <span>{transitionData.topNegative.fromLabel}</span>
                <span className="mx-1">→</span>
                <span>{transitionData.topNegative.toLabel}</span>
                <span className="ml-2">({transitionData.topNegative.winRate.toFixed(1)}% WR, Ø {transitionData.topNegative.averagePnL.toFixed(2)})</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-sm text-gray-600 mt-3">
        <p>{insights.description}</p>
      </div>
    </div>
  );
};

export default EmotionTransitionChart;