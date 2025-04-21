import React from 'react';
import { Info, Sparkles } from 'lucide-react';

/**
 * Component for selecting win probability with slider and visual feedback
 * FIXED to show EV status based on actual EV value instead of just probability
 */
const WinProbabilityInput = ({ 
  value, 
  onChange, 
  onAutoSuggest,
  hasHistoricalData = false,
  expectedValue, // New parameter to access the actual expected value
  className = '' 
}) => {
  // Color based on probability
  const getColorClass = (probability) => {
    if (probability > 70) return 'bg-green-500';
    if (probability > 55) return 'bg-blue-500';
    if (probability > 45) return 'bg-yellow-500';
    if (probability > 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Determine if EV is positive based on the actual calculated EV value
  // rather than just the probability threshold
  const isPositiveEV = expectedValue && parseFloat(expectedValue) > 0;

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Gewinnwahrscheinlichkeit
          <span className="relative inline-block ml-1 group">
            <Info size={14} className="text-gray-400" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded w-64 z-10 shadow-lg">
              Die Wahrscheinlichkeit, dass dein Take-Profit erreicht wird. Diese Schätzung ist entscheidend für einen korrekten Erwartungswert (EV). Der EV = (Win% × Gewinn) - (Loss% × Verlust).
            </div>
          </span>
        </label>
        
        {hasHistoricalData && onAutoSuggest && (
          <button
            type="button"
            onClick={onAutoSuggest}
            className="flex items-center text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors"
          >
            <Sparkles size={12} className="mr-1" />
            Vorschlag
          </button>
        )}
      </div>
      
      <div className="w-full">
        {/* Visuelle Darstellung für die Wahrscheinlichkeit */}
        <div className="mb-1 flex justify-between items-center">
          <span className="text-xs text-gray-500">{value}%</span>
          <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getColorClass(value)}`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className={`text-xs font-medium ${isPositiveEV ? 'text-green-600' : 'text-red-600'}`}>
            {isPositiveEV ? 'Positiver EV' : 'Negativer EV'}
          </span>
        </div>
        
        {/* Slider für die Wahrscheinlichkeit */}
        <input
          type="range"
          min="1"
          max="99"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        
        {/* Beschriftungen */}
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Unwahrscheinlich</span>
          <span>50/50</span>
          <span>Wahrscheinlich</span>
        </div>
      </div>
    </div>
  );
};

export default WinProbabilityInput;