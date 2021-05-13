import { render, screen } from '@testing-library/react';
import queryString from 'query-string';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import store from '../../redux/store';
import * as userSliceExports from '../../redux/userSlice';

describe('<ProtectedRoute />', () => {
  it('loads the given component if the user is authenticated', async () => {
    jest.spyOn(userSliceExports, 'userSelector').mockReturnValue({ id: 1 });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <ProtectedRoute exact path="/protected">
            <div data-testid="protectedRoute" />
          </ProtectedRoute>
          <Route path="/login">
            <div data-testid="loginRoute" />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await screen.findByTestId('protectedRoute');
  });

  it('redirects to the "/login" route with the current URL as a parameter if the user is not authenticated', async () => {
    let testLocation;

    jest.spyOn(userSliceExports, 'userSelector').mockReturnValue({});

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <ProtectedRoute exact path="/protected">
            <div data-testid="protectedRoute" />
          </ProtectedRoute>
          <Route
            path="/login"
            render={({ location }) => {
              testLocation = location;
              return <div data-testid="loginRoute" />;
            }}
          />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByTestId('loginRoute');

    const queryValues = queryString.parse(testLocation.search);
    expect(queryValues).toHaveProperty('returnUrl', '/protected');
  });
});
