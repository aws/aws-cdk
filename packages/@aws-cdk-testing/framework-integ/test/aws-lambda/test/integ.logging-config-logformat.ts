import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { ApplicationLogLevel, Function, InlineCode, Runtime, SystemLogLevel } from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';

const app = new App();

const stack = new Stack(app, 'aws-cdk-lambda-logging-config-logformat');

const logGroup = new logs.LogGroup(stack, 'MyLogGroupWithLogGroupName', {
  logGroupName: 'customStringLogFormatLogGroup',
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

new Function(stack, 'LambdaWithStringTextFormat', {
  code: new InlineCode('foo'),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_18_X,
  logFormat: 'Text',
});

new Function(stack, 'LambdaWithStringJSONFormat', {
  code: new InlineCode('foo'),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_18_X,
  logFormat: 'JSON',
});

new Function(stack, 'LambdaWithLogLevel', {
  code: new InlineCode('foo'),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_18_X,
  logFormat: 'JSON',
  systemLogLevel: SystemLogLevel.INFO,
  applicationLogLevel: ApplicationLogLevel.INFO,
});

new integ.IntegTest(app, 'lambda-logging-config-logformat', {
  testCases: [stack],
});

app.synth();
