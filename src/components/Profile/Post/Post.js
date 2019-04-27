import React from 'react';
import { useQuery } from 'react-apollo-hooks';

import { List, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import GET_POST_BY_USER from './queries';
import { DeletePost } from '../../Post';

const Post = (props) => {
  const { userId, auth } = props;
  const { data, loading, error } = useQuery(GET_POST_BY_USER, { variables: { id: userId } });

  if (loading) return null;
  if (error) return 'Maalesef zorluklar yaşıyoruz!';
  if (data.getPostsByUser.length === 0) return 'Bilig bulunamadı!';

  return data.getPostsByUser.map((val) => {
    const { id, title, content } = val;
    const postUrl = `/${title.toLowerCase().replace(' ', '-')}-${id}`;
    const { isOwn, isLoggedIn } = auth;

    return (
      <List.Item key={id} className="user-post-list-item">
        <div className="list-item-hr-margin" />
        <List.Content as={Link} to={postUrl} className="user-post-list-content">
          <List.Header className="user-post-list-header">
            {title}
          </List.Header>
          {content}
        </List.Content>
        {isLoggedIn && (
          <List.Content floated="right">
            <Dropdown item icon="ellipsis horizontal">
              <Dropdown.Menu style={{ boxShadow: 'none' }}>
                {isOwn ? (
                  <React.Fragment>
                    <Dropdown.Item as={Link} to={`${postUrl}/düzenle`} icon="edit" content="düzenle" />
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

export default Post;
