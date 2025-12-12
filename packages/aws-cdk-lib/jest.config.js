// @ts-check
const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  ...baseConfig,

  // Different than usual
  testMatch: [
    `<rootDir>/**/test/**/?(*.)+(test).ts`,
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

  testEnvironment: './testhelpers/jest-bufferedconsole.ts',
};

module.exports = config;
