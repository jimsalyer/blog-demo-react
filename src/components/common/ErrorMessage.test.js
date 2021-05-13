import { render, screen } from '@testing-library/react';
import React from 'react';
import ErrorMessage from './ErrorMessage';

describe('<ErrorMessage />', () => {
  describe('Production Mode', () => {
    it('displays a generic message', () => {
      const currentEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = {
        message: 'test error message',
        something: 'else',
      };

      render(<ErrorMessage error={error} />);

      const errorMessage = screen.getByTestId('errorMessage');
      expect(errorMessage).toHaveTextContent(
        'An unhandled error has occurred.'
      );

      process.env.NODE_ENV = currentEnv;
    });
  });

  describe('Non-Production Mode', () => {
    it('displays the error message', () => {
      const expectedErrorMessage = 'test error message';

      const error = {
        message: expectedErrorMessage,
      };

      render(<ErrorMessage error={error} />);

      const errorMessage = screen.getByTestId('errorMessage');
      expect(errorMessage).toHaveTextContent(expectedErrorMessage);
    });
  });
});
