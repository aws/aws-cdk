import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert-internal';
import * as events from '@aws-cdk/aws-events';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import { Stack } from '@aws-cdk/core';
import * as targets from '../../lib';

describe('KinesisFirehoseStream event target', () => {
  let stack: Stack;
  let stream: firehose.CfnDeliveryStream;
  let streamArn: any;

  beforeEach(() => {
    stack = new Stack();
    stream = new firehose.CfnDeliveryStream(stack, 'MyStream');
    streamArn = { 'Fn::GetAtt': ['MyStream', 'Arn'] };
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
        rule.addTarget(new targets.KinesisFirehoseStream(stream));
      });

      test("adds the stream's ARN and role to the targets of the rule", () => {
        expect(stack).to(haveResource('AWS::Events::Rule', {
          Targets: [
            {
              Arn: streamArn,
              Id: 'Target0',
              RoleArn: { 'Fn::GetAtt': ['MyStreamEventsRole5B6CC6AF', 'Arn'] },
            },
          ],
        }));
      });

      test("creates a policy that has PutRecord and PutRecords permissions on the stream's ARN", () => {
        expect(stack).to(haveResource('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: [
              {
                Action: ['firehose:PutRecord', 'firehose:PutRecordBatch'],
                Effect: 'Allow',
                Resource: streamArn,
              },
            ],
            Version: '2012-10-17',
          },
        }));
      });
    });

    describe('with an explicit message', () => {
      beforeEach(() => {
        rule.addTarget(new targets.KinesisFirehoseStream(stream, {
          message: events.RuleTargetInput.fromText('fooBar'),
        }));
      });

      test('sets the input', () => {
        expect(stack).to(haveResourceLike('AWS::Events::Rule', {
          Targets: [
            {
              Arn: streamArn,
              Id: 'Target0',
              Input: '"fooBar"',
            },
          ],
        }));
      });
    });
  });
});
