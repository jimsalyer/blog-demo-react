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

  describe('Form', () => {
    it('is collapsed by default', async () => {
      listUsersSpy.mockResolvedValue([]);

      render(
        <PostSearchForm
          values={{}}
          onError={onErrorMock}
          onSearch={onSearchMock}
        />
      );

      const searchFormCollapse = screen.getByTestId('searchFormCollapse');
      expect(searchFormCollapse).not.toHaveClass('show');
    });

    it('expands when clicking the header', async () => {
      listUsersSpy.mockResolvedValue([]);

      render(
        <PostSearchForm
          values={{}}
          onError={onErrorMock}
          onSearch={onSearchMock}
        />
      );

      const searchFormCollapse = screen.getByTestId('searchFormCollapse');
      const searchFormToggle = screen.getByTestId('searchFormToggle');

      expect(searchFormCollapse).not.toHaveClass('show');

      fireEvent.click(searchFormToggle);

      await waitFor(() => {
        expect(searchFormCollapse).toHaveClass('show');
      });
    });
  });

  describe('Author Filter', () => {
    it('displays a loading message until the list of users loads', async () => {
      listUsersSpy.mockResolvedValue([]);

      render(
        <PostSearchForm
          values={{}}
          onError={onErrorMock}
          onSearch={onSearchMock}
        />
      );

      screen.getByTestId('authorList');

      const loadingMessage = screen.getByTestId('authorLoadingMessage');
      expect(loadingMessage).toHaveTextContent('Loading users...');

      await waitFor(() => {
        expect(loadingMessage).not.toBeInTheDocument();
      });
    });

    it('displays a list of users by name', async () => {
      const expectedUsers = [
        {
          id: 1,
          firstName: 'Test',
          lastName: 'User1',
        },
        {
          id: 2,
          firstName: 'Test',
          lastName: 'User2',
        },
      ];

      listUsersSpy.mockResolvedValue(expectedUsers);

      render(
        <PostSearchForm
          values={{}}
          onError={onErrorMock}
          onSearch={onSearchMock}
        />
      );

      screen.getByTestId('authorList');

      const listItems = await screen.findAllByTestId('authorListItem');
      expect(listItems).toHaveLength(2);

      listItems.forEach((listItem, index) => {
        const user = expectedUsers[index];
        expect(listItem).toHaveValue(user.id.toString());
        expect(listItem).toHaveTextContent(
          `${user.firstName} ${user.lastName}`
        );
      });
    });

    it('selects the user with the ID provided in the values', async () => {
      const expectedUsers = [
        {
          id: 1,
          firstName: 'Test',
          lastName: 'User1',
        },
        {
          id: 2,
          firstName: 'Test',
          lastName: 'User2',
        },
      ];
      const expectedAuthor = expectedUsers[1];

      listUsersSpy.mockResolvedValue(expectedUsers);

      render(
        <PostSearchForm
          values={{ author: expectedAuthor.id }}
          onError={onErrorMock}
          onSearch={onSearchMock}
        />
      );

      const list = screen.getByTestId('authorList');

      await waitFor(() => {
        expect(list).toHaveValue(expectedAuthor.id.toString());
      });
    });

    it('changes the visual state of the form when a user is selected', async () => {
      const expectedUsers = [
        {
          id: 1,
          firstName: 'Test',
          lastName: 'User1',
        },
        {
          id: 2,
          firstName: 'Test',
          lastName: 'User2',
        },
      ];
      const expectedAuthor = expectedUsers[1];

      listUsersSpy.mockResolvedValue(expectedUsers);

      render(
        <PostSearchForm
          values={{}}
          onError={onErrorMock}
          onSearch={onSearchMock}
        />
      );

      await screen.findAllByTestId('authorListItem');
      const list = screen.getByTestId('authorList');

      const container = screen.getByTestId('searchFormContainer');
      expect(container).not.toHaveClass('border-primary');

      fireEvent.change(list, {
        target: {
          value: expectedAuthor.id,
        },
      });

      await waitFor(() => {
        expect(container).toHaveClass('border-primary');
      });
    });

    it('passes the selected user to the onSearch handler', async () => {
      const expectedUsers = [
        {
          id: 1,
          firstName: 'Test',
          lastName: 'User1',
        },
        {
          id: 2,
          firstName: 'Test',
          lastName: 'User2',
        },
      ];
      const expectedAuthor = expectedUsers[0];

      listUsersSpy.mockResolvedValue(expectedUsers);

      render(
        <PostSearchForm
          values={{}}
          onError={onErrorMock}
          onSearch={onSearchMock}
        />
      );

      await screen.findAllByTestId('authorListItem');
      const list = screen.getByTestId('authorList');

      fireEvent.change(list, {
        target: {
          value: expectedAuthor.id,
        },
      });

      const submitButton = await screen.findByText('Search');
      fireEvent.click(submitButton);

      expect(onSearchMock).toHaveBeenCalledWith({
        author: expectedAuthor.id,
        text: '',
      });
    });

    it('displays an appropriate message when no users are found', async () => {
      listUsersSpy.mockResolvedValue([]);

      render(
        <PostSearchForm
          values={{}}
          onError={onErrorMock}
          onSearch={onSearchMock}
        />
      );

      screen.getByTestId('authorList');

      const notFoundMessage = await screen.findByTestId(
        'authorNotFoundMessage'
      );
      expect(notFoundMessage).toHaveTextContent('No users were found.');
    });
  });

  describe('Free Text Filter', () => {
    it('defaults to the text provided (if applicable)', async () => {
      const expectedText = 'test text';

      listUsersSpy.mockResolvedValue([]);

      render(
        <PostSearchForm
          values={{ text: expectedText }}
          onError={onErrorMock}
          onSearch={onSearchMock}
        />
      );

      const fullTextSearch = await screen.findByTestId('fullTextSearch');
      expect(fullTextSearch).toHaveValue(expectedText);
    });

    it('changes the visual state of the form when the value changes', async () => {
      const expectedText = 'test text';

      listUsersSpy.mockResolvedValue([]);

      render(
        <PostSearchForm
          values={{}}
          onError={onErrorMock}
          onSearch={onSearchMock}
        />
      );

      const container = screen.getByTestId('searchFormContainer');
      expect(container).not.toHaveClass('border-primary');

      const fullTextSearch = screen.getByTestId('fullTextSearch');
      fireEvent.change(fullTextSearch, {
        target: {
          value: expectedText,
        },
      });

      await waitFor(() => {
        expect(container).toHaveClass('border-primary');
      });
    });

    it('passes the entered text to the onSearch handler', async () => {
      const expectedText = 'test text';

      listUsersSpy.mockResolvedValue([]);

      render(
        <PostSearchForm
          values={{}}
          onError={onErrorMock}
          onSearch={onSearchMock}
        />
      );

      const fullTextSearch = screen.getByTestId('fullTextSearch');
      fireEvent.change(fullTextSearch, {
        target: {
          value: expectedText,
        },
      });

      const submitButton = await screen.findByText('Search');
      fireEvent.click(submitButton);

      expect(onSearchMock).toHaveBeenCalledWith({
        author: 0,
        text: expectedText,
      });
    });
  });
});
