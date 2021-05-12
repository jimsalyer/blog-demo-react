import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import queryString from 'query-string';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import store from '../../redux/store';
import AuthService from '../../services/AuthService';
import LoginPage from './LoginPage';

jest.mock('../../services/AuthService');

describe('<LoginPage />', () => {
  let mockLogin;

  beforeEach(() => {
    mockLogin = jest.fn();
    AuthService.mockImplementation(() => ({
      login: mockLogin,
    }));
  });

  afterEach(() => {
    AuthService.mockRestore();
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

      fireEvent.blur(usernameField);

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
      fireEvent.blur(usernameField);

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

      fireEvent.blur(passwordField);

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
      fireEvent.blur(passwordField);

      const passwordError = await screen.findByTestId('passwordError');

      expect(passwordField).toHaveClass('is-invalid');
      expect(passwordError).toHaveTextContent('Password is required.');
    });
  });

  describe('Submission Handling', () => {
    it('calls the login method of the authentication service and updates state with the result', async () => {
      const expectedUser = {
        username: 'testusername',
        password: 'testpassword',
      };

      const dispatchSpy = jest.spyOn(store, 'dispatch');
      mockLogin.mockResolvedValue(expectedUser);

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
      fireEvent.click(rememberField);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(
          expectedUser.username,
          expectedUser.password,
          true
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          payload: expectedUser,
          type: 'user/login',
        });

        dispatchSpy.mockRestore();
      });
    });

    it('redirects to the URL specified in the "returnUrl" query parameter after login', async () => {
      const expectedQueryValues = {
        returnUrl: '/test-url',
      };

      const expectedUser = {
        username: 'testusername',
        password: 'testpassword',
      };

      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const queryStringValue = queryString.stringify(expectedQueryValues);
      mockLogin.mockResolvedValue(expectedUser);

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
      fireEvent.click(rememberField);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(testLocation.pathname).toBe(expectedQueryValues.returnUrl);

        dispatchSpy.mockRestore();
      });
    });

    it('redirects to "/" after login if no "returnUrl" query parameter is specified', async () => {
      const expectedUser = {
        username: 'testusername',
        password: 'testpassword',
      };

      const dispatchSpy = jest.spyOn(store, 'dispatch');
      mockLogin.mockResolvedValue(expectedUser);

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
      fireEvent.click(rememberField);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(testLocation.pathname).toBe('/');

        dispatchSpy.mockRestore();
      });
    });

    it('disables the submit button and shows a spinner while running', async () => {
      mockLogin.mockResolvedValue({});

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
      mockLogin.mockRejectedValue({ message: 'test error message' });

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
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(usernameField).toHaveValue('test');
        expect(passwordField).toHaveValue('test');
      });
    });

    it('displays the error message if a server error occurs during the login call', async () => {
      const expectedErrorMessage = 'test error message';

      mockLogin.mockRejectedValue({
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
      fireEvent.click(submitButton);

      const submitError = await screen.findByTestId('submitError');

      expect(mockLogin).toHaveBeenCalled();
      expect(submitError).toHaveTextContent(expectedErrorMessage);
    });

    it('displays the error message if a client error occurs during the login call', async () => {
      const expectedErrorMessage = 'test error message';

      mockLogin.mockImplementation(() => {
        throw new Error(expectedErrorMessage);
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
      fireEvent.click(submitButton);

      const submitError = await screen.findByTestId('submitError');

      expect(mockLogin).toHaveBeenCalled();
      expect(submitError).toHaveTextContent(expectedErrorMessage);
    });
  });
});
