import React from 'react';
import { Query } from 'react-apollo';
import { Dimmer, Loader } from 'semantic-ui-react';

import Summary from './Summary';
import GET_LATEST_POSTS_BY_CATEGORY from './queries';

const List = (props) => {
  const path = props.location.pathname.slice(1);
  const name = path.replace('-', ' ');

  return (
    <Query query={GET_LATEST_POSTS_BY_CATEGORY} variables={{ category: name }}>
      {({ loading, error, data }) => {
        if (loading) {
          return (
            <Dimmer active inverted>
              <Loader inverted content="Yükleniyor" />
            </Dimmer>
          );
        }

        const isExist = data.getLatestPostsByCategory.length !== 0;

        return <Summary isExist={isExist} error={error} category={name} data={data} />;
      }}
    </Query>
  );
};

export default List;
