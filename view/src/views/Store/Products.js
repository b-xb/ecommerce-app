import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

function Products() {
  return (
    <div data-testid="store-products">
      <Row xs={1} md={2} lg={4} className="g-4 text-center">
        {Array.from({ length: 10 }).map((_, idx) => (
          <Col key={idx}>
            <Card>
              <Card.Img variant="top" src="/images/no-image.svg" />
              <Card.Body className="d-flex flex-column">
                <Card.Title>Card title</Card.Title>
                <Card.Text>£999.99</Card.Text>
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