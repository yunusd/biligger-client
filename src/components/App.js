import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { Container } from 'semantic-ui-react';

import GET_AUTH_STATUS from '../queries';

import './App.css';
import ScrollTop from './ScrollTop';

import client from './ApolloClient';
import Header from './Header';
import Feed from './Feed';
import { Post, AddPost } from './Post';
import { List as CategoryPosts } from './Category/Post';
import Auth from './Auth';

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
              <Route path="/" exact component={Feed} />
              <Route path="/p/:title" exact component={Post} />
              <PrivateRoute path="/yazi" exact component={AddPost} />
              <Route path="/k/:name/" exact component={CategoryPosts} />
            </Container>
          </Auth>
        </React.Fragment>
      </ScrollTop>
    </Router>
  </ApolloProvider>
);

export default App;
