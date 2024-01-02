import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';

function PublicMenuItems({handleClose}) {
  return (
    <>
      <Nav.Link as={NavLink} to="/auth/register" onClick={handleClose}>Register</Nav.Link>
      <Nav.Link as={NavLink} to="/auth/login" onClick={handleClose}>Log In</Nav.Link>
    </>
  )
}

export default PublicMenuItems;
