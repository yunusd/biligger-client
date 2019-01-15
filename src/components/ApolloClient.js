import ApolloClient from 'apollo-boost';

const token = localStorage.getItem('access_token');

const client = new ApolloClient({
  uri: 'http://localhost:3000/api',
  request: (operation) => {
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : false,
      },
    });
  },
});

export default client;
