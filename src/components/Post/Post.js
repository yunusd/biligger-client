import React from 'react';
import { useQuery, useApolloClient } from 'react-apollo-hooks';
import { Helmet } from 'react-helmet';
import ReactMarkdown from 'react-markdown';
import removeMd from 'remove-markdown';
import {
  Grid, Card, Label, Header, Divider, Icon,
} from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import moment from 'moment';

import GET_POST from './queries';
import { List, AddComment } from '../Comment';
import NotFound from '../NotFound';
import dateLocale from '../../helpers/dateLocale';
import { GET_ME_FROM_CACHE, GET_AUTH_STATUS } from '../../queries';
import DeletePost from './DeletePost';
import Like from '../Like';
import urlSerializer from '../../helpers/urlSerializer';
import Report from '../Report/Report';

moment.updateLocale('en', dateLocale);

const Post = (props) => {
  const client = useApolloClient();
  const { pathname } = props.location;
  const path = pathname.split('/');
  const id = path.length >= 2 ? path[1].slice(-24) : false;

  const { data, loading, error } = useQuery(GET_POST, {
    variables: { id },
    fetchPolicy: 'network-only',
  });
  if (loading) return null;
  if (error) return <NotFound {...props} />;

  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;

  const {
    title, content, author, createdAt, like, countLike, countReply,
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

  const date = moment(createdAt).diff(Date.now(), 'days');
  const raw = removeMd(content.replace(/\\/g, ''));
  const metaDesc = raw.length > 200 ? `${raw.slice(0, 200)}...` : raw;

  return (
    <Grid columns={1} centered id={id} key={id}>
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDesc} />
        <meta name="description" content={metaDesc} />
      </Helmet>
      <Grid.Row>
        <Grid.Column largeScreen={12} computer={12} widescreen={12} tablet={12} mobile={16}>
          <Card fluid>
            <Card.Content>
              <Label as={Link} to={authorUrl} color="blue" title={moment(createdAt).format('dddd, D MMMM YYYY, H:MM:SS')} ribbon>
                {author.username}
                &nbsp;-&nbsp;
                {date <= -30 ? moment(createdAt).format('D MMMM YYYY') : moment(createdAt).fromNow()}
              </Label>
              <Card.Header style={{ margin: '5px 0 0 0', fontSize: '42px' }}>
                {title}
              </Card.Header>
              <Divider clearing />
              <Card.Description id="ff" style={{ fontSize: '21px' }}>
                <ReactMarkdown source={content} />
              </Card.Description>
            </Card.Content>

            <Card.Content extra>
              <Like parentModel="Post" id={id} like={like} />
              { auth.isOwn && countLike !== 0 ? (
                <Label
                  basic
                  pointing="left"
                  color="yellow"
                  size="small"
                  className="count-like"
                  content={countLike}
                />
              ) : null }
              &nbsp;&nbsp;&nbsp;

              <HashLink to={`${slug.post.url}#yorum-yaz`}>
                <Icon name="comment" size="small" className="summary-context-icon" />
                { countReply !== 0 && (
                  <Label
                    basic
                    pointing="left"
                    color="grey"
                    size="small"
                    className="count-like"
                    content={countReply}
                  />
                )}

              </HashLink>
              {auth.isLoggedIn && (
                auth.isOwn ? (
                  <React.Fragment>
                    <Link to={`${slug.post.url}/duzenle`}>
                      <Icon name="edit" className="summary-context-right  summary-context-icon" size="small" />
                    </Link>
                    <DeletePost id={id} authorId={author.id} {...props} />
                  </React.Fragment>
                ) : (
                  <Report actor={author.id} reporter={getMe.id} entity={id} entityRef="Post" entityId={1} />
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
