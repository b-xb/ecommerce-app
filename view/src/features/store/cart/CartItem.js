import React from 'react';
import { selectProductById } from '../products/productsSlice';
import { useSelector } from 'react-redux';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

import { price } from '../../../utils/formatters';

function CartItem({cartItem, handleUpdate}) {
  const { product_id, amount } = cartItem;
  const product = useSelector(state => selectProductById(state, product_id))

  return (
    <ListGroup.Item>
      <Row className="d-none d-lg-flex align-items-center">
        <Col xs={2} >
          <Image src="/images/no-image.svg" fluid />
        </Col>
        <Col xs={3} >
          {product.name}
        </Col>
        <Col xs={1} className="text-center">
          { price(product.unit_price) }
        </Col>
        <Col xs={1} className="text-center">
          x
        </Col>
        <Col xs={2} className="text-center text-nowrap d-flex align-items-center justify-content-center">
          <Button variant="dark" className="rounded-circle" size="sm" onClick={()=>handleUpdate(product_id,amount-1)}>-</Button>
          <span className="d-inline-block px-2">{amount}</span>
          <Button variant="dark" size="sm" className="rounded-circle" onClick={()=>handleUpdate(product_id,amount+1)}>+</Button>
        </Col>
        <Col xs={1} className="text-center">
          =
        </Col>
        <Col xs={2} className="text-end">
          { price(product.unit_price * amount) }
        </Col>
      </Row>
      <Row className="d-flex d-lg-none align-items-center">
        <Col xs={2} >
          <Image src="/images/no-image.svg" fluid />
        </Col>
        <Col xs={5} >
          <div>{ product.name }</div>
          <div>{ price(product.unit_price) }</div>
        </Col>
        <Col xs={5} className="text-end">
          <div>x { amount }</div>
          <div>= { price(product.unit_price * amount) }</div>
        </Col>
      </Row>
    </ListGroup.Item>
  );
}

export default CartItem;