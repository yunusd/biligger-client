import React, { useEffect } from 'react';
import { useApolloClient } from 'react-apollo-hooks';
import { Mutation } from 'react-apollo';
import { Link, Redirect } from 'react-router-dom';
import {
  Grid, Button, Header, Segment, Form, Divider, Image, Message,
} from 'semantic-ui-react';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import { REGISTER_USER } from './mutations';
import { GET_AUTH_STATUS } from '../../queries';
import LogIn from '../LogIn';
import logo from '../../logo.png';
import './Register.css';

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Kullanıcı adı çok kısa!')
    .max(20, 'Kullanıcı adı çok uzun!')
    .required('Kullanıcı adı gerekli!'),
  password: Yup.string()
    .required('Şifre gerekli!')
    .matches(
      /^(?=(.*[a-zA-Z].*){3,})(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]{8,}$/,
      'Şifre 8 karakter uzunluğunda olmalı ve en az 3 harf, 1 rakam ve 1 özel karakter içermelidir!',
    ),
  passwordCheck: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Şifreler eşleşmeli')
    .required('Şifre(tekrar) gerekli!'),
  email: Yup.string()
    .email('E-Posta adresi geçersiz!')
    .required('E-Posta gerekli!'),
  degree: Yup.string()
    .min(3, 'Ünvan çok kısa!')
    .max(30, 'Ünvan çok uzun!')
    .required('Ünvan gerekli!'),
  bio: Yup.string()
    .min(30, 'Hakkında çok kısa!')
    .max(300, 'Hakkında çok uzun!'),
  invitationCode: Yup.string()
    .min(10, 'Davetiye kodu geçersiz!')
    .max(10, 'Davetiye kodu geçersiz!')
    .required('Üye olabilmeniz için davetiye kodu gerekli!'),

});

const RegisterForm = (props) => {
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

  useEffect(() => {
    document.getElementById('root').style.background = 'linear-gradient(to top, #527ec0 68.3%, #ffffff 50%)';
    document.getElementById('root').style.position = 'absolute';
    document.getElementById('root').style.width = '100%';
    document.getElementById('root').style.height = '100%';

    return () => {
      document.getElementById('root').style.background = null;
      document.getElementById('root').style.position = null;
      document.getElementById('root').style.width = null;
      document.getElementById('root').style.height = null;
    };
  });

  return (
    <Mutation mutation={REGISTER_USER}>
      {(register, { loading }) => {
        values.register = register;

        const errorExists = Object.getOwnPropertyNames(errors).length > 0
        && Object.getOwnPropertyNames(touched).length > 0;
        const serverValidationErrors = status.errors ? status.errors : null;

        return (
          <div>
            {!status.isRegister
              ? (
                <div className="login-form">
                  <Grid textAlign="center" className="register-grid" verticalAlign="bottom">
                    <Grid.Column className="register-column">
                      <Image as={Link} to="/" src={logo} size="medium" />
                      <Header as="h2" className="register-header" textAlign="center">
                        Hoşgeldiniz
                      </Header>
                      <Segment raised className="register-segment">
                        {
                          errorExists || !!serverValidationErrors
                          ? (
                            <Message
                              error
                              list={[
                                serverValidationErrors && serverValidationErrors.username,
                                serverValidationErrors && serverValidationErrors.email,
                                serverValidationErrors && serverValidationErrors.invitationCode,
                                errors.invitationCode,
                                errors.username,
                                errors.email,
                                errors.password,
                                errors.passwordCheck,
                                errors.degree,
                                errors.bio,
                              ]}
                            />
                          )
                          : null
                        }
                        <Form
                          loading={loading}
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                          }}
                        >
                          <Form.Input error={!!errors.invitationCode || !!(serverValidationErrors && serverValidationErrors.invitationCode)} placeholder="Davetiye kodu" name="invitationCode" value={values.invitationCode} onChange={handleChange} />
                          <Form.Input error={!!errors.username || !!(serverValidationErrors && serverValidationErrors.username)} placeholder="Kullanıcı adı" name="username" value={values.username} onChange={handleChange} />
                          <Form.Input error={!!errors.email || !!(serverValidationErrors && serverValidationErrors.email)} type="email" placeholder="E-Posta adresi" name="email" value={values.email} onChange={handleChange} />
                          <Form.Input error={!!errors.password} type="password" placeholder="Şifre" name="password" value={values.password} onChange={handleChange} />
                          <Form.Input error={!!errors.passwordCheck} type="password" placeholder="Şifre(tekrar)" name="passwordCheck" value={values.passwordCheck} onChange={handleChange} />
                          <Form.Input error={!!errors.degree} placeholder="Ünvan" name="degree" value={values.degree} onChange={handleChange} />
                          <Form.TextArea error={!!errors.bio} placeholder="Hakkınızda" name="bio" value={values.bio} onChange={handleChange} />

                          <Button
                            disabled={isSubmitting}
                            type="submit"
                            content="Kayıt Ol"
                          />
                        </Form>
                        <Divider />
                        Zaten kayıtlı mısın?
                        <br />
                        <Link to="/giriş" style={{ color: '#49ba6f' }}>Giriş Yap</Link>
                      </Segment>
                    </Grid.Column>
                  </Grid>
                </div>
              )
              : <LogIn isRedirect username={status.username} />
            }
          </div>
        );
      }
    }
    </Mutation>
  );
};

const Register = withFormik({
  mapPropsToValues: () => ({
    invitationCode: '',
    username: '',
    email: '',
    password: '',
    passwordCheck: '',
    degree: '',
    bio: '',
  }),
  mapPropsToStatus: () => ({
    isRegister: false,
    errors: null,
  }),
  validationSchema: RegisterSchema,
  handleSubmit: async (values, { setSubmitting, setStatus }) => {
    const {
      register,
      invitationCode,
      username,
      password,
      passwordCheck,
      email,
      degree,
      bio,
    } = values;
    // Try catch block needed for testing. Without it test not passing.
    try {
      await register({
        variables: {
          invitationCode,
          username,
          password,
          passwordCheck,
          email,
          degree,
          bio,
        },
      });
      setStatus({ isRegister: true, username });
    } catch (err) {
      setSubmitting(false);
      const { errors, invalidArg } = err.graphQLErrors[0].extensions.exception;

      setStatus({
        errors: {
          username: errors && errors.username !== undefined && errors.username.message,
          email: errors && errors.email !== undefined && errors.email.message,
          invitationCode: invalidArg && err.graphQLErrors[0].message,
        },
      });
      return err;
    }
  },
  displayName: 'BasicForm',
})(RegisterForm);

export default Register;
