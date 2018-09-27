import { expect, haveResource } from '@aws-cdk/assert';
import logs = require('@aws-cdk/aws-logs');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { Stream } from '../lib';

export = {
  'stream can be subscription destination'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const stream = new Stream(stack, 'MyStream');
    const logGroup = new logs.LogGroup(stack, 'LogGroup');

    // WHEN
    new logs.SubscriptionFilter(stack, 'Subscription', {
      logGroup,
      destination: stream,
      filterPattern: logs.FilterPattern.allEvents()
    });

    // THEN: subscription target is Stream
    expect(stack).to(haveResource('AWS::Logs::SubscriptionFilter', {
      DestinationArn: { "Fn::GetAtt": [ "MyStream5C050E93", "Arn" ] },
      RoleArn: { "Fn::GetAtt": [ "MyStreamCloudWatchLogsCanPutRecords58498490", "Arn" ] },
    }));

    // THEN: we have a role to write to the Lambda
    expect(stack).to(haveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [{
          Action: "sts:AssumeRole",
          Principal: { Service: { "Fn::Join": ["", ["logs.", {Ref: "AWS::Region"}, ".amazonaws.com"]] }}
        }],
      }
    }));

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: "kinesis:PutRecord",
            Effect: "Allow",
            Resource: { "Fn::GetAtt": [ "MyStream5C050E93", "Arn" ] }
          },
          {
            Action: "iam:PassRole",
            Effect: "Allow",
            Resource: { "Fn::GetAtt": [ "MyStreamCloudWatchLogsCanPutRecords58498490", "Arn" ] }
          }
        ],
      }
    }));

    test.done();
  },

  'cross-account stream can be subscription destination with Destination'(test: Test) {
    // GIVEN
    const sourceStack = new cdk.Stack(undefined, undefined, { env: { account: '12345' }});
    const logGroup = new logs.LogGroup(sourceStack, 'LogGroup');

    const destStack = new cdk.Stack(undefined, undefined, { env: { account: '67890' }});
    const stream = new Stream(destStack, 'MyStream');

    // WHEN
    new logs.SubscriptionFilter(sourceStack, 'Subscription', {
      logGroup,
      destination: stream,
      filterPattern: logs.FilterPattern.allEvents()
    });

    // THEN: the source stack has a Destination object that the subscription points to
    expect(destStack).to(haveResource('AWS::Logs::Destination', {
      TargetArn: { "Fn::GetAtt": [ "MyStream5C050E93", "Arn" ] },
      RoleArn: { "Fn::GetAtt": [ "MyStreamCloudWatchLogsCanPutRecords58498490", "Arn" ] },
    }));

    test.done();
  }
};
