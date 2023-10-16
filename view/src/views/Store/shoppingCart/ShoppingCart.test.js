import React from 'react';
import { render } from '../../../utils/test-utils';
import App from '../../../app/App';
import { MemoryRouter } from 'react-router-dom';

test('/store/cart path should load the Shopping Cart view', () => {
  const route = "/store/cart";
  const { getByTestId } = render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

  expect(getByTestId(/^store-cart$/)).toBeInTheDocument();
});
