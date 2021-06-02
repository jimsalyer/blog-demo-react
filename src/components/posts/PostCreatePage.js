import { Formik } from 'formik';
import React, { useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import * as yup from 'yup';
import { userSelector } from '../../redux/userSlice';
import postService from '../../services/PostService';
import PostSearchLink from './PostSearchLink';

export default function PostCreatePage() {
  const { addToast } = useToasts();
  const history = useHistory();
  const initialValues = { title: '', body: '', excerpt: '', image: '' };
  const [createError, setCreateError] = useState('');
  const user = useSelector(userSelector);

  const validationSchema = yup.object().shape({
    title: yup.string().trim().required('Title is required.'),
    body: yup.string().required('Body is required.'),
    excerpt: yup.string().trim().required('Excerpt is required.'),
    image: yup
      .string()
      .trim()
      .matches(/^\S*$/, 'Image cannot contain whitespace.'),
  });

  async function handleFormikSubmit(values, { setFieldValue }) {
    try {
      const title = values.title.trim();
      const { body } = values;
      const excerpt = values.excerpt.trim();
      const image = values.image.trim();

      setCreateError('');
      setFieldValue('title', title);
      setFieldValue('body', body);
      setFieldValue('excerpt', excerpt);
      setFieldValue('image', image);

      await postService.createPost({
        title,
        body,
        excerpt,
        image,
        userId: user.id,
      });

      addToast(`"${title}" was created successfully.`, {
        appearance: 'success',
      });
      history.push('/');
    } catch (error) {
      if (error.response?.data) {
        setCreateError(error.response.data.message);
      } else {
        setCreateError(error.message);
      }
    }
  }

  return (
    <div data-testid="postCreatePage">
      <p>
        <PostSearchLink />
      </p>
      <h2>Create New Post</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormikSubmit}
      >
        {({
          dirty,
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Card>
              <Card.Body>
                {createError && (
                  <Alert variant="danger" data-testid="createError">
                    {createError}
                  </Alert>
                )}
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    isInvalid={touched.title && errors.title}
                    name="title"
                    value={values.title}
                    data-testid="titleField"
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
                    value={values.body}
                    data-testid="bodyField"
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
                    value={values.excerpt}
                    data-testid="excerptField"
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
                    value={values.image}
                    data-testid="imageField"
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
                  disabled={!dirty || isSubmitting}
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
