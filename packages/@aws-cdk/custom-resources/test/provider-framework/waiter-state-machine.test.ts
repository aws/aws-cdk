import { Template } from '@aws-cdk/assertions';
import { Code, Function as lambdaFn, Runtime } from '@aws-cdk/aws-lambda';
import { Duration, Stack } from '@aws-cdk/core';
import { Node } from 'constructs';
import { WaiterStateMachine } from '../../lib/provider-framework/waiter-state-machine';

describe('state machine', () => {
  test('contains the needed resources', () => {
    // GIVEN
    const stack = new Stack();
    Node.of(stack).setContext('@aws-cdk/core:target-partitions', ['aws', 'aws-cn']);

    const isCompleteHandler = new lambdaFn(stack, 'isComplete', {
      code: Code.fromInline('foo'),
      runtime: Runtime.NODEJS_14_X,
      handler: 'index.handler',
    });
    const timeoutHandler = new lambdaFn(stack, 'isTimeout', {
      code: Code.fromInline('foo'),
      runtime: Runtime.NODEJS_14_X,
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
        ],
        Version: '2012-10-17',
      },
      Roles: [{ Ref: roleId }],
    });
  });
});
