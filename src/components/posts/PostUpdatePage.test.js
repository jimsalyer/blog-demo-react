import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import store from '../../redux/store';
import * as userSliceExports from '../../redux/userSlice';
import postService from '../../services/PostService';
import PostUpdatePage from './PostUpdatePage';

describe('<PostUpdatePage />', () => {
  const expectedUser = {
    id: 1,
    username: 'tuser',
    firstName: 'Test',
    lastName: 'User',
    emailAddress: 'tuser@example.com',
    accessToken: 'testaccesstoken',
  };

  const expectedPost = {
    id: 1,
    title: 'Test Title',
    body: 'Test Body',
    excerpt: 'Test Excerpt',
    image: 'http://www.example.com/assets/img/test.png',
    userId: expectedUser.id,
    createUtc: '2020-10-12T17:00:00.000Z',
    modifyUtc: '2020-10-14T08:00:00.000Z',
  };

  let getPostSpy;
  let updatePostSpy;

  beforeEach(() => {
    getPostSpy = jest.spyOn(postService, 'getPost');
    updatePostSpy = jest.spyOn(postService, 'updatePost');
    jest.spyOn(userSliceExports, 'userSelector').mockReturnValue(expectedUser);
  });

  describe('Initialization', () => {
    beforeEach(() => {
      getPostSpy.mockResolvedValue(expectedPost);
    });

    it('loads the post defined by the ID URL parameter and populates the form accordingly', async () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/${expectedPost.id}`]}>
            <Route path="/:id">
              <PostUpdatePage />
            </Route>
          </MemoryRouter>
        </Provider>
      );

      await screen.findByTestId('postUpdateForm');

      const titleField = screen.getByTestId('titleField');
      const bodyField = screen.getByTestId('bodyField');
      const excerptField = screen.getByTestId('excerptField');
      const imageField = screen.getByTestId('imageField');
      const createUtcField = screen.getByTestId('createUtcField');
      const modifyUtcField = screen.getByTestId('modifyUtcField');

      expect(titleField).toHaveValue(expectedPost.title);
      expect(bodyField).toHaveValue(expectedPost.body);
      expect(excerptField).toHaveValue(expectedPost.excerpt);
      expect(imageField).toHaveValue(expectedPost.image);
      expect(createUtcField).toHaveValue(expectedPost.createUtc);
      expect(modifyUtcField).toHaveValue(expectedPost.modifyUtc);
    });

    it('shows a loading message until the post has been loaded', async () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/${expectedPost.id}`]}>
            <Route path="/:id">
              <PostUpdatePage />
            </Route>
          </MemoryRouter>
        </Provider>
      );

      screen.getByTestId('loadingMessage');
      expect(screen.queryByTestId('postUpdateForm')).not.toBeInTheDocument();

      await screen.findByTestId('postUpdateForm');
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
              <PostUpdatePage />
            </Route>
          </MemoryRouter>
        </Provider>
      );

      const loadingError = await screen.findByTestId('loadingError');
      expect(loadingError).toHaveTextContent(expectedErrorMessage);
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
              <PostUpdatePage />
            </Route>
          </MemoryRouter>
        </Provider>
      );

      const loadingError = await screen.findByTestId('loadingError');
      expect(loadingError).toHaveTextContent(expectedErrorMessage);
    });
  });

  describe('Validation', () => {
    beforeEach(() => {
      getPostSpy.mockResolvedValue({
        ...expectedPost,
        title: '',
        body: '',
        excerpt: '',
        image: '',
      });
    });

    it('shows appropriate styling and messages when the Title, Body, or Excerpt fields are blank', async () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/${expectedPost.id}`]}>
            <Route path="/:id">
              <PostUpdatePage />
            </Route>
          </MemoryRouter>
        </Provider>
      );

      await screen.findByTestId('postUpdateForm');

      const titleField = screen.getByTestId('titleField');
      const bodyField = screen.getByTestId('bodyField');
      const excerptField = screen.getByTestId('excerptField');
      const submitButton = screen.getByTestId('submitButton');

      fireEvent.click(submitButton);

      const titleError = await screen.findByTestId('titleError');
      const bodyError = await screen.findByTestId('bodyError');
      const excerptError = await screen.findByTestId('excerptError');

      expect(titleField).toHaveClass('is-invalid');
      expect(bodyField).toHaveClass('is-invalid');
      expect(excerptField).toHaveClass('is-invalid');
      expect(titleError).toHaveTextContent('Title is required.');
      expect(bodyError).toHaveTextContent('Body is required.');
      expect(excerptError).toHaveTextContent('Excerpt is required.');
    });

    it('shows appropriate styling and messages when the Title or Excerpt fields are all whitespace', async () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/${expectedPost.id}`]}>
            <Route path="/:id">
              <PostUpdatePage />
            </Route>
          </MemoryRouter>
        </Provider>
      );

      await screen.findByTestId('postUpdateForm');

      const titleField = screen.getByTestId('titleField');
      const excerptField = screen.getByTestId('excerptField');
      const submitButton = screen.getByTestId('submitButton');

      userEvent.type(titleField, '    ');
      userEvent.type(excerptField, '    ');
      fireEvent.click(submitButton);

      const titleError = await screen.findByTestId('titleError');
      const excerptError = await screen.findByTestId('excerptError');

      expect(titleField).toHaveClass('is-invalid');
      expect(excerptField).toHaveClass('is-invalid');
      expect(titleError).toHaveTextContent('Title is required.');
      expect(excerptError).toHaveTextContent('Excerpt is required.');
    });

    it('shows appropriate styling and message when the Image field contains whitespace', async () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/${expectedPost.id}`]}>
            <Route path="/:id">
              <PostUpdatePage />
            </Route>
          </MemoryRouter>
        </Provider>
      );

      await screen.findByTestId('postUpdateForm');

      const imageField = screen.getByTestId('imageField');

      userEvent.type(imageField, 'test image');
      fireEvent.blur(imageField);

      const imageError = await screen.findByTestId('imageError');

      expect(imageField).toHaveClass('is-invalid');
      expect(imageError).toHaveTextContent('Image cannot contain whitespace.');
    });
  });

  describe('Submission', () => {
    it('calls the updatePost method of the post service and displays a message when successful', async () => {
      getPostSpy.mockResolvedValue({
        id: expectedPost.id,
        title: '',
        body: '',
        excerpt: '',
        image: '',
        createUtc: expectedPost.createUtc,
        modifyUtc: expectedPost.modifyUtc,
      });

      updatePostSpy.mockResolvedValue(expectedPost);

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/${expectedPost.id}`]}>
            <Route path="/:id">
              <PostUpdatePage />
            </Route>
          </MemoryRouter>
        </Provider>
      );

      await screen.findByTestId('postUpdateForm');

      const titleField = screen.getByTestId('titleField');
      const bodyField = screen.getByTestId('bodyField');
      const excerptField = screen.getByTestId('excerptField');
      const imageField = screen.getByTestId('imageField');
      const createUtcField = screen.getByTestId('createUtcField');
      const modifyUtcField = screen.getByTestId('modifyUtcField');
      const submitButton = screen.getByTestId('submitButton');

      userEvent.type(titleField, expectedPost.title);
      userEvent.type(bodyField, expectedPost.body);
      userEvent.type(excerptField, expectedPost.excerpt);
      userEvent.type(imageField, expectedPost.image);
      fireEvent.click(submitButton);

      const successMessage = await screen.findByTestId('updateSuccess');
      expect(successMessage).toHaveTextContent(
        'The post was updated successfully.'
      );
      expect(updatePostSpy).toHaveBeenCalled();
      expect(titleField).toHaveValue(expectedPost.title);
      expect(bodyField).toHaveValue(expectedPost.body);
      expect(excerptField).toHaveValue(expectedPost.excerpt);
      expect(imageField).toHaveValue(expectedPost.image);
      expect(createUtcField).toHaveValue(expectedPost.createUtc);
      expect(modifyUtcField).toHaveValue(expectedPost.modifyUtc);
    });

    it('disables the submit button and shows a spinner while running', async () => {
      getPostSpy.mockResolvedValue(expectedPost);
      updatePostSpy.mockResolvedValue(expectedPost);

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/${expectedPost.id}`]}>
            <Route path="/:id">
              <PostUpdatePage />
            </Route>
          </MemoryRouter>
        </Provider>
      );

      await screen.findByTestId('postUpdateForm');

      const submitButton = screen.getByTestId('submitButton');

      expect(submitButton).not.toBeDisabled();
      expect(
        screen.queryByTestId('submitButtonSpinner')
      ).not.toBeInTheDocument();

      fireEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(screen.queryByTestId('submitButtonSpinner')).toBeInTheDocument();

      await waitFor(() => expect(submitButton).not.toBeDisabled());

      expect(
        screen.queryByTestId('submitButtonSpinner')
      ).not.toBeInTheDocument();
    });

    it('trims the leading and trailing whitespace from Title, Excerpt, and Image', async () => {
      getPostSpy.mockResolvedValue({
        ...expectedPost,
        title: `    ${expectedPost.title}    `,
        excerpt: `    ${expectedPost.excerpt}    `,
        image: `    ${expectedPost.image}    `,
      });

      updatePostSpy.mockRejectedValue({ message: 'test error message' });

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/${expectedPost.id}`]}>
            <Route path="/:id">
              <PostUpdatePage />
            </Route>
          </MemoryRouter>
        </Provider>
      );

      await screen.findByTestId('postUpdateForm');

      const titleField = screen.getByTestId('titleField');
      const excerptField = screen.getByTestId('excerptField');
      const imageField = screen.getByTestId('imageField');
      const submitButton = screen.getByTestId('submitButton');

      fireEvent.click(submitButton);

      await screen.findByTestId('submitError');
      expect(titleField).toHaveValue(expectedPost.title);
      expect(excerptField).toHaveValue(expectedPost.excerpt);
      expect(imageField).toHaveValue(expectedPost.image);
    });

    it('displays the error message if a server error occurs during the createPost call', async () => {
      const expectedErrorMessage = 'test error message';

      getPostSpy.mockResolvedValue(expectedPost);

      updatePostSpy.mockRejectedValue({
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
              <PostUpdatePage />
            </Route>
          </MemoryRouter>
        </Provider>
      );

      await screen.findByTestId('postUpdateForm');

      const submitButton = screen.getByTestId('submitButton');

      fireEvent.click(submitButton);

      const submitError = await screen.findByTestId('submitError');

      expect(updatePostSpy).toHaveBeenCalled();
      expect(submitError).toHaveTextContent(expectedErrorMessage);
    });

    it('displays the error message if a client error occurs during the createPost call', async () => {
      const expectedErrorMessage = 'test error message';

      getPostSpy.mockResolvedValue(expectedPost);

      updatePostSpy.mockImplementation(() => {
        throw new Error(expectedErrorMessage);
      });

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/${expectedPost.id}`]}>
            <Route path="/:id">
              <PostUpdatePage />
            </Route>
          </MemoryRouter>
        </Provider>
      );

      await screen.findByTestId('postUpdateForm');

      const submitButton = screen.getByTestId('submitButton');

      fireEvent.click(submitButton);

      const submitError = await screen.findByTestId('submitError');

      expect(updatePostSpy).toHaveBeenCalled();
      expect(submitError).toHaveTextContent(expectedErrorMessage);
    });
  });
});
