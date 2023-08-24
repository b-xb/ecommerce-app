import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

test('Landing Page redirects to the store page', () => {
  const route = "/";
  const { getByText } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
  expect(getByText(/Store/)).toBeInTheDocument();
});