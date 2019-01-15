import React from 'react';
import { ApolloProvider } from 'react-apollo';

import { Container } from 'semantic-ui-react';

import './App.css';

import client from './ApolloClient';

import Header from './Header';
import Feed from './Feed';

const App = () => (
  <ApolloProvider client={client}>
    <Container fluid>
      <Header />
      <Feed />
    </Container>
  </ApolloProvider>
);

export default App;
