import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserById } from '../../../api/users';

const initialState = {
  isLoading: false,
  profile: {
    id: "",
    name: "",
    email: "",
    address: "",
    is_admin: false,
  },
};

export const loadUserProfile = createAsyncThunk(
  'myAccount/userProfile/loadUserProfile',
  async (id) => {
    const response = await getUserById(id);
    return response;
  }
);

export const userProfileSlice = createSlice({
  name: 'myAccount/userProfile/',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUserProfile.fulfilled, (state, {payload}) => {
        state.profile = payload;
        state.isLoading = false;
      })
  },
});

export const selectUserProfile = (state) => state.myAccount.userProfile.profile;
export const isLoading = (state) => state.myAccount.userProfile.isLoading;

export default userProfileSlice.reducer;
