import { App, Stack } from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Function, InlineCode, Runtime, LogFormat, SystemLogLevel, ApplicationLogLevel } from 'aws-cdk-lib/aws-lambda';

const app = new App();

const stack = new Stack(app, 'aws-cdk-lambda-logging-config');

const logGroup = new logs.LogGroup(stack, 'MyLogGroupWithLogGroupName', {
  logGroupName: 'customLogGroup',
});

new Function(stack, 'LambdaWithLogGroup', {
  code: new InlineCode('foo'),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_18_X,
  logGroup: logGroup,
});

new Function(stack, 'LambdaWithLogGroupAndNoLogGroupName', {
  code: new InlineCode('foo'),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_18_X,
  logGroup: new logs.LogGroup(stack, 'MyLogGroupWithoutLogGroupName'),
});

new Function(stack, 'LambdaWithTextFormat', {
  code: new InlineCode('foo'),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_18_X,
  logFormat: LogFormat.TEXT,
});

new Function(stack, 'LambdaWithJSONFormat', {
  code: new InlineCode('foo'),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_18_X,
  logFormat: LogFormat.JSON,
});

new Function(stack, 'LambdaWithLogLevel', {
  code: new InlineCode('foo'),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_18_X,
  logFormat: LogFormat.JSON,
  systemLogLevel: SystemLogLevel.INFO,
  applicationLogLevel: ApplicationLogLevel.INFO,
});

new integ.IntegTest(app, 'lambda-logging-config', {
  testCases: [stack],
});

app.synth();
