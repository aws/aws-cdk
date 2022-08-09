import { Template } from '@aws-cdk/assertions';
import * as ecs from '@aws-cdk/aws-ecs';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { Container, Environment, InjecterExtension, InjectableTopic, Service, ServiceDescription } from '../lib';

describe('injecter', () => {
  test('correctly sets publish permissions for given topics', () => {
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
    const topic1 = new InjectableTopic({
      topic: new sns.Topic(stack, 'topic1'),
    });

    const topic2 = new InjectableTopic({
      topic: new sns.Topic(stack, 'topic2'),
    });

    serviceDescription.add(new InjecterExtension({
      injectables: [topic1, topic2],
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    // Ensure creation of provided topics
    Template.fromStack(stack).resourceCountIs('AWS::SNS::Topic', 2);

    // Ensure the task role is given permissions to publish events to topics
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
    });

    // Ensure that the topic ARNs have been correctly appended to the environment variables
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
              Name: 'TOPIC1_TOPIC_ARN',
              Value: {
                Ref: 'topic152D84A37',
              },
            },
            {
              Name: 'TOPIC2_TOPIC_ARN',
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
    });
  });
});