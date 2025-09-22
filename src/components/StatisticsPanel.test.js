import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StatisticsPanel from './StatisticsPanel';
import { ThemeProvider } from '../contexts/ThemeContext';

const mockTrades = [
  {
    id: '1',
    asset: 'BTC/USD',
    position: 'Long',
    entryDate: '2024-01-01',
    exitDate: '2024-01-02',
    entryPrice: '45000',
    exitPrice: '46000',
    positionSize: '1000',
    pnl: '22.22',
    currency: 'USD',
    leverage: 1,
    followedPlan: true,
    emotion: 'Confident',
    conviction: 4
  },
  {
    id: '2',
    asset: 'ETH/USD',
    position: 'Short',
    entryDate: '2024-01-03',
    exitDate: '2024-01-04',
    entryPrice: '2500',
    exitPrice: '2400',
    positionSize: '2000',
    pnl: '80.00',
    currency: 'USD',
    leverage: 2,
    followedPlan: false,
    emotion: 'Anxious',
    conviction: 2
  }
];

describe('StatisticsPanel', () => {
  const defaultProps = {
    trades: mockTrades,
    filters: {},
    filteredTrades: mockTrades
  };

  const renderWithTheme = (component) => {
    return render(
      <ThemeProvider>
        {component}
      </ThemeProvider>
    );
  };

  test('renders statistics cards', () => {
    renderWithTheme(<StatisticsPanel {...defaultProps} />);
    
    // Check for key statistics
    expect(screen.getByText(/Trades & Winrate/i)).toBeInTheDocument();
    expect(screen.getByText(/Durchschn\. Gewinn\/Verlust/i)).toBeInTheDocument();
    expect(screen.getByText(/Total P&L/i)).toBeInTheDocument();
  });

  test('renders time range selector', () => {
    renderWithTheme(<StatisticsPanel {...defaultProps} />);
    
    expect(screen.getByText(/Alle/i)).toBeInTheDocument();
    expect(screen.getByText(/7 Tage/i)).toBeInTheDocument();
    expect(screen.getByText(/30 Tage/i)).toBeInTheDocument();
  });

  test('renders alpha trader cards', () => {
    renderWithTheme(<StatisticsPanel {...defaultProps} />);
    
    expect(screen.getByText(/Profit Factor/i)).toBeInTheDocument();
    expect(screen.getByText(/Sharpe \/ Sortino/i)).toBeInTheDocument();
  });

  test('handles empty trades', () => {
    renderWithTheme(<StatisticsPanel trades={[]} filters={{}} filteredTrades={[]} />);
    
    // With empty trades, it shows a different message
    expect(screen.getByText(/Keine Daten für den gewählten Zeitraum verfügbar/i)).toBeInTheDocument();
    expect(screen.getByText(/Alle Daten anzeigen/i)).toBeInTheDocument();
  });

  test('applies time filters correctly', async () => {
    renderWithTheme(<StatisticsPanel {...defaultProps} />);
    
    const sevenDaysButton = screen.getByRole('button', { name: /7 Tage/i });
    fireEvent.click(sevenDaysButton);
    
    await waitFor(() => {
      expect(sevenDaysButton).toHaveClass('bg-blue-600');
    });
  });
});
