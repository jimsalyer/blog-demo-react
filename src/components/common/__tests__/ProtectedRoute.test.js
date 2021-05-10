import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import store from '../../../redux/store';
import * as userSliceExports from '../../../redux/userSlice';

describe('<ProtectedRoute />', () => {
  it('loads the given component if the user is authenticated', async () => {
    const user = { id: 1 };

    const selectUserSpy = jest
      .spyOn(userSliceExports, 'selectUser')
      .mockReturnValue(user);

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

    selectUserSpy.mockRestore();
  });

  it('redirects to the "/login" route if the user is not authenticated', async () => {
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

    await screen.findByTestId('loginRoute');
  });
});
