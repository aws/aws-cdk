import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';

new Function(scope, 'id', {
  handler: 'handler',
  code: Code.fromInline(''),
  runtime: Runtime.NODEJS_LATEST,
});
