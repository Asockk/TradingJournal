// src/utils/statsCalculations.js
import _ from 'lodash';
import { calculateHourlyPerformance } from './timeStatsUtils';
import { calculateConvictionPerformance } from './convictionStatsUtils';
import { calculateEmotionPerformance, calculateEmotionTransitions } from './emotionStatsUtils';
import { 
  calculateRiskRewardComparison, 
  calculateStopLossAdherence, 
  calculateDrawdownAnalysis 
} from './riskAnalysisUtils';

/**
 * Calculate comprehensive statistics based on filtered trades
 * @param {Array} filteredTrades - Array of trade objects already filtered
 * @returns {Object} - Statistics object
 */
export const calculateStats = (filteredTrades) => {
  if (!filteredTrades.length) {
    // Return default values for empty trades
    return {
      tradeCount: 0,
      winRate: 0,
      avgPnL: 0,
      avgWin: 0,
      avgLoss: 0,
      expectancy: 0,
      avgRiskReward: 0,
      medianRR: 0,
      maxWin: 0,
      maxLoss: 0,
      maxDrawdown: 0,
      totalPnL: 0,
      assetPnL: [],
      cumulativePnL: [],
      hourlyPerformance: [],
      convictionPerformance: [],
      emotionPerformance: [],
      emotionTransitions: [],
      streaks: { maxWinStreak: 0, maxLossStreak: 0 },
      profitFactor: 0,
      sharpe: 0,
      sortino: 0,
      planStats: { followedPlanCount: 0, notFollowedPlanCount: 0 },
      tradeTypeStats: [],
      marketConditionStats: [],
      durationStats: { bestDuration: 'N/A', durationStats: [] },
      weekdayStats: { bestWeekday: 'N/A', weekdayStats: [] },
      riskRewardComparison: [],
      stopLossAdherence: { adherenceRate: 0, improvedCount: 0, worsenedCount: 0 },
      drawdownAnalysis: []
    };
  }

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
  
  // Calculate average win and average loss
  const avgWin = profitTrades.length > 0 
    ? profitTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || 0), 0) / profitTrades.length
    : 0;
  const avgLoss = lossTrades.length > 0
    ? lossTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || 0), 0) / lossTrades.length
    : 0;
  
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
      } else if (maxSoFar > 0) {
        // Only calculate drawdown when we have a positive peak
        const currentDrawdown = ((maxSoFar - runningTotal) / maxSoFar) * 100;
        if (currentDrawdown > maxDrawdown) {
          maxDrawdown = currentDrawdown;
        }
      }
    });

  // Calculate hourly performance
  const hourlyPerformance = calculateHourlyPerformance(filteredTrades);
  
  // Calculate conviction performance
  const convictionPerformance = calculateConvictionPerformance(filteredTrades);

  // Calculate emotion performance
  const emotionPerformance = calculateEmotionPerformance(filteredTrades);
  const emotionTransitions = calculateEmotionTransitions(filteredTrades);

  // Alpha Trader: Zusätzliche Statistiken
  
  // 1. Streaks (Gewinn-/Verluststrähnen)
  const streaks = calculateStreaks(filteredTrades);

  // 2. Profit Factor
  const profitFactor = calculateProfitFactor(filteredTrades);

  // 3. Sharpe Ratio
  const sharpe = calculateSharpeRatio(filteredTrades);

  // 4. Sortino Ratio
  const sortino = calculateSortinoRatio(filteredTrades);

  // 5. Plan Befolgt Performance
  const planStats = calculatePlanFollowedStats(filteredTrades);

  // 6. Trade-Typ Performance
  const tradeTypeStats = calculateTradeTypeStats(filteredTrades);

  // 7. Marktbedingungen Performance
  const marketConditionStats = calculateMarketConditionStats(filteredTrades);

  // 8. Trade-Dauer Analyse
  const durationStats = calculateDurationStats(filteredTrades);

  // 9. Wochentag-Performance
  const weekdayStats = calculateWeekdayStats(filteredTrades);

  // Risk management analysis
  const riskRewardComparison = calculateRiskRewardComparison(filteredTrades);
  const stopLossAdherence = calculateStopLossAdherence(filteredTrades);
  const drawdownAnalysis = calculateDrawdownAnalysis(filteredTrades);

  // Calculate expectancy (expected profit per trade)
  const expectancy = filteredTrades.length > 0 && lossTrades.length > 0
    ? (profitTrades.length / filteredTrades.length * avgWin) - 
      (lossTrades.length / filteredTrades.length * Math.abs(avgLoss))
    : avgPnL;

  return {
    tradeCount: filteredTrades.length,
    winRate: (profitTrades.length / filteredTrades.length) * 100,
    avgPnL,
    avgWin,
    avgLoss,
    expectancy,
    avgRiskReward: riskRewardValues.length ? 
      riskRewardValues.reduce((a, b) => a + b, 0) / riskRewardValues.length : 0,
    medianRR,
    maxWin,
    maxLoss,
    maxDrawdown: isNaN(maxDrawdown) ? 0 : maxDrawdown,
    totalPnL,
    assetPnL,
    cumulativePnL,
    hourlyPerformance,
    convictionPerformance,
    emotionPerformance,
    emotionTransitions,
    
    // Alpha Trader Statistiken
    streaks,
    profitFactor,
    sharpe,
    sortino,
    planStats,
    tradeTypeStats,
    marketConditionStats,
    durationStats,
    weekdayStats,
    
    // Risk management statistics
    riskRewardComparison,
    stopLossAdherence,
    drawdownAnalysis
  };
};

