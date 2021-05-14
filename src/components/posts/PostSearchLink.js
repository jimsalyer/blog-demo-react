import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { postSearchSelector } from '../../redux/postSearchSlice';

export default function PostSearchLink({ children, ...props }) {
  const postSearch = useSelector(postSearchSelector);
  return (
    <Link
      to={{ pathname: '/', search: postSearch }}
      data-testid="postSearchLink"
      {...props}
    >
      {children || 'Back to Search'}
    </Link>
  );
}

PostSearchLink.defaultProps = {
  children: null,
};

PostSearchLink.propTypes = {
  children: PropTypes.node,
};
