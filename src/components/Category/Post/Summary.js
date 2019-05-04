import React from 'react';
import { useApolloClient } from 'react-apollo-hooks';
import marked from 'marked';
import moment from 'moment';
import { Link } from 'react-router-dom';

import {
 Grid, Card, Icon,
} from 'semantic-ui-react';

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
    data, error, isExist,
  } = props;
  const posts = data.getLatestPostsByCategory;

  return (
    <React.Fragment>
      {
        !isExist ? <h5>Bilig bulunamadı!</h5>
        : posts.map((val) => {
            const auth = {
              isOwn: getMe && getMe.username === val.author.username,
              isLoggedIn: currentUser.isLoggedIn && true,
            };

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
              <Card fluid id={val.id} key={val.id}>
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
                    {val.author.username}
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
            );
          })
          }
    </React.Fragment>
  );
};

export default Summary;
