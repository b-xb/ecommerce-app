import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ListGroup from 'react-bootstrap/ListGroup';

import CartItem from './CartItem';
import { loadCartItems, selectCartItems } from './cartSlice';
import { loadProducts } from '../products/productsSlice';
import { selectLoginState } from '../../../features/authentication/session/sessionSlice';
import { useNavigate } from "react-router-dom";


function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartItems);
  const loggedIn = useSelector(selectLoginState); // TODO: make use of this

  useEffect(() => {
    if (loggedIn) {
      dispatch(loadProducts());
      dispatch(loadCartItems());
    } else {
      navigate('/');
    }
  }, [dispatch,loggedIn]);

  return (
    <div data-testid="store-cart">
      <ListGroup>
        {cartItems.map((cartItem) => (
          <CartItem key={cartItem.product_id} cartItem={cartItem} />
        ))}
      </ListGroup>
    </div>
  );
}

export default Cart;