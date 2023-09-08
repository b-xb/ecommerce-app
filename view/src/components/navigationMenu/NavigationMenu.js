import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { selectLoginState } from '../../features/authentication/session/sessionSlice';
import PublicMenuItems from './PublicMenuItems';
import PrivateMenuItems from './PrivateMenuItems';

function NavigationMenu() {
  const { t, i18n } = useTranslation();
  
  const loggedIn = useSelector(selectLoginState);
  const expand = "md";

  return (
    <header className="fixed-top">
      <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3 flex-shrink-0" data-testid="components--nav-menu">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">{t("Website Title")}</Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                Offcanvas
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link as={NavLink} to="/store">Store</Nav.Link>
                {
                  ( loggedIn && <PrivateMenuItems /> ) || <PublicMenuItems />
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
