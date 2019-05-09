import React from 'react';
import { useQuery, useApolloClient } from 'react-apollo-hooks';
import ReactMarkdown from 'react-markdown';
import {
  Grid, Card, Label, Header, Divider, Icon,
} from 'semantic-ui-react';

import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import GET_POST from './queries';

import { List, AddComment } from '../Comment';
import NotFound from '../NotFound';
import dateLocale from '../../helpers/dateLocale';
import { GET_ME_FROM_CACHE, GET_AUTH_STATUS } from '../../queries';
import DeletePost from './DeletePost';
import Like from '../Like';
import urlSerializer from '../../helpers/urlSerializer';

moment.updateLocale('en', dateLocale);

const Post = (props) => {
  const client = useApolloClient();
  const { pathname } = props.location;
  const path = pathname.split('/');
  const checkUrl = path.length >= 2 ? pathname.slice(-24) : false;
  const id = checkUrl.search('/') === 0 ? false : checkUrl;
  const { data, loading, error } = useQuery(GET_POST, { variables: { id } });

  if (loading) return null;
  if (error) return <NotFound {...props} />;

  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;

  const {
    title, content, author, createdAt, like,
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
  const slug = urlSerializer({
    pathname,
    id,
    text: {
      title,
    },
    type: {
      post: true,
    },
  });

  /**
   * if title and post id of url is not match with title and id of post, page will be
   * redirected to matching url
   */
  if (!slug.post.valid.title) {
    return <Redirect to={slug.post.url} />;
  }

  return (
    <Grid columns={1} centered id={id} key={id}>
      <Grid.Row>
        <Grid.Column largeScreen={12} computer={12} widescreen={12} tablet={12} mobile={16}>
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
              <Card.Description>
                <ReactMarkdown source={content} />
              </Card.Description>
            </Card.Content>

            <Card.Content extra>
              <Like parentModel="Post" id={id} like={like} />

              &nbsp;&nbsp;&nbsp;

              <Link to="#">
                <Icon name="comment" size="large" color="grey" />
              </Link>
              {auth.isLoggedIn && (
                auth.isOwn ? (
                  <React.Fragment>
                    <Link to={`${slug.post.url}/düzenle`}>
                      <Icon name="edit" color="grey" className="summary-context-right" size="large" />
                    </Link>
                    <DeletePost id={id} authorId={author.id} {...props} />
                  </React.Fragment>
                ) : (
                  <Link to="#" className="summary-context-right" title="bildir">
                    <Icon name="flag" size="large" title="bildir" />
                  </Link>
                )
              )}
            </Card.Content>
          </Card>
          <AddComment parent={{ id, parentModel: 'Post' }} />
          <Divider horizontal>
            <Header as="h3" style={{ color: 'grey' }}>
                Yorumlar
            </Header>
          </Divider>

          <List parent={{ id }} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Post;
