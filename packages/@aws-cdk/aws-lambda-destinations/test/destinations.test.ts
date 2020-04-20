import '@aws-cdk/assert/jest';
import * as events from '@aws-cdk/aws-events';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import { Stack } from '@aws-cdk/core';
import * as destinations from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

const lambdaProps = {
  code: new lambda.InlineCode('foo'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_10_X,
};

test('event bus as destination', () => {
  // GIVEN
  const eventBus = new events.EventBus(stack, 'EventBus');

  // WHEN
  new lambda.Function(stack, 'Function', {
    ...lambdaProps,
    onSuccess: new destinations.EventBridgeDestination(eventBus),
  });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::EventInvokeConfig', {
    DestinationConfig: {
      OnSuccess: {
        Destination: {
          'Fn::GetAtt': [
            'EventBus7B8748AA',
            'Arn',
          ],
        },
      },
    },
  });

  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'events:PutEvents',
          Effect: 'Allow',
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('event bus as destination defaults to default event bus', () => {
  // WHEN
  new lambda.Function(stack, 'Function', {
    ...lambdaProps,
    onSuccess: new destinations.EventBridgeDestination(),
  });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::EventInvokeConfig', {
    DestinationConfig: {
      OnSuccess: {
        Destination: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':events:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':event-bus/default',
            ],
          ],
        },
      },
    },
  });

  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'events:PutEvents',
          Effect: 'Allow',
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('lambda as destination', () => {
  // GIVEN
  const successLambda = new lambda.Function(stack, 'SuccessFunction', lambdaProps);

  // WHEN
  new lambda.Function(stack, 'Function', {
    ...lambdaProps,
    onSuccess: new destinations.LambdaDestination(successLambda),
  });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::EventInvokeConfig', {
    DestinationConfig: {
      OnSuccess: {
        Destination: {
          'Fn::GetAtt': [
            'SuccessFunction93C61D39',
            'Arn',
          ],
        },
      },
    },
  });

  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'lambda:InvokeFunction',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'SuccessFunction93C61D39',
              'Arn',
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('lambda payload as destination', () => {
  // GIVEN
  const successLambda = new lambda.Function(stack, 'SuccessFunction', lambdaProps);
  const failureLambda = new lambda.Function(stack, 'FailureFunction', lambdaProps);

  // WHEN
  new lambda.Function(stack, 'Function', {
    ...lambdaProps,
    onSuccess: new destinations.LambdaDestination(successLambda, { responseOnly: true }),
    onFailure: new destinations.LambdaDestination(failureLambda, { responseOnly: true }),
  });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::EventInvokeConfig', {
    DestinationConfig: {
      OnSuccess: {
        Destination: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':events:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':event-bus/default',
            ],
          ],
        },
      },
      OnFailure: {
        Destination: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':events:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':event-bus/default',
            ],
          ],
        },
      },
    },
  });

  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'events:PutEvents',
          Effect: 'Allow',
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
  });

  expect(stack).toHaveResource('AWS::Events::Rule', {
    EventPattern: {
      'detail-type': [
        'Lambda Function Invocation Result - Success',
      ],
      'resources': [
        {
          'Fn::Join': [
            '',
            [
              {
                'Fn::GetAtt': [
                  'Function76856677',
                  'Arn',
                ],
              },
              ':$LATEST',
            ],
          ],
        },
      ],
      'source': [
        'lambda',
      ],
    },
    Targets: [
      {
        Arn: {
          'Fn::GetAtt': [
            'SuccessFunction93C61D39',
            'Arn',
          ],
        },
        Id: 'Target0',
        InputPath: '$.detail.responsePayload',
      },
    ],
  });

  expect(stack).toHaveResource('AWS::Events::Rule', {
    EventPattern: {
      'detail-type': [
        'Lambda Function Invocation Result - Failure',
      ],
      'resources': [
        {
          'Fn::Join': [
            '',
            [
              {
                'Fn::GetAtt': [
                  'Function76856677',
                  'Arn',
                ],
              },
              ':$LATEST',
            ],
          ],
        },
      ],
      'source': [
        'lambda',
      ],
    },
    Targets: [
      {
        Arn: {
          'Fn::GetAtt': [
            'FailureFunctionE917A574',
            'Arn',
          ],
        },
        Id: 'Target0',
        InputPath: '$.detail.responsePayload',
      },
    ],
  });
});

test('sns as destination', () => {
  // GIVEN
  const topic = new sns.Topic(stack, 'Topic');

  // WHEN
  new lambda.Function(stack, 'Function', {
    ...lambdaProps,
    onSuccess: new destinations.SnsDestination(topic),
  });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::EventInvokeConfig', {
    DestinationConfig: {
      OnSuccess: {
        Destination: {
          Ref: 'TopicBFC7AF6E',
        },
      },
    },
  });

  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'sns:Publish',
          Effect: 'Allow',
          Resource: {
            Ref: 'TopicBFC7AF6E',
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('sqs as destination', () => {
  // GIVEN
  const queue = new sqs.Queue(stack, 'Queue');

  // WHEN
  new lambda.Function(stack, 'Function', {
    ...lambdaProps,
    onSuccess: new destinations.SqsDestination(queue),
  });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::EventInvokeConfig', {
    DestinationConfig: {
      OnSuccess: {
        Destination: {
          'Fn::GetAtt': [
            'Queue4A7E3555',
            'Arn',
          ],
        },
      },
    },
  });

  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            'sqs:SendMessage',
            'sqs:GetQueueAttributes',
            'sqs:GetQueueUrl',
          ],
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'Queue4A7E3555',
              'Arn',
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});
