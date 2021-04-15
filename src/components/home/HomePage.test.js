import { render, screen } from '@testing-library/react';
import React from 'react';
import HomePage from './HomePage';

describe('HomePage Component', () => {
  it('renders "Home" heading', () => {
    render(<HomePage />);
    screen.getByTestId('homePage');
  });
});
