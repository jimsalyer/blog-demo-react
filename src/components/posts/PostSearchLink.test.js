import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { clearPostSearch, savePostSearch } from '../../redux/postSearchSlice';
import store from '../../redux/store';
import PostSearchLink from './PostSearchLink';

describe('<PostSearchLink />', () => {
  afterEach(() => {
    store.dispatch(clearPostSearch());
  });

  it('renders a route link to the post search page with the last set of query parameters', async () => {
    const expectedSearch = 'q=test';

    store.dispatch(savePostSearch(expectedSearch));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PostSearchLink />
        </MemoryRouter>
      </Provider>
    );

    const postSearchLink = screen.getByTestId('postSearchLink');
    expect(postSearchLink).toHaveAttribute('href', `/?${expectedSearch}`);
    expect(postSearchLink).toHaveTextContent('Back to Search');
  });
});
