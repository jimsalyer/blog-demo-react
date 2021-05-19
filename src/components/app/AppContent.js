import React from 'react';
import { Container } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';
import LoginPage from '../auth/LoginPage';
import ProtectedRoute from '../common/ProtectedRoute';
import NotFoundPage from '../not-found/NotFoundPage';
import PostCreatePage from '../posts/PostCreatePage';
import PostSearchPage from '../posts/PostSearchPage';
import PostUpdatePage from '../posts/PostUpdatePage';
import PostViewPage from '../posts/PostViewPage';

export default function AppContent() {
  return (
    <Container className="my-5 pt-3 pb-1">
      <Switch>
        <Route exact path="/">
          <PostSearchPage />
        </Route>
        <ProtectedRoute path="/create">
          <PostCreatePage />
        </ProtectedRoute>
        <ProtectedRoute path="/update/:id">
          <PostUpdatePage />
        </ProtectedRoute>
        <Route path="/view/:id">
          <PostViewPage />
        </Route>
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
