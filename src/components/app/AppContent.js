import React from 'react';
import { Container } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';
import HomePage from '../home/HomePage';
import NotFoundPage from '../not-found/NotFoundPage';

export default function AppContent() {
  return (
    <Container fluid className="my-5 pt-3 pb-1">
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </Container>
  );
}
