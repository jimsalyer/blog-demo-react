import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { userSelector } from '../../redux/userSlice';
import postService from '../../services/PostService';
import PostSearchLink from './PostSearchLink';

export default function PostUpdatePage() {
  const history = useHistory();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const user = useSelector(userSelector);

  const [initialValues, setInitialValues] = useState({
    title: '',
    body: '',
    excerpt: '',
    image: '',
    publish: false,
    createUtc: '',
    publishUtc: '',
    modifyUtc: '',
  });

  const validationSchema = yup.object().shape({
    title: yup.string().trim().required('Title is required.'),
    body: yup.string().required('Body is required.'),
    excerpt: yup.string().trim().required('Excerpt is required.'),
    image: yup
      .string()
      .trim()
      .matches(/^\S*$/, 'Image cannot contain whitespace.'),
  });

  async function handleFormikSubmit(values, { setFieldValue, setSubmitting }) {
    try {
      const title = values.title.trim();
      const { body } = values;
      const excerpt = values.excerpt.trim();
      const image = values.image.trim();

      setSubmitError('');
      setFieldValue('title', title);
      setFieldValue('body', body);
      setFieldValue('excerpt', excerpt);
      setFieldValue('image', image);

      await postService.updatePost(id, {
        title,
        body,
        excerpt,
        image,
      });
      history.push('/');
    } catch (error) {
      if (error.response?.data) {
        setSubmitError(error.response.data.message);
      } else {
        setSubmitError(error.message);
      }
    }
    setSubmitting(false);
  }

  useEffect(() => {
    async function loadPost() {
      try {
        const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
          dateStyle: 'long',
          timeStyle: 'medium',
        });

        const post = await postService.getPost(id);
        setInitialValues({
          title: post.title,
          body: post.body,
          excerpt: post.excerpt,
          image: post.image,
          publish: Boolean(post.publishUtc),
          createUtc: dateTimeFormatter.format(new Date(post.createUtc)),
          publishUtc: post.publishUtc
            ? dateTimeFormatter.format(new Date(post.publishUtc))
            : '',
          modifyUtc: dateTimeFormatter.format(new Date(post.modifyUtc)),
        });
      } catch (error) {
        if (error.response?.data) {
          setLoadingError(error.response.data?.message);
        } else {
          setLoadingError(error.message);
        }
      }
      setLoading(false);
    }
    loadPost();
  }, [id]);

  return (
    <div data-testid="postUpdatePage">
      <p>
        <PostSearchLink />
      </p>
      <h2>Update Post</h2>
      {loading && (
        <div data-testid="loadingMessage">
          <Spinner animation="border" role="status" size="sm" />{' '}
          <strong>Loading post...</strong>
        </div>
      )}
      {!loading && loadingError && (
        <Alert variant="danger" data-testid="loadingError">
          {loadingError}
        </Alert>
      )}
      {!loading && !loadingError && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormikSubmit}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            touched,
            values,
          }) => {
            return (
              <Form onSubmit={handleSubmit} data-testid="postUpdateForm">
                <Card>
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
                    <Form.Group controlId="publish">
                      <Form.Check
                        checked={values.publish}
                        label="Publish"
                        name="publish"
                        type="switch"
                        data-testid="publishField"
                        onChange={(event) =>
                          setFieldValue('publish', event.target.checked)
                        }
                      />
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
                    <Form.Group controlId="publishUtc">
                      <Form.Label>Published</Form.Label>
                      <Form.Control
                        defaultValue={values.publishUtc}
                        name="publishUtc"
                        plaintext
                        readOnly
                        data-testid="publishUtcField"
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
                      Update
                    </Button>
                  </Card.Footer>
                </Card>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
}
