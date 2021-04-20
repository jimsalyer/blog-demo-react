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
    const expectedPage = 2;

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
      <MemoryRouter initialEntries={[`/?page=${expectedPage}`]}>
        <PostsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(searchPostsSpy).toHaveBeenCalled();
      screen.getByTestId('postsPage');

      const paginations = screen.getAllByTestId('pagination');
      expect(paginations).toHaveLength(2);

      const pageStatuses = screen.getAllByTestId('pageStatus');
      expect(pageStatuses).toHaveLength(2);

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
});
