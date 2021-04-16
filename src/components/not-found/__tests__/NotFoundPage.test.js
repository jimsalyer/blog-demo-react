import { render, screen } from '@testing-library/react';
import React from 'react';
import NotFoundPage from '../NotFoundPage';

describe('<NotFoundPage />', () => {
  it('renders', () => {
    render(<NotFoundPage />);
    screen.getByTestId('notFoundPage');
  });
});
