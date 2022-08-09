import { Template } from '@aws-cdk/assertions';
import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as awslogs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Container, Environment, EnvironmentCapacityType, FireLensExtension, Service, ServiceDescription } from '../lib';

describe('container', () => {
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
          'CustomTaskRole3C6B13FD',
          'Arn',
        ],
      },
    });
  });

  test('should be able to enable default logging behavior - with enable default log driver feature flag', () => {
    // GIVEN
    const stack = new cdk.Stack();
    stack.node.setContext(cxapi.ECS_SERVICE_EXTENSIONS_ENABLE_DEFAULT_LOG_DRIVER, true);

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
    Template.fromStack(stack).resourceCountIs('AWS::ECS::Service', 1);

    // Ensure that the log group was created
    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 1);

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
          Essential: true,
          Image: 'nathanpeck/name',
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

  test('should be able to add user-provided log group in the log driver options', () => {
    // GIVEN
    const stack = new cdk.Stack();
    stack.node.setContext(cxapi.ECS_SERVICE_EXTENSIONS_ENABLE_DEFAULT_LOG_DRIVER, true);

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
      logGroup: new awslogs.LogGroup(stack, 'MyLogGroup'),
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
      taskRole,
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::ECS::Service', 1);

    // Ensure that the log group was created
    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 1);

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
          Essential: true,
          Image: 'nathanpeck/name',
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': {
                Ref: 'MyLogGroup5C0DAD85',
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

  test('should error when log group is provided in the container extension and another observability extension is added', () => {
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
      logGroup: new awslogs.LogGroup(stack, 'MyLogGroup'),
    }));
    serviceDescription.add(new FireLensExtension());

    // THEN
    expect(() => {
      new Service(stack, 'my-service', {
        environment,
        serviceDescription,
      });
    }).toThrow(/Log configuration already specified. You cannot provide a log group for the application container of service 'my-service' while also adding log configuration separately using service extensions./);
  });
});
