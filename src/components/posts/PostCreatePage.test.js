import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import store from '../../redux/store';
import postService from '../../services/PostService';
import PostCreatePage from './PostCreatePage';

describe('<PostCreatePage />', () => {
  let createPostSpy;

  beforeEach(() => {
    createPostSpy = jest.spyOn(postService, 'createPost');
  });

  describe('Title Field', () => {
    it('shows appropriate styling and message when it is blank', async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <PostCreatePage />
          </MemoryRouter>
        </Provider>
      );

      const titleField = screen.getByTestId('titleField');

      userEvent.click(titleField);
      userEvent.tab();

      const titleError = await screen.findByTestId('titleError');

      expect(titleField).toHaveClass('is-invalid');
      expect(titleError).toHaveTextContent('Title is required.');
    });

    it('shows appropriate styling and message when it is all whitespace', async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <PostCreatePage />
          </MemoryRouter>
        </Provider>
      );

      const titleField = screen.getByTestId('titleField');

      userEvent.type(titleField, '    ');
      userEvent.tab();

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
            <PostCreatePage />
          </MemoryRouter>
        </Provider>
      );

      const bodyField = screen.getByTestId('bodyField');

      userEvent.click(bodyField);
      userEvent.tab();

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
            <PostCreatePage />
          </MemoryRouter>
        </Provider>
      );

      const excerptField = screen.getByTestId('excerptField');

      userEvent.click(excerptField);
      userEvent.tab();

      const excerptError = await screen.findByTestId('excerptError');

      expect(excerptField).toHaveClass('is-invalid');
      expect(excerptError).toHaveTextContent('Excerpt is required.');
    });

    it('shows appropriate styling and message when it is all whitespace', async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <PostCreatePage />
          </MemoryRouter>
        </Provider>
      );

      const excerptField = screen.getByTestId('excerptField');

      userEvent.type(excerptField, '    ');
      userEvent.tab();

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
            <PostCreatePage />
          </MemoryRouter>
        </Provider>
      );

      const imageField = screen.getByTestId('imageField');

      userEvent.type(imageField, 'test image');
      userEvent.tab();

      const imageError = await screen.findByTestId('imageError');

      expect(imageField).toHaveClass('is-invalid');
      expect(imageError).toHaveTextContent('Image cannot contain whitespace.');
    });
  });

  describe('Submission Handling', () => {
    it('calls the createPost method of the post service and redirects to the posts page', async () => {
      const expectedPost = {
        title: 'Test Title',
        body: 'Test Body',
        excerpt: 'Test Excerpt',
        image: 'http://www.example.com/test-image.png',
      };

      let testLocation;

      createPostSpy.mockResolvedValue(expectedPost);

      render(
        <Provider store={store}>
          <MemoryRouter>
            <PostCreatePage />
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
      userEvent.click(submitButton);

      await waitFor(() =>
        expect(createPostSpy).toHaveBeenCalledWith(expectedPost)
      );
      expect(testLocation.pathname).toBe('/');
    });

    it('disables the submit button and shows a spinner while running', async () => {
      createPostSpy.mockResolvedValue({});

      render(
        <Provider store={store}>
          <MemoryRouter>
            <PostCreatePage />
          </MemoryRouter>
        </Provider>
      );

      const titleField = screen.getByTestId('titleField');
      const bodyField = screen.getByTestId('bodyField');
      const excerptField = screen.getByTestId('excerptField');
      const imageField = screen.getByTestId('imageField');
      const submitButton = screen.getByTestId('submitButton');

      expect(submitButton).toBeDisabled();
      expect(
        screen.queryByTestId('submitButtonSpinner')
      ).not.toBeInTheDocument();

      userEvent.type(titleField, 'test');
      userEvent.type(bodyField, 'test');
      userEvent.type(excerptField, 'test');
      userEvent.type(imageField, 'test');

      expect(submitButton).not.toBeDisabled();

      userEvent.click(submitButton);

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
      createPostSpy.mockRejectedValue({ message: 'test error message' });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <PostCreatePage />
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
      userEvent.click(submitButton);

      await screen.findByTestId('createError');
      expect(titleField).toHaveValue('test');
      expect(excerptField).toHaveValue('test');
      expect(imageField).toHaveValue('test');
    });

    it('displays the error message if a server error occurs during the createPost call', async () => {
      const expectedErrorMessage = 'test error message';

      createPostSpy.mockRejectedValue({
        response: {
          data: {
            message: expectedErrorMessage,
          },
        },
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <PostCreatePage />
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
      userEvent.click(submitButton);

      const createError = await screen.findByTestId('createError');

      expect(createPostSpy).toHaveBeenCalled();
      expect(createError).toHaveTextContent(expectedErrorMessage);
    });

    it('displays the error message if a client error occurs during the createPost call', async () => {
      const expectedErrorMessage = 'test error message';

      createPostSpy.mockImplementation(() => {
        throw new Error(expectedErrorMessage);
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <PostCreatePage />
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
      userEvent.click(submitButton);

      const createError = await screen.findByTestId('createError');

      expect(createPostSpy).toHaveBeenCalled();
      expect(createError).toHaveTextContent(expectedErrorMessage);
    });
  });
});
