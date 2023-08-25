import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="flex-shrink-0">
      <Nav className="justify-content-center bg-body-tertiary" activeKey="/home">
        <Nav.Item>
          <Nav.Link as={Link} to="/attribution-info">Attributions</Nav.Link>
        </Nav.Item>
      </Nav>
    </footer>
  );
}

export default Footer;