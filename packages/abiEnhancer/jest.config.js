const jestConfig = require('../../jest.config')
jestConfig.transform = {
  '^.+\\.svg$': 'jest-transform-stub'
}
jestConfig.moduleNameMapper = {
  '^axios$': require.resolve('axios'),
}
module.exports = jestConfig
