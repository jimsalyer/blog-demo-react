import PropTypes from 'prop-types';
import React from 'react';
import { Col, Dropdown, Pagination, Row } from 'react-bootstrap';

export default function Pager({
  limits,
  currentLimit,
  pageCount,
  currentPage,
  onLimitChange,
  onPageChange,
}) {
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
      <Col sm="auto">
        <Dropdown>
          <Dropdown.Toggle variant="light" data-testid="limitToggle">
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
      {pageCount > 1 && (
        <>
          <Col sm="auto" className="pt-2 pt-sm-0">
            <Pagination className="m-0" data-testid="pagination">
              {currentPage > 2 && (
                <Pagination.First
                  data-testid="firstPageLink"
                  onClick={(event) => handlePageChange(event, 1)}
                />
              )}
              {currentPage > 1 && (
                <Pagination.Prev
                  data-testid="prevPageLink"
                  onClick={(event) => handlePageChange(event, currentPage - 1)}
                />
              )}
              {currentPage < pageCount && (
                <Pagination.Next
                  data-testid="nextPageLink"
                  onClick={(event) => handlePageChange(event, currentPage + 1)}
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
    </Row>
  );
}

Pager.defaultProps = {
  limits: [5, 10, 20, 50, 100],
  currentLimit: 10,
  pageCount: 1,
  currentPage: 1,
};

Pager.propTypes = {
  limits: PropTypes.arrayOf(PropTypes.number),
  currentLimit: PropTypes.number,
  pageCount: PropTypes.number,
  currentPage: PropTypes.number,
  onLimitChange: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
