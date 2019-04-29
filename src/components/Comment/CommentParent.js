import React from 'react';
import moment from 'moment';

import { Link } from 'react-router-dom';
import { Segment, Header } from 'semantic-ui-react';
import dateLocale from '../../helpers/dateLocale';

moment.updateLocale('en', dateLocale);

const CommentParent = (props) => {
  const { post, comment, deleted } = props.parent;
  return (
    <Segment>
      <Header size="medium" textAlign="center">
        {
          post.title ? (
            <React.Fragment>
              <Link to={deleted ? '#' : `/${post.title.replace(' ', '-')}-${post.id}`} style={{ color: '#000000' }}>
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
              <Link to={deleted ? '#' : `/@${comment.author}/${comment.content.replace(' ', '-')}/${comment.id}`} style={{ color: '#000000' }}>
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
