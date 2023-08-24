const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...baseConfig,
  testMatch: [
    '<rootDir>/**/test/**/?(*.)+(test).ts',
  ],

  coverageThreshold: {
    global: {
      branches: 35,
      statements: 55,
    },
  },
};
