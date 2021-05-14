import React from 'react';
import { Container } from 'react-bootstrap';

export default function AppFooter() {
  return (
    <footer className="fixed-bottom border-top py-2 bg-light small">
      <Container as="footer" data-testid="appFooter">
        Logo by{' '}
        <a
          href="https://www.flaticon.com/authors/flat-icons"
          title="Flat Icons"
        >
          Flat Icons
        </a>
      </Container>
    </footer>
  );
}
