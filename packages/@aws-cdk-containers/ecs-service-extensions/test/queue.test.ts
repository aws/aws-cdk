import '@aws-cdk/assert-internal/jest';
import * as ecs from '@aws-cdk/aws-ecs';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import { Container, Environment, QueueExtension, Service, ServiceDescription, TopicSubscription } from '../lib';

describe('queue', () => {
  test('should only create a default queue when no input props are provided', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
      environment: {
        PORT: '80',
      },
    }));

    // WHEN
    serviceDescription.add(new QueueExtension());

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    // Ensure creation of default queue and queue policy allowing SNS Topics to send message to the queue
    expect(stack).toHaveResource('AWS::SQS::Queue', {
      MessageRetentionPeriod: 1209600,
    });

    expect(stack).toHaveResource('AWS::SQS::Queue', {
      RedrivePolicy: {
        deadLetterTargetArn: {
          'Fn::GetAtt': [
            'EventsDeadLetterQueue404572C7',
            'Arn',
          ],
        },
        maxReceiveCount: 3,
      },
    });

    // Ensure the task role is given permissions to consume messages from the queue
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'sqs:ReceiveMessage',
              'sqs:ChangeMessageVisibility',
              'sqs:GetQueueUrl',
              'sqs:DeleteMessage',
              'sqs:GetQueueAttributes',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'EventsQueueB96EB0D2',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });

    // Ensure there are no SNS Subscriptions created
    expect(stack).toCountResources('AWS::SNS::Subscription', 0);

    // Ensure that the queue URL has been correctly appended to the environment variables
    expect(stack).toHaveResource('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
          Environment: [
            {
              Name: 'PORT',
              Value: '80',
            },
            {
              Name: 'MY-SERVICE_QUEUE_URI',
              Value: {
                Ref: 'EventsQueueB96EB0D2',
              },
            },
          ],
          Image: 'nathanpeck/name',
          Essential: true,
          Memory: 512,
          Name: 'app',
          PortMappings: [
            {
              ContainerPort: 80,
              Protocol: 'tcp',
            },
          ],
          Ulimits: [
            {
              HardLimit: 1024000,
              Name: 'nofile',
              SoftLimit: 1024000,
            },
          ],
        },
      ],
    });


  });

  test('should be able to subscribe default events queue created by the extension to given topics', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
      environment: {
        PORT: '80',
      },
    }));

    // WHEN
    const topicSubscription1 = new TopicSubscription({
      topic: new sns.Topic(stack, 'topic1'),
    });
    const topicSubscription2 = new TopicSubscription({
      topic: new sns.Topic(stack, 'topic2'),
    });
    serviceDescription.add(new QueueExtension({
      subscriptions: [topicSubscription1, topicSubscription2],
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    // Ensure creation of default queue and queue policy allowing SNS Topics to send message to the queue
    expect(stack).toHaveResource('AWS::SQS::Queue', {
      MessageRetentionPeriod: 1209600,
    });

    expect(stack).toHaveResource('AWS::SQS::Queue', {
      RedrivePolicy: {
        deadLetterTargetArn: {
          'Fn::GetAtt': [
            'EventsDeadLetterQueue404572C7',
            'Arn',
          ],
        },
        maxReceiveCount: 3,
      },
    });

    expect(stack).toHaveResource('AWS::SQS::QueuePolicy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sqs:SendMessage',
            Condition: {
              ArnEquals: {
                'aws:SourceArn': {
                  Ref: 'topic152D84A37',
                },
              },
            },
            Effect: 'Allow',
            Principal: {
              Service: 'sns.amazonaws.com',
            },
            Resource: {
              'Fn::GetAtt': [
                'EventsQueueB96EB0D2',
                'Arn',
              ],
            },
          },
          {
            Action: 'sqs:SendMessage',
            Condition: {
              ArnEquals: {
                'aws:SourceArn': {
                  Ref: 'topic2A4FB547F',
                },
              },
            },
            Effect: 'Allow',
            Principal: {
              Service: 'sns.amazonaws.com',
            },
            Resource: {
              'Fn::GetAtt': [
                'EventsQueueB96EB0D2',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });

    // Ensure the task role is given permissions to consume messages from the queue
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'sqs:ReceiveMessage',
              'sqs:ChangeMessageVisibility',
              'sqs:GetQueueUrl',
              'sqs:DeleteMessage',
              'sqs:GetQueueAttributes',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'EventsQueueB96EB0D2',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });

    // Ensure SNS Subscriptions for given topics
    expect(stack).toHaveResource('AWS::SNS::Subscription', {
      Protocol: 'sqs',
      TopicArn: {
        Ref: 'topic152D84A37',
      },
      Endpoint: {
        'Fn::GetAtt': [
          'EventsQueueB96EB0D2',
          'Arn',
        ],
      },
    });

    expect(stack).toHaveResource('AWS::SNS::Subscription', {
      Protocol: 'sqs',
      TopicArn: {
        Ref: 'topic2A4FB547F',
      },
      Endpoint: {
        'Fn::GetAtt': [
          'EventsQueueB96EB0D2',
          'Arn',
        ],
      },
    });

    // Ensure that the queue URL has been correctly appended to the environment variables
    expect(stack).toHaveResource('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
          Environment: [
            {
              Name: 'PORT',
              Value: '80',
            },
            {
              Name: 'MY-SERVICE_QUEUE_URI',
              Value: {
                Ref: 'EventsQueueB96EB0D2',
              },
            },
          ],
          Image: 'nathanpeck/name',
          Essential: true,
          Memory: 512,
          Name: 'app',
          PortMappings: [
            {
              ContainerPort: 80,
              Protocol: 'tcp',
            },
          ],
          Ulimits: [
            {
              HardLimit: 1024000,
              Name: 'nofile',
              SoftLimit: 1024000,
            },
          ],
        },
      ],
    });


  });

  test('should be able to subscribe user-provided queue to given topics', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

    const topicSubscription1 = new TopicSubscription({
      topic: new sns.Topic(stack, 'topic1'),
      queue: new sqs.Queue(stack, 'myQueue'),
    });
    const topicSubscription2 = new TopicSubscription({
      topic: new sns.Topic(stack, 'topic2'),
    });
    serviceDescription.add(new QueueExtension({
      subscriptions: [topicSubscription1, topicSubscription2],
      eventsQueue: new sqs.Queue(stack, 'defQueue'),
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    // Ensure queue policy allows SNS Topics to send message to the queue
    expect(stack).toHaveResource('AWS::SQS::QueuePolicy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sqs:SendMessage',
            Condition: {
              ArnEquals: {
                'aws:SourceArn': {
                  Ref: 'topic152D84A37',
                },
              },
            },
            Effect: 'Allow',
            Principal: {
              Service: 'sns.amazonaws.com',
            },
            Resource: {
              'Fn::GetAtt': [
                'myQueue4FDFF71C',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });

    expect(stack).toHaveResource('AWS::SQS::QueuePolicy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sqs:SendMessage',
            Condition: {
              ArnEquals: {
                'aws:SourceArn': {
                  Ref: 'topic2A4FB547F',
                },
              },
            },
            Effect: 'Allow',
            Principal: {
              Service: 'sns.amazonaws.com',
            },
            Resource: {
              'Fn::GetAtt': [
                'defQueue1F91A65B',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });

    // Ensure the task role is given permissions to consume messages from the queue
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'sqs:ReceiveMessage',
              'sqs:ChangeMessageVisibility',
              'sqs:GetQueueUrl',
              'sqs:DeleteMessage',
              'sqs:GetQueueAttributes',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'defQueue1F91A65B',
                'Arn',
              ],
            },
          },
          {
            Action: [
              'sqs:ReceiveMessage',
              'sqs:ChangeMessageVisibility',
              'sqs:GetQueueUrl',
              'sqs:DeleteMessage',
              'sqs:GetQueueAttributes',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'myQueue4FDFF71C',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });

    // Ensure SNS Subscriptions for given topics
    expect(stack).toHaveResource('AWS::SNS::Subscription', {
      Protocol: 'sqs',
      TopicArn: {
        Ref: 'topic152D84A37',
      },
      Endpoint: {
        'Fn::GetAtt': [
          'myQueue4FDFF71C',
          'Arn',
        ],
      },
    });

    expect(stack).toHaveResource('AWS::SNS::Subscription', {
      Protocol: 'sqs',
      TopicArn: {
        Ref: 'topic2A4FB547F',
      },
      Endpoint: {
        'Fn::GetAtt': [
          'defQueue1F91A65B',
          'Arn',
        ],
      },
    });

    // Ensure that the queue URL has been correctly added to the environment variables
    expect(stack).toHaveResource('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
          Environment: [
            {
              Name: 'MY-SERVICE_QUEUE_URI',
              Value: {
                Ref: 'defQueue1F91A65B',
              },
            },
          ],
          Image: 'nathanpeck/name',
          Essential: true,
          Memory: 512,
          Name: 'app',
          PortMappings: [
            {
              ContainerPort: 80,
              Protocol: 'tcp',
            },
          ],
          Ulimits: [
            {
              HardLimit: 1024000,
              Name: 'nofile',
              SoftLimit: 1024000,
            },
          ],
        },
      ],
    });


  });
});