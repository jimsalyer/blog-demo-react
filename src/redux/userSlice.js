import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userStorageKey } from '../constants';
import authService from '../services/AuthService';

export const login = createAsyncThunk(
  'user/login',
  async ({ username, password, remember }, { rejectWithValue }) => {
    try {
      const user = await authService.login(username, password, remember);
      localStorage.setItem(userStorageKey, JSON.stringify(user));
      return user;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      localStorage.removeItem(userStorageKey);
    } catch (error) {
      localStorage.removeItem(userStorageKey);
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error);
    }
  }
);

export default createSlice({
  name: 'user',
  initialState: {
    ...JSON.parse(localStorage.getItem(userStorageKey)),
    errorMessage: '',
    isProcessing: false,
  },
  reducers: {},
  extraReducers: {
    [login.fulfilled]: (state, { payload }) => ({
      ...payload,
      errorMessage: '',
      isProcessing: false,
    }),
    [login.pending]: (state) => ({
      ...state,
      isProcessing: true,
    }),
    [login.rejected]: (state, { payload }) => ({
      ...state,
      errorMessage: payload.message,
      isProcessing: false,
    }),
    [logout.fulfilled]: () => ({
      errorMessage: '',
      isProcessing: false,
    }),
    [logout.pending]: (state) => ({
      ...state,
      isProcessing: true,
    }),
    [logout.rejected]: (state, { payload }) => {
      return {
        errorMessage: payload.message,
        isProcessing: false,
      };
    },
  },
});

export const userSelector = (state) => state.user;
