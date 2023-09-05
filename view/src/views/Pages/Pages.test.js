import React from 'react';
import { render } from '../../utils/test-utils';
import App from '../../app/App';
import { MemoryRouter } from 'react-router-dom';

test('Bad Route should redirect to 404 page', () => {
  const route = "/bad-route";
  const { getByTestId } = render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

  expect(getByTestId(/page-not-found/)).toBeInTheDocument();
});
