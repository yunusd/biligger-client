import gql from 'graphql-tag';

const ADD_REPORT = gql`
  mutation addReport(
      $actor: ID!,
      $reporter: ID!,
      $entity: ID!,
      $entityRef: String!
      $entityId: Int!,
      $message: String,
    ){
      addReport(
        actor: $actor,
        reporter: $reporter,
        entity: $entity,
        entityRef: $entityRef,
        entityId: $entityId,
        message: $message,
    ){
      actor,
      reporter,
      entity,
      entityRef,
      entityId,
      message,
    }
  }
`;

export {
  ADD_REPORT,
};
