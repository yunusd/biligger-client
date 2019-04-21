import React from 'react';
import { Mutation } from 'react-apollo';
import { Form, Card, Button } from 'semantic-ui-react';
import { Content as CommentEditor } from '../Post/RichTextEditor';
import { ADD_COMMENT } from './mutations';


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

  );
};

export default Comment;
