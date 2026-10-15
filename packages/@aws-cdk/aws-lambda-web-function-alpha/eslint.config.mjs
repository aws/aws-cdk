import { makeConfig } from '@aws-cdk/eslint-config';

export default [
  ...makeConfig('tsconfig.json'),
  {
    // The copy handler runs in the Lambda runtime, which provides the SDK, so the package does not ship it
    files: ['lib/copy-asset/index.ts'],
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },
];
