import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authRegisterUser } from '../../../api/auth';

const initialState = {
  isSending: false,
  form: {
    "name":"",
    "email":"",
    "address":"",
    "password":"",
  },
  success: false,
};

export const submitRegistrationForm = createAsyncThunk(
  'auth/registrationForm/registerUser',
  async (form) => {
    const response = await authRegisterUser(form);
    return response;
  }
);

export const registrationFormSlice = createSlice({
  name: 'auth/registrationForm',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.form.name = action.payload;
    },
    setEmail: (state, action) => {
      state.form.email = action.payload;
    },
    setPassword: (state, action) => {
      state.form.password = action.payload;
    },
    setAddress: (state, action) => {
      state.form.address = action.payload;
    },
    resetForm: (state) => {
      state.form = {
        "name":"",
        "email":"",
        "address":"",
        "password":"",
      };
      state.isSending = false;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitRegistrationForm.pending, (state,action) => {
        state.isSending = true;
      })
      .addCase(submitRegistrationForm.fulfilled, (state,action) => {
        state.isSending = false;
        state.success = true;
      });
  },
});

export const { setName, setEmail, setPassword, setAddress, resetForm } = registrationFormSlice.actions;

export const selectName = (state) => state.auth.registrationForm.form.name;
export const selectEmail = (state) => state.auth.registrationForm.form.email;
export const selectPassword = (state) => state.auth.registrationForm.form.password;
export const selectAddress = (state) => state.auth.registrationForm.form.address;

export const isSending = (state) => state.auth.registrationForm.isSending;
export const registrationSuccessful = (state) => state.auth.registrationForm.success;

export default registrationFormSlice.reducer;
