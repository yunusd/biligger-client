import React from 'react';
import { useApolloClient, useQuery } from 'react-apollo-hooks';
import GET_ME from './queries';

const Auth = (props) => {
  const client = useApolloClient();
  const {
    data, loading, error,
  } = useQuery(GET_ME);
  if (loading) return null;
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
};

export default Auth;
