import { throws } from 'assert';
import { Template } from '@aws-cdk/assertions';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as ce from '../lib';

describe('Subscriber', () => {
  let stack: cdk.Stack;
  let monitor: ce.AnomalyMonitor;
  let topic: sns.Topic;
  let threshold: number = 1.01;
  let email: string = 'foo@bar.baz';

  beforeEach(() => {
    stack = new cdk.Stack();
    topic = new sns.Topic(stack, 'Topic');
    monitor = new ce.AnomalyMonitor(stack, 'Monitor');
  });

  it('renders the correct CloudFormation properties', () => {
    // WHEN
    new ce.AnomalySubscription(stack, 'Subscription', {
      frequency: ce.Frequency.IMMEDIATE,
      monitors: [monitor],
      subscribers: [
        new ce.SnsTopic(topic),
      ],
      threshold: threshold,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CE::AnomalySubscription', {
      Frequency: ce.Frequency.IMMEDIATE,
      MonitorArnList: [{ Ref: 'Monitor5337499C' }],
      Subscribers: [
        {
          Address: { Ref: 'TopicBFC7AF6E' },
          Type: 'SNS',
        },
      ],
      SubscriptionName: 'Subscription',
      Threshold: threshold,
    });
  });

  describe('when validating props', () => {
    test('should throw when not subscribers list is empty', () => {
      // THEN
      throws(() => {
        // WHEN
        new ce.AnomalySubscription(stack, 'Subscription', {
          frequency: ce.Frequency.WEEKLY,
          monitors: [monitor],
          subscribers: [],
          threshold: threshold,
        });
      });
    });

    test('should deny daily or weekly SNS subscriptions', () => {
      // THEN
      throws(() => {
        // WHEN
        new ce.AnomalySubscription(stack, 'Subscription', {
          frequency: ce.Frequency.WEEKLY,
          monitors: [monitor],
          subscribers: [new ce.SnsTopic(topic)],
          threshold: threshold,
        });
      });
    });

    test('should deny immediate email subscriptions', () => {
      // THEN
      throws(() => {
        // WHEN
        new ce.AnomalySubscription(stack, 'Subscription', {
          frequency: ce.Frequency.IMMEDIATE,
          monitors: [monitor],
          subscribers: [new ce.Email(email)],
          threshold: threshold,
        });
      });
    });

    test('should deny more than one immediate frequency subscriptions', () => {
      // THEN
      throws(() => {
        // WHEN
        new ce.AnomalySubscription(stack, 'Subscription', {
          frequency: ce.Frequency.WEEKLY,
          monitors: [monitor],
          subscribers: [new ce.SnsTopic(topic), new ce.SnsTopic(topic)],
          threshold: threshold,
        });
      });
    });

  });
});
