import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'https://localhost:3000/api',
  request: async (operation) => {
    operation.setContext({
      fetchOptions: {
        credentials: 'include',
      },
    });
  },
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
