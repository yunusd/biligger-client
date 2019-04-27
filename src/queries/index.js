import gql from 'graphql-tag';

const GET_AUTH_STATUS = gql`
  {
    currentUser {
      isLoggedIn @client
    }
  }
`;

const GET_ME_FROM_CACHE = gql`
  {
    getMe @client {
      id
      username
    }
  }
`;

export {
  GET_ME_FROM_CACHE,
  GET_AUTH_STATUS,
};
