import React from 'react';
import { render } from '../utils/test-utils';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

test('Navigation Menu is loaded', () => {
  const route = "/";
  const { getByTestId } = render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

  expect(getByTestId(/components--nav-menu/)).toBeInTheDocument();
});
