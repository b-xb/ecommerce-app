import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PageNotFound from '../../Pages/PageNotFound';
import CartView from './CartView';
import CheckoutView from './CheckoutView';

function ShoppingCart() {
  return (
    <Routes>
      <Route path="/" element={<CartView />} />
      <Route path="/checkout/" element={<CheckoutView />} />
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  );
}

export default ShoppingCart;