/* istanbul ignore file */
import React from 'react';
import { render } from 'react-dom';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import './index.scss';
import App from './components/app/App';
import store from './redux/store';

render(
  <StoreProvider store={store}>
    <ToastProvider autoDismiss>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ToastProvider>
  </StoreProvider>,
  document.getElementById('root')
);
