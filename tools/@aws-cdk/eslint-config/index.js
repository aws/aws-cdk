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
import { makeRules, makeTestRules } from './rules.js';

export function makeConfig(/** @type{string} */ tsconfigFile, /** @type{any} */ options) {
  options = options ?? {};
  tsconfigFile = path.resolve(tsconfigFile);
  const tsconfigRootDir = path.dirname(tsconfigFile);
  const tsConfig = JSON.parse(fs.readFileSync(tsconfigFile, 'utf-8'));
  const include = tsConfig?.include ?? [];
  const exclude = tsConfig?.exclude ?? [];

  const currentPackageJson = JSON.parse(fs.readFileSync(`${tsconfigRootDir}/package.json`, 'utf-8'));
  const isConstructLibrary = currentPackageJson.name === 'aws-cdk-lib' || ('aws-cdk-lib' in (currentPackageJson.peerDependencies ?? {}));

  for (let i = 0; i < exclude.length; i++) {
    if (isDirectory(exclude[i])) {
      exclude[i] = `${exclude[i]}/**/*`;
    }
  }

  // Always exclude these
  exclude.push('**/*.d.ts');
  exclude.push('**/*.generated.ts');

  /** @type{ Parameters<typeof defineConfig>[0] }*/
  const prodConfig = {
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
  };

  const testConfig = {
    name: 'aws-cdk/eslint-config/tests',
    files: [
      'test/**/*.ts',
      '*/test/**/*.ts',
      'build-tools/**/*.ts',
      '*/build-tools/**/*.ts',
      'scripts/**/*.ts',
      '*/scripts/**/*.ts',
    ],
    ignores: exclude,
    plugins: {
      // Prefixes must match (legacy) rule prefixes
      '@cdklabs': cdklabs,
    },
  };

  return defineConfig(
    // Ignores must be an object by itself and apply to all rules, otherwise it won't work.
    { ignores: ['**/*.js'] },
    { ...prodConfig, rules: makeRules(isConstructLibrary) },
    // Apply some more rules to test files (used to switch some rules off again)
    isConstructLibrary ? { ...testConfig, rules: makeTestRules(isConstructLibrary) } : {},
  );
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
