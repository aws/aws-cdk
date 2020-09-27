const baseConfig = require('cdk-build-tools/config/jest.config');
module.exports = {
  ...baseConfig,
  coverageThreshold: {
    global: {
      branches: 75,
      statements: 80,
    }
  }
};
