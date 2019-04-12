import React from 'react';
import { Link } from 'react-router-dom';
import {
  Menu, Image, Divider, Button, Dropdown,
} from 'semantic-ui-react';

import './Header.css';
import logo from '../../logo.png';

import LogIn from '../LogIn';
import Register from '../Register';

const AppHeader = () => (
  <React.Fragment>
    <Menu fixed="top">
      <Menu.Item header position="left" className="borderless">
        <Link to="/">
          <Image src={logo} width="100px" />
        </Link>
      </Menu.Item>
      {
          localStorage.getItem('access_token')
            ? (
              <Menu.Item className="header-right">
                <Link to="/yazi"><Button color="green">Yaz</Button></Link>
                &nbsp;
                &nbsp;
                &nbsp;
                <Dropdown button text="Profil">
                  <Dropdown.Menu>
                    <Dropdown.Item>Ayarlar</Dropdown.Item>
                    <Dropdown.Item onClick={() => { localStorage.clear(); window.location.replace('/'); }}>Çıkış</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Item>
            )
            : (
              <Menu.Item className="header-right">
                <LogIn button={<Button basic>Giriş Yap</Button>} />
                &nbsp;
                &nbsp;
                yada
                &nbsp;
                &nbsp;
                <Register button={<Button basic color="green">Kayıt Ol</Button>} />
              </Menu.Item>
            )
        }

    </Menu>
  </React.Fragment>
);

export default AppHeader;
