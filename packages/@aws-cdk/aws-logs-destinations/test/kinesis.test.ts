import '@aws-cdk/assert/jest';
import kinesis = require('@aws-cdk/aws-kinesis');
import logs = require('@aws-cdk/aws-logs');
import cdk = require('@aws-cdk/cdk');
import dests = require('../lib');

test('stream can be subscription destination', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const stream = new kinesis.Stream(stack, 'MyStream');
  const logGroup = new logs.LogGroup(stack, 'LogGroup');

  // WHEN
  new logs.SubscriptionFilter(stack, 'Subscription', {
    logGroup,
    destination: new dests.KinesisDestination(stream),
    filterPattern: logs.FilterPattern.allEvents()
  });

  // THEN: subscription target is Stream
  expect(stack).toHaveResource('AWS::Logs::SubscriptionFilter', {
    DestinationArn: { "Fn::GetAtt": [ "MyStream5C050E93", "Arn" ] },
    RoleArn: { "Fn::GetAtt": [ "SubscriptionCloudWatchLogsCanPutRecords9C1223EC", "Arn" ] },
  });

  // THEN: we have a role to write to the Lambda
  expect(stack).toHaveResource('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: "sts:AssumeRole",
        Effect: 'Allow',
        Principal: {
          Service: {
            "Fn::Join": [ "", [
                "logs.",
                { Ref: "AWS::Region" },
                ".",
                { Ref: "AWS::URLSuffix" }
              ]
            ]
          }
        }
      }],
    }
  });

  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: [
            "kinesis:DescribeStream",
            "kinesis:PutRecord",
            "kinesis:PutRecords",
          ],
          Effect: "Allow",
          Resource: { "Fn::GetAtt": [ "MyStream5C050E93", "Arn" ] }
        },
        {
          Action: "iam:PassRole",
          Effect: "Allow",
          Resource: { "Fn::GetAtt": [ "SubscriptionCloudWatchLogsCanPutRecords9C1223EC", "Arn" ] }
        }
      ],
    }
  });
});