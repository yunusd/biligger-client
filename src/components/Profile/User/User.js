import React from 'react';
import { useQuery, useApolloClient } from 'react-apollo-hooks';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import axios from 'axios';
import {
 Segment, Header, Label, Grid, Card, Tab, List, Icon,
} from 'semantic-ui-react';

import Post from '../Post';
import Comment from '../Comment';
import Like from '../Like';
import GET_USER from './queries';
import NotFound from '../../NotFound';
import { GET_ME_FROM_CACHE, GET_AUTH_STATUS } from '../../../queries';

import './css/User.css';

const User = (props) => {
  const client = useApolloClient();

  const handleSubmit = () => {
    axios.get('https://localhost:3000/auth/logout', { withCredentials: 'include' })
      .then(() => { client.clearStore(); window.location.replace('/'); })
      .catch(error => error);
  };

  const { location } = props;
  const pathUsername = location.pathname.slice(2);
  const { data, loading, error } = useQuery(GET_USER, { variables: { username: pathUsername } });

  if (loading) return null;
  if (error) return <NotFound />;


  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;
  const auth = {
    isOwn: getMe && getMe.username === pathUsername,
    isLoggedIn: currentUser.isLoggedIn && true,
  };

  const {
    id,
    username,
    degree,
    bio,
  } = data.getUser;

  const panes = [
    {
      menuItem: { key: 'posts', icon: 'pencil', content: 'Biligler' },
      render: () => (
        <Tab.Pane attached={false}>
          <List divided className="user-post-list">
            <Post auth={auth} userId={id} />
          </List>
        </Tab.Pane>
      ),
    },
    {
      menuItem: { key: 'comments', icon: 'comment', content: 'Yorumlar' },
      render: () => (
        <Tab.Pane attached={false}>
          <List divided className="user-comment-list">
            <Comment auth={auth} userId={id} />
          </List>
        </Tab.Pane>
      ),
    },
    {
      menuItem: auth.isLoggedIn && auth.isOwn ? { key: 'likes', icon: 'idea', content: 'Katıldıkları' } : null,
      render: () => (
        <React.Fragment>
          {auth.isLoggedIn && auth.isOwn ? (
            <Tab.Pane attached={false}>
              <List divided className="user-comment-list">
                <Like auth={auth} userId={id} {...props} />
              </List>
            </Tab.Pane>
          ) : null }
        </React.Fragment>
      ),
    },
    /**
     * I leave the example below. Above objects rendering like this structure.
     */
    // {
    //   menuItem: (
    //     <Menu.Item key="likes">
    //        <Icon name="like" />
    //       Yorumlar
    //     </Menu.Item>
    //   ),
    //   render: () => <Tab.Pane>İçerik</Tab.Pane>,
    // },
  ];

  return (
    <React.Fragment>
      <Segment piled textAlign="center">
        <Helmet>
          <title>
            {username}
            &nbsp;- Biligger
          </title>
        </Helmet>
        <Grid>
          <Grid.Row>
            <Grid.Column width={3} verticalAlign="middle">
              <Label color="red" horizontal>
                {degree}
              </Label>
            </Grid.Column>
            <Grid.Column width={10}>
              <Header size="huge">
                {username}
              </Header>
            </Grid.Column>
            {auth.isOwn && (
              <Grid.Column width={3}>
                <Link to={`/@${pathUsername}/ayarlar`} className="profile-user-icon">
                  <Icon name="setting" size="large" />
                </Link>
                <Icon name="log out" size="large" className="profile-user-icon" onClick={() => { handleSubmit(); }} />
              </Grid.Column>
            )}
          </Grid.Row>
        </Grid>
      </Segment>
      <Card fluid>
        <Card.Content textAlign="center">
          {bio || 'Bu kullanıcının biografisi yok!'}
        </Card.Content>
      </Card>
      <Tab className="profile-tab" panes={panes} menu={{ secondary: true }} />
    </React.Fragment>
  );
};

export default User;
