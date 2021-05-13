import PropTypes from 'prop-types';
import queryString from 'query-string';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { userSelector } from '../../redux/userSlice';

export default function ProtectedRoute({ children, ...props }) {
  const location = useLocation();
  const user = useSelector(userSelector);

  return (
    <Route
      {...props}
      render={() => {
        if (user.id || location.pathname === '/login') {
          return children;
        }

        const queryValues = {
          returnUrl: `${location.pathname}${location.search}`,
        };

        const loginLocation = {
          pathname: '/login',
          search: queryString.stringify(queryValues),
        };
        return <Redirect to={loginLocation} />;
      }}
    />
  );
}

ProtectedRoute.propTypes = {
  children: PropTypes.element.isRequired,
};
