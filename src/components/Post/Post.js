import React from 'react';
import { Query } from 'react-apollo';
import marked from 'marked';
import {
  Grid, Card, Label, Header, Divider, Icon,
} from 'semantic-ui-react';

import { Link } from 'react-router-dom';
import moment from 'moment';
import GET_POST from './queries';

import { List, Comment } from '../Comment';
import dateLocale from '../../helpers/dateLocale';

moment.updateLocale('en', dateLocale);

const Post = (props) => {
  const url = props.location.pathname;
  const id = url.slice(-24);
  return (
    <Query query={GET_POST} variables={{ id }}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return 'HATA';
        const {
          title, content, url, author, createdAt,
        } = data.getPost;
        const markedContent = marked(content);
        return (
          <Grid columns={1} centered id={id} key={id}>
            {error && 'HATA'}
            <Grid.Row>
              <Grid.Column width={12}>
                <Card fluid>
                  <Card.Content>
                    <Label as="a" color="blue" ribbon>
                      {author.username}
                      &nbsp;-&nbsp;
                      {moment(createdAt).fromNow()}
                    </Label>
                    <Card.Header style={{ margin: '5px 0 0 0', fontSize: '30px' }}>
                      {title}
                    </Card.Header>
                    <Divider clearing />
                    <Card.Description dangerouslySetInnerHTML={{ __html: markedContent }} className="display-linebreak">
                      {/* {markedContent} */}
                    </Card.Description>
                  </Card.Content>

                  <Card.Content extra>
                    <Link to="#">
                      <Icon name="idea" />
                    Katılıyorum
                    </Link>

                &nbsp;&nbsp;&nbsp;

                    <Link to="#">
                      <Icon name="comment" />
                    Yorum Yaz
                    </Link>

                    <Link to="#" className="summary-context-right">
                    bildir
                    </Link>

                  </Card.Content>
                </Card>
                <Comment post={id} />
                <Divider horizontal>
                  <Header as="h3" style={{ color: 'grey' }}>
                      Yorumlar
                  </Header>
                </Divider>

                <List post={id} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        );
      }}
    </Query>
  );
};

export default Post;
