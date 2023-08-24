import { cpus } from 'os';

// eslint-disable-next-line jest/no-jest-import
import type { Config } from 'jest';

module.exports = {
  moduleFileExtensions: [
    // .ts first to prefer a ts over a js if present
    'ts',
    'js',
  ],
  testMatch: [
    '<rootDir>/test/**/?(*.)+(test).ts',
  ],

  // Limit workers to a reasonable fixed number. If we scale in the number of available CPUs, we will explode
  // our memory limit on the CodeBuild instance that has 72 CPUs.
  maxWorkers: Math.min(8, cpus().length - 1),

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

  // Need to use a custom resolver because ts-jest only does single-module
  // compilation. Jest will hook into all require() calls, and if both a `.ts`
  // and `.js` file are available the original implementation will always load
  // the `.js` file (so if the `.ts` file has changed, we won't see the changes).
  // resolver: '@aws-cdk/cdk-build-tools/ts-jest-preset/ts-resolver',
} satisfies Config;