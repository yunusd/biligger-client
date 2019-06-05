import React from 'react';
import { Query } from 'react-apollo';
import { Helmet } from 'react-helmet';
import {
 Dimmer, Loader, Grid, Button, Segment,
} from 'semantic-ui-react';

import Summary from './Summary';
import { GET_POPULER_POSTS_BY_CATEGORY } from './queries';

String.prototype.toFirstUpperCase = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

const List = (props) => {
  const path = props.location.pathname.slice(1);
  const name = path.replace('-', ' ');

  return (
    <Query
      query={GET_POPULER_POSTS_BY_CATEGORY}
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

        const isExist = data.getPopulerPostsByCategory.length !== 0;

        const colors = {
          teknoloji: name === 'teknoloji' && 'green',
          bilim: name === 'bilim' && 'red',
          politika: name === 'politika' && 'black',
          sanat: name === 'sanat' && 'yellow',
          ekonomi: name === 'ekonomi' && 'blue',
          edebiyat: name === 'edebiyat' && 'yellow'
        };
        return (
          <Grid columns={2} centered>
            <Helmet>
              <title>
                {name.toFirstUpperCase()}
                &nbsp;- Biligger
              </title>
            </Helmet>
            <Grid.Row>
              <Grid.Column largeScreen={12} computer={12} widescreen={12} tablet={12} mobile={16}>
                <Segment
                  color={
                    colors.teknoloji || colors.bilim
                    || colors.ekonomi || colors.sanat
                    || colors.politika || colors.edebiyat
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
            <Grid.Row>
              {error && 'HATA'}
              <Grid.Column largeScreen={12} computer={12} widescreen={12} tablet={12} mobile={16}>
                <Summary isExist={isExist} data={data.getPopulerPostsByCategory} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Column largeScreen={12} computer={12} widescreen={12} tablet={12} mobile={16}>
              {data.getPopulerPostsByCategory.length >= 10
                && (
                  <Button
                    basic
                    fluid
                    onClick={() => {
                      fetchMore({
                        variables: {
                          offset: data.getPopulerPostsByCategory.length,
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                          if (!fetchMoreResult) return prev;
                          return Object.assign({}, prev, {
                            getPopulerPostsByCategory: [...prev.getPopulerPostsByCategory, ...fetchMoreResult.getPopulerPostsByCategory],
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
