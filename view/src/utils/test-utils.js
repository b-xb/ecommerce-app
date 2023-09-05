import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nextProvider } from 'react-i18next';

import {render} from '@testing-library/react'

const AllTheProviders = ({children}) => {
  i18n
    .use(initReactI18next)
    .init({
      lng: 'en',
      fallbackLng: 'en',

      // have a common namespace used around the full app
      ns: ['translationsNS'],
      defaultNS: 'translationsNS',

      debug: false,

      interpolation: {
        escapeValue: false, // not needed for react!!
      },

      resources: { en: { translationsNS: {} } },
    });

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
          {children}
      </I18nextProvider>
    </Provider>
  );
}

const customRender = (ui, options) =>
  render(ui, {wrapper: AllTheProviders, ...options})

// re-export everything
export * from '@testing-library/react'

// override render method
export {customRender as render}