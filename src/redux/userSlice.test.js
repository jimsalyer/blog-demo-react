/* eslint-disable global-require */

describe('userSlice', () => {
  beforeEach(() => {
    jest.resetModules();
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('has an initial state of null when no corresponding localStorage item is found', () => {
      const store = require('./store').default;
      const state = store.getState();

      expect(state.user).toBeNull();
    });

    it('gets its initial state from localStorage, if provided', () => {
      const expectedUser = { id: 1 };

      localStorage.setItem('state.user', JSON.stringify(expectedUser));

      const store = require('./store').default;
      const state = store.getState();

      expect(state.user).toStrictEqual(expectedUser);
    });
  });

  describe('login()', () => {
    it('sets the state to the given user and stores the state in localStorage', () => {
      const expectedUser = { id: 1 };

      const store = require('./store').default;
      const { login } = require('./userSlice');

      store.dispatch(login(expectedUser));

      const state = store.getState();
      const stateUser = state.user;
      const localStorageUser = JSON.parse(localStorage.getItem('state.user'));

      expect(stateUser).toStrictEqual(expectedUser);
      expect(localStorageUser).toStrictEqual(expectedUser);
    });
  });

  describe('logout()', () => {
    it('clears the state and the localStorage item', () => {
      const expectedUser = { id: 1 };

      const store = require('./store').default;
      const { login, logout } = require('./userSlice');

      store.dispatch(login(expectedUser));

      let state = store.getState();
      let stateUser = state.user;
      let localStorageUser = JSON.parse(localStorage.getItem('state.user'));

      expect(stateUser).toStrictEqual(expectedUser);
      expect(localStorageUser).toStrictEqual(expectedUser);

      store.dispatch(logout());

      state = store.getState();
      stateUser = state.user;
      localStorageUser = JSON.parse(localStorage.getItem('state.user'));

      expect(stateUser).toBeNull();
      expect(localStorageUser).toBeNull();
    });
  });

  describe('selectUser()', () => {
    it('returns the user from the state', () => {
      const expectedUser = { id: 1 };

      const store = require('./store').default;
      const { selectUser, login } = require('./userSlice');

      store.dispatch(login(expectedUser));

      const state = store.getState();
      const user = selectUser(state);

      expect(user).toStrictEqual(expectedUser);
    });
  });
});

/* eslint-enable global-require */
