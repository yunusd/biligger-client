import React from 'react';
// import { Mutation } from 'react-apollo';
// import { GET_LATEST_COMMENTS } from './queries';
import { Comment, Divider, Header, Card } from 'semantic-ui-react';

const List = () => (
  <React.Fragment>
    <Card fluid style={{ padding: '20px'}}>
      <Comment.Group style={{ maxWidth: 'none', width: '100%' }}>
        <Comment>
          <Comment.Content>
            <Comment.Author as="a">yunus</Comment.Author>
            <Comment.Metadata>
              <span>Bugün 05:42</span>
            </Comment.Metadata>
            <Comment.Text>ilginç bir yorum!</Comment.Text>
            <Comment.Actions>
              <a>Cevapla</a>
            </Comment.Actions>
          </Comment.Content>
        </Comment>
        <Divider clearing />
        <Comment>
          <Comment.Content>
            <Comment.Author as="a">furkan</Comment.Author>
            <Comment.Metadata>
              <span>Bugün 05:42</span>
            </Comment.Metadata>
            <Comment.Text>yunus bey neden ilginç bir yorum yapıyorsunuz!</Comment.Text>
            <Comment.Actions>
              <a>Cevapla</a>
            </Comment.Actions>
          </Comment.Content>
        </Comment>
      </Comment.Group>
    </Card>

    <Card fluid style={{ padding: '20px'}}>
      <Comment.Group>
        <Comment>
          <Comment.Content>
            <Comment.Author as="a">Tatar</Comment.Author>
            <Comment.Metadata>
              <span>Bugün 05:42</span>
            </Comment.Metadata>
            <Comment.Text>bu daha da ilginç bir yorum</Comment.Text>
            <Comment.Actions>
              <a>Cevapla</a>
            </Comment.Actions>
          </Comment.Content>
        </Comment>
      </Comment.Group>
    </Card>
  </React.Fragment>
);


export default List;
