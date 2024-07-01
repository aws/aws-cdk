import { Match, Template } from '../../../assertions';
import { Certificate } from '../../../aws-certificatemanager';
import { Vpc } from '../../../aws-ec2';
import * as ecs from '../../../aws-ecs';
import { ContainerDefinition, ContainerImage } from '../../../aws-ecs';
import { ApplicationProtocol, IpAddressType, SslPolicy } from '../../../aws-elasticloadbalancingv2';
import { CompositePrincipal, Role, ServicePrincipal } from '../../../aws-iam';
import { PublicHostedZone } from '../../../aws-route53';
import { Duration, Stack } from '../../../core';
import { ApplicationLoadBalancedFargateService, ApplicationMultipleTargetGroupsFargateService, NetworkLoadBalancedFargateService, NetworkMultipleTargetGroupsFargateService } from '../../lib';

const enableExecuteCommandPermissions = {
  Statement: [
    {
      Action: [
        'ssmmessages:CreateControlChannel',
        'ssmmessages:CreateDataChannel',
        'ssmmessages:OpenControlChannel',
        'ssmmessages:OpenDataChannel',
      ],
      Effect: 'Allow',
      Resource: '*',
    },
    {
      Action: 'logs:DescribeLogGroups',
      Effect: 'Allow',
      Resource: '*',
    },
    {
      Action: [
        'logs:CreateLogStream',
        'logs:DescribeLogStreams',
        'logs:PutLogEvents',
      ],
      Effect: 'Allow',
      Resource: '*',
    },
  ],
  Version: '2012-10-17',
};

