import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { loadProducts, selectProducts } from './productsSlice';
import { price } from '../../../utils/formatters';

function Products() {

  const products = useSelector(selectProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  return (
    <div data-testid="store-products">
      <Row xs={1} md={2} lg={4} className="g-4 text-center">
        {products.map((product) => (
          <Col key={product.id}>
            <Card>
              <Card.Img variant="top" src="/images/no-image.svg" />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{ product.name }</Card.Title>
                <Card.Text>{ price(product.unit_price) }</Card.Text>
                <Button variant="primary">Add To Cart</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Products;