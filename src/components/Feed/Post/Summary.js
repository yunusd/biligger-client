import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import moment from 'moment';
import removeMd from 'remove-markdown';

import { Card, Icon } from 'semantic-ui-react';

import urlSerializer from '../../../helpers/urlSerializer';
import Like from '../../Like';
import Report from '../../Report';
import dateLocale from '../../../helpers/dateLocale';
import './Summary.css';

moment.updateLocale('en', dateLocale);

const Summary = ({ data, getMe, currentUser }) => data.map((val) => {
  const authorUrl = `/@${val.author.username}`;

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
        <Card.Header>
          <Link
            to={{
                  pathname: val.id ? `${slug.post.url}` : '/',
                  state: { id: val.id },
                }}
            style={{ color: 'rgba(0,0,0,.85)', fontSize: '21px' }}
          >
            {title}
          </Link>
        </Card.Header>
        <Card.Meta title={moment(val.createdAt).format('dddd, D MMMM YYYY, H:MM:SS')}>
          <Link to={authorUrl}>
            {val.author.username}
          </Link>
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
            <Report actor={val.id} reporter={getMe.id} entityRef="Post" entityId={1} />
          )
        )}

      </Card.Content>
    </Card>
  );
});

export default Summary;
