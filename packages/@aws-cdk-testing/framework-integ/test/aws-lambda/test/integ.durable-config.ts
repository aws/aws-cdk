import * as lambda from 'aws-cdk-lib/aws-lambda';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack, Duration } from 'aws-cdk-lib';

const app = new App();
const stack = new Stack(app, 'aws-cdk-lambda-durable-config');

new lambda.Function(stack, 'DurableFunction', {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200, body: "Hello World" });'),
  durableConfig: { executionTimeout: Duration.hours(1), retentionPeriod: Duration.days(30) },
});

new IntegTest(app, 'lambda-durable-config', {
  testCases: [stack],
});

app.synth();
