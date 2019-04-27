import gql from 'graphql-tag';

const GET_POST_BY_USER = gql`
  query getPostsByUser($id: ID!){
    getPostsByUser(id: $id){
      id,
      title,
      content
    }
  }
`;

export default GET_POST_BY_USER;
