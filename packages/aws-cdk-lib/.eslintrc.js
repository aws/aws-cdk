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
const modules = ['aws-s3', 'aws-lambda', 'aws-rds', 'aws-sns', 'aws-sqs'];
baseConfig.overrides.push({
  files: modules.map(m => `./${m}/lib/**`),
  rules: { "@cdklabs/no-throw-default-error": ['error'] },
});


module.exports = baseConfig;
