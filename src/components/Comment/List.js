import React from 'react';
import { useQuery, useApolloClient } from 'react-apollo-hooks';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {
 Comment, Card, Divider, Icon,
} from 'semantic-ui-react';
import marked from 'marked';

import Like from '../Like';
import { GET_ME_FROM_CACHE, GET_AUTH_STATUS } from '../../queries';
import { GET_LATEST_COMMENTS } from './queries';
import dateLocale from '../../helpers/dateLocale';
import './Comment.css';
import urlSerializer from '../../helpers/urlSerializer';

moment.updateLocale('en', dateLocale);

const Reply = ({ parent, getMe, currentUser }) => {
  const { data, loading, error } = useQuery(GET_LATEST_COMMENTS, {
    variables: {
      parent: parent.id,
    },
  });
  if (loading) return null;
  if (error) return 'Biraz sıkıntı yaşıyoruz!';
  if (!data.getLatestComments.length) return null;
  const {
    id,
    author,
    content,
    like,
    createdAt,
  } = data.getLatestComments[0];

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

  const auth = {
    isOwn: getMe && getMe.username === author.username,
    isLoggedIn: currentUser.isLoggedIn && true,
  };

  return (
    <React.Fragment>
      <Divider clearing />
      <Comment>
        <Comment.Content>
          <Comment.Author className="comment-list-author" as={Link} to={`/@${author.username}`}>
            { author.username }
          </Comment.Author>
          <Comment.Metadata className="comment-list-meta">
            <span>{moment(createdAt).fromNow()}</span>
          </Comment.Metadata>
          <br />
          <Comment.Text className="comment-list-text" as={Link} to={`${slug.comment.url}`} dangerouslySetInnerHTML={{ __html: content }}>
            {/* { rawContent } */}
          </Comment.Text>
          <Comment.Actions className="comment-list-actions">
            <Like parentModel="Comment" id={id} like={like} onList />
            {auth.isLoggedIn && (
              auth.isOwn ? (
                <React.Fragment>
                  <Link to={`${slug.comment.url}/düzenle`} className="summary-context-right summary-context-icon">
                    <Icon name="edit" size="small" />
                  </Link>
                  {/* <DeletePost id={id} authorId={author.id} {...props} /> */}
                </React.Fragment>
              ) : (
                <Link to="#" className="summary-context-right" title="bildir">
                  Bildir
                </Link>
              )
            )}
          </Comment.Actions>
        </Comment.Content>
      </Comment>
    </React.Fragment>
  );
};

const List = ({ parent }) => {
  const client = useApolloClient();

  const { data, loading, error } = useQuery(GET_LATEST_COMMENTS, {
    variables: {
      parent: parent.id,
    },
  });
  if (loading) return null;
  if (error) return 'Biraz sıkıntı yaşıyoruz!';
  if (!data.getLatestComments.length) return 'Yorum Yok!';

  return data.getLatestComments.map(({
    id,
    author,
    content,
    like,
    createdAt,
  }) => {
    const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
    const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;

    const auth = {
      isOwn: getMe && getMe.username === author.username,
      isLoggedIn: currentUser.isLoggedIn && true,
    };

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
      <Card fluid className="comment-list-card" key={id}>
        <Comment.Group className="comment-list-group">
          <Comment>
            <Comment.Content>
              <Comment.Author className="comment-list-author" as={Link} to={`/@${author.username}`}>
                { author.username }
              </Comment.Author>
              <Comment.Metadata className="comment-list-meta">
                <span>{moment(createdAt).fromNow()}</span>
              </Comment.Metadata>
              <br />
              <Comment.Text className="comment-list-text" as={Link} to={`${slug.comment.url}`} dangerouslySetInnerHTML={{ __html: content }}>
                {/* { rawContent } */}
              </Comment.Text>
              <Comment.Actions className="comment-list-actions">
                <Like parentModel="Comment" id={id} like={like} onList />

                {auth.isLoggedIn && (
                  auth.isOwn ? (
                    <React.Fragment>
                      <Link to={`${slug.comment.url}/düzenle`} className="summary-context-right summary-context-icon">
                        <Icon name="edit" size="small" />
                      </Link>
                    </React.Fragment>
                  ) : (
                    <Link to="#" className="summary-context-right" title="bildir">
                      Bildir
                    </Link>
                  )
                )}
              </Comment.Actions>
            </Comment.Content>
          </Comment>
          <Reply parent={{ id }} getMe={getMe} currentUser={currentUser} />
        </Comment.Group>
      </Card>
    );
  });
};

export default List;
