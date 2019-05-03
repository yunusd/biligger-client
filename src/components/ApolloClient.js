import ApolloClient from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

import introspectionQueryResultData from '../fragmentTypes.json';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const cache = new InMemoryCache({ fragmentMatcher });

const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: 'https://localhost:3000/api',
    credentials: 'include',
  }),
});

const initData = () => client.writeData({
  data: {
    currentUser: {
      __typename: 'User',
      isLoggedIn: false,
    },
  },
});

initData();

// client.resetStore()
client.onResetStore(async () => {
  initData();
});

// client.clearStore()
client.onClearStore(async () => {
  initData();
});

export default client;
