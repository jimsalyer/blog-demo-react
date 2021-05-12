import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import store from '../../redux/store';
import { login, logout } from '../../redux/userSlice';
import PostService from '../../services/PostService';
import CreatePostPage from './CreatePostPage';

jest.mock('../../services/PostService');

describe('<CreatePostPage />', () => {
  let mockCreatePost;

  beforeEach(() => {
    mockCreatePost = jest.fn();
    PostService.mockImplementation(() => ({
      createPost: mockCreatePost,
    }));
  });

  afterEach(() => {
    PostService.mockRestore();
  });

  describe('Title Field', () => {
    it('shows appropriate styling and message when it is blank', async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <CreatePostPage />
          </MemoryRouter>
        </Provider>
      );

      const titleField = screen.getByTestId('titleField');

      fireEvent.blur(titleField);

      const titleError = await screen.findByTestId('titleError');

      expect(titleField).toHaveClass('is-invalid');
      expect(titleError).toHaveTextContent('Title is required.');
    });

    it('shows appropriate styling and message when it is all whitespace', async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <CreatePostPage />
          </MemoryRouter>
        </Provider>
      );

      const titleField = screen.getByTestId('titleField');

      userEvent.type(titleField, '    ');
      fireEvent.blur(titleField);

      const titleError = await screen.findByTestId('titleError');

      expect(titleField).toHaveClass('is-invalid');
      expect(titleError).toHaveTextContent('Title is required.');
    });
  });

  describe('Body Field', () => {
    it('shows appropriate styling and message when it is blank', async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <CreatePostPage />
          </MemoryRouter>
        </Provider>
      );

      const bodyField = screen.getByTestId('bodyField');

      fireEvent.blur(bodyField);

      const bodyError = await screen.findByTestId('bodyError');

      expect(bodyField).toHaveClass('is-invalid');
      expect(bodyError).toHaveTextContent('Body is required.');
    });
  });

  describe('Excerpt Field', () => {
    it('shows appropriate styling and message when it is blank', async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <CreatePostPage />
          </MemoryRouter>
        </Provider>
      );

      const excerptField = screen.getByTestId('excerptField');

      fireEvent.blur(excerptField);

      const excerptError = await screen.findByTestId('excerptError');

      expect(excerptField).toHaveClass('is-invalid');
      expect(excerptError).toHaveTextContent('Excerpt is required.');
    });

    it('shows appropriate styling and message when it is all whitespace', async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <CreatePostPage />
          </MemoryRouter>
        </Provider>
      );

      const excerptField = screen.getByTestId('excerptField');

      userEvent.type(excerptField, '    ');
      fireEvent.blur(excerptField);

      const excerptError = await screen.findByTestId('excerptError');

      expect(excerptField).toHaveClass('is-invalid');
      expect(excerptError).toHaveTextContent('Excerpt is required.');
    });
  });

  describe('Image Field', () => {
    it('shows appropriate styling and message when it contains whitespace', async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <CreatePostPage />
          </MemoryRouter>
        </Provider>
      );

      const imageField = screen.getByTestId('imageField');

      userEvent.type(imageField, 'test image');
      fireEvent.blur(imageField);

      const imageError = await screen.findByTestId('imageError');

      expect(imageField).toHaveClass('is-invalid');
      expect(imageError).toHaveTextContent('Image cannot contain whitespace.');
    });
  });

  describe('Submission Handling', () => {
    const user = { id: 1, accessToken: 'testaccesstoken' };

    beforeAll(() => {
      store.dispatch(login(user));
    });

    afterAll(() => {
      store.dispatch(logout());
    });

    it('calls the createPost method of the post service and redirects to the posts page', async () => {
      const expectedPost = {
        title: 'Test Title',
        body: 'Test Body',
        excerpt: 'Test Excerpt',
        image: 'http://www.example.com/test-image.png',
        userId: user.id,
      };

      let testLocation;

      mockCreatePost.mockResolvedValue(expectedPost);

      render(
        <Provider store={store}>
          <MemoryRouter>
            <CreatePostPage />
            <Route
              path="*"
              render={({ location }) => {
                testLocation = location;
              }}
            />
          </MemoryRouter>
        </Provider>
      );

      const titleField = screen.getByTestId('titleField');
      const bodyField = screen.getByTestId('bodyField');
      const excerptField = screen.getByTestId('excerptField');
      const imageField = screen.getByTestId('imageField');
      const submitButton = screen.getByTestId('submitButton');

      userEvent.type(titleField, expectedPost.title);
      userEvent.type(bodyField, expectedPost.body);
      userEvent.type(excerptField, expectedPost.excerpt);
      userEvent.type(imageField, expectedPost.image);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreatePost).toHaveBeenCalledWith(expectedPost);
        expect(testLocation.pathname).toBe('/');
      });
    });

    it('disables the submit button and shows a spinner while running', async () => {
      mockCreatePost.mockResolvedValue({});

      render(
        <Provider store={store}>
          <MemoryRouter>
            <CreatePostPage />
          </MemoryRouter>
        </Provider>
      );

      const titleField = screen.getByTestId('titleField');
      const bodyField = screen.getByTestId('bodyField');
      const excerptField = screen.getByTestId('excerptField');
      const imageField = screen.getByTestId('imageField');
      const submitButton = screen.getByTestId('submitButton');

      expect(submitButton).not.toBeDisabled();
      expect(
        screen.queryByTestId('submitButtonSpinner')
      ).not.toBeInTheDocument();

      userEvent.type(titleField, 'test');
      userEvent.type(bodyField, 'test');
      userEvent.type(excerptField, 'test');
      userEvent.type(imageField, 'test');
      fireEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(screen.queryByTestId('submitButtonSpinner')).toBeInTheDocument();

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
        expect(
          screen.queryByTestId('submitButtonSpinner')
        ).not.toBeInTheDocument();
      });
    });

    it('trims the leading and trailing whitespace from Title, Excerpt, and Image', async () => {
      mockCreatePost.mockRejectedValue({ message: 'test error message' });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <CreatePostPage />
          </MemoryRouter>
        </Provider>
      );

      const titleField = screen.getByTestId('titleField');
      const bodyField = screen.getByTestId('bodyField');
      const excerptField = screen.getByTestId('excerptField');
      const imageField = screen.getByTestId('imageField');
      const submitButton = screen.getByTestId('submitButton');

      userEvent.type(titleField, '  test  ');
      userEvent.type(bodyField, 'test');
      userEvent.type(excerptField, '  test  ');
      userEvent.type(imageField, '  test  ');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(titleField).toHaveValue('test');
        expect(excerptField).toHaveValue('test');
        expect(imageField).toHaveValue('test');
      });
    });

    it('displays the error message if a server error occurs during the createPost call', async () => {
      const expectedErrorMessage = 'test error message';

      mockCreatePost.mockRejectedValue({
        response: {
          data: {
            message: expectedErrorMessage,
          },
        },
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <CreatePostPage />
          </MemoryRouter>
        </Provider>
      );

      const titleField = screen.getByTestId('titleField');
      const bodyField = screen.getByTestId('bodyField');
      const excerptField = screen.getByTestId('excerptField');
      const imageField = screen.getByTestId('imageField');
      const submitButton = screen.getByTestId('submitButton');

      userEvent.type(titleField, 'test');
      userEvent.type(bodyField, 'test');
      userEvent.type(excerptField, 'test');
      userEvent.type(imageField, 'test');
      fireEvent.click(submitButton);

      const submitError = await screen.findByTestId('submitError');

      expect(mockCreatePost).toHaveBeenCalled();
      expect(submitError).toHaveTextContent(expectedErrorMessage);
    });

    it('displays the error message if a client error occurs during the login call', async () => {
      const expectedErrorMessage = 'test error message';

      mockCreatePost.mockImplementation(() => {
        throw new Error(expectedErrorMessage);
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <CreatePostPage />
          </MemoryRouter>
        </Provider>
      );

      const titleField = screen.getByTestId('titleField');
      const bodyField = screen.getByTestId('bodyField');
      const excerptField = screen.getByTestId('excerptField');
      const imageField = screen.getByTestId('imageField');
      const submitButton = screen.getByTestId('submitButton');

      userEvent.type(titleField, 'test');
      userEvent.type(bodyField, 'test');
      userEvent.type(excerptField, 'test');
      userEvent.type(imageField, 'test');
      fireEvent.click(submitButton);

      const submitError = await screen.findByTestId('submitError');

      expect(mockCreatePost).toHaveBeenCalled();
      expect(submitError).toHaveTextContent(expectedErrorMessage);
    });
  });
});
