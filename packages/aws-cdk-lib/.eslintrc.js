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
const enableNoThrowDefaultErrorIn = [
  'aws-lambda',
  'aws-rds',
  'aws-s3',
  'aws-sns',
  'aws-sqs',
  'aws-ssm',
  'aws-ssmcontacts',
  'aws-ssmincidents',
  'aws-ssmquicksetup',
];
baseConfig.overrides.push({
  files: enableNoThrowDefaultErrorIn.map(m => `./${m}/lib/**`),
  rules: { "@cdklabs/no-throw-default-error": ['error'] },
});


module.exports = baseConfig;
