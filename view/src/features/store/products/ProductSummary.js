import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Card from 'react-bootstrap/Card';
import AddToCartForm from '../cart/AddToCartForm';
import UpdateCartForm from '../cart/UpdateCartForm';
import RemoveFromCartForm from '../cart/RemoveFromCartForm';
import { selectLoginState } from '../../authentication/session/sessionSlice';
import { selectCartItem } from '../cart/cartSlice';
import { price } from '../../../utils/formatters';

function ProductSummary({product}) {

  const loggedIn = useSelector(selectLoginState);
  const cartItem = useSelector((state)=> selectCartItem(state,product.id));

  const dispatch = useDispatch();

  return (
    <Card>
      <Card.Img variant="top" src="/images/no-image.svg" />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{ product.name }</Card.Title>
        <Card.Text>{ price(product.unit_price) }</Card.Text>
        {(!loggedIn || !cartItem) && <AddToCartForm productId={product.id} />}
        {loggedIn && cartItem &&  <p><UpdateCartForm productId={product.id} amount={cartItem.amount} /></p> }
        {loggedIn && cartItem &&  <RemoveFromCartForm productId={product.id} /> }
      </Card.Body>
    </Card>
  );
}

export default ProductSummary;