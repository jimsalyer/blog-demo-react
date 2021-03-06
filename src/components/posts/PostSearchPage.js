import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { clearPostSearch, savePostSearch } from '../../redux/postSearchSlice';
import { userSelector } from '../../redux/userSlice';
import postService from '../../services/PostService';
import {
  parseQueryString,
  stringifyQueryParams,
} from '../../services/serviceUtils';
import ErrorMessage from '../common/ErrorMessage';
import Pager from '../common/Pager';
import PostSearchForm from './PostSearchForm';

export default function PostSearchPage() {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const location = useLocation();
  const [pageCount, setPageCount] = useState(1);
  const [posts, setPosts] = useState([]);
  const user = useSelector(userSelector);

  const [queryParams, setQueryParams] = useState(
    parseQueryString(location.search)
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
      page: 1,
      text,
    });
  }

  useEffect(() => {
    async function loadPosts() {
      const currentQueryString = location.search?.substring(1);
      const queryParamString = stringifyQueryParams(queryParams);

      if (queryParamString !== currentQueryString) {
        history.push({ search: queryParamString });
      } else {
        setLoading(true);
        try {
          const result = await postService.searchPosts(queryParams);
          setPageCount(result.pageCount);
          setPosts(result.data);

          if (currentQueryString) {
            dispatch(savePostSearch(currentQueryString));
          } else {
            dispatch(clearPostSearch());
          }
        } catch (loadPostsError) {
          setError(loadPostsError);
        }
        setLoading(false);
      }
    }
    loadPosts();
  }, [history, location, queryParams]);

  return (
    <div data-testid="postSearchPage">
      <h2>Posts</h2>
      <PostSearchForm
        queryValues={queryParams}
        onError={setError}
        onSearch={handleSearch}
      />
      {user.id && (
        <div className="mb-3">
          <Button
            as={NavLink}
            to="/create"
            variant="success"
            data-testid="createPostButton"
          >
            Create New Post
          </Button>
        </div>
      )}
      {isLoading && (
        <div data-testid="loadingMessage">
          <Spinner animation="border" role="status" size="sm" />{' '}
          <strong>Loading results...</strong>
        </div>
      )}
      {!isLoading && error && <ErrorMessage error={error} />}
      {!isLoading && !error && !posts?.length && (
        <Alert variant="warning" data-testid="warningMessage">
          No posts were found.
        </Alert>
      )}
      {!isLoading && !error && posts?.length > 0 && (
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
                <Card.Title data-testid="title">{post.title}</Card.Title>
                <Card.Text data-testid="excerpt">{post.excerpt}</Card.Text>
                <Card.Text>
                  By{' '}
                  <span data-testid="author">
                    {post.user?.firstName} {post.user?.lastName}
                  </span>
                </Card.Text>
                <Button
                  as={NavLink}
                  to={`/view/${post.id}`}
                  size="sm"
                  variant="primary"
                  data-testid="viewPostButton"
                >
                  Read Post
                </Button>{' '}
                {user.id && user.id === post.userId && (
                  <Button
                    as={NavLink}
                    to={`/update/${post.id}`}
                    size="sm"
                    variant="info"
                    data-testid="updatePostButton"
                  >
                    Update Post
                  </Button>
                )}
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
