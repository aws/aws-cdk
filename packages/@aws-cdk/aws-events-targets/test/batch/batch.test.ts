import { expect, haveResource } from '@aws-cdk/assert';
import * as batch from '@aws-cdk/aws-batch';
import * as events from '@aws-cdk/aws-events';
import { Stack } from '@aws-cdk/core';
import * as targets from '../../lib';

test('use aws batch job as an eventrule target', () => {
  // GIVEN
  const stack = new Stack();
  const jobQueue = new batch.JobQueue(stack, 'MyQueue');
  const jobDefinition = new batch.JobDefinition(stack, 'MyJob');
  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.expression('rate(1 min)')
  });

  // WHEN
  rule.addTarget(new targets.BatchJob(jobQueue, jobDefinition));

  // THEN
  expect(stack).to(haveResource('AWS::Events::Rule', {
    Targets: [
      {
        Arn: {
          "Fn::GetAtt": [
            "MyProject39F7B0AE",
            "Arn"
          ]
        },
        Id: "Target0",
        RoleArn: {
          "Fn::GetAtt": [
            "MyProjectEventsRole5B7D93F5",
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
          Principal: { Service: "events.amazonaws.com" }
        }
      ],
      Version: "2012-10-17"
    }
  }));

  expect(stack).to(haveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: "codebuild:StartBuild",
          Effect: "Allow",
          Resource: {
            "Fn::GetAtt": [
              "MyProject39F7B0AE",
              "Arn"
            ]
          }
        }
      ],
      Version: "2012-10-17"
    }
  }));
});
