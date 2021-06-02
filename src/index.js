/* istanbul ignore file */
import React from 'react';
import { render } from 'react-dom';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './index.scss';
import App from './components/app/App';
import ToastContextProvider from './contexts/toast/ToastContextProvider';
import store from './redux/store';

render(
  <StoreProvider store={store}>
    <ToastContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ToastContextProvider>
  </StoreProvider>,
  document.getElementById('root')
);
