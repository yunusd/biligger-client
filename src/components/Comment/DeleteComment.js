import React, { useState } from 'react';
import { useMutation } from 'react-apollo-hooks';

import {
 Modal, Button, Icon, Header,
} from 'semantic-ui-react';
import { DELETE_COMMENT } from './mutations';


const DeletePost = (props) => {
  const { id, authorId, parent } = props.comment;
  const [open, setOpen] = useState();
  const message = 'Bu Yorumu Silmek İstediğinize Emin misiniz?';

  // eslint-disable-next-line no-nested-ternary
  const contentUrl = parent ? null : parent.content
    ? parent.content.slice(0, 100)
      .toLowerCase().replace(/[^a-zA-Z\d\s:]/g, '').replace(/\s/g, '-')
    : parent.title.slice(0, 100)
      .toLowerCase().replace(/[^a-zA-Z\d\s:]/g, '').replace(/\s/g, '-');

  // eslint-disable-next-line no-nested-ternary
  const redirectUrl = !contentUrl ? '/' : parent.content
  ? `/@${parent.author.username}/${contentUrl}/${parent.id}`
  : `/${contentUrl}-${parent.id}`;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteComment = useMutation(DELETE_COMMENT, {
    update: (proxy, result) => {
      window.location.replace(redirectUrl);
    },
    variables: { id, author: authorId },
  });
  return (
    <React.Fragment>
      <Icon name="trash" onClick={handleOpen} size="large" className="summary-context-icon summary-context-right" />
      <Modal
        open={open}
        basic
        size="small"
        closeOnDimmerClick={false}
        onClose={handleClose}
      >
        <Header icon="trash" content={message} size="large" />
        <Modal.Actions>
          <Button basic color="green" inverted onClick={handleClose}>
            <Icon name="remove" />
            Hayır
          </Button>
          <Button color="red" inverted onClick={deleteComment}>
            <Icon name="checkmark" />
            Evet
          </Button>
        </Modal.Actions>
      </Modal>
    </React.Fragment>
  );
};

export default DeletePost;
