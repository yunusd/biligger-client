import React from 'react';
import { shallow } from 'enzyme';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  Header, Form, FormInput,
} from 'semantic-ui-react';

import waita from '../../helpers/waita';
import LogIn from './LogIn';

describe('LogIn', () => {
  it('render without crashing', () => {
    const wrapper = shallow(<LogIn />).exists();
    expect(wrapper).toBeTruthy();
  });

  it('render correctly', () => {
    const wrapper = shallow(<LogIn />);
    expect(wrapper).toMatchSnapshot();
  });

  it('return username after successful login', () => {
    const wrapper = shallow(<LogIn username="Foo" isRedirect />);
    const login = wrapper.find(Header).dive().find('.huge').text();
    expect(login).toContain('Foo');
  });

  it('change state when input change', () => {
    const wrapper = shallow(<LogIn />);
    wrapper.find(FormInput).at(0).simulate('change', { target: { name: 'username', value: 'foo' } });
    wrapper.find(FormInput).at(1).simulate('change', { target: { name: 'password', value: 'bar' } });
    expect(wrapper.state()).toMatchObject({ username: 'foo', password: 'bar' });
  });

  it('should return an error if credentials are not valid', async () => {
    const mock = new MockAdapter(axios);

    const payload = JSON.stringify({
      username: 'foo',
      password: 'bar',
    });

    mock.onPost('https://localhost:3000/auth').reply(({ url, data }) => {
      if (url === 'https://localhost:3000/auth' && data !== payload) {
        return [400, {
          error: 'wrong credentials!',
        }];
      }
      return {};
    });

    const handleSubmit = jest.fn(res => res);
    const fakeEvent = { preventDefault: () => {} };
    const wrapper = shallow(<LogIn handleSubmit={handleSubmit} />);
    wrapper.find(FormInput).at(0).simulate('change', { target: { name: 'username', value: 'foo2' } });
    wrapper.find(FormInput).at(1).simulate('change', { target: { name: 'password', value: 'bar' } });
    wrapper.find(Form).simulate('submit', fakeEvent);
    await waita(2);

    const error = handleSubmit.mock.results[0]
    ? handleSubmit.mock.results[0].value.response.data.error : false;

    /* manually set error to the state because enzyme doesn't re-render component
    and cause to not pass error message to the component */
    if (error) wrapper.setState({ error });

    expect(wrapper.find(Header).dive().text()).toContain('Hata :('); // HTML
    expect(error).toBe('wrong credentials!'); // Fetch response
    mock.restore();
  });
});
