import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../app/store';
import App from '../../app/App';
import { MemoryRouter } from 'react-router-dom';

test('Landing Page redirects to the store page', async () => {
  const route = "/";
  const { getByTestId } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
  expect(getByTestId(/store/)).toBeInTheDocument();
});