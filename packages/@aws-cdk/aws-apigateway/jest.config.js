const baseConfig = require('cdk-build-tools/config/jest.config');
module.exports = {
  ...baseConfig,
  coverageThreshold: {
    global: {
      branches: 80,
      statements: 60,
    },
  },
};
