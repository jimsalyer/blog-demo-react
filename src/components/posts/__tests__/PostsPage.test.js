import { cleanup, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as postService from '../../../services/postService';
import PostsPage from '../PostsPage';

describe('<PostsPage />', () => {
  let searchPostsSpy;

  beforeEach(() => {
    searchPostsSpy = jest.spyOn(postService, 'searchPosts');
  });

  afterEach(() => {
    searchPostsSpy.mockRestore();
    cleanup();
  });

  it('renders a list of posts with pagination controls', async () => {
    const expectedPagination = {
      first: 1,
      prev: 1,
      next: 3,
      last: 4,
    };

    const expectedData = [
      {
        id: 1,
        title: 'post title 1',
        body: 'post body 1',
        userId: 1,
      },
      {
        id: 2,
        title: 'post title 2',
        body: 'post body 2',
        userId: 2,
      },
    ];

    searchPostsSpy.mockResolvedValue({
      pagination: expectedPagination,
      data: expectedData,
    });

    render(
      <MemoryRouter initialEntries={['/?page=2']}>
        <PostsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(searchPostsSpy).toHaveBeenCalled();
      screen.getByTestId('postsPage');

      const paginations = screen.getAllByTestId('pagination');
      expect(paginations).toHaveLength(2);

      const posts = screen.getAllByTestId('post');
      expect(posts).toHaveLength(2);

      posts.forEach((post, index) => {
        expect(post.querySelector('.card-title').textContent).toBe(
          expectedData[index].title
        );
        expect(post.querySelector('.card-text').textContent).toBe(
          expectedData[index].body
        );
      });
    });
  });

  it('displays a loading message until the API call finishes', async () => {
    const expectedPagination = {
      first: 1,
      prev: 0,
      next: 2,
      last: 10,
    };

    const expectedData = [
      {
        id: 1,
        title: 'post title 1',
        body: 'post body 1',
        userId: 1,
      },
      {
        id: 2,
        title: 'post title 2',
        body: 'post body 2',
        userId: 2,
      },
    ];

    searchPostsSpy.mockResolvedValue({
      pagination: expectedPagination,
      data: expectedData,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <PostsPage />
      </MemoryRouter>
    );

    screen.getByTestId('loadingMessage');

    await waitFor(() => {
      expect(searchPostsSpy).toHaveBeenCalled();
      screen.getByTestId('postsPage');

      const loadingMessage = screen.queryByTestId('loadingMessage');
      expect(loadingMessage).not.toBeInTheDocument();

      const paginations = screen.queryAllByTestId('pagination');
      expect(paginations).toHaveLength(2);

      const posts = screen.queryAllByTestId('post');
      expect(posts).toHaveLength(2);
    });
  });

  it('displays a warning message if no data is returned from the API call', async () => {
    const expectedPagination = {
      first: 1,
      prev: 0,
      next: 0,
      last: 1,
    };

    searchPostsSpy.mockResolvedValue({ pagination: expectedPagination });

    render(
      <MemoryRouter initialEntries={['/']}>
        <PostsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(searchPostsSpy).toHaveBeenCalled();
      screen.getByTestId('postsPage');

      const pagers = screen.queryAllByTestId('pager');
      expect(pagers).toHaveLength(0);

      const posts = screen.queryAllByTestId('post');
      expect(posts).toHaveLength(0);

      screen.getByTestId('warningMessage');
    });
  });

  it('displays a warning message if no posts are returned from the API call', async () => {
    const expectedPagination = {
      first: 1,
      prev: 0,
      next: 0,
      last: 1,
    };

    searchPostsSpy.mockResolvedValue({
      pagination: expectedPagination,
      data: [],
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <PostsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(searchPostsSpy).toHaveBeenCalled();
      screen.getByTestId('postsPage');

      const pagers = screen.queryAllByTestId('pagers');
      expect(pagers).toHaveLength(0);

      const posts = screen.queryAllByTestId('post');
      expect(posts).toHaveLength(0);

      screen.getByTestId('warningMessage');
    });
  });

  it('does not display any Pager components if no pagination object is returned from the API', async () => {
    searchPostsSpy.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={['/']}>
        <PostsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(searchPostsSpy).toHaveBeenCalled();
      screen.getByTestId('postsPage');

      const pagers = screen.queryAllByTestId('pager');
      expect(pagers).toHaveLength(0);
    });
  });

  it('displays an error message if the API call fails', async () => {
    const expectedError = new Error('test error message');

    searchPostsSpy.mockRejectedValue(expectedError);

    render(
      <MemoryRouter initialEntries={['/']}>
        <PostsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(searchPostsSpy).toHaveBeenCalled();
      screen.getByTestId('postsPage');

      const paginations = screen.queryAllByTestId('pagination');
      expect(paginations).toHaveLength(0);

      const posts = screen.queryAllByTestId('post');
      expect(posts).toHaveLength(0);

      const errorMessage = screen.getByTestId('errorMessage');
      expect(errorMessage).toHaveTextContent(expectedError.message);
    });
  });
});
