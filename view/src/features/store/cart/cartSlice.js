import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCartItemsByUser, updateCartItemByUserAndProduct } from '../../../api/users';

const initialState = {
  isLoading: false,
  isUpdating: false,
  cartItems: [],
};

export const loadCartItems = createAsyncThunk(
  'store/cart/loadCartItems',
  async (args, {getState}) => {
    const { auth } = getState();
    const userId = auth.session.userId;
    const response = await getCartItemsByUser(userId);
    return response;
  }
);

export const updateCartItem = createAsyncThunk(
  'store/cart/updateCartItem',
  async ({ productId, amount }, {getState}) => {
    const { auth } = getState();
    const userId = auth.session.userId;
    const response = await updateCartItemByUserAndProduct(userId, productId, amount);
    const { success } = response;
    if (success) {
      return { productId, amount };
    } else {
      return null;
    }
  }
);

export const cartSlice = createSlice({
  name: 'store/cart/',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadCartItems.fulfilled, (state, {payload}) => {
        state.cartItems = payload;
        state.isLoading = false;
      })
      .addCase(updateCartItem.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateCartItem.fulfilled, (state, {payload}) => {
        const { productId, amount } = payload;
        state.cartItems = state.cartItems.map((cartItem) => {
          if (cartItem.product_id === productId) {
            cartItem.amount = amount;
          }
          return cartItem;
        });
        state.isUpdating = false;
      })
  },
});

export const selectCartItems = (state) => state.store.cart.cartItems;

export const isLoading = (state) => state.store.cart.isLoading;

export default cartSlice.reducer;
