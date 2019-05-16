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
      countLike
      like
      parentModel
      parent {
        ... on Post {
          id
          title
          author {
            id
            username
          }
        }
        ... on Comment {
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
 query getLatestComments($parent: ID!, $offset: Int!, $limit: Int!){
   getLatestComments(parent: $parent, offset: $offset, limit: $limit){
    id
    content
    author {
      id
      username
    }
    like
    parentModel
    parent {
      ... on Post {
        id
        title
        author {
          id
          username
        }
      }
      ... on Comment {
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
