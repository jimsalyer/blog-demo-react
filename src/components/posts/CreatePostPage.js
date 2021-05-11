import { Formik } from 'formik';
import React, { useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { selectUser } from '../../redux/userSlice';
import { createPost } from '../../services/postService';

export default function CreatePostPage() {
  const history = useHistory();
  const initialValues = { title: '', body: '', excerpt: '', image: '' };
  const [submitError, setSubmitError] = useState('');
  const user = useSelector(selectUser);

  const validationSchema = yup.object().shape({
    title: yup.string().trim().required('Title is required.'),
    body: yup.string().required('Body is required.'),
    excerpt: yup.string().required('Excerpt is required.'),
    image: yup.string(),
  });

  async function handleFormikSubmit(values, { setFieldValue, setSubmitting }) {
    try {
      const title = values.title.trim();
      const body = values.body.trim();
      const excerpt = values.excerpt.trim();
      const image = values.image.trim();

      setSubmitError('');
      setFieldValue('title', title);
      setFieldValue('body', body);
      setFieldValue('excerpt', excerpt);
      setFieldValue('image', image);

      await createPost({
        title,
        body,
        excerpt,
        image,
        userId: user.id,
        accessToken: user.accessToken,
      });
      history.push('/');
    } catch (error) {
      if (error.response && error.response.data) {
        setSubmitError(error.response.data.message);
      } else {
        setSubmitError(error.message);
      }
    }
    setSubmitting(false);
  }

  return (
    <div data-testid="createPostPage">
      <h2>Create New Post</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={handleFormikSubmit}
        validationSchema={validationSchema}
      >
        {({
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Card className="max-width-md">
              <Card.Body>
                {submitError && (
                  <Alert variant="danger" data-testid="submitError">
                    {submitError}
                  </Alert>
                )}
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    isInvalid={touched.title && errors.title}
                    name="title"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.title && errors.title && (
                    <Form.Control.Feedback
                      type="invalid"
                      data-testid="titleError"
                    >
                      {errors.title}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <Form.Group controlId="body">
                  <Form.Label>Body</Form.Label>
                  <Form.Control
                    as="textarea"
                    isInvalid={touched.body && errors.body}
                    name="body"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.body && errors.body && (
                    <Form.Control.Feedback
                      type="invalid"
                      data-testid="bodyError"
                    >
                      {errors.body}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <Form.Group controlId="excerpt">
                  <Form.Label>Excerpt</Form.Label>
                  <Form.Control
                    isInvalid={touched.excerpt && errors.excerpt}
                    name="excerpt"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.excerpt && errors.excerpt && (
                    <Form.Control.Feedback
                      type="invalid"
                      data-testid="excerptError"
                    >
                      {errors.excerpt}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <Form.Group controlId="image">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    isInvalid={touched.image && errors.image}
                    name="image"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.image && errors.image && (
                    <Form.Control.Feedback
                      type="invalid"
                      data-testid="imageError"
                    >
                      {errors.image}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Card.Body>
              <Card.Footer>
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  data-testid="submitButton"
                >
                  {isSubmitting && (
                    <Spinner
                      animation="border"
                      size="sm"
                      className="mr-2"
                      data-testid="submitButtonSpinner"
                    />
                  )}
                  Create
                </Button>
              </Card.Footer>
            </Card>
          </Form>
        )}
      </Formik>
    </div>
  );
}
