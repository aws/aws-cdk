import * as logs from 'aws-cdk-lib/aws-logs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-lambda-log-retention');

new lambda.Function(stack, 'OneWeek', {
  code: new lambda.InlineCode('exports.handler = (event) => console.log(JSON.stringify(event));'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
  logRetention: logs.RetentionDays.ONE_WEEK,
  logRemovalPolicy: cdk.RemovalPolicy.DESTROY,
});

new lambda.Function(stack, 'OneMonth', {
  code: new lambda.InlineCode('exports.handler = (event) => console.log(JSON.stringify(event));'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
  logRetention: logs.RetentionDays.ONE_MONTH,
  logRemovalPolicy: cdk.RemovalPolicy.DESTROY,
});

new lambda.Function(stack, 'OneYear', {
  code: new lambda.InlineCode('exports.handler = (event) => console.log(JSON.stringify(event));'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
  logRetention: logs.RetentionDays.ONE_YEAR,
  logRemovalPolicy: cdk.RemovalPolicy.DESTROY,
});

new IntegTest(app, 'LambdaLogRetentionInteg', {
  testCases: [stack],
  diffAssets: true,
});
