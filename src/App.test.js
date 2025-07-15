import { render, screen } from '@testing-library/react';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';

test('renders Trading Journal header', () => {
  render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
  const headerElement = screen.getByText(/Trading Journal/i);
  expect(headerElement).toBeInTheDocument();
});
