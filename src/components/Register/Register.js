import React, { Component } from 'react';
import { Mutation } from 'react-apollo';

import {
  Button, Header, Modal, Form,
} from 'semantic-ui-react';
import './Register.css';

import { REGISTER_USER } from './mutations';
import LogIn from '../LogIn';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { isRegister: false };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(register) {
    const {
      username,
      passwordCheck,
      password,
      email,
      degree,
      bio,
    } = this.state;

    // Try catch block needed for testing. Without it test not passing.
    try {
      await register({
        variables: {
          username,
          password,
          passwordCheck,
          email,
          degree,
          bio,
        },
      });
    } catch (error) {
      return error;
    }
    this.setState({ isRegister: true });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { isRegister, formValidation, username } = this.state;
    const { button } = this.props;
    return (
      <Mutation mutation={REGISTER_USER}>
        {(register, { loading, error }) => (
          <div>
            {!isRegister
              ? (
                <Modal trigger={button} dimmer="blurring">

                  <Modal.Content image className="modal-content">
                    <div className="register-left">
                      <Header size="huge">
                        KAYIT OL
                        <pre>
                          {error && 'Hata :('}
                        </pre>
                      </Header>
                    </div>
                    <Modal.Description>
                      <Form
                        loading={loading}
                        onSubmit={(e) => {
                          e.preventDefault();
                          this.handleSubmit(register);
                        }}
                      >
                        <Form.Input label="Kullanıcı adı" placeholder="Kullanıcı adı" name="username" onChange={this.handleChange} />
                        <Form.Input type="email" label="E-Posta adresi" placeholder="E-Posta adresi" name="email" onChange={this.handleChange} />
                        <Form.Input type="password" label="Şifre" placeholder="Şifre" name="password" onChange={this.handleChange} />
                        <Form.Input type="password" label="Şifre(tekrar)" placeholder="Şifre(tekrar)" name="passwordCheck" onChange={this.handleChange} />
                        <Form.Input label="Ünvan" placeholder="Ünvan" name="degree" onChange={this.handleChange} />
                        <Form.TextArea label="Hakkınızda" placeholder="Hakkınızda" name="bio" onChange={this.handleChange} />

                        <Button
                          disabled={formValidation}
                          type="submit"
                          content="Kayıt Ol"
                          floated="right"
                        />
                      </Form>
                    </Modal.Description>

                  </Modal.Content>
                </Modal>
              )
              : <LogIn isRedirect username={username} />
            }
          </div>
        )}
      </Mutation>
    );
  }
}

export default Register;
