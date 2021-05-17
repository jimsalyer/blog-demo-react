import { render, screen, within } from '@testing-library/react';
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

  it('replaces the default text with a child element, if provided', async () => {
    const expectedChildText = 'Test Child';
    const expectedChild = (
      <span data-testid="postSearchLinkChild">{expectedChildText}</span>
    );

    store.dispatch(savePostSearch('q=test'));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PostSearchLink>{expectedChild}</PostSearchLink>
        </MemoryRouter>
      </Provider>
    );

    const postSearchLink = screen.getByTestId('postSearchLink');
    const postSearchLinkChild = within(postSearchLink).getByTestId(
      'postSearchLinkChild'
    );
    expect(postSearchLinkChild).toHaveTextContent(expectedChildText);
  });

  it('renders simple link to listing if no query parameters have been saved', async () => {
    const expectedUrl = '/';

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PostSearchLink />
        </MemoryRouter>
      </Provider>
    );

    const postSearchLink = screen.getByTestId('postSearchLink');
    expect(postSearchLink).toHaveAttribute('href', expectedUrl);
  });

  it('passes additional properties defined on the component to the inner link component', async () => {
    const expectedClassName = 'test-class';
    const expectedStyle = { color: '#00FF00' };

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PostSearchLink className={expectedClassName} style={expectedStyle} />
        </MemoryRouter>
      </Provider>
    );

    const postSearchLink = screen.getByTestId('postSearchLink');
    expect(postSearchLink).toHaveClass(expectedClassName);
    expect(postSearchLink).toHaveStyle(expectedStyle);
  });
});
