import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('<App />', () => {
  it('renders <AppHeader />, <AppContent />, and <AppFooter />', () => {
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
