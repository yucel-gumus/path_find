import { render, screen } from '@testing-library/react';
import App from './App';

test('renders pathfinding simulator title', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /pathfinding algoritması simülatörü/i })
  ).toBeInTheDocument();
});

test('renders run control', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /algoritmayı çalıştır/i })).toBeInTheDocument();
});
