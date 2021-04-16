import React from 'react';
import { Container } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';
import NotFoundPage from '../not-found/NotFoundPage';
import PostsPage from '../posts/PostsPage';

export default function AppContent() {
  return (
    <Container fluid className="my-5 pt-3 pb-1">
      <Switch>
        <Route exact path="/">
          <PostsPage />
        </Route>
        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </Container>
  );
}
