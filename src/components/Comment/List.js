import React from 'react';
import { useQuery, useApolloClient } from 'react-apollo-hooks';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Comment, Card, Divider } from 'semantic-ui-react';
import marked from 'marked';

import { GET_ME_FROM_CACHE, GET_AUTH_STATUS } from '../../queries';
import { GET_LATEST_COMMENTS } from './queries';
import dateLocale from '../../helpers/dateLocale';
import './Comment.css';

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
    createdAt,
  } = data.getLatestComments[0];

  const contentUrl = content.slice(0, 100).toLowerCase().replace(/[^a-zA-Z\d\s:]/g, '').replace(/\s/g, '-');

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
          <Comment.Text className="comment-list-text" as={Link} to={`/@${author.username}/${contentUrl}/${id}`} dangerouslySetInnerHTML={{ __html: content }}>
            {/* { rawContent } */}
          </Comment.Text>
          <Comment.Actions className="comment-list-actions">
            <Link to="#">
            Katılıyorum
            </Link>
            {auth.isLoggedIn && (
              auth.isOwn ? (
                <React.Fragment>
                  <Link to={`/@${author.username}/${contentUrl}/${id}/düzenle`} className="summary-context-right">
                    Düzenle
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
    createdAt,
  }) => {
    const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
    const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;

    const auth = {
      isOwn: getMe && getMe.username === author.username,
      isLoggedIn: currentUser.isLoggedIn && true,
    };

    const contentUrl = content.slice(0, 100).toLowerCase().replace(/[^a-zA-Z\d\s:]/g, '').replace(/\s/g, '-');

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
              <Comment.Text className="comment-list-text" as={Link} to={`/@${author.username}/afas/${id}`} dangerouslySetInnerHTML={{ __html: content }}>
                {/* { rawContent } */}
              </Comment.Text>
              <Comment.Actions className="comment-list-actions">
                <Link to="#">
                Katılıyorum
                </Link>

                {auth.isLoggedIn && (
                  auth.isOwn ? (
                    <React.Fragment>
                      <Link to={`/@${author.username}/${contentUrl}/${id}/düzenle`}>
                        Düzenle
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

// const List = ({ parent }) => (
//   <Query query={GET_LATEST_COMMENTS} variables={{ parent: parent.id }}>
//     {({ error, loading, data }) => {
//         if (loading) return 'Yükleniyor';
//         if (error) return 'HATA';
//         if (!data.getLatestComments.length) return <h1>Yorum Yok!</h1>;
//         return (
//           data.getLatestComments.map((val) => {
//             const rawContent = marked(val.content);
//             const authorUrl = `/@${val.author.username}`;
//             return (
//               <Card fluid style={{ padding: '20px' }} key={val.id}>
//                 <Comment.Group style={{ maxWidth: 'none', width: '100%' }}>
//                   <Comment>
//                     <Comment.Content>
//                       <Comment.Author as={Link} to={authorUrl}>
//                         { val.author.username }
//                       </Comment.Author>
//                       <Comment.Metadata>
//                         <span>{moment(val.createdAt).fromNow()}</span>
//                       </Comment.Metadata>
//                       <Comment.Text as={Link} to={`/@${val.author.username}/afas/${val.id}`} dangerouslySetInnerHTML={{ __html: rawContent }}>
//                         {/* { rawContent } */}
//                       </Comment.Text>
//                       <Comment.Actions style={{ marginTop: '10px' }}>
//                         <Link to="#" >
//                           Katılıyorum
//                         </Link>
//                       </Comment.Actions>
//                     </Comment.Content>
//                   </Comment>

//                   <Query query={GET_COMMENT_REPLY} variables={{ parent: val.id }}>
//                     {(replyResponse) => {
//                         if (replyResponse.loading) return 'Yükleniyor';
//                         if (replyResponse.error) return 'HATA';
//                         if (!replyResponse.data.getCommentReply.length) return null;
//                         const replyComment = replyResponse.data.getCommentReply[0];

//                         return (
//                           <React.Fragment>
//                             <Divider clearing />
//                             <Comment>
//                               <Comment.Content>
//                                 <Comment.Author as={Link} to={authorUrl}>
//                                   { replyComment.author.username }
//                                 </Comment.Author>
//                                 <Comment.Metadata>
//                                   <span>{moment(replyComment.createdAt).fromNow()}</span>
//                                 </Comment.Metadata><br/>
//                                 <Comment.Text as={Link} to={`/@${replyComment.author.username}/afas/${replyComment.id}`} dangerouslySetInnerHTML={{ __html: replyComment.content }}>
//                                   {/* { rawContent } */}
//                                 </Comment.Text>
//                                 <Comment.Actions style={{ marginTop: '10px' }}>
//                                   <Link to="#" >
//                                     Katılıyorum
//                                   </Link>
//                                 </Comment.Actions>
//                               </Comment.Content>
//                             </Comment>
//                           </React.Fragment>
//                         );
//                       }}
//                   </Query>
//                 </Comment.Group>
//               </Card>
//             );
//           })
//         );
//       }}
//   </Query>
//   );

// <React.Fragment>
//   <Card fluid style={{ padding: '20px'}}>
//     <Comment.Group style={{ maxWidth: 'none', width: '100%' }}>
//       <Comment>
//         <Comment.Content>
//           <Comment.Author as="a">yunus</Comment.Author>
//           <Comment.Metadata>
//             <span>Bugün 05:42</span>
//           </Comment.Metadata>
//           <Comment.Text>ilginç bir yorum!</Comment.Text>
//           <Comment.Actions>
//             <a>Cevapla</a>
//           </Comment.Actions>
//         </Comment.Content>
//       </Comment>
//       <Divider clearing />
//       <Comment>
//         <Comment.Content>
//           <Comment.Author as="a">furkan</Comment.Author>
//           <Comment.Metadata>
//             <span>Bugün 05:42</span>
//           </Comment.Metadata>
//           <Comment.Text>yunus bey neden ilginç bir yorum yapıyorsunuz!</Comment.Text>
//           <Comment.Actions>
//             <a>Cevapla</a>
//           </Comment.Actions>
//         </Comment.Content>
//       </Comment>
//     </Comment.Group>
//   </Card>

//   <Card fluid style={{ padding: '20px'}}>
//     <Comment.Group>
//       <Comment>
//         <Comment.Content>
//           <Comment.Author as="a">Tatar</Comment.Author>
//           <Comment.Metadata>
//             <span>Bugün 05:42</span>
//           </Comment.Metadata>
//           <Comment.Text>bu daha da ilginç bir yorum</Comment.Text>
//           <Comment.Actions>
//             <a>Cevapla</a>
//           </Comment.Actions>
//         </Comment.Content>
//       </Comment>
//     </Comment.Group>
//   </Card>
// </React.Fragment>


export default List;
