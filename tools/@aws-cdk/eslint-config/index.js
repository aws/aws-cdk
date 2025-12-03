// @ts-check
import { defineConfig } from 'eslint/config';
import typescriptEslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import cdklabs from '@cdklabs/eslint-plugin';
import stylistic from '@stylistic/eslint-plugin';
import jest from 'eslint-plugin-jest';
import jsdoc from 'eslint-plugin-jsdoc';
import path from 'path';
import fs from 'fs';
import { makeRules } from './rules.js';

export function makeConfig(/** @type{string} */ tsconfigFile) {
  tsconfigFile = path.resolve(tsconfigFile);
  const tsconfigRootDir = path.dirname(tsconfigFile);
  const tsConfig = JSON.parse(fs.readFileSync(tsconfigFile, 'utf-8'));
  const include = tsConfig?.include ?? [];
  const exclude = tsConfig?.exclude ?? [];

  for (let i = 0; i < exclude.length; i++) {
    if (isDirectory(exclude[i])) {
      exclude[i] = `${exclude[i]}/**/*`;
    }
  }

  // Always exclude these
  exclude.push('**/*.d.ts');
  exclude.push('**/*.generated.ts');

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
        tsconfigRootDir,
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
    rules: makeRules(tsconfigRootDir),
  });
}

function isDirectory(/** @type{string} */ p) {
  try {
    const f = fs.statSync(p);
    return f.isDirectory;
  } catch (/** @type{any} */ e) {
    if (e.code === 'ENOENT') {
      return false;
    }
    throw e;
  }
}
