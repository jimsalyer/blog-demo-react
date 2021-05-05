import React from 'react';
import { Container } from 'react-bootstrap';

export default function AppFooter() {
  return (
    <Container
      as="footer"
      fluid
      className="fixed-bottom border-top py-2 bg-light small"
      data-testid="appFooter"
    >
      Logo by{' '}
      <a href="https://www.flaticon.com/authors/flat-icons" title="Flat Icons">
        Flat Icons
      </a>
    </Container>
  );
}
