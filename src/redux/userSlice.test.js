/* eslint-disable global-require */
import { userStorageKey } from '../constants';
import authService from '../services/AuthService';
import { login, logout, userSelector } from './userSlice';

describe('userSlice', () => {
  const expectedUserId = 1;
  const expectedUsername = 'tuser';

  const expectedAccessToken = {
    userId: expectedUserId,
    token: 'testaccesstoken',
  };

  const expectedLogin = {
    username: expectedUsername,
    password: 'testpassword',
    remember: true,
  };

  const expectedUser = {
    id: expectedUserId,
    username: expectedUsername,
  };

  let loginSpy;
  let logoutSpy;

  beforeEach(() => {
    localStorage.clear();
    jest.resetModules();

    loginSpy = jest.spyOn(authService, 'login').mockResolvedValue(expectedUser);
    logoutSpy = jest
      .spyOn(authService, 'logout')
      .mockResolvedValue(expectedAccessToken);
  });

  describe('Initialization', () => {
    it('has a default initial state when no localStorage item is found', () => {
      const expectedState = {
        errorMessage: '',
        isProcessing: false,
      };

      const store = require('./store').default;
      const actualState = store.getState().user;

      expect(actualState).toStrictEqual(expectedState);
    });

    it('gets its initial state from localStorage, if provided', () => {
      const expectedState = {
        ...expectedUser,
        errorMessage: '',
        isProcessing: false,
      };

      localStorage.setItem(userStorageKey, JSON.stringify(expectedUser));

      const store = require('./store').default;
      const actualState = store.getState().user;

      expect(actualState).toStrictEqual(expectedState);

      localStorage.removeItem(userStorageKey);
    });
  });

  describe('login()', () => {
    it('logs the user in, stores the result in localStorage, and returns that result', async () => {
      const expectedState = {
        ...expectedUser,
        errorMessage: '',
        isProcessing: false,
      };

      const store = require('./store').default;

      const resultAction = await store.dispatch(login(expectedLogin));
      const actualState = store.getState().user;
      const actualUser = JSON.parse(localStorage.getItem(userStorageKey));

      expect(login.fulfilled.match(resultAction)).toBeTruthy();
      expect(actualState).toStrictEqual(expectedState);
      expect(actualUser).toStrictEqual(expectedUser);
    });

    it('sets the errorMessage state property if a server error occurs', async () => {
      const expectedErrorMessage = 'test error message';
      const expectedState = {
        errorMessage: expectedErrorMessage,
        isProcessing: false,
      };

      loginSpy.mockReset();
      loginSpy.mockRejectedValue({
        response: {
          data: {
            message: expectedErrorMessage,
          },
        },
      });

      const store = require('./store').default;

      await store.dispatch(login(expectedLogin));

      const actualState = store.getState().user;

      expect(actualState).toStrictEqual(expectedState);
    });

    it('sets the errorMessage state property if a client error occurs', async () => {
      const expectedErrorMessage = 'test error message';
      const expectedState = {
        errorMessage: expectedErrorMessage,
        isProcessing: false,
      };

      loginSpy.mockReset();
      loginSpy.mockRejectedValue({
        message: expectedErrorMessage,
      });

      const store = require('./store').default;

      await store.dispatch(login(expectedLogin));

      const actualState = store.getState().user;

      expect(actualState).toStrictEqual(expectedState);
    });
  });

  describe('logout()', () => {
    it('clears the state and the localStorage item', async () => {
      let expectedState = {
        ...expectedUser,
        errorMessage: '',
        isProcessing: false,
      };

      const store = require('./store').default;

      await store.dispatch(login(expectedLogin));

      let actualState = store.getState().user;
      let actualUser = JSON.parse(localStorage.getItem(userStorageKey));

      expect(actualState).toStrictEqual(expectedState);
      expect(actualUser).toStrictEqual(expectedUser);

      expectedState = {
        ...expectedAccessToken,
        errorMessage: '',
        isProcessing: false,
      };

      await store.dispatch(logout());

      actualState = store.getState().user;
      actualUser = JSON.parse(localStorage.getItem(userStorageKey));

      expect(actualState).toStrictEqual(expectedState);
      expect(actualUser).toBeNull();
    });

    it('sets the errorMessage state property if a server error occurs', async () => {
      const expectedErrorMessage = 'test error message';
      const expectedState = {
        errorMessage: expectedErrorMessage,
        isProcessing: false,
      };

      logoutSpy.mockReset();
      logoutSpy.mockRejectedValue({
        response: {
          data: {
            message: expectedErrorMessage,
          },
        },
      });

      const store = require('./store').default;

      await store.dispatch(logout());

      const actualState = store.getState().user;

      expect(actualState).toStrictEqual(expectedState);
    });

    it('sets the errorMessage state property if a client error occurs', async () => {
      const expectedErrorMessage = 'test error message';
      const expectedState = {
        errorMessage: expectedErrorMessage,
        isProcessing: false,
      };

      logoutSpy.mockReset();
      logoutSpy.mockRejectedValue({
        message: expectedErrorMessage,
      });

      const store = require('./store').default;

      await store.dispatch(logout());

      const actualState = store.getState().user;

      expect(actualState).toStrictEqual(expectedState);
    });
  });

  describe('userSelector()', () => {
    it('returns the user from the state', async () => {
      const expectedState = {
        ...expectedUser,
        errorMessage: '',
        isProcessing: false,
      };

      const store = require('./store').default;

      await store.dispatch(login(expectedLogin));

      const state = store.getState();
      const actualState = userSelector(state);

      expect(actualState).toStrictEqual(expectedState);
    });
  });
});

/* eslint-enable global-require */
