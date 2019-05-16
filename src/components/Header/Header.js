import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useApolloClient } from 'react-apollo-hooks';
import {
  Menu, Image, Button, Input,
  Responsive,
  Container,
  Icon,
  Sidebar,
  Visibility,
} from 'semantic-ui-react';

import LogIn from './LogIn';
import Notification from './Notification';
import { Category } from '../Category';
import { GET_AUTH_STATUS, GET_ME_FROM_CACHE } from '../../queries';

import logo from '../../logo.png';
import './Header.css';

const getWidth = () => {
  const isSSR = typeof window === 'undefined';

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
};

const DesktopHeader = ({
    children,
    getMe,
    currentUser,
    handleKeyPress,
    profileUrl,
  }) => (
    <Responsive getWidth={getWidth} minWidth={Responsive.onlyComputer.minWidth}>
      <Visibility once={false}>
        <Menu
          fixed="top"
          stackable
          className="borderless header-menu"
        >
          <Container fluid>
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
          </Container>
        </Menu>
      </Visibility>

      {children}
    </Responsive>
  );

const TabletHeader = ({
    children,
    getMe,
    currentUser,
    handleKeyPress,
    profileUrl,
}) => {
  const [sidebarOpened, setSidebarOpened] = useState();

  const handleSidebarHide = () => setSidebarOpened(false);
  const handleToggle = () => setSidebarOpened(true);
  return (
    <Responsive
      as={Sidebar.Pushable}
      getWidth={getWidth}
      minWidth={Responsive.onlyMobile.maxWidth}
      maxWidth={Responsive.onlyComputer.minWidth}
    >
      <Sidebar
        as={Menu}
        animation="push"
        onHide={handleSidebarHide}
        vertical
        visible={sidebarOpened}
      >
        <Menu.Item header>
          <Image as={Link} to="/" src={logo} width="100px" />
        </Menu.Item>
        <Category />
        <Menu.Item>
          <Input icon={{ name: 'search', link: true }} placeholder="Ara..." transparent onKeyPress={handleKeyPress} />
        </Menu.Item>
      </Sidebar>
      {/* <Menu stackable fixed="top" className="borderless header-menu">

      </Menu> */}
      <Sidebar.Pusher dimmed={sidebarOpened}>
        <Container fluid>
          <Menu fixed="top" className="borderless header-menu">
            <Menu.Item onClick={handleToggle}>
              <Icon name="sidebar" size="small" />
            </Menu.Item>
            <Menu.Item header>
              <Image as={Link} to="/" src={logo} width="100px" />
            </Menu.Item>
            {currentUser.isLoggedIn ? (
              <Menu.Menu position="right">
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
        </Container>
        {children}
      </Sidebar.Pusher>
    </Responsive>
  );
};

const MobileHeader = ({
  children,
  getMe,
  currentUser,
  handleKeyPress,
  profileUrl,
}) => {
const [sidebarOpened, setSidebarOpened] = useState();

const handleSidebarHide = () => setSidebarOpened(false);
const handleToggle = () => setSidebarOpened(true);
return (
  <Responsive
    as={Sidebar.Pushable}
    getWidth={getWidth}
    maxWidth={Responsive.onlyMobile.maxWidth}
  >
    <Sidebar
      as={Menu}
      animation="push"
      onHide={handleSidebarHide}
      vertical
      visible={sidebarOpened}
    >
      <Menu.Item header>
        {currentUser.isLoggedIn && (
          <Menu.Menu position="right">
            <Menu.Item>
              <Button as={Link} to={profileUrl} content={getMe.username} icon="user" fluid />
            </Menu.Item>
            <Menu.Item>
              <Button as={Link} to="/yeni-bilig" color="green" icon="write" fluid />
            </Menu.Item>
          </Menu.Menu>
          )
        }
      </Menu.Item>
      <Category />
      <Menu.Item>
        <Input icon={{ name: 'search', link: true }} placeholder="Ara..." transparent onKeyPress={handleKeyPress} />
      </Menu.Item>
    </Sidebar>
    {/* <Menu stackable fixed="top" className="borderless header-menu">

    </Menu> */}
    <Sidebar.Pusher dimmed={sidebarOpened}>
      <Container fluid>
        <Menu fixed="top" className="borderless header-menu">
          <Menu.Item onClick={handleToggle}>
            <Icon name="sidebar" size="small" />
          </Menu.Item>
          <Menu.Item header>
            <Image as={Link} to="/" src={logo} width="100px" />
          </Menu.Item>
          {currentUser.isLoggedIn ? (
            <Menu.Menu position="right">
              <Notification />
            </Menu.Menu>
          ) : (
            <Menu.Item position="right" className="header-right">
              <LogIn button={<Button basic color="green">Giriş Yap</Button>} />
            </Menu.Item>
          )}
        </Menu>
      </Container>
      {children}
    </Sidebar.Pusher>
  </Responsive>
);
};

const AppHeader = ({ history, location, children }) => {
  const client = useApolloClient();

  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;

  const profileUrl = currentUser.isLoggedIn ? `/@${getMe.username}` : '#';

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const { value } = e.target;
      e.target.value = '';
      return history.replace(`/ara?bilig=${value}`);
    }
  };

  if (location.pathname !== '/giris' && location.pathname !== '/kayit') {
    return (
      <React.Fragment>
        <DesktopHeader
          currentUser={currentUser}
          getMe={getMe}
          profileUrl={profileUrl}
          handleKeyPress={handleKeyPress}
        >
          <Container fluid style={{ paddingTop: '100px' }}>
            {children}
          </Container>
        </DesktopHeader>
        <TabletHeader
          currentUser={currentUser}
          getMe={getMe}
          profileUrl={profileUrl}
          handleKeyPress={handleKeyPress}
        >
          <Container fluid style={{ paddingTop: '100px', minHeight: '100vh' }}>
            {children}
          </Container>
        </TabletHeader>
        <MobileHeader
          currentUser={currentUser}
          getMe={getMe}
          profileUrl={profileUrl}
          handleKeyPress={handleKeyPress}
        >
          <Container fluid style={{ paddingTop: '100px', minHeight: '100vh' }}>
            {children}
          </Container>
        </MobileHeader>
      </React.Fragment>
    );
  }
  return <div />;
};

export default withRouter(AppHeader);
