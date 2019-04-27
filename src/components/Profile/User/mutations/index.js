import gql from 'graphql-tag';

const EDIT_USER = gql`
  mutation editUser(
    $password: String!
    $newPassword: String
    $newPasswordCheck: String
    $email: String
    $degree: String
    $bio: String
  ){
    editUser(
      password: $password
      newPassword:$newPassword
      newPasswordCheck:$newPasswordCheck
      email:$email
      degree:$degree
      bio:$bio
    ) {
      id
      username
    }
  }
`;

export default EDIT_USER;
