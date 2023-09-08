import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  loginState: false,
};

export const sessionSlice = createSlice({
  name: 'auth/session',
  initialState,
  reducers: {
    setSession: (state, action) => {
      const userId = action.payload.userId;
      if (userId) {
        state.userId = userId;
        state.loginState = true;
      } else {
        state.userId = null;
        state.loginState = false;
      }
    },
  },
});

export const { setSession } = sessionSlice.actions;

export const selectUserId = (state) => state.auth.session.userId;
export const selectLoginState = (state) => state.auth.session.loginState;

export default sessionSlice.reducer;
