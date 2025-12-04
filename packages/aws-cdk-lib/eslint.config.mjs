import { makeConfig } from '@aws-cdk/eslint-config';

// We have 2 different projects in this directory with different sets of files.
export default makeConfig('tsconfig.json');
