import { countResources, expect, haveResource } from '@aws-cdk/assert-internal';
import * as ecs from '@aws-cdk/aws-ecs';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Container, Environment, SubscribeExtension, Service, ServiceDescription } from '../lib';

export = {
  'should create a default queue when no input props are provided'(test: Test) {
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
    serviceDescription.add(new SubscribeExtension());

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    // Ensure creation of default queue and queue policy allowing SNS Topics to send message to the queue
    expect(stack).to(haveResource('AWS::SQS::Queue', {
      MessageRetentionPeriod: 1209600,
    }));

    expect(stack).to(haveResource('AWS::SQS::Queue', {
      RedrivePolicy: {
        deadLetterTargetArn: {
          'Fn::GetAtt': [
            'EventsDeadLetterQueue404572C7',
            'Arn',
          ],
        },
        maxReceiveCount: 3,
      },
    }));

    // Ensure the task role is given permissions to consume messages from the queue
    expect(stack).to(haveResource('AWS::IAM::Policy', {
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
                'EventsDeadLetterQueue404572C7',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    }));

    // Ensure there are no SNS Subscriptions created
    expect(stack).to(countResources('AWS::SNS::Subscription', 0));

    // Ensure that the queue URL has been correctly appended to the environment variables
    expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
          Environment: [
            {
              Name: 'PORT',
              Value: '80',
            },
            {
              Name: 'MY-SERVICE_EVENTS_QUEUE_URL',
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
    }));

    test.done();
  },

  'should be able to subscribe default events queue created by the extension to given topics'(test: Test) {
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
    const topicSubscription1 = {
      topic: new sns.Topic(stack, 'topic1'),
    };
    const topicSubscription2 = {
      topic: new sns.Topic(stack, 'topic2'),
    };
    serviceDescription.add(new SubscribeExtension({
      topicSubscriptions: [topicSubscription1, topicSubscription2],
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    // Ensure creation of default queue and queue policy allowing SNS Topics to send message to the queue
    expect(stack).to(haveResource('AWS::SQS::Queue', {
      MessageRetentionPeriod: 1209600,
    }));

    expect(stack).to(haveResource('AWS::SQS::Queue', {
      RedrivePolicy: {
        deadLetterTargetArn: {
          'Fn::GetAtt': [
            'EventsDeadLetterQueue404572C7',
            'Arn',
          ],
        },
        maxReceiveCount: 3,
      },
    }));

    expect(stack).to(haveResource('AWS::SQS::QueuePolicy', {
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
    }));

    // Ensure the task role is given permissions to consume messages from the queue
    expect(stack).to(haveResource('AWS::IAM::Policy', {
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
                'EventsDeadLetterQueue404572C7',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    }));

    // Ensure SNS Subscriptions for given topics
    expect(stack).to(haveResource('AWS::SNS::Subscription', {
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
    }));

    expect(stack).to(haveResource('AWS::SNS::Subscription', {
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
    }));

    // Ensure that the queue URL has been correctly appended to the environment variables
    expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
          Environment: [
            {
              Name: 'PORT',
              Value: '80',
            },
            {
              Name: 'MY-SERVICE_EVENTS_QUEUE_URL',
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
    }));

    test.done();
  },

  'should be able to subscribe user-provided queue to given topics'(test: Test) {
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

    const topicSubscription1 = {
      topic: new sns.Topic(stack, 'topic1'),
      queue: new sqs.Queue(stack, 'myQueue'),
    };
    const topicSubscription2 = {
      topic: new sns.Topic(stack, 'topic2'),
    };
    serviceDescription.add(new SubscribeExtension({
      topicSubscriptions: [topicSubscription1, topicSubscription2],
      eventsQueue: new sqs.Queue(stack, 'defQueue'),
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    // Ensure queue policy allows SNS Topics to send message to the queue
    expect(stack).to(haveResource('AWS::SQS::QueuePolicy', {
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
    }));

    expect(stack).to(haveResource('AWS::SQS::QueuePolicy', {
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
    }));

    // Ensure the task role is given permissions to consume messages from the queue
    expect(stack).to(haveResource('AWS::IAM::Policy', {
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
                'myQueue4FDFF71C',
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
                'defQueue1F91A65B',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    }));

    // Ensure SNS Subscriptions for given topics
    expect(stack).to(haveResource('AWS::SNS::Subscription', {
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
    }));

    expect(stack).to(haveResource('AWS::SNS::Subscription', {
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
    }));

    // Ensure that the queue URL has been correctly added to the environment variables
    expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
          Environment: [
            {
              Name: 'MY-SERVICE_EVENTS_QUEUE_URL',
              Value: {
                Ref: 'defQueue1F91A65B',
              },
            },
            {
              Name: 'MY-SERVICE_TOPIC1_QUEUE_URL',
              Value: {
                Ref: 'myQueue4FDFF71C',
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
    }));

    test.done();
  },

  'should be able to subscribe queue created using props to given topics'(test: Test) {
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

    const topicSubscription1 = {
      topic: new sns.Topic(stack, 'topic1'),
      queueProps: {
        fifo: true,
        encryption: sqs.QueueEncryption.KMS,
      },
      deadLetterQueueProps: {
        maxReceiveCount: 4,
      },
    };
    const topicSubscription2 = {
      topic: new sns.Topic(stack, 'topic2'),
      queueProps: {
        deadLetterQueue: {
          queue: new sqs.Queue(stack, 'myDLQ'),
          maxReceiveCount: 5,
        },
      },
    };
    serviceDescription.add(new SubscribeExtension({
      topicSubscriptions: [topicSubscription1, topicSubscription2],
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    // Ensure creation of default queue and queue policy allowing SNS Topics to send message to the queue
    expect(stack).to(countResources('AWS::SQS::Queue', 6));

    expect(stack).to(haveResource('AWS::SQS::Queue', {
      RedrivePolicy: {
        deadLetterTargetArn: {
          'Fn::GetAtt': [
            'EventsDeadLetterQueue404572C7',
            'Arn',
          ],
        },
        maxReceiveCount: 3,
      },
    }));

    expect(stack).to(haveResource('AWS::SQS::Queue', {
      FifoQueue: true,
      KmsMasterKeyId: {
        'Fn::GetAtt': [
          'topic1QueueKeyDB4537D0',
          'Arn',
        ],
      },
      RedrivePolicy: {
        deadLetterTargetArn: {
          'Fn::GetAtt': [
            'topic1DeadLetterQueue6BEFAEFB',
            'Arn',
          ],
        },
        maxReceiveCount: 4,
      },
    }));

    expect(stack).to(haveResource('AWS::SQS::Queue', {
      RedrivePolicy: {
        deadLetterTargetArn: {
          'Fn::GetAtt': [
            'myDLQ6DE11BD7',
            'Arn',
          ],
        },
        maxReceiveCount: 5,
      },
    }));

    expect(stack).to(haveResource('AWS::SQS::QueuePolicy', {
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
                'topic1QueueF99E99CC',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    }));

    expect(stack).to(haveResource('AWS::SQS::QueuePolicy', {
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
                'topic2Queue95E8EBEC',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    }));

    // Ensure the task role is given permissions to consume messages from the queue
    expect(stack).to(haveResource('AWS::IAM::Policy', {
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
                'topic1QueueF99E99CC',
                'Arn',
              ],
            },
          },
          {
            Action: 'kms:Decrypt',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'topic1QueueKeyDB4537D0',
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
                'topic2Queue95E8EBEC',
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
                'EventsQueueB96EB0D2',
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
                'EventsDeadLetterQueue404572C7',
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
                'topic1DeadLetterQueue6BEFAEFB',
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
                'myDLQ6DE11BD7',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    }));

    // Ensure SNS Subscriptions for given topics
    expect(stack).to(haveResource('AWS::SNS::Subscription', {
      Protocol: 'sqs',
      TopicArn: {
        Ref: 'topic152D84A37',
      },
      Endpoint: {
        'Fn::GetAtt': [
          'topic1QueueF99E99CC',
          'Arn',
        ],
      },
    }));

    expect(stack).to(haveResource('AWS::SNS::Subscription', {
      Protocol: 'sqs',
      TopicArn: {
        Ref: 'topic2A4FB547F',
      },
      Endpoint: {
        'Fn::GetAtt': [
          'topic2Queue95E8EBEC',
          'Arn',
        ],
      },
    }));

    // Ensure that the queue URL has been correctly added to the environment variables
    expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
          Environment: [
            {
              Name: 'MY-SERVICE_EVENTS_QUEUE_URL',
              Value: {
                Ref: 'EventsQueueB96EB0D2',
              },
            },
            {
              Name: 'MY-SERVICE_TOPIC1_QUEUE_URL',
              Value: {
                Ref: 'topic1QueueF99E99CC',
              },
            },
            {
              Name: 'MY-SERVICE_TOPIC2_QUEUE_URL',
              Value: {
                Ref: 'topic2Queue95E8EBEC',
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
    }));

    test.done();
  },

  'should throw error if both events queue and events queue props are provided'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

    const topicSubscription1 = {
      topic: new sns.Topic(stack, 'topic1'),
    };

    // THEN
    test.throws(() => {
      serviceDescription.add(new SubscribeExtension({
        topicSubscriptions: [topicSubscription1],
        eventsQueue: new sqs.Queue(stack, 'my-queue'),
        eventsQueueProps: {
          fifo: true,
        },
      }));
    }, /You can only specify either a queue or queue props for creating the default events queue./);

    test.done();
  },

  'should throw error if both topic queue and topic queue props are provided'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

    // WHEN
    const topicSubscription1 = {
      topic: new sns.Topic(stack, 'topic1'),
      queue: new sqs.Queue(stack, 'topic1-queue'),
      queueProps: {
        fifo: true,
      },
    };

    serviceDescription.add(new SubscribeExtension({
      topicSubscriptions: [topicSubscription1],
    }));

    // THEN
    test.throws(() => {
      new Service(stack, 'my-service', {
        environment,
        serviceDescription,
      });
    }, /You can only specify either a queue or queue props for creating a queue for topic topic1./);

    test.done();
  },

  'should throw error if both events Dead Letter Queue and events Dead Letter Queue props are provided'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

    // WHEN
    const topicSubscription1 = {
      topic: new sns.Topic(stack, 'topic1'),
    };

    serviceDescription.add(new SubscribeExtension({
      topicSubscriptions: [topicSubscription1],
      eventsQueueProps: {
        deadLetterQueue: {
          queue: new sqs.Queue(stack, 'events-dlq'),
          maxReceiveCount: 4,
        },
      },
      eventsDeadLetterQueueProps: {
        maxReceiveCount: 3,
      },
    }));

    // THEN
    test.throws(() => {
      new Service(stack, 'my-service', {
        environment,
        serviceDescription,
      });
    }, /You can only specify either a Dead Letter Queue or Dead Letter Queue props for creating the EventsDeadLetterQueue./);

    test.done();
  },

  'should throw error if both topic Dead Letter Queue and topic Dead Letter Queue props are provided'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

    // WHEN
    const topicSubscription1 = {
      topic: new sns.Topic(stack, 'topic1'),
      queueProps: {
        deadLetterQueue: {
          queue: new sqs.Queue(stack, 'topic1-dlq'),
          maxReceiveCount: 4,
        },
      },
      deadLetterQueueProps: {
        maxReceiveCount: 3,
      },
    };

    serviceDescription.add(new SubscribeExtension({
      topicSubscriptions: [topicSubscription1],
    }));

    // THEN
    test.throws(() => {
      new Service(stack, 'my-service', {
        environment,
        serviceDescription,
      });
    }, /You can only specify either a Dead Letter Queue or Dead Letter Queue props for creating the topic1DeadLetterQueue./);

    test.done();
  },
};