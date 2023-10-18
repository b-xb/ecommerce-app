import React from 'react';
import Button from 'react-bootstrap/Button';
import { useDispatch } from 'react-redux';
import { deleteCartItem } from './cartSlice';

function RemoveFromCartForm({productId,size}) {
  
  const dispatch = useDispatch();

  const handleRemoveFromCart = (productId) => {
    dispatch(deleteCartItem({productId}))
  }
  const label = size === "sm" ? "Remove" : "Remove From Cart";

  return (
    <Button onClick={()=>{handleRemoveFromCart(productId)}} variant="primary">{ label }</Button>
  );
}

export default RemoveFromCartForm;