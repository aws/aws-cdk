import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ScheduleExpression } from '../lib';
import { Schedule } from '../lib/private';
import { targets } from '../lib/target';

describe('schedule target', () => {
  let stack: Stack;
  let func: lambda.IFunction;
  const expr = ScheduleExpression.at(new Date(Date.UTC(1969, 10, 20, 0, 0, 0)));

  beforeEach(() => {
    const app = new App();
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
    func = lambda.Function.fromFunctionArn(stack, 'Function', 'arn:aws:lambda:us-east-1:123456789012:function/somefunc');
  });

  test('creates IAM policy lambda target in the same account', () => {
    const lambdaTarget = new targets.LambdaInvoke(func, {});

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: lambdaTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: 'arn:aws:lambda:us-east-1:123456789012:function/somefunc',
          RoleArn: { 'Fn::GetAtt': ['FunctionSchedulesRole3B6FB2A2', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: [
              'arn:aws:lambda:us-east-1:123456789012:function/somefunc',
              'arn:aws:lambda:us-east-1:123456789012:function/somefunc:*',
            ],
          },
        ],
      },
      Roles: [{ Ref: 'FunctionSchedulesRole3B6FB2A2' }],
    });
  });
});