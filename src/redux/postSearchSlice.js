import { createSlice } from '@reduxjs/toolkit';
import { postSearchStorageKey } from '../constants';

const postSearchSlice = createSlice({
  name: 'postSearch',
  initialState: localStorage.getItem(postSearchStorageKey),
  reducers: {
    clearPostSearch: () => {
      localStorage.removeItem(postSearchStorageKey);
      return null;
    },
    savePostSearch: (state, { payload }) => {
      localStorage.setItem(postSearchStorageKey, payload);
      return payload;
    },
  },
});

export default postSearchSlice;
export const { clearPostSearch, savePostSearch } = postSearchSlice.actions;
export const postSearchSelector = (state) => state.postSearch;
