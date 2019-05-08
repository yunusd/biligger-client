import gql from 'graphql-tag';

const SEEN_NOTIFICATION = gql`
  mutation seenNotification {
    seenNotification {
      seen
    }
  }
`;

const DELETE_NOTIFICATION = gql`
  mutation deleteNotification {
    deleteNotification {
      seen
    }
  }
`;

export {
  SEEN_NOTIFICATION,
  DELETE_NOTIFICATION,
};
