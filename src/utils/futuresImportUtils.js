import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';

/**
 * Parse and process futures trading CSV data
 * @param {File} file - The CSV file to import
 * @param {Array} existingTrades - Existing trades in the journal
 * @param {Function} onComplete - Callback with parsed trades and duplicates info
 * @param {Function} onError - Error callback
 */
export const parseFuturesCSV = (file, existingTrades, onComplete, onError) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      try {
        processFuturesData(results.data, existingTrades, onComplete);
      } catch (err) {
        console.error("Error details:", err);
        onError(`Error processing futures data: ${err.message}`);
      }
    },
    error: (err) => {
      onError(`CSV parsing error: ${err.message}`);
    }
  });
};

/**
 * Process futures trading data to identify complete trades by tracking position changes
 * @param {Array} futuresData - Parsed futures CSV data
 * @param {Array} existingTrades - Existing trades in the journal
 * @param {Function} onComplete - Callback with parsed trades and duplicates info
 */
const processFuturesData = (futuresData, existingTrades, onComplete) => {
  // Filter for relevant entries (futures trades and funding rate changes)
  const relevantEntries = futuresData.filter(entry => 
    (entry.type && (
      entry.type.toLowerCase().includes('futures') || 
      entry.type.toLowerCase().includes('funding')
    )) && entry.contract
  );
  
  if (relevantEntries.length === 0) {
    onComplete([], []);
    return;
  }
  
  // Group transactions by contract (asset)
  const entriesByContract = {};
  
  relevantEntries.forEach(entry => {
    const contract = entry.contract.toLowerCase();
    if (!entriesByContract[contract]) {
      entriesByContract[contract] = [];
    }
    entriesByContract[contract].push(entry);
  });
  
  // Process each contract separately
  const trades = [];
  const duplicates = [];
  
  Object.keys(entriesByContract).forEach(contract => {
    const entries = entriesByContract[contract];
    
    // Sort by date/time ascending
    entries.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    
    // Track open positions by grouping entries that open and close a position
    const tradeGroups = identifyTradeGroups(entries);
    
    // Process each trade group to create a trade
    tradeGroups.forEach(group => {
      if (group.entries.length > 0) {
        const tradeData = createTradeFromGroup(group);
        
        // Check for duplicates
        const isDuplicate = checkForDuplicate(tradeData, existingTrades);
        if (isDuplicate) {
          duplicates.push({
            newTrade: tradeData,
            existingTrade: isDuplicate
          });
        } else {
          trades.push(tradeData);
        }
      }
    });
  });
  
  // Sort trades by date
  trades.sort((a, b) => new Date(a.entryDate) - new Date(b.entryDate));
  
  onComplete(trades, duplicates);
};

/**
 * Identify trade groups by tracking position changes
 * @param {Array} entries - All entries for a specific contract, sorted by time
 * @returns {Array} - Array of trade groups with open and close entries
 */
const identifyTradeGroups = (entries) => {
  const tradeGroups = [];
  let currentPosition = 0;
  let currentGroup = {
    openEntries: [],
    closeEntries: [],
    fundingEntries: [],
    positionSize: 0,
    isLong: false,
    entries: []
  };
  
  entries.forEach(entry => {
    // Track entries chronologically
    currentGroup.entries.push(entry);
    
    if (entry.type.toLowerCase().includes('futures')) {
      const change = parseFloat(entry.change || 0);
      
      // Skip entries with no change
      if (change === 0) return;
      
      if (currentPosition === 0 && change !== 0) {
        // Opening a new position
        currentPosition = change;
        currentGroup = {
          openEntries: [entry],
          closeEntries: [],
          fundingEntries: [],
          positionSize: Math.abs(change),
          isLong: change > 0,
          entries: [entry]
        };
      } else if ((currentPosition > 0 && change < 0) || (currentPosition < 0 && change > 0)) {
        // Position is being reduced or closed
        currentPosition += change;
        currentGroup.closeEntries.push(entry);
        currentGroup.entries.push(entry);
        
        // If position is fully closed or flipped
        if (Math.abs(currentPosition) < 0.00001 || (currentPosition > 0 && currentGroup.isLong === false) || (currentPosition < 0 && currentGroup.isLong === true)) {
          // Save the completed trade group
          tradeGroups.push(currentGroup);
          
          // Reset for new position if flipped
          if (currentPosition !== 0) {
            currentGroup = {
              openEntries: [entry],
              closeEntries: [],
              fundingEntries: [],
              positionSize: Math.abs(currentPosition),
              isLong: currentPosition > 0,
              entries: [entry]
            };
          } else {
            currentGroup = {
              openEntries: [],
              closeEntries: [],
              fundingEntries: [],
              positionSize: 0,
              isLong: false,
              entries: []
            };
          }
        }
      } else if ((currentPosition > 0 && change > 0) || (currentPosition < 0 && change < 0)) {
        // Adding to existing position
        currentPosition += change;
        currentGroup.openEntries.push(entry);
        currentGroup.entries.push(entry);
        currentGroup.positionSize = Math.abs(currentPosition);
      }
    } else if (entry.type.toLowerCase().includes('funding') && currentGroup.positionSize > 0) {
      // Funding rate change entry - add to current group if we have an open position
      currentGroup.fundingEntries.push(entry);
      currentGroup.entries.push(entry);
    }
  });
  
  // Add the last group if it has an open position
  if (currentGroup.openEntries.length > 0 && Math.abs(currentPosition) > 0.00001) {
    tradeGroups.push(currentGroup);
  }
  
  return tradeGroups;
};

