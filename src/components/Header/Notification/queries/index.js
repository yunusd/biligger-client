import gql from 'graphql-tag';

const GET_NOTIFICATIONS = gql`
  query getNotifications($offset: Int!, $limit: Int!) {
    getNotifications(offset: $offset, limit: $limit) {
      notifications {
        actor
        notificationId
        count
        message
        entity
        entityId
        seen
        createdAt
      }
      count
    }
  }
`;

export default GET_NOTIFICATIONS;
