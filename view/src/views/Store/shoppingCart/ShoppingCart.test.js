import React from 'react';
import { render } from '../../../utils/test-utils';
import App from '../../../app/App';
import { MemoryRouter } from 'react-router-dom';

test('/store/cart path should redirect to the store page when not logged in', () => {
  const route = "/store/cart";
  const { getByTestId } = render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

  expect(getByTestId(/^store$/)).toBeInTheDocument();
});
