import { Template } from '@aws-cdk/assertions';
import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { Container, Environment, EnvironmentCapacityType, Service, ServiceDescription } from '../lib';

describe('environment', () => {
  test('should be able to add a service to an environment', () => {
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

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::ECS::Service', 1);

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
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
    });
  });

  test('should be able to create a Fargate environment with a given VPC and cluster', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    const environment = new Environment(stack, 'production', {
      vpc,
      cluster,
    });
    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::ECS::Service', 1);

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
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
    });
  });

  test('should be able to create an environment for EC2', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new ecs.AsgCapacityProvider(stack, 'Provider', {
      autoScalingGroup: new autoscaling.AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        machineImage: ec2.MachineImage.latestAmazonLinux(),
        instanceType: new ec2.InstanceType('t2.micro'),
      }),
    }));

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
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::ECS::Service', 1);

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
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
    });
  });

  test('should be able to create an environment from attributes', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new ecs.AsgCapacityProvider(stack, 'Provider', {
      autoScalingGroup: new autoscaling.AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        machineImage: ec2.MachineImage.latestAmazonLinux(),
        instanceType: new ec2.InstanceType('t2.micro'),
      }),
    }));

    // WHEN
    const environment = Environment.fromEnvironmentAttributes(stack, 'Environment', {
      capacityType: EnvironmentCapacityType.EC2,
      cluster: cluster,
    });

    // THEN
    expect(environment.capacityType).toEqual(EnvironmentCapacityType.EC2);
    expect(environment.cluster).toEqual(cluster);
    expect(environment.vpc).toEqual(vpc);
    expect(environment.id).toEqual('Environment');
  });
});
