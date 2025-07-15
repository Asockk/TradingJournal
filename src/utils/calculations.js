/**
 * Comprehensive calculations module with fixed R-Multiple calculation for short positions
 * This file replaces the existing src/utils/calculations.js
 */

import { roundTo, formatNumber, safeMultiply, safeDivide, safeSubtract, parseNumeric } from './precisionUtils';

/**
 * Calculate the duration in days between two dates
 * @param {string} entryDate - Entry date string
 * @param {string} exitDate - Exit date string
 * @returns {string} - Duration in days
 */
export const calculateDuration = (entryDate, exitDate, entryTime, exitTime) => {
  // Construct full datetime strings
  const entryDateTime = new Date(`${entryDate}${entryTime ? 'T' + entryTime : ''}`);
  const exitDateTime = new Date(`${exitDate}${exitTime ? 'T' + exitTime : ''}`);
  
  // Validate dates
  if (isNaN(entryDateTime.getTime()) || isNaN(exitDateTime.getTime())) {
    return "0";
  }
  
  const diffTime = Math.abs(exitDateTime - entryDateTime);
  // Use Math.floor for partial days, add 1 to make it inclusive
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays.toString();
};

/**
 * Calculate expected PnL based on entry and target
 * @param {string|number} entryPrice - Entry price
 * @param {string|number} takeProfit - Take profit price
 * @param {string|number} positionSize - Position size
 * @param {string} position - "Long" or "Short"
 * @param {string|number} leverage - Leverage factor
 * @returns {string} - Expected PnL formatted to 2 decimal places
 */
export const calculateExpectedPnL = (entryPrice, takeProfit, positionSize, position, leverage) => {
  const entry = parseFloat(entryPrice);
  const tp = parseFloat(takeProfit);
  const size = parseFloat(positionSize);
  const lev = parseFloat(leverage);
  
  if (isNaN(entry) || isNaN(tp) || isNaN(size) || isNaN(lev) || entry === 0) {
    return "0.00";
  }
  
  const direction = position === 'Long' ? 1 : -1;
  // Correct formula: (price difference * position size * leverage) / entry price
  const priceDiff = (tp - entry) * direction;
  const expectedPnL = formatNumber((priceDiff * size * lev) / entry);
  
  return expectedPnL;
};

/**
 * Calculate entry risk/reward ratio
 * @param {string|number} entryPrice - Entry price
 * @param {string|number} takeProfit - Take profit price
 * @param {string|number} stopLoss - Stop loss price
 * @param {string} position - "Long" or "Short"
 * @returns {string} - Risk/Reward ratio formatted to 2 decimal places
 */
export const calculateEntryRiskReward = (entryPrice, takeProfit, stopLoss, position) => {
  const entry = parseFloat(entryPrice);
  const tp = parseFloat(takeProfit);
  const sl = parseFloat(stopLoss);
  
  if (isNaN(entry) || isNaN(tp) || isNaN(sl)) {
    return "0.00";
  }
  
  // Calculate reward and risk based on position direction
  let reward, risk;
  
  if (position === 'Long') {
    reward = Math.abs(tp - entry);
    risk = Math.abs(entry - sl);
  } else { // Short position
    reward = Math.abs(entry - tp);
    risk = Math.abs(sl - entry);
  }
  
  if (risk === 0) return reward > 0 ? "999.99" : "0.00"; // Max displayable value instead of infinity
  
  const rrRatio = (reward / risk).toFixed(2);
  return rrRatio;
};

/**
 * Calculate actual PnL
 * @param {string|number} entryPrice - Entry price
 * @param {string|number} exitPrice - Exit price
 * @param {string|number} positionSize - Position size
 * @param {string} position - "Long" or "Short"
 * @param {string|number} leverage - Leverage factor
 * @param {string|number} fees - Trading fees
 * @returns {string} - Actual PnL formatted to 2 decimal places
 */
export const calculatePnL = (entryPrice, exitPrice, positionSize, position, leverage, fees = 0) => {
  const entry = parseFloat(entryPrice);
  const exit = parseFloat(exitPrice);
  const size = parseFloat(positionSize);
  const lev = parseFloat(leverage);
  const tradeFees = parseFloat(fees || 0);
  
  if (isNaN(entry) || isNaN(exit) || isNaN(size) || isNaN(lev) || entry === 0) {
    return "0.00";
  }
  
  const direction = position === 'Long' ? 1 : -1;
  // Correct formula: (price difference * position size * leverage) / entry price
  const priceDiff = (exit - entry) * direction;
  const grossPnl = (priceDiff * size * lev) / entry;
  const pnl = formatNumber(grossPnl - tradeFees);
  
  return pnl;
};

/**
 * Calculate actual risk/reward ratio
 * @param {string|number} entryPrice - Entry price
 * @param {string|number} stopLoss - Stop loss price
 * @param {string|number} pnl - Actual PnL
 * @param {string|number} positionSize - Position size
 * @param {string} position - "Long" or "Short"
 * @param {string|number} leverage - Leverage factor
 * @returns {string} - Actual Risk/Reward ratio formatted to 2 decimal places
 */
