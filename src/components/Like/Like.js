import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { useApolloClient } from 'react-apollo-hooks';

import {
 Icon, Modal, Header, Button,
} from 'semantic-ui-react';
import { ADD_LIKE, REMOVE_LIKE } from './mutations';
import { GET_ME_FROM_CACHE, GET_AUTH_STATUS } from '../../queries';

const Like = (props) => {
  const {
    like,
    id,
    parentModel,
  } = props;
  const client = useApolloClient();

  const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
  const { getMe } = currentUser.isLoggedIn ? client.readQuery({ query: GET_ME_FROM_CACHE }) : false;

  const [change, setChange] = useState();
  const [status, setStatus] = useState(like);
  const [modal, setModal] = useState(false);

  const handleClose = () => setModal(false);

  return (
    <Mutation mutation={ADD_LIKE}>
      {(addLike, { loading, error }) => (
        <React.Fragment>
          <Modal
            open={modal}
            onClose={handleClose}
            basic
            size="small"
          >
            <Header icon="sign in" content="Giriş Yap" />
            <Modal.Content>
              <h3>Bu bilige katılmak için üye olmalısınız!</h3>
            </Modal.Content>
            <Modal.Actions>
              <Link to="/giris">
                <Button color="green">
                  <Icon name="checkmark" />
                  Giriş Yap
                </Button>
              </Link>
              <Button color="red" onClick={handleClose} inverted>
                <Icon name="close" />
                Kapat
              </Button>
            </Modal.Actions>
          </Modal>
          { !status
             ? (
               <Icon
                 name="idea"
                 size="small"
                 color={status || change ? 'yellow' : 'grey'}
                 onClick={(e) => {
                    e.preventDefault();
                    if (!getMe) return setModal(true);
                    addLike({ variables: { id, parentModel } });
                    setChange(true);
                    setStatus(true);
                  }}
                 style={{ cursor: 'pointer' }}
                 disabled={loading}
               />
              )
              : null
            }
          <Mutation mutation={REMOVE_LIKE}>
            {(removeLike, { loading, error }) => {
                if (!status) return null;
                return (
                  <Icon
                    name="idea"
                    size="small"
                    color={status || change ? 'yellow' : 'grey'}
                    onClick={(e) => {
                      e.preventDefault();
                      removeLike({ variables: { id, parentModel } });
                      setChange(false);
                      setStatus(false);
                    }}
                    style={{ cursor: 'pointer' }}
                    disabled={loading}
                  />
                );
              }}
          </Mutation>
        </React.Fragment>
        )}
    </Mutation>
  );
};

export default Like;
