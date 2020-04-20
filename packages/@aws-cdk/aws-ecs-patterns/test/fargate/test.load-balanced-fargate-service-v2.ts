import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import { Vpc } from '@aws-cdk/aws-ec2';
import { AwsLogDriver, Cluster, ContainerImage, FargateTaskDefinition, PropagatedTagSource, Protocol } from '@aws-cdk/aws-ecs';
import { CompositePrincipal, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Duration, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { ApplicationMultipleTargetGroupsFargateService, NetworkMultipleTargetGroupsFargateService } from '../../lib';

export = {
  'When Application Load Balancer': {
    'test Fargate loadbalanced construct with default settings'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC');
      const cluster = new Cluster(stack, 'Cluster', { vpc });

      // WHEN
      new ApplicationMultipleTargetGroupsFargateService(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('test'),
        },
      });

      // THEN - stack contains a load balancer and a service
      expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));

      expect(stack).to(haveResource('AWS::ECS::Service', {
        DesiredCount: 1,
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
      }));

      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          {
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
          },
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
      }));

      test.done();
    },

    'test Fargate loadbalanced construct with all settings'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC');
      const cluster = new Cluster(stack, 'Cluster', { vpc });

      // WHEN
      new ApplicationMultipleTargetGroupsFargateService(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('test'),
          containerName: 'hello',
          containerPorts: [80, 90],
          enableLogging: false,
          environment: {
            TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
            TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
          },
          logDriver: new AwsLogDriver({
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
        },
        cpu: 256,
        assignPublicIp: true,
        memoryLimitMiB: 512,
        desiredCount: 3,
        enableECSManagedTags: true,
        healthCheckGracePeriod: Duration.millis(2000),
        propagateTags: PropagatedTagSource.SERVICE,
        serviceName: 'myService',
        targetGroups: [
          {
            containerPort: 80,
          },
          {
            containerPort: 90,
            pathPattern: 'a/b/c',
            priority: 10,
            protocol: Protocol.TCP,
          },
        ],
      });

      // THEN - stack contains a load balancer and a service
      expect(stack).to(haveResource('AWS::ECS::Service', {
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
      }));

      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
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
      }));

      test.done();
    },

    'errors if no essential container in pre-defined task definition'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC');
      const cluster = new Cluster(stack, 'Cluster', { vpc });

      const taskDefinition = new FargateTaskDefinition(stack, 'FargateTaskDef');

      // THEN
      test.throws(() => {
        new ApplicationMultipleTargetGroupsFargateService(stack, 'Service', {
          cluster,
          taskDefinition,
        });
      }, /At least one essential container must be specified/);

      test.done();
    },

    'errors when setting both taskDefinition and taskImageOptions'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC');
      const cluster = new Cluster(stack, 'Cluster', { vpc });
      const taskDefinition = new FargateTaskDefinition(stack, 'Ec2TaskDef');

      // THEN
      test.throws(() => {
        new ApplicationMultipleTargetGroupsFargateService(stack, 'Service', {
          cluster,
          taskImageOptions: {
            image: ContainerImage.fromRegistry('test'),
          },
          taskDefinition,
        });
      }, /You must specify only one of TaskDefinition or TaskImageOptions./);

      test.done();
    },

    'errors when setting neither taskDefinition nor taskImageOptions'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC');
      const cluster = new Cluster(stack, 'Cluster', { vpc });

      // THEN
      test.throws(() => {
        new ApplicationMultipleTargetGroupsFargateService(stack, 'Service', {
          cluster,
        });
      }, /You must specify one of: taskDefinition or image/);

      test.done();
    },
  },

  'When Network Load Balancer': {
    'test Fargate loadbalanced construct with default settings'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC');
      const cluster = new Cluster(stack, 'Cluster', { vpc });

      // WHEN
      new NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('test'),
        },
      });

      // THEN - stack contains a load balancer and a service
      expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));

      expect(stack).to(haveResource('AWS::ECS::Service', {
        DesiredCount: 1,
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
      }));

      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          {
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
          },
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
      }));

      test.done();
    },

    'test Fargate loadbalanced construct with all settings'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC');
      const cluster = new Cluster(stack, 'Cluster', { vpc });

      // WHEN
      new NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('test'),
          containerName: 'hello',
          containerPorts: [80, 90],
          enableLogging: false,
          environment: {
            TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
            TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
          },
          logDriver: new AwsLogDriver({
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
        },
        cpu: 256,
        assignPublicIp: true,
        memoryLimitMiB: 512,
        desiredCount: 3,
        enableECSManagedTags: true,
        healthCheckGracePeriod: Duration.millis(2000),
        propagateTags: PropagatedTagSource.SERVICE,
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
      expect(stack).to(haveResource('AWS::ECS::Service', {
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
      }));

      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
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
      }));

      test.done();
    },

    'errors if no essential container in pre-defined task definition'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC');
      const cluster = new Cluster(stack, 'Cluster', { vpc });

      const taskDefinition = new FargateTaskDefinition(stack, 'FargateTaskDef');

      // THEN
      test.throws(() => {
        new NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
          cluster,
          taskDefinition,
        });
      }, /At least one essential container must be specified/);

      test.done();
    },

    'errors when setting both taskDefinition and taskImageOptions'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC');
      const cluster = new Cluster(stack, 'Cluster', { vpc });
      const taskDefinition = new FargateTaskDefinition(stack, 'Ec2TaskDef');

      // THEN
      test.throws(() => {
        new NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
          cluster,
          taskImageOptions: {
            image: ContainerImage.fromRegistry('test'),
          },
          taskDefinition,
        });
      }, /You must specify only one of TaskDefinition or TaskImageOptions./);

      test.done();
    },

    'errors when setting neither taskDefinition nor taskImageOptions'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC');
      const cluster = new Cluster(stack, 'Cluster', { vpc });

      // THEN
      test.throws(() => {
        new NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
          cluster,
        });
      }, /You must specify one of: taskDefinition or image/);

      test.done();
    },
  },
};