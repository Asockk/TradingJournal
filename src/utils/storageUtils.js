// Local storage key
const STORAGE_KEY = 'trading-journal-data';

/**
 * Load trades from local storage
 * @returns {Array} Array of trades or empty array if none found
 */
export const loadTrades = () => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : [];
};

/**
 * Save trades to local storage
 * @param {Array} trades - Array of trade objects
 */
export const saveTrades = (trades) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
};

/**
 * Clear all stored trade data (useful for testing)
 */
export const clearTrades = () => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Backup trades to local storage with timestamp
 * @param {Array} trades - Array of trade objects
 * @returns {string} Backup key
 */
export const backupTrades = (trades) => {
  const timestamp = new Date().toISOString();
  const backupKey = `${STORAGE_KEY}-backup-${timestamp}`;
  localStorage.setItem(backupKey, JSON.stringify(trades));
  return backupKey;
};

/**
 * List all backups in local storage
 * @returns {Array} Array of backup objects with key and timestamp
 */
export const listBackups = () => {
  const backups = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(`${STORAGE_KEY}-backup-`)) {
      const timestamp = key.replace(`${STORAGE_KEY}-backup-`, '');
      backups.push({ key, timestamp });
    }
  }
  return backups;
};

/**
 * Restore trades from a backup
 * @param {string} backupKey - Backup key to restore from
 * @returns {Array|null} Array of trades or null if backup not found
 */
export const restoreBackup = (backupKey) => {
  const backupData = localStorage.getItem(backupKey);
  if (backupData) {
    const trades = JSON.parse(backupData);
    saveTrades(trades);
    return trades;
  }
  return null;
};