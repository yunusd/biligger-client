import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import removeMd from 'remove-markdown';

import { List, Dropdown, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import GET_USER_COMMENTS from './queries';
import urlSerializer from '../../../helpers/urlSerializer';

const CommentList = ({ auth, data }) => {
  const { isOwn, isLoggedIn } = auth;
  return data.getUserComments.map((val) => {
    const { id, content, author } = val;
    const raw = removeMd(content.replace(/\\/g, ''));

    const slug = urlSerializer({
      id,
      username: author.username,
      text: {
        content: raw,
      },
      type: {
        comment: true,
      },
    });

    const plainContent = raw.length < 500 ? raw : `${raw.slice(0, 500)}...`;

    return (
      <List.Item key={id} className="user-comment-list-item">
        <div className="list-item-hr-margin" />
        <List.Content as={Link} to={slug.comment.url} className="user-comment-list-content">
          {plainContent}
        </List.Content>
        {isLoggedIn && (
          <List.Content floated="right">
            <Dropdown item icon="ellipsis horizontal" pointing="top right">
              <Dropdown.Menu style={{ boxShadow: 'none' }}>
                {isOwn ? (
                  <React.Fragment>
                    <Dropdown.Item as={Link} to={`${slug.comment.url}/duzenle`} icon="edit" content="düzenle" />
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

const Comment = ({ userId, auth }) => {
  const { data, loading, error, fetchMore } = useQuery(GET_USER_COMMENTS, {
    variables: {
      author: userId,
      offset: 0,
      limit: 10,
    },
  });
  if (loading) return null;
  if (error) return 'Maalesef zorluklar yaşıyoruz!';
  if (data.getUserComments.length === 0) return 'Yorum bulunamadı!';

  return (
    <React.Fragment>
      <CommentList auth={auth} data={data} />
      { data.getUserComments.length >= 10
      && (
        <Button
          basic
          fluid
          onClick={() => {
            fetchMore({
              variables: {
                offset: data.getUserComments.length,
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return Object.assign({}, prev, {
                  getUserComments: [...prev.getUserComments, ...fetchMoreResult.getUserComments],
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

export default Comment;
