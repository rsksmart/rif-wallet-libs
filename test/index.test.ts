import { Template } from '../src'

describe('hello', () => {
  test('hello', () => {
    const template = new Template()
    expect(template.hello()).toBe('RIF Web SDK Template')
  })
})
