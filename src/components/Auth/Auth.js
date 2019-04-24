import React from 'react';
import { Query } from 'react-apollo';
import GET_ME from './queries';

const Auth = props => (
  <Query query={GET_ME}>
    {({
      data,
      loading,
      error,
      client,
    }) => {
      if (loading) return '';
      if (error) return <div {...props} />;
      client.writeData({
        data: {
          currentUser: {
            __typename: 'User',
            isLoggedIn: !!data.getMe.username || false,
          },
        },
      });
      return <div {...props} />;
    }}
  </Query>
  );

export default Auth;
