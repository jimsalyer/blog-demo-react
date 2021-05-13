import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import store from '../../redux/store';
import { login } from '../../redux/userSlice';
import authService from '../../services/AuthService';
import AppHeader from './AppHeader';

describe('<AppHeader />', () => {
  const expectedToken = 'testaccesstoken';
  const expectedUserId = 1;
  const expectedUsername = 'tuser';

  const expectedAccessToken = {
    userId: expectedUserId,
    token: expectedToken,
  };

  const expectedLogin = {
    username: expectedUsername,
    password: 'testpassword',
    remember: true,
  };

  const expectedUser = {
    id: expectedUserId,
    firstName: 'Test',
    lastName: 'User',
    username: expectedUsername,
    accessToken: expectedToken,
  };

  beforeEach(() => {
    jest.spyOn(authService, 'login').mockResolvedValue(expectedUser);
    jest.spyOn(authService, 'logout').mockResolvedValue(expectedAccessToken);
  });

  describe('Rendering', () => {
    it('renders user dropdown with a "Log Out" link if the user is logged in', async () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <AppHeader />
          </MemoryRouter>
        </Provider>
      );

      screen.getByTestId('loginLink');
      expect(screen.queryByTestId('logoutLink')).not.toBeInTheDocument();

      await store.dispatch(login(expectedLogin));

      const userDropdown = await screen.findByTestId('userDropdown');
      const userDropdownToggle = userDropdown.querySelector('.dropdown-toggle');
      fireEvent.click(userDropdownToggle);

      expect(screen.queryByTestId('loginLink')).not.toBeInTheDocument();
      expect(userDropdownToggle).toHaveTextContent(
        `${expectedUser.firstName} ${expectedUser.lastName}`
      );

      const logoutLink = await screen.findByTestId('logoutLink');
      fireEvent.click(logoutLink);

      await screen.findByTestId('loginLink');
    });

    it('renders a status message while waiting for the logout action to complete and then redirects to "/login"', async () => {
      let testLocation;

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <AppHeader />
            <Route
              path="*"
              render={({ location }) => {
                testLocation = location;
                return null;
              }}
            />
          </MemoryRouter>
        </Provider>
      );

      await store.dispatch(login(expectedLogin));

      const userDropdown = await screen.findByTestId('userDropdown');
      const userDropdownToggle = userDropdown.querySelector('.dropdown-toggle');
      fireEvent.click(userDropdownToggle);

      const logoutLink = await screen.findByTestId('logoutLink');
      fireEvent.click(logoutLink);

      const logoutStatus = await screen.findByTestId('logoutStatus');
      expect(logoutStatus).toHaveTextContent('Logging Out');

      await screen.findByTestId('loginLink');
      expect(testLocation.pathname).toBe('/login');
    });

    it('renders and activates "Posts" link when the path is "/"', () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <AppHeader />
          </MemoryRouter>
        </Provider>
      );

      screen.getByTestId('appHeader');
      expect(screen.getByTestId('postsLink')).toHaveClass('active');
    });

    it('renders and activates "Log In" link when the path is "/login"', () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/login']}>
            <AppHeader />
          </MemoryRouter>
        </Provider>
      );

      screen.getByTestId('appHeader');
      expect(screen.getByTestId('loginLink')).toHaveClass('active');
    });
  });

  describe('Navigation', () => {
    let testLocation;

    beforeEach(() => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/invalid-path']}>
            <AppHeader />
            <Route
              path="*"
              render={({ location }) => {
                testLocation = location;
                return null;
              }}
            />
          </MemoryRouter>
        </Provider>
      );
    });

    it('navigates to "/" when clicking <Navbar.Brand />', async () => {
      expect(testLocation.pathname).toBe('/invalid-path');

      const brand = screen.getByTestId('brand');
      fireEvent.click(brand);

      await waitFor(() => {
        expect(testLocation.pathname).toBe('/');
      });
    });

    it('navigates to "/" when clicking the "Posts" link', async () => {
      expect(testLocation.pathname).toBe('/invalid-path');

      const postsLink = screen.getByTestId('postsLink');
      fireEvent.click(postsLink);

      await waitFor(() => {
        expect(testLocation.pathname).toBe('/');
      });
    });

    it('navigates to "/login" when clicking the "Log In" link', async () => {
      expect(testLocation.pathname).toBe('/invalid-path');

      const loginLink = screen.getByTestId('loginLink');
      fireEvent.click(loginLink);

      await waitFor(() => {
        expect(testLocation.pathname).toBe('/login');
      });
    });

    it('logs the user out and navigates to "/login" when clicking the "Log Out" link', async () => {
      expect(testLocation.pathname).toBe('/invalid-path');

      await store.dispatch(login(expectedLogin));

      const userDropdown = await screen.findByTestId('userDropdown');
      const userDropdownToggle = userDropdown.querySelector('.dropdown-toggle');

      fireEvent.click(userDropdownToggle);

      const logoutLink = await screen.findByTestId('logoutLink');
      fireEvent.click(logoutLink);

      await screen.findByTestId('loginLink');

      await waitFor(() => {
        expect(testLocation.pathname).toBe('/login');
      });
    });
  });
});
