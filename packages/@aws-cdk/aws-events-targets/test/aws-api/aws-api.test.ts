import { countResources, expect, haveResource } from '@aws-cdk/assert';
import events = require('@aws-cdk/aws-events');
import { Stack } from '@aws-cdk/core';
import targets = require('../../lib');

test('use AwsApi as an event rule target', () => {
  // GIVEN
  const stack = new Stack();
  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.expression('rate(15 minutes)')
  });

  // WHEN
  rule.addTarget(new targets.AwsApi({
    service: 'ECS',
    action: 'updateService',
    parameters: {
      service: 'cool-service',
      forceNewDeployment: true
    } as AWS.ECS.UpdateServiceRequest,
    apiVersion: '2019-01-01',
    catchErrorPattern: 'error'
  }));

  rule.addTarget(new targets.AwsApi({
    service: 'RDS',
    action: 'createDBSnapshot',
    parameters: {
      DBInstanceIdentifier: 'cool-instance'
    } as AWS.RDS.CreateDBSnapshotMessage,
  }));

  // THEN
  expect(stack).to(haveResource('AWS::Events::Rule', {
    Targets: [
      {
        Arn: {
          "Fn::GetAtt": [
            "AWSb4cf1abd4e4f4bc699441af7ccd9ec371511E620",
            "Arn"
          ]
        },
        Id: "Target0",
        Input: JSON.stringify({
          service: 'ECS',
          action: 'updateService',
          parameters: {
            service: 'cool-service',
            forceNewDeployment: true
          },
          apiVersion: '2019-01-01',
          catchErrorPattern: 'error'
        })
      },
      {
        Arn: {
          "Fn::GetAtt": [
            "AWSb4cf1abd4e4f4bc699441af7ccd9ec371511E620",
            "Arn"
          ]
        },
        Id: "Target1",
        Input: JSON.stringify({
          service: 'RDS',
          action: 'createDBSnapshot',
          parameters: {
            DBInstanceIdentifier: 'cool-instance'
          },
        })
      }
    ]
  }));

  // Uses a singleton function
  expect(stack).to(countResources('AWS::Lambda::Function', 1));

  expect(stack).to(haveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: "ecs:UpdateService",
          Effect: "Allow",
          Resource: "*"
        },
        {
          Action: "rds:CreateDBSnapshot",
          Effect: "Allow",
          Resource: "*"
        }
      ],
      Version: "2012-10-17"
    }
  }));
});
