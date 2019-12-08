import '@aws-cdk/assert/jest';
import events = require('@aws-cdk/aws-events');
import lambda = require('@aws-cdk/aws-lambda');
import sns = require('@aws-cdk/aws-sns');
import sqs = require('@aws-cdk/aws-sqs');
import { Stack } from '@aws-cdk/core';
import destinations = require('../lib');

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
    onSuccess: new destinations.EventBridgeBus(eventBus)
  });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::EventInvokeConfig', {
    DestinationConfig: {
      OnSuccess: {
        Destination: {
          'Fn::GetAtt': [
            'EventBus7B8748AA',
            'Arn'
          ]
        }
      }
    }
  });

  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'events:PutEvents',
          Effect: 'Allow',
          Resource: '*'
        }
      ],
      Version: '2012-10-17'
    }
  });
});

test('event bus as destination defaults to default event bus', () => {
  // WHEN
  new lambda.Function(stack, 'Function', {
    ...lambdaProps,
    onSuccess: new destinations.EventBridgeBus()
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
                Ref: 'AWS::Partition'
              },
              ':events:',
              {
                Ref: 'AWS::Region'
              },
              ':',
              {
                Ref: 'AWS::AccountId'
              },
              ':event-bus/default'
            ]
          ]
        }
      }
    }
  });

  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'events:PutEvents',
          Effect: 'Allow',
          Resource: '*'
        }
      ],
      Version: '2012-10-17'
    }
  });
});

test('lambda as destination', () => {
  // GIVEN
  const successLambda = new lambda.Function(stack, 'SuccessFunction', {
    ...lambdaProps,
  });

  // WHEN
  new lambda.Function(stack, 'Function', {
    ...lambdaProps,
    onSuccess: new destinations.LambdaFunction(successLambda)
  });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::EventInvokeConfig', {
    DestinationConfig: {
      OnSuccess: {
        Destination: {
          'Fn::GetAtt': [
            'SuccessFunction93C61D39',
            'Arn'
          ]
        }
      }
    }
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
              'Arn'
            ]
          }
        }
      ],
      Version: '2012-10-17'
    }
  });
});

test('sns as destination', () => {
  // GIVEN
  const topic = new sns.Topic(stack, 'Topic');

  // WHEN
  new lambda.Function(stack, 'Function', {
    ...lambdaProps,
    onSuccess: new destinations.SnsTopic(topic)
  });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::EventInvokeConfig', {
    DestinationConfig: {
      OnSuccess: {
        Destination: {
          Ref: 'TopicBFC7AF6E'
        }
      }
    }
  });

  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'sns:Publish',
          Effect: 'Allow',
          Resource: {
            Ref: 'TopicBFC7AF6E'
          }
        }
      ],
      Version: '2012-10-17'
    }
  });
});

test('sqs as destination', () => {
  // GIVEN
  const queue = new sqs.Queue(stack, 'Queue');

  // WHEN
  new lambda.Function(stack, 'Function', {
    ...lambdaProps,
    onSuccess: new destinations.SqsQueue(queue)
  });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::EventInvokeConfig', {
    DestinationConfig: {
      OnSuccess: {
        Destination: {
          'Fn::GetAtt': [
            'Queue4A7E3555',
            'Arn'
          ]
        }
      }
    }
  });

  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            'sqs:SendMessage',
            'sqs:GetQueueAttributes',
            'sqs:GetQueueUrl'
          ],
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'Queue4A7E3555',
              'Arn'
            ]
          }
        }
      ],
      Version: '2012-10-17'
    }
  });
});
