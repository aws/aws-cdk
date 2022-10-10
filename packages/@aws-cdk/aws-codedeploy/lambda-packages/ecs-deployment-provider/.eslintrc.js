const baseConfig = require('@aws-cdk/cdk-build-tools/config/eslintrc');
baseConfig.parserOptions.project = __dirname + '/tsconfig.json';
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
};