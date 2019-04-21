import gql from 'graphql-tag';

const ADD_POST = gql`
  mutation addPost(
    $title: String!,
    $content: String!,
    $url: String,
    $category: ID!,
  ){
    addPost(
      title: $title,
      content: $content,
      url:  $url,
      category: $category,
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
    $category: ID!,
    $author: ID!,
  ){
    editPost(
      id: $id,
      title: $title,
      content: $content,
      url:  $url,
      category: $category,
      author: $id,
    ){
      title
    }
  }
`;

export { ADD_POST, EDIT_POST };
