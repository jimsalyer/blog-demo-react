import { Formik } from 'formik';
import queryString from 'query-string';
import React from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { login, userSelector } from '../../redux/userSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const initialValues = { username: '', password: '', remember: false };
  const location = useLocation();
  const user = useSelector(userSelector);

  const validationSchema = yup.object().shape({
    username: yup.string().trim().required('Username is required.'),
    password: yup.string().trim().required('Password is required.'),
    remember: yup.bool(),
  });

  async function handleFormikSubmit(values, { setFieldValue, setSubmitting }) {
    const username = values.username.trim();
    const password = values.password.trim();
    const { remember } = values;

    setFieldValue('username', username);
    setFieldValue('password', password);

    try {
      await dispatch(login({ username, password, remember }));

      const queryValues = queryString.parse(location.search);
      if (queryValues.returnUrl) {
        history.push(queryValues.returnUrl);
      } else {
        history.push('/');
      }
    } catch {
      // Do nothing
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
          setFieldValue,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Card className="mt-2 mx-auto max-width-sm shadow-sm">
              <Card.Body>
                {user.errorMessage && (
                  <Alert variant="danger" data-testid="submitError">
                    {user.errorMessage}
                  </Alert>
                )}
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    isInvalid={touched.username && errors.username}
                    name="username"
                    value={values.username}
                    data-testid="usernameField"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.username && errors.username && (
                    <Form.Control.Feedback
                      type="invalid"
                      data-testid="usernameError"
                    >
                      {errors.username}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    autoComplete="on"
                    isInvalid={touched.password && errors.password}
                    name="password"
                    type="password"
                    value={values.password}
                    data-testid="passwordField"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.password && errors.password && (
                    <Form.Control.Feedback
                      type="invalid"
                      data-testid="passwordError"
                    >
                      {errors.password}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <Form.Check
                  checked={values.remember}
                  custom
                  label="Remember Me"
                  name="remember"
                  type="checkbox"
                  data-testid="rememberField"
                  onChange={(event) =>
                    setFieldValue('remember', event.target.checked)
                  }
                />
              </Card.Body>
              <Card.Footer>
                <Button
                  type="submit"
                  disabled={isSubmitting || user.isProcessing}
                  className="btn-block"
                  data-testid="submitButton"
                >
                  {(isSubmitting || user.isProcessing) && (
                    <Spinner
                      animation="border"
                      size="sm"
                      className="mr-2"
                      data-testid="submitButtonSpinner"
                    />
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
