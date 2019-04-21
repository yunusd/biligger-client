import React, { useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import {
 Button, Form, Grid, Card, Radio, Label,
} from 'semantic-ui-react';

import { ADD_POST } from './mutations';
import { GET_CATEGORIES } from '../Category/queries';
import { RichTextEditor } from './RichTextEditor';

const AddPost = (props) => {
  const [categoryId, setCategoryId] = useState(null);

  const handleChange = (e, { value }) => {
    setCategoryId(value);
  };

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
          category: categoryId,
        },
      });
      localStorage.removeItem('title');
      localStorage.removeItem('content');
      // localStorage.removeItem('url');
      return props.history.replace('/');
    } catch (error) {
      return error;
    }
  }

  return (
    <Mutation mutation={ADD_POST}>
      {(post, { loading, error }) => (
        <Grid columns={1} centered>
          <Grid.Row>
            <Grid.Column width={12}>
              <Form
                loading={loading}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(post);
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
                            <Label key={id}>
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
