import React from 'react';
import { useApolloClient } from 'react-apollo-hooks';
import removeMd from 'remove-markdown';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import { Card, Icon } from 'semantic-ui-react';

import urlSerializer from '../../../helpers/urlSerializer';
import Like from '../../Like';
import dateLocale from '../../../helpers/dateLocale';
import { GET_ME_FROM_CACHE, GET_AUTH_STATUS } from '../../../queries';

moment.updateLocale('en', dateLocale);

const Summary = (props) => {
  const client = useApolloClient();

  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;


  const {
    // eslint-disable-next-line react/prop-types
    data, isExist,
  } = props;

  return (
    <React.Fragment>
      {
        !isExist ? <h5>Bilig bulunamadı!</h5>
        : data.map((val) => {
            const auth = {
              isOwn: getMe && getMe.username === val.author.username,
              isLoggedIn: currentUser.isLoggedIn && true,
            };

            const title = val.title.length < 100 ? val.title : val.title.slice(0, 100);
            const raw = removeMd(val.content.replace(/\\/g, ''));

            const slug = urlSerializer({
              id: val.id,
              username: val.author.username,
              text: {
                title: val.title,
              },
              type: {
                post: true,
              },
            });

            const date = moment(val.createdAt).diff(Date.now(), 'days');
            const content = raw.length < 500 ? raw : `${raw.slice(0, 500)}...`;

            return (
              <Card fluid id={val.id} key={val.id}>
                <Card.Content>
                  <Card.Header style={{ fontSize: '21px' }}>
                    <Link
                      to={{
                        pathname: val.id ? `${slug.post.url}` : '/',
                        state: { id: val.id },
                      }}
                      style={{ color: 'rgba(0,0,0,.85)' }}
                    >
                      {title}
                    </Link>
                  </Card.Header>
                  <Card.Meta title={moment(val.createdAt).format('dddd, D MMMM YYYY, H:MM:SS')}>
                    {val.author.username}
                      &nbsp;-&nbsp;
                    {date <= -30 ? moment(val.createdAt).format('D MMMM YYYY') : moment(val.createdAt).fromNow()}
                  </Card.Meta>
                  <Card.Description style={{ fontSize: '16px', lineHeight: '1.618em' }}>
                    {content}
                  </Card.Description>
                </Card.Content>

                <Card.Content extra>
                  <Like parentModel="Post" id={val.id} like={val.like} />
                  &nbsp;&nbsp;&nbsp;
                  <HashLink to={`${slug.post.url}#yorum-yaz`} className="summary-context-icon">
                    <Icon name="comment" size="small" />
                  </HashLink>

                  {auth.isLoggedIn && (
                      auth.isOwn ? (
                        <React.Fragment>
                          <Link to={`${slug.post.url}/duzenle`} className="summary-context-right summary-context-icon">
                            <Icon name="edit" size="small" />
                          </Link>
                        </React.Fragment>
                      ) : (
                        <Link to="#" title="Bildir" className="summary-context-right summary-context-icon">
                          <Icon name="flag" title="bildir" size="small" />
                        </Link>
                      )
                    )}
                </Card.Content>
              </Card>
            );
          })
          }
    </React.Fragment>
  );
};

export default Summary;
