import React from 'react';
import { render } from '../../utils/test-utils';
import App from '../../app/App';
import { MemoryRouter } from 'react-router-dom';

test('//auth/registrationSuccessful should load Registration Successful page', () => {
  const route = "/auth/registrationSuccessful";
  const { getByTestId } = render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

  expect(getByTestId(/auth--registration-successful/)).toBeInTheDocument();
});
