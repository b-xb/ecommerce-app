import React from 'react';
import { selectProductById } from '../products/productsSlice';
import { useSelector } from 'react-redux';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';

import UpdateCartForm from './UpdateCartForm';
import RemoveFromCartForm from './RemoveFromCartForm';
import { price } from '../../../utils/formatters';

function CartItem({cartItem}) {
  const { product_id, amount } = cartItem;
  const product = useSelector(state => selectProductById(state, product_id))

  return (
    <ListGroup.Item>

      <Row className="d-none d-lg-flex align-items-center">
        <Col xs={2} >
          <Image src="/images/no-image.svg" fluid />
        </Col>
        <Col xs={3} xl={2} >
          {product.name}
        </Col>
        <Col xs={1} className="text-center">
          { price(product.unit_price) }
        </Col>
        <Col xs={1} className="text-center">
          x
        </Col>
        <Col xs={2} className="text-center">
          <UpdateCartForm productId={product_id} amount={amount} />
        </Col>
        <Col xs={1} className="text-center">
          =
        </Col>
        <Col xs={1} className="text-end">
          { price(product.unit_price * amount) }
        </Col>
        <Col xs={1} className="d-lg-block d-xl-none text-center">
          <RemoveFromCartForm productId={product_id} size="xs" />
        </Col>
        <Col xs={2} className="d-none d-xl-block text-center">
          <RemoveFromCartForm productId={product_id} size="sm" />
        </Col>
      </Row>

      <Row className="d-none d-sm-flex d-lg-none align-items-center">
        <Col xs={2} >
          <Image src="/images/no-image.svg" fluid />
        </Col>
        <Col xs={3} >
          <div>{ product.name }</div>
          <div>{ price(product.unit_price) }</div>
        </Col>
        <Col xs={3} >
          <UpdateCartForm productId={product_id} amount={amount} />
        </Col>
        <Col xs={2} className="text-end">
          <div>{ price(product.unit_price * amount) }</div>
        </Col>
        <Col xs={2} className="text-center">
          <RemoveFromCartForm productId={product_id} size="xs" />
        </Col>
      </Row>

      <Row className="d-flex d-sm-none align-items-center">
        <Col xs={3} >
          <Image src="/images/no-image.svg" fluid />
        </Col>
        <Col xs={3}>
          <div>{ product.name }</div>
          <div>{ price(product.unit_price) }</div>
        </Col>
        <Col xs={4} className="text-center text-no-wrap" >
          <UpdateCartForm productId={product_id} amount={amount} />
          <div>{ price(product.unit_price * amount) }</div>
        </Col>
        <Col xs={2} className="text-center">
          <RemoveFromCartForm productId={product_id} size="xs"/>
        </Col>
      </Row>
    </ListGroup.Item>
  );
}

export default CartItem;