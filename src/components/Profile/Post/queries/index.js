import gql from 'graphql-tag';

const GET_POST_BY_USER = gql`
  query getPostsByUser($id: ID!, $offset: Int!, $limit: Int!){
    getPostsByUser(id: $id, offset: $offset, limit: $limit){
      id,
      title,
      content
    }
  }
`;

export default GET_POST_BY_USER;
