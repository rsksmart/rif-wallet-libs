const jestConfig = require('../../jest.config')
jestConfig.transform = {
  '^.+\\.svg$': 'jest-transform-stub'
}
module.exports = jestConfig
