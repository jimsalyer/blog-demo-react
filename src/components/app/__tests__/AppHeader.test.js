import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import AppHeader from '../AppHeader';

describe('<AppHeader />', () => {
  describe('Rendering', () => {
    it('renders and activates "Posts" link when the path is "/"', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <AppHeader />
        </MemoryRouter>
      );

      screen.getByTestId('appHeader');
      expect(screen.getByTestId('postsLink')).toHaveClass('active');
    });
  });

  describe('Navigation', () => {
    let testLocation;

    beforeEach(() => {
      render(
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
      );
    });

    it('navigates to "/" when clicking <Navbar.Brand />', () => {
      expect(testLocation.pathname).toBe('/invalid-path');

      act(() => {
        const brand = document.querySelector('.navbar-brand');
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
  });
});
