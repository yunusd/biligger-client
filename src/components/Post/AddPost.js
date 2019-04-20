import React from 'react';
import { Button, Form } from 'semantic-ui-react';

import { Mutation } from 'react-apollo';
import { ADD_POST } from './mutations';
import { RichTextEditor } from './RichTextEditor';

const AddPost = () => {
  async function handleSubmit(post) {
    const title = localStorage.getItem('title');
    const content = localStorage.getItem('content');
    // const url = localStorage.getItem('url');
    try {
      await post({
        variables: {
          title,
          content,
          url: 'http://google.com',
        },
      });
      localStorage.removeItem('title');
      localStorage.removeItem('content');
      // localStorage.removeItem('url');
      return window.location.replace('/');
    } catch (error) {
      return error;
    }
  }

  return (
    <Mutation mutation={ADD_POST}>
      {(post, { loading, error }) => (
        <Form
          loading={loading}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(post);
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
            HATA
          </div>
          )}
          <RichTextEditor />
          <Button
            basic
            floated="right"
            type="submit"
            style={{ marginTop: '10px' }}
          >
          Yayınla
          </Button>
        </Form>
      )}
    </Mutation>
  );
};


export default AddPost;
