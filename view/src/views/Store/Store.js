import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ShoppingCart from './shoppingCart/ShoppingCart';
import PageNotFound from '../Pages/PageNotFound';
import Products from './Products';
import Product from './Product';

function Store() {
  return (
    <div data-testid="store">
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart/*" element={<ShoppingCart />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default Store;