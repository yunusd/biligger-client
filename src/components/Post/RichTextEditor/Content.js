import React, { Component } from 'react';
import Editor from 'rich-markdown-editor';

import theme from './Theme';

class Content extends Component {
  constructor(props) {
    super(props);
    const { type = 'post', post, comment } = this.props || {};
    this.comment = comment;
    this.post = post;
    this.type = type;
    this.draft = localStorage.getItem(this.type === 'comment' || 'content' || this.type === 'editComment' || 'edit-comment') || null;
    this.state = {
      // eslint-disable-next-line no-nested-ternary
      value: this.post ? this.post.content : (this.comment ? this.comment.content : this.draft),
    };
  }


  onChange = (value) => {
    const content = value();
    if (this.type === 'editPost') return localStorage.setItem('edit-content', content);
    if (this.type === 'editComment') return localStorage.setItem('edit-comment', content);
    localStorage.setItem(this.type === 'comment' ? 'comment' : 'content', content);
  }

  render() {
    const { value } = this.state;
    const { placeholderValue = 'Yazmaya başlayabilirsiniz...' } = this.props || {};

    return (
      value
        ? (
          <Editor
            placeholder={placeholderValue}
            defaultValue={value}
            theme={theme}
            autoFocus
            onChange={this.onChange}
            style={{ fontSize: '20px' }}
          />
        )
        : (
          <Editor
            placeholder={placeholderValue}
            autoFocus={this.type === 'post'}
            theme={theme}
            onChange={this.onChange}
            style={{ fontSize: '20px' }}
          />
        )
    );
  }
}

export default Content;