/**
 * Create a trade object from a group of related entries
 * @param {Object} group - Group of entries that constitute a single trade
 * @returns {Object} - Trade object
 */
const createTradeFromGroup = (group) => {
  const asset = extractAssetFromContract(group.openEntries[0].contract);
  const positionType = group.isLong ? 'Long' : 'Short';
  
  // Get entry data from the first open entry
  const firstEntry = group.openEntries[0];
  const entryDateTime = new Date(firstEntry.dateTime);
  const formattedEntryDate = entryDateTime.toISOString().split('T')[0];
  const formattedEntryTime = `${entryDateTime.getHours()}:${String(entryDateTime.getMinutes()).padStart(2, '0')}`;
  
  // Get entry price - use 'new average entry price' if available, otherwise use trade price or mark price
  const entryPrice = parseFloat(
    firstEntry['new average entry price'] || 
    firstEntry['trade price'] || 
    firstEntry['mark price']
  );
  
  // Calculate total fees including trading fees and funding rates
  let totalFees = 0;
  
  // Add fees from open entries
  group.openEntries.forEach(entry => {
    if (entry.fee) {
      totalFees += parseFloat(entry.fee);
    }
  });
  
  // Add fees from close entries
  group.closeEntries.forEach(entry => {
    if (entry.fee) {
      totalFees += parseFloat(entry.fee);
    }
  });
  
  // Add funding rate fees
  group.fundingEntries.forEach(entry => {
    if (entry['realized funding']) {
      totalFees += parseFloat(entry['realized funding']);
    }
  });
  
  // Initialize the trade object
  const trade = {
    id: uuidv4(),
    asset: asset,
    assetClass: 'Crypto',
    position: positionType,
    entryDate: formattedEntryDate,
    entryTime: formattedEntryTime,
    entryPrice: entryPrice,
    positionSize: group.positionSize,
    currency: determineCurrency(firstEntry.symbol || firstEntry.contract),
    fees: totalFees.toFixed(2),
    leverage: 10, // Default for perpetual futures
    conviction: 3, // Default middle conviction
  };
  
  // If we have closing entries, add exit information
  if (group.closeEntries.length > 0) {
    // Get exit data from the last close entry
    const lastCloseEntry = group.closeEntries[group.closeEntries.length - 1];
    const exitDateTime = new Date(lastCloseEntry.dateTime);
    const formattedExitDate = exitDateTime.toISOString().split('T')[0];
    const formattedExitTime = `${exitDateTime.getHours()}:${String(exitDateTime.getMinutes()).padStart(2, '0')}`;
    
    trade.exitDate = formattedExitDate;
    trade.exitTime = formattedExitTime;
    trade.exitPrice = parseFloat(lastCloseEntry['trade price'] || lastCloseEntry['mark price']);
    
    // Calculate or get PnL
    let realizedPnL = 0;
    
    // Sum up realized PnL from all closing entries
    group.closeEntries.forEach(entry => {
      if (entry['realized pnl']) {
        realizedPnL += parseFloat(entry['realized pnl']);
      }
    });
    
    trade.pnl = realizedPnL.toFixed(2);
  }
  
  return trade;
};

/**
 * Extract asset name from contract identifier
 * @param {string} contract - Contract identifier (e.g., "pf_solusd")
 * @returns {string} - Asset name (e.g., "SOL")
 */
const extractAssetFromContract = (contract) => {
  if (!contract) return 'UNKNOWN';
  
  // Remove common prefixes like "pf_"
  let asset = contract.replace(/^pf_/i, '');
  
  // Remove common suffixes like "usd", "eur", etc.
  asset = asset.replace(/(usd|eur|btc|eth|usdt|usdc)$/i, '');
  
  // Convert to uppercase
  return asset.toUpperCase();
};

/**
 * Determine currency from symbol or contract
 * @param {string} symbolOrContract - Trading symbol or contract
 * @returns {string} - Currency symbol
 */
const determineCurrency = (symbolOrContract) => {
  if (!symbolOrContract) return '$'; // Default to USD
  
  const currencyMap = {
    'usd': '$',
    'eur': '€',
    'gbp': '£',
    'jpy': '¥',
    'usdt': '$',
    'usdc': '$'
  };
  
  const lowerSymbol = symbolOrContract.toLowerCase();
  
  for (const [currency, symbol] of Object.entries(currencyMap)) {
    if (lowerSymbol === currency || lowerSymbol.endsWith(currency)) {
      return symbol;
    }
  }
  
  return '$'; // Default to USD
};

/**
 * Check if a trade already exists in the journal
 * @param {Object} newTrade - New trade to check
 * @param {Array} existingTrades - Existing trades in the journal
 * @returns {Object|null} - The existing trade if found, null otherwise
 */
const checkForDuplicate = (newTrade, existingTrades) => {
  return existingTrades.find(existingTrade => 
    existingTrade.asset === newTrade.asset &&
    Math.abs(new Date(existingTrade.entryDate) - new Date(newTrade.entryDate)) < 86400000 && // Within 24 hours
    (newTrade.exitDate ? Math.abs(new Date(existingTrade.exitDate || '') - new Date(newTrade.exitDate)) < 86400000 : true) &&
    Math.abs(parseFloat(existingTrade.positionSize || 0) - parseFloat(newTrade.positionSize || 0)) < (0.1 * parseFloat(newTrade.positionSize || 1)) // Within 10%
  );
};