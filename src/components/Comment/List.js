import React, { useState } from 'react';
import { Query } from 'react-apollo';
import moment from 'moment';
import {
  Comment, Divider, Header, Card,
} from 'semantic-ui-react';
import marked from 'marked';
import { GET_LATEST_COMMENTS } from './queries';
import dateLocale from '../../helpers/dateLocale';

moment.updateLocale('en', dateLocale);

const List = () => {
  const pathname = window.location.pathname.split('/');
  const [id] = useState(pathname[2]);
  return (
    <Query query={GET_LATEST_COMMENTS} variables={{ post: id }} pollInterval={500}>
      {({ error, loading, data }) => {
        if (error) return 'HATA';
        if (loading) return 'Yükleniyor';
        if (!data.getLatestComments.length) return <h1>Yorum Yok!</h1>;
        return (
          data.getLatestComments.map((val) => {
            const rawContent = marked(val.content);

            return (
              <Card fluid style={{ padding: '20px' }} key={val.id}>
                <Comment.Group>
                  <Comment>
                    <Comment.Content>
                      <Comment.Author as="a">{ val.author.username }</Comment.Author>
                      <Comment.Metadata>
                        <span>{moment(val.createdAt).fromNow()}</span>
                      </Comment.Metadata>
                      <Comment.Text dangerouslySetInnerHTML={{ __html: rawContent }}>
                        {/* { rawContent } */}
                      </Comment.Text>
                      {/* <Comment.Actions>
                      <a>Cevapla</a>
                    </Comment.Actions> */}
                    </Comment.Content>
                  </Comment>
                </Comment.Group>
              </Card>
            );
          })
        );
      }}
    </Query>
  );
};

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