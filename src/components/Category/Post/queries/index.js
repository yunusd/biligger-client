import gql from 'graphql-tag';

const GET_LATEST_POSTS_BY_CATEGORY = gql`
  query getLatestPostsByCategory($category: String!){
    getLatestPostsByCategory(category: $category){
      id
      title
      content
      url
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
