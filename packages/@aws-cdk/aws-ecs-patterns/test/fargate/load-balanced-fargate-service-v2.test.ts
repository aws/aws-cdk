import { Match, Template } from '@aws-cdk/assertions';
import { Vpc } from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { ContainerImage } from '@aws-cdk/aws-ecs';
import { CompositePrincipal, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Duration, Stack } from '@aws-cdk/core';
import { ApplicationLoadBalancedFargateService, ApplicationMultipleTargetGroupsFargateService, NetworkLoadBalancedFargateService, NetworkMultipleTargetGroupsFargateService } from '../../lib';

describe('When Application Load Balancer', () => {
  test('test Fargate loadbalanced construct with default settings', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ApplicationMultipleTargetGroupsFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
      },
    });

    // THEN - stack contains a load balancer and a service
    Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::LoadBalancer', 1);

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      LaunchType: 'FARGATE',
      LoadBalancers: [
        {
          ContainerName: 'web',
          ContainerPort: 80,
          TargetGroupArn: {
            Ref: 'ServiceLBPublicListenerECSGroup0CC8688C',
          },
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Image: 'test',
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': {
                Ref: 'ServiceTaskDefwebLogGroup2A898F61',
              },
              'awslogs-stream-prefix': 'Service',
              'awslogs-region': {
                Ref: 'AWS::Region',
              },
            },
          },
          Name: 'web',
          PortMappings: [
            {
              ContainerPort: 80,
              Protocol: 'tcp',
            },
          ],
        }),
      ],
      Cpu: '256',
      ExecutionRoleArn: {
        'Fn::GetAtt': [
          'ServiceTaskDefExecutionRole919F7BE3',
          'Arn',
        ],
      },
      Family: 'ServiceTaskDef79D79521',
      Memory: '512',
      NetworkMode: 'awsvpc',
      RequiresCompatibilities: [
        'FARGATE',
      ],
    });
  });

  test('test Fargate loadbalanced construct with all settings', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ApplicationMultipleTargetGroupsFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
        containerName: 'hello',
        containerPorts: [80, 90],
        enableLogging: false,
        environment: {
          TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
          TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
        },
        logDriver: new ecs.AwsLogDriver({
          streamPrefix: 'TestStream',
        }),
        family: 'Ec2TaskDef',
        executionRole: new Role(stack, 'ExecutionRole', {
          path: '/',
          assumedBy: new CompositePrincipal(
            new ServicePrincipal('ecs.amazonaws.com'),
            new ServicePrincipal('ecs-tasks.amazonaws.com'),
          ),
        }),
        taskRole: new Role(stack, 'TaskRole', {
          assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
        }),
        dockerLabels: { label1: 'labelValue1', label2: 'labelValue2' },
      },
      cpu: 256,
      assignPublicIp: true,
      memoryLimitMiB: 512,
      desiredCount: 3,
      enableECSManagedTags: true,
      healthCheckGracePeriod: Duration.millis(2000),
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
      propagateTags: ecs.PropagatedTagSource.SERVICE,
      serviceName: 'myService',
      targetGroups: [
        {
          containerPort: 80,
        },
        {
          containerPort: 90,
          pathPattern: 'a/b/c',
          priority: 10,
          protocol: ecs.Protocol.TCP,
        },
      ],
    });

    // THEN - stack contains a load balancer and a service
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DesiredCount: 3,
      EnableECSManagedTags: true,
      HealthCheckGracePeriodSeconds: 2,
      LaunchType: 'FARGATE',
      LoadBalancers: [
        {
          ContainerName: 'hello',
          ContainerPort: 80,
          TargetGroupArn: {
            Ref: 'ServiceLBPublicListenerECSTargetGrouphello80Group233A4D54',
          },
        },
        {
          ContainerName: 'hello',
          ContainerPort: 90,
          TargetGroupArn: {
            Ref: 'ServiceLBPublicListenerECSTargetGrouphello90GroupE58E4EAB',
          },
        },
      ],
      NetworkConfiguration: {
        AwsvpcConfiguration: {
          AssignPublicIp: 'ENABLED',
          SecurityGroups: [
            {
              'Fn::GetAtt': [
                'ServiceSecurityGroupEEA09B68',
                'GroupId',
              ],
            },
          ],
          Subnets: [
            {
              Ref: 'VPCPublicSubnet1SubnetB4246D30',
            },
            {
              Ref: 'VPCPublicSubnet2Subnet74179F39',
            },
          ],
        },
      },
      PlatformVersion: ecs.FargatePlatformVersion.VERSION1_4,
      PropagateTags: 'SERVICE',
      ServiceName: 'myService',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: [
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE1',
              Value: 'test environment variable 1 value',
            },
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE2',
              Value: 'test environment variable 2 value',
            },
          ],
          Essential: true,
          Image: 'test',
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': {
                Ref: 'ServiceTaskDefhelloLogGroup44519781',
              },
              'awslogs-stream-prefix': 'TestStream',
              'awslogs-region': {
                Ref: 'AWS::Region',
              },
            },
          },
          Name: 'hello',
          PortMappings: [
            {
              ContainerPort: 80,
              Protocol: 'tcp',
            },
            {
              ContainerPort: 90,
              Protocol: 'tcp',
            },
          ],
          DockerLabels: {
            label1: 'labelValue1',
            label2: 'labelValue2',
          },
        },
      ],
      Cpu: '256',
      ExecutionRoleArn: {
        'Fn::GetAtt': [
          'ExecutionRole605A040B',
          'Arn',
        ],
      },
      Family: 'Ec2TaskDef',
      Memory: '512',
      NetworkMode: 'awsvpc',
      RequiresCompatibilities: [
        'FARGATE',
      ],
      TaskRoleArn: {
        'Fn::GetAtt': [
          'TaskRole30FC0FBB',
          'Arn',
        ],
      },
    });
  });

  test('errors if no essential container in pre-defined task definition', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

    // THEN
    expect(() => {
      new ApplicationMultipleTargetGroupsFargateService(stack, 'Service', {
        cluster,
        taskDefinition,
      });
    }).toThrow(/At least one essential container must be specified/);
  });

  test('errors when setting both taskDefinition and taskImageOptions', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'Ec2TaskDef');

    // THEN
    expect(() => {
      new ApplicationMultipleTargetGroupsFargateService(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('test'),
        },
        taskDefinition,
      });
    }).toThrow(/You must specify only one of TaskDefinition or TaskImageOptions./);
  });

  test('errors when setting neither taskDefinition nor taskImageOptions', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(() => {
      new ApplicationMultipleTargetGroupsFargateService(stack, 'Service', {
        cluster,
      });
    }).toThrow(/You must specify one of: taskDefinition or image/);
  });

  test('test Fargate loadbalancer construct with application load balancer name set', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
      },
      loadBalancerName: 'alb-test-load-balancer',
    });

    // THEN - stack contains a load balancer and a service
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Name: 'alb-test-load-balancer',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      LaunchType: 'FARGATE',
      LoadBalancers: [
        {
          ContainerName: 'web',
          ContainerPort: 80,
          TargetGroupArn: {
            Ref: 'ServiceLBPublicListenerECSGroup0CC8688C',
          },
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Image: 'test',
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': {
                Ref: 'ServiceTaskDefwebLogGroup2A898F61',
              },
              'awslogs-stream-prefix': 'Service',
              'awslogs-region': {
                Ref: 'AWS::Region',
              },
            },
          },
          Name: 'web',
          PortMappings: [
            {
              ContainerPort: 80,
              Protocol: 'tcp',
            },
          ],
        }),
      ],
      Cpu: '256',
      ExecutionRoleArn: {
        'Fn::GetAtt': [
          'ServiceTaskDefExecutionRole919F7BE3',
          'Arn',
        ],
      },
      Family: 'ServiceTaskDef79D79521',
      Memory: '512',
      NetworkMode: 'awsvpc',
      RequiresCompatibilities: [
        'FARGATE',
      ],
    });
  });
});

