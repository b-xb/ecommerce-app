import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { loadProducts, selectProducts } from './productsSlice';
import { loadCartItems, addCartItem, updateCartItem } from '../cart/cartSlice';
import { price } from '../../../utils/formatters';

import ProductSummary from './ProductSummary';

function Products() {

  const products = useSelector(selectProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products.length>0) {
      dispatch(loadCartItems());
    }
  }, [dispatch,products]);

  const handleAddToCart = (productId, amount) => {
    dispatch(addCartItem({productId, amount}))
  }

  const handleUpdateCart = (productId, amount) => {
    dispatch(updateCartItem({productId, amount}))
  }

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