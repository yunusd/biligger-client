import React from 'react';
import { useQuery, useApolloClient } from 'react-apollo-hooks';
import { Mutation } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import {
 Button, Form, Grid, Card,
} from 'semantic-ui-react';

import { GET_AUTH_STATUS, GET_ME_FROM_CACHE } from '../../queries';
import { GET_COMMENT } from './queries';
import { EDIT_COMMENT } from './mutations';
import { Content as CommentEditor } from '../Post/RichTextEditor';
import NotFound from '../NotFound';

const EditComment = (props) => {
  const client = useApolloClient();

  const path = props.location.pathname.split('/');
  const commentAuthor = path[1].slice(1);
  const commentId = path[3];
  const commentContent = path[2].slice(0, 100);

  const { data, loading, error } = useQuery(GET_COMMENT, {
    variables: { id: commentId },
  });

  if (loading) return null;
  if (error) return <NotFound />;

  const {
    id,
    content,
    author,
  } = data.getComment;


  if (commentAuthor !== author.username) return <NotFound {...props} />;

  /**
   * if title and post id of url is not match with title and id of post, page will be
   * redirected to matching url
   */
  const stringifyUrl = JSON.stringify(commentContent).replace(/[^a-zA-Z\d\-:]/g, '').replace(/\s/g, '-');
  const contentUrl = content.slice(0, 100).toLowerCase().replace(/[^a-zA-Z\d\s:]/g, '').replace(/\s/g, '-');

  if (stringifyUrl !== contentUrl) {
    const validUrl = `/@${author.username}/${contentUrl}/${id}/düzenle`;
    return <Redirect to={validUrl} />;
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
    // const url = localStorage.getItem('url');
    try {
      await editComment({
        variables: {
          id,
          content: localContent,
          author: author.id,
        },
      });
      localStorage.removeItem('edit-comment');
      // localStorage.removeItem('url');
      // return props.history.replace('/');

      return window.location.replace(`/@${author.username}/${contentUrl}/${id}`);
    } catch (err) {
      return err;
    }
  }

  return (
    <Mutation mutation={EDIT_COMMENT}>
      {(editComment, { loading, error }) => (
        <Grid columns={1} centered>
          <Grid.Row>
            <Grid.Column width={12}>
              <Form
                loading={loading}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(editComment);
                }}
              >
                <Card fluid>
                  <Card.Content>
                    {error && (
                    <Card.Description style={{
                      color: '#fff',
                      textAlign: 'center',
                      backgroundColor: 'red',
                      marginBottom: '10px',
                    }}
                    >
                      HATA
                    </Card.Description>
                    )}

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
