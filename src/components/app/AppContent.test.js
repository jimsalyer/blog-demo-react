import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '../../redux/store';
import { login, logout } from '../../redux/userSlice';
import AppContent from './AppContent';
import AppHeader from './AppHeader';

jest.mock('../../services/AuthService', () => ({
  login: () => Promise.resolve({ id: 1 }),
  logout: () => Promise.resolve({ userId: 1 }),
}));

jest.mock('../../services/PostService', () => ({
  searchPosts: () => Promise.resolve({ data: [] }),
}));

describe('<AppContent />', () => {
  it('renders <PostsPage /> if the path is exactly "/"', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <AppContent />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByTestId('postsPage');
  });

  it('renders <LoginPage /> if the path is "/create" and the user is not logged in', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/create']}>
          <AppHeader />
          <AppContent />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByTestId('loginPage');
  });

  it('renders <CreatePostPage /> if the path is "/create" and the user is logged in', async () => {
    await store.dispatch(
      login({ username: 'tuser', password: 'testpassword', remember: true })
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/create']}>
          <AppHeader />
          <AppContent />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByTestId('createPostPage');

    await store.dispatch(logout());
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
