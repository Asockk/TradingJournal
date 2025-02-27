import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';

/**
 * Parse and process exchange CSV data (e.g., from Kraken)
 * @param {File} file - The CSV file to import
 * @param {Array} existingTrades - Existing trades in the journal
 * @param {Function} onComplete - Callback with parsed trades and duplicates info
 * @param {Function} onError - Error callback
 */
export const parseExchangeCSV = (file, existingTrades, onComplete, onError) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      try {
        processExchangeData(results.data, existingTrades, onComplete);
      } catch (err) {
        onError(`Error processing exchange data: ${err.message}`);
      }
    },
    error: (err) => {
      onError(`CSV parsing error: ${err.message}`);
    }
  });
};

/**
 * Process exchange data and match buy/sell pairs
 * @param {Array} exchangeData - Parsed exchange CSV data
 * @param {Array} existingTrades - Existing trades in the journal
 * @param {Function} onComplete - Callback with parsed trades and duplicates info
 */
const processExchangeData = (exchangeData, existingTrades, onComplete) => {
  const transactions = exchangeData.filter(tx => tx.txid && (tx.type === 'buy' || tx.type === 'sell'));
  
  // Group by trading pair (e.g., BTC/USD)
  const groupedByPair = {};
  
  transactions.forEach(tx => {
    const [asset, currency] = tx.pair.split('/');
    if (!groupedByPair[asset]) {
      groupedByPair[asset] = [];
    }
    groupedByPair[asset].push({
      ...tx,
      asset,
      currency
    });
  });

  // Identify trades (match buys with sells where possible)
  const trades = [];
  const duplicates = [];
  
  Object.keys(groupedByPair).forEach(asset => {
    const assetTransactions = groupedByPair[asset];
    
    // Sort by time
    assetTransactions.sort((a, b) => new Date(a.time) - new Date(b.time));
    
    // Track remaining volume for matching
    const buys = assetTransactions.filter(tx => tx.type === 'buy');
    const sells = assetTransactions.filter(tx => tx.type === 'sell');
    
    // Process all buys
    buys.forEach(buyTx => {
      const buyDate = new Date(buyTx.time);
      const buyTime = `${buyDate.getHours()}:${String(buyDate.getMinutes()).padStart(2, '0')}`;
      const formattedBuyDate = buyDate.toISOString().split('T')[0];

      // Check for matching sell
      const matchingSell = sells.find(sellTx => 
        Math.abs(parseFloat(sellTx.vol) - parseFloat(buyTx.vol)) < 0.0001);
      
      // Create the trade
      const trade = {
        id: uuidv4(),
        asset: buyTx.asset,
        assetClass: mapAssetClass(buyTx.asset, buyTx.aclass),
        position: 'Long',
        entryDate: formattedBuyDate,
        entryTime: buyTime,
        entryPrice: parseFloat(buyTx.price),
        positionSize: parseFloat(buyTx.cost),
        currency: mapCurrency(buyTx.currency),
        fees: parseFloat(buyTx.fee),
        leverage: 1, // Default to 1x (no leverage)
        conviction: 3, // Default middle conviction
      };
      
      // If we have a matching sell, add exit information
      if (matchingSell) {
        const sellDate = new Date(matchingSell.time);
        const sellTime = `${sellDate.getHours()}:${String(sellDate.getMinutes()).padStart(2, '0')}`;
        const formattedSellDate = sellDate.toISOString().split('T')[0];
        
        trade.exitDate = formattedSellDate;
        trade.exitTime = sellTime;
        trade.exitPrice = parseFloat(matchingSell.price);
        
        // Calculate PnL
        const entryValue = parseFloat(buyTx.cost);
        const exitValue = parseFloat(matchingSell.cost);
        const totalFees = parseFloat(buyTx.fee) + parseFloat(matchingSell.fee);
        trade.pnl = (exitValue - entryValue - totalFees).toFixed(2);
        
        // Remove the used sell transaction so it's not matched again
        sells.splice(sells.indexOf(matchingSell), 1);
      }
      
      // Check for duplicates
      const isDuplicate = checkForDuplicate(trade, existingTrades);
      if (isDuplicate) {
        duplicates.push({
          newTrade: trade,
          existingTrade: isDuplicate
        });
      } else {
        trades.push(trade);
      }
    });
    
    // Process remaining sells (that didn't match with buys)
    sells.forEach(sellTx => {
      const sellDate = new Date(sellTx.time);
      const sellTime = `${sellDate.getHours()}:${String(sellDate.getMinutes()).padStart(2, '0')}`;
      const formattedSellDate = sellDate.toISOString().split('T')[0];
      
      const trade = {
        id: uuidv4(),
        asset: sellTx.asset,
        assetClass: mapAssetClass(sellTx.asset, sellTx.aclass),
        position: 'Short', // Assume short if we have a sell without a preceding buy
        entryDate: formattedSellDate,
        entryTime: sellTime,
        entryPrice: parseFloat(sellTx.price),
        positionSize: parseFloat(sellTx.cost),
        currency: mapCurrency(sellTx.currency),
        fees: parseFloat(sellTx.fee),
        leverage: 1,
        conviction: 3,
      };
      
      // Check for duplicates
      const isDuplicate = checkForDuplicate(trade, existingTrades);
      if (isDuplicate) {
        duplicates.push({
          newTrade: trade,
          existingTrade: isDuplicate
        });
      } else {
        trades.push(trade);
      }
    });
  });
  
  onComplete(trades, duplicates);
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
    existingTrade.entryDate === newTrade.entryDate &&
    Math.abs(parseFloat(existingTrade.entryPrice) - parseFloat(newTrade.entryPrice)) < 0.0001 &&
    Math.abs(parseFloat(existingTrade.positionSize) - parseFloat(newTrade.positionSize)) < 0.01
  );
};

/**
 * Map exchange asset class to journal asset class
 * @param {string} asset - Asset symbol
 * @param {string} aclass - Asset class from exchange
 * @returns {string} - Mapped asset class
 */
const mapAssetClass = (asset, aclass) => {
  if (aclass === 'forex') return 'Forex';
  
  // Common crypto assets
  const cryptoAssets = ['BTC', 'ETH', 'XRP', 'LTC', 'DOT', 'ADA', 'DOGE', 'SOL', 'AVAX', 'MATIC'];
  if (cryptoAssets.some(crypto => asset.includes(crypto))) {
    return 'Crypto';
  }
  
  // Fallback to generic classification
  return 'Crypto';
};

/**
 * Map exchange currency to journal currency
 * @param {string} currency - Currency from exchange
 * @returns {string} - Mapped currency symbol
 */
const mapCurrency = (currency) => {
  const currencyMap = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
  };
  
  return currencyMap[currency] || currency;
};