// Helper function to get input field styling based on field type and value
export const getFieldStyle = (fieldName, currentTrade, isRequired = false, isCalculated = false) => {
  // Base styles for all fields
  let className = "w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition";
  
  // Add required marker style
  if (isRequired) {
    className += " border-amber-300";
  } else {
    className += " border-gray-300";
  }
  
  // Calculated fields get a distinct background
  if (isCalculated) {
    className += " bg-gray-50 text-gray-700";
  }
  
  // Position fields get colored border based on position type
  if (fieldName === 'position') {
    if (currentTrade.position === 'Long') {
      className += " border-l-4 border-l-green-500";
    } else {
      className += " border-l-4 border-l-red-500";
    }
  }
  
  // Fields affected by position type (like price fields)
  const positionSensitiveFields = ['entryPrice', 'exitPrice', 'stopLoss', 'takeProfit', 'positionSize'];
  if (positionSensitiveFields.includes(fieldName)) {
    if (currentTrade.position === 'Long') {
      className += " focus:ring-green-200";
    } else {
      className += " focus:ring-red-200";
    }
  }
  
  return className;
};

// Validate Stop Loss and Take Profit based on position
export const validatePriceLevels = (position, entryPrice, stopLoss, takeProfit) => {
  const errors = {};
  const entry = parseFloat(entryPrice);
  const sl = parseFloat(stopLoss);
  const tp = parseFloat(takeProfit);

  if (entryPrice && stopLoss && !isNaN(entry) && !isNaN(sl)) {
    if (position === 'Long' && sl >= entry) {
      errors.stopLoss = 'Stop Loss muss unter dem Einstiegskurs liegen (Long Position)';
    } else if (position === 'Short' && sl <= entry) {
      errors.stopLoss = 'Stop Loss muss über dem Einstiegskurs liegen (Short Position)';
    }
  }

  if (entryPrice && takeProfit && !isNaN(entry) && !isNaN(tp)) {
    if (position === 'Long' && tp <= entry) {
      errors.takeProfit = 'Take Profit muss über dem Einstiegskurs liegen (Long Position)';
    } else if (position === 'Short' && tp >= entry) {
      errors.takeProfit = 'Take Profit muss unter dem Einstiegskurs liegen (Short Position)';
    }
  }

  return errors;
};

// Comprehensive form validation
export const validateTradeForm = (trade) => {
  const errors = {};
  
  // Price validations
  const entryPrice = parseFloat(trade.entryPrice);
  const exitPrice = parseFloat(trade.exitPrice);
  const stopLoss = parseFloat(trade.stopLoss);
  const takeProfit = parseFloat(trade.takeProfit);
  
  if (!trade.entryPrice || entryPrice <= 0) {
    errors.entryPrice = 'Entry price must be greater than 0';
  }
  
  if (trade.exitPrice && exitPrice <= 0) {
    errors.exitPrice = 'Exit price must be greater than 0';
  }
  
  if (trade.stopLoss && stopLoss <= 0) {
    errors.stopLoss = 'Stop loss must be greater than 0';
  }
  
  if (trade.takeProfit && takeProfit <= 0) {
    errors.takeProfit = 'Take profit must be greater than 0';
  }
  
  // Position size validation
  const positionSize = parseFloat(trade.positionSize);
  if (!trade.positionSize || positionSize <= 0) {
    errors.positionSize = 'Position size must be greater than 0';
  }
  
  // Leverage validation
  const leverage = parseFloat(trade.leverage || 1);
  if (leverage < 1) {
    errors.leverage = 'Leverage must be at least 1';
  }
  
  // Fees validation
  const fees = parseFloat(trade.fees || 0);
  if (fees < 0) {
    errors.fees = 'Fees cannot be negative';
  }
  
  // Date validation
  if (trade.entryDate && trade.exitDate) {
    const entryDateTime = new Date(`${trade.entryDate}${trade.entryTime ? 'T' + trade.entryTime : ''}`);
    const exitDateTime = new Date(`${trade.exitDate}${trade.exitTime ? 'T' + trade.exitTime : ''}`);
    
    if (isNaN(entryDateTime.getTime())) {
      errors.entryDate = 'Invalid entry date';
    }
    if (isNaN(exitDateTime.getTime())) {
      errors.exitDate = 'Invalid exit date';
    }
    
    if (!isNaN(entryDateTime.getTime()) && !isNaN(exitDateTime.getTime()) && exitDateTime < entryDateTime) {
      errors.exitDate = 'Exit date/time must be after entry date/time';
    }
  }
  
  // Win probability validation
  const winProb = parseFloat(trade.winProbability);
  if (trade.winProbability && (winProb < 1 || winProb > 99)) {
    errors.winProbability = 'Win probability must be between 1 and 99';
  }
  
  // Conviction validation
  const conviction = parseInt(trade.conviction);
  if (trade.conviction && (conviction < 1 || conviction > 5)) {
    errors.conviction = 'Conviction must be between 1 and 5';
  }
  
  // Required fields
  if (!trade.asset) errors.asset = 'Asset is required';
  if (!trade.entryDate) errors.entryDate = 'Entry date is required';
  if (!trade.position) errors.position = 'Position type is required';
  
  // Position type validation
  if (trade.position && !['Long', 'Short'].includes(trade.position)) {
    errors.position = 'Position must be either Long or Short';
  }
  
  // Time format validation (HH:MM)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (trade.entryTime && !timeRegex.test(trade.entryTime)) {
    errors.entryTime = 'Invalid time format (use HH:MM)';
  }
  if (trade.exitTime && !timeRegex.test(trade.exitTime)) {
    errors.exitTime = 'Invalid time format (use HH:MM)';
  }
  
  // Stop loss and take profit position validation
  const priceLevelErrors = validatePriceLevels(trade.position, trade.entryPrice, trade.stopLoss, trade.takeProfit);
  Object.assign(errors, priceLevelErrors);
  
  return errors;
};

// Function to create an emotion button component
export const EmotionButton = ({ value, currentValue, onClick, emoji, label, colorClass }) => (
  <button 
    type="button"
    className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs cursor-pointer transition-colors ${
      currentValue == value 
        ? `${colorClass} font-medium` 
        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
    }`}
    onClick={onClick}
  >
    <span className="text-base">{emoji}</span>
    <span>{label}</span>
  </button>
);