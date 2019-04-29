import gql from 'graphql-tag';

const ADD_COMMENT = gql`
  mutation addComment(
    $content: String!,
    $parent: ID!,
    $parentModel: String!,
  ){
    addComment(content: $content, parent: $parent, parentModel: $parentModel){
      content
    }
  }
`;

const EDIT_COMMENT = gql`
  mutation editComment(
    $id: ID!,
    $content: String!,
    $author: ID!,
  ){
    editComment(id: $id, content: $content, author: $author){
      content
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation deleteComment(
    $id: ID!,
    $author: ID!,
  ){
    deleteComment(id: $id, author: $author){
      content
    }
  }
`;

export {
  ADD_COMMENT,
  EDIT_COMMENT,
  DELETE_COMMENT,
};
