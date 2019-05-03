import gql from 'graphql-tag';

const GET_USER_COMMENTS = gql`
  query getUserComments($author: ID!, $offset: Int!, $limit: Int!){
    getUserComments(author: $author, offset: $offset, limit: $limit){
      id
      content
      author {
        id
        username
      }
      parentModel
      parent {
        ... on Post {
          id
          title
          author {
            id
            username
          }
        }
        ... on Comment {
          id
          content
          author {
            id
            username
          }
        }
      }
      createdAt
    }
  }
`;


export default GET_USER_COMMENTS;
