import React from 'react';
import { Container } from 'react-bootstrap';

export default function AppFooter() {
  return (
    <Container
      as="footer"
      fluid
      className="fixed-bottom shadow py-2 bg-light"
      data-testid="appFooter"
    >
      Logo by{' '}
      <a href="https://www.flaticon.com/authors/flat-icons" title="Flat Icons">
        Flat Icons
      </a>
      . Data from{' '}
      <a
        href="https://jsonplaceholder.typicode.com"
        target="_blank"
        rel="noreferrer"
      >
        JSONPlaceholder
      </a>
      .
    </Container>
  );
}
