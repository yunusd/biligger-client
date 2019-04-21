import gql from 'graphql-tag';

const GET_LATEST_POSTS_BY_CATEGORY = gql`
  query getLatestPostsByCategory($category: ID!){
    getLatestPostsByCategory(category: $category){
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

export default GET_LATEST_POSTS_BY_CATEGORY;