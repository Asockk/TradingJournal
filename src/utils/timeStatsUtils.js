/**
 * Calculate performance metrics by hour of day
 * @param {Array} trades - Array of trade objects
 * @returns {Array} - Performance data by hour
 */
export const calculateHourlyPerformance = (trades) => {
  // Initialize data array for all 24 hours
  const hourlyData = Array(24).fill().map((_, hour) => ({
    hour,
    winCount: 0,
    lossCount: 0,
    totalPnL: 0,
    tradeCount: 0,
    winRate: 0,
    averagePnL: 0,
    // Format hour for display (e.g., "09:00", "14:00")
    displayHour: `${String(hour).padStart(2, '0')}:00`
  }));

  // Process trades
  trades.forEach(trade => {
    if (!trade.entryTime) return;

    const pnl = parseFloat(trade.pnl);
    if (isNaN(pnl)) return;
    
    // Extract hour from entry time (format like "14:30" or "9:45")
    const hourPart = trade.entryTime.split(':')[0];
    const hour = parseInt(hourPart, 10);
    
    if (isNaN(hour) || hour < 0 || hour > 23) return;
    
    const isWin = pnl > 0;
    
    // Update hour data
    hourlyData[hour].tradeCount++;
    hourlyData[hour].totalPnL += pnl;
    
    if (isWin) {
      hourlyData[hour].winCount++;
    } else {
      hourlyData[hour].lossCount++;
    }
  });
  
  // Calculate percentages and averages
  hourlyData.forEach(hourData => {
    if (hourData.tradeCount > 0) {
      hourData.winRate = (hourData.winCount / hourData.tradeCount) * 100;
      hourData.averagePnL = hourData.totalPnL / hourData.tradeCount;
    }
  });
  
  return hourlyData;
};

/**
 * Get color for heatmap cell based on win rate
 * @param {number} winRate - Win rate percentage
 * @returns {string} - CSS color value
 */
export const getWinRateColor = (winRate) => {
  if (winRate === 0) return '#f3f4f6'; // Light gray for no data
  
  if (winRate >= 70) return '#047857'; // Dark green for excellent (70%+)
  if (winRate >= 60) return '#10b981'; // Medium green for very good (60-70%)
  if (winRate >= 50) return '#6ee7b7'; // Light green for good (50-60%)
  if (winRate >= 40) return '#fcd34d'; // Yellow for mediocre (40-50%)
  if (winRate >= 30) return '#f97316'; // Orange for poor (30-40%)
  return '#ef4444';                    // Red for very poor (<30%)
};

/**
 * Get text color that contrasts with background
 * @param {number} winRate - Win rate percentage
 * @returns {string} - CSS color value for text
 */
export const getContrastTextColor = (winRate) => {
  if (winRate === 0) return '#6b7280'; // Gray text for no data
  if (winRate >= 50) return 'white';   // White text for darker backgrounds
  return '#1f2937';                    // Dark text for lighter backgrounds
};

/**
 * Get description for hourly performance
 * @param {Array} hourlyData - Hourly performance data
 * @returns {Object} - Best and worst hours with descriptions
 */
export const getHourlyInsights = (hourlyData) => {
  // Filter to hours with at least 3 trades for statistical significance
  const significantHours = hourlyData.filter(data => data.tradeCount >= 3);
  
  if (significantHours.length === 0) {
    return {
      bestHour: null,
      worstHour: null,
      description: "Nicht genügend Daten für eine aussagekräftige Analyse."
    };
  }
  
  // Sort by win rate (descending)
  const sortedByWinRate = [...significantHours].sort((a, b) => b.winRate - a.winRate);
  
  const bestHour = sortedByWinRate[0];
  const worstHour = sortedByWinRate[sortedByWinRate.length - 1];
  
  return {
    bestHour,
    worstHour,
    description: `Beste Handelszeit: ${bestHour.displayHour} (${bestHour.winRate.toFixed(1)}% Winrate aus ${bestHour.tradeCount} Trades). Schlechteste Zeit: ${worstHour.displayHour} (${worstHour.winRate.toFixed(1)}% Winrate).`
  };
};
