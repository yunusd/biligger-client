import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import {
 Icon, Modal, Header, Button,
} from 'semantic-ui-react';

import { ADD_REPORT } from './mutations';
/**
 * $actor: ID!,
 * $reporter: ID!,
 * $entityRef: String!,
 * $entityId: Int!,
 * $message: String!,
 */
const Report = ({
    actor, reporter, entityId, entityRef, message,
  }) => {
  const [modal, setModal] = useState(false);

  const handleClose = () => setModal(false);

  const handleClick = async (addReport) => {
    try {
      await addReport({
        variables: {
          actor,
          reporter,
          entityRef,
          entityId,
        },
      });
      setModal(true);
    } catch (error) {
      setModal(true);
    }
  };

  return (
    <Mutation mutation={ADD_REPORT}>
      {(addReport, { loading, error }) => (
        <div className="summary-context-right  summary-context-icon" title="bildir">
          <Icon
            name="flag"
            size="small"
            title="bildir"
            onClick={(e) => {
              e.preventDefault();
              handleClick(addReport);
            }}
            disabled={loading}
          />
          {!error ? (
            <Modal
              open={modal}
              onClose={handleClose}
              basic
              size="small"
            >
              <Header icon="flag" content="Rapor" />
              <Modal.Content>
                <h3>Bilig raporlandı!</h3>
              </Modal.Content>
              <Modal.Actions>
                <Button color="green" onClick={handleClose} inverted>
                  <Icon name="checkmark" />
                  Kapat
                </Button>
              </Modal.Actions>
            </Modal>
          ) : (
            <Modal
              open={modal}
              onClose={handleClose}
              basic
              size="small"
            >
              <Header icon="ban" content="Rapor Gönderilemedi!" />
              <Modal.Content>
                <h3>Bilig'i zaten raporladınız!</h3>
              </Modal.Content>
              <Modal.Actions>
                <Button color="red" onClick={handleClose} inverted>
                  <Icon name="checkmark" />
                  Kapat
                </Button>
              </Modal.Actions>
            </Modal>
          )}
        </div>
        )}
    </Mutation>
  );
};


export default Report;
