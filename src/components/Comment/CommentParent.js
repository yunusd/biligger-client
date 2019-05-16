import React from 'react';
import moment from 'moment';

import { Link } from 'react-router-dom';
import { Segment, Header } from 'semantic-ui-react';

import urlSerializer from '../../helpers/urlSerializer';
import dateLocale from '../../helpers/dateLocale';

moment.updateLocale('en', dateLocale);

const CommentParent = (props) => {
  const { post, comment, deleted } = props.parent;

  const slug = urlSerializer({
    id: post.id || comment.id,
    username: comment.author ? comment.author : false,
    text: {
      title: post.title,
      content: comment.content,
    },
    type: {
      post: true,
      comment: true,
    },
  });

  return (
    <Segment>
      <Header size="medium" textAlign="center">
        {
          post.title ? (
            <React.Fragment>
              <Link to={deleted ? '#' : `${slug.post.url}`} style={{ color: '#000000' }}>
                {deleted ? '[silinmiş]' : post.title}
              </Link>
              {
                deleted || (
                  <Header.Subheader>
                    <Link to={`/@${post.author}`} style={{ color: '#00000099' }}>
                      {post.author}
                    </Link>
                  </Header.Subheader>
                )
              }
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Link to={deleted ? '#' : `${slug.comment.url}`} style={{ color: '#000000' }}>
                {deleted ? '[silinmiş]' : (
                  <p>
                    {comment.content.slice(0, 100)}
                    {comment.content.length > 100 && '...'}
                  </p>
                  )
                }
              </Link>
              {
                deleted || (
                  <Header.Subheader>
                    <Link to={`/@${comment.author}`} style={{ color: '#00000099' }}>
                      {comment.author}
                    </Link>
                  </Header.Subheader>
                )
              }
            </React.Fragment>
          )
        }
      </Header>
    </Segment>
  );
};

export default CommentParent;
