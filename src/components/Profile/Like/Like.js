import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { Link } from 'react-router-dom';
import { List, Button } from 'semantic-ui-react';
import GET_LIKES from './queries';

import urlSerializer from '../../../helpers/urlSerializer';

const LikeList = ({ data }) => data.getLikes.map(({ parent }) => {
    const { id, title, content } = parent;
    const slug = urlSerializer({
      id,
      username: parent.author ? parent.author.username : false,
      text: {
        title,
        content,
      },
      type: {
        post: true,
        comment: true,
      },
    });

    return (
      <List.Item key={id} className="user-post-list-item">
        <div className="list-item-hr-margin" />
        <List.Content as={Link} to={slug.comment.url || slug.post.url} className="user-post-list-content">
          { content || title }
        </List.Content>
      </List.Item>
    );
  });

const Like = () => {
  const {
    data, loading, error, fetchMore,
  } = useQuery(GET_LIKES, {
    variables: {
      offset: 0,
      limit: 10,
    },
  });
  if (loading) return null;
  if (error) return 'Maalesef zorluklar yaşıyoruz!';
  if (data.getLikes.length === 0) return 'Katıldığınız herhangi bir içerik bulunamadı!';

  return (
    <React.Fragment>
      <LikeList data={data} />
      {data.getLikes.length >= 10
      && (
        <Button
          basic
          fluid
          onClick={() => {
            fetchMore({
              variables: {
                offset: data.getLikes.length,
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return Object.assign({}, prev, {
                  getLikes: [...prev.getLikes, ...fetchMoreResult.getLikes],
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

export default Like;
