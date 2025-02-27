import _ from 'lodash';

/**
 * Calculate comprehensive statistics based on filtered trades
 * @param {Array} filteredTrades - Array of trade objects already filtered
 * @returns {Object} - Statistics object
 */
export const calculateStats = (filteredTrades) => {
  if (!filteredTrades.length) return null;

  // Basic metrics
  const profitTrades = filteredTrades.filter(trade => parseFloat(trade.pnl) > 0);
  const lossTrades = filteredTrades.filter(trade => parseFloat(trade.pnl) < 0);
  
  const totalPnL = filteredTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || 0), 0);
  const avgPnL = totalPnL / filteredTrades.length;
  
  // Risk/Reward metrics
  const riskRewardValues = filteredTrades
    .filter(trade => trade.actualRiskReward && !isNaN(parseFloat(trade.actualRiskReward)))
    .map(trade => parseFloat(trade.actualRiskReward));
  
  const sortedRR = [...riskRewardValues].sort((a, b) => a - b);
  const medianRR = sortedRR.length ? 
    (sortedRR.length % 2 === 0 ? 
      (sortedRR[sortedRR.length/2 - 1] + sortedRR[sortedRR.length/2]) / 2 : 
      sortedRR[Math.floor(sortedRR.length/2)]) : 
    0;
  
  // Get largest win and loss
  const pnlValues = filteredTrades.map(trade => parseFloat(trade.pnl || 0));
  const maxWin = Math.max(...pnlValues);
  const maxLoss = Math.min(...pnlValues);
  
  // Group by asset for performance calculation
  const assetPerformance = _.groupBy(filteredTrades, 'asset');
  const assetPnL = Object.entries(assetPerformance).map(([asset, trades]) => {
    const totalPnL = trades.reduce((sum, trade) => sum + parseFloat(trade.pnl || 0), 0);
    const winRate = trades.filter(trade => parseFloat(trade.pnl) > 0).length / trades.length * 100;
    return { asset, totalPnL, winRate, tradeCount: trades.length };
  }).sort((a, b) => b.totalPnL - a.totalPnL);
  
  // Calculate drawdown
  const cumulativePnL = [];
  let runningTotal = 0;
  let maxSoFar = 0;
  let maxDrawdown = 0;
  
  filteredTrades
    .sort((a, b) => new Date(a.entryDate) - new Date(b.entryDate))
    .forEach(trade => {
      const pnl = parseFloat(trade.pnl || 0);
      runningTotal += pnl;
      
      cumulativePnL.push({
        date: trade.exitDate,
        pnl: runningTotal,
        trade: trade.asset
      });
      
      if (runningTotal > maxSoFar) {
        maxSoFar = runningTotal;
      } else {
        const currentDrawdown = maxSoFar === 0 ? 0 : 
          (maxSoFar - runningTotal) / Math.abs(maxSoFar) * 100;
        if (currentDrawdown > maxDrawdown) {
          maxDrawdown = currentDrawdown;
        }
      }
    });

  return {
    tradeCount: filteredTrades.length,
    winRate: (profitTrades.length / filteredTrades.length) * 100,
    avgPnL,
    avgRiskReward: riskRewardValues.length ? 
      riskRewardValues.reduce((a, b) => a + b, 0) / riskRewardValues.length : 0,
    medianRR,
    maxWin,
    maxLoss,
    maxDrawdown: isNaN(maxDrawdown) ? 0 : maxDrawdown,
    totalPnL,
    assetPnL,
    cumulativePnL
  };
};

/**
 * Calculate performance metrics by time period (day, week, month)
 * @param {Array} trades - Array of trade objects
 * @param {string} period - Time period ('day', 'week', 'month')
 * @returns {Array} - Performance data by time period
 */
export const calculatePerformanceByPeriod = (trades, period) => {
  // Group trades by time period
  const groupedTrades = _.groupBy(trades, trade => {
    const date = new Date(trade.entryDate);
    if (period === 'day') {
      return trade.entryDate;
    } else if (period === 'week') {
      // Get ISO week (1-52)
      const weekNum = getWeekNumber(date);
      return `${date.getFullYear()}-W${weekNum}`;
    } else if (period === 'month') {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    return trade.entryDate; // Default to day
  });

  // Calculate metrics for each period
  return Object.entries(groupedTrades).map(([periodKey, periodTrades]) => {
    const totalPnL = periodTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || 0), 0);
    const winCount = periodTrades.filter(trade => parseFloat(trade.pnl) > 0).length;
    
    return {
      period: periodKey,
      totalPnL,
      tradeCount: periodTrades.length,
      winRate: (winCount / periodTrades.length) * 100,
      avgPnL: totalPnL / periodTrades.length
    };
  }).sort((a, b) => a.period.localeCompare(b.period));
};

/**
 * Helper function to get ISO week number
 * @param {Date} date - Date object
 * @returns {number} - Week number (1-52)
 */
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};