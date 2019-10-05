import React from 'react';
import axios from 'axios';

import {
  Button, Header, Form, Popup, Grid, Divider, Message,
} from 'semantic-ui-react';
import './LogIn.css';
import { Link } from 'react-router-dom';
import { withFormik } from 'formik';
import * as Yup from 'yup';

const LogInSchema = Yup.object().shape({
  username: Yup.string().required('Kullanıcı adı gerekli!'),
  password: Yup.string().required('Şifre gerekli!'),
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
    location,
    button,
  } = props;

  const errorExists = Object.getOwnPropertyNames(errors).length > 0
  && Object.getOwnPropertyNames(touched).length > 0;
  const serverValidationErrors = status.errors ? status.errors : null;
  const urlCheck = location ? location.pathname === '/giris' : false;

  return (
    <React.Fragment>
      { urlCheck
      ? <h5>GİRİŞ YAP</h5>
      : (
        <Popup
          trigger={button}
          on="click"
          flowing
          position="bottom right"
          className="logIn"
          content={(
            <Grid columns={2} divided>
              <Grid.Row className="logInRow" stretched>
                <Grid.Column className="logInLeft">
                  <Header
                    content="Hoşgeldiniz"
                    size="huge"
                    textAlign="center"
                    className="logInLeftText"
                  />
                </Grid.Column>
                <Grid.Column className="logInRight">
                  { errorExists || !!serverValidationErrors ? (
                    <Message
                      error
                      list={[
                        serverValidationErrors && serverValidationErrors.message,
                        errors.username,
                        errors.password,
                      ]}
                    />
                  ) : null}
                  <Form onSubmit={handleSubmit}>
                    <Form.Input error={!!errors.username} placeholder="Kullanıcı adı" name="username" value={values.username} onChange={handleChange} />
                    <Form.Input error={!!errors.password} type="password" placeholder="Şifre" name="password" value={values.password} onChange={handleChange} />
                    <Button
                      type="submit"
                      content="Giriş Yap"
                      floated="right"
                      disabled={isSubmitting}
                    />
                  </Form>

                  <Divider />

                  <div>
                    Henüz hesabınız yok mu?
                    <Link to="/kayit"> Kayıt Ol</Link>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          )}
        />

      )
      }
    </React.Fragment>
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
