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