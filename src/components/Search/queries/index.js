import gql from 'graphql-tag';

const SEARCH_POSTS = gql`
query searchPosts($text: String!, $offset: Int!, $limit: Int!){
  searchPosts(text: $text, offset: $offset, limit: $limit) {
    id
    title
    content
    url
    like
    author {
      id,
      username
    }
    createdAt
  }
}
`;

export default SEARCH_POSTS;
