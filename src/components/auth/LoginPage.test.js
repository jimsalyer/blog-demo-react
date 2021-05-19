import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import queryString from 'query-string';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import store from '../../redux/store';
import authService from '../../services/AuthService';
import LoginPage from './LoginPage';

describe('<LoginPage />', () => {
  let loginSpy;

  beforeEach(() => {
    loginSpy = jest.spyOn(authService, 'login');
  });

  describe('Username Field', () => {
    it('shows appropriate styling and message when it is blank', async () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/login']}>
            <LoginPage />
          </MemoryRouter>
        </Provider>
      );

      const usernameField = screen.getByTestId('usernameField');

      userEvent.click(usernameField);
      userEvent.tab();

      const usernameError = await screen.findByTestId('usernameError');

      expect(usernameField).toHaveClass('is-invalid');
      expect(usernameError).toHaveTextContent('Username is required.');
    });

    it('shows appropriate styling and message when it is all whitespace', async () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/login']}>
            <LoginPage />
          </MemoryRouter>
        </Provider>
      );

      const usernameField = screen.getByTestId('usernameField');

      userEvent.type(usernameField, '    ');
      userEvent.tab();

      const usernameError = await screen.findByTestId('usernameError');

      expect(usernameField).toHaveClass('is-invalid');
      expect(usernameError).toHaveTextContent('Username is required.');
    });
  });

  describe('Password Field', () => {
    it('shows appropriate styling and message when it is blank', async () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/login']}>
            <LoginPage />
          </MemoryRouter>
        </Provider>
      );

      const passwordField = screen.getByTestId('passwordField');

      userEvent.click(passwordField);
      userEvent.tab();

      const passwordError = await screen.findByTestId('passwordError');

      expect(passwordField).toHaveClass('is-invalid');
      expect(passwordError).toHaveTextContent('Password is required.');
    });

    it('shows appropriate styling and message when it is all whitespace', async () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/login']}>
            <LoginPage />
          </MemoryRouter>
        </Provider>
      );

      const passwordField = screen.getByTestId('passwordField');

      userEvent.type(passwordField, '    ');
      userEvent.tab();

      const passwordError = await screen.findByTestId('passwordError');

      expect(passwordField).toHaveClass('is-invalid');
      expect(passwordError).toHaveTextContent('Password is required.');
    });
  });

  describe('Submission Handling', () => {
    it('logs the user in', async () => {
      const expectedUser = {
        id: 1,
        username: 'testusername',
        password: 'testpassword',
      };

      loginSpy.mockResolvedValue(expectedUser);

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/login']}>
            <LoginPage />
          </MemoryRouter>
        </Provider>
      );

      const usernameField = screen.getByTestId('usernameField');
      const passwordField = screen.getByTestId('passwordField');
      const rememberField = screen.getByTestId('rememberField');
      const submitButton = screen.getByTestId('submitButton');

      userEvent.type(usernameField, expectedUser.username);
      userEvent.type(passwordField, expectedUser.password);
      userEvent.click(rememberField);
      userEvent.click(submitButton);

      await waitFor(() =>
        expect(loginSpy).toHaveBeenCalledWith(
          expectedUser.username,
          expectedUser.password,
          true
        )
      );
    });

    it('redirects to the URL specified in the "returnUrl" query parameter after login', async () => {
      const expectedReturnUrl = '/test-url';

      const expectedUser = {
        id: 1,
        username: 'testusername',
        password: 'testpassword',
      };

      const queryStringValue = queryString.stringify({
        returnUrl: expectedReturnUrl,
      });

      loginSpy.mockResolvedValue(expectedUser);

      let testLocation;

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/login?${queryStringValue}`]}>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route
              path="*"
              render={({ location }) => {
                testLocation = location;
              }}
            />
          </MemoryRouter>
        </Provider>
      );

      const usernameField = screen.getByTestId('usernameField');
      const passwordField = screen.getByTestId('passwordField');
      const rememberField = screen.getByTestId('rememberField');
      const submitButton = screen.getByTestId('submitButton');

      userEvent.type(usernameField, expectedUser.username);
      userEvent.type(passwordField, expectedUser.password);
      userEvent.click(rememberField);
      userEvent.click(submitButton);

      await waitFor(() =>
        expect(testLocation.pathname).toBe(expectedReturnUrl)
      );
    });

    it('redirects to "/" after login if no "returnUrl" query parameter is specified', async () => {
      const expectedUser = {
        id: 1,
        username: 'testusername',
        password: 'testpassword',
      };

      loginSpy.mockResolvedValue(expectedUser);

      let testLocation;

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/login']}>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route
              path="*"
              render={({ location }) => {
                testLocation = location;
              }}
            />
          </MemoryRouter>
        </Provider>
      );

      const usernameField = screen.getByTestId('usernameField');
      const passwordField = screen.getByTestId('passwordField');
      const rememberField = screen.getByTestId('rememberField');
      const submitButton = screen.getByTestId('submitButton');

      userEvent.type(usernameField, expectedUser.username);
      userEvent.type(passwordField, expectedUser.password);
      userEvent.click(rememberField);
      userEvent.click(submitButton);

      await waitFor(() => expect(testLocation.pathname).toBe('/'));
    });

    it('disables the submit button and shows a spinner while running', async () => {
      loginSpy.mockRejectedValue({
        message: 'test error message',
      });

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/login']}>
            <LoginPage />
          </MemoryRouter>
        </Provider>
      );

      const usernameField = screen.getByTestId('usernameField');
      const passwordField = screen.getByTestId('passwordField');
      const submitButton = screen.getByTestId('submitButton');

      expect(submitButton).toBeDisabled();
      expect(
        screen.queryByTestId('submitButtonSpinner')
      ).not.toBeInTheDocument();

      userEvent.type(usernameField, 'test');
      userEvent.type(passwordField, 'test');

      expect(submitButton).not.toBeDisabled();

      userEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(screen.queryByTestId('submitButtonSpinner')).toBeInTheDocument();

      await waitFor(() =>
        expect(
          screen.queryByTestId('submitButtonSpinner')
        ).not.toBeInTheDocument()
      );
    });

    it('trims the leading and trailing whitespace from Username and Password', async () => {
      loginSpy.mockRejectedValue({ message: 'test error message' });

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/login']}>
            <LoginPage />
          </MemoryRouter>
        </Provider>
      );

      const usernameField = screen.getByTestId('usernameField');
      const passwordField = screen.getByTestId('passwordField');
      const submitButton = screen.getByTestId('submitButton');

      userEvent.type(usernameField, '  test  ');
      userEvent.type(passwordField, '  test  ');
      userEvent.click(submitButton);

      await screen.findByTestId('loginError');
      expect(usernameField).toHaveValue('test');
      expect(passwordField).toHaveValue('test');
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
          <MemoryRouter initialEntries={['/login']}>
            <LoginPage />
          </MemoryRouter>
        </Provider>
      );

      const usernameField = screen.getByTestId('usernameField');
      const passwordField = screen.getByTestId('passwordField');
      const submitButton = screen.getByTestId('submitButton');

      userEvent.type(usernameField, 'test');
      userEvent.type(passwordField, 'test');
      userEvent.click(submitButton);

      const loginError = await screen.findByTestId('loginError');

      expect(loginSpy).toHaveBeenCalled();
      expect(loginError).toHaveTextContent(expectedErrorMessage);
    });

    it('displays the error message if a client error occurs during the login call', async () => {
      const expectedErrorMessage = 'test error message';

      loginSpy.mockRejectedValue({
        message: expectedErrorMessage,
      });

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/login']}>
            <LoginPage />
          </MemoryRouter>
        </Provider>
      );

      const usernameField = screen.getByTestId('usernameField');
      const passwordField = screen.getByTestId('passwordField');
      const submitButton = screen.getByTestId('submitButton');

      userEvent.type(usernameField, 'test');
      userEvent.type(passwordField, 'test');
      userEvent.click(submitButton);

      const loginError = await screen.findByTestId('loginError');

      expect(loginSpy).toHaveBeenCalled();
      expect(loginError).toHaveTextContent(expectedErrorMessage);
    });
  });
});
