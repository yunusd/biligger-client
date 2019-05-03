import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { Link } from 'react-router-dom';
import { List } from 'semantic-ui-react';
import GET_LIKES from './queries';

import urlSerializer from '../../../helpers/urlSerializer';

const Like = () => {
  const { data, loading, error } = useQuery(GET_LIKES);
  if (loading) return null;
  if (error) return 'Maalesef zorluklar yaşıyoruz!';
  return data.getLikes.map(({ parent }) => {
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
};

export default Like;
