// @ts-check
// Crazy stuff!
//
// On developer boxes we want to run the .ts files directly for quickest
// iteration (save -> run), but on CI machines we want to run the compiled
// JavaScript for highest throughput.
const ext = require('./ext');

const thisPackagesPackageJson = require(`${process.cwd()}/package.json`);
const setupFilesAfterEnv = [];
if ('aws-cdk-lib' in (thisPackagesPackageJson.devDependencies ?? {})) {
  // If we depend on aws-cdk-lib, use the provided autoclean hook
  setupFilesAfterEnv.push('aws-cdk-lib/testhelpers/jest-autoclean');
} else if (thisPackagesPackageJson.name === 'aws-cdk-lib') {
  // If we *ARE* aws-cdk-lib, use the hook in a slightly different way
  setupFilesAfterEnv.push(`./testhelpers/jest-autoclean.${ext}`);
}

// @ts-check
/** @type {import('jest').Config} */
const config = {
  // The preset deals with preferring TS over JS
  moduleFileExtensions: [
    // .ts first to prefer a ts over a js if present
    'ts',
    'js',
  ],
  testMatch: [`<rootDir>/test/**/?(*.)+(test).${ext}`],

  // Transform TypeScript using ts-jest. Use of this preset still requires the depending
  // package to depend on `ts-jest` directly. We need to use `babel-jest` on .js files to
  // make sure `jest.mock` calls are hoisted to the top of every test file.
  transform: {
    "\\.jsx?$": ["babel-jest", {}],
    '^.+\\.tsx?$': ['ts-jest', { tsConfig: 'tsconfig.json' }],
  },
  // Jest is resource greedy so this shouldn't be more than 50%
  maxWorkers: '50%',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 80,
      statements: 80,
    },
  },
  collectCoverage: true,
  coverageReporters: [
    'text-summary', // for console summary
    'cobertura', // for codecov. see https://docs.codecov.com/docs/code-coverage-with-javascript
    'html' // for local deep dive
  ],
  coveragePathIgnorePatterns: ['\\.generated\\.[jt]s$', '<rootDir>/test/', '.warnings.jsii.js$', '/node_modules/'],
  reporters: ['default', ['jest-junit', { suiteName: 'jest tests', outputDirectory: 'coverage' }]],

  // A consequence of doing this is that snapshots files are always named after
  // the currently executing file, which will be different for .ts and .js
  // extensions, so we need to do some more work to redirect always to .ts
  snapshotResolver: `${__dirname}/snapshot-resolver.js`,

  setupFilesAfterEnv,
};

module.exports = config;