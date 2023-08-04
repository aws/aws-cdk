const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...baseConfig,
  moduleFileExtensions: [
    'js',
    'ts',
  ],
  maxWorkers: '50%',
  preset: 'ts-jest',
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
