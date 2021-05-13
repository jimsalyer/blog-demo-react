import React from 'react';
import { Nav, Navbar, NavDropdown, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { logout, userSelector } from '../../redux/userSlice';

export default function AppHeader() {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(userSelector);

  async function handleSelect(eventKey) {
    if (eventKey === 'logout' && !user.isProcessing) {
      try {
        await dispatch(logout());
        history.push('/login');
      } catch {
        // Do nothing
      }
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
        {user.id && user.isProcessing && (
          <Navbar.Text data-testid="logoutStatus">
            <Spinner animation="border" size="sm" className="mr-2" />
            Logging Out
          </Navbar.Text>
        )}
        {user.id && !user.isProcessing && (
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
        {!user.id && (
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
