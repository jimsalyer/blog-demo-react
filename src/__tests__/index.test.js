import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from '../components/app/App';

jest.mock('react-dom', () => ({ render: jest.fn() }));

describe('index', () => {
  it('renders App into root element', () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    // eslint-disable-next-line global-require
    require('../index');

    expect(ReactDOM.render).toHaveBeenCalledWith(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      root
    );
  });
});
