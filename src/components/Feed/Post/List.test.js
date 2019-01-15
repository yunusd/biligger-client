import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { MockedProvider } from 'react-apollo/test-utils';
import { mount, shallow } from 'enzyme';

import waita from '../../../helpers/waita';

import GET_LATEST_POSTS from './queries';
import List from './List';

describe('List', () => {
  const mock = [
    {
      request: {
        query: GET_LATEST_POSTS,
      },
      result: {
        data: {
          getLatestPosts: [
            {
              id: 1,
              title: 'Title',
              content: 'Content',
              url: 'https://google.com',
              createdAt: Date.now(),
              author: {
                username: 'Foo',
              },
            },
          ],
        },
      },
    },
  ];

  it('render without crashing', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mock} addTypename={false}>
        <Router>
          <List />
        </Router>
      </MockedProvider>,
    );
    await waita(1);
    const output = !(wrapper.html().search('Foo') < 0); // if can't find anything then returning -1
    expect(output).toBeTruthy();
  });

  it('render correctly', () => {
    const wrapper = shallow(<List />);
    expect(wrapper).toMatchSnapshot();
  });
});
