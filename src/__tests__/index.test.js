import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from '../components/app/App';
import store from '../redux/store';

jest.mock('react-dom', () => ({ render: jest.fn() }));

describe('index', () => {
  it('renders App into root element', () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    // eslint-disable-next-line global-require
    require('../index');

    expect(ReactDOM.render).toHaveBeenCalledWith(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>,
      root
    );
  });
});
