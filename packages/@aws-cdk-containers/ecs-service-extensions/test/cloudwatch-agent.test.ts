import { Template } from '@aws-cdk/assertions';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { CloudwatchAgentExtension, Container, Environment, Service, ServiceDescription } from '../lib';

describe('cloudwatch agent', () => {
  test('should be able to add AWS X-Ray to a service', () => {
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

    serviceDescription.add(new CloudwatchAgentExtension());

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
          DependsOn: [
            {
              Condition: 'START',
              ContainerName: 'cloudwatch-agent',
            },
          ],
          Essential: true,
          Image: 'nathanpeck/name',
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
        {
          Environment: [
            {
              Name: 'CW_CONFIG_CONTENT',
              Value: '{"logs":{"metrics_collected":{"emf":{}}},"metrics":{"metrics_collected":{"statsd":{}}}}',
            },
          ],
          Essential: true,
          Image: 'amazon/cloudwatch-agent:latest',
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': {
                Ref: 'myservicetaskdefinitioncloudwatchagentLogGroupDF0CD679',
              },
              'awslogs-stream-prefix': 'cloudwatch-agent',
              'awslogs-region': {
                Ref: 'AWS::Region',
              },
            },
          },
          MemoryReservation: 50,
          Name: 'cloudwatch-agent',
          User: '0:1338',
        },
      ],
      Cpu: '256',
      ExecutionRoleArn: {
        'Fn::GetAtt': [
          'myservicetaskdefinitionExecutionRole0CE74AD0',
          'Arn',
        ],
      },
      Family: 'myservicetaskdefinition',
      Memory: '512',
      NetworkMode: 'awsvpc',
      RequiresCompatibilities: [
        'EC2',
        'FARGATE',
      ],
      TaskRoleArn: {
        'Fn::GetAtt': [
          'myservicetaskdefinitionTaskRole92ACD903',
          'Arn',
        ],
      },
    });
  });
});