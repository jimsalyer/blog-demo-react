import React, { useEffect, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import postService from '../../services/PostService';
import PostSearchLink from './PostSearchLink';

export default function PostViewPage() {
  const { id } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function loadPost() {
      try {
        setPost(await postService.getPost(id));
      } catch (error) {
        if (error.response?.data) {
          setLoadError(error.response.data?.message);
        } else {
          setLoadError(error.message);
        }
      }
      setLoading(false);
    }
    loadPost();
  }, [id]);

  return (
    <div data-testid="postViewPage">
      <p>
        <PostSearchLink />
      </p>
      {isLoading && (
        <div data-testid="loadingMessage">
          <Spinner animation="border" role="status" size="sm" />{' '}
          <strong>Loading post...</strong>
        </div>
      )}
      {!isLoading && loadError && (
        <Alert variant="danger" data-testid="loadError">
          {loadError}
        </Alert>
      )}
      {!isLoading && !loadError && (
        <>
          <h2>
            <span data-testid="title">{post.title}</span>
            <br />
            {post.user && (
              <small className="text-muted">
                By{' '}
                <span data-testid="author">
                  {post.user.firstName} {post.user.lastName}
                </span>
              </small>
            )}
          </h2>
          {post.image && (
            <img
              src={post.image}
              alt="Post Banner"
              className="img-fluid my-3"
              data-testid="image"
            />
          )}
          {post.body?.split('\n').map((paragraph) => (
            <p key={uuidv4()} data-testid="bodyParagraph">
              {paragraph}
            </p>
          ))}
          <table>
            <tbody>
              <tr>
                <th className="pr-2">Created</th>
                <td data-testid="createUtc">{post.createUtc}</td>
              </tr>
              {post.modifyUtc !== post.createUtc && (
                <tr>
                  <th className="pr-2">Modified</th>
                  <td data-testid="modifyUtc">{post.modifyUtc}</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
