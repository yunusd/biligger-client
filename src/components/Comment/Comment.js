import React from 'react';
import { useQuery, useApolloClient } from 'react-apollo-hooks';
import { Helmet } from 'react-helmet';
import {
 Card, Grid, Divider, Header, Label, Icon,
} from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import removeMd from 'remove-markdown';

import List from './List';
import AddComment from './AddComment';

import { GET_ME_FROM_CACHE, GET_AUTH_STATUS } from '../../queries';
import { GET_COMMENT } from './queries';
import CommentParent from './CommentParent';
import DeleteComment from './DeleteComment';
import NotFound from '../NotFound';
import dateLocale from '../../helpers/dateLocale';
import Report from '../Report';
import Like from '../Like';
import urlSerializer from '../../helpers/urlSerializer';
import './Comment.css';

moment.updateLocale('en', dateLocale);

const Comment = (props) => {
  const client = useApolloClient();
  const { pathname } = props.location;
  const path = pathname.split('/');
  const commentId = path.length >= 2 ? path[2].slice(-24) : false;

  const { data, loading, error } = useQuery(GET_COMMENT, {
    variables: { id: commentId },
  });

  if (loading) return null;
  if (error) return <NotFound {...props} />;

  const {
    id,
    content,
    author,
    like,
    countLike,
    countReply,
    parent,
    parentModel,
    createdAt,
  } = data.getComment;

  const deleted = parentModel === 'Post' && !parent ? true : (!!(parentModel === 'Comment' && !parent));

  const date = moment(createdAt).diff(Date.now(), 'days');
  const raw = removeMd(content.replace(/\\/g, ''));
  const rawParentContent = removeMd(
    parent.title
    ? parent.title.replace(/\\/g, '')
    : parent.content.replace(/\\/g, ''),
  );
  const metaTitle = raw.length > 100 ? `${raw.slice(0, 100)}...` : raw;
  const metaDesc = raw.length > 200 ? `${raw.slice(0, 200)}...` : raw;

  const slug = urlSerializer({
    pathname,
    id,
    username: author.username,
    text: {
      content: raw,
    },
    type: {
      comment: true,
    },
  });

  if (!slug.comment.valid.username) return <NotFound {...props} />;

  /**
   * if title and post id of url is not match with title and id of post, page will be
   * redirected to matching url
   */
  if (!slug.comment.valid.content) {
    return <Redirect to={slug.comment.url} />;
  }

  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;

  const auth = {
    isOwn: getMe && getMe.username === author.username,
    isLoggedIn: currentUser.isLoggedIn && true,
  };

  const post = {
    id: deleted || parent.id,
    title: deleted || parent.title,
    author: deleted || (parent.author ? parent.author.username : null),
  };

  const comment = {
    id: deleted || parent.id,
    content: deleted || rawParentContent,
    author: deleted || (parent.author ? parent.author.username : null),
  };

  return (
    <Grid columns={2} centered>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
      </Helmet>
      <Grid.Row>
        <Grid.Column largeScreen={12} computer={12} widescreen={12} tablet={12} mobile={16}>
          <CommentParent parent={{ post, comment, deleted }} />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column largeScreen={12} computer={12} widescreen={12} tablet={12} mobile={16}>
          <Card fluid key={id}>
            <Card.Content>
              <Label as={Link} to={`/@${author.username}`} color="blue" title={moment(createdAt).format('dddd, D MMMM YYYY, H:MM:SS')} ribbon>
                {author.username}
                &nbsp;-&nbsp;
                {date <= -30 ? moment(createdAt).format('D MMMM YYYY') : moment(createdAt).fromNow()}
              </Label>
              <Card.Description style={{ fontSize: '21px', lineHeight: '1.618em' }}>
                <ReactMarkdown source={content} />
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Like parentModel="Comment" id={id} like={like} />
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

              <HashLink to={`${pathname}#yorum-yaz`} className="summary-context-icon">
                <Icon name="comment" size="small" />
                <Label
                  basic
                  pointing="left"
                  color="grey"
                  size="small"
                  className="count-like"
                  content={countReply}
                />
              </HashLink>
              {auth.isLoggedIn && (
                auth.isOwn ? (
                  <React.Fragment>
                    <Link to={`${pathname}/duzenle`}>
                      <Icon name="edit" size="small" className="summary-context-right summary-context-icon" />
                    </Link>
                    <DeleteComment
                      comment={
                        { id, authorId: author.id, parent: { post, comment, deleted } }
                      }
                      {...props}
                    />
                  </React.Fragment>
                ) : (
                  <Report actor={id} reporter={getMe.id} entityRef="Comment" entityId={1} />
                )
              )}
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column largeScreen={12} computer={12} widescreen={12} tablet={12} mobile={16}>
          <AddComment parent={{ id, parentModel: 'Comment' }} />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column largeScreen={12} computer={12} widescreen={12} tablet={12} mobile={16}>
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

export default Comment;
