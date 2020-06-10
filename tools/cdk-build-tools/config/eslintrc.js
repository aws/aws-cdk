module.exports = {
  env: {
    jest: true,
    node: true
  },
  plugins: [
    '@typescript-eslint',
    'import'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: '2018',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  extends: [
    'plugin:import/typescript'
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      node: {},
      typescript: {
        directory: './tsconfig.json'
      }
    }
  },
  ignorePatterns: [ '*.js', '*.d.ts', 'node_modules/', '*.generated.ts' ],
  rules: {
    '@typescript-eslint/adjacent-overload-signatures': 'error',

    '@typescript-eslint/ban-types': [ 'error', {
      types: {
        Object: {
          message: 'Avoid using the `Object` type. Did you mean `object`?'
        },
        Function: {
          message: 'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.'
        },
        Boolean: {
          message: 'Avoid using the `Boolean` type. Did you mean `boolean`?'
        },
        Number: {
          message: 'Avoid using the `Number` type. Did you mean `number`?'
        },
        String: {
          message: 'Avoid using the `String` type. Did you mean `string`?'
        },
        Symbol: {
          message: 'Avoid using the `Symbol` type. Did you mean `symbol`?'
        }
      }
    }],

    '@typescript-eslint/consistent-type-assertions': [ 'error' ],

    // Require use of the `import { foo } from 'bar';` form instead of `import foo = require('bar');`
    '@typescript-eslint/no-require-imports': [ 'error' ],

     // ensures clean diffs, see https://medium.com/@nikgraf/why-you-should-enforce-dangling-commas-for-multiline-statements-d034c98e36f8
    'comma-dangle': [ 'error', 'always-multiline' ],

    // Require all imported dependencies are actually declared in package.json
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [               // Only allow importing devDependencies from:
          '**/build-tools/**',           // --> Build tools
          '**/test/**'                   // --> Unit tests
        ],
        optionalDependencies: false,    // Disallow importing optional dependencies (those shouldn't be in use in the project)
        peerDependencies: false         // Disallow importing peer dependencies (that aren't also direct dependencies)
      }
    ],

    // Require all imported libraries actually resolve (!!required for import/no-extraneous-dependencies to work!!)
    'import/no-unresolved': [ 'error' ],

    indent: [ 'error', 2 ],

    quotes: [ 'error', 'single', { avoidEscape: true } ],

    semi: [ 'error', 'always' ],
  }
}
