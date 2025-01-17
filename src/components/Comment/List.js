import React from 'react';
import { useQuery, useApolloClient } from 'react-apollo-hooks';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import moment from 'moment';
import removeMd from 'remove-markdown';

import {
 Comment, Card, Divider, Icon, Button, Label,
} from 'semantic-ui-react';

import Report from '../Report';
import Like from '../Like';
import { GET_ME_FROM_CACHE, GET_AUTH_STATUS } from '../../queries';
import { GET_LATEST_COMMENTS } from './queries';
import dateLocale from '../../helpers/dateLocale';
import urlSerializer from '../../helpers/urlSerializer';
import './Comment.css';

moment.updateLocale('en', dateLocale);

const Reply = ({ parent, getMe, currentUser }) => {
  const { data, loading, error } = useQuery(GET_LATEST_COMMENTS, {
    variables: {
      parent: parent.id,
      offset: 0,
      limit: 1,
    },
    fetchPolicy: 'network-only',
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

  const raw = removeMd(content.replace(/\\/g, ''));

  const date = moment(createdAt).diff(Date.now(), 'days');
  const plainContent = raw.length < 500 ? raw : `${raw.slice(0, 500)}...`;

  return (
    <React.Fragment>
      <Divider clearing />
      <Comment>
        <Comment.Content>
          <Comment.Author className="comment-list-author" as={Link} to={`/@${author.username}`}>
            { author.username }
          </Comment.Author>
          <Comment.Metadata className="comment-list-meta" title={moment(createdAt).format('dddd, D MMMM YYYY, H:MM:SS')}>
            <span>{date <= -30 ? moment(createdAt).format('D MMMM YYYY') : moment(createdAt).fromNow()}</span>
          </Comment.Metadata>
          <br />
          <Comment.Text
            className="comment-list-text"
            as={Link}
            to={`${slug.comment.url}`}
            style={{ fontSize: '18px', lineHeight: '1.618em' }}
          >
            { plainContent }
          </Comment.Text>
          <Comment.Actions className="comment-list-actions">
            <Like parentModel="Comment" id={id} like={like} />
            {auth.isLoggedIn && (
              auth.isOwn ? (
                <React.Fragment>
                  <Link to={`${slug.comment.url}/duzenle`} className="summary-context-right summary-context-icon">
                    <Icon name="edit" size="small" />
                  </Link>
                  {/* <DeletePost id={id} authorId={author.id} {...props} /> */}
                </React.Fragment>
              ) : (
                <Report actor={author.id} reporter={getMe.id} entity={id} entityRef="Comment" entityId={1} />
              )
            )}
          </Comment.Actions>
        </Comment.Content>
      </Comment>
    </React.Fragment>
  );
};

const CommentList = ({ data }) => {
  const client = useApolloClient();
  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;


  return data.getLatestComments.map(({
    id,
    author,
    countReply,
    content,
    like,
    createdAt,
  }) => {
    const auth = {
      isOwn: getMe && getMe.username === author.username,
      isLoggedIn: currentUser.isLoggedIn && true,
    };

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

    const date = moment(createdAt).diff(Date.now(), 'days');
    const plainContent = raw.length < 500 ? raw : `${raw.slice(0, 500)}...`;

    return (
      <Card fluid className="comment-list-card" key={id}>
        <Comment.Group className="comment-list-group">
          <Comment>
            <Comment.Content>
              <Comment.Author className="comment-list-author" as={Link} to={`/@${author.username}`}>
                { author.username }
              </Comment.Author>
              <Comment.Metadata className="comment-list-meta" title={moment(createdAt).format('dddd, D MMMM YYYY, H:MM:SS')}>
                <span>{date <= -30 ? moment(createdAt).format('D MMMM YYYY') : moment(createdAt).fromNow()}</span>
              </Comment.Metadata>
              <br />
              <Comment.Text
                className="comment-list-text"
                as={Link}
                to={`${slug.comment.url}`}
                style={{ fontSize: '18px', lineHeight: '1.618em' }}
              >
                { plainContent }
              </Comment.Text>
              <Comment.Actions className="comment-list-actions">
                <Like parentModel="Comment" id={id} like={like} onList />
                &nbsp;&nbsp;&nbsp;

                <HashLink to={`${slug.comment.url}#yorum-yaz`} className="summary-context-icon">
                  <Icon name="comment" size="small" />
                  { countReply > 0
                    ? (
                      <Label
                        basic
                        pointing="left"
                        color="grey"
                        size="tiny"
                        className="count-like"
                        content={countReply}
                      />
                    ) : null
                  }
                </HashLink>

                {auth.isLoggedIn && (
                  auth.isOwn ? (
                    <React.Fragment>
                      <Link to={`${slug.comment.url}/duzenle`} className="summary-context-right summary-context-icon">
                        <Icon name="edit" size="small" />
                      </Link>
                    </React.Fragment>
                  ) : (
                    <Report actor={author.id} reporter={getMe.id} entity={id} entityRef="Comment" entityId={1} />
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

const List = ({ parent }) => {
  const {
 data, loading, error, fetchMore,
} = useQuery(GET_LATEST_COMMENTS, {
    variables: {
      parent: parent.id,
      offset: 0,
      limit: 10,
    },
    fetchPolicy: 'network-only',
  });
  if (loading) return null;
  if (error) return 'Biraz sıkıntı yaşıyoruz!';
  if (!data.getLatestComments.length) return 'Yorum Yok!';

  return (
    <React.Fragment>
      <CommentList data={data} />
      {data.getLatestComments.length >= 10
      && (
        <Button
          basic
          fluid
          onClick={() => {
            fetchMore({
              variables: {
                offset: data.getLatestComments.length,
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return Object.assign({}, prev, {
                  getLatestComments: [...prev.getLatestComments, ...fetchMoreResult.getLatestComments],
                });
              },
            });
          }}
        >
          Daha fazla
        </Button>
      )}
    </React.Fragment>
  );
};

export default List;
