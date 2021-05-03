import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Alert } from 'react-bootstrap';

export default function ErrorMessage({ error }) {
  const stackLines = (error.stack || 'No stack trace was provided.').split(
    '\n'
  );
  const formattedStackLines = _.chain(stackLines)
    .map(_.trim)
    .compact()
    .uniq()
    .value();

  return (
    <Alert variant="danger" data-testid="errorMessage">
      {process.env.NODE_ENV === 'production' &&
        'An unhandled error has occurred.'}
      {process.env.NODE_ENV !== 'production' && (
        <>
          <h5 className="alert-heading" data-testid="errorMessageHeading">
            {error.message}
          </h5>
          {formattedStackLines.map((line, index) => {
            const classNames = ['d-none', 'd-md-block'];
            if (index > 0) {
              classNames.push('ml-3');
            }

            return (
              <div
                key={line}
                className={classNames.join(' ')}
                data-testid="errorMessageStackLine"
              >
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
