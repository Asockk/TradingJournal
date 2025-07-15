import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Trading Journal header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Trading Journal/i);
  expect(headerElement).toBeInTheDocument();
});
