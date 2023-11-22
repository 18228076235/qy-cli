import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow } from 'enzyme';

it('check app can be shallow render', () => {
  const wrapper = shallow(<App />);
  expect(wrapper.find('.App').exists()).toBe(true);
});
