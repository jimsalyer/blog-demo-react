import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '../../../redux/store';
import App from '../App';

jest.mock('../../../services/postService', () => ({
  searchPosts: () => Promise.resolve({ data: [] }),
}));

describe('<App />', () => {
  it('renders <AppHeader />, <AppContent />, and <AppFooter />', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      screen.getByTestId('appHeader');
      screen.getByTestId('postsPage');
      screen.getByTestId('appFooter');
    });
  });
});
