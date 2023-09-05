import React from 'react';
import { render } from '../../utils/test-utils';
import App from '../../app/App';
import { MemoryRouter } from 'react-router-dom';

test('/auth/register path should load Registration page', () => {
  const route = "/auth/register";
  const { getByTestId } = render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

  expect(getByTestId(/auth--register/)).toBeInTheDocument();
});
