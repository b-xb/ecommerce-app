import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../app/store';
import App from '../../app/App';
import { MemoryRouter } from 'react-router-dom';

test('/attribution-info path should load Attribution page', () => {
  const route = "/attribution-info";
  const { getByTestId } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </Provider>
  );

  expect(getByTestId(/attribution-info/)).toBeInTheDocument();
});
