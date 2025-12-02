// @ts-check
const { defineConfig } = require('eslint/config');
const typescriptEslint = require('typescript-eslint');
const importPlugin = require('eslint-plugin-import');
const cdklabs = require('@cdklabs/eslint-plugin');
const stylistic = require('@stylistic/eslint-plugin');
const jest =  require('eslint-plugin-jest');
const jsdoc = require('eslint-plugin-jsdoc');
const path = require('path');

module.exports = function(/** @type{string} */ tsconfigFile) {
  tsconfigFile = path.resolve(tsconfigFile);
  const tsConfig = require(tsconfigFile);
  const include = tsConfig?.include ?? [];
  const exclude = tsConfig?.exclude ?? [];

  // This cannot reference the build rules from cdk-build-tools as this
  // package is itself used by cdk-build-tools.
  return defineConfig(
    // Ignores must be an object by itself and apply to all rules, otherwise it won't work.
    { ignores: ['**/*.js'] },
    {
    name: 'aws-cdk/eslint-config',
    files: include,
    ignores: exclude,
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
        tsconfigRootDir: path.dirname(tsconfigFile),
        projectService: true,
      },
    },
    extends: [
      typescriptEslint.configs.base,
      jest.configs['flat/recommended'],
      importPlugin.flatConfigs.typescript,
    ],
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        node: {},
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    rules: require('./rules'),
  });
}