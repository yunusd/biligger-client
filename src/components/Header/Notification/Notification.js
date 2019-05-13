import React, { useState } from 'react';
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks';
import { Link } from 'react-router-dom';
import {
 Label, Icon, Menu, Popup, Feed, Card, Button,
} from 'semantic-ui-react';
import moment from 'moment';

import GET_NOTIFICATIONS from './queries';
import { SEEN_NOTIFICATION, DELETE_NOTIFICATION } from './mutations';
import { GET_ME_FROM_CACHE, GET_AUTH_STATUS } from '../../../queries';
import urlSerializer from '../../../helpers/urlSerializer';
import dateLocale from '../../../helpers/dateLocale';
import './Notification.css';

moment.updateLocale('en', dateLocale);

const NotificationList = ({ data }) => {
  const client = useApolloClient();

  return data.map((val) => {
    const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
    const { getMe } = currentUser.isLoggedIn
    ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;

    /**
    * val.entityId 1 = Liked a Post,
    * val.entityId 2 = Liked a Comment
    * val.entityId 3 = Commented a Post
    * val.entityId 4 = Commented a Comment
    *
    */
    const entityIdMessage = [0, 'biliginize katıldı', 'yorumunuza katıldı', 'biliginize yorum yaptı', 'yorumunuza cevap yazdı'];
    const postLikedMessage = val.count - 1 >= 1
    ? ` ve ${val.count - 1} kişi daha bir ${entityIdMessage[val.entityId]}`
    : `, bir ${entityIdMessage[val.entityId]}`;

    const slug = urlSerializer({
      id: val.entity,
      username: getMe.username,
      text: {
        title: val.entityId === 3 || val.entityId === 1 ? val.message : false,
        content: val.entityId === 2 || val.entityId === 4 ? val.message : false,
      },
      type: {
        post: true,
        comment: true,
      },
    });

    return (
      <React.Fragment key={val.notificationId}>
        <Feed.Event
          className="notification-feed"
        >
          <Feed.Content>
            <Feed.Date>
              {moment(val.createdAt).fromNow()}
              &nbsp;
              &nbsp;
              {val.seen === false && (
                <Label circular color="red" empty key="red" />
              )}
            </Feed.Date>
            <Feed.Summary>
              <Link to={`/@${val.actor}`} className="notification-feed-message-actor">
                {val.actor}
              </Link>
              <Link to={slug.comment.url || slug.post.url} className="notification-feed-message">
                {postLikedMessage}
              </Link>
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
      </React.Fragment>
    );
  });
};

const Notification = () => {
  const [pollInterval, setPollInterval] = useState(5000);
  const [active, setActive] = useState();
  const seenNotification = useMutation(SEEN_NOTIFICATION);
  const deleteNotification = useMutation(DELETE_NOTIFICATION);

  const {
    data, loading, error, fetchMore,
  } = useQuery(GET_NOTIFICATIONS, {
    pollInterval,
    variables: {
      offset: 0,
      limit: 5,
    },
  });
  if (loading) return null;
  if (error) return 'Hata';
  const { notifications, count } = data.getNotifications;

  return (
    <React.Fragment>
      <Popup
        flowing
        on="click"
        position="bottom center"
        onOpen={() => {
          seenNotification();
          setPollInterval(50000);
          setActive(false);
        }}
        onClose={() => {
          setPollInterval(5000);
        }}
        trigger={(
          <Menu.Item as="a">
            <Icon name="bell" />
            { (count > 0 && active !== false) && (
            <Label color="red" pointing="left">
              { count }
            </Label>
              )}
          </Menu.Item>
        )}
      >
        <Card>
          <Card.Content>
            <Card.Header>
              Bildirimler
              <Button
                basic
                disabled={notifications.length === 0}
                floated="right"
                size="mini"
                onClick={() => {
                  setPollInterval(0.5);
                  deleteNotification();
                }}
              >
                hepsini sil
              </Button>
            </Card.Header>
          </Card.Content>
          <Card.Content>
            <Feed>
              {notifications.length === 0 && (
                <p>Bildirim Yok!</p>
              )}
              <NotificationList data={notifications} />
            </Feed>
          </Card.Content>
        </Card>
        <Card.Content extra>
          {notifications.length >= 5
            && (
              <Button
                basic
                fluid
                onClick={() => {
                  fetchMore({
                    variables: {
                      offset: notifications.length,
                    },
                    updateQuery: (prev, { fetchMoreResult }) => {
                      if (!fetchMoreResult) return prev;
                      return Object.assign({}, prev, {
                        getNotifications: {
                          notifications: [...prev.getNotifications.notifications, ...fetchMoreResult.getNotifications.notifications],
                          count: prev.getNotifications.count,
                          __typename: prev.getNotifications.__typename,
                        },
                      });
                    },
                  });
                }}
              >
                Daha Fazla
              </Button>
              )
          }
        </Card.Content>
      </Popup>
    </React.Fragment>
  );
};
export default Notification;
