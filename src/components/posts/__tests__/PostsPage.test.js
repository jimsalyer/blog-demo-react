import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as postService from '../../../services/postService';
import * as userService from '../../../services/userService';
import PostsPage from '../PostsPage';

describe('<PostsPage />', () => {
  let listUsersSpy;
  let searchPostsSpy;

  beforeEach(() => {
    listUsersSpy = jest.spyOn(userService, 'listUsers');
    searchPostsSpy = jest.spyOn(postService, 'searchPosts');
  });

  afterEach(() => {
    listUsersSpy.mockRestore();
    searchPostsSpy.mockRestore();
    cleanup();
  });

  it('renders a list of posts', async () => {
    const expectedData = [
      {
        id: 1,
        title: 'test title',
        body: 'test body',
        excerpt: 'test excerpt',
        imageUrl: 'http://example.com/images/image.jpg',
        userId: 1,
        createUtc: '2020-01-01T00:00:00Z',
        publishUtc: '2020-01-02T00:00:00Z',
        modifyUtc: '2020-01-03T:00:00:00Z',
      },
      {
        id: 2,
        title: 'test title 2',
        body: 'test body 2',
        excerpt: 'test excerpt 2',
        imageUrl: 'http://example.com/images/image2.jpg',
        userId: 1,
        createUtc: '2020-01-01T00:00:00Z',
        publishUtc: '2020-01-02T00:00:00Z',
        modifyUtc: '2020-01-03T:00:00:00Z',
      },
    ];

    listUsersSpy.mockResolvedValue([]);

    searchPostsSpy.mockResolvedValue({
      pageCount: 4,
      data: expectedData,
    });

    render(
      <MemoryRouter initialEntries={['/?page=2']}>
        <PostsPage />
      </MemoryRouter>
    );

    screen.getByTestId('postsPage');

    const posts = await screen.findAllByTestId('post');
    expect(posts).toHaveLength(2);

    expect(searchPostsSpy).toHaveBeenCalled();

    posts.forEach((post, index) => {
      expect(post.querySelector('.card-title').textContent).toBe(
        expectedData[index].title
      );
      expect(post.querySelector('.card-text').textContent).toBe(
        expectedData[index].excerpt
      );
    });
  });

  it('displays a loading message until the API call finishes', async () => {
    const expectedData = [
      {
        id: 1,
        title: 'test title',
        body: 'test body',
        excerpt: 'test excerpt',
        imageUrl: 'http://example.com/images/image.jpg',
        userId: 1,
        createUtc: '2020-01-01T00:00:00Z',
        publishUtc: '2020-01-02T00:00:00Z',
        modifyUtc: '2020-01-03T:00:00:00Z',
      },
      {
        id: 2,
        title: 'test title 2',
        body: 'test body 2',
        excerpt: 'test excerpt 2',
        imageUrl: 'http://example.com/images/image2.jpg',
        userId: 1,
        createUtc: '2020-01-01T00:00:00Z',
        publishUtc: '2020-01-02T00:00:00Z',
        modifyUtc: '2020-01-03T:00:00:00Z',
      },
    ];

    listUsersSpy.mockResolvedValue([]);

    searchPostsSpy.mockResolvedValue({
      pageCount: 10,
      data: expectedData,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <PostsPage />
      </MemoryRouter>
    );

    screen.getByTestId('postsPage');
    screen.getByTestId('loadingMessage');

    const posts = await screen.findAllByTestId('post');
    expect(posts).toHaveLength(2);

    expect(searchPostsSpy).toHaveBeenCalled();

    const loadingMessage = screen.queryByTestId('loadingMessage');
    expect(loadingMessage).not.toBeInTheDocument();
  });

  it('gets paging and search parameters from the current query string when the page loads', async () => {
    const expectedAuthor = 8;
    const expectedLimit = 5;
    const expectedPage = 4;
    const expectedText = 'something';

    const expectedData = [
      {
        id: 1,
        title: 'test title',
        body: 'test body',
        excerpt: 'test excerpt',
        imageUrl: 'http://example.com/images/image.jpg',
        userId: 1,
        createUtc: '2020-01-01T00:00:00Z',
        publishUtc: '2020-01-02T00:00:00Z',
        modifyUtc: '2020-01-03T:00:00:00Z',
      },
      {
        id: 2,
        title: 'test title 2',
        body: 'test body 2',
        excerpt: 'test excerpt 2',
        imageUrl: 'http://example.com/images/image2.jpg',
        userId: 1,
        createUtc: '2020-01-01T00:00:00Z',
        publishUtc: '2020-01-02T00:00:00Z',
        modifyUtc: '2020-01-03T:00:00:00Z',
      },
    ];

    listUsersSpy.mockResolvedValue([]);

    searchPostsSpy.mockResolvedValue({
      pageCount: 10,
      data: expectedData,
    });

    render(
      <MemoryRouter
        initialEntries={[
          `/?author=${expectedAuthor}&text=${expectedText}&limit=${expectedLimit}&page=${expectedPage}`,
        ]}
      >
        <PostsPage />
      </MemoryRouter>
    );

    await screen.findAllByTestId('post');

    screen.getByTestId('postsPage');

    expect(searchPostsSpy).toHaveBeenCalledWith({
      author: expectedAuthor,
      limit: expectedLimit,
      page: expectedPage,
      text: expectedText,
    });
  });

  it('updates the paging limit for the list and in the URL when a new limit is chosen in one of the pagers', async () => {
    const expectedData = [
      {
        id: 1,
        title: 'test title',
        body: 'test body',
        excerpt: 'test excerpt',
        imageUrl: 'http://example.com/images/image.jpg',
        userId: 1,
        createUtc: '2020-01-01T00:00:00Z',
        publishUtc: '2020-01-02T00:00:00Z',
        modifyUtc: '2020-01-03T:00:00:00Z',
      },
      {
        id: 2,
        title: 'test title 2',
        body: 'test body 2',
        excerpt: 'test excerpt 2',
        imageUrl: 'http://example.com/images/image2.jpg',
        userId: 1,
        createUtc: '2020-01-01T00:00:00Z',
        publishUtc: '2020-01-02T00:00:00Z',
        modifyUtc: '2020-01-03T:00:00:00Z',
      },
    ];

    listUsersSpy.mockResolvedValue([]);
    searchPostsSpy.mockResolvedValue({
      pageCount: 10,
      data: expectedData,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <PostsPage />
      </MemoryRouter>
    );

    await screen.findAllByTestId('post');

    const currentLimitToggle = screen.getAllByTestId('limitToggle')[0];
    const currentLimit = parseInt(currentLimitToggle.textContent, 10);
    fireEvent.click(currentLimitToggle);

    const limitItems = await screen.findAllByTestId('limitItem');
    const newLimitItem = limitItems.find(
      (limitItem) => parseInt(limitItem.textContent, 10) !== currentLimit
    );
    const newLimit = parseInt(newLimitItem.textContent, 10);
    fireEvent.click(newLimitItem);

    await screen.findAllByTestId('post');

    const newLimitToggle = screen.getAllByTestId('limitToggle')[0];
    expect(newLimitToggle).toHaveTextContent(`${newLimit} Per Page`);
  });

  it('displays a warning message if no data is returned from the API call', async () => {
    listUsersSpy.mockResolvedValue([]);
    searchPostsSpy.mockResolvedValue({ pageCount: 1 });

    render(
      <MemoryRouter initialEntries={['/']}>
        <PostsPage />
      </MemoryRouter>
    );

    await screen.findByTestId('warningMessage');

    const posts = screen.queryAllByTestId('post');
    expect(posts).toHaveLength(0);
  });

  it('displays a warning message if no posts are returned from the API call', async () => {
    listUsersSpy.mockResolvedValue([]);

    searchPostsSpy.mockResolvedValue({
      pageCount: 1,
      data: [],
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <PostsPage />
      </MemoryRouter>
    );

    await screen.findByTestId('warningMessage');

    const posts = screen.queryAllByTestId('post');
    expect(posts).toHaveLength(0);
  });

  it('displays an error message if the API call fails', async () => {
    const expectedError = new Error('test error message');

    listUsersSpy.mockResolvedValue([]);
    searchPostsSpy.mockRejectedValue(expectedError);

    render(
      <MemoryRouter initialEntries={['/']}>
        <PostsPage />
      </MemoryRouter>
    );

    const errorMessage = await screen.findByTestId('errorMessage');
    expect(errorMessage).toHaveTextContent(expectedError.message);

    const posts = screen.queryAllByTestId('post');
    expect(posts).toHaveLength(0);
  });
});
