import gql from 'graphql-tag';

const GET_ME = gql`
  query getMe{
    getMe{
      id,
      username,
      email,
    }
  }
`;

export default GET_ME;
