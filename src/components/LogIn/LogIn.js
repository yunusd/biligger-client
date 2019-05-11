import React, { useEffect } from 'react';
import axios from 'axios';

import {
  Button, Header, Form, Grid, Image, Segment, Divider, Message,
} from 'semantic-ui-react';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import { Link } from 'react-router-dom';

import './LogIn.css';
import logo from '../../logo.png';

const LogInSchema = Yup.object().shape({
  username: Yup.string()
    .required('Kullanıcı adı gerekli!'),
  password: Yup.string()
    .required('Şifre gerekli!'),
});

const LogInForm = (props) => {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleSubmit,
    status,
    isSubmitting,
  } = props;

  useEffect(() => {
    document.body.style.background = 'linear-gradient(to top, #527ec0 68.3%, #ffffff 50%)';
    document.body.style.position = 'absolute';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    return () => {
      document.body.style.background = null;
      document.body.style.position = null;
      document.body.style.width = null;
      document.body.style.height = null;
    };
  });

  const { username = '', isRedirect = '' } = props;
  const user = `${isRedirect && `Hoşgeldin, ${username}`}`;

  const errorExists = Object.getOwnPropertyNames(errors).length > 0
  && Object.getOwnPropertyNames(touched).length > 0;
  const serverValidationErrors = status.errors ? status.errors : null;

  return (
    <Grid textAlign="center" className="login-grid" verticalAlign="bottom">
      <Grid.Column className="login-column">
        <Image as={Link} to="/" src={logo} size="medium" />
        <Header as="h2" className="login-header" textAlign="center">
          {user || 'Hoşgeldiniz'}
        </Header>
        <Segment raised className="login-segment">
          {
            errorExists || !!serverValidationErrors
            ? (
              <Message
                error
                list={[
                  serverValidationErrors && serverValidationErrors.message,
                  errors.username,
                  errors.password,
                ]}
              />
            )
            : null
          }
          <Form onSubmit={handleSubmit}>
            <Form.Input error={!!errors.username} type="text" placeholder="Kullanıcı adı" name="username" value={values.username} onChange={handleChange} />
            <Form.Input error={!!errors.password} type="password" placeholder="Şifre" name="password" value={values.password} onChange={handleChange} />
            <Button
              disabled={isSubmitting}
              type="submit"
              content="Giriş Yap"
            />
          </Form>
          <Divider />
          Henüz kayıt olmadın mı?
          <br />
          <Link to="/kayıt" onClick={() => { if (props.location.pathname === 'kayıt') props.history.replace('/kayıt'); }} style={{ color: '#49ba6f' }}>Kayıt Ol</Link>
        </Segment>
      </Grid.Column>
    </Grid>
    );
};

const LogIn = withFormik({
  mapPropsToValues: () => ({
    username: '',
    password: '',
  }),
  mapPropsToStatus: () => ({
    errors: null,
  }),
  validationSchema: LogInSchema,
  handleSubmit: async (values, { setSubmitting, setStatus, props }) => {
    const { username, password } = values;

    axios.post('https://localhost:3000/auth', {
      username,
      password,
    }, { withCredentials: 'include' }).then((res) => {
      window.location.replace('/');
      return res;
    }).catch((error) => {
      setSubmitting(false);
      const unitTestHandleSubmit = props.handleTestSubmit;
      if (unitTestHandleSubmit) {
        props.handleTestSubmit(error); // added for unit test
      }
      setStatus({
        errors: {
          message: 'Kullanıcı adı ya da Şifre yanlış.',
        },
      });
      return error;
    });
  },
  displayName: 'BasicForm',
})(LogInForm);


export default LogIn;
