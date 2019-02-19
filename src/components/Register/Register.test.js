import React from 'react';
import { shallow, mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';

import {
  Button, Modal, Form, Header,
} from 'semantic-ui-react';

import { REGISTER_USER } from './mutations';
import Register from './Register';
import waita from '../../helpers/waita';

describe('Register', () => {
  const user = {
    username: 'foo',
    password: 'bar',
    passwordCheck: 'bar',
    email: 'foo@bar.com',
    degree: 'degg',
    bio: `
    This is a bio sentence and will repeat itself.
    This is a bio sentence and will repeat itself.
    This is a bio sentence and will repeat itself.
    This is a bio sentence and will repeat itself.
    `,
  };

  const {
    username,
    email,
    password,
    passwordCheck,
    degree,
    bio,
  } = user;

  const mocks = [
    {
      request: {
        query: REGISTER_USER,
        variables: {
          username,
          email,
          password,
          passwordCheck,
          degree,
          bio,
        },
      },
      result: { data: { registerUser: { username } } },
    },
  ];

  it('render without crashing', () => {
    const wrapper = shallow(<Register />).exists();
    expect(wrapper).toBeTruthy();
  });

  it('render correctly', () => {
    const wrapper = shallow(<Register />);
    expect(wrapper).toMatchSnapshot();
  });

  it('call handleChange function and set state by values', () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Register button={<Button basic color="green">Kayıt Ol</Button>} />
      </MockedProvider>,
    );

    wrapper.find(Modal).find(Button).simulate('click');
    wrapper.find(Form.Input).at(0)
      .prop('onChange')({ target: { name: 'username', value: username } });

    wrapper.find(Form.Input).at(1)
      .prop('onChange')({ target: { name: 'email', value: email } });

    wrapper.find(Form.Input).at(2)
      .prop('onChange')({ target: { name: 'password', value: password } });

    wrapper.find(Form.Input).at(3)
      .prop('onChange')({ target: { name: 'passwordCheck', value: passwordCheck } });

    wrapper.find(Form.Input).at(4)
      .prop('onChange')({ target: { name: 'degree', value: degree } });

    wrapper.find(Form.TextArea).at(0)
      .prop('onChange')({ target: { name: 'bio', value: bio } });

    const state = wrapper.find(Register).state();
    expect(state).toMatchObject(user);
  });

  it('if credentials are valid then register user', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Register button={<Button basic color="green">Kayıt Ol</Button>} />
      </MockedProvider>,
    );
    wrapper.find(Modal).find(Button).simulate('click');
    wrapper.find(Register).setState(user);
    wrapper.find(Form).find(Button).simulate('submit');
    await waita(2);
    const logInModal = wrapper.update().find(Modal).find(Header);
    expect(logInModal.text()).toContain(username);
  });

  /*
    Apollo waiting a variables which match with mock variables.
    Apollo will throw an error because we don't send user credentials(Variables) and this is
    causing to test not passing. So we used try catch block on handleSubmit function
    because of without it, test not passing.
    But this time it's allowing test to run.
    Component will render error message.
  */
  it('if credentials are wrong then return an error', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Register button={<Button basic color="green">Kayıt Ol</Button>} />
      </MockedProvider>,
    );
    // We don't sending any information
    wrapper.find(Modal).find(Button).simulate('click');
    wrapper.find(Form).find(Button).simulate('submit');
    await waita(2);
    expect(wrapper.find(Header).text()).toContain('Hata');
  });
});
