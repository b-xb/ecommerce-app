import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function Store() {
  return (
    <div data-testid="store">
      <Row xs={1} md={4} className="g-4">
        {Array.from({ length: 10 }).map((_, idx) => (
          <Col key={idx}>
            <Card>
              <Card.Img variant="top" src="/images/no-image.svg" />
              <Card.Body>
                <Card.Title>Card title</Card.Title>
                <Card.Text>
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit
                  longer.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Store;