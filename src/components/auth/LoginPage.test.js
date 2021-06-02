import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import queryString from 'query-string';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import store from '../../redux/store';
import authService from '../../services/AuthService';
import LoginPage from './LoginPage';

describe('<LoginPage />', () => {
  let loginSpy;

  beforeEach(() => {
    loginSpy = jest.spyOn(authService, 'login');
  });

  describe('Validation', () => {
    it('shows appropriate styling and messages when the Username or Password fields are blank', async () => {
      render(
        <StoreProvider store={store}>
          <ToastProvider>
            <MemoryRouter initialEntries={['/login']}>
              <LoginPage />
            </MemoryRouter>
          </ToastProvider>
        </StoreProvider>
      );

      const usernameField = screen.getByTestId('usernameField');
      const passwordField = screen.getByTestId('passwordField');

      userEvent.click(usernameField);
      userEvent.tab();
      userEvent.tab();

      const usernameError = await screen.findByTestId('usernameError');
      const passwordError = await screen.findByTestId('passwordError');

      expect(usernameField).toHaveClass('is-invalid');
      expect(passwordField).toHaveClass('is-invalid');
      expect(usernameError).toHaveTextContent('Username is required.');
      expect(passwordError).toHaveTextContent('Password is required.');
    });

    it('shows appropriate styling and messages when the Username or Password fields are all whitespace', async () => {
      render(
        <StoreProvider store={store}>
          <ToastProvider>
            <MemoryRouter initialEntries={['/login']}>
              <LoginPage />
            </MemoryRouter>
          </ToastProvider>
        </StoreProvider>
      );

      const usernameField = screen.getByTestId('usernameField');
      const passwordField = screen.getByTestId('passwordField');

      userEvent.type(usernameField, '    ');
      userEvent.tab();
      userEvent.type(passwordField, '    ');
      userEvent.tab();

      const usernameError = await screen.findByTestId('usernameError');
      const passwordError = await screen.findByTestId('passwordError');

      expect(usernameField).toHaveClass('is-invalid');
      expect(passwordField).toHaveClass('is-invalid');
      expect(usernameError).toHaveTextContent('Username is required.');
      expect(passwordError).toHaveTextContent('Password is required.');
    });
  });

  describe('Submission', () => {
    it('logs the user in', async () => {
      const expectedUser = {
        id: 1,
        username: 'testusername',
        password: 'testpassword',
      };

      loginSpy.mockResolvedValue(expectedUser);

      render(
        <StoreProvider store={store}>
          <ToastProvider>
            <MemoryRouter initialEntries={['/login']}>
              <LoginPage />
            </MemoryRouter>
          </ToastProvider>
        </StoreProvider>
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
        <StoreProvider store={store}>
          <ToastProvider>
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
          </ToastProvider>
        </StoreProvider>
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
        <StoreProvider store={store}>
          <ToastProvider>
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
          </ToastProvider>
        </StoreProvider>
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
        <StoreProvider store={store}>
          <ToastProvider>
            <MemoryRouter initialEntries={['/login']}>
              <LoginPage />
            </MemoryRouter>
          </ToastProvider>
        </StoreProvider>
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
        <StoreProvider store={store}>
          <ToastProvider>
            <MemoryRouter initialEntries={['/login']}>
              <LoginPage />
            </MemoryRouter>
          </ToastProvider>
        </StoreProvider>
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
        <StoreProvider store={store}>
          <ToastProvider>
            <MemoryRouter initialEntries={['/login']}>
              <LoginPage />
            </MemoryRouter>
          </ToastProvider>
        </StoreProvider>
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
        <StoreProvider store={store}>
          <ToastProvider>
            <MemoryRouter initialEntries={['/login']}>
              <LoginPage />
            </MemoryRouter>
          </ToastProvider>
        </StoreProvider>
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
