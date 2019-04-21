import React from 'react';
import { Query } from 'react-apollo';
import { Dimmer, Loader } from 'semantic-ui-react';

import GET_LATEST_POSTS_BY_CATEGORY from './queries';

import Summary from './Summary';

const List = (props) => {
  const { id, name } = props.location.state;
  return (
    <Query query={GET_LATEST_POSTS_BY_CATEGORY} variables={{ category: id }}>
      {({ loading, error, data }) => {
        if (loading) {
          return (
            <Dimmer active inverted>
              <Loader inverted content="Yükleniyor" />
            </Dimmer>
          );
        }
        const isExist = data.getLatestPostsByCategory.length !== 0;

        if (!isExist) {
          return (
            <h5>Gönderi bulunamadı!</h5>
          );
        }
        return <Summary category={{ id, name }} error={error} data={data} />;
      }}
    </Query>
  );
};

export default List;
