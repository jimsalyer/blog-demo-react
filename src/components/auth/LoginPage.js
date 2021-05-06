import { Formik } from 'formik';
import React, { useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import * as yup from 'yup';
import { login } from '../../services/authService';

export default function LoginPage() {
  const initialValues = { username: '', password: '' };
  const [serverError, setServerError] = useState('');

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .required('Username is required.')
      .min(2, 'Username must be at least 2 characters long.')
      .matches(/\S{1,}/, 'Username is invalid.'),
    password: yup
      .string()
      .trim()
      .required('Password is required.')
      .min(2, 'Password must be at least 2 characters long.')
      .matches(/^\S+$/, 'Password cannot contain whitespace.'),
  });

  async function handleFormikSubmit(values, { setFieldValue, setSubmitting }) {
    try {
      setServerError('');

      const username = values.username.trim();
      setFieldValue('username', username);

      const password = values.password.trim();
      setFieldValue('password', password);

      const user = await login(username, password);
      console.log(user);
    } catch (error) {
      if (error.response && error.response.data) {
        setServerError(error.response.data.message);
      } else {
        setServerError(error.message);
      }
    }
    setSubmitting(false);
  }

  return (
    <div data-testid="loginPage">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormikSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Card
              className="mt-2 mx-auto shadow-sm"
              style={{ maxWidth: '32em' }}
            >
              <Card.Body>
                {serverError && <Alert variant="danger">{serverError}</Alert>}
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    name="username"
                    value={values.username}
                    className={
                      touched.username && errors.username ? 'is-invalid' : null
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.username && errors.username && (
                    <Form.Text className="invalid-feedback">
                      {errors.username}
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    value={values.password}
                    className={
                      touched.password && errors.password ? 'is-invalid' : null
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.password && errors.password && (
                    <Form.Text className="invalid-feedback">
                      {errors.password}
                    </Form.Text>
                  )}
                </Form.Group>
              </Card.Body>
              <Card.Footer>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-block"
                >
                  {isSubmitting && (
                    <Spinner animation="border" size="sm" className="mr-2" />
                  )}
                  Log In
                </Button>
              </Card.Footer>
            </Card>
          </Form>
        )}
      </Formik>
    </div>
  );
}
