import { expect, haveResource } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as ecsPatterns from '../../lib';

export = {
  'should be able to add AWS X-Ray to a service'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
    });

    // WHEN
    const myService = new ecsPatterns.Service(stack, 'my-service', {
      vpc,
      cluster,
      capacityType: ecsPatterns.EnvironmentCapacityType.EC2,
    });

    myService.add(new ecsPatterns.addons.Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

    myService.add(new ecsPatterns.addons.XRayAddon());

    // THEN

    // Ensure that task has a Firelens sidecar and a log configuration
    // pointing at the sidecar
    expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
          DependsOn: [
            {
              Condition: 'HEALTHY',
              ContainerName: 'xray',
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
              Name: 'AWS_REGION',
              Value: {
                Ref: 'AWS::Region',
              },
            },
          ],
          Essential: true,
          HealthCheck: {
            Command: [
              'CMD-SHELL',
              'curl -s http://localhost:2000',
            ],
            Interval: 5,
            Retries: 3,
            StartPeriod: 10,
            Timeout: 2,
          },
          Image: 'amazon/aws-xray-daemon',
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': {
                Ref: 'myservicetaskdefinitionxrayLogGroupC0252525',
              },
              'awslogs-stream-prefix': 'xray',
              'awslogs-region': {
                Ref: 'AWS::Region',
              },
            },
          },
          MemoryReservation: 256,
          Name: 'xray',
          User: '1337',
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