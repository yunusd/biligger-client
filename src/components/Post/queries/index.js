import gql from 'graphql-tag';

const GET_POST = gql`
  query getPost($id: ID!){
    getPost(id: $id){
      id,
      title,
      content,
      url,
      author {
        username
      },
      createdAt
    }
  }
`;

export default GET_POST;
