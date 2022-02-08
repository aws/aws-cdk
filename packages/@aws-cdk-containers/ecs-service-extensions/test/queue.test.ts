import { Template } from '@aws-cdk/assertions';
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
    Template.fromStack(stack).hasResourceProperties('AWS::SQS::Queue', {
      MessageRetentionPeriod: 1209600,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SQS::Queue', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
    Template.fromStack(stack).resourceCountIs('AWS::SNS::Subscription', 0);

    // Ensure that the queue URL has been correctly appended to the environment variables
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::SQS::Queue', {
      MessageRetentionPeriod: 1209600,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SQS::Queue', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::SQS::QueuePolicy', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::SNS::Subscription', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::SNS::Subscription', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
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
      topicSubscriptionQueue: {
        queue: new sqs.Queue(stack, 'myQueue'),
      },
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
    Template.fromStack(stack).hasResourceProperties('AWS::SQS::QueuePolicy', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::SQS::QueuePolicy', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::SNS::Subscription', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::SNS::Subscription', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
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

  test('should error when providing both the subscriptionQueue and queue (deprecated) props for a topic subscription', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

    // THEN
    expect(() => {
      new TopicSubscription({
        topic: new sns.Topic(stack, 'topic1'),
        queue: new sqs.Queue(stack, 'delete-queue'),
        topicSubscriptionQueue: {
          queue: new sqs.Queue(stack, 'sign-up-queue'),
        },
      });
    }).toThrow('Either provide the `subscriptionQueue` or the `queue` (deprecated) for the topic subscription, but not both.');
  });

  test('should be able to add target tracking scaling policy for the Events Queue with no subscriptions', () => {
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

    serviceDescription.add(new QueueExtension({
      scaleOnLatency: {
        acceptableLatency: cdk.Duration.minutes(5),
        messageProcessingTime: cdk.Duration.seconds(20),
      },
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
      autoScaleTaskCount: {
        maxTaskCount: 10,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalableTarget', {
      MaxCapacity: 10,
      MinCapacity: 1,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        CustomizedMetricSpecification: {
          Dimensions: [
            {
              Name: 'QueueName',
              Value: {
                'Fn::GetAtt': [
                  'EventsQueueB96EB0D2',
                  'QueueName',
                ],
              },
            },
          ],
          MetricName: 'BacklogPerTask',
          Namespace: 'production-my-service',
          Statistic: 'Average',
          Unit: 'Count',
        },
        TargetValue: 15,
      },
    });
  });

  test('should be able to add target tracking scaling policy for the SQS Queues', () => {
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
      topicSubscriptionQueue: {
        queue: new sqs.Queue(stack, 'myQueue'),
        scaleOnLatency: {
          acceptableLatency: cdk.Duration.minutes(10),
          messageProcessingTime: cdk.Duration.seconds(20),
        },
      },
    });
    const topicSubscription2 = new TopicSubscription({
      topic: new sns.Topic(stack, 'topic2'),
      queue: new sqs.Queue(stack, 'tempQueue'),
    });
    serviceDescription.add(new QueueExtension({
      subscriptions: [topicSubscription1, topicSubscription2],
      eventsQueue: new sqs.Queue(stack, 'defQueue'),
      scaleOnLatency: {
        acceptableLatency: cdk.Duration.minutes(5),
        messageProcessingTime: cdk.Duration.seconds(20),
      },
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
      autoScaleTaskCount: {
        maxTaskCount: 10,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalableTarget', {
      MaxCapacity: 10,
      MinCapacity: 1,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        CustomizedMetricSpecification: {
          Dimensions: [
            {
              Name: 'QueueName',
              Value: {
                'Fn::GetAtt': [
                  'defQueue1F91A65B',
                  'QueueName',
                ],
              },
            },
          ],
          MetricName: 'BacklogPerTask',
          Namespace: 'production-my-service',
          Statistic: 'Average',
          Unit: 'Count',
        },
        TargetValue: 15,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        CustomizedMetricSpecification: {
          Dimensions: [
            {
              Name: 'QueueName',
              Value: {
                'Fn::GetAtt': [
                  'myQueue4FDFF71C',
                  'QueueName',
                ],
              },
            },
          ],
          MetricName: 'BacklogPerTask',
          Namespace: 'production-my-service',
          Statistic: 'Average',
          Unit: 'Count',
        },
        TargetValue: 30,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        CustomizedMetricSpecification: {
          Dimensions: [
            {
              Name: 'QueueName',
              Value: {
                'Fn::GetAtt': [
                  'tempQueueEF946882',
                  'QueueName',
                ],
              },
            },
          ],
          MetricName: 'BacklogPerTask',
          Namespace: 'production-my-service',
          Statistic: 'Average',
          Unit: 'Count',
        },
        TargetValue: 15,
      },
    });
  });

  test('should error when adding scaling policy if scaling target has not been configured', () => {
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
    });

    serviceDescription.add(new QueueExtension({
      subscriptions: [topicSubscription1],
      scaleOnLatency: {
        acceptableLatency: cdk.Duration.minutes(10),
        messageProcessingTime: cdk.Duration.seconds(20),
      },
    }));

    // THEN
    expect(() => {
      new Service(stack, 'my-service', {
        environment,
        serviceDescription,
      });
    }).toThrow(/Auto scaling target for the service 'my-service' hasn't been configured. Please use Service construct to configure 'minTaskCount' and 'maxTaskCount'./);
  });

  test('should error when message processing time for the queue is greater than acceptable latency', () => {
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
      topicSubscriptionQueue: {
        queue: new sqs.Queue(stack, 'sign-up-queue'),
      },
    });

    serviceDescription.add(new QueueExtension({
      subscriptions: [topicSubscription1],
      scaleOnLatency: {
        acceptableLatency: cdk.Duration.seconds(10),
        messageProcessingTime: cdk.Duration.seconds(20),
      },
    }));

    // THEN
    expect(() => {
      new Service(stack, 'my-service', {
        environment,
        serviceDescription,
        autoScaleTaskCount: {
          maxTaskCount: 10,
        },
      });
    }).toThrow('Message processing time (20s) for the queue cannot be greater acceptable queue latency (10s).');
  });

  test('should error when configuring auto scaling only for topic-specific queue', () => {
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
      topicSubscriptionQueue: {
        queue: new sqs.Queue(stack, 'sign-up-queue'),
        scaleOnLatency: {
          acceptableLatency: cdk.Duration.minutes(10),
          messageProcessingTime: cdk.Duration.seconds(20),
        },
      },
    });

    serviceDescription.add(new QueueExtension({
      subscriptions: [topicSubscription1],
    }));

    // THEN
    expect(() => {
      new Service(stack, 'my-service', {
        environment,
        serviceDescription,
        autoScaleTaskCount: {
          maxTaskCount: 10,
        },
      });
    }).toThrow(/Autoscaling for a topic-specific queue cannot be configured as autoscaling based on SQS Queues hasn’t been set up for the service 'my-service'. If you want to enable autoscaling for this service, please also specify 'scaleOnLatency' in the 'QueueExtension'/);
  });
});