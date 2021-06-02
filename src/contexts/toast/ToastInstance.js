import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Toast } from 'react-bootstrap';

export default function ToastInstance({
  animation,
  autoHide,
  autoHideDelay,
  children,
  id,
  onClose,
  onShow,
  title,
  variant,
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
      onShow();
    });
  }, []);

  return (
    <Toast
      animation={animation}
      autohide={autoHide}
      delay={autoHideDelay}
      key={id}
      show={show}
      className={variant ? `border-${variant}` : ''}
      onClose={onClose}
    >
      <Toast.Header className={variant ? `bg-${variant} text-white` : ''}>
        <strong className="mr-auto">{title}</strong>
      </Toast.Header>
      <Toast.Body>{children}</Toast.Body>
    </Toast>
  );
}

ToastInstance.defaultProps = {
  animation: true,
  autoHide: true,
  autoHideDelay: 0,
  onClose: () => {},
  onShow: () => {},
  title: '',
  variant: null,
};

ToastInstance.propTypes = {
  animation: PropTypes.bool,
  autoHide: PropTypes.bool,
  autoHideDelay: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onShow: PropTypes.func,
  title: PropTypes.string,
  variant: PropTypes.string,
};
