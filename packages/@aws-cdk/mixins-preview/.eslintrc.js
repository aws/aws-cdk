const baseConfig = require('@aws-cdk/cdk-build-tools/config/eslintrc');

const localConfig = {
  ...baseConfig,
  parserOptions: {
    ...baseConfig.parserOptions,
    project: __dirname + '/tsconfig.json',
  },
  rules: {
    ...baseConfig.rules,
    'import/order': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/build-tools/**',
          '**/scripts/**',
          '**/test/**',
        ],
        optionalDependencies: false,
        peerDependencies: true,
      }
    ],

    // Cannot import from the same module twice (we prefer `import/no-duplicate` over `no-duplicate-imports` since the former can handle type imports)]
    'no-duplicate-imports': 'off',
    'import/no-duplicates': 'error',

    // prefer type imports
    '@typescript-eslint/consistent-type-imports': 'error'
  }
};

module.exports = localConfig;
