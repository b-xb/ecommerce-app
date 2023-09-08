import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authLogin } from '../../../api/auth';
import { setSession } from '../session/sessionSlice';

const initialState = {
  isSending: false,
  form: {
    "email":"",
    "password":"",
  },
  success: false,
};

export const submitLoginForm = createAsyncThunk(
  'auth/loginForm/login',
  async (form,{dispatch}) => {
    const response = await authLogin(form);
    const { userId } = response;
    if (userId) {
      dispatch(setSession({userId}))
    }
    return response;
  }
);

export const loginFormSlice = createSlice({
  name: 'auth/loginForm',
  initialState: { ...initialState },
  reducers: {
    setEmail: (state, action) => {
      state.form.email = action.payload;
    },
    setPassword: (state, action) => {
      state.form.password = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitLoginForm.pending, (state,action) => {
        state.isSending = true;
      })
      .addCase(submitLoginForm.fulfilled, (state,action) => {
        state.isSending = false;
        state.form = {
          "email":"",
          "password":"",
        };
        state.success = true;
      });
  },
});

export const { setEmail, setPassword } = loginFormSlice.actions;

export const selectEmail = (state) => state.auth.loginForm.form.email;
export const selectPassword = (state) => state.auth.loginForm.form.password;

export const isSending = (state) => state.auth.loginForm.isSending;
export const loginSuccessful = (state) => state.auth.loginForm.success;

export default loginFormSlice.reducer;
