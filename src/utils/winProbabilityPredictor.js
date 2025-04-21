/**
 * Win probability prediction module based on historical trading data
 * Uses weighted factors from different dimensions of trade analysis
 */

/**
 * Predict win probability based on historical trades and current trade parameters
 * @param {Array} historicalTrades - Array of previous trades
 * @param {Object} currentTrade - Current trade being analyzed
 * @returns {number} - Predicted win probability (1-99)
 */
export const predictWinProbability = (historicalTrades, currentTrade) => {
  if (!historicalTrades || historicalTrades.length < 10) {
    return 50; // Default with insufficient data
  }

  // Filter to completed trades with defined PnL
  const completedTrades = historicalTrades.filter(trade => 
    trade.pnl && !isNaN(parseFloat(trade.pnl))
  );
  
  if (completedTrades.length < 10) {
    return 50; // Need at least 10 completed trades for decent prediction
  }

  // Extract relevant features and their win rates
  const features = {
    // Asset-specific win rate
    assetWinRate: extractFeatureWinRate(
      completedTrades, 
      trade => trade.asset === currentTrade.asset
    ),
    
    // Trade type-specific win rate
    tradeTypeWinRate: extractFeatureWinRate(
      completedTrades, 
      trade => trade.tradeType === currentTrade.tradeType
    ),
    
    // Market condition-specific win rate
    marketConditionWinRate: extractFeatureWinRate(
      completedTrades, 
      trade => trade.marketCondition === currentTrade.marketCondition
    ),
    
    // Position-type win rate (Long vs Short)
    positionWinRate: extractFeatureWinRate(
      completedTrades, 
      trade => trade.position === currentTrade.position
    ),
    
    // Risk-reward based win rate
    rrWinRate: extractFeatureWinRate(
      completedTrades,
      trade => {
        const currentRR = parseFloat(currentTrade.entryRiskReward);
        const tradeRR = parseFloat(trade.entryRiskReward);
        return !isNaN(tradeRR) && 
               !isNaN(currentRR) && 
               Math.abs(tradeRR - currentRR) < 0.5;
      }
    ),
    
    // Time-based win rate (hour of day)
    timeWinRate: extractFeatureWinRate(
      completedTrades,
      trade => {
        if (!trade.entryTime || !currentTrade.entryTime) return false;
        
        const tradeHour = parseInt(trade.entryTime.split(':')[0], 10);
        const currentHour = parseInt(currentTrade.entryTime.split(':')[0], 10);
        
        return !isNaN(tradeHour) && 
               !isNaN(currentHour) && 
               Math.abs(tradeHour - currentHour) <= 1;
      }
    )
  };
  
  // Weights for different features
  const weights = {
    assetWinRate: 0.25,        // Asset is important
    tradeTypeWinRate: 0.20,    // Strategy is important
    marketConditionWinRate: 0.15, // Market condition
    positionWinRate: 0.15,     // Position bias
    rrWinRate: 0.15,           // Similar RR trades
    timeWinRate: 0.10          // Time of day
  };
  
  // Default win rate (overall system win rate)
  const defaultWinRate = getOverallWinRate(completedTrades);
  
  // Weighted calculation
  let numerator = 0;
  let denominator = 0;
  
  Object.entries(features).forEach(([feature, value]) => {
    const weight = weights[feature];
    
    // If feature has value, use it, otherwise use default win rate with reduced weight
    if (value !== null) {
      numerator += value * weight;
      denominator += weight;
    } else {
      numerator += defaultWinRate * (weight * 0.5);
      denominator += (weight * 0.5);
    }
  });
  
  // Safety check
  if (denominator === 0) return 50;
  
  // Calculate final probability
  let probability = Math.round(numerator / denominator);
  
  // Apply reality constraints (keep probability in reasonable bounds)
  // Extreme probabilities are rare in trading
  if (probability > 85) probability = 85;
  if (probability < 15) probability = 15;
  
  return probability;
};

/**
 * Extract win rate for a specific feature filter
 * @param {Array} trades - Filtered trades
 * @param {Function} filterFn - Filter function to apply
 * @returns {number|null} - Win rate percentage or null if insufficient data
 */
function extractFeatureWinRate(trades, filterFn) {
  const filteredTrades = trades.filter(filterFn);
  
  // Need at least 3 trades to calculate meaningful win rate
  if (filteredTrades.length < 3) return null;
  
  const winningTrades = filteredTrades.filter(trade => parseFloat(trade.pnl) > 0);
  return (winningTrades.length / filteredTrades.length) * 100;
}

/**
 * Calculate overall system win rate
 * @param {Array} trades - All completed trades
 * @returns {number} - Overall win rate percentage
 */
function getOverallWinRate(trades) {
  if (!trades.length) return 50;
  
  const winningTrades = trades.filter(trade => parseFloat(trade.pnl) > 0);
  return (winningTrades.length / trades.length) * 100;
}