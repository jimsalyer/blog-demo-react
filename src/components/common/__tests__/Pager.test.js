import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Pager from '../Pager';

describe('<Pager />', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Limiting', () => {
    it('displays a dropdown with the choices that correspond to the paging limits set on the component', () => {
      render(<Pager limits={[1, 2, 3]} currentLimit={1} pageCount={3} />);

      const limitToggle = screen.getByTestId('limitToggle');

      fireEvent.click(limitToggle);

      const limitItems = screen.getAllByTestId('limitItem');

      expect(limitItems).toHaveLength(3);
    });

    it('displays the text of "{x} Per Page" on the limit dropdown toggler where x is the selected limit', () => {
      render(<Pager limits={[1, 2, 3]} currentLimit={2} pageCount={3} />);

      const limitToggle = screen.getByTestId('limitToggle');

      expect(limitToggle).toHaveTextContent('2 Per Page');
    });

    it('triggers the onLimitChange handler with a value of 3 when clicking the corresponding limit item', () => {
      const onLimitChangeMock = jest.fn();

      render(
        <Pager
          limits={[1, 2, 3]}
          currentLimit={1}
          pageCount={3}
          onLimitChange={onLimitChangeMock}
        />
      );

      const limitToggle = screen.getByTestId('limitToggle');

      fireEvent.click(limitToggle);

      const limitItems = screen.getAllByTestId('limitItem');

      fireEvent.click(limitItems[1]);

      expect(onLimitChangeMock).toHaveBeenCalledWith(2);
    });
  });

  describe('Paging', () => {
    it('triggers the onPageChange handler with a value of 1 when clicking the "first" page link', () => {
      const onPageChangeMock = jest.fn();

      render(
        <Pager pageCount={10} currentPage={3} onPageChange={onPageChangeMock} />
      );

      const pageLink = screen.getByTestId('firstPageLink');

      fireEvent.click(pageLink);

      expect(onPageChangeMock).toHaveBeenCalledWith(1);
    });

    it('triggers the onPageChange handler with a value of 2 when clicking the "previous" page link when the current page is 3', () => {
      const onPageChangeMock = jest.fn();

      render(
        <Pager pageCount={10} currentPage={3} onPageChange={onPageChangeMock} />
      );

      const pageLink = screen.getByTestId('prevPageLink');

      fireEvent.click(pageLink);

      expect(onPageChangeMock).toHaveBeenCalledWith(2);
    });

    it('triggers the onPageChange handler with a value of 3 when clicking the "next" page link when the current page is 2', () => {
      const onPageChangeMock = jest.fn();

      render(
        <Pager pageCount={10} currentPage={2} onPageChange={onPageChangeMock} />
      );

      const pageLink = screen.getByTestId('nextPageLink');

      fireEvent.click(pageLink);

      expect(onPageChangeMock).toHaveBeenCalledWith(3);
    });

    it('triggers the onPageChange handler with a value of 10 when clicking the "last" page link', () => {
      const onPageChangeMock = jest.fn();

      render(
        <Pager pageCount={10} currentPage={2} onPageChange={onPageChangeMock} />
      );

      const pageLink = screen.getByTestId('lastPageLink');

      fireEvent.click(pageLink);

      expect(onPageChangeMock).toHaveBeenCalledWith(10);
    });

    it('hides the "first" page link if the current page is less than 3', () => {
      render(<Pager pageCount={10} currentPage={2} />);

      const pageLink = screen.queryByTestId('firstPageLink');

      expect(pageLink).not.toBeInTheDocument();
    });

    it('hides the "previous" page link if the current page is less than 2', () => {
      render(<Pager pageCount={10} currentPage={1} />);

      const pageLink = screen.queryByTestId('prevPageLink');

      expect(pageLink).not.toBeInTheDocument();
    });

    it('hides the "next" page link if the current page is the last page (page count)', () => {
      render(<Pager pageCount={10} currentPage={10} />);

      const pageLink = screen.queryByTestId('nextPageLink');

      expect(pageLink).not.toBeInTheDocument();
    });

    it('hides the "last" page link if the current page is the next to the last page (page count - 1)', () => {
      render(<Pager pageCount={10} currentPage={9} />);

      const pageLink = screen.queryByTestId('pageCountLink');

      expect(pageLink).not.toBeInTheDocument();
    });

    it('hides all the paging links if the page count is 1', () => {
      render(<Pager pageCount={1} />);

      const pagination = screen.queryByTestId('pagination');

      expect(pagination).not.toBeInTheDocument();
    });
  });

  describe('Status', () => {
    it('displays Page {x} of {y} where x is the current page and y is the page count', () => {
      const pageCount = 5;
      for (let page = 1; page <= 5; page += 1) {
        render(<Pager pageCount={pageCount} currentPage={page} />);

        const pageStatus = screen.getByTestId('pageStatus');

        expect(pageStatus).toHaveTextContent(`Page ${page} of ${pageCount}`);

        cleanup();
      }
    });
  });
});
