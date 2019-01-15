import React from 'react';
import { Link } from 'react-router-dom';
import {
  Menu, Image, Divider, Button,
} from 'semantic-ui-react';

import './Header.css';
import logo from '../../logo.png';

const AppHeader = () => (
  <div>
    <Menu secondary>
      <Menu.Item header position="left">
        <Link to="/">
          <Image src={logo} width="100px" />
        </Link>
      </Menu.Item>

      <Menu.Item className="header-right">
        <Button basic>Giriş Yap</Button>
      </Menu.Item>

      <Menu.Item className="header-right">yada</Menu.Item>

      <Menu.Item className="header-right">
        <Button basic color="green">Kayıt Ol</Button>
      </Menu.Item>
    </Menu>
    <Divider />
  </div>
);

export default AppHeader;
