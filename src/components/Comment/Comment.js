import React from 'react';
import { useQuery, useApolloClient } from 'react-apollo-hooks';
import {
 Card, Grid, Divider, Header, Label, Icon,
} from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import marked from 'marked';

import List from './List';
import AddComment from './AddComment';

import { GET_ME_FROM_CACHE, GET_AUTH_STATUS } from '../../queries';
import { GET_COMMENT } from './queries';
import CommentParent from './CommentParent';
import DeleteComment from './DeleteComment';
import NotFound from '../NotFound';
import dateLocale from '../../helpers/dateLocale';
import Like from '../Like';
import urlSerializer from '../../helpers/urlSerializer';

moment.updateLocale('en', dateLocale);

const Comment = (props) => {
  const client = useApolloClient();
  const { pathname } = props.location;
  const path = pathname.split('/');
  const commentId = path[path.length - 1];
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
    parent,
    parentModel,
    createdAt,
  } = data.getComment;

  const deleted = parentModel === 'Post' && !parent ? true : (!!(parentModel === 'Comment' && !parent));

  const slug = urlSerializer({
    pathname,
    id,
    username: author.username,
    text: {
      content,
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
    content: deleted || parent.content,
    author: deleted || (parent.author ? parent.author.username : null),
  };

  return (
    <Grid columns={2} centered>
      <Grid.Row>
        <Grid.Column width={12}>
          <CommentParent parent={{ post, comment, deleted }} />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={12}>
          <Card fluid key={id}>
            <Card.Content>
              <Label as={Link} to={`/@${author.username}`} color="blue" ribbon>
                {author.username}
                &nbsp;-&nbsp;
                {moment(createdAt).fromNow()}
              </Label>
              <Card.Description style={{ marginTop: '10px', fontSize: '21px' }} dangerouslySetInnerHTML={{ __html: content }} className="display-linebreak">
                {/* {markedContent} */}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Like parentModel="Comment" id={id} like={like} />


              &nbsp;&nbsp;&nbsp;

              <Link to="#" className="summary-context-icon">
                <Icon name="comment" size="large" />
              </Link>
              {auth.isLoggedIn && (
                auth.isOwn ? (
                  <React.Fragment>
                    <Link to={`${pathname}/düzenle`}>
                      <Icon name="edit" size="large" className="summary-context-right summary-context-icon" />
                    </Link>
                    <DeleteComment
                      comment={
                        { id, authorId: author.id, parent: { post, comment, deleted } }
                      }
                      {...props}
                    />
                  </React.Fragment>
                ) : (
                  <Link to="#" title="bildir" className="summary-context-right summary-context-icon">
                    <Icon name="flag" title="bildir" size="large" />
                  </Link>
                )
              )}
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={12}>
          <AddComment parent={{ id, parentModel: 'Comment' }} />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={12}>
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
