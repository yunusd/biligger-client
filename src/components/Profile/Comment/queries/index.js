import gql from 'graphql-tag';

const GET_USER_COMMENTS = gql`
  query getUserComments($author: ID!){
    getUserComments(author: $author){
      id
      content
      post {
        id,
        title
      }
      createdAt
    }
  }
`;


export default GET_USER_COMMENTS;
