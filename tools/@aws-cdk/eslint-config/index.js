// @ts-check
const typescriptEslint = require('typescript-eslint');
const importPlugin = require('eslint-plugin-import');
const cdklabs = require('@cdklabs/eslint-plugin');
const stylistic = require('@stylistic/eslint-plugin');
const jest =  require('eslint-plugin-jest');
const jsdoc = require('eslint-plugin-jsdoc');

// This cannot reference the build rules from cdk-build-tools as this
// package is itself used by cdk-build-tools.
/** @type { Parameters<import("eslint/config").defineConfig>[0] } */
const config = {
  files: ['**/*.ts'],
  ignores: ['**/*.js', '**/*.d.ts', 'node_modules/', '**/*.generated.ts'],
  plugins: {
    // Prefixes must match (legacy) rule prefixes
    '@cdklabs': cdklabs,
    jest,
    // @ts-ignore
    '@stylistic': stylistic,
    // @ts-ignore
    jsdoc,
  },

  // Necessary for type-checked rules
  languageOptions: {
    parserOptions: {
      projectService: true,
    },
  },
  extends: [
    typescriptEslint.configs.base,
    typescriptEslint.configs.eslintRecommended,
    jest.configs['flat/recommended'],
    importPlugin.flatConfigs.typescript,
    // @ts-ignore
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {},
      typescript: {
        directory: './tsconfig.json',
      },
    },
  },
  rules: require('./rules'),
};

module.exports = config;
