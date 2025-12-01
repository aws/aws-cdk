const baseConfig = require('@aws-cdk/cdk-build-tools/config/eslintrc');
baseConfig.parserOptions.project = __dirname + '/tsconfig.json';
module.exports = {
  ...baseConfig,
  rules: {
    // The line below should have been here, but wasn't. There are now a shitton
    // of linter warnings that I don't want to deal with. Just get the most important ones.
    /* ...baseConfig.rules, */

    // One of the easiest mistakes to make
    '@typescript-eslint/no-floating-promises': ['error'],

    // Make sure that inside try/catch blocks, promises are 'return await'ed
    // (must disable the base rule as it can report incorrect errors)
    'no-return-await': 'off',
    '@typescript-eslint/return-await': 'error',

    'no-console': 'off',
    'jest/valid-expect': 'off',
  },
};
