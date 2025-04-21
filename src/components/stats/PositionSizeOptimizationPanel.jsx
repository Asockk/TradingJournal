// src/components/stats/PositionSizeOptimizationPanel.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter, ZAxis, Legend, Cell } from 'recharts';
import { Card, CardContent } from '../ui/card';

const PositionSizeOptimizationPanel = ({ trades }) => {
  // Simplified check - will show empty analysis instead of returning null
  if (!trades || trades.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <h3 className="text-xl font-medium mb-4">Positionsgrößen-Optimierung</h3>
          <p className="text-gray-500 text-center py-8">
            Keine Trades vorhanden für eine Analyse.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate optimization data
  const optimizationData = calculatePositionSizeOptimization(trades);
  
  // Show a more detailed message instead of returning null
  if (!optimizationData || !optimizationData.sizeRanges || optimizationData.sizeRanges.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <h3 className="text-xl font-medium mb-4">Positionsgrößen-Optimierung</h3>
          <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md">
            <p className="text-yellow-800">
              Nicht genügend Daten für eine aussagekräftige Analyse. Für diese Analyse werden Trades mit gültigen positionSize und pnl-Werten benötigt.
            </p>
            <p className="mt-2 text-yellow-800">
              Stellen Sie sicher, dass Ihre Trades diese Daten enthalten und versuchen Sie es erneut.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Find currency from the first trade
  const currency = trades[0]?.currency || '€';
  
  // Get optimal position size percentage range for the summary
  const optimalSizePercentage = optimizationData.optimalSize ? 
    ((optimizationData.optimalSize.tradeCount / trades.length) * 100).toFixed(1) + '%' : 
    'N/A';

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-xl font-medium mb-4">Positionsgrößen-Optimierung</h3>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Diese Analyse untersucht die Beziehung zwischen deinen Positionsgrößen und der Handelsperformance, 
            um eine optimale Handelsgröße basierend auf historischen Daten zu identifizieren.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-md text-blue-800 mb-6">
            <p className="font-medium">Optimale Positionsgröße:</p>
            <p className="text-lg">{optimizationData.optimalSize?.range || 'N/A'} {currency}</p>
            <p className="text-sm mt-1">
              {optimizationData.optimalSize ? 
                `${optimizationData.optimalSize.tradeCount} Trades (${optimalSizePercentage}) mit ${optimizationData.optimalSize.winRate.toFixed(1)}% Winrate.` : 
                'Keine Empfehlung verfügbar.'}
            </p>
          </div>
        </div>
        
        {/* Only render charts if we have data */}
        {optimizationData.sizeRanges && optimizationData.sizeRanges.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Performance by Position Size Chart */}
            <div>
              <h4 className="text-lg font-medium mb-2">Performance nach Positionsgröße</h4>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={optimizationData.sizeRanges}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
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
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'avgPnL') return [`${value.toFixed(2)} ${currency}`, 'Durchsch. PnL'];
                        if (name === 'winRate') return [`${value.toFixed(1)}%`, 'Winrate'];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="avgPnL" 
                      name="Durchschnittlicher PnL" 
                      yAxisId="left"
                      fill="#3b82f6" 
                    >
                      {optimizationData.sizeRanges.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.avgPnL >= 0 ? '#10b981' : '#ef4444'}
                        />
                      ))}
                    </Bar>
                    <Bar 
                      dataKey="winRate" 
                      name="Winrate" 
                      yAxisId="right"
                      fill="#6366f1"
                      fillOpacity={0.6}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Risk-Adjusted Return Chart */}
            <div>
              <h4 className="text-lg font-medium mb-2">Risikoadjustierte Rendite</h4>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={optimizationData.sizeRanges}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="range" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'riskAdjustedReturn') return [value.toFixed(2), 'Risikoadjustierte Rendite'];
                        if (name === 'stdDev') return [value.toFixed(2), 'Standardabweichung'];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="riskAdjustedReturn" 
                      name="Risikoadjustierte Rendite" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="stdDev" 
                      name="Standardabweichung" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
        
        {/* Emotion Correlation Chart - only render if data exists */}
        {optimizationData.emotionCorrelation && 
         optimizationData.emotionCorrelation.emotionBySize && 
         optimizationData.emotionCorrelation.emotionBySize.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">Emotionaler Zustand & Positionsgröße</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="category" 
                    dataKey="emotionName" 
                    name="Emotionaler Zustand" 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="avgSize" 
                    name="Durchschnittliche Positionsgröße" 
                    unit={` ${currency}`}
                  />
                  <ZAxis 
                    type="number" 
                    dataKey="tradeCount" 
                    range={[50, 400]} 
                    name="Anzahl Trades" 
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => {
                    if (name === 'Durchschnittliche Positionsgröße') return [`${value.toFixed(2)} ${currency}`, name];
                    return [value, name];
                  }} />
                  <Legend />
                  <Scatter 
                    name="Emotionen & Positionsgröße" 
                    data={optimizationData.emotionCorrelation.emotionBySize} 
                    fill="#8884d8"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Korrelation: {((optimizationData.emotionCorrelation.correlation || 0) * 100).toFixed(0)}% 
              {Math.abs(optimizationData.emotionCorrelation.correlation || 0) > 0.3 
                ? ` - Es besteht ein ${optimizationData.emotionCorrelation.correlation > 0 ? 'positiver' : 'negativer'} Zusammenhang zwischen emotionalem Zustand und Positionsgröße.`
                : ' - Kein deutlicher Zusammenhang zwischen emotionalem Zustand und Positionsgröße erkennbar.'}
            </p>
          </div>
        )}
        
        {/* Insights & Recommendations - always show this section */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">Erkenntnisse & Empfehlungen</h4>
          <p className="mb-2">{optimizationData.summary || "Nicht genügend Daten für eine aussagekräftige Analyse."}</p>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            <li>
              <strong>Kelly-Kriterium:</strong> Basierend auf deiner Winrate und Risk/Reward-Verhältnis 
              solltest du pro Trade etwa {calculateKellyCriterion(optimizationData.optimalSize?.winRate || 50)}% deines Kapitals riskieren.
            </li>
            <li>
              <strong>Position Size vs. Emotionen:</strong> {
                optimizationData.emotionCorrelation && Math.abs(optimizationData.emotionCorrelation.correlation || 0) > 0.3
                  ? `Achte darauf, dass deine Emotionen die Positionsgröße beeinflussen. Du tendierst dazu, in ${optimizationData.emotionCorrelation.emotionTrend || 'bestimmten'} Zuständen größere Positionen einzugehen.`
                  : 'Deine Positionsgrößen scheinen nicht stark von deinem emotionalen Zustand beeinflusst zu sein, was positiv ist.'
              }
            </li>
            <li>
              <strong>Volatilitätsanpassung:</strong> Bei volatileren Assets wie Krypto empfiehlt sich eine
              Reduzierung der Positionsgröße um 20-30% im Vergleich zu stabileren Märkten.
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Calculate optimal position size based on Kelly Criterion
 * @param {number} winRate - Win rate percentage
 * @returns {string} - Recommended position size percentage
 */
const calculateKellyCriterion = (winRate) => {
  if (!winRate) return "1-2";
  
  // Simplified Kelly calculation (assumes average Win:Loss ratio of 1.5:1)
  const winProbability = winRate / 100;
  const lossProbability = 1 - winProbability;
  const winLossRatio = 1.5; // Average win amount divided by average loss amount
  
  const kelly = Math.max(0, (winProbability * winLossRatio - lossProbability) / winLossRatio);
  
  // Cap at 25% for practical risk management
  const cappedKelly = Math.min(kelly, 0.25);
  
  // Return as percentage range
  const lowerBound = Math.floor(cappedKelly * 100);
  const upperBound = Math.ceil(cappedKelly * 100);
  
  return `${lowerBound}-${upperBound}`;
};

/**
 * Calculate performance metrics by position size buckets
 * @param {Array} trades - Array of trade objects
 * @returns {Object} - Position size optimization data
 */
export const calculatePositionSizeOptimization = (trades) => {
  // Filter trades with position size and pnl
  const validTrades = trades.filter(trade => 
    trade.positionSize && trade.pnl && 
    !isNaN(parseFloat(trade.positionSize)) && 
    !isNaN(parseFloat(trade.pnl))
  );
  
  if (validTrades.length === 0) {
    return {
      sizeRanges: [],
      emotionCorrelation: { emotionBySize: [] },
      optimalSize: null,
      summary: "Not enough data for position size analysis."
    };
  }
  
  // Find min and max position sizes
  const positionSizes = validTrades.map(trade => parseFloat(trade.positionSize));
  const minSize = Math.min(...positionSizes);
  const maxSize = Math.max(...positionSizes);
  
  // Create buckets (5-7 ranges based on the data distribution)
  const bucketCount = Math.min(7, Math.max(4, Math.ceil(validTrades.length / 10)));
  const bucketSize = (maxSize - minSize) / bucketCount;
  
  const buckets = Array(bucketCount).fill().map((_, i) => {
    const lowerBound = minSize + i * bucketSize;
    const upperBound = i === bucketCount - 1 ? maxSize + 0.001 : minSize + (i + 1) * bucketSize;
    
    return {
      lowerBound,
      upperBound,
      label: `${lowerBound.toFixed(1)} - ${upperBound.toFixed(1)}`,
      trades: []
    };
  });
  
  // Assign trades to buckets
  validTrades.forEach(trade => {
    const size = parseFloat(trade.positionSize);
    const bucket = buckets.find(b => size >= b.lowerBound && size < b.upperBound);
    if (bucket) {
      bucket.trades.push(trade);
    }
  });
  
  // Calculate metrics for each bucket
  const sizeRanges = buckets
    .filter(bucket => bucket.trades.length > 0)
    .map(bucket => {
      const pnlValues = bucket.trades.map(trade => parseFloat(trade.pnl));
      const totalPnL = pnlValues.reduce((sum, pnl) => sum + pnl, 0);
      const avgPnL = totalPnL / bucket.trades.length;
      const winTrades = bucket.trades.filter(trade => parseFloat(trade.pnl) > 0);
      const winRate = (winTrades.length / bucket.trades.length) * 100;
      
      // Calculate standard deviation of returns for volatility
      const variance = pnlValues.reduce((sum, pnl) => sum + Math.pow(pnl - avgPnL, 2), 0) / bucket.trades.length;
      const stdDev = Math.sqrt(variance);
      
      // Calculate risk-adjusted return (similar to Sharpe ratio)
      const riskAdjustedReturn = stdDev !== 0 ? avgPnL / stdDev : 0;
      
      return {
        range: bucket.label,
        avgSize: bucket.trades.reduce((sum, trade) => sum + parseFloat(trade.positionSize), 0) / bucket.trades.length,
        tradeCount: bucket.trades.length,
        winRate,
        avgPnL,
        totalPnL,
        stdDev,
        riskAdjustedReturn
      };
    });
  
  // Calculate correlation between position size and emotional state
  const emotionCorrelation = calculateEmotionSizeCorrelation(validTrades);
  
  // Find optimal position size range based on risk-adjusted return
  const sortedByRiskAdjReturn = [...sizeRanges].sort((a, b) => b.riskAdjustedReturn - a.riskAdjustedReturn);
  const optimalSize = sortedByRiskAdjReturn.length > 0 ? sortedByRiskAdjReturn[0] : null;
  
  // Generate summary
  let summary = "";
  if (optimalSize) {
    summary = `Optimale Positionsgröße: ${optimalSize.range} - mit einer Winrate von ${optimalSize.winRate.toFixed(1)}% und einem durchschnittlichen PnL von ${optimalSize.avgPnL.toFixed(2)}.`;
    
    // Add emotion correlation insight
    if (emotionCorrelation.correlation > 0.3) {
      summary += ` Höhere Positionsgrößen korrelieren mit ${emotionCorrelation.emotionTrend} emotionalem Zustand.`;
    } else if (emotionCorrelation.correlation < -0.3) {
      summary += ` Niedrigere Positionsgrößen korrelieren mit ${emotionCorrelation.emotionTrend} emotionalem Zustand.`;
    }
  } else {
    summary = "Nicht genügend Daten für eine fundierte Empfehlung.";
  }
  
  return {
    sizeRanges,
    emotionCorrelation,
    optimalSize,
    summary
  };
};

/**
 * Calculate correlation between position size and emotional state
 * @param {Array} trades - Array of trade objects
 * @returns {Object} - Correlation data
 */
const calculateEmotionSizeCorrelation = (trades) => {
  // Filter trades with both position size and emotion data
  const tradesWithEmotion = trades.filter(trade => 
    trade.preTradeEmotion && 
    !isNaN(parseInt(trade.preTradeEmotion))
  );
  
  if (tradesWithEmotion.length < 5) {
    return {
      correlation: 0,
      emotionTrend: "neutralem",
      emotionBySize: []
    };
  }
  
  // Group trades by emotion level
  const emotionGroups = [1, 2, 3, 4, 5].map(emotion => {
    const emotionTrades = tradesWithEmotion.filter(trade => 
      parseInt(trade.preTradeEmotion) === emotion
    );
    
    if (emotionTrades.length === 0) return null;
    
    return {
      emotion,
      emotionName: getEmotionName(emotion),
      tradeCount: emotionTrades.length,
      avgSize: emotionTrades.reduce((sum, trade) => sum + parseFloat(trade.positionSize), 0) / emotionTrades.length
    };
  }).filter(Boolean);
  
  // Calculate correlation coefficient (simplified)
  let correlation = 0;
  if (emotionGroups.length > 1) {
    // Calculate if higher emotions correlate with larger position sizes
    const emotionValues = emotionGroups.map(g => g.emotion);
    const sizeValues = emotionGroups.map(g => g.avgSize);
    
    correlation = calculateCorrelation(emotionValues, sizeValues);
  }
  
  // Determine trend
  let emotionTrend = "neutralem";
  if (correlation > 0.3) {
    emotionTrend = "optimistischerem";
  } else if (correlation < -0.3) {
    emotionTrend = "vorsichtigerem";
  }
  
  return {
    correlation,
    emotionTrend,
    emotionBySize: emotionGroups
  };
};

/**
 * Calculate Pearson correlation coefficient between two arrays
 * @param {Array} array1 - First array of numbers
 * @param {Array} array2 - Second array of numbers
 * @returns {number} - Correlation coefficient (-1 to 1)
 */
const calculateCorrelation = (array1, array2) => {
  if (array1.length !== array2.length || array1.length < 2) {
    return 0;
  }
  
  // Calculate means
  const mean1 = array1.reduce((a, b) => a + b, 0) / array1.length;
  const mean2 = array2.reduce((a, b) => a + b, 0) / array2.length;
  
  // Calculate covariance and standard deviations
  let sumCovariance = 0;
  let sumVariance1 = 0;
  let sumVariance2 = 0;
  
  for (let i = 0; i < array1.length; i++) {
    const diff1 = array1[i] - mean1;
    const diff2 = array2[i] - mean2;
    
    sumCovariance += diff1 * diff2;
    sumVariance1 += diff1 * diff1;
    sumVariance2 += diff2 * diff2;
  }
  
  const variance1 = Math.sqrt(sumVariance1);
  const variance2 = Math.sqrt(sumVariance2);
  
  if (variance1 === 0 || variance2 === 0) {
    return 0;
  }
  
  return sumCovariance / (variance1 * variance2);
};

/**
 * Get descriptive name for emotion level
 * @param {number} emotion - Emotion level (1-5)
 * @returns {string} - Emotion description
 */
const getEmotionName = (emotion) => {
  switch (emotion) {
    case 1: return "Ängstlich";
    case 2: return "Unsicher";
    case 3: return "Neutral";
    case 4: return "Sicher";
    case 5: return "Übermütig";
    default: return "Unbekannt";
  }
};

export default PositionSizeOptimizationPanel;