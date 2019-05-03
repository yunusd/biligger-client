import gql from 'graphql-tag';

const GET_LIKES = gql`
  query getLikes($offset: Int!, $limit: Int!){
    getLikes(offset: $offset, limit: $limit){
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
