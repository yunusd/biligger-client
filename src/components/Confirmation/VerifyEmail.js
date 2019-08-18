import React from 'react';
import { Query } from 'react-apollo';
import { Modal, Header } from 'semantic-ui-react';
import { useApolloClient } from 'react-apollo-hooks';
import { VERIFY_HASH } from './queries';
import NotFound from '../NotFound';

const VerifyEmail = (props) => {
  const client = useApolloClient();
  return (
    <Query query={VERIFY_HASH} variables={{ hash: props.location.pathname.slice(-40), action: 1 }}>
      {({ data, loading, error }) => {
        if (loading) return null;
        if (error) return 'Hata';
        const { hash } = data.verifyHash;

        if (!hash) return <NotFound {...props} />;
        setTimeout(() => {
          client.resetStore();
          return window.location.replace('/');
        }, 3000);
        return (
          <React.Fragment>
            <Modal
              open
              size="fullscreen"
              closeOnDimmerClick={false}

            >
              <Header textAlign="center" color="green" content="E-Posta adresiniz doğrulandı!" size="huge" />
            </Modal>
            <div style={{ marginBottom: '9999px' }} />
          </React.Fragment>
        );
      }}
    </Query>
  );
};

export default VerifyEmail;
