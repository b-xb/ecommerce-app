import React from 'react';
import { render } from '../../utils/test-utils';
import App from '../../app/App';
import { MemoryRouter } from 'react-router-dom';

test('Landing Page redirects to the store page', async () => {
  const route = "/";
  const { getByTestId } = render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
  expect(getByTestId(/store/)).toBeInTheDocument();
});