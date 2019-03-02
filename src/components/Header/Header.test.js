import React from 'react';
import { shallow } from 'enzyme';
import { Dropdown } from 'semantic-ui-react';

import Header from './Header';

describe('header', () => {
  it('render without crashing', () => {
    const wrapper = shallow(<Header />).exists();
    expect(wrapper).toBeTruthy();
  });

  it('render correctly', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper).toMatchSnapshot();
  });

  it('if user login return different menu', () => {
    localStorage.setItem('access_token', 'dummy-token');
    const wrapper = shallow(<Header />);
    const html = wrapper.find(Dropdown).html();
    expect(html).toContain('Profil');
  });
});
