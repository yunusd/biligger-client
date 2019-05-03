import React from 'react';
import { useQuery } from 'react-apollo-hooks';

import { List, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import GET_USER_COMMENTS from './queries';
import urlSerializer from '../../../helpers/urlSerializer';

const Comment = ({ userId, auth }) => {
  const { data, loading, error } = useQuery(GET_USER_COMMENTS, { variables: { author: userId } });
  if (loading) return null;
  if (error) return 'Maalesef zorluklar yaşıyoruz!';
  if (data.getUserComments.length === 0) return 'Yorum bulunamadı!';

  return data.getUserComments.map((val) => {
    const { id, content, author } = val;
    const { isOwn, isLoggedIn } = auth;

    const slug = urlSerializer({
      id,
      username: author.username,
      text: {
        content,
      },
      type: {
        comment: true,
      },
    });
    return (
      <List.Item key={id} className="user-comment-list-item">
        <div className="list-item-hr-margin" />
        <List.Content as={Link} to={slug.comment.url} className="user-comment-list-content">
          {content}
        </List.Content>
        {isLoggedIn && (
          <List.Content floated="right">
            <Dropdown item icon="ellipsis horizontal">
              <Dropdown.Menu style={{ boxShadow: 'none' }}>
                {isOwn ? (
                  <React.Fragment>
                    <Dropdown.Item as={Link} to={`${slug.comment.url}/düzenle`} icon="edit" content="düzenle" />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Dropdown.Item>Bildir</Dropdown.Item>
                  </React.Fragment>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </List.Content>
        )}
      </List.Item>
    );
  });
};

export default Comment;
