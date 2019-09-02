import gql from 'graphql-tag';

const ADD_REPORT = gql`
  mutation addReport(
      $actor: ID!,
      $reporter: ID!,
      $entityRef: String!
      $entityId: Int!,
      $message: String,
    ){
      addReport(
        actor: $actor,
        reporter: $reporter,
        entityRef: $entityRef,
        entityId: $entityId,
        message: $message,
    ){
      actor,
      reporter,
      entityRef,
      entityId,
      message,
    }
  }
`;

export {
  ADD_REPORT,
};
