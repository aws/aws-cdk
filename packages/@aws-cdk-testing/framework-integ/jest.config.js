/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
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
