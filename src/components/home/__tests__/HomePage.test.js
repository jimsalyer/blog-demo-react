import { render, screen } from '@testing-library/react';
import React from 'react';
import HomePage from '../HomePage';

describe('<HomePage />', () => {
  it('renders', () => {
    render(<HomePage />);
    screen.getByTestId('homePage');
  });
});
