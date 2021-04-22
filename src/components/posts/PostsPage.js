import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { Alert, Card, Spinner } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
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
  const [pageLoading, setPageLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [queryParams, setQueryParams] = useState({});

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

  useEffect(() => {
    function initQueryParams() {
      const queryParamValues = {
        limit: defaultLimit,
        page: 1,
      };

      const queryValues = queryString.parse(location.search, {
        parseBooleans: true,
        parseNumbers: true,
      });

      if (queryValues.author > 0) {
        queryParamValues.author = queryValues.author;
      }

      if (queryValues.text) {
        queryParamValues.text = queryValues.text;
      }

      if (queryValues.limit > 0) {
        queryParamValues.limit = queryValues.limit;
      }

      if (queryValues.page > 0) {
        queryParamValues.page = queryValues.page;
      }

      setQueryParams(queryParamValues);
    }

    async function loadPosts() {
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

    function updateQueryString() {
      const values = {};

      if (queryParams.author) {
        values.author = queryParams.author;
      }

      if (queryParams.text) {
        values.text = queryParams.text;
      }

      if (queryParams.limit !== defaultLimit) {
        values.limit = queryParams.limit;
      }

      if (queryParams.page !== 1) {
        values.page = queryParams.page;
      }

      history.push({
        search: queryString.stringify(values),
      });
    }

    if (pageLoading) {
      initQueryParams();
      setPageLoading(false);
    } else {
      updateQueryString();
      loadPosts();
    }
  }, [history, location.search, pageLoading, queryParams]);

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
