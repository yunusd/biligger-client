import gql from 'graphql-tag';

const RESET_USER_PASSWORD = gql`
  mutation resetUserPassword($newPassword: String!, $newPasswordCheck: String!, $hash: String!){
    resetUserPassword(newPassword: $newPassword, newPasswordCheck: $newPasswordCheck, hash: $hash){
      username
    }
  }
`;

const SEND_CONFIRMATION_EMAIL = gql`
  mutation sendConfirmationEmail($email: String!, $action: Int!){
    sendConfirmationEmail(email: $email, action: $action){
      hash,
      expired,
    }
  }
`;

export {
  RESET_USER_PASSWORD,
  SEND_CONFIRMATION_EMAIL,
};