describe('When Network Load Balancer', () => {
  test('test Fargate loadbalanced construct with default settings', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
      },
    });

    // THEN - stack contains a load balancer and a service
    Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::LoadBalancer', 1);

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      LaunchType: 'FARGATE',
      LoadBalancers: [
        {
          ContainerName: 'web',
          ContainerPort: 80,
          TargetGroupArn: {
            Ref: 'ServiceLBPublicListenerECSGroup0CC8688C',
          },
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Image: 'test',
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': {
                Ref: 'ServiceTaskDefwebLogGroup2A898F61',
              },
              'awslogs-stream-prefix': 'Service',
              'awslogs-region': {
                Ref: 'AWS::Region',
              },
            },
          },
          Name: 'web',
          PortMappings: [
            {
              ContainerPort: 80,
              Protocol: 'tcp',
            },
          ],
        }),
      ],
      Cpu: '256',
      ExecutionRoleArn: {
        'Fn::GetAtt': [
          'ServiceTaskDefExecutionRole919F7BE3',
          'Arn',
        ],
      },
      Family: 'ServiceTaskDef79D79521',
      Memory: '512',
      NetworkMode: 'awsvpc',
      RequiresCompatibilities: [
        'FARGATE',
      ],
    });
  });

  test('test Fargate loadbalanced construct with all settings', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
        containerName: 'hello',
        containerPorts: [80, 90],
        enableLogging: false,
        environment: {
          TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
          TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
        },
        logDriver: new ecs.AwsLogDriver({
          streamPrefix: 'TestStream',
        }),
        family: 'Ec2TaskDef',
        executionRole: new Role(stack, 'ExecutionRole', {
          path: '/',
          assumedBy: new CompositePrincipal(
            new ServicePrincipal('ecs.amazonaws.com'),
            new ServicePrincipal('ecs-tasks.amazonaws.com'),
          ),
        }),
        taskRole: new Role(stack, 'TaskRole', {
          assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
        }),
        dockerLabels: { label1: 'labelValue1', label2: 'labelValue2' },
      },
      cpu: 256,
      assignPublicIp: true,
      memoryLimitMiB: 512,
      desiredCount: 3,
      enableECSManagedTags: true,
      healthCheckGracePeriod: Duration.millis(2000),
      propagateTags: ecs.PropagatedTagSource.SERVICE,
      serviceName: 'myService',
      targetGroups: [
        {
          containerPort: 80,
        },
        {
          containerPort: 90,
        },
      ],
    });

    // THEN - stack contains a load balancer and a service
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DesiredCount: 3,
      EnableECSManagedTags: true,
      HealthCheckGracePeriodSeconds: 2,
      LaunchType: 'FARGATE',
      LoadBalancers: [
        {
          ContainerName: 'hello',
          ContainerPort: 80,
          TargetGroupArn: {
            Ref: 'ServiceLBPublicListenerECSTargetGrouphello80Group233A4D54',
          },
        },
        {
          ContainerName: 'hello',
          ContainerPort: 90,
          TargetGroupArn: {
            Ref: 'ServiceLBPublicListenerECSTargetGrouphello90GroupE58E4EAB',
          },
        },
      ],
      NetworkConfiguration: {
        AwsvpcConfiguration: {
          AssignPublicIp: 'ENABLED',
          SecurityGroups: [
            {
              'Fn::GetAtt': [
                'ServiceSecurityGroupEEA09B68',
                'GroupId',
              ],
            },
          ],
          Subnets: [
            {
              Ref: 'VPCPublicSubnet1SubnetB4246D30',
            },
            {
              Ref: 'VPCPublicSubnet2Subnet74179F39',
            },
          ],
        },
      },
      PropagateTags: 'SERVICE',
      ServiceName: 'myService',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: [
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE1',
              Value: 'test environment variable 1 value',
            },
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE2',
              Value: 'test environment variable 2 value',
            },
          ],
          Essential: true,
          Image: 'test',
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': {
                Ref: 'ServiceTaskDefhelloLogGroup44519781',
              },
              'awslogs-stream-prefix': 'TestStream',
              'awslogs-region': {
                Ref: 'AWS::Region',
              },
            },
          },
          Name: 'hello',
          PortMappings: [
            {
              ContainerPort: 80,
              Protocol: 'tcp',
            },
            {
              ContainerPort: 90,
              Protocol: 'tcp',
            },
          ],
          DockerLabels: {
            label1: 'labelValue1',
            label2: 'labelValue2',
          },
        },
      ],
      Cpu: '256',
      ExecutionRoleArn: {
        'Fn::GetAtt': [
          'ExecutionRole605A040B',
          'Arn',
        ],
      },
      Family: 'Ec2TaskDef',
      Memory: '512',
      NetworkMode: 'awsvpc',
      RequiresCompatibilities: [
        'FARGATE',
      ],
      TaskRoleArn: {
        'Fn::GetAtt': [
          'TaskRole30FC0FBB',
          'Arn',
        ],
      },
    });
  });

  test('errors if no essential container in pre-defined task definition', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

    // THEN
    expect(() => {
      new NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
        cluster,
        taskDefinition,
      });
    }).toThrow(/At least one essential container must be specified/);
  });

  test('errors when setting both taskDefinition and taskImageOptions', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'Ec2TaskDef');

    // THEN
    expect(() => {
      new NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('test'),
        },
        taskDefinition,
      });
    }).toThrow(/You must specify only one of TaskDefinition or TaskImageOptions./);
  });

  test('errors when setting neither taskDefinition nor taskImageOptions', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(() => {
      new NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
        cluster,
      });
    }).toThrow(/You must specify one of: taskDefinition or image/);
  });

  test('test Fargate networkloadbalanced construct with custom Port', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    new NetworkLoadBalancedFargateService(stack, 'NLBService', {
      cluster: cluster,
      memoryLimitMiB: 1024,
      cpu: 512,
      taskImageOptions: {
        image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        containerPort: 81,
      },
      listenerPort: 8181,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      Port: 81,
      Protocol: 'TCP',
      TargetType: 'ip',
      VpcId: {
        Ref: 'VPCB9E5F0B4',
      },
    });
  });

  test('test Fargate multinetworkloadbalanced construct with custom Port', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    new NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
      },
    });


    new NetworkMultipleTargetGroupsFargateService(stack, 'NLBService', {
      cluster: cluster,
      memoryLimitMiB: 1024,
      cpu: 512,
      taskImageOptions: {
        image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      },
      loadBalancers: [
        {
          name: 'lb1',
          listeners: [
            { name: 'listener1', port: 8181 },
          ],
        },
      ],
      targetGroups: [{
        containerPort: 81,
      }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      Port: 81,
      Protocol: 'TCP',
      TargetType: 'ip',
      VpcId: {
        Ref: 'VPCB9E5F0B4',
      },
    });
  });
});
