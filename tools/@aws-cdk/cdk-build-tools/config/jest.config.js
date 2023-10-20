const { cpus } = require('os');

module.exports = {
  // The preset deals with preferring TS over JS
  moduleFileExtensions: [
    // .ts first to prefer a ts over a js if present
    'ts',
    'js',
  ],
  testMatch: [
    '<rootDir>/test/**/?(*.)+(test).ts',
  ],

  // Transform TypeScript using ts-jest. Use of this preset still requires the depending
  // package to depend on `ts-jest` directly.
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // Skips type checking
        isolatedModules: true,
      },
    ],
  },

  // Limit workers to a reasonable fixed number. If we scale in the number of available CPUs, we will explode
  // our memory limit on the CodeBuild instance that has 72 CPUs.
  maxWorkers: Math.min(8, cpus().length - 1),

  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 80,
      statements: 80,
    },
  },
  collectCoverage: true,
  coverageReporters: [
    'lcov',
    'html',
    'text-summary',
    ['text', { file: 'coverage.txt' }],
  ],
  coveragePathIgnorePatterns: [
    '\\.generated\\.[jt]s$',
    '<rootDir>/test/',
    '.warnings.jsii.js$',
    '/node_modules/',
  ],
  reporters: [
    'default',
    ['jest-junit', { suiteName: 'jest tests', outputDirectory: 'coverage' }],
  ],
};
