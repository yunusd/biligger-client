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

moment.updateLocale('en', dateLocale);

const Comment = (props) => {
  const client = useApolloClient();

  const path = props.location.pathname.split('/');
  const commentAuthor = path[1].slice(1);
  const commentId = path[path.length - 1];
  const commentContent = path[2].slice(0, 100);
  const { data, loading, error } = useQuery(GET_COMMENT, {
    variables: { id: commentId },
  });

  if (loading) return null;
  if (error) return <NotFound {...props} />;

  const {
    id,
    content,
    author,
    parent,
    parentModel,
    createdAt,
  } = data.getComment;

  const deleted = parentModel === 'Post' && !parent.post ? true : (parentModel === 'Comment' && !parent.comment ? true : false);

  if (commentAuthor !== author.username) return <NotFound {...props} />;

  /**
   * if title and post id of url is not match with title and id of post, page will be
   * redirected to matching url
   */
  const urlStringify = JSON.stringify(commentContent).replace(/[^a-zA-Z\d\-:]/g, '').replace(/\s/g, '-');
  const contentStr = content.slice(0, 100).toLowerCase().replace(/[^a-zA-Z\d\s:]/g, '').replace(/\s/g, '-');

  if (urlStringify !== contentStr) {
    const validUrl = `/@${author.username}/${contentStr}/${id}`;
    return <Redirect to={validUrl} />;
  }

  const url = props.location.pathname;
  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;

  const auth = {
    isOwn: getMe && getMe.username === author.username,
    isLoggedIn: currentUser.isLoggedIn && true,
  };

  const post = {
    id: deleted || parent.post.id,
    title: deleted || parent.post.title,
    author: deleted ? deleted : (parent.post.author ? parent.post.author.username : null),
  };

  const comment = {
    id: deleted ? deleted : parent.comment.id,
    content: deleted ? deleted : parent.comment.content,
    author: deleted ? deleted : (parent.comment.author ? parent.comment.author.username : null)
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
                    <Link to={`${url}/düzenle`}>
                      <Icon name="edit" className="summary-context-right" />
                    </Link>
                    <DeleteComment
                      comment={
                        { id, authorId: author.id, parent: { post, comment, deleted } }
                      }
                      {...props}
                    />
                  </React.Fragment>
                ) : (
                  <Link to="#" className="summary-context-right" title="bildir">
                    <Icon name="flag" title="bildir" />
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
