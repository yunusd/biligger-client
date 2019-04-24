import React from 'react';
import { Mutation, ApolloConsumer } from 'react-apollo';
import {
 Form, Card, Button, Header,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Content as CommentEditor } from '../Post/RichTextEditor';
import { ADD_COMMENT } from './mutations';
import GET_AUTH_STATUS from '../../queries';

const Comment = (props) => {
  const { post } = props;

  const handleSubmit = async (comment) => {
    const content = window.localStorage.getItem('comment');

    try {
      await comment({
        variables: {
          content,
          post,
        },
      });

      window.localStorage.setItem('comment', '');
      window.location.reload();
    } catch (error) {
      return error;
    }
  };

  return (
    <ApolloConsumer>
      {(client) => {
        const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
        return (
          <div>
            { currentUser.isLoggedIn
              ? (
                <Mutation mutation={ADD_COMMENT}>
                  {(data, { loading, error }) => (
                    <Form
                      loading={loading}
                      onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit(data);
                    }}
                    >
                      {error && (
                        <div style={{
                          color: '#fff',
                          textAlign: 'center',
                          backgroundColor: 'red',
                          marginBottom: '10px',
                        }}
                        >
                          Boş bırakamazsınız
                        </div>
                      )}
                      <Card style={{ padding: '40px' }} fluid>
                        <CommentEditor type="comment" placeholderValue="Yorumunuzu yazabilirsiniz..." />
                      </Card>
                      <Button fluid inverted color="blue" type="submit"> Gönder </Button>
                    </Form>
                )}
                </Mutation>
              )
            : (
              <Card style={{ padding: '20px' }} fluid>
                <Header as="h4" style={{ color: 'grey' }} textAlign="center">
                  <Link to="/" style={{ color: 'grey' }}>Yorum yapmak için giriş yapmalısınız...</Link>
                </Header>
              </Card>
            )}
          </div>
        );
      }}
    </ApolloConsumer>
  );
};

export default Comment;
