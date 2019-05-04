import gql from 'graphql-tag';

const GET_POPULER_POSTS = gql`
  query getPopulerPosts($offset: Int!, $limit: Int!){
    getPopulerPosts(offset: $offset, limit: $limit) {
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

export {
  GET_LATEST_POSTS,
  GET_POPULER_POSTS,
};
