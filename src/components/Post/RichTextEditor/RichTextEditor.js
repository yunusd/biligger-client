import React from 'react';

import Title from './Title';
import Content from './Content';
import './RichTextEditor.css';

const RichTextEditor = props => (
  <React.Fragment>
    <Title {...props} />
    <Content {...props} />
  </React.Fragment>
);

export default RichTextEditor;
