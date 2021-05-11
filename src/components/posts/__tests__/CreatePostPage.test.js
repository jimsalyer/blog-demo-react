import { render, screen } from '@testing-library/react';
import React from 'react';
import CreatePostPage from '../CreatePostPage';

describe('<CreatePostPage />', () => {
  it('renders', () => {
    render(<CreatePostPage />);

    screen.getByTestId('createPostPage');
  });
});
