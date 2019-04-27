import React, { Component } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import Plain from 'slate-plain-serializer';
import PlaceholderPlugin from 'slate-react-placeholder';

import { Header } from 'semantic-ui-react';

class Title extends Component {
  constructor(props) {
    super(props);
    const { type = 'post', post } = this.props;
    this.type = type;
    if (this.type === 'editPost') localStorage.setItem('edit-title', post.title);

    this.initialValue = Value.fromJSON({
      document: {
        nodes: [
          {
            object: 'block',
            type: 'heading-one',
            nodes: [
              {
                object: 'text',
                text: post ? post.title : localStorage.getItem('title') || null,
              },
            ],
          },
        ],
      },
    });

    this.plugins = [
      {
        queries: {
          isEmpty: editor => editor.value.document.text === '',
        },
      },
      PlaceholderPlugin({
        placeholder: 'Başlık',
        when: 'isEmpty',
        style: { color: '#000', opacity: '0.5' },
      }),
    ];

    this.state = {
      value: this.initialValue,
    };
  }

  onChange = ({ value }) => {
    if (value.document !== this.state.value.document) {
      const title = Plain.serialize(value);
      if (this.type === 'editPost') localStorage.setItem('edit-title', title);
      if (this.type === 'post') localStorage.setItem('title', title);

      this.setState({
        value,
      });
    }
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
   */
  renderNode = (props, editor, next) => {
    const { node, attributes, children } = props;
    switch (node.type) {
      case 'heading-one':
        return <Header size="large" {...attributes}>{children}</Header>;
      default:
        return next();
    }
  }

  /**
   *
   * Render the Editor.
   *
   * @return {Component} component
   */

  render() {
    const { value } = this.state;
    return (
      <Editor
        defaultValue={value}
        renderNode={this.renderNode}
        onKeyDown={(event, editor, next) => {
          if (event.key !== 'Enter') return next();
          return event.preventDefault();
        }}
        onChange={this.onChange}
        style={{ fontSize: '25px' }}
        plugins={this.plugins}
      />
    );
  }
}

export default Title;
