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
  
  if (isNaN(entry) || isNaN(tp) || isNaN(size) || isNaN(lev)) {
    return "0.00";
  }
  
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
  
  if (isNaN(entry) || isNaN(tp) || isNaN(sl)) {
    return "0.00";
  }
  
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
  
  if (isNaN(entry) || isNaN(exit) || isNaN(size) || isNaN(lev)) {
    return "0.00";
  }
  
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
  
  if (isNaN(entry) || isNaN(sl) || isNaN(actualPnl) || isNaN(size) || isNaN(lev)) {
    return "0.00";
  }
  
  // Calculate risk in currency terms
  const direction = position === 'Long' ? 1 : -1;
  const risk = Math.abs(sl - entry) / entry * size * direction * lev;
  
  if (risk === 0) return "0.00";
  
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
  
  if (isNaN(entry) || isNaN(tp) || isNaN(size) || isNaN(lev)) {
    return 0;
  }
  
  const direction = position === 'Long' ? 1 : -1;
  return ((tp - entry) / entry * size * direction * lev);
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
  
  if (isNaN(entry) || isNaN(sl) || isNaN(size) || isNaN(lev)) {
    return 0;
  }
  
  const direction = position === 'Long' ? 1 : -1;
  return ((sl - entry) / entry * size * direction * lev);
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
 * @returns {string} - Expected value formatted to 2 decimal places
 */
export const calculateExpectedValue = (
  entryPrice, 
  takeProfit, 
  stopLoss, 
  positionSize, 
  position, 
  leverage, 
  winProbability
) => {
  const winProb = parseFloat(winProbability) / 100; // Convert percentage to decimal
  
  if (isNaN(winProb)) {
    return "0.00";
  }
  
  // Calculate potential gain at take profit
  const potentialGain = calculatePotentialGain(entryPrice, takeProfit, positionSize, position, leverage);
  
  // Calculate potential loss at stop loss
  const potentialLoss = calculatePotentialLoss(entryPrice, stopLoss, positionSize, position, leverage);
  
  // Calculate expected value
  const expectedValue = (winProb * potentialGain) + ((1 - winProb) * potentialLoss);
  
  return expectedValue.toFixed(2);
};

/**
 * Calculate R-Multiple based on RR and win probability
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
  
  // Calculate R-multiple: (win% × RR) - loss%
  // This gives expected return per unit of risk
  const rMultiple = (winProb * rr) - (1 - winProb);
  
  return rMultiple.toFixed(2);
};