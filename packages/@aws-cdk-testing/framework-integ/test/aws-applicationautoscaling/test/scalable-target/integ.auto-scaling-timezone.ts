import * as cdk from 'aws-cdk-lib/core';
import * as appscaling from 'aws-cdk-lib/aws-applicationautoscaling';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(
  app,
  'aws-cdk-applicationautoscaling-timezone-integ',
);

const fn = new lambda.Function(stack, 'MyLambda', {
  code: new lambda.InlineCode('foo'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_LATEST,
});

const version = fn.currentVersion;

const alias = new lambda.Alias(stack, 'Alias', {
  aliasName: 'prod',
  version,
});

const scalingTarget = alias.addAutoScaling({ minCapacity: 3, maxCapacity: 50 });

scalingTarget.scaleOnSchedule('ScaleUpInTheMorning', {
  schedule: appscaling.Schedule.cron({ hour: '8', minute: '0' }),
  timeZone: 'America/New_York',
  minCapacity: 20,
});

new integ.IntegTest(app, 'ApplicationAutoScalingTimeZone', {
  testCases: [stack],
});

app.synth();
