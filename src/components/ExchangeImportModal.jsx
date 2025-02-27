import React, { useState } from 'react';
import { X, AlertTriangle, Check, Upload, HelpCircle } from 'lucide-react';
import { parseExchangeCSV } from '../utils/exchangeImportUtils';
import { parseFuturesCSV } from '../utils/futuresImportUtils';

const ExchangeImportModal = ({ isOpen, onClose, existingTrades, onImportComplete }) => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [parsedTrades, setParsedTrades] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [selectedDuplicates, setSelectedDuplicates] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [importType, setImportType] = useState('auto');
  const [showHelp, setShowHelp] = useState(false);
  
  if (!isOpen) return null;
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };
  
  const handleParseFile = () => {
    if (!file) {
      setError('Bitte wähle eine CSV-Datei aus.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Callback for both import types
    const handleImportComplete = (trades, duplicateEntries) => {
      setParsedTrades(trades);
      setDuplicates(duplicateEntries);
      
      // Initialize selected duplicates (default: keep existing)
      const initialSelectedDuplicates = {};
      duplicateEntries.forEach((dup, index) => {
        initialSelectedDuplicates[index] = 'existing';
      });
      setSelectedDuplicates(initialSelectedDuplicates);
      
      setIsLoading(false);
      setStep(2);
    };
    
    const handleImportError = (errorMsg) => {
      setError(errorMsg);
      setIsLoading(false);
    };
    
    // Determine import type automatically or use selected type
    if (importType === 'auto' || importType === 'futures') {
      // Try futures import first
      parseFuturesCSV(
        file,
        existingTrades,
        (trades, duplicateEntries) => {
          if (trades.length > 0 || importType === 'futures') {
            handleImportComplete(trades, duplicateEntries);
          } else if (importType === 'auto') {
            // If no futures trades found and in auto mode, try standard exchange import
            parseExchangeCSV(
              file,
              existingTrades,
              handleImportComplete,
              handleImportError
            );
          } else {
            handleImportComplete([], []);
          }
        },
        (errorMsg) => {
          if (importType === 'auto') {
            // If futures import fails and in auto mode, try standard exchange import
            parseExchangeCSV(
              file,
              existingTrades,
              handleImportComplete,
              handleImportError
            );
          } else {
            handleImportError(errorMsg);
          }
        }
      );
    } else {
      // Standard exchange import (e.g., Kraken)
      parseExchangeCSV(
        file,
        existingTrades,
        handleImportComplete,
        handleImportError
      );
    }
  };
  
  const handleDuplicateSelection = (index, selection) => {
    setSelectedDuplicates({
      ...selectedDuplicates,
      [index]: selection
    });
  };
  
  const handleImport = () => {
    // Process duplicates based on user selection
    const finalTrades = [...parsedTrades];
    
    // Add selected duplicates
    duplicates.forEach((duplicate, index) => {
      if (selectedDuplicates[index] === 'new') {
        finalTrades.push(duplicate.newTrade);
      }
    });
    
    // Complete the import
    onImportComplete(finalTrades);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-start pt-10">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Exchange-Daten importieren</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
              <AlertTriangle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          {step === 1 && (
            <div>
              <div className="mb-6">
                <p className="mb-2">
                  Importiere deine Trade-Daten direkt von einer Exchange wie Kraken oder aus Futures-Trading-Plattformen. 
                  Die App erkennt automatisch zusammengehörige Kauf- und Verkaufspaare.
                </p>
                <div className="flex items-center mb-2">
                  <p className="font-medium mr-2">Import-Typ:</p>
                  <button 
                    className="p-1 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                    onClick={() => setShowHelp(!showHelp)}
                  >
                    <HelpCircle size={16} />
                  </button>
                </div>
                
                {showHelp && (
                  <div className="p-3 mb-3 bg-blue-50 text-blue-700 rounded-md text-sm">
                    <p className="font-medium mb-1">Unterstützte Formate:</p>
                    <ul className="list-disc pl-5 mb-2">
                      <li><strong>Automatisch</strong>: Versucht automatisch das Format zu erkennen</li>
                      <li><strong>Standard Exchange</strong>: Für Spot-Trading (z.B. Kraken)</li>
                      <li><strong>Futures</strong>: Für Perpetual Futures-Trading mit Funding Rates</li>
                    </ul>
                  </div>
                )}
                
                <div className="flex space-x-2 mb-4">
                  <button
                    className={`px-3 py-1 rounded-md ${
                      importType === 'auto' 
                        ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                        : 'bg-gray-100 text-gray-800 border border-gray-300'
                    }`}
                    onClick={() => setImportType('auto')}
                  >
                    Automatisch
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md ${
                      importType === 'exchange' 
                        ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                        : 'bg-gray-100 text-gray-800 border border-gray-300'
                    }`}
                    onClick={() => setImportType('exchange')}
                  >
                    Standard Exchange
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md ${
                      importType === 'futures' 
                        ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                        : 'bg-gray-100 text-gray-800 border border-gray-300'
                    }`}
                    onClick={() => setImportType('futures')}
                  >
                    Futures
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CSV-Datei auswählen
                </label>
                <div className="flex items-center">
                  <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-l-md border border-gray-300">
                    <Upload size={18} className="inline mr-2" />
                    Durchsuchen
                    <input 
                      type="file" 
                      accept=".csv" 
                      className="hidden" 
                      onChange={handleFileChange} 
                    />
                  </label>
                  <div className="px-4 py-2 border-y border-r border-gray-300 rounded-r-md bg-white flex-grow">
                    {file ? file.name : 'Keine Datei ausgewählt'}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleParseFile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300"
                  disabled={!file || isLoading}
                >
                  {isLoading ? 'Wird verarbeitet...' : 'Weiter'}
                </button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div>
              <div className="mb-4">
                <p className="font-medium text-lg">Daten überprüfen</p>
                <p className="text-gray-600">
                  Gefundene Trades: {parsedTrades.length}
                  {duplicates.length > 0 ? `, Mögliche Duplikate: ${duplicates.length}` : ''}
                </p>
              </div>
              
              {duplicates.length > 0 && (
                <div className="mb-6">
                  <p className="font-medium mb-2">Duplikate beheben</p>
                  <p className="text-sm text-gray-600 mb-3">
                    Bei diesen Trades wurden mögliche Duplikate in deinem Journal gefunden. 
                    Wähle aus, welche Version du behalten möchtest.
                  </p>
                  
                  <div className="max-h-64 overflow-y-auto border rounded-md">
                    {duplicates.map((duplicate, index) => (
                      <div key={index} className={`p-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">
                            {duplicate.newTrade.asset} - {duplicate.newTrade.entryDate}
                          </span>
                          <div className="flex gap-2">
                            <button
                              className={`px-3 py-1 text-sm rounded-md ${
                                selectedDuplicates[index] === 'existing' 
                                  ? 'bg-green-100 text-green-800 border border-green-300' 
                                  : 'bg-gray-100 text-gray-800 border border-gray-300'
                              }`}
                              onClick={() => handleDuplicateSelection(index, 'existing')}
                            >
                              <Check size={16} className="inline mr-1" />
                              Behalten
                            </button>
                            <button
                              className={`px-3 py-1 text-sm rounded-md ${
                                selectedDuplicates[index] === 'new' 
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                                  : 'bg-gray-100 text-gray-800 border border-gray-300'
                              }`}
                              onClick={() => handleDuplicateSelection(index, 'new')}
                            >
                              <Check size={16} className="inline mr-1" />
                              Überschreiben
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Vorhandener Trade:</p>
                            <p>Preis: {duplicate.existingTrade.entryPrice}</p>
                            <p>Größe: {duplicate.existingTrade.positionSize} {duplicate.existingTrade.currency}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Neuer Trade:</p>
                            <p>Preis: {duplicate.newTrade.entryPrice}</p>
                            <p>Größe: {duplicate.newTrade.positionSize} {duplicate.newTrade.currency}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <p className="font-medium mb-2">Vorschau der zu importierenden Trades</p>
                <div className="max-h-64 overflow-y-auto border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Asset</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Position</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Entry</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Exit</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Preis</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">PnL</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {parsedTrades.length > 0 ? (
                        parsedTrades.slice(0, 5).map((trade, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 whitespace-nowrap">{trade.asset}</td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                trade.position === 'Long' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {trade.position}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">{trade.entryDate}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{trade.exitDate || '-'}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-right">{trade.entryPrice}</td>
                            <td className={`px-3 py-2 whitespace-nowrap text-right ${
                              trade.pnl > 0 ? 'text-green-600' : 
                              trade.pnl < 0 ? 'text-red-600' : ''
                            }`}>
                              {trade.pnl ? (parseFloat(trade.pnl) > 0 ? '+' : '') + parseFloat(trade.pnl).toFixed(2) : '-'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-3 py-4 text-center text-gray-500">
                            Keine Trades gefunden
                          </td>
                        </tr>
                      )}
                      {parsedTrades.length > 5 && (
                        <tr>
                          <td colSpan="6" className="px-3 py-2 text-center text-gray-500 text-sm">
                            + {parsedTrades.length - 5} weitere Trades
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Zurück
                </button>
                <button
                  onClick={handleImport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  disabled={parsedTrades.length === 0}
                >
                  Importieren ({parsedTrades.length} Trades)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExchangeImportModal;