import { Template } from '@aws-cdk/assertions';
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
  runtime: lambda.Runtime.NODEJS_14_X,
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
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
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

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'events:PutEvents',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'EventBus7B8748AA',
              'Arn',
            ],
          },
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
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
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

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'lambda:InvokeFunction',
          Effect: 'Allow',
          Resource: [
            { 'Fn::GetAtt': ['SuccessFunction93C61D39', 'Arn'] },
            { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['SuccessFunction93C61D39', 'Arn'] }, ':*']] },
          ],
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
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
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

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'events:PutEvents',
          Effect: 'Allow',
          Resource: {
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
      ],
      Version: '2012-10-17',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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

  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
    DestinationConfig: {
      OnSuccess: {
        Destination: {
          Ref: 'TopicBFC7AF6E',
        },
      },
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
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

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
