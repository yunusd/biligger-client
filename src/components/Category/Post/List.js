import React from 'react';
import { Query } from 'react-apollo';
import {
 Dimmer, Loader, Grid, Button, Segment,
} from 'semantic-ui-react';

import Summary from './Summary';
import GET_LATEST_POSTS_BY_CATEGORY from './queries';

const List = (props) => {
  const path = props.location.pathname.slice(1);
  const name = path.replace('-', ' ');

  return (
    <Query
      query={GET_LATEST_POSTS_BY_CATEGORY}
      variables={{
      category: name,
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
        if (error) return 'Maalesef bazı sıkıntılar yaşıyoruz!';

        const isExist = data.getLatestPostsByCategory.length !== 0;

        const colors = {
          teknoloji: name === 'teknoloji' && 'blue',
          bilim: name === 'bilim' && 'red',
          spor: name === 'spor' && 'green',
          sanat: name === 'sanat' && 'yellow',
          yasam: name === 'yaşam biçimi' && 'purple',
        };

        return (
          <Grid columns={2} centered>
            <Grid.Row>
              <Grid.Column width={12}>
                <Segment
                  color={
                    colors.teknoloji || colors.bilim
                    || colors.spor || colors.sanat
                    || colors.yasam
                  }
                  style={{
                    boxShadow: 'none',
                    border: 'none',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}
                >
                  { name }
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row >
              {error && 'HATA'}
              <Grid.Column width={12}>
                <Summary isExist={isExist} data={data} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Column width={12}>
              {data.getLatestPostsByCategory.length >= 10
                && (
                  <Button
                    basic
                    fluid
                    onClick={() => {
                      fetchMore({
                        variables: {
                          offset: data.getLatestPostsByCategory.length,
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                          if (!fetchMoreResult) return prev;
                          return Object.assign({}, prev, {
                            getLatestPostsByCategory: [...prev.getLatestPostsByCategory, ...fetchMoreResult.getLatestPostsByCategory],
                          });
                        },
                      });
                    }}
                  >
                  Daha Fazla
                  </Button>
                )}
            </Grid.Column>
          </Grid>
        );
      }}
    </Query>
  );
};

export default List;
