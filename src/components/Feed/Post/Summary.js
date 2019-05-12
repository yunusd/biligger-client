import React from 'react';
import { Link } from 'react-router-dom';

import moment from 'moment';
import removeMd from 'remove-markdown';

import { Card, Icon } from 'semantic-ui-react';

import urlSerializer from '../../../helpers/urlSerializer';
import Like from '../../Like';
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
  const raw = removeMd(val.content);

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
        <Card.Meta>
          <Link to={authorUrl}>
            {val.author.username}
          </Link>
                &nbsp;-&nbsp;
          {moment(val.createdAt).fromNow()}
        </Card.Meta>
        <Card.Description style={{ fontSize: '16px', lineHeight: '1.618em' }}>
          {content}
        </Card.Description>
      </Card.Content>

      <Card.Content extra>
        <Like parentModel="Post" id={val.id} like={val.like} />
        &nbsp;&nbsp;&nbsp;
        <Link to="/" className="summary-context-icon">
          <Icon name="comment" size="small" />
        </Link>

        {auth.isLoggedIn && (
          auth.isOwn ? (
            <React.Fragment>
              <Link to={`${slug.post.url}/düzenle`} className="summary-context-right summary-context-icon">
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
});

export default Summary;
