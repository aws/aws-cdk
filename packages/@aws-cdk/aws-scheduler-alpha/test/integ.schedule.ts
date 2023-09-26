import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as scheduler from '../lib';

class SomeLambdaTarget implements scheduler.IScheduleTarget {
  public constructor(private readonly fn: lambda.IFunction, private readonly role: iam.IRole) {
  }

  public bind(): scheduler.ScheduleTargetConfig {
    return {
      arn: this.fn.functionArn,
      role: this.role,
    };
  }
}

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-scheduler-schedule');

const expression = scheduler.ScheduleExpression.rate(cdk.Duration.hours(12));
const func = new lambda.Function(stack, 'Function', {
  code: new lambda.InlineCode('foo'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_LATEST,
});
const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
});

const target = new SomeLambdaTarget(func, role);

new scheduler.Schedule(stack, 'DefaultSchedule', {
  schedule: expression,
  target: target,
});

new scheduler.Schedule(stack, 'DisabledSchedule', {
  schedule: expression,
  target: target,
  enabled: false,
});

new IntegTest(app, 'integtest-schedule', {
  testCases: [stack],
});