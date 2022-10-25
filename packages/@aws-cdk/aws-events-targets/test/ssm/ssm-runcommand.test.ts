import { Template } from '@aws-cdk/assertions';
import * as events from '@aws-cdk/aws-events';
import * as sqs from '@aws-cdk/aws-sqs';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import * as targets from '../../lib';

test('ssm automation as an event rule target', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const rule = new events.Rule(stack, 'MyRule', {
    schedule: events.Schedule.rate(cdk.Duration.hours(1)),
  });

  // WHEN
  rule.addTarget(new targets.SsmRunCommand(new ssm.CfnDocument(stack, 'MyDocument', {
    content: {},
    documentType: 'Command',
    name: 'my-document',
  }), {
    targetKey: 'InstanceIds',
    targetValues: ['i-asdfiuh2304f'],
  }));

  // THEN

  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 hour)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':ssm:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':document/my-document',
            ],
          ],
        },
        Id: 'Target0',
        RoleArn: {
          'Fn::GetAtt': [
            'MyRuleEventsRoleF186CAE5',
            'Arn',
          ],
        },
        RunCommandParameters: {
          RunCommandTargets: [
            {
              Key: 'InstanceIds',
              Values: [
                'i-asdfiuh2304f',
              ],
            },
          ],
        },
      },
    ],
  });
});

test('dead letter queue is configured correctly', () => {
  const stack = new cdk.Stack();
  const deadLetterQueue = new sqs.Queue(stack, 'MyDeadLetterQueue');
  const rule = new events.Rule(stack, 'MyRule', {
    schedule: events.Schedule.rate(cdk.Duration.hours(1)),
  });

  // WHEN
  rule.addTarget(new targets.SsmRunCommand(new ssm.CfnDocument(stack, 'MyDocument', {
    content: {},
    documentType: 'Command',
    name: 'my-document',
  }), {
    targetKey: 'InstanceIds',
    targetValues: ['i-asdfiuh2304f'],
    deadLetterQueue,
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 hour)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':ssm:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':document/my-document',
            ],
          ],
        },
        Id: 'Target0',
        RoleArn: {
          'Fn::GetAtt': [
            'MyRuleEventsRoleF186CAE5',
            'Arn',
          ],
        },
        RunCommandParameters: {
          RunCommandTargets: [
            {
              Key: 'InstanceIds',
              Values: [
                'i-asdfiuh2304f',
              ],
            },
          ],
        },
        DeadLetterConfig: {
          Arn: {
            'Fn::GetAtt': [
              'MyDeadLetterQueueD997968A',
              'Arn',
            ],
          },
        },
      },
    ],
  });
});

test('specifying retry policy', () => {
  const stack = new cdk.Stack();
  const rule = new events.Rule(stack, 'MyRule', {
    schedule: events.Schedule.rate(cdk.Duration.hours(1)),
  });

  // WHEN
  rule.addTarget(new targets.SsmRunCommand(new ssm.CfnDocument(stack, 'MyDocument', {
    content: {},
    documentType: 'Command',
    name: 'my-document',
  }), {
    targetKey: 'InstanceIds',
    targetValues: ['i-asdfiuh2304f'],
    retryAttempts: 2,
    maxEventAge: cdk.Duration.hours(2),
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 hour)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':ssm:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':document/my-document',
            ],
          ],
        },
        Id: 'Target0',
        RoleArn: {
          'Fn::GetAtt': [
            'MyRuleEventsRoleF186CAE5',
            'Arn',
          ],
        },
        RunCommandParameters: {
          RunCommandTargets: [
            {
              Key: 'InstanceIds',
              Values: [
                'i-asdfiuh2304f',
              ],
            },
          ],
        },
        RetryPolicy: {
          MaximumEventAgeInSeconds: 7200,
          MaximumRetryAttempts: 2,
        },
      },
    ],
  });
});

test('specifying retry policy with 0 retryAttempts', () => {
  const stack = new cdk.Stack();
  const rule = new events.Rule(stack, 'MyRule', {
    schedule: events.Schedule.rate(cdk.Duration.hours(1)),
  });

  // WHEN
  rule.addTarget(new targets.SsmRunCommand(new ssm.CfnDocument(stack, 'MyDocument', {
    content: {},
    documentType: 'Command',
    name: 'my-document',
  }), {
    targetKey: 'InstanceIds',
    targetValues: ['i-asdfiuh2304f'],
    retryAttempts: 0,
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 hour)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':ssm:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':document/my-document',
            ],
          ],
        },
        Id: 'Target0',
        RoleArn: {
          'Fn::GetAtt': [
            'MyRuleEventsRoleF186CAE5',
            'Arn',
          ],
        },
        RunCommandParameters: {
          RunCommandTargets: [
            {
              Key: 'InstanceIds',
              Values: [
                'i-asdfiuh2304f',
              ],
            },
          ],
        },
        RetryPolicy: {
          MaximumRetryAttempts: 0,
        },
      },
    ],
  });
});
