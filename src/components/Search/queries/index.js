import gql from 'graphql-tag';

const SEARCH_POSTS = gql`
query searchPosts($text: String!){
  searchPosts(text: $text) {
    id
    title
    content
    like
    author {
      id
      username
    }
    createdAt
  }
}
`;

export default SEARCH_POSTS;
