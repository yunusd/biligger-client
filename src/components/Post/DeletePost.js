import React, { useState } from 'react';
import { useMutation } from 'react-apollo-hooks';

import {
 Modal, Button, Icon, Header,
} from 'semantic-ui-react';
import { DELETE_POST } from './mutations';


const DeletePost = (props) => {
  const { id, authorId } = props;

  const [open, setOpen] = useState();
  const message = 'Bu Bilig\'i Silmek İstediğinize Emin misiniz?';

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deletePost = useMutation(DELETE_POST, {
    update: (proxy, result) => {
      props.history.replace('/');
    },
    variables: { id, author: authorId },
  });
  return (
    <React.Fragment>
      <Icon name="trash" onClick={handleOpen} className="summary-context-icon summary-context-right" />
      <Modal
        open={open}
        basic
        size="small"
        closeOnDimmerClick={false}
        onClose={handleClose}
      >
        <Header icon="trash" content={message} />
        <Modal.Actions>
          <Button basic color="green" inverted onClick={handleClose}>
            <Icon name="remove" />
            Hayır
          </Button>
          <Button color="red" inverted onClick={deletePost}>
            <Icon name="checkmark" />
            Evet
          </Button>
        </Modal.Actions>
      </Modal>
    </React.Fragment>
  );
};

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

// const DeletePost = () => {
//   (
//   <Mutation mutation={DELETE_POST} variables={{ id, author: authorId }}>
//     {(deletePost, { loading, error}) => {
//       if (loading) return null;
//       if (error) return 'HATA';
//       <Icon name="trash" content="sil" onClick={() => deletePost}/>
//     }}
//   </Mutation>
//   )
// }

// const DeletePost = ({ onClick, id, authorId }) => {
//   if (onClick) {
//     const { data, loading, error } = useMutation(DELETE_POST, {
//       variables: {
//         id,
//         author: authorId,
//       },
//    });
//     if (loading) return null;
//     if (error) return 'HATA';
//     return (
//       <h1>Silindi</h1>
//     )
//   }

//   return <h1>PROVIDE SOME</h1>;
// };

export default DeletePost;
