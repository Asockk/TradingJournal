/**
 * Calculate performance metrics by conviction level
 * @param {Array} trades - Array of trade objects
 * @returns {Array} - Performance data by conviction
 */
export const calculateConvictionPerformance = (trades) => {
  // Initialize data array for all 5 conviction levels
  const convictionData = Array(5).fill().map((_, index) => {
    const level = index + 1;
    return {
      level,
      winCount: 0,
      lossCount: 0,
      totalPnL: 0,
      tradeCount: 0,
      winRate: 0,
      averagePnL: 0,
      title: getConvictionTitle(level)
    };
  });

  // Process trades
  trades.forEach(trade => {
    if (trade.conviction == null || trade.conviction === '') return;
    const pnl = parseFloat(trade.pnl);
    if (isNaN(pnl)) return;
    
    const conviction = parseInt(trade.conviction, 10);
    if (isNaN(conviction) || conviction < 1 || conviction > 5) return;
    
    const isWin = pnl > 0;
    
    // Update conviction data (using 0-based index)
    const index = conviction - 1;
    convictionData[index].tradeCount++;
    convictionData[index].totalPnL += pnl;
    
    if (isWin) {
      convictionData[index].winCount++;
    } else {
      convictionData[index].lossCount++;
    }
  });
  
  // Calculate percentages and averages
  convictionData.forEach(data => {
    if (data.tradeCount > 0) {
      data.winRate = (data.winCount / data.tradeCount) * 100;
      data.averagePnL = data.totalPnL / data.tradeCount;
    }
  });
  
  return convictionData;
};

/**
 * Get descriptive title for conviction level
 * @param {number} level - Conviction level (1-5)
 * @returns {string} - Descriptive title
 */
export const getConvictionTitle = (level) => {
  switch (level) {
    case 1: return "Sehr niedrig";
    case 2: return "Niedrig";
    case 3: return "Mittel";
    case 4: return "Hoch";
    case 5: return "Sehr hoch";
    default: return "Unbekannt";
  }
};

/**
 * Get color for conviction level
 * @param {number} level - Conviction level (1-5)
 * @returns {string} - CSS color value
 */
export const getConvictionColor = (level) => {
  switch (level) {
    case 1: return "#d1d5db"; // Light gray
    case 2: return "#93c5fd"; // Light blue
    case 3: return "#60a5fa"; // Medium blue
    case 4: return "#3b82f6"; // Bright blue
    case 5: return "#1d4ed8"; // Dark blue
    default: return "#6b7280"; // Gray
  }
};

/**
 * Get conviction performance insights
 * @param {Array} convictionData - Conviction performance data
 * @returns {Object} - Insights about conviction performance
 */
export const getConvictionInsights = (convictionData) => {
  // Filter to conviction levels with at least 2 trades
  const significantLevels = convictionData.filter(data => data.tradeCount >= 2);
  
  if (significantLevels.length === 0) {
    return {
      bestConviction: null,
      worstConviction: null,
      description: "Nicht genügend Daten für eine aussagekräftige Analyse.",
      isAccurate: false
    };
  }
  
  // Sort by win rate (descending)
  const sortedByWinRate = [...significantLevels].sort((a, b) => b.winRate - a.winRate);
  const bestConviction = sortedByWinRate[0];
  const worstConviction = sortedByWinRate[sortedByWinRate.length - 1];
  
  // Sort by PnL (descending)
  const sortedByPnL = [...significantLevels].sort((a, b) => b.averagePnL - a.averagePnL);
  const bestPnLConviction = sortedByPnL[0];
  
  // Check if conviction and performance are correlated
  // (higher conviction should correlate with better performance for accurate conviction)
  const highConvictions = significantLevels.filter(data => data.level >= 4);
  const lowConvictions = significantLevels.filter(data => data.level <= 2);
  
  const highConvictionAvgWinRate = highConvictions.length > 0 
    ? highConvictions.reduce((sum, data) => sum + data.winRate, 0) / highConvictions.length 
    : 0;
    
  const lowConvictionAvgWinRate = lowConvictions.length > 0 
    ? lowConvictions.reduce((sum, data) => sum + data.winRate, 0) / lowConvictions.length 
    : 0;
  
  const isAccurate = highConvictionAvgWinRate > lowConvictionAvgWinRate;
  
  return {
    bestConviction,
    worstConviction,
    bestPnLConviction,
    isAccurate,
    description: isAccurate 
      ? `Deine Überzeugung (Conviction) korreliert positiv mit der Performance. Trades mit ${bestConviction.title} Überzeugung haben eine ${bestConviction.winRate.toFixed(1)}% Winrate.`
      : `Deine Überzeugung scheint nicht mit der Performance zu korrelieren. Überprüfe deine Analysemethode.`
  };
};
