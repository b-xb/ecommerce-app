import React from 'react';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from 'react-router-dom';

function PrivateMenuItems() {
  const expand = "md";
  return (
    <>
      <Nav.Link as={NavLink} to="/store/cart">Shopping Cart</Nav.Link>

      <NavDropdown
        title="My Account"
        id={`offcanvasNavbarDropdown-expand-${expand}`}
      >
        <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
        <NavDropdown.Item href="#action4">
          Another action
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action5">
          Something else here
        </NavDropdown.Item>
      </NavDropdown>

      <Nav.Link as={NavLink} to="/auth/logout">Log Out</Nav.Link>
    </>
  );
}

export default PrivateMenuItems;
