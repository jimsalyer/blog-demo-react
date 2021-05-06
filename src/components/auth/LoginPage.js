import React, { useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { login } from '../../services/authService';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState(null);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  function passwordChangeHandler(event) {
    setPassword(event.target.value);
    setPasswordError('');
  }

  async function submitHandler(event) {
    event.preventDefault();
    if (!loading) {
      setServerError(null);
      setLoading(true);

      if (validate()) {
        try {
          const user = await login(username, password);
          console.log(user);
        } catch (loginError) {
          if (loginError.response && loginError.response.data) {
            setServerError(loginError.response.data);
          } else {
            setServerError(loginError);
          }
        }
      }

      setLoading(false);
    }
  }

  function usernameChangeHandler(event) {
    setUsername(event.target.value);
    setUsernameError('');
  }

  function validate() {
    let result = true;

    if (!username) {
      setUsernameError('Username is required.');
      result = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      result = false;
    }

    return result;
  }

  return (
    <div data-testid="loginPage">
      <Form className="pt-2" onSubmit={submitHandler}>
        <Row className="justify-content-center">
          <Col md={6} lg={4} xl={3}>
            <Card className="shadow-sm">
              <Card.Body>
                {serverError && (
                  <Alert variant="danger">{serverError.message}</Alert>
                )}
                <Form.Group controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    disabled={loading}
                    className={usernameError ? 'is-invalid' : ''}
                    onChange={usernameChangeHandler}
                  />
                  {usernameError && (
                    <Form.Text className="text-danger">
                      {usernameError}
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    disabled={loading}
                    className={passwordError ? 'is-invalid' : ''}
                    onChange={passwordChangeHandler}
                  />
                  {passwordError && (
                    <Form.Text className="text-danger">
                      {passwordError}
                    </Form.Text>
                  )}
                </Form.Group>
              </Card.Body>
              <Card.Footer>
                <Button type="submit" disabled={loading} className="btn-block">
                  {loading && (
                    <Spinner animation="border" size="sm" className="mr-2" />
                  )}
                  Log In
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
