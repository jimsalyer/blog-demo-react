import { Formik, useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import postService from '../../services/PostService';
import PostSearchLink from './PostSearchLink';

function PostUpdateForm({ id, updateError, updateSuccess }) {
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const {
    dirty,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    resetForm,
    touched,
    values,
  } = useFormikContext();

  useEffect(() => {
    async function loadPost() {
      try {
        const post = await postService.getPost(id);
        resetForm({
          values: {
            title: post.title,
            body: post.body,
            excerpt: post.excerpt,
            image: post.image,
            createUtc: post.createUtc,
            modifyUtc: post.modifyUtc,
          },
        });
      } catch (error) {
        if (error.response?.data) {
          setLoadError(error.response.data?.message);
        } else {
          setLoadError(error.message);
        }
      }
      setLoading(false);
    }
    loadPost();
  }, [id, resetForm, setLoadError, setLoading]);

  if (isLoading) {
    return (
      <div data-testid="loadingMessage">
        <Spinner animation="border" role="status" size="sm" />{' '}
        <strong>Loading post...</strong>
      </div>
    );
  }

  if (loadError) {
    return (
      <Alert variant="danger" data-testid="loadingError">
        {loadError}
      </Alert>
    );
  }

  return (
    <Form data-testid="postUpdateForm" onSubmit={handleSubmit}>
      <Card>
        <Card.Body>
          {updateError && (
            <Alert variant="danger" data-testid="updateError">
              {updateError}
            </Alert>
          )}
          {updateSuccess && (
            <Alert variant="success" data-testid="updateSuccess">
              {updateSuccess}
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
              <Form.Control.Feedback type="invalid" data-testid="titleError">
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
              <Form.Control.Feedback type="invalid" data-testid="bodyError">
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
              <Form.Control.Feedback type="invalid" data-testid="excerptError">
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
              <Form.Control.Feedback type="invalid" data-testid="imageError">
                {errors.image}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group controlId="createUtc">
            <Form.Label>Created</Form.Label>
            <Form.Control
              defaultValue={values.createUtc}
              name="createUtc"
              plaintext
              readOnly
              data-testid="createUtcField"
            />
          </Form.Group>
          <Form.Group controlId="modifyUtc">
            <Form.Label>Last Modified</Form.Label>
            <Form.Control
              defaultValue={values.modifyUtc}
              name="modifyUtc"
              plaintext
              readOnly
              data-testid="modifyUtcField"
            />
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
            Update
          </Button>
        </Card.Footer>
      </Card>
    </Form>
  );
}

PostUpdateForm.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  updateError: PropTypes.string.isRequired,
  updateSuccess: PropTypes.string.isRequired,
};

export default function PostUpdatePage() {
  const { id } = useParams();
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  const initialValues = {
    title: '',
    body: '',
    excerpt: '',
    image: '',
    createUtc: '',
    modifyUtc: '',
  };

  const validationSchema = yup.object().shape({
    title: yup.string().trim().required('Title is required.'),
    body: yup.string().required('Body is required.'),
    excerpt: yup.string().trim().required('Excerpt is required.'),
    image: yup
      .string()
      .trim()
      .matches(/^\S*$/, 'Image cannot contain whitespace.'),
  });

  async function handleSubmit(values, { resetForm, setFieldValue }) {
    try {
      const title = values.title.trim();
      const { body } = values;
      const excerpt = values.excerpt.trim();
      const image = values.image.trim();

      setFieldValue('title', title);
      setFieldValue('excerpt', excerpt);
      setFieldValue('image', image);

      const post = await postService.updatePost(id, {
        title,
        body,
        excerpt,
        image,
      });

      resetForm({
        values: {
          title: post.title,
          body: post.body,
          excerpt: post.excerpt,
          image: post.image,
          createUtc: post.createUtc,
          modifyUtc: post.modifyUtc,
        },
      });
      setUpdateSuccess('The post was updated successfully.');
    } catch (error) {
      if (error.response?.data) {
        setUpdateError(error.response.data.message);
      } else {
        setUpdateError(error.message);
      }
    }
  }

  return (
    <div data-testid="postUpdatePage">
      <p>
        <PostSearchLink />
      </p>
      <h2>Update Post</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <PostUpdateForm
          id={id}
          updateError={updateError}
          updateSuccess={updateSuccess}
        />
      </Formik>
    </div>
  );
}
