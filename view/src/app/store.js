import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authentication';
import myAccountReducer from '../features/myAccount';
import storeReducer from '../features/store';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    myAccount: myAccountReducer,
    store: storeReducer,
  },
});
