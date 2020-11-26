import { expect, haveResource } from '@aws-cdk/assert';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as sources from '../lib';
import { TestFunction } from './test-function';

/* eslint-disable quote-props */

export = {
  'defaults'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');

    // WHEN
    fn.addEventSource(new sources.SqsEventSource(q));

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      'PolicyDocument': {
        'Statement': [
          {
            'Action': [
              'sqs:ReceiveMessage',
              'sqs:ChangeMessageVisibility',
              'sqs:GetQueueUrl',
              'sqs:DeleteMessage',
              'sqs:GetQueueAttributes',
            ],
            'Effect': 'Allow',
            'Resource': {
              'Fn::GetAtt': [
                'Q63C6E3AB',
                'Arn',
              ],
            },
          },
        ],
        'Version': '2012-10-17',
      },
    }));

    expect(stack).to(haveResource('AWS::Lambda::EventSourceMapping', {
      'EventSourceArn': {
        'Fn::GetAtt': [
          'Q63C6E3AB',
          'Arn',
        ],
      },
      'FunctionName': {
        'Ref': 'Fn9270CBC0',
      },
    }));

    test.done();
  },

  'specific batch size'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');

    // WHEN
    fn.addEventSource(new sources.SqsEventSource(q, {
      batchSize: 5,
    }));

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::EventSourceMapping', {
      'EventSourceArn': {
        'Fn::GetAtt': [
          'Q63C6E3AB',
          'Arn',
        ],
      },
      'FunctionName': {
        'Ref': 'Fn9270CBC0',
      },
      'BatchSize': 5,
    }));

    test.done();
  },

  'fails if batch size is < 1'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');

    // WHEN/THEN
    test.throws(() => fn.addEventSource(new sources.SqsEventSource(q, {
      batchSize: 0,
    })), /Maximum batch size must be between 1 and 10 inclusive \(given 0\)/);

    test.done();
  },

  'fails if batch size is > 10'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');

    // WHEN/THEN
    test.throws(() => fn.addEventSource(new sources.SqsEventSource(q, {
      batchSize: 11,
    })), /Maximum batch size must be between 1 and 10 inclusive \(given 11\)/);

    test.done();
  },

  'batch size is > 10 and batch window is defined'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');

    // WHEN
    fn.addEventSource(new sources.SqsEventSource(q, {
      batchSize: 1000,
      maxBatchingWindow: cdk.Duration.minutes(5),
    }));

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::EventSourceMapping', {
      'EventSourceArn': {
        'Fn::GetAtt': [
          'Q63C6E3AB',
          'Arn',
        ],
      },
      'FunctionName': {
        'Ref': 'Fn9270CBC0',
      },
      'BatchSize': 1000,
      'MaximumBatchingWindowInSeconds': 300,
    }));

    test.done();
  },

  'fails if batch size is > 10000 and batch window is defined'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');

    // WHEN/THEN
    test.throws(() => fn.addEventSource(new sources.SqsEventSource(q, {
      batchSize: 11000,
      maxBatchingWindow: cdk.Duration.minutes(5),
    })), /Maximum batch size must be between 1 and 10000 inclusive \(given 11000\)/);

    test.done();
  },

  'specific batch window'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');

    // WHEN
    fn.addEventSource(new sources.SqsEventSource(q, {
      maxBatchingWindow: cdk.Duration.minutes(5),
    }));

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::EventSourceMapping', {
      'EventSourceArn': {
        'Fn::GetAtt': [
          'Q63C6E3AB',
          'Arn',
        ],
      },
      'FunctionName': {
        'Ref': 'Fn9270CBC0',
      },
      'MaximumBatchingWindowInSeconds': 300,
    }));

    test.done();
  },

  'fails if batch window is > 5'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');

    // WHEN/THEN
    test.throws(() => fn.addEventSource(new sources.SqsEventSource(q, {
      maxBatchingWindow: cdk.Duration.minutes(7),
    })), /maxBatchingWindow cannot be over 300 seconds, got 420/);

    test.done();
  },

  'contains eventSourceMappingId after lambda binding'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');
    const eventSource = new sources.SqsEventSource(q);

    // WHEN
    fn.addEventSource(eventSource);

    // THEN
    test.ok(eventSource.eventSourceMappingId);
    test.done();
  },

  'eventSourceMappingId throws error before binding to lambda'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const q = new sqs.Queue(stack, 'Q');
    const eventSource = new sources.SqsEventSource(q);

    // WHEN/THEN
    test.throws(() => eventSource.eventSourceMappingId, /SqsEventSource is not yet bound to an event source mapping/);
    test.done();
  },

  'event source disabled'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');

    // WHEN
    fn.addEventSource(new sources.SqsEventSource(q, {
      enabled: false,
    }));

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::EventSourceMapping', {
      'Enabled': false,
    }));

    test.done();
  },
};
