import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('state.user'));

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const user = action.payload;
      localStorage.setItem('state.user', JSON.stringify(user));
      return user;
    },
    logout: (state) => {
      localStorage.removeItem('state.user');
      return null;
    },
  },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
