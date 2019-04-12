import React, { Component } from 'react';
import Editor from 'rich-markdown-editor';

import theme from './Theme';

class Content extends Component {
  constructor(props) {
    super(props);
    this.draft = localStorage.getItem('content') || null;
    this.state = {
      value: this.draft,
    };
  }


  onChange = (value) => {
    const content = value();
    localStorage.setItem('content', content);
  }

  render() {
    const { value } = this.state;

    return (
      value
        ? (
          <Editor
            placeholder="Yazmaya başlayabilirsiniz..."
            defaultValue={value}
            theme={theme}
            autoFocus
            onChange={this.onChange}
            style={{ fontSize: '20px' }}
          />
        )
        : (
          <Editor
            placeholder="Yazmaya başlayabilirsiniz..."
            autoFocus
            theme={theme}
            onChange={this.onChange}
            style={{ fontSize: '20px' }}
          />
        )
    );
  }
}

export default Content;
