const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...baseConfig,
  transform: {
    '^.+\\.tsx?$': ['ts-jest'],
  },
};
