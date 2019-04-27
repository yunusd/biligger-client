import React, { Component } from 'react';
import Editor from 'rich-markdown-editor';

import theme from './Theme';

class Content extends Component {
  constructor(props) {
    super(props);
    const { type = 'post', post } = this.props || {};
    this.post = post;
    this.type = type;
    this.draft = localStorage.getItem(this.type === 'comment' || 'content') || null;
    this.state = {
      value: this.post ? this.post.content : this.draft,
    };
  }


  onChange = (value) => {
    const content = value();
    if (this.type === 'editPost') return localStorage.setItem('edit-content', content);
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
