/**
 * Utility module for Expected Value statistical analysis
 * Fixed to work with any number of trades
 */

/**
 * Calculate statistics about expected value accuracy
 * @param {Array} trades - Array of trade objects
 * @returns {Object} - EV performance statistics
 */
export const calculateExpectedValuePerformance = (trades) => {
  // Filter trades that have both EV data and completed execution (with PnL)
  const tradesWithEV = trades.filter(trade => 
    trade.expectedValue && 
    trade.winProbability && 
    trade.pnl && 
    !isNaN(parseFloat(trade.expectedValue)) && 
    !isNaN(parseFloat(trade.winProbability)) &&
    !isNaN(parseFloat(trade.pnl))
  );
  
  // FIX: Allow even 1 trade to display statistics (removed minimum threshold)
  if (tradesWithEV.length === 0) {
    return { evRanges: [] }; // Only return empty if truly no data
  }
  
  // Define expected value ranges for grouping
  const evRanges = [
    { min: -Infinity, max: -20, label: "Stark negativ (<-20)" },
    { min: -20, max: -5, label: "Moderat negativ (-20 bis -5)" },
    { min: -5, max: 0, label: "Leicht negativ (-5 bis 0)" },
    { min: 0, max: 5, label: "Leicht positiv (0 bis 5)" },
    { min: 5, max: 20, label: "Moderat positiv (5 bis 20)" },
    { min: 20, max: Infinity, label: "Stark positiv (>20)" }
  ];
  
  // Group trades by EV range
  const evGroups = evRanges.map(range => {
    const groupTrades = tradesWithEV.filter(trade => {
      const ev = parseFloat(trade.expectedValue);
      return ev >= range.min && ev < range.max;
    });
    
    if (groupTrades.length === 0) {
      return null;
    }
    
    // Calculate average expected win rate
    const avgExpectedWinRate = groupTrades.reduce((sum, trade) => 
      sum + parseFloat(trade.winProbability), 0) / groupTrades.length;
    
    // Calculate actual win rate
    const winCount = groupTrades.filter(trade => parseFloat(trade.pnl) > 0).length;
    const actualWinRate = (winCount / groupTrades.length) * 100;
    
    // Calculate average PnL
    const totalPnL = groupTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl), 0);
    const avgPnL = totalPnL / groupTrades.length;
    
    // Calculate EV accuracy (how close expected win rate was to actual)
    const evAccuracy = actualWinRate - avgExpectedWinRate;
    
    return {
      range: range.label,
      count: groupTrades.length,
      expectedWinRate: avgExpectedWinRate,
      actualWinRate,
      avgPnL,
      totalPnL,
      evAccuracy
    };
  }).filter(Boolean); // Remove null entries
  
  // Calculate additional metrics
  const allGroupsCount = evGroups.reduce((sum, group) => sum + group.count, 0);
  
  // Overall bias (positive means overestimating win probability, negative means underestimating)
  const weightedBias = evGroups.reduce((sum, group) => 
    sum + (group.evAccuracy * group.count), 0);
  const overallBias = allGroupsCount > 0 ? weightedBias / allGroupsCount : 0;
  
  // Overall accuracy (average absolute error between estimated and actual)
  const weightedAccuracy = evGroups.reduce((sum, group) => 
    sum + (Math.abs(group.evAccuracy) * group.count), 0);
  const overallAccuracy = allGroupsCount > 0 ? weightedAccuracy / allGroupsCount : 0;
  
  return {
    evRanges: evGroups,
    overallBias,
    overallAccuracy,
    
    // Additional insights
    profitableEVRanges: evGroups
      .filter(group => group.avgPnL > 0)
      .map(group => group.range),
      
    mostAccurateEVRange: evGroups
      .sort((a, b) => Math.abs(a.evAccuracy) - Math.abs(b.evAccuracy))[0]?.range,
      
    leastAccurateEVRange: evGroups
      .sort((a, b) => Math.abs(b.evAccuracy) - Math.abs(a.evAccuracy))[0]?.range
  };
};

/**
 * Calculate R-Multiple statistics for performance analysis
 * @param {Array} trades - Array of trade objects
 * @returns {Object} - R-Multiple performance data
 */
export const calculateRMultiplePerformance = (trades) => {
  // Filter trades with R-Multiple data
  const tradesWithR = trades.filter(trade => 
    trade.rMultiple && 
    trade.pnl && 
    !isNaN(parseFloat(trade.rMultiple)) &&
    !isNaN(parseFloat(trade.pnl))
  );
  
  // FIX: Allow even 1 trade to display statistics (removed minimum threshold)
  if (tradesWithR.length === 0) {
    return { rRanges: [] }; // Only return empty if truly no data
  }
  
  // Define R-Multiple ranges for grouping
  const rRanges = [
    { min: -Infinity, max: -1, label: "Stark negativ (<-1)" },
    { min: -1, max: -0.25, label: "Moderat negativ (-1 bis -0.25)" },
    { min: -0.25, max: 0, label: "Leicht negativ (-0.25 bis 0)" },
    { min: 0, max: 0.25, label: "Leicht positiv (0 bis 0.25)" },
    { min: 0.25, max: 1, label: "Moderat positiv (0.25 bis 1)" },
    { min: 1, max: Infinity, label: "Stark positiv (>1)" }
  ];
  
  // Group trades by R-Multiple range
  const rGroups = rRanges.map(range => {
    const groupTrades = tradesWithR.filter(trade => {
      const r = parseFloat(trade.rMultiple);
      return r >= range.min && r < range.max;
    });
    
    if (groupTrades.length === 0) {
      return null;
    }
    
    // Calculate win rate
    const winCount = groupTrades.filter(trade => parseFloat(trade.pnl) > 0).length;
    const winRate = (winCount / groupTrades.length) * 100;
    
    // Calculate average PnL
    const totalPnL = groupTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl), 0);
    const avgPnL = totalPnL / groupTrades.length;
    
    // Calculate average R-Multiple
    const avgRMultiple = groupTrades.reduce((sum, trade) => 
      sum + parseFloat(trade.rMultiple), 0) / groupTrades.length;
    
    return {
      range: range.label,
      count: groupTrades.length,
      winRate,
      avgPnL,
      totalPnL,
      avgRMultiple
    };
  }).filter(Boolean); // Remove null entries
  
  return {
    rRanges: rGroups,
    
    // Additional insights
    bestPerformingRRange: rGroups
      .sort((a, b) => b.avgPnL - a.avgPnL)[0]?.range,
      
    worstPerformingRRange: rGroups
      .sort((a, b) => a.avgPnL - b.avgPnL)[0]?.range,
      
    averageRMultiple: tradesWithR.reduce((sum, trade) => 
      sum + parseFloat(trade.rMultiple), 0) / tradesWithR.length
  };
};