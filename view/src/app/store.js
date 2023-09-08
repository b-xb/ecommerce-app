import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authentication';
import myAccountReducer from '../features/myAccount';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    myAccount: myAccountReducer,
  },
});
