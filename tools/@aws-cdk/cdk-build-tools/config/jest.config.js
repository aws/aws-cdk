const thisPackagesPackageJson = require(`${process.cwd()}/package.json`);
const setupFilesAfterEnv = [];
if ('aws-cdk-lib' in thisPackagesPackageJson.devDependencies ?? {}) {
  // If we depend on aws-cdk-lib, use the provided autoclean hook
  setupFilesAfterEnv.push('aws-cdk-lib/testhelpers/jest-autoclean');
  setupFilesAfterEnv.push('aws-cdk-lib/testhelpers/jest-global-app-testhook');
} else if (thisPackagesPackageJson.name === 'aws-cdk-lib') {
  // If we *ARE* aws-cdk-lib, use the hook in a slightly different way
  setupFilesAfterEnv.push('./testhelpers/jest-autoclean.ts');
  setupFilesAfterEnv.push('./testhelpers/jest-global-app-testhook.ts');
}

// Set context that will apply to all unit tests in this package.
process.env.CDK_CONTEXT_JSON = JSON.stringify({
  '@aws-cdk/core:strictCfnValidateErrors': true,
});

// In VSCode's debug terminal: disable coverage and subprocess spawning,
// so we can more easily attach the debugger to the subprocesses.
const isVsCodeDebugTerminal = process.env.NODE_OPTIONS?.includes('ms-vscode.js-debug') ?? false;

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // The preset deals with preferring TS over JS
  moduleFileExtensions: [
    // .ts first to prefer a ts over a js if present
    'ts',
    'js',
  ],
  testMatch: ['<rootDir>/test/**/?(*.)+(test).ts'],

  // Transform TypeScript using ts-jest. Use of this preset still requires the depending
  // package to depend on `ts-jest` directly.
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest'
    ],
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
  collectCoverage: !isVsCodeDebugTerminal,

  // Not supported via config file :(
  // runInBand: isVsCodeDebugTerminal ? true : undefined,

  coverageReporters: [
    'text-summary', // for console summary
    'cobertura', // for codecov. see https://docs.codecov.com/docs/code-coverage-with-javascript
    'html' // for local deep dive
  ],
  coveragePathIgnorePatterns: ['\\.generated\\.[jt]s$', '<rootDir>/test/', '.warnings.jsii.js$', '/node_modules/'],
  reporters: [
    'default',
    ['jest-junit', { suiteName: 'jest tests', outputDirectory: 'coverage', suiteNameTemplate: '{filepath}', classNameTemplate: '{classname}', titleTemplate: '{title}' }]],

  setupFilesAfterEnv,
};
