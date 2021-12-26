import { ABSENT } from '@aws-cdk/assert-internal';
import '@aws-cdk/assert-internal/jest';
import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Container, EnvironmentCapacityType, Environment, Service, ServiceDescription } from '../lib';

describe('service', () => {
  test('should error if a service is prepared with no addons', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();

    // THEN
    expect(() => {
      new Service(stack, 'my-service', {
        environment,
        serviceDescription,
      });
    }).toThrow(/Service 'my-service' must have a Container extension/);


  });

  test('should be able to add a container to the service', () => {
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

    const environment = new Environment(stack, 'production', {
      vpc,
      cluster,
      capacityType: EnvironmentCapacityType.EC2,
    });
    const serviceDescription = new ServiceDescription();
    const taskRole = new iam.Role(stack, 'CustomTaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
      taskRole,
    });

    // THEN
    expect(stack).toCountResources('AWS::ECS::Service', 1);

    expect(stack).toHaveResource('AWS::ECS::TaskDefinition', {
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
          'CustomTaskRole3C6B13FD',
          'Arn',
        ],
      },
    });


  });

  test('allows scaling on a target CPU utilization', () => {
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
      desiredCount: 3,
      autoScaleTaskCount: {
        maxTaskCount: 5,
        targetCpuUtilization: 70,
      },
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::ECS::Service', {
      DesiredCount: ABSENT,
    });

    expect(stack).toHaveResourceLike('AWS::ApplicationAutoScaling::ScalableTarget', {
      MaxCapacity: 5,
      MinCapacity: 1,
    });

    expect(stack).toHaveResource('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: { PredefinedMetricType: 'ECSServiceAverageCPUUtilization' },
        TargetValue: 70,
      },
    });
  });

  test('allows scaling on a target memory utilization', () => {
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
      desiredCount: 3,
      autoScaleTaskCount: {
        maxTaskCount: 5,
        targetMemoryUtilization: 70,
      },
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::ECS::Service', {
      DesiredCount: ABSENT,
    });

    expect(stack).toHaveResourceLike('AWS::ApplicationAutoScaling::ScalableTarget', {
      MaxCapacity: 5,
      MinCapacity: 1,
    });

    expect(stack).toHaveResource('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: { PredefinedMetricType: 'ECSServiceAverageMemoryUtilization' },
        TargetValue: 70,
      },
    });
  });

  test('should error when no auto scaling policies have been configured after creating the auto scaling target', () => {
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

    // THEN
    expect(() => {
      new Service(stack, 'my-service', {
        environment,
        serviceDescription,
        autoScaleTaskCount: {
          maxTaskCount: 5,
        },
      });
    }).toThrow(/The auto scaling target for the service 'my-service' has been created but no auto scaling policies have been configured./);
  });

});