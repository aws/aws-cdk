const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');

const cpuCount = require('os').cpus().length;

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...baseConfig,
  moduleFileExtensions: [
    'js',
    'ts',
  ],
  // Limit workers to a reasonable fixed number. If we scale in the number of available CPUs, we will explode
  // our memory limit on the CodeBuild instance that has 72 CPUs.
  maxWorkers: Math.min(8, cpuCount - 1),
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // Skips type checking
        isolatedModules: true,
      },
    ],
  },
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
