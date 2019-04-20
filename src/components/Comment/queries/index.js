import gql from 'graphql-tag';

const GET_COMMENT = gql`
  query getComment($post: ID!){
    getComment(post: $post){
      content
    }
  }
`;

const GET_LATEST_COMMENTS = gql`
 query getLatestComfments($post: ID!){
   getLatestComments(post: $post){
     id
     content
     createdAt
     author {
       username
     }
   }
 }
`;

export {
  GET_COMMENT,
  GET_LATEST_COMMENTS,
};
