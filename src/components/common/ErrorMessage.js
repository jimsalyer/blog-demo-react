import PropTypes from 'prop-types';
import React from 'react';
import { Alert } from 'react-bootstrap';

export default function ErrorMessage({ error }) {
  const stack = (error.stack || 'No stack trace was provided.').split('\n');
  return (
    <Alert variant="danger" data-testid="errorMessage">
      {process.env.NODE_ENV === 'production' &&
        'An unhandled error has occurred.'}
      {process.env.NODE_ENV !== 'production' && (
        <>
          <h5 className="alert-heading">{error.message}</h5>
          {stack.map((line, index) => {
            const classNames = ['d-none', 'd-md-block'];
            if (index > 0) {
              classNames.push('ml-3');
            }

            return (
              <div key={line} className={classNames.join(' ')}>
                {line}
              </div>
            );
          })}
        </>
      )}
    </Alert>
  );
}

ErrorMessage.propTypes = {
  error: PropTypes.instanceOf(Error).isRequired,
};
