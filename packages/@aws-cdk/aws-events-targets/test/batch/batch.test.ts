import { expect, haveResource } from '@aws-cdk/assert';
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
          managed: false
        }),
        order: 1
      }
    ]
  });
  const jobDefinition = new batch.JobDefinition(stack, 'MyJob', {
    container: {
      image: ContainerImage.fromRegistry('test-repo')
    }
  });
  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.expression('rate(1 min)')
  });

  // WHEN
  rule.addTarget(new targets.BatchJob(jobQueue, jobDefinition));

  // THEN
  expect(stack).to(haveResource('AWS::Events::Rule', {
    ScheduleExpression: "rate(1 min)",
    State: "ENABLED",
    Targets: [
      {
        Arn: {
          Ref: "MyQueueE6CA6235"
        },
        Id: "Target0",
        RoleArn: {
          "Fn::GetAtt": [
            "MyJobEventsRoleCF43C336",
            "Arn"
          ]
        }
      }
    ]
  }));
  expect(stack).to(haveResource('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: "sts:AssumeRole",
          Effect: "Allow",
          Principal: {
            Service: "batch.amazonaws.com"
          }
        }
      ],
      Version: "2012-10-17"
    },
    ManagedPolicyArns: [
      {
        "Fn::Join": [
          "",
          [
            "arn:",
            {
              Ref: "AWS::Partition"
            },
            ":iam::aws:policy/service-role/AWSBatchServiceRole"
          ]
        ]
      }
    ]
  }));

  expect(stack).to(haveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: "batch:SubmitJob",
          Effect: "Allow",
          Resource: {
            Ref: "MyJob8719E923"
          }
        }
      ],
      Version: "2012-10-17"
    },
    PolicyName: "MyJobEventsRoleDefaultPolicy7266D3A7",
    Roles: [
      {
        Ref: "MyJobEventsRoleCF43C336"
      }
    ]
  }));
});
