import gql from 'graphql-tag';

const ADD_POST = gql`
  mutation addPost(
    $title: String!,
    $content: String!,
    $url: String,
  ){
    addPost(
      title: $title,
      content: $content,
      url:  $url,
    ){
      title
    }
  }
`;

const EDIT_POST = gql`
  mutation editPost(
    $id: ID!,
    $title: String!,
    $content: String!,
    $url: String,
    $author: ID!,
  ){
    editPost(
      id: $ID,
      title: $title,
      content: $content,
      url:  $url,
      author: $ID,
    ){
      title
    }
  }
`;

export { ADD_POST, EDIT_POST };
