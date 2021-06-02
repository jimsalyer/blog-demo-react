import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ToastInstance from './ToastInstance';
import ToastContext from './ToastContext';

export default function ToastContextProvider({
  animation,
  autoHide,
  autoHideDelay,
  children,
  onClose,
  onShow,
}) {
  const defaults = {
    animation,
    autoHide,
    autoHideDelay,
    onClose,
    onShow,
  };
  const [toasts, setToasts] = useState([]);

  function addToast(
    content,
    { animation, autoHide, autoHideDelay, onClose, onShow, title, variant } = {}
  ) {
    const toast = {
      animation: animation ?? defaults.animation,
      autoHide: autoHide ?? defaults.autoHide,
      autoHideDelay: autoHideDelay ?? defaults.autoHideDelay,
      id: uuidv4(),
      content,
      onClose: onClose ?? defaults.onClose,
      onShow: onShow ?? defaults.onShow,
      title: title ?? '',
      variant,
    };
    setToasts([toast, ...toasts]);
  }

  function removeToast(id, callback) {
    const toastsCopy = [...toasts];
    const index = toastsCopy.findIndex((toast) => toast.id === id);

    if (index >= 0) {
      const toast = toastsCopy[index];
      toastsCopy.splice(index, 1);
      setToasts(toastsCopy);

      if (callback) {
        callback(toast);
      } else if (onClose) {
        onClose(toast);
      }
    }
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => {
          const {
            animation,
            autoHide,
            autoHideDelay,
            content,
            id,
            onClose,
            onShow,
            title,
            variant,
          } = toast;

          return (
            <ToastInstance
              animation={animation}
              autoHide={autoHide}
              autoHideDelay={autoHideDelay}
              id={id}
              key={id}
              onClose={() => removeToast(id, onClose)}
              onShow={() => onShow(toast)}
              title={title}
              variant={variant}
            >
              {content}
            </ToastInstance>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

ToastContextProvider.defaultProps = {
  animation: true,
  autoHide: true,
  autoHideDelay: 5000,
  onClose: () => {},
  onShow: () => {},
};

ToastContextProvider.propTypes = {
  animation: PropTypes.bool,
  autoHide: PropTypes.bool,
  autoHideDelay: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  onClose: PropTypes.func,
  onShow: PropTypes.func,
};
