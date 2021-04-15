import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import AppContent from './AppContent';

describe('AppContent Component', () => {
  it('renders the HomePage component if the path is exactly "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppContent />
      </MemoryRouter>
    );
    screen.getByTestId('homePage');
  });

  it('renders the NotFoundPage component if the path does not have a corresponding route', () => {
    render(
      <MemoryRouter initialEntries={['/invalid-path']}>
        <AppContent />
      </MemoryRouter>
    );
    screen.getByTestId('notFoundPage');
  });
});
