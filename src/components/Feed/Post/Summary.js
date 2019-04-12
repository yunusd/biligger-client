import React from 'react';
import { Link } from 'react-router-dom';

import moment from 'moment';
import marked from 'marked';

import { Grid, Card, Icon } from 'semantic-ui-react';
import './Summary.css';

moment.updateLocale('en', {
  relativeTime: {
    future: '%s içinde',
    past: '%s önce',
    s: 'birkaç saniye',
    ss: '%d saniye',
    m: 'bir dakika',
    mm: '%d dakika',
    h: 'bir saat',
    hh: '%d saat',
    d: 'bir gün',
    dd: '%d gün',
    M: 'bir ay',
    MM: '%d ay',
    y: 'bir yıl',
    yy: '%d yıl',
  },
});
const Summary = ({ error, data }) => data.getLatestPosts.map((val) => {
  const title = val.title.length < 100 ? val.title : val.title.slice(0, 100);
  const rawContent = marked(val.content);

  const paragraph = rawContent.substring(
    rawContent.lastIndexOf('<p>'),
    rawContent.lastIndexOf('</p>'),
  );

  const content = paragraph.length < 500 ? paragraph : `${paragraph.slice(0, 500)}...`;

  return (
    <Grid columns={1} centered id={val.id} key={val.id}>
      {error && 'HATA'}
      <Grid.Row>
        <Grid.Column width={12}>
          <Card fluid>
            <Card.Content>
              <Card.Header as="a" href={val.url ? val.url : '/'} target={val.url ? 'blank' : ''}>
                {title}
              </Card.Header>
              <Card.Meta>
                {val.author.username}
                &nbsp;-&nbsp;
                {moment(val.createdAt).fromNow()}
              </Card.Meta>
              <Card.Description dangerouslySetInnerHTML={{ __html: content }} className="display-linebreak">
                {/* {content} */}
              </Card.Description>
            </Card.Content>

            <Card.Content extra>
              <Link to="/">
                <Icon name="idea" />
                Katılıyorum
              </Link>

            &nbsp;&nbsp;&nbsp;

              <Link to="/">
                <Icon name="comment" />
                Yorum Yaz
              </Link>

              <Link to="/" className="summary-context-right">
                bildir
              </Link>

            </Card.Content>
          </Card>

        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
});

export default Summary;
