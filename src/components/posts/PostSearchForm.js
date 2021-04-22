import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { Accordion, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { listUsers } from '../../services/userService';

export default function PostSearchForm({ queryParams, onError, onSearch }) {
  const [active, setActive] = useState(false);
  const [author, setAuthor] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const searchFormToggle = useRef();
  const [text, setText] = useState('');
  const [users, setUsers] = useState([]);

  function handleAuthorChange(event) {
    event.preventDefault();
    setAuthor(Number(event.target.value));
  }

  function handleReset(event) {
    event.preventDefault();
    setAuthor(0);
    setText('');
    searchFormToggle.current.click();
    onSearch({});
  }

  function handleSubmit(event) {
    event.preventDefault();
    searchFormToggle.current.click();
    onSearch({ author, text });
  }

  function handleTextChange(event) {
    event.preventDefault();
    setText(event.target.value);
  }

  useEffect(() => {
    async function loadUsers() {
      setLoadingUsers(true);
      try {
        const result = await listUsers();
        setUsers(result);
      } catch (error) {
        onError(error);
      }
      setLoadingUsers(false);
    }
    loadUsers();
  }, [onError]);

  useEffect(() => {
    setAuthor(queryParams.author || 0);
    setText(queryParams.text || '');
  }, [queryParams]);

  useEffect(() => {
    setActive(author > 0 || text);
  }, [author, text]);

  return (
    <Accordion>
      <Card border={active ? 'primary' : null} className="mb-3">
        <Accordion.Toggle
          as={Card.Header}
          eventKey="searchForm"
          ref={searchFormToggle}
          className={active ? 'bg-primary text-white' : null}
        >
          <h5 className="m-0">Search Posts</h5>
          {active && <span className="sr-only">Active</span>}
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="searchForm">
          <Card.Body>
            <Form onReset={handleReset} onSubmit={handleSubmit}>
              <Form.Row as={Row} xs={1} md={2} lg={3} xl={4}>
                <Form.Group as={Col} controlId="author">
                  <Form.Label>Search by Author</Form.Label>
                  <Form.Control
                    as="select"
                    custom
                    value={author}
                    onChange={handleAuthorChange}
                  >
                    <option value={0}>Select user</option>
                    {loadingUsers && (
                      <option value={-1}>Loading users...</option>
                    )}
                    {!loadingUsers && (!users || users.length === 0) && (
                      <option value={-1}>No users were found.</option>
                    )}
                    {!loadingUsers &&
                      users &&
                      users.length > 0 &&
                      users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} controlId="text">
                  <Form.Label>Full Text Search</Form.Label>
                  <Form.Control value={text} onChange={handleTextChange} />
                </Form.Group>
              </Form.Row>
              <Button type="submit">Search</Button>{' '}
              <Button type="reset" variant="secondary">
                Reset
              </Button>
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

PostSearchForm.propTypes = {
  queryParams: PropTypes.object.isRequired,
  onError: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};
