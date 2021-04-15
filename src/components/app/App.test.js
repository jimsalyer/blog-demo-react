import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App Component', () => {
  it('renders the AppHeader, AppContent, and AppFooter components', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    screen.getByTestId('appHeader');
    screen.getByTestId('homePage');
    screen.getByTestId('appFooter');
  });
});
