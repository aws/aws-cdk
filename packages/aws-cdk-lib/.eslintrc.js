const baseConfig = require('@aws-cdk/cdk-build-tools/config/eslintrc');
baseConfig.parserOptions.project = __dirname + '/tsconfig.dev.json';
baseConfig.rules['import/no-extraneous-dependencies'] = [
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
];

// Ban construction of these classes for lambda handlers and point authors to use our new code generation tools
const bannedConstructs = {
  'aws-cdk-lib/aws-lambda': [ 'Function', 'SingletonFunction' ],
  'aws-cdk-lib/core': [ 'CustomResourceProvider' ],
}

const restrictedConfig = Object.entries(bannedConstructs).reduce((accum, [module, types]) => {
  return [
    ...accum,
    ...types.map((typeName) => {
      return {
        selector: `NewExpression[callee.name='${typeName}']`,
        message: `Usage of ${module}.${typeName} in 'aws-cdk-lib' is disallowed. Instead, build and code generate a construct for your handler using @aws-cdk/custom-resource-framework`,
      };
    }),
  ]
}, [],)

baseConfig.rules['no-restricted-syntax'] = [
  'error',
  ...restrictedConfig,
]

// Allow usage of disallowed handler constructs in test files
baseConfig.overrides = [
  {
    files: ["*.test.ts"],
    rules: {
      'no-restricted-syntax': 'off',
    }
  }
];

module.exports = baseConfig;
