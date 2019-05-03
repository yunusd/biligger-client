import gql from 'graphql-tag';

const GET_USER_COMMENTS = gql`
  query getUserComments($author: ID!){
    getUserComments(author: $author){
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
