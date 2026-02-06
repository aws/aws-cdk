// @ts-check
const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');
const ext = process.env.CDK_BUILD_TOOLS_TEST_EXT;

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  ...baseConfig,

  // Different than usual
  testMatch: [
    `<rootDir>/**/test/**/?(*.)+(test).${ext}`,
  ],

  coveragePathIgnorePatterns: ['\\.generated\\.[jt]s$', '<rootDir>/.*/test/', '.warnings.jsii.js$', '/node_modules/'],

  // Massive parallellism leads to common timeouts
  testTimeout: 60_000,

  coverageThreshold: {
    global: {
      branches: 35,
      statements: 55,
    },
  },

  testEnvironment: `./testhelpers/jest-bufferedconsole.${ext}`,
};

module.exports = config;
