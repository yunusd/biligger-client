import gql from 'graphql-tag';

const ADD_LIKE = gql`
  mutation addLike($id: ID!, $parentModel: String!) {
    addLike(id: $id, parentModel: $parentModel) {
      liked
    }
  }
`;

const REMOVE_LIKE = gql`
  mutation removeLike($id: ID!, $parentModel: String!) {
    removeLike(id: $id, parentModel: $parentModel) {
      liked
    }
  }
`;

export {
  ADD_LIKE,
  REMOVE_LIKE,
};
