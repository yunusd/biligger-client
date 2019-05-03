import gql from 'graphql-tag';

const GET_LATEST_POSTS_BY_CATEGORY = gql`
  query getLatestPostsByCategory($category: String!, $offset: Int!, $limit: Int!){
    getLatestPostsByCategory(category: $category, offset: $offset, limit: $limit){
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

export default GET_LATEST_POSTS_BY_CATEGORY;
