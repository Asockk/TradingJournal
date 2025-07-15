import {
  calculateProfitFactor,
  calculateSharpeRatio,
  calculateSortinoRatio,
  calculateStats
} from './statsCalculations';

describe('Statistics Calculations', () => {
  const mockTrades = [
    {
      id: '1',
      entryDate: '2024-01-01',
      exitDate: '2024-01-02',
      pnl: '100',
      actualRiskReward: '2.0',
      asset: 'BTC/USD'
    },
    {
      id: '2',
      entryDate: '2024-01-03',
      exitDate: '2024-01-04',
      pnl: '-50',
      actualRiskReward: '-1.0',
      asset: 'ETH/USD'
    },
    {
      id: '3',
      entryDate: '2024-01-05',
      exitDate: '2024-01-06',
      pnl: '75',
      actualRiskReward: '1.5',
      asset: 'BTC/USD'
    },
    {
      id: '4',
      entryDate: '2024-01-07',
      exitDate: '2024-01-08',
      pnl: '-25',
      actualRiskReward: '-0.5',
      asset: 'ETH/USD'
    }
  ];

  describe('calculateProfitFactor', () => {
    test('calculates profit factor correctly', () => {
      const profitFactor = calculateProfitFactor(mockTrades);
      // Total profits: 100 + 75 = 175
      // Total losses: 50 + 25 = 75
      // Profit factor: 175 / 75 = 2.33
      expect(profitFactor).toBeCloseTo(2.33, 2);
    });

    test('returns 999.99 when no losses', () => {
      const winningTrades = mockTrades.filter(t => parseFloat(t.pnl) > 0);
      const profitFactor = calculateProfitFactor(winningTrades);
      expect(profitFactor).toBe(999.99);
    });

    test('returns 0 when no profits', () => {
      const losingTrades = mockTrades.filter(t => parseFloat(t.pnl) < 0);
      const profitFactor = calculateProfitFactor(losingTrades);
      expect(profitFactor).toBe(0);
    });
  });

  describe('calculateStats', () => {
    test('calculates basic statistics correctly', () => {
      const stats = calculateStats(mockTrades);
      
      expect(stats.tradeCount).toBe(4);
      expect(stats.winRate).toBe(50); // 2 wins out of 4 trades
      expect(stats.totalPnL).toBe(100); // 100 - 50 + 75 - 25
      expect(stats.avgPnL).toBe(25); // 100 / 4
      expect(stats.maxWin).toBe(100);
      expect(stats.maxLoss).toBe(-50);
    });

    test('calculates expectancy correctly', () => {
      const stats = calculateStats(mockTrades);
      // Win rate: 50%
      // Avg win: (100 + 75) / 2 = 87.5
      // Avg loss: (-50 + -25) / 2 = -37.5
      // Expectancy: (0.5 * 87.5) - (0.5 * 37.5) = 43.75 - 18.75 = 25
      expect(stats.expectancy).toBe(25);
      expect(stats.avgWin).toBe(87.5);
      expect(stats.avgLoss).toBe(-37.5);
    });

    test('handles empty trades array', () => {
      const stats = calculateStats([]);
      
      expect(stats.tradeCount).toBe(0);
      expect(stats.winRate).toBe(0);
      expect(stats.totalPnL).toBe(0);
      expect(stats.avgPnL).toBe(0);
      expect(stats.expectancy).toBe(0);
    });
  });

  describe('Sharpe and Sortino Ratios', () => {
    test('calculates non-zero Sharpe ratio', () => {
      // With varied returns, we should get a non-zero Sharpe ratio
      const sharpe = calculateSharpeRatio(mockTrades);
      expect(sharpe).not.toBe(0);
      expect(sharpe).toBeGreaterThan(0); // Positive average return
    });

    test('calculates non-zero Sortino ratio', () => {
      // With negative returns present, we should get a non-zero Sortino ratio
      const sortino = calculateSortinoRatio(mockTrades);
      expect(sortino).not.toBe(0);
      expect(sortino).toBeGreaterThan(0); // Positive average return
    });

    test('Sortino ratio should be higher than Sharpe ratio', () => {
      // Since Sortino only considers downside deviation, it should be higher
      const sharpe = calculateSharpeRatio(mockTrades);
      const sortino = calculateSortinoRatio(mockTrades);
      expect(sortino).toBeGreaterThan(sharpe);
    });
  });
});