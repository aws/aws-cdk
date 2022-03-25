import { Annotations, Match, Template } from '@aws-cdk/assertions';
import * as appscaling from '@aws-cdk/aws-applicationautoscaling';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as kms from '@aws-cdk/aws-kms';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';
import { DeploymentControllerType, LaunchType, PropagatedTagSource } from '../../lib/base/base-service';
import { addDefaultCapacityProvider } from '../util';

describe('fargate service', () => {
  describe('When creating a Fargate Service', () => {
    test('with only required properties set, it correctly sets default properties', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      });

      const service = new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        TaskDefinition: {
          Ref: 'FargateTaskDefC6FB60B4',
        },
        Cluster: {
          Ref: 'EcsCluster97242B84',
        },
        DeploymentConfiguration: {
          MaximumPercent: 200,
          MinimumHealthyPercent: 50,
        },
        LaunchType: LaunchType.FARGATE,
        EnableECSManagedTags: false,
        NetworkConfiguration: {
          AwsvpcConfiguration: {
            AssignPublicIp: 'DISABLED',
            SecurityGroups: [
              {
                'Fn::GetAtt': [
                  'FargateServiceSecurityGroup0A0E79CB',
                  'GroupId',
                ],
              },
            ],
            Subnets: [
              {
                Ref: 'MyVpcPrivateSubnet1Subnet5057CF7E',
              },
              {
                Ref: 'MyVpcPrivateSubnet2Subnet0040C983',
              },
            ],
          },
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
        GroupDescription: 'Default/FargateService/SecurityGroup',
        SecurityGroupEgress: [
          {
            CidrIp: '0.0.0.0/0',
            Description: 'Allow all outbound traffic by default',
            IpProtocol: '-1',
          },
        ],
        VpcId: {
          Ref: 'MyVpcF9F0CA6F',
        },
      });

      expect(service.node.defaultChild).toBeDefined();
    });

    test('can create service with default settings if VPC only has public subnets', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {
        subnetConfiguration: [
          {
            cidrMask: 28,
            name: 'public-only',
            subnetType: ec2.SubnetType.PUBLIC,
          },
        ],
      });
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      });

      // WHEN
      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
      });

      // THEN -- did not throw
    });

    testDeprecated('does not set launchType when capacity provider strategies specified (deprecated)', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
        capacityProviders: ['FARGATE', 'FARGATE_SPOT'],
      });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      const container = taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });
      container.addPortMappings({ containerPort: 8000 });

      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
        capacityProviderStrategies: [
          {
            capacityProvider: 'FARGATE_SPOT',
            weight: 2,
          },
          {
            capacityProvider: 'FARGATE',
            weight: 1,
          },
        ],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Cluster', {
        CapacityProviders: Match.absent(),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
        CapacityProviders: ['FARGATE', 'FARGATE_SPOT'],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        TaskDefinition: {
          Ref: 'FargateTaskDefC6FB60B4',
        },
        Cluster: {
          Ref: 'EcsCluster97242B84',
        },
        DeploymentConfiguration: {
          MaximumPercent: 200,
          MinimumHealthyPercent: 50,
        },
        // no launch type
        CapacityProviderStrategy: [
          {
            CapacityProvider: 'FARGATE_SPOT',
            Weight: 2,
          },
          {
            CapacityProvider: 'FARGATE',
            Weight: 1,
          },
        ],
        EnableECSManagedTags: false,
        NetworkConfiguration: {
          AwsvpcConfiguration: {
            AssignPublicIp: 'DISABLED',
            SecurityGroups: [
              {
                'Fn::GetAtt': [
                  'FargateServiceSecurityGroup0A0E79CB',
                  'GroupId',
                ],
              },
            ],
            Subnets: [
              {
                Ref: 'MyVpcPrivateSubnet1Subnet5057CF7E',
              },
              {
                Ref: 'MyVpcPrivateSubnet2Subnet0040C983',
              },
            ],
          },
        },
      });
    });

    test('does not set launchType when capacity provider strategies specified', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
      });
      cluster.enableFargateCapacityProviders();

      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      const container = taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });
      container.addPortMappings({ containerPort: 8000 });

      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
        capacityProviderStrategies: [
          {
            capacityProvider: 'FARGATE_SPOT',
            weight: 2,
          },
          {
            capacityProvider: 'FARGATE',
            weight: 1,
          },
        ],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Cluster', {
        CapacityProviders: Match.absent(),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
        CapacityProviders: ['FARGATE', 'FARGATE_SPOT'],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        TaskDefinition: {
          Ref: 'FargateTaskDefC6FB60B4',
        },
        Cluster: {
          Ref: 'EcsCluster97242B84',
        },
        DeploymentConfiguration: {
          MaximumPercent: 200,
          MinimumHealthyPercent: 50,
        },
        // no launch type
        LaunchType: Match.absent(),
        CapacityProviderStrategy: [
          {
            CapacityProvider: 'FARGATE_SPOT',
            Weight: 2,
          },
          {
            CapacityProvider: 'FARGATE',
            Weight: 1,
          },
        ],
        EnableECSManagedTags: false,
        NetworkConfiguration: {
          AwsvpcConfiguration: {
            AssignPublicIp: 'DISABLED',
            SecurityGroups: [
              {
                'Fn::GetAtt': [
                  'FargateServiceSecurityGroup0A0E79CB',
                  'GroupId',
                ],
              },
            ],
            Subnets: [
              {
                Ref: 'MyVpcPrivateSubnet1Subnet5057CF7E',
              },
              {
                Ref: 'MyVpcPrivateSubnet2Subnet0040C983',
              },
            ],
          },
        },
      });
    });

    test('with custom cloudmap namespace', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      const container = taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });
      container.addPortMappings({ containerPort: 8000 });

      const cloudMapNamespace = new cloudmap.PrivateDnsNamespace(stack, 'TestCloudMapNamespace', {
        name: 'scorekeep.com',
        vpc,
      });

      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
        cloudMapOptions: {
          name: 'myApp',
          failureThreshold: 20,
          cloudMapNamespace,
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Service', {
        DnsConfig: {
          DnsRecords: [
            {
              TTL: 60,
              Type: 'A',
            },
          ],
          NamespaceId: {
            'Fn::GetAtt': [
              'TestCloudMapNamespace1FB9B446',
              'Id',
            ],
          },
          RoutingPolicy: 'MULTIVALUE',
        },
        HealthCheckCustomConfig: {
          FailureThreshold: 20,
        },
        Name: 'myApp',
        NamespaceId: {
          'Fn::GetAtt': [
            'TestCloudMapNamespace1FB9B446',
            'Id',
          ],
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::PrivateDnsNamespace', {
        Name: 'scorekeep.com',
        Vpc: {
          Ref: 'MyVpcF9F0CA6F',
        },
      });
    });

    test('with user-provided cloudmap service', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      const container = taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });
      container.addPortMappings({ containerPort: 8000 });

      const cloudMapNamespace = new cloudmap.PrivateDnsNamespace(stack, 'TestCloudMapNamespace', {
        name: 'scorekeep.com',
        vpc,
      });

      const cloudMapService = new cloudmap.Service(stack, 'Service', {
        name: 'service-name',
        namespace: cloudMapNamespace,
        dnsRecordType: cloudmap.DnsRecordType.SRV,
      });

      const ecsService = new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
      });

      // WHEN
      ecsService.associateCloudMapService({
        service: cloudMapService,
        container: container,
        containerPort: 8000,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        ServiceRegistries: [
          {
            ContainerName: 'web',
            ContainerPort: 8000,
            RegistryArn: { 'Fn::GetAtt': ['ServiceDBC79909', 'Arn'] },
          },
        ],
      });
    });

    test('errors when more than one service registry used', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      const container = taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });
      container.addPortMappings({ containerPort: 8000 });

      const cloudMapNamespace = new cloudmap.PrivateDnsNamespace(stack, 'TestCloudMapNamespace', {
        name: 'scorekeep.com',
        vpc,
      });

      const ecsService = new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
      });

      ecsService.enableCloudMap({
        cloudMapNamespace,
      });

      const cloudMapService = new cloudmap.Service(stack, 'Service', {
        name: 'service-name',
        namespace: cloudMapNamespace,
        dnsRecordType: cloudmap.DnsRecordType.SRV,
      });

      // WHEN / THEN
      expect(() => {
        ecsService.associateCloudMapService({
          service: cloudMapService,
          container: container,
          containerPort: 8000,
        });
      }).toThrow(/at most one service registry/i);
    });

    test('with all properties set', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

      cluster.addDefaultCloudMapNamespace({
        name: 'foo.com',
        type: cloudmap.NamespaceType.DNS_PRIVATE,
      });

      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      });

      const svc = new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
        desiredCount: 2,
        assignPublicIp: true,
        cloudMapOptions: {
          name: 'myapp',
          dnsRecordType: cloudmap.DnsRecordType.A,
          dnsTtl: cdk.Duration.seconds(50),
          failureThreshold: 20,
        },
        healthCheckGracePeriod: cdk.Duration.seconds(60),
        maxHealthyPercent: 150,
        minHealthyPercent: 55,
        deploymentController: {
          type: ecs.DeploymentControllerType.ECS,
        },
        circuitBreaker: { rollback: true },
        securityGroups: [new ec2.SecurityGroup(stack, 'SecurityGroup1', {
          allowAllOutbound: true,
          description: 'Example',
          securityGroupName: 'Bob',
          vpc,
        })],
        serviceName: 'bonjour',
        vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      });

      // THEN
      expect(svc.cloudMapService).toBeDefined();

      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        TaskDefinition: {
          Ref: 'FargateTaskDefC6FB60B4',
        },
        Cluster: {
          Ref: 'EcsCluster97242B84',
        },
        DeploymentConfiguration: {
          MaximumPercent: 150,
          MinimumHealthyPercent: 55,
          DeploymentCircuitBreaker: {
            Enable: true,
            Rollback: true,
          },
        },
        DeploymentController: {
          Type: ecs.DeploymentControllerType.ECS,
        },
        DesiredCount: 2,
        HealthCheckGracePeriodSeconds: 60,
        LaunchType: LaunchType.FARGATE,
        NetworkConfiguration: {
          AwsvpcConfiguration: {
            AssignPublicIp: 'ENABLED',
            SecurityGroups: [
              {
                'Fn::GetAtt': [
                  'SecurityGroup1F554B36F',
                  'GroupId',
                ],
              },
            ],
            Subnets: [
              {
                Ref: 'MyVpcPublicSubnet1SubnetF6608456',
              },
              {
                Ref: 'MyVpcPublicSubnet2Subnet492B6BFB',
              },
            ],
          },
        },
        ServiceName: 'bonjour',
        ServiceRegistries: [
          {
            RegistryArn: {
              'Fn::GetAtt': [
                'FargateServiceCloudmapService9544B753',
                'Arn',
              ],
            },
          },
        ],
      });
    });

    test('throws when task definition is not Fargate compatible', () => {
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.TaskDefinition(stack, 'Ec2TaskDef', {
        compatibility: ecs.Compatibility.EC2,
      });
      taskDefinition.addContainer('BaseContainer', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryReservationMiB: 10,
      });

      // THEN
      expect(() => {
        new ecs.FargateService(stack, 'FargateService', {
          cluster,
          taskDefinition,
        });
      }).toThrow(/Supplied TaskDefinition is not configured for compatibility with Fargate/);


    });

    test('throws whith secret json field on unsupported platform version', () => {
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaksDef');
      const secret = new secretsmanager.Secret(stack, 'Secret');
      taskDefinition.addContainer('BaseContainer', {
        image: ecs.ContainerImage.fromRegistry('test'),
        secrets: {
          SECRET_KEY: ecs.Secret.fromSecretsManager(secret, 'specificKey'),
        },
      });

      // THEN
      expect(() => {
        new ecs.FargateService(stack, 'FargateService', {
          cluster,
          taskDefinition,
          platformVersion: ecs.FargatePlatformVersion.VERSION1_3,
        });
      }).toThrow(new RegExp(`uses at least one container that references a secret JSON field.+platform version ${ecs.FargatePlatformVersion.VERSION1_4} or later`));
    });

    test('ignore task definition and launch type if deployment controller is set to be EXTERNAL', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      });

      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
        deploymentController: {
          type: DeploymentControllerType.EXTERNAL,
        },
      });

      // THEN
      Annotations.fromStack(stack).hasWarning('/Default/FargateService', 'taskDefinition and launchType are blanked out when using external deployment controller.');
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        Cluster: {
          Ref: 'EcsCluster97242B84',
        },
        DeploymentConfiguration: {
          MaximumPercent: 200,
          MinimumHealthyPercent: 50,
        },
        DeploymentController: {
          Type: 'EXTERNAL',
        },
        EnableECSManagedTags: false,
        NetworkConfiguration: {
          AwsvpcConfiguration: {
            AssignPublicIp: 'DISABLED',
            SecurityGroups: [
              {
                'Fn::GetAtt': [
                  'FargateServiceSecurityGroup0A0E79CB',
                  'GroupId',
                ],
              },
            ],
            Subnets: [
              {
                Ref: 'MyVpcPrivateSubnet1Subnet5057CF7E',
              },
              {
                Ref: 'MyVpcPrivateSubnet2Subnet0040C983',
              },
            ],
          },
        },
      });
    });

    test('errors when no container specified on task definition', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      // Errors on validation, not on construction.
      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
      });

      // THEN
      expect(() => {
        Template.fromStack(stack);
      }).toThrow(/one essential container/);
    });

    test('allows adding the default container after creating the service', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
      });

      // Add the container *after* creating the service
      taskDefinition.addContainer('main', {
        image: ecs.ContainerImage.fromRegistry('somecontainer'),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          Match.objectLike({
            Name: 'main',
          }),
        ],
      });
    });

    test('allows specifying assignPublicIP as enabled', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      });

      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
        assignPublicIp: true,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        NetworkConfiguration: {
          AwsvpcConfiguration: {
            AssignPublicIp: 'ENABLED',
          },
        },
      });
    });

    test('allows specifying 0 for minimumHealthyPercent', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      });

      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
        minHealthyPercent: 0,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        DeploymentConfiguration: {
          MinimumHealthyPercent: 0,
        },
      });
    });

    testDeprecated('throws when securityGroup and securityGroups are supplied', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const securityGroup1 = new ec2.SecurityGroup(stack, 'SecurityGroup1', {
        allowAllOutbound: true,
        description: 'Example',
        securityGroupName: 'Bingo',
        vpc,
      });
      const securityGroup2 = new ec2.SecurityGroup(stack, 'SecurityGroup2', {
        allowAllOutbound: false,
        description: 'Example',
        securityGroupName: 'Rolly',
        vpc,
      });

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      });

      // THEN
      expect(() => {
        new ecs.FargateService(stack, 'FargateService', {
          cluster,
          taskDefinition,
          securityGroup: securityGroup1,
          securityGroups: [securityGroup2],
        });
      }).toThrow(/Only one of SecurityGroup or SecurityGroups can be populated./);
    });

    test('with multiple securty groups, it correctly updates cloudformation template', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const securityGroup1 = new ec2.SecurityGroup(stack, 'SecurityGroup1', {
        allowAllOutbound: true,
        description: 'Example',
        securityGroupName: 'Bingo',
        vpc,
      });
      const securityGroup2 = new ec2.SecurityGroup(stack, 'SecurityGroup2', {
        allowAllOutbound: false,
        description: 'Example',
        securityGroupName: 'Rolly',
        vpc,
      });

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      });

      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
        securityGroups: [securityGroup1, securityGroup2],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        TaskDefinition: {
          Ref: 'FargateTaskDefC6FB60B4',
        },
        Cluster: {
          Ref: 'EcsCluster97242B84',
        },
        DeploymentConfiguration: {
          MaximumPercent: 200,
          MinimumHealthyPercent: 50,
        },
        LaunchType: LaunchType.FARGATE,
        EnableECSManagedTags: false,
        NetworkConfiguration: {
          AwsvpcConfiguration: {
            AssignPublicIp: 'DISABLED',
            SecurityGroups: [
              {
                'Fn::GetAtt': [
                  'SecurityGroup1F554B36F',
                  'GroupId',
                ],
              },
              {
                'Fn::GetAtt': [
                  'SecurityGroup23BE86BB7',
                  'GroupId',
                ],
              },
            ],
            Subnets: [
              {
                Ref: 'MyVpcPrivateSubnet1Subnet5057CF7E',
              },
              {
                Ref: 'MyVpcPrivateSubnet2Subnet0040C983',
              },
            ],
          },
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
        GroupDescription: 'Example',
        GroupName: 'Bingo',
        SecurityGroupEgress: [
          {
            CidrIp: '0.0.0.0/0',
            Description: 'Allow all outbound traffic by default',
            IpProtocol: '-1',
          },
        ],
        VpcId: {
          Ref: 'MyVpcF9F0CA6F',
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
        GroupDescription: 'Example',
        GroupName: 'Rolly',
        SecurityGroupEgress: [
          {
            CidrIp: '255.255.255.255/32',
            Description: 'Disallow all traffic',
            FromPort: 252,
            IpProtocol: 'icmp',
            ToPort: 86,
          },
        ],
        VpcId: {
          Ref: 'MyVpcF9F0CA6F',
        },
      });
    });
  });

  describe('When setting up a health check', () => {
    test('grace period is respected', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
      });

      // WHEN
      new ecs.FargateService(stack, 'Svc', {
        cluster,
        taskDefinition,
        healthCheckGracePeriod: cdk.Duration.seconds(10),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        HealthCheckGracePeriodSeconds: 10,
      });
    });
  });

  describe('When adding an app load balancer', () => {
    test('allows auto scaling by ALB request per target', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
      });
      container.addPortMappings({ containerPort: 8000 });
      const service = new ecs.FargateService(stack, 'Service', { cluster, taskDefinition });

      const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
      const listener = lb.addListener('listener', { port: 80 });
      const targetGroup = listener.addTargets('target', {
        port: 80,
        targets: [service],
      });

      // WHEN
      const capacity = service.autoScaleTaskCount({ maxCapacity: 10, minCapacity: 1 });
      capacity.scaleOnRequestCount('ScaleOnRequests', {
        requestsPerTarget: 1000,
        targetGroup,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalableTarget', {
        MaxCapacity: 10,
        MinCapacity: 1,
        ResourceId: {
          'Fn::Join': [
            '',
            [
              'service/',
              {
                Ref: 'EcsCluster97242B84',
              },
              '/',
              {
                'Fn::GetAtt': [
                  'ServiceD69D759B',
                  'Name',
                ],
              },
            ],
          ],
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
        TargetTrackingScalingPolicyConfiguration: {
          PredefinedMetricSpecification: {
            PredefinedMetricType: 'ALBRequestCountPerTarget',
            ResourceLabel: {
              'Fn::Join': ['', [
                { 'Fn::Select': [1, { 'Fn::Split': ['/', { Ref: 'lblistener657ADDEC' }] }] }, '/',
                { 'Fn::Select': [2, { 'Fn::Split': ['/', { Ref: 'lblistener657ADDEC' }] }] }, '/',
                { 'Fn::Select': [3, { 'Fn::Split': ['/', { Ref: 'lblistener657ADDEC' }] }] }, '/',
                { 'Fn::GetAtt': ['lblistenertargetGroupC7489D1E', 'TargetGroupFullName'] },
              ]],
            },
          },
          TargetValue: 1000,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        // if any load balancer is configured and healthCheckGracePeriodSeconds is not
        // set, then it should default to 60 seconds.
        HealthCheckGracePeriodSeconds: 60,
      });
    });

    test('allows auto scaling by ALB with new service arn format', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
      });
      container.addPortMappings({ containerPort: 8000 });

      const service = new ecs.FargateService(stack, 'Service', {
        cluster,
        taskDefinition,
      });

      const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
      const listener = lb.addListener('listener', { port: 80 });
      const targetGroup = listener.addTargets('target', {
        port: 80,
        targets: [service],
      });

      // WHEN
      const capacity = service.autoScaleTaskCount({ maxCapacity: 10, minCapacity: 1 });
      capacity.scaleOnRequestCount('ScaleOnRequests', {
        requestsPerTarget: 1000,
        targetGroup,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalableTarget', {
        MaxCapacity: 10,
        MinCapacity: 1,
        ResourceId: {
          'Fn::Join': [
            '',
            [
              'service/',
              {
                Ref: 'EcsCluster97242B84',
              },
              '/',
              {
                'Fn::GetAtt': [
                  'ServiceD69D759B',
                  'Name',
                ],
              },
            ],
          ],
        },
      });
    });

    describe('allows specify any existing container name and port in a service', () => {
      test('with default setting', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
        const container = taskDefinition.addContainer('MainContainer', {
          image: ecs.ContainerImage.fromRegistry('hello'),
        });
        container.addPortMappings({ containerPort: 8000 });
        container.addPortMappings({ containerPort: 8001 });

        const service = new ecs.FargateService(stack, 'Service', {
          cluster,
          taskDefinition,
        });

        // WHEN
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
        const listener = lb.addListener('listener', { port: 80 });
        listener.addTargets('target', {
          port: 80,
          targets: [service.loadBalancerTarget({
            containerName: 'MainContainer',
          })],
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
          LoadBalancers: [
            {
              ContainerName: 'MainContainer',
              ContainerPort: 8000,
              TargetGroupArn: {
                Ref: 'lblistenertargetGroupC7489D1E',
              },
            },
          ],
        });

        Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
          Description: 'Load balancer to target',
          FromPort: 8000,
          ToPort: 8000,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
          Description: 'Load balancer to target',
          FromPort: 8000,
          ToPort: 8000,
        });
      });

      test('with TCP protocol', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
        const container = taskDefinition.addContainer('MainContainer', {
          image: ecs.ContainerImage.fromRegistry('hello'),
        });
        container.addPortMappings({ containerPort: 8000 });
        container.addPortMappings({ containerPort: 8001, protocol: ecs.Protocol.TCP });

        const service = new ecs.FargateService(stack, 'Service', {
          cluster,
          taskDefinition,
        });

        // WHEN
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
        const listener = lb.addListener('listener', { port: 80 });

        // THEN
        listener.addTargets('target', {
          port: 80,
          targets: [service.loadBalancerTarget({
            containerName: 'MainContainer',
            containerPort: 8001,
            protocol: ecs.Protocol.TCP,
          })],
        });
      });

      test('with UDP protocol', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
        const container = taskDefinition.addContainer('MainContainer', {
          image: ecs.ContainerImage.fromRegistry('hello'),
        });
        container.addPortMappings({ containerPort: 8000 });
        container.addPortMappings({ containerPort: 8001, protocol: ecs.Protocol.UDP });

        const service = new ecs.FargateService(stack, 'Service', {
          cluster,
          taskDefinition,
        });

        // WHEN
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
        const listener = lb.addListener('listener', { port: 80 });

        // THEN
        listener.addTargets('target', {
          port: 80,
          targets: [service.loadBalancerTarget({
            containerName: 'MainContainer',
            containerPort: 8001,
            protocol: ecs.Protocol.UDP,
          })],
        });
      });

      test('throws when protocol does not match', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
        const container = taskDefinition.addContainer('MainContainer', {
          image: ecs.ContainerImage.fromRegistry('hello'),
        });
        container.addPortMappings({ containerPort: 8000 });
        container.addPortMappings({ containerPort: 8001, protocol: ecs.Protocol.UDP });

        const service = new ecs.FargateService(stack, 'Service', {
          cluster,
          taskDefinition,
        });

        // WHEN
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
        const listener = lb.addListener('listener', { port: 80 });

        // THEN
        expect(() => {
          listener.addTargets('target', {
            port: 80,
            targets: [service.loadBalancerTarget({
              containerName: 'MainContainer',
              containerPort: 8001,
              protocol: ecs.Protocol.TCP,
            })],
          });
        }).toThrow(/Container 'Default\/FargateTaskDef\/MainContainer' has no mapping for port 8001 and protocol tcp. Did you call "container.addPortMappings\(\)"\?/);
      });

      test('throws when port does not match', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
        const container = taskDefinition.addContainer('MainContainer', {
          image: ecs.ContainerImage.fromRegistry('hello'),
        });
        container.addPortMappings({ containerPort: 8000 });
        container.addPortMappings({ containerPort: 8001 });

        const service = new ecs.FargateService(stack, 'Service', {
          cluster,
          taskDefinition,
        });

        // WHEN
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
        const listener = lb.addListener('listener', { port: 80 });

        // THEN
        expect(() => {
          listener.addTargets('target', {
            port: 80,
            targets: [service.loadBalancerTarget({
              containerName: 'MainContainer',
              containerPort: 8002,
            })],
          });
        }).toThrow(/Container 'Default\/FargateTaskDef\/MainContainer' has no mapping for port 8002 and protocol tcp. Did you call "container.addPortMappings\(\)"\?/);
      });

      test('throws when container does not exist', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
        const container = taskDefinition.addContainer('MainContainer', {
          image: ecs.ContainerImage.fromRegistry('hello'),
        });
        container.addPortMappings({ containerPort: 8000 });
        container.addPortMappings({ containerPort: 8001 });

        const service = new ecs.FargateService(stack, 'Service', {
          cluster,
          taskDefinition,
        });

        // WHEN
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
        const listener = lb.addListener('listener', { port: 80 });

        // THEN
        expect(() => {
          listener.addTargets('target', {
            port: 80,
            targets: [service.loadBalancerTarget({
              containerName: 'SideContainer',
              containerPort: 8001,
            })],
          });
        }).toThrow(/No container named 'SideContainer'. Did you call "addContainer()"?/);
      });
    });

    describe('allows load balancing to any container and port of service', () => {
      describe('with application load balancers', () => {
        test('with default target group port and protocol', () => {
          // GIVEN
          const stack = new cdk.Stack();
          const vpc = new ec2.Vpc(stack, 'MyVpc', {});
          const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
          const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
          const container = taskDefinition.addContainer('MainContainer', {
            image: ecs.ContainerImage.fromRegistry('hello'),
          });
          container.addPortMappings({ containerPort: 8000 });

          const service = new ecs.FargateService(stack, 'Service', {
            cluster,
            taskDefinition,
          });

          // WHEN
          const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
          const listener = lb.addListener('listener', { port: 80 });

          service.registerLoadBalancerTargets(
            {
              containerName: 'MainContainer',
              containerPort: 8000,
              listener: ecs.ListenerConfig.applicationListener(listener),
              newTargetGroupId: 'target1',
            },
          );

          // THEN
          Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
            LoadBalancers: [
              {
                ContainerName: 'MainContainer',
                ContainerPort: 8000,
                TargetGroupArn: {
                  Ref: 'lblistenertarget1Group1A1A5C9E',
                },
              },
            ],
          });

          Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            Port: 80,
            Protocol: 'HTTP',
          });
        });

        test('with default target group port and HTTP protocol', () => {
          // GIVEN
          const stack = new cdk.Stack();
          const vpc = new ec2.Vpc(stack, 'MyVpc', {});
          const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
          const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
          const container = taskDefinition.addContainer('MainContainer', {
            image: ecs.ContainerImage.fromRegistry('hello'),
          });
          container.addPortMappings({ containerPort: 8000 });

          const service = new ecs.FargateService(stack, 'Service', {
            cluster,
            taskDefinition,
          });

          // WHEN
          const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
          const listener = lb.addListener('listener', { port: 80 });

          service.registerLoadBalancerTargets(
            {
              containerName: 'MainContainer',
              containerPort: 8000,
              listener: ecs.ListenerConfig.applicationListener(listener, {
                protocol: elbv2.ApplicationProtocol.HTTP,
              }),
              newTargetGroupId: 'target1',
            },
          );

          // THEN
          Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
            LoadBalancers: [
              {
                ContainerName: 'MainContainer',
                ContainerPort: 8000,
                TargetGroupArn: {
                  Ref: 'lblistenertarget1Group1A1A5C9E',
                },
              },
            ],
          });

          Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            Port: 80,
            Protocol: 'HTTP',
          });
        });

        test('with default target group port and HTTPS protocol', () => {
          // GIVEN
          const stack = new cdk.Stack();
          const vpc = new ec2.Vpc(stack, 'MyVpc', {});
          const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
          const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
          const container = taskDefinition.addContainer('MainContainer', {
            image: ecs.ContainerImage.fromRegistry('hello'),
          });
          container.addPortMappings({ containerPort: 8000 });

          const service = new ecs.FargateService(stack, 'Service', {
            cluster,
            taskDefinition,
          });

          // WHEN
          const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
          const listener = lb.addListener('listener', { port: 80 });

          service.registerLoadBalancerTargets(
            {
              containerName: 'MainContainer',
              containerPort: 8000,
              listener: ecs.ListenerConfig.applicationListener(listener, {
                protocol: elbv2.ApplicationProtocol.HTTPS,
              }),
              newTargetGroupId: 'target1',
            },
          );

          // THEN
          Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
            LoadBalancers: [
              {
                ContainerName: 'MainContainer',
                ContainerPort: 8000,
                TargetGroupArn: {
                  Ref: 'lblistenertarget1Group1A1A5C9E',
                },
              },
            ],
          });

          Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            Port: 443,
            Protocol: 'HTTPS',
          });
        });

        test('with any target group port and protocol', () => {
          // GIVEN
          const stack = new cdk.Stack();
          const vpc = new ec2.Vpc(stack, 'MyVpc', {});
          const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
          const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
          const container = taskDefinition.addContainer('MainContainer', {
            image: ecs.ContainerImage.fromRegistry('hello'),
          });
          container.addPortMappings({ containerPort: 8000 });

          const service = new ecs.FargateService(stack, 'Service', {
            cluster,
            taskDefinition,
          });

          // WHEN
          const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
          const listener = lb.addListener('listener', { port: 80 });

          service.registerLoadBalancerTargets(
            {
              containerName: 'MainContainer',
              containerPort: 8000,
              listener: ecs.ListenerConfig.applicationListener(listener, {
                port: 83,
                protocol: elbv2.ApplicationProtocol.HTTP,
              }),
              newTargetGroupId: 'target1',
            },
          );

          // THEN
          Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
            LoadBalancers: [
              {
                ContainerName: 'MainContainer',
                ContainerPort: 8000,
                TargetGroupArn: {
                  Ref: 'lblistenertarget1Group1A1A5C9E',
                },
              },
            ],
          });

          Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            Port: 83,
            Protocol: 'HTTP',
          });
        });
      });

      describe('with network load balancers', () => {
        test('with default target group port', () => {
          // GIVEN
          const stack = new cdk.Stack();
          const vpc = new ec2.Vpc(stack, 'MyVpc', {});
          const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
          const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
          const container = taskDefinition.addContainer('MainContainer', {
            image: ecs.ContainerImage.fromRegistry('hello'),
          });
          container.addPortMappings({ containerPort: 8000 });

          const service = new ecs.FargateService(stack, 'Service', {
            cluster,
            taskDefinition,
          });

          // WHEN
          const lb = new elbv2.NetworkLoadBalancer(stack, 'lb', { vpc });
          const listener = lb.addListener('listener', { port: 80 });

          service.registerLoadBalancerTargets(
            {
              containerName: 'MainContainer',
              containerPort: 8000,
              listener: ecs.ListenerConfig.networkListener(listener),
              newTargetGroupId: 'target1',
            },
          );

          // THEN
          Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
            LoadBalancers: [
              {
                ContainerName: 'MainContainer',
                ContainerPort: 8000,
                TargetGroupArn: {
                  Ref: 'lblistenertarget1Group1A1A5C9E',
                },
              },
            ],
          });

          Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            Port: 80,
            Protocol: 'TCP',
          });
        });

        test('with any target group port', () => {
          // GIVEN
          const stack = new cdk.Stack();
          const vpc = new ec2.Vpc(stack, 'MyVpc', {});
          const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
          const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
          const container = taskDefinition.addContainer('MainContainer', {
            image: ecs.ContainerImage.fromRegistry('hello'),
          });
          container.addPortMappings({ containerPort: 8000 });

          const service = new ecs.FargateService(stack, 'Service', {
            cluster,
            taskDefinition,
          });

          // WHEN
          const lb = new elbv2.NetworkLoadBalancer(stack, 'lb', { vpc });
          const listener = lb.addListener('listener', { port: 80 });

          service.registerLoadBalancerTargets(
            {
              containerName: 'MainContainer',
              containerPort: 8000,
              listener: ecs.ListenerConfig.networkListener(listener, {
                port: 81,
              }),
              newTargetGroupId: 'target1',
            },
          );

          // THEN
          Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
            LoadBalancers: [
              {
                ContainerName: 'MainContainer',
                ContainerPort: 8000,
                TargetGroupArn: {
                  Ref: 'lblistenertarget1Group1A1A5C9E',
                },
              },
            ],
          });

          Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
            Port: 81,
            Protocol: 'TCP',
          });
        });
      });
    });
  });

  describe('autoscaling tests', () => {
    test('allows scaling on a specified scheduled time', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
      });
      container.addPortMappings({ containerPort: 8000 });

      const service = new ecs.FargateService(stack, 'Service', {
        cluster,
        taskDefinition,
      });

      // WHEN
      const capacity = service.autoScaleTaskCount({ maxCapacity: 10, minCapacity: 1 });
      capacity.scaleOnSchedule('ScaleOnSchedule', {
        schedule: appscaling.Schedule.cron({ hour: '8', minute: '0' }),
        minCapacity: 10,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalableTarget', {
        ScheduledActions: [
          {
            ScalableTargetAction: {
              MinCapacity: 10,
            },
            Schedule: 'cron(0 8 * * ? *)',
            ScheduledActionName: 'ScaleOnSchedule',
          },
        ],
      });
    });

    test('allows scaling on a specified metric value', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
      });
      container.addPortMappings({ containerPort: 8000 });

      const service = new ecs.FargateService(stack, 'Service', {
        cluster,
        taskDefinition,
      });

      // WHEN
      const capacity = service.autoScaleTaskCount({ maxCapacity: 10, minCapacity: 1 });
      capacity.scaleOnMetric('ScaleOnMetric', {
        metric: new cloudwatch.Metric({ namespace: 'Test', metricName: 'Metric' }),
        scalingSteps: [
          { upper: 0, change: -1 },
          { lower: 100, change: +1 },
          { lower: 500, change: +5 },
        ],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
        PolicyType: 'StepScaling',
        ScalingTargetId: {
          Ref: 'ServiceTaskCountTarget23E25614',
        },
        StepScalingPolicyConfiguration: {
          AdjustmentType: 'ChangeInCapacity',
          MetricAggregationType: 'Average',
          StepAdjustments: [
            {
              MetricIntervalUpperBound: 0,
              ScalingAdjustment: -1,
            },
          ],
        },
      });
    });

    test('allows scaling on a target CPU utilization', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
      });
      container.addPortMappings({ containerPort: 8000 });

      const service = new ecs.FargateService(stack, 'Service', {
        cluster,
        taskDefinition,
      });

      // WHEN
      const capacity = service.autoScaleTaskCount({ maxCapacity: 10, minCapacity: 1 });
      capacity.scaleOnCpuUtilization('ScaleOnCpu', {
        targetUtilizationPercent: 30,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
        PolicyType: 'TargetTrackingScaling',
        TargetTrackingScalingPolicyConfiguration: {
          PredefinedMetricSpecification: { PredefinedMetricType: 'ECSServiceAverageCPUUtilization' },
          TargetValue: 30,
        },
      });
    });

    test('allows scaling on memory utilization', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
      });
      container.addPortMappings({ containerPort: 8000 });

      const service = new ecs.FargateService(stack, 'Service', {
        cluster,
        taskDefinition,
      });

      // WHEN
      const capacity = service.autoScaleTaskCount({ maxCapacity: 10, minCapacity: 1 });
      capacity.scaleOnMemoryUtilization('ScaleOnMemory', {
        targetUtilizationPercent: 30,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
        PolicyType: 'TargetTrackingScaling',
        TargetTrackingScalingPolicyConfiguration: {
          PredefinedMetricSpecification: { PredefinedMetricType: 'ECSServiceAverageMemoryUtilization' },
          TargetValue: 30,
        },
      });
    });

    test('allows scaling on custom CloudWatch metric', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
      });
      container.addPortMappings({ containerPort: 8000 });

      const service = new ecs.FargateService(stack, 'Service', {
        cluster,
        taskDefinition,
      });

      // WHEN
      const capacity = service.autoScaleTaskCount({ maxCapacity: 10, minCapacity: 1 });
      capacity.scaleToTrackCustomMetric('ScaleOnCustomMetric', {
        metric: new cloudwatch.Metric({ namespace: 'Test', metricName: 'Metric' }),
        targetValue: 5,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
        PolicyType: 'TargetTrackingScaling',
        TargetTrackingScalingPolicyConfiguration: {
          CustomizedMetricSpecification: {
            MetricName: 'Metric',
            Namespace: 'Test',
            Statistic: 'Average',
          },
          TargetValue: 5,
        },
      });
    });

    test('scheduled scaling shows warning when minute is not defined in cron', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
      });
      container.addPortMappings({ containerPort: 8000 });

      const service = new ecs.FargateService(stack, 'Service', {
        cluster,
        taskDefinition,
      });

      // WHEN
      const capacity = service.autoScaleTaskCount({ maxCapacity: 10, minCapacity: 1 });
      capacity.scaleOnSchedule('ScaleOnSchedule', {
        schedule: appscaling.Schedule.cron({ hour: '8' }),
        minCapacity: 10,
      });

      // THEN
      Annotations.fromStack(stack).hasWarning('/Default/Service/TaskCount/Target', "cron: If you don't pass 'minute', by default the event runs every minute. Pass 'minute: '*'' if that's what you intend, or 'minute: 0' to run once per hour instead.");
    });

    test('scheduled scaling shows no warning when minute is * in cron', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
      });
      container.addPortMappings({ containerPort: 8000 });

      const service = new ecs.FargateService(stack, 'Service', {
        cluster,
        taskDefinition,
      });

      // WHEN
      const capacity = service.autoScaleTaskCount({ maxCapacity: 10, minCapacity: 1 });
      capacity.scaleOnSchedule('ScaleOnSchedule', {
        schedule: appscaling.Schedule.cron({ hour: '8', minute: '*' }),
        minCapacity: 10,
      });

      // THEN
      const annotations = Annotations.fromStack(stack).findWarning('*', Match.anyValue());
      expect(annotations.length).toBe(0);
    });
  });

  describe('When enabling service discovery', () => {
    test('throws if namespace has not been added to cluster', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
        memoryLimitMiB: 512,
      });
      container.addPortMappings({ containerPort: 8000 });

      // THEN
      expect(() => {
        new ecs.FargateService(stack, 'Service', {
          cluster,
          taskDefinition,
          cloudMapOptions: {
            name: 'myApp',
          },
        });
      }).toThrow(/Cannot enable service discovery if a Cloudmap Namespace has not been created in the cluster./);
    });

    test('creates cloud map service for Private DNS namespace', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
      });
      container.addPortMappings({ containerPort: 8000 });

      // WHEN
      cluster.addDefaultCloudMapNamespace({
        name: 'foo.com',
        type: cloudmap.NamespaceType.DNS_PRIVATE,
      });

      new ecs.FargateService(stack, 'Service', {
        cluster,
        taskDefinition,
        cloudMapOptions: {
          name: 'myApp',
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Service', {
        DnsConfig: {
          DnsRecords: [
            {
              TTL: 60,
              Type: 'A',
            },
          ],
          NamespaceId: {
            'Fn::GetAtt': [
              'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
              'Id',
            ],
          },
          RoutingPolicy: 'MULTIVALUE',
        },
        HealthCheckCustomConfig: {
          FailureThreshold: 1,
        },
        Name: 'myApp',
        NamespaceId: {
          'Fn::GetAtt': [
            'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
            'Id',
          ],
        },
      });
    });

    test('creates AWS Cloud Map service for Private DNS namespace with SRV records with proper defaults', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      addDefaultCapacityProvider(cluster, stack, vpc);

      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
        memoryLimitMiB: 512,
      });
      container.addPortMappings({ containerPort: 8000 });

      // WHEN
      cluster.addDefaultCloudMapNamespace({
        name: 'foo.com',
        type: cloudmap.NamespaceType.DNS_PRIVATE,
      });

      new ecs.FargateService(stack, 'Service', {
        cluster,
        taskDefinition,
        cloudMapOptions: {
          name: 'myApp',
          dnsRecordType: cloudmap.DnsRecordType.SRV,
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Service', {
        DnsConfig: {
          DnsRecords: [
            {
              TTL: 60,
              Type: 'SRV',
            },
          ],
          NamespaceId: {
            'Fn::GetAtt': [
              'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
              'Id',
            ],
          },
          RoutingPolicy: 'MULTIVALUE',
        },
        HealthCheckCustomConfig: {
          FailureThreshold: 1,
        },
        Name: 'myApp',
        NamespaceId: {
          'Fn::GetAtt': [
            'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
            'Id',
          ],
        },
      });
    });

    test('creates AWS Cloud Map service for Private DNS namespace with SRV records with overriden defaults', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      addDefaultCapacityProvider(cluster, stack, vpc);

      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
        memoryLimitMiB: 512,
      });
      container.addPortMappings({ containerPort: 8000 });

      // WHEN
      cluster.addDefaultCloudMapNamespace({
        name: 'foo.com',
        type: cloudmap.NamespaceType.DNS_PRIVATE,
      });

      new ecs.FargateService(stack, 'Service', {
        cluster,
        taskDefinition,
        cloudMapOptions: {
          name: 'myApp',
          dnsRecordType: cloudmap.DnsRecordType.SRV,
          dnsTtl: cdk.Duration.seconds(10),
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Service', {
        DnsConfig: {
          DnsRecords: [
            {
              TTL: 10,
              Type: 'SRV',
            },
          ],
          NamespaceId: {
            'Fn::GetAtt': [
              'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
              'Id',
            ],
          },
          RoutingPolicy: 'MULTIVALUE',
        },
        HealthCheckCustomConfig: {
          FailureThreshold: 1,
        },
        Name: 'myApp',
        NamespaceId: {
          'Fn::GetAtt': [
            'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
            'Id',
          ],
        },
      });
    });

    test('user can select any container and port', () => {
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

      cluster.addDefaultCloudMapNamespace({
        name: 'foo.com',
        type: cloudmap.NamespaceType.DNS_PRIVATE,
      });

      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const mainContainer = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
        memoryLimitMiB: 512,
      });
      mainContainer.addPortMappings({ containerPort: 8000 });

      const otherContainer = taskDefinition.addContainer('OtherContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
        memoryLimitMiB: 512,
      });
      otherContainer.addPortMappings({ containerPort: 8001 });

      new ecs.FargateService(stack, 'Service', {
        cluster,
        taskDefinition,
        cloudMapOptions: {
          dnsRecordType: cloudmap.DnsRecordType.SRV,
          container: otherContainer,
          containerPort: 8001,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        ServiceRegistries: [
          {
            RegistryArn: { 'Fn::GetAtt': ['ServiceCloudmapService046058A4', 'Arn'] },
            ContainerName: 'OtherContainer',
            ContainerPort: 8001,
          },
        ],
      });
    });
  });

  test('Metric', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
    taskDefinition.addContainer('Container', {
      image: ecs.ContainerImage.fromRegistry('hello'),
    });

    // WHEN
    const service = new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition,
    });

    // THEN
    expect(stack.resolve(service.metricCpuUtilization())).toEqual({
      dimensions: {
        ClusterName: { Ref: 'EcsCluster97242B84' },
        ServiceName: { 'Fn::GetAtt': ['ServiceD69D759B', 'Name'] },
      },
      namespace: 'AWS/ECS',
      metricName: 'CPUUtilization',
      period: cdk.Duration.minutes(5),
      statistic: 'Average',
    });
  });

  describe('When import a Fargate Service', () => {
    test('with serviceArn', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const cluster = new ecs.Cluster(stack, 'EcsCluster');

      // WHEN
      const service = ecs.FargateService.fromFargateServiceAttributes(stack, 'EcsService', {
        serviceArn: 'arn:aws:ecs:us-west-2:123456789012:service/my-http-service',
        cluster,
      });

      // THEN
      expect(service.serviceArn).toEqual('arn:aws:ecs:us-west-2:123456789012:service/my-http-service');
      expect(service.serviceName).toEqual('my-http-service');

      expect(service.env.account).toEqual('123456789012');
      expect(service.env.region).toEqual('us-west-2');

    });

    test('with serviceName', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const pseudo = new cdk.ScopedAws(stack);
      const cluster = new ecs.Cluster(stack, 'EcsCluster');

      // WHEN
      const service = ecs.FargateService.fromFargateServiceAttributes(stack, 'EcsService', {
        serviceName: 'my-http-service',
        cluster,
      });

      // THEN
      expect(stack.resolve(service.serviceArn)).toEqual(stack.resolve(`arn:${pseudo.partition}:ecs:${pseudo.region}:${pseudo.accountId}:service/my-http-service`));
      expect(service.serviceName).toEqual('my-http-service');
    });

    test('with circuit breaker', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const cluster = new ecs.Cluster(stack, 'EcsCluster');
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      taskDefinition.addContainer('Container', {
        image: ecs.ContainerImage.fromRegistry('hello'),
      });

      // WHEN
      new ecs.FargateService(stack, 'EcsService', {
        cluster,
        taskDefinition,
        circuitBreaker: { rollback: true },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        DeploymentConfiguration: {
          MaximumPercent: 200,
          MinimumHealthyPercent: 50,
          DeploymentCircuitBreaker: {
            Enable: true,
            Rollback: true,
          },
        },
        DeploymentController: {
          Type: ecs.DeploymentControllerType.ECS,
        },
      });
    });

    test('throws an exception if both serviceArn and serviceName were provided for fromEc2ServiceAttributes', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const cluster = new ecs.Cluster(stack, 'EcsCluster');

      expect(() => {
        ecs.FargateService.fromFargateServiceAttributes(stack, 'EcsService', {
          serviceArn: 'arn:aws:ecs:us-west-2:123456789012:service/my-http-service',
          serviceName: 'my-http-service',
          cluster,
        });
      }).toThrow(/only specify either serviceArn or serviceName/);
    });

    test('throws an exception if neither serviceArn nor serviceName were provided for fromEc2ServiceAttributes', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const cluster = new ecs.Cluster(stack, 'EcsCluster');

      expect(() => {
        ecs.FargateService.fromFargateServiceAttributes(stack, 'EcsService', {
          cluster,
        });
      }).toThrow(/only specify either serviceArn or serviceName/);
    });

    test('allows setting enable execute command', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      });

      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
        enableExecuteCommand: true,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
        TaskDefinition: {
          Ref: 'FargateTaskDefC6FB60B4',
        },
        Cluster: {
          Ref: 'EcsCluster97242B84',
        },
        DeploymentConfiguration: {
          MaximumPercent: 200,
          MinimumHealthyPercent: 50,
        },
        LaunchType: LaunchType.FARGATE,
        EnableECSManagedTags: false,
        EnableExecuteCommand: true,
        NetworkConfiguration: {
          AwsvpcConfiguration: {
            AssignPublicIp: 'DISABLED',
            SecurityGroups: [
              {
                'Fn::GetAtt': [
                  'FargateServiceSecurityGroup0A0E79CB',
                  'GroupId',
                ],
              },
            ],
            Subnets: [
              {
                Ref: 'MyVpcPrivateSubnet1Subnet5057CF7E',
              },
              {
                Ref: 'MyVpcPrivateSubnet2Subnet0040C983',
              },
            ],
          },
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
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
        },
        PolicyName: 'FargateTaskDefTaskRoleDefaultPolicy8EB25BBD',
        Roles: [
          {
            Ref: 'FargateTaskDefTaskRole0B257552',
          },
        ],
      });
    });

    test('no logging enabled when logging field is set to NONE', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});

      // WHEN
      const cluster = new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
        executeCommandConfiguration: {
          logging: ecs.ExecuteCommandLogging.NONE,
        },
      });
      addDefaultCapacityProvider(cluster, stack, vpc);
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      const logGroup = new logs.LogGroup(stack, 'LogGroup');

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        logging: ecs.LogDrivers.awsLogs({
          logGroup,
          streamPrefix: 'log-group',
        }),
        memoryLimitMiB: 512,
      });

      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
        enableExecuteCommand: true,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
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
          ],
          Version: '2012-10-17',
        },
        PolicyName: 'FargateTaskDefTaskRoleDefaultPolicy8EB25BBD',
        Roles: [
          {
            Ref: 'FargateTaskDefTaskRole0B257552',
          },
        ],
      });
    });

    test('enables execute command logging with logging field set to OVERRIDE', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});

      const logGroup = new logs.LogGroup(stack, 'LogGroup');

      const execBucket = new s3.Bucket(stack, 'ExecBucket');

      // WHEN
      const cluster = new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
        executeCommandConfiguration: {
          logConfiguration: {
            cloudWatchLogGroup: logGroup,
            s3Bucket: execBucket,
            s3KeyPrefix: 'exec-output',
          },
          logging: ecs.ExecuteCommandLogging.OVERRIDE,
        },
      });
      addDefaultCapacityProvider(cluster, stack, vpc);
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });

      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
        enableExecuteCommand: true,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
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
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':logs:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':log-group:',
                    {
                      Ref: 'LogGroupF5B46931',
                    },
                    ':*',
                  ],
                ],
              },
            },
            {
              Action: 's3:GetBucketLocation',
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: 's3:PutObject',
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':s3:::',
                    {
                      Ref: 'ExecBucket29559356',
                    },
                    '/*',
                  ],
                ],
              },
            },
          ],
          Version: '2012-10-17',
        },
        PolicyName: 'FargateTaskDefTaskRoleDefaultPolicy8EB25BBD',
        Roles: [
          {
            Ref: 'FargateTaskDefTaskRole0B257552',
          },
        ],
      });
    });

    test('enables only execute command session encryption', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});

      const kmsKey = new kms.Key(stack, 'KmsKey');

      const logGroup = new logs.LogGroup(stack, 'LogGroup');

      const execBucket = new s3.Bucket(stack, 'EcsExecBucket');

      // WHEN
      const cluster = new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
        executeCommandConfiguration: {
          kmsKey,
          logConfiguration: {
            cloudWatchLogGroup: logGroup,
            s3Bucket: execBucket,
          },
          logging: ecs.ExecuteCommandLogging.OVERRIDE,
        },
      });

      addDefaultCapacityProvider(cluster, stack, vpc);
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });

      new ecs.FargateService(stack, 'Ec2Service', {
        cluster,
        taskDefinition,
        enableExecuteCommand: true,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
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
              Action: [
                'kms:Decrypt',
                'kms:GenerateDataKey',
              ],
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': [
                  'KmsKey46693ADD',
                  'Arn',
                ],
              },
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
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':logs:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':log-group:',
                    {
                      Ref: 'LogGroupF5B46931',
                    },
                    ':*',
                  ],
                ],
              },
            },
            {
              Action: 's3:GetBucketLocation',
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: 's3:PutObject',
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':s3:::',
                    {
                      Ref: 'EcsExecBucket4F468651',
                    },
                    '/*',
                  ],
                ],
              },
            },
          ],
          Version: '2012-10-17',
        },
        PolicyName: 'FargateTaskDefTaskRoleDefaultPolicy8EB25BBD',
        Roles: [
          {
            Ref: 'FargateTaskDefTaskRole0B257552',
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
        KeyPolicy: {
          Statement: [
            {
              Action: 'kms:*',
              Effect: 'Allow',
              Principal: {
                AWS: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':iam::',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':root',
                    ],
                  ],
                },
              },
              Resource: '*',
            },
          ],
          Version: '2012-10-17',
        },
      });
    });

    test('enables encryption for execute command logging', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});

      const kmsKey = new kms.Key(stack, 'KmsKey');

      const logGroup = new logs.LogGroup(stack, 'LogGroup', {
        encryptionKey: kmsKey,
      });

      const execBucket = new s3.Bucket(stack, 'EcsExecBucket', {
        encryptionKey: kmsKey,
      });

      // WHEN
      const cluster = new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
        executeCommandConfiguration: {
          kmsKey,
          logConfiguration: {
            cloudWatchLogGroup: logGroup,
            cloudWatchEncryptionEnabled: true,
            s3Bucket: execBucket,
            s3EncryptionEnabled: true,
            s3KeyPrefix: 'exec-output',
          },
          logging: ecs.ExecuteCommandLogging.OVERRIDE,
        },
      });

      addDefaultCapacityProvider(cluster, stack, vpc);
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });

      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
        enableExecuteCommand: true,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
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
              Action: [
                'kms:Decrypt',
                'kms:GenerateDataKey',
              ],
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': [
                  'KmsKey46693ADD',
                  'Arn',
                ],
              },
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
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':logs:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':log-group:',
                    {
                      Ref: 'LogGroupF5B46931',
                    },
                    ':*',
                  ],
                ],
              },
            },
            {
              Action: 's3:GetBucketLocation',
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: 's3:PutObject',
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':s3:::',
                    {
                      Ref: 'EcsExecBucket4F468651',
                    },
                    '/*',
                  ],
                ],
              },
            },
            {
              Action: 's3:GetEncryptionConfiguration',
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':s3:::',
                    {
                      Ref: 'EcsExecBucket4F468651',
                    },
                  ],
                ],
              },
            },
          ],
          Version: '2012-10-17',
        },
        PolicyName: 'FargateTaskDefTaskRoleDefaultPolicy8EB25BBD',
        Roles: [
          {
            Ref: 'FargateTaskDefTaskRole0B257552',
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
        KeyPolicy: {
          Statement: [
            {
              Action: 'kms:*',
              Effect: 'Allow',
              Principal: {
                AWS: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':iam::',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':root',
                    ],
                  ],
                },
              },
              Resource: '*',
            },
            {
              Action: [
                'kms:Encrypt*',
                'kms:Decrypt*',
                'kms:ReEncrypt*',
                'kms:GenerateDataKey*',
                'kms:Describe*',
              ],
              Condition: {
                ArnLike: {
                  'kms:EncryptionContext:aws:logs:arn': {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        {
                          Ref: 'AWS::Partition',
                        },
                        ':logs:',
                        {
                          Ref: 'AWS::Region',
                        },
                        ':',
                        {
                          Ref: 'AWS::AccountId',
                        },
                        ':*',
                      ],
                    ],
                  },
                },
              },
              Effect: 'Allow',
              Principal: {
                Service: {
                  'Fn::Join': [
                    '',
                    [
                      'logs.',
                      {
                        Ref: 'AWS::Region',
                      },
                      '.amazonaws.com',
                    ],
                  ],
                },
              },
              Resource: '*',
            },
          ],
          Version: '2012-10-17',
        },
      });
    });

    testDeprecated('with both propagateTags and propagateTaskTagsFrom defined', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });

      // THEN
      expect(() => {
        new ecs.FargateService(stack, 'FargateService', {
          cluster,
          taskDefinition,
          propagateTags: PropagatedTagSource.SERVICE,
          propagateTaskTagsFrom: PropagatedTagSource.SERVICE,
        });
      }).toThrow(/You can only specify either propagateTags or propagateTaskTagsFrom. Alternatively, you can leave both blank/);
    });
  });
});
