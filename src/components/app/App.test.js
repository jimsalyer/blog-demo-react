import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import store from '../../redux/store';
import App from './App';

jest.mock('../../services/PostService', () => ({
  searchPosts: () => Promise.resolve({ data: [] }),
}));

describe('<App />', () => {
  it('renders <AppHeader />, <AppContent />, and <AppFooter />', async () => {
    render(
      <StoreProvider store={store}>
        <ToastProvider>
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        </ToastProvider>
      </StoreProvider>
    );

    screen.getByTestId('appHeader');
    await waitFor(() => {
      expect(screen.queryByTestId('postSearchPage')).toBeInTheDocument();
    });
    screen.getByTestId('appFooter');
  });
});
