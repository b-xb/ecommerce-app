import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProducts } from '../../../api/products';

const initialState = {
  isLoading: false,
  products: [],
};

export const loadProducts = createAsyncThunk(
  'store/products/loadProducts',
  async () => {
    const response = await getProducts();
    return response;
  }
);

export const productsSlice = createSlice({
  name: 'store/products/',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadProducts.fulfilled, (state, {payload}) => {
        state.products = payload;
        state.isLoading = false;
      })
  },
});

export const selectProducts = (state) => state.store.products.products;
export const selectProductById = (state, productId) => {
  return state.store.products.products.filter(
    (product) => product.id === productId
  )?.[0];
}

export const isLoading = (state) => state.store.products.isLoading;

export default productsSlice.reducer;
