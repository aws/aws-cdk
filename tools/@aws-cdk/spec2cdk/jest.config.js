const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');

module.exports = {
  ...baseConfig,
  testMatch: [
    "**/?(*.)+(test).js",
  ],
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 70,
    },
  },
};
