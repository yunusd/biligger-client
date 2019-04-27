import gql from 'graphql-tag';

const GET_USER = gql`
  query getUser($username: String!){
    getUser(username: $username){
      id
      username
      bio
      degree
    }
  }
`;


export default GET_USER;
