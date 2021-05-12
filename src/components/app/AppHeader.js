import React, { useState } from 'react';
import { Nav, Navbar, NavDropdown, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { logout, selectUser } from '../../redux/userSlice';
import AuthService from '../../services/AuthService';

export default function AppHeader() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [loggingOut, setLoggingOut] = useState(false);
  const user = useSelector(selectUser);

  async function handleSelect(eventKey) {
    if (eventKey === 'logout' && !loggingOut) {
      setLoggingOut(true);
      await new AuthService().logout(user.accessToken);
      dispatch(logout());
      setLoggingOut(false);
      history.push('/login');
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
        {user && loggingOut && (
          <Navbar.Text data-testid="logoutStatus">
            <Spinner animation="border" size="sm" className="mr-2" />
            Logging Out
          </Navbar.Text>
        )}
        {user && !loggingOut && (
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
