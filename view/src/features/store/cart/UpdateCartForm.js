import React from 'react';
import Button from 'react-bootstrap/Button';
import { useDispatch } from 'react-redux';
import { updateCartItem } from './cartSlice';

function UpdateCartForm({productId,amount}) {
  
  const dispatch = useDispatch();

  const handleUpdate = (productId, amount) => {
    dispatch(updateCartItem({productId, amount}))
  }

  return (
    <div className="text-center text-nowrap d-flex align-items-center justify-content-center">
      <Button variant="dark" className="rounded-circle" size="sm" onClick={()=>handleUpdate(productId,amount-1)} disabled={amount<=1}>-</Button>
      <span className="d-inline-block px-2">{amount}</span>
      <Button variant="dark" className="rounded-circle" size="sm" onClick={()=>handleUpdate(productId,amount+1)}>+</Button> {/* TODO: disabled when equal to the amount in stock */}
    </div>
  );
}

export default UpdateCartForm;