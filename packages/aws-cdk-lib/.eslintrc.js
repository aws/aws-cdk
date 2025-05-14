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

// no-throw-default-error
baseConfig.rules['@cdklabs/no-throw-default-error'] = ['error'];
// not yet supported
const noThrowDefaultErrorNotYetSupported = [
  'aws-iam',
  'aws-lambda-destinations',
  'aws-lambda-event-sources',
  'aws-lambda-nodejs',
  'aws-secretsmanager',
  'aws-servicecatalog',
  'core',
  'custom-resources',
  'region-info',
];
baseConfig.overrides.push({
  files: [
    "./scripts/**",
    "./*/build-tools/**",
    "./*/test/**",
    ...noThrowDefaultErrorNotYetSupported.map(m => `./${m}/lib/**`)
  ],
  rules: { "@cdklabs/no-throw-default-error": "off" },
});


module.exports = baseConfig;
