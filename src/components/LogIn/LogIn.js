import React, { Component } from 'react';
import axios from 'axios';

import {
  Button, Header, Form, Grid, Image, Segment, Divider,
} from 'semantic-ui-react';

import { Link } from 'react-router-dom';

import './LogIn.css';
import logo from '../../logo.png';

class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    document.body.style.background = 'linear-gradient(to top, #527ec0 68.3%, #ffffff 50%)';
    document.body.style.position = 'absolute';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
  }

  componentWillUnmount() {
    document.body.style.background = null;
    document.body.style.position = null;
    document.body.style.width = null;
    document.body.style.height = null;
  }


  handleSubmit() {
    const { username, password } = this.state;
    axios.post('https://localhost:3000/auth', {
      username,
      password,
    }, { withCredentials: 'include' }).then((res) => {
      window.location.replace('/');
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
    const { username = '', isRedirect = '' } = this.props;
    const user = `${isRedirect && `Hoşgeldin, ${username}`}`;
    const errorMessage = `${error && 'Kullanıcı adı ya da şifre yanlış!'}`;

    return (
      <Grid textAlign="center" className="login-grid" verticalAlign="bottom">
        <Grid.Column className="login-column">
          <Image as={Link} to="/" src={logo} size="medium" />
          <Header as="h2" className="login-header" textAlign="center">
            {errorMessage || user || 'Hoşgeldiniz'}
          </Header>
          <Segment raised className="login-segment">
            <Form onSubmit={this.handleSubmit}>
              <Form.Input placeholder="Kullanıcı adı" name="username" onChange={this.handleChange} />
              <Form.Input type="password" placeholder="Şifre" name="password" onChange={this.handleChange} />
              <Button
                type="submit"
                content="Giriş Yap"
              />
            </Form>
            <Divider />
            Henüz kayıt olmadın mı?
            <br />
            <Link to="/kayıt" onClick={() => { if (this.props.location.pathname === 'kayıt') this.props.history.replace('/kayıt'); }} style={{ color: '#49ba6f' }}>Kayıt Ol</Link>
          </Segment>
        </Grid.Column>
      </Grid>
      );
  }
}

export default LogIn;
