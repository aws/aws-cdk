import { countResources, expect, haveResource } from '@aws-cdk/assert-internal';
import * as ecs from '@aws-cdk/aws-ecs';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Container, Environment, PublisherExtension, PublisherTopic, Service, ServiceDescription } from '../lib';

export = {
  'correctly sets publish permissions for given topics'(test: Test) {
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
    const topic1 = new PublisherTopic({
      topic: new sns.Topic(stack, 'topic1'),
    });

    const topic2 = new PublisherTopic({
      topic: new sns.Topic(stack, 'topic2'),
    });

    serviceDescription.add(new PublisherExtension({
      publishers: [topic1, topic2],
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    // Ensure creation of provided topics
    expect(stack).to(countResources('AWS::SNS::Topic', 2));

    // Ensure the task role is given permissions to publish events to topics
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'topic152D84A37',
            },
          },
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'topic2A4FB547F',
            },
          },
        ],
        Version: '2012-10-17',
      },
    }));

    // Ensure that the topic ARNs have been correctly appended to the environment variables
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
              Name: 'MY-SERVICE_TOPIC1_ARN',
              Value: {
                Ref: 'topic152D84A37',
              },
            },
            {
              Name: 'MY-SERVICE_TOPIC2_ARN',
              Value: {
                Ref: 'topic2A4FB547F',
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

  'correctly sets up subscribe permissions for given accounts'(test: Test) {
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
    const topic1 = new PublisherTopic({
      topic: new sns.Topic(stack, 'topic1'),
      allowedAccounts: ['123456789012', '123456789013'],
    });

    const topic2 = new PublisherTopic({
      topic: new sns.Topic(stack, 'topic2'),
      allowedAccounts: ['123456789012'],
    });

    serviceDescription.add(new PublisherExtension({
      publishers: [topic1, topic2],
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    // Ensure creation of provided topics
    expect(stack).to(countResources('AWS::SNS::Topic', 2));

    // Ensure Topic Policy gives subscribe permissions to allowed accounts
    expect(stack).to(haveResource('AWS::SNS::TopicPolicy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Subscribe',
            Effect: 'Allow',
            Principal: {
              AWS: [
                {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':iam::123456789012:root',
                    ],
                  ],
                },
                {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':iam::123456789013:root',
                    ],
                  ],
                },
              ],
            },
            Resource: {
              Ref: 'topic152D84A37',
            },
            Sid: '0',
          },
        ],
        Version: '2012-10-17',
      },
      Topics: [
        {
          Ref: 'topic152D84A37',
        },
      ],
    }));

    expect(stack).to(haveResource('AWS::SNS::TopicPolicy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Subscribe',
            Effect: 'Allow',
            Principal: {
              AWS:
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':iam::123456789012:root',
                  ],
                ],
              },
            },
            Resource: {
              Ref: 'topic2A4FB547F',
            },
            Sid: '0',
          },
        ],
        Version: '2012-10-17',
      },
      Topics: [
        {
          Ref: 'topic2A4FB547F',
        },
      ],
    }));

    // Ensure the task role is given permissions to publish events to topics
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'topic152D84A37',
            },
          },
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'topic2A4FB547F',
            },
          },
        ],
        Version: '2012-10-17',
      },
    }));

    // Ensure that the topic ARNs have been correctly appended to the environment variables
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
              Name: 'MY-SERVICE_TOPIC1_ARN',
              Value: {
                Ref: 'topic152D84A37',
              },
            },
            {
              Name: 'MY-SERVICE_TOPIC2_ARN',
              Value: {
                Ref: 'topic2A4FB547F',
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
};