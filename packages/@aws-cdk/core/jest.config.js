const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');
module.exports = {
  ...baseConfig,
  coverageThreshold: {
    global: {
      branches: 60,
      statements: 75,
    }
  }
};