describe('Application Load Balancer', () => {
  describe('ApplicationLoadBalancedFargateService', () => {
    test('construct with application load balancer name set', () => {
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

  describe('ApplicationMultipleTargetGroupsFargateService', () => {
    test('construct with default settings', () => {
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

    test('construct with all settings', () => {
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
        ephemeralStorageGiB: 50,
        desiredCount: 3,
        enableECSManagedTags: true,
        enableExecuteCommand: true,
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

      // ECS Exec
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: enableExecuteCommandPermissions,
        PolicyName: 'TaskRoleDefaultPolicy07FC53DE',
        Roles: [
          {
            Ref: 'TaskRole30FC0FBB',
          },
        ],
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
        EphemeralStorage: {
          SizeInGiB: 50,
        },
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

    test('errors when idleTimeout is over 4000 seconds for multiAlbService', () => {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC');

      // THEN
      expect(() => {
        new ApplicationMultipleTargetGroupsFargateService(stack, 'myService', {
          cluster: new ecs.Cluster(stack, 'EcsCluster', { vpc }),
          memoryLimitMiB: 256,
          taskImageOptions: {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
          },
          enableExecuteCommand: true,
          loadBalancers: [
            {
              name: 'lb',
              idleTimeout: Duration.seconds(400),
              domainName: 'api.example.com',
              domainZone: new PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' }),
              listeners: [
                {
                  name: 'listener',
                  protocol: ApplicationProtocol.HTTPS,
                  certificate: Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
                  sslPolicy: SslPolicy.TLS12_EXT,
                },
              ],
            },
            {
              name: 'lb2',
              idleTimeout: Duration.seconds(5000),
              domainName: 'frontend.com',
              domainZone: new PublicHostedZone(stack, 'HostedZone2', { zoneName: 'frontend.com' }),
              listeners: [
                {
                  name: 'listener2',
                  protocol: ApplicationProtocol.HTTPS,
                  certificate: Certificate.fromCertificateArn(stack, 'Cert2', 'helloworld'),
                  sslPolicy: SslPolicy.TLS12_EXT,
                },
              ],
            },
          ],
          targetGroups: [
            {
              containerPort: 80,
              listener: 'listener',
            },
            {
              containerPort: 90,
              pathPattern: 'a/b/c',
              priority: 10,
              listener: 'listener',
            },
            {
              containerPort: 443,
              listener: 'listener2',
            },
            {
              containerPort: 80,
              pathPattern: 'a/b/c',
              priority: 10,
              listener: 'listener2',
            },
          ],
        });
      }).toThrowError();
    });

    test('errors when idleTimeout is under 1 seconds for multiAlbService', () => {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC');

      // THEN
      expect(() => {
        new ApplicationMultipleTargetGroupsFargateService(stack, 'myService', {
          cluster: new ecs.Cluster(stack, 'EcsCluster', { vpc }),
          memoryLimitMiB: 256,
          taskImageOptions: {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
          },
          enableExecuteCommand: true,
          loadBalancers: [
            {
              name: 'lb',
              idleTimeout: Duration.seconds(400),
              domainName: 'api.example.com',
              domainZone: new PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' }),
              listeners: [
                {
                  name: 'listener',
                  protocol: ApplicationProtocol.HTTPS,
                  certificate: Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
                  sslPolicy: SslPolicy.TLS12_EXT,
                },
              ],
            },
            {
              name: 'lb2',
              idleTimeout: Duration.seconds(0),
              domainName: 'frontend.com',
              domainZone: new PublicHostedZone(stack, 'HostedZone2', { zoneName: 'frontend.com' }),
              listeners: [
                {
                  name: 'listener2',
                  protocol: ApplicationProtocol.HTTPS,
                  certificate: Certificate.fromCertificateArn(stack, 'Cert2', 'helloworld'),
                  sslPolicy: SslPolicy.TLS12_EXT,
                },
              ],
            },
          ],
          targetGroups: [
            {
              containerPort: 80,
              listener: 'listener',
            },
            {
              containerPort: 90,
              pathPattern: 'a/b/c',
              priority: 10,
              listener: 'listener',
            },
            {
              containerPort: 443,
              listener: 'listener2',
            },
            {
              containerPort: 80,
              pathPattern: 'a/b/c',
              priority: 10,
              listener: 'listener2',
            },
          ],
        });
      }).toThrowError();
    });

    test('passes when idleTimeout is between 1 and 4000 seconds for multiAlbService', () => {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC');

      // THEN
      expect(() => {
        new ApplicationMultipleTargetGroupsFargateService(stack, 'myService', {
          cluster: new ecs.Cluster(stack, 'EcsCluster', { vpc }),
          memoryLimitMiB: 256,
          taskImageOptions: {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
          },
          enableExecuteCommand: true,
          loadBalancers: [
            {
              name: 'lb',
              idleTimeout: Duration.seconds(5),
              domainName: 'api.example.com',
              domainZone: new PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' }),
              listeners: [
                {
                  name: 'listener',
                  protocol: ApplicationProtocol.HTTPS,
                  certificate: Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
                  sslPolicy: SslPolicy.TLS12_EXT,
                },
              ],
            },
            {
              name: 'lb2',
              idleTimeout: Duration.seconds(500),
              domainName: 'frontend.com',
              domainZone: new PublicHostedZone(stack, 'HostedZone2', { zoneName: 'frontend.com' }),
              listeners: [
                {
                  name: 'listener2',
                  protocol: ApplicationProtocol.HTTPS,
                  certificate: Certificate.fromCertificateArn(stack, 'Cert2', 'helloworld'),
                  sslPolicy: SslPolicy.TLS12_EXT,
                },
              ],
            },
          ],
          targetGroups: [
            {
              containerPort: 80,
              listener: 'listener',
            },
            {
              containerPort: 90,
              pathPattern: 'a/b/c',
              priority: 10,
              listener: 'listener',
            },
            {
              containerPort: 443,
              listener: 'listener2',
            },
            {
              containerPort: 80,
              pathPattern: 'a/b/c',
              priority: 10,
              listener: 'listener2',
            },
          ],
        });
      }).toBeTruthy();
    });

    test('idletime is undefined when not set for multiAlbService', () => {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC');

      // WHEN
      new ApplicationMultipleTargetGroupsFargateService(stack, 'myService', {
        cluster: new ecs.Cluster(stack, 'EcsCluster', { vpc }),
        memoryLimitMiB: 256,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        },
        enableExecuteCommand: true,
        loadBalancers: [
          {
            name: 'lb',
            domainName: 'api.example.com',
            domainZone: new PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' }),
            listeners: [
              {
                name: 'listener',
                protocol: ApplicationProtocol.HTTPS,
                certificate: Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
                sslPolicy: SslPolicy.TLS12_EXT,
              },
            ],
          },
          {
            name: 'lb2',
            domainName: 'frontend.com',
            domainZone: new PublicHostedZone(stack, 'HostedZone2', { zoneName: 'frontend.com' }),
            listeners: [
              {
                name: 'listener2',
                protocol: ApplicationProtocol.HTTPS,
                certificate: Certificate.fromCertificateArn(stack, 'Cert2', 'helloworld'),
                sslPolicy: SslPolicy.TLS12_EXT,
              },
            ],
          },
        ],
        targetGroups: [
          {
            containerPort: 80,
            listener: 'listener',
          },
          {
            containerPort: 90,
            pathPattern: 'a/b/c',
            priority: 10,
            listener: 'listener',
          },
          {
            containerPort: 443,
            listener: 'listener2',
          },
          {
            containerPort: 80,
            pathPattern: 'a/b/c',
            priority: 10,
            listener: 'listener2',
          },
        ],
      });

      // THEN - stack contains default LoadBalancer Attributes
      Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
        LoadBalancerAttributes: [
          {
            Key: 'deletion_protection.enabled',
            Value: 'false',
          },
        ],
      });
    });
  });
});

describe('Network Load Balancer', () => {
  describe('NetworkLoadBalancedFargateService', () => {
    test('construct with custom port', () => {
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

    test('specify IPV6 address type for NLB', () => {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC', { maxAzs: 2 });

      // WHEN
      new NetworkLoadBalancedFargateService(stack, 'NLBService', {
        cluster: new ecs.Cluster(stack, 'Cluster', { vpc }),
        memoryLimitMiB: 1024,
        cpu: 512,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
          containerPort: 80,
        },
        listenerPort: 80,
        ipAddressType: IpAddressType.DUAL_STACK,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
        IpAddressType: 'dualstack',
      });
    });
  });

  describe('NetworkMultipleTargetGroupsFargateService', () => {
    test('construct with default settings', () => {
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

    test('construct with all settings', () => {
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
        ephemeralStorageGiB: 80,
        desiredCount: 3,
        enableECSManagedTags: true,
        enableExecuteCommand: true,
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
        EphemeralStorage: {
          SizeInGiB: 80,
        },
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

    test('EnableExecuteCommand generates correct IAM Permissions', () => {
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
        enableExecuteCommand: true,
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

      // ECS Exec
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: enableExecuteCommandPermissions,
        PolicyName: 'TaskRoleDefaultPolicy07FC53DE',
        Roles: [
          {
            Ref: 'TaskRole30FC0FBB',
          },
        ],
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

    test('construct with custom port', () => {
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

    test('construct errors when container port range is set for essential container', () => {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC');
      const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('test'),
        portMappings: [{
          containerPort: ContainerDefinition.CONTAINER_PORT_USE_RANGE,
          containerPortRange: '8080-8081',
        }],
      });
      // THEN
      expect(() => {
        new NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
          cluster,
          taskDefinition,
        });
      }).toThrow('The first port mapping added to the default container must expose a single port');
    });
  });
});
