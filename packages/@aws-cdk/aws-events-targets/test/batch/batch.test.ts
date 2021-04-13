import { expect, haveResource } from '@aws-cdk/assert-internal';
import * as batch from '@aws-cdk/aws-batch';
import { ContainerImage } from '@aws-cdk/aws-ecs';
import * as events from '@aws-cdk/aws-events';
import { Stack } from '@aws-cdk/core';
import * as targets from '../../lib';

test('use aws batch job as an eventrule target', () => {
  // GIVEN
  const stack = new Stack();
  const jobQueue = new batch.JobQueue(stack, 'MyQueue', {
    computeEnvironments: [
      {
        computeEnvironment: new batch.ComputeEnvironment(stack, 'ComputeEnvironment', {
          managed: false,
        }),
        order: 1,
      },
    ],
  });
  const jobDefinition = new batch.JobDefinition(stack, 'MyJob', {
    container: {
      image: ContainerImage.fromRegistry('test-repo'),
    },
  });
  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.expression('rate(1 min)'),
  });

  // WHEN
  rule.addTarget(new targets.BatchJob(jobQueue, jobDefinition));

  // THEN
  expect(stack).to(haveResource('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 min)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: {
          Ref: 'MyQueueE6CA6235',
        },
        Id: 'Target0',
        RoleArn: {
          'Fn::GetAtt': [
            'MyJobEventsRoleCF43C336',
            'Arn',
          ],
        },
        BatchParameters: {
          JobDefinition: { Ref: 'MyJob8719E923' },
          JobName: 'Rule',
        },
      },
    ],
  }));

  expect(stack).to(haveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'batch:SubmitJob',
          Effect: 'Allow',
          Resource: [
            { Ref: 'MyJob8719E923' },
            { Ref: 'MyQueueE6CA6235' },
          ],
        },
      ],
      Version: '2012-10-17',
    },
    Roles: [
      { Ref: 'MyJobEventsRoleCF43C336' },
    ],
  }));
});
