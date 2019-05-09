import React from 'react';
import { Query } from 'react-apollo';
import {
 Dimmer, Loader, Button,
} from 'semantic-ui-react';
import { useApolloClient } from 'react-apollo-hooks';

import { GET_POPULER_POSTS } from './queries';
import { GET_ME_FROM_CACHE, GET_AUTH_STATUS } from '../../../queries';

import Summary from './Summary';

const List = () => {
  const client = useApolloClient();

  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;

  return (
    <Query
      query={GET_POPULER_POSTS}
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

        const isExist = data.getPopulerPosts.length !== 0;

        if (!isExist) {
          return (
            <h5>Bilig bulunamadı!</h5>
          );
        }
        return (
          <React.Fragment>
            { error && 'Maalesef bazı sıkıntılar yaşıyoruz!'}
            <Summary data={data.getPopulerPosts} getMe={getMe} currentUser={currentUser} />
            {data.getPopulerPosts.length >= 10
              && (
                <Button
                  basic
                  fluid
                  onClick={() => {
                    fetchMore({
                      variables: {
                        offset: data.getPopulerPosts.length,
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev;
                        return Object.assign({}, prev, {
                          getPopulerPosts: [...prev.getPopulerPosts, ...fetchMoreResult.getPopulerPosts],
                        });
                      },
                    });
                  }}
                >
                  Daha Fazla
                </Button>
            )}
          </React.Fragment>
        );
      }}
    </Query>
  );
};

export default List;
