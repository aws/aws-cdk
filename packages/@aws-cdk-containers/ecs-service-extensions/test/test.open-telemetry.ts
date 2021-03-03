import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { OpenTelemetryCollector, Container, Environment, Service, ServiceDescription } from '../lib';

export = {
  'should be able to add CloudWatch logs to a service'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromAsset('./test/test-apps/name'),
    }));

    serviceDescription.add(new OpenTelemetryCollector());

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
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
        {
          Essential: true,
          Image: 'amazon/aws-otel-collector:latest',
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': {
                Ref: 'myservicetaskdefinitionopentelemetrycollectorLogGroup174A94C6',
              },
              'awslogs-stream-prefix': 'open-telemetry-collector',
              'awslogs-region': {
                Ref: 'AWS::Region',
              },
            },
          },
          MemoryReservation: 50,
          Name: 'open-telemetry-collector',
          PortMappings: [
            {
              ContainerPort: 55680,
              Protocol: 'tcp',
            },
          ],
          Secrets: [
            {
              Name: 'AOT_CONFIG_CONTENT',
              ValueFrom: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':ssm:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':parameter/',
                    {
                      Ref: 'myserviceopentelemetryconfig9F91561F',
                    },
                  ],
                ],
              },
            },
          ],
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
    }));

    test.done();
  },

};