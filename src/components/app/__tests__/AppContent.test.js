import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import AppContent from '../AppContent';

describe('<AppContent />', () => {
  it('renders <HomePage /> if the path is exactly "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppContent />
      </MemoryRouter>
    );
    screen.getByTestId('homePage');
  });

  it('renders <NotFoundPage /> if the path does not have a corresponding route', () => {
    render(
      <MemoryRouter initialEntries={['/invalid-path']}>
        <AppContent />
      </MemoryRouter>
    );
    screen.getByTestId('notFoundPage');
  });
});
