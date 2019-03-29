import React from 'react'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import App from '../../src/common/App'

configure({ adapter: new Adapter() })

describe('App Component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<App />)
  })

  it('should exist', () => {
    expect(wrapper).toBeTruthy()
  })
  
  it('should have one heading', () => {
    expect(wrapper.find('#app').type()).toEqual('div')
  })
})
