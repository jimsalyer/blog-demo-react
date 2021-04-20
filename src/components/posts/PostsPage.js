import React, { useEffect, useState } from 'react';
import { Alert, Card, Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { searchPosts } from '../../services/postService';
import Pager from '../common/Pager';

export default function PostsPage() {
  const location = useLocation();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [posts, setPosts] = useState([]);

  function handleLimitChange(value) {
    if (!Number.isNaN(value)) {
      setLimit(value);
      setPage(1);
    }
  }

  function handlePageChange(value) {
    setPage(value);
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.has('limit')) {
      const value = parseInt(queryParams.get('limit'), 10);
      if (!Number.isNaN(value)) {
        setLimit(value);
        setPage(1);
      }
    } else if (queryParams.has('page')) {
      const value = parseInt(queryParams.get('page'), 10);
      if (!Number.isNaN(value)) {
        setPage(value);
      }
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
          {pagination && (
            <Pager
              selectedLimit={limit}
              currentPage={page}
              pageCount={pagination.last}
              onLimitChange={handleLimitChange}
              onPageChange={handlePageChange}
            />
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
          {pagination && (
            <Pager
              selectedLimit={limit}
              currentPage={page}
              pageCount={pagination.last || 1}
              onLimitChange={handleLimitChange}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
