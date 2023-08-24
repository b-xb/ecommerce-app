import { configureStore } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    dummy: createSlice({
      name: "name",
      initialState: {},
    }).reducer
  },
});