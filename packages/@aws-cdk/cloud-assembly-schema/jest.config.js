const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');
module.exports = {
  ...baseConfig,
  testMatch: [
    '<rootDir>/**/test/**/?(*.)+(test).ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      statements: 75,
    },
  },
};
