import * as lambda from 'aws-cdk-lib/aws-lambda';

new lambda.Function(scope, 'id', {
  handler: 'handler',
  code: lambda.Code.fromInline(''),
  runtime: lambda.Runtime.NODEJS_LATEST,
});
