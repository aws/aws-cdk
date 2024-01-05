import { Node } from 'constructs';
import { Template } from '../../../assertions';
import * as lambda from '../../../aws-lambda';
import { Code, Function as lambdaFn } from '../../../aws-lambda';
import { LogGroup, RetentionDays } from '../../../aws-logs';
import { LogLevel } from '../../../aws-stepfunctions';
import { Duration, Stack } from '../../../core';
import { WaiterStateMachine } from '../../lib/provider-framework/waiter-state-machine';

describe('state machine', () => {
  test('contains the needed resources', () => {
    // GIVEN
    const stack = new Stack();
    Node.of(stack).setContext('@aws-cdk/core:target-partitions', ['aws', 'aws-cn']);

    const isCompleteHandler = new lambdaFn(stack, 'isComplete', {
      code: Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
    });
    const timeoutHandler = new lambdaFn(stack, 'isTimeout', {
      code: Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
    });
    const interval = Duration.hours(2);
    const maxAttempts = 2;
    const backoffRate = 5;
    const logGroup = new LogGroup(stack, 'LogGroup', {
      retention: RetentionDays.ONE_DAY,
    });

    // WHEN
    new WaiterStateMachine(stack, 'statemachine', {
      isCompleteHandler,
      timeoutHandler,
      backoffRate,
      interval,
      maxAttempts,
      logOptions: {
        includeExecutionData: true,
        level: LogLevel.ALL,
        destination: logGroup,
      },
    });

    // THEN
    const roleId = 'statemachineRole52044F93';
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      DefinitionString: {
        'Fn::Join': [
          '',
          [
            '{"StartAt":"framework-isComplete-task","States":{"framework-isComplete-task":{"End":true,"Retry":[{"ErrorEquals":["States.ALL"],' +
            `"IntervalSeconds":${interval.toSeconds()},"MaxAttempts":${maxAttempts},"BackoffRate":${backoffRate}}],` +
            '"Catch":[{"ErrorEquals":["States.ALL"],"Next":"framework-onTimeout-task"}],"Type":"Task","Resource":"',
            stack.resolve(isCompleteHandler.functionArn),
            '"},"framework-onTimeout-task":{"End":true,"Type":"Task","Resource":"',
            stack.resolve(timeoutHandler.functionArn),
            '"}}}',
          ],
        ],
      },
      RoleArn: {
        'Fn::GetAtt': [roleId, 'Arn'],
      },
      LoggingConfiguration: {
        Destinations: [
          {
            CloudWatchLogsLogGroup: {
              LogGroupArn: {
                'Fn::GetAtt': [
                  'LogGroupF5B46931',
                  'Arn',
                ],
              },
            },
          },
        ],
        IncludeExecutionData: true,
        Level: 'ALL',
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: {
                'Fn::Join': [
                  '',
                  [
                    'states.',
                    stack.resolve(stack.region),
                    '.amazonaws.com',
                  ],
                ],
              },
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: stack.resolve(isCompleteHandler.resourceArnsForGrantInvoke),
          },
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: stack.resolve(timeoutHandler.resourceArnsForGrantInvoke),
          },
          {
            Action: [
              'logs:CreateLogDelivery',
              'logs:CreateLogStream',
              'logs:GetLogDelivery',
              'logs:UpdateLogDelivery',
              'logs:DeleteLogDelivery',
              'logs:ListLogDeliveries',
              'logs:PutLogEvents',
              'logs:PutResourcePolicy',
              'logs:DescribeResourcePolicies',
              'logs:DescribeLogGroups',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
      Roles: [{ Ref: roleId }],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: 1,
    });
  });

  test('disable logging', () => {
    // GIVEN
    const stack = new Stack();
    Node.of(stack).setContext('@aws-cdk/core:target-partitions', ['aws', 'aws-cn']);

    const isCompleteHandler = new lambdaFn(stack, 'isComplete', {
      code: Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
    });
    const timeoutHandler = new lambdaFn(stack, 'isTimeout', {
      code: Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
    });
    const interval = Duration.hours(2);
    const maxAttempts = 2;
    const backoffRate = 5;

    // WHEN
    new WaiterStateMachine(stack, 'statemachine', {
      isCompleteHandler,
      timeoutHandler,
      backoffRate,
      interval,
      maxAttempts,
      disableLogging: true,
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
  });

  test('default logOptions and required policies will be created if logging is enabled without logOptions specified', () => {
    // GIVEN
    const stack = new Stack();
    Node.of(stack).setContext('@aws-cdk/core:target-partitions', ['aws', 'aws-cn']);

    const isCompleteHandler = new lambdaFn(stack, 'isComplete', {
      code: Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
    });
    const timeoutHandler = new lambdaFn(stack, 'isTimeout', {
      code: Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
    });
    const interval = Duration.hours(2);
    const maxAttempts = 2;
    const backoffRate = 5;

    // WHEN
    new WaiterStateMachine(stack, 'statemachine', {
      isCompleteHandler,
      timeoutHandler,
      backoffRate,
      interval,
      maxAttempts,
    });

    // THEN
    const roleId = 'statemachineRole52044F93';
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      LoggingConfiguration: {
        Destinations: [
          {
            CloudWatchLogsLogGroup: {
              LogGroupArn: {
                'Fn::GetAtt': [
                  'statemachineLogGroupA08E43E4',
                  'Arn',
                ],
              },
            },
          },
        ],
        IncludeExecutionData: false,
        Level: 'ERROR',
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: stack.resolve(isCompleteHandler.resourceArnsForGrantInvoke),
          },
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: stack.resolve(timeoutHandler.resourceArnsForGrantInvoke),
          },
          {
            Action: [
              'logs:CreateLogDelivery',
              'logs:CreateLogStream',
              'logs:GetLogDelivery',
              'logs:UpdateLogDelivery',
              'logs:DeleteLogDelivery',
              'logs:ListLogDeliveries',
              'logs:PutLogEvents',
              'logs:PutResourcePolicy',
              'logs:DescribeResourcePolicies',
              'logs:DescribeLogGroups',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
      Roles: [{ Ref: roleId }],
    });
    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 1);
  });

  test('log group name is specified if the feature flag is set', () => {
    // GIVEN
    const stack = new Stack();
    Node.of(stack).setContext('@aws-cdk/core:target-partitions', ['aws', 'aws-cn']);
    Node.of(stack).setContext('@aws-cdk/custom-resources:changeDefaultLogGroupNameForWaiterStateMachineInCompleteHandler', true);

    const isCompleteHandler = new lambdaFn(stack, 'isComplete', {
      code: Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
    });
    const timeoutHandler = new lambdaFn(stack, 'isTimeout', {
      code: Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
    });
    const interval = Duration.hours(2);
    const maxAttempts = 2;
    const backoffRate = 5;

    // WHEN
    new WaiterStateMachine(stack, 'statemachine', {
      isCompleteHandler,
      timeoutHandler,
      backoffRate,
      interval,
      maxAttempts,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
      LogGroupName: {
        'Fn::Join': [
          '',
          [
            '/aws/vendedlogs/states/waiter-state-machine-',
            {
              Ref: 'isCompleteBBB74F92',
            },
            '-c892b744a2306a661f17f50ce17de4b606ce3fc700',
          ],
        ],
      },
    });
  });
});
