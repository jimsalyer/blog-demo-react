import { render, screen } from '@testing-library/react';
import React from 'react';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage Component', () => {
  it('renders "Not Found" heading', () => {
    render(<NotFoundPage />);
    screen.getByTestId('notFoundPage');
  });
});
