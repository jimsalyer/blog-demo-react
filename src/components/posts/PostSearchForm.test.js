import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import UserService from '../../services/UserService';
import PostSearchForm from './PostSearchForm';

jest.mock('../../services/UserService');

describe('<PostSearchForm />', () => {
  let mockListUsers;
  let mockOnError;
  let mockOnSearch;

  beforeAll(() => {
    mockOnError = jest.fn();
    mockOnSearch = jest.fn();
  });

  beforeEach(() => {
    mockListUsers = jest.fn();
    UserService.mockImplementation(() => ({
      listUsers: mockListUsers,
    }));
  });

  afterEach(() => {
    UserService.mockRestore();
  });

  describe('Form', () => {
    it('is collapsed by default', async () => {
      mockListUsers.mockResolvedValue([]);

      render(
        <PostSearchForm
          values={{}}
          onError={mockOnError}
          onSearch={mockOnSearch}
        />
      );

      await screen.findByTestId('authorNotFoundMessage');

      const searchFormCollapse = screen.getByTestId('searchFormCollapse');
      expect(searchFormCollapse).not.toHaveClass('show');
    });

    it('expands when clicking the header', async () => {
      mockListUsers.mockResolvedValue([]);

      render(
        <PostSearchForm
          values={{}}
          onError={mockOnError}
          onSearch={mockOnSearch}
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

    it('resets the filter fields, collapses, and triggers the onSearch handler with no values when the reset button is clicked', async () => {
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
      const expectedText = 'test text';

      mockListUsers.mockResolvedValue(expectedUsers);

      render(
        <PostSearchForm
          values={{ author: expectedAuthor.id, text: expectedText }}
          onError={mockOnError}
          onSearch={mockOnSearch}
        />
      );

      await screen.findAllByTestId('authorListItem');

      const container = screen.getByTestId('searchFormContainer');
      expect(container).toHaveClass('border-primary');

      const list = screen.getByTestId('authorList');
      expect(list).toHaveValue(expectedAuthor.id.toString());

      const fullTextSearch = screen.getByTestId('fullTextSearch');
      expect(fullTextSearch).toHaveValue(expectedText);

      const resetButton = screen.getByText('Reset');

      fireEvent.click(resetButton);

      expect(container).not.toHaveClass('border-primary');
      expect(list).toHaveValue('0');
      expect(fullTextSearch).toHaveValue('');
      expect(mockOnSearch).toHaveBeenCalledWith({});
    });
  });

  describe('Author Filter', () => {
    it('displays a loading message until the list of users loads', async () => {
      mockListUsers.mockResolvedValue([]);

      render(
        <PostSearchForm
          values={{}}
          onError={mockOnError}
          onSearch={mockOnSearch}
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

      mockListUsers.mockResolvedValue(expectedUsers);

      render(
        <PostSearchForm
          values={{}}
          onError={mockOnError}
          onSearch={mockOnSearch}
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

      mockListUsers.mockResolvedValue(expectedUsers);

      render(
        <PostSearchForm
          values={{ author: expectedAuthor.id }}
          onError={mockOnError}
          onSearch={mockOnSearch}
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

      mockListUsers.mockResolvedValue(expectedUsers);

      render(
        <PostSearchForm
          values={{}}
          onError={mockOnError}
          onSearch={mockOnSearch}
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

      expect(container).toHaveClass('border-primary');
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

      mockListUsers.mockResolvedValue(expectedUsers);

      render(
        <PostSearchForm
          values={{}}
          onError={mockOnError}
          onSearch={mockOnSearch}
        />
      );

      await screen.findAllByTestId('authorListItem');
      const list = screen.getByTestId('authorList');

      fireEvent.change(list, {
        target: {
          value: expectedAuthor.id,
        },
      });

      const submitButton = screen.getByText('Search');
      fireEvent.click(submitButton);

      expect(mockOnSearch).toHaveBeenCalledWith({
        author: expectedAuthor.id,
        text: '',
      });
    });

    it('displays an appropriate message when no users are found', async () => {
      mockListUsers.mockResolvedValue([]);

      render(
        <PostSearchForm
          values={{}}
          onError={mockOnError}
          onSearch={mockOnSearch}
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

      mockListUsers.mockResolvedValue([]);

      render(
        <PostSearchForm
          values={{ text: expectedText }}
          onError={mockOnError}
          onSearch={mockOnSearch}
        />
      );

      const fullTextSearch = await screen.findByTestId('fullTextSearch');
      expect(fullTextSearch).toHaveValue(expectedText);
    });

    it('changes the visual state of the form when the value changes', async () => {
      const expectedText = 'test text';

      mockListUsers.mockResolvedValue([]);

      render(
        <PostSearchForm
          values={{}}
          onError={mockOnError}
          onSearch={mockOnSearch}
        />
      );

      await screen.findByTestId('authorNotFoundMessage');

      const container = screen.getByTestId('searchFormContainer');
      expect(container).not.toHaveClass('border-primary');

      const fullTextSearch = screen.getByTestId('fullTextSearch');

      fireEvent.change(fullTextSearch, {
        target: {
          value: expectedText,
        },
      });

      expect(container).toHaveClass('border-primary');
    });

    it('passes the entered text to the onSearch handler', async () => {
      const expectedText = 'test text';

      mockListUsers.mockResolvedValue([]);

      render(
        <PostSearchForm
          values={{}}
          onError={mockOnError}
          onSearch={mockOnSearch}
        />
      );

      await screen.findByTestId('authorNotFoundMessage');

      const fullTextSearch = screen.getByTestId('fullTextSearch');
      fireEvent.change(fullTextSearch, {
        target: {
          value: expectedText,
        },
      });

      const submitButton = screen.getByText('Search');
      fireEvent.click(submitButton);

      expect(mockOnSearch).toHaveBeenCalledWith({
        author: 0,
        text: expectedText,
      });
    });
  });
});
