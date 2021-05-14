/* istanbul ignore file */
import { configureStore } from '@reduxjs/toolkit';
import postSearchSlice from './postSearchSlice';
import userSlice from './userSlice';

export default configureStore({
  reducer: {
    postSearch: postSearchSlice.reducer,
    user: userSlice.reducer,
  },
});
