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
  'aws-amplify',
  'aws-amplifyuibuilder',  
  'aws-apigatewayv2-authorizers',
  'aws-apigatewayv2-integrations',
  'aws-elasticloadbalancing',
  'aws-elasticloadbalancingv2',
  'aws-elasticloadbalancingv2-actions',
  'aws-elasticloadbalancingv2-targets',
  'aws-lambda',
  'aws-rds',
  'aws-s3',
  'aws-sns',
  'aws-sqs',
  'aws-ssm',
  'aws-ssmcontacts',
  'aws-ssmincidents',
  'aws-ssmquicksetup',
  'aws-apigatewayv2',
  'aws-apigatewayv2-authorizers',
  'aws-synthetics',
  'aws-route53',
  'aws-route53-patterns',
  'aws-route53-targets',
  'aws-route53profiles',
  'aws-route53recoverycontrol',
  'aws-route53recoveryreadiness',
  'aws-route53resolver',
  'aws-sns',
  'aws-sqs',
  'aws-ssm',
  'aws-ssmcontacts',
  'aws-ssmincidents',
  'aws-ssmquicksetup',
  'aws-synthetics',
  'aws-s3',
  'aws-s3-assets',
  'aws-s3-deployment',
  'aws-s3-notifications',
  'aws-s3express',
  'aws-s3objectlambda',
  'aws-s3outposts',
  'aws-s3tables',
];
baseConfig.overrides.push({
  files: enableNoThrowDefaultErrorIn.map(m => `./${m}/lib/**`),
  rules: { "@cdklabs/no-throw-default-error": ['error'] },
});


module.exports = baseConfig;
