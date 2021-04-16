import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import AppContent from '../AppContent';

jest.mock('../../../services/postService', () => ({
  searchPosts: () => Promise.resolve({ data: [] }),
}));

describe('<AppContent />', () => {
  it('renders <PostsPage /> if the path is exactly "/"', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppContent />
      </MemoryRouter>
    );

    await waitFor(() => {
      screen.getByTestId('postsPage');
    });
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
