import { Template } from '../../../assertions';
import * as batch from '../../../aws-batch';
import { ContainerImage } from '../../../aws-ecs';
import * as events from '../../../aws-events';
import * as targets from '../../../aws-events-targets';
import * as sqs from '../../../aws-sqs';
import { Duration, Size, Stack } from '../../../core';

describe('Batch job event target', () => {
  let stack: Stack;
  let jobQueue: batch.IJobQueue;
  let jobDefinition: batch.IJobDefinition;

  beforeEach(() => {
    stack = new Stack();
    jobQueue = new batch.JobQueue(stack, 'MyQueue', {
      computeEnvironments: [
        {
          computeEnvironment: new batch.UnmanagedComputeEnvironment(stack, 'ComputeEnvironment'),
          order: 1,
        },
      ],
    });
    jobDefinition = new batch.EcsJobDefinition(stack, 'MyJob', {
      container: new batch.EcsEc2ContainerDefinition(stack, 'container', {
        image: ContainerImage.fromRegistry('test-repo'),
        cpu: 256,
        memory: Size.mebibytes(2048),
      }),
    });
  });

  test('use aws batch job as an event rule target', () => {
    // GIVEN
    const rule = new events.Rule(stack, 'Rule', {
      schedule: events.Schedule.expression('rate(1 min)'),
    });

    // WHEN
    rule.addTarget(new targets.BatchJob(jobQueue.jobQueueArn, jobQueue, jobDefinition.jobDefinitionArn, jobDefinition));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      ScheduleExpression: 'rate(1 min)',
      State: 'ENABLED',
      Targets: [
        {
          Arn: {
            'Fn::GetAtt': [
              'MyQueueE6CA6235',
              'JobQueueArn',
            ],
          },
          Id: 'Target0',
          RoleArn: {
            'Fn::GetAtt': [
              'MyJobEventsRoleCF43C336',
              'Arn',
            ],
          },
          BatchParameters: {
            JobDefinition: {
              Ref: 'MyJob8719E923',
            },
            JobName: 'Rule',
          },
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'batch:SubmitJob',
            Effect: 'Allow',
            Resource: [
              { Ref: 'MyJob8719E923' },
              {
                'Fn::GetAtt': [
                  'MyQueueE6CA6235',
                  'JobQueueArn',
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
      Roles: [
        { Ref: 'MyJobEventsRoleCF43C336' },
      ],
    });
  });

  test('use a Dead Letter Queue for the rule target', () => {
    // GIVEN
    const rule = new events.Rule(stack, 'Rule', {
      schedule: events.Schedule.expression('rate(1 hour)'),
    });

    const queue = new sqs.Queue(stack, 'Queue');

    // WHEN
    const eventInput = {
      buildspecOverride: 'buildspecs/hourly.yml',
    };

    rule.addTarget(new targets.BatchJob(
      jobQueue.jobQueueArn,
      jobQueue,
      jobDefinition.jobDefinitionArn,
      jobDefinition, {
        deadLetterQueue: queue,
        event: events.RuleTargetInput.fromObject(eventInput),
      },
    ));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      Targets: [
        {
          Arn: {
            'Fn::GetAtt': [
              'MyQueueE6CA6235',
              'JobQueueArn',
            ],
          },
          Id: 'Target0',
          DeadLetterConfig: {
            Arn: {
              'Fn::GetAtt': [
                'Queue4A7E3555',
                'Arn',
              ],
            },
          },
          Input: JSON.stringify(eventInput),
          RoleArn: {
            'Fn::GetAtt': ['MyJobEventsRoleCF43C336', 'Arn'],
          },
          BatchParameters: {
            JobDefinition: {
              Ref: 'MyJob8719E923',
            },
            JobName: 'Rule',
          },
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SQS::QueuePolicy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sqs:SendMessage',
            Condition: {
              ArnEquals: {
                'aws:SourceArn': {
                  'Fn::GetAtt': [
                    'Rule4C995B7F',
                    'Arn',
                  ],
                },
              },
            },
            Effect: 'Allow',
            Principal: {
              Service: 'events.amazonaws.com',
            },
            Resource: {
              'Fn::GetAtt': [
                'Queue4A7E3555',
                'Arn',
              ],
            },
            Sid: 'AllowEventRuleRule',
          },
        ],
        Version: '2012-10-17',
      },
      Queues: [
        {
          Ref: 'Queue4A7E3555',
        },
      ],
    });
  });

  test('specifying retry policy', () => {
    // GIVEN
    const rule = new events.Rule(stack, 'Rule', {
      schedule: events.Schedule.expression('rate(1 hour)'),
    });

    const queue = new sqs.Queue(stack, 'Queue');

    // WHEN
    const eventInput = {
      buildspecOverride: 'buildspecs/hourly.yml',
    };

    rule.addTarget(new targets.BatchJob(
      jobQueue.jobQueueArn,
      jobQueue,
      jobDefinition.jobDefinitionArn,
      jobDefinition, {
        deadLetterQueue: queue,
        event: events.RuleTargetInput.fromObject(eventInput),
        retryAttempts: 2,
        maxEventAge: Duration.hours(2),
      },
    ));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      ScheduleExpression: 'rate(1 hour)',
      State: 'ENABLED',
      Targets: [
        {
          Arn: {
            'Fn::GetAtt': [
              'MyQueueE6CA6235',
              'JobQueueArn',
            ],
          },
          BatchParameters: {
            JobDefinition: {
              Ref: 'MyJob8719E923',
            },
            JobName: 'Rule',
          },
          DeadLetterConfig: {
            Arn: {
              'Fn::GetAtt': [
                'Queue4A7E3555',
                'Arn',
              ],
            },
          },
          Id: 'Target0',
          Input: JSON.stringify(eventInput),
          RetryPolicy: {
            MaximumEventAgeInSeconds: 7200,
            MaximumRetryAttempts: 2,
          },
          RoleArn: {
            'Fn::GetAtt': [
              'MyJobEventsRoleCF43C336',
              'Arn',
            ],
          },
        },
      ],
    });
  });

  test('specifying retry policy with 0 retryAttempts', () => {
    // GIVEN
    const rule = new events.Rule(stack, 'Rule', {
      schedule: events.Schedule.expression('rate(1 hour)'),
    });

    // WHEN
    const eventInput = {
      buildspecOverride: 'buildspecs/hourly.yml',
    };

    rule.addTarget(new targets.BatchJob(
      jobQueue.jobQueueArn,
      jobQueue,
      jobDefinition.jobDefinitionArn,
      jobDefinition, {
        event: events.RuleTargetInput.fromObject(eventInput),
        retryAttempts: 0,
      },
    ));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      ScheduleExpression: 'rate(1 hour)',
      State: 'ENABLED',
      Targets: [
        {
          Arn: {
            'Fn::GetAtt': [
              'MyQueueE6CA6235',
              'JobQueueArn',
            ],
          },
          BatchParameters: {
            JobDefinition: {
              Ref: 'MyJob8719E923',
            },
            JobName: 'Rule',
          },
          Id: 'Target0',
          Input: JSON.stringify(eventInput),
          RetryPolicy: {
            MaximumRetryAttempts: 0,
          },
          RoleArn: {
            'Fn::GetAtt': [
              'MyJobEventsRoleCF43C336',
              'Arn',
            ],
          },
        },
      ],
    });
  });

  test('should validate jobName minimum and maximum length', () => {
    const rule = new events.Rule(stack, 'Rule', {
      schedule: events.Schedule.expression('rate(1 min)'),
    });

    expect(() => {
      rule.addTarget(
        new targets.BatchJob(
          jobQueue.jobQueueArn,
          jobQueue,
          jobDefinition.jobDefinitionArn,
          jobDefinition,
          {
            jobName: '',
          },
        ),
      );
    }).toThrow(/must have length between 1 and 128/);
    expect(() => {
      rule.addTarget(
        new targets.BatchJob(
          jobQueue.jobQueueArn,
          jobQueue,
          jobDefinition.jobDefinitionArn,
          jobDefinition,
          {
            jobName: 'a'.repeat(200),
          },
        ),
      );
    }).toThrow(/must have length between 1 and 128/);
  });
});
