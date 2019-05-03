import gql from 'graphql-tag';

const GET_LIKES = gql`
  {
    getLikes{
      parent{
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
    }
  }
`;


export default GET_LIKES;
