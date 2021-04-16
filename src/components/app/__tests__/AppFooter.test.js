import { render, screen } from '@testing-library/react';
import React from 'react';
import AppFooter from '../AppFooter';

describe('<AppFooter />', () => {
  it('renders', () => {
    render(<AppFooter />);
    screen.getByTestId('appFooter');
  });
});
