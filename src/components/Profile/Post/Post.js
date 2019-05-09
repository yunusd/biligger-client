import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import removeMd from 'remove-markdown';

import { List, Dropdown, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import GET_POST_BY_USER from './queries';
import urlSerializer from '../../../helpers/urlSerializer';

const PostList = ({ data, auth }) => data.getPostsByUser.map((val) => {
    const { id, title } = val;
    const { isOwn, isLoggedIn } = auth;

    const slug = urlSerializer({
      id,
      text: {
        title,
      },
      type: {
        post: true,
      },
    });
    const raw = removeMd(val.content);

    const content = raw.length < 500 ? raw : `${raw.slice(0, 500)}...`;
    return (
      <List.Item key={id} className="user-post-list-item">
        <div className="list-item-hr-margin" />
        <List.Content as={Link} to={slug.post.url} className="user-post-list-content">
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
                    <Dropdown.Item as={Link} to={`${slug.post.url}/düzenle`} icon="edit" content="düzenle" />
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

const Post = (props) => {
  const { userId, auth } = props;
  const {
    data, loading, error, fetchMore,
  } = useQuery(GET_POST_BY_USER, {
    variables: {
      id: userId,
      offset: 0,
      limit: 10,
    },
  });

  if (loading) return null;
  if (error) return 'Maalesef zorluklar yaşıyoruz!';
  if (data.getPostsByUser.length === 0) return 'Bilig bulunamadı!';

  return (
    <React.Fragment>
      <PostList data={data} auth={auth} />
      { data.getPostsByUser.length >= 10
      && (
        <Button
          basic
          fluid
          onClick={() => {
            fetchMore({
              variables: {
                offset: data.getPostsByUser.length,
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return Object.assign({}, prev, {
                  getPostsByUser: [...prev.getPostsByUser, ...fetchMoreResult.getPostsByUser],
                });
              },
            });
          }}
        >
          Daha Fazla
        </Button>
      )}
    </React.Fragment>
  );
};

export default Post;
