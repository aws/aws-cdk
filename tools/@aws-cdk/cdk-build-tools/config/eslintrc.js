/**
 * JavaScript and generic rules:
 *
 *     https://eslint.org/docs/rules/
 *
 * TypeScript-specific rules (including migrations from TSlint), see here:
 *
 *     https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/ROADMAP.md
 */
module.exports = {
  env: {
    jest: true,
    node: true,
  },
  plugins: [
    '@typescript-eslint',
    'import',
    '@cdklabs',
    '@stylistic',
    'jest',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: '2018',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  extends: [
    'plugin:import/typescript',
    'plugin:jest/recommended',
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
  ignorePatterns: ['*.js', '*.d.ts', 'node_modules/', '*.generated.ts'],
  rules: {
    '@cdklabs/no-core-construct': ['error'],
    '@cdklabs/invalid-cfn-imports': ['error'],
    '@cdklabs/no-literal-partition': ['error'],
    '@cdklabs/no-invalid-path': [ 'error' ],
    '@cdklabs/promiseall-no-unbounded-parallelism': [ 'error' ],

    // Error handling
    'no-throw-literal': [ 'error' ],

    // Require use of the `import { foo } from 'bar';` form instead of `import foo = require('bar');`
    '@typescript-eslint/no-require-imports': ['error'],
    '@stylistic/indent': ['error', 2],

    // Style
    'quotes': ['error', 'single', { avoidEscape: true }],
    '@stylistic/member-delimiter-style': ['error'], // require semicolon delimiter
    '@stylistic/comma-dangle': ['error', 'always-multiline'], // ensures clean diffs, see https://medium.com/@nikgraf/why-you-should-enforce-dangling-commas-for-multiline-statements-d034c98e36f8
    'comma-spacing': ['error', { before: false, after: true }], // space after, no space before
    'no-multi-spaces': ['error', { ignoreEOLComments: false }], // no multi spaces
    'array-bracket-spacing': ['error', 'never'], // [1, 2, 3]
    'array-bracket-newline': ['error', 'consistent'], // enforce consistent line breaks between brackets
    'object-curly-spacing': ['error', 'always'], // { key: 'value' }
    'object-curly-newline': ['error', { multiline: true, consistent: true }], // enforce consistent line breaks between braces
    'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }], // enforce "same line" or "multiple line" on object properties
    'keyword-spacing': ['error'], // require a space before & after keywords
    'brace-style': ['error', '1tbs', { allowSingleLine: true }], // enforce one true brace style
    'space-before-blocks': 'error', // require space before blocks
    'curly': ['error', 'multi-line', 'consistent'], // require curly braces for multiline control statements
    'eol-last': ["error", "always"], // require a newline a the end of files

    // Require all imported dependencies are actually declared in package.json
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [ // Only allow importing devDependencies from:
          '**/build-tools/**', // --> Build tools
          '**/test/**', // --> Unit tests
        ],
        optionalDependencies: false, // Disallow importing optional dependencies (those shouldn't be in use in the project)
      },
    ],

    // Require all imported libraries actually resolve (!!required for import/no-extraneous-dependencies to work!!)
    'import/no-unresolved': ['error'],

    // Require an ordering on all imports
    'import/order': ['error', {
      groups: ['builtin', 'external'],
      alphabetize: { order: 'asc', caseInsensitive: true },
    }],

    // disallow import of deprecated punycode package
    'no-restricted-imports': [
      'error', {
        paths: [
          {
            name: 'punycode',
            message: `Package 'punycode' has to be imported with trailing slash, see warning in https://github.com/bestiejs/punycode.js#installation`,
          },
        ],
        patterns: ['!punycode/'],
      },
    ],

    // Cannot import from the same module twice
    'no-duplicate-imports': ['error'],

    // Cannot shadow names
    'no-shadow': ['off'],
    '@typescript-eslint/no-shadow': ['error'],

    // Required spacing in property declarations (copied from TSLint, defaults are good)
    'key-spacing': ['error'],

    // Require semicolons
    'semi': ['error', 'always'],

    // Don't unnecessarily quote properties
    'quote-props': ['error', 'consistent-as-needed'],

    // No multiple empty lines
    'no-multiple-empty-lines': ['error', { 'max': 1 }],

    // Max line lengths
    'max-len': ['error', {
      code: 150,
      ignoreUrls: true, // Most common reason to disable it
      ignoreStrings: true, // These are not fantastic but necessary for error messages
      ignoreTemplateLiterals: true,
      ignoreComments: true,
      ignoreRegExpLiterals: true,
    }],

    // One of the easiest mistakes to make
    '@typescript-eslint/no-floating-promises': ['error'],

    // Make sure that inside try/catch blocks, promises are 'return await'ed
    // (must disable the base rule as it can report incorrect errors)
    'no-return-await': 'off',
    '@typescript-eslint/return-await': 'error',

    // Don't leave log statements littering the premises!
    'no-console': ['error'],

    // Useless diff results
    'no-trailing-spaces': ['error'],

    // Must use foo.bar instead of foo['bar'] if possible
    'dot-notation': ['error'],

    // Must use 'import' statements (disabled because it doesn't add a lot over no-require-imports)
    // '@typescript-eslint/no-var-requires': ['error'],

    // Are you sure | is not a typo for || ?
    'no-bitwise': ['error'],

    // No more md5, will break in FIPS environments
    "no-restricted-syntax": [
      "error",
      {
        // Both qualified and unqualified calls
        "selector": "CallExpression:matches([callee.name='createHash'], [callee.property.name='createHash']) Literal[value='md5']",
        "message": "Use the md5hash() function from the core library if you want md5"
      }
    ],

    // Oh ho ho naming. Everyone's favorite topic!
    // FIXME: there's no way to do this properly. The proposed tslint replacement
    // works very differently, also checking names in object literals, which we use all over the
    // place for configs, mockfs, nodeunit tests, etc.
    //
    // The maintainer does not want to change behavior.
    // https://github.com/typescript-eslint/typescript-eslint/issues/1483
    //
    // There is no good replacement for tslint's name checking, currently. We will have to make do
    // with jsii's validation.
    /*
    '@typescript-eslint/naming-convention': ['error',

      // We could maybe be more specific in a number of these but I didn't want to
      // spend too much effort. Knock yourself out if you feel like it.
      { selector: 'enumMember', format: ['PascalCase', 'UPPER_CASE'] },
      { selector: 'variableLike', format: ['camelCase', 'UPPER_CASE'], leadingUnderscore: 'allow' },
      { selector: 'typeLike', format: ['PascalCase'], leadingUnderscore: 'allow' },
      { selector: 'memberLike', format: ['camelCase', 'PascalCase', 'UPPER_CASE'], leadingUnderscore: 'allow' },

      // FIXME: there's no way to disable name checking in object literals. Maintainer won't have it
      // https://github.com/typescript-eslint/typescript-eslint/issues/1483
    ],
    */

    // Member ordering
    '@typescript-eslint/member-ordering': ['error', {
      default: [
        'public-static-field',
        'public-static-method',
        'protected-static-field',
        'protected-static-method',
        'private-static-field',
        'private-static-method',

        'field',

        // Constructors
        'constructor', // = ["public-constructor", "protected-constructor", "private-constructor"]

        // Methods
        'method',
      ],
    }],

    // Overrides for plugin:jest/recommended
    "jest/expect-expect": "off",
    "jest/no-conditional-expect": "off",
    "jest/no-done-callback": "off", // Far too many of these in the codebase.
    "jest/no-standalone-expect": "off", // nodeunitShim confuses this check.
    "jest/valid-expect": "off", // expect from '@aws-cdk/assert' can take a second argument
    "jest/valid-title": "off", // A little over-zealous with test('test foo') being an error.
    "jest/no-identical-title": "off", // TEMPORARY - Disabling this until https://github.com/jest-community/eslint-plugin-jest/issues/836 is resolved
    'jest/no-disabled-tests': 'error', // Skipped tests are easily missed in PR reviews
    'jest/no-focused-tests': 'error', // Focused tests are easily missed in PR reviews
  },
};
