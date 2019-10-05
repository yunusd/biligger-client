import React, { useState } from 'react';
import { useApolloClient } from 'react-apollo-hooks';
import { Helmet } from 'react-helmet';
import { Mutation } from 'react-apollo';
import {
 Segment, Grid, Card, Accordion, Form, Button, Header, Message,
} from 'semantic-ui-react';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import { GET_ME_FROM_CACHE, GET_AUTH_STATUS } from '../../../queries';
import EDIT_USER from './mutations';
import './css/EditUser.css';
import NotFound from '../../NotFound';


const settingsSchema = Yup.object().shape({
  password: Yup.string()
    .required('Şifre gerekli!'),
  newPassword: Yup.string()
    .matches(
      /^(?=(.*[a-zA-Z].*){3,})(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]{8,}$/,
      'Şifre 8 karakter uzunluğunda olmalı ve en az 3 harf, 1 rakam ve 1 özel karakter içermelidir!',
    ),
  newPasswordCheck: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Şifreler eşleşmeli'),
  email: Yup.string()
    .email('Geçersiz e-posta adresi'),
  degree: Yup.string()
    .min(3, 'Ünvan çok kısa!')
    .max(30, 'Ünvan çok uzun!'),
  bio: Yup.string()
    .min(30, 'Hakkında çok kısa!')
    .max(300, 'Hakkında çok uzun!'),
});

const SettingsForm = (props) => {
  const client = useApolloClient();

  const {
    values,
    touched,
    errors,
    handleChange,
    handleSubmit,
    status,
    isSubmitting,
  } = props;

  const messageText = 'Değişiklik yapmadan önce şifrenizi giriniz';
  const [active, setActive] = useState(0);
  const [message, setMessage] = useState(messageText);
  const [password, setPassword] = useState(status.password);
  const username = props.location.pathname.split('/')[1].slice(1);

  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;

  const auth = {
    isOwn: getMe && getMe.username === username,
    isLoggedIn: currentUser.isLoggedIn && true,
  };

  if (!auth.isOwn) return <NotFound {...props} />;

  const handleClick = (e, titleProps) => {
    if (!password) return null;
    const { index } = titleProps;
    setActive(index);
  };

  return (
    <Grid columns={1} centered>
      <Helmet>
        <title>
          {username}
          &nbsp;- Biligger
        </title>
      </Helmet>
      <Grid.Column largeScreen={12} computer={12} widescreen={12} tablet={12} mobile={16}>
        <Segment piled textAlign="center">
          <Header size="huge">
            { username }
            <Header.Subheader>ayarlar</Header.Subheader>
          </Header>
        </Segment>
        <Mutation mutation={EDIT_USER}>
          {(editUser, { error }) => {
            values.editUser = editUser;
            values.username = username;
            const errorExists = Object.getOwnPropertyNames(errors).length > 0
            && Object.getOwnPropertyNames(touched).length > 0;
            const serverValidationErrors = status.errors ? status.errors : null;
            const empty = '';
            const inputStatus = (values.newPassword !== empty && values.newPasswordCheck !== empty)
            || values.email !== empty || values.degree !== empty || values.bio !== empty;

            return (
              <React.Fragment>
                {
                errorExists || !!serverValidationErrors
                ? (
                  <Message
                    error
                    list={[
                      serverValidationErrors && serverValidationErrors,
                      errors.newPassword,
                      errors.newPasswordCheck,
                      errors.email,
                      errors.degree,
                      errors.bio,
                    ]}
                  />
                )
                : null
              }
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <Card centered>
                    <Accordion styled className="settings-accordion">
                      <Accordion.Title className="settings-accordion-title" active={active === 0} index={0} onClick={handleClick}>
                        {message}
                      </Accordion.Title>
                      <Accordion.Content active={active === 0}>
                        <Form.Input
                          type="password"
                          placeholder="Şifre"
                          name="password"
                          value={values.password}
                          onChange={(e) => {
                            e.preventDefault();
                            handleChange(e);
                            if (!e.target.value) {
                              setPassword(null);
                              return setMessage(messageText);
                            }
                            setPassword(e.target.value);
                            setMessage('Teşekkürler');
                          }}
                        />
                      </Accordion.Content>
                    </Accordion>
                  </Card>
                  <Card centered>
                    <Accordion styled className="settings-accordion">
                      <Accordion.Title active={active === 1} index={1} onClick={handleClick}>
                        Ünvan
                      </Accordion.Title>
                      <Accordion.Content active={active === 1}>
                        <Form.Input error={!!errors.degree} placeholder="Ünvan" name="degree" value={values.degree} onChange={handleChange} />
                      </Accordion.Content>

                      <Accordion.Title active={active === 2} index={2} onClick={handleClick}>
                        Hakkınızda
                      </Accordion.Title>
                      <Accordion.Content active={active === 2}>
                        <Form.Input error={!!errors.bio} placeholder="Hakkınızda" name="bio" value={values.bio} onChange={handleChange} />
                      </Accordion.Content>

                      <Accordion.Title active={active === 3} index={3} onClick={handleClick}>
                        E-Posta
                      </Accordion.Title>
                      <Accordion.Content active={active === 3}>
                        <Form.Input error={!!errors.email} type="email" placeholder="E-Posta" name="email" value={values.email} onChange={handleChange} />
                      </Accordion.Content>

                      <Accordion.Title active={active === 4} index={4} onClick={handleClick}>
                        Şifre
                      </Accordion.Title>
                      <Accordion.Content active={active === 4}>
                        <Form.Input error={!!errors.newPassword} type="password" placeholder="Yeni Şifre" name="newPassword" value={values.newPassword} onChange={handleChange} />
                        <Form.Input error={!!errors.newPasswordCheck} type="password" placeholder="Şifre(tekrar)" name="newPasswordCheck" value={values.newPasswordCheck} onChange={handleChange} />
                      </Accordion.Content>
                    </Accordion>
                  </Card>
                  <Card centered>
                    <Button
                      disabled={!inputStatus || isSubmitting}
                      type="submit"
                      content="Kaydet"
                    />
                  </Card>
                </Form>
              </React.Fragment>
            );
          }}
        </Mutation>
      </Grid.Column>
    </Grid>
  );
};

const Settings = withFormik({
  mapPropsToValues: () => ({
    password: '',
    newPassword: '',
    newPasswordCheck: '',
    email: '',
    degree: '',
    bio: '',
  }),
  mapPropsToStatus: () => ({
    password: null,
  }),
  validationSchema: settingsSchema,
  handleSubmit: async (values, { setSubmitting, setStatus }) => {
    const {
      editUser,
      username,
      password,
      newPassword,
      newPasswordCheck,
      email,
      degree,
      bio,
    } = values;

    // Try catch block needed for testing. Without it test not passing.
    try {
      await editUser({
        variables: {
          password,
          newPassword,
          newPasswordCheck,
          email,
          degree,
          bio,
        },
      });
      window.location.replace(`/@${username}`);
    } catch (err) {
      setSubmitting(false);
      const errors = err.graphQLErrors[0];
      setStatus({
        errors: errors && errors.message,
      });
      return err;
    }
  },
  displayName: 'BasicForm',
})(SettingsForm);


export default Settings;
