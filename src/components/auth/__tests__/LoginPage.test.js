import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import * as authService from '../../../services/authService';
import LoginPage from '../LoginPage';

describe('<LoginPage />', () => {
  let loginSpy;

  beforeEach(() => {
    loginSpy = jest.spyOn(authService, 'login');
  });

  afterEach(() => {
    loginSpy.mockRestore();
  });

  describe('Username Field', () => {
    it('shows appropriate styling and message when it is blank', async () => {
      render(
        <Provider store={store}>
          <LoginPage />
        </Provider>
      );

      const usernameField = screen.getByTestId('usernameField');

      fireEvent.blur(usernameField);

      const usernameError = await screen.findByTestId('usernameError');

      expect(usernameField).toHaveClass('is-invalid');
      expect(usernameError).toHaveTextContent('Username is required.');
    });

    it('shows appropriate styling and message when it is all whitespace', async () => {
      render(
        <Provider store={store}>
          <LoginPage />
        </Provider>
      );

      const usernameField = screen.getByTestId('usernameField');

      userEvent.type(usernameField, '    ');
      fireEvent.blur(usernameField);

      const usernameError = await screen.findByTestId('usernameError');

      expect(usernameField).toHaveClass('is-invalid');
      expect(usernameError).toHaveTextContent('Username is required.');
    });

    it('shows appropriate styling and message when it is too short', async () => {
      render(
        <Provider store={store}>
          <LoginPage />
        </Provider>
      );

      const usernameField = screen.getByTestId('usernameField');

      userEvent.type(usernameField, 'a');
      fireEvent.blur(usernameField);

      const usernameError = await screen.findByTestId('usernameError');

      expect(usernameField).toHaveClass('is-invalid');
      expect(usernameError).toHaveTextContent(
        'Username must be at least 2 characters long.'
      );
    });
  });

  describe('Password Field', () => {
    it('shows appropriate styling and message when it is blank', async () => {
      render(
        <Provider store={store}>
          <LoginPage />
        </Provider>
      );

      const passwordField = screen.getByTestId('passwordField');

      fireEvent.blur(passwordField);

      const passwordError = await screen.findByTestId('passwordError');

      expect(passwordField).toHaveClass('is-invalid');
      expect(passwordError).toHaveTextContent('Password is required.');
    });

    it('shows appropriate styling and message when it is all whitespace', async () => {
      render(
        <Provider store={store}>
          <LoginPage />
        </Provider>
      );

      const passwordField = screen.getByTestId('passwordField');

      userEvent.type(passwordField, '    ');
      fireEvent.blur(passwordField);

      const passwordError = await screen.findByTestId('passwordError');

      expect(passwordField).toHaveClass('is-invalid');
      expect(passwordError).toHaveTextContent('Password is required.');
    });

    it('shows appropriate styling and message when it is too short', async () => {
      render(
        <Provider store={store}>
          <LoginPage />
        </Provider>
      );

      const passwordField = screen.getByTestId('passwordField');

      userEvent.type(passwordField, 'a');
      fireEvent.blur(passwordField);

      const passwordError = await screen.findByTestId('passwordError');

      expect(passwordField).toHaveClass('is-invalid');
      expect(passwordError).toHaveTextContent(
        'Password must be at least 2 characters long.'
      );
    });

    it('shows appropriate styling and message when it contains whitespace', async () => {
      render(
        <Provider store={store}>
          <LoginPage />
        </Provider>
      );

      const passwordField = screen.getByTestId('passwordField');

      userEvent.type(passwordField, 'a bc');
      fireEvent.blur(passwordField);

      const passwordError = await screen.findByTestId('passwordError');

      expect(passwordField).toHaveClass('is-invalid');
      expect(passwordError).toHaveTextContent(
        'Password cannot contain whitespace.'
      );
    });
  });

  describe('Submission Handling', () => {
    it('calls the login method of the authentication service and updates state with the result', async () => {
      const expectedUser = {
        username: 'testusername',
        password: 'testpassword',
      };

      const dispatchSpy = jest.spyOn(store, 'dispatch');
      loginSpy.mockResolvedValue(expectedUser);

      render(
        <Provider store={store}>
          <LoginPage />
        </Provider>
      );

      const usernameField = screen.getByTestId('usernameField');
      const passwordField = screen.getByTestId('passwordField');
      const submitButton = screen.getByTestId('submitButton');

      userEvent.type(usernameField, expectedUser.username);
      userEvent.type(passwordField, expectedUser.password);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(loginSpy).toHaveBeenCalledWith(
          expectedUser.username,
          expectedUser.password
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          payload: expectedUser,
          type: 'user/login',
        });

        dispatchSpy.mockRestore();
      });
    });

    it('disables the submit button and shows a spinner while running', async () => {
      loginSpy.mockResolvedValue({});

      render(
        <Provider store={store}>
          <LoginPage />
        </Provider>
      );

      const usernameField = screen.getByTestId('usernameField');
      const passwordField = screen.getByTestId('passwordField');
      const submitButton = screen.getByTestId('submitButton');

      expect(submitButton).not.toBeDisabled();
      expect(
        screen.queryByTestId('submitButtonSpinner')
      ).not.toBeInTheDocument();

      userEvent.type(usernameField, 'test');
      userEvent.type(passwordField, 'test');
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

    it('trims the leading and trailing whitespace from Username and Password', async () => {
      loginSpy.mockRejectedValue({ message: 'test error message' });

      render(
        <Provider store={store}>
          <LoginPage />
        </Provider>
      );

      const usernameField = screen.getByTestId('usernameField');
      const passwordField = screen.getByTestId('passwordField');
      const submitButton = screen.getByTestId('submitButton');

      userEvent.type(usernameField, '  test  ');
      userEvent.type(passwordField, '  test  ');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(usernameField).toHaveValue('test');
        expect(passwordField).toHaveValue('test');
      });
    });

    it('resets the form after a successful login call', async () => {
      loginSpy.mockResolvedValue({});

      render(
        <Provider store={store}>
          <LoginPage />
        </Provider>
      );

      const usernameField = screen.getByTestId('usernameField');
      const passwordField = screen.getByTestId('passwordField');
      const submitButton = screen.getByTestId('submitButton');

      userEvent.type(usernameField, 'test');
      userEvent.type(passwordField, 'test');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(usernameField).toHaveValue('');
        expect(passwordField).toHaveValue('');
      });
    });

    it('displays the error message if a server error occurs during the login call', async () => {
      const expectedErrorMessage = 'test error message';

      loginSpy.mockRejectedValue({
        response: {
          data: {
            message: expectedErrorMessage,
          },
        },
      });

      render(
        <Provider store={store}>
          <LoginPage />
        </Provider>
      );

      const usernameField = screen.getByTestId('usernameField');
      const passwordField = screen.getByTestId('passwordField');
      const submitButton = screen.getByTestId('submitButton');

      userEvent.type(usernameField, 'test');
      userEvent.type(passwordField, 'test');
      fireEvent.click(submitButton);

      const serverError = await screen.findByTestId('serverError');

      expect(loginSpy).toHaveBeenCalled();
      expect(serverError).toHaveTextContent(expectedErrorMessage);
    });

    it('displays the error message if a client error occurs during the login call', async () => {
      const expectedErrorMessage = 'test error message';

      loginSpy.mockImplementation(() => {
        throw new Error(expectedErrorMessage);
      });

      render(
        <Provider store={store}>
          <LoginPage />
        </Provider>
      );

      const usernameField = screen.getByTestId('usernameField');
      const passwordField = screen.getByTestId('passwordField');
      const submitButton = screen.getByTestId('submitButton');

      userEvent.type(usernameField, 'test');
      userEvent.type(passwordField, 'test');
      fireEvent.click(submitButton);

      const serverError = await screen.findByTestId('serverError');

      expect(loginSpy).toHaveBeenCalled();
      expect(serverError).toHaveTextContent(expectedErrorMessage);
    });
  });
});
