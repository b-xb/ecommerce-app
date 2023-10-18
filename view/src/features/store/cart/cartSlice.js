import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCartItemsByUser, addCartItemByUserAndProduct, updateCartItemByUserAndProduct, deleteCartItemByUserAndProduct } from '../../../api/users';

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

export const addCartItem = createAsyncThunk(
  'store/cart/addCartItem',
  async ({ productId, amount }, {getState}) => {
    const { auth } = getState();
    const userId = auth.session.userId;
    const response = await addCartItemByUserAndProduct(userId, productId, amount);
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

export const deleteCartItem = createAsyncThunk(
  'store/cart/deleteCartItem',
  async ({ productId }, {getState}) => {
    const { auth } = getState();
    const userId = auth.session.userId;
    const response = await deleteCartItemByUserAndProduct(userId, productId);
    return response;
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
      .addCase(addCartItem.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(addCartItem.fulfilled, (state, {payload}) => {
        const { userId, productId, amount } = payload;
        state.cartItems.push({
          user_id: userId, 
          product_id: productId, 
          amount
        })
        state.isUpdating = false;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, {payload}) => {
        if (payload !== null) {
          const { productId } = payload;
          state.cartItems = state.cartItems.filter((cartItem) => {
            return cartItem.product_id != productId;
          });
          state.isUpdating = false;
        }

      })
  },
});

export const selectCartItems = (state) => state.store.cart.cartItems;
export const selectCartItem = (state,productId) => state.store.cart.cartItems.find(
  (cartItem) => cartItem.product_id == productId
);

export const isLoading = (state) => state.store.cart.isLoading;

export default cartSlice.reducer;
