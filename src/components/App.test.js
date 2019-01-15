import React from 'react';
import ReactDOM from 'react-dom';

import { mount } from 'enzyme';
import { BrowserRouter as Route } from 'react-router-dom';

import waita from '../helpers/waita';

import App from './App';


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Route><App /></Route>, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders correctly', async () => {
  const app = mount(<Route><App /></Route>).html();
  await waita(0);
  expect(app).toMatchSnapshot();
});
