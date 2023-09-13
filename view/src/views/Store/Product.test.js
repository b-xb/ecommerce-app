import React from 'react';
import { render } from '../../utils/test-utils';
import App from '../../app/App';
import { MemoryRouter } from 'react-router-dom';

test('/store/product/:id path should load the Product Details page', () => {
  const route = "/store/product/temp-id";
  const { getByTestId } = render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

  expect(getByTestId(/store-product-details/)).toBeInTheDocument();
});
