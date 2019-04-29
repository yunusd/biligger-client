import gql from 'graphql-tag';

const GET_COMMENT = gql`
  query getComment($id: ID!){
    getComment(id: $id){
      id
      content
      author {
        id
        username
      }
      parentModel
      parent {
        post {
          id
          title
          author {
            id
            username
          }
        }
        comment {
          id
          content
          author {
            id
            username
          }
        }
   
      }
      createdAt
    }
  }
`;

const GET_LATEST_COMMENTS = gql`
 query getLatestComments($parent: ID!){
   getLatestComments(parent: $parent){
    id
    content
    author {
      id
      username
    }
    parentModel
    parent {
      post {
        id
        title
        author {
          id
          username
        }
      }
      comment {
        id
        content
        author {
          id
          username
        }
      }
 
    }
    createdAt
   }
 }
`;

export {
  GET_COMMENT,
  GET_LATEST_COMMENTS,
};