/**
 * Calculate winning and losing streaks
 * @param {Array} trades - Array of trade objects sorted by date
 * @returns {Object} - Streak statistics
 */
export const calculateStreaks = (trades) => {
  if (!trades.length) return { maxWinStreak: 0, maxLossStreak: 0, currentStreak: 0 };
  
  const sortedTrades = [...trades].sort((a, b) => new Date(a.exitDate || a.entryDate) - new Date(b.exitDate || b.entryDate));
  
  let currentStreak = 0;
  let maxWinStreak = 0;
  let maxLossStreak = 0;
  let currentStreakType = null;
  
  sortedTrades.forEach(trade => {
    const pnl = parseFloat(trade.pnl || 0);
    const isWin = pnl > 0;
    
    if (currentStreakType === null) {
      // First trade in the sequence
      currentStreakType = isWin;
      currentStreak = 1;
    } else if (currentStreakType === isWin) {
      // Continuing the streak
      currentStreak++;
    } else {
      // Streak broken, reset counter
      if (currentStreakType) {
        maxWinStreak = Math.max(maxWinStreak, currentStreak);
      } else {
        maxLossStreak = Math.max(maxLossStreak, currentStreak);
      }
      currentStreakType = isWin;
      currentStreak = 1;
    }
  });
  
  // Don't forget to count the last streak
  if (currentStreakType !== null) {
    if (currentStreakType) {
      maxWinStreak = Math.max(maxWinStreak, currentStreak);
    } else {
      maxLossStreak = Math.max(maxLossStreak, currentStreak);
    }
  }
  
  return {
    maxWinStreak,
    maxLossStreak,
    currentStreak: currentStreakType ? currentStreak * 1 : currentStreak * -1
  };
};

/**
 * Calculate profit factor (sum of profits divided by sum of losses)
 * @param {Array} trades - Array of trade objects
 * @returns {number} - Profit factor or 0 if no losing trades
 */
export const calculateProfitFactor = (trades) => {
  if (!trades.length) return 0;
  
  const profits = trades
    .filter(trade => parseFloat(trade.pnl || 0) > 0)
    .reduce((sum, trade) => sum + parseFloat(trade.pnl || 0), 0);
  
  const losses = trades
    .filter(trade => parseFloat(trade.pnl || 0) < 0)
    .reduce((sum, trade) => sum + Math.abs(parseFloat(trade.pnl || 0)), 0);
  
  if (losses === 0) return profits > 0 ? 999.99 : 0;
  
  return profits / losses;
};

