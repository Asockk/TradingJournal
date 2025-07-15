/**
 * Utility functions for handling precision in financial calculations
 */

/**
 * Round a number to a specified number of decimal places
 * @param {number} num - The number to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} - Rounded number
 */
export const roundTo = (num, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
};

/**
 * Safe addition of two floating point numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @param {number} decimals - Decimal places for result
 * @returns {number} - Sum rounded to specified decimals
 */
export const safeAdd = (a, b, decimals = 2) => {
  return roundTo(a + b, decimals);
};

/**
 * Safe subtraction of two floating point numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @param {number} decimals - Decimal places for result
 * @returns {number} - Difference rounded to specified decimals
 */
export const safeSubtract = (a, b, decimals = 2) => {
  return roundTo(a - b, decimals);
};

/**
 * Safe multiplication of two floating point numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @param {number} decimals - Decimal places for result
 * @returns {number} - Product rounded to specified decimals
 */
export const safeMultiply = (a, b, decimals = 2) => {
  return roundTo(a * b, decimals);
};

/**
 * Safe division of two floating point numbers
 * @param {number} a - Numerator
 * @param {number} b - Denominator
 * @param {number} decimals - Decimal places for result
 * @returns {number} - Quotient rounded to specified decimals
 */
export const safeDivide = (a, b, decimals = 2) => {
  if (b === 0) return 0;
  return roundTo(a / b, decimals);
};

/**
 * Parse and validate a numeric string
 * @param {string} value - String to parse
 * @param {number} defaultValue - Default value if parsing fails
 * @returns {number} - Parsed number or default
 */
export const parseNumeric = (value, defaultValue = 0) => {
  const num = parseFloat(value);
  return isNaN(num) ? defaultValue : num;
};

/**
 * Format a number for display with proper precision
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted number string
 */
export const formatNumber = (num, decimals = 2) => {
  return roundTo(num, decimals).toFixed(decimals);
};

/**
 * Calculate percentage with proper precision
 * @param {number} value - Value
 * @param {number} total - Total
 * @param {number} decimals - Decimal places for result
 * @returns {number} - Percentage
 */
export const calculatePercentage = (value, total, decimals = 2) => {
  if (total === 0) return 0;
  return roundTo((value / total) * 100, decimals);
};