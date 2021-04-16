import React, { useEffect, useState } from 'react';
import { Alert, Card, Col, Pagination, Row, Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { searchPosts } from '../../services/postService';

export default function PostsPage() {
  const location = useLocation();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [posts, setPosts] = useState([]);

  function handlePageChange(event, pageValue) {
    event.preventDefault();
    setPage(pageValue);
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    if (queryParams.has('limit')) {
      const limitValue = parseInt(queryParams.get('limit'), 10);
      setLimit(limitValue);
    }

    if (queryParams.has('page')) {
      const pageValue = parseInt(queryParams.get('page'), 10);
      setPage(pageValue);
    }
  }, [location]);

  useEffect(() => {
    async function loadSearchResults() {
      setLoading(true);
      try {
        const result = await searchPosts({ limit, page });
        setPagination(result.pagination);
        setPosts(result.data);
      } catch (error) {
        setApiError(error);
      }
      setLoading(false);
    }

    loadSearchResults();
  }, [limit, page]);

  return (
    <div data-testid="postsPage">
      <h2>Posts</h2>
      {loading && (
        <>
          <Spinner animation="border" role="status" size="sm" />{' '}
          <strong>Loading results...</strong>
        </>
      )}
      {!loading && apiError && (
        <Alert variant="danger">An error occurred.</Alert>
      )}
      {!loading && !apiError && (
        <>
          {pagination && pagination.last > 1 && (
            <Row className="align-items-baseline">
              <Col>
                <Pagination data-testid="pagination">
                  {page > 1 && (
                    <Pagination.First
                      onClick={(event) => handlePageChange(event, 1)}
                    />
                  )}
                  {pagination.prev > 0 && (
                    <Pagination.Prev
                      onClick={(event) => handlePageChange(event, page - 1)}
                    />
                  )}
                  {pagination.next > 0 && (
                    <Pagination.Next
                      onClick={(event) => handlePageChange(event, page + 1)}
                    />
                  )}
                  {page < pagination.last && (
                    <Pagination.Last
                      onClick={(event) =>
                        handlePageChange(event, pagination.last)
                      }
                    />
                  )}
                </Pagination>
              </Col>
              <Col className="col-auto ml-auto" data-testid="paginationStatus">
                Page {page} of {pagination.last}
              </Col>
            </Row>
          )}
          {!(posts && posts.length > 0) && (
            <Alert variant="warning">No posts were found.</Alert>
          )}
          {posts &&
            posts.length > 0 &&
            posts.map((post) => (
              <Card key={post.id} className="mb-3" data-testid="post">
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text>{post.body}</Card.Text>
                </Card.Body>
              </Card>
            ))}
        </>
      )}
    </div>
  );
}
