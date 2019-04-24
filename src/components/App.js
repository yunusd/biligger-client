import React from 'react';
import {
 BrowserRouter as Router, Route, Redirect, Switch,
} from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { Container } from 'semantic-ui-react';

import GET_AUTH_STATUS from '../queries';

import ScrollTop from './ScrollTop';
import client from './ApolloClient';
import Header from './Header';
import Feed from './Feed';
import { Post, AddPost } from './Post';
import { List as Category } from './Category/Post';
import Auth from './Auth';

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={
        (props) => {
          const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
          return (
          currentUser.isLoggedIn
        ? <Component {...props} />
        : (
          <Redirect to={{
              pathname: '/',
              state: { from: props.location },
            }}
          />
          )
        );
      }
    }
  />
);

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <ScrollTop>
        <React.Fragment>
          <Auth>
            <Container fluid>
              <Header />
            </Container>
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <Route path="/" exact component={Feed} />
                <PrivateRoute path="/yeni-bilig" exact component={AddPost} />
                <Route path="/(teknoloji|bilim|yaşam-biçimi|spor|sanat)/" exact component={Category} />
                <Route path="/:title" exact component={Post} />
                {/* <Route component={NotFound} /> */}
              </Switch>
            </Container>
          </Auth>
        </React.Fragment>
      </ScrollTop>
    </Router>
  </ApolloProvider>
);

export default App;
