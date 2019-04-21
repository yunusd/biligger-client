import React from 'react';
import { shallow } from 'enzyme';

import Summary from './Summary';

describe('Summary', () => {
  const mock = {
    getLatestPosts: [
      {
        id: '000000000000000000000000',
        title: 'Title',
        content: 'Content',
        author: {
          username: 'Foo',
        },
      },
    ],
  };

  it('render without crashing', () => {
    const wrapper = shallow(<Summary data={mock} />).contains('Foo');
    expect(wrapper).toBeTruthy();
  });

  it('render correctly', () => {
    const wrapper = shallow(<Summary data={mock} />);
    expect(wrapper).toMatchSnapshot();
  });
});
