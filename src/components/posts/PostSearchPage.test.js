import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import store from '../../redux/store';
import * as userSliceExports from '../../redux/userSlice';
import postService from '../../services/PostService';
import userService from '../../services/UserService';
import PostSearchPage from './PostSearchPage';

describe('<PostSearchPage />', () => {
  let listUsersSpy;
  let searchPostsSpy;
  let userSelectorSpy;

  beforeEach(() => {
    listUsersSpy = jest.spyOn(userService, 'listUsers').mockResolvedValue([]);
    searchPostsSpy = jest.spyOn(postService, 'searchPosts');
    userSelectorSpy = jest
      .spyOn(userSliceExports, 'userSelector')
      .mockReturnValue({});
  });

  it('renders a create post button if the user is logged in', async () => {
    searchPostsSpy.mockResolvedValue({
      pageCount: 1,
      data: [],
    });

    userSelectorSpy.mockReset().mockReturnValue({ id: 1 });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <PostSearchPage />
        </MemoryRouter>
      </Provider>
    );

    const createPostButton = await screen.findByTestId('createPostButton');
    expect(createPostButton).toHaveTextContent('Create New Post');
  });

  it('does not render a create post button if the user is not logged in', async () => {
    searchPostsSpy.mockResolvedValue({
      pageCount: 1,
      data: [],
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <PostSearchPage />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByTestId('warningMessage');

    expect(screen.queryByTestId('createPostButton')).not.toBeInTheDocument();
  });

  it('routes to "/create" when clicking on the create post button', async () => {
    let testLocation;

    searchPostsSpy.mockResolvedValue({
      pageCount: 1,
      data: [],
    });

    userSelectorSpy.mockReset().mockReturnValue({ id: 1 });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <PostSearchPage />
          <Route
            path="*"
            render={({ location }) => {
              testLocation = location;
              return null;
            }}
          />
        </MemoryRouter>
      </Provider>
    );

    const createPostButton = await screen.findByTestId('createPostButton');

    userEvent.click(createPostButton);

    await waitFor(() => expect(testLocation.pathname).toBe('/create'));
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

    searchPostsSpy.mockResolvedValue({
      pageCount: 4,
      data: expectedData,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/?page=2']}>
          <PostSearchPage />
        </MemoryRouter>
      </Provider>
    );

    screen.getByTestId('postSearchPage');

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

  it('displays an update button on posts that were created by the logged in user', async () => {
    const expectedUserId = 1;
    const expectedPosts = [
      {
        id: 1,
        title: 'test title',
        body: 'test body',
        excerpt: 'test excerpt',
        imageUrl: 'http://example.com/images/image.jpg',
        userId: expectedUserId,
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
        userId: 2,
        createUtc: '2020-01-01T00:00:00Z',
        publishUtc: '2020-01-02T00:00:00Z',
        modifyUtc: '2020-01-03T:00:00:00Z',
      },
    ];

    searchPostsSpy.mockResolvedValue({
      pageCount: 4,
      data: expectedPosts,
    });

    userSelectorSpy.mockReset().mockReturnValue({ id: expectedUserId });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <PostSearchPage />
        </MemoryRouter>
      </Provider>
    );

    const posts = await screen.findAllByTestId('post');
    const updateButton = within(posts[0]).getByTestId('updatePostButton');

    expect(updateButton).toHaveTextContent('Update Post');
    expect(
      within(posts[1]).queryByTestId('updatePostButton')
    ).not.toBeInTheDocument();
  });

  it('does not display an update button if the user is not logged in', async () => {
    const expectedPosts = [
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
        userId: 2,
        createUtc: '2020-01-01T00:00:00Z',
        publishUtc: '2020-01-02T00:00:00Z',
        modifyUtc: '2020-01-03T:00:00:00Z',
      },
    ];

    searchPostsSpy.mockResolvedValue({
      pageCount: 4,
      data: expectedPosts,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <PostSearchPage />
        </MemoryRouter>
      </Provider>
    );

    await screen.findAllByTestId('post');
    expect(screen.queryAllByTestId('updatePostButton')).toHaveLength(0);
  });

  it('routes to "/update/{id}" where {id} is the ID of the post whose update button was clicked', async () => {
    const expectedUserId = 1;
    const expectedPosts = [
      {
        id: 1,
        title: 'test title',
        body: 'test body',
        excerpt: 'test excerpt',
        imageUrl: 'http://example.com/images/image.jpg',
        userId: expectedUserId,
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
        userId: 2,
        createUtc: '2020-01-01T00:00:00Z',
        publishUtc: '2020-01-02T00:00:00Z',
        modifyUtc: '2020-01-03T:00:00:00Z',
      },
    ];

    let testLocation;

    searchPostsSpy.mockResolvedValue({
      pageCount: 4,
      data: expectedPosts,
    });

    userSelectorSpy.mockReset().mockReturnValue({ id: expectedUserId });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <PostSearchPage />
          <Route
            path="*"
            render={({ location }) => {
              testLocation = location;
              return null;
            }}
          />
        </MemoryRouter>
      </Provider>
    );

    const posts = await screen.findAllByTestId('post');
    const updateButton = within(posts[0]).getByTestId('updatePostButton');

    userEvent.click(updateButton);

    await waitFor(() =>
      expect(testLocation.pathname).toBe(`/update/${expectedPosts[0].id}`)
    );
  });

  it('displays a read post button that, when clicked, routes to "/view/{id}" where {id} is the ID of the post', async () => {
    const expectedPosts = [
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
        userId: 2,
        createUtc: '2020-01-01T00:00:00Z',
        publishUtc: '2020-01-02T00:00:00Z',
        modifyUtc: '2020-01-03T:00:00:00Z',
      },
    ];

    let testLocation;

    searchPostsSpy.mockResolvedValue({
      pageCount: 4,
      data: expectedPosts,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <PostSearchPage />
          <Route
            path="*"
            render={({ location }) => {
              testLocation = location;
              return null;
            }}
          />
        </MemoryRouter>
      </Provider>
    );

    const posts = await screen.findAllByTestId('post');
    const viewButton = within(posts[0]).getByTestId('viewPostButton');

    userEvent.click(viewButton);

    await waitFor(() =>
      expect(testLocation.pathname).toBe(`/view/${expectedPosts[0].id}`)
    );
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

    searchPostsSpy.mockResolvedValue({
      pageCount: 10,
      data: expectedData,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <PostSearchPage />
        </MemoryRouter>
      </Provider>
    );

    screen.getByTestId('postSearchPage');
    screen.getByTestId('loadingMessage');

    const posts = await screen.findAllByTestId('post');
    expect(posts).toHaveLength(2);

    expect(searchPostsSpy).toHaveBeenCalled();
    expect(screen.queryByTestId('loadingMessage')).not.toBeInTheDocument();
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

    searchPostsSpy.mockResolvedValue({
      pageCount: 10,
      data: expectedData,
    });

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            `/?author=${expectedAuthor}&text=${expectedText}&limit=${expectedLimit}&page=${expectedPage}`,
          ]}
        >
          <PostSearchPage />
        </MemoryRouter>
      </Provider>
    );

    await screen.findAllByTestId('post');

    screen.getByTestId('postSearchPage');

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

    searchPostsSpy.mockResolvedValue({
      pageCount: 10,
      data: expectedData,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <PostSearchPage />
        </MemoryRouter>
      </Provider>
    );

    await screen.findAllByTestId('post');

    const currentLimitToggle = screen.getAllByTestId('limitToggle')[0];
    const currentLimit = parseInt(currentLimitToggle.textContent, 10);

    userEvent.click(currentLimitToggle);

    const limitItems = await screen.findAllByTestId('limitItem');
    const newLimitItem = limitItems.find(
      (limitItem) => parseInt(limitItem.textContent, 10) !== currentLimit
    );
    const newLimit = parseInt(newLimitItem.textContent, 10);

    userEvent.click(newLimitItem);

    await screen.findAllByTestId('post');

    const newLimitToggle = screen.getAllByTestId('limitToggle')[0];
    expect(newLimitToggle).toHaveTextContent(`${newLimit} Per Page`);
  });

  it('updates the current page when a new page is clicked in one of the pagers', async () => {
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

    const initialPage = 2;
    const newPage = 4;
    const pageCount = 10;

    searchPostsSpy.mockResolvedValue({
      pageCount,
      data: expectedData,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/?page=${initialPage}`]}>
          <PostSearchPage />
        </MemoryRouter>
      </Provider>
    );

    await screen.findAllByTestId('post');

    let pageStatus = screen.getAllByTestId('pageStatus');
    expect(pageStatus[0]).toHaveTextContent(
      `Page ${initialPage} of ${pageCount}`
    );

    const pageNumberLinks = screen.getAllByTestId('pageNumberLink');
    const newPageNumberLink = pageNumberLinks.find(
      (pageNumberLink) => pageNumberLink.textContent === newPage.toString()
    );

    userEvent.click(newPageNumberLink);

    pageStatus = await screen.findAllByTestId('pageStatus');
    expect(pageStatus[0]).toHaveTextContent(`Page ${newPage} of ${pageCount}`);
  });

  it('calls the API with the filter values from the search form when it is submitted', async () => {
    const expectedPosts = [
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

    const expectedUsers = [
      {
        id: 1,
        firstName: 'Test',
        lastName: 'User1',
      },
      {
        id: 2,
        firstName: 'Test',
        lastName: 'User2',
      },
    ];

    const expectedAuthor = expectedUsers[0];
    const expectedText = 'test';

    listUsersSpy.mockReset().mockResolvedValue(expectedUsers);
    searchPostsSpy.mockResolvedValue({
      pageCount: 10,
      data: expectedPosts,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <PostSearchPage />
        </MemoryRouter>
      </Provider>
    );

    await screen.findAllByTestId('authorListItem');
    await screen.findAllByTestId('post');

    const list = screen.getByTestId('authorList');

    userEvent.selectOptions(list, expectedAuthor.id.toString());

    const fullTextSearch = screen.getByTestId('fullTextSearch');

    userEvent.type(fullTextSearch, expectedText);

    const searchButton = await screen.findByTestId('searchButton');

    userEvent.click(searchButton);

    await waitFor(() =>
      expect(searchPostsSpy).toHaveBeenNthCalledWith(2, {
        author: expectedAuthor.id.toString(),
        page: 1,
        text: expectedText,
      })
    );
  });

  it('displays a warning message if no data is returned from the API call', async () => {
    searchPostsSpy.mockResolvedValue({ pageCount: 1 });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <PostSearchPage />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByTestId('warningMessage');

    const posts = screen.queryAllByTestId('post');
    expect(posts).toHaveLength(0);
  });

  it('displays a warning message if no posts are returned from the API call', async () => {
    searchPostsSpy.mockResolvedValue({
      pageCount: 1,
      data: [],
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <PostSearchPage />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByTestId('warningMessage');

    const posts = screen.queryAllByTestId('post');
    expect(posts).toHaveLength(0);
  });

  it('displays an error message if the main API call fails', async () => {
    const expectedErrorMessage = 'test error message';

    searchPostsSpy.mockRejectedValue({
      message: expectedErrorMessage,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <PostSearchPage />
        </MemoryRouter>
      </Provider>
    );

    const errorMessage = await screen.findByTestId('errorMessage');
    expect(errorMessage).toHaveTextContent(expectedErrorMessage);

    const posts = screen.queryAllByTestId('post');
    expect(posts).toHaveLength(0);
  });

  it('displays an error message if the users API call fails', async () => {
    const expectedErrorMessage = 'test error message';

    listUsersSpy.mockReset().mockRejectedValue({
      message: expectedErrorMessage,
    });

    searchPostsSpy.mockResolvedValue({
      pageCount: 1,
      data: [],
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <PostSearchPage />
        </MemoryRouter>
      </Provider>
    );

    const errorMessage = await screen.findByTestId('errorMessage');
    expect(errorMessage).toHaveTextContent(expectedErrorMessage);

    const posts = screen.queryAllByTestId('post');
    expect(posts).toHaveLength(0);
  });
});
