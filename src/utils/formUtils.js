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