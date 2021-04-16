import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

jest.mock('../../../services/postService', () => ({
  searchPosts: () => Promise.resolve({ data: [] }),
}));

describe('<App />', () => {
  it('renders <AppHeader />, <AppContent />, and <AppFooter />', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      screen.getByTestId('appHeader');
      screen.getByTestId('postsPage');
      screen.getByTestId('appFooter');
    });
  });
});
