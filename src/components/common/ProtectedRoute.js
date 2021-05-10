import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { selectUser } from '../../redux/userSlice';

export default function ProtectedRoute({ children, ...props }) {
  const user = useSelector(selectUser);
  return (
    <Route
      {...props}
      render={() => (user ? children : <Redirect to="/login" />)}
    />
  );
}

ProtectedRoute.propTypes = {
  children: PropTypes.element.isRequired,
};
