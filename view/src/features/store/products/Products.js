import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { loadProducts, selectProducts } from './productsSlice';
import { loadCartItems } from '../cart/cartSlice';

import ProductSummary from './ProductSummary';

import { selectLoginState } from '../../../features/authentication/session/sessionSlice';

function Products() {

  const loggedIn = useSelector(selectLoginState);

  const products = useSelector(selectProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  useEffect(() => {
    if (loggedIn && products.length>0) {
      dispatch(loadCartItems());
    }
  }, [dispatch,loggedIn,products]);

  return (
    <div data-testid="store-products">
      <Row xs={1} md={2} lg={4} className="g-4 text-center">
        {products.map((product) => (
          <Col key={product.id}>
            <ProductSummary product={product}/>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Products;