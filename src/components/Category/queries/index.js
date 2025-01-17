import gql from 'graphql-tag';

const GET_CATEGORY = gql`
  query getCategory($name: String!){
    getCategory(name: $name){
      id
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

export {
  GET_CATEGORY,
  GET_CATEGORIES,
};
