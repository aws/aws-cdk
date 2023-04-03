"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const autoscaling = require("@aws-cdk/aws-autoscaling");
const ec2 = require("@aws-cdk/aws-ec2");
const elb = require("@aws-cdk/aws-elasticloadbalancing");
const elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");
const kms = require("@aws-cdk/aws-kms");
const logs = require("@aws-cdk/aws-logs");
const s3 = require("@aws-cdk/aws-s3");
const cloudmap = require("@aws-cdk/aws-servicediscovery");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const cx_api_1 = require("@aws-cdk/cx-api");
const ecs = require("../../lib");
const base_service_1 = require("../../lib/base/base-service");
const placement_1 = require("../../lib/placement");
const util_1 = require("../util");
describe('ec2 service', () => {
    describe('When creating an EC2 Service', () => {
        test('with only required properties set, it correctly sets default properties', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            const service = new ecs.Ec2Service(stack, 'Ec2Service', {
                cluster,
                taskDefinition,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                TaskDefinition: {
                    Ref: 'Ec2TaskDef0226F28C',
                },
                Cluster: {
                    Ref: 'EcsCluster97242B84',
                },
                DeploymentConfiguration: {
                    MaximumPercent: 200,
                    MinimumHealthyPercent: 50,
                },
                LaunchType: base_service_1.LaunchType.EC2,
                SchedulingStrategy: 'REPLICA',
                EnableECSManagedTags: false,
            });
            expect(service.node.defaultChild).toBeDefined();
        });
        test('allows setting enable execute command', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            new ecs.Ec2Service(stack, 'Ec2Service', {
                cluster,
                taskDefinition,
                enableExecuteCommand: true,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                TaskDefinition: {
                    Ref: 'Ec2TaskDef0226F28C',
                },
                Cluster: {
                    Ref: 'EcsCluster97242B84',
                },
                DeploymentConfiguration: {
                    MaximumPercent: 200,
                    MinimumHealthyPercent: 50,
                },
                LaunchType: base_service_1.LaunchType.EC2,
                SchedulingStrategy: 'REPLICA',
                EnableECSManagedTags: false,
                EnableExecuteCommand: true,
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
                PolicyName: 'Ec2TaskDefTaskRoleDefaultPolicyA24FB970',
                Roles: [
                    {
                        Ref: 'Ec2TaskDefTaskRole400FA349',
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
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            const logGroup = new logs.LogGroup(stack, 'LogGroup');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                logging: ecs.LogDrivers.awsLogs({
                    logGroup,
                    streamPrefix: 'log-group',
                }),
                memoryLimitMiB: 512,
            });
            new ecs.Ec2Service(stack, 'Ec2Service', {
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
                PolicyName: 'Ec2TaskDefTaskRoleDefaultPolicyA24FB970',
                Roles: [
                    {
                        Ref: 'Ec2TaskDefTaskRole400FA349',
                    },
                ],
            });
        });
        test('enables execute command logging when logging field is set to OVERRIDE', () => {
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
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            new ecs.Ec2Service(stack, 'Ec2Service', {
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
                PolicyName: 'Ec2TaskDefTaskRoleDefaultPolicyA24FB970',
                Roles: [
                    {
                        Ref: 'Ec2TaskDefTaskRole400FA349',
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
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            new ecs.Ec2Service(stack, 'Ec2Service', {
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
                PolicyName: 'Ec2TaskDefTaskRoleDefaultPolicyA24FB970',
                Roles: [
                    {
                        Ref: 'Ec2TaskDefTaskRole400FA349',
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
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            new ecs.Ec2Service(stack, 'Ec2Service', {
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
                PolicyName: 'Ec2TaskDefTaskRoleDefaultPolicyA24FB970',
                Roles: [
                    {
                        Ref: 'Ec2TaskDefTaskRole400FA349',
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
        test('with custom cloudmap namespace', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            const container = taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            container.addPortMappings({ containerPort: 8000 });
            const cloudMapNamespace = new cloudmap.PrivateDnsNamespace(stack, 'TestCloudMapNamespace', {
                name: 'scorekeep.com',
                vpc,
            });
            new ecs.Ec2Service(stack, 'Ec2Service', {
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
                            Type: 'SRV',
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
        test('with all properties set', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                networkMode: ecs.NetworkMode.AWS_VPC,
            });
            cluster.addDefaultCloudMapNamespace({
                name: 'foo.com',
                type: cloudmap.NamespaceType.DNS_PRIVATE,
            });
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            // WHEN
            const service = new ecs.Ec2Service(stack, 'Ec2Service', {
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
                daemon: false,
                healthCheckGracePeriod: cdk.Duration.seconds(60),
                maxHealthyPercent: 150,
                minHealthyPercent: 55,
                deploymentController: {
                    type: ecs.DeploymentControllerType.ECS,
                },
                securityGroups: [new ec2.SecurityGroup(stack, 'SecurityGroup1', {
                        allowAllOutbound: true,
                        description: 'Example',
                        securityGroupName: 'Bob',
                        vpc,
                    })],
                serviceName: 'bonjour',
                vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
            });
            service.addPlacementConstraints(placement_1.PlacementConstraint.memberOf('attribute:ecs.instance-type =~ t2.*'));
            service.addPlacementStrategies(placement_1.PlacementStrategy.spreadAcross(ecs.BuiltInAttributes.AVAILABILITY_ZONE));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                TaskDefinition: {
                    Ref: 'Ec2TaskDef0226F28C',
                },
                Cluster: {
                    Ref: 'EcsCluster97242B84',
                },
                DeploymentConfiguration: {
                    MaximumPercent: 150,
                    MinimumHealthyPercent: 55,
                },
                DeploymentController: {
                    Type: ecs.DeploymentControllerType.ECS,
                },
                DesiredCount: 2,
                LaunchType: base_service_1.LaunchType.EC2,
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
                PlacementConstraints: [
                    {
                        Expression: 'attribute:ecs.instance-type =~ t2.*',
                        Type: 'memberOf',
                    },
                ],
                PlacementStrategies: [
                    {
                        Field: 'attribute:ecs.availability-zone',
                        Type: 'spread',
                    },
                ],
                SchedulingStrategy: 'REPLICA',
                ServiceName: 'bonjour',
                ServiceRegistries: [
                    {
                        RegistryArn: {
                            'Fn::GetAtt': [
                                'Ec2ServiceCloudmapService45B52C0F',
                                'Arn',
                            ],
                        },
                    },
                ],
            });
        });
        test('with autoscaling group capacity provider', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'Vpc');
            const cluster = new ecs.Cluster(stack, 'EcsCluster');
            const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
                vpc,
                instanceType: new ec2.InstanceType('bogus'),
                machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
            });
            // WHEN
            const capacityProvider = new ecs.AsgCapacityProvider(stack, 'provider', {
                autoScalingGroup,
                enableManagedTerminationProtection: false,
            });
            cluster.addAsgCapacityProvider(capacityProvider);
            const taskDefinition = new ecs.TaskDefinition(stack, 'ServerTask', {
                compatibility: ecs.Compatibility.EC2,
            });
            taskDefinition.addContainer('app', {
                image: new ecs.RepositoryImage('bogus'),
                cpu: 1024,
                memoryReservationMiB: 900,
                portMappings: [{
                        containerPort: 80,
                    }],
            });
            new ecs.Ec2Service(stack, 'Service', {
                cluster,
                taskDefinition,
                desiredCount: 0,
                capacityProviderStrategies: [{
                        capacityProvider: capacityProvider.capacityProviderName,
                    }],
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                CapacityProviderStrategy: [
                    {
                        CapacityProvider: {
                            Ref: 'providerD3FF4D3A',
                        },
                    },
                ],
            });
        });
        test('with multiple security groups, it correctly updates the cfn template', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                networkMode: ecs.NetworkMode.AWS_VPC,
            });
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
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
            // WHEN
            new ecs.Ec2Service(stack, 'Ec2Service', {
                cluster,
                taskDefinition,
                desiredCount: 2,
                assignPublicIp: true,
                daemon: false,
                securityGroups: [securityGroup1, securityGroup2],
                serviceName: 'bonjour',
                vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                TaskDefinition: {
                    Ref: 'Ec2TaskDef0226F28C',
                },
                Cluster: {
                    Ref: 'EcsCluster97242B84',
                },
                DesiredCount: 2,
                LaunchType: base_service_1.LaunchType.EC2,
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
                            {
                                'Fn::GetAtt': [
                                    'SecurityGroup23BE86BB7',
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
                SchedulingStrategy: 'REPLICA',
                ServiceName: 'bonjour',
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
        test('sets task definition to family when CODE_DEPLOY deployment controller is specified', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            new ecs.Ec2Service(stack, 'Ec2Service', {
                cluster,
                taskDefinition,
                deploymentController: {
                    type: ecs.DeploymentControllerType.CODE_DEPLOY,
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResource('AWS::ECS::Service', {
                Properties: {
                    TaskDefinition: 'Ec2TaskDef',
                    DeploymentController: {
                        Type: 'CODE_DEPLOY',
                    },
                },
                DependsOn: [
                    'Ec2TaskDef0226F28C',
                    'Ec2TaskDefTaskRole400FA349',
                ],
            });
        });
        cdk_build_tools_1.testDeprecated('throws when both securityGroup and securityGroups are supplied', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                networkMode: ecs.NetworkMode.AWS_VPC,
            });
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
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
            // THEN
            expect(() => {
                new ecs.Ec2Service(stack, 'Ec2Service', {
                    cluster,
                    taskDefinition,
                    desiredCount: 2,
                    assignPublicIp: true,
                    maxHealthyPercent: 150,
                    minHealthyPercent: 55,
                    securityGroup: securityGroup1,
                    securityGroups: [securityGroup2],
                    serviceName: 'bonjour',
                    vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
                });
            }).toThrow(/Only one of SecurityGroup or SecurityGroups can be populated./);
        });
        test('throws when task definition is not EC2 compatible', () => {
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            const taskDefinition = new ecs.TaskDefinition(stack, 'FargateTaskDef', {
                compatibility: ecs.Compatibility.FARGATE,
                cpu: '256',
                memoryMiB: '512',
            });
            taskDefinition.addContainer('BaseContainer', {
                image: ecs.ContainerImage.fromRegistry('test'),
                memoryReservationMiB: 10,
            });
            // THEN
            expect(() => {
                new ecs.Ec2Service(stack, 'Ec2Service', {
                    cluster,
                    taskDefinition,
                });
            }).toThrow(/Supplied TaskDefinition is not configured for compatibility with EC2/);
        });
        test('ignore task definition and launch type if deployment controller is set to be EXTERNAL', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            new ecs.Ec2Service(stack, 'Ec2Service', {
                cluster,
                taskDefinition,
                deploymentController: {
                    type: base_service_1.DeploymentControllerType.EXTERNAL,
                },
            });
            // THEN
            assertions_1.Annotations.fromStack(stack).hasWarning('/Default/Ec2Service', 'taskDefinition and launchType are blanked out when using external deployment controller.');
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                Cluster: {
                    Ref: 'EcsCluster97242B84',
                },
                DeploymentConfiguration: {
                    MaximumPercent: 200,
                    MinimumHealthyPercent: 50,
                },
                SchedulingStrategy: 'REPLICA',
                EnableECSManagedTags: false,
            });
        });
        test('add warning to annotations if circuitBreaker is specified with a non-ECS DeploymentControllerType', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            const service = new ecs.Ec2Service(stack, 'Ec2Service', {
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
        test('errors if daemon and desiredCount both specified', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('BaseContainer', {
                image: ecs.ContainerImage.fromRegistry('test'),
                memoryReservationMiB: 10,
            });
            // THEN
            expect(() => {
                new ecs.Ec2Service(stack, 'Ec2Service', {
                    cluster,
                    taskDefinition,
                    daemon: true,
                    desiredCount: 2,
                });
            }).toThrow(/Don't supply desiredCount/);
        });
        test('errors if daemon and maximumPercent not 100', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('BaseContainer', {
                image: ecs.ContainerImage.fromRegistry('test'),
                memoryReservationMiB: 10,
            });
            // THEN
            expect(() => {
                new ecs.Ec2Service(stack, 'Ec2Service', {
                    cluster,
                    taskDefinition,
                    daemon: true,
                    maxHealthyPercent: 300,
                });
            }).toThrow(/Maximum percent must be 100 for daemon mode./);
        });
        test('errors if minimum not less than maximum', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('BaseContainer', {
                image: ecs.ContainerImage.fromRegistry('test'),
                memoryReservationMiB: 10,
            });
            // THEN
            expect(() => {
                new ecs.Ec2Service(stack, 'Ec2Service', {
                    cluster,
                    taskDefinition,
                    daemon: true,
                    minHealthyPercent: 100,
                    maxHealthyPercent: 100,
                });
            }).toThrow(/Minimum healthy percent must be less than maximum healthy percent./);
        });
        test('errors if no container definitions', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            // Errors on validation, not on construction.
            new ecs.Ec2Service(stack, 'Ec2Service', {
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
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            new ecs.Ec2Service(stack, 'FargateService', {
                cluster,
                taskDefinition,
            });
            // Add the container *after* creating the service
            taskDefinition.addContainer('main', {
                image: ecs.ContainerImage.fromRegistry('somecontainer'),
                memoryReservationMiB: 10,
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
        test('sets daemon scheduling strategy', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            new ecs.Ec2Service(stack, 'Ec2Service', {
                cluster,
                taskDefinition,
                daemon: true,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                SchedulingStrategy: 'DAEMON',
                DeploymentConfiguration: {
                    MaximumPercent: 100,
                    MinimumHealthyPercent: 0,
                },
            });
        });
        describe('with a TaskDefinition with Bridge network mode', () => {
            test('it errors if vpcSubnets is specified', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new ec2.Vpc(stack, 'MyVpc', {});
                const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
                util_1.addDefaultCapacityProvider(cluster, stack, vpc);
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                    networkMode: ecs.NetworkMode.BRIDGE,
                });
                taskDefinition.addContainer('web', {
                    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                    memoryLimitMiB: 512,
                });
                // THEN
                expect(() => {
                    new ecs.Ec2Service(stack, 'Ec2Service', {
                        cluster,
                        taskDefinition,
                        vpcSubnets: {
                            subnetType: ec2.SubnetType.PUBLIC,
                        },
                    });
                });
                // THEN
            });
            test('it errors if assignPublicIp is true', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new ec2.Vpc(stack, 'MyVpc', {});
                const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
                util_1.addDefaultCapacityProvider(cluster, stack, vpc);
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                    networkMode: ecs.NetworkMode.BRIDGE,
                });
                taskDefinition.addContainer('web', {
                    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                    memoryLimitMiB: 512,
                });
                // THEN
                expect(() => {
                    new ecs.Ec2Service(stack, 'Ec2Service', {
                        cluster,
                        taskDefinition,
                        assignPublicIp: true,
                    });
                }).toThrow(/vpcSubnets, securityGroup\(s\) and assignPublicIp can only be used in AwsVpc networking mode/);
                // THEN
            });
            test('it errors if vpc subnets is provided', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new ec2.Vpc(stack, 'MyVpc', {});
                const subnet = new ec2.Subnet(stack, 'MySubnet', {
                    vpcId: vpc.vpcId,
                    availabilityZone: 'eu-central-1a',
                    cidrBlock: '10.10.0.0/20',
                });
                const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
                util_1.addDefaultCapacityProvider(cluster, stack, vpc);
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                    networkMode: ecs.NetworkMode.BRIDGE,
                });
                taskDefinition.addContainer('web', {
                    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                    memoryLimitMiB: 512,
                });
                // THEN
                expect(() => {
                    new ecs.Ec2Service(stack, 'Ec2Service', {
                        cluster,
                        taskDefinition,
                        vpcSubnets: {
                            subnets: [subnet],
                        },
                    });
                }).toThrow(/vpcSubnets, securityGroup\(s\) and assignPublicIp can only be used in AwsVpc networking mode/);
                // THEN
            });
            test('it errors if security group is provided', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new ec2.Vpc(stack, 'MyVpc', {});
                const securityGroup = new ec2.SecurityGroup(stack, 'MySG', { vpc });
                const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
                util_1.addDefaultCapacityProvider(cluster, stack, vpc);
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                    networkMode: ecs.NetworkMode.BRIDGE,
                });
                taskDefinition.addContainer('web', {
                    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                    memoryLimitMiB: 512,
                });
                // THEN
                expect(() => {
                    new ecs.Ec2Service(stack, 'Ec2Service', {
                        cluster,
                        taskDefinition,
                        securityGroups: [securityGroup],
                    });
                }).toThrow(/vpcSubnets, securityGroup\(s\) and assignPublicIp can only be used in AwsVpc networking mode/);
                // THEN
            });
            test('it errors if multiple security groups is provided', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new ec2.Vpc(stack, 'MyVpc', {});
                const securityGroups = [
                    new ec2.SecurityGroup(stack, 'MyFirstSG', { vpc }),
                    new ec2.SecurityGroup(stack, 'MySecondSG', { vpc }),
                ];
                const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
                util_1.addDefaultCapacityProvider(cluster, stack, vpc);
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                    networkMode: ecs.NetworkMode.BRIDGE,
                });
                taskDefinition.addContainer('web', {
                    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                    memoryLimitMiB: 512,
                });
                // THEN
                expect(() => {
                    new ecs.Ec2Service(stack, 'Ec2Service', {
                        cluster,
                        taskDefinition,
                        securityGroups,
                    });
                }).toThrow(/vpcSubnets, securityGroup\(s\) and assignPublicIp can only be used in AwsVpc networking mode/);
                // THEN
            });
        });
        describe('with a TaskDefinition with AwsVpc network mode', () => {
            test('it creates a security group for the service', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new ec2.Vpc(stack, 'MyVpc', {});
                const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
                util_1.addDefaultCapacityProvider(cluster, stack, vpc);
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                    networkMode: ecs.NetworkMode.AWS_VPC,
                });
                taskDefinition.addContainer('web', {
                    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                    memoryLimitMiB: 512,
                });
                new ecs.Ec2Service(stack, 'Ec2Service', {
                    cluster,
                    taskDefinition,
                });
                // THEN
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                    NetworkConfiguration: {
                        AwsvpcConfiguration: {
                            AssignPublicIp: 'DISABLED',
                            SecurityGroups: [
                                {
                                    'Fn::GetAtt': [
                                        'Ec2ServiceSecurityGroupAEC30825',
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
            test('it allows vpcSubnets', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new ec2.Vpc(stack, 'MyVpc', {});
                const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
                util_1.addDefaultCapacityProvider(cluster, stack, vpc);
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                    networkMode: ecs.NetworkMode.AWS_VPC,
                });
                taskDefinition.addContainer('web', {
                    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                    memoryLimitMiB: 512,
                });
                new ecs.Ec2Service(stack, 'Ec2Service', {
                    cluster,
                    taskDefinition,
                    vpcSubnets: {
                        subnetType: ec2.SubnetType.PUBLIC,
                    },
                });
                // THEN
            });
        });
        test('with distinctInstance placement constraint', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            new ecs.Ec2Service(stack, 'Ec2Service', {
                cluster,
                taskDefinition,
                placementConstraints: [ecs.PlacementConstraint.distinctInstances()],
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                PlacementConstraints: [{
                        Type: 'distinctInstance',
                    }],
            });
        });
        test('with memberOf placement constraints', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            const service = new ecs.Ec2Service(stack, 'Ec2Service', {
                cluster,
                taskDefinition,
            });
            service.addPlacementConstraints(placement_1.PlacementConstraint.memberOf('attribute:ecs.instance-type =~ t2.*'));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                PlacementConstraints: [{
                        Expression: 'attribute:ecs.instance-type =~ t2.*',
                        Type: 'memberOf',
                    }],
            });
        });
        test('with spreadAcross container instances strategy', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            const service = new ecs.Ec2Service(stack, 'Ec2Service', {
                cluster,
                taskDefinition,
            });
            // WHEN
            service.addPlacementStrategies(placement_1.PlacementStrategy.spreadAcrossInstances());
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                PlacementStrategies: [{
                        Field: 'instanceId',
                        Type: 'spread',
                    }],
            });
        });
        test('with spreadAcross placement strategy', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            const service = new ecs.Ec2Service(stack, 'Ec2Service', {
                cluster,
                taskDefinition,
            });
            service.addPlacementStrategies(placement_1.PlacementStrategy.spreadAcross(ecs.BuiltInAttributes.AVAILABILITY_ZONE));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                PlacementStrategies: [{
                        Field: 'attribute:ecs.availability-zone',
                        Type: 'spread',
                    }],
            });
        });
        test('can turn PlacementStrategy into json format', () => {
            // THEN
            expect(placement_1.PlacementStrategy.spreadAcross(ecs.BuiltInAttributes.AVAILABILITY_ZONE).toJson()).toEqual([{
                    type: 'spread',
                    field: 'attribute:ecs.availability-zone',
                }]);
        });
        test('can turn PlacementConstraints into json format', () => {
            // THEN
            expect(placement_1.PlacementConstraint.distinctInstances().toJson()).toEqual([{
                    type: 'distinctInstance',
                }]);
        });
        test('errors when spreadAcross with no input', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            const service = new ecs.Ec2Service(stack, 'Ec2Service', {
                cluster,
                taskDefinition,
            });
            // THEN
            expect(() => {
                service.addPlacementStrategies(placement_1.PlacementStrategy.spreadAcross());
            }).toThrow('spreadAcross: give at least one field to spread by');
        });
        test('errors with spreadAcross placement strategy if daemon specified', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            const service = new ecs.Ec2Service(stack, 'Ec2Service', {
                cluster,
                taskDefinition,
                daemon: true,
            });
            // THEN
            expect(() => {
                service.addPlacementStrategies(placement_1.PlacementStrategy.spreadAcross(ecs.BuiltInAttributes.AVAILABILITY_ZONE));
            });
        });
        test('with no placement constraints', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            new ecs.Ec2Service(stack, 'Ec2Service', {
                cluster,
                taskDefinition,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                PlacementConstraints: assertions_1.Match.absent(),
            });
        });
        cdk_build_tools_1.testDeprecated('with both propagateTags and propagateTaskTagsFrom defined', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            expect(() => {
                new ecs.Ec2Service(stack, 'Ec2Service', {
                    cluster,
                    taskDefinition,
                    propagateTags: base_service_1.PropagatedTagSource.SERVICE,
                    propagateTaskTagsFrom: base_service_1.PropagatedTagSource.SERVICE,
                });
            }).toThrow(/You can only specify either propagateTags or propagateTaskTagsFrom. Alternatively, you can leave both blank/);
        });
        test('with no placement strategy if daemon specified', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            new ecs.Ec2Service(stack, 'Ec2Service', {
                cluster,
                taskDefinition,
                daemon: true,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                PlacementStrategies: assertions_1.Match.absent(),
            });
        });
        test('with random placement strategy', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc');
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            const service = new ecs.Ec2Service(stack, 'Ec2Service', {
                cluster,
                taskDefinition,
            });
            service.addPlacementStrategies(placement_1.PlacementStrategy.randomly());
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                PlacementStrategies: [{
                        Type: 'random',
                    }],
            });
        });
        test('errors with random placement strategy if daemon specified', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc');
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            const service = new ecs.Ec2Service(stack, 'Ec2Service', {
                cluster,
                taskDefinition,
                daemon: true,
            });
            // THEN
            expect(() => {
                service.addPlacementStrategies(placement_1.PlacementStrategy.randomly());
            }).toThrow();
        });
        test('with packedbyCpu placement strategy', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            const service = new ecs.Ec2Service(stack, 'Ec2Service', {
                cluster,
                taskDefinition,
            });
            service.addPlacementStrategies(placement_1.PlacementStrategy.packedByCpu());
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                PlacementStrategies: [{
                        Field: 'CPU',
                        Type: 'binpack',
                    }],
            });
        });
        test('with packedbyMemory placement strategy', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            const service = new ecs.Ec2Service(stack, 'Ec2Service', {
                cluster,
                taskDefinition,
            });
            service.addPlacementStrategies(placement_1.PlacementStrategy.packedByMemory());
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                PlacementStrategies: [{
                        Field: 'MEMORY',
                        Type: 'binpack',
                    }],
            });
        });
        test('with packedBy placement strategy', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            const service = new ecs.Ec2Service(stack, 'Ec2Service', {
                cluster,
                taskDefinition,
            });
            service.addPlacementStrategies(placement_1.PlacementStrategy.packedBy(ecs.BinPackResource.MEMORY));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                PlacementStrategies: [{
                        Field: 'MEMORY',
                        Type: 'binpack',
                    }],
            });
        });
        test('errors with packedBy placement strategy if daemon specified', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            const service = new ecs.Ec2Service(stack, 'Ec2Service', {
                cluster,
                taskDefinition,
                daemon: true,
            });
            // THEN
            expect(() => {
                service.addPlacementStrategies(placement_1.PlacementStrategy.packedBy(ecs.BinPackResource.MEMORY));
            }).toThrow();
        });
    });
    describe('attachToClassicLB', () => {
        test('allows network mode of task definition to be host', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'VPC');
            const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TD', { networkMode: ecs.NetworkMode.HOST });
            const container = taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('test'),
                memoryLimitMiB: 1024,
            });
            container.addPortMappings({ containerPort: 808 });
            const service = new ecs.Ec2Service(stack, 'Service', {
                cluster,
                taskDefinition,
            });
            // THEN
            const lb = new elb.LoadBalancer(stack, 'LB', { vpc });
            service.attachToClassicLB(lb);
        });
        test('allows network mode of task definition to be bridge', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'VPC');
            const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TD', { networkMode: ecs.NetworkMode.BRIDGE });
            const container = taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('test'),
                memoryLimitMiB: 1024,
            });
            container.addPortMappings({ containerPort: 808 });
            const service = new ecs.Ec2Service(stack, 'Service', {
                cluster,
                taskDefinition,
            });
            // THEN
            const lb = new elb.LoadBalancer(stack, 'LB', { vpc });
            service.attachToClassicLB(lb);
        });
        test('throws when network mode of task definition is AwsVpc', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'VPC');
            const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TD', { networkMode: ecs.NetworkMode.AWS_VPC });
            const container = taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('test'),
                memoryLimitMiB: 1024,
            });
            container.addPortMappings({ containerPort: 808 });
            const service = new ecs.Ec2Service(stack, 'Service', {
                cluster,
                taskDefinition,
            });
            // THEN
            const lb = new elb.LoadBalancer(stack, 'LB', { vpc });
            expect(() => {
                service.attachToClassicLB(lb);
            }).toThrow(/Cannot use a Classic Load Balancer if NetworkMode is AwsVpc. Use Host or Bridge instead./);
        });
        test('throws when network mode of task definition is none', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'VPC');
            const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TD', { networkMode: ecs.NetworkMode.NONE });
            const container = taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('test'),
                memoryLimitMiB: 1024,
            });
            container.addPortMappings({ containerPort: 808 });
            const service = new ecs.Ec2Service(stack, 'Service', {
                cluster,
                taskDefinition,
            });
            // THEN
            const lb = new elb.LoadBalancer(stack, 'LB', { vpc });
            expect(() => {
                service.attachToClassicLB(lb);
            }).toThrow(/Cannot use a Classic Load Balancer if NetworkMode is None. Use Host or Bridge instead./);
        });
    });
    describe('attachToApplicationTargetGroup', () => {
        test('allows network mode of task definition to be other than none', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', { networkMode: ecs.NetworkMode.AWS_VPC });
            const container = taskDefinition.addContainer('MainContainer', {
                image: ecs.ContainerImage.fromRegistry('hello'),
            });
            container.addPortMappings({ containerPort: 8000 });
            const service = new ecs.Ec2Service(stack, 'Service', {
                cluster,
                taskDefinition,
            });
            const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
            const listener = lb.addListener('listener', { port: 80 });
            const targetGroup = listener.addTargets('target', {
                port: 80,
            });
            // THEN
            service.attachToApplicationTargetGroup(targetGroup);
        });
        test('throws when network mode of task definition is none', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', { networkMode: ecs.NetworkMode.NONE });
            const container = taskDefinition.addContainer('MainContainer', {
                image: ecs.ContainerImage.fromRegistry('hello'),
            });
            container.addPortMappings({ containerPort: 8000 });
            const service = new ecs.Ec2Service(stack, 'Service', {
                cluster,
                taskDefinition,
            });
            const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
            const listener = lb.addListener('listener', { port: 80 });
            const targetGroup = listener.addTargets('target', {
                port: 80,
            });
            // THEN
            expect(() => {
                service.attachToApplicationTargetGroup(targetGroup);
            }).toThrow(/Cannot use a load balancer if NetworkMode is None. Use Bridge, Host or AwsVpc instead./);
        });
        describe('correctly setting ingress and egress port', () => {
            test('with bridge/NAT network mode and 0 host port', () => {
                [ecs.NetworkMode.BRIDGE, ecs.NetworkMode.NAT].forEach((networkMode) => {
                    // GIVEN
                    const stack = new cdk.Stack();
                    const vpc = new ec2.Vpc(stack, 'MyVpc', {});
                    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
                    util_1.addDefaultCapacityProvider(cluster, stack, vpc);
                    cluster.connections.addSecurityGroup();
                    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', { networkMode });
                    const container = taskDefinition.addContainer('MainContainer', {
                        image: ecs.ContainerImage.fromRegistry('hello'),
                        memoryLimitMiB: 512,
                    });
                    container.addPortMappings({ containerPort: 8000 });
                    container.addPortMappings({ containerPort: 8001 });
                    const service = new ecs.Ec2Service(stack, 'Service', {
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
                                containerPort: 8001,
                            })],
                    });
                    // THEN
                    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
                        Description: 'Load balancer to target',
                        FromPort: 32768,
                        ToPort: 65535,
                    });
                    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
                        Description: 'Load balancer to target',
                        FromPort: 32768,
                        ToPort: 65535,
                    });
                });
            });
            test('with bridge/NAT network mode and host port other than 0', () => {
                [ecs.NetworkMode.BRIDGE, ecs.NetworkMode.NAT].forEach((networkMode) => {
                    // GIVEN
                    const stack = new cdk.Stack();
                    const vpc = new ec2.Vpc(stack, 'MyVpc', {});
                    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
                    util_1.addDefaultCapacityProvider(cluster, stack, vpc);
                    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', { networkMode });
                    const container = taskDefinition.addContainer('MainContainer', {
                        image: ecs.ContainerImage.fromRegistry('hello'),
                        memoryLimitMiB: 512,
                    });
                    container.addPortMappings({ containerPort: 8000 });
                    container.addPortMappings({ containerPort: 8001, hostPort: 80 });
                    const service = new ecs.Ec2Service(stack, 'Service', {
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
                                containerPort: 8001,
                            })],
                    });
                    // THEN
                    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
                        Description: 'Load balancer to target',
                        FromPort: 80,
                        ToPort: 80,
                    });
                    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
                        Description: 'Load balancer to target',
                        FromPort: 80,
                        ToPort: 80,
                    });
                });
            });
            test('with host network mode', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new ec2.Vpc(stack, 'MyVpc', {});
                const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
                util_1.addDefaultCapacityProvider(cluster, stack, vpc);
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', { networkMode: ecs.NetworkMode.HOST });
                const container = taskDefinition.addContainer('MainContainer', {
                    image: ecs.ContainerImage.fromRegistry('hello'),
                    memoryLimitMiB: 512,
                });
                container.addPortMappings({ containerPort: 8000 });
                container.addPortMappings({ containerPort: 8001 });
                const service = new ecs.Ec2Service(stack, 'Service', {
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
                            containerPort: 8001,
                        })],
                });
                // THEN
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
                    Description: 'Load balancer to target',
                    FromPort: 8001,
                    ToPort: 8001,
                });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
                    Description: 'Load balancer to target',
                    FromPort: 8001,
                    ToPort: 8001,
                });
            });
            test('with aws_vpc network mode', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new ec2.Vpc(stack, 'MyVpc', {});
                const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
                util_1.addDefaultCapacityProvider(cluster, stack, vpc);
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', { networkMode: ecs.NetworkMode.AWS_VPC });
                const container = taskDefinition.addContainer('MainContainer', {
                    image: ecs.ContainerImage.fromRegistry('hello'),
                    memoryLimitMiB: 512,
                });
                container.addPortMappings({ containerPort: 8000 });
                container.addPortMappings({ containerPort: 8001 });
                const service = new ecs.Ec2Service(stack, 'Service', {
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
                            containerPort: 8001,
                        })],
                });
                // THEN
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
                    Description: 'Load balancer to target',
                    FromPort: 8001,
                    ToPort: 8001,
                });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
                    Description: 'Load balancer to target',
                    FromPort: 8001,
                    ToPort: 8001,
                });
            });
        });
    });
    describe('attachToNetworkTargetGroup', () => {
        test('allows network mode of task definition to be other than none', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', { networkMode: ecs.NetworkMode.AWS_VPC });
            const container = taskDefinition.addContainer('MainContainer', {
                image: ecs.ContainerImage.fromRegistry('hello'),
            });
            container.addPortMappings({ containerPort: 8000 });
            const service = new ecs.Ec2Service(stack, 'Service', {
                cluster,
                taskDefinition,
            });
            const lb = new elbv2.NetworkLoadBalancer(stack, 'lb', { vpc });
            const listener = lb.addListener('listener', { port: 80 });
            const targetGroup = listener.addTargets('target', {
                port: 80,
            });
            // THEN
            service.attachToNetworkTargetGroup(targetGroup);
        });
        test('throws when network mode of task definition is none', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', { networkMode: ecs.NetworkMode.NONE });
            const container = taskDefinition.addContainer('MainContainer', {
                image: ecs.ContainerImage.fromRegistry('hello'),
            });
            container.addPortMappings({ containerPort: 8000 });
            const service = new ecs.Ec2Service(stack, 'Service', {
                cluster,
                taskDefinition,
            });
            const lb = new elbv2.NetworkLoadBalancer(stack, 'lb', { vpc });
            const listener = lb.addListener('listener', { port: 80 });
            const targetGroup = listener.addTargets('target', {
                port: 80,
            });
            // THEN
            expect(() => {
                service.attachToNetworkTargetGroup(targetGroup);
            }).toThrow(/Cannot use a load balancer if NetworkMode is None. Use Bridge, Host or AwsVpc instead./);
        });
    });
    describe('classic ELB', () => {
        test('can attach to classic ELB', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'VPC');
            const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TD', { networkMode: ecs.NetworkMode.HOST });
            const container = taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('test'),
                memoryLimitMiB: 1024,
            });
            container.addPortMappings({ containerPort: 808 });
            const service = new ecs.Ec2Service(stack, 'Service', {
                cluster,
                taskDefinition,
            });
            // WHEN
            const lb = new elb.LoadBalancer(stack, 'LB', { vpc });
            lb.addTarget(service);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                LoadBalancers: [
                    {
                        ContainerName: 'web',
                        ContainerPort: 808,
                        LoadBalancerName: { Ref: 'LB8A12904C' },
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                // if any load balancer is configured and healthCheckGracePeriodSeconds is not
                // set, then it should default to 60 seconds.
                HealthCheckGracePeriodSeconds: 60,
            });
        });
        test('can attach any container and port as a target', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'VPC');
            const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TD', { networkMode: ecs.NetworkMode.HOST });
            const container = taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('test'),
                memoryLimitMiB: 1024,
            });
            container.addPortMappings({ containerPort: 808 });
            container.addPortMappings({ containerPort: 8080 });
            const service = new ecs.Ec2Service(stack, 'Service', {
                cluster,
                taskDefinition,
            });
            // WHEN
            const lb = new elb.LoadBalancer(stack, 'LB', { vpc });
            lb.addTarget(service.loadBalancerTarget({
                containerName: 'web',
                containerPort: 8080,
            }));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                LoadBalancers: [
                    {
                        ContainerName: 'web',
                        ContainerPort: 8080,
                        LoadBalancerName: { Ref: 'LB8A12904C' },
                    },
                ],
            });
        });
    });
    describe('When enabling service discovery', () => {
        test('throws if namespace has not been added to cluster', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            // default network mode is bridge
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            const container = taskDefinition.addContainer('MainContainer', {
                image: ecs.ContainerImage.fromRegistry('hello'),
                memoryLimitMiB: 512,
            });
            container.addPortMappings({ containerPort: 8000 });
            // THEN
            expect(() => {
                new ecs.Ec2Service(stack, 'Service', {
                    cluster,
                    taskDefinition,
                    cloudMapOptions: {
                        name: 'myApp',
                    },
                });
            }).toThrow(/Cannot enable service discovery if a Cloudmap Namespace has not been created in the cluster./);
        });
        test('fails to enable Service Discovery with HTTP defaultCloudmapNamespace', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                networkMode: ecs.NetworkMode.NONE,
            });
            const container = taskDefinition.addContainer('MainContainer', {
                image: ecs.ContainerImage.fromRegistry('hello'),
                memoryLimitMiB: 512,
            });
            container.addPortMappings({ containerPort: 8000 });
            cluster.addDefaultCloudMapNamespace({ name: 'foo.com', type: cloudmap.NamespaceType.HTTP });
            // THEN
            expect(() => {
                new ecs.Ec2Service(stack, 'Service', {
                    cluster,
                    taskDefinition,
                    cloudMapOptions: {
                        name: 'myApp',
                    },
                });
            }).toThrow(/Cannot enable DNS service discovery for HTTP Cloudmap Namespace./);
        });
        test('throws if network mode is none', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                networkMode: ecs.NetworkMode.NONE,
            });
            const container = taskDefinition.addContainer('MainContainer', {
                image: ecs.ContainerImage.fromRegistry('hello'),
                memoryLimitMiB: 512,
            });
            container.addPortMappings({ containerPort: 8000 });
            cluster.addDefaultCloudMapNamespace({ name: 'foo.com' });
            // THEN
            expect(() => {
                new ecs.Ec2Service(stack, 'Service', {
                    cluster,
                    taskDefinition,
                    cloudMapOptions: {
                        name: 'myApp',
                    },
                });
            }).toThrow(/Cannot use a service discovery if NetworkMode is None. Use Bridge, Host or AwsVpc instead./);
        });
        test('creates AWS Cloud Map service for Private DNS namespace with bridge network mode', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            // default network mode is bridge
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
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
            new ecs.Ec2Service(stack, 'Service', {
                cluster,
                taskDefinition,
                cloudMapOptions: {
                    name: 'myApp',
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                ServiceRegistries: [
                    {
                        ContainerName: 'MainContainer',
                        ContainerPort: 8000,
                        RegistryArn: {
                            'Fn::GetAtt': [
                                'ServiceCloudmapService046058A4',
                                'Arn',
                            ],
                        },
                    },
                ],
            });
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
        test('creates AWS Cloud Map service for Private DNS namespace with host network mode', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                networkMode: ecs.NetworkMode.HOST,
            });
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
            new ecs.Ec2Service(stack, 'Service', {
                cluster,
                taskDefinition,
                cloudMapOptions: {
                    name: 'myApp',
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                ServiceRegistries: [
                    {
                        ContainerName: 'MainContainer',
                        ContainerPort: 8000,
                        RegistryArn: {
                            'Fn::GetAtt': [
                                'ServiceCloudmapService046058A4',
                                'Arn',
                            ],
                        },
                    },
                ],
            });
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
        test('throws if wrong DNS record type specified with bridge network mode', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            // default network mode is bridge
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            const container = taskDefinition.addContainer('MainContainer', {
                image: ecs.ContainerImage.fromRegistry('hello'),
                memoryLimitMiB: 512,
            });
            container.addPortMappings({ containerPort: 8000 });
            cluster.addDefaultCloudMapNamespace({
                name: 'foo.com',
            });
            // THEN
            expect(() => {
                new ecs.Ec2Service(stack, 'Service', {
                    cluster,
                    taskDefinition,
                    cloudMapOptions: {
                        name: 'myApp',
                        dnsRecordType: cloudmap.DnsRecordType.A,
                    },
                });
            }).toThrow(/SRV records must be used when network mode is Bridge or Host./);
        });
        test('creates AWS Cloud Map service for Private DNS namespace with AwsVpc network mode', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                networkMode: ecs.NetworkMode.AWS_VPC,
            });
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
            new ecs.Ec2Service(stack, 'Service', {
                cluster,
                taskDefinition,
                cloudMapOptions: {
                    name: 'myApp',
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                ServiceRegistries: [
                    {
                        RegistryArn: {
                            'Fn::GetAtt': [
                                'ServiceCloudmapService046058A4',
                                'Arn',
                            ],
                        },
                    },
                ],
            });
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
        test('creates AWS Cloud Map service for Private DNS namespace with AwsVpc network mode with SRV records', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                networkMode: ecs.NetworkMode.AWS_VPC,
            });
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
            new ecs.Ec2Service(stack, 'Service', {
                cluster,
                taskDefinition,
                cloudMapOptions: {
                    name: 'myApp',
                    dnsRecordType: cloudmap.DnsRecordType.SRV,
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                ServiceRegistries: [
                    {
                        ContainerName: 'MainContainer',
                        ContainerPort: 8000,
                        RegistryArn: {
                            'Fn::GetAtt': [
                                'ServiceCloudmapService046058A4',
                                'Arn',
                            ],
                        },
                    },
                ],
            });
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
        test('user can select any container and port', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            cluster.addDefaultCloudMapNamespace({
                name: 'foo.com',
                type: cloudmap.NamespaceType.DNS_PRIVATE,
            });
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'FargateTaskDef', {
                networkMode: ecs.NetworkMode.BRIDGE,
            });
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
            // WHEN
            new ecs.Ec2Service(stack, 'Service', {
                cluster,
                taskDefinition,
                cloudMapOptions: {
                    dnsRecordType: cloudmap.DnsRecordType.SRV,
                    container: otherContainer,
                    containerPort: 8001,
                },
            });
            // THEN
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
        test('By default, the container name is the default', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            cluster.addDefaultCloudMapNamespace({
                name: 'foo.com',
                type: cloudmap.NamespaceType.DNS_PRIVATE,
            });
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Task', {
                networkMode: ecs.NetworkMode.BRIDGE,
            });
            taskDefinition.addContainer('main', {
                image: ecs.ContainerImage.fromRegistry('some'),
                memoryLimitMiB: 512,
            }).addPortMappings({ containerPort: 1234 });
            taskDefinition.addContainer('second', {
                image: ecs.ContainerImage.fromRegistry('some'),
                memoryLimitMiB: 512,
            }).addPortMappings({ containerPort: 4321 });
            // WHEN
            new ecs.Ec2Service(stack, 'Service', {
                cluster,
                taskDefinition,
                cloudMapOptions: {},
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                ServiceRegistries: [assertions_1.Match.objectLike({
                        ContainerName: 'main',
                        ContainerPort: assertions_1.Match.anyValue(),
                    })],
            });
        });
        test('For SRV, by default, container name is default container and port is the default container port', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            cluster.addDefaultCloudMapNamespace({
                name: 'foo.com',
                type: cloudmap.NamespaceType.DNS_PRIVATE,
            });
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Task', {
                networkMode: ecs.NetworkMode.BRIDGE,
            });
            taskDefinition.addContainer('main', {
                image: ecs.ContainerImage.fromRegistry('some'),
                memoryLimitMiB: 512,
            }).addPortMappings({ containerPort: 1234 });
            taskDefinition.addContainer('second', {
                image: ecs.ContainerImage.fromRegistry('some'),
                memoryLimitMiB: 512,
            }).addPortMappings({ containerPort: 4321 });
            // WHEN
            new ecs.Ec2Service(stack, 'Service', {
                cluster,
                taskDefinition,
                cloudMapOptions: {
                    dnsRecordType: cloudmap.DnsRecordType.SRV,
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                ServiceRegistries: [assertions_1.Match.objectLike({
                        ContainerName: 'main',
                        ContainerPort: 1234,
                    })],
            });
        });
        test('allows SRV service discovery to select the container and port', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            cluster.addDefaultCloudMapNamespace({
                name: 'foo.com',
                type: cloudmap.NamespaceType.DNS_PRIVATE,
            });
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Task', {
                networkMode: ecs.NetworkMode.BRIDGE,
            });
            taskDefinition.addContainer('main', {
                image: ecs.ContainerImage.fromRegistry('some'),
                memoryLimitMiB: 512,
            }).addPortMappings({ containerPort: 1234 });
            const secondContainer = taskDefinition.addContainer('second', {
                image: ecs.ContainerImage.fromRegistry('some'),
                memoryLimitMiB: 512,
            });
            secondContainer.addPortMappings({ containerPort: 4321 });
            // WHEN
            new ecs.Ec2Service(stack, 'Service', {
                cluster,
                taskDefinition,
                cloudMapOptions: {
                    dnsRecordType: cloudmap.DnsRecordType.SRV,
                    container: secondContainer,
                    containerPort: 4321,
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                ServiceRegistries: [assertions_1.Match.objectLike({
                        ContainerName: 'second',
                        ContainerPort: 4321,
                    })],
            });
        });
        test('throws if SRV and container is not part of task definition', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            cluster.addDefaultCloudMapNamespace({
                name: 'foo.com',
                type: cloudmap.NamespaceType.DNS_PRIVATE,
            });
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Task', {
                networkMode: ecs.NetworkMode.BRIDGE,
            });
            // The right container
            taskDefinition.addContainer('MainContainer', {
                image: ecs.ContainerImage.fromRegistry('hello'),
                memoryLimitMiB: 512,
            });
            const wrongTaskDefinition = new ecs.Ec2TaskDefinition(stack, 'WrongTaskDef');
            // The wrong container
            const wrongContainer = wrongTaskDefinition.addContainer('MainContainer', {
                image: ecs.ContainerImage.fromRegistry('hello'),
                memoryLimitMiB: 512,
            });
            // WHEN
            expect(() => {
                new ecs.Ec2Service(stack, 'Service', {
                    cluster,
                    taskDefinition,
                    cloudMapOptions: {
                        dnsRecordType: cloudmap.DnsRecordType.SRV,
                        container: wrongContainer,
                        containerPort: 4321,
                    },
                });
            }).toThrow(/another task definition/i);
        });
        test('throws if SRV and the container port is not mapped', () => {
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            cluster.addDefaultCloudMapNamespace({
                name: 'foo.com',
                type: cloudmap.NamespaceType.DNS_PRIVATE,
            });
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Task', {
                networkMode: ecs.NetworkMode.BRIDGE,
            });
            const container = taskDefinition.addContainer('MainContainer', {
                image: ecs.ContainerImage.fromRegistry('hello'),
                memoryLimitMiB: 512,
            });
            container.addPortMappings({ containerPort: 8000 });
            expect(() => {
                new ecs.Ec2Service(stack, 'Service', {
                    cluster,
                    taskDefinition,
                    cloudMapOptions: {
                        dnsRecordType: cloudmap.DnsRecordType.SRV,
                        container: container,
                        containerPort: 4321,
                    },
                });
            }).toThrow(/container port.*not.*mapped/i);
        });
    });
    test('Metric', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        util_1.addDefaultCapacityProvider(cluster, stack, vpc);
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'FargateTaskDef');
        taskDefinition.addContainer('Container', {
            image: ecs.ContainerImage.fromRegistry('hello'),
        });
        // WHEN
        const service = new ecs.Ec2Service(stack, 'Service', {
            cluster,
            taskDefinition,
        });
        // THEN
        expect(stack.resolve(service.metricMemoryUtilization())).toEqual({
            dimensions: {
                ClusterName: { Ref: 'EcsCluster97242B84' },
                ServiceName: { 'Fn::GetAtt': ['ServiceD69D759B', 'Name'] },
            },
            namespace: 'AWS/ECS',
            metricName: 'MemoryUtilization',
            period: cdk.Duration.minutes(5),
            statistic: 'Average',
        });
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
    describe('When import an EC2 Service', () => {
        test('fromEc2ServiceArn old format', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const service = ecs.Ec2Service.fromEc2ServiceArn(stack, 'EcsService', 'arn:aws:ecs:us-west-2:123456789012:service/my-http-service');
            // THEN
            expect(service.serviceArn).toEqual('arn:aws:ecs:us-west-2:123456789012:service/my-http-service');
            expect(service.serviceName).toEqual('my-http-service');
        });
        test('fromEc2ServiceArn new format', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const service = ecs.Ec2Service.fromEc2ServiceArn(stack, 'EcsService', 'arn:aws:ecs:us-west-2:123456789012:service/my-cluster-name/my-http-service');
            // THEN
            expect(service.serviceArn).toEqual('arn:aws:ecs:us-west-2:123456789012:service/my-cluster-name/my-http-service');
            expect(service.serviceName).toEqual('my-http-service');
        });
        describe('fromEc2ServiceArn tokenized ARN', () => {
            test('when @aws-cdk/aws-ecs:arnFormatIncludesClusterName is disabled, use old ARN format', () => {
                // GIVEN
                const stack = new cdk.Stack();
                // WHEN
                const service = ecs.Ec2Service.fromEc2ServiceArn(stack, 'EcsService', new cdk.CfnParameter(stack, 'ARN').valueAsString);
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
                const service = ecs.Ec2Service.fromEc2ServiceArn(stack, 'EcsService', new cdk.CfnParameter(stack, 'ARN').valueAsString);
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
            const service = ecs.Ec2Service.fromEc2ServiceAttributes(stack, 'EcsService', {
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
            const service = ecs.Ec2Service.fromEc2ServiceAttributes(stack, 'EcsService', {
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
                const service = ecs.Ec2Service.fromEc2ServiceAttributes(stack, 'EcsService', {
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
                const service = ecs.Ec2Service.fromEc2ServiceAttributes(stack, 'EcsService', {
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
                const service = ecs.Ec2Service.fromEc2ServiceAttributes(stack, 'EcsService', {
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
                const service = ecs.Ec2Service.fromEc2ServiceAttributes(stack, 'EcsService', {
                    serviceName: 'my-http-service',
                    cluster,
                });
                // THEN
                expect(stack.resolve(service.serviceArn)).toEqual(stack.resolve(`arn:${pseudo.partition}:ecs:${pseudo.region}:${pseudo.accountId}:service/${cluster.clusterName}/my-http-service`));
                expect(service.serviceName).toEqual('my-http-service');
            });
        });
        test('throws an exception if both serviceArn and serviceName were provided for fromEc2ServiceAttributes', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const cluster = new ecs.Cluster(stack, 'EcsCluster');
            expect(() => {
                ecs.Ec2Service.fromEc2ServiceAttributes(stack, 'EcsService', {
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
                ecs.Ec2Service.fromEc2ServiceAttributes(stack, 'EcsService', {
                    cluster,
                });
            }).toThrow(/only specify either serviceArn or serviceName/);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWMyLXNlcnZpY2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVjMi1zZXJ2aWNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBbUU7QUFDbkUsd0RBQXdEO0FBQ3hELHdDQUF3QztBQUN4Qyx5REFBeUQ7QUFDekQsNkRBQTZEO0FBQzdELHdDQUF3QztBQUN4QywwQ0FBMEM7QUFDMUMsc0NBQXNDO0FBQ3RDLDBEQUEwRDtBQUMxRCw4REFBMEQ7QUFDMUQscUNBQXFDO0FBQ3JDLHdDQUFvQztBQUNwQyw0Q0FBdUU7QUFDdkUsaUNBQWlDO0FBQ2pDLDhEQUF3RztBQUN4RyxtREFBNkU7QUFDN0Usa0NBQXFEO0FBRXJELFFBQVEsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO0lBQzNCLFFBQVEsQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7UUFDNUMsSUFBSSxDQUFDLHlFQUF5RSxFQUFFLEdBQUcsRUFBRTtZQUNuRixRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDNUMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzlELGlDQUEwQixDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDaEQsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBRXRFLGNBQWMsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFO2dCQUNqQyxLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENB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QUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsbUdBQW1HLEVBQUUsR0FBRyxFQUFFO1lBQzdHLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBRXJELE1BQU0sQ0FBQyxHQUFHLEVBQUU7Z0JBQ1YsR0FBRyxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO29CQUMzRCxVQUFVLEVBQUUsNERBQTREO29CQUN4RSxXQUFXLEVBQUUsaUJBQWlCO29CQUM5QixPQUFPO2lCQUNSLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1FBRzlELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHNHQUFzRyxFQUFFLEdBQUcsRUFBRTtZQUNoSCxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDOUIsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztZQUVyRCxNQUFNLENBQUMsR0FBRyxFQUFFO2dCQUNWLEdBQUcsQ0FBQyxVQUFVLENBQUMsd0JBQXdCLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtvQkFDM0QsT0FBTztpQkFDUixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsK0NBQStDLENBQUMsQ0FBQztRQUc5RCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbm5vdGF0aW9ucywgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBhdXRvc2NhbGluZyBmcm9tICdAYXdzLWNkay9hd3MtYXV0b3NjYWxpbmcnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWxiIGZyb20gJ0Bhd3MtY2RrL2F3cy1lbGFzdGljbG9hZGJhbGFuY2luZyc7XG5pbXBvcnQgKiBhcyBlbGJ2MiBmcm9tICdAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mic7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBsb2dzIGZyb20gJ0Bhd3MtY2RrL2F3cy1sb2dzJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjbG91ZG1hcCBmcm9tICdAYXdzLWNkay9hd3Mtc2VydmljZWRpc2NvdmVyeSc7XG5pbXBvcnQgeyB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBBcHAgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEVDU19BUk5fRk9STUFUX0lOQ0xVREVTX0NMVVNURVJfTkFNRSB9IGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnLi4vLi4vbGliJztcbmltcG9ydCB7IERlcGxveW1lbnRDb250cm9sbGVyVHlwZSwgTGF1bmNoVHlwZSwgUHJvcGFnYXRlZFRhZ1NvdXJjZSB9IGZyb20gJy4uLy4uL2xpYi9iYXNlL2Jhc2Utc2VydmljZSc7XG5pbXBvcnQgeyBQbGFjZW1lbnRDb25zdHJhaW50LCBQbGFjZW1lbnRTdHJhdGVneSB9IGZyb20gJy4uLy4uL2xpYi9wbGFjZW1lbnQnO1xuaW1wb3J0IHsgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIgfSBmcm9tICcuLi91dGlsJztcblxuZGVzY3JpYmUoJ2VjMiBzZXJ2aWNlJywgKCkgPT4ge1xuICBkZXNjcmliZSgnV2hlbiBjcmVhdGluZyBhbiBFQzIgU2VydmljZScsICgpID0+IHtcbiAgICB0ZXN0KCd3aXRoIG9ubHkgcmVxdWlyZWQgcHJvcGVydGllcyBzZXQsIGl0IGNvcnJlY3RseSBzZXRzIGRlZmF1bHQgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJyk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ0VjMlNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgVGFza0RlZmluaXRpb246IHtcbiAgICAgICAgICBSZWY6ICdFYzJUYXNrRGVmMDIyNkYyOEMnLFxuICAgICAgICB9LFxuICAgICAgICBDbHVzdGVyOiB7XG4gICAgICAgICAgUmVmOiAnRWNzQ2x1c3Rlcjk3MjQyQjg0JyxcbiAgICAgICAgfSxcbiAgICAgICAgRGVwbG95bWVudENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBNYXhpbXVtUGVyY2VudDogMjAwLFxuICAgICAgICAgIE1pbmltdW1IZWFsdGh5UGVyY2VudDogNTAsXG4gICAgICAgIH0sXG4gICAgICAgIExhdW5jaFR5cGU6IExhdW5jaFR5cGUuRUMyLFxuICAgICAgICBTY2hlZHVsaW5nU3RyYXRlZ3k6ICdSRVBMSUNBJyxcbiAgICAgICAgRW5hYmxlRUNTTWFuYWdlZFRhZ3M6IGZhbHNlLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChzZXJ2aWNlLm5vZGUuZGVmYXVsdENoaWxkKS50b0JlRGVmaW5lZCgpO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2FsbG93cyBzZXR0aW5nIGVuYWJsZSBleGVjdXRlIGNvbW1hbmQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ0VjMlNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBlbmFibGVFeGVjdXRlQ29tbWFuZDogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICAgIFRhc2tEZWZpbml0aW9uOiB7XG4gICAgICAgICAgUmVmOiAnRWMyVGFza0RlZjAyMjZGMjhDJyxcbiAgICAgICAgfSxcbiAgICAgICAgQ2x1c3Rlcjoge1xuICAgICAgICAgIFJlZjogJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcsXG4gICAgICAgIH0sXG4gICAgICAgIERlcGxveW1lbnRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgTWF4aW11bVBlcmNlbnQ6IDIwMCxcbiAgICAgICAgICBNaW5pbXVtSGVhbHRoeVBlcmNlbnQ6IDUwLFxuICAgICAgICB9LFxuICAgICAgICBMYXVuY2hUeXBlOiBMYXVuY2hUeXBlLkVDMixcbiAgICAgICAgU2NoZWR1bGluZ1N0cmF0ZWd5OiAnUkVQTElDQScsXG4gICAgICAgIEVuYWJsZUVDU01hbmFnZWRUYWdzOiBmYWxzZSxcbiAgICAgICAgRW5hYmxlRXhlY3V0ZUNvbW1hbmQ6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdzc21tZXNzYWdlczpDcmVhdGVDb250cm9sQ2hhbm5lbCcsXG4gICAgICAgICAgICAgICAgJ3NzbW1lc3NhZ2VzOkNyZWF0ZURhdGFDaGFubmVsJyxcbiAgICAgICAgICAgICAgICAnc3NtbWVzc2FnZXM6T3BlbkNvbnRyb2xDaGFubmVsJyxcbiAgICAgICAgICAgICAgICAnc3NtbWVzc2FnZXM6T3BlbkRhdGFDaGFubmVsJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnbG9nczpEZXNjcmliZUxvZ0dyb3VwcycsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdsb2dzOkNyZWF0ZUxvZ1N0cmVhbScsXG4gICAgICAgICAgICAgICAgJ2xvZ3M6RGVzY3JpYmVMb2dTdHJlYW1zJyxcbiAgICAgICAgICAgICAgICAnbG9nczpQdXRMb2dFdmVudHMnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgICBQb2xpY3lOYW1lOiAnRWMyVGFza0RlZlRhc2tSb2xlRGVmYXVsdFBvbGljeUEyNEZCOTcwJyxcbiAgICAgICAgUm9sZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdFYzJUYXNrRGVmVGFza1JvbGU0MDBGQTM0OScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ25vIGxvZ2dpbmcgZW5hYmxlZCB3aGVuIGxvZ2dpbmcgZmllbGQgaXMgc2V0IHRvIE5PTkUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBleGVjdXRlQ29tbWFuZENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBsb2dnaW5nOiBlY3MuRXhlY3V0ZUNvbW1hbmRMb2dnaW5nLk5PTkUsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICBjb25zdCBsb2dHcm91cCA9IG5ldyBsb2dzLkxvZ0dyb3VwKHN0YWNrLCAnTG9nR3JvdXAnKTtcblxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbG9nZ2luZzogZWNzLkxvZ0RyaXZlcnMuYXdzTG9ncyh7XG4gICAgICAgICAgbG9nR3JvdXAsXG4gICAgICAgICAgc3RyZWFtUHJlZml4OiAnbG9nLWdyb3VwJyxcbiAgICAgICAgfSksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnRWMyU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIGVuYWJsZUV4ZWN1dGVDb21tYW5kOiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAnc3NtbWVzc2FnZXM6Q3JlYXRlQ29udHJvbENoYW5uZWwnLFxuICAgICAgICAgICAgICAgICdzc21tZXNzYWdlczpDcmVhdGVEYXRhQ2hhbm5lbCcsXG4gICAgICAgICAgICAgICAgJ3NzbW1lc3NhZ2VzOk9wZW5Db250cm9sQ2hhbm5lbCcsXG4gICAgICAgICAgICAgICAgJ3NzbW1lc3NhZ2VzOk9wZW5EYXRhQ2hhbm5lbCcsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG4gICAgICAgIFBvbGljeU5hbWU6ICdFYzJUYXNrRGVmVGFza1JvbGVEZWZhdWx0UG9saWN5QTI0RkI5NzAnLFxuICAgICAgICBSb2xlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ0VjMlRhc2tEZWZUYXNrUm9sZTQwMEZBMzQ5JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnZW5hYmxlcyBleGVjdXRlIGNvbW1hbmQgbG9nZ2luZyB3aGVuIGxvZ2dpbmcgZmllbGQgaXMgc2V0IHRvIE9WRVJSSURFJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcblxuICAgICAgY29uc3QgbG9nR3JvdXAgPSBuZXcgbG9ncy5Mb2dHcm91cChzdGFjaywgJ0xvZ0dyb3VwJyk7XG5cbiAgICAgIGNvbnN0IGV4ZWNCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnRXhlY0J1Y2tldCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBleGVjdXRlQ29tbWFuZENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBsb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBjbG91ZFdhdGNoTG9nR3JvdXA6IGxvZ0dyb3VwLFxuICAgICAgICAgICAgczNCdWNrZXQ6IGV4ZWNCdWNrZXQsXG4gICAgICAgICAgICBzM0tleVByZWZpeDogJ2V4ZWMtb3V0cHV0JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGxvZ2dpbmc6IGVjcy5FeGVjdXRlQ29tbWFuZExvZ2dpbmcuT1ZFUlJJREUsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ0VjMlNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBlbmFibGVFeGVjdXRlQ29tbWFuZDogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgJ3NzbW1lc3NhZ2VzOkNyZWF0ZUNvbnRyb2xDaGFubmVsJyxcbiAgICAgICAgICAgICAgICAnc3NtbWVzc2FnZXM6Q3JlYXRlRGF0YUNoYW5uZWwnLFxuICAgICAgICAgICAgICAgICdzc21tZXNzYWdlczpPcGVuQ29udHJvbENoYW5uZWwnLFxuICAgICAgICAgICAgICAgICdzc21tZXNzYWdlczpPcGVuRGF0YUNoYW5uZWwnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdsb2dzOkRlc2NyaWJlTG9nR3JvdXBzJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgJ2xvZ3M6Q3JlYXRlTG9nU3RyZWFtJyxcbiAgICAgICAgICAgICAgICAnbG9nczpEZXNjcmliZUxvZ1N0cmVhbXMnLFxuICAgICAgICAgICAgICAgICdsb2dzOlB1dExvZ0V2ZW50cycsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOmxvZ3M6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOmxvZy1ncm91cDonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnTG9nR3JvdXBGNUI0NjkzMScsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6KicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdzMzpHZXRCdWNrZXRMb2NhdGlvbicsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3MzOlB1dE9iamVjdCcsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOnMzOjo6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0V4ZWNCdWNrZXQyOTU1OTM1NicsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICcvKicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgICBQb2xpY3lOYW1lOiAnRWMyVGFza0RlZlRhc2tSb2xlRGVmYXVsdFBvbGljeUEyNEZCOTcwJyxcbiAgICAgICAgUm9sZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdFYzJUYXNrRGVmVGFza1JvbGU0MDBGQTM0OScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2VuYWJsZXMgb25seSBleGVjdXRlIGNvbW1hbmQgc2Vzc2lvbiBlbmNyeXB0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcblxuICAgICAgY29uc3Qga21zS2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdLbXNLZXknKTtcblxuICAgICAgY29uc3QgbG9nR3JvdXAgPSBuZXcgbG9ncy5Mb2dHcm91cChzdGFjaywgJ0xvZ0dyb3VwJyk7XG5cbiAgICAgIGNvbnN0IGV4ZWNCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnRWNzRXhlY0J1Y2tldCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBleGVjdXRlQ29tbWFuZENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBrbXNLZXksXG4gICAgICAgICAgbG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgY2xvdWRXYXRjaExvZ0dyb3VwOiBsb2dHcm91cCxcbiAgICAgICAgICAgIHMzQnVja2V0OiBleGVjQnVja2V0LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgbG9nZ2luZzogZWNzLkV4ZWN1dGVDb21tYW5kTG9nZ2luZy5PVkVSUklERSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnKTtcblxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdFYzJTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgZW5hYmxlRXhlY3V0ZUNvbW1hbmQ6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdzc21tZXNzYWdlczpDcmVhdGVDb250cm9sQ2hhbm5lbCcsXG4gICAgICAgICAgICAgICAgJ3NzbW1lc3NhZ2VzOkNyZWF0ZURhdGFDaGFubmVsJyxcbiAgICAgICAgICAgICAgICAnc3NtbWVzc2FnZXM6T3BlbkNvbnRyb2xDaGFubmVsJyxcbiAgICAgICAgICAgICAgICAnc3NtbWVzc2FnZXM6T3BlbkRhdGFDaGFubmVsJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgICAgICAgICAna21zOkdlbmVyYXRlRGF0YUtleScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdLbXNLZXk0NjY5M0FERCcsXG4gICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnbG9nczpEZXNjcmliZUxvZ0dyb3VwcycsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdsb2dzOkNyZWF0ZUxvZ1N0cmVhbScsXG4gICAgICAgICAgICAgICAgJ2xvZ3M6RGVzY3JpYmVMb2dTdHJlYW1zJyxcbiAgICAgICAgICAgICAgICAnbG9nczpQdXRMb2dFdmVudHMnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpsb2dzOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpsb2ctZ3JvdXA6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0xvZ0dyb3VwRjVCNDY5MzEnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOionLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnczM6R2V0QnVja2V0TG9jYXRpb24nLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdzMzpQdXRPYmplY3QnLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpzMzo6OicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdFY3NFeGVjQnVja2V0NEY0Njg2NTEnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnLyonLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgICAgUG9saWN5TmFtZTogJ0VjMlRhc2tEZWZUYXNrUm9sZURlZmF1bHRQb2xpY3lBMjRGQjk3MCcsXG4gICAgICAgIFJvbGVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnRWMyVGFza0RlZlRhc2tSb2xlNDAwRkEzNDknLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpLZXknLCB7XG4gICAgICAgIEtleVBvbGljeToge1xuICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdrbXM6KicsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgICAgQVdTOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICc6aWFtOjonLFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICc6cm9vdCcsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnZW5hYmxlcyBlbmNyeXB0aW9uIGZvciBleGVjdXRlIGNvbW1hbmQgbG9nZ2luZycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG5cbiAgICAgIGNvbnN0IGttc0tleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnS21zS2V5Jyk7XG5cbiAgICAgIGNvbnN0IGxvZ0dyb3VwID0gbmV3IGxvZ3MuTG9nR3JvdXAoc3RhY2ssICdMb2dHcm91cCcsIHtcbiAgICAgICAgZW5jcnlwdGlvbktleToga21zS2V5LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGV4ZWNCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnRWNzRXhlY0J1Y2tldCcsIHtcbiAgICAgICAgZW5jcnlwdGlvbktleToga21zS2V5LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywge1xuICAgICAgICB2cGMsXG4gICAgICAgIGV4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIGttc0tleSxcbiAgICAgICAgICBsb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBjbG91ZFdhdGNoTG9nR3JvdXA6IGxvZ0dyb3VwLFxuICAgICAgICAgICAgY2xvdWRXYXRjaEVuY3J5cHRpb25FbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgczNCdWNrZXQ6IGV4ZWNCdWNrZXQsXG4gICAgICAgICAgICBzM0VuY3J5cHRpb25FbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgczNLZXlQcmVmaXg6ICdleGVjLW91dHB1dCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBsb2dnaW5nOiBlY3MuRXhlY3V0ZUNvbW1hbmRMb2dnaW5nLk9WRVJSSURFLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ0VjMlNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBlbmFibGVFeGVjdXRlQ29tbWFuZDogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgJ3NzbW1lc3NhZ2VzOkNyZWF0ZUNvbnRyb2xDaGFubmVsJyxcbiAgICAgICAgICAgICAgICAnc3NtbWVzc2FnZXM6Q3JlYXRlRGF0YUNoYW5uZWwnLFxuICAgICAgICAgICAgICAgICdzc21tZXNzYWdlczpPcGVuQ29udHJvbENoYW5uZWwnLFxuICAgICAgICAgICAgICAgICdzc21tZXNzYWdlczpPcGVuRGF0YUNoYW5uZWwnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAna21zOkRlY3J5cHQnLFxuICAgICAgICAgICAgICAgICdrbXM6R2VuZXJhdGVEYXRhS2V5JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ0ttc0tleTQ2NjkzQUREJyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdsb2dzOkRlc2NyaWJlTG9nR3JvdXBzJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgJ2xvZ3M6Q3JlYXRlTG9nU3RyZWFtJyxcbiAgICAgICAgICAgICAgICAnbG9nczpEZXNjcmliZUxvZ1N0cmVhbXMnLFxuICAgICAgICAgICAgICAgICdsb2dzOlB1dExvZ0V2ZW50cycsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOmxvZ3M6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOmxvZy1ncm91cDonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnTG9nR3JvdXBGNUI0NjkzMScsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6KicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdzMzpHZXRCdWNrZXRMb2NhdGlvbicsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3MzOlB1dE9iamVjdCcsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOnMzOjo6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0Vjc0V4ZWNCdWNrZXQ0RjQ2ODY1MScsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICcvKicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdzMzpHZXRFbmNyeXB0aW9uQ29uZmlndXJhdGlvbicsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOnMzOjo6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0Vjc0V4ZWNCdWNrZXQ0RjQ2ODY1MScsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgICBQb2xpY3lOYW1lOiAnRWMyVGFza0RlZlRhc2tSb2xlRGVmYXVsdFBvbGljeUEyNEZCOTcwJyxcbiAgICAgICAgUm9sZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdFYzJUYXNrRGVmVGFza1JvbGU0MDBGQTM0OScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICAgICAgS2V5UG9saWN5OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ2ttczoqJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgICBBV1M6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJzppYW06OicsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJzpyb290JyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdrbXM6RW5jcnlwdConLFxuICAgICAgICAgICAgICAgICdrbXM6RGVjcnlwdConLFxuICAgICAgICAgICAgICAgICdrbXM6UmVFbmNyeXB0KicsXG4gICAgICAgICAgICAgICAgJ2ttczpHZW5lcmF0ZURhdGFLZXkqJyxcbiAgICAgICAgICAgICAgICAna21zOkRlc2NyaWJlKicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgICAgIEFybkxpa2U6IHtcbiAgICAgICAgICAgICAgICAgICdrbXM6RW5jcnlwdGlvbkNvbnRleHQ6YXdzOmxvZ3M6YXJuJzoge1xuICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJzpsb2dzOicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAnOionLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgICAgU2VydmljZToge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICdsb2dzLicsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJy5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIGN1c3RvbSBjbG91ZG1hcCBuYW1lc3BhY2UnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG4gICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMCB9KTtcblxuICAgICAgY29uc3QgY2xvdWRNYXBOYW1lc3BhY2UgPSBuZXcgY2xvdWRtYXAuUHJpdmF0ZURuc05hbWVzcGFjZShzdGFjaywgJ1Rlc3RDbG91ZE1hcE5hbWVzcGFjZScsIHtcbiAgICAgICAgbmFtZTogJ3Njb3Jla2VlcC5jb20nLFxuICAgICAgICB2cGMsXG4gICAgICB9KTtcblxuICAgICAgbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnRWMyU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIGNsb3VkTWFwT3B0aW9uczoge1xuICAgICAgICAgIG5hbWU6ICdteUFwcCcsXG4gICAgICAgICAgZmFpbHVyZVRocmVzaG9sZDogMjAsXG4gICAgICAgICAgY2xvdWRNYXBOYW1lc3BhY2UsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VydmljZURpc2NvdmVyeTo6U2VydmljZScsIHtcbiAgICAgICAgRG5zQ29uZmlnOiB7XG4gICAgICAgICAgRG5zUmVjb3JkczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBUVEw6IDYwLFxuICAgICAgICAgICAgICBUeXBlOiAnU1JWJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBOYW1lc3BhY2VJZDoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdUZXN0Q2xvdWRNYXBOYW1lc3BhY2UxRkI5QjQ0NicsXG4gICAgICAgICAgICAgICdJZCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgUm91dGluZ1BvbGljeTogJ01VTFRJVkFMVUUnLFxuICAgICAgICB9LFxuICAgICAgICBIZWFsdGhDaGVja0N1c3RvbUNvbmZpZzoge1xuICAgICAgICAgIEZhaWx1cmVUaHJlc2hvbGQ6IDIwLFxuICAgICAgICB9LFxuICAgICAgICBOYW1lOiAnbXlBcHAnLFxuICAgICAgICBOYW1lc3BhY2VJZDoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ1Rlc3RDbG91ZE1hcE5hbWVzcGFjZTFGQjlCNDQ2JyxcbiAgICAgICAgICAgICdJZCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTZXJ2aWNlRGlzY292ZXJ5OjpQcml2YXRlRG5zTmFtZXNwYWNlJywge1xuICAgICAgICBOYW1lOiAnc2NvcmVrZWVwLmNvbScsXG4gICAgICAgIFZwYzoge1xuICAgICAgICAgIFJlZjogJ015VnBjRjlGMENBNkYnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCBhbGwgcHJvcGVydGllcyBzZXQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicsIHtcbiAgICAgICAgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5BV1NfVlBDLFxuICAgICAgfSk7XG5cbiAgICAgIGNsdXN0ZXIuYWRkRGVmYXVsdENsb3VkTWFwTmFtZXNwYWNlKHtcbiAgICAgICAgbmFtZTogJ2Zvby5jb20nLFxuICAgICAgICB0eXBlOiBjbG91ZG1hcC5OYW1lc3BhY2VUeXBlLkROU19QUklWQVRFLFxuICAgICAgfSk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ0VjMlNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBkZXNpcmVkQ291bnQ6IDIsXG4gICAgICAgIGFzc2lnblB1YmxpY0lwOiB0cnVlLFxuICAgICAgICBjbG91ZE1hcE9wdGlvbnM6IHtcbiAgICAgICAgICBuYW1lOiAnbXlhcHAnLFxuICAgICAgICAgIGRuc1JlY29yZFR5cGU6IGNsb3VkbWFwLkRuc1JlY29yZFR5cGUuQSxcbiAgICAgICAgICBkbnNUdGw6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDUwKSxcbiAgICAgICAgICBmYWlsdXJlVGhyZXNob2xkOiAyMCxcbiAgICAgICAgfSxcbiAgICAgICAgZGFlbW9uOiBmYWxzZSxcbiAgICAgICAgaGVhbHRoQ2hlY2tHcmFjZVBlcmlvZDogY2RrLkR1cmF0aW9uLnNlY29uZHMoNjApLFxuICAgICAgICBtYXhIZWFsdGh5UGVyY2VudDogMTUwLFxuICAgICAgICBtaW5IZWFsdGh5UGVyY2VudDogNTUsXG4gICAgICAgIGRlcGxveW1lbnRDb250cm9sbGVyOiB7XG4gICAgICAgICAgdHlwZTogZWNzLkRlcGxveW1lbnRDb250cm9sbGVyVHlwZS5FQ1MsXG4gICAgICAgIH0sXG4gICAgICAgIHNlY3VyaXR5R3JvdXBzOiBbbmV3IGVjMi5TZWN1cml0eUdyb3VwKHN0YWNrLCAnU2VjdXJpdHlHcm91cDEnLCB7XG4gICAgICAgICAgYWxsb3dBbGxPdXRib3VuZDogdHJ1ZSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0V4YW1wbGUnLFxuICAgICAgICAgIHNlY3VyaXR5R3JvdXBOYW1lOiAnQm9iJyxcbiAgICAgICAgICB2cGMsXG4gICAgICAgIH0pXSxcbiAgICAgICAgc2VydmljZU5hbWU6ICdib25qb3VyJyxcbiAgICAgICAgdnBjU3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMgfSxcbiAgICAgIH0pO1xuXG4gICAgICBzZXJ2aWNlLmFkZFBsYWNlbWVudENvbnN0cmFpbnRzKFBsYWNlbWVudENvbnN0cmFpbnQubWVtYmVyT2YoJ2F0dHJpYnV0ZTplY3MuaW5zdGFuY2UtdHlwZSA9fiB0Mi4qJykpO1xuICAgICAgc2VydmljZS5hZGRQbGFjZW1lbnRTdHJhdGVnaWVzKFBsYWNlbWVudFN0cmF0ZWd5LnNwcmVhZEFjcm9zcyhlY3MuQnVpbHRJbkF0dHJpYnV0ZXMuQVZBSUxBQklMSVRZX1pPTkUpKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICBUYXNrRGVmaW5pdGlvbjoge1xuICAgICAgICAgIFJlZjogJ0VjMlRhc2tEZWYwMjI2RjI4QycsXG4gICAgICAgIH0sXG4gICAgICAgIENsdXN0ZXI6IHtcbiAgICAgICAgICBSZWY6ICdFY3NDbHVzdGVyOTcyNDJCODQnLFxuICAgICAgICB9LFxuICAgICAgICBEZXBsb3ltZW50Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIE1heGltdW1QZXJjZW50OiAxNTAsXG4gICAgICAgICAgTWluaW11bUhlYWx0aHlQZXJjZW50OiA1NSxcbiAgICAgICAgfSxcbiAgICAgICAgRGVwbG95bWVudENvbnRyb2xsZXI6IHtcbiAgICAgICAgICBUeXBlOiBlY3MuRGVwbG95bWVudENvbnRyb2xsZXJUeXBlLkVDUyxcbiAgICAgICAgfSxcbiAgICAgICAgRGVzaXJlZENvdW50OiAyLFxuICAgICAgICBMYXVuY2hUeXBlOiBMYXVuY2hUeXBlLkVDMixcbiAgICAgICAgTmV0d29ya0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBBd3N2cGNDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBBc3NpZ25QdWJsaWNJcDogJ0VOQUJMRUQnLFxuICAgICAgICAgICAgU2VjdXJpdHlHcm91cHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ1NlY3VyaXR5R3JvdXAxRjU1NEIzNkYnLFxuICAgICAgICAgICAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgU3VibmV0czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnTXlWcGNQdWJsaWNTdWJuZXQxU3VibmV0RjY2MDg0NTYnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnTXlWcGNQdWJsaWNTdWJuZXQyU3VibmV0NDkyQjZCRkInLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBQbGFjZW1lbnRDb25zdHJhaW50czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEV4cHJlc3Npb246ICdhdHRyaWJ1dGU6ZWNzLmluc3RhbmNlLXR5cGUgPX4gdDIuKicsXG4gICAgICAgICAgICBUeXBlOiAnbWVtYmVyT2YnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFBsYWNlbWVudFN0cmF0ZWdpZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBGaWVsZDogJ2F0dHJpYnV0ZTplY3MuYXZhaWxhYmlsaXR5LXpvbmUnLFxuICAgICAgICAgICAgVHlwZTogJ3NwcmVhZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgU2NoZWR1bGluZ1N0cmF0ZWd5OiAnUkVQTElDQScsXG4gICAgICAgIFNlcnZpY2VOYW1lOiAnYm9uam91cicsXG4gICAgICAgIFNlcnZpY2VSZWdpc3RyaWVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVnaXN0cnlBcm46IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0VjMlNlcnZpY2VDbG91ZG1hcFNlcnZpY2U0NUI1MkMwRicsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIGF1dG9zY2FsaW5nIGdyb3VwIGNhcGFjaXR5IHByb3ZpZGVyJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJyk7XG5cbiAgICAgIGNvbnN0IGF1dG9TY2FsaW5nR3JvdXAgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ2FzZycsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdib2d1cycpLFxuICAgICAgICBtYWNoaW5lSW1hZ2U6IGVjcy5FY3NPcHRpbWl6ZWRJbWFnZS5hbWF6b25MaW51eDIoKSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBjYXBhY2l0eVByb3ZpZGVyID0gbmV3IGVjcy5Bc2dDYXBhY2l0eVByb3ZpZGVyKHN0YWNrLCAncHJvdmlkZXInLCB7XG4gICAgICAgIGF1dG9TY2FsaW5nR3JvdXAsXG4gICAgICAgIGVuYWJsZU1hbmFnZWRUZXJtaW5hdGlvblByb3RlY3Rpb246IGZhbHNlLFxuICAgICAgfSk7XG4gICAgICBjbHVzdGVyLmFkZEFzZ0NhcGFjaXR5UHJvdmlkZXIoY2FwYWNpdHlQcm92aWRlcik7XG5cbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5UYXNrRGVmaW5pdGlvbihzdGFjaywgJ1NlcnZlclRhc2snLCB7XG4gICAgICAgIGNvbXBhdGliaWxpdHk6IGVjcy5Db21wYXRpYmlsaXR5LkVDMixcbiAgICAgIH0pO1xuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdhcHAnLCB7XG4gICAgICAgIGltYWdlOiBuZXcgZWNzLlJlcG9zaXRvcnlJbWFnZSgnYm9ndXMnKSxcbiAgICAgICAgY3B1OiAxMDI0LFxuICAgICAgICBtZW1vcnlSZXNlcnZhdGlvbk1pQjogOTAwLFxuICAgICAgICBwb3J0TWFwcGluZ3M6IFt7XG4gICAgICAgICAgY29udGFpbmVyUG9ydDogODAsXG4gICAgICAgIH1dLFxuICAgICAgfSk7XG4gICAgICBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgZGVzaXJlZENvdW50OiAwLFxuICAgICAgICBjYXBhY2l0eVByb3ZpZGVyU3RyYXRlZ2llczogW3tcbiAgICAgICAgICBjYXBhY2l0eVByb3ZpZGVyOiBjYXBhY2l0eVByb3ZpZGVyLmNhcGFjaXR5UHJvdmlkZXJOYW1lLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICAgIENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENhcGFjaXR5UHJvdmlkZXI6IHtcbiAgICAgICAgICAgICAgUmVmOiAncHJvdmlkZXJEM0ZGNEQzQScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCBtdWx0aXBsZSBzZWN1cml0eSBncm91cHMsIGl0IGNvcnJlY3RseSB1cGRhdGVzIHRoZSBjZm4gdGVtcGxhdGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicsIHtcbiAgICAgICAgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5BV1NfVlBDLFxuICAgICAgfSk7XG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBzZWN1cml0eUdyb3VwMSA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cChzdGFjaywgJ1NlY3VyaXR5R3JvdXAxJywge1xuICAgICAgICBhbGxvd0FsbE91dGJvdW5kOiB0cnVlLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0V4YW1wbGUnLFxuICAgICAgICBzZWN1cml0eUdyb3VwTmFtZTogJ0JpbmdvJyxcbiAgICAgICAgdnBjLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBzZWN1cml0eUdyb3VwMiA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cChzdGFjaywgJ1NlY3VyaXR5R3JvdXAyJywge1xuICAgICAgICBhbGxvd0FsbE91dGJvdW5kOiBmYWxzZSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdFeGFtcGxlJyxcbiAgICAgICAgc2VjdXJpdHlHcm91cE5hbWU6ICdSb2xseScsXG4gICAgICAgIHZwYyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdFYzJTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgZGVzaXJlZENvdW50OiAyLFxuICAgICAgICBhc3NpZ25QdWJsaWNJcDogdHJ1ZSxcbiAgICAgICAgZGFlbW9uOiBmYWxzZSxcbiAgICAgICAgc2VjdXJpdHlHcm91cHM6IFtzZWN1cml0eUdyb3VwMSwgc2VjdXJpdHlHcm91cDJdLFxuICAgICAgICBzZXJ2aWNlTmFtZTogJ2JvbmpvdXInLFxuICAgICAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgVGFza0RlZmluaXRpb246IHtcbiAgICAgICAgICBSZWY6ICdFYzJUYXNrRGVmMDIyNkYyOEMnLFxuICAgICAgICB9LFxuICAgICAgICBDbHVzdGVyOiB7XG4gICAgICAgICAgUmVmOiAnRWNzQ2x1c3Rlcjk3MjQyQjg0JyxcbiAgICAgICAgfSxcbiAgICAgICAgRGVzaXJlZENvdW50OiAyLFxuICAgICAgICBMYXVuY2hUeXBlOiBMYXVuY2hUeXBlLkVDMixcbiAgICAgICAgTmV0d29ya0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBBd3N2cGNDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBBc3NpZ25QdWJsaWNJcDogJ0VOQUJMRUQnLFxuICAgICAgICAgICAgU2VjdXJpdHlHcm91cHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ1NlY3VyaXR5R3JvdXAxRjU1NEIzNkYnLFxuICAgICAgICAgICAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdTZWN1cml0eUdyb3VwMjNCRTg2QkI3JyxcbiAgICAgICAgICAgICAgICAgICdHcm91cElkJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFN1Ym5ldHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ015VnBjUHVibGljU3VibmV0MVN1Ym5ldEY2NjA4NDU2JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ015VnBjUHVibGljU3VibmV0MlN1Ym5ldDQ5MkI2QkZCJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgU2NoZWR1bGluZ1N0cmF0ZWd5OiAnUkVQTElDQScsXG4gICAgICAgIFNlcnZpY2VOYW1lOiAnYm9uam91cicsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJywge1xuICAgICAgICBHcm91cERlc2NyaXB0aW9uOiAnRXhhbXBsZScsXG4gICAgICAgIEdyb3VwTmFtZTogJ0JpbmdvJyxcbiAgICAgICAgU2VjdXJpdHlHcm91cEVncmVzczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENpZHJJcDogJzAuMC4wLjAvMCcsXG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogJ0FsbG93IGFsbCBvdXRib3VuZCB0cmFmZmljIGJ5IGRlZmF1bHQnLFxuICAgICAgICAgICAgSXBQcm90b2NvbDogJy0xJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWcGNJZDoge1xuICAgICAgICAgIFJlZjogJ015VnBjRjlGMENBNkYnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cCcsIHtcbiAgICAgICAgR3JvdXBEZXNjcmlwdGlvbjogJ0V4YW1wbGUnLFxuICAgICAgICBHcm91cE5hbWU6ICdSb2xseScsXG4gICAgICAgIFNlY3VyaXR5R3JvdXBFZ3Jlc3M6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBDaWRySXA6ICcyNTUuMjU1LjI1NS4yNTUvMzInLFxuICAgICAgICAgICAgRGVzY3JpcHRpb246ICdEaXNhbGxvdyBhbGwgdHJhZmZpYycsXG4gICAgICAgICAgICBGcm9tUG9ydDogMjUyLFxuICAgICAgICAgICAgSXBQcm90b2NvbDogJ2ljbXAnLFxuICAgICAgICAgICAgVG9Qb3J0OiA4NixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWcGNJZDoge1xuICAgICAgICAgIFJlZjogJ015VnBjRjlGMENBNkYnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnc2V0cyB0YXNrIGRlZmluaXRpb24gdG8gZmFtaWx5IHdoZW4gQ09ERV9ERVBMT1kgZGVwbG95bWVudCBjb250cm9sbGVyIGlzIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJyk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnRWMyU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIGRlcGxveW1lbnRDb250cm9sbGVyOiB7XG4gICAgICAgICAgdHlwZTogZWNzLkRlcGxveW1lbnRDb250cm9sbGVyVHlwZS5DT0RFX0RFUExPWSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgIFRhc2tEZWZpbml0aW9uOiAnRWMyVGFza0RlZicsXG4gICAgICAgICAgRGVwbG95bWVudENvbnRyb2xsZXI6IHtcbiAgICAgICAgICAgIFR5cGU6ICdDT0RFX0RFUExPWScsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgRGVwZW5kc09uOiBbXG4gICAgICAgICAgJ0VjMlRhc2tEZWYwMjI2RjI4QycsXG4gICAgICAgICAgJ0VjMlRhc2tEZWZUYXNrUm9sZTQwMEZBMzQ5JyxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdERlcHJlY2F0ZWQoJ3Rocm93cyB3aGVuIGJvdGggc2VjdXJpdHlHcm91cCBhbmQgc2VjdXJpdHlHcm91cHMgYXJlIHN1cHBsaWVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnLCB7XG4gICAgICAgIG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQVdTX1ZQQyxcbiAgICAgIH0pO1xuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc2VjdXJpdHlHcm91cDEgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdTZWN1cml0eUdyb3VwMScsIHtcbiAgICAgICAgYWxsb3dBbGxPdXRib3VuZDogdHJ1ZSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdFeGFtcGxlJyxcbiAgICAgICAgc2VjdXJpdHlHcm91cE5hbWU6ICdCaW5nbycsXG4gICAgICAgIHZwYyxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc2VjdXJpdHlHcm91cDIgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdTZWN1cml0eUdyb3VwMicsIHtcbiAgICAgICAgYWxsb3dBbGxPdXRib3VuZDogZmFsc2UsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnRXhhbXBsZScsXG4gICAgICAgIHNlY3VyaXR5R3JvdXBOYW1lOiAnUm9sbHknLFxuICAgICAgICB2cGMsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnRWMyU2VydmljZScsIHtcbiAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICAgIGRlc2lyZWRDb3VudDogMixcbiAgICAgICAgICBhc3NpZ25QdWJsaWNJcDogdHJ1ZSxcbiAgICAgICAgICBtYXhIZWFsdGh5UGVyY2VudDogMTUwLFxuICAgICAgICAgIG1pbkhlYWx0aHlQZXJjZW50OiA1NSxcbiAgICAgICAgICBzZWN1cml0eUdyb3VwOiBzZWN1cml0eUdyb3VwMSxcbiAgICAgICAgICBzZWN1cml0eUdyb3VwczogW3NlY3VyaXR5R3JvdXAyXSxcbiAgICAgICAgICBzZXJ2aWNlTmFtZTogJ2JvbmpvdXInLFxuICAgICAgICAgIHZwY1N1Ym5ldHM6IHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvT25seSBvbmUgb2YgU2VjdXJpdHlHcm91cCBvciBTZWN1cml0eUdyb3VwcyBjYW4gYmUgcG9wdWxhdGVkLi8pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyB3aGVuIHRhc2sgZGVmaW5pdGlvbiBpcyBub3QgRUMyIGNvbXBhdGlibGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnLCB7XG4gICAgICAgIGNvbXBhdGliaWxpdHk6IGVjcy5Db21wYXRpYmlsaXR5LkZBUkdBVEUsXG4gICAgICAgIGNwdTogJzI1NicsXG4gICAgICAgIG1lbW9yeU1pQjogJzUxMicsXG4gICAgICB9KTtcbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignQmFzZUNvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgbWVtb3J5UmVzZXJ2YXRpb25NaUI6IDEwLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ0VjMlNlcnZpY2UnLCB7XG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9TdXBwbGllZCBUYXNrRGVmaW5pdGlvbiBpcyBub3QgY29uZmlndXJlZCBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIEVDMi8pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2lnbm9yZSB0YXNrIGRlZmluaXRpb24gYW5kIGxhdW5jaCB0eXBlIGlmIGRlcGxveW1lbnQgY29udHJvbGxlciBpcyBzZXQgdG8gYmUgRVhURVJOQUwnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ0VjMlNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBkZXBsb3ltZW50Q29udHJvbGxlcjoge1xuICAgICAgICAgIHR5cGU6IERlcGxveW1lbnRDb250cm9sbGVyVHlwZS5FWFRFUk5BTCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBBbm5vdGF0aW9ucy5mcm9tU3RhY2soc3RhY2spLmhhc1dhcm5pbmcoJy9EZWZhdWx0L0VjMlNlcnZpY2UnLCAndGFza0RlZmluaXRpb24gYW5kIGxhdW5jaFR5cGUgYXJlIGJsYW5rZWQgb3V0IHdoZW4gdXNpbmcgZXh0ZXJuYWwgZGVwbG95bWVudCBjb250cm9sbGVyLicpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICBDbHVzdGVyOiB7XG4gICAgICAgICAgUmVmOiAnRWNzQ2x1c3Rlcjk3MjQyQjg0JyxcbiAgICAgICAgfSxcbiAgICAgICAgRGVwbG95bWVudENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBNYXhpbXVtUGVyY2VudDogMjAwLFxuICAgICAgICAgIE1pbmltdW1IZWFsdGh5UGVyY2VudDogNTAsXG4gICAgICAgIH0sXG4gICAgICAgIFNjaGVkdWxpbmdTdHJhdGVneTogJ1JFUExJQ0EnLFxuICAgICAgICBFbmFibGVFQ1NNYW5hZ2VkVGFnczogZmFsc2UsXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhZGQgd2FybmluZyB0byBhbm5vdGF0aW9ucyBpZiBjaXJjdWl0QnJlYWtlciBpcyBzcGVjaWZpZWQgd2l0aCBhIG5vbi1FQ1MgRGVwbG95bWVudENvbnRyb2xsZXJUeXBlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnKTtcblxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnRWMyU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIGRlcGxveW1lbnRDb250cm9sbGVyOiB7XG4gICAgICAgICAgdHlwZTogRGVwbG95bWVudENvbnRyb2xsZXJUeXBlLkVYVEVSTkFMLFxuICAgICAgICB9LFxuICAgICAgICBjaXJjdWl0QnJlYWtlcjogeyByb2xsYmFjazogdHJ1ZSB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzZXJ2aWNlLm5vZGUubWV0YWRhdGFbMF0uZGF0YSkudG9FcXVhbCgndGFza0RlZmluaXRpb24gYW5kIGxhdW5jaFR5cGUgYXJlIGJsYW5rZWQgb3V0IHdoZW4gdXNpbmcgZXh0ZXJuYWwgZGVwbG95bWVudCBjb250cm9sbGVyLicpO1xuICAgICAgZXhwZWN0KHNlcnZpY2Uubm9kZS5tZXRhZGF0YVsxXS5kYXRhKS50b0VxdWFsKCdEZXBsb3ltZW50IGNpcmN1aXQgYnJlYWtlciByZXF1aXJlcyB0aGUgRUNTIGRlcGxveW1lbnQgY29udHJvbGxlci4nKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnZXJyb3JzIGlmIGRhZW1vbiBhbmQgZGVzaXJlZENvdW50IGJvdGggc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnKTtcbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignQmFzZUNvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgbWVtb3J5UmVzZXJ2YXRpb25NaUI6IDEwLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ0VjMlNlcnZpY2UnLCB7XG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgICBkYWVtb246IHRydWUsXG4gICAgICAgICAgZGVzaXJlZENvdW50OiAyLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL0Rvbid0IHN1cHBseSBkZXNpcmVkQ291bnQvKTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdlcnJvcnMgaWYgZGFlbW9uIGFuZCBtYXhpbXVtUGVyY2VudCBub3QgMTAwJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnKTtcbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignQmFzZUNvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgbWVtb3J5UmVzZXJ2YXRpb25NaUI6IDEwLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ0VjMlNlcnZpY2UnLCB7XG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgICBkYWVtb246IHRydWUsXG4gICAgICAgICAgbWF4SGVhbHRoeVBlcmNlbnQ6IDMwMCxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9NYXhpbXVtIHBlcmNlbnQgbXVzdCBiZSAxMDAgZm9yIGRhZW1vbiBtb2RlLi8pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2Vycm9ycyBpZiBtaW5pbXVtIG5vdCBsZXNzIHRoYW4gbWF4aW11bScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJyk7XG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ0Jhc2VDb250YWluZXInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICAgIG1lbW9yeVJlc2VydmF0aW9uTWlCOiAxMCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdFYzJTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgICAgZGFlbW9uOiB0cnVlLFxuICAgICAgICAgIG1pbkhlYWx0aHlQZXJjZW50OiAxMDAsXG4gICAgICAgICAgbWF4SGVhbHRoeVBlcmNlbnQ6IDEwMCxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9NaW5pbXVtIGhlYWx0aHkgcGVyY2VudCBtdXN0IGJlIGxlc3MgdGhhbiBtYXhpbXVtIGhlYWx0aHkgcGVyY2VudC4vKTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdlcnJvcnMgaWYgbm8gY29udGFpbmVyIGRlZmluaXRpb25zJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJyk7XG5cbiAgICAgIC8vIEVycm9ycyBvbiB2YWxpZGF0aW9uLCBub3Qgb24gY29uc3RydWN0aW9uLlxuICAgICAgbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnRWMyU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIH0pLnRvVGhyb3coL29uZSBlc3NlbnRpYWwgY29udGFpbmVyLyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnYWxsb3dzIGFkZGluZyB0aGUgZGVmYXVsdCBjb250YWluZXIgYWZ0ZXIgY3JlYXRpbmcgdGhlIHNlcnZpY2UnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdGYXJnYXRlU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICB9KTtcblxuICAgICAgLy8gQWRkIHRoZSBjb250YWluZXIgKmFmdGVyKiBjcmVhdGluZyB0aGUgc2VydmljZVxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdtYWluJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnc29tZWNvbnRhaW5lcicpLFxuICAgICAgICBtZW1vcnlSZXNlcnZhdGlvbk1pQjogMTAsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgIE5hbWU6ICdtYWluJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnc2V0cyBkYWVtb24gc2NoZWR1bGluZyBzdHJhdGVneScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJyk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnRWMyU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIGRhZW1vbjogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICAgIFNjaGVkdWxpbmdTdHJhdGVneTogJ0RBRU1PTicsXG4gICAgICAgIERlcGxveW1lbnRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgTWF4aW11bVBlcmNlbnQ6IDEwMCxcbiAgICAgICAgICBNaW5pbXVtSGVhbHRoeVBlcmNlbnQ6IDAsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2l0aCBhIFRhc2tEZWZpbml0aW9uIHdpdGggQnJpZGdlIG5ldHdvcmsgbW9kZScsICgpID0+IHtcbiAgICAgIHRlc3QoJ2l0IGVycm9ycyBpZiB2cGNTdWJuZXRzIGlzIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJywge1xuICAgICAgICAgIG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQlJJREdFLFxuICAgICAgICB9KTtcblxuICAgICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgIG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ0VjMlNlcnZpY2UnLCB7XG4gICAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgICAgICB2cGNTdWJuZXRzOiB7XG4gICAgICAgICAgICAgIHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cblxuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2l0IGVycm9ycyBpZiBhc3NpZ25QdWJsaWNJcCBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnLCB7XG4gICAgICAgICAgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5CUklER0UsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnRWMyU2VydmljZScsIHtcbiAgICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgICAgIGFzc2lnblB1YmxpY0lwOiB0cnVlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KS50b1Rocm93KC92cGNTdWJuZXRzLCBzZWN1cml0eUdyb3VwXFwoc1xcKSBhbmQgYXNzaWduUHVibGljSXAgY2FuIG9ubHkgYmUgdXNlZCBpbiBBd3NWcGMgbmV0d29ya2luZyBtb2RlLyk7XG5cbiAgICAgICAgLy8gVEhFTlxuXG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnaXQgZXJyb3JzIGlmIHZwYyBzdWJuZXRzIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgICAgY29uc3Qgc3VibmV0ID0gbmV3IGVjMi5TdWJuZXQoc3RhY2ssICdNeVN1Ym5ldCcsIHtcbiAgICAgICAgICB2cGNJZDogdnBjLnZwY0lkLFxuICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICdldS1jZW50cmFsLTFhJyxcbiAgICAgICAgICBjaWRyQmxvY2s6ICcxMC4xMC4wLjAvMjAnLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnLCB7XG4gICAgICAgICAgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5CUklER0UsXG4gICAgICAgIH0pO1xuICAgICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgIG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ0VjMlNlcnZpY2UnLCB7XG4gICAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgICAgICB2cGNTdWJuZXRzOiB7XG4gICAgICAgICAgICAgIHN1Ym5ldHM6IFtzdWJuZXRdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkudG9UaHJvdygvdnBjU3VibmV0cywgc2VjdXJpdHlHcm91cFxcKHNcXCkgYW5kIGFzc2lnblB1YmxpY0lwIGNhbiBvbmx5IGJlIHVzZWQgaW4gQXdzVnBjIG5ldHdvcmtpbmcgbW9kZS8pO1xuXG4gICAgICAgIC8vIFRIRU5cblxuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2l0IGVycm9ycyBpZiBzZWN1cml0eSBncm91cCBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICAgIGNvbnN0IHNlY3VyaXR5R3JvdXAgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdNeVNHJywgeyB2cGMgfSk7XG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJywge1xuICAgICAgICAgIG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQlJJREdFLFxuICAgICAgICB9KTtcbiAgICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdFYzJTZXJ2aWNlJywge1xuICAgICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICAgICAgc2VjdXJpdHlHcm91cHM6IFtzZWN1cml0eUdyb3VwXSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkudG9UaHJvdygvdnBjU3VibmV0cywgc2VjdXJpdHlHcm91cFxcKHNcXCkgYW5kIGFzc2lnblB1YmxpY0lwIGNhbiBvbmx5IGJlIHVzZWQgaW4gQXdzVnBjIG5ldHdvcmtpbmcgbW9kZS8pO1xuXG4gICAgICAgIC8vIFRIRU5cblxuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2l0IGVycm9ycyBpZiBtdWx0aXBsZSBzZWN1cml0eSBncm91cHMgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgICBjb25zdCBzZWN1cml0eUdyb3VwcyA9IFtcbiAgICAgICAgICBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdNeUZpcnN0U0cnLCB7IHZwYyB9KSxcbiAgICAgICAgICBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdNeVNlY29uZFNHJywgeyB2cGMgfSksXG4gICAgICAgIF07XG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJywge1xuICAgICAgICAgIG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQlJJREdFLFxuICAgICAgICB9KTtcbiAgICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdFYzJTZXJ2aWNlJywge1xuICAgICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICAgICAgc2VjdXJpdHlHcm91cHMsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pLnRvVGhyb3coL3ZwY1N1Ym5ldHMsIHNlY3VyaXR5R3JvdXBcXChzXFwpIGFuZCBhc3NpZ25QdWJsaWNJcCBjYW4gb25seSBiZSB1c2VkIGluIEF3c1ZwYyBuZXR3b3JraW5nIG1vZGUvKTtcblxuICAgICAgICAvLyBUSEVOXG5cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3dpdGggYSBUYXNrRGVmaW5pdGlvbiB3aXRoIEF3c1ZwYyBuZXR3b3JrIG1vZGUnLCAoKSA9PiB7XG4gICAgICB0ZXN0KCdpdCBjcmVhdGVzIGEgc2VjdXJpdHkgZ3JvdXAgZm9yIHRoZSBzZXJ2aWNlJywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnLCB7XG4gICAgICAgICAgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5BV1NfVlBDLFxuICAgICAgICB9KTtcblxuICAgICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnRWMyU2VydmljZScsIHtcbiAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgICBOZXR3b3JrQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgQXdzdnBjQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICBBc3NpZ25QdWJsaWNJcDogJ0RJU0FCTEVEJyxcbiAgICAgICAgICAgICAgU2VjdXJpdHlHcm91cHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ0VjMlNlcnZpY2VTZWN1cml0eUdyb3VwQUVDMzA4MjUnLFxuICAgICAgICAgICAgICAgICAgICAnR3JvdXBJZCcsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIFN1Ym5ldHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdNeVZwY1ByaXZhdGVTdWJuZXQxU3VibmV0NTA1N0NGN0UnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnTXlWcGNQcml2YXRlU3VibmV0MlN1Ym5ldDAwNDBDOTgzJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuXG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnaXQgYWxsb3dzIHZwY1N1Ym5ldHMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicsIHtcbiAgICAgICAgICBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLkFXU19WUEMsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgICB9KTtcblxuICAgICAgICBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdFYzJTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgICAgdnBjU3VibmV0czoge1xuICAgICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cblxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIGRpc3RpbmN0SW5zdGFuY2UgcGxhY2VtZW50IGNvbnN0cmFpbnQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ0VjMlNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBwbGFjZW1lbnRDb25zdHJhaW50czogW2Vjcy5QbGFjZW1lbnRDb25zdHJhaW50LmRpc3RpbmN0SW5zdGFuY2VzKCldLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgUGxhY2VtZW50Q29uc3RyYWludHM6IFt7XG4gICAgICAgICAgVHlwZTogJ2Rpc3RpbmN0SW5zdGFuY2UnLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggbWVtYmVyT2YgcGxhY2VtZW50IGNvbnN0cmFpbnRzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnKTtcblxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnRWMyU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICB9KTtcblxuICAgICAgc2VydmljZS5hZGRQbGFjZW1lbnRDb25zdHJhaW50cyhQbGFjZW1lbnRDb25zdHJhaW50Lm1lbWJlck9mKCdhdHRyaWJ1dGU6ZWNzLmluc3RhbmNlLXR5cGUgPX4gdDIuKicpKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICBQbGFjZW1lbnRDb25zdHJhaW50czogW3tcbiAgICAgICAgICBFeHByZXNzaW9uOiAnYXR0cmlidXRlOmVjcy5pbnN0YW5jZS10eXBlID1+IHQyLionLFxuICAgICAgICAgIFR5cGU6ICdtZW1iZXJPZicsXG4gICAgICAgIH1dLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCBzcHJlYWRBY3Jvc3MgY29udGFpbmVyIGluc3RhbmNlcyBzdHJhdGVneScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJyk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ0VjMlNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHNlcnZpY2UuYWRkUGxhY2VtZW50U3RyYXRlZ2llcyhQbGFjZW1lbnRTdHJhdGVneS5zcHJlYWRBY3Jvc3NJbnN0YW5jZXMoKSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgUGxhY2VtZW50U3RyYXRlZ2llczogW3tcbiAgICAgICAgICBGaWVsZDogJ2luc3RhbmNlSWQnLFxuICAgICAgICAgIFR5cGU6ICdzcHJlYWQnLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggc3ByZWFkQWNyb3NzIHBsYWNlbWVudCBzdHJhdGVneScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJyk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ0VjMlNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgfSk7XG5cbiAgICAgIHNlcnZpY2UuYWRkUGxhY2VtZW50U3RyYXRlZ2llcyhQbGFjZW1lbnRTdHJhdGVneS5zcHJlYWRBY3Jvc3MoZWNzLkJ1aWx0SW5BdHRyaWJ1dGVzLkFWQUlMQUJJTElUWV9aT05FKSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgUGxhY2VtZW50U3RyYXRlZ2llczogW3tcbiAgICAgICAgICBGaWVsZDogJ2F0dHJpYnV0ZTplY3MuYXZhaWxhYmlsaXR5LXpvbmUnLFxuICAgICAgICAgIFR5cGU6ICdzcHJlYWQnLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiB0dXJuIFBsYWNlbWVudFN0cmF0ZWd5IGludG8ganNvbiBmb3JtYXQnLCAoKSA9PiB7XG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoUGxhY2VtZW50U3RyYXRlZ3kuc3ByZWFkQWNyb3NzKGVjcy5CdWlsdEluQXR0cmlidXRlcy5BVkFJTEFCSUxJVFlfWk9ORSkudG9Kc29uKCkpLnRvRXF1YWwoW3tcbiAgICAgICAgdHlwZTogJ3NwcmVhZCcsXG4gICAgICAgIGZpZWxkOiAnYXR0cmlidXRlOmVjcy5hdmFpbGFiaWxpdHktem9uZScsXG4gICAgICB9XSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIHR1cm4gUGxhY2VtZW50Q29uc3RyYWludHMgaW50byBqc29uIGZvcm1hdCcsICgpID0+IHtcbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChQbGFjZW1lbnRDb25zdHJhaW50LmRpc3RpbmN0SW5zdGFuY2VzKCkudG9Kc29uKCkpLnRvRXF1YWwoW3tcbiAgICAgICAgdHlwZTogJ2Rpc3RpbmN0SW5zdGFuY2UnLFxuICAgICAgfV0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2Vycm9ycyB3aGVuIHNwcmVhZEFjcm9zcyB3aXRoIG5vIGlucHV0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnKTtcblxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnRWMyU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgc2VydmljZS5hZGRQbGFjZW1lbnRTdHJhdGVnaWVzKFBsYWNlbWVudFN0cmF0ZWd5LnNwcmVhZEFjcm9zcygpKTtcbiAgICAgIH0pLnRvVGhyb3coJ3NwcmVhZEFjcm9zczogZ2l2ZSBhdCBsZWFzdCBvbmUgZmllbGQgdG8gc3ByZWFkIGJ5Jyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnZXJyb3JzIHdpdGggc3ByZWFkQWNyb3NzIHBsYWNlbWVudCBzdHJhdGVneSBpZiBkYWVtb24gc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnKTtcblxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnRWMyU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIGRhZW1vbjogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBzZXJ2aWNlLmFkZFBsYWNlbWVudFN0cmF0ZWdpZXMoUGxhY2VtZW50U3RyYXRlZ3kuc3ByZWFkQWNyb3NzKGVjcy5CdWlsdEluQXR0cmlidXRlcy5BVkFJTEFCSUxJVFlfWk9ORSkpO1xuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCBubyBwbGFjZW1lbnQgY29uc3RyYWludHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ0VjMlNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgUGxhY2VtZW50Q29uc3RyYWludHM6IE1hdGNoLmFic2VudCgpLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0RGVwcmVjYXRlZCgnd2l0aCBib3RoIHByb3BhZ2F0ZVRhZ3MgYW5kIHByb3BhZ2F0ZVRhc2tUYWdzRnJvbSBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnKTtcblxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdFYzJTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgICAgcHJvcGFnYXRlVGFnczogUHJvcGFnYXRlZFRhZ1NvdXJjZS5TRVJWSUNFLFxuICAgICAgICAgIHByb3BhZ2F0ZVRhc2tUYWdzRnJvbTogUHJvcGFnYXRlZFRhZ1NvdXJjZS5TRVJWSUNFLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL1lvdSBjYW4gb25seSBzcGVjaWZ5IGVpdGhlciBwcm9wYWdhdGVUYWdzIG9yIHByb3BhZ2F0ZVRhc2tUYWdzRnJvbS4gQWx0ZXJuYXRpdmVseSwgeW91IGNhbiBsZWF2ZSBib3RoIGJsYW5rLyk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggbm8gcGxhY2VtZW50IHN0cmF0ZWd5IGlmIGRhZW1vbiBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ0VjMlNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBkYWVtb246IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICBQbGFjZW1lbnRTdHJhdGVnaWVzOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCByYW5kb20gcGxhY2VtZW50IHN0cmF0ZWd5JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdFYzJTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgIH0pO1xuXG4gICAgICBzZXJ2aWNlLmFkZFBsYWNlbWVudFN0cmF0ZWdpZXMoUGxhY2VtZW50U3RyYXRlZ3kucmFuZG9tbHkoKSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgUGxhY2VtZW50U3RyYXRlZ2llczogW3tcbiAgICAgICAgICBUeXBlOiAncmFuZG9tJyxcbiAgICAgICAgfV0sXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdlcnJvcnMgd2l0aCByYW5kb20gcGxhY2VtZW50IHN0cmF0ZWd5IGlmIGRhZW1vbiBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJyk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJyk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ0VjMlNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBkYWVtb246IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgc2VydmljZS5hZGRQbGFjZW1lbnRTdHJhdGVnaWVzKFBsYWNlbWVudFN0cmF0ZWd5LnJhbmRvbWx5KCkpO1xuICAgICAgfSkudG9UaHJvdygpO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggcGFja2VkYnlDcHUgcGxhY2VtZW50IHN0cmF0ZWd5JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnKTtcblxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnRWMyU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICB9KTtcblxuICAgICAgc2VydmljZS5hZGRQbGFjZW1lbnRTdHJhdGVnaWVzKFBsYWNlbWVudFN0cmF0ZWd5LnBhY2tlZEJ5Q3B1KCkpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICAgIFBsYWNlbWVudFN0cmF0ZWdpZXM6IFt7XG4gICAgICAgICAgRmllbGQ6ICdDUFUnLFxuICAgICAgICAgIFR5cGU6ICdiaW5wYWNrJyxcbiAgICAgICAgfV0sXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIHBhY2tlZGJ5TWVtb3J5IHBsYWNlbWVudCBzdHJhdGVneScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJyk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ0VjMlNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgfSk7XG5cbiAgICAgIHNlcnZpY2UuYWRkUGxhY2VtZW50U3RyYXRlZ2llcyhQbGFjZW1lbnRTdHJhdGVneS5wYWNrZWRCeU1lbW9yeSgpKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICBQbGFjZW1lbnRTdHJhdGVnaWVzOiBbe1xuICAgICAgICAgIEZpZWxkOiAnTUVNT1JZJyxcbiAgICAgICAgICBUeXBlOiAnYmlucGFjaycsXG4gICAgICAgIH1dLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCBwYWNrZWRCeSBwbGFjZW1lbnQgc3RyYXRlZ3knLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdFYzJTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgIH0pO1xuXG4gICAgICBzZXJ2aWNlLmFkZFBsYWNlbWVudFN0cmF0ZWdpZXMoUGxhY2VtZW50U3RyYXRlZ3kucGFja2VkQnkoZWNzLkJpblBhY2tSZXNvdXJjZS5NRU1PUlkpKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICBQbGFjZW1lbnRTdHJhdGVnaWVzOiBbe1xuICAgICAgICAgIEZpZWxkOiAnTUVNT1JZJyxcbiAgICAgICAgICBUeXBlOiAnYmlucGFjaycsXG4gICAgICAgIH1dLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnZXJyb3JzIHdpdGggcGFja2VkQnkgcGxhY2VtZW50IHN0cmF0ZWd5IGlmIGRhZW1vbiBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdFYzJTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgZGFlbW9uOiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHNlcnZpY2UuYWRkUGxhY2VtZW50U3RyYXRlZ2llcyhQbGFjZW1lbnRTdHJhdGVneS5wYWNrZWRCeShlY3MuQmluUGFja1Jlc291cmNlLk1FTU9SWSkpO1xuICAgICAgfSkudG9UaHJvdygpO1xuXG5cbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2F0dGFjaFRvQ2xhc3NpY0xCJywgKCkgPT4ge1xuICAgIHRlc3QoJ2FsbG93cyBuZXR3b3JrIG1vZGUgb2YgdGFzayBkZWZpbml0aW9uIHRvIGJlIGhvc3QnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVEQnLCB7IG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuSE9TVCB9KTtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogMTAyNCxcbiAgICAgIH0pO1xuICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwOCB9KTtcbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCBsYiA9IG5ldyBlbGIuTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYyB9KTtcbiAgICAgIHNlcnZpY2UuYXR0YWNoVG9DbGFzc2ljTEIobGIpO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2FsbG93cyBuZXR3b3JrIG1vZGUgb2YgdGFzayBkZWZpbml0aW9uIHRvIGJlIGJyaWRnZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdURCcsIHsgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5CUklER0UgfSk7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICB9KTtcbiAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDggfSk7XG4gICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgbGIgPSBuZXcgZWxiLkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG4gICAgICBzZXJ2aWNlLmF0dGFjaFRvQ2xhc3NpY0xCKGxiKTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3Mgd2hlbiBuZXR3b3JrIG1vZGUgb2YgdGFzayBkZWZpbml0aW9uIGlzIEF3c1ZwYycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdURCcsIHsgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5BV1NfVlBDIH0pO1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgfSk7XG4gICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODA4IH0pO1xuICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvbnN0IGxiID0gbmV3IGVsYi5Mb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHsgdnBjIH0pO1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgc2VydmljZS5hdHRhY2hUb0NsYXNzaWNMQihsYik7XG4gICAgICB9KS50b1Rocm93KC9DYW5ub3QgdXNlIGEgQ2xhc3NpYyBMb2FkIEJhbGFuY2VyIGlmIE5ldHdvcmtNb2RlIGlzIEF3c1ZwYy4gVXNlIEhvc3Qgb3IgQnJpZGdlIGluc3RlYWQuLyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIHdoZW4gbmV0d29yayBtb2RlIG9mIHRhc2sgZGVmaW5pdGlvbiBpcyBub25lJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1REJywgeyBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLk5PTkUgfSk7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICB9KTtcbiAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDggfSk7XG4gICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgbGIgPSBuZXcgZWxiLkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBzZXJ2aWNlLmF0dGFjaFRvQ2xhc3NpY0xCKGxiKTtcbiAgICAgIH0pLnRvVGhyb3coL0Nhbm5vdCB1c2UgYSBDbGFzc2ljIExvYWQgQmFsYW5jZXIgaWYgTmV0d29ya01vZGUgaXMgTm9uZS4gVXNlIEhvc3Qgb3IgQnJpZGdlIGluc3RlYWQuLyk7XG5cblxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnYXR0YWNoVG9BcHBsaWNhdGlvblRhcmdldEdyb3VwJywgKCkgPT4ge1xuICAgIHRlc3QoJ2FsbG93cyBuZXR3b3JrIG1vZGUgb2YgdGFzayBkZWZpbml0aW9uIHRvIGJlIG90aGVyIHRoYW4gbm9uZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicsIHsgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5BV1NfVlBDIH0pO1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdNYWluQ29udGFpbmVyJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICAgIH0pO1xuICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwMDAgfSk7XG5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ2xiJywgeyB2cGMgfSk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdsaXN0ZW5lcicsIHsgcG9ydDogODAgfSk7XG4gICAgICBjb25zdCB0YXJnZXRHcm91cCA9IGxpc3RlbmVyLmFkZFRhcmdldHMoJ3RhcmdldCcsIHtcbiAgICAgICAgcG9ydDogODAsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgc2VydmljZS5hdHRhY2hUb0FwcGxpY2F0aW9uVGFyZ2V0R3JvdXAodGFyZ2V0R3JvdXApO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyB3aGVuIG5ldHdvcmsgbW9kZSBvZiB0YXNrIGRlZmluaXRpb24gaXMgbm9uZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicsIHsgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5OT05FIH0pO1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdNYWluQ29udGFpbmVyJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICAgIH0pO1xuICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwMDAgfSk7XG5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ2xiJywgeyB2cGMgfSk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdsaXN0ZW5lcicsIHsgcG9ydDogODAgfSk7XG4gICAgICBjb25zdCB0YXJnZXRHcm91cCA9IGxpc3RlbmVyLmFkZFRhcmdldHMoJ3RhcmdldCcsIHtcbiAgICAgICAgcG9ydDogODAsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgc2VydmljZS5hdHRhY2hUb0FwcGxpY2F0aW9uVGFyZ2V0R3JvdXAodGFyZ2V0R3JvdXApO1xuICAgICAgfSkudG9UaHJvdygvQ2Fubm90IHVzZSBhIGxvYWQgYmFsYW5jZXIgaWYgTmV0d29ya01vZGUgaXMgTm9uZS4gVXNlIEJyaWRnZSwgSG9zdCBvciBBd3NWcGMgaW5zdGVhZC4vKTtcblxuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnY29ycmVjdGx5IHNldHRpbmcgaW5ncmVzcyBhbmQgZWdyZXNzIHBvcnQnLCAoKSA9PiB7XG4gICAgICB0ZXN0KCd3aXRoIGJyaWRnZS9OQVQgbmV0d29yayBtb2RlIGFuZCAwIGhvc3QgcG9ydCcsICgpID0+IHtcbiAgICAgICAgW2Vjcy5OZXR3b3JrTW9kZS5CUklER0UsIGVjcy5OZXR3b3JrTW9kZS5OQVRdLmZvckVhY2goKG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUpID0+IHtcbiAgICAgICAgICAvLyBHSVZFTlxuICAgICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgICAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICAgICAgICBjbHVzdGVyLmNvbm5lY3Rpb25zLmFkZFNlY3VyaXR5R3JvdXAoKTtcbiAgICAgICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJywgeyBuZXR3b3JrTW9kZSB9KTtcbiAgICAgICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ01haW5Db250YWluZXInLCB7XG4gICAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICAgICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwMDAgfSk7XG4gICAgICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwMDEgfSk7XG5cbiAgICAgICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIFdIRU5cbiAgICAgICAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ2xiJywgeyB2cGMgfSk7XG4gICAgICAgICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignbGlzdGVuZXInLCB7IHBvcnQ6IDgwIH0pO1xuICAgICAgICAgIGxpc3RlbmVyLmFkZFRhcmdldHMoJ3RhcmdldCcsIHtcbiAgICAgICAgICAgIHBvcnQ6IDgwLFxuICAgICAgICAgICAgdGFyZ2V0czogW3NlcnZpY2UubG9hZEJhbGFuY2VyVGFyZ2V0KHtcbiAgICAgICAgICAgICAgY29udGFpbmVyTmFtZTogJ01haW5Db250YWluZXInLFxuICAgICAgICAgICAgICBjb250YWluZXJQb3J0OiA4MDAxLFxuICAgICAgICAgICAgfSldLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gVEhFTlxuICAgICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cEluZ3Jlc3MnLCB7XG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogJ0xvYWQgYmFsYW5jZXIgdG8gdGFyZ2V0JyxcbiAgICAgICAgICAgIEZyb21Qb3J0OiAzMjc2OCxcbiAgICAgICAgICAgIFRvUG9ydDogNjU1MzUsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBFZ3Jlc3MnLCB7XG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogJ0xvYWQgYmFsYW5jZXIgdG8gdGFyZ2V0JyxcbiAgICAgICAgICAgIEZyb21Qb3J0OiAzMjc2OCxcbiAgICAgICAgICAgIFRvUG9ydDogNjU1MzUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG5cbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCd3aXRoIGJyaWRnZS9OQVQgbmV0d29yayBtb2RlIGFuZCBob3N0IHBvcnQgb3RoZXIgdGhhbiAwJywgKCkgPT4ge1xuICAgICAgICBbZWNzLk5ldHdvcmtNb2RlLkJSSURHRSwgZWNzLk5ldHdvcmtNb2RlLk5BVF0uZm9yRWFjaCgobmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZSkgPT4ge1xuICAgICAgICAgIC8vIEdJVkVOXG4gICAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnLCB7IG5ldHdvcmtNb2RlIH0pO1xuICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignTWFpbkNvbnRhaW5lcicsIHtcbiAgICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZWxsbycpLFxuICAgICAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMCB9KTtcbiAgICAgICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMSwgaG9zdFBvcnQ6IDgwIH0pO1xuXG4gICAgICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBXSEVOXG4gICAgICAgICAgY29uc3QgbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdsYicsIHsgdnBjIH0pO1xuICAgICAgICAgIGNvbnN0IGxpc3RlbmVyID0gbGIuYWRkTGlzdGVuZXIoJ2xpc3RlbmVyJywgeyBwb3J0OiA4MCB9KTtcbiAgICAgICAgICBsaXN0ZW5lci5hZGRUYXJnZXRzKCd0YXJnZXQnLCB7XG4gICAgICAgICAgICBwb3J0OiA4MCxcbiAgICAgICAgICAgIHRhcmdldHM6IFtzZXJ2aWNlLmxvYWRCYWxhbmNlclRhcmdldCh7XG4gICAgICAgICAgICAgIGNvbnRhaW5lck5hbWU6ICdNYWluQ29udGFpbmVyJyxcbiAgICAgICAgICAgICAgY29udGFpbmVyUG9ydDogODAwMSxcbiAgICAgICAgICAgIH0pXSxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIFRIRU5cbiAgICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBJbmdyZXNzJywge1xuICAgICAgICAgICAgRGVzY3JpcHRpb246ICdMb2FkIGJhbGFuY2VyIHRvIHRhcmdldCcsXG4gICAgICAgICAgICBGcm9tUG9ydDogODAsXG4gICAgICAgICAgICBUb1BvcnQ6IDgwLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwRWdyZXNzJywge1xuICAgICAgICAgICAgRGVzY3JpcHRpb246ICdMb2FkIGJhbGFuY2VyIHRvIHRhcmdldCcsXG4gICAgICAgICAgICBGcm9tUG9ydDogODAsXG4gICAgICAgICAgICBUb1BvcnQ6IDgwLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuXG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnd2l0aCBob3N0IG5ldHdvcmsgbW9kZScsICgpID0+IHtcbiAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJywgeyBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLkhPU1QgfSk7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignTWFpbkNvbnRhaW5lcicsIHtcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgICB9KTtcbiAgICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwMDAgfSk7XG4gICAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDAxIH0pO1xuXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgY29uc3QgbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdsYicsIHsgdnBjIH0pO1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdsaXN0ZW5lcicsIHsgcG9ydDogODAgfSk7XG4gICAgICAgIGxpc3RlbmVyLmFkZFRhcmdldHMoJ3RhcmdldCcsIHtcbiAgICAgICAgICBwb3J0OiA4MCxcbiAgICAgICAgICB0YXJnZXRzOiBbc2VydmljZS5sb2FkQmFsYW5jZXJUYXJnZXQoe1xuICAgICAgICAgICAgY29udGFpbmVyTmFtZTogJ01haW5Db250YWluZXInLFxuICAgICAgICAgICAgY29udGFpbmVyUG9ydDogODAwMSxcbiAgICAgICAgICB9KV0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwSW5ncmVzcycsIHtcbiAgICAgICAgICBEZXNjcmlwdGlvbjogJ0xvYWQgYmFsYW5jZXIgdG8gdGFyZ2V0JyxcbiAgICAgICAgICBGcm9tUG9ydDogODAwMSxcbiAgICAgICAgICBUb1BvcnQ6IDgwMDEsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cEVncmVzcycsIHtcbiAgICAgICAgICBEZXNjcmlwdGlvbjogJ0xvYWQgYmFsYW5jZXIgdG8gdGFyZ2V0JyxcbiAgICAgICAgICBGcm9tUG9ydDogODAwMSxcbiAgICAgICAgICBUb1BvcnQ6IDgwMDEsXG4gICAgICAgIH0pO1xuXG5cbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCd3aXRoIGF3c192cGMgbmV0d29yayBtb2RlJywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnLCB7IG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQVdTX1ZQQyB9KTtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdNYWluQ29udGFpbmVyJywge1xuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZWxsbycpLFxuICAgICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICAgIH0pO1xuICAgICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMCB9KTtcbiAgICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwMDEgfSk7XG5cbiAgICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ2xiJywgeyB2cGMgfSk7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gbGIuYWRkTGlzdGVuZXIoJ2xpc3RlbmVyJywgeyBwb3J0OiA4MCB9KTtcbiAgICAgICAgbGlzdGVuZXIuYWRkVGFyZ2V0cygndGFyZ2V0Jywge1xuICAgICAgICAgIHBvcnQ6IDgwLFxuICAgICAgICAgIHRhcmdldHM6IFtzZXJ2aWNlLmxvYWRCYWxhbmNlclRhcmdldCh7XG4gICAgICAgICAgICBjb250YWluZXJOYW1lOiAnTWFpbkNvbnRhaW5lcicsXG4gICAgICAgICAgICBjb250YWluZXJQb3J0OiA4MDAxLFxuICAgICAgICAgIH0pXSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBJbmdyZXNzJywge1xuICAgICAgICAgIERlc2NyaXB0aW9uOiAnTG9hZCBiYWxhbmNlciB0byB0YXJnZXQnLFxuICAgICAgICAgIEZyb21Qb3J0OiA4MDAxLFxuICAgICAgICAgIFRvUG9ydDogODAwMSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwRWdyZXNzJywge1xuICAgICAgICAgIERlc2NyaXB0aW9uOiAnTG9hZCBiYWxhbmNlciB0byB0YXJnZXQnLFxuICAgICAgICAgIEZyb21Qb3J0OiA4MDAxLFxuICAgICAgICAgIFRvUG9ydDogODAwMSxcbiAgICAgICAgfSk7XG5cblxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdhdHRhY2hUb05ldHdvcmtUYXJnZXRHcm91cCcsICgpID0+IHtcbiAgICB0ZXN0KCdhbGxvd3MgbmV0d29yayBtb2RlIG9mIHRhc2sgZGVmaW5pdGlvbiB0byBiZSBvdGhlciB0aGFuIG5vbmUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnLCB7IG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQVdTX1ZQQyB9KTtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignTWFpbkNvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbGxvJyksXG4gICAgICB9KTtcbiAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDAwIH0pO1xuXG4gICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgbGIgPSBuZXcgZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlcihzdGFjaywgJ2xiJywgeyB2cGMgfSk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdsaXN0ZW5lcicsIHsgcG9ydDogODAgfSk7XG4gICAgICBjb25zdCB0YXJnZXRHcm91cCA9IGxpc3RlbmVyLmFkZFRhcmdldHMoJ3RhcmdldCcsIHtcbiAgICAgICAgcG9ydDogODAsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgc2VydmljZS5hdHRhY2hUb05ldHdvcmtUYXJnZXRHcm91cCh0YXJnZXRHcm91cCk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIHdoZW4gbmV0d29yayBtb2RlIG9mIHRhc2sgZGVmaW5pdGlvbiBpcyBub25lJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJywgeyBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLk5PTkUgfSk7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ01haW5Db250YWluZXInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZWxsbycpLFxuICAgICAgfSk7XG4gICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMCB9KTtcblxuICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdsYicsIHsgdnBjIH0pO1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignbGlzdGVuZXInLCB7IHBvcnQ6IDgwIH0pO1xuICAgICAgY29uc3QgdGFyZ2V0R3JvdXAgPSBsaXN0ZW5lci5hZGRUYXJnZXRzKCd0YXJnZXQnLCB7XG4gICAgICAgIHBvcnQ6IDgwLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHNlcnZpY2UuYXR0YWNoVG9OZXR3b3JrVGFyZ2V0R3JvdXAodGFyZ2V0R3JvdXApO1xuICAgICAgfSkudG9UaHJvdygvQ2Fubm90IHVzZSBhIGxvYWQgYmFsYW5jZXIgaWYgTmV0d29ya01vZGUgaXMgTm9uZS4gVXNlIEJyaWRnZSwgSG9zdCBvciBBd3NWcGMgaW5zdGVhZC4vKTtcblxuXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdjbGFzc2ljIEVMQicsICgpID0+IHtcbiAgICB0ZXN0KCdjYW4gYXR0YWNoIHRvIGNsYXNzaWMgRUxCJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1REJywgeyBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLkhPU1QgfSk7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICB9KTtcbiAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDggfSk7XG4gICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgbGIgPSBuZXcgZWxiLkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG4gICAgICBsYi5hZGRUYXJnZXQoc2VydmljZSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgTG9hZEJhbGFuY2VyczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENvbnRhaW5lck5hbWU6ICd3ZWInLFxuICAgICAgICAgICAgQ29udGFpbmVyUG9ydDogODA4LFxuICAgICAgICAgICAgTG9hZEJhbGFuY2VyTmFtZTogeyBSZWY6ICdMQjhBMTI5MDRDJyB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICAvLyBpZiBhbnkgbG9hZCBiYWxhbmNlciBpcyBjb25maWd1cmVkIGFuZCBoZWFsdGhDaGVja0dyYWNlUGVyaW9kU2Vjb25kcyBpcyBub3RcbiAgICAgICAgLy8gc2V0LCB0aGVuIGl0IHNob3VsZCBkZWZhdWx0IHRvIDYwIHNlY29uZHMuXG4gICAgICAgIEhlYWx0aENoZWNrR3JhY2VQZXJpb2RTZWNvbmRzOiA2MCxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBhdHRhY2ggYW55IGNvbnRhaW5lciBhbmQgcG9ydCBhcyBhIHRhcmdldCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdURCcsIHsgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5IT1NUIH0pO1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgfSk7XG4gICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODA4IH0pO1xuICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwODAgfSk7XG4gICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgbGIgPSBuZXcgZWxiLkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMgfSk7XG4gICAgICBsYi5hZGRUYXJnZXQoc2VydmljZS5sb2FkQmFsYW5jZXJUYXJnZXQoe1xuICAgICAgICBjb250YWluZXJOYW1lOiAnd2ViJyxcbiAgICAgICAgY29udGFpbmVyUG9ydDogODA4MCxcbiAgICAgIH0pKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICBMb2FkQmFsYW5jZXJzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ29udGFpbmVyTmFtZTogJ3dlYicsXG4gICAgICAgICAgICBDb250YWluZXJQb3J0OiA4MDgwLFxuICAgICAgICAgICAgTG9hZEJhbGFuY2VyTmFtZTogeyBSZWY6ICdMQjhBMTI5MDRDJyB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdXaGVuIGVuYWJsaW5nIHNlcnZpY2UgZGlzY292ZXJ5JywgKCkgPT4ge1xuICAgIHRlc3QoJ3Rocm93cyBpZiBuYW1lc3BhY2UgaGFzIG5vdCBiZWVuIGFkZGVkIHRvIGNsdXN0ZXInLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuXG4gICAgICAvLyBkZWZhdWx0IG5ldHdvcmsgbW9kZSBpcyBicmlkZ2VcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnKTtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignTWFpbkNvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbGxvJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcbiAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDAwIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgICAgY2xvdWRNYXBPcHRpb25zOiB7XG4gICAgICAgICAgICBuYW1lOiAnbXlBcHAnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvQ2Fubm90IGVuYWJsZSBzZXJ2aWNlIGRpc2NvdmVyeSBpZiBhIENsb3VkbWFwIE5hbWVzcGFjZSBoYXMgbm90IGJlZW4gY3JlYXRlZCBpbiB0aGUgY2x1c3Rlci4vKTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdmYWlscyB0byBlbmFibGUgU2VydmljZSBEaXNjb3Zlcnkgd2l0aCBIVFRQIGRlZmF1bHRDbG91ZG1hcE5hbWVzcGFjZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJywge1xuICAgICAgICBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLk5PTkUsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignTWFpbkNvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbGxvJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcbiAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDAwIH0pO1xuXG4gICAgICBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7IG5hbWU6ICdmb28uY29tJywgdHlwZTogY2xvdWRtYXAuTmFtZXNwYWNlVHlwZS5IVFRQIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgICAgY2xvdWRNYXBPcHRpb25zOiB7XG4gICAgICAgICAgICBuYW1lOiAnbXlBcHAnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvQ2Fubm90IGVuYWJsZSBETlMgc2VydmljZSBkaXNjb3ZlcnkgZm9yIEhUVFAgQ2xvdWRtYXAgTmFtZXNwYWNlLi8pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBpZiBuZXR3b3JrIG1vZGUgaXMgbm9uZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJywge1xuICAgICAgICBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLk5PTkUsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignTWFpbkNvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbGxvJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcbiAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDAwIH0pO1xuXG4gICAgICBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7IG5hbWU6ICdmb28uY29tJyB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICAgIGNsb3VkTWFwT3B0aW9uczoge1xuICAgICAgICAgICAgbmFtZTogJ215QXBwJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL0Nhbm5vdCB1c2UgYSBzZXJ2aWNlIGRpc2NvdmVyeSBpZiBOZXR3b3JrTW9kZSBpcyBOb25lLiBVc2UgQnJpZGdlLCBIb3N0IG9yIEF3c1ZwYyBpbnN0ZWFkLi8pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2NyZWF0ZXMgQVdTIENsb3VkIE1hcCBzZXJ2aWNlIGZvciBQcml2YXRlIEROUyBuYW1lc3BhY2Ugd2l0aCBicmlkZ2UgbmV0d29yayBtb2RlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcblxuICAgICAgLy8gZGVmYXVsdCBuZXR3b3JrIG1vZGUgaXMgYnJpZGdlXG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJyk7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ01haW5Db250YWluZXInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZWxsbycpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG4gICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMCB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY2x1c3Rlci5hZGREZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2Uoe1xuICAgICAgICBuYW1lOiAnZm9vLmNvbScsXG4gICAgICAgIHR5cGU6IGNsb3VkbWFwLk5hbWVzcGFjZVR5cGUuRE5TX1BSSVZBVEUsXG4gICAgICB9KTtcblxuICAgICAgbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIGNsb3VkTWFwT3B0aW9uczoge1xuICAgICAgICAgIG5hbWU6ICdteUFwcCcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICBTZXJ2aWNlUmVnaXN0cmllczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENvbnRhaW5lck5hbWU6ICdNYWluQ29udGFpbmVyJyxcbiAgICAgICAgICAgIENvbnRhaW5lclBvcnQ6IDgwMDAsXG4gICAgICAgICAgICBSZWdpc3RyeUFybjoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnU2VydmljZUNsb3VkbWFwU2VydmljZTA0NjA1OEE0JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTZXJ2aWNlRGlzY292ZXJ5OjpTZXJ2aWNlJywge1xuICAgICAgICBEbnNDb25maWc6IHtcbiAgICAgICAgICBEbnNSZWNvcmRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFRUTDogNjAsXG4gICAgICAgICAgICAgIFR5cGU6ICdTUlYnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIE5hbWVzcGFjZUlkOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ0Vjc0NsdXN0ZXJEZWZhdWx0U2VydmljZURpc2NvdmVyeU5hbWVzcGFjZUIwOTcxQjJGJyxcbiAgICAgICAgICAgICAgJ0lkJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBSb3V0aW5nUG9saWN5OiAnTVVMVElWQUxVRScsXG4gICAgICAgIH0sXG4gICAgICAgIEhlYWx0aENoZWNrQ3VzdG9tQ29uZmlnOiB7XG4gICAgICAgICAgRmFpbHVyZVRocmVzaG9sZDogMSxcbiAgICAgICAgfSxcbiAgICAgICAgTmFtZTogJ215QXBwJyxcbiAgICAgICAgTmFtZXNwYWNlSWQ6IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdFY3NDbHVzdGVyRGVmYXVsdFNlcnZpY2VEaXNjb3ZlcnlOYW1lc3BhY2VCMDk3MUIyRicsXG4gICAgICAgICAgICAnSWQnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjcmVhdGVzIEFXUyBDbG91ZCBNYXAgc2VydmljZSBmb3IgUHJpdmF0ZSBETlMgbmFtZXNwYWNlIHdpdGggaG9zdCBuZXR3b3JrIG1vZGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuXG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJywge1xuICAgICAgICBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLkhPU1QsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignTWFpbkNvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbGxvJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcbiAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDAwIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7XG4gICAgICAgIG5hbWU6ICdmb28uY29tJyxcbiAgICAgICAgdHlwZTogY2xvdWRtYXAuTmFtZXNwYWNlVHlwZS5ETlNfUFJJVkFURSxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgY2xvdWRNYXBPcHRpb25zOiB7XG4gICAgICAgICAgbmFtZTogJ215QXBwJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICAgIFNlcnZpY2VSZWdpc3RyaWVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ29udGFpbmVyTmFtZTogJ01haW5Db250YWluZXInLFxuICAgICAgICAgICAgQ29udGFpbmVyUG9ydDogODAwMCxcbiAgICAgICAgICAgIFJlZ2lzdHJ5QXJuOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdTZXJ2aWNlQ2xvdWRtYXBTZXJ2aWNlMDQ2MDU4QTQnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNlcnZpY2VEaXNjb3Zlcnk6OlNlcnZpY2UnLCB7XG4gICAgICAgIERuc0NvbmZpZzoge1xuICAgICAgICAgIERuc1JlY29yZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgVFRMOiA2MCxcbiAgICAgICAgICAgICAgVHlwZTogJ1NSVicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgTmFtZXNwYWNlSWQ6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnRWNzQ2x1c3RlckRlZmF1bHRTZXJ2aWNlRGlzY292ZXJ5TmFtZXNwYWNlQjA5NzFCMkYnLFxuICAgICAgICAgICAgICAnSWQnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJvdXRpbmdQb2xpY3k6ICdNVUxUSVZBTFVFJyxcbiAgICAgICAgfSxcbiAgICAgICAgSGVhbHRoQ2hlY2tDdXN0b21Db25maWc6IHtcbiAgICAgICAgICBGYWlsdXJlVGhyZXNob2xkOiAxLFxuICAgICAgICB9LFxuICAgICAgICBOYW1lOiAnbXlBcHAnLFxuICAgICAgICBOYW1lc3BhY2VJZDoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0Vjc0NsdXN0ZXJEZWZhdWx0U2VydmljZURpc2NvdmVyeU5hbWVzcGFjZUIwOTcxQjJGJyxcbiAgICAgICAgICAgICdJZCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBpZiB3cm9uZyBETlMgcmVjb3JkIHR5cGUgc3BlY2lmaWVkIHdpdGggYnJpZGdlIG5ldHdvcmsgbW9kZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG5cbiAgICAgIC8vIGRlZmF1bHQgbmV0d29yayBtb2RlIGlzIGJyaWRnZVxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdNYWluQ29udGFpbmVyJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwMDAgfSk7XG5cbiAgICAgIGNsdXN0ZXIuYWRkRGVmYXVsdENsb3VkTWFwTmFtZXNwYWNlKHtcbiAgICAgICAgbmFtZTogJ2Zvby5jb20nLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgICBjbG91ZE1hcE9wdGlvbnM6IHtcbiAgICAgICAgICAgIG5hbWU6ICdteUFwcCcsXG4gICAgICAgICAgICBkbnNSZWNvcmRUeXBlOiBjbG91ZG1hcC5EbnNSZWNvcmRUeXBlLkEsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9TUlYgcmVjb3JkcyBtdXN0IGJlIHVzZWQgd2hlbiBuZXR3b3JrIG1vZGUgaXMgQnJpZGdlIG9yIEhvc3QuLyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnY3JlYXRlcyBBV1MgQ2xvdWQgTWFwIHNlcnZpY2UgZm9yIFByaXZhdGUgRE5TIG5hbWVzcGFjZSB3aXRoIEF3c1ZwYyBuZXR3b3JrIG1vZGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuXG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJywge1xuICAgICAgICBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLkFXU19WUEMsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignTWFpbkNvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbGxvJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcbiAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDAwIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7XG4gICAgICAgIG5hbWU6ICdmb28uY29tJyxcbiAgICAgICAgdHlwZTogY2xvdWRtYXAuTmFtZXNwYWNlVHlwZS5ETlNfUFJJVkFURSxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgY2xvdWRNYXBPcHRpb25zOiB7XG4gICAgICAgICAgbmFtZTogJ215QXBwJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICAgIFNlcnZpY2VSZWdpc3RyaWVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVnaXN0cnlBcm46IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ1NlcnZpY2VDbG91ZG1hcFNlcnZpY2UwNDYwNThBNCcsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VydmljZURpc2NvdmVyeTo6U2VydmljZScsIHtcbiAgICAgICAgRG5zQ29uZmlnOiB7XG4gICAgICAgICAgRG5zUmVjb3JkczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBUVEw6IDYwLFxuICAgICAgICAgICAgICBUeXBlOiAnQScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgTmFtZXNwYWNlSWQ6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnRWNzQ2x1c3RlckRlZmF1bHRTZXJ2aWNlRGlzY292ZXJ5TmFtZXNwYWNlQjA5NzFCMkYnLFxuICAgICAgICAgICAgICAnSWQnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJvdXRpbmdQb2xpY3k6ICdNVUxUSVZBTFVFJyxcbiAgICAgICAgfSxcbiAgICAgICAgSGVhbHRoQ2hlY2tDdXN0b21Db25maWc6IHtcbiAgICAgICAgICBGYWlsdXJlVGhyZXNob2xkOiAxLFxuICAgICAgICB9LFxuICAgICAgICBOYW1lOiAnbXlBcHAnLFxuICAgICAgICBOYW1lc3BhY2VJZDoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0Vjc0NsdXN0ZXJEZWZhdWx0U2VydmljZURpc2NvdmVyeU5hbWVzcGFjZUIwOTcxQjJGJyxcbiAgICAgICAgICAgICdJZCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2NyZWF0ZXMgQVdTIENsb3VkIE1hcCBzZXJ2aWNlIGZvciBQcml2YXRlIEROUyBuYW1lc3BhY2Ugd2l0aCBBd3NWcGMgbmV0d29yayBtb2RlIHdpdGggU1JWIHJlY29yZHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuXG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJywge1xuICAgICAgICBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLkFXU19WUEMsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignTWFpbkNvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbGxvJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcbiAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA4MDAwIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7XG4gICAgICAgIG5hbWU6ICdmb28uY29tJyxcbiAgICAgICAgdHlwZTogY2xvdWRtYXAuTmFtZXNwYWNlVHlwZS5ETlNfUFJJVkFURSxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgY2xvdWRNYXBPcHRpb25zOiB7XG4gICAgICAgICAgbmFtZTogJ215QXBwJyxcbiAgICAgICAgICBkbnNSZWNvcmRUeXBlOiBjbG91ZG1hcC5EbnNSZWNvcmRUeXBlLlNSVixcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICAgIFNlcnZpY2VSZWdpc3RyaWVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ29udGFpbmVyTmFtZTogJ01haW5Db250YWluZXInLFxuICAgICAgICAgICAgQ29udGFpbmVyUG9ydDogODAwMCxcbiAgICAgICAgICAgIFJlZ2lzdHJ5QXJuOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdTZXJ2aWNlQ2xvdWRtYXBTZXJ2aWNlMDQ2MDU4QTQnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNlcnZpY2VEaXNjb3Zlcnk6OlNlcnZpY2UnLCB7XG4gICAgICAgIERuc0NvbmZpZzoge1xuICAgICAgICAgIERuc1JlY29yZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgVFRMOiA2MCxcbiAgICAgICAgICAgICAgVHlwZTogJ1NSVicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgTmFtZXNwYWNlSWQ6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnRWNzQ2x1c3RlckRlZmF1bHRTZXJ2aWNlRGlzY292ZXJ5TmFtZXNwYWNlQjA5NzFCMkYnLFxuICAgICAgICAgICAgICAnSWQnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJvdXRpbmdQb2xpY3k6ICdNVUxUSVZBTFVFJyxcbiAgICAgICAgfSxcbiAgICAgICAgSGVhbHRoQ2hlY2tDdXN0b21Db25maWc6IHtcbiAgICAgICAgICBGYWlsdXJlVGhyZXNob2xkOiAxLFxuICAgICAgICB9LFxuICAgICAgICBOYW1lOiAnbXlBcHAnLFxuICAgICAgICBOYW1lc3BhY2VJZDoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0Vjc0NsdXN0ZXJEZWZhdWx0U2VydmljZURpc2NvdmVyeU5hbWVzcGFjZUIwOTcxQjJGJyxcbiAgICAgICAgICAgICdJZCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3VzZXIgY2FuIHNlbGVjdCBhbnkgY29udGFpbmVyIGFuZCBwb3J0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICAgIGNsdXN0ZXIuYWRkRGVmYXVsdENsb3VkTWFwTmFtZXNwYWNlKHtcbiAgICAgICAgbmFtZTogJ2Zvby5jb20nLFxuICAgICAgICB0eXBlOiBjbG91ZG1hcC5OYW1lc3BhY2VUeXBlLkROU19QUklWQVRFLFxuICAgICAgfSk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdGYXJnYXRlVGFza0RlZicsIHtcbiAgICAgICAgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5CUklER0UsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgbWFpbkNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignTWFpbkNvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbGxvJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcbiAgICAgIG1haW5Db250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMCB9KTtcblxuICAgICAgY29uc3Qgb3RoZXJDb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ090aGVyQ29udGFpbmVyJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuICAgICAgb3RoZXJDb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMSB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIGNsb3VkTWFwT3B0aW9uczoge1xuICAgICAgICAgIGRuc1JlY29yZFR5cGU6IGNsb3VkbWFwLkRuc1JlY29yZFR5cGUuU1JWLFxuICAgICAgICAgIGNvbnRhaW5lcjogb3RoZXJDb250YWluZXIsXG4gICAgICAgICAgY29udGFpbmVyUG9ydDogODAwMSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICAgIFNlcnZpY2VSZWdpc3RyaWVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVnaXN0cnlBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ1NlcnZpY2VDbG91ZG1hcFNlcnZpY2UwNDYwNThBNCcsICdBcm4nXSB9LFxuICAgICAgICAgICAgQ29udGFpbmVyTmFtZTogJ090aGVyQ29udGFpbmVyJyxcbiAgICAgICAgICAgIENvbnRhaW5lclBvcnQ6IDgwMDEsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnQnkgZGVmYXVsdCwgdGhlIGNvbnRhaW5lciBuYW1lIGlzIHRoZSBkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICAgIGNsdXN0ZXIuYWRkRGVmYXVsdENsb3VkTWFwTmFtZXNwYWNlKHtcbiAgICAgICAgbmFtZTogJ2Zvby5jb20nLFxuICAgICAgICB0eXBlOiBjbG91ZG1hcC5OYW1lc3BhY2VUeXBlLkROU19QUklWQVRFLFxuICAgICAgfSk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrJywge1xuICAgICAgICBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLkJSSURHRSxcbiAgICAgIH0pO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ21haW4nLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdzb21lJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KS5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiAxMjM0IH0pO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3NlY29uZCcsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3NvbWUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDQzMjEgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBjbG91ZE1hcE9wdGlvbnM6IHt9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgU2VydmljZVJlZ2lzdHJpZXM6IFtNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBDb250YWluZXJOYW1lOiAnbWFpbicsXG4gICAgICAgICAgQ29udGFpbmVyUG9ydDogTWF0Y2guYW55VmFsdWUoKSxcbiAgICAgICAgfSldLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdGb3IgU1JWLCBieSBkZWZhdWx0LCBjb250YWluZXIgbmFtZSBpcyBkZWZhdWx0IGNvbnRhaW5lciBhbmQgcG9ydCBpcyB0aGUgZGVmYXVsdCBjb250YWluZXIgcG9ydCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgICBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7XG4gICAgICAgIG5hbWU6ICdmb28uY29tJyxcbiAgICAgICAgdHlwZTogY2xvdWRtYXAuTmFtZXNwYWNlVHlwZS5ETlNfUFJJVkFURSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFzaycsIHtcbiAgICAgICAgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5CUklER0UsXG4gICAgICB9KTtcblxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdtYWluJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnc29tZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSkuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogMTIzNCB9KTtcblxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdzZWNvbmQnLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdzb21lJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KS5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA0MzIxIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgY2xvdWRNYXBPcHRpb25zOiB7XG4gICAgICAgICAgZG5zUmVjb3JkVHlwZTogY2xvdWRtYXAuRG5zUmVjb3JkVHlwZS5TUlYsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICBTZXJ2aWNlUmVnaXN0cmllczogW01hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIENvbnRhaW5lck5hbWU6ICdtYWluJyxcbiAgICAgICAgICBDb250YWluZXJQb3J0OiAxMjM0LFxuICAgICAgICB9KV0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FsbG93cyBTUlYgc2VydmljZSBkaXNjb3ZlcnkgdG8gc2VsZWN0IHRoZSBjb250YWluZXIgYW5kIHBvcnQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY2x1c3Rlci5hZGREZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2Uoe1xuICAgICAgICBuYW1lOiAnZm9vLmNvbScsXG4gICAgICAgIHR5cGU6IGNsb3VkbWFwLk5hbWVzcGFjZVR5cGUuRE5TX1BSSVZBVEUsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2snLCB7XG4gICAgICAgIG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQlJJREdFLFxuICAgICAgfSk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignbWFpbicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3NvbWUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDEyMzQgfSk7XG5cbiAgICAgIGNvbnN0IHNlY29uZENvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignc2Vjb25kJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnc29tZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG4gICAgICBzZWNvbmRDb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogNDMyMSB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIGNsb3VkTWFwT3B0aW9uczoge1xuICAgICAgICAgIGRuc1JlY29yZFR5cGU6IGNsb3VkbWFwLkRuc1JlY29yZFR5cGUuU1JWLFxuICAgICAgICAgIGNvbnRhaW5lcjogc2Vjb25kQ29udGFpbmVyLFxuICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDQzMjEsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICBTZXJ2aWNlUmVnaXN0cmllczogW01hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIENvbnRhaW5lck5hbWU6ICdzZWNvbmQnLFxuICAgICAgICAgIENvbnRhaW5lclBvcnQ6IDQzMjEsXG4gICAgICAgIH0pXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIGlmIFNSViBhbmQgY29udGFpbmVyIGlzIG5vdCBwYXJ0IG9mIHRhc2sgZGVmaW5pdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgICBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7XG4gICAgICAgIG5hbWU6ICdmb28uY29tJyxcbiAgICAgICAgdHlwZTogY2xvdWRtYXAuTmFtZXNwYWNlVHlwZS5ETlNfUFJJVkFURSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFzaycsIHtcbiAgICAgICAgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5CUklER0UsXG4gICAgICB9KTtcblxuICAgICAgLy8gVGhlIHJpZ2h0IGNvbnRhaW5lclxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdNYWluQ29udGFpbmVyJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB3cm9uZ1Rhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1dyb25nVGFza0RlZicpO1xuICAgICAgLy8gVGhlIHdyb25nIGNvbnRhaW5lclxuICAgICAgY29uc3Qgd3JvbmdDb250YWluZXIgPSB3cm9uZ1Rhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignTWFpbkNvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbGxvJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICAgIGNsb3VkTWFwT3B0aW9uczoge1xuICAgICAgICAgICAgZG5zUmVjb3JkVHlwZTogY2xvdWRtYXAuRG5zUmVjb3JkVHlwZS5TUlYsXG4gICAgICAgICAgICBjb250YWluZXI6IHdyb25nQ29udGFpbmVyLFxuICAgICAgICAgICAgY29udGFpbmVyUG9ydDogNDMyMSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL2Fub3RoZXIgdGFzayBkZWZpbml0aW9uL2kpO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBpZiBTUlYgYW5kIHRoZSBjb250YWluZXIgcG9ydCBpcyBub3QgbWFwcGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY2x1c3Rlci5hZGREZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2Uoe1xuICAgICAgICBuYW1lOiAnZm9vLmNvbScsXG4gICAgICAgIHR5cGU6IGNsb3VkbWFwLk5hbWVzcGFjZVR5cGUuRE5TX1BSSVZBVEUsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2snLCB7XG4gICAgICAgIG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQlJJREdFLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignTWFpbkNvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbGxvJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwMDAgfSk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgICBjbG91ZE1hcE9wdGlvbnM6IHtcbiAgICAgICAgICAgIGRuc1JlY29yZFR5cGU6IGNsb3VkbWFwLkRuc1JlY29yZFR5cGUuU1JWLFxuICAgICAgICAgICAgY29udGFpbmVyOiBjb250YWluZXIsXG4gICAgICAgICAgICBjb250YWluZXJQb3J0OiA0MzIxLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvY29udGFpbmVyIHBvcnQuKm5vdC4qbWFwcGVkL2kpO1xuXG5cbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnTWV0cmljJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG4gICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdDb250YWluZXInLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzZXJ2aWNlLm1ldHJpY01lbW9yeVV0aWxpemF0aW9uKCkpKS50b0VxdWFsKHtcbiAgICAgIGRpbWVuc2lvbnM6IHtcbiAgICAgICAgQ2x1c3Rlck5hbWU6IHsgUmVmOiAnRWNzQ2x1c3Rlcjk3MjQyQjg0JyB9LFxuICAgICAgICBTZXJ2aWNlTmFtZTogeyAnRm46OkdldEF0dCc6IFsnU2VydmljZUQ2OUQ3NTlCJywgJ05hbWUnXSB9LFxuICAgICAgfSxcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FQ1MnLFxuICAgICAgbWV0cmljTmFtZTogJ01lbW9yeVV0aWxpemF0aW9uJyxcbiAgICAgIHBlcmlvZDogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoNSksXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHNlcnZpY2UubWV0cmljQ3B1VXRpbGl6YXRpb24oKSkpLnRvRXF1YWwoe1xuICAgICAgZGltZW5zaW9uczoge1xuICAgICAgICBDbHVzdGVyTmFtZTogeyBSZWY6ICdFY3NDbHVzdGVyOTcyNDJCODQnIH0sXG4gICAgICAgIFNlcnZpY2VOYW1lOiB7ICdGbjo6R2V0QXR0JzogWydTZXJ2aWNlRDY5RDc1OUInLCAnTmFtZSddIH0sXG4gICAgICB9LFxuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VDUycsXG4gICAgICBtZXRyaWNOYW1lOiAnQ1BVVXRpbGl6YXRpb24nLFxuICAgICAgcGVyaW9kOiBjZGsuRHVyYXRpb24ubWludXRlcyg1KSxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1doZW4gaW1wb3J0IGFuIEVDMiBTZXJ2aWNlJywgKCkgPT4ge1xuICAgIHRlc3QoJ2Zyb21FYzJTZXJ2aWNlQXJuIG9sZCBmb3JtYXQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBlY3MuRWMyU2VydmljZS5mcm9tRWMyU2VydmljZUFybihzdGFjaywgJ0Vjc1NlcnZpY2UnLCAnYXJuOmF3czplY3M6dXMtd2VzdC0yOjEyMzQ1Njc4OTAxMjpzZXJ2aWNlL215LWh0dHAtc2VydmljZScpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc2VydmljZS5zZXJ2aWNlQXJuKS50b0VxdWFsKCdhcm46YXdzOmVjczp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOnNlcnZpY2UvbXktaHR0cC1zZXJ2aWNlJyk7XG4gICAgICBleHBlY3Qoc2VydmljZS5zZXJ2aWNlTmFtZSkudG9FcXVhbCgnbXktaHR0cC1zZXJ2aWNlJyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdmcm9tRWMyU2VydmljZUFybiBuZXcgZm9ybWF0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzZXJ2aWNlID0gZWNzLkVjMlNlcnZpY2UuZnJvbUVjMlNlcnZpY2VBcm4oc3RhY2ssICdFY3NTZXJ2aWNlJywgJ2Fybjphd3M6ZWNzOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6c2VydmljZS9teS1jbHVzdGVyLW5hbWUvbXktaHR0cC1zZXJ2aWNlJyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzZXJ2aWNlLnNlcnZpY2VBcm4pLnRvRXF1YWwoJ2Fybjphd3M6ZWNzOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6c2VydmljZS9teS1jbHVzdGVyLW5hbWUvbXktaHR0cC1zZXJ2aWNlJyk7XG4gICAgICBleHBlY3Qoc2VydmljZS5zZXJ2aWNlTmFtZSkudG9FcXVhbCgnbXktaHR0cC1zZXJ2aWNlJyk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZnJvbUVjMlNlcnZpY2VBcm4gdG9rZW5pemVkIEFSTicsICgpID0+IHtcbiAgICAgIHRlc3QoJ3doZW4gQGF3cy1jZGsvYXdzLWVjczphcm5Gb3JtYXRJbmNsdWRlc0NsdXN0ZXJOYW1lIGlzIGRpc2FibGVkLCB1c2Ugb2xkIEFSTiBmb3JtYXQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgY29uc3Qgc2VydmljZSA9IGVjcy5FYzJTZXJ2aWNlLmZyb21FYzJTZXJ2aWNlQXJuKHN0YWNrLCAnRWNzU2VydmljZScsIG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHN0YWNrLCAnQVJOJykudmFsdWVBc1N0cmluZyk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzZXJ2aWNlLnNlcnZpY2VBcm4pKS50b0VxdWFsKHsgUmVmOiAnQVJOJyB9KTtcbiAgICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc2VydmljZS5zZXJ2aWNlTmFtZSkpLnRvRXF1YWwoe1xuICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgICAgIDUsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBUk4nIH0sXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnd2hlbiBAYXdzLWNkay9hd3MtZWNzOmFybkZvcm1hdEluY2x1ZGVzQ2x1c3Rlck5hbWUgaXMgZW5hYmxlZCwgdXNlIG5ldyBBUk4gZm9ybWF0JywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgICBbRUNTX0FSTl9GT1JNQVRfSU5DTFVERVNfQ0xVU1RFUl9OQU1FXTogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwKTtcblxuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBlY3MuRWMyU2VydmljZS5mcm9tRWMyU2VydmljZUFybihzdGFjaywgJ0Vjc1NlcnZpY2UnLCBuZXcgY2RrLkNmblBhcmFtZXRlcihzdGFjaywgJ0FSTicpLnZhbHVlQXNTdHJpbmcpO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc2VydmljZS5zZXJ2aWNlQXJuKSkudG9FcXVhbCh7IFJlZjogJ0FSTicgfSk7XG4gICAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHNlcnZpY2Uuc2VydmljZU5hbWUpKS50b0VxdWFsKHtcbiAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgIDIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgJy8nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAgICAgICA1LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVJOJyB9LFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIHNlcnZpY2VBcm4gb2xkIGZvcm1hdCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBlY3MuRWMyU2VydmljZS5mcm9tRWMyU2VydmljZUF0dHJpYnV0ZXMoc3RhY2ssICdFY3NTZXJ2aWNlJywge1xuICAgICAgICBzZXJ2aWNlQXJuOiAnYXJuOmF3czplY3M6dXMtd2VzdC0yOjEyMzQ1Njc4OTAxMjpzZXJ2aWNlL215LWh0dHAtc2VydmljZScsXG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHNlcnZpY2Uuc2VydmljZUFybikudG9FcXVhbCgnYXJuOmF3czplY3M6dXMtd2VzdC0yOjEyMzQ1Njc4OTAxMjpzZXJ2aWNlL215LWh0dHAtc2VydmljZScpO1xuICAgICAgZXhwZWN0KHNlcnZpY2Uuc2VydmljZU5hbWUpLnRvRXF1YWwoJ215LWh0dHAtc2VydmljZScpO1xuXG4gICAgICBleHBlY3Qoc2VydmljZS5lbnYuYWNjb3VudCkudG9FcXVhbCgnMTIzNDU2Nzg5MDEyJyk7XG4gICAgICBleHBlY3Qoc2VydmljZS5lbnYucmVnaW9uKS50b0VxdWFsKCd1cy13ZXN0LTInKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCBzZXJ2aWNlQXJuIG5ldyBmb3JtYXQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzZXJ2aWNlID0gZWNzLkVjMlNlcnZpY2UuZnJvbUVjMlNlcnZpY2VBdHRyaWJ1dGVzKHN0YWNrLCAnRWNzU2VydmljZScsIHtcbiAgICAgICAgc2VydmljZUFybjogJ2Fybjphd3M6ZWNzOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6c2VydmljZS9teS1jbHVzdGVyLW5hbWUvbXktaHR0cC1zZXJ2aWNlJyxcbiAgICAgICAgY2x1c3RlcixcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc2VydmljZS5zZXJ2aWNlQXJuKS50b0VxdWFsKCdhcm46YXdzOmVjczp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOnNlcnZpY2UvbXktY2x1c3Rlci1uYW1lL215LWh0dHAtc2VydmljZScpO1xuICAgICAgZXhwZWN0KHNlcnZpY2Uuc2VydmljZU5hbWUpLnRvRXF1YWwoJ215LWh0dHAtc2VydmljZScpO1xuXG4gICAgICBleHBlY3Qoc2VydmljZS5lbnYuYWNjb3VudCkudG9FcXVhbCgnMTIzNDU2Nzg5MDEyJyk7XG4gICAgICBleHBlY3Qoc2VydmljZS5lbnYucmVnaW9uKS50b0VxdWFsKCd1cy13ZXN0LTInKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aXRoIHNlcnZpY2VBcm4gdG9rZW5pemVkIEFSTicsICgpID0+IHtcbiAgICAgIHRlc3QoJ3doZW4gQGF3cy1jZGsvYXdzLWVjczphcm5Gb3JtYXRJbmNsdWRlc0NsdXN0ZXJOYW1lIGlzIGRpc2FibGVkLCB1c2Ugb2xkIEFSTiBmb3JtYXQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicpO1xuXG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgY29uc3Qgc2VydmljZSA9IGVjcy5FYzJTZXJ2aWNlLmZyb21FYzJTZXJ2aWNlQXR0cmlidXRlcyhzdGFjaywgJ0Vjc1NlcnZpY2UnLCB7XG4gICAgICAgICAgc2VydmljZUFybjogbmV3IGNkay5DZm5QYXJhbWV0ZXIoc3RhY2ssICdBUk4nKS52YWx1ZUFzU3RyaW5nLFxuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc2VydmljZS5zZXJ2aWNlQXJuKSkudG9FcXVhbCh7IFJlZjogJ0FSTicgfSk7XG4gICAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHNlcnZpY2Uuc2VydmljZU5hbWUpKS50b0VxdWFsKHtcbiAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgIDEsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgJy8nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAgICAgICA1LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVJOJyB9LFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHNlcnZpY2UuZW52LmFjY291bnQpKS50b0VxdWFsKHtcbiAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgIDQsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgIHsgUmVmOiAnQVJOJyB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc2VydmljZS5lbnYucmVnaW9uKSkudG9FcXVhbCh7XG4gICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAzLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICB7IFJlZjogJ0FSTicgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnd2hlbiBAYXdzLWNkay9hd3MtZWNzOmFybkZvcm1hdEluY2x1ZGVzQ2x1c3Rlck5hbWUgaXMgZW5hYmxlZCwgdXNlIG5ldyBBUk4gZm9ybWF0JywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgICBbRUNTX0FSTl9GT1JNQVRfSU5DTFVERVNfQ0xVU1RFUl9OQU1FXTogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJyk7XG5cbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBjb25zdCBzZXJ2aWNlID0gZWNzLkVjMlNlcnZpY2UuZnJvbUVjMlNlcnZpY2VBdHRyaWJ1dGVzKHN0YWNrLCAnRWNzU2VydmljZScsIHtcbiAgICAgICAgICBzZXJ2aWNlQXJuOiBuZXcgY2RrLkNmblBhcmFtZXRlcihzdGFjaywgJ0FSTicpLnZhbHVlQXNTdHJpbmcsXG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzZXJ2aWNlLnNlcnZpY2VBcm4pKS50b0VxdWFsKHsgUmVmOiAnQVJOJyB9KTtcbiAgICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc2VydmljZS5zZXJ2aWNlTmFtZSkpLnRvRXF1YWwoe1xuICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgMixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgICAgIDUsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBUk4nIH0sXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc2VydmljZS5lbnYuYWNjb3VudCkpLnRvRXF1YWwoe1xuICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgNCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgeyBSZWY6ICdBUk4nIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzZXJ2aWNlLmVudi5yZWdpb24pKS50b0VxdWFsKHtcbiAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgIDMsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgIHsgUmVmOiAnQVJOJyB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3dpdGggc2VydmljZU5hbWUnLCAoKSA9PiB7XG4gICAgICB0ZXN0KCd3aGVuIEBhd3MtY2RrL2F3cy1lY3M6YXJuRm9ybWF0SW5jbHVkZXNDbHVzdGVyTmFtZSBpcyBkaXNhYmxlZCwgdXNlIG9sZCBBUk4gZm9ybWF0JywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3QgcHNldWRvID0gbmV3IGNkay5TY29wZWRBd3Moc3RhY2spO1xuICAgICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicpO1xuXG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgY29uc3Qgc2VydmljZSA9IGVjcy5FYzJTZXJ2aWNlLmZyb21FYzJTZXJ2aWNlQXR0cmlidXRlcyhzdGFjaywgJ0Vjc1NlcnZpY2UnLCB7XG4gICAgICAgICAgc2VydmljZU5hbWU6ICdteS1odHRwLXNlcnZpY2UnLFxuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc2VydmljZS5zZXJ2aWNlQXJuKSkudG9FcXVhbChzdGFjay5yZXNvbHZlKGBhcm46JHtwc2V1ZG8ucGFydGl0aW9ufTplY3M6JHtwc2V1ZG8ucmVnaW9ufToke3BzZXVkby5hY2NvdW50SWR9OnNlcnZpY2UvbXktaHR0cC1zZXJ2aWNlYCkpO1xuICAgICAgICBleHBlY3Qoc2VydmljZS5zZXJ2aWNlTmFtZSkudG9FcXVhbCgnbXktaHR0cC1zZXJ2aWNlJyk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnd2hlbiBAYXdzLWNkay9hd3MtZWNzOmFybkZvcm1hdEluY2x1ZGVzQ2x1c3Rlck5hbWUgaXMgZW5hYmxlZCwgdXNlIG5ldyBBUk4gZm9ybWF0JywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgICBbRUNTX0FSTl9GT1JNQVRfSU5DTFVERVNfQ0xVU1RFUl9OQU1FXTogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XG4gICAgICAgIGNvbnN0IHBzZXVkbyA9IG5ldyBjZGsuU2NvcGVkQXdzKHN0YWNrKTtcbiAgICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInKTtcblxuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBlY3MuRWMyU2VydmljZS5mcm9tRWMyU2VydmljZUF0dHJpYnV0ZXMoc3RhY2ssICdFY3NTZXJ2aWNlJywge1xuICAgICAgICAgIHNlcnZpY2VOYW1lOiAnbXktaHR0cC1zZXJ2aWNlJyxcbiAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHNlcnZpY2Uuc2VydmljZUFybikpLnRvRXF1YWwoc3RhY2sucmVzb2x2ZShgYXJuOiR7cHNldWRvLnBhcnRpdGlvbn06ZWNzOiR7cHNldWRvLnJlZ2lvbn06JHtwc2V1ZG8uYWNjb3VudElkfTpzZXJ2aWNlLyR7Y2x1c3Rlci5jbHVzdGVyTmFtZX0vbXktaHR0cC1zZXJ2aWNlYCkpO1xuICAgICAgICBleHBlY3Qoc2VydmljZS5zZXJ2aWNlTmFtZSkudG9FcXVhbCgnbXktaHR0cC1zZXJ2aWNlJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBhbiBleGNlcHRpb24gaWYgYm90aCBzZXJ2aWNlQXJuIGFuZCBzZXJ2aWNlTmFtZSB3ZXJlIHByb3ZpZGVkIGZvciBmcm9tRWMyU2VydmljZUF0dHJpYnV0ZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicpO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBlY3MuRWMyU2VydmljZS5mcm9tRWMyU2VydmljZUF0dHJpYnV0ZXMoc3RhY2ssICdFY3NTZXJ2aWNlJywge1xuICAgICAgICAgIHNlcnZpY2VBcm46ICdhcm46YXdzOmVjczp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOnNlcnZpY2UvbXktaHR0cC1zZXJ2aWNlJyxcbiAgICAgICAgICBzZXJ2aWNlTmFtZTogJ215LWh0dHAtc2VydmljZScsXG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9vbmx5IHNwZWNpZnkgZWl0aGVyIHNlcnZpY2VBcm4gb3Igc2VydmljZU5hbWUvKTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3MgYW4gZXhjZXB0aW9uIGlmIG5laXRoZXIgc2VydmljZUFybiBub3Igc2VydmljZU5hbWUgd2VyZSBwcm92aWRlZCBmb3IgZnJvbUVjMlNlcnZpY2VBdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgZWNzLkVjMlNlcnZpY2UuZnJvbUVjMlNlcnZpY2VBdHRyaWJ1dGVzKHN0YWNrLCAnRWNzU2VydmljZScsIHtcbiAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL29ubHkgc3BlY2lmeSBlaXRoZXIgc2VydmljZUFybiBvciBzZXJ2aWNlTmFtZS8pO1xuXG5cbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==