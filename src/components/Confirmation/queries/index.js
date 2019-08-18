import gql from 'graphql-tag';

const VERIFY_HASH = gql`
  query verifyHash($hash: String!, $action: Int!){
    verifyHash(hash: $hash, action: $action){
      hash
      expired
    }
  }
`;

export {
  VERIFY_HASH,
};
