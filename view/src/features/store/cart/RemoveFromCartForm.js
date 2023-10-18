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
  const mLabel = size === "sm" ? "X" : "Remove From Cart";

  return (
    <>
      <Button className="d-none d-xl-inline-block" onClick={()=>{handleRemoveFromCart(productId)}} variant="primary">{ label }</Button>
      <Button className="d-inline-block d-xl-none" onClick={()=>{handleRemoveFromCart(productId)}} variant="primary">{ mLabel }</Button>
    </>
  );
}

export default RemoveFromCartForm;