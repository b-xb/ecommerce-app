import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';

function PublicMenuItems() {
  return (
    <>
      <Nav.Link as={NavLink} to="/auth/register">Register</Nav.Link>
      <Nav.Link as={NavLink} to="/auth/login">Log In</Nav.Link>
    </>
  )
}

export default PublicMenuItems;
