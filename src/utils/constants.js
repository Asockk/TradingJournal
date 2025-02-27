/**
 * Initial state for a new trade
 */
export const initialTradeState = {
  id: '',
  entryDate: '',
  entryTime: '',
  exitDate: '',
  exitTime: '',
  duration: '',
  conviction: 3,
  position: 'Long',
  asset: '',
  assetClass: 'Crypto',
  leverage: 1,
  positionSize: '',
  currency: '€',
  entryPrice: '',
  stopLoss: '',
  takeProfit: '',
  entryRiskReward: '',
  expectedPnL: '',
  exitPrice: '',
  fees: '',
  pnl: '',
  actualRiskReward: '',
  rationale: '',
  reassessmentTriggers: '',
  notes: ''
};

/**
 * Initial state for filters
 */
export const initialFilterState = {
  asset: '',
  position: '',
  assetClass: '',
  dateFrom: '',
  dateTo: '',
  minConviction: 1,
  maxConviction: 5,
  profitOnly: false,
  lossOnly: false
};

/**
 * Available asset classes
 */
export const assetClasses = [
  'Crypto',
  'Aktien',
  'Forex',
  'Rohstoffe'
];

/**
 * Available currencies
 */
export const currencies = [
  { label: 'EUR', symbol: '€' },
  { label: 'USD', symbol: '$' },
  { label: 'GBP', symbol: '£' }
];