import { expect, haveResource } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as ecsPatterns from '../../lib';

export = {
  'should be able to add Firelens to a service'(test: Test) {
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

    myService.add(new ecsPatterns.addons.FireLensAddon());

    // THEN

    // Ensure that the log group was created
    expect(stack).to(haveResource('AWS::Logs::LogGroup'));

    // Ensure that task has a Firelens sidecar and a log configuration
    // pointing at the sidecar
    expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
          DependsOn: [
            {
              Condition: 'START',
              ContainerName: 'firelens',
            },
          ],
          Essential: true,
          Image: 'nathanpeck/name',
          LogConfiguration: {
            LogDriver: 'awsfirelens',
            Options: {
              Name: 'cloudwatch',
              region: {
                Ref: 'AWS::Region',
              },
              log_group_name: {
                Ref: 'myservicelogs176EE19F',
              },
              log_stream_prefix: 'my-service/',
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
        {
          Essential: true,
          FirelensConfiguration: {
            Type: 'fluentbit',
          },
          Image: {
            Ref: 'SsmParameterValueawsserviceawsforfluentbitlatestC96584B6F00A464EAD1953AFF4B05118Parameter',
          },
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': {
                Ref: 'myservicetaskdefinitionfirelensLogGroup0D59B0EB',
              },
              'awslogs-stream-prefix': 'firelens',
              'awslogs-region': {
                Ref: 'AWS::Region',
              },
            },
          },
          MemoryReservation: 50,
          Name: 'firelens',
          User: '0:1338',
        },
      ],
      Cpu: '256',
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