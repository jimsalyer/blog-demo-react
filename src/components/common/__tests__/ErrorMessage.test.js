import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import ErrorMessage from '../ErrorMessage';

describe('<ErrorMessage />', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Production Mode', () => {
    it('displays a generic message', () => {
      const currentEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const expectedError = new Error('test error message');

      render(<ErrorMessage error={expectedError} />);

      const errorMessage = screen.getByTestId('errorMessage');
      expect(errorMessage).toHaveTextContent(
        'An unhandled error has occurred.'
      );

      process.env.NODE_ENV = currentEnv;
    });
  });

  describe('Non-Production Mode', () => {
    it('displays the error message and stack trace', () => {
      const expectedError = new Error('test error message');
      expectedError.stack = 'stack trace line 1\nstack trace line 2';

      render(<ErrorMessage error={expectedError} />);

      const heading = screen.getByTestId('errorMessageHeading');
      expect(heading).toHaveTextContent(expectedError.message);

      const stackLines = screen.getAllByTestId('errorMessageStackLine');
      expect(stackLines).toHaveLength(2);
    });

    it('trims each line of the stack trace', () => {
      const expectedError = new Error('test error message');
      expectedError.stack = '     test stack line      ';

      render(<ErrorMessage error={expectedError} />);

      const stackLines = screen.getAllByTestId('errorMessageStackLine');
      expect(stackLines).toHaveLength(1);
      expect(stackLines[0]).toHaveTextContent('test stack line');
    });

    it('removes blank lines from the stack trace', () => {
      const expectedError = new Error('test error message');
      expectedError.stack = 'stack trace line\n     \n\n';

      render(<ErrorMessage error={expectedError} />);

      const stackLines = screen.getAllByTestId('errorMessageStackLine');
      expect(stackLines).toHaveLength(1);
    });

    it('removes duplicate lines from the stack trace', () => {
      const expectedError = new Error('test error message');
      expectedError.stack = 'stack trace line\nstack trace line';

      render(<ErrorMessage error={expectedError} />);

      const stackLines = screen.getAllByTestId('errorMessageStackLine');
      expect(stackLines).toHaveLength(1);
    });

    it('displays an appropriate message when the error has no stack trace', () => {
      const expectedError = new Error('test error message');
      expectedError.stack = null;

      render(<ErrorMessage error={expectedError} />);

      const heading = screen.getByTestId('errorMessageHeading');
      expect(heading).toHaveTextContent(expectedError.message);

      const stackLines = screen.getAllByTestId('errorMessageStackLine');
      expect(stackLines).toHaveLength(1);
      expect(stackLines[0]).toHaveTextContent('No stack trace was provided.');
    });

    it('adds a left margin to any stack trace lines that are not the first', () => {
      const expectedError = new Error('test error message');
      expectedError.stack = 'stack line 1\nstack line 2\nstack line 3';

      render(<ErrorMessage error={expectedError} />);

      const heading = screen.getByTestId('errorMessageHeading');
      expect(heading).toHaveTextContent(expectedError.message);

      const stackLines = screen.getAllByTestId('errorMessageStackLine');
      expect(stackLines).toHaveLength(3);
      expect(stackLines[0]).not.toHaveClass('ml-3');

      stackLines
        .slice(1)
        .forEach((stackLine) => expect(stackLine).toHaveClass('ml-3'));
    });
  });
});
