import gql from 'graphql-tag';

const GET_AUTH_STATUS = gql`
  {
    currentUser {
      isLoggedIn @client
    }
  }
`;

export default GET_AUTH_STATUS;
