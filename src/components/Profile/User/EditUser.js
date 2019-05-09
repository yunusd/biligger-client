import React, { useState } from 'react';
import { useApolloClient } from 'react-apollo-hooks';
import { Mutation } from 'react-apollo';

import {
 Segment, Grid, Card, Accordion, Form, Button, Header,
} from 'semantic-ui-react';

import { GET_ME_FROM_CACHE, GET_AUTH_STATUS } from '../../../queries';
import EDIT_USER from './mutations';
import './css/EditUser.css';
import NotFound from '../../NotFound';

const Settings = (props) => {
  const client = useApolloClient();

  const messageText = 'Değişiklik yapmadan önce şifrenizi giriniz';
  const [message, setMessage] = useState(messageText);
  const [active, setActive] = useState(0);
  const [password, setPassword] = useState(null);
  const [degree, setDegree] = useState(null);
  const [bio, setBio] = useState(null);
  const [email, setEmail] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [newPasswordCheck, setNewPasswordCheck] = useState(null);

  const username = props.location.pathname.split('/')[1].slice(1);
  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;

  const auth = {
    isOwn: getMe && getMe.username === username,
    isLoggedIn: currentUser.isLoggedIn && true,
  };

  if (!auth.isOwn) return <NotFound {...props} />;

  const handleSubmit = async (editUser) => {
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
    } catch (error) {
      return error;
    }
  };

  const handleClick = (e, titleProps) => {
    if (!password) return null;
    const { index } = titleProps;
    setActive(index);
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    if (name === 'password') {
      if (!value) {
        setPassword(null);
        return setMessage(messageText);
      }
      setMessage('Teşekkürler');
      return setPassword(value);
    }

    if (name === 'degree') return setDegree(value);
    if (name === 'bio') return setBio(value);
    if (name === 'email') return setEmail(value);
    if (name === 'newPassword') return setNewPassword(value);
    if (name === 'newPasswordCheck') return setNewPasswordCheck(value);
  };

  return (
    <Grid columns={1} centered>
      <Grid.Column largeScreen={12} computer={12} widescreen={12} tablet={12} mobile={16}>
        <Segment piled textAlign="center">
          <Header size="huge">
            { username }
            <Header.Subheader>ayarlar</Header.Subheader>
          </Header>
        </Segment>
        <Mutation mutation={EDIT_USER}>
          {(editUser, { error }) => {
            return (
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(editUser);
                }}
              >
                <Card centered>
                  <Accordion styled className="settings-accordion">
                    <Accordion.Title className="settings-accordion-title" active={active === 0} index={0}>
                      {/* { loading && 'gönderiliyor..' } */}
                      { error ? 'HATA' : message }
                    </Accordion.Title>
                    <Accordion.Content active={active === 0}>
                      <Form.Input type="password" placeholder="Şifre" name="password" onChange={onChange} />
                    </Accordion.Content>
                  </Accordion>
                </Card>
                <Card centered>
                  <Accordion styled className="settings-accordion">
                    <Accordion.Title active={active === 1} index={1} onClick={handleClick}>
                      Ünvan
                    </Accordion.Title>
                    <Accordion.Content active={active === 1}>
                      <Form.Input placeholder="Ünvan" name="degree" onChange={onChange} />
                    </Accordion.Content>

                    <Accordion.Title active={active === 2} index={2} onClick={handleClick}>
                      Hakkınızda
                    </Accordion.Title>
                    <Accordion.Content active={active === 2}>
                      <Form.Input placeholder="Hakkınızda" name="bio" onChange={onChange} />
                    </Accordion.Content>

                    <Accordion.Title active={active === 3} index={3} onClick={handleClick}>
                      E-Posta
                    </Accordion.Title>
                    <Accordion.Content active={active === 3}>
                      <Form.Input type="email" placeholder="E-Posta" name="email" onChange={onChange} />
                    </Accordion.Content>

                    <Accordion.Title active={active === 4} index={4} onClick={handleClick}>
                      Şifre
                    </Accordion.Title>
                    <Accordion.Content active={active === 4}>
                      <Form.Input type="password" placeholder="Yeni Şifre" name="newPassword" onChange={onChange} />
                      <Form.Input type="password" placeholder="Şifre(tekrar)" name="newPasswordCheck" onChange={onChange} />
                    </Accordion.Content>
                  </Accordion>
                </Card>
                <Card centered>
                  <Button
                    type="submit"
                    content="Kaydet"
                  />
                </Card>
              </Form>
            );
          }}
        </Mutation>
      </Grid.Column>
    </Grid>
  );
};

export default Settings;
