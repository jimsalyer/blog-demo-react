import PropTypes from 'prop-types';
import React from 'react';
import { Alert } from 'react-bootstrap';

export default function ErrorMessage({ error }) {
  return (
    <Alert variant="danger" data-testid="errorMessage">
      {process.env.NODE_ENV === 'production' &&
        'An unhandled error has occurred.'}
      {process.env.NODE_ENV !== 'production' && error.message}
    </Alert>
  );
}

ErrorMessage.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }).isRequired,
};
