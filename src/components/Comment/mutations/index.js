import gql from 'graphql-tag';

const ADD_COMMENT = gql`
  mutation addComment(
    $content: String!,
    $post: ID!,
  ){
    addComment(content: $content, post: $post){
      content
    }
  }
`;

export {
  ADD_COMMENT,
};
