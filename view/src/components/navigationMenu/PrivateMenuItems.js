import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { submitLogoutRequest } from '../../features/authentication/logoutRequest/logoutRequestSlice';

function PrivateMenuItems({handleClose}) {

  const dispatch = useDispatch();

  const handleLogout = async (e) => {
    dispatch(submitLogoutRequest());
    handleClose();
  };

  const expand = "md";
  return (
    <>
      <Nav.Link as={NavLink} to="/store/cart" onClick={handleClose} >Shopping Cart</Nav.Link>

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

      <Button onClick={handleLogout}>Log Out</Button>
    </>
  );
}

export default PrivateMenuItems;
