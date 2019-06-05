import React from 'react';
import { useQuery, useApolloClient } from 'react-apollo-hooks';
import { Mutation } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import {
 Button, Form, Grid, Card, Message,
} from 'semantic-ui-react';
import removeMd from 'remove-markdown';

import { GET_AUTH_STATUS, GET_ME_FROM_CACHE } from '../../queries';
import { GET_COMMENT } from './queries';
import { EDIT_COMMENT } from './mutations';
import { Content as CommentEditor } from '../Post/RichTextEditor';
import urlSerializer from '../../helpers/urlSerializer';
import NotFound from '../NotFound';

const EditComment = (props) => {
  const client = useApolloClient();
  const { pathname } = props.location;
  const path = pathname.split('/');
  const commentAuthor = path[1].slice(1);
  const commentId = path[2].slice(-24);

  const { data, loading, error } = useQuery(GET_COMMENT, {
    variables: { id: commentId },
  });

  if (loading) return null;
  if (error) return <NotFound {...props} />;

  const {
    id,
    content,
    author,
  } = data.getComment;

  const raw = removeMd(content.replace(/\\/g, ''));

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
    return <Redirect to={`${slug.comment.url}/duzenle`} />;
  }

  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;

  const auth = {
    isOwn: getMe && getMe.username === author.username,
    isLoggedIn: currentUser.isLoggedIn && true,
  };

  if (!auth.isOwn) return <NotFound {...props} />;

  async function handleSubmit(editComment) {
    const localContent = localStorage.getItem('edit-comment');
    try {
      await editComment({
        variables: {
          id,
          content: localContent,
          author: author.id,
        },
      });
      localStorage.removeItem('edit-comment');

      return window.location.replace(slug.comment.url);
    } catch (err) {
      return err;
    }
  }

  return (
    <Mutation mutation={EDIT_COMMENT}>
      {(editComment, { loading, error }) => (
        <Grid columns={1} centered>
          <Helmet>
            <title>Yorum Düzenle - Biligger</title>
          </Helmet>
          <Grid.Row>
            <Grid.Column largeScreen={12} computer={12} widescreen={12} tablet={12} mobile={16}>
              {error && (
                <Message error list={['Boş yorum gönderemezsiniz!']} />
              )}

              <Form
                loading={loading}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(editComment);
                }}
              >
                <Card fluid>
                  <Card.Content>
                    <CommentEditor type="editComment" comment={{ content }} />
                  </Card.Content>
                </Card>
                <Button
                  basic
                  floated="right"
                  type="submit"
                >
                  Yayınla
                </Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
    </Mutation>
  );
};


export default EditComment;
