import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import AppHeader from '../AppHeader';

describe('<AppHeader />', () => {
  describe('Rendering', () => {
    it('renders and activates "Home" link when the path is "/"', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <AppHeader />
        </MemoryRouter>
      );

      screen.getByTestId('appHeader');
      expect(screen.getByTestId('homeLink')).toHaveClass('active');
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

      const brand = document.querySelector('.navbar-brand');
      fireEvent.click(brand);

      expect(testLocation.pathname).toBe('/');
    });

    it('navigates to "/" when clicking the "Home" link', () => {
      expect(testLocation.pathname).toBe('/invalid-path');

      const homeLink = screen.getByTestId('homeLink');
      fireEvent.click(homeLink);

      expect(testLocation.pathname).toBe('/');
    });
  });
});
