import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { verifySession, selectLoginState } from '../../features/authentication/session/sessionSlice';
import PublicMenuItems from './PublicMenuItems';
import PrivateMenuItems from './PrivateMenuItems';

function NavigationMenu() {

  const dispatch = useDispatch();

  const { t, i18n } = useTranslation();

  const loggedIn = useSelector(selectLoginState);

  useEffect(() => {
    if (loggedIn) {
      dispatch(verifySession());
    }
  }, [dispatch,loggedIn]);

  const expand = "md";

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <header className="fixed-top">
      <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3 flex-shrink-0" data-testid="components--nav-menu">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">{t("Website Title")}</Navbar.Brand>
          <Navbar.Toggle
            aria-controls={`offcanvasNavbar-expand-${expand}`}
            onClick={handleShow}
          />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
            show={show}
            onHide={handleClose}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                {t("Website Title")}
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1">
                <Nav.Link as={NavLink} to="/store" onClick={handleClose} >Store</Nav.Link>
                {
                  ( loggedIn && <PrivateMenuItems handleClose={handleClose} /> ) || <PublicMenuItems handleClose={handleClose} />
                }
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </header>
  );
}

export default NavigationMenu;
