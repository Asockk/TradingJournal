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
  notes: '',
  
  // Alpha Trader Ergänzungen
  tradePlan: '',
  exitCriteria: '',
  preTradeEmotion: 3,
  postTradeEmotion: 3,
  followedPlan: true,
  marketCondition: 'Neutral',
  tradeType: 'Other',
  whatWorked: '',
  whatDidntWork: '',
  wouldTakeAgain: true,
  
  // Expected Value Ergänzungen
  winProbability: 50,
  expectedValue: '',
  rMultiple: ''
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
  lossOnly: false,
  // Alpha Trader Filter-Erweiterungen
  tradeType: '',
  marketCondition: '',
  followedPlan: ''
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

/**
 * Alpha Trader - Trade Typen
 */
export const tradeTypes = [
  'Trend-Following',
  'Mean-Reversion',
  'Breakout',
  'News',
  'Technical',
  'Fundamental',
  'Other'
];

/**
 * Alpha Trader - Marktbedingungen
 */
export const marketConditions = [
  'Bullish',
  'Bearish',
  'Ranging',
  'High-Volatility',
  'Low-Volatility',
  'Neutral'
];

/**
 * Alpha Trader - Emotionszustände
 */
export const emotionStates = {
  pre: ['Ängstlich', 'Unsicher', 'Neutral', 'Sicher', 'Übermütig'],
  post: ['Frustriert', 'Unzufrieden', 'Neutral', 'Zufrieden', 'Euphorisch']
};