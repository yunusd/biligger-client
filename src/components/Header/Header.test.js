import React from 'react';
import { shallow } from 'enzyme';

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
});
