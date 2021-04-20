import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { Alert, Card, Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { searchPosts } from '../../services/postService';
import ErrorMessage from '../common/ErrorMessage';
import Pager from '../common/Pager';

export default function PostsPage() {
  const location = useLocation();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  function handleLimitChange(value) {
    setLimit(value);
    setPage(1);
  }

  useEffect(() => {
    const queryParams = queryString.parse(location.search, {
      parseNumbers: true,
    });

    if (queryParams.limit > 0) {
      setLimit(queryParams.limit);
      setPage(1);
    } else if (queryParams.page > 0) {
      setPage(queryParams.page);
    }
  }, [location]);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      try {
        const result = await searchPosts({ limit, page });
        setPageCount(result.pagination.last);
        setPosts(result.data);
      } catch (error) {
        setApiError(error);
      }
      setLoading(false);
    }
    loadPosts();
  }, [limit, page]);

  return (
    <div data-testid="postsPage">
      <h2>Posts</h2>
      {loading && (
        <div data-testid="loadingMessage">
          <Spinner animation="border" role="status" size="sm" />{' '}
          <strong>Loading results...</strong>
        </div>
      )}
      {!loading && apiError && <ErrorMessage error={apiError} />}
      {!loading && !apiError && (!posts || posts.length === 0) && (
        <Alert variant="warning" data-testid="warningMessage">
          No posts were found.
        </Alert>
      )}
      {!loading && !apiError && posts && posts.length > 0 && (
        <>
          <Pager
            selectedLimit={limit}
            currentPage={page}
            pageCount={pageCount}
            onLimitChange={handleLimitChange}
            onPageChange={setPage}
          />
          {posts.map((post) => (
            <Card key={post.id} className="mb-3" data-testid="post">
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>{post.body}</Card.Text>
              </Card.Body>
            </Card>
          ))}
          <Pager
            selectedLimit={limit}
            currentPage={page}
            pageCount={pageCount}
            onLimitChange={handleLimitChange}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
