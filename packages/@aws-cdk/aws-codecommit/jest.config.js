const baseConfig = require('../../../tools/cdk-build-tools/config/jest.config');
module.exports = {
  ...baseConfig,
  coverageThreshold: {
    global: {
      branches: 55,
      statements: 60
    }
  }
};