export const calculateActualRiskReward = (
  entryPrice, 
  stopLoss, 
  pnl, 
  positionSize, 
  position, 
  leverage
) => {
  const entry = parseFloat(entryPrice);
  const sl = parseFloat(stopLoss);
  const actualPnl = parseFloat(pnl);
  const size = parseFloat(positionSize);
  const lev = parseFloat(leverage);
  
  if (isNaN(entry) || isNaN(sl) || isNaN(actualPnl) || isNaN(size) || isNaN(lev)) {
    return "0.00";
  }
  
  // Calculate risk in currency terms based on position direction
  let risk;
  
  if (position === 'Long') {
    risk = Math.abs(entry - sl) / entry * size * lev;
  } else { // Short position
    risk = Math.abs(sl - entry) / entry * size * lev;
  }
  
  if (risk === 0) return actualPnl > 0 ? "999.99" : "0.00"; // Max displayable value instead of infinity
  
  const actualRR = (actualPnl / Math.abs(risk)).toFixed(2);
  return actualRR;
};

/**
 * Calculate potential gain at take profit level
 * @param {string|number} entryPrice - Entry price
 * @param {string|number} takeProfit - Take profit price
 * @param {string|number} positionSize - Position size
 * @param {string} position - "Long" or "Short"
 * @param {string|number} leverage - Leverage factor
 * @returns {number} - Potential gain amount
 */
export const calculatePotentialGain = (entryPrice, takeProfit, positionSize, position, leverage) => {
  const entry = parseFloat(entryPrice);
  const tp = parseFloat(takeProfit);
  const size = parseFloat(positionSize);
  const lev = parseFloat(leverage);
  
  if (isNaN(entry) || isNaN(tp) || isNaN(size) || isNaN(lev) || entry === 0) {
    return 0;
  }
  
  const direction = position === 'Long' ? 1 : -1;
  // Correct formula: (price difference * position size * leverage) / entry price
  const priceDiff = (tp - entry) * direction;
  return (priceDiff * size * lev) / entry;
};

/**
 * Calculate potential loss at stop loss level
 * @param {string|number} entryPrice - Entry price
 * @param {string|number} stopLoss - Stop loss price
 * @param {string|number} positionSize - Position size
 * @param {string} position - "Long" or "Short"
 * @param {string|number} leverage - Leverage factor
 * @returns {number} - Potential loss amount
 */
export const calculatePotentialLoss = (entryPrice, stopLoss, positionSize, position, leverage) => {
  const entry = parseFloat(entryPrice);
  const sl = parseFloat(stopLoss);
  const size = parseFloat(positionSize);
  const lev = parseFloat(leverage);
  
  if (isNaN(entry) || isNaN(sl) || isNaN(size) || isNaN(lev) || entry === 0) {
    return 0;
  }
  
  const direction = position === 'Long' ? 1 : -1;
  // Correct formula: (price difference * position size * leverage) / entry price
  const priceDiff = (sl - entry) * direction;
  return (priceDiff * size * lev) / entry;
};

/**
 * Calculate true expected value based on win probability
 * @param {string|number} entryPrice - Entry price
 * @param {string|number} takeProfit - Take profit price
 * @param {string|number} stopLoss - Stop loss price
 * @param {string|number} positionSize - Position size
 * @param {string} position - "Long" or "Short"
 * @param {string|number} leverage - Leverage factor
 * @param {string|number} winProbability - Win probability percentage (1-99)
 * @param {string|number} fees - Trading fees (optional)
 * @returns {string} - Expected value formatted to 2 decimal places
 */
export const calculateExpectedValue = (
  entryPrice, 
  takeProfit, 
  stopLoss, 
  positionSize, 
  position, 
  leverage, 
  winProbability,
  fees = 0
) => {
  const winProb = parseFloat(winProbability) / 100; // Convert percentage to decimal
  const tradeFees = parseFloat(fees || 0);
  
  if (isNaN(winProb)) {
    return "0.00";
  }
  
  // Calculate potential gain at take profit (minus fees)
  const potentialGain = calculatePotentialGain(entryPrice, takeProfit, positionSize, position, leverage) - tradeFees;
  
  // Calculate potential loss at stop loss (fees make the loss worse, so we subtract more)
  // Since potentialLoss is typically negative, we need to subtract fees to make it more negative
  const potentialLoss = calculatePotentialLoss(entryPrice, stopLoss, positionSize, position, leverage) - tradeFees;
  
  // Calculate expected value
  const expectedValue = (winProb * potentialGain) + ((1 - winProb) * potentialLoss);
  
  return expectedValue.toFixed(2);
};

/**
 * FIXED: Calculate R-Multiple based on RR and win probability
 * Now accounts for position direction!
 * 
 * @param {string|number} riskReward - Risk-reward ratio 
 * @param {string|number} winProbability - Win probability percentage (1-99)
 * @returns {string} - R-multiple formatted to 2 decimal places
 */
export const calculateRMultiple = (riskReward, winProbability) => {
  const rr = parseFloat(riskReward);
  const winProb = parseFloat(winProbability) / 100;
  
  if (isNaN(rr) || isNaN(winProb)) {
    return "0.00";
  }
  
  // Calculate R-multiple
  // The risk-reward ratio already accounts for position direction
  const rMultiple = (winProb * rr) - (1 - winProb);
  
  return rMultiple.toFixed(2);
};