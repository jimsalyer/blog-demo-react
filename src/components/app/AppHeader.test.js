import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import store from '../../redux/store';
import { login, logout } from '../../redux/userSlice';
import AuthService from '../../services/AuthService';
import AppHeader from './AppHeader';

jest.mock('../../services/AuthService');

describe('<AppHeader />', () => {
  let mockLogout;

  beforeEach(() => {
    mockLogout = jest.fn();
    AuthService.mockImplementation(() => ({
      logout: mockLogout,
    }));
  });

  afterEach(() => {
    AuthService.mockRestore();
  });

  describe('Rendering', () => {
    it('renders user dropdown with a "Log Out" link if the user is logged in', async () => {
      const expectedUser = {
        firstName: 'Test',
        lastName: 'User',
      };

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <AppHeader />
          </MemoryRouter>
        </Provider>
      );

      screen.getByTestId('loginLink');
      expect(screen.queryByTestId('logoutLink')).not.toBeInTheDocument();

      store.dispatch(login(expectedUser));

      const userDropdown = await screen.findByTestId('userDropdown');
      const userDropdownToggle = userDropdown.querySelector('.dropdown-toggle');

      expect(screen.queryByTestId('loginLink')).not.toBeInTheDocument();
      expect(userDropdownToggle).toHaveTextContent(
        `${expectedUser.firstName} ${expectedUser.lastName}`
      );

      fireEvent.click(userDropdownToggle);

      await screen.findByTestId('logoutLink');

      store.dispatch(logout());

      await screen.findByTestId('loginLink');
    });

    it('renders a status message while waiting for the logout action to complete and then redirects to "/login"', async () => {
      const expectedUser = {
        firstName: 'Test',
        lastName: 'User',
      };

      mockLogout.mockResolvedValue();

      let testLocation;

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <AppHeader />
            <Route
              path="*"
              render={({ location }) => {
                testLocation = location;
              }}
            />
          </MemoryRouter>
        </Provider>
      );

      store.dispatch(login(expectedUser));

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

    it('navigates to "/" when clicking <Navbar.Brand />', () => {
      expect(testLocation.pathname).toBe('/invalid-path');

      act(() => {
        const brand = screen.getByTestId('brand');
        fireEvent.click(brand);
      });

      expect(testLocation.pathname).toBe('/');
    });

    it('navigates to "/" when clicking the "Posts" link', () => {
      expect(testLocation.pathname).toBe('/invalid-path');

      act(() => {
        const postsLink = screen.getByTestId('postsLink');
        fireEvent.click(postsLink);
      });

      expect(testLocation.pathname).toBe('/');
    });

    it('navigates to "/login" when clicking the "Log In" link', () => {
      expect(testLocation.pathname).toBe('/invalid-path');

      act(() => {
        const loginLink = screen.getByTestId('loginLink');
        fireEvent.click(loginLink);
      });

      expect(testLocation.pathname).toBe('/login');
    });

    it('logs the user out when clicking the "Log Out" link', async () => {
      const user = {
        firstName: 'Test',
        lastName: 'User',
      };

      const dispatchSpy = jest.spyOn(store, 'dispatch');
      mockLogout.mockResolvedValue();

      store.dispatch(login(user));

      const userDropdown = await screen.findByTestId('userDropdown');
      const userDropdownToggle = userDropdown.querySelector('.dropdown-toggle');

      fireEvent.click(userDropdownToggle);

      const logoutLink = await screen.findByTestId('logoutLink');
      fireEvent.click(logoutLink);

      await screen.findByTestId('loginLink');

      expect(mockLogout).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenLastCalledWith({
        payload: undefined,
        type: 'user/logout',
      });

      dispatchSpy.mockRestore();
    });
  });
});