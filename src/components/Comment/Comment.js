import React from 'react';
import { Mutation } from 'react-apollo';
import { Card } from 'semantic-ui-react';
import { Content as CommentEditor } from '../Post/RichTextEditor';
// import { ADD_COMMENT } from './mutations';


const Comment = () => (
  <Card style={{ padding: '40px' }} fluid>
    <CommentEditor type="comment" placeholderValue="Yorumunuzu yazabilirsiniz..." />
  </Card>
);

export default Comment;
