import * as yup from 'yup';

export default yup.object().shape({
  username: yup
    .string()
    .trim()
    .required('Username is required.')
    .min(2, 'Username must be at least 2 characters long.'),
  password: yup
    .string()
    .trim()
    .required('Password is required.')
    .min(2, 'Password must be at least 2 characters long.')
    .matches(/^\S+$/, 'Password cannot contain whitespace.'),
  remember: yup.bool(),
});
