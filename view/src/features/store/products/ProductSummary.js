import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Card from 'react-bootstrap/Card';
import UpdateCartForm from '../cart/UpdateCartForm';
import RemoveFromCartForm from '../cart/RemoveFromCartForm';
import Button from 'react-bootstrap/Button';
import { selectCartItem, addCartItem } from '../cart/cartSlice';
import { price } from '../../../utils/formatters';

function ProductSummary({product}) {

  const cartItem = useSelector((state)=> selectCartItem(state,product.id));

  const dispatch = useDispatch();

  const handleAddToCart = (productId, amount) => {
    dispatch(addCartItem({productId, amount}))
  }

  return (
    <Card>
      <Card.Img variant="top" src="/images/no-image.svg" />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{ product.name }</Card.Title>
        <Card.Text>{ price(product.unit_price) }</Card.Text>
        {!cartItem && <Button onClick={()=>{handleAddToCart(product.id, 1)}} variant="primary">Add To Cart</Button>}
        {cartItem &&  <p><UpdateCartForm productId={product.id} amount={cartItem.amount} /></p> }
        {cartItem &&  <RemoveFromCartForm productId={product.id} /> }
      </Card.Body>
    </Card>
  );
}

export default ProductSummary;