import React, { useState } from 'react';
import { useQuery, useApolloClient } from 'react-apollo-hooks';
import { Mutation, Query } from 'react-apollo';
import {
 Button, Form, Grid, Card, Radio, Label, Message,
} from 'semantic-ui-react';

import { GET_AUTH_STATUS, GET_ME_FROM_CACHE } from '../../queries';
import { EDIT_POST } from './mutations';
import { GET_CATEGORIES } from '../Category/queries';
import GET_POST from './queries';
import { RichTextEditor } from './RichTextEditor';
import NotFound from '../NotFound';

const EditPost = (props) => {
  const client = useApolloClient();

  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;

  const [categoryId, setCategoryId] = useState(null);

  const url = props.location.pathname;
  const path = url.split('/');
  const pathId = path[1].slice(-24).replace(/-/g, ' ');
  const checkUrl = path.length >= 2 ? pathId : false;
  const id = checkUrl.search('/') === 0 ? false : checkUrl;

  const { data, loading, error } = useQuery(GET_POST, { variables: { id } });

  if (loading) return null;
  if (error) return <NotFound />;

  const post = data.getPost;

  const auth = {
    isOwn: getMe && getMe.username === post.author.username,
    isLoggedIn: currentUser.isLoggedIn && true,
  };
  if (!auth.isOwn) return <NotFound {...props} />;

  const handleChange = (e, { value }) => {
    setCategoryId(value);
  };

  async function handleSubmit(editPost) {
    const title = localStorage.getItem('edit-title');
    const content = localStorage.getItem('edit-content');
    // const url = localStorage.getItem('url');
    try {
      await editPost({
        variables: {
          id: post.id,
          title,
          content,
          url: 'http://google.com',
          category: categoryId,
          author: post.author.id,
        },
      });
      localStorage.removeItem('edit-title');
      localStorage.removeItem('edit-content');
      // localStorage.removeItem('url');
      // return props.history.replace('/');
      return window.location.replace('/');
    } catch (err) {
      return err;
    }
  }

  return (
    <Mutation mutation={EDIT_POST}>
      {(editPost, { loading, error }) => (
        <Grid columns={1} centered>
          <Grid.Row>
            <Grid.Column largeScreen={12} computer={12} widescreen={12} tablet={12} mobile={16}>
              {error && (
                <Message error list={['Boş veya kategorisi belirtilmemiş bilig gönderemezsiniz!']} />
              )}

              <Form
                loading={loading}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(editPost);
                }}
              >
                <Card fluid>
                  <Card.Content>
                    <RichTextEditor type="editPost" post={post} />
                  </Card.Content>
                  <Card.Content extra>
                    <Query query={GET_CATEGORIES}>
                      {(result) => {
                        const { data } = result;
                        if (result.loading) return 'Yükleniyor';
                        if (result.error) return 'Hata';
                        if (categoryId === null) setCategoryId(post.category.id);

                        return (
                          data.getCategories.map(({ id, name }) => (
                            <Label key={id} style={{ margin: '5px' }}>
                              <Radio
                                label={name}
                                value={id}
                                checked={categoryId === id}
                                onChange={handleChange}
                              />
                            </Label>
                          ))
                        );
                      }}
                    </Query>
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


export default EditPost;
