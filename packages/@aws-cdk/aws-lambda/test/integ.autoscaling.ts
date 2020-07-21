import * as appscaling from '@aws-cdk/aws-applicationautoscaling';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

/**
 * Stack verification steps:
 * aws application-autoscaling describe-scalable-targets --service-namespace lambda --resource-ids function:aws-lambda-autoscaling-<lambda name>:prod
 * has a minCapacity of 3 and maxCapacity of 50
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-lambda-autoscaling');

const fn = new lambda.Function(stack, 'MyLambda', {
  code: new lambda.InlineCode('exports.handler = async () => {\nconsole.log(\'hello world\');\n};'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_10_X,
});

const version = fn.addVersion('1', undefined, 'integ-test');

const alias = new lambda.Alias(stack, 'Alias', {
  aliasName: 'prod',
  version,
});

const scalingTarget = alias.autoScaleProvisionedConcurrency({ minCapacity: 3, maxCapacity: 50 });

scalingTarget.scaleOnUtilization({
  targetUtilizationValue: 0.5,
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
