import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authVerify } from '../../../api/auth';

const defaultState = {
  isSending: false,
  userId: null,
  loginState: false,
};

const storeSession = (sessionState) => {
  localStorage.setItem('e-commerce-session', JSON.stringify(sessionState));
}

export const verifySession = createAsyncThunk(
  'auth/session/verify',
  async (form,{dispatch}) => {
    const response = await authVerify();
    if (response===null || response.error || response.status === false) {
      dispatch(clearSession());
      return null;
    }
    return response;
  }
);

const loadSession = () => {
  const sessionState = localStorage.getItem('e-commerce-session');
  if (sessionState===null) {
    return defaultState;
  } else {
    return JSON.parse(sessionState);
  }
}

const initialState = loadSession();


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
      storeSession(state);
    },
    clearSession: (state) => {
      state.userId = null;
      state.loginState = false;
      storeSession(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifySession.pending, (state,action) => {
        state.isSending = true;
      })
      .addCase(verifySession.fulfilled, (state,action) => {
        state.isSending = false;
      });
  },
});

export const { setSession, clearSession } = sessionSlice.actions;

export const selectUserId = (state) => state.auth.session.userId;
export const selectLoginState = (state) => state.auth.session.loginState;

export default sessionSlice.reducer;
