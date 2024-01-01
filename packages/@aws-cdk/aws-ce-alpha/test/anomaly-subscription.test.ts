import { Template } from 'aws-cdk-lib/assertions';
import { Stack } from 'aws-cdk-lib';
import { AnomalyMonitor, MonitorType } from '../lib/anomaly-monitor';
import { AnomalySubscriber, AnomalySubscription, EmailFrequency, ThresholdExpression } from '../lib/anomaly-subscription';
import { Topic } from 'aws-cdk-lib/aws-sns';

let stack: Stack;
let monitor: AnomalyMonitor;
beforeEach(() => {
  stack = new Stack();
  monitor = new AnomalyMonitor(stack, 'Monitor', {
    type: MonitorType.awsServices(),
  });
});

test('SNS subscription', () => {
  const topic = new Topic(stack, 'Topic');

  new AnomalySubscription(stack, 'Subscription', {
    anomalySubscriptionName: 'MySubscription',
    anomalyMonitors: [monitor],
    subscriber: AnomalySubscriber.sns(topic),
    thresholdExpression: ThresholdExpression.aboveUsdAmount(100),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CE::AnomalySubscription', {
    Frequency: 'IMMEDIATE',
    MonitorArnList: [{ Ref: 'Monitor5337499C' }],
    Subscribers: [
      {
        Address: { Ref: 'TopicBFC7AF6E' },
        Type: 'SNS',
      },
    ],
    SubscriptionName: 'MySubscription',
    ThresholdExpression: '{"Dimensions":{"Key":"ANOMALY_TOTAL_IMPACT_ABSOLUTE","MatchOptions":["GREATER_THAN_OR_EQUAL"],"Values":["100"]}}',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SNS::TopicPolicy', {
    PolicyDocument: {
      Statement: [{
        Action: 'sns:Publish',
        Condition: {
          StringEquals: {
            'aws:SourceAccount': [{ Ref: 'AWS::AccountId' }],
          },
        },
        Effect: 'Allow',
        Principal: { Service: 'costalerts.amazonaws.com' },
        Resource: { Ref: 'TopicBFC7AF6E' },
        Sid: '0',
      }],
    },
    Topics: [{ Ref: 'TopicBFC7AF6E' }],
  });
});

test('Emails subscription', () => {
  new AnomalySubscription(stack, 'Subscription', {
    anomalyMonitors: [monitor],
    subscriber: AnomalySubscriber.emails(EmailFrequency.WEEKLY, [
      'first@example.com',
      'second@example.com',
    ]),
    thresholdExpression: ThresholdExpression.aboveUsdAmountOrPercentage(500, 20),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CE::AnomalySubscription', {
    Frequency: 'WEEKLY',
    Subscribers: [
      {
        Address: 'first@example.com',
        Type: 'EMAIL',
      },
      {
        Address: 'second@example.com',
        Type: 'EMAIL',
      },
    ],
    SubscriptionName: 'Subscription',
    ThresholdExpression: '{"Or":[{"Dimensions":{"Key":"ANOMALY_TOTAL_IMPACT_ABSOLUTE","MatchOptions":["GREATER_THAN_OR_EQUAL"],"Values":["500"]}},{"Dimensions":{"Key":"ANOMALY_TOTAL_IMPACT_PERCENTAGE","MatchOptions":["GREATER_THAN_OR_EQUAL"],"Values":["20"]}}]}',
  });
});
