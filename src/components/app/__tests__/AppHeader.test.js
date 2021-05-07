import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import store from '../../../redux/store';
import { clearUser, setUser } from '../../../redux/userSlice';
import AppHeader from '../AppHeader';

describe('<AppHeader />', () => {
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

      store.dispatch(setUser(expectedUser));

      const userDropdown = await screen.findByTestId('userDropdown');
      const userDropdownToggle = userDropdown.querySelector('.dropdown-toggle');

      expect(screen.queryByTestId('loginLink')).not.toBeInTheDocument();
      expect(userDropdownToggle).toHaveTextContent(
        `${expectedUser.firstName} ${expectedUser.lastName}`
      );

      fireEvent.click(userDropdownToggle);

      await screen.findByTestId('logoutLink');

      store.dispatch(clearUser());

      await screen.findByTestId('loginLink');
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
      const expectedUser = {
        firstName: 'Test',
        lastName: 'User',
      };

      const dispatchSpy = jest.spyOn(store, 'dispatch');

      store.dispatch(setUser(expectedUser));

      const userDropdown = await screen.findByTestId('userDropdown');
      const userDropdownToggle = userDropdown.querySelector('.dropdown-toggle');
      fireEvent.click(userDropdownToggle);

      const logoutLink = await screen.findByTestId('logoutLink');
      fireEvent.click(logoutLink);

      await screen.findByTestId('loginLink');
      expect(dispatchSpy).toHaveBeenLastCalledWith({
        payload: undefined,
        type: 'user/clearUser',
      });

      dispatchSpy.mockRestore();
    });
  });
});