/**
 * Calculate Sharpe ratio (annualized)
 * @param {Array} trades - Array of trade objects
 * @param {number} riskFreeRate - Risk-free rate (default: 0.01 or 1%)
 * @returns {number} - Sharpe ratio
 */
export const calculateSharpeRatio = (trades, riskFreeRate = 0.01) => {
  if (trades.length < 2) return 0;
  
  // Extract PnL values
  const returns = trades.map(trade => parseFloat(trade.pnl || 0));
  
  // Calculate average return
  const avgReturn = returns.reduce((sum, value) => sum + value, 0) / returns.length;
  
  // Calculate standard deviation of returns
  const variance = returns.reduce((sum, value) => sum + Math.pow(value - avgReturn, 2), 0) / (returns.length - 1);
  const stdDev = Math.sqrt(variance);
  
  // Calculate trading days based on date range
  const firstTradeDate = new Date(Math.min(...trades.map(t => new Date(t.entryDate))));
  const lastTradeDate = new Date(Math.max(...trades.map(t => new Date(t.entryDate))));
  const daysDiff = Math.max(1, (lastTradeDate - firstTradeDate) / (1000 * 60 * 60 * 24));
  
  // Annualize based on 252 trading days per year
  const tradesPerYear = (trades.length / daysDiff) * 252;
  const annualizationFactor = Math.sqrt(Math.max(1, tradesPerYear));
  
  if (stdDev === 0) return 0;
  
  // Calculate Sharpe ratio
  // Annualize returns properly: (annualized return - annualized risk-free rate) / annualized std dev
  const annualizedReturn = avgReturn * tradesPerYear;
  const annualizedStdDev = stdDev * annualizationFactor;
  const annualizedRiskFreeRate = riskFreeRate; // Already annual
  
  return (annualizedReturn - annualizedRiskFreeRate) / annualizedStdDev;
};

/**
 * Calculate Sortino ratio (focuses on downside risk only)
 * @param {Array} trades - Array of trade objects
 * @param {number} riskFreeRate - Risk-free rate (default: 0.01 or 1%)
 * @returns {number} - Sortino ratio
 */
export const calculateSortinoRatio = (trades, riskFreeRate = 0.01) => {
  if (trades.length < 2) return 0;
  
  // Extract PnL values
  const returns = trades.map(trade => parseFloat(trade.pnl || 0));
  
  // Calculate average return
  const avgReturn = returns.reduce((sum, value) => sum + value, 0) / returns.length;
  
  // Calculate downside deviation (returns below MAR - Minimum Acceptable Return)
  const MAR = 0; // Minimum Acceptable Return, typically 0
  const downsideReturns = returns.map(value => Math.min(0, value - MAR));
  const squaredDownsideReturns = downsideReturns.filter(value => value < 0);
  
  if (squaredDownsideReturns.length === 0) return avgReturn > 0 ? 999.99 : 0;
  
  const downsideVariance = squaredDownsideReturns.reduce((sum, value) => sum + Math.pow(value, 2), 0) / returns.length;
  const downsideDeviation = Math.sqrt(downsideVariance);
  
  // Calculate trading days based on date range
  const firstTradeDate = new Date(Math.min(...trades.map(t => new Date(t.entryDate))));
  const lastTradeDate = new Date(Math.max(...trades.map(t => new Date(t.entryDate))));
  const daysDiff = Math.max(1, (lastTradeDate - firstTradeDate) / (1000 * 60 * 60 * 24));
  
  // Annualize based on 252 trading days per year
  const tradesPerYear = (trades.length / daysDiff) * 252;
  const annualizationFactor = Math.sqrt(Math.max(1, tradesPerYear));
  
  // Calculate Sortino ratio with proper annualization
  const annualizedReturn = avgReturn * tradesPerYear;
  const annualizedDownsideDeviation = downsideDeviation * annualizationFactor;
  const annualizedRiskFreeRate = riskFreeRate; // Already annual
  
  return (annualizedReturn - annualizedRiskFreeRate) / annualizedDownsideDeviation;
};

