import gql from 'graphql-tag';

const ADD_POST = gql`
  mutation addPost(
    $title: String!,
    $content: String!,
    $url: String,
    $category: String!,
  ){
    addPost(
      title: $title,
      content: $content,
      url:  $url,
      category: $category,
    ){
      id
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
    $category: String!,
    $author: ID!,
  ){
    editPost(
      id: $id,
      title: $title,
      content: $content,
      url:  $url,
      category: $category,
      author: $author,
    ){
      title
    }
  }
`;

const DELETE_POST = gql`
  mutation deletePost($id: ID!, $author: ID!){
    deletePost(id: $id, author: $author){
      title
    }
  }
`;

export { ADD_POST, EDIT_POST, DELETE_POST };
