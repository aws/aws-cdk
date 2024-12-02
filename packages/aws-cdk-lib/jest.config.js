const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...baseConfig,

  // Different than usual
  testMatch: [
    '<rootDir>/**/test/**/?(*.)+(test).ts',
  ],

  // Massive parallellism leads to common timeouts
  testTimeout: 60_000,

  coverageThreshold: {
    global: {
      branches: 35,
      statements: 55,
    },
  },
};
