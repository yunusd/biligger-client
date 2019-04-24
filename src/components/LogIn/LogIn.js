import React, { Component } from 'react';
import axios from 'axios';

import {
  Button, Header, Modal, Form,
} from 'semantic-ui-react';
import './LogIn.css';

class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const { username, password } = this.state;
    axios.post('https://localhost:3000/auth', {
      username,
      password,
    }, { withCredentials: 'include' }).then((res) => {
      window.location.reload();
      return res;
    }).catch((error) => {
      const unitTestHandleSubmit = this.props.handleSubmit;
      if (unitTestHandleSubmit) {
        this.props.handleSubmit(error); // added for unit test
      }
      this.setState({ error: true });
      return error;
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { error } = this.state;
    const { isRedirect, username, button } = this.props;
    return (
      <Modal trigger={button} dimmer="blurring" open={isRedirect}>
        <Modal.Content image className="modal-content">
          <div className="login-left">
            <Header size="huge">
              {isRedirect ? `Merhaba, ${username}!` : 'GİRİŞ YAP'}
              <br />
              <pre>
                {error && 'Hata :('}
              </pre>
            </Header>
          </div>
          <Modal.Description>
            <Form onSubmit={this.handleSubmit}>
              <Form.Input label="Kullanıcı adı" placeholder="Kullanıcı adı" name="username" onChange={this.handleChange} />
              <Form.Input type="password" label="Şifre" placeholder="Şifre" name="password" onChange={this.handleChange} />
              <Button
                type="submit"
                content="Giriş Yap"
                floated="right"
              />
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default LogIn;
