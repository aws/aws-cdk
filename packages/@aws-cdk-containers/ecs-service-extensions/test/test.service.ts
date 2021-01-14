import { countResources, expect, haveResource } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Container, EnvironmentCapacityType, Environment, Service, ServiceDescription } from '../lib';

export = {
  'should error if a service is prepared with no addons'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();

    // THEN
    test.throws(() => {
      new Service(stack, 'my-service', {
        environment,
        serviceDescription,
      });
    }, /Service 'my-service' must have a Container extension/);

    test.done();
  },

  'should be able to add a container to the service'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
    });

    const environment = new Environment(stack, 'production', {
      vpc,
      cluster,
      capacityType: EnvironmentCapacityType.EC2,
    });
    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromAsset('./test/test-apps/name'),
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    expect(stack).to(countResources('AWS::ECS::Service', 1));

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