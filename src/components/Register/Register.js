import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';
import {
  Grid, Button, Header, Segment, Form, Divider, Image,
} from 'semantic-ui-react';

import './Register.css';
import logo from '../../logo.png';

import { REGISTER_USER } from './mutations';
import LogIn from '../LogIn';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { isRegister: false };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    document.getElementById('root').style.background = 'linear-gradient(to top, #527ec0 68.3%, #ffffff 50%)';
    document.getElementById('root').style.position = 'absolute';
    document.getElementById('root').style.width = '100%';
    document.getElementById('root').style.height = '100%';
  }

  componentWillUnmount() {
    document.getElementById('root').style.background = null;
    document.getElementById('root').style.position = null;
    document.getElementById('root').style.width = null;
    document.getElementById('root').style.height = null;
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
      return this.setState({ isRegister: true });
    } catch (error) {
      return error;
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const {
      isRegister,
      formValidation,
      username,
    } = this.state;


    return (
      <Mutation mutation={REGISTER_USER}>
        {(register, { loading, error = '' }) => {
        const errorMessage = `${error && 'Lütfen bilgileri doğru giriniz!'}`;
        return (
          <div>
            {!isRegister
              ? (
                <div className="login-form">
                  <Grid textAlign="center" className="register-grid" verticalAlign="bottom">
                    <Grid.Column className="register-column">
                      <Image as={Link} to="/" src={logo} size="medium" />
                      <Header as="h2" className="register-header" textAlign="center">
                        {errorMessage || 'Hoşgeldiniz'}
                      </Header>
                      <Segment raised className="register-segment">
                        <Form
                          loading={loading}
                          onSubmit={(e) => {
                          e.preventDefault();
                          this.handleSubmit(register);
                        }}
                        >
                          <Form.Input placeholder="Kullanıcı adı" name="username" onChange={this.handleChange} />
                          <Form.Input type="email" placeholder="E-Posta adresi" name="email" onChange={this.handleChange} />
                          <Form.Input type="password" placeholder="Şifre" name="password" onChange={this.handleChange} />
                          <Form.Input type="password" placeholder="Şifre(tekrar)" name="passwordCheck" onChange={this.handleChange} />
                          <Form.Input placeholder="Ünvan" name="degree" onChange={this.handleChange} />
                          <Form.TextArea placeholder="Hakkınızda" name="bio" onChange={this.handleChange} />

                          <Button
                            disabled={formValidation}
                            type="submit"
                            content="Kayıt Ol"
                          />
                        </Form>
                        <Divider />
                        Zaten kayıtlı mısın?
                        <br />
                        <Link to="/giriş" style={{ color: '#49ba6f' }}>Giriş Yap</Link>
                      </Segment>
                    </Grid.Column>
                  </Grid>
                </div>
              )
              : <LogIn isRedirect username={username} />
            }
          </div>
        );
        }
      }
      </Mutation>
    );
  }
}
export default Register;
