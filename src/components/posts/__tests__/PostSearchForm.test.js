import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import React from 'react';
import * as userService from '../../../services/userService';
import PostSearchForm from '../PostSearchForm';

describe('<PostSearchForm />', () => {
  let listUsersSpy;
  let onErrorMock;
  let onSearchMock;

  beforeAll(() => {
    onErrorMock = jest.fn();
    onSearchMock = jest.fn();
  });

  beforeEach(() => {
    listUsersSpy = jest.spyOn(userService, 'listUsers');
  });

  afterAll(() => {
    onErrorMock.mockRestore();
    onSearchMock.mockRestore();
  });

  afterEach(() => {
    listUsersSpy.mockRestore();
    cleanup();
  });

  it('renders the form collapsed by default', async () => {
    listUsersSpy.mockResolvedValue([]);

    render(
      <PostSearchForm
        values={{}}
        onError={onErrorMock}
        onSearch={onSearchMock}
      />
    );

    await waitFor(() => {
      const searchFormCollapse = screen.getByTestId('searchFormCollapse');

      expect(searchFormCollapse).not.toHaveClass('show');
    });
  });

  it('expands the form when clicking the header', async () => {
    listUsersSpy.mockResolvedValue([]);

    render(
      <PostSearchForm
        values={{}}
        onError={onErrorMock}
        onSearch={onSearchMock}
      />
    );

    await waitFor(() => {
      const searchFormCollapse = screen.getByTestId('searchFormCollapse');
      const searchFormToggle = screen.getByTestId('searchFormToggle');

      expect(searchFormCollapse).not.toHaveClass('show');

      fireEvent.click(searchFormToggle);

      expect(searchFormCollapse).toHaveClass('show');
    });
  });
});
