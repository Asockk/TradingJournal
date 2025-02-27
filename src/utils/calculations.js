/**
 * Calculate the duration in days between two dates
 * @param {string} entryDate - Entry date string
 * @param {string} exitDate - Exit date string
 * @returns {string} - Duration in days
 */
export const calculateDuration = (entryDate, exitDate) => {
  const entry = new Date(entryDate);
  const exit = new Date(exitDate);
  const diffTime = Math.abs(exit - entry);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
  
  const direction = position === 'Long' ? 1 : -1;
  const expectedPnL = ((tp - entry) / entry * size * direction * lev).toFixed(2);
  
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
  
  // Calculate reward and risk
  const reward = Math.abs(tp - entry);
  const risk = Math.abs(sl - entry);
  
  if (risk === 0) return "0.00";
  
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
  
  const direction = position === 'Long' ? 1 : -1;
  const pnl = ((exit - entry) / entry * size * direction * lev - tradeFees).toFixed(2);
  
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
  
  // Calculate risk in currency terms
  const direction = position === 'Long' ? 1 : -1;
  const risk = Math.abs(sl - entry) / entry * size * direction * lev;
  
  if (risk === 0) return "0.00";
  
  const actualRR = (actualPnl / Math.abs(risk)).toFixed(2);
  return actualRR;
};