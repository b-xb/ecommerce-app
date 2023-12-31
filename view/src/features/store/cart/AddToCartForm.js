import React from 'react';
import Button from 'react-bootstrap/Button';
import { selectLoginState } from '../../authentication/session/sessionSlice';
import { useSelector, useDispatch } from 'react-redux';
import { addCartItem } from './cartSlice';
import { useNavigate } from "react-router-dom";

function AddToCartForm({productId}) {

  const loggedIn = useSelector(selectLoginState);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (productId, amount) => {
    if (loggedIn)
      dispatch(addCartItem({productId, amount}));
    else
      navigate('/auth/login');
  }

  return (
    <Button onClick={()=>{handleAddToCart(productId, 1)}} variant="primary">Add To Cart</Button>
  );
}

export default AddToCartForm;