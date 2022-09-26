import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sqs from '@aws-cdk/aws-sqs';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import { App } from '@aws-cdk/core';
import * as sources from '../lib';
import { TestFunction } from './test-function';

/* eslint-disable quote-props */

describe('SQSEventSource', () => {
  testDeprecated('defaults', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');

    // WHEN
    fn.addEventSource(new sources.SqsEventSource(q));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      'EventSourceArn': {
        'Fn::GetAtt': [
          'Q63C6E3AB',
          'Arn',
        ],
      },
      'FunctionName': {
        'Ref': 'Fn9270CBC0',
      },
    });


  });

  testDeprecated('specific batch size', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');

    // WHEN
    fn.addEventSource(new sources.SqsEventSource(q, {
      batchSize: 5,
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
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
    });


  });

  testDeprecated('unresolved batch size', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');
    const batchSize : number = 500;

    // WHEN
    fn.addEventSource(new sources.SqsEventSource(q, {
      batchSize: cdk.Lazy.number({
        produce() {
          return batchSize;
        },
      }),
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      'BatchSize': 500,
    });


  });

  test('fails if batch size is < 1', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');

    // WHEN/THEN
    expect(() => fn.addEventSource(new sources.SqsEventSource(q, {
      batchSize: 0,
    }))).toThrow(/Maximum batch size must be between 1 and 10 inclusive \(given 0\) when batching window is not specified\./);


  });

  test('fails if batch size is > 10', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');

    // WHEN/THEN
    expect(() => fn.addEventSource(new sources.SqsEventSource(q, {
      batchSize: 11,
    }))).toThrow(/Maximum batch size must be between 1 and 10 inclusive \(given 11\) when batching window is not specified\./);


  });

  testDeprecated('batch size is > 10 and batch window is defined', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      'BatchSize': 1000,
      'MaximumBatchingWindowInSeconds': 300,
    });


  });

  test('fails if batch size is > 10000 and batch window is defined', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');

    // WHEN/THEN
    expect(() => fn.addEventSource(new sources.SqsEventSource(q, {
      batchSize: 11000,
      maxBatchingWindow: cdk.Duration.minutes(5),
    }))).toThrow(/Maximum batch size must be between 1 and 10000 inclusive/i);


  });

  testDeprecated('specific batch window', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');

    // WHEN
    fn.addEventSource(new sources.SqsEventSource(q, {
      maxBatchingWindow: cdk.Duration.minutes(5),
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      'MaximumBatchingWindowInSeconds': 300,
    });


  });

  test('fails if batch window defined for FIFO queue', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q', {
      fifo: true,
    });

    // WHEN/THEN
    expect(() => fn.addEventSource(new sources.SqsEventSource(q, {
      maxBatchingWindow: cdk.Duration.minutes(5),
    }))).toThrow(/Batching window is not supported for FIFO queues/);


  });

  test('fails if batch window is > 5', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');

    // WHEN/THEN
    expect(() => fn.addEventSource(new sources.SqsEventSource(q, {
      maxBatchingWindow: cdk.Duration.minutes(7),
    }))).toThrow(/Maximum batching window must be 300 seconds or less/i);


  });

  testDeprecated('contains eventSourceMappingId after lambda binding', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');
    const eventSource = new sources.SqsEventSource(q);

    // WHEN
    fn.addEventSource(eventSource);

    // THEN
    expect(eventSource.eventSourceMappingId).toBeDefined();

  });

  test('eventSourceMappingId throws error before binding to lambda', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const q = new sqs.Queue(stack, 'Q');
    const eventSource = new sources.SqsEventSource(q);

    // WHEN/THEN
    expect(() => eventSource.eventSourceMappingId).toThrow(/SqsEventSource is not yet bound to an event source mapping/);

  });

  testDeprecated('event source disabled', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');

    // WHEN
    fn.addEventSource(new sources.SqsEventSource(q, {
      enabled: false,
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      'Enabled': false,
    });


  });

  testDeprecated('reportBatchItemFailures', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');

    // WHEN
    fn.addEventSource(new sources.SqsEventSource(q, {
      reportBatchItemFailures: true,
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      'FunctionResponseTypes': ['ReportBatchItemFailures'],
    });
  });

  testDeprecated('warning added if lambda function imported without role', () => {
    const app = new App();
    const stack = new cdk.Stack(app);
    const fn = lambda.Function.fromFunctionName(stack, 'Handler', 'testFunction');
    const q = new sqs.Queue(stack, 'Q');

    // WHEN
    fn.addEventSource(new sources.SqsEventSource(q));
    const assembly = app.synth();

    const messages = assembly.getStackArtifact(stack.artifactId).messages;

    // THEN
    expect(messages.length).toEqual(1);
    expect(messages[0]).toMatchObject({
      level: 'warning',
      id: '/Default/Handler',
      entry: {
        data: expect.stringMatching(/Function 'Default\/Handler' was imported without an IAM role/),
      },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::Lambda::EventSourceMapping', 1);
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
  });

  testDeprecated('policy added to imported function role', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = lambda.Function.fromFunctionAttributes(stack, 'Handler', {
      functionArn: stack.formatArn({
        service: 'lambda',
        resource: 'function',
        resourceName: 'testFunction',
      }),
      role: iam.Role.fromRoleName(stack, 'Role', 'testFunctionRole'),
    });
    const q = new sqs.Queue(stack, 'Q');

    // WHEN
    fn.addEventSource(new sources.SqsEventSource(q));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
      'Roles': ['testFunctionRole'],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      'EventSourceArn': {
        'Fn::GetAtt': [
          'Q63C6E3AB',
          'Arn',
        ],
      },
      'FunctionName': {
        'Fn::Select': [
          6,
          {
            'Fn::Split': [
              ':',
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      'Ref': 'AWS::Partition',
                    },
                    ':lambda:',
                    {
                      'Ref': 'AWS::Region',
                    },
                    ':',
                    {
                      'Ref': 'AWS::AccountId',
                    },
                    ':function/testFunction',
                  ],
                ],
              },
            ],
          },
        ],
      },
    });
  });

  testDeprecated('adding filter criteria', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const q = new sqs.Queue(stack, 'Q');

    // WHEN
    fn.addEventSource(new sources.SqsEventSource(q, {
      filterCriteria: [
        lambda.FilterCriteria.filter({
          body: {
            id: lambda.FilterRule.exists(),
          },
        }),
      ],
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      'FilterCriteria': {
        'Filters': [
          {
            'Pattern': '{"body":{"id":[{"exists":true}]}}',
          },
        ],
      },
    });
  });
});
