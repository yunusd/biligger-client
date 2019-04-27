import React from 'react';
import { Link } from 'react-router-dom';
import { useApolloClient } from 'react-apollo-hooks';

import {
  Menu, Image, Button,
} from 'semantic-ui-react';
import './Header.css';
import logo from '../../logo.png';

import LogIn from './LogIn';
import { Category } from '../Category';
import { GET_AUTH_STATUS, GET_ME_FROM_CACHE } from '../../queries';

const AppHeader = (props) => {
  const client = useApolloClient();

  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;

  const profileUrl = currentUser.isLoggedIn ? `/@${getMe.username}` : '#';

  if (props.location.pathname !== '/giriş' && props.location.pathname !== '/kayıt') {
    return (
      <div id="header-menu-fix">
        <Menu fixed="top" inverted className="header-menu">
          <Menu.Item header className="borderless">
            <Image as={Link} to="/" src={logo} width="100px" />
          </Menu.Item>
          <Menu.Item>
            <Category />
          </Menu.Item>
          {currentUser.isLoggedIn ? (
            <Menu.Item position="right" className="header-right">
              <Button as={Link} to="/yeni-bilig" color="green" icon="write" />
              &nbsp;
              &nbsp;
              &nbsp;
              <Button as={Link} to={profileUrl} content={getMe.username} icon="user" />
            </Menu.Item>
            )
            : (
              <Menu.Item position="right" className="header-right">
                <LogIn button={<Button basic color="green">Giriş Yap</Button>} />
              </Menu.Item>
            )
          }
        </Menu>
      </div>
    );
  }
  return <div />;
};

export default AppHeader;
