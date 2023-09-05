import React from 'react';
import { render } from '../../utils/test-utils';
import App from '../../app/App';
import { MemoryRouter } from 'react-router-dom';

test('/attribution-info path should load Attribution page', () => {
  const route = "/attribution-info";
  const { getByTestId } = render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

  expect(getByTestId(/attribution-info/)).toBeInTheDocument();
});
