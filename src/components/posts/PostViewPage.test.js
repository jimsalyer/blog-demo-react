import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import store from '../../redux/store';
import postService from '../../services/PostService';
import PostViewPage from './PostViewPage';

describe('<PostUpdatePage />', () => {
  const expectedPost = {
    id: 1,
    title: 'Test Title',
    body: 'Test Body Line 1\nTest Body Line 2',
    excerpt: 'Test Excerpt',
    image: 'http://www.example.com/assets/img/test.png',
    userId: 1,
    createUtc: '2020-10-12T17:00:00.000Z',
    modifyUtc: '2020-10-14T08:00:00.000Z',
    user: {
      id: 1,
      username: 'tuser',
      firstName: 'Test',
      lastName: 'User',
      emailAddress: 'tuser@example.com',
      accessToken: 'testaccesstoken',
    },
  };

  let getPostSpy;

  beforeEach(() => {
    getPostSpy = jest
      .spyOn(postService, 'getPost')
      .mockResolvedValue(expectedPost);
  });

  it('loads the post defined by the ID URL parameter', async () => {
    const expectedAuthor = `${expectedPost.user.firstName} ${expectedPost.user.lastName}`;
    const expectedBodyParagraphs = expectedPost.body.split('\n');

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/${expectedPost.id}`]}>
          <Route path="/:id">
            <PostViewPage />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const title = await screen.findByTestId('title');
    const author = screen.getByTestId('author');
    const bodyParagraphs = screen.getAllByTestId('bodyParagraph');
    const image = screen.getByTestId('image');
    const createUtc = screen.getByTestId('createUtc');
    const modifyUtc = screen.getByTestId('modifyUtc');

    expect(title).toHaveTextContent(expectedPost.title);
    expect(author).toHaveTextContent(expectedAuthor);
    expect(image).toHaveAttribute('src', expectedPost.image);
    expect(bodyParagraphs).toHaveLength(expectedBodyParagraphs.length);
    expect(createUtc).toHaveTextContent(expectedPost.createUtc);
    expect(modifyUtc).toHaveTextContent(expectedPost.modifyUtc);

    bodyParagraphs.forEach((bodyParagraph, index) =>
      expect(bodyParagraph).toHaveTextContent(expectedBodyParagraphs[index])
    );
  });

  it('hides the applicable elements when their data is blank', async () => {
    getPostSpy.mockReset().mockResolvedValue({
      ...expectedPost,
      body: undefined,
      image: undefined,
      user: undefined,
      modifyUtc: expectedPost.createUtc,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/${expectedPost.id}`]}>
          <Route path="/:id">
            <PostViewPage />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await screen.findByTestId('title');
    expect(screen.queryByTestId('author')).not.toBeInTheDocument();
    expect(screen.queryByTestId('image')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('bodyParagraph')).toHaveLength(0);
    screen.getByTestId('createUtc');
    expect(screen.queryByTestId('modifyUtc')).not.toBeInTheDocument();
  });

  it('shows a loading message until the post has been loaded', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/${expectedPost.id}`]}>
          <Route path="/:id">
            <PostViewPage />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    screen.getByTestId('loadingMessage');
    expect(screen.queryByTestId('postUpdateForm')).not.toBeInTheDocument();

    await screen.findByTestId('title');
    expect(screen.queryByTestId('loadingMessage')).not.toBeInTheDocument();
  });

  it('displays the error message if a server error occurs while loading the post', async () => {
    const expectedErrorMessage = 'test error message';

    getPostSpy.mockReset().mockRejectedValue({
      response: {
        data: {
          message: expectedErrorMessage,
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/${expectedPost.id}`]}>
          <Route path="/:id">
            <PostViewPage />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const loadError = await screen.findByTestId('loadError');
    expect(loadError).toHaveTextContent(expectedErrorMessage);
  });

  it('displays the error message if a client error occurs while loading the post', async () => {
    const expectedErrorMessage = 'test error message';

    getPostSpy.mockReset().mockRejectedValue({
      message: expectedErrorMessage,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/${expectedPost.id}`]}>
          <Route path="/:id">
            <PostViewPage />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const loadError = await screen.findByTestId('loadError');
    expect(loadError).toHaveTextContent(expectedErrorMessage);
  });
});
