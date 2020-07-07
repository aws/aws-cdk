import * as appscaling from '@aws-cdk/aws-applicationautoscaling';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-lambda-autoscaling-2');

const fn = new lambda.Function(stack, 'MyLambda', {
  code: new lambda.InlineCode('foo'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_10_X,
});

const version = fn.addVersion('1', undefined, 'integ-test');

const alias = new lambda.Alias(stack, 'Alias', {
  aliasName: 'prod',
  version,
});

const scalingTarget = alias.autoScaleProvisionedConcurrency({ minCapacity: 1, maxCapacity: 50 });

scalingTarget.scaleOnUtilization({
  targetUtilizationPercent: 50,
});

scalingTarget.scaleOnSchedule('ScaleUpInTheMorning', {
  schedule: appscaling.Schedule.cron({ hour: '8', minute: '0'}),
  minCapacity: 20,
});

scalingTarget.scaleOnSchedule('ScaleDownAtNight', {
  schedule: appscaling.Schedule.cron({ hour: '20', minute: '0'}),
  maxCapacity: 20,
});

app.synth();