import React from 'react';
import { Link } from 'react-router-dom';
import { useApolloClient } from 'react-apollo-hooks';
import {
  Menu, Image, Button, Input,
} from 'semantic-ui-react';

import LogIn from './LogIn';
import Notification from './Notification';
import { Category } from '../Category';
import { GET_AUTH_STATUS, GET_ME_FROM_CACHE } from '../../queries';

import logo from '../../logo.png';
import './Header.css';

const AppHeader = (props) => {
  const client = useApolloClient();

  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;

  const profileUrl = currentUser.isLoggedIn ? `/@${getMe.username}` : '#';

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      return props.history.replace(`/ara?bilig=${e.target.value}`);
    }
  };

  if (props.location.pathname !== '/giriş' && props.location.pathname !== '/kayıt') {
    return (
      <Menu stackable fixed="top" className="borderless header-menu">
        <Menu.Item header>
          <Image as={Link} to="/" src={logo} width="100px" />
        </Menu.Item>
        <Category />
        {currentUser.isLoggedIn ? (
          <Menu.Menu position="right">
            <Menu.Item>
              <Input icon={{ name: 'search', link: true }} placeholder="Ara..." transparent onKeyPress={handleKeyPress} />
            </Menu.Item>
            <Notification />
            <Menu.Item>
              <Button as={Link} to="/yeni-bilig" color="green" icon="write" />
            </Menu.Item>
            <Menu.Item>
              <Button as={Link} to={profileUrl} content={getMe.username} icon="user" />
            </Menu.Item>
          </Menu.Menu>
          )
          : (
            <Menu.Item position="right" className="header-right">
              <LogIn button={<Button basic color="green">Giriş Yap</Button>} />
            </Menu.Item>
          )
        }
      </Menu>
    );
  }
  return <div />;
};

export default AppHeader;
