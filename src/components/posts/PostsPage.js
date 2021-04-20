import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { Alert, Card, Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { searchPosts } from '../../services/postService';
import ErrorMessage from '../common/ErrorMessage';
import Pager from '../common/Pager';

export default function PostsPage() {
  const [error, setError] = useState(null);
  const location = useLocation();
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [queryParams, setQueryParams] = useState(getQueryParams());

  function getQueryParams() {
    const returnValues = {
      limit: 10,
      page: 1,
    };

    const queryValues = queryString.parse(location.search, {
      parseBooleans: true,
      parseNumbers: true,
    });

    if (queryValues.limit > 0) {
      returnValues.limit = queryValues.limit;
    }

    if (queryValues.page > 0) {
      returnValues.page = queryValues.page;
    }

    return returnValues;
  }

  function handleLimitChange(value) {
    setQueryParams({
      limit: value,
      page: 1,
    });
  }

  function handlePageChange(value) {
    setQueryParams({
      ...queryParams,
      page: value,
    });
  }

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      try {
        const result = await searchPosts(queryParams);
        setPageCount(result.pagination.last);
        setPosts(result.data);
      } catch (loadError) {
        setError(loadError);
      }
      setLoading(false);
    }
    loadPosts();
  }, [queryParams]);

  return (
    <div data-testid="postsPage">
      <h2>Posts</h2>
      {loading && (
        <div data-testid="loadingMessage">
          <Spinner animation="border" role="status" size="sm" />{' '}
          <strong>Loading results...</strong>
        </div>
      )}
      {!loading && error && <ErrorMessage error={error} />}
      {!loading && !error && (!posts || posts.length === 0) && (
        <Alert variant="warning" data-testid="warningMessage">
          No posts were found.
        </Alert>
      )}
      {!loading && !error && posts && posts.length > 0 && (
        <>
          <Pager
            selectedLimit={queryParams.limit}
            currentPage={queryParams.page}
            pageCount={pageCount}
            onLimitChange={handleLimitChange}
            onPageChange={handlePageChange}
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
            selectedLimit={queryParams.limit}
            currentPage={queryParams.page}
            pageCount={pageCount}
            onLimitChange={handleLimitChange}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
