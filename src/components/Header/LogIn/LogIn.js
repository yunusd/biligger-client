import React, { Component } from 'react';
import axios from 'axios';

import {
  Button, Header, Form, Popup, Grid, Divider,
} from 'semantic-ui-react';
import './LogIn.css';
import { Link } from 'react-router-dom';

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
    const { error = '' } = this.state;
    const {
      button, location,
    } = this.props;

    const urlCheck = location ? location.pathname === '/giriş-yap' : false;
    const errorMessage = `${error && 'Kullanıcı adı ya da şifre yanlış!'}`;

    return (
      <div>
        { urlCheck
        ? <h5>GİRİŞ YAP</h5>
        : (
          <Popup
            trigger={button}
            on="click"
            flowing
            position="bottom right"
            className="logIn"
            content={(
              <Grid columns={2} divided>
                <Grid.Row className="logInRow" stretched>
                  <Grid.Column className="logInLeft">
                    <Header
                      content={errorMessage || 'Hoşgeldiniz'}
                      size="huge"
                      textAlign="center"
                      className="logInLeftText"
                    />
                  </Grid.Column>
                  <Grid.Column className="logInRight">
                    <Form onSubmit={this.handleSubmit}>
                      <Form.Input label="Kullanıcı adı" placeholder="Kullanıcı adı" name="username" onChange={this.handleChange} />
                      <Form.Input type="password" label="Şifre" placeholder="Şifre" name="password" onChange={this.handleChange} />
                      <Button
                        type="submit"
                        content="Giriş Yap"
                        floated="right"
                      />
                    </Form>

                    <Divider />

                    <div>
                      Henüz hesabınız yok mu?
                      <Link to="/kayıt"> Kayıt Ol</Link>
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            )}
          />

        )
        }
      </div>
    );
  }
}

export default LogIn;
