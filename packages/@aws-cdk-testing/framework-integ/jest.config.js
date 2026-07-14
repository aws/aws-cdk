const { jestMaxWorkers } = require('@aws-cdk/cdk-build-tools/config/jest-max-workers');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // Bound jest workers with an absolute cap so this large package does not
  // spawn cpus-1 workers on big CI machines. See cdk-build-tools jest-max-workers.js.
  maxWorkers: jestMaxWorkers(),
  // Purposely only run .js files, not .ts files. This is so that the unit tests
  // here will use the jsii-compiled version of `aws-cdk-lib`, and not the live-interpreted
  // .ts files.
  moduleFileExtensions: [
    'js',
  ],
  testMatch: [
    '<rootDir>/test/**/?(*.)+(test).js',
  ],

  testEnvironment: 'node',
};
