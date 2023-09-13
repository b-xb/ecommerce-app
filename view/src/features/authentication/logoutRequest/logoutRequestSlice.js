import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authLogout } from '../../../api/auth';
import { clearSession } from '../session/sessionSlice';

const initialState = {
  isSending: false,
  success: false,
};

export const submitLogoutRequest = createAsyncThunk(
  'auth/logoutRequest/logout',
  async (args,{dispatch}) => {
    const response = await authLogout();
    if(response.success) {
      dispatch(clearSession());
    }
    return response;
  }
);

export const logoutRequestSlice = createSlice({
  name: 'auth/logoutRequest',
  initialState: { ...initialState },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitLogoutRequest.pending, (state,action) => {
        state.isSending = true;
      })
      .addCase(submitLogoutRequest.fulfilled, (state,action) => {
        const { success } = action.payload;
        if (success) {
          state.isSending = false;
          state.success = true;
        }
      });
  },
});

export const isSending = (state) => state.auth.logoutRequest.isSending;
export const logoutSuccessful = (state) => state.auth.logoutRequest.success;

export default logoutRequestSlice.reducer;
