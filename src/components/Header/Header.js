import React from 'react';
import { Link } from 'react-router-dom';
import { ApolloConsumer } from 'react-apollo';
import axios from 'axios';

import {
  Menu, Image, Button, Dropdown,
} from 'semantic-ui-react';
import './Header.css';
import logo from '../../logo.png';

import LogIn from '../LogIn';
import Register from '../Register';
import { Category } from '../Category';
import GET_AUTH_STATUS from '../../queries';

const AppHeader = () => {
  const handleSubmit = (client) => {
    axios.get('https://localhost:3000/auth/logout', { withCredentials: 'include' })
      .then(() => { client.clearStore(); window.location.reload('/'); })
      .catch(error => error);
  };

  return (
    <React.Fragment>
      <Menu fixed="top" inverted>
        <Menu.Item header className="borderless">
          <Link to="/">
            <Image src={logo} width="100px" />
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Category />
        </Menu.Item>
        <ApolloConsumer>
          {(client) => {
            const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });

            return (
              currentUser.isLoggedIn
                ? (
                  <Menu.Item position="right" className="header-right">
                    <Link to="/yeni-bilig"><Button color="green">Yeni Bilig</Button></Link>
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    <Dropdown button text="Profil">
                      <Dropdown.Menu>
                        <Dropdown.Item>Ayarlar</Dropdown.Item>
                        <Dropdown.Item onClick={() => { handleSubmit(client); }}>
                          Çıkış
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Menu.Item>
                )
                : (
                  <Menu.Item position="right" className="header-right">
                    <LogIn button={<Button basic>Giriş Yap</Button>} />
                    &nbsp;
                    &nbsp;
                    yada
                    &nbsp;
                    &nbsp;
                    <Register button={<Button basic color="green">Kayıt Ol</Button>} />
                  </Menu.Item>
              ));
          }}
        </ApolloConsumer>
      </Menu>
    </React.Fragment>
  );
};

export default AppHeader;
