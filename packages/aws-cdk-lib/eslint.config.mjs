import { makeConfig } from '@aws-cdk/eslint-config';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  makeConfig('tsconfig.json'),
  {
    files: ['region-info/lib/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['../../*'],
          message: '@aws-cdk/region-info must work standalone without aws-cdk-lib imports',
        }],
      }],
    },
  },
);
