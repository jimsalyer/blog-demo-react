import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export default function AppHeader() {
  return (
    <Navbar
      bg="light"
      collapseOnSelect
      expand="lg"
      fixed="top"
      variant="light"
      className="shadow-sm"
      data-testid="appHeader"
    >
      <Navbar.Brand as={NavLink} exact to="/">
        <img
          src="/logo.svg"
          alt="Blog Logo"
          height="24"
          className="d-inline-block align-top"
        />{' '}
        Blog
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarContent" />
      <Navbar.Collapse id="navbarContent">
        <Nav className="mr-auto">
          <Nav.Link as={NavLink} exact to="/" data-testid="homeLink">
            Home
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
