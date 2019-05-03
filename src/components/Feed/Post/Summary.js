import React from 'react';
import { Link } from 'react-router-dom';
import { useApolloClient } from 'react-apollo-hooks';

import moment from 'moment';
import marked from 'marked';

import { Grid, Card, Icon } from 'semantic-ui-react';

import urlSerializer from '../../../helpers/urlSerializer';
import Like from '../../Like';
import { GET_ME_FROM_CACHE, GET_AUTH_STATUS } from '../../../queries';
import dateLocale from '../../../helpers/dateLocale';
import './Summary.css';

moment.updateLocale('en', dateLocale);

const Summary = ({ error, data }) => data.getLatestPosts.map((val) => {
  const client = useApolloClient();

  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;

  const auth = {
    isOwn: getMe && getMe.username === val.author.username,
    isLoggedIn: currentUser.isLoggedIn && true,
  };

  const authorUrl = `/@${val.author.username}`;

  const title = val.title.length < 100 ? val.title : val.title.slice(0, 100);
  const rawContent = marked(val.content);

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

  const paragraph = rawContent.substring(
    rawContent.lastIndexOf('<p>'),
    rawContent.lastIndexOf('</p>'),
  );

  const content = paragraph.length < 500 ? paragraph : `${paragraph.slice(0, 500)}...`;

  return (
    <Grid columns={1} centered id={val.id} key={val.id}>
      {error && 'HATA'}
      <Grid.Row>
        <Grid.Column width={12}>
          <Card fluid>
            <Card.Content>
              <Card.Header>
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
              <Card.Meta>
                <Link to={authorUrl}>
                  {val.author.username}
                </Link>
                &nbsp;-&nbsp;
                {moment(val.createdAt).fromNow()}
              </Card.Meta>
              <Card.Description dangerouslySetInnerHTML={{ __html: content }} className="display-linebreak">
                {/* {content} */}
              </Card.Description>
            </Card.Content>

            <Card.Content extra>
              <Like parentModel="Post" id={val.id} like={val.like} />


            &nbsp;&nbsp;&nbsp;

              <Link to="/" className="summary-context-icon">
                <Icon name="comment" size="large" />
              </Link>

              {auth.isLoggedIn && (
                auth.isOwn ? (
                  <React.Fragment>
                    <Link to={`${slug.post.url}/düzenle`} className="summary-context-right summary-context-icon">
                      <Icon name="edit" size="large" />
                    </Link>
                  </React.Fragment>
                ) : (
                  <Link to="#" title="Bildir" className="summary-context-right summary-context-icon">
                    <Icon name="flag" title="bildir" size="large" />
                  </Link>
                )
              )}

            </Card.Content>
          </Card>

        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
});

export default Summary;
