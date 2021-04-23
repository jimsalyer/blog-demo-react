import React, { useEffect, useState } from 'react';
import { Alert, Card, Spinner } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import {
  fromQueryString,
  toQueryString,
} from '../../helpers/queryStringHelpers';
import { searchPosts } from '../../services/postService';
import ErrorMessage from '../common/ErrorMessage';
import Pager from '../common/Pager';
import PostSearchForm from './PostSearchForm';

export default function PostsPage() {
  const defaultLimit = 10;
  const [error, setError] = useState(null);
  const history = useHistory();
  const location = useLocation();
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const [queryParams, setQueryParams] = useState(
    () => fromQueryString(location.search),
    (value) => sanitizeQueryParams(value)
  );

  function handleLimitChange(value) {
    setQueryParams({
      ...queryParams,
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

  function handleSearch({ author, text }) {
    setQueryParams({
      ...queryParams,
      author,
      text,
    });
  }

  function sanitizeQueryParams(value) {
    const safeValue = value || {};
    return {
      author: safeValue.author || undefined,
      text: safeValue.text || undefined,
      limit: safeValue.limit > 0 ? safeValue.limit : defaultLimit,
      page: safeValue.page > 0 ? safeValue.page : 1,
    };
  }

  useEffect(() => {
    async function loadPosts() {
      const currentQueryParams = fromQueryString(location.search);
      const currentQueryString = toQueryString(currentQueryParams);
      const newQueryString = toQueryString(queryParams);

      if (newQueryString !== currentQueryString) {
        history.push({ search: newQueryString });
      } else {
        setLoading(true);
        try {
          const result = await searchPosts(queryParams);
          setPageCount(result.pagination.last);
          setPosts(result.data);
        } catch (loadPostsError) {
          setError(loadPostsError);
        }
        setLoading(false);
      }
    }

    loadPosts();
  }, [history, location.search, queryParams]);

  return (
    <div data-testid="postsPage">
      <h2>Posts</h2>
      <PostSearchForm
        values={queryParams}
        onError={setError}
        onSearch={handleSearch}
      />
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
            currentLimit={queryParams.limit}
            currentPage={queryParams.page}
            pageCount={pageCount}
            onLimitChange={handleLimitChange}
            onPageChange={handlePageChange}
          />
          {posts.map((post) => (
            <Card key={post.id} className="mb-3" data-testid="post">
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>{post.excerpt}</Card.Text>
              </Card.Body>
            </Card>
          ))}
          <Pager
            currentLimit={queryParams.limit}
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
