import React, { Component } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import Plain from 'slate-plain-serializer';


class Url extends Component {
  constructor(props) {
    super(props);
    this.initialValue = Value.fromJSON({
      document: {
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                text: localStorage.getItem('url') || null,
              },
            ],
          },
        ],
      },
    });

    this.state = {
      value: this.initialValue,
    };
  }


  onChange = ({ value }) => {
    if (value.document != this.state.value.document) {
      // const content = JSON.stringify(value.toJSON())
      const url = Plain.serialize(value);
      localStorage.setItem('url', url);
      this.setState({
        value,
      });
    }
  }

  render() {
    const { value } = this.state;
    return (
      <Editor
        placeholder="kaynak...(lütfen url giriniz)"
        defaultValue={value}
        onChange={this.onChange}
        onKeyDown={(event, editor, next) => {
          if (event.key !== 'Enter') return next();
          event.preventDefault();
        }}
        style={{ fontSize: '20px' }}
      />
    );
  }
}

export default Url;
