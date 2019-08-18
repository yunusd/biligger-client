import React from 'react';
import { useApolloClient } from 'react-apollo-hooks';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import {
  Button, Header, Form, Grid, Image, Segment, Divider, Message,
} from 'semantic-ui-react';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import { GET_AUTH_STATUS } from '../../queries';
import logo from '../../logo.png';
import './LogIn.css';

const LogInSchema = Yup.object().shape({
  username: Yup.string()
    .required('Kullanıcı adı gerekli!'),
  password: Yup.string()
    .required('Şifre gerekli!'),
});

const LogInForm = (props) => {
  const client = useApolloClient();

  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  if (currentUser.isLoggedIn) return <Redirect to="/" />;

  const {
    values,
    touched,
    errors,
    handleChange,
    handleSubmit,
    status,
    isSubmitting,
  } = props;

  const { username = '', isRedirect = '' } = props;
  const user = `${isRedirect && `Hoşgeldin, ${username}`}`;

  const errorExists = Object.getOwnPropertyNames(errors).length > 0
  && Object.getOwnPropertyNames(touched).length > 0;
  const serverValidationErrors = status.errors ? status.errors : null;

  return (
    <Grid textAlign="center" className="login-grid" verticalAlign="bottom">
      <Helmet>
        <title>Giriş Yap - Biligger</title>
      </Helmet>
      <Grid.Column className="login-column">
        <Image as={Link} to="/" src={logo} size="medium" />
        <Header as="h2" className="login-header" textAlign="center">
          {user || 'Hoşgeldiniz'}
        </Header>
        <div className="boxs">
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
            <Link to="/giris/sifirla" style={{ color: '#49ba6f' }}>Şifreni mi unuttun?</Link>
            <br />
            Henüz kayıt olmadın mı?
            <br />
            <Link to="/kayit" onClick={() => { if (props.location.pathname === 'kayit') props.history.replace('/kayit'); }} style={{ color: '#49ba6f' }}>Kayıt Ol</Link>
          </Segment>
        </div>
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

    axios.post('/auth', {
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
