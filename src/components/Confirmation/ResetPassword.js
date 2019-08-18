import React from 'react';
import { useApolloClient, useQuery } from 'react-apollo-hooks';
import { Helmet } from 'react-helmet';
import { Mutation } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import {
  Grid, Button, Header, Segment, Form, Message,
} from 'semantic-ui-react';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import { RESET_USER_PASSWORD } from './mutations';
import { VERIFY_HASH } from './queries';
import { GET_AUTH_STATUS } from '../../queries';
import NotFound from '../NotFound';
import './ResetPassword.css';

const ResetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required('Şifre gerekli!')
    .matches(
      /^(?=(.*[a-zA-Z].*){3,})(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]{8,}$/,
      'Şifre 8 karakter uzunluğunda olmalı ve en az 3 harf, 1 rakam ve 1 özel karakter içermelidir!',
    ),
  newPasswordCheck: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Şifreler eşleşmeli')
    .required('Şifre(tekrar) gerekli!'),
});

const ResetPasswordForm = (props) => {
  const client = useApolloClient();

  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });

  const hash = props.location.pathname.slice(-40);
  const { data, loading, error } = useQuery(VERIFY_HASH, {
    variables: {
      hash,
      action: 2,
    },
  });

  if (currentUser.isLoggedIn) return <Redirect to="/" />;

  if (loading) return null;
  if (error) return 'Hata';
  if (!data.verifyHash.hash || data.verifyHash.expired) return <NotFound {...props} />;

  const {
    values,
    touched,
    errors,
    handleChange,
    handleSubmit,
    status,
    isSubmitting,
  } = props;

  return (
    <Mutation mutation={RESET_USER_PASSWORD}>
      {(resetPassword, { loading }) => {
        values.resetPassword = resetPassword;
        values.hash = hash;

        const errorExists = Object.getOwnPropertyNames(errors).length > 0
        && Object.getOwnPropertyNames(touched).length > 0;
        const serverValidationErrors = status.errors ? status.errors : null;
        if (status.isChanged) return window.location.replace('/');
        return (
          <React.Fragment>
            <Helmet>
              <title>Şifre Değişikliği - Biligger</title>
            </Helmet>
            <div className="reset-password-form" style={{ marginTop: '-150px', marginBottom: '500px' }}>
              <Grid textAlign="center" className="reset-password-grid" verticalAlign="bottom">
                <Grid.Column className="reset-password-column">
                  <Header as="h2" className="reset-password-header" textAlign="center">
                    Şifre Değişikliği
                  </Header>
                  <Segment raised className="reset-password-segment">
                    {
                      errorExists || !!serverValidationErrors
                      ? (
                        <Message
                          error
                          list={[
                            errors.newPassword,
                            errors.newPasswordCheck,
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
                      <Form.Input error={!!errors.newPassword} type="password" placeholder="Şifre" name="newPassword" value={values.newPassword} onChange={handleChange} />
                      <Form.Input error={!!errors.newPasswordCheck} type="password" placeholder="Şifre(tekrar)" name="newPasswordCheck" value={values.newPasswordCheck} onChange={handleChange} />
                      {
                        errors.newPassword
                        ? <Message content="min 8 karakter, 3 harf, 2 rakam ve 1 özel karakter" />
                        : null
                      }
                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        content="Değiştir"
                      />
                    </Form>
                  </Segment>
                </Grid.Column>
              </Grid>
            </div>
          </React.Fragment>
        );
      }
    }
    </Mutation>
  );
};

const ResetPassword = withFormik({
  mapPropsToValues: () => ({
    newPassword: '',
    newPasswordCheck: '',
  }),
  mapPropsToStatus: () => ({
    isChanged: false,
    errors: null,
  }),
  validationSchema: ResetPasswordSchema,
  handleSubmit: async (values, { setSubmitting, setStatus }) => {
    const {
      resetPassword,
      newPassword,
      newPasswordCheck,
      hash,
    } = values;

    // Try catch block needed for testing. Without it test not passing.
    try {
      await resetPassword({
        variables: {
          resetPassword,
          newPassword,
          newPasswordCheck,
          hash,
        },
      });
      setStatus({ isChanged: true });
    } catch (err) {
      setSubmitting(false);
      return err;
    }
  },
  displayName: 'BasicForm',
})(ResetPasswordForm);

export default ResetPassword;