/**
 * Calculate statistics for trades based on whether plan was followed
 * @param {Array} trades - Array of trade objects
 * @returns {Object} - Plan followed statistics
 */
export const calculatePlanFollowedStats = (trades) => {
  // Filter trades that have the followedPlan property
  const validTrades = trades.filter(trade => trade.followedPlan !== undefined);
  
  if (!validTrades.length) return { followedPlanCount: 0, notFollowedPlanCount: 0 };
  
  // Separate trades by whether plan was followed
  const followedPlanTrades = validTrades.filter(trade => trade.followedPlan);
  const notFollowedPlanTrades = validTrades.filter(trade => !trade.followedPlan);
  
  // Calculate statistics for trades where plan was followed
  const followedPlanStats = followedPlanTrades.length ? {
    count: followedPlanTrades.length,
    winRate: (followedPlanTrades.filter(trade => parseFloat(trade.pnl || 0) > 0).length / followedPlanTrades.length) * 100,
    avgPnL: followedPlanTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || 0), 0) / followedPlanTrades.length,
    totalPnL: followedPlanTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || 0), 0)
  } : null;
  
  // Calculate statistics for trades where plan was NOT followed
  const notFollowedPlanStats = notFollowedPlanTrades.length ? {
    count: notFollowedPlanTrades.length,
    winRate: (notFollowedPlanTrades.filter(trade => parseFloat(trade.pnl || 0) > 0).length / notFollowedPlanTrades.length) * 100,
    avgPnL: notFollowedPlanTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || 0), 0) / notFollowedPlanTrades.length,
    totalPnL: notFollowedPlanTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || 0), 0)
  } : null;
  
  return {
    followedPlanCount: followedPlanTrades.length,
    notFollowedPlanCount: notFollowedPlanTrades.length,
    followedPlanStats,
    notFollowedPlanStats,
    conclusion: followedPlanStats && notFollowedPlanStats ? 
      (followedPlanStats.avgPnL > notFollowedPlanStats.avgPnL ? 
        "Trades mit befolgtem Plan performen besser" : 
        "Trades ohne befolgten Plan performen besser") :
      "Nicht genügend Daten für einen Vergleich"
  };
};

/**
 * Calculate statistics by trade type
 * @param {Array} trades - Array of trade objects
 * @returns {Array} - Statistics by trade type
 */
export const calculateTradeTypeStats = (trades) => {
  // Group trades by trade type
  const tradesByType = _.groupBy(trades.filter(trade => trade.tradeType), 'tradeType');
  
  return Object.entries(tradesByType).map(([type, typeTrades]) => {
    const winTrades = typeTrades.filter(trade => parseFloat(trade.pnl || 0) > 0);
    return {
      type,
      count: typeTrades.length,
      winRate: (winTrades.length / typeTrades.length) * 100,
      avgPnL: typeTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || 0), 0) / typeTrades.length,
      totalPnL: typeTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || 0), 0),
      bestTrade: typeTrades.reduce((best, trade) => 
        (!best || parseFloat(trade.pnl || 0) > parseFloat(best.pnl || 0)) ? trade : best, null)
    };
  }).sort((a, b) => b.avgPnL - a.avgPnL);
};

/**
 * Calculate statistics by market condition
 * @param {Array} trades - Array of trade objects
 * @returns {Array} - Statistics by market condition
 */
