/* eslint-disable array-callback-return */
import ApolloClient from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import introspectionQueryResultData from '../fragmentTypes.json';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const cache = new InMemoryCache({ fragmentMatcher });

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) => {
          if (process.env.NODE_ENV !== 'production') {
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            );
          }
        });
      }
      if (networkError && process.env.NODE_ENV !== 'production') console.log(`[Network error]: ${networkError}`);
    }),
    new HttpLink({
      uri: '/api',
      credentials: 'include',
    }),
  ]),
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
