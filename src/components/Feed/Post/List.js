import React from 'react';
import { Query } from 'react-apollo';
import {
 Dimmer, Loader, Button, Grid,
} from 'semantic-ui-react';
import { useApolloClient } from 'react-apollo-hooks';

import GET_LATEST_POSTS from './queries';
import { GET_ME_FROM_CACHE, GET_AUTH_STATUS } from '../../../queries';

import Summary from './Summary';

const List = () => {
  const client = useApolloClient();

  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;

  return (
    <Query
      query={GET_LATEST_POSTS}
      variables={{
        offset: 0,
        limit: 10,
      }}
    >
      {({
        loading, error, data, fetchMore,
      }) => {
        if (loading) {
          return (
            <Dimmer active inverted>
              <Loader inverted content="Yükleniyor" />
            </Dimmer>
          );
        }
        const isExist = data.getLatestPosts.length !== 0;

        if (!isExist) {
          return (
            <h5>Bilig bulunamadı!</h5>
          );
        }
        return (
          <Grid columns={1} centered>
            { error && 'Maalesef bazı sıkıntılar yaşıyoruz!'}
            <Grid.Row>
              <Grid.Column width={16}>
                <Summary data={data} getMe={getMe} currentUser={currentUser} />
                {data.getLatestPosts.length >= 10
                && (
                  <Button
                    basic
                    fluid
                    onClick={() => {
                      fetchMore({
                        variables: {
                          offset: data.getLatestPosts.length,
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                          if (!fetchMoreResult) return prev;
                          return Object.assign({}, prev, {
                            getLatestPosts: [...prev.getLatestPosts, ...fetchMoreResult.getLatestPosts],
                          });
                        },
                      });
                    }}
                  >
                  Daha Fazla
                  </Button>
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        );
      }}
    </Query>
  );
};

export default List;
