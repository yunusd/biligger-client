import gql from 'graphql-tag';

const GET_POST = gql`
  query getPost($id: ID!){
    getPost(id: $id){
      id
      title
      content
      url
      like
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

export default GET_POST;
