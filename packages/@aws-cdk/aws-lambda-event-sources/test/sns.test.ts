import { Template } from '@aws-cdk/assertions';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import { TestFunction } from './test-function';
import * as sources from '../lib';

/* eslint-disable quote-props */

describe('SNSEventSource', () => {
  test('sufficiently complex example', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const topic = new sns.Topic(stack, 'T');

    // WHEN
    fn.addEventSource(new sources.SnsEventSource(topic));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      'Action': 'lambda:InvokeFunction',
      'FunctionName': {
        'Fn::GetAtt': [
          'Fn9270CBC0',
          'Arn',
        ],
      },
      'Principal': 'sns.amazonaws.com',
      'SourceArn': {
        'Ref': 'TD925BC7E',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SNS::Subscription', {
      'Endpoint': {
        'Fn::GetAtt': [
          'Fn9270CBC0',
          'Arn',
        ],
      },
      'Protocol': 'lambda',
      'TopicArn': {
        'Ref': 'TD925BC7E',
      },
    });


  });

  test('props are passed to subscription', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const topic = new sns.Topic(stack, 'T');
    const queue = new sqs.Queue(stack, 'Q');
    const props: sources.SnsEventSourceProps = {
      deadLetterQueue: queue,
      filterPolicy: {
        Field: sns.SubscriptionFilter.stringFilter({
          allowlist: ['A', 'B'],
        }),
      },
    };

    // WHEN
    fn.addEventSource(new sources.SnsEventSource(topic, props));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      'Action': 'lambda:InvokeFunction',
      'FunctionName': {
        'Fn::GetAtt': [
          'Fn9270CBC0',
          'Arn',
        ],
      },
      'Principal': 'sns.amazonaws.com',
      'SourceArn': {
        'Ref': 'TD925BC7E',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SNS::Subscription', {
      'Endpoint': {
        'Fn::GetAtt': [
          'Fn9270CBC0',
          'Arn',
        ],
      },
      'Protocol': 'lambda',
      'TopicArn': {
        'Ref': 'TD925BC7E',
      },
      'FilterPolicy': {
        'Field': [
          'A',
          'B',
        ],
      },
      'RedrivePolicy': {
        'deadLetterTargetArn': {
          'Fn::GetAtt': [
            'Q63C6E3AB',
            'Arn',
          ],
        },
      },
    });


  });
});
