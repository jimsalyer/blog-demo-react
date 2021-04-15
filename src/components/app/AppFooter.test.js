import { render, screen } from '@testing-library/react';
import React from 'react';
import AppFooter from './AppFooter';

describe('AppFooter Component', () => {
  it('renders footer element', () => {
    render(<AppFooter />);
    screen.getByTestId('appFooter');
  });
});
