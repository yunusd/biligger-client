import React from 'react';
import { shallow } from 'enzyme';

import Feed from './Feed';


describe('Feed', () => {
  it('render without crashing', () => {
    const wrapper = shallow(<Feed />).exists();
    expect(wrapper).toBeTruthy();
  });

  it('render correctly', () => {
    const wrapper = shallow(<Feed />);
    expect(wrapper).toMatchSnapshot();
  });
});
