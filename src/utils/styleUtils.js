/**
 * Get CSS class for PnL value styling
 * @param {string|number} pnl - PnL value
 * @returns {string} - CSS class name
 */
export const getPnLColorClass = (pnl) => {
  const pnlValue = parseFloat(pnl);
  if (isNaN(pnlValue)) return 'text-gray-500';
  if (pnlValue > 5) return 'text-green-600 font-bold';
  if (pnlValue > 0) return 'text-green-500';
  if (pnlValue < -5) return 'text-red-600 font-bold';
  if (pnlValue < 0) return 'text-red-500';
  return 'text-gray-500';
};

/**
 * Get gradient color for heatmap based on percentage value
 * @param {number} value - Percentage value (0-100)
 * @returns {string} - RGB color string
 */
export const getHeatmapColor = (value) => {
  // Scale from light blue to dark blue based on percentage
  const intensity = Math.floor((value / 100) * 255);
  return `rgb(${255 - intensity}, ${255 - intensity}, 255)`;
};

/**
 * Get background color class based on trade type (Long/Short)
 * @param {string} position - Position type ('Long' or 'Short')
 * @returns {string} - CSS class name
 */
export const getPositionBgClass = (position) => {
  return position === 'Long' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
};

/**
 * Get CSS class for positive/negative values
 * @param {number} value - Numeric value
 * @returns {string} - CSS class name
 */
export const getValueColorClass = (value) => {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-600';
};