import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Pager from './Pager';

describe('<Pager />', () => {
  let onLimitChangeMock;
  let onPageChangeMock;

  beforeAll(() => {
    onLimitChangeMock = jest.fn();
    onPageChangeMock = jest.fn();
  });

  afterAll(() => {
    onLimitChangeMock.mockRestore();
    onPageChangeMock.mockRestore();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Limiting', () => {
    it('displays a dropdown with the choices that correspond to the paging limits set on the component', async () => {
      render(
        <Pager
          limits={[5, 15, 25]}
          currentLimit={5}
          pageCount={10}
          onLimitChange={onLimitChangeMock}
          onPageChange={onPageChangeMock}
        />
      );

      const limitToggle = screen.getByTestId('limitToggle');

      fireEvent.click(limitToggle);

      const limitItems = await screen.findAllByTestId('limitItem');

      expect(limitItems).toHaveLength(3);
    });

    it('displays the text of "10 Per Page" on the limit dropdown toggler when 10 is the selected limit', () => {
      render(
        <Pager
          limits={[5, 10, 20]}
          currentLimit={10}
          pageCount={10}
          onLimitChange={onLimitChangeMock}
          onPageChange={onPageChangeMock}
        />
      );

      const limitToggle = screen.getByTestId('limitToggle');

      expect(limitToggle).toHaveTextContent('10 Per Page');
    });

    it('triggers the onLimitChange handler with a value of 5 when clicking the corresponding limit item', () => {
      render(
        <Pager
          limits={[5, 15, 25]}
          currentLimit={5}
          pageCount={10}
          onLimitChange={onLimitChangeMock}
          onPageChange={onPageChangeMock}
        />
      );

      const limitToggle = screen.getByTestId('limitToggle');

      fireEvent.click(limitToggle);

      const limitItems = screen.getAllByTestId('limitItem');

      fireEvent.click(limitItems[1]);

      expect(onLimitChangeMock).toHaveBeenCalledWith(15);
    });
  });

  describe('Paging', () => {
    it('only shows page number links 3, 4, and 5 if the current page is 4, the page length is 3, and the page count is 10', () => {
      render(
        <Pager
          pageCount={10}
          pageLength={3}
          currentPage={4}
          onLimitChange={onLimitChangeMock}
          onPageChange={onPageChangeMock}
        />
      );

      const pageNumberLinks = screen.getAllByTestId('pageNumberLink');

      expect(pageNumberLinks).toHaveLength(3);
      expect(pageNumberLinks[0]).toHaveTextContent('3');
      expect(pageNumberLinks[1]).toHaveTextContent('4');
      expect(pageNumberLinks[2]).toHaveTextContent('5');
    });

    it('highlights the active page number link', () => {
      render(
        <Pager
          pageCount={10}
          pageLength={3}
          currentPage={4}
          onLimitChange={onLimitChangeMock}
          onPageChange={onPageChangeMock}
        />
      );

      const pageNumberLinks = screen.getAllByTestId('pageNumberLink');
      const activePageNumberLink = pageNumberLinks.find((pageNumberLink) =>
        pageNumberLink.parentElement.classList.contains('active')
      );

      expect(activePageNumberLink).toHaveTextContent('4');
    });

    it('triggers the onPageChange handler with a value of 1 when clicking the "first" page link', () => {
      render(
        <Pager
          pageCount={10}
          currentPage={3}
          onLimitChange={onLimitChangeMock}
          onPageChange={onPageChangeMock}
        />
      );

      const pageLink = screen.getByTestId('firstPageLink');

      fireEvent.click(pageLink);

      expect(onPageChangeMock).toHaveBeenCalledWith(1);
    });

    it('triggers the onPageChange handler with a value of 3 when clicking the "..." page link on the left when the current page is 5, the page count is 10, and the page length is 3', () => {
      render(
        <Pager
          pageCount={10}
          pageLength={3}
          currentPage={5}
          onLimitChange={onLimitChangeMock}
          onPageChange={onPageChangeMock}
        />
      );

      const pageLink = screen.getByTestId('ellipsisBackPageLink');

      fireEvent.click(pageLink);

      expect(onPageChangeMock).toHaveBeenCalledWith(3);
    });

    it('triggers the onPageChange handler with a value of 2 when clicking the "previous" page link when the current page is 3', () => {
      render(
        <Pager
          pageCount={10}
          currentPage={3}
          onLimitChange={onLimitChangeMock}
          onPageChange={onPageChangeMock}
        />
      );

      const pageLink = screen.getByTestId('prevPageLink');

      fireEvent.click(pageLink);

      expect(onPageChangeMock).toHaveBeenCalledWith(2);
    });

    it('triggers the onPageChange handler with a value of 5 when the page number link labeled 5 is clicked', () => {
      render(
        <Pager
          pageCount={10}
          currentPage={2}
          onLimitChange={onLimitChangeMock}
          onPageChange={onPageChangeMock}
        />
      );

      const pageNumberLinks = screen.getAllByTestId('pageNumberLink');
      const targetPageNumberLink = pageNumberLinks.find(
        (pageNumberLink) => pageNumberLink.textContent === '5'
      );

      fireEvent.click(targetPageNumberLink);

      expect(onPageChangeMock).toHaveBeenCalledWith(5);
    });

    it('triggers the onPageChange handler with a value of 3 when clicking the "next" page link when the current page is 2', () => {
      render(
        <Pager
          pageCount={10}
          currentPage={2}
          onLimitChange={onLimitChangeMock}
          onPageChange={onPageChangeMock}
        />
      );

      const pageLink = screen.getByTestId('nextPageLink');

      fireEvent.click(pageLink);

      expect(onPageChangeMock).toHaveBeenCalledWith(3);
    });

    it('triggers the onPageChange handler with a value of 5 when clicking the "..." page link on the right when the current page is 3, the page count is 10, and the page length is 3', () => {
      render(
        <Pager
          pageCount={10}
          pageLength={3}
          currentPage={3}
          onLimitChange={onLimitChangeMock}
          onPageChange={onPageChangeMock}
        />
      );

      const pageLink = screen.getByTestId('ellipsisForwardPageLink');

      fireEvent.click(pageLink);

      expect(onPageChangeMock).toHaveBeenCalledWith(5);
    });

    it('triggers the onPageChange handler with a value of 10 when clicking the "last" page link when the page count is 10', () => {
      render(
        <Pager
          pageCount={10}
          currentPage={2}
          onLimitChange={onLimitChangeMock}
          onPageChange={onPageChangeMock}
        />
      );

      const pageLink = screen.getByTestId('lastPageLink');

      fireEvent.click(pageLink);

      expect(onPageChangeMock).toHaveBeenCalledWith(10);
    });

    it('hides the "first" page link if the current page is less than 3', () => {
      render(
        <Pager
          pageCount={10}
          currentPage={2}
          onLimitChange={onLimitChangeMock}
          onPageChange={onPageChangeMock}
        />
      );

      const pageLink = screen.queryByTestId('firstPageLink');

      expect(pageLink).not.toBeInTheDocument();
    });

    it('hides the left "..." page link if the current page is less than the page length + 1', () => {
      render(
        <Pager
          pageCount={10}
          pageLength={3}
          currentPage={3}
          onLimitChange={onLimitChangeMock}
          onPageChange={onPageChangeMock}
        />
      );

      const pageLink = screen.queryByTestId('ellipsisBackPageLink');

      expect(pageLink).not.toBeInTheDocument();
    });

    it('hides the "previous" page link if the current page is less than 2', () => {
      render(
        <Pager
          pageCount={10}
          currentPage={1}
          onLimitChange={onLimitChangeMock}
          onPageChange={onPageChangeMock}
        />
      );

      const pageLink = screen.queryByTestId('prevPageLink');

      expect(pageLink).not.toBeInTheDocument();
    });

    it('hides the "next" page link if the current page is the last page (page count)', () => {
      render(
        <Pager
          pageCount={10}
          currentPage={10}
          onLimitChange={onLimitChangeMock}
          onPageChange={onPageChangeMock}
        />
      );

      const pageLink = screen.queryByTestId('nextPageLink');

      expect(pageLink).not.toBeInTheDocument();
    });

    it('hides the right "..." page link if the current page is less than the page count - page length', () => {
      render(
        <Pager
          pageCount={10}
          pageLength={3}
          currentPage={7}
          onLimitChange={onLimitChangeMock}
          onPageChange={onPageChangeMock}
        />
      );

      const pageLink = screen.queryByTestId('ellipsisForwardPageLink');

      expect(pageLink).not.toBeInTheDocument();
    });

    it('hides the "last" page link if the current page is the next to the last page (page count - 1)', () => {
      render(
        <Pager
          pageCount={10}
          currentPage={9}
          onLimitChange={onLimitChangeMock}
          onPageChange={onPageChangeMock}
        />
      );

      const pageLink = screen.queryByTestId('pageCountLink');

      expect(pageLink).not.toBeInTheDocument();
    });

    it('hides all the paging links if the page count is 1', () => {
      render(
        <Pager
          pageCount={1}
          onLimitChange={onLimitChangeMock}
          onPageChange={onPageChangeMock}
        />
      );

      const pagination = screen.queryByTestId('pagination');

      expect(pagination).not.toBeInTheDocument();
    });
  });

  describe('Status', () => {
    it('displays Page {x} of {y} where x is the current page and y is the page count', () => {
      const pageCount = 5;
      for (let page = 1; page <= pageCount; page += 1) {
        render(
          <Pager
            pageCount={pageCount}
            currentPage={page}
            onLimitChange={onLimitChangeMock}
            onPageChange={onPageChangeMock}
          />
        );

        const pageStatus = screen.getByTestId('pageStatus');

        expect(pageStatus).toHaveTextContent(`Page ${page} of ${pageCount}`);

        cleanup();
      }
    });
  });
});
