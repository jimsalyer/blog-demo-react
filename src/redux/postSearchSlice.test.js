/* eslint-disable global-require */
import { postSearchStorageKey } from '../constants';
import {
  clearPostSearch,
  postSearchSelector,
  savePostSearch,
} from './postSearchSlice';

describe('postSearchSlice', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.resetModules();
  });

  describe('Initialization', () => {
    it('has a default initial state of null when no localStorage item is found', () => {
      const store = require('./store').default;
      const actualState = store.getState().postSearch;

      expect(actualState).toBeNull();
    });

    it('gets its initial state from localStorage, if provided', () => {
      const expectedState = 'test=state';

      localStorage.setItem(postSearchStorageKey, expectedState);

      const store = require('./store').default;
      const actualState = store.getState().postSearch;

      expect(actualState).toBe(expectedState);

      localStorage.removeItem(postSearchStorageKey);
    });
  });

  describe('clearPostSearch()', () => {
    it('clears the localStorage item and state', () => {
      const expectedState = 'q=test';

      localStorage.setItem(postSearchStorageKey, expectedState);

      const store = require('./store').default;
      let actualState = store.getState().postSearch;

      expect(actualState).toBe(expectedState);

      store.dispatch(clearPostSearch());
      actualState = store.getState().postSearch;

      expect(actualState).toBeNull();
    });
  });

  describe('savePostSearch()', () => {
    it('saves the provided search query in localStorage and state', () => {
      const expectedState = 'q=test';

      const store = require('./store').default;
      let actualState = store.getState().postSearch;
      let actualStorageState = localStorage.getItem(postSearchStorageKey);

      expect(actualState).not.toBe(expectedState);
      expect(actualStorageState).not.toBe(expectedState);

      store.dispatch(savePostSearch(expectedState));
      actualState = store.getState().postSearch;
      actualStorageState = localStorage.getItem(postSearchStorageKey);

      expect(actualState).toBe(expectedState);
      expect(actualStorageState).toBe(expectedState);
    });
  });

  describe('postSearchSelector()', () => {
    it('returns the search query from the state', async () => {
      const expectedState = 'q=test';

      localStorage.setItem(postSearchStorageKey, expectedState);

      const store = require('./store').default;
      const state = store.getState();
      const actualState = postSearchSelector(state);

      expect(actualState).toStrictEqual(expectedState);
    });
  });
});

/* eslint-enable global-require */
