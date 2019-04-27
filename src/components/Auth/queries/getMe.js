import gql from 'graphql-tag';

const GET_ME = gql`
  query getMe{
    getMe{
      id
      username
      email
      degree
      bio
    }
  }
`;

export default GET_ME;