export const calculateMarketConditionStats = (trades) => {
  // Group trades by market condition
  const tradesByCondition = _.groupBy(trades.filter(trade => trade.marketCondition), 'marketCondition');
  
  return Object.entries(tradesByCondition).map(([condition, conditionTrades]) => {
    const winTrades = conditionTrades.filter(trade => parseFloat(trade.pnl || 0) > 0);
    return {
      condition,
      count: conditionTrades.length,
      winRate: (winTrades.length / conditionTrades.length) * 100,
      avgPnL: conditionTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || 0), 0) / conditionTrades.length,
      totalPnL: conditionTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || 0), 0)
    };
  }).sort((a, b) => b.avgPnL - a.avgPnL);
};

/**
 * Calculate statistics by trade duration
 * @param {Array} trades - Array of trade objects
 * @returns {Object} - Statistics by duration
 */
export const calculateDurationStats = (trades) => {
  // Categorize trades by duration (only those with exitDate)
  const tradesWithDuration = trades.filter(trade => trade.duration);
  
  if (!tradesWithDuration.length) return null;
  
  // Define duration buckets (in days)
  const durationBuckets = [
    { label: 'Intraday', max: 0 },
    { label: '1-3 Tage', max: 3 },
    { label: '4-7 Tage', max: 7 },
    { label: '1-2 Wochen', max: 14 },
    { label: '2-4 Wochen', max: 30 },
    { label: '1-3 Monate', max: 90 },
    { label: '3+ Monate', max: Infinity }
  ];
  
  const durationStats = durationBuckets.map(bucket => {
    // Get trades in this duration bucket
    const bucketTrades = tradesWithDuration.filter(trade => {
      const duration = parseInt(trade.duration);
      if (bucket.max === 0) return duration === 0; // Intraday
      const prevMax = durationBuckets[durationBuckets.indexOf(bucket) - 1]?.max || -1;
      return duration > prevMax && duration <= bucket.max;
    });
    
    if (!bucketTrades.length) return { label: bucket.label, count: 0 };
    
    return {
      label: bucket.label,
      count: bucketTrades.length,
      percentage: (bucketTrades.length / tradesWithDuration.length) * 100,
      winRate: (bucketTrades.filter(trade => parseFloat(trade.pnl || 0) > 0).length / bucketTrades.length) * 100,
      avgPnL: bucketTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || 0), 0) / bucketTrades.length,
      totalPnL: bucketTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || 0), 0)
    };
  });
  
  return {
    durationStats,
    bestDuration: [...durationStats]
      .filter(stats => stats.count > 0)
      .sort((a, b) => b.avgPnL - a.avgPnL)[0]?.label || null
  };
};

/**
 * Calculate statistics by weekday of entry
 * @param {Array} trades - Array of trade objects
 * @returns {Array} - Statistics by weekday
 */
export const calculateWeekdayStats = (trades) => {
  // Only process trades with entry dates
  const tradesWithDate = trades.filter(trade => trade.entryDate);
  
  if (!tradesWithDate.length) return [];
  
  const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  
  // Calculate stats for each weekday
  const weekdayStats = weekdays.map((day, index) => {
    // Get trades that started on this weekday
    const dayTrades = tradesWithDate.filter(trade => new Date(trade.entryDate).getDay() === index);
    
    if (!dayTrades.length) return { day, count: 0, winRate: 0, avgPnL: 0, totalPnL: 0 };
    
    const winTrades = dayTrades.filter(trade => parseFloat(trade.pnl || 0) > 0);
    
    return {
      day,
      count: dayTrades.length,
      percentage: (dayTrades.length / tradesWithDate.length) * 100,
      winRate: (winTrades.length / dayTrades.length) * 100,
      avgPnL: dayTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || 0), 0) / dayTrades.length,
      totalPnL: dayTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || 0), 0)
    };
  });
  
  return {
    weekdayStats,
    bestWeekday: [...weekdayStats]
      .filter(stats => stats.count > 0)
      .sort((a, b) => b.avgPnL - a.avgPnL)[0]?.day || null,
    worstWeekday: [...weekdayStats]
      .filter(stats => stats.count > 0)
      .sort((a, b) => a.avgPnL - b.avgPnL)[0]?.day || null
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