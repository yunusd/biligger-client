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
        post {
          id
          title
          author {
            id
            username
          }
        }
        comment {
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
