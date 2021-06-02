import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import store from '../../redux/store';
import { login, logout } from '../../redux/userSlice';
import authService from '../../services/AuthService';
import postService from '../../services/PostService';
import userService from '../../services/UserService';
import AppContent from './AppContent';

describe('<AppContent />', () => {
  const expectedLogin = {
    username: 'tuser',
    password: 'testpassword',
    remember: true,
  };

  const expectedUser = {
    id: 1,
    username: expectedLogin.username,
    firstName: 'Test',
    lastName: 'User',
    emailAddress: 'tuser@example.com',
    accessToken: 'testaccesstoken',
  };

  const expectedPost = {
    id: 1,
    title: 'Test Title',
    body: 'Test Body',
    excerpt: 'Text Excerpt',
    image: 'http://www.example.com/assets/img/test.png',
    userId: expectedUser.id,
    createUtc: '2020-10-12T17:00:00.000Z',
    publishUtc: '2020-10-14T08:00:00.000Z',
    modifyUtc: '2020-10-14T08:00:00.000Z',
  };

  beforeEach(() => {
    jest.spyOn(authService, 'login').mockResolvedValue(expectedUser);
    jest.spyOn(authService, 'logout').mockResolvedValue({});

    jest.spyOn(postService, 'getPost').mockResolvedValue(expectedPost);
    jest.spyOn(postService, 'searchPosts').mockResolvedValue({
      pageCount: 1,
      data: [expectedPost],
    });

    jest.spyOn(userService, 'listUsers').mockResolvedValue([]);
  });

  it('renders <PostSearchPage /> if the path is exactly "/"', async () => {
    render(
      <StoreProvider store={store}>
        <ToastProvider>
          <MemoryRouter initialEntries={['/']}>
            <AppContent />
          </MemoryRouter>
        </ToastProvider>
      </StoreProvider>
    );

    await waitFor(() =>
      expect(screen.queryByTestId('postSearchPage')).toBeInTheDocument()
    );
  });

  it('renders <LoginPage /> if the path is "/create" and the user is not logged in', async () => {
    render(
      <StoreProvider store={store}>
        <ToastProvider>
          <MemoryRouter initialEntries={['/create']}>
            <AppContent />
          </MemoryRouter>
        </ToastProvider>
      </StoreProvider>
    );

    await waitFor(() =>
      expect(screen.queryByTestId('loginPage')).toBeInTheDocument()
    );
  });

  it('renders <PostCreatePage /> if the path is "/create" and the user is logged in', async () => {
    await store.dispatch(login(expectedLogin));

    render(
      <StoreProvider store={store}>
        <ToastProvider>
          <MemoryRouter initialEntries={['/create']}>
            <AppContent />
          </MemoryRouter>
        </ToastProvider>
      </StoreProvider>
    );

    await waitFor(() =>
      expect(screen.queryByTestId('postCreatePage')).toBeInTheDocument()
    );

    await store.dispatch(logout());
  });

  it('renders <PostUpdatePage /> if the path is "/update/:id", where "id" is the post ID to update, and the user is logged in', async () => {
    await store.dispatch(login(expectedLogin));

    render(
      <StoreProvider store={store}>
        <ToastProvider>
          <MemoryRouter initialEntries={['/update/1']}>
            <AppContent />
          </MemoryRouter>
        </ToastProvider>
      </StoreProvider>
    );

    await waitFor(() =>
      expect(screen.queryByTestId('postUpdatePage')).toBeInTheDocument()
    );

    await store.dispatch(logout());
  });

  it('renders <PostViewPage /> if the path is "/view/:id", where "id" is the post ID to view', async () => {
    render(
      <StoreProvider store={store}>
        <ToastProvider>
          <MemoryRouter initialEntries={['/view/1']}>
            <AppContent />
          </MemoryRouter>
        </ToastProvider>
      </StoreProvider>
    );

    await waitFor(() =>
      expect(screen.queryByTestId('postViewPage')).toBeInTheDocument()
    );
  });

  it('renders <LoginPage /> if the path is "/login"', async () => {
    render(
      <StoreProvider store={store}>
        <ToastProvider>
          <MemoryRouter initialEntries={['/login']}>
            <AppContent />
          </MemoryRouter>
        </ToastProvider>
      </StoreProvider>
    );

    await waitFor(() =>
      expect(screen.queryByTestId('loginPage')).toBeInTheDocument()
    );
  });

  it('renders <NotFoundPage /> if the path does not have a corresponding route', async () => {
    render(
      <StoreProvider store={store}>
        <ToastProvider>
          <MemoryRouter initialEntries={['/invalid-path']}>
            <AppContent />
          </MemoryRouter>
        </ToastProvider>
      </StoreProvider>
    );

    await waitFor(() =>
      expect(screen.queryByTestId('notFoundPage')).toBeInTheDocument()
    );
  });
});
