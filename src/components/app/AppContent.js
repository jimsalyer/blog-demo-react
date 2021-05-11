import React from 'react';
import { Container } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';
import LoginPage from '../auth/LoginPage';
import ProtectedRoute from '../common/ProtectedRoute';
import NotFoundPage from '../not-found/NotFoundPage';
import CreatePostPage from '../posts/CreatePostPage';
import PostsPage from '../posts/PostsPage';

export default function AppContent() {
  return (
    <Container fluid className="my-5 pt-3 pb-1">
      <Switch>
        <Route exact path="/">
          <PostsPage />
        </Route>
        <ProtectedRoute path="/create">
          <CreatePostPage />
        </ProtectedRoute>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </Container>
  );
}
