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
  'aws-ecs-patterns',
  'aws-ecs',
  'aws-elasticsearch',
  'aws-globalaccelerator',
  'aws-globalaccelerator-endpoints',
  'aws-iam',
  'aws-lambda-destinations',
  'aws-lambda-event-sources',
  'aws-lambda-nodejs',
  'aws-scheduler-targets',
  'aws-scheduler',
  'aws-secretsmanager',
  'aws-servicecatalog',
  'aws-sns-subscriptions',
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
