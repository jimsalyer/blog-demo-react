import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '../../../redux/store';
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

    await screen.findByTestId('postsPage');
  });

  it('renders <LoginPage /> if the path is "/login"', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <AppContent />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByTestId('loginPage');
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
