// src/utils/emotionStatsUtils.js

import { emotionStates } from './constants';

/**
 * Calculate performance metrics by pre-trade emotional state
 * @param {Array} trades - Array of trade objects
 * @returns {Array} - Performance data by emotional state
 */
export const calculateEmotionPerformance = (trades) => {
  // Initialize data array for all 5 emotion levels
  const emotionData = Array(5).fill().map((_, index) => {
    const level = index + 1;
    return {
      level,
      winCount: 0,
      lossCount: 0,
      totalPnL: 0,
      tradeCount: 0,
      winRate: 0,
      averagePnL: 0,
      title: getEmotionTitle('pre', level)
    };
  });

  // Process trades
  trades.forEach(trade => {
    if (trade.preTradeEmotion == null || trade.preTradeEmotion === '') return;
    const pnl = parseFloat(trade.pnl);
    if (isNaN(pnl)) return;
    
    const emotion = parseInt(trade.preTradeEmotion, 10);
    if (isNaN(emotion) || emotion < 1 || emotion > 5) return;
    
    const isWin = pnl > 0;
    
    // Update emotion data (using 0-based index)
    const index = emotion - 1;
    emotionData[index].tradeCount++;
    emotionData[index].totalPnL += pnl;
    
    if (isWin) {
      emotionData[index].winCount++;
    } else {
      emotionData[index].lossCount++;
    }
  });
  
  // Calculate percentages and averages
  emotionData.forEach(data => {
    if (data.tradeCount > 0) {
      data.winRate = (data.winCount / data.tradeCount) * 100;
      data.averagePnL = data.totalPnL / data.tradeCount;
    }
  });
  
  return emotionData;
};

/**
 * Calculate performance metrics for emotional transitions (pre to post trade)
 * @param {Array} trades - Array of trade objects
 * @returns {Object} - Performance data by emotional transition
 */
export const calculateEmotionTransitions = (trades) => {
  // Create a map for transitions
  const transitions = {};
  const validTrades = trades.filter(trade => 
    trade.preTradeEmotion != null && trade.preTradeEmotion !== '' &&
    trade.postTradeEmotion != null && trade.postTradeEmotion !== '' &&
    !isNaN(parseFloat(trade.pnl))
  );
  
  validTrades.forEach(trade => {
    const preEmotion = parseInt(trade.preTradeEmotion, 10);
    const postEmotion = parseInt(trade.postTradeEmotion, 10);
    
    if (isNaN(preEmotion) || isNaN(postEmotion) || 
        preEmotion < 1 || preEmotion > 5 || 
        postEmotion < 1 || postEmotion > 5) return;
    
    const transitionKey = `${preEmotion}-${postEmotion}`;
    const pnl = parseFloat(trade.pnl);
    if (isNaN(pnl)) return;
    const isWin = pnl > 0;
    
    if (!transitions[transitionKey]) {
      transitions[transitionKey] = {
        from: preEmotion,
        to: postEmotion,
        fromLabel: getEmotionTitle('pre', preEmotion),
        toLabel: getEmotionTitle('post', postEmotion),
        change: postEmotion - preEmotion,
        tradeCount: 0,
        winCount: 0,
        lossCount: 0,
        totalPnL: 0,
        winRate: 0,
        averagePnL: 0
      };
    }
    
    transitions[transitionKey].tradeCount++;
    transitions[transitionKey].totalPnL += pnl;
    
    if (isWin) {
      transitions[transitionKey].winCount++;
    } else {
      transitions[transitionKey].lossCount++;
    }
  });
  
  // Calculate percentages and averages
  Object.values(transitions).forEach(data => {
    if (data.tradeCount > 0) {
      data.winRate = (data.winCount / data.tradeCount) * 100;
      data.averagePnL = data.totalPnL / data.tradeCount;
    }
  });
  
  // Convert to array and sort by count
  const transitionsArray = Object.values(transitions)
    .filter(t => t.tradeCount >= 2) // Require at least 2 trades for statistical relevance
    .sort((a, b) => b.tradeCount - a.tradeCount);
  
  return {
    transitions: transitionsArray,
    topPositive: [...transitionsArray].filter(t => t.averagePnL > 0).sort((a, b) => b.averagePnL - a.averagePnL)[0] || null,
    topNegative: [...transitionsArray].filter(t => t.averagePnL < 0).sort((a, b) => a.averagePnL - b.averagePnL)[0] || null,
  };
};

