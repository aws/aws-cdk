import { expect, haveResource } from '@aws-cdk/assert';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { CloudWatchLogsExtension, Container, Environment, Service, ServiceDescription } from '../lib';

export = {
  'should throw an error if there is no Container in the service description'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();
    serviceDescription.add(new CloudWatchLogsExtension());

    // THEN
    test.throws(() => {
      new Service(stack, 'my-service', {
        environment,
        serviceDescription,
      });
    }, /Service 'my-service' must have a Container extension/);

    test.done();
  },

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

    serviceDescription.add(new CloudWatchLogsExtension());

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    expect(stack).to(haveResource('AWS::Logs::LogGroup', {
      LogGroupName: 'my-service-logs',
      RetentionInDays: 731,
    }));

    expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
          Essential: true,
          Image: {
            'Fn::Join': [
              '',
              [
                {
                  Ref: 'AWS::AccountId',
                },
                '.dkr.ecr.',
                {
                  Ref: 'AWS::Region',
                },
                '.',
                {
                  Ref: 'AWS::URLSuffix',
                },
                '/aws-cdk/assets:60341149fe82758ccf014503a67584e45b1d826cf7394debf42572ac8669ca60',
              ],
            ],
          },
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': {
                Ref: 'myservicelogs176EE19F',
              },
              'awslogs-stream-prefix': 'my-service',
              'awslogs-region': {
                Ref: 'AWS::Region',
              },
            },
          },
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