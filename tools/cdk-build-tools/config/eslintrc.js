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
    // Require use of the `import { foo } from 'bar';` form instead of `import foo = require('bar');`
    '@typescript-eslint/no-require-imports': [ 'error' ],
    '@typescript-eslint/indent': [ 'error', 2 ],

    // Style
    'quotes': [ 'error', 'single', { avoidEscape: true } ],
    'comma-dangle': [ 'error', 'always-multiline' ], // ensures clean diffs, see https://medium.com/@nikgraf/why-you-should-enforce-dangling-commas-for-multiline-statements-d034c98e36f8

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
    'import/no-unresolved': [ 'error' ]
  }
}
