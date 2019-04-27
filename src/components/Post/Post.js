import React from 'react';
import { useQuery, useApolloClient } from 'react-apollo-hooks';
import marked from 'marked';
import {
  Grid, Card, Label, Header, Divider, Icon,
} from 'semantic-ui-react';

import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import GET_POST from './queries';

import { List, Comment } from '../Comment';
import NotFound from '../NotFound';
import dateLocale from '../../helpers/dateLocale';
import { GET_ME_FROM_CACHE, GET_AUTH_STATUS } from '../../queries';

moment.updateLocale('en', dateLocale);

const Post = (props) => {
  const client = useApolloClient();

  const url = props.location.pathname;
  const path = url.split('/');
  const pathTitle = path[1].slice(0, -25).replace(/-/g, ' ');
  const checkUrl = path.length >= 2 ? url.slice(-24) : false;
  const id = checkUrl.search('/') === 0 ? false : checkUrl;
  const { data, loading, error } = useQuery(GET_POST, { variables: { id } });

  if (loading) return null;
  if (error) return <NotFound {...props} />;

  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;

  const {
    title, content, author, createdAt,
  } = data.getPost;

  const auth = {
    isOwn: getMe && getMe.username === author.username,
    isLoggedIn: currentUser.isLoggedIn && true,
  };

  const authorUrl = `/@${author.username}`;

  /**
   * if title of url is not match with title of post, page will be
   * redirected to matching url
   */
  if (pathTitle !== title.toLowerCase()) {
    const validUrl = `${title.toLowerCase().replace(/\s/g, '-')}-${id}`;
    return <Redirect to={validUrl} />;
  }

  const markedContent = marked(content);
  return (
    <Grid columns={1} centered id={id} key={id}>
      <Grid.Row>
        <Grid.Column width={12}>
          <Card fluid>
            <Card.Content>
              <Label as={Link} to={authorUrl} color="blue" ribbon>
                {author.username}
                &nbsp;-&nbsp;
                {moment(createdAt).fromNow()}
              </Label>
              <Card.Header style={{ margin: '5px 0 0 0', fontSize: '30px' }}>
                {title}
              </Card.Header>
              <Divider clearing />
              <Card.Description dangerouslySetInnerHTML={{ __html: markedContent }} className="display-linebreak">
                {/* {markedContent} */}
              </Card.Description>
            </Card.Content>

            <Card.Content extra>
              <Link to="#">
                <Icon name="idea" />
              Katılıyorum
              </Link>

          &nbsp;&nbsp;&nbsp;

              <Link to="#">
                <Icon name="comment" />
              Yorum Yaz
              </Link>
              {auth.isLoggedIn && (
                auth.isOwn ? (
                  <React.Fragment>
                    <Link to="#" className="summary-context-right">
                      düzenle
                    </Link>
                    <Link to="#" className="summary-context-right">
                      sil
                    </Link>
                  </React.Fragment>
                ) : (
                  <Link to="#" className="summary-context-right">
                    bildir
                  </Link>
                )
              )}
            </Card.Content>
          </Card>
          <Comment post={id} />
          <Divider horizontal>
            <Header as="h3" style={{ color: 'grey' }}>
                Yorumlar
            </Header>
          </Divider>

          <List post={id} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Post;
