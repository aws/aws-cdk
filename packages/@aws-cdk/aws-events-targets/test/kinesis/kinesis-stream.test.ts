import { Template } from '@aws-cdk/assertions';
import * as events from '@aws-cdk/aws-events';
import * as kinesis from '@aws-cdk/aws-kinesis';
import { Stack } from '@aws-cdk/core';
import * as targets from '../../lib';

describe('KinesisStream event target', () => {
  let stack: Stack;
  let stream: kinesis.Stream;
  let streamArn: any;

  beforeEach(() => {
    stack = new Stack();
    stream = new kinesis.Stream(stack, 'MyStream');
    streamArn = { 'Fn::GetAtt': ['MyStream5C050E93', 'Arn'] };
  });

  describe('when added to an event rule as a target', () => {
    let rule: events.Rule;

    beforeEach(() => {
      rule = new events.Rule(stack, 'rule', {
        schedule: events.Schedule.expression('rate(1 minute)'),
      });
    });

    describe('with default settings', () => {
      beforeEach(() => {
        rule.addTarget(new targets.KinesisStream(stream));
      });

      test("adds the stream's ARN and role to the targets of the rule", () => {
        Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
          Targets: [
            {
              Arn: streamArn,
              Id: 'Target0',
              RoleArn: { 'Fn::GetAtt': ['MyStreamEventsRole5B6CC6AF', 'Arn'] },
            },
          ],
        });
      });

      test("creates a policy that has PutRecord and PutRecords permissions on the stream's ARN", () => {
        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: [
              {
                Action: ['kinesis:PutRecord', 'kinesis:PutRecords'],
                Effect: 'Allow',
                Resource: streamArn,
              },
            ],
            Version: '2012-10-17',
          },
        });
      });
    });

    describe('with an explicit partition key path', () => {
      beforeEach(() => {
        rule.addTarget(new targets.KinesisStream(stream, {
          partitionKeyPath: events.EventField.eventId,
        }));
      });

      test('sets the partition key path', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
          Targets: [
            {
              Arn: streamArn,
              Id: 'Target0',
              RoleArn: { 'Fn::GetAtt': ['MyStreamEventsRole5B6CC6AF', 'Arn'] },
              KinesisParameters: {
                PartitionKeyPath: '$.id',
              },
            },
          ],
        });
      });
    });

    describe('with an explicit message', () => {
      beforeEach(() => {
        rule.addTarget(new targets.KinesisStream(stream, {
          message: events.RuleTargetInput.fromText('fooBar'),
        }));
      });

      test('sets the input', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
          Targets: [
            {
              Arn: streamArn,
              Id: 'Target0',
              Input: '"fooBar"',
            },
          ],
        });
      });
    });
  });
});
