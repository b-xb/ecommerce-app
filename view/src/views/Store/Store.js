import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ShoppingCart from './shoppingCart/ShoppingCart';
import PageNotFound from '../Pages/PageNotFound';
import ProductsView from './ProductsView';
import Product from './Product';

function Store() {
  return (
    <div data-testid="store">
      <Routes>
        <Route path="/" element={<ProductsView />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart/*" element={<ShoppingCart />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default Store;