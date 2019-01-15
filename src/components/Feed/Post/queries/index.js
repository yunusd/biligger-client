import gql from 'graphql-tag';

const GET_LATEST_POSTS = gql`
  {
    getLatestPosts {
      id
      title
      content
      url
      author {
        username
      }
      createdAt
    }
  }
`;

export default GET_LATEST_POSTS;
