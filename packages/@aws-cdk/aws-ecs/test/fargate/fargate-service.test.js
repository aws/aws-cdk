"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const appscaling = require("@aws-cdk/aws-applicationautoscaling");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const ec2 = require("@aws-cdk/aws-ec2");
const elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");
const kms = require("@aws-cdk/aws-kms");
const logs = require("@aws-cdk/aws-logs");
const s3 = require("@aws-cdk/aws-s3");
const secretsmanager = require("@aws-cdk/aws-secretsmanager");
const cloudmap = require("@aws-cdk/aws-servicediscovery");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const cx_api_1 = require("@aws-cdk/cx-api");
const ecs = require("../../lib");
const base_service_1 = require("../../lib/base/base-service");
const util_1 = require("../util");
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
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
                LaunchType: base_service_1.LaunchType.FARGATE,
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
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
        cdk_build_tools_1.testDeprecated('does not set launchType when capacity provider strategies specified (deprecated)', () => {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Cluster', {
                CapacityProviders: assertions_1.Match.absent(),
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
                CapacityProviders: ['FARGATE', 'FARGATE_SPOT'],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Cluster', {
                CapacityProviders: assertions_1.Match.absent(),
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
                CapacityProviders: ['FARGATE', 'FARGATE_SPOT'],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
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
                LaunchType: assertions_1.Match.absent(),
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Service', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::PrivateDnsNamespace', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
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
                LaunchType: base_service_1.LaunchType.FARGATE,
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
            // Errors on validation, not on construction.
            new ecs.FargateService(stack, 'FargateService', {
                cluster,
                taskDefinition,
                platformVersion: ecs.FargatePlatformVersion.VERSION1_3,
            });
            // THEN
            expect(() => {
                assertions_1.Template.fromStack(stack);
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
                    type: base_service_1.DeploymentControllerType.EXTERNAL,
                },
            });
            // THEN
            assertions_1.Annotations.fromStack(stack).hasWarning('/Default/FargateService', 'taskDefinition and launchType are blanked out when using external deployment controller.');
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
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
        test('add warning to annotations if circuitBreaker is specified with a non-ECS DeploymentControllerType', () => {
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
                deploymentController: {
                    type: base_service_1.DeploymentControllerType.EXTERNAL,
                },
                circuitBreaker: { rollback: true },
            });
            // THEN
            expect(service.node.metadata[0].data).toEqual('taskDefinition and launchType are blanked out when using external deployment controller.');
            expect(service.node.metadata[1].data).toEqual('Deployment circuit breaker requires the ECS deployment controller.');
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
                assertions_1.Template.fromStack(stack);
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    assertions_1.Match.objectLike({
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
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
                assignPublicIp: true,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                NetworkConfiguration: {
                    AwsvpcConfiguration: {
                        AssignPublicIp: 'ENABLED',
                    },
                },
            });
        });
        test('sets task definition to family when CODE_DEPLOY deployment controller is specified', () => {
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
                    type: ecs.DeploymentControllerType.CODE_DEPLOY,
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResource('AWS::ECS::Service', {
                Properties: {
                    TaskDefinition: 'FargateTaskDef',
                    DeploymentController: {
                        Type: 'CODE_DEPLOY',
                    },
                },
                DependsOn: [
                    'FargateTaskDefC6FB60B4',
                    'FargateTaskDefTaskRole0B257552',
                ],
            });
        });
        cdk_build_tools_1.testDeprecated('throws when securityGroup and securityGroups are supplied', () => {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
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
                LaunchType: base_service_1.LaunchType.FARGATE,
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
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
    describe('when enabling service connect', () => {
        describe('when validating service connect configurations', () => {
            let service;
            beforeEach(() => {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new ec2.Vpc(stack, 'MyVpc', {});
                const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
                const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
                taskDefinition.addContainer('web', {
                    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                });
                service = new ecs.FargateService(stack, 'FargateService', {
                    cluster,
                    taskDefinition,
                });
            });
            test('throws an exception if serviceconnectservice.port is a string and it does not exists on the task definition', () => {
                // GIVEN
                const config = {
                    services: [
                        {
                            portMappingName: '100',
                            dnsName: 'backend.prod',
                        },
                    ],
                    namespace: 'test namespace',
                };
                expect(() => {
                    service.enableServiceConnect(config);
                }).toThrowError(/Port Mapping '100' does not exist on the task definition./);
            });
            test('throws an exception when adding multiple services without different discovery names', () => {
                // GIVEN
                service.taskDefinition.addContainer('mobile', {
                    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                    portMappings: [
                        {
                            containerPort: 100,
                            name: 'abc',
                        },
                    ],
                });
                const config = {
                    services: [
                        {
                            portMappingName: 'abc',
                            dnsName: 'backend.prod',
                            port: 5005,
                        },
                        {
                            portMappingName: 'abc',
                            dnsName: 'backend.prod.local',
                        },
                    ],
                    namespace: 'test namespace',
                };
                expect(() => {
                    service.enableServiceConnect(config);
                }).toThrowError(/Cannot create multiple services with the discoveryName 'abc'./);
            });
            test('throws an exception if ingressPortOverride is not valid.', () => {
                // GIVEN
                service.taskDefinition.addContainer('mobile', {
                    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                    portMappings: [
                        {
                            containerPort: 100,
                            name: '100',
                        },
                    ],
                });
                const config = {
                    services: [
                        {
                            portMappingName: '100',
                            dnsName: 'backend.prod',
                            port: 5005,
                            ingressPortOverride: 100000,
                        },
                    ],
                    namespace: 'test namespace',
                };
                expect(() => {
                    service.enableServiceConnect(config);
                }).toThrowError(/ingressPortOverride 100000 is not valid./);
            });
            test('throws an exception if Client Alias port is not valid', () => {
                // GIVEN
                service.taskDefinition.addContainer('mobile', {
                    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                    portMappings: [
                        {
                            containerPort: 100,
                            name: '100',
                        },
                    ],
                });
                const config = {
                    services: [
                        {
                            portMappingName: '100',
                            dnsName: 'backend.prod',
                            port: 100000,
                            ingressPortOverride: 3000,
                        },
                    ],
                    namespace: 'test namespace',
                };
                expect(() => {
                    service.enableServiceConnect(config);
                }).toThrowError(/Client Alias port 100000 is not valid./);
            });
        });
        describe('when creating a FargateService with service connect', () => {
            let service;
            let stack;
            let cluster;
            beforeEach(() => {
                // GIVEN
                stack = new cdk.Stack();
                const vpc = new ec2.Vpc(stack, 'MyVpc', {});
                cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
                const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
                taskDefinition.addContainer('web', {
                    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                    portMappings: [
                        {
                            containerPort: 80,
                            name: 'api',
                        },
                    ],
                });
                service = new ecs.FargateService(stack, 'FargateService', {
                    cluster,
                    taskDefinition,
                });
            });
            test('service connect cannot be enabled twice', () => {
                // WHEN
                cluster.addDefaultCloudMapNamespace({
                    name: 'cool',
                });
                service.enableServiceConnect();
                // THEN
                expect(() => {
                    service.enableServiceConnect({});
                }).toThrow('Service connect configuration cannot be specified more than once.');
            });
            test('client alias port is defaulted to containerport', () => {
                service.enableServiceConnect({
                    namespace: 'cool',
                    services: [
                        {
                            portMappingName: 'api',
                        },
                    ],
                });
                // THEN
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                    ServiceConnectConfiguration: {
                        Enabled: true,
                        Namespace: 'cool',
                        Services: [
                            {
                                PortName: 'api',
                                ClientAliases: [
                                    {
                                        Port: 80,
                                    },
                                ],
                            },
                        ],
                    },
                });
            });
            test('with explicit enable', () => {
                // WHEN
                cluster.addDefaultCloudMapNamespace({
                    name: 'cool',
                });
                service.enableServiceConnect({});
                // THEN
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                    ServiceConnectConfiguration: {
                        Enabled: true,
                        Namespace: 'cool',
                    },
                });
            });
            test('with explicit enable and no props', () => {
                // WHEN
                cluster.addDefaultCloudMapNamespace({
                    name: 'cool',
                });
                service.enableServiceConnect();
                // THEN
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                    ServiceConnectConfiguration: {
                        Enabled: true,
                        Namespace: 'cool',
                    },
                });
            });
            test('explicit enable and non default namespace', () => {
                // WHEN
                const ns = new cloudmap.HttpNamespace(stack, 'ns', {
                    name: 'cool',
                });
                service.enableServiceConnect({
                    namespace: ns.namespaceName,
                });
                // THEN
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                    ServiceConnectConfiguration: {
                        Enabled: true,
                        Namespace: 'cool',
                    },
                });
            });
            test('namespace inferred from cluster', () => {
                // WHEN
                cluster.addDefaultCloudMapNamespace({
                    name: 'cool',
                });
                service.enableServiceConnect({});
                // THEN
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                    ServiceConnectConfiguration: {
                        Enabled: true,
                        Namespace: 'cool',
                    },
                });
            });
            test('namespace inferred from cluster; empty props', () => {
                cluster.addDefaultCloudMapNamespace({
                    name: 'cool',
                });
                service.enableServiceConnect();
                // THEN
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                    ServiceConnectConfiguration: {
                        Enabled: true,
                        Namespace: 'cool',
                    },
                });
            });
            test('no namespace errors out', () => {
                // THEN
                expect(() => {
                    service.enableServiceConnect({});
                }).toThrow();
            });
            test('error when enabling service connect with no container', () => {
                // GIVEN
                const taskDefinition = new ecs.FargateTaskDefinition(stack, 'td2');
                const svc = new ecs.FargateService(stack, 'svc2', {
                    cluster,
                    taskDefinition,
                });
                expect(() => {
                    svc.enableServiceConnect({
                        logDriver: ecs.LogDrivers.awsLogs({
                            streamPrefix: 'sc',
                        }),
                    });
                }).toThrow('Task definition must have at least one container to enable service connect.');
            });
            test('with all options exercised', () => {
                // WHEN
                new cloudmap.HttpNamespace(stack, 'httpnamespace', {
                    name: 'cool',
                });
                service.enableServiceConnect({
                    services: [
                        {
                            portMappingName: 'api',
                            discoveryName: 'svc',
                            ingressPortOverride: 1000,
                            port: 80,
                            dnsName: 'api',
                        },
                    ],
                    namespace: 'cool',
                    logDriver: ecs.LogDrivers.awsLogs({
                        streamPrefix: 'sc',
                    }),
                });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                    ServiceConnectConfiguration: {
                        Enabled: true,
                        Namespace: 'cool',
                        Services: [
                            {
                                PortName: 'api',
                                IngressPortOverride: 1000,
                                DiscoveryName: 'svc',
                                ClientAliases: [
                                    {
                                        Port: 80,
                                        DnsName: 'api',
                                    },
                                ],
                            },
                        ],
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-stream-prefix': 'sc',
                            },
                        },
                    },
                });
            });
            test('with no alias name', () => {
                // WHEN
                cluster.addDefaultCloudMapNamespace({
                    name: 'cool',
                });
                service.enableServiceConnect({
                    services: [
                        {
                            portMappingName: 'api',
                            port: 80,
                        },
                    ],
                });
                // THEN
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                    ServiceConnectConfiguration: {
                        Enabled: true,
                        Namespace: 'cool',
                        Services: [
                            {
                                PortName: 'api',
                                ClientAliases: [
                                    {
                                        Port: 80,
                                    },
                                ],
                            },
                        ],
                    },
                });
            });
            test('with no alias specified', () => {
                // WHEN
                cluster.addDefaultCloudMapNamespace({
                    name: 'cool',
                });
                service.enableServiceConnect({
                    services: [
                        {
                            portMappingName: 'api',
                        },
                    ],
                });
                // THEN
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                    ServiceConnectConfiguration: {
                        Enabled: true,
                        Namespace: 'cool',
                        Services: [
                            {
                                PortName: 'api',
                                ClientAliases: [
                                    {
                                        Port: 80,
                                    },
                                ],
                            },
                        ],
                    },
                });
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalableTarget', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalableTarget', {
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
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
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
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
                    Description: 'Load balancer to target',
                    FromPort: 8000,
                    ToPort: 8000,
                });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
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
                }).toThrow(/No container named 'SideContainer'. Did you call "addContainer\(\)"?/);
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
                    service.registerLoadBalancerTargets({
                        containerName: 'MainContainer',
                        containerPort: 8000,
                        listener: ecs.ListenerConfig.applicationListener(listener),
                        newTargetGroupId: 'target1',
                    });
                    // THEN
                    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
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
                    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
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
                    service.registerLoadBalancerTargets({
                        containerName: 'MainContainer',
                        containerPort: 8000,
                        listener: ecs.ListenerConfig.applicationListener(listener, {
                            protocol: elbv2.ApplicationProtocol.HTTP,
                        }),
                        newTargetGroupId: 'target1',
                    });
                    // THEN
                    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
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
                    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
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
                    service.registerLoadBalancerTargets({
                        containerName: 'MainContainer',
                        containerPort: 8000,
                        listener: ecs.ListenerConfig.applicationListener(listener, {
                            protocol: elbv2.ApplicationProtocol.HTTPS,
                        }),
                        newTargetGroupId: 'target1',
                    });
                    // THEN
                    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
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
                    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
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
                    service.registerLoadBalancerTargets({
                        containerName: 'MainContainer',
                        containerPort: 8000,
                        listener: ecs.ListenerConfig.applicationListener(listener, {
                            port: 83,
                            protocol: elbv2.ApplicationProtocol.HTTP,
                        }),
                        newTargetGroupId: 'target1',
                    });
                    // THEN
                    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
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
                    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
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
                    service.registerLoadBalancerTargets({
                        containerName: 'MainContainer',
                        containerPort: 8000,
                        listener: ecs.ListenerConfig.networkListener(listener),
                        newTargetGroupId: 'target1',
                    });
                    // THEN
                    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
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
                    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
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
                    service.registerLoadBalancerTargets({
                        containerName: 'MainContainer',
                        containerPort: 8000,
                        listener: ecs.ListenerConfig.networkListener(listener, {
                            port: 81,
                        }),
                        newTargetGroupId: 'target1',
                    });
                    // THEN
                    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
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
                    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalableTarget', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
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
            assertions_1.Annotations.fromStack(stack).hasWarning('/Default/Service/TaskCount/Target', "cron: If you don't pass 'minute', by default the event runs every minute. Pass 'minute: '*'' if that's what you intend, or 'minute: 0' to run once per hour instead.");
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
            const annotations = assertions_1.Annotations.fromStack(stack).findWarning('*', assertions_1.Match.anyValue());
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Service', {
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
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Service', {
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
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Service', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
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
        test('fromFargateServiceArn old format', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const service = ecs.FargateService.fromFargateServiceArn(stack, 'EcsService', 'arn:aws:ecs:us-west-2:123456789012:service/my-http-service');
            // THEN
            expect(service.serviceArn).toEqual('arn:aws:ecs:us-west-2:123456789012:service/my-http-service');
            expect(service.serviceName).toEqual('my-http-service');
        });
        test('fromFargateServiceArn new format', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const service = ecs.FargateService.fromFargateServiceArn(stack, 'EcsService', 'arn:aws:ecs:us-west-2:123456789012:service/my-cluster-name/my-http-service');
            // THEN
            expect(service.serviceArn).toEqual('arn:aws:ecs:us-west-2:123456789012:service/my-cluster-name/my-http-service');
            expect(service.serviceName).toEqual('my-http-service');
        });
        describe('fromFargateServiceArn tokenized ARN', () => {
            test('when @aws-cdk/aws-ecs:arnFormatIncludesClusterName is disabled, use old ARN format', () => {
                // GIVEN
                const stack = new cdk.Stack();
                // WHEN
                const service = ecs.FargateService.fromFargateServiceArn(stack, 'EcsService', new cdk.CfnParameter(stack, 'ARN').valueAsString);
                // THEN
                expect(stack.resolve(service.serviceArn)).toEqual({ Ref: 'ARN' });
                expect(stack.resolve(service.serviceName)).toEqual({
                    'Fn::Select': [
                        1,
                        {
                            'Fn::Split': [
                                '/',
                                {
                                    'Fn::Select': [
                                        5,
                                        {
                                            'Fn::Split': [
                                                ':',
                                                { Ref: 'ARN' },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                });
            });
            test('when @aws-cdk/aws-ecs:arnFormatIncludesClusterName is enabled, use new ARN format', () => {
                // GIVEN
                const app = new core_1.App({
                    context: {
                        [cx_api_1.ECS_ARN_FORMAT_INCLUDES_CLUSTER_NAME]: true,
                    },
                });
                const stack = new cdk.Stack(app);
                // WHEN
                const service = ecs.FargateService.fromFargateServiceArn(stack, 'EcsService', new cdk.CfnParameter(stack, 'ARN').valueAsString);
                // THEN
                expect(stack.resolve(service.serviceArn)).toEqual({ Ref: 'ARN' });
                expect(stack.resolve(service.serviceName)).toEqual({
                    'Fn::Select': [
                        2,
                        {
                            'Fn::Split': [
                                '/',
                                {
                                    'Fn::Select': [
                                        5,
                                        {
                                            'Fn::Split': [
                                                ':',
                                                { Ref: 'ARN' },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                });
            });
        });
        test('with serviceArn old format', () => {
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
        test('with serviceArn new format', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const cluster = new ecs.Cluster(stack, 'EcsCluster');
            // WHEN
            const service = ecs.FargateService.fromFargateServiceAttributes(stack, 'EcsService', {
                serviceArn: 'arn:aws:ecs:us-west-2:123456789012:service/my-cluster-name/my-http-service',
                cluster,
            });
            // THEN
            expect(service.serviceArn).toEqual('arn:aws:ecs:us-west-2:123456789012:service/my-cluster-name/my-http-service');
            expect(service.serviceName).toEqual('my-http-service');
            expect(service.env.account).toEqual('123456789012');
            expect(service.env.region).toEqual('us-west-2');
        });
        describe('with serviceArn tokenized ARN', () => {
            test('when @aws-cdk/aws-ecs:arnFormatIncludesClusterName is disabled, use old ARN format', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const cluster = new ecs.Cluster(stack, 'EcsCluster');
                // WHEN
                const service = ecs.FargateService.fromFargateServiceAttributes(stack, 'EcsService', {
                    serviceArn: new cdk.CfnParameter(stack, 'ARN').valueAsString,
                    cluster,
                });
                // THEN
                expect(stack.resolve(service.serviceArn)).toEqual({ Ref: 'ARN' });
                expect(stack.resolve(service.serviceName)).toEqual({
                    'Fn::Select': [
                        1,
                        {
                            'Fn::Split': [
                                '/',
                                {
                                    'Fn::Select': [
                                        5,
                                        {
                                            'Fn::Split': [
                                                ':',
                                                { Ref: 'ARN' },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                });
                expect(stack.resolve(service.env.account)).toEqual({
                    'Fn::Select': [
                        4,
                        {
                            'Fn::Split': [
                                ':',
                                { Ref: 'ARN' },
                            ],
                        },
                    ],
                });
                expect(stack.resolve(service.env.region)).toEqual({
                    'Fn::Select': [
                        3,
                        {
                            'Fn::Split': [
                                ':',
                                { Ref: 'ARN' },
                            ],
                        },
                    ],
                });
            });
            test('when @aws-cdk/aws-ecs:arnFormatIncludesClusterName is enabled, use new ARN format', () => {
                // GIVEN
                const app = new core_1.App({
                    context: {
                        [cx_api_1.ECS_ARN_FORMAT_INCLUDES_CLUSTER_NAME]: true,
                    },
                });
                const stack = new cdk.Stack(app);
                const cluster = new ecs.Cluster(stack, 'EcsCluster');
                // WHEN
                const service = ecs.FargateService.fromFargateServiceAttributes(stack, 'EcsService', {
                    serviceArn: new cdk.CfnParameter(stack, 'ARN').valueAsString,
                    cluster,
                });
                // THEN
                expect(stack.resolve(service.serviceArn)).toEqual({ Ref: 'ARN' });
                expect(stack.resolve(service.serviceName)).toEqual({
                    'Fn::Select': [
                        2,
                        {
                            'Fn::Split': [
                                '/',
                                {
                                    'Fn::Select': [
                                        5,
                                        {
                                            'Fn::Split': [
                                                ':',
                                                { Ref: 'ARN' },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                });
                expect(stack.resolve(service.env.account)).toEqual({
                    'Fn::Select': [
                        4,
                        {
                            'Fn::Split': [
                                ':',
                                { Ref: 'ARN' },
                            ],
                        },
                    ],
                });
                expect(stack.resolve(service.env.region)).toEqual({
                    'Fn::Select': [
                        3,
                        {
                            'Fn::Split': [
                                ':',
                                { Ref: 'ARN' },
                            ],
                        },
                    ],
                });
            });
        });
        describe('with serviceName', () => {
            test('when @aws-cdk/aws-ecs:arnFormatIncludesClusterName is disabled, use old ARN format', () => {
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
            test('when @aws-cdk/aws-ecs:arnFormatIncludesClusterName is enabled, use new ARN format', () => {
                // GIVEN
                const app = new core_1.App({
                    context: {
                        [cx_api_1.ECS_ARN_FORMAT_INCLUDES_CLUSTER_NAME]: true,
                    },
                });
                const stack = new cdk.Stack(app);
                const pseudo = new cdk.ScopedAws(stack);
                const cluster = new ecs.Cluster(stack, 'EcsCluster');
                // WHEN
                const service = ecs.FargateService.fromFargateServiceAttributes(stack, 'EcsService', {
                    serviceName: 'my-http-service',
                    cluster,
                });
                // THEN
                expect(stack.resolve(service.serviceArn)).toEqual(stack.resolve(`arn:${pseudo.partition}:ecs:${pseudo.region}:${pseudo.accountId}:service/${cluster.clusterName}/my-http-service`));
                expect(service.serviceName).toEqual('my-http-service');
            });
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
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
        test('with circuit breaker and deployment controller feature flag enabled', () => {
            // GIVEN
            const disableCircuitBreakerEcsDeploymentControllerFeatureFlag = { [cxapi.ECS_DISABLE_EXPLICIT_DEPLOYMENT_CONTROLLER_FOR_CIRCUIT_BREAKER]: true };
            const app = new core_1.App({ context: disableCircuitBreakerEcsDeploymentControllerFeatureFlag });
            const stack = new cdk.Stack(app);
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                DeploymentConfiguration: {
                    MaximumPercent: 200,
                    MinimumHealthyPercent: 50,
                    DeploymentCircuitBreaker: {
                        Enable: true,
                        Rollback: true,
                    },
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
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
                LaunchType: base_service_1.LaunchType.FARGATE,
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
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
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
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
        cdk_build_tools_1.testDeprecated('with both propagateTags and propagateTaskTagsFrom defined', () => {
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
                    propagateTags: base_service_1.PropagatedTagSource.SERVICE,
                    propagateTaskTagsFrom: base_service_1.PropagatedTagSource.SERVICE,
                });
            }).toThrow(/You can only specify either propagateTags or propagateTaskTagsFrom. Alternatively, you can leave both blank/);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFyZ2F0ZS1zZXJ2aWNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmYXJnYXRlLXNlcnZpY2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFtRTtBQUNuRSxrRUFBa0U7QUFDbEUsc0RBQXNEO0FBQ3RELHdDQUF3QztBQUN4Qyw2REFBNkQ7QUFDN0Qsd0NBQXdDO0FBQ3hDLDBDQUEwQztBQUMxQyxzQ0FBc0M7QUFDdEMsOERBQThEO0FBQzlELDBEQUEwRDtBQUMxRCw4REFBMEQ7QUFDMUQscUNBQXFDO0FBQ3JDLHdDQUFvQztBQUNwQyx5Q0FBeUM7QUFDekMsNENBQXVFO0FBQ3ZFLGlDQUFpQztBQUNqQyw4REFBNkg7QUFDN0gsa0NBQXFEO0FBRXJELFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7SUFDL0IsUUFBUSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtRQUMvQyxJQUFJLENBQUMseUVBQXlFLEVBQUUsR0FBRyxFQUFFO1lBQ25GLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM1QyxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDOUQsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFFOUUsY0FBYyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUU7Z0JBQ2pDLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQzthQUNuRSxDQUFDLENBQUM7WUFFSCxNQUFN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LCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgYXBwc2NhbGluZyBmcm9tICdAYXdzLWNkay9hd3MtYXBwbGljYXRpb25hdXRvc2NhbGluZyc7XG5pbXBvcnQgKiBhcyBjbG91ZHdhdGNoIGZyb20gJ0Bhd3MtY2RrL2F3cy1jbG91ZHdhdGNoJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVsYnYyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lbGFzdGljbG9hZGJhbGFuY2luZ3YyJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCAqIGFzIGxvZ3MgZnJvbSAnQGF3cy1jZGsvYXdzLWxvZ3MnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIHNlY3JldHNtYW5hZ2VyIGZyb20gJ0Bhd3MtY2RrL2F3cy1zZWNyZXRzbWFuYWdlcic7XG5pbXBvcnQgKiBhcyBjbG91ZG1hcCBmcm9tICdAYXdzLWNkay9hd3Mtc2VydmljZWRpc2NvdmVyeSc7XG5pbXBvcnQgeyB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBBcHAgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBFQ1NfQVJOX0ZPUk1BVF9JTkNMVURFU19DTFVTVEVSX05BTUUgfSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJy4uLy4uL2xpYic7XG5pbXBvcnQgeyBEZXBsb3ltZW50Q29udHJvbGxlclR5cGUsIExhdW5jaFR5cGUsIFByb3BhZ2F0ZWRUYWdTb3VyY2UsIFNlcnZpY2VDb25uZWN0UHJvcHMgfSBmcm9tICcuLi8uLi9saWIvYmFzZS9iYXNlLXNlcnZpY2UnO1xuaW1wb3J0IHsgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIgfSBmcm9tICcuLi91dGlsJztcblxuZGVzY3JpYmUoJ2ZhcmdhdGUgc2VydmljZScsICgpID0+IHtcbiAgZGVzY3JpYmUoJ1doZW4gY3JlYXRpbmcgYSBGYXJnYXRlIFNlcnZpY2UnLCAoKSA9PiB7XG4gICAgdGVzdCgnd2l0aCBvbmx5IHJlcXVpcmVkIHByb3BlcnRpZXMgc2V0LCBpdCBjb3JyZWN0bHkgc2V0cyBkZWZhdWx0IHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdGYXJnYXRlVGFza0RlZicpO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnRmFyZ2F0ZVNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgVGFza0RlZmluaXRpb246IHtcbiAgICAgICAgICBSZWY6ICdGYXJnYXRlVGFza0RlZkM2RkI2MEI0JyxcbiAgICAgICAgfSxcbiAgICAgICAgQ2x1c3Rlcjoge1xuICAgICAgICAgIFJlZjogJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcsXG4gICAgICAgIH0sXG4gICAgICAgIERlcGxveW1lbnRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgTWF4aW11bVBlcmNlbnQ6IDIwMCxcbiAgICAgICAgICBNaW5pbXVtSGVhbHRoeVBlcmNlbnQ6IDUwLFxuICAgICAgICB9LFxuICAgICAgICBMYXVuY2hUeXBlOiBMYXVuY2hUeXBlLkZBUkdBVEUsXG4gICAgICAgIEVuYWJsZUVDU01hbmFnZWRUYWdzOiBmYWxzZSxcbiAgICAgICAgTmV0d29ya0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBBd3N2cGNDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBBc3NpZ25QdWJsaWNJcDogJ0RJU0FCTEVEJyxcbiAgICAgICAgICAgIFNlY3VyaXR5R3JvdXBzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdGYXJnYXRlU2VydmljZVNlY3VyaXR5R3JvdXAwQTBFNzlDQicsXG4gICAgICAgICAgICAgICAgICAnR3JvdXBJZCcsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBTdWJuZXRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdNeVZwY1ByaXZhdGVTdWJuZXQxU3VibmV0NTA1N0NGN0UnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnTXlWcGNQcml2YXRlU3VibmV0MlN1Ym5ldDAwNDBDOTgzJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICAgIEdyb3VwRGVzY3JpcHRpb246ICdEZWZhdWx0L0ZhcmdhdGVTZXJ2aWNlL1NlY3VyaXR5R3JvdXAnLFxuICAgICAgICBTZWN1cml0eUdyb3VwRWdyZXNzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ2lkcklwOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgICAgIERlc2NyaXB0aW9uOiAnQWxsb3cgYWxsIG91dGJvdW5kIHRyYWZmaWMgYnkgZGVmYXVsdCcsXG4gICAgICAgICAgICBJcFByb3RvY29sOiAnLTEnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZwY0lkOiB7XG4gICAgICAgICAgUmVmOiAnTXlWcGNGOUYwQ0E2RicsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KHNlcnZpY2Uubm9kZS5kZWZhdWx0Q2hpbGQpLnRvQmVEZWZpbmVkKCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gY3JlYXRlIHNlcnZpY2Ugd2l0aCBkZWZhdWx0IHNldHRpbmdzIGlmIFZQQyBvbmx5IGhhcyBwdWJsaWMgc3VibmV0cycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7XG4gICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjaWRyTWFzazogMjgsXG4gICAgICAgICAgICBuYW1lOiAncHVibGljLW9ubHknLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ0ZhcmdhdGVTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOIC0tIGRpZCBub3QgdGhyb3dcbiAgICB9KTtcblxuICAgIHRlc3REZXByZWNhdGVkKCdkb2VzIG5vdCBzZXQgbGF1bmNoVHlwZSB3aGVuIGNhcGFjaXR5IHByb3ZpZGVyIHN0cmF0ZWdpZXMgc3BlY2lmaWVkIChkZXByZWNhdGVkKScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBjYXBhY2l0eVByb3ZpZGVyczogWydGQVJHQVRFJywgJ0ZBUkdBVEVfU1BPVCddLFxuICAgICAgfSk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcblxuICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwMDAgfSk7XG5cbiAgICAgIG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdGYXJnYXRlU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIGNhcGFjaXR5UHJvdmlkZXJTdHJhdGVnaWVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FwYWNpdHlQcm92aWRlcjogJ0ZBUkdBVEVfU1BPVCcsXG4gICAgICAgICAgICB3ZWlnaHQ6IDIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjYXBhY2l0eVByb3ZpZGVyOiAnRkFSR0FURScsXG4gICAgICAgICAgICB3ZWlnaHQ6IDEsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OkNsdXN0ZXInLCB7XG4gICAgICAgIENhcGFjaXR5UHJvdmlkZXJzOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OkNsdXN0ZXJDYXBhY2l0eVByb3ZpZGVyQXNzb2NpYXRpb25zJywge1xuICAgICAgICBDYXBhY2l0eVByb3ZpZGVyczogWydGQVJHQVRFJywgJ0ZBUkdBVEVfU1BPVCddLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgVGFza0RlZmluaXRpb246IHtcbiAgICAgICAgICBSZWY6ICdGYXJnYXRlVGFza0RlZkM2RkI2MEI0JyxcbiAgICAgICAgfSxcbiAgICAgICAgQ2x1c3Rlcjoge1xuICAgICAgICAgIFJlZjogJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcsXG4gICAgICAgIH0sXG4gICAgICAgIERlcGxveW1lbnRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgTWF4aW11bVBlcmNlbnQ6IDIwMCxcbiAgICAgICAgICBNaW5pbXVtSGVhbHRoeVBlcmNlbnQ6IDUwLFxuICAgICAgICB9LFxuICAgICAgICAvLyBubyBsYXVuY2ggdHlwZVxuICAgICAgICBDYXBhY2l0eVByb3ZpZGVyU3RyYXRlZ3k6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBDYXBhY2l0eVByb3ZpZGVyOiAnRkFSR0FURV9TUE9UJyxcbiAgICAgICAgICAgIFdlaWdodDogMixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIENhcGFjaXR5UHJvdmlkZXI6ICdGQVJHQVRFJyxcbiAgICAgICAgICAgIFdlaWdodDogMSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBFbmFibGVFQ1NNYW5hZ2VkVGFnczogZmFsc2UsXG4gICAgICAgIE5ldHdvcmtDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgQXdzdnBjQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgQXNzaWduUHVibGljSXA6ICdESVNBQkxFRCcsXG4gICAgICAgICAgICBTZWN1cml0eUdyb3VwczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnRmFyZ2F0ZVNlcnZpY2VTZWN1cml0eUdyb3VwMEEwRTc5Q0InLFxuICAgICAgICAgICAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgU3VibmV0czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnTXlWcGNQcml2YXRlU3VibmV0MVN1Ym5ldDUwNTdDRjdFJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ015VnBjUHJpdmF0ZVN1Ym5ldDJTdWJuZXQwMDQwQzk4MycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2RvZXMgbm90IHNldCBsYXVuY2hUeXBlIHdoZW4gY2FwYWNpdHkgcHJvdmlkZXIgc3RyYXRlZ2llcyBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7XG4gICAgICAgIHZwYyxcbiAgICAgIH0pO1xuICAgICAgY2x1c3Rlci5lbmFibGVGYXJnYXRlQ2FwYWNpdHlQcm92aWRlcnMoKTtcblxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG5cbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcbiAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDAwIH0pO1xuXG4gICAgICBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnRmFyZ2F0ZVNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBjYXBhY2l0eVByb3ZpZGVyU3RyYXRlZ2llczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhcGFjaXR5UHJvdmlkZXI6ICdGQVJHQVRFX1NQT1QnLFxuICAgICAgICAgICAgd2VpZ2h0OiAyLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FwYWNpdHlQcm92aWRlcjogJ0ZBUkdBVEUnLFxuICAgICAgICAgICAgd2VpZ2h0OiAxLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpDbHVzdGVyJywge1xuICAgICAgICBDYXBhY2l0eVByb3ZpZGVyczogTWF0Y2guYWJzZW50KCksXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpDbHVzdGVyQ2FwYWNpdHlQcm92aWRlckFzc29jaWF0aW9ucycsIHtcbiAgICAgICAgQ2FwYWNpdHlQcm92aWRlcnM6IFsnRkFSR0FURScsICdGQVJHQVRFX1NQT1QnXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICAgIFRhc2tEZWZpbml0aW9uOiB7XG4gICAgICAgICAgUmVmOiAnRmFyZ2F0ZVRhc2tEZWZDNkZCNjBCNCcsXG4gICAgICAgIH0sXG4gICAgICAgIENsdXN0ZXI6IHtcbiAgICAgICAgICBSZWY6ICdFY3NDbHVzdGVyOTcyNDJCODQnLFxuICAgICAgICB9LFxuICAgICAgICBEZXBsb3ltZW50Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIE1heGltdW1QZXJjZW50OiAyMDAsXG4gICAgICAgICAgTWluaW11bUhlYWx0aHlQZXJjZW50OiA1MCxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gbm8gbGF1bmNoIHR5cGVcbiAgICAgICAgTGF1bmNoVHlwZTogTWF0Y2guYWJzZW50KCksXG4gICAgICAgIENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENhcGFjaXR5UHJvdmlkZXI6ICdGQVJHQVRFX1NQT1QnLFxuICAgICAgICAgICAgV2VpZ2h0OiAyLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ2FwYWNpdHlQcm92aWRlcjogJ0ZBUkdBVEUnLFxuICAgICAgICAgICAgV2VpZ2h0OiAxLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIEVuYWJsZUVDU01hbmFnZWRUYWdzOiBmYWxzZSxcbiAgICAgICAgTmV0d29ya0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBBd3N2cGNDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBBc3NpZ25QdWJsaWNJcDogJ0RJU0FCTEVEJyxcbiAgICAgICAgICAgIFNlY3VyaXR5R3JvdXBzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdGYXJnYXRlU2VydmljZVNlY3VyaXR5R3JvdXAwQTBFNzlDQicsXG4gICAgICAgICAgICAgICAgICAnR3JvdXBJZCcsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBTdWJuZXRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdNeVZwY1ByaXZhdGVTdWJuZXQxU3VibmV0NTA1N0NGN0UnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnTXlWcGNQcml2YXRlU3VibmV0MlN1Ym5ldDAwNDBDOTgzJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCBjdXN0b20gY2xvdWRtYXAgbmFtZXNwYWNlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcblxuICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwMDAgfSk7XG5cbiAgICAgIGNvbnN0IGNsb3VkTWFwTmFtZXNwYWNlID0gbmV3IGNsb3VkbWFwLlByaXZhdGVEbnNOYW1lc3BhY2Uoc3RhY2ssICdUZXN0Q2xvdWRNYXBOYW1lc3BhY2UnLCB7XG4gICAgICAgIG5hbWU6ICdzY29yZWtlZXAuY29tJyxcbiAgICAgICAgdnBjLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdGYXJnYXRlU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIGNsb3VkTWFwT3B0aW9uczoge1xuICAgICAgICAgIG5hbWU6ICdteUFwcCcsXG4gICAgICAgICAgZmFpbHVyZVRocmVzaG9sZDogMjAsXG4gICAgICAgICAgY2xvdWRNYXBOYW1lc3BhY2UsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VydmljZURpc2NvdmVyeTo6U2VydmljZScsIHtcbiAgICAgICAgRG5zQ29uZmlnOiB7XG4gICAgICAgICAgRG5zUmVjb3JkczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBUVEw6IDYwLFxuICAgICAgICAgICAgICBUeXBlOiAnQScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgTmFtZXNwYWNlSWQ6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnVGVzdENsb3VkTWFwTmFtZXNwYWNlMUZCOUI0NDYnLFxuICAgICAgICAgICAgICAnSWQnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJvdXRpbmdQb2xpY3k6ICdNVUxUSVZBTFVFJyxcbiAgICAgICAgfSxcbiAgICAgICAgSGVhbHRoQ2hlY2tDdXN0b21Db25maWc6IHtcbiAgICAgICAgICBGYWlsdXJlVGhyZXNob2xkOiAyMCxcbiAgICAgICAgfSxcbiAgICAgICAgTmFtZTogJ215QXBwJyxcbiAgICAgICAgTmFtZXNwYWNlSWQ6IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdUZXN0Q2xvdWRNYXBOYW1lc3BhY2UxRkI5QjQ0NicsXG4gICAgICAgICAgICAnSWQnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VydmljZURpc2NvdmVyeTo6UHJpdmF0ZURuc05hbWVzcGFjZScsIHtcbiAgICAgICAgTmFtZTogJ3Njb3Jla2VlcC5jb20nLFxuICAgICAgICBWcGM6IHtcbiAgICAgICAgICBSZWY6ICdNeVZwY0Y5RjBDQTZGJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCB1c2VyLXByb3ZpZGVkIGNsb3VkbWFwIHNlcnZpY2UnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdGYXJnYXRlVGFza0RlZicpO1xuXG4gICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG4gICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMCB9KTtcblxuICAgICAgY29uc3QgY2xvdWRNYXBOYW1lc3BhY2UgPSBuZXcgY2xvdWRtYXAuUHJpdmF0ZURuc05hbWVzcGFjZShzdGFjaywgJ1Rlc3RDbG91ZE1hcE5hbWVzcGFjZScsIHtcbiAgICAgICAgbmFtZTogJ3Njb3Jla2VlcC5jb20nLFxuICAgICAgICB2cGMsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY2xvdWRNYXBTZXJ2aWNlID0gbmV3IGNsb3VkbWFwLlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICBuYW1lOiAnc2VydmljZS1uYW1lJyxcbiAgICAgICAgbmFtZXNwYWNlOiBjbG91ZE1hcE5hbWVzcGFjZSxcbiAgICAgICAgZG5zUmVjb3JkVHlwZTogY2xvdWRtYXAuRG5zUmVjb3JkVHlwZS5TUlYsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZWNzU2VydmljZSA9IG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdGYXJnYXRlU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgZWNzU2VydmljZS5hc3NvY2lhdGVDbG91ZE1hcFNlcnZpY2Uoe1xuICAgICAgICBzZXJ2aWNlOiBjbG91ZE1hcFNlcnZpY2UsXG4gICAgICAgIGNvbnRhaW5lcjogY29udGFpbmVyLFxuICAgICAgICBjb250YWluZXJQb3J0OiA4MDAwLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgU2VydmljZVJlZ2lzdHJpZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBDb250YWluZXJOYW1lOiAnd2ViJyxcbiAgICAgICAgICAgIENvbnRhaW5lclBvcnQ6IDgwMDAsXG4gICAgICAgICAgICBSZWdpc3RyeUFybjogeyAnRm46OkdldEF0dCc6IFsnU2VydmljZURCQzc5OTA5JywgJ0FybiddIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZXJyb3JzIHdoZW4gbW9yZSB0aGFuIG9uZSBzZXJ2aWNlIHJlZ2lzdHJ5IHVzZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdGYXJnYXRlVGFza0RlZicpO1xuXG4gICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG4gICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMCB9KTtcblxuICAgICAgY29uc3QgY2xvdWRNYXBOYW1lc3BhY2UgPSBuZXcgY2xvdWRtYXAuUHJpdmF0ZURuc05hbWVzcGFjZShzdGFjaywgJ1Rlc3RDbG91ZE1hcE5hbWVzcGFjZScsIHtcbiAgICAgICAgbmFtZTogJ3Njb3Jla2VlcC5jb20nLFxuICAgICAgICB2cGMsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZWNzU2VydmljZSA9IG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdGYXJnYXRlU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICB9KTtcblxuICAgICAgZWNzU2VydmljZS5lbmFibGVDbG91ZE1hcCh7XG4gICAgICAgIGNsb3VkTWFwTmFtZXNwYWNlLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGNsb3VkTWFwU2VydmljZSA9IG5ldyBjbG91ZG1hcC5TZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgbmFtZTogJ3NlcnZpY2UtbmFtZScsXG4gICAgICAgIG5hbWVzcGFjZTogY2xvdWRNYXBOYW1lc3BhY2UsXG4gICAgICAgIGRuc1JlY29yZFR5cGU6IGNsb3VkbWFwLkRuc1JlY29yZFR5cGUuU1JWLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU4gLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBlY3NTZXJ2aWNlLmFzc29jaWF0ZUNsb3VkTWFwU2VydmljZSh7XG4gICAgICAgICAgc2VydmljZTogY2xvdWRNYXBTZXJ2aWNlLFxuICAgICAgICAgIGNvbnRhaW5lcjogY29udGFpbmVyLFxuICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwMDAsXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvYXQgbW9zdCBvbmUgc2VydmljZSByZWdpc3RyeS9pKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggYWxsIHByb3BlcnRpZXMgc2V0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG5cbiAgICAgIGNsdXN0ZXIuYWRkRGVmYXVsdENsb3VkTWFwTmFtZXNwYWNlKHtcbiAgICAgICAgbmFtZTogJ2Zvby5jb20nLFxuICAgICAgICB0eXBlOiBjbG91ZG1hcC5OYW1lc3BhY2VUeXBlLkROU19QUklWQVRFLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdGYXJnYXRlVGFza0RlZicpO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHN2YyA9IG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdGYXJnYXRlU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIGRlc2lyZWRDb3VudDogMixcbiAgICAgICAgYXNzaWduUHVibGljSXA6IHRydWUsXG4gICAgICAgIGNsb3VkTWFwT3B0aW9uczoge1xuICAgICAgICAgIG5hbWU6ICdteWFwcCcsXG4gICAgICAgICAgZG5zUmVjb3JkVHlwZTogY2xvdWRtYXAuRG5zUmVjb3JkVHlwZS5BLFxuICAgICAgICAgIGRuc1R0bDogY2RrLkR1cmF0aW9uLnNlY29uZHMoNTApLFxuICAgICAgICAgIGZhaWx1cmVUaHJlc2hvbGQ6IDIwLFxuICAgICAgICB9LFxuICAgICAgICBoZWFsdGhDaGVja0dyYWNlUGVyaW9kOiBjZGsuRHVyYXRpb24uc2Vjb25kcyg2MCksXG4gICAgICAgIG1heEhlYWx0aHlQZXJjZW50OiAxNTAsXG4gICAgICAgIG1pbkhlYWx0aHlQZXJjZW50OiA1NSxcbiAgICAgICAgZGVwbG95bWVudENvbnRyb2xsZXI6IHtcbiAgICAgICAgICB0eXBlOiBlY3MuRGVwbG95bWVudENvbnRyb2xsZXJUeXBlLkVDUyxcbiAgICAgICAgfSxcbiAgICAgICAgY2lyY3VpdEJyZWFrZXI6IHsgcm9sbGJhY2s6IHRydWUgfSxcbiAgICAgICAgc2VjdXJpdHlHcm91cHM6IFtuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdTZWN1cml0eUdyb3VwMScsIHtcbiAgICAgICAgICBhbGxvd0FsbE91dGJvdW5kOiB0cnVlLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRXhhbXBsZScsXG4gICAgICAgICAgc2VjdXJpdHlHcm91cE5hbWU6ICdCb2InLFxuICAgICAgICAgIHZwYyxcbiAgICAgICAgfSldLFxuICAgICAgICBzZXJ2aWNlTmFtZTogJ2JvbmpvdXInLFxuICAgICAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzdmMuY2xvdWRNYXBTZXJ2aWNlKS50b0JlRGVmaW5lZCgpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICAgIFRhc2tEZWZpbml0aW9uOiB7XG4gICAgICAgICAgUmVmOiAnRmFyZ2F0ZVRhc2tEZWZDNkZCNjBCNCcsXG4gICAgICAgIH0sXG4gICAgICAgIENsdXN0ZXI6IHtcbiAgICAgICAgICBSZWY6ICdFY3NDbHVzdGVyOTcyNDJCODQnLFxuICAgICAgICB9LFxuICAgICAgICBEZXBsb3ltZW50Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIE1heGltdW1QZXJjZW50OiAxNTAsXG4gICAgICAgICAgTWluaW11bUhlYWx0aHlQZXJjZW50OiA1NSxcbiAgICAgICAgICBEZXBsb3ltZW50Q2lyY3VpdEJyZWFrZXI6IHtcbiAgICAgICAgICAgIEVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIFJvbGxiYWNrOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIERlcGxveW1lbnRDb250cm9sbGVyOiB7XG4gICAgICAgICAgVHlwZTogZWNzLkRlcGxveW1lbnRDb250cm9sbGVyVHlwZS5FQ1MsXG4gICAgICAgIH0sXG4gICAgICAgIERlc2lyZWRDb3VudDogMixcbiAgICAgICAgSGVhbHRoQ2hlY2tHcmFjZVBlcmlvZFNlY29uZHM6IDYwLFxuICAgICAgICBMYXVuY2hUeXBlOiBMYXVuY2hUeXBlLkZBUkdBVEUsXG4gICAgICAgIE5ldHdvcmtDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgQXdzdnBjQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgQXNzaWduUHVibGljSXA6ICdFTkFCTEVEJyxcbiAgICAgICAgICAgIFNlY3VyaXR5R3JvdXBzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdTZWN1cml0eUdyb3VwMUY1NTRCMzZGJyxcbiAgICAgICAgICAgICAgICAgICdHcm91cElkJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFN1Ym5ldHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ015VnBjUHVibGljU3VibmV0MVN1Ym5ldEY2NjA4NDU2JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ015VnBjUHVibGljU3VibmV0MlN1Ym5ldDQ5MkI2QkZCJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgU2VydmljZU5hbWU6ICdib25qb3VyJyxcbiAgICAgICAgU2VydmljZVJlZ2lzdHJpZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWdpc3RyeUFybjoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnRmFyZ2F0ZVNlcnZpY2VDbG91ZG1hcFNlcnZpY2U5NTQ0Qjc1MycsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyB3aGVuIHRhc2sgZGVmaW5pdGlvbiBpcyBub3QgRmFyZ2F0ZSBjb21wYXRpYmxlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5UYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnLCB7XG4gICAgICAgIGNvbXBhdGliaWxpdHk6IGVjcy5Db21wYXRpYmlsaXR5LkVDMixcbiAgICAgIH0pO1xuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdCYXNlQ29udGFpbmVyJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICBtZW1vcnlSZXNlcnZhdGlvbk1pQjogMTAsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ0ZhcmdhdGVTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvU3VwcGxpZWQgVGFza0RlZmluaXRpb24gaXMgbm90IGNvbmZpZ3VyZWQgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBGYXJnYXRlLyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIHdoaXRoIHNlY3JldCBqc29uIGZpZWxkIG9uIHVuc3VwcG9ydGVkIHBsYXRmb3JtIHZlcnNpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rha3NEZWYnKTtcbiAgICAgIGNvbnN0IHNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQoc3RhY2ssICdTZWNyZXQnKTtcbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignQmFzZUNvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgc2VjcmV0czoge1xuICAgICAgICAgIFNFQ1JFVF9LRVk6IGVjcy5TZWNyZXQuZnJvbVNlY3JldHNNYW5hZ2VyKHNlY3JldCwgJ3NwZWNpZmljS2V5JyksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gRXJyb3JzIG9uIHZhbGlkYXRpb24sIG5vdCBvbiBjb25zdHJ1Y3Rpb24uXG4gICAgICBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnRmFyZ2F0ZVNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBwbGF0Zm9ybVZlcnNpb246IGVjcy5GYXJnYXRlUGxhdGZvcm1WZXJzaW9uLlZFUlNJT04xXzMsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIH0pLnRvVGhyb3cobmV3IFJlZ0V4cChgdXNlcyBhdCBsZWFzdCBvbmUgY29udGFpbmVyIHRoYXQgcmVmZXJlbmNlcyBhIHNlY3JldCBKU09OIGZpZWxkLitwbGF0Zm9ybSB2ZXJzaW9uICR7ZWNzLkZhcmdhdGVQbGF0Zm9ybVZlcnNpb24uVkVSU0lPTjFfNH0gb3IgbGF0ZXJgKSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpZ25vcmUgdGFzayBkZWZpbml0aW9uIGFuZCBsYXVuY2ggdHlwZSBpZiBkZXBsb3ltZW50IGNvbnRyb2xsZXIgaXMgc2V0IHRvIGJlIEVYVEVSTkFMJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcblxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnRmFyZ2F0ZVNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBkZXBsb3ltZW50Q29udHJvbGxlcjoge1xuICAgICAgICAgIHR5cGU6IERlcGxveW1lbnRDb250cm9sbGVyVHlwZS5FWFRFUk5BTCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBBbm5vdGF0aW9ucy5mcm9tU3RhY2soc3RhY2spLmhhc1dhcm5pbmcoJy9EZWZhdWx0L0ZhcmdhdGVTZXJ2aWNlJywgJ3Rhc2tEZWZpbml0aW9uIGFuZCBsYXVuY2hUeXBlIGFyZSBibGFua2VkIG91dCB3aGVuIHVzaW5nIGV4dGVybmFsIGRlcGxveW1lbnQgY29udHJvbGxlci4nKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgQ2x1c3Rlcjoge1xuICAgICAgICAgIFJlZjogJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcsXG4gICAgICAgIH0sXG4gICAgICAgIERlcGxveW1lbnRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgTWF4aW11bVBlcmNlbnQ6IDIwMCxcbiAgICAgICAgICBNaW5pbXVtSGVhbHRoeVBlcmNlbnQ6IDUwLFxuICAgICAgICB9LFxuICAgICAgICBEZXBsb3ltZW50Q29udHJvbGxlcjoge1xuICAgICAgICAgIFR5cGU6ICdFWFRFUk5BTCcsXG4gICAgICAgIH0sXG4gICAgICAgIEVuYWJsZUVDU01hbmFnZWRUYWdzOiBmYWxzZSxcbiAgICAgICAgTmV0d29ya0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBBd3N2cGNDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBBc3NpZ25QdWJsaWNJcDogJ0RJU0FCTEVEJyxcbiAgICAgICAgICAgIFNlY3VyaXR5R3JvdXBzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdGYXJnYXRlU2VydmljZVNlY3VyaXR5R3JvdXAwQTBFNzlDQicsXG4gICAgICAgICAgICAgICAgICAnR3JvdXBJZCcsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBTdWJuZXRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdNeVZwY1ByaXZhdGVTdWJuZXQxU3VibmV0NTA1N0NGN0UnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnTXlWcGNQcml2YXRlU3VibmV0MlN1Ym5ldDAwNDBDOTgzJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG5cbiAgICB0ZXN0KCdhZGQgd2FybmluZyB0byBhbm5vdGF0aW9ucyBpZiBjaXJjdWl0QnJlYWtlciBpcyBzcGVjaWZpZWQgd2l0aCBhIG5vbi1FQ1MgRGVwbG95bWVudENvbnRyb2xsZXJUeXBlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcblxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ0ZhcmdhdGVTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgZGVwbG95bWVudENvbnRyb2xsZXI6IHtcbiAgICAgICAgICB0eXBlOiBEZXBsb3ltZW50Q29udHJvbGxlclR5cGUuRVhURVJOQUwsXG4gICAgICAgIH0sXG4gICAgICAgIGNpcmN1aXRCcmVha2VyOiB7IHJvbGxiYWNrOiB0cnVlIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHNlcnZpY2Uubm9kZS5tZXRhZGF0YVswXS5kYXRhKS50b0VxdWFsKCd0YXNrRGVmaW5pdGlvbiBhbmQgbGF1bmNoVHlwZSBhcmUgYmxhbmtlZCBvdXQgd2hlbiB1c2luZyBleHRlcm5hbCBkZXBsb3ltZW50IGNvbnRyb2xsZXIuJyk7XG4gICAgICBleHBlY3Qoc2VydmljZS5ub2RlLm1ldGFkYXRhWzFdLmRhdGEpLnRvRXF1YWwoJ0RlcGxveW1lbnQgY2lyY3VpdCBicmVha2VyIHJlcXVpcmVzIHRoZSBFQ1MgZGVwbG95bWVudCBjb250cm9sbGVyLicpO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdlcnJvcnMgd2hlbiBubyBjb250YWluZXIgc3BlY2lmaWVkIG9uIHRhc2sgZGVmaW5pdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG5cbiAgICAgIC8vIEVycm9ycyBvbiB2YWxpZGF0aW9uLCBub3Qgb24gY29uc3RydWN0aW9uLlxuICAgICAgbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ0ZhcmdhdGVTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgfSkudG9UaHJvdygvb25lIGVzc2VudGlhbCBjb250YWluZXIvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FsbG93cyBhZGRpbmcgdGhlIGRlZmF1bHQgY29udGFpbmVyIGFmdGVyIGNyZWF0aW5nIHRoZSBzZXJ2aWNlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcblxuICAgICAgbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ0ZhcmdhdGVTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgIH0pO1xuXG4gICAgICAvLyBBZGQgdGhlIGNvbnRhaW5lciAqYWZ0ZXIqIGNyZWF0aW5nIHRoZSBzZXJ2aWNlXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ21haW4nLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdzb21lY29udGFpbmVyJyksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgIE5hbWU6ICdtYWluJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWxsb3dzIHNwZWNpZnlpbmcgYXNzaWduUHVibGljSVAgYXMgZW5hYmxlZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICB9KTtcblxuICAgICAgbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ0ZhcmdhdGVTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgYXNzaWduUHVibGljSXA6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICBOZXR3b3JrQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIEF3c3ZwY0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIEFzc2lnblB1YmxpY0lwOiAnRU5BQkxFRCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWxsb3dzIHNwZWNpZnlpbmcgMCBmb3IgbWluaW11bUhlYWx0aHlQZXJjZW50JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcblxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnRmFyZ2F0ZVNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBhc3NpZ25QdWJsaWNJcDogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICAgIE5ldHdvcmtDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgQXdzdnBjQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgQXNzaWduUHVibGljSXA6ICdFTkFCTEVEJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdzZXRzIHRhc2sgZGVmaW5pdGlvbiB0byBmYW1pbHkgd2hlbiBDT0RFX0RFUExPWSBkZXBsb3ltZW50IGNvbnRyb2xsZXIgaXMgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcblxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnRmFyZ2F0ZVNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBkZXBsb3ltZW50Q29udHJvbGxlcjoge1xuICAgICAgICAgIHR5cGU6IGVjcy5EZXBsb3ltZW50Q29udHJvbGxlclR5cGUuQ09ERV9ERVBMT1ksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICBUYXNrRGVmaW5pdGlvbjogJ0ZhcmdhdGVUYXNrRGVmJyxcbiAgICAgICAgICBEZXBsb3ltZW50Q29udHJvbGxlcjoge1xuICAgICAgICAgICAgVHlwZTogJ0NPREVfREVQTE9ZJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBEZXBlbmRzT246IFtcbiAgICAgICAgICAnRmFyZ2F0ZVRhc2tEZWZDNkZCNjBCNCcsXG4gICAgICAgICAgJ0ZhcmdhdGVUYXNrRGVmVGFza1JvbGUwQjI1NzU1MicsXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3REZXByZWNhdGVkKCd0aHJvd3Mgd2hlbiBzZWN1cml0eUdyb3VwIGFuZCBzZWN1cml0eUdyb3VwcyBhcmUgc3VwcGxpZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdGYXJnYXRlVGFza0RlZicpO1xuICAgICAgY29uc3Qgc2VjdXJpdHlHcm91cDEgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdTZWN1cml0eUdyb3VwMScsIHtcbiAgICAgICAgYWxsb3dBbGxPdXRib3VuZDogdHJ1ZSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdFeGFtcGxlJyxcbiAgICAgICAgc2VjdXJpdHlHcm91cE5hbWU6ICdCaW5nbycsXG4gICAgICAgIHZwYyxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc2VjdXJpdHlHcm91cDIgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdTZWN1cml0eUdyb3VwMicsIHtcbiAgICAgICAgYWxsb3dBbGxPdXRib3VuZDogZmFsc2UsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnRXhhbXBsZScsXG4gICAgICAgIHNlY3VyaXR5R3JvdXBOYW1lOiAnUm9sbHknLFxuICAgICAgICB2cGMsXG4gICAgICB9KTtcblxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnRmFyZ2F0ZVNlcnZpY2UnLCB7XG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgICBzZWN1cml0eUdyb3VwOiBzZWN1cml0eUdyb3VwMSxcbiAgICAgICAgICBzZWN1cml0eUdyb3VwczogW3NlY3VyaXR5R3JvdXAyXSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9Pbmx5IG9uZSBvZiBTZWN1cml0eUdyb3VwIG9yIFNlY3VyaXR5R3JvdXBzIGNhbiBiZSBwb3B1bGF0ZWQuLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIG11bHRpcGxlIHNlY3VydHkgZ3JvdXBzLCBpdCBjb3JyZWN0bHkgdXBkYXRlcyBjbG91ZGZvcm1hdGlvbiB0ZW1wbGF0ZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG4gICAgICBjb25zdCBzZWN1cml0eUdyb3VwMSA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cChzdGFjaywgJ1NlY3VyaXR5R3JvdXAxJywge1xuICAgICAgICBhbGxvd0FsbE91dGJvdW5kOiB0cnVlLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0V4YW1wbGUnLFxuICAgICAgICBzZWN1cml0eUdyb3VwTmFtZTogJ0JpbmdvJyxcbiAgICAgICAgdnBjLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBzZWN1cml0eUdyb3VwMiA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cChzdGFjaywgJ1NlY3VyaXR5R3JvdXAyJywge1xuICAgICAgICBhbGxvd0FsbE91dGJvdW5kOiBmYWxzZSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdFeGFtcGxlJyxcbiAgICAgICAgc2VjdXJpdHlHcm91cE5hbWU6ICdSb2xseScsXG4gICAgICAgIHZwYyxcbiAgICAgIH0pO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdGYXJnYXRlU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIHNlY3VyaXR5R3JvdXBzOiBbc2VjdXJpdHlHcm91cDEsIHNlY3VyaXR5R3JvdXAyXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICAgIFRhc2tEZWZpbml0aW9uOiB7XG4gICAgICAgICAgUmVmOiAnRmFyZ2F0ZVRhc2tEZWZDNkZCNjBCNCcsXG4gICAgICAgIH0sXG4gICAgICAgIENsdXN0ZXI6IHtcbiAgICAgICAgICBSZWY6ICdFY3NDbHVzdGVyOTcyNDJCODQnLFxuICAgICAgICB9LFxuICAgICAgICBEZXBsb3ltZW50Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIE1heGltdW1QZXJjZW50OiAyMDAsXG4gICAgICAgICAgTWluaW11bUhlYWx0aHlQZXJjZW50OiA1MCxcbiAgICAgICAgfSxcbiAgICAgICAgTGF1bmNoVHlwZTogTGF1bmNoVHlwZS5GQVJHQVRFLFxuICAgICAgICBFbmFibGVFQ1NNYW5hZ2VkVGFnczogZmFsc2UsXG4gICAgICAgIE5ldHdvcmtDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgQXdzdnBjQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgQXNzaWduUHVibGljSXA6ICdESVNBQkxFRCcsXG4gICAgICAgICAgICBTZWN1cml0eUdyb3VwczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnU2VjdXJpdHlHcm91cDFGNTU0QjM2RicsXG4gICAgICAgICAgICAgICAgICAnR3JvdXBJZCcsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ1NlY3VyaXR5R3JvdXAyM0JFODZCQjcnLFxuICAgICAgICAgICAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgU3VibmV0czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnTXlWcGNQcml2YXRlU3VibmV0MVN1Ym5ldDUwNTdDRjdFJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ015VnBjUHJpdmF0ZVN1Ym5ldDJTdWJuZXQwMDQwQzk4MycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJywge1xuICAgICAgICBHcm91cERlc2NyaXB0aW9uOiAnRXhhbXBsZScsXG4gICAgICAgIEdyb3VwTmFtZTogJ0JpbmdvJyxcbiAgICAgICAgU2VjdXJpdHlHcm91cEVncmVzczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENpZHJJcDogJzAuMC4wLjAvMCcsXG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogJ0FsbG93IGFsbCBvdXRib3VuZCB0cmFmZmljIGJ5IGRlZmF1bHQnLFxuICAgICAgICAgICAgSXBQcm90b2NvbDogJy0xJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWcGNJZDoge1xuICAgICAgICAgIFJlZjogJ015VnBjRjlGMENBNkYnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cCcsIHtcbiAgICAgICAgR3JvdXBEZXNjcmlwdGlvbjogJ0V4YW1wbGUnLFxuICAgICAgICBHcm91cE5hbWU6ICdSb2xseScsXG4gICAgICAgIFNlY3VyaXR5R3JvdXBFZ3Jlc3M6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBDaWRySXA6ICcyNTUuMjU1LjI1NS4yNTUvMzInLFxuICAgICAgICAgICAgRGVzY3JpcHRpb246ICdEaXNhbGxvdyBhbGwgdHJhZmZpYycsXG4gICAgICAgICAgICBGcm9tUG9ydDogMjUyLFxuICAgICAgICAgICAgSXBQcm90b2NvbDogJ2ljbXAnLFxuICAgICAgICAgICAgVG9Qb3J0OiA4NixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWcGNJZDoge1xuICAgICAgICAgIFJlZjogJ015VnBjRjlGMENBNkYnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIGVuYWJsaW5nIHNlcnZpY2UgY29ubmVjdCcsICgpID0+IHtcbiAgICBkZXNjcmliZSgnd2hlbiB2YWxpZGF0aW5nIHNlcnZpY2UgY29ubmVjdCBjb25maWd1cmF0aW9ucycsICgpID0+IHtcblxuICAgICAgbGV0IHNlcnZpY2U6IGVjcy5GYXJnYXRlU2VydmljZTtcblxuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcblxuICAgICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlcnZpY2UgPSBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnRmFyZ2F0ZVNlcnZpY2UnLCB7XG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgndGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiBzZXJ2aWNlY29ubmVjdHNlcnZpY2UucG9ydCBpcyBhIHN0cmluZyBhbmQgaXQgZG9lcyBub3QgZXhpc3RzIG9uIHRoZSB0YXNrIGRlZmluaXRpb24nLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IGNvbmZpZzogU2VydmljZUNvbm5lY3RQcm9wcyA9IHtcbiAgICAgICAgICBzZXJ2aWNlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBwb3J0TWFwcGluZ05hbWU6ICcxMDAnLFxuICAgICAgICAgICAgICBkbnNOYW1lOiAnYmFja2VuZC5wcm9kJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBuYW1lc3BhY2U6ICd0ZXN0IG5hbWVzcGFjZScsXG4gICAgICAgIH07XG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgc2VydmljZS5lbmFibGVTZXJ2aWNlQ29ubmVjdChjb25maWcpO1xuICAgICAgICB9KS50b1Rocm93RXJyb3IoL1BvcnQgTWFwcGluZyAnMTAwJyBkb2VzIG5vdCBleGlzdCBvbiB0aGUgdGFzayBkZWZpbml0aW9uLi8pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3Rocm93cyBhbiBleGNlcHRpb24gd2hlbiBhZGRpbmcgbXVsdGlwbGUgc2VydmljZXMgd2l0aG91dCBkaWZmZXJlbnQgZGlzY292ZXJ5IG5hbWVzJywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBzZXJ2aWNlLnRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignbW9iaWxlJywge1xuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgICBwb3J0TWFwcGluZ3M6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY29udGFpbmVyUG9ydDogMTAwLFxuICAgICAgICAgICAgICBuYW1lOiAnYWJjJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGNvbmZpZzogU2VydmljZUNvbm5lY3RQcm9wcyA9IHtcbiAgICAgICAgICBzZXJ2aWNlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBwb3J0TWFwcGluZ05hbWU6ICdhYmMnLFxuICAgICAgICAgICAgICBkbnNOYW1lOiAnYmFja2VuZC5wcm9kJyxcbiAgICAgICAgICAgICAgcG9ydDogNTAwNSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHBvcnRNYXBwaW5nTmFtZTogJ2FiYycsXG4gICAgICAgICAgICAgIGRuc05hbWU6ICdiYWNrZW5kLnByb2QubG9jYWwnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIG5hbWVzcGFjZTogJ3Rlc3QgbmFtZXNwYWNlJyxcbiAgICAgICAgfTtcbiAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICBzZXJ2aWNlLmVuYWJsZVNlcnZpY2VDb25uZWN0KGNvbmZpZyk7XG4gICAgICAgIH0pLnRvVGhyb3dFcnJvcigvQ2Fubm90IGNyZWF0ZSBtdWx0aXBsZSBzZXJ2aWNlcyB3aXRoIHRoZSBkaXNjb3ZlcnlOYW1lICdhYmMnLi8pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3Rocm93cyBhbiBleGNlcHRpb24gaWYgaW5ncmVzc1BvcnRPdmVycmlkZSBpcyBub3QgdmFsaWQuJywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBzZXJ2aWNlLnRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignbW9iaWxlJywge1xuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgICBwb3J0TWFwcGluZ3M6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY29udGFpbmVyUG9ydDogMTAwLFxuICAgICAgICAgICAgICBuYW1lOiAnMTAwJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGNvbmZpZzogU2VydmljZUNvbm5lY3RQcm9wcyA9IHtcbiAgICAgICAgICBzZXJ2aWNlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBwb3J0TWFwcGluZ05hbWU6ICcxMDAnLFxuICAgICAgICAgICAgICBkbnNOYW1lOiAnYmFja2VuZC5wcm9kJyxcbiAgICAgICAgICAgICAgcG9ydDogNTAwNSxcbiAgICAgICAgICAgICAgaW5ncmVzc1BvcnRPdmVycmlkZTogMTAwMDAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIG5hbWVzcGFjZTogJ3Rlc3QgbmFtZXNwYWNlJyxcbiAgICAgICAgfTtcbiAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICBzZXJ2aWNlLmVuYWJsZVNlcnZpY2VDb25uZWN0KGNvbmZpZyk7XG4gICAgICAgIH0pLnRvVGhyb3dFcnJvcigvaW5ncmVzc1BvcnRPdmVycmlkZSAxMDAwMDAgaXMgbm90IHZhbGlkLi8pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3Rocm93cyBhbiBleGNlcHRpb24gaWYgQ2xpZW50IEFsaWFzIHBvcnQgaXMgbm90IHZhbGlkJywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBzZXJ2aWNlLnRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignbW9iaWxlJywge1xuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgICBwb3J0TWFwcGluZ3M6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY29udGFpbmVyUG9ydDogMTAwLFxuICAgICAgICAgICAgICBuYW1lOiAnMTAwJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGNvbmZpZzogU2VydmljZUNvbm5lY3RQcm9wcyA9IHtcbiAgICAgICAgICBzZXJ2aWNlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBwb3J0TWFwcGluZ05hbWU6ICcxMDAnLFxuICAgICAgICAgICAgICBkbnNOYW1lOiAnYmFja2VuZC5wcm9kJyxcbiAgICAgICAgICAgICAgcG9ydDogMTAwMDAwLFxuICAgICAgICAgICAgICBpbmdyZXNzUG9ydE92ZXJyaWRlOiAzMDAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIG5hbWVzcGFjZTogJ3Rlc3QgbmFtZXNwYWNlJyxcbiAgICAgICAgfTtcbiAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICBzZXJ2aWNlLmVuYWJsZVNlcnZpY2VDb25uZWN0KGNvbmZpZyk7XG4gICAgICAgIH0pLnRvVGhyb3dFcnJvcigvQ2xpZW50IEFsaWFzIHBvcnQgMTAwMDAwIGlzIG5vdCB2YWxpZC4vKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3doZW4gY3JlYXRpbmcgYSBGYXJnYXRlU2VydmljZSB3aXRoIHNlcnZpY2UgY29ubmVjdCcsICgpID0+IHtcblxuICAgICAgbGV0IHNlcnZpY2U6IGVjcy5GYXJnYXRlU2VydmljZTtcbiAgICAgIGxldCBzdGFjazogY2RrLlN0YWNrO1xuICAgICAgbGV0IGNsdXN0ZXI6IGVjcy5DbHVzdGVyO1xuXG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICAgIGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdGYXJnYXRlVGFza0RlZicpO1xuXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgICBwb3J0TWFwcGluZ3M6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY29udGFpbmVyUG9ydDogODAsXG4gICAgICAgICAgICAgIG5hbWU6ICdhcGknLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcblxuICAgICAgICBzZXJ2aWNlID0gbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ0ZhcmdhdGVTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3NlcnZpY2UgY29ubmVjdCBjYW5ub3QgYmUgZW5hYmxlZCB0d2ljZScsICgpID0+IHtcbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7XG4gICAgICAgICAgbmFtZTogJ2Nvb2wnLFxuICAgICAgICB9KTtcbiAgICAgICAgc2VydmljZS5lbmFibGVTZXJ2aWNlQ29ubmVjdCgpO1xuXG4gICAgICAgIC8vIFRIRU5cblxuICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgIHNlcnZpY2UuZW5hYmxlU2VydmljZUNvbm5lY3Qoe30pO1xuICAgICAgICB9KS50b1Rocm93KCdTZXJ2aWNlIGNvbm5lY3QgY29uZmlndXJhdGlvbiBjYW5ub3QgYmUgc3BlY2lmaWVkIG1vcmUgdGhhbiBvbmNlLicpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2NsaWVudCBhbGlhcyBwb3J0IGlzIGRlZmF1bHRlZCB0byBjb250YWluZXJwb3J0JywgKCkgPT4ge1xuICAgICAgICBzZXJ2aWNlLmVuYWJsZVNlcnZpY2VDb25uZWN0KHtcbiAgICAgICAgICBuYW1lc3BhY2U6ICdjb29sJyxcbiAgICAgICAgICBzZXJ2aWNlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBwb3J0TWFwcGluZ05hbWU6ICdhcGknLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgICBTZXJ2aWNlQ29ubmVjdENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIEVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBOYW1lc3BhY2U6ICdjb29sJyxcbiAgICAgICAgICAgIFNlcnZpY2VzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBQb3J0TmFtZTogJ2FwaScsXG4gICAgICAgICAgICAgICAgQ2xpZW50QWxpYXNlczogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBQb3J0OiA4MCxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnd2l0aCBleHBsaWNpdCBlbmFibGUnLCAoKSA9PiB7XG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgY2x1c3Rlci5hZGREZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2Uoe1xuICAgICAgICAgIG5hbWU6ICdjb29sJyxcbiAgICAgICAgfSk7XG4gICAgICAgIHNlcnZpY2UuZW5hYmxlU2VydmljZUNvbm5lY3Qoe30pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICAgIFNlcnZpY2VDb25uZWN0Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIE5hbWVzcGFjZTogJ2Nvb2wnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3dpdGggZXhwbGljaXQgZW5hYmxlIGFuZCBubyBwcm9wcycsICgpID0+IHtcbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7XG4gICAgICAgICAgbmFtZTogJ2Nvb2wnLFxuICAgICAgICB9KTtcbiAgICAgICAgc2VydmljZS5lbmFibGVTZXJ2aWNlQ29ubmVjdCgpO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICAgIFNlcnZpY2VDb25uZWN0Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIE5hbWVzcGFjZTogJ2Nvb2wnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2V4cGxpY2l0IGVuYWJsZSBhbmQgbm9uIGRlZmF1bHQgbmFtZXNwYWNlJywgKCkgPT4ge1xuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGNvbnN0IG5zID0gbmV3IGNsb3VkbWFwLkh0dHBOYW1lc3BhY2Uoc3RhY2ssICducycsIHtcbiAgICAgICAgICBuYW1lOiAnY29vbCcsXG4gICAgICAgIH0pO1xuICAgICAgICBzZXJ2aWNlLmVuYWJsZVNlcnZpY2VDb25uZWN0KHtcbiAgICAgICAgICBuYW1lc3BhY2U6IG5zLm5hbWVzcGFjZU5hbWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICAgIFNlcnZpY2VDb25uZWN0Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIE5hbWVzcGFjZTogJ2Nvb2wnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ25hbWVzcGFjZSBpbmZlcnJlZCBmcm9tIGNsdXN0ZXInLCAoKSA9PiB7XG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgY2x1c3Rlci5hZGREZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2Uoe1xuICAgICAgICAgIG5hbWU6ICdjb29sJyxcbiAgICAgICAgfSk7XG4gICAgICAgIHNlcnZpY2UuZW5hYmxlU2VydmljZUNvbm5lY3Qoe30pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICAgIFNlcnZpY2VDb25uZWN0Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIE5hbWVzcGFjZTogJ2Nvb2wnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ25hbWVzcGFjZSBpbmZlcnJlZCBmcm9tIGNsdXN0ZXI7IGVtcHR5IHByb3BzJywgKCkgPT4ge1xuICAgICAgICBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7XG4gICAgICAgICAgbmFtZTogJ2Nvb2wnLFxuICAgICAgICB9KTtcbiAgICAgICAgc2VydmljZS5lbmFibGVTZXJ2aWNlQ29ubmVjdCgpO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICAgIFNlcnZpY2VDb25uZWN0Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIE5hbWVzcGFjZTogJ2Nvb2wnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ25vIG5hbWVzcGFjZSBlcnJvcnMgb3V0JywgKCkgPT4ge1xuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgc2VydmljZS5lbmFibGVTZXJ2aWNlQ29ubmVjdCh7fSk7XG4gICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdlcnJvciB3aGVuIGVuYWJsaW5nIHNlcnZpY2UgY29ubmVjdCB3aXRoIG5vIGNvbnRhaW5lcicsICgpID0+IHtcbiAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ3RkMicpO1xuICAgICAgICBjb25zdCBzdmMgPSBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnc3ZjMicsIHtcbiAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICBzdmMuZW5hYmxlU2VydmljZUNvbm5lY3Qoe1xuICAgICAgICAgICAgbG9nRHJpdmVyOiBlY3MuTG9nRHJpdmVycy5hd3NMb2dzKHtcbiAgICAgICAgICAgICAgc3RyZWFtUHJlZml4OiAnc2MnLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pLnRvVGhyb3coJ1Rhc2sgZGVmaW5pdGlvbiBtdXN0IGhhdmUgYXQgbGVhc3Qgb25lIGNvbnRhaW5lciB0byBlbmFibGUgc2VydmljZSBjb25uZWN0LicpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3dpdGggYWxsIG9wdGlvbnMgZXhlcmNpc2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBXSEVOXG4gICAgICAgIG5ldyBjbG91ZG1hcC5IdHRwTmFtZXNwYWNlKHN0YWNrLCAnaHR0cG5hbWVzcGFjZScsIHtcbiAgICAgICAgICBuYW1lOiAnY29vbCcsXG4gICAgICAgIH0pO1xuICAgICAgICBzZXJ2aWNlLmVuYWJsZVNlcnZpY2VDb25uZWN0KHtcbiAgICAgICAgICBzZXJ2aWNlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBwb3J0TWFwcGluZ05hbWU6ICdhcGknLFxuICAgICAgICAgICAgICBkaXNjb3ZlcnlOYW1lOiAnc3ZjJyxcbiAgICAgICAgICAgICAgaW5ncmVzc1BvcnRPdmVycmlkZTogMTAwMCxcbiAgICAgICAgICAgICAgcG9ydDogODAsXG4gICAgICAgICAgICAgIGRuc05hbWU6ICdhcGknLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIG5hbWVzcGFjZTogJ2Nvb2wnLFxuICAgICAgICAgIGxvZ0RyaXZlcjogZWNzLkxvZ0RyaXZlcnMuYXdzTG9ncyh7XG4gICAgICAgICAgICBzdHJlYW1QcmVmaXg6ICdzYycsXG4gICAgICAgICAgfSksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgICBTZXJ2aWNlQ29ubmVjdENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIEVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBOYW1lc3BhY2U6ICdjb29sJyxcbiAgICAgICAgICAgIFNlcnZpY2VzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBQb3J0TmFtZTogJ2FwaScsXG4gICAgICAgICAgICAgICAgSW5ncmVzc1BvcnRPdmVycmlkZTogMTAwMCxcbiAgICAgICAgICAgICAgICBEaXNjb3ZlcnlOYW1lOiAnc3ZjJyxcbiAgICAgICAgICAgICAgICBDbGllbnRBbGlhc2VzOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFBvcnQ6IDgwLFxuICAgICAgICAgICAgICAgICAgICBEbnNOYW1lOiAnYXBpJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBMb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgIExvZ0RyaXZlcjogJ2F3c2xvZ3MnLFxuICAgICAgICAgICAgICBPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgJ2F3c2xvZ3Mtc3RyZWFtLXByZWZpeCc6ICdzYycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3dpdGggbm8gYWxpYXMgbmFtZScsICgpID0+IHtcbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7XG4gICAgICAgICAgbmFtZTogJ2Nvb2wnLFxuICAgICAgICB9KTtcbiAgICAgICAgc2VydmljZS5lbmFibGVTZXJ2aWNlQ29ubmVjdCh7XG4gICAgICAgICAgc2VydmljZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcG9ydE1hcHBpbmdOYW1lOiAnYXBpJyxcbiAgICAgICAgICAgICAgcG9ydDogODAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICAgIFNlcnZpY2VDb25uZWN0Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIE5hbWVzcGFjZTogJ2Nvb2wnLFxuICAgICAgICAgICAgU2VydmljZXM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFBvcnROYW1lOiAnYXBpJyxcbiAgICAgICAgICAgICAgICBDbGllbnRBbGlhc2VzOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFBvcnQ6IDgwLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCd3aXRoIG5vIGFsaWFzIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7XG4gICAgICAgICAgbmFtZTogJ2Nvb2wnLFxuICAgICAgICB9KTtcbiAgICAgICAgc2VydmljZS5lbmFibGVTZXJ2aWNlQ29ubmVjdCh7XG4gICAgICAgICAgc2VydmljZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcG9ydE1hcHBpbmdOYW1lOiAnYXBpJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICAgICAgU2VydmljZUNvbm5lY3RDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBFbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgTmFtZXNwYWNlOiAnY29vbCcsXG4gICAgICAgICAgICBTZXJ2aWNlczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUG9ydE5hbWU6ICdhcGknLFxuICAgICAgICAgICAgICAgIENsaWVudEFsaWFzZXM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUG9ydDogODAsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdXaGVuIHNldHRpbmcgdXAgYSBoZWFsdGggY2hlY2snLCAoKSA9PiB7XG4gICAgdGVzdCgnZ3JhY2UgcGVyaW9kIGlzIHJlc3BlY3RlZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ01haW5Db250YWluZXInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZWxsbycpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTdmMnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBoZWFsdGhDaGVja0dyYWNlUGVyaW9kOiBjZGsuRHVyYXRpb24uc2Vjb25kcygxMCksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICBIZWFsdGhDaGVja0dyYWNlUGVyaW9kU2Vjb25kczogMTAsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1doZW4gYWRkaW5nIGFuIGFwcCBsb2FkIGJhbGFuY2VyJywgKCkgPT4ge1xuICAgIHRlc3QoJ2FsbG93cyBhdXRvIHNjYWxpbmcgYnkgQUxCIHJlcXVlc3QgcGVyIHRhcmdldCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ01haW5Db250YWluZXInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZWxsbycpLFxuICAgICAgfSk7XG4gICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMCB9KTtcbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHsgY2x1c3RlciwgdGFza0RlZmluaXRpb24gfSk7XG5cbiAgICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnbGInLCB7IHZwYyB9KTtcbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gbGIuYWRkTGlzdGVuZXIoJ2xpc3RlbmVyJywgeyBwb3J0OiA4MCB9KTtcbiAgICAgIGNvbnN0IHRhcmdldEdyb3VwID0gbGlzdGVuZXIuYWRkVGFyZ2V0cygndGFyZ2V0Jywge1xuICAgICAgICBwb3J0OiA4MCxcbiAgICAgICAgdGFyZ2V0czogW3NlcnZpY2VdLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGNhcGFjaXR5ID0gc2VydmljZS5hdXRvU2NhbGVUYXNrQ291bnQoeyBtYXhDYXBhY2l0eTogMTAsIG1pbkNhcGFjaXR5OiAxIH0pO1xuICAgICAgY2FwYWNpdHkuc2NhbGVPblJlcXVlc3RDb3VudCgnU2NhbGVPblJlcXVlc3RzJywge1xuICAgICAgICByZXF1ZXN0c1BlclRhcmdldDogMTAwMCxcbiAgICAgICAgdGFyZ2V0R3JvdXAsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwbGljYXRpb25BdXRvU2NhbGluZzo6U2NhbGFibGVUYXJnZXQnLCB7XG4gICAgICAgIE1heENhcGFjaXR5OiAxMCxcbiAgICAgICAgTWluQ2FwYWNpdHk6IDEsXG4gICAgICAgIFJlc291cmNlSWQ6IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgJ3NlcnZpY2UvJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICcvJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ1NlcnZpY2VENjlENzU5QicsXG4gICAgICAgICAgICAgICAgICAnTmFtZScsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBsaWNhdGlvbkF1dG9TY2FsaW5nOjpTY2FsaW5nUG9saWN5Jywge1xuICAgICAgICBUYXJnZXRUcmFja2luZ1NjYWxpbmdQb2xpY3lDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgUHJlZGVmaW5lZE1ldHJpY1NwZWNpZmljYXRpb246IHtcbiAgICAgICAgICAgIFByZWRlZmluZWRNZXRyaWNUeXBlOiAnQUxCUmVxdWVzdENvdW50UGVyVGFyZ2V0JyxcbiAgICAgICAgICAgIFJlc291cmNlTGFiZWw6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgICAgeyAnRm46OlNlbGVjdCc6IFsxLCB7ICdGbjo6U3BsaXQnOiBbJy8nLCB7IFJlZjogJ2xibGlzdGVuZXI2NTdBRERFQycgfV0gfV0gfSwgJy8nLFxuICAgICAgICAgICAgICAgIHsgJ0ZuOjpTZWxlY3QnOiBbMiwgeyAnRm46OlNwbGl0JzogWycvJywgeyBSZWY6ICdsYmxpc3RlbmVyNjU3QURERUMnIH1dIH1dIH0sICcvJyxcbiAgICAgICAgICAgICAgICB7ICdGbjo6U2VsZWN0JzogWzMsIHsgJ0ZuOjpTcGxpdCc6IFsnLycsIHsgUmVmOiAnbGJsaXN0ZW5lcjY1N0FEREVDJyB9XSB9XSB9LCAnLycsXG4gICAgICAgICAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnbGJsaXN0ZW5lcnRhcmdldEdyb3VwQzc0ODlEMUUnLCAnVGFyZ2V0R3JvdXBGdWxsTmFtZSddIH0sXG4gICAgICAgICAgICAgIF1dLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFRhcmdldFZhbHVlOiAxMDAwLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgLy8gaWYgYW55IGxvYWQgYmFsYW5jZXIgaXMgY29uZmlndXJlZCBhbmQgaGVhbHRoQ2hlY2tHcmFjZVBlcmlvZFNlY29uZHMgaXMgbm90XG4gICAgICAgIC8vIHNldCwgdGhlbiBpdCBzaG91bGQgZGVmYXVsdCB0byA2MCBzZWNvbmRzLlxuICAgICAgICBIZWFsdGhDaGVja0dyYWNlUGVyaW9kU2Vjb25kczogNjAsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FsbG93cyBhdXRvIHNjYWxpbmcgYnkgQUxCIHdpdGggbmV3IHNlcnZpY2UgYXJuIGZvcm1hdCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ01haW5Db250YWluZXInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZWxsbycpLFxuICAgICAgfSk7XG4gICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMCB9KTtcblxuICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ2xiJywgeyB2cGMgfSk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdsaXN0ZW5lcicsIHsgcG9ydDogODAgfSk7XG4gICAgICBjb25zdCB0YXJnZXRHcm91cCA9IGxpc3RlbmVyLmFkZFRhcmdldHMoJ3RhcmdldCcsIHtcbiAgICAgICAgcG9ydDogODAsXG4gICAgICAgIHRhcmdldHM6IFtzZXJ2aWNlXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBjYXBhY2l0eSA9IHNlcnZpY2UuYXV0b1NjYWxlVGFza0NvdW50KHsgbWF4Q2FwYWNpdHk6IDEwLCBtaW5DYXBhY2l0eTogMSB9KTtcbiAgICAgIGNhcGFjaXR5LnNjYWxlT25SZXF1ZXN0Q291bnQoJ1NjYWxlT25SZXF1ZXN0cycsIHtcbiAgICAgICAgcmVxdWVzdHNQZXJUYXJnZXQ6IDEwMDAsXG4gICAgICAgIHRhcmdldEdyb3VwLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcGxpY2F0aW9uQXV0b1NjYWxpbmc6OlNjYWxhYmxlVGFyZ2V0Jywge1xuICAgICAgICBNYXhDYXBhY2l0eTogMTAsXG4gICAgICAgIE1pbkNhcGFjaXR5OiAxLFxuICAgICAgICBSZXNvdXJjZUlkOiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdzZXJ2aWNlLycsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdFY3NDbHVzdGVyOTcyNDJCODQnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdTZXJ2aWNlRDY5RDc1OUInLFxuICAgICAgICAgICAgICAgICAgJ05hbWUnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdhbGxvd3Mgc3BlY2lmeSBhbnkgZXhpc3RpbmcgY29udGFpbmVyIG5hbWUgYW5kIHBvcnQgaW4gYSBzZXJ2aWNlJywgKCkgPT4ge1xuICAgICAgdGVzdCgnd2l0aCBkZWZhdWx0IHNldHRpbmcnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdNYWluQ29udGFpbmVyJywge1xuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZWxsbycpLFxuICAgICAgICB9KTtcbiAgICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwMDAgfSk7XG4gICAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDAxIH0pO1xuXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnbGInLCB7IHZwYyB9KTtcbiAgICAgICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignbGlzdGVuZXInLCB7IHBvcnQ6IDgwIH0pO1xuICAgICAgICBsaXN0ZW5lci5hZGRUYXJnZXRzKCd0YXJnZXQnLCB7XG4gICAgICAgICAgcG9ydDogODAsXG4gICAgICAgICAgdGFyZ2V0czogW3NlcnZpY2UubG9hZEJhbGFuY2VyVGFyZ2V0KHtcbiAgICAgICAgICAgIGNvbnRhaW5lck5hbWU6ICdNYWluQ29udGFpbmVyJyxcbiAgICAgICAgICB9KV0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICAgIExvYWRCYWxhbmNlcnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQ29udGFpbmVyTmFtZTogJ01haW5Db250YWluZXInLFxuICAgICAgICAgICAgICBDb250YWluZXJQb3J0OiA4MDAwLFxuICAgICAgICAgICAgICBUYXJnZXRHcm91cEFybjoge1xuICAgICAgICAgICAgICAgIFJlZjogJ2xibGlzdGVuZXJ0YXJnZXRHcm91cEM3NDg5RDFFJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwSW5ncmVzcycsIHtcbiAgICAgICAgICBEZXNjcmlwdGlvbjogJ0xvYWQgYmFsYW5jZXIgdG8gdGFyZ2V0JyxcbiAgICAgICAgICBGcm9tUG9ydDogODAwMCxcbiAgICAgICAgICBUb1BvcnQ6IDgwMDAsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cEVncmVzcycsIHtcbiAgICAgICAgICBEZXNjcmlwdGlvbjogJ0xvYWQgYmFsYW5jZXIgdG8gdGFyZ2V0JyxcbiAgICAgICAgICBGcm9tUG9ydDogODAwMCxcbiAgICAgICAgICBUb1BvcnQ6IDgwMDAsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3dpdGggVENQIHByb3RvY29sJywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignTWFpbkNvbnRhaW5lcicsIHtcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDAwIH0pO1xuICAgICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMSwgcHJvdG9jb2w6IGVjcy5Qcm90b2NvbC5UQ1AgfSk7XG5cbiAgICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgY29uc3QgbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdsYicsIHsgdnBjIH0pO1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdsaXN0ZW5lcicsIHsgcG9ydDogODAgfSk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBsaXN0ZW5lci5hZGRUYXJnZXRzKCd0YXJnZXQnLCB7XG4gICAgICAgICAgcG9ydDogODAsXG4gICAgICAgICAgdGFyZ2V0czogW3NlcnZpY2UubG9hZEJhbGFuY2VyVGFyZ2V0KHtcbiAgICAgICAgICAgIGNvbnRhaW5lck5hbWU6ICdNYWluQ29udGFpbmVyJyxcbiAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwMDEsXG4gICAgICAgICAgICBwcm90b2NvbDogZWNzLlByb3RvY29sLlRDUCxcbiAgICAgICAgICB9KV0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3dpdGggVURQIHByb3RvY29sJywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignTWFpbkNvbnRhaW5lcicsIHtcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDAwIH0pO1xuICAgICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMSwgcHJvdG9jb2w6IGVjcy5Qcm90b2NvbC5VRFAgfSk7XG5cbiAgICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgY29uc3QgbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdsYicsIHsgdnBjIH0pO1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdsaXN0ZW5lcicsIHsgcG9ydDogODAgfSk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBsaXN0ZW5lci5hZGRUYXJnZXRzKCd0YXJnZXQnLCB7XG4gICAgICAgICAgcG9ydDogODAsXG4gICAgICAgICAgdGFyZ2V0czogW3NlcnZpY2UubG9hZEJhbGFuY2VyVGFyZ2V0KHtcbiAgICAgICAgICAgIGNvbnRhaW5lck5hbWU6ICdNYWluQ29udGFpbmVyJyxcbiAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwMDEsXG4gICAgICAgICAgICBwcm90b2NvbDogZWNzLlByb3RvY29sLlVEUCxcbiAgICAgICAgICB9KV0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3Rocm93cyB3aGVuIHByb3RvY29sIGRvZXMgbm90IG1hdGNoJywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignTWFpbkNvbnRhaW5lcicsIHtcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDAwIH0pO1xuICAgICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMSwgcHJvdG9jb2w6IGVjcy5Qcm90b2NvbC5VRFAgfSk7XG5cbiAgICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgY29uc3QgbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdsYicsIHsgdnBjIH0pO1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdsaXN0ZW5lcicsIHsgcG9ydDogODAgfSk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgIGxpc3RlbmVyLmFkZFRhcmdldHMoJ3RhcmdldCcsIHtcbiAgICAgICAgICAgIHBvcnQ6IDgwLFxuICAgICAgICAgICAgdGFyZ2V0czogW3NlcnZpY2UubG9hZEJhbGFuY2VyVGFyZ2V0KHtcbiAgICAgICAgICAgICAgY29udGFpbmVyTmFtZTogJ01haW5Db250YWluZXInLFxuICAgICAgICAgICAgICBjb250YWluZXJQb3J0OiA4MDAxLFxuICAgICAgICAgICAgICBwcm90b2NvbDogZWNzLlByb3RvY29sLlRDUCxcbiAgICAgICAgICAgIH0pXSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkudG9UaHJvdygvQ29udGFpbmVyICdEZWZhdWx0XFwvRmFyZ2F0ZVRhc2tEZWZcXC9NYWluQ29udGFpbmVyJyBoYXMgbm8gbWFwcGluZyBmb3IgcG9ydCA4MDAxIGFuZCBwcm90b2NvbCB0Y3AuIERpZCB5b3UgY2FsbCBcImNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3NcXChcXClcIlxcPy8pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3Rocm93cyB3aGVuIHBvcnQgZG9lcyBub3QgbWF0Y2gnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdNYWluQ29udGFpbmVyJywge1xuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZWxsbycpLFxuICAgICAgICB9KTtcbiAgICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwMDAgfSk7XG4gICAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDAxIH0pO1xuXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnbGInLCB7IHZwYyB9KTtcbiAgICAgICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignbGlzdGVuZXInLCB7IHBvcnQ6IDgwIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICBsaXN0ZW5lci5hZGRUYXJnZXRzKCd0YXJnZXQnLCB7XG4gICAgICAgICAgICBwb3J0OiA4MCxcbiAgICAgICAgICAgIHRhcmdldHM6IFtzZXJ2aWNlLmxvYWRCYWxhbmNlclRhcmdldCh7XG4gICAgICAgICAgICAgIGNvbnRhaW5lck5hbWU6ICdNYWluQ29udGFpbmVyJyxcbiAgICAgICAgICAgICAgY29udGFpbmVyUG9ydDogODAwMixcbiAgICAgICAgICAgIH0pXSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkudG9UaHJvdygvQ29udGFpbmVyICdEZWZhdWx0XFwvRmFyZ2F0ZVRhc2tEZWZcXC9NYWluQ29udGFpbmVyJyBoYXMgbm8gbWFwcGluZyBmb3IgcG9ydCA4MDAyIGFuZCBwcm90b2NvbCB0Y3AuIERpZCB5b3UgY2FsbCBcImNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3NcXChcXClcIlxcPy8pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3Rocm93cyB3aGVuIGNvbnRhaW5lciBkb2VzIG5vdCBleGlzdCcsICgpID0+IHtcbiAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdGYXJnYXRlVGFza0RlZicpO1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ01haW5Db250YWluZXInLCB7XG4gICAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbGxvJyksXG4gICAgICAgIH0pO1xuICAgICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMCB9KTtcbiAgICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwMDEgfSk7XG5cbiAgICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgY29uc3QgbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdsYicsIHsgdnBjIH0pO1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdsaXN0ZW5lcicsIHsgcG9ydDogODAgfSk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgIGxpc3RlbmVyLmFkZFRhcmdldHMoJ3RhcmdldCcsIHtcbiAgICAgICAgICAgIHBvcnQ6IDgwLFxuICAgICAgICAgICAgdGFyZ2V0czogW3NlcnZpY2UubG9hZEJhbGFuY2VyVGFyZ2V0KHtcbiAgICAgICAgICAgICAgY29udGFpbmVyTmFtZTogJ1NpZGVDb250YWluZXInLFxuICAgICAgICAgICAgICBjb250YWluZXJQb3J0OiA4MDAxLFxuICAgICAgICAgICAgfSldLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KS50b1Rocm93KC9ObyBjb250YWluZXIgbmFtZWQgJ1NpZGVDb250YWluZXInLiBEaWQgeW91IGNhbGwgXCJhZGRDb250YWluZXJcXChcXClcIj8vKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2FsbG93cyBsb2FkIGJhbGFuY2luZyB0byBhbnkgY29udGFpbmVyIGFuZCBwb3J0IG9mIHNlcnZpY2UnLCAoKSA9PiB7XG4gICAgICBkZXNjcmliZSgnd2l0aCBhcHBsaWNhdGlvbiBsb2FkIGJhbGFuY2VycycsICgpID0+IHtcbiAgICAgICAgdGVzdCgnd2l0aCBkZWZhdWx0IHRhcmdldCBncm91cCBwb3J0IGFuZCBwcm90b2NvbCcsICgpID0+IHtcbiAgICAgICAgICAvLyBHSVZFTlxuICAgICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcbiAgICAgICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ01haW5Db250YWluZXInLCB7XG4gICAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMCB9KTtcblxuICAgICAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIFdIRU5cbiAgICAgICAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ2xiJywgeyB2cGMgfSk7XG4gICAgICAgICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignbGlzdGVuZXInLCB7IHBvcnQ6IDgwIH0pO1xuXG4gICAgICAgICAgc2VydmljZS5yZWdpc3RlckxvYWRCYWxhbmNlclRhcmdldHMoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGNvbnRhaW5lck5hbWU6ICdNYWluQ29udGFpbmVyJyxcbiAgICAgICAgICAgICAgY29udGFpbmVyUG9ydDogODAwMCxcbiAgICAgICAgICAgICAgbGlzdGVuZXI6IGVjcy5MaXN0ZW5lckNvbmZpZy5hcHBsaWNhdGlvbkxpc3RlbmVyKGxpc3RlbmVyKSxcbiAgICAgICAgICAgICAgbmV3VGFyZ2V0R3JvdXBJZDogJ3RhcmdldDEnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgLy8gVEhFTlxuICAgICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgICAgIExvYWRCYWxhbmNlcnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIENvbnRhaW5lck5hbWU6ICdNYWluQ29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICBDb250YWluZXJQb3J0OiA4MDAwLFxuICAgICAgICAgICAgICAgIFRhcmdldEdyb3VwQXJuOiB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdsYmxpc3RlbmVydGFyZ2V0MUdyb3VwMUExQTVDOUUnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6VGFyZ2V0R3JvdXAnLCB7XG4gICAgICAgICAgICBQb3J0OiA4MCxcbiAgICAgICAgICAgIFByb3RvY29sOiAnSFRUUCcsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3QoJ3dpdGggZGVmYXVsdCB0YXJnZXQgZ3JvdXAgcG9ydCBhbmQgSFRUUCBwcm90b2NvbCcsICgpID0+IHtcbiAgICAgICAgICAvLyBHSVZFTlxuICAgICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcbiAgICAgICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ01haW5Db250YWluZXInLCB7XG4gICAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMCB9KTtcblxuICAgICAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIFdIRU5cbiAgICAgICAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ2xiJywgeyB2cGMgfSk7XG4gICAgICAgICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignbGlzdGVuZXInLCB7IHBvcnQ6IDgwIH0pO1xuXG4gICAgICAgICAgc2VydmljZS5yZWdpc3RlckxvYWRCYWxhbmNlclRhcmdldHMoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGNvbnRhaW5lck5hbWU6ICdNYWluQ29udGFpbmVyJyxcbiAgICAgICAgICAgICAgY29udGFpbmVyUG9ydDogODAwMCxcbiAgICAgICAgICAgICAgbGlzdGVuZXI6IGVjcy5MaXN0ZW5lckNvbmZpZy5hcHBsaWNhdGlvbkxpc3RlbmVyKGxpc3RlbmVyLCB7XG4gICAgICAgICAgICAgICAgcHJvdG9jb2w6IGVsYnYyLkFwcGxpY2F0aW9uUHJvdG9jb2wuSFRUUCxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIG5ld1RhcmdldEdyb3VwSWQ6ICd0YXJnZXQxJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIC8vIFRIRU5cbiAgICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICAgICAgICBMb2FkQmFsYW5jZXJzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBDb250YWluZXJOYW1lOiAnTWFpbkNvbnRhaW5lcicsXG4gICAgICAgICAgICAgICAgQ29udGFpbmVyUG9ydDogODAwMCxcbiAgICAgICAgICAgICAgICBUYXJnZXRHcm91cEFybjoge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnbGJsaXN0ZW5lcnRhcmdldDFHcm91cDFBMUE1QzlFJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OlRhcmdldEdyb3VwJywge1xuICAgICAgICAgICAgUG9ydDogODAsXG4gICAgICAgICAgICBQcm90b2NvbDogJ0hUVFAnLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0ZXN0KCd3aXRoIGRlZmF1bHQgdGFyZ2V0IGdyb3VwIHBvcnQgYW5kIEhUVFBTIHByb3RvY29sJywgKCkgPT4ge1xuICAgICAgICAgIC8vIEdJVkVOXG4gICAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdGYXJnYXRlVGFza0RlZicpO1xuICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignTWFpbkNvbnRhaW5lcicsIHtcbiAgICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZWxsbycpLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDAwIH0pO1xuXG4gICAgICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gV0hFTlxuICAgICAgICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnbGInLCB7IHZwYyB9KTtcbiAgICAgICAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdsaXN0ZW5lcicsIHsgcG9ydDogODAgfSk7XG5cbiAgICAgICAgICBzZXJ2aWNlLnJlZ2lzdGVyTG9hZEJhbGFuY2VyVGFyZ2V0cyhcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY29udGFpbmVyTmFtZTogJ01haW5Db250YWluZXInLFxuICAgICAgICAgICAgICBjb250YWluZXJQb3J0OiA4MDAwLFxuICAgICAgICAgICAgICBsaXN0ZW5lcjogZWNzLkxpc3RlbmVyQ29uZmlnLmFwcGxpY2F0aW9uTGlzdGVuZXIobGlzdGVuZXIsIHtcbiAgICAgICAgICAgICAgICBwcm90b2NvbDogZWxidjIuQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQUyxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIG5ld1RhcmdldEdyb3VwSWQ6ICd0YXJnZXQxJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIC8vIFRIRU5cbiAgICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICAgICAgICBMb2FkQmFsYW5jZXJzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBDb250YWluZXJOYW1lOiAnTWFpbkNvbnRhaW5lcicsXG4gICAgICAgICAgICAgICAgQ29udGFpbmVyUG9ydDogODAwMCxcbiAgICAgICAgICAgICAgICBUYXJnZXRHcm91cEFybjoge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnbGJsaXN0ZW5lcnRhcmdldDFHcm91cDFBMUE1QzlFJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OlRhcmdldEdyb3VwJywge1xuICAgICAgICAgICAgUG9ydDogNDQzLFxuICAgICAgICAgICAgUHJvdG9jb2w6ICdIVFRQUycsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3QoJ3dpdGggYW55IHRhcmdldCBncm91cCBwb3J0IGFuZCBwcm90b2NvbCcsICgpID0+IHtcbiAgICAgICAgICAvLyBHSVZFTlxuICAgICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcbiAgICAgICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ01haW5Db250YWluZXInLCB7XG4gICAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMCB9KTtcblxuICAgICAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIFdIRU5cbiAgICAgICAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ2xiJywgeyB2cGMgfSk7XG4gICAgICAgICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignbGlzdGVuZXInLCB7IHBvcnQ6IDgwIH0pO1xuXG4gICAgICAgICAgc2VydmljZS5yZWdpc3RlckxvYWRCYWxhbmNlclRhcmdldHMoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGNvbnRhaW5lck5hbWU6ICdNYWluQ29udGFpbmVyJyxcbiAgICAgICAgICAgICAgY29udGFpbmVyUG9ydDogODAwMCxcbiAgICAgICAgICAgICAgbGlzdGVuZXI6IGVjcy5MaXN0ZW5lckNvbmZpZy5hcHBsaWNhdGlvbkxpc3RlbmVyKGxpc3RlbmVyLCB7XG4gICAgICAgICAgICAgICAgcG9ydDogODMsXG4gICAgICAgICAgICAgICAgcHJvdG9jb2w6IGVsYnYyLkFwcGxpY2F0aW9uUHJvdG9jb2wuSFRUUCxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIG5ld1RhcmdldEdyb3VwSWQ6ICd0YXJnZXQxJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIC8vIFRIRU5cbiAgICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICAgICAgICBMb2FkQmFsYW5jZXJzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBDb250YWluZXJOYW1lOiAnTWFpbkNvbnRhaW5lcicsXG4gICAgICAgICAgICAgICAgQ29udGFpbmVyUG9ydDogODAwMCxcbiAgICAgICAgICAgICAgICBUYXJnZXRHcm91cEFybjoge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnbGJsaXN0ZW5lcnRhcmdldDFHcm91cDFBMUE1QzlFJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OlRhcmdldEdyb3VwJywge1xuICAgICAgICAgICAgUG9ydDogODMsXG4gICAgICAgICAgICBQcm90b2NvbDogJ0hUVFAnLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgnd2l0aCBuZXR3b3JrIGxvYWQgYmFsYW5jZXJzJywgKCkgPT4ge1xuICAgICAgICB0ZXN0KCd3aXRoIGRlZmF1bHQgdGFyZ2V0IGdyb3VwIHBvcnQnLCAoKSA9PiB7XG4gICAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG4gICAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdNYWluQ29udGFpbmVyJywge1xuICAgICAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbGxvJyksXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwMDAgfSk7XG5cbiAgICAgICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBXSEVOXG4gICAgICAgICAgY29uc3QgbGIgPSBuZXcgZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlcihzdGFjaywgJ2xiJywgeyB2cGMgfSk7XG4gICAgICAgICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignbGlzdGVuZXInLCB7IHBvcnQ6IDgwIH0pO1xuXG4gICAgICAgICAgc2VydmljZS5yZWdpc3RlckxvYWRCYWxhbmNlclRhcmdldHMoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGNvbnRhaW5lck5hbWU6ICdNYWluQ29udGFpbmVyJyxcbiAgICAgICAgICAgICAgY29udGFpbmVyUG9ydDogODAwMCxcbiAgICAgICAgICAgICAgbGlzdGVuZXI6IGVjcy5MaXN0ZW5lckNvbmZpZy5uZXR3b3JrTGlzdGVuZXIobGlzdGVuZXIpLFxuICAgICAgICAgICAgICBuZXdUYXJnZXRHcm91cElkOiAndGFyZ2V0MScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICAvLyBUSEVOXG4gICAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICAgICAgTG9hZEJhbGFuY2VyczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQ29udGFpbmVyTmFtZTogJ01haW5Db250YWluZXInLFxuICAgICAgICAgICAgICAgIENvbnRhaW5lclBvcnQ6IDgwMDAsXG4gICAgICAgICAgICAgICAgVGFyZ2V0R3JvdXBBcm46IHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ2xibGlzdGVuZXJ0YXJnZXQxR3JvdXAxQTFBNUM5RScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpUYXJnZXRHcm91cCcsIHtcbiAgICAgICAgICAgIFBvcnQ6IDgwLFxuICAgICAgICAgICAgUHJvdG9jb2w6ICdUQ1AnLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0ZXN0KCd3aXRoIGFueSB0YXJnZXQgZ3JvdXAgcG9ydCcsICgpID0+IHtcbiAgICAgICAgICAvLyBHSVZFTlxuICAgICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcbiAgICAgICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ01haW5Db250YWluZXInLCB7XG4gICAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMCB9KTtcblxuICAgICAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIFdIRU5cbiAgICAgICAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5OZXR3b3JrTG9hZEJhbGFuY2VyKHN0YWNrLCAnbGInLCB7IHZwYyB9KTtcbiAgICAgICAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdsaXN0ZW5lcicsIHsgcG9ydDogODAgfSk7XG5cbiAgICAgICAgICBzZXJ2aWNlLnJlZ2lzdGVyTG9hZEJhbGFuY2VyVGFyZ2V0cyhcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY29udGFpbmVyTmFtZTogJ01haW5Db250YWluZXInLFxuICAgICAgICAgICAgICBjb250YWluZXJQb3J0OiA4MDAwLFxuICAgICAgICAgICAgICBsaXN0ZW5lcjogZWNzLkxpc3RlbmVyQ29uZmlnLm5ldHdvcmtMaXN0ZW5lcihsaXN0ZW5lciwge1xuICAgICAgICAgICAgICAgIHBvcnQ6IDgxLFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgbmV3VGFyZ2V0R3JvdXBJZDogJ3RhcmdldDEnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgLy8gVEhFTlxuICAgICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgICAgIExvYWRCYWxhbmNlcnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIENvbnRhaW5lck5hbWU6ICdNYWluQ29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICBDb250YWluZXJQb3J0OiA4MDAwLFxuICAgICAgICAgICAgICAgIFRhcmdldEdyb3VwQXJuOiB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdsYmxpc3RlbmVydGFyZ2V0MUdyb3VwMUExQTVDOUUnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6VGFyZ2V0R3JvdXAnLCB7XG4gICAgICAgICAgICBQb3J0OiA4MSxcbiAgICAgICAgICAgIFByb3RvY29sOiAnVENQJyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2F1dG9zY2FsaW5nIHRlc3RzJywgKCkgPT4ge1xuICAgIHRlc3QoJ2FsbG93cyBzY2FsaW5nIG9uIGEgc3BlY2lmaWVkIHNjaGVkdWxlZCB0aW1lJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignTWFpbkNvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbGxvJyksXG4gICAgICB9KTtcbiAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDAwIH0pO1xuXG4gICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGNhcGFjaXR5ID0gc2VydmljZS5hdXRvU2NhbGVUYXNrQ291bnQoeyBtYXhDYXBhY2l0eTogMTAsIG1pbkNhcGFjaXR5OiAxIH0pO1xuICAgICAgY2FwYWNpdHkuc2NhbGVPblNjaGVkdWxlKCdTY2FsZU9uU2NoZWR1bGUnLCB7XG4gICAgICAgIHNjaGVkdWxlOiBhcHBzY2FsaW5nLlNjaGVkdWxlLmNyb24oeyBob3VyOiAnOCcsIG1pbnV0ZTogJzAnIH0pLFxuICAgICAgICBtaW5DYXBhY2l0eTogMTAsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwbGljYXRpb25BdXRvU2NhbGluZzo6U2NhbGFibGVUYXJnZXQnLCB7XG4gICAgICAgIFNjaGVkdWxlZEFjdGlvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBTY2FsYWJsZVRhcmdldEFjdGlvbjoge1xuICAgICAgICAgICAgICBNaW5DYXBhY2l0eTogMTAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU2NoZWR1bGU6ICdjcm9uKDAgOCAqICogPyAqKScsXG4gICAgICAgICAgICBTY2hlZHVsZWRBY3Rpb25OYW1lOiAnU2NhbGVPblNjaGVkdWxlJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhbGxvd3Mgc2NhbGluZyBvbiBhIHNwZWNpZmllZCBtZXRyaWMgdmFsdWUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdGYXJnYXRlVGFza0RlZicpO1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdNYWluQ29udGFpbmVyJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICAgIH0pO1xuICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwMDAgfSk7XG5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgY2FwYWNpdHkgPSBzZXJ2aWNlLmF1dG9TY2FsZVRhc2tDb3VudCh7IG1heENhcGFjaXR5OiAxMCwgbWluQ2FwYWNpdHk6IDEgfSk7XG4gICAgICBjYXBhY2l0eS5zY2FsZU9uTWV0cmljKCdTY2FsZU9uTWV0cmljJywge1xuICAgICAgICBtZXRyaWM6IG5ldyBjbG91ZHdhdGNoLk1ldHJpYyh7IG5hbWVzcGFjZTogJ1Rlc3QnLCBtZXRyaWNOYW1lOiAnTWV0cmljJyB9KSxcbiAgICAgICAgc2NhbGluZ1N0ZXBzOiBbXG4gICAgICAgICAgeyB1cHBlcjogMCwgY2hhbmdlOiAtMSB9LFxuICAgICAgICAgIHsgbG93ZXI6IDEwMCwgY2hhbmdlOiArMSB9LFxuICAgICAgICAgIHsgbG93ZXI6IDUwMCwgY2hhbmdlOiArNSB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcGxpY2F0aW9uQXV0b1NjYWxpbmc6OlNjYWxpbmdQb2xpY3knLCB7XG4gICAgICAgIFBvbGljeVR5cGU6ICdTdGVwU2NhbGluZycsXG4gICAgICAgIFNjYWxpbmdUYXJnZXRJZDoge1xuICAgICAgICAgIFJlZjogJ1NlcnZpY2VUYXNrQ291bnRUYXJnZXQyM0UyNTYxNCcsXG4gICAgICAgIH0sXG4gICAgICAgIFN0ZXBTY2FsaW5nUG9saWN5Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIEFkanVzdG1lbnRUeXBlOiAnQ2hhbmdlSW5DYXBhY2l0eScsXG4gICAgICAgICAgTWV0cmljQWdncmVnYXRpb25UeXBlOiAnQXZlcmFnZScsXG4gICAgICAgICAgU3RlcEFkanVzdG1lbnRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE1ldHJpY0ludGVydmFsVXBwZXJCb3VuZDogMCxcbiAgICAgICAgICAgICAgU2NhbGluZ0FkanVzdG1lbnQ6IC0xLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhbGxvd3Mgc2NhbGluZyBvbiBhIHRhcmdldCBDUFUgdXRpbGl6YXRpb24nLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdGYXJnYXRlVGFza0RlZicpO1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdNYWluQ29udGFpbmVyJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICAgIH0pO1xuICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwMDAgfSk7XG5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgY2FwYWNpdHkgPSBzZXJ2aWNlLmF1dG9TY2FsZVRhc2tDb3VudCh7IG1heENhcGFjaXR5OiAxMCwgbWluQ2FwYWNpdHk6IDEgfSk7XG4gICAgICBjYXBhY2l0eS5zY2FsZU9uQ3B1VXRpbGl6YXRpb24oJ1NjYWxlT25DcHUnLCB7XG4gICAgICAgIHRhcmdldFV0aWxpemF0aW9uUGVyY2VudDogMzAsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwbGljYXRpb25BdXRvU2NhbGluZzo6U2NhbGluZ1BvbGljeScsIHtcbiAgICAgICAgUG9saWN5VHlwZTogJ1RhcmdldFRyYWNraW5nU2NhbGluZycsXG4gICAgICAgIFRhcmdldFRyYWNraW5nU2NhbGluZ1BvbGljeUNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBQcmVkZWZpbmVkTWV0cmljU3BlY2lmaWNhdGlvbjogeyBQcmVkZWZpbmVkTWV0cmljVHlwZTogJ0VDU1NlcnZpY2VBdmVyYWdlQ1BVVXRpbGl6YXRpb24nIH0sXG4gICAgICAgICAgVGFyZ2V0VmFsdWU6IDMwLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhbGxvd3Mgc2NhbGluZyBvbiBtZW1vcnkgdXRpbGl6YXRpb24nLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdGYXJnYXRlVGFza0RlZicpO1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdNYWluQ29udGFpbmVyJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICAgIH0pO1xuICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwMDAgfSk7XG5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgY2FwYWNpdHkgPSBzZXJ2aWNlLmF1dG9TY2FsZVRhc2tDb3VudCh7IG1heENhcGFjaXR5OiAxMCwgbWluQ2FwYWNpdHk6IDEgfSk7XG4gICAgICBjYXBhY2l0eS5zY2FsZU9uTWVtb3J5VXRpbGl6YXRpb24oJ1NjYWxlT25NZW1vcnknLCB7XG4gICAgICAgIHRhcmdldFV0aWxpemF0aW9uUGVyY2VudDogMzAsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwbGljYXRpb25BdXRvU2NhbGluZzo6U2NhbGluZ1BvbGljeScsIHtcbiAgICAgICAgUG9saWN5VHlwZTogJ1RhcmdldFRyYWNraW5nU2NhbGluZycsXG4gICAgICAgIFRhcmdldFRyYWNraW5nU2NhbGluZ1BvbGljeUNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBQcmVkZWZpbmVkTWV0cmljU3BlY2lmaWNhdGlvbjogeyBQcmVkZWZpbmVkTWV0cmljVHlwZTogJ0VDU1NlcnZpY2VBdmVyYWdlTWVtb3J5VXRpbGl6YXRpb24nIH0sXG4gICAgICAgICAgVGFyZ2V0VmFsdWU6IDMwLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhbGxvd3Mgc2NhbGluZyBvbiBjdXN0b20gQ2xvdWRXYXRjaCBtZXRyaWMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdGYXJnYXRlVGFza0RlZicpO1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdNYWluQ29udGFpbmVyJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICAgIH0pO1xuICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwMDAgfSk7XG5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgY2FwYWNpdHkgPSBzZXJ2aWNlLmF1dG9TY2FsZVRhc2tDb3VudCh7IG1heENhcGFjaXR5OiAxMCwgbWluQ2FwYWNpdHk6IDEgfSk7XG4gICAgICBjYXBhY2l0eS5zY2FsZVRvVHJhY2tDdXN0b21NZXRyaWMoJ1NjYWxlT25DdXN0b21NZXRyaWMnLCB7XG4gICAgICAgIG1ldHJpYzogbmV3IGNsb3Vkd2F0Y2guTWV0cmljKHsgbmFtZXNwYWNlOiAnVGVzdCcsIG1ldHJpY05hbWU6ICdNZXRyaWMnIH0pLFxuICAgICAgICB0YXJnZXRWYWx1ZTogNSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBsaWNhdGlvbkF1dG9TY2FsaW5nOjpTY2FsaW5nUG9saWN5Jywge1xuICAgICAgICBQb2xpY3lUeXBlOiAnVGFyZ2V0VHJhY2tpbmdTY2FsaW5nJyxcbiAgICAgICAgVGFyZ2V0VHJhY2tpbmdTY2FsaW5nUG9saWN5Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIEN1c3RvbWl6ZWRNZXRyaWNTcGVjaWZpY2F0aW9uOiB7XG4gICAgICAgICAgICBNZXRyaWNOYW1lOiAnTWV0cmljJyxcbiAgICAgICAgICAgIE5hbWVzcGFjZTogJ1Rlc3QnLFxuICAgICAgICAgICAgU3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUYXJnZXRWYWx1ZTogNSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnc2NoZWR1bGVkIHNjYWxpbmcgc2hvd3Mgd2FybmluZyB3aGVuIG1pbnV0ZSBpcyBub3QgZGVmaW5lZCBpbiBjcm9uJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignTWFpbkNvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbGxvJyksXG4gICAgICB9KTtcbiAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDAwIH0pO1xuXG4gICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGNhcGFjaXR5ID0gc2VydmljZS5hdXRvU2NhbGVUYXNrQ291bnQoeyBtYXhDYXBhY2l0eTogMTAsIG1pbkNhcGFjaXR5OiAxIH0pO1xuICAgICAgY2FwYWNpdHkuc2NhbGVPblNjaGVkdWxlKCdTY2FsZU9uU2NoZWR1bGUnLCB7XG4gICAgICAgIHNjaGVkdWxlOiBhcHBzY2FsaW5nLlNjaGVkdWxlLmNyb24oeyBob3VyOiAnOCcgfSksXG4gICAgICAgIG1pbkNhcGFjaXR5OiAxMCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBBbm5vdGF0aW9ucy5mcm9tU3RhY2soc3RhY2spLmhhc1dhcm5pbmcoJy9EZWZhdWx0L1NlcnZpY2UvVGFza0NvdW50L1RhcmdldCcsIFwiY3JvbjogSWYgeW91IGRvbid0IHBhc3MgJ21pbnV0ZScsIGJ5IGRlZmF1bHQgdGhlIGV2ZW50IHJ1bnMgZXZlcnkgbWludXRlLiBQYXNzICdtaW51dGU6ICcqJycgaWYgdGhhdCdzIHdoYXQgeW91IGludGVuZCwgb3IgJ21pbnV0ZTogMCcgdG8gcnVuIG9uY2UgcGVyIGhvdXIgaW5zdGVhZC5cIik7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdzY2hlZHVsZWQgc2NhbGluZyBzaG93cyBubyB3YXJuaW5nIHdoZW4gbWludXRlIGlzICogaW4gY3JvbicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ01haW5Db250YWluZXInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZWxsbycpLFxuICAgICAgfSk7XG4gICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMCB9KTtcblxuICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBjYXBhY2l0eSA9IHNlcnZpY2UuYXV0b1NjYWxlVGFza0NvdW50KHsgbWF4Q2FwYWNpdHk6IDEwLCBtaW5DYXBhY2l0eTogMSB9KTtcbiAgICAgIGNhcGFjaXR5LnNjYWxlT25TY2hlZHVsZSgnU2NhbGVPblNjaGVkdWxlJywge1xuICAgICAgICBzY2hlZHVsZTogYXBwc2NhbGluZy5TY2hlZHVsZS5jcm9uKHsgaG91cjogJzgnLCBtaW51dGU6ICcqJyB9KSxcbiAgICAgICAgbWluQ2FwYWNpdHk6IDEwLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvbnN0IGFubm90YXRpb25zID0gQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5maW5kV2FybmluZygnKicsIE1hdGNoLmFueVZhbHVlKCkpO1xuICAgICAgZXhwZWN0KGFubm90YXRpb25zLmxlbmd0aCkudG9CZSgwKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1doZW4gZW5hYmxpbmcgc2VydmljZSBkaXNjb3ZlcnknLCAoKSA9PiB7XG4gICAgdGVzdCgndGhyb3dzIGlmIG5hbWVzcGFjZSBoYXMgbm90IGJlZW4gYWRkZWQgdG8gY2x1c3RlcicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ01haW5Db250YWluZXInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZWxsbycpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG4gICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMCB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgICBjbG91ZE1hcE9wdGlvbnM6IHtcbiAgICAgICAgICAgIG5hbWU6ICdteUFwcCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9DYW5ub3QgZW5hYmxlIHNlcnZpY2UgZGlzY292ZXJ5IGlmIGEgQ2xvdWRtYXAgTmFtZXNwYWNlIGhhcyBub3QgYmVlbiBjcmVhdGVkIGluIHRoZSBjbHVzdGVyLi8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY3JlYXRlcyBjbG91ZCBtYXAgc2VydmljZSBmb3IgUHJpdmF0ZSBETlMgbmFtZXNwYWNlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignTWFpbkNvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbGxvJyksXG4gICAgICB9KTtcbiAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDAwIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7XG4gICAgICAgIG5hbWU6ICdmb28uY29tJyxcbiAgICAgICAgdHlwZTogY2xvdWRtYXAuTmFtZXNwYWNlVHlwZS5ETlNfUFJJVkFURSxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIGNsb3VkTWFwT3B0aW9uczoge1xuICAgICAgICAgIG5hbWU6ICdteUFwcCcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VydmljZURpc2NvdmVyeTo6U2VydmljZScsIHtcbiAgICAgICAgRG5zQ29uZmlnOiB7XG4gICAgICAgICAgRG5zUmVjb3JkczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBUVEw6IDYwLFxuICAgICAgICAgICAgICBUeXBlOiAnQScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgTmFtZXNwYWNlSWQ6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnRWNzQ2x1c3RlckRlZmF1bHRTZXJ2aWNlRGlzY292ZXJ5TmFtZXNwYWNlQjA5NzFCMkYnLFxuICAgICAgICAgICAgICAnSWQnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJvdXRpbmdQb2xpY3k6ICdNVUxUSVZBTFVFJyxcbiAgICAgICAgfSxcbiAgICAgICAgSGVhbHRoQ2hlY2tDdXN0b21Db25maWc6IHtcbiAgICAgICAgICBGYWlsdXJlVGhyZXNob2xkOiAxLFxuICAgICAgICB9LFxuICAgICAgICBOYW1lOiAnbXlBcHAnLFxuICAgICAgICBOYW1lc3BhY2VJZDoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0Vjc0NsdXN0ZXJEZWZhdWx0U2VydmljZURpc2NvdmVyeU5hbWVzcGFjZUIwOTcxQjJGJyxcbiAgICAgICAgICAgICdJZCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY3JlYXRlcyBBV1MgQ2xvdWQgTWFwIHNlcnZpY2UgZm9yIFByaXZhdGUgRE5TIG5hbWVzcGFjZSB3aXRoIFNSViByZWNvcmRzIHdpdGggcHJvcGVyIGRlZmF1bHRzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcblxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ01haW5Db250YWluZXInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZWxsbycpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG4gICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMCB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY2x1c3Rlci5hZGREZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2Uoe1xuICAgICAgICBuYW1lOiAnZm9vLmNvbScsXG4gICAgICAgIHR5cGU6IGNsb3VkbWFwLk5hbWVzcGFjZVR5cGUuRE5TX1BSSVZBVEUsXG4gICAgICB9KTtcblxuICAgICAgbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBjbG91ZE1hcE9wdGlvbnM6IHtcbiAgICAgICAgICBuYW1lOiAnbXlBcHAnLFxuICAgICAgICAgIGRuc1JlY29yZFR5cGU6IGNsb3VkbWFwLkRuc1JlY29yZFR5cGUuU1JWLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNlcnZpY2VEaXNjb3Zlcnk6OlNlcnZpY2UnLCB7XG4gICAgICAgIERuc0NvbmZpZzoge1xuICAgICAgICAgIERuc1JlY29yZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgVFRMOiA2MCxcbiAgICAgICAgICAgICAgVHlwZTogJ1NSVicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgTmFtZXNwYWNlSWQ6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnRWNzQ2x1c3RlckRlZmF1bHRTZXJ2aWNlRGlzY292ZXJ5TmFtZXNwYWNlQjA5NzFCMkYnLFxuICAgICAgICAgICAgICAnSWQnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJvdXRpbmdQb2xpY3k6ICdNVUxUSVZBTFVFJyxcbiAgICAgICAgfSxcbiAgICAgICAgSGVhbHRoQ2hlY2tDdXN0b21Db25maWc6IHtcbiAgICAgICAgICBGYWlsdXJlVGhyZXNob2xkOiAxLFxuICAgICAgICB9LFxuICAgICAgICBOYW1lOiAnbXlBcHAnLFxuICAgICAgICBOYW1lc3BhY2VJZDoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0Vjc0NsdXN0ZXJEZWZhdWx0U2VydmljZURpc2NvdmVyeU5hbWVzcGFjZUIwOTcxQjJGJyxcbiAgICAgICAgICAgICdJZCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY3JlYXRlcyBBV1MgQ2xvdWQgTWFwIHNlcnZpY2UgZm9yIFByaXZhdGUgRE5TIG5hbWVzcGFjZSB3aXRoIFNSViByZWNvcmRzIHdpdGggb3ZlcnJpZGVuIGRlZmF1bHRzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcblxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ01haW5Db250YWluZXInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZWxsbycpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG4gICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMCB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY2x1c3Rlci5hZGREZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2Uoe1xuICAgICAgICBuYW1lOiAnZm9vLmNvbScsXG4gICAgICAgIHR5cGU6IGNsb3VkbWFwLk5hbWVzcGFjZVR5cGUuRE5TX1BSSVZBVEUsXG4gICAgICB9KTtcblxuICAgICAgbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBjbG91ZE1hcE9wdGlvbnM6IHtcbiAgICAgICAgICBuYW1lOiAnbXlBcHAnLFxuICAgICAgICAgIGRuc1JlY29yZFR5cGU6IGNsb3VkbWFwLkRuc1JlY29yZFR5cGUuU1JWLFxuICAgICAgICAgIGRuc1R0bDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMTApLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNlcnZpY2VEaXNjb3Zlcnk6OlNlcnZpY2UnLCB7XG4gICAgICAgIERuc0NvbmZpZzoge1xuICAgICAgICAgIERuc1JlY29yZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgVFRMOiAxMCxcbiAgICAgICAgICAgICAgVHlwZTogJ1NSVicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgTmFtZXNwYWNlSWQ6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnRWNzQ2x1c3RlckRlZmF1bHRTZXJ2aWNlRGlzY292ZXJ5TmFtZXNwYWNlQjA5NzFCMkYnLFxuICAgICAgICAgICAgICAnSWQnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJvdXRpbmdQb2xpY3k6ICdNVUxUSVZBTFVFJyxcbiAgICAgICAgfSxcbiAgICAgICAgSGVhbHRoQ2hlY2tDdXN0b21Db25maWc6IHtcbiAgICAgICAgICBGYWlsdXJlVGhyZXNob2xkOiAxLFxuICAgICAgICB9LFxuICAgICAgICBOYW1lOiAnbXlBcHAnLFxuICAgICAgICBOYW1lc3BhY2VJZDoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0Vjc0NsdXN0ZXJEZWZhdWx0U2VydmljZURpc2NvdmVyeU5hbWVzcGFjZUIwOTcxQjJGJyxcbiAgICAgICAgICAgICdJZCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndXNlciBjYW4gc2VsZWN0IGFueSBjb250YWluZXIgYW5kIHBvcnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4gICAgICBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7XG4gICAgICAgIG5hbWU6ICdmb28uY29tJyxcbiAgICAgICAgdHlwZTogY2xvdWRtYXAuTmFtZXNwYWNlVHlwZS5ETlNfUFJJVkFURSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcbiAgICAgIGNvbnN0IG1haW5Db250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ01haW5Db250YWluZXInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZWxsbycpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG4gICAgICBtYWluQ29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwMDAgfSk7XG5cbiAgICAgIGNvbnN0IG90aGVyQ29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdPdGhlckNvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbGxvJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcbiAgICAgIG90aGVyQ29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwMDEgfSk7XG5cbiAgICAgIG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgY2xvdWRNYXBPcHRpb25zOiB7XG4gICAgICAgICAgZG5zUmVjb3JkVHlwZTogY2xvdWRtYXAuRG5zUmVjb3JkVHlwZS5TUlYsXG4gICAgICAgICAgY29udGFpbmVyOiBvdGhlckNvbnRhaW5lcixcbiAgICAgICAgICBjb250YWluZXJQb3J0OiA4MDAxLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgU2VydmljZVJlZ2lzdHJpZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWdpc3RyeUFybjogeyAnRm46OkdldEF0dCc6IFsnU2VydmljZUNsb3VkbWFwU2VydmljZTA0NjA1OEE0JywgJ0FybiddIH0sXG4gICAgICAgICAgICBDb250YWluZXJOYW1lOiAnT3RoZXJDb250YWluZXInLFxuICAgICAgICAgICAgQ29udGFpbmVyUG9ydDogODAwMSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ01ldHJpYycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ0NvbnRhaW5lcicsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZWxsbycpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzZXJ2aWNlLm1ldHJpY0NwdVV0aWxpemF0aW9uKCkpKS50b0VxdWFsKHtcbiAgICAgIGRpbWVuc2lvbnM6IHtcbiAgICAgICAgQ2x1c3Rlck5hbWU6IHsgUmVmOiAnRWNzQ2x1c3Rlcjk3MjQyQjg0JyB9LFxuICAgICAgICBTZXJ2aWNlTmFtZTogeyAnRm46OkdldEF0dCc6IFsnU2VydmljZUQ2OUQ3NTlCJywgJ05hbWUnXSB9LFxuICAgICAgfSxcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FQ1MnLFxuICAgICAgbWV0cmljTmFtZTogJ0NQVVV0aWxpemF0aW9uJyxcbiAgICAgIHBlcmlvZDogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoNSksXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1doZW4gaW1wb3J0IGEgRmFyZ2F0ZSBTZXJ2aWNlJywgKCkgPT4ge1xuICAgIHRlc3QoJ2Zyb21GYXJnYXRlU2VydmljZUFybiBvbGQgZm9ybWF0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzZXJ2aWNlID0gZWNzLkZhcmdhdGVTZXJ2aWNlLmZyb21GYXJnYXRlU2VydmljZUFybihzdGFjaywgJ0Vjc1NlcnZpY2UnLCAnYXJuOmF3czplY3M6dXMtd2VzdC0yOjEyMzQ1Njc4OTAxMjpzZXJ2aWNlL215LWh0dHAtc2VydmljZScpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc2VydmljZS5zZXJ2aWNlQXJuKS50b0VxdWFsKCdhcm46YXdzOmVjczp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOnNlcnZpY2UvbXktaHR0cC1zZXJ2aWNlJyk7XG4gICAgICBleHBlY3Qoc2VydmljZS5zZXJ2aWNlTmFtZSkudG9FcXVhbCgnbXktaHR0cC1zZXJ2aWNlJyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdmcm9tRmFyZ2F0ZVNlcnZpY2VBcm4gbmV3IGZvcm1hdCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3Qgc2VydmljZSA9IGVjcy5GYXJnYXRlU2VydmljZS5mcm9tRmFyZ2F0ZVNlcnZpY2VBcm4oc3RhY2ssICdFY3NTZXJ2aWNlJywgJ2Fybjphd3M6ZWNzOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6c2VydmljZS9teS1jbHVzdGVyLW5hbWUvbXktaHR0cC1zZXJ2aWNlJyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzZXJ2aWNlLnNlcnZpY2VBcm4pLnRvRXF1YWwoJ2Fybjphd3M6ZWNzOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6c2VydmljZS9teS1jbHVzdGVyLW5hbWUvbXktaHR0cC1zZXJ2aWNlJyk7XG4gICAgICBleHBlY3Qoc2VydmljZS5zZXJ2aWNlTmFtZSkudG9FcXVhbCgnbXktaHR0cC1zZXJ2aWNlJyk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZnJvbUZhcmdhdGVTZXJ2aWNlQXJuIHRva2VuaXplZCBBUk4nLCAoKSA9PiB7XG4gICAgICB0ZXN0KCd3aGVuIEBhd3MtY2RrL2F3cy1lY3M6YXJuRm9ybWF0SW5jbHVkZXNDbHVzdGVyTmFtZSBpcyBkaXNhYmxlZCwgdXNlIG9sZCBBUk4gZm9ybWF0JywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBlY3MuRmFyZ2F0ZVNlcnZpY2UuZnJvbUZhcmdhdGVTZXJ2aWNlQXJuKHN0YWNrLCAnRWNzU2VydmljZScsIG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHN0YWNrLCAnQVJOJykudmFsdWVBc1N0cmluZyk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzZXJ2aWNlLnNlcnZpY2VBcm4pKS50b0VxdWFsKHsgUmVmOiAnQVJOJyB9KTtcbiAgICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc2VydmljZS5zZXJ2aWNlTmFtZSkpLnRvRXF1YWwoe1xuICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgICAgIDUsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBUk4nIH0sXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnd2hlbiBAYXdzLWNkay9hd3MtZWNzOmFybkZvcm1hdEluY2x1ZGVzQ2x1c3Rlck5hbWUgaXMgZW5hYmxlZCwgdXNlIG5ldyBBUk4gZm9ybWF0JywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgICBbRUNTX0FSTl9GT1JNQVRfSU5DTFVERVNfQ0xVU1RFUl9OQU1FXTogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XG5cbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBjb25zdCBzZXJ2aWNlID0gZWNzLkZhcmdhdGVTZXJ2aWNlLmZyb21GYXJnYXRlU2VydmljZUFybihzdGFjaywgJ0Vjc1NlcnZpY2UnLCBuZXcgY2RrLkNmblBhcmFtZXRlcihzdGFjaywgJ0FSTicpLnZhbHVlQXNTdHJpbmcpO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc2VydmljZS5zZXJ2aWNlQXJuKSkudG9FcXVhbCh7IFJlZjogJ0FSTicgfSk7XG4gICAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHNlcnZpY2Uuc2VydmljZU5hbWUpKS50b0VxdWFsKHtcbiAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgIDIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgJy8nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAgICAgICA1LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVJOJyB9LFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIHNlcnZpY2VBcm4gb2xkIGZvcm1hdCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBlY3MuRmFyZ2F0ZVNlcnZpY2UuZnJvbUZhcmdhdGVTZXJ2aWNlQXR0cmlidXRlcyhzdGFjaywgJ0Vjc1NlcnZpY2UnLCB7XG4gICAgICAgIHNlcnZpY2VBcm46ICdhcm46YXdzOmVjczp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOnNlcnZpY2UvbXktaHR0cC1zZXJ2aWNlJyxcbiAgICAgICAgY2x1c3RlcixcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc2VydmljZS5zZXJ2aWNlQXJuKS50b0VxdWFsKCdhcm46YXdzOmVjczp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOnNlcnZpY2UvbXktaHR0cC1zZXJ2aWNlJyk7XG4gICAgICBleHBlY3Qoc2VydmljZS5zZXJ2aWNlTmFtZSkudG9FcXVhbCgnbXktaHR0cC1zZXJ2aWNlJyk7XG5cbiAgICAgIGV4cGVjdChzZXJ2aWNlLmVudi5hY2NvdW50KS50b0VxdWFsKCcxMjM0NTY3ODkwMTInKTtcbiAgICAgIGV4cGVjdChzZXJ2aWNlLmVudi5yZWdpb24pLnRvRXF1YWwoJ3VzLXdlc3QtMicpO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIHNlcnZpY2VBcm4gbmV3IGZvcm1hdCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBlY3MuRmFyZ2F0ZVNlcnZpY2UuZnJvbUZhcmdhdGVTZXJ2aWNlQXR0cmlidXRlcyhzdGFjaywgJ0Vjc1NlcnZpY2UnLCB7XG4gICAgICAgIHNlcnZpY2VBcm46ICdhcm46YXdzOmVjczp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOnNlcnZpY2UvbXktY2x1c3Rlci1uYW1lL215LWh0dHAtc2VydmljZScsXG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHNlcnZpY2Uuc2VydmljZUFybikudG9FcXVhbCgnYXJuOmF3czplY3M6dXMtd2VzdC0yOjEyMzQ1Njc4OTAxMjpzZXJ2aWNlL215LWNsdXN0ZXItbmFtZS9teS1odHRwLXNlcnZpY2UnKTtcbiAgICAgIGV4cGVjdChzZXJ2aWNlLnNlcnZpY2VOYW1lKS50b0VxdWFsKCdteS1odHRwLXNlcnZpY2UnKTtcblxuICAgICAgZXhwZWN0KHNlcnZpY2UuZW52LmFjY291bnQpLnRvRXF1YWwoJzEyMzQ1Njc4OTAxMicpO1xuICAgICAgZXhwZWN0KHNlcnZpY2UuZW52LnJlZ2lvbikudG9FcXVhbCgndXMtd2VzdC0yJyk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2l0aCBzZXJ2aWNlQXJuIHRva2VuaXplZCBBUk4nLCAoKSA9PiB7XG4gICAgICB0ZXN0KCd3aGVuIEBhd3MtY2RrL2F3cy1lY3M6YXJuRm9ybWF0SW5jbHVkZXNDbHVzdGVyTmFtZSBpcyBkaXNhYmxlZCwgdXNlIG9sZCBBUk4gZm9ybWF0JywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInKTtcblxuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBlY3MuRmFyZ2F0ZVNlcnZpY2UuZnJvbUZhcmdhdGVTZXJ2aWNlQXR0cmlidXRlcyhzdGFjaywgJ0Vjc1NlcnZpY2UnLCB7XG4gICAgICAgICAgc2VydmljZUFybjogbmV3IGNkay5DZm5QYXJhbWV0ZXIoc3RhY2ssICdBUk4nKS52YWx1ZUFzU3RyaW5nLFxuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc2VydmljZS5zZXJ2aWNlQXJuKSkudG9FcXVhbCh7IFJlZjogJ0FSTicgfSk7XG4gICAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHNlcnZpY2Uuc2VydmljZU5hbWUpKS50b0VxdWFsKHtcbiAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgIDEsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgJy8nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAgICAgICA1LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVJOJyB9LFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHNlcnZpY2UuZW52LmFjY291bnQpKS50b0VxdWFsKHtcbiAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgIDQsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgIHsgUmVmOiAnQVJOJyB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc2VydmljZS5lbnYucmVnaW9uKSkudG9FcXVhbCh7XG4gICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAzLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICB7IFJlZjogJ0FSTicgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnd2hlbiBAYXdzLWNkay9hd3MtZWNzOmFybkZvcm1hdEluY2x1ZGVzQ2x1c3Rlck5hbWUgaXMgZW5hYmxlZCwgdXNlIG5ldyBBUk4gZm9ybWF0JywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgICBbRUNTX0FSTl9GT1JNQVRfSU5DTFVERVNfQ0xVU1RFUl9OQU1FXTogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJyk7XG5cbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBjb25zdCBzZXJ2aWNlID0gZWNzLkZhcmdhdGVTZXJ2aWNlLmZyb21GYXJnYXRlU2VydmljZUF0dHJpYnV0ZXMoc3RhY2ssICdFY3NTZXJ2aWNlJywge1xuICAgICAgICAgIHNlcnZpY2VBcm46IG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHN0YWNrLCAnQVJOJykudmFsdWVBc1N0cmluZyxcbiAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHNlcnZpY2Uuc2VydmljZUFybikpLnRvRXF1YWwoeyBSZWY6ICdBUk4nIH0pO1xuICAgICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzZXJ2aWNlLnNlcnZpY2VOYW1lKSkudG9FcXVhbCh7XG4gICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAyLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICcvJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgNSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7IFJlZjogJ0FSTicgfSxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzZXJ2aWNlLmVudi5hY2NvdW50KSkudG9FcXVhbCh7XG4gICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICA0LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICB7IFJlZjogJ0FSTicgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHNlcnZpY2UuZW52LnJlZ2lvbikpLnRvRXF1YWwoe1xuICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgMyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgeyBSZWY6ICdBUk4nIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2l0aCBzZXJ2aWNlTmFtZScsICgpID0+IHtcbiAgICAgIHRlc3QoJ3doZW4gQGF3cy1jZGsvYXdzLWVjczphcm5Gb3JtYXRJbmNsdWRlc0NsdXN0ZXJOYW1lIGlzIGRpc2FibGVkLCB1c2Ugb2xkIEFSTiBmb3JtYXQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBjb25zdCBwc2V1ZG8gPSBuZXcgY2RrLlNjb3BlZEF3cyhzdGFjayk7XG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJyk7XG5cbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBjb25zdCBzZXJ2aWNlID0gZWNzLkZhcmdhdGVTZXJ2aWNlLmZyb21GYXJnYXRlU2VydmljZUF0dHJpYnV0ZXMoc3RhY2ssICdFY3NTZXJ2aWNlJywge1xuICAgICAgICAgIHNlcnZpY2VOYW1lOiAnbXktaHR0cC1zZXJ2aWNlJyxcbiAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHNlcnZpY2Uuc2VydmljZUFybikpLnRvRXF1YWwoc3RhY2sucmVzb2x2ZShgYXJuOiR7cHNldWRvLnBhcnRpdGlvbn06ZWNzOiR7cHNldWRvLnJlZ2lvbn06JHtwc2V1ZG8uYWNjb3VudElkfTpzZXJ2aWNlL215LWh0dHAtc2VydmljZWApKTtcbiAgICAgICAgZXhwZWN0KHNlcnZpY2Uuc2VydmljZU5hbWUpLnRvRXF1YWwoJ215LWh0dHAtc2VydmljZScpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3doZW4gQGF3cy1jZGsvYXdzLWVjczphcm5Gb3JtYXRJbmNsdWRlc0NsdXN0ZXJOYW1lIGlzIGVuYWJsZWQsIHVzZSBuZXcgQVJOIGZvcm1hdCcsICgpID0+IHtcbiAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gICAgICAgICAgY29udGV4dDoge1xuICAgICAgICAgICAgW0VDU19BUk5fRk9STUFUX0lOQ0xVREVTX0NMVVNURVJfTkFNRV06IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XG4gICAgICAgIGNvbnN0IHBzZXVkbyA9IG5ldyBjZGsuU2NvcGVkQXdzKHN0YWNrKTtcbiAgICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInKTtcblxuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBlY3MuRmFyZ2F0ZVNlcnZpY2UuZnJvbUZhcmdhdGVTZXJ2aWNlQXR0cmlidXRlcyhzdGFjaywgJ0Vjc1NlcnZpY2UnLCB7XG4gICAgICAgICAgc2VydmljZU5hbWU6ICdteS1odHRwLXNlcnZpY2UnLFxuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc2VydmljZS5zZXJ2aWNlQXJuKSkudG9FcXVhbChzdGFjay5yZXNvbHZlKGBhcm46JHtwc2V1ZG8ucGFydGl0aW9ufTplY3M6JHtwc2V1ZG8ucmVnaW9ufToke3BzZXVkby5hY2NvdW50SWR9OnNlcnZpY2UvJHtjbHVzdGVyLmNsdXN0ZXJOYW1lfS9teS1odHRwLXNlcnZpY2VgKSk7XG4gICAgICAgIGV4cGVjdChzZXJ2aWNlLnNlcnZpY2VOYW1lKS50b0VxdWFsKCdteS1odHRwLXNlcnZpY2UnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCBjaXJjdWl0IGJyZWFrZXInLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignQ29udGFpbmVyJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnRWNzU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIGNpcmN1aXRCcmVha2VyOiB7IHJvbGxiYWNrOiB0cnVlIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICBEZXBsb3ltZW50Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIE1heGltdW1QZXJjZW50OiAyMDAsXG4gICAgICAgICAgTWluaW11bUhlYWx0aHlQZXJjZW50OiA1MCxcbiAgICAgICAgICBEZXBsb3ltZW50Q2lyY3VpdEJyZWFrZXI6IHtcbiAgICAgICAgICAgIEVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIFJvbGxiYWNrOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIERlcGxveW1lbnRDb250cm9sbGVyOiB7XG4gICAgICAgICAgVHlwZTogZWNzLkRlcGxveW1lbnRDb250cm9sbGVyVHlwZS5FQ1MsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggY2lyY3VpdCBicmVha2VyIGFuZCBkZXBsb3ltZW50IGNvbnRyb2xsZXIgZmVhdHVyZSBmbGFnIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgZGlzYWJsZUNpcmN1aXRCcmVha2VyRWNzRGVwbG95bWVudENvbnRyb2xsZXJGZWF0dXJlRmxhZyA9XG4gICAgICAgICAgeyBbY3hhcGkuRUNTX0RJU0FCTEVfRVhQTElDSVRfREVQTE9ZTUVOVF9DT05UUk9MTEVSX0ZPUl9DSVJDVUlUX0JSRUFLRVJdOiB0cnVlIH07XG4gICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgY29udGV4dDogZGlzYWJsZUNpcmN1aXRCcmVha2VyRWNzRGVwbG95bWVudENvbnRyb2xsZXJGZWF0dXJlRmxhZyB9KTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdGYXJnYXRlVGFza0RlZicpO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ0NvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbGxvJyksXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ0Vjc1NlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBjaXJjdWl0QnJlYWtlcjogeyByb2xsYmFjazogdHJ1ZSB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgRGVwbG95bWVudENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBNYXhpbXVtUGVyY2VudDogMjAwLFxuICAgICAgICAgIE1pbmltdW1IZWFsdGh5UGVyY2VudDogNTAsXG4gICAgICAgICAgRGVwbG95bWVudENpcmN1aXRCcmVha2VyOiB7XG4gICAgICAgICAgICBFbmFibGU6IHRydWUsXG4gICAgICAgICAgICBSb2xsYmFjazogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3MgYW4gZXhjZXB0aW9uIGlmIGJvdGggc2VydmljZUFybiBhbmQgc2VydmljZU5hbWUgd2VyZSBwcm92aWRlZCBmb3IgZnJvbUVjMlNlcnZpY2VBdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgZWNzLkZhcmdhdGVTZXJ2aWNlLmZyb21GYXJnYXRlU2VydmljZUF0dHJpYnV0ZXMoc3RhY2ssICdFY3NTZXJ2aWNlJywge1xuICAgICAgICAgIHNlcnZpY2VBcm46ICdhcm46YXdzOmVjczp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOnNlcnZpY2UvbXktaHR0cC1zZXJ2aWNlJyxcbiAgICAgICAgICBzZXJ2aWNlTmFtZTogJ215LWh0dHAtc2VydmljZScsXG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9vbmx5IHNwZWNpZnkgZWl0aGVyIHNlcnZpY2VBcm4gb3Igc2VydmljZU5hbWUvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBhbiBleGNlcHRpb24gaWYgbmVpdGhlciBzZXJ2aWNlQXJuIG5vciBzZXJ2aWNlTmFtZSB3ZXJlIHByb3ZpZGVkIGZvciBmcm9tRWMyU2VydmljZUF0dHJpYnV0ZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicpO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBlY3MuRmFyZ2F0ZVNlcnZpY2UuZnJvbUZhcmdhdGVTZXJ2aWNlQXR0cmlidXRlcyhzdGFjaywgJ0Vjc1NlcnZpY2UnLCB7XG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9vbmx5IHNwZWNpZnkgZWl0aGVyIHNlcnZpY2VBcm4gb3Igc2VydmljZU5hbWUvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FsbG93cyBzZXR0aW5nIGVuYWJsZSBleGVjdXRlIGNvbW1hbmQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdGYXJnYXRlVGFza0RlZicpO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdGYXJnYXRlU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIGVuYWJsZUV4ZWN1dGVDb21tYW5kOiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgVGFza0RlZmluaXRpb246IHtcbiAgICAgICAgICBSZWY6ICdGYXJnYXRlVGFza0RlZkM2RkI2MEI0JyxcbiAgICAgICAgfSxcbiAgICAgICAgQ2x1c3Rlcjoge1xuICAgICAgICAgIFJlZjogJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcsXG4gICAgICAgIH0sXG4gICAgICAgIERlcGxveW1lbnRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgTWF4aW11bVBlcmNlbnQ6IDIwMCxcbiAgICAgICAgICBNaW5pbXVtSGVhbHRoeVBlcmNlbnQ6IDUwLFxuICAgICAgICB9LFxuICAgICAgICBMYXVuY2hUeXBlOiBMYXVuY2hUeXBlLkZBUkdBVEUsXG4gICAgICAgIEVuYWJsZUVDU01hbmFnZWRUYWdzOiBmYWxzZSxcbiAgICAgICAgRW5hYmxlRXhlY3V0ZUNvbW1hbmQ6IHRydWUsXG4gICAgICAgIE5ldHdvcmtDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgQXdzdnBjQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgQXNzaWduUHVibGljSXA6ICdESVNBQkxFRCcsXG4gICAgICAgICAgICBTZWN1cml0eUdyb3VwczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnRmFyZ2F0ZVNlcnZpY2VTZWN1cml0eUdyb3VwMEEwRTc5Q0InLFxuICAgICAgICAgICAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgU3VibmV0czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnTXlWcGNQcml2YXRlU3VibmV0MVN1Ym5ldDUwNTdDRjdFJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ015VnBjUHJpdmF0ZVN1Ym5ldDJTdWJuZXQwMDQwQzk4MycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdzc21tZXNzYWdlczpDcmVhdGVDb250cm9sQ2hhbm5lbCcsXG4gICAgICAgICAgICAgICAgJ3NzbW1lc3NhZ2VzOkNyZWF0ZURhdGFDaGFubmVsJyxcbiAgICAgICAgICAgICAgICAnc3NtbWVzc2FnZXM6T3BlbkNvbnRyb2xDaGFubmVsJyxcbiAgICAgICAgICAgICAgICAnc3NtbWVzc2FnZXM6T3BlbkRhdGFDaGFubmVsJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnbG9nczpEZXNjcmliZUxvZ0dyb3VwcycsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdsb2dzOkNyZWF0ZUxvZ1N0cmVhbScsXG4gICAgICAgICAgICAgICAgJ2xvZ3M6RGVzY3JpYmVMb2dTdHJlYW1zJyxcbiAgICAgICAgICAgICAgICAnbG9nczpQdXRMb2dFdmVudHMnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgICBQb2xpY3lOYW1lOiAnRmFyZ2F0ZVRhc2tEZWZUYXNrUm9sZURlZmF1bHRQb2xpY3k4RUIyNUJCRCcsXG4gICAgICAgIFJvbGVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnRmFyZ2F0ZVRhc2tEZWZUYXNrUm9sZTBCMjU3NTUyJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdubyBsb2dnaW5nIGVuYWJsZWQgd2hlbiBsb2dnaW5nIGZpZWxkIGlzIHNldCB0byBOT05FJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgZXhlY3V0ZUNvbW1hbmRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgbG9nZ2luZzogZWNzLkV4ZWN1dGVDb21tYW5kTG9nZ2luZy5OT05FLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdGYXJnYXRlVGFza0RlZicpO1xuXG4gICAgICBjb25zdCBsb2dHcm91cCA9IG5ldyBsb2dzLkxvZ0dyb3VwKHN0YWNrLCAnTG9nR3JvdXAnKTtcblxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbG9nZ2luZzogZWNzLkxvZ0RyaXZlcnMuYXdzTG9ncyh7XG4gICAgICAgICAgbG9nR3JvdXAsXG4gICAgICAgICAgc3RyZWFtUHJlZml4OiAnbG9nLWdyb3VwJyxcbiAgICAgICAgfSksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ0ZhcmdhdGVTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgZW5hYmxlRXhlY3V0ZUNvbW1hbmQ6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdzc21tZXNzYWdlczpDcmVhdGVDb250cm9sQ2hhbm5lbCcsXG4gICAgICAgICAgICAgICAgJ3NzbW1lc3NhZ2VzOkNyZWF0ZURhdGFDaGFubmVsJyxcbiAgICAgICAgICAgICAgICAnc3NtbWVzc2FnZXM6T3BlbkNvbnRyb2xDaGFubmVsJyxcbiAgICAgICAgICAgICAgICAnc3NtbWVzc2FnZXM6T3BlbkRhdGFDaGFubmVsJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgICAgUG9saWN5TmFtZTogJ0ZhcmdhdGVUYXNrRGVmVGFza1JvbGVEZWZhdWx0UG9saWN5OEVCMjVCQkQnLFxuICAgICAgICBSb2xlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ0ZhcmdhdGVUYXNrRGVmVGFza1JvbGUwQjI1NzU1MicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZW5hYmxlcyBleGVjdXRlIGNvbW1hbmQgbG9nZ2luZyB3aXRoIGxvZ2dpbmcgZmllbGQgc2V0IHRvIE9WRVJSSURFJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcblxuICAgICAgY29uc3QgbG9nR3JvdXAgPSBuZXcgbG9ncy5Mb2dHcm91cChzdGFjaywgJ0xvZ0dyb3VwJyk7XG5cbiAgICAgIGNvbnN0IGV4ZWNCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnRXhlY0J1Y2tldCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBleGVjdXRlQ29tbWFuZENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBsb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBjbG91ZFdhdGNoTG9nR3JvdXA6IGxvZ0dyb3VwLFxuICAgICAgICAgICAgczNCdWNrZXQ6IGV4ZWNCdWNrZXQsXG4gICAgICAgICAgICBzM0tleVByZWZpeDogJ2V4ZWMtb3V0cHV0JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGxvZ2dpbmc6IGVjcy5FeGVjdXRlQ29tbWFuZExvZ2dpbmcuT1ZFUlJJREUsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ0ZhcmdhdGVTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgZW5hYmxlRXhlY3V0ZUNvbW1hbmQ6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdzc21tZXNzYWdlczpDcmVhdGVDb250cm9sQ2hhbm5lbCcsXG4gICAgICAgICAgICAgICAgJ3NzbW1lc3NhZ2VzOkNyZWF0ZURhdGFDaGFubmVsJyxcbiAgICAgICAgICAgICAgICAnc3NtbWVzc2FnZXM6T3BlbkNvbnRyb2xDaGFubmVsJyxcbiAgICAgICAgICAgICAgICAnc3NtbWVzc2FnZXM6T3BlbkRhdGFDaGFubmVsJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnbG9nczpEZXNjcmliZUxvZ0dyb3VwcycsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdsb2dzOkNyZWF0ZUxvZ1N0cmVhbScsXG4gICAgICAgICAgICAgICAgJ2xvZ3M6RGVzY3JpYmVMb2dTdHJlYW1zJyxcbiAgICAgICAgICAgICAgICAnbG9nczpQdXRMb2dFdmVudHMnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpsb2dzOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpsb2ctZ3JvdXA6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0xvZ0dyb3VwRjVCNDY5MzEnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOionLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnczM6R2V0QnVja2V0TG9jYXRpb24nLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdzMzpQdXRPYmplY3QnLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpzMzo6OicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdFeGVjQnVja2V0Mjk1NTkzNTYnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnLyonLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgICAgUG9saWN5TmFtZTogJ0ZhcmdhdGVUYXNrRGVmVGFza1JvbGVEZWZhdWx0UG9saWN5OEVCMjVCQkQnLFxuICAgICAgICBSb2xlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ0ZhcmdhdGVUYXNrRGVmVGFza1JvbGUwQjI1NzU1MicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZW5hYmxlcyBvbmx5IGV4ZWN1dGUgY29tbWFuZCBzZXNzaW9uIGVuY3J5cHRpb24nLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuXG4gICAgICBjb25zdCBrbXNLZXkgPSBuZXcga21zLktleShzdGFjaywgJ0ttc0tleScpO1xuXG4gICAgICBjb25zdCBsb2dHcm91cCA9IG5ldyBsb2dzLkxvZ0dyb3VwKHN0YWNrLCAnTG9nR3JvdXAnKTtcblxuICAgICAgY29uc3QgZXhlY0J1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdFY3NFeGVjQnVja2V0Jyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywge1xuICAgICAgICB2cGMsXG4gICAgICAgIGV4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIGttc0tleSxcbiAgICAgICAgICBsb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBjbG91ZFdhdGNoTG9nR3JvdXA6IGxvZ0dyb3VwLFxuICAgICAgICAgICAgczNCdWNrZXQ6IGV4ZWNCdWNrZXQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBsb2dnaW5nOiBlY3MuRXhlY3V0ZUNvbW1hbmRMb2dnaW5nLk9WRVJSSURFLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ0VjMlNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBlbmFibGVFeGVjdXRlQ29tbWFuZDogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgJ3NzbW1lc3NhZ2VzOkNyZWF0ZUNvbnRyb2xDaGFubmVsJyxcbiAgICAgICAgICAgICAgICAnc3NtbWVzc2FnZXM6Q3JlYXRlRGF0YUNoYW5uZWwnLFxuICAgICAgICAgICAgICAgICdzc21tZXNzYWdlczpPcGVuQ29udHJvbENoYW5uZWwnLFxuICAgICAgICAgICAgICAgICdzc21tZXNzYWdlczpPcGVuRGF0YUNoYW5uZWwnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAna21zOkRlY3J5cHQnLFxuICAgICAgICAgICAgICAgICdrbXM6R2VuZXJhdGVEYXRhS2V5JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ0ttc0tleTQ2NjkzQUREJyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdsb2dzOkRlc2NyaWJlTG9nR3JvdXBzJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgJ2xvZ3M6Q3JlYXRlTG9nU3RyZWFtJyxcbiAgICAgICAgICAgICAgICAnbG9nczpEZXNjcmliZUxvZ1N0cmVhbXMnLFxuICAgICAgICAgICAgICAgICdsb2dzOlB1dExvZ0V2ZW50cycsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOmxvZ3M6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOmxvZy1ncm91cDonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnTG9nR3JvdXBGNUI0NjkzMScsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6KicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdzMzpHZXRCdWNrZXRMb2NhdGlvbicsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3MzOlB1dE9iamVjdCcsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOnMzOjo6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0Vjc0V4ZWNCdWNrZXQ0RjQ2ODY1MScsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICcvKicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgICBQb2xpY3lOYW1lOiAnRmFyZ2F0ZVRhc2tEZWZUYXNrUm9sZURlZmF1bHRQb2xpY3k4RUIyNUJCRCcsXG4gICAgICAgIFJvbGVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnRmFyZ2F0ZVRhc2tEZWZUYXNrUm9sZTBCMjU3NTUyJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktNUzo6S2V5Jywge1xuICAgICAgICBLZXlQb2xpY3k6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAna21zOionLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICAgIEFXUzoge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnOmlhbTo6JyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnOnJvb3QnLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZW5hYmxlcyBlbmNyeXB0aW9uIGZvciBleGVjdXRlIGNvbW1hbmQgbG9nZ2luZycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG5cbiAgICAgIGNvbnN0IGttc0tleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnS21zS2V5Jyk7XG5cbiAgICAgIGNvbnN0IGxvZ0dyb3VwID0gbmV3IGxvZ3MuTG9nR3JvdXAoc3RhY2ssICdMb2dHcm91cCcsIHtcbiAgICAgICAgZW5jcnlwdGlvbktleToga21zS2V5LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGV4ZWNCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnRWNzRXhlY0J1Y2tldCcsIHtcbiAgICAgICAgZW5jcnlwdGlvbktleToga21zS2V5LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywge1xuICAgICAgICB2cGMsXG4gICAgICAgIGV4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIGttc0tleSxcbiAgICAgICAgICBsb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBjbG91ZFdhdGNoTG9nR3JvdXA6IGxvZ0dyb3VwLFxuICAgICAgICAgICAgY2xvdWRXYXRjaEVuY3J5cHRpb25FbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgczNCdWNrZXQ6IGV4ZWNCdWNrZXQsXG4gICAgICAgICAgICBzM0VuY3J5cHRpb25FbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgczNLZXlQcmVmaXg6ICdleGVjLW91dHB1dCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBsb2dnaW5nOiBlY3MuRXhlY3V0ZUNvbW1hbmRMb2dnaW5nLk9WRVJSSURFLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ0ZhcmdhdGVTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgZW5hYmxlRXhlY3V0ZUNvbW1hbmQ6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdzc21tZXNzYWdlczpDcmVhdGVDb250cm9sQ2hhbm5lbCcsXG4gICAgICAgICAgICAgICAgJ3NzbW1lc3NhZ2VzOkNyZWF0ZURhdGFDaGFubmVsJyxcbiAgICAgICAgICAgICAgICAnc3NtbWVzc2FnZXM6T3BlbkNvbnRyb2xDaGFubmVsJyxcbiAgICAgICAgICAgICAgICAnc3NtbWVzc2FnZXM6T3BlbkRhdGFDaGFubmVsJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgICAgICAgICAna21zOkdlbmVyYXRlRGF0YUtleScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdLbXNLZXk0NjY5M0FERCcsXG4gICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnbG9nczpEZXNjcmliZUxvZ0dyb3VwcycsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdsb2dzOkNyZWF0ZUxvZ1N0cmVhbScsXG4gICAgICAgICAgICAgICAgJ2xvZ3M6RGVzY3JpYmVMb2dTdHJlYW1zJyxcbiAgICAgICAgICAgICAgICAnbG9nczpQdXRMb2dFdmVudHMnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpsb2dzOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpsb2ctZ3JvdXA6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0xvZ0dyb3VwRjVCNDY5MzEnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOionLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnczM6R2V0QnVja2V0TG9jYXRpb24nLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdzMzpQdXRPYmplY3QnLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpzMzo6OicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdFY3NFeGVjQnVja2V0NEY0Njg2NTEnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnLyonLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnczM6R2V0RW5jcnlwdGlvbkNvbmZpZ3VyYXRpb24nLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpzMzo6OicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdFY3NFeGVjQnVja2V0NEY0Njg2NTEnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgICAgUG9saWN5TmFtZTogJ0ZhcmdhdGVUYXNrRGVmVGFza1JvbGVEZWZhdWx0UG9saWN5OEVCMjVCQkQnLFxuICAgICAgICBSb2xlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ0ZhcmdhdGVUYXNrRGVmVGFza1JvbGUwQjI1NzU1MicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICAgICAgS2V5UG9saWN5OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ2ttczoqJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgICBBV1M6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJzppYW06OicsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJzpyb290JyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdrbXM6RW5jcnlwdConLFxuICAgICAgICAgICAgICAgICdrbXM6RGVjcnlwdConLFxuICAgICAgICAgICAgICAgICdrbXM6UmVFbmNyeXB0KicsXG4gICAgICAgICAgICAgICAgJ2ttczpHZW5lcmF0ZURhdGFLZXkqJyxcbiAgICAgICAgICAgICAgICAna21zOkRlc2NyaWJlKicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgICAgIEFybkxpa2U6IHtcbiAgICAgICAgICAgICAgICAgICdrbXM6RW5jcnlwdGlvbkNvbnRleHQ6YXdzOmxvZ3M6YXJuJzoge1xuICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJzpsb2dzOicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAnOionLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgICAgU2VydmljZToge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICdsb2dzLicsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJy5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3REZXByZWNhdGVkKCd3aXRoIGJvdGggcHJvcGFnYXRlVGFncyBhbmQgcHJvcGFnYXRlVGFza1RhZ3NGcm9tIGRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdGYXJnYXRlVGFza0RlZicpO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdGYXJnYXRlU2VydmljZScsIHtcbiAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICAgIHByb3BhZ2F0ZVRhZ3M6IFByb3BhZ2F0ZWRUYWdTb3VyY2UuU0VSVklDRSxcbiAgICAgICAgICBwcm9wYWdhdGVUYXNrVGFnc0Zyb206IFByb3BhZ2F0ZWRUYWdTb3VyY2UuU0VSVklDRSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9Zb3UgY2FuIG9ubHkgc3BlY2lmeSBlaXRoZXIgcHJvcGFnYXRlVGFncyBvciBwcm9wYWdhdGVUYXNrVGFnc0Zyb20uIEFsdGVybmF0aXZlbHksIHlvdSBjYW4gbGVhdmUgYm90aCBibGFuay8pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19