import React, { Component } from 'react';

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

  handleSubmit(e, cb) {
    const { username, password } = this.state;
    fetch('http://localhost:3000/oauth/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic YWJjMTIzOnNzaC1zZWNyZXQ=',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        grant_type: 'password',
        username,
        password,
        scope: 'offline_access',
      }),
    }).then(res => res.json()).then((res) => {
      if (!res.error) {
        window.location.replace('/');
        return cb(res);
      }
      this.setState({ error: res.error_description });
      const unitTestHandleSubmit = this.props.handleSubmit;
      if (unitTestHandleSubmit) {
        this.props.handleSubmit(res); // added for unit test
      }
      return res;
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
            <Form onSubmit={(e) => {
              e.preventDefault();
              this.handleSubmit(e, async (res) => {
                localStorage.setItem('access_token', res.access_token);
              });
            }}
            >
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
