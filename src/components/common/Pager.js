import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Dropdown, Pagination, Row } from 'react-bootstrap';

export default function Pager({
  limits,
  currentLimit,
  pageCount,
  pageLength,
  currentPage,
  onLimitChange,
  onPageChange,
}) {
  const pageBuffer = Math.floor(pageLength / 2);
  const pageEnd =
    currentPage + pageBuffer < pageCount
      ? Math.max(currentPage + pageBuffer, Math.min(pageCount, pageLength))
      : pageCount;
  const pageStart = pageEnd > pageLength ? pageEnd - pageLength + 1 : 1;
  const pageNumbers = _.range(pageStart, pageEnd + 1);

  function handleLimitChange(event, limit) {
    event.preventDefault();
    onLimitChange(limit);
  }

  function handlePageChange(event, page) {
    event.preventDefault();
    onPageChange(page);
  }

  return (
    <Row className="align-items-baseline mb-3" data-testid="pager">
      {pageCount > 1 && (
        <>
          <Col sm="auto">
            <Pagination className="m-0" data-testid="pagination">
              {currentPage > 2 && (
                <Pagination.First
                  data-testid="firstPageLink"
                  onClick={(event) => handlePageChange(event, 1)}
                />
              )}
              {currentPage > pageLength && (
                <Pagination.Ellipsis
                  className="d-none d-md-list-item"
                  data-testid="ellipsisBackPageLink"
                  onClick={(event) => handlePageChange(event, pageStart - 1)}
                />
              )}
              {currentPage > 1 && (
                <Pagination.Prev
                  data-testid="prevPageLink"
                  onClick={(event) => handlePageChange(event, currentPage - 1)}
                />
              )}
              {pageNumbers.map((pageNumber) => (
                <Pagination.Item
                  key={pageNumber}
                  active={pageNumber === currentPage}
                  className={
                    pageNumber === currentPage ? null : 'd-none d-md-list-item'
                  }
                  data-testid="pageNumberLink"
                  onClick={(event) => handlePageChange(event, pageNumber)}
                >
                  {pageNumber}
                </Pagination.Item>
              ))}
              {currentPage < pageCount && (
                <Pagination.Next
                  data-testid="nextPageLink"
                  onClick={(event) => handlePageChange(event, currentPage + 1)}
                />
              )}
              {currentPage < pageCount - pageLength && (
                <Pagination.Ellipsis
                  className="d-none d-md-list-item"
                  data-testid="ellipsisForwardPageLink"
                  onClick={(event) => handlePageChange(event, pageEnd + 1)}
                />
              )}
              {currentPage < pageCount - 1 && (
                <Pagination.Last
                  data-testid="lastPageLink"
                  onClick={(event) => handlePageChange(event, pageCount)}
                />
              )}
            </Pagination>
          </Col>
          <Col sm="auto" className="pt-2 pt-sm-0" data-testid="pageStatus">
            Page {currentPage} of {pageCount}
          </Col>
        </>
      )}
      <Col />
      <Col sm="auto" className={pageCount > 1 ? 'pt-2 pt-sm-0' : ''}>
        <Dropdown>
          <Dropdown.Toggle
            variant="outline-secondary"
            data-testid="limitToggle"
          >
            {currentLimit} Per Page
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {limits.map((limit) => (
              <Dropdown.Item
                active={limit === currentLimit}
                key={limit}
                data-testid="limitItem"
                onClick={(event) => handleLimitChange(event, limit)}
              >
                {limit}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  );
}

Pager.defaultProps = {
  limits: [5, 10, 20, 50, 100],
  currentLimit: 10,
  pageCount: 1,
  pageLength: 5,
  currentPage: 1,
};

Pager.propTypes = {
  limits: PropTypes.arrayOf(PropTypes.number),
  currentLimit: PropTypes.number,
  pageCount: PropTypes.number,
  pageLength: PropTypes.number,
  currentPage: PropTypes.number,
  onLimitChange: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
