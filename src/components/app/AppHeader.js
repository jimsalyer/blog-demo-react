import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout, selectUser } from '../../redux/userSlice';

export default function AppHeader() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  function handleSelect(eventKey) {
    if (eventKey === 'logout') {
      dispatch(logout());
    }
  }

  return (
    <Navbar
      bg="light"
      collapseOnSelect
      expand="lg"
      fixed="top"
      variant="light"
      className="shadow-sm"
      data-testid="appHeader"
      onSelect={handleSelect}
    >
      <Navbar.Brand as={NavLink} exact to="/" data-testid="brand">
        <img
          src="/logo.svg"
          alt="Blog Logo"
          height="24"
          className="d-inline-block align-top"
        />{' '}
        Blog
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarContent" />
      <Navbar.Collapse id="navbarContent" className="justify-content-between">
        <Nav>
          <Nav.Link
            as={NavLink}
            eventKey="posts"
            exact
            to="/"
            data-testid="postsLink"
          >
            Posts
          </Nav.Link>
        </Nav>
        {user && (
          <Nav>
            <NavDropdown
              alignRight
              title={`${user.firstName} ${user.lastName}`}
              data-testid="userDropdown"
            >
              <NavDropdown.Item eventKey="logout" data-testid="logoutLink">
                Log Out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        )}
        {!user && (
          <Nav>
            <Nav.Link
              as={NavLink}
              eventKey="login"
              to="/login"
              data-testid="loginLink"
            >
              Log In
            </Nav.Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
