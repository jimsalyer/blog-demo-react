import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import CreatePostPage from './CreatePostPage';

describe('<CreatePostPage />', () => {
  it('renders', () => {
    render(
      <Provider store={store}>
        <CreatePostPage />
      </Provider>
    );

    screen.getByTestId('createPostPage');
  });
});
