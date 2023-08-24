import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../app/store';
import App from '../../app/App';
import { MemoryRouter } from 'react-router-dom';

test('Bad Route should redirect to 404 page', () => {
  const route = "/bad-route";
  const { getByTestId } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </Provider>
  );

  expect(getByTestId(/page-not-found/)).toBeInTheDocument();
});
