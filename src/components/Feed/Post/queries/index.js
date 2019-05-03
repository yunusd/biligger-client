import gql from 'graphql-tag';

const GET_LATEST_POSTS = gql`
  query getLatestPosts($offset: Int!, $limit: Int!){
    getLatestPosts(offset: $offset, limit: $limit) {
      id
      title
      content
      url
      like
      category {
        id
        name
      }
      author {
        id,
        username
      }
      createdAt
    }
  }
`;

export default GET_LATEST_POSTS;
