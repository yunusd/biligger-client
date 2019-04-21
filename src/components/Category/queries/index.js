import gql from 'graphql-tag';

const GET_CATEGORY = gql`
  query getCategory{
    getCategory{
      name
    }
  }
`;

const GET_CATEGORIES = gql`
  query getCategories{
    getCategories{
      id
      name
    }
  }
`;

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

export {
  GET_CATEGORY,
  GET_CATEGORIES,
  GET_LATEST_POSTS_BY_CATEGORY,
};
