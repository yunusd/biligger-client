import React from 'react';
import marked from 'marked';
import moment from 'moment';
import { Link } from 'react-router-dom';

import {
 Grid, Card, Icon, Segment,
} from 'semantic-ui-react';
import dateLocale from '../../../helpers/dateLocale';

moment.updateLocale('en', dateLocale);

const Summary = (props) => {
  const { data, error, category } = props;
  const lowerName = category.name.toLowerCase();
  const colors = {
    teknoloji: lowerName === 'teknoloji' && 'blue',
    bilim: lowerName === 'bilim' && 'red',
    spor: lowerName === 'spor' && 'green',
    sanat: lowerName === 'sanat' && 'yellow',
    yasam: lowerName === 'yaşam biçimi' && 'purple',
  };
  return (
    <React.Fragment>
      <Grid columns={2} centered>
        <Grid.Row>
          <Grid.Column width={12}>
            <Segment color={
              colors.teknoloji || colors.bilim
              || colors.spor || colors.sanat
              || colors.yasam
              }
            >
              { category.name }
            </Segment>
          </Grid.Column>
        </Grid.Row>
        {
          data.getLatestPostsByCategory.map((val) => {
              const title = val.title.length < 100 ? val.title : val.title.slice(0, 100);
              const rawContent = marked(val.content);

              const paragraph = rawContent.substring(
                rawContent.lastIndexOf('<p>'),
                rawContent.lastIndexOf('</p>'),
              );

              const content = paragraph.length < 500 ? paragraph : `${paragraph.slice(0, 500)}...`;

              return (

                <Grid.Row>
                  {error && 'HATA'}
                  <Grid.Column width={12} id={val.id} key={val.id}>
                    <Card fluid>
                      <Card.Content>
                        <Card.Header as="a" href={val.id ? `p/${val.id}` : '/'}>
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
              );
            })
          }
      </Grid>
    </React.Fragment>
  );
};

export default Summary;
