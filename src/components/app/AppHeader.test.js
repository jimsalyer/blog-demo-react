import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
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
        <StoreProvider store={store}>
          <ToastProvider>
            <MemoryRouter initialEntries={['/']}>
              <AppHeader />
            </MemoryRouter>
          </ToastProvider>
        </StoreProvider>
      );

      screen.getByTestId('loginLink');
      expect(screen.queryByTestId('logoutLink')).not.toBeInTheDocument();

      await store.dispatch(login(expectedLogin));

      const userDropdown = await screen.findByTestId('userDropdown');
      const userDropdownToggle = userDropdown.querySelector('.dropdown-toggle');
      userEvent.click(userDropdownToggle);

      expect(screen.queryByTestId('loginLink')).not.toBeInTheDocument();
      expect(userDropdownToggle).toHaveTextContent(
        `${expectedUser.firstName} ${expectedUser.lastName}`
      );

      const logoutLink = await screen.findByTestId('logoutLink');
      userEvent.click(logoutLink);

      await screen.findByTestId('loginLink');
    });

    it('renders a status message while waiting for the logout action to complete', async () => {
      render(
        <StoreProvider store={store}>
          <ToastProvider>
            <MemoryRouter initialEntries={['/']}>
              <AppHeader />
            </MemoryRouter>
          </ToastProvider>
        </StoreProvider>
      );

      await store.dispatch(login(expectedLogin));

      const userDropdown = await screen.findByTestId('userDropdown');
      const userDropdownToggle = userDropdown.querySelector('.dropdown-toggle');
      userEvent.click(userDropdownToggle);

      const logoutLink = await screen.findByTestId('logoutLink');
      userEvent.click(logoutLink);

      const logoutStatus = await screen.findByTestId('logoutStatus');
      expect(logoutStatus).toHaveTextContent('Logging Out');

      await screen.findByTestId('loginLink');
    });

    it('shows a notification message when the logout action is complete', async () => {
      render(
        <StoreProvider store={store}>
          <ToastProvider>
            <MemoryRouter initialEntries={['/']}>
              <AppHeader />
            </MemoryRouter>
          </ToastProvider>
        </StoreProvider>
      );

      await store.dispatch(login(expectedLogin));

      const userDropdown = await screen.findByTestId('userDropdown');
      const userDropdownToggle = userDropdown.querySelector('.dropdown-toggle');
      userEvent.click(userDropdownToggle);

      const logoutLink = await screen.findByTestId('logoutLink');
      userEvent.click(logoutLink);

      await screen.findByTestId('loginLink');
      await waitFor(() =>
        expect(
          screen.queryByText(
            `${expectedUser.firstName} ${expectedUser.lastName} logged out successfully.`
          )
        ).toBeInTheDocument()
      );
    });

    it('renders and activates "Posts" link when the path is "/"', () => {
      render(
        <StoreProvider store={store}>
          <ToastProvider>
            <MemoryRouter initialEntries={['/']}>
              <AppHeader />
            </MemoryRouter>
          </ToastProvider>
        </StoreProvider>
      );

      screen.getByTestId('appHeader');
      expect(screen.getByTestId('postsLink')).toHaveClass('active');
    });

    it('renders and activates "Log In" link when the path is "/login"', () => {
      render(
        <StoreProvider store={store}>
          <ToastProvider>
            <MemoryRouter initialEntries={['/login']}>
              <AppHeader />
            </MemoryRouter>
          </ToastProvider>
        </StoreProvider>
      );

      screen.getByTestId('appHeader');
      expect(screen.getByTestId('loginLink')).toHaveClass('active');
    });
  });

  describe('Navigation', () => {
    let testLocation;

    beforeEach(() => {
      render(
        <StoreProvider store={store}>
          <ToastProvider>
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
          </ToastProvider>
        </StoreProvider>
      );
    });

    it('navigates to "/" when clicking <Navbar.Brand />', async () => {
      expect(testLocation.pathname).toBe('/invalid-path');

      const brand = screen.getByTestId('brand');
      userEvent.click(brand);

      await waitFor(() => expect(testLocation.pathname).toBe('/'));
    });

    it('navigates to "/" when clicking the "Posts" link', async () => {
      expect(testLocation.pathname).toBe('/invalid-path');

      const postsLink = screen.getByTestId('postsLink');
      userEvent.click(postsLink);

      await waitFor(() => expect(testLocation.pathname).toBe('/'));
    });

    it('navigates to "/login" when clicking the "Log In" link', async () => {
      expect(testLocation.pathname).toBe('/invalid-path');

      const loginLink = screen.getByTestId('loginLink');
      userEvent.click(loginLink);

      await waitFor(() => expect(testLocation.pathname).toBe('/login'));
    });

    it('logs the user out and navigates to "/login" when clicking the "Log Out" link', async () => {
      expect(testLocation.pathname).toBe('/invalid-path');

      await store.dispatch(login(expectedLogin));

      const userDropdown = await screen.findByTestId('userDropdown');
      const userDropdownToggle = userDropdown.querySelector('.dropdown-toggle');

      userEvent.click(userDropdownToggle);

      const logoutLink = await screen.findByTestId('logoutLink');
      userEvent.click(logoutLink);

      await screen.findByTestId('loginLink');

      await waitFor(() => expect(testLocation.pathname).toBe('/login'));
    });
  });
});
