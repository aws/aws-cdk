import { Template } from '../../../assertions';
import * as events from '../../../aws-events';
import * as firehose from '../../../aws-kinesisfirehose';
import * as s3 from '../../../aws-s3';
import { Stack } from '../../../core';
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
                Action: ['firehose:PutRecord', 'firehose:PutRecordBatch'],
                Effect: 'Allow',
                Resource: streamArn,
              },
            ],
            Version: '2012-10-17',
          },
        });
      });
    });

    describe('with an explicit message', () => {
      beforeEach(() => {
        rule.addTarget(new targets.KinesisFirehoseStream(stream, {
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

describe('FirehoseDeliveryStream event target', () => {
  let stack: Stack;
  let deliveryStream: firehose.DeliveryStream;
  let deliveryStreamArn: any;

  beforeEach(() => {
    stack = new Stack();
    deliveryStream = new firehose.DeliveryStream(stack, 'MyDeliveryStream', {
      destination: new firehose.S3Bucket(new s3.Bucket(stack, 'MyBucket')),
    });
    deliveryStreamArn = { 'Fn::GetAtt': ['MyDeliveryStream79822137', 'Arn'] };
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
        rule.addTarget(new targets.FirehoseDeliveryStream(deliveryStream));
      });

      test("adds the delivery stream's ARN and role to the targets of the rule", () => {
        Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
          Targets: [
            {
              Arn: deliveryStreamArn,
              Id: 'Target0',
              RoleArn: { 'Fn::GetAtt': ['MyDeliveryStreamEventsRole6811FC4E', 'Arn'] },
            },
          ],
        });
      });

      test("creates a policy that has PutRecord and PutRecords permissions on the delivery stream's ARN", () => {
        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: [
              {
                Action: ['firehose:PutRecord', 'firehose:PutRecordBatch'],
                Effect: 'Allow',
                Resource: deliveryStreamArn,
              },
            ],
            Version: '2012-10-17',
          },
        });
      });
    });

    describe('with an explicit message', () => {
      beforeEach(() => {
        rule.addTarget(new targets.FirehoseDeliveryStream(deliveryStream, {
          message: events.RuleTargetInput.fromText('fooBar'),
        }));
      });

      test('sets the input', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
          Targets: [
            {
              Arn: deliveryStreamArn,
              Id: 'Target0',
              Input: '"fooBar"',
            },
          ],
        });
      });
    });
  });
});
