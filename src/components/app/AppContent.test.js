import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '../../redux/store';
import { login, logout } from '../../redux/userSlice';
import authService from '../../services/AuthService';
import postService from '../../services/PostService';
import AppContent from './AppContent';
import AppHeader from './AppHeader';

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
    jest
      .spyOn(authService, 'logout')
      .mockResolvedValue({ userId: expectedUser.id });

    jest.spyOn(postService, 'getPost').mockResolvedValue(expectedPost);
    jest.spyOn(postService, 'searchPosts').mockResolvedValue({
      pageCount: 1,
      data: [expectedPost],
    });
  });

  it('renders <PostSearchPage /> if the path is exactly "/"', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <AppContent />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByTestId('postSearchPage');
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

  it('renders <PostCreatePage /> if the path is "/create" and the user is logged in', async () => {
    await store.dispatch(login(expectedLogin));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/create']}>
          <AppHeader />
          <AppContent />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByTestId('postCreatePage');

    await store.dispatch(logout());
  });

  it('renders <PostUpdatePage /> if the path is "/update/:id", where "id" is the post ID to update, and the user is logged in', async () => {
    await store.dispatch(login(expectedLogin));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/update/1']}>
          <AppHeader />
          <AppContent />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByTestId('postUpdatePage');

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
