import React from 'react';
import { useApolloClient } from 'react-apollo-hooks';
import { Helmet } from 'react-helmet';
import { Mutation } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import {
  Grid, Button, Header, Segment, Form, Message,
} from 'semantic-ui-react';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import { SEND_CONFIRMATION_EMAIL } from './mutations';
import { GET_AUTH_STATUS } from '../../queries';
import './ResetPassword.css';

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('E-Posta geçersiz!')
    .required('E-Posta gerekli!'),
});

const SendConfirmationEmailForm = (props) => {
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

  return (
    <Mutation mutation={SEND_CONFIRMATION_EMAIL}>
      {(sendConfirmationEmail, { loading }) => {
        values.sendConfirmationEmail = sendConfirmationEmail;

        const errorExists = Object.getOwnPropertyNames(errors).length > 0
        && Object.getOwnPropertyNames(touched).length > 0;
        const serverValidationErrors = status.errors ? status.errors : null;

        return (
          <div>
            <Helmet>
              <title>Şifre Sıfırlama - Biligger</title>
            </Helmet>
            <div className="reset-password-form" style={{ marginTop: '-150px', marginBottom: '500px' }}>
              <Grid textAlign="center" className="reset-password-grid" verticalAlign="bottom">
                <Grid.Column className="reset-password-column">
                  <Header as="h2" className="reset-password-header" textAlign="center">
                        Şifre Sıfırlama
                  </Header>

                  <Segment raised className="register-segment">
                    {!status.isSended
                      ? (
                        <div>
                          {
                          errorExists || !!serverValidationErrors
                          ? (
                            <Message
                              error
                              list={[
                                errors.email,
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
                            <Form.Input error={!!errors.email} type="email" placeholder="E-Posta" name="email" value={values.email} onChange={handleChange} />
                            <Button
                              disabled={isSubmitting}
                              type="submit"
                              content="Gönder"
                            />
                          </Form>
                        </div>
                      )
                      : 'Şifrenizi sıfırlamak için size bir email gönderdik!'
                    }
                  </Segment>
                </Grid.Column>
              </Grid>
            </div>
          </div>
        );
      }
    }
    </Mutation>
  );
};

const SendConfirmationEmail = withFormik({
  mapPropsToValues: () => ({
    email: '',
  }),
  mapPropsToStatus: () => ({
    isSended: false,
    errors: null,
  }),
  validationSchema: ResetPasswordSchema,
  handleSubmit: async (values, { setStatus }) => {
    const {
      sendConfirmationEmail,
      email,
    } = values;

    // Try catch block needed for testing. Without it test not passing.
    try {
      await sendConfirmationEmail({
        variables: {
          sendConfirmationEmail,
          email,
          action: 2,
        },
      });
      setStatus({ isSended: true });
    } catch (err) {
      /**
       * In normal case, if there is an error user should see a corresponded message.
       * But we are not showing error message. Instead we pretend like confirmation email did sent.
       * This way an attacker wouldn't know the email address is in database or not.
       * (at least lowering the risk)
       */
      setStatus({ isSended: true });
      // setSubmitting(false);
      return err;
    }
  },
  displayName: 'BasicForm',
})(SendConfirmationEmailForm);

export default SendConfirmationEmail;
