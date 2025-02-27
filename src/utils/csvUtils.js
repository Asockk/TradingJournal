import Papa from 'papaparse';

/**
 * Import trades from CSV file
 * @param {File} file - The CSV file to import
 * @param {Function} callback - Callback function to receive parsed trades
 */
export const importCSV = (file, callback) => {
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: (results) => {
      // Validate and process the parsed data
      const parsedTrades = results.data
        .filter(trade => trade.asset) // Filter out empty rows
        .map(trade => ({
          ...trade,
          id: trade.id || Date.now().toString() + Math.random().toString(36).substr(2, 9)
        }));
      
      callback(parsedTrades);
    },
    error: (error) => {
      console.error('Error parsing CSV:', error);
      alert('Fehler beim Importieren der CSV-Datei.');
    }
  });
};

/**
 * Export trades to CSV file
 * @param {Array} trades - Array of trade objects to export
 */
export const exportCSV = (trades) => {
  if (!trades || trades.length === 0) {
    alert('Keine Trades zum Exportieren vorhanden.');
    return;
  }

  // Convert trades to CSV
  const csv = Papa.unparse(trades);
  
  // Create and download the file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `trading-journal-export-${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate sample CSV data for testing
 * @returns {string} CSV string with sample data
 */
export const generateSampleCSV = () => {
  const sampleTrades = [
    {
      id: '1',
      entryDate: '2024-02-01',
      entryTime: '10:30',
      exitDate: '2024-02-02',
      exitTime: '14:45',
      duration: '1',
      conviction: 4,
      position: 'Long',
      asset: 'BTC',
      assetClass: 'Crypto',
      leverage: 2,
      positionSize: 1000,
      currency: '€',
      entryPrice: 40000,
      stopLoss: 39000,
      takeProfit: 42000,
      entryRiskReward: '2.00',
      expectedPnL: '100.00',
      exitPrice: 41500,
      fees: 10,
      pnl: '65.00',
      actualRiskReward: '1.30',
      rationale: 'Bullish momentum after market correction',
      reassessmentTriggers: '',
      notes: 'Good trade, took profit early'
    },
    {
      id: '2',
      entryDate: '2024-02-05',
      entryTime: '09:15',
      exitDate: '2024-02-05',
      exitTime: '16:20',
      duration: '0',
      conviction: 2,
      position: 'Short',
      asset: 'ETH',
      assetClass: 'Crypto',
      leverage: 1,
      positionSize: 500,
      currency: '€',
      entryPrice: 2500,
      stopLoss: 2600,
      takeProfit: 2300,
      entryRiskReward: '2.00',
      expectedPnL: '40.00',
      exitPrice: 2450,
      fees: 5,
      pnl: '15.00',
      actualRiskReward: '0.75',
      rationale: 'Overextended rally, expecting retracement',
      reassessmentTriggers: 'Started to reverse earlier than expected',
      notes: 'Closed early to secure profit'
    }
  ];
  
  return Papa.unparse(sampleTrades);
};