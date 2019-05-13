import React, { useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import { Helmet } from 'react-helmet';
import {
 Button, Form, Grid, Card, Radio, Label, Message,
} from 'semantic-ui-react';

import { ADD_POST } from './mutations';
import { GET_CATEGORIES } from '../Category/queries';
import { RichTextEditor } from './RichTextEditor';
import urlSerializer from '../../helpers/urlSerializer';

const AddPost = (props) => {
  const [categoryId, setCategoryId] = useState(null);

  const handleChange = (e, { value }) => {
    setCategoryId(value);
  };

  async function handleSubmit(post) {
    const title = localStorage.getItem('title');
    const content = localStorage.getItem('content');

    try {
      const { data } = await post({
        variables: {
          title,
          content,
          url: 'http://google.com',
          category: categoryId,
        },
      });
      localStorage.removeItem('title');
      localStorage.removeItem('content');
      const slug = urlSerializer({
        id: data.addPost.id,
        text: {
          title: data.addPost.title,
        },
        type: {
          post: true,
        },
      });
      return props.history.replace(slug.post.url);
    } catch (error) {
      return error;
    }
  }

  return (
    <Mutation mutation={ADD_POST}>
      {(post, { loading, error }) => (
        <Grid columns={1} centered>
          <Helmet>
            <title>Yeni Bilig - Biligger</title>
          </Helmet>
          <Grid.Row>
            <Grid.Column largeScreen={12} computer={12} widescreen={12} tablet={12} mobile={16}>
              {error && (
                <Message error list={['Boş veya kategorisi belirtilmemiş bilig gönderemezsiniz!']} />
              )}

              <Form
                loading={loading}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(post);
                }}
              >
                <Card fluid>
                  <Card.Content>
                    <RichTextEditor />
                  </Card.Content>
                  <Card.Content extra>
                    <Query query={GET_CATEGORIES}>
                      {(result) => {
                        const { data } = result;
                        if (result.loading) return 'Yükleniyor';
                        if (result.error) return 'Hata';
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


export default AddPost;
