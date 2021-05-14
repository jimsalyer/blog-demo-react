import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { Accordion, Button, Card, Col, Form, Row } from 'react-bootstrap';
import userService from '../../services/UserService';

export default function PostSearchForm({ queryValues, onError, onSearch }) {
  const [loadingUsers, setLoadingUsers] = useState(true);
  const searchFormToggle = useRef();
  const [users, setUsers] = useState([]);

  const initialValues = {
    author: queryValues.author ?? '',
    text: queryValues.text ?? '',
  };

  function handleFormikReset() {
    searchFormToggle.current.click();
    initialValues.author = '';
    initialValues.text = '';
    onSearch({});
  }

  function handleFormikSubmit(values, { setSubmitting }) {
    searchFormToggle.current.click();
    onSearch(values);
    setSubmitting(false);
  }

  useEffect(() => {
    async function loadUsers() {
      setLoadingUsers(true);
      try {
        const result = await userService.listUsers();
        setUsers(result);
      } catch (error) {
        onError(error);
      }
      setLoadingUsers(false);
    }
    loadUsers();
  }, [onError]);

  return (
    <Formik
      initialValues={initialValues}
      onReset={handleFormikReset}
      onSubmit={handleFormikSubmit}
    >
      {({
        isSubmitting,
        values,
        handleBlur,
        handleChange,
        handleReset,
        handleSubmit,
      }) => {
        const active = values.author || values.text;
        return (
          <Accordion>
            <Card
              border={active ? 'primary' : null}
              className="mb-3"
              data-testid="searchFormContainer"
            >
              <Accordion.Toggle
                as={Card.Header}
                eventKey="searchForm"
                ref={searchFormToggle}
                className={active ? 'bg-primary text-white' : null}
                data-testid="searchFormToggle"
              >
                <h5 className="m-0">Search Posts</h5>
                {active && <span className="sr-only">Active</span>}
              </Accordion.Toggle>
              <Accordion.Collapse
                eventKey="searchForm"
                data-testid="searchFormCollapse"
              >
                <Card.Body>
                  <Form
                    onReset={handleReset}
                    onSubmit={handleSubmit}
                    data-testid="searchForm"
                  >
                    <Form.Row as={Row} xs={1} md={2} lg={3}>
                      <Form.Group as={Col} controlId="author">
                        <Form.Label>Search by Author</Form.Label>
                        <Form.Control
                          as="select"
                          custom
                          name="author"
                          value={values.author}
                          onChange={handleChange}
                          data-testid="authorList"
                        >
                          <option value="">Select user</option>
                          {loadingUsers && (
                            <option data-testid="authorLoadingMessage">
                              Loading users...
                            </option>
                          )}
                          {!loadingUsers && !users?.length && (
                            <option data-testid="authorNotFoundMessage">
                              No users were found.
                            </option>
                          )}
                          {!loadingUsers &&
                            users?.map((user) => (
                              <option
                                key={user.id}
                                value={user.id}
                                data-testid="authorListItem"
                              >
                                {user.firstName} {user.lastName}
                              </option>
                            ))}
                        </Form.Control>
                      </Form.Group>
                      <Form.Group as={Col} controlId="text">
                        <Form.Label>Full Text Search</Form.Label>
                        <Form.Control
                          value={values.text}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          data-testid="fullTextSearch"
                        />
                      </Form.Group>
                    </Form.Row>
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      data-testid="searchButton"
                    >
                      Search
                    </Button>{' '}
                    <Button
                      disabled={isSubmitting}
                      type="reset"
                      variant="secondary"
                      data-testid="resetButton"
                    >
                      Reset
                    </Button>
                  </Form>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        );
      }}
    </Formik>
  );
}

PostSearchForm.defaultProps = {
  queryValues: {},
};

PostSearchForm.propTypes = {
  queryValues: PropTypes.object,
  onError: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};
