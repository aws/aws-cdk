const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');
module.exports = {
  ...baseConfig,
  coverageThreshold: {
    global: {
      branches: 80,
      statements: 60,
    },
  },
};
