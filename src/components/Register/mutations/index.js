import gql from 'graphql-tag';

const REGISTER_USER = gql`
  mutation registerUser(
      $username: String!,
      $password: String!,
      $passwordCheck: String!,
      $email: String!,
      $degree: String,
      $bio: String,
    ){
    registerUser(
      username: $username,
      email: $email,
      password: $password,
      passwordCheck: $passwordCheck,
      degree: $degree,
      bio: $bio,
    ){
      username
    }
  }
`;

export {
  REGISTER_USER,
};
