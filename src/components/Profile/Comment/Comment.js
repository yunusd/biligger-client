import React from 'react';
import { useQuery } from 'react-apollo-hooks';

import { List, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import GET_USER_COMMENTS from './queries';

const Comment = ({ userId, auth }) => {
  const { data, loading, error } = useQuery(GET_USER_COMMENTS, { variables: { author: userId } });
  if (loading) return null;
  if (error) return 'Maalesef zorluklar yaşıyoruz!';
  if (data.getUserComments.length === 0) return 'Yorum bulunamadı!';

  return data.getUserComments.map((val) => {
    const { id, content, post } = val;
    const { isOwn, isLoggedIn } = auth;

    const postUrl = post !== null ? `/${post.title.toLowerCase().replace(' ', '-')}-${post.id}` : '#';

    // prevents an error which happening when post is deleted.
    const postTitle = post !== null ? post.title : null;


    return (
      <List.Item key={id} className="user-comment-list-item">
        <div className="list-item-hr-margin" />
        <List.Content as={Link} to={postUrl} className="user-comment-list-content">
          <List.Header className="user-comment-list-header">
            {postTitle || '[silinmiş bilig]'}
          </List.Header>
          {content}
        </List.Content>
        {isLoggedIn && (
          <List.Content floated="right">
            <Dropdown item icon="ellipsis horizontal">
              <Dropdown.Menu style={{ boxShadow: 'none' }}>
                {isOwn ? (
                  <React.Fragment>
                    <Dropdown.Item icon="edit" content="düzenle" />
                    <Dropdown.Item icon="trash" content="sil" />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Dropdown.Item>Bildir</Dropdown.Item>
                    <Dropdown.Item>Düzenle</Dropdown.Item>
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
