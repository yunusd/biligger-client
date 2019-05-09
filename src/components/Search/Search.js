import React from 'react';
import { useQuery, useApolloClient } from 'react-apollo-hooks';
import moment from 'moment';

import { Link } from 'react-router-dom';
import {
  Grid, Card, Icon, Segment, Button,
} from 'semantic-ui-react';
import SEARCH_POSTS from './queries';
import { GET_AUTH_STATUS, GET_ME_FROM_CACHE } from '../../queries';
import dateLocale from '../../helpers/dateLocale';
import urlSerializer from '../../helpers/urlSerializer';
import Like from '../Like';

moment.updateLocale('en', dateLocale);

const SearchHeader = () => (
  <Grid.Row>
    <Grid.Column largeScreen={12} computer={12} widescreen={12} tablet={12} mobile={16}>
      <Segment
        color="red"
        style={{
          boxShadow: 'none',
          border: 'none',
          fontWeight: '600',
          textTransform: 'capitalize',
        }}
      >
        Arama sonuçları:
      </Segment>
    </Grid.Column>
  </Grid.Row>
);

const SearchList = ({ data }) => {
  const client = useApolloClient();

  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;
  return data.searchPosts.map((val, i) => {
    const auth = {
      isOwn: getMe && getMe.username === val.author.username,
      isLoggedIn: currentUser.isLoggedIn && true,
    };

    const authorUrl = `/@${val.author.username}`;

    const slug = urlSerializer({
      id: val.id,
      username: val.author.username,
      text: {
        title: val.title,
      },
      type: {
        post: true,
      },
    });
    return (
      <Card fluid id={val.id} key={val.id}>
        <Card.Content>
          <Card.Header>
            <Link
              to={{
              pathname: val.id ? `${slug.post.url}` : '/',
              state: { id: val.id },
            }}
              style={{ color: 'rgba(0,0,0,.85)' }}
            >
              {val.title}
            </Link>
          </Card.Header>
          <Card.Meta>
            <Link to={authorUrl}>
              {val.author.username}
            </Link>
            &nbsp;-&nbsp;
            {moment(val.createdAt).fromNow()}
          </Card.Meta>
          <Card.Description dangerouslySetInnerHTML={{ __html: val.content }} className="display-linebreak">
            {/* {content} */}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Like parentModel="Post" id={val.id} like={val.like} />


              &nbsp;&nbsp;&nbsp;

          <Link to="/" className="summary-context-icon">
            <Icon name="comment" size="large" />
          </Link>

          {auth.isLoggedIn && (
            auth.isOwn ? (
              <React.Fragment>
                <Link to={`${slug.post.url}/düzenle`} className="summary-context-right summary-context-icon">
                  <Icon name="edit" size="large" />
                </Link>
              </React.Fragment>
            ) : (
              <Link to="#" title="Bildir" className="summary-context-right summary-context-icon">
                <Icon name="flag" title="bildir" size="large" />
              </Link>
            )
          )}

        </Card.Content>
      </Card>
    );
  });
};

const Search = (props) => {
  const params = new URLSearchParams(props.location.search);
  const search = params.get('bilig');
  const {
    data, loading, error, fetchMore,
  } = useQuery(SEARCH_POSTS, {
    variables: {
      text: search,
      offset: 0,
      limit: 10,
    },
  });

  if (loading) return null;
  if (error) return 'Bir şeyler ters gitti.';
  if (!data.searchPosts.length) {
    return (
      <Grid columns={1} centered>
        <SearchHeader />
        <Grid.Row centered>
          <p>Hiçbir bilig bulamadık!</p>
        </Grid.Row>
      </Grid>
    );
  }

  return (
    <React.Fragment>
      <Grid columns={1} centered>
        <Grid.Row>
          <Grid.Column largeScreen={12} computer={12} widescreen={12} tablet={12} mobile={16}>
            <SearchHeader />
            <SearchList data={data} />
            {data.searchPosts.length >= 10
            && (
              <Button
                basic
                fluid
                onClick={() => {
                  fetchMore({
                    variables: {
                      offset: data.searchPosts.length,
                    },
                    updateQuery: (prev, { fetchMoreResult }) => {
                      if (!fetchMoreResult) return prev;
                      return Object.assign({}, prev, {
                        searchPosts: [...prev.searchPosts, ...fetchMoreResult.searchPosts],
                      });
                    },
                  });
                }}
              >
              Daha Fazla
              </Button>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </React.Fragment>
  );
};

export default Search;
