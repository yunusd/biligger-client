import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';

import { Container } from 'semantic-ui-react';

import './App.css';

import client from './ApolloClient';

import Header from './Header';
import Feed from './Feed';
import Post from './Post';

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <React.Fragment>
        <Container fluid>
          <Header />
        </Container>
        <Container style={{ marginTop: '7em' }}>
          <Route path="/" exact component={Feed} />
          <Route path="/yazi" component={Post} />
        </Container>
      </React.Fragment>
    </Router>
  </ApolloProvider>
);

export default App;
