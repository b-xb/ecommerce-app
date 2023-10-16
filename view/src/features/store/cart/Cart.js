import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ListGroup from 'react-bootstrap/ListGroup';

import CartItem from './CartItem';
import { loadCartItems, selectCartItems, updateCartItem } from './cartSlice';
import { loadProducts } from '../products/productsSlice';import { selectLoginState } from '../../../features/authentication/session/sessionSlice';


function Cart() {
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);  
  const loggedIn = useSelector(selectLoginState);

  useEffect(() => {
    dispatch(loadProducts());
    dispatch(loadCartItems());
  }, [dispatch]);

  const handleUpdate = (productId, amount) => {
    dispatch(updateCartItem({productId, amount}))
  }

  return (
    <div data-testid="store-cart">
      <ListGroup>
        {cartItems.map((cartItem) => (
          <CartItem key={cartItem.product_id} cartItem={cartItem} handleUpdate={handleUpdate} />
        ))}
      </ListGroup>
    </div>
  );
}

export default Cart;