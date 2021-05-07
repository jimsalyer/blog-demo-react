import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: JSON.parse(localStorage.getItem('state.user')) || null,
  reducers: {
    clearUser: (state) => {
      localStorage.removeItem('state.user');
      return null;
    },
    setUser: (state, action) => {
      const user = action.payload;
      localStorage.setItem('state.user', JSON.stringify(user));
      return user;
    },
  },
});

export const { clearUser, setUser } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
