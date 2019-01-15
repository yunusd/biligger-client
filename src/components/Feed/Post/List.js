import React from 'react';
import { Query } from 'react-apollo';
import { Dimmer, Loader } from 'semantic-ui-react';

import GET_LATEST_POSTS from './queries';

import Summary from './Summary';

const List = () => (
  <Query query={GET_LATEST_POSTS}>
    {({ loading, error, data }) => {
      if (loading) {
        return (
          <Dimmer active inverted>
            <Loader inverted content="Yükleniyor" />
          </Dimmer>
        );
      }
      if (!data) {
        return (
          <h5>Gönderi bulunamadı!</h5>
        );
      }
      return <Summary error={error} data={data} />;
    }}
  </Query>
);

export default List;