/**
 * Get descriptive title for emotion level
 * @param {string} type - Type of emotion ('pre' or 'post')
 * @param {number} level - Emotion level (1-5)
 * @returns {string} - Descriptive title
 */
export const getEmotionTitle = (type, level) => {
  const emotions = type === 'pre' ? emotionStates.pre : emotionStates.post;
  return emotions[level - 1] || 'Unbekannt';
};

/**
 * Get color for emotion level
 * @param {string} type - Type of emotion ('pre' or 'post')
 * @param {number} level - Emotion level (1-5)
 * @returns {string} - CSS color value
 */
export const getEmotionColor = (type, level) => {
  // Pre-trade emotions: From anxious (red) to overconfident (blue)
  if (type === 'pre') {
    switch (level) {
      case 1: return "#ef4444"; // Anxious - Red
      case 2: return "#f59e0b"; // Unsure - Orange
      case 3: return "#a3a3a3"; // Neutral - Gray
      case 4: return "#3b82f6"; // Confident - Blue
      case 5: return "#1d4ed8"; // Overconfident - Dark Blue
      default: return "#6b7280"; // Unknown - Gray
    }
  }
  
  // Post-trade emotions: From frustrated (red) to euphoric (green)
  switch (level) {
    case 1: return "#ef4444"; // Frustrated - Red
    case 2: return "#f59e0b"; // Dissatisfied - Orange
    case 3: return "#a3a3a3"; // Neutral - Gray
    case 4: return "#10b981"; // Satisfied - Green
    case 5: return "#047857"; // Euphoric - Dark Green
    default: return "#6b7280"; // Unknown - Gray
  }
};

/**
 * Get insights from emotion performance data
 * @param {Array} emotionData - Emotion performance data
 * @returns {Object} - Insights about emotion performance
 */
export const getEmotionInsights = (emotionData) => {
  // Filter to emotion levels with at least 2 trades
  const significantLevels = emotionData.filter(data => data.tradeCount >= 2);
  
  if (significantLevels.length === 0) {
    return {
      bestEmotion: null,
      worstEmotion: null,
      description: "Nicht genügend Daten für eine aussagekräftige Analyse.",
    };
  }
  
  // Sort by win rate (descending)
  const sortedByWinRate = [...significantLevels].sort((a, b) => b.winRate - a.winRate);
  const bestEmotion = sortedByWinRate[0];
  const worstEmotion = sortedByWinRate[sortedByWinRate.length - 1];
  
  // Sort by average PnL (descending)
  const sortedByPnL = [...significantLevels].sort((a, b) => b.averagePnL - a.averagePnL);
  const bestPnLEmotion = sortedByPnL[0];
  
  return {
    bestEmotion,
    worstEmotion,
    bestPnLEmotion,
    description: `Trades mit "${bestEmotion.title}" Gefühl haben die höchste Erfolgsrate (${bestEmotion.winRate.toFixed(1)}%), während Trades mit "${bestPnLEmotion.title}" Gefühl den höchsten durchschnittlichen Gewinn (${bestPnLEmotion.averagePnL.toFixed(2)}) erzielen.`
  };
};

/**
 * Get insights from emotion transition data
 * @param {Object} transitionData - Emotion transition data
 * @returns {Object} - Insights about emotion transitions
 */
export const getTransitionInsights = (transitionData) => {
  const { transitions, topPositive, topNegative } = transitionData;
  
  if (!transitions || transitions.length === 0) {
    return {
      description: "Nicht genügend Daten für eine Analyse der emotionalen Übergänge."
    };
  }
  
  // Most common transition
  const mostCommon = transitions[0];
  
  let description = `Häufigster emotionaler Übergang: Von "${mostCommon.fromLabel}" zu "${mostCommon.toLabel}" (${mostCommon.tradeCount} Trades).`;
  
  if (topPositive) {
    description += ` Der profitabelste Übergang ist von "${topPositive.fromLabel}" zu "${topPositive.toLabel}" mit durchschnittlich ${topPositive.averagePnL.toFixed(2)} Gewinn.`;
  }
  
  if (topNegative) {
    description += ` Der verlustreichste Übergang ist von "${topNegative.fromLabel}" zu "${topNegative.toLabel}" mit durchschnittlich ${topNegative.averagePnL.toFixed(2)} Verlust.`;
  }
  
  return {
    mostCommon,
    topPositive,
    topNegative,
    description
  };
};
