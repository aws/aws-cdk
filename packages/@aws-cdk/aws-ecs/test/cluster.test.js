"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const autoscaling = require("@aws-cdk/aws-autoscaling");
const ec2 = require("@aws-cdk/aws-ec2");
const kms = require("@aws-cdk/aws-kms");
const logs = require("@aws-cdk/aws-logs");
const s3 = require("@aws-cdk/aws-s3");
const cloudmap = require("@aws-cdk/aws-servicediscovery");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const ecs = require("../lib");
describe('cluster', () => {
    describe('isCluster() returns', () => {
        test('true if given cluster instance', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const createdCluster = new ecs.Cluster(stack, 'EcsCluster');
            // THEN
            expect(ecs.Cluster.isCluster(createdCluster)).toBe(true);
        });
        test('false if given imported cluster instance', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'Vpc');
            const importedSg = ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG1', 'sg-1', { allowAllOutbound: false });
            // WHEN
            const importedCluster = ecs.Cluster.fromClusterAttributes(stack, 'Cluster', {
                clusterName: 'cluster-name',
                securityGroups: [importedSg],
                vpc,
            });
            // THEN
            expect(ecs.Cluster.isCluster(importedCluster)).toBe(false);
        });
        test('false if given undefined', () => {
            // THEN
            expect(ecs.Cluster.isCluster(undefined)).toBe(false);
        });
    });
    describe('When creating an ECS Cluster', () => {
        cdk_build_tools_1.testDeprecated('with no properties set, it correctly sets default properties', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const cluster = new ecs.Cluster(stack, 'EcsCluster');
            cluster.addCapacity('DefaultAutoScalingGroup', {
                instanceType: new ec2.InstanceType('t2.micro'),
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ECS::Cluster', 1);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
                CidrBlock: '10.0.0.0/16',
                EnableDnsHostnames: true,
                EnableDnsSupport: true,
                InstanceTenancy: ec2.DefaultInstanceTenancy.DEFAULT,
                Tags: [
                    {
                        Key: 'Name',
                        Value: 'Default/EcsCluster/Vpc',
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
                ImageId: {
                    Ref: 'SsmParameterValueawsserviceecsoptimizedamiamazonlinux2recommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
                },
                InstanceType: 't2.micro',
                IamInstanceProfile: {
                    Ref: 'EcsClusterDefaultAutoScalingGroupInstanceProfile2CE606B3',
                },
                SecurityGroups: [
                    {
                        'Fn::GetAtt': [
                            'EcsClusterDefaultAutoScalingGroupInstanceSecurityGroup912E1231',
                            'GroupId',
                        ],
                    },
                ],
                UserData: {
                    'Fn::Base64': {
                        'Fn::Join': [
                            '',
                            [
                                '#!/bin/bash\necho ECS_CLUSTER=',
                                {
                                    Ref: 'EcsCluster97242B84',
                                },
                                // eslint-disable-next-line max-len
                                ' >> /etc/ecs/ecs.config\nsudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP\nsudo service iptables save\necho ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config',
                            ],
                        ],
                    },
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
                MaxSize: '1',
                MinSize: '1',
                LaunchConfigurationName: {
                    Ref: 'EcsClusterDefaultAutoScalingGroupLaunchConfigB7E376C1',
                },
                Tags: [
                    {
                        Key: 'Name',
                        PropagateAtLaunch: true,
                        Value: 'Default/EcsCluster/DefaultAutoScalingGroup',
                    },
                ],
                VPCZoneIdentifier: [
                    {
                        Ref: 'EcsClusterVpcPrivateSubnet1SubnetFAB0E487',
                    },
                    {
                        Ref: 'EcsClusterVpcPrivateSubnet2SubnetC2B7B1BA',
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                GroupDescription: 'Default/EcsCluster/DefaultAutoScalingGroup/InstanceSecurityGroup',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1',
                    },
                ],
                Tags: [
                    {
                        Key: 'Name',
                        Value: 'Default/EcsCluster/DefaultAutoScalingGroup',
                    },
                ],
                VpcId: {
                    Ref: 'EcsClusterVpc779914AB',
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {
                                Service: 'ec2.amazonaws.com',
                            },
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'ecs:DeregisterContainerInstance',
                                'ecs:RegisterContainerInstance',
                                'ecs:Submit*',
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'EcsCluster97242B84',
                                    'Arn',
                                ],
                            },
                        },
                        {
                            Action: [
                                'ecs:Poll',
                                'ecs:StartTelemetrySession',
                            ],
                            Effect: 'Allow',
                            Resource: '*',
                            Condition: {
                                ArnEquals: {
                                    'ecs:cluster': {
                                        'Fn::GetAtt': [
                                            'EcsCluster97242B84',
                                            'Arn',
                                        ],
                                    },
                                },
                            },
                        },
                        {
                            Action: [
                                'ecs:DiscoverPollEndpoint',
                                'ecr:GetAuthorizationToken',
                                'logs:CreateLogStream',
                                'logs:PutLogEvents',
                            ],
                            Effect: 'Allow',
                            Resource: '*',
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
        });
        cdk_build_tools_1.testDeprecated('with only vpc set, it correctly sets default properties', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', {
                vpc,
            });
            cluster.addCapacity('DefaultAutoScalingGroup', {
                instanceType: new ec2.InstanceType('t2.micro'),
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ECS::Cluster', 1);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
                CidrBlock: '10.0.0.0/16',
                EnableDnsHostnames: true,
                EnableDnsSupport: true,
                InstanceTenancy: ec2.DefaultInstanceTenancy.DEFAULT,
                Tags: [
                    {
                        Key: 'Name',
                        Value: 'Default/MyVpc',
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
                ImageId: {
                    Ref: 'SsmParameterValueawsserviceecsoptimizedamiamazonlinux2recommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
                },
                InstanceType: 't2.micro',
                IamInstanceProfile: {
                    Ref: 'EcsClusterDefaultAutoScalingGroupInstanceProfile2CE606B3',
                },
                SecurityGroups: [
                    {
                        'Fn::GetAtt': [
                            'EcsClusterDefaultAutoScalingGroupInstanceSecurityGroup912E1231',
                            'GroupId',
                        ],
                    },
                ],
                UserData: {
                    'Fn::Base64': {
                        'Fn::Join': [
                            '',
                            [
                                '#!/bin/bash\necho ECS_CLUSTER=',
                                {
                                    Ref: 'EcsCluster97242B84',
                                },
                                // eslint-disable-next-line max-len
                                ' >> /etc/ecs/ecs.config\nsudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP\nsudo service iptables save\necho ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config',
                            ],
                        ],
                    },
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
                MaxSize: '1',
                MinSize: '1',
                LaunchConfigurationName: {
                    Ref: 'EcsClusterDefaultAutoScalingGroupLaunchConfigB7E376C1',
                },
                Tags: [
                    {
                        Key: 'Name',
                        PropagateAtLaunch: true,
                        Value: 'Default/EcsCluster/DefaultAutoScalingGroup',
                    },
                ],
                VPCZoneIdentifier: [
                    {
                        Ref: 'MyVpcPrivateSubnet1Subnet5057CF7E',
                    },
                    {
                        Ref: 'MyVpcPrivateSubnet2Subnet0040C983',
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                GroupDescription: 'Default/EcsCluster/DefaultAutoScalingGroup/InstanceSecurityGroup',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1',
                    },
                ],
                Tags: [
                    {
                        Key: 'Name',
                        Value: 'Default/EcsCluster/DefaultAutoScalingGroup',
                    },
                ],
                VpcId: {
                    Ref: 'MyVpcF9F0CA6F',
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {
                                Service: 'ec2.amazonaws.com',
                            },
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'ecs:DeregisterContainerInstance',
                                'ecs:RegisterContainerInstance',
                                'ecs:Submit*',
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'EcsCluster97242B84',
                                    'Arn',
                                ],
                            },
                        },
                        {
                            Action: [
                                'ecs:Poll',
                                'ecs:StartTelemetrySession',
                            ],
                            Effect: 'Allow',
                            Resource: '*',
                            Condition: {
                                ArnEquals: {
                                    'ecs:cluster': {
                                        'Fn::GetAtt': [
                                            'EcsCluster97242B84',
                                            'Arn',
                                        ],
                                    },
                                },
                            },
                        },
                        {
                            Action: [
                                'ecs:DiscoverPollEndpoint',
                                'ecr:GetAuthorizationToken',
                                'logs:CreateLogStream',
                                'logs:PutLogEvents',
                            ],
                            Effect: 'Allow',
                            Resource: '*',
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
        });
        cdk_build_tools_1.testDeprecated('multiple clusters with default capacity', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            // WHEN
            for (let i = 0; i < 2; i++) {
                const cluster = new ecs.Cluster(stack, `EcsCluster${i}`, { vpc });
                cluster.addCapacity('MyCapacity', {
                    instanceType: new ec2.InstanceType('m3.medium'),
                });
            }
        });
        cdk_build_tools_1.testDeprecated('lifecycle hook is automatically added', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', {
                vpc,
            });
            // WHEN
            cluster.addCapacity('DefaultAutoScalingGroup', {
                instanceType: new ec2.InstanceType('t2.micro'),
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', {
                AutoScalingGroupName: { Ref: 'EcsClusterDefaultAutoScalingGroupASGC1A785DB' },
                LifecycleTransition: 'autoscaling:EC2_INSTANCE_TERMINATING',
                DefaultResult: 'CONTINUE',
                HeartbeatTimeout: 300,
                NotificationTargetARN: { Ref: 'EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookTopicACD2D4A4' },
                RoleARN: { 'Fn::GetAtt': ['EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookRoleA38EC83B', 'Arn'] },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
                Timeout: 310,
                Environment: {
                    Variables: {
                        CLUSTER: {
                            Ref: 'EcsCluster97242B84',
                        },
                    },
                },
                Handler: 'index.lambda_handler',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'ec2:DescribeInstances',
                                'ec2:DescribeInstanceAttribute',
                                'ec2:DescribeInstanceStatus',
                                'ec2:DescribeHosts',
                            ],
                            Effect: 'Allow',
                            Resource: '*',
                        },
                        {
                            Action: 'autoscaling:CompleteLifecycleAction',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {
                                            Ref: 'AWS::Partition',
                                        },
                                        ':autoscaling:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':autoScalingGroup:*:autoScalingGroupName/',
                                        {
                                            Ref: 'EcsClusterDefaultAutoScalingGroupASGC1A785DB',
                                        },
                                    ],
                                ],
                            },
                        },
                        {
                            Action: [
                                'ecs:DescribeContainerInstances',
                                'ecs:DescribeTasks',
                            ],
                            Effect: 'Allow',
                            Resource: '*',
                            Condition: {
                                ArnEquals: {
                                    'ecs:cluster': {
                                        'Fn::GetAtt': [
                                            'EcsCluster97242B84',
                                            'Arn',
                                        ],
                                    },
                                },
                            },
                        },
                        {
                            Action: [
                                'ecs:ListContainerInstances',
                                'ecs:SubmitContainerStateChange',
                                'ecs:SubmitTaskStateChange',
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'EcsCluster97242B84',
                                    'Arn',
                                ],
                            },
                        },
                        {
                            Action: [
                                'ecs:UpdateContainerInstancesState',
                                'ecs:ListTasks',
                            ],
                            Condition: {
                                ArnEquals: {
                                    'ecs:cluster': {
                                        'Fn::GetAtt': [
                                            'EcsCluster97242B84',
                                            'Arn',
                                        ],
                                    },
                                },
                            },
                            Effect: 'Allow',
                            Resource: '*',
                        },
                    ],
                    Version: '2012-10-17',
                },
                PolicyName: 'EcsClusterDefaultAutoScalingGroupDrainECSHookFunctionServiceRoleDefaultPolicyA45BF396',
                Roles: [
                    {
                        Ref: 'EcsClusterDefaultAutoScalingGroupDrainECSHookFunctionServiceRole94543EDA',
                    },
                ],
            });
        });
        cdk_build_tools_1.testDeprecated('lifecycle hook with encrypted SNS is added correctly', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', {
                vpc,
            });
            const key = new kms.Key(stack, 'Key');
            // WHEN
            cluster.addCapacity('DefaultAutoScalingGroup', {
                instanceType: new ec2.InstanceType('t2.micro'),
                topicEncryptionKey: key,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::Topic', {
                KmsMasterKeyId: {
                    'Fn::GetAtt': [
                        'Key961B73FD',
                        'Arn',
                    ],
                },
            });
        });
        cdk_build_tools_1.testDeprecated('with capacity and cloudmap namespace properties set', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            new ecs.Cluster(stack, 'EcsCluster', {
                vpc,
                capacity: {
                    instanceType: new ec2.InstanceType('t2.micro'),
                },
                defaultCloudMapNamespace: {
                    name: 'foo.com',
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::PrivateDnsNamespace', {
                Name: 'foo.com',
                Vpc: {
                    Ref: 'MyVpcF9F0CA6F',
                },
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ECS::Cluster', 1);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
                CidrBlock: '10.0.0.0/16',
                EnableDnsHostnames: true,
                EnableDnsSupport: true,
                InstanceTenancy: ec2.DefaultInstanceTenancy.DEFAULT,
                Tags: [
                    {
                        Key: 'Name',
                        Value: 'Default/MyVpc',
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
                ImageId: {
                    Ref: 'SsmParameterValueawsserviceecsoptimizedamiamazonlinux2recommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
                },
                InstanceType: 't2.micro',
                IamInstanceProfile: {
                    Ref: 'EcsClusterDefaultAutoScalingGroupInstanceProfile2CE606B3',
                },
                SecurityGroups: [
                    {
                        'Fn::GetAtt': [
                            'EcsClusterDefaultAutoScalingGroupInstanceSecurityGroup912E1231',
                            'GroupId',
                        ],
                    },
                ],
                UserData: {
                    'Fn::Base64': {
                        'Fn::Join': [
                            '',
                            [
                                '#!/bin/bash\necho ECS_CLUSTER=',
                                {
                                    Ref: 'EcsCluster97242B84',
                                },
                                // eslint-disable-next-line max-len
                                ' >> /etc/ecs/ecs.config\nsudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP\nsudo service iptables save\necho ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config',
                            ],
                        ],
                    },
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
                MaxSize: '1',
                MinSize: '1',
                LaunchConfigurationName: {
                    Ref: 'EcsClusterDefaultAutoScalingGroupLaunchConfigB7E376C1',
                },
                Tags: [
                    {
                        Key: 'Name',
                        PropagateAtLaunch: true,
                        Value: 'Default/EcsCluster/DefaultAutoScalingGroup',
                    },
                ],
                VPCZoneIdentifier: [
                    {
                        Ref: 'MyVpcPrivateSubnet1Subnet5057CF7E',
                    },
                    {
                        Ref: 'MyVpcPrivateSubnet2Subnet0040C983',
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                GroupDescription: 'Default/EcsCluster/DefaultAutoScalingGroup/InstanceSecurityGroup',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1',
                    },
                ],
                Tags: [
                    {
                        Key: 'Name',
                        Value: 'Default/EcsCluster/DefaultAutoScalingGroup',
                    },
                ],
                VpcId: {
                    Ref: 'MyVpcF9F0CA6F',
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {
                                Service: 'ec2.amazonaws.com',
                            },
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'ecs:DeregisterContainerInstance',
                                'ecs:RegisterContainerInstance',
                                'ecs:Submit*',
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'EcsCluster97242B84',
                                    'Arn',
                                ],
                            },
                        },
                        {
                            Action: [
                                'ecs:Poll',
                                'ecs:StartTelemetrySession',
                            ],
                            Effect: 'Allow',
                            Resource: '*',
                            Condition: {
                                ArnEquals: {
                                    'ecs:cluster': {
                                        'Fn::GetAtt': [
                                            'EcsCluster97242B84',
                                            'Arn',
                                        ],
                                    },
                                },
                            },
                        },
                        {
                            Action: [
                                'ecs:DiscoverPollEndpoint',
                                'ecr:GetAuthorizationToken',
                                'logs:CreateLogStream',
                                'logs:PutLogEvents',
                            ],
                            Effect: 'Allow',
                            Resource: '*',
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
        });
    });
    cdk_build_tools_1.testDeprecated('allows specifying instance type', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('m3.large'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            InstanceType: 'm3.large',
        });
    });
    cdk_build_tools_1.testDeprecated('allows specifying cluster size', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
            desiredCapacity: 3,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            MaxSize: '3',
        });
    });
    cdk_build_tools_1.testDeprecated('configures userdata with powershell if windows machine image is specified', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('WindowsAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
            machineImage: new ecs.EcsOptimizedAmi({
                windowsVersion: ecs.WindowsOptimizedVersion.SERVER_2019,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            ImageId: {
                Ref: 'SsmParameterValueawsserviceecsoptimizedamiwindowsserver2019englishfullrecommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
            },
            InstanceType: 't2.micro',
            IamInstanceProfile: {
                Ref: 'EcsClusterWindowsAutoScalingGroupInstanceProfile65DFA6BB',
            },
            SecurityGroups: [
                {
                    'Fn::GetAtt': [
                        'EcsClusterWindowsAutoScalingGroupInstanceSecurityGroupDA468DF1',
                        'GroupId',
                    ],
                },
            ],
            UserData: {
                'Fn::Base64': {
                    'Fn::Join': [
                        '',
                        [
                            '<powershell>Remove-Item -Recurse C:\\ProgramData\\Amazon\\ECS\\Cache\nImport-Module ECSTools\n[Environment]::SetEnvironmentVariable("ECS_CLUSTER", "',
                            {
                                Ref: 'EcsCluster97242B84',
                            },
                            "\", \"Machine\")\n[Environment]::SetEnvironmentVariable(\"ECS_ENABLE_AWSLOGS_EXECUTIONROLE_OVERRIDE\", \"true\", \"Machine\")\n[Environment]::SetEnvironmentVariable(\"ECS_AVAILABLE_LOGGING_DRIVERS\", '[\"json-file\",\"awslogs\"]', \"Machine\")\n[Environment]::SetEnvironmentVariable(\"ECS_ENABLE_TASK_IAM_ROLE\", \"true\", \"Machine\")\nInitialize-ECSAgent -Cluster '",
                            {
                                Ref: 'EcsCluster97242B84',
                            },
                            "' -EnableTaskIAMRole</powershell>",
                        ],
                    ],
                },
            },
        });
    });
    /*
     * TODO:v2.0.0 BEGINNING OF OBSOLETE BLOCK
     */
    cdk_build_tools_1.testDeprecated('allows specifying special HW AMI Type', () => {
        // GIVEN
        const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack = new cdk.Stack(app, 'test');
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('GpuAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
            machineImage: new ecs.EcsOptimizedAmi({
                hardwareType: ecs.AmiHardwareType.GPU,
            }),
        });
        // THEN
        const assembly = app.synth();
        const template = assembly.getStackByName(stack.stackName).template;
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            ImageId: {
                Ref: 'SsmParameterValueawsserviceecsoptimizedamiamazonlinux2gpurecommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
            },
        });
        expect(template.Parameters).toEqual({
            SsmParameterValueawsserviceecsoptimizedamiamazonlinux2gpurecommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter: {
                Type: 'AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>',
                Default: '/aws/service/ecs/optimized-ami/amazon-linux-2/gpu/recommended/image_id',
            },
        });
    });
    cdk_build_tools_1.testDeprecated('errors if amazon linux given with special HW type', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        // THEN
        expect(() => {
            cluster.addCapacity('GpuAutoScalingGroup', {
                instanceType: new ec2.InstanceType('t2.micro'),
                machineImage: new ecs.EcsOptimizedAmi({
                    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX,
                    hardwareType: ecs.AmiHardwareType.GPU,
                }),
            });
        }).toThrow(/Amazon Linux does not support special hardware type/);
    });
    cdk_build_tools_1.testDeprecated('allows specifying windows image', () => {
        // GIVEN
        const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack = new cdk.Stack(app, 'test');
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('WindowsAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
            machineImage: new ecs.EcsOptimizedAmi({
                windowsVersion: ecs.WindowsOptimizedVersion.SERVER_2019,
            }),
        });
        // THEN
        const assembly = app.synth();
        const template = assembly.getStackByName(stack.stackName).template;
        expect(template.Parameters).toEqual({
            SsmParameterValueawsserviceecsoptimizedamiwindowsserver2019englishfullrecommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter: {
                Type: 'AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>',
                Default: '/aws/service/ecs/optimized-ami/windows_server/2019/english/full/recommended/image_id',
            },
        });
    });
    cdk_build_tools_1.testDeprecated('errors if windows given with special HW type', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        // THEN
        expect(() => {
            cluster.addCapacity('WindowsGpuAutoScalingGroup', {
                instanceType: new ec2.InstanceType('t2.micro'),
                machineImage: new ecs.EcsOptimizedAmi({
                    windowsVersion: ecs.WindowsOptimizedVersion.SERVER_2019,
                    hardwareType: ecs.AmiHardwareType.GPU,
                }),
            });
        }).toThrow(/Windows Server does not support special hardware type/);
    });
    cdk_build_tools_1.testDeprecated('errors if windowsVersion and linux generation are set', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        // THEN
        expect(() => {
            cluster.addCapacity('WindowsScalingGroup', {
                instanceType: new ec2.InstanceType('t2.micro'),
                machineImage: new ecs.EcsOptimizedAmi({
                    windowsVersion: ecs.WindowsOptimizedVersion.SERVER_2019,
                    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX,
                }),
            });
        }).toThrow(/"windowsVersion" and Linux image "generation" cannot be both set/);
    });
    cdk_build_tools_1.testDeprecated('allows returning the correct image for windows for EcsOptimizedAmi', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const ami = new ecs.EcsOptimizedAmi({
            windowsVersion: ecs.WindowsOptimizedVersion.SERVER_2019,
        });
        expect(ami.getImage(stack).osType).toEqual(ec2.OperatingSystemType.WINDOWS);
    });
    cdk_build_tools_1.testDeprecated('allows returning the correct image for linux for EcsOptimizedAmi', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const ami = new ecs.EcsOptimizedAmi({
            generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX,
        });
        expect(ami.getImage(stack).osType).toEqual(ec2.OperatingSystemType.LINUX);
    });
    cdk_build_tools_1.testDeprecated('allows returning the correct image for linux 2 for EcsOptimizedAmi', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const ami = new ecs.EcsOptimizedAmi({
            generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        });
        expect(ami.getImage(stack).osType).toEqual(ec2.OperatingSystemType.LINUX);
    });
    test('allows returning the correct image for linux for EcsOptimizedImage', () => {
        // GIVEN
        const stack = new cdk.Stack();
        expect(ecs.EcsOptimizedImage.amazonLinux().getImage(stack).osType).toEqual(ec2.OperatingSystemType.LINUX);
    });
    test('allows returning the correct image for linux 2 for EcsOptimizedImage', () => {
        // GIVEN
        const stack = new cdk.Stack();
        expect(ecs.EcsOptimizedImage.amazonLinux2().getImage(stack).osType).toEqual(ec2.OperatingSystemType.LINUX);
    });
    test('allows returning the correct image for linux 2 for EcsOptimizedImage with ARM hardware', () => {
        // GIVEN
        const stack = new cdk.Stack();
        expect(ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.ARM).getImage(stack).osType).toEqual(ec2.OperatingSystemType.LINUX);
    });
    test('allows returning the correct image for windows for EcsOptimizedImage', () => {
        // GIVEN
        const stack = new cdk.Stack();
        expect(ecs.EcsOptimizedImage.windows(ecs.WindowsOptimizedVersion.SERVER_2019).getImage(stack).osType).toEqual(ec2.OperatingSystemType.WINDOWS);
    });
    test('allows setting cluster ServiceConnectDefaults.Namespace property when useAsServiceConnectDefault is true', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        // WHEN
        cluster.addDefaultCloudMapNamespace({
            name: 'foo.com',
            useForServiceConnect: true,
        });
        // THEN
        expect(cluster._cfnCluster.serviceConnectDefaults.namespace).toBe('foo.com');
    });
    test('allows setting cluster _defaultCloudMapNamespace for HTTP namespace', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        // WHEN
        const namespace = cluster.addDefaultCloudMapNamespace({
            name: 'foo',
            type: cloudmap.NamespaceType.HTTP,
        });
        // THEN
        expect(namespace.namespaceName).toBe('foo');
    });
    /*
     * TODO:v2.0.0 END OF OBSOLETE BLOCK
     */
    cdk_build_tools_1.testDeprecated('allows specifying special HW AMI Type v2', () => {
        // GIVEN
        const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack = new cdk.Stack(app, 'test');
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('GpuAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
            machineImage: ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.GPU),
        });
        // THEN
        const assembly = app.synth();
        const template = assembly.getStackByName(stack.stackName).template;
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            ImageId: {
                Ref: 'SsmParameterValueawsserviceecsoptimizedamiamazonlinux2gpurecommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
            },
        });
        expect(template.Parameters).toEqual({
            SsmParameterValueawsserviceecsoptimizedamiamazonlinux2gpurecommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter: {
                Type: 'AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>',
                Default: '/aws/service/ecs/optimized-ami/amazon-linux-2/gpu/recommended/image_id',
            },
        });
    });
    cdk_build_tools_1.testDeprecated('allows specifying Amazon Linux v1 AMI', () => {
        // GIVEN
        const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack = new cdk.Stack(app, 'test');
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('GpuAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
            machineImage: ecs.EcsOptimizedImage.amazonLinux(),
        });
        // THEN
        const assembly = app.synth();
        const template = assembly.getStackByName(stack.stackName).template;
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            ImageId: {
                Ref: 'SsmParameterValueawsserviceecsoptimizedamiamazonlinuxrecommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
            },
        });
        expect(template.Parameters).toEqual({
            SsmParameterValueawsserviceecsoptimizedamiamazonlinuxrecommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter: {
                Type: 'AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>',
                Default: '/aws/service/ecs/optimized-ami/amazon-linux/recommended/image_id',
            },
        });
    });
    cdk_build_tools_1.testDeprecated('allows specifying windows image v2', () => {
        // GIVEN
        const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack = new cdk.Stack(app, 'test');
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('WindowsAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
            machineImage: ecs.EcsOptimizedImage.windows(ecs.WindowsOptimizedVersion.SERVER_2019),
        });
        // THEN
        const assembly = app.synth();
        const template = assembly.getStackByName(stack.stackName).template;
        expect(template.Parameters).toEqual({
            SsmParameterValueawsserviceecsoptimizedamiwindowsserver2019englishfullrecommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter: {
                Type: 'AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>',
                Default: '/aws/service/ecs/optimized-ami/windows_server/2019/english/full/recommended/image_id',
            },
        });
    });
    cdk_build_tools_1.testDeprecated('allows specifying spot fleet', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
            spotPrice: '0.31',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            SpotPrice: '0.31',
        });
    });
    cdk_build_tools_1.testDeprecated('allows specifying drain time', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
            taskDrainTime: cdk.Duration.minutes(1),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', {
            HeartbeatTimeout: 60,
        });
    });
    cdk_build_tools_1.testDeprecated('allows specifying automated spot draining', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('c5.xlarge'),
            spotPrice: '0.0735',
            spotInstanceDraining: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            UserData: {
                'Fn::Base64': {
                    'Fn::Join': [
                        '',
                        [
                            '#!/bin/bash\necho ECS_CLUSTER=',
                            {
                                Ref: 'EcsCluster97242B84',
                            },
                            ' >> /etc/ecs/ecs.config\nsudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP\nsudo service iptables save\necho ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config\necho ECS_ENABLE_SPOT_INSTANCE_DRAINING=true >> /etc/ecs/ecs.config',
                        ],
                    ],
                },
            },
        });
    });
    cdk_build_tools_1.testDeprecated('allows containers access to instance metadata service', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
            canContainersAccessInstanceRole: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            UserData: {
                'Fn::Base64': {
                    'Fn::Join': [
                        '',
                        [
                            '#!/bin/bash\necho ECS_CLUSTER=',
                            {
                                Ref: 'EcsCluster97242B84',
                            },
                            ' >> /etc/ecs/ecs.config',
                        ],
                    ],
                },
            },
        });
    });
    cdk_build_tools_1.testDeprecated('allows adding default service discovery namespace', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
        });
        // WHEN
        cluster.addDefaultCloudMapNamespace({
            name: 'foo.com',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::PrivateDnsNamespace', {
            Name: 'foo.com',
            Vpc: {
                Ref: 'MyVpcF9F0CA6F',
            },
        });
    });
    cdk_build_tools_1.testDeprecated('allows adding public service discovery namespace', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
        });
        // WHEN
        cluster.addDefaultCloudMapNamespace({
            name: 'foo.com',
            type: cloudmap.NamespaceType.DNS_PUBLIC,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::PublicDnsNamespace', {
            Name: 'foo.com',
        });
        expect(cluster.defaultCloudMapNamespace.type).toEqual(cloudmap.NamespaceType.DNS_PUBLIC);
    });
    cdk_build_tools_1.testDeprecated('throws if default service discovery namespace added more than once', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
        });
        // WHEN
        cluster.addDefaultCloudMapNamespace({
            name: 'foo.com',
        });
        // THEN
        expect(() => {
            cluster.addDefaultCloudMapNamespace({
                name: 'foo.com',
            });
        }).toThrow(/Can only add default namespace once./);
    });
    test('export/import of a cluster with a namespace', () => {
        // GIVEN
        const stack1 = new cdk.Stack();
        const vpc1 = new ec2.Vpc(stack1, 'Vpc');
        const cluster1 = new ecs.Cluster(stack1, 'Cluster', { vpc: vpc1 });
        cluster1.addDefaultCloudMapNamespace({
            name: 'hello.com',
        });
        const stack2 = new cdk.Stack();
        // WHEN
        const cluster2 = ecs.Cluster.fromClusterAttributes(stack2, 'Cluster', {
            vpc: vpc1,
            securityGroups: cluster1.connections.securityGroups,
            defaultCloudMapNamespace: cloudmap.PrivateDnsNamespace.fromPrivateDnsNamespaceAttributes(stack2, 'ns', {
                namespaceId: 'import-namespace-id',
                namespaceArn: 'import-namespace-arn',
                namespaceName: 'import-namespace-name',
            }),
            clusterName: 'cluster-name',
        });
        // THEN
        expect(cluster2.defaultCloudMapNamespace.type).toEqual(cloudmap.NamespaceType.DNS_PRIVATE);
        expect(stack2.resolve(cluster2.defaultCloudMapNamespace.namespaceId)).toEqual('import-namespace-id');
        // Can retrieve subnets from VPC - will throw 'There are no 'Private' subnets in this VPC. Use a different VPC subnet selection.' if broken.
        cluster2.vpc.selectSubnets();
    });
    test('imported cluster with imported security groups honors allowAllOutbound', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const importedSg1 = ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG1', 'sg-1', { allowAllOutbound: false });
        const importedSg2 = ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG2', 'sg-2');
        const cluster = ecs.Cluster.fromClusterAttributes(stack, 'Cluster', {
            clusterName: 'cluster-name',
            securityGroups: [importedSg1, importedSg2],
            vpc,
        });
        // WHEN
        cluster.connections.allowToAnyIpv4(ec2.Port.tcp(443));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
            GroupId: 'sg-1',
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroupEgress', 1);
    });
    test('Metric', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        // THEN
        expect(stack.resolve(cluster.metricCpuReservation())).toEqual({
            dimensions: {
                ClusterName: { Ref: 'EcsCluster97242B84' },
            },
            namespace: 'AWS/ECS',
            metricName: 'CPUReservation',
            period: cdk.Duration.minutes(5),
            statistic: 'Average',
        });
        expect(stack.resolve(cluster.metricMemoryReservation())).toEqual({
            dimensions: {
                ClusterName: { Ref: 'EcsCluster97242B84' },
            },
            namespace: 'AWS/ECS',
            metricName: 'MemoryReservation',
            period: cdk.Duration.minutes(5),
            statistic: 'Average',
        });
        expect(stack.resolve(cluster.metric('myMetric'))).toEqual({
            dimensions: {
                ClusterName: { Ref: 'EcsCluster97242B84' },
            },
            namespace: 'AWS/ECS',
            metricName: 'myMetric',
            period: cdk.Duration.minutes(5),
            statistic: 'Average',
        });
    });
    cdk_build_tools_1.testDeprecated('ASG with a public VPC without NAT Gateways', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyPublicVpc', {
            natGateways: 0,
            subnetConfiguration: [
                { cidrMask: 24, name: 'ingress', subnetType: ec2.SubnetType.PUBLIC },
            ],
        });
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        // WHEN
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
            associatePublicIpAddress: true,
            vpcSubnets: {
                onePerAz: true,
                subnetType: ec2.SubnetType.PUBLIC,
            },
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ECS::Cluster', 1);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
            CidrBlock: '10.0.0.0/16',
            EnableDnsHostnames: true,
            EnableDnsSupport: true,
            InstanceTenancy: ec2.DefaultInstanceTenancy.DEFAULT,
            Tags: [
                {
                    Key: 'Name',
                    Value: 'Default/MyPublicVpc',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            ImageId: {
                Ref: 'SsmParameterValueawsserviceecsoptimizedamiamazonlinux2recommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
            },
            InstanceType: 't2.micro',
            AssociatePublicIpAddress: true,
            IamInstanceProfile: {
                Ref: 'EcsClusterDefaultAutoScalingGroupInstanceProfile2CE606B3',
            },
            SecurityGroups: [
                {
                    'Fn::GetAtt': [
                        'EcsClusterDefaultAutoScalingGroupInstanceSecurityGroup912E1231',
                        'GroupId',
                    ],
                },
            ],
            UserData: {
                'Fn::Base64': {
                    'Fn::Join': [
                        '',
                        [
                            '#!/bin/bash\necho ECS_CLUSTER=',
                            {
                                Ref: 'EcsCluster97242B84',
                            },
                            // eslint-disable-next-line max-len
                            ' >> /etc/ecs/ecs.config\nsudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP\nsudo service iptables save\necho ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config',
                        ],
                    ],
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            MaxSize: '1',
            MinSize: '1',
            LaunchConfigurationName: {
                Ref: 'EcsClusterDefaultAutoScalingGroupLaunchConfigB7E376C1',
            },
            Tags: [
                {
                    Key: 'Name',
                    PropagateAtLaunch: true,
                    Value: 'Default/EcsCluster/DefaultAutoScalingGroup',
                },
            ],
            VPCZoneIdentifier: [
                {
                    Ref: 'MyPublicVpcingressSubnet1Subnet9191044C',
                },
                {
                    Ref: 'MyPublicVpcingressSubnet2SubnetD2F2E034',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
            GroupDescription: 'Default/EcsCluster/DefaultAutoScalingGroup/InstanceSecurityGroup',
            SecurityGroupEgress: [
                {
                    CidrIp: '0.0.0.0/0',
                    Description: 'Allow all outbound traffic by default',
                    IpProtocol: '-1',
                },
            ],
            Tags: [
                {
                    Key: 'Name',
                    Value: 'Default/EcsCluster/DefaultAutoScalingGroup',
                },
            ],
            VpcId: {
                Ref: 'MyPublicVpcA2BF6CDA',
            },
        });
        // THEN
    });
    test('enable container insights', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        new ecs.Cluster(stack, 'EcsCluster', { containerInsights: true });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Cluster', {
            ClusterSettings: [
                {
                    Name: 'containerInsights',
                    Value: 'enabled',
                },
            ],
        });
    });
    test('disable container insights', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        new ecs.Cluster(stack, 'EcsCluster', { containerInsights: false });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Cluster', {
            ClusterSettings: [
                {
                    Name: 'containerInsights',
                    Value: 'disabled',
                },
            ],
        });
    });
    test('default container insights is undefined', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        new ecs.Cluster(stack, 'EcsCluster');
        // THEN
        const assembly = app.synth();
        const stackAssembly = assembly.getStackByName(stack.stackName);
        const template = stackAssembly.template;
        expect(template.Resources.EcsCluster97242B84.Properties === undefined ||
            template.Resources.EcsCluster97242B84.Properties.ClusterSettings === undefined).toEqual(true);
    });
    test('BottleRocketImage() returns correct AMI', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        // WHEN
        new ecs.BottleRocketImage().getImage(stack);
        // THEN
        const assembly = app.synth();
        const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
        expect(Object.entries(parameters).some(([k, v]) => k.startsWith('SsmParameterValueawsservicebottlerocketawsecs') &&
            v.Default.includes('/bottlerocket/'))).toEqual(true);
        expect(Object.entries(parameters).some(([k, v]) => k.startsWith('SsmParameterValueawsservicebottlerocketawsecs') &&
            v.Default.includes('/aws-ecs-1/'))).toEqual(true);
    });
    cdk_build_tools_1.testDeprecated('cluster capacity with bottlerocket AMI, by setting machineImageType', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const cluster = new ecs.Cluster(stack, 'EcsCluster');
        cluster.addCapacity('bottlerocket-asg', {
            instanceType: new ec2.InstanceType('c5.large'),
            machineImageType: ecs.MachineImageType.BOTTLEROCKET,
        });
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ECS::Cluster', 1);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AutoScaling::AutoScalingGroup', 1);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            ImageId: {
                Ref: 'SsmParameterValueawsservicebottlerocketawsecs1x8664latestimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
            },
            UserData: {
                'Fn::Base64': {
                    'Fn::Join': [
                        '',
                        [
                            '\n[settings.ecs]\ncluster = "',
                            {
                                Ref: 'EcsCluster97242B84',
                            },
                            '"',
                        ],
                    ],
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [
                    {
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: {
                            Service: 'ec2.amazonaws.com',
                        },
                    },
                ],
                Version: '2012-10-17',
            },
            ManagedPolicyArns: [
                {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {
                                Ref: 'AWS::Partition',
                            },
                            ':iam::aws:policy/AmazonSSMManagedInstanceCore',
                        ],
                    ],
                },
                {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {
                                Ref: 'AWS::Partition',
                            },
                            ':iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role',
                        ],
                    ],
                },
            ],
            Tags: [
                {
                    Key: 'Name',
                    Value: 'test/EcsCluster/bottlerocket-asg',
                },
            ],
        });
    });
    cdk_build_tools_1.testDeprecated('correct bottlerocket AMI for ARM64 architecture', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const cluster = new ecs.Cluster(stack, 'EcsCluster');
        cluster.addCapacity('bottlerocket-asg', {
            instanceType: new ec2.InstanceType('m6g.large'),
            machineImageType: ecs.MachineImageType.BOTTLEROCKET,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            ImageId: {
                Ref: 'SsmParameterValueawsservicebottlerocketawsecs1arm64latestimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
            },
        });
        assertions_1.Template.fromStack(stack).hasParameter('SsmParameterValueawsservicebottlerocketawsecs1arm64latestimageidC96584B6F00A464EAD1953AFF4B05118Parameter', {
            Type: 'AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>',
            Default: '/aws/service/bottlerocket/aws-ecs-1/arm64/latest/image_id',
        });
    });
    cdk_build_tools_1.testDeprecated('throws when machineImage and machineImageType both specified', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const cluster = new ecs.Cluster(stack, 'EcsCluster');
        cluster.addCapacity('bottlerocket-asg', {
            instanceType: new ec2.InstanceType('c5.large'),
            machineImage: new ecs.BottleRocketImage(),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            UserData: {
                'Fn::Base64': {
                    'Fn::Join': [
                        '',
                        [
                            '\n[settings.ecs]\ncluster = "',
                            {
                                Ref: 'EcsCluster97242B84',
                            },
                            '"',
                        ],
                    ],
                },
            },
        });
    });
    cdk_build_tools_1.testDeprecated('updatePolicy set when passed without updateType', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const cluster = new ecs.Cluster(stack, 'EcsCluster');
        cluster.addCapacity('bottlerocket-asg', {
            instanceType: new ec2.InstanceType('c5.large'),
            machineImage: new ecs.BottleRocketImage(),
            updatePolicy: autoscaling.UpdatePolicy.replacingUpdate(),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
            UpdatePolicy: {
                AutoScalingReplacingUpdate: {
                    WillReplace: true,
                },
            },
        });
    });
    cdk_build_tools_1.testDeprecated('undefined updateType & updatePolicy replaced by default updatePolicy', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const cluster = new ecs.Cluster(stack, 'EcsCluster');
        cluster.addCapacity('bottlerocket-asg', {
            instanceType: new ec2.InstanceType('c5.large'),
            machineImage: new ecs.BottleRocketImage(),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
            UpdatePolicy: {
                AutoScalingReplacingUpdate: {
                    WillReplace: true,
                },
            },
        });
    });
    cdk_build_tools_1.testDeprecated('updateType.NONE replaced by updatePolicy equivalent', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const cluster = new ecs.Cluster(stack, 'EcsCluster');
        cluster.addCapacity('bottlerocket-asg', {
            instanceType: new ec2.InstanceType('c5.large'),
            machineImage: new ecs.BottleRocketImage(),
            updateType: autoscaling.UpdateType.NONE,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
            UpdatePolicy: {
                AutoScalingScheduledAction: {
                    IgnoreUnmodifiedGroupSizeProperties: true,
                },
            },
        });
    });
    cdk_build_tools_1.testDeprecated('updateType.REPLACING_UPDATE replaced by updatePolicy equivalent', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const cluster = new ecs.Cluster(stack, 'EcsCluster');
        cluster.addCapacity('bottlerocket-asg', {
            instanceType: new ec2.InstanceType('c5.large'),
            machineImage: new ecs.BottleRocketImage(),
            updateType: autoscaling.UpdateType.REPLACING_UPDATE,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
            UpdatePolicy: {
                AutoScalingReplacingUpdate: {
                    WillReplace: true,
                },
            },
        });
    });
    cdk_build_tools_1.testDeprecated('updateType.ROLLING_UPDATE replaced by updatePolicy equivalent', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const cluster = new ecs.Cluster(stack, 'EcsCluster');
        cluster.addCapacity('bottlerocket-asg', {
            instanceType: new ec2.InstanceType('c5.large'),
            machineImage: new ecs.BottleRocketImage(),
            updateType: autoscaling.UpdateType.ROLLING_UPDATE,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
            UpdatePolicy: {
                AutoScalingRollingUpdate: {
                    WaitOnResourceSignals: false,
                    PauseTime: 'PT0S',
                    SuspendProcesses: [
                        'HealthCheck',
                        'ReplaceUnhealthy',
                        'AZRebalance',
                        'AlarmNotification',
                        'ScheduledActions',
                    ],
                },
                AutoScalingScheduledAction: {
                    IgnoreUnmodifiedGroupSizeProperties: true,
                },
            },
        });
    });
    cdk_build_tools_1.testDeprecated('throws when updatePolicy and updateType both specified', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const cluster = new ecs.Cluster(stack, 'EcsCluster');
        expect(() => {
            cluster.addCapacity('bottlerocket-asg', {
                instanceType: new ec2.InstanceType('c5.large'),
                machineImage: new ecs.BottleRocketImage(),
                updatePolicy: autoscaling.UpdatePolicy.replacingUpdate(),
                updateType: autoscaling.UpdateType.REPLACING_UPDATE,
            });
        }).toThrow("Cannot set 'signals'/'updatePolicy' and 'updateType' together. Prefer 'signals'/'updatePolicy'");
    });
    cdk_build_tools_1.testDeprecated('allows specifying capacityProviders (deprecated)', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        // WHEN
        new ecs.Cluster(stack, 'EcsCluster', { capacityProviders: ['FARGATE_SPOT'] });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Cluster', {
            CapacityProviders: assertions_1.Match.absent(),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
            CapacityProviders: ['FARGATE_SPOT'],
        });
    });
    test('allows specifying Fargate capacityProviders', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        // WHEN
        new ecs.Cluster(stack, 'EcsCluster', {
            enableFargateCapacityProviders: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Cluster', {
            CapacityProviders: assertions_1.Match.absent(),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
            CapacityProviders: ['FARGATE', 'FARGATE_SPOT'],
        });
    });
    test('allows specifying capacityProviders (alternate method)', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        // WHEN
        const cluster = new ecs.Cluster(stack, 'EcsCluster');
        cluster.enableFargateCapacityProviders();
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Cluster', {
            CapacityProviders: assertions_1.Match.absent(),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
            CapacityProviders: ['FARGATE', 'FARGATE_SPOT'],
        });
    });
    cdk_build_tools_1.testDeprecated('allows adding capacityProviders post-construction (deprecated)', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const cluster = new ecs.Cluster(stack, 'EcsCluster');
        // WHEN
        cluster.addCapacityProvider('FARGATE');
        cluster.addCapacityProvider('FARGATE'); // does not add twice
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Cluster', {
            CapacityProviders: assertions_1.Match.absent(),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
            CapacityProviders: ['FARGATE'],
        });
    });
    cdk_build_tools_1.testDeprecated('allows adding capacityProviders post-construction', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const cluster = new ecs.Cluster(stack, 'EcsCluster');
        // WHEN
        cluster.addCapacityProvider('FARGATE');
        cluster.addCapacityProvider('FARGATE'); // does not add twice
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Cluster', {
            CapacityProviders: assertions_1.Match.absent(),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
            CapacityProviders: ['FARGATE'],
        });
    });
    cdk_build_tools_1.testDeprecated('throws for unsupported capacity providers', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const cluster = new ecs.Cluster(stack, 'EcsCluster');
        // THEN
        expect(() => {
            cluster.addCapacityProvider('HONK');
        }).toThrow(/CapacityProvider not supported/);
    });
    test('creates ASG capacity providers with expected defaults', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
            vpc,
            instanceType: new ec2.InstanceType('bogus'),
            machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
        });
        // WHEN
        new ecs.AsgCapacityProvider(stack, 'provider', {
            autoScalingGroup,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::CapacityProvider', {
            AutoScalingGroupProvider: {
                AutoScalingGroupArn: {
                    Ref: 'asgASG4D014670',
                },
                ManagedScaling: {
                    Status: 'ENABLED',
                    TargetCapacity: 100,
                },
                ManagedTerminationProtection: 'ENABLED',
            },
        });
    });
    test('can disable Managed Scaling and Managed Termination Protection for ASG capacity provider', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
            vpc,
            instanceType: new ec2.InstanceType('bogus'),
            machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
        });
        // WHEN
        new ecs.AsgCapacityProvider(stack, 'provider', {
            autoScalingGroup,
            enableManagedScaling: false,
            enableManagedTerminationProtection: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::CapacityProvider', {
            AutoScalingGroupProvider: {
                AutoScalingGroupArn: {
                    Ref: 'asgASG4D014670',
                },
                ManagedScaling: assertions_1.Match.absent(),
                ManagedTerminationProtection: 'DISABLED',
            },
        });
    });
    test('can disable Managed Termination Protection for ASG capacity provider', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
            vpc,
            instanceType: new ec2.InstanceType('bogus'),
            machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
        });
        // WHEN
        new ecs.AsgCapacityProvider(stack, 'provider', {
            autoScalingGroup,
            enableManagedTerminationProtection: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::CapacityProvider', {
            AutoScalingGroupProvider: {
                AutoScalingGroupArn: {
                    Ref: 'asgASG4D014670',
                },
                ManagedScaling: {
                    Status: 'ENABLED',
                    TargetCapacity: 100,
                },
                ManagedTerminationProtection: 'DISABLED',
            },
        });
    });
    test('throws error, when ASG capacity provider has Managed Scaling disabled and Managed Termination Protection is undefined (defaults to true)', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
            vpc,
            instanceType: new ec2.InstanceType('bogus'),
            machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
        });
        // THEN
        expect(() => {
            new ecs.AsgCapacityProvider(stack, 'provider', {
                autoScalingGroup,
                enableManagedScaling: false,
            });
        }).toThrowError('Cannot enable Managed Termination Protection on a Capacity Provider when Managed Scaling is disabled. Either enable Managed Scaling or disable Managed Termination Protection.');
    });
    test('throws error, when Managed Scaling is disabled and Managed Termination Protection is enabled.', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
            vpc,
            instanceType: new ec2.InstanceType('bogus'),
            machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
        });
        // THEN
        expect(() => {
            new ecs.AsgCapacityProvider(stack, 'provider', {
                autoScalingGroup,
                enableManagedScaling: false,
                enableManagedTerminationProtection: true,
            });
        }).toThrowError('Cannot enable Managed Termination Protection on a Capacity Provider when Managed Scaling is disabled. Either enable Managed Scaling or disable Managed Termination Protection.');
    });
    test('capacity provider enables ASG new instance scale-in protection by default', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
            vpc,
            instanceType: new ec2.InstanceType('bogus'),
            machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
        });
        // WHEN
        new ecs.AsgCapacityProvider(stack, 'provider', {
            autoScalingGroup,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            NewInstancesProtectedFromScaleIn: true,
        });
    });
    test('capacity provider disables ASG new instance scale-in protection', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
            vpc,
            instanceType: new ec2.InstanceType('bogus'),
            machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
        });
        // WHEN
        new ecs.AsgCapacityProvider(stack, 'provider', {
            autoScalingGroup,
            enableManagedTerminationProtection: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            NewInstancesProtectedFromScaleIn: assertions_1.Match.absent(),
        });
    });
    test('can add ASG capacity via Capacity Provider', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
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
        cluster.enableFargateCapacityProviders();
        // Ensure not added twice
        cluster.addAsgCapacityProvider(capacityProvider);
        cluster.addAsgCapacityProvider(capacityProvider);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
            Cluster: {
                Ref: 'EcsCluster97242B84',
            },
            CapacityProviders: [
                'FARGATE',
                'FARGATE_SPOT',
                {
                    Ref: 'providerD3FF4D3A',
                },
            ],
            DefaultCapacityProviderStrategy: [],
        });
    });
    test('should throw an error if capacity provider with default strategy is not present in capacity providers', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        // THEN
        expect(() => {
            new ecs.Cluster(stack, 'EcsCluster', {
                enableFargateCapacityProviders: true,
            }).addDefaultCapacityProviderStrategy([
                { capacityProvider: 'test capacityProvider', base: 10, weight: 50 },
            ]);
        }).toThrow('Capacity provider test capacityProvider must be added to the cluster with addAsgCapacityProvider() before it can be used in a default capacity provider strategy.');
    });
    test('should throw an error when capacity providers is length 0 and default capacity provider startegy specified', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        // THEN
        expect(() => {
            new ecs.Cluster(stack, 'EcsCluster', {
                enableFargateCapacityProviders: false,
            }).addDefaultCapacityProviderStrategy([
                { capacityProvider: 'test capacityProvider', base: 10, weight: 50 },
            ]);
        }).toThrow('Capacity provider test capacityProvider must be added to the cluster with addAsgCapacityProvider() before it can be used in a default capacity provider strategy.');
    });
    test('should throw an error when more than 1 default capacity provider have base specified', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        // THEN
        expect(() => {
            new ecs.Cluster(stack, 'EcsCluster', {
                enableFargateCapacityProviders: true,
            }).addDefaultCapacityProviderStrategy([
                { capacityProvider: 'FARGATE', base: 10, weight: 50 },
                { capacityProvider: 'FARGATE_SPOT', base: 10, weight: 50 },
            ]);
        }).toThrow(/Only 1 capacity provider in a capacity provider strategy can have a nonzero base./);
    });
    test('should throw an error when a capacity provider strategy contains a mix of Auto Scaling groups and Fargate providers', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
            vpc,
            instanceType: new ec2.InstanceType('bogus'),
            machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
        });
        const cluster = new ecs.Cluster(stack, 'EcsCluster', {
            enableFargateCapacityProviders: true,
        });
        const capacityProvider = new ecs.AsgCapacityProvider(stack, 'provider', {
            autoScalingGroup,
            enableManagedTerminationProtection: false,
        });
        cluster.addAsgCapacityProvider(capacityProvider);
        // THEN
        expect(() => {
            cluster.addDefaultCapacityProviderStrategy([
                { capacityProvider: 'FARGATE', base: 10, weight: 50 },
                { capacityProvider: 'FARGATE_SPOT' },
                { capacityProvider: capacityProvider.capacityProviderName },
            ]);
        }).toThrow(/A capacity provider strategy cannot contain a mix of capacity providers using Auto Scaling groups and Fargate providers. Specify one or the other and try again./);
    });
    test('should throw an error if addDefaultCapacityProviderStrategy is called more than once', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        // THEN
        expect(() => {
            const cluster = new ecs.Cluster(stack, 'EcsCluster', {
                enableFargateCapacityProviders: true,
            });
            cluster.addDefaultCapacityProviderStrategy([
                { capacityProvider: 'FARGATE', base: 10, weight: 50 },
                { capacityProvider: 'FARGATE_SPOT' },
            ]);
            cluster.addDefaultCapacityProviderStrategy([
                { capacityProvider: 'FARGATE', base: 10, weight: 50 },
                { capacityProvider: 'FARGATE_SPOT' },
            ]);
        }).toThrow(/Cluster default capacity provider strategy is already set./);
    });
    test('can add ASG capacity via Capacity Provider with default capacity provider', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const cluster = new ecs.Cluster(stack, 'EcsCluster', {
            enableFargateCapacityProviders: true,
        });
        cluster.addDefaultCapacityProviderStrategy([
            { capacityProvider: 'FARGATE', base: 10, weight: 50 },
            { capacityProvider: 'FARGATE_SPOT' },
        ]);
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
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
            Cluster: {
                Ref: 'EcsCluster97242B84',
            },
            CapacityProviders: [
                'FARGATE',
                'FARGATE_SPOT',
                {
                    Ref: 'providerD3FF4D3A',
                },
            ],
            DefaultCapacityProviderStrategy: [
                { CapacityProvider: 'FARGATE', Base: 10, Weight: 50 },
                { CapacityProvider: 'FARGATE_SPOT' },
            ],
        });
    });
    test('can add ASG default capacity provider', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
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
        cluster.addDefaultCapacityProviderStrategy([
            { capacityProvider: capacityProvider.capacityProviderName },
        ]);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
            Cluster: {
                Ref: 'EcsCluster97242B84',
            },
            CapacityProviders: [
                {
                    Ref: 'providerD3FF4D3A',
                },
            ],
            DefaultCapacityProviderStrategy: [
                {
                    CapacityProvider: {
                        Ref: 'providerD3FF4D3A',
                    },
                },
            ],
        });
    });
    test('correctly sets log configuration for execute command', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const kmsKey = new kms.Key(stack, 'KmsKey');
        const logGroup = new logs.LogGroup(stack, 'LogGroup', {
            encryptionKey: kmsKey,
        });
        const execBucket = new s3.Bucket(stack, 'EcsExecBucket', {
            encryptionKey: kmsKey,
        });
        // WHEN
        new ecs.Cluster(stack, 'EcsCluster', {
            executeCommandConfiguration: {
                kmsKey: kmsKey,
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
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Cluster', {
            Configuration: {
                ExecuteCommandConfiguration: {
                    KmsKeyId: {
                        'Fn::GetAtt': [
                            'KmsKey46693ADD',
                            'Arn',
                        ],
                    },
                    LogConfiguration: {
                        CloudWatchEncryptionEnabled: true,
                        CloudWatchLogGroupName: {
                            Ref: 'LogGroupF5B46931',
                        },
                        S3BucketName: {
                            Ref: 'EcsExecBucket4F468651',
                        },
                        S3EncryptionEnabled: true,
                        S3KeyPrefix: 'exec-output',
                    },
                    Logging: 'OVERRIDE',
                },
            },
        });
    });
    test('throws when no log configuration is provided when logging is set to OVERRIDE', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        // THEN
        expect(() => {
            new ecs.Cluster(stack, 'EcsCluster', {
                executeCommandConfiguration: {
                    logging: ecs.ExecuteCommandLogging.OVERRIDE,
                },
            });
        }).toThrow(/Execute command log configuration must only be specified when logging is OVERRIDE./);
    });
    test('throws when log configuration provided but logging is set to DEFAULT', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const logGroup = new logs.LogGroup(stack, 'LogGroup');
        // THEN
        expect(() => {
            new ecs.Cluster(stack, 'EcsCluster', {
                executeCommandConfiguration: {
                    logConfiguration: {
                        cloudWatchLogGroup: logGroup,
                    },
                    logging: ecs.ExecuteCommandLogging.DEFAULT,
                },
            });
        }).toThrow(/Execute command log configuration must only be specified when logging is OVERRIDE./);
    });
    test('throws when CloudWatchEncryptionEnabled without providing CloudWatch Logs log group name', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        // THEN
        expect(() => {
            new ecs.Cluster(stack, 'EcsCluster', {
                executeCommandConfiguration: {
                    logConfiguration: {
                        cloudWatchEncryptionEnabled: true,
                    },
                    logging: ecs.ExecuteCommandLogging.OVERRIDE,
                },
            });
        }).toThrow(/You must specify a CloudWatch log group in the execute command log configuration to enable CloudWatch encryption./);
    });
    test('throws when S3EncryptionEnabled without providing S3 Bucket name', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        // THEN
        expect(() => {
            new ecs.Cluster(stack, 'EcsCluster', {
                executeCommandConfiguration: {
                    logConfiguration: {
                        s3EncryptionEnabled: true,
                    },
                    logging: ecs.ExecuteCommandLogging.OVERRIDE,
                },
            });
        }).toThrow(/You must specify an S3 bucket name in the execute command log configuration to enable S3 encryption./);
    });
    test('When importing ECS Cluster via Arn', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const clusterName = 'my-cluster';
        const region = 'service-region';
        const account = 'service-account';
        const cluster = ecs.Cluster.fromClusterArn(stack, 'Cluster', `arn:aws:ecs:${region}:${account}:cluster/${clusterName}`);
        // THEN
        expect(cluster.clusterName).toEqual(clusterName);
        expect(cluster.env.region).toEqual(region);
        expect(cluster.env.account).toEqual(account);
    });
    test('throws error when import ECS Cluster without resource name in arn', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // THEN
        expect(() => {
            ecs.Cluster.fromClusterArn(stack, 'Cluster', 'arn:aws:ecs:service-region:service-account:cluster');
        }).toThrowError(/Missing required Cluster Name from Cluster ARN: /);
    });
});
test('can add ASG capacity via Capacity Provider by not specifying machineImageType', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const cluster = new ecs.Cluster(stack, 'EcsCluster');
    const autoScalingGroupAl2 = new autoscaling.AutoScalingGroup(stack, 'asgal2', {
        vpc,
        instanceType: new ec2.InstanceType('bogus'),
        machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
    });
    const autoScalingGroupBottlerocket = new autoscaling.AutoScalingGroup(stack, 'asgBottlerocket', {
        vpc,
        instanceType: new ec2.InstanceType('bogus'),
        machineImage: new ecs.BottleRocketImage(),
    });
    // WHEN
    const capacityProviderAl2 = new ecs.AsgCapacityProvider(stack, 'provideral2', {
        autoScalingGroup: autoScalingGroupAl2,
        enableManagedTerminationProtection: false,
    });
    const capacityProviderBottlerocket = new ecs.AsgCapacityProvider(stack, 'providerBottlerocket', {
        autoScalingGroup: autoScalingGroupBottlerocket,
        enableManagedTerminationProtection: false,
        machineImageType: ecs.MachineImageType.BOTTLEROCKET,
    });
    cluster.enableFargateCapacityProviders();
    // Ensure not added twice
    cluster.addAsgCapacityProvider(capacityProviderAl2);
    cluster.addAsgCapacityProvider(capacityProviderAl2);
    // Add Bottlerocket ASG Capacity Provider
    cluster.addAsgCapacityProvider(capacityProviderBottlerocket);
    // THEN Bottlerocket LaunchConfiguration
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
        ImageId: {
            Ref: 'SsmParameterValueawsservicebottlerocketawsecs1x8664latestimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
        },
        UserData: {
            'Fn::Base64': {
                'Fn::Join': [
                    '',
                    [
                        '\n[settings.ecs]\ncluster = \"',
                        {
                            Ref: 'EcsCluster97242B84',
                        },
                        '\"',
                    ],
                ],
            },
        },
    });
    // THEN AmazonLinux2 LaunchConfiguration
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
        ImageId: {
            Ref: 'SsmParameterValueawsserviceecsoptimizedamiamazonlinux2recommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter',
        },
        UserData: {
            'Fn::Base64': {
                'Fn::Join': [
                    '',
                    [
                        '#!/bin/bash\necho ECS_CLUSTER=',
                        {
                            Ref: 'EcsCluster97242B84',
                        },
                        ' >> /etc/ecs/ecs.config\nsudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP\nsudo service iptables save\necho ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config',
                    ],
                ],
            },
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::ClusterCapacityProviderAssociations', {
        CapacityProviders: [
            'FARGATE',
            'FARGATE_SPOT',
            {
                Ref: 'provideral2A427CBC0',
            },
            {
                Ref: 'providerBottlerocket90C039FA',
            },
        ],
        Cluster: {
            Ref: 'EcsCluster97242B84',
        },
        DefaultCapacityProviderStrategy: [],
    });
});
test('throws when ASG Capacity Provider with capacityProviderName starting with aws, ecs or faragte', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test');
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const cluster = new ecs.Cluster(stack, 'EcsCluster');
    const autoScalingGroupAl2 = new autoscaling.AutoScalingGroup(stack, 'asgal2', {
        vpc,
        instanceType: new ec2.InstanceType('bogus'),
        machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
    });
    // THEN
    expect(() => {
        // WHEN Capacity Provider define capacityProviderName start with aws.
        const capacityProviderAl2 = new ecs.AsgCapacityProvider(stack, 'provideral2', {
            autoScalingGroup: autoScalingGroupAl2,
            enableManagedTerminationProtection: false,
            capacityProviderName: 'awscp',
        });
        cluster.addAsgCapacityProvider(capacityProviderAl2);
    }).toThrow(/Invalid Capacity Provider Name: awscp, If a name is specified, it cannot start with aws, ecs, or fargate./);
    expect(() => {
        // WHEN Capacity Provider define capacityProviderName start with ecs.
        const capacityProviderAl2 = new ecs.AsgCapacityProvider(stack, 'provideral2-2', {
            autoScalingGroup: autoScalingGroupAl2,
            enableManagedTerminationProtection: false,
            capacityProviderName: 'ecscp',
        });
        cluster.addAsgCapacityProvider(capacityProviderAl2);
    }).toThrow(/Invalid Capacity Provider Name: ecscp, If a name is specified, it cannot start with aws, ecs, or fargate./);
});
describe('Accessing container instance role', function () {
    const addUserDataMock = jest.fn();
    const autoScalingGroup = {
        addUserData: addUserDataMock,
        addToRolePolicy: jest.fn(),
        protectNewInstancesFromScaleIn: jest.fn(),
    };
    afterEach(() => {
        addUserDataMock.mockClear();
    });
    test('block ecs from accessing metadata service when canContainersAccessInstanceRole not set', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const cluster = new ecs.Cluster(stack, 'EcsCluster');
        // WHEN
        const capacityProvider = new ecs.AsgCapacityProvider(stack, 'Provider', {
            autoScalingGroup: autoScalingGroup,
        });
        cluster.addAsgCapacityProvider(capacityProvider);
        // THEN
        expect(autoScalingGroup.addUserData).toHaveBeenCalledWith('sudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP');
        expect(autoScalingGroup.addUserData).toHaveBeenCalledWith('sudo service iptables save');
        expect(autoScalingGroup.addUserData).toHaveBeenCalledWith('echo ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config');
    });
    test('allow ecs accessing metadata service when canContainersAccessInstanceRole is set on addAsgCapacityProvider', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const cluster = new ecs.Cluster(stack, 'EcsCluster');
        // WHEN
        const capacityProvider = new ecs.AsgCapacityProvider(stack, 'Provider', {
            autoScalingGroup: autoScalingGroup,
        });
        cluster.addAsgCapacityProvider(capacityProvider, {
            canContainersAccessInstanceRole: true,
        });
        // THEN
        expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('sudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP');
        expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('sudo service iptables save');
        expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('echo ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config');
    });
    test('allow ecs accessing metadata service when canContainersAccessInstanceRole is set on AsgCapacityProvider instantiation', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const cluster = new ecs.Cluster(stack, 'EcsCluster');
        // WHEN
        const capacityProvider = new ecs.AsgCapacityProvider(stack, 'Provider', {
            autoScalingGroup: autoScalingGroup,
            canContainersAccessInstanceRole: true,
        });
        cluster.addAsgCapacityProvider(capacityProvider);
        // THEN
        expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('sudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP');
        expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('sudo service iptables save');
        expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('echo ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config');
    });
    test('allow ecs accessing metadata service when canContainersAccessInstanceRole is set on constructor and method', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const cluster = new ecs.Cluster(stack, 'EcsCluster');
        // WHEN
        const capacityProvider = new ecs.AsgCapacityProvider(stack, 'Provider', {
            autoScalingGroup: autoScalingGroup,
            canContainersAccessInstanceRole: true,
        });
        cluster.addAsgCapacityProvider(capacityProvider, {
            canContainersAccessInstanceRole: true,
        });
        // THEN
        expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('sudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP');
        expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('sudo service iptables save');
        expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('echo ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config');
    });
    test('block ecs from accessing metadata service when canContainersAccessInstanceRole set on constructor and not set on method', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const cluster = new ecs.Cluster(stack, 'EcsCluster');
        // WHEN
        const capacityProvider = new ecs.AsgCapacityProvider(stack, 'Provider', {
            autoScalingGroup: autoScalingGroup,
            canContainersAccessInstanceRole: true,
        });
        cluster.addAsgCapacityProvider(capacityProvider, {
            canContainersAccessInstanceRole: false,
        });
        // THEN
        expect(autoScalingGroup.addUserData).toHaveBeenCalledWith('sudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP');
        expect(autoScalingGroup.addUserData).toHaveBeenCalledWith('sudo service iptables save');
        expect(autoScalingGroup.addUserData).toHaveBeenCalledWith('echo ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config');
    });
    test('allow ecs accessing metadata service when canContainersAccessInstanceRole is not set on constructor and set on method', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'test');
        const cluster = new ecs.Cluster(stack, 'EcsCluster');
        // WHEN
        const capacityProvider = new ecs.AsgCapacityProvider(stack, 'Provider', {
            autoScalingGroup: autoScalingGroup,
            canContainersAccessInstanceRole: false,
        });
        cluster.addAsgCapacityProvider(capacityProvider, {
            canContainersAccessInstanceRole: true,
        });
        // THEN
        expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('sudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP');
        expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('sudo service iptables save');
        expect(autoScalingGroup.addUserData).not.toHaveBeenCalledWith('echo ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2x1c3Rlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELHdEQUF3RDtBQUN4RCx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLDBDQUEwQztBQUMxQyxzQ0FBc0M7QUFDdEMsMERBQTBEO0FBQzFELDhEQUEwRDtBQUMxRCxxQ0FBcUM7QUFDckMseUNBQXlDO0FBQ3pDLDhCQUE4QjtBQUU5QixRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtJQUN2QixRQUFRLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO1FBQ25DLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7WUFDMUMsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLE9BQU87WUFDUCxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQzVELE9BQU87WUFDUCxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1lBQ3BELFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRXRDLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxLQUFL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LEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN6QyxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRXJELE9BQU87UUFDUCxNQUFNLGdCQUFnQixHQUFHLElBQUksR0FBRyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDdEUsZ0JBQWdCLEVBQUUsZ0JBQWdCO1lBQ2xDLCtCQUErQixFQUFFLEtBQUs7U0FDdkMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLHNCQUFzQixDQUFDLGdCQUFnQixFQUFFO1lBQy9DLCtCQUErQixFQUFFLElBQUk7U0FDdEMsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsc0dBQXNHLENBQUMsQ0FBQztRQUN0SyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDNUYsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO0lBQzFILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGF1dG9zY2FsaW5nIGZyb20gJ0Bhd3MtY2RrL2F3cy1hdXRvc2NhbGluZyc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBsb2dzIGZyb20gJ0Bhd3MtY2RrL2F3cy1sb2dzJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjbG91ZG1hcCBmcm9tICdAYXdzLWNkay9hd3Mtc2VydmljZWRpc2NvdmVyeSc7XG5pbXBvcnQgeyB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdjbHVzdGVyJywgKCkgPT4ge1xuICBkZXNjcmliZSgnaXNDbHVzdGVyKCkgcmV0dXJucycsICgpID0+IHtcbiAgICB0ZXN0KCd0cnVlIGlmIGdpdmVuIGNsdXN0ZXIgaW5zdGFuY2UnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBjcmVhdGVkQ2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInKTtcbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChlY3MuQ2x1c3Rlci5pc0NsdXN0ZXIoY3JlYXRlZENsdXN0ZXIpKS50b0JlKHRydWUpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZmFsc2UgaWYgZ2l2ZW4gaW1wb3J0ZWQgY2x1c3RlciBpbnN0YW5jZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJyk7XG5cbiAgICAgIGNvbnN0IGltcG9ydGVkU2cgPSBlYzIuU2VjdXJpdHlHcm91cC5mcm9tU2VjdXJpdHlHcm91cElkKHN0YWNrLCAnU0cxJywgJ3NnLTEnLCB7IGFsbG93QWxsT3V0Ym91bmQ6IGZhbHNlIH0pO1xuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgaW1wb3J0ZWRDbHVzdGVyID0gZWNzLkNsdXN0ZXIuZnJvbUNsdXN0ZXJBdHRyaWJ1dGVzKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgY2x1c3Rlck5hbWU6ICdjbHVzdGVyLW5hbWUnLFxuICAgICAgICBzZWN1cml0eUdyb3VwczogW2ltcG9ydGVkU2ddLFxuICAgICAgICB2cGMsXG4gICAgICB9KTtcbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChlY3MuQ2x1c3Rlci5pc0NsdXN0ZXIoaW1wb3J0ZWRDbHVzdGVyKSkudG9CZShmYWxzZSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdmYWxzZSBpZiBnaXZlbiB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoZWNzLkNsdXN0ZXIuaXNDbHVzdGVyKHVuZGVmaW5lZCkpLnRvQmUoZmFsc2UpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnV2hlbiBjcmVhdGluZyBhbiBFQ1MgQ2x1c3RlcicsICgpID0+IHtcbiAgICB0ZXN0RGVwcmVjYXRlZCgnd2l0aCBubyBwcm9wZXJ0aWVzIHNldCwgaXQgY29ycmVjdGx5IHNldHMgZGVmYXVsdCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInKTtcblxuICAgICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUNTOjpDbHVzdGVyJywgMSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDJywge1xuICAgICAgICBDaWRyQmxvY2s6ICcxMC4wLjAuMC8xNicsXG4gICAgICAgIEVuYWJsZURuc0hvc3RuYW1lczogdHJ1ZSxcbiAgICAgICAgRW5hYmxlRG5zU3VwcG9ydDogdHJ1ZSxcbiAgICAgICAgSW5zdGFuY2VUZW5hbmN5OiBlYzIuRGVmYXVsdEluc3RhbmNlVGVuYW5jeS5ERUZBVUxULFxuICAgICAgICBUYWdzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgS2V5OiAnTmFtZScsXG4gICAgICAgICAgICBWYWx1ZTogJ0RlZmF1bHQvRWNzQ2x1c3Rlci9WcGMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkxhdW5jaENvbmZpZ3VyYXRpb24nLCB7XG4gICAgICAgIEltYWdlSWQ6IHtcbiAgICAgICAgICBSZWY6ICdTc21QYXJhbWV0ZXJWYWx1ZWF3c3NlcnZpY2VlY3NvcHRpbWl6ZWRhbWlhbWF6b25saW51eDJyZWNvbW1lbmRlZGltYWdlaWRDOTY1ODRCNkYwMEE0NjRFQUQxOTUzQUZGNEIwNTExOFBhcmFtZXRlcicsXG4gICAgICAgIH0sXG4gICAgICAgIEluc3RhbmNlVHlwZTogJ3QyLm1pY3JvJyxcbiAgICAgICAgSWFtSW5zdGFuY2VQcm9maWxlOiB7XG4gICAgICAgICAgUmVmOiAnRWNzQ2x1c3RlckRlZmF1bHRBdXRvU2NhbGluZ0dyb3VwSW5zdGFuY2VQcm9maWxlMkNFNjA2QjMnLFxuICAgICAgICB9LFxuICAgICAgICBTZWN1cml0eUdyb3VwczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnRWNzQ2x1c3RlckRlZmF1bHRBdXRvU2NhbGluZ0dyb3VwSW5zdGFuY2VTZWN1cml0eUdyb3VwOTEyRTEyMzEnLFxuICAgICAgICAgICAgICAnR3JvdXBJZCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFVzZXJEYXRhOiB7XG4gICAgICAgICAgJ0ZuOjpCYXNlNjQnOiB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJyMhL2Jpbi9iYXNoXFxuZWNobyBFQ1NfQ0xVU1RFUj0nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgICAgICAgICAgICcgPj4gL2V0Yy9lY3MvZWNzLmNvbmZpZ1xcbnN1ZG8gaXB0YWJsZXMgLS1pbnNlcnQgRk9SV0FSRCAxIC0taW4taW50ZXJmYWNlIGRvY2tlcisgLS1kZXN0aW5hdGlvbiAxNjkuMjU0LjE2OS4yNTQvMzIgLS1qdW1wIERST1BcXG5zdWRvIHNlcnZpY2UgaXB0YWJsZXMgc2F2ZVxcbmVjaG8gRUNTX0FXU1ZQQ19CTE9DS19JTURTPXRydWUgPj4gL2V0Yy9lY3MvZWNzLmNvbmZpZycsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICAgIE1heFNpemU6ICcxJyxcbiAgICAgICAgTWluU2l6ZTogJzEnLFxuICAgICAgICBMYXVuY2hDb25maWd1cmF0aW9uTmFtZToge1xuICAgICAgICAgIFJlZjogJ0Vjc0NsdXN0ZXJEZWZhdWx0QXV0b1NjYWxpbmdHcm91cExhdW5jaENvbmZpZ0I3RTM3NkMxJyxcbiAgICAgICAgfSxcbiAgICAgICAgVGFnczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEtleTogJ05hbWUnLFxuICAgICAgICAgICAgUHJvcGFnYXRlQXRMYXVuY2g6IHRydWUsXG4gICAgICAgICAgICBWYWx1ZTogJ0RlZmF1bHQvRWNzQ2x1c3Rlci9EZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVlBDWm9uZUlkZW50aWZpZXI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdFY3NDbHVzdGVyVnBjUHJpdmF0ZVN1Ym5ldDFTdWJuZXRGQUIwRTQ4NycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdFY3NDbHVzdGVyVnBjUHJpdmF0ZVN1Ym5ldDJTdWJuZXRDMkI3QjFCQScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICAgIEdyb3VwRGVzY3JpcHRpb246ICdEZWZhdWx0L0Vjc0NsdXN0ZXIvRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAvSW5zdGFuY2VTZWN1cml0eUdyb3VwJyxcbiAgICAgICAgU2VjdXJpdHlHcm91cEVncmVzczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENpZHJJcDogJzAuMC4wLjAvMCcsXG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogJ0FsbG93IGFsbCBvdXRib3VuZCB0cmFmZmljIGJ5IGRlZmF1bHQnLFxuICAgICAgICAgICAgSXBQcm90b2NvbDogJy0xJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBUYWdzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgS2V5OiAnTmFtZScsXG4gICAgICAgICAgICBWYWx1ZTogJ0RlZmF1bHQvRWNzQ2x1c3Rlci9EZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVnBjSWQ6IHtcbiAgICAgICAgICBSZWY6ICdFY3NDbHVzdGVyVnBjNzc5OTE0QUInLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgICBTZXJ2aWNlOiAnZWMyLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgJ2VjczpEZXJlZ2lzdGVyQ29udGFpbmVySW5zdGFuY2UnLFxuICAgICAgICAgICAgICAgICdlY3M6UmVnaXN0ZXJDb250YWluZXJJbnN0YW5jZScsXG4gICAgICAgICAgICAgICAgJ2VjczpTdWJtaXQqJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcsXG4gICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgJ2VjczpQb2xsJyxcbiAgICAgICAgICAgICAgICAnZWNzOlN0YXJ0VGVsZW1ldHJ5U2Vzc2lvbicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgICAgQXJuRXF1YWxzOiB7XG4gICAgICAgICAgICAgICAgICAnZWNzOmNsdXN0ZXInOiB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICdFY3NDbHVzdGVyOTcyNDJCODQnLFxuICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgJ2VjczpEaXNjb3ZlclBvbGxFbmRwb2ludCcsXG4gICAgICAgICAgICAgICAgJ2VjcjpHZXRBdXRob3JpemF0aW9uVG9rZW4nLFxuICAgICAgICAgICAgICAgICdsb2dzOkNyZWF0ZUxvZ1N0cmVhbScsXG4gICAgICAgICAgICAgICAgJ2xvZ3M6UHV0TG9nRXZlbnRzJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdERlcHJlY2F0ZWQoJ3dpdGggb25seSB2cGMgc2V0LCBpdCBjb3JyZWN0bHkgc2V0cyBkZWZhdWx0IHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7XG4gICAgICAgIHZwYyxcbiAgICAgIH0pO1xuXG4gICAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQ1M6OkNsdXN0ZXInLCAxKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWUEMnLCB7XG4gICAgICAgIENpZHJCbG9jazogJzEwLjAuMC4wLzE2JyxcbiAgICAgICAgRW5hYmxlRG5zSG9zdG5hbWVzOiB0cnVlLFxuICAgICAgICBFbmFibGVEbnNTdXBwb3J0OiB0cnVlLFxuICAgICAgICBJbnN0YW5jZVRlbmFuY3k6IGVjMi5EZWZhdWx0SW5zdGFuY2VUZW5hbmN5LkRFRkFVTFQsXG4gICAgICAgIFRhZ3M6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBLZXk6ICdOYW1lJyxcbiAgICAgICAgICAgIFZhbHVlOiAnRGVmYXVsdC9NeVZwYycsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6TGF1bmNoQ29uZmlndXJhdGlvbicsIHtcbiAgICAgICAgSW1hZ2VJZDoge1xuICAgICAgICAgIFJlZjogJ1NzbVBhcmFtZXRlclZhbHVlYXdzc2VydmljZWVjc29wdGltaXplZGFtaWFtYXpvbmxpbnV4MnJlY29tbWVuZGVkaW1hZ2VpZEM5NjU4NEI2RjAwQTQ2NEVBRDE5NTNBRkY0QjA1MTE4UGFyYW1ldGVyJyxcbiAgICAgICAgfSxcbiAgICAgICAgSW5zdGFuY2VUeXBlOiAndDIubWljcm8nLFxuICAgICAgICBJYW1JbnN0YW5jZVByb2ZpbGU6IHtcbiAgICAgICAgICBSZWY6ICdFY3NDbHVzdGVyRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXBJbnN0YW5jZVByb2ZpbGUyQ0U2MDZCMycsXG4gICAgICAgIH0sXG4gICAgICAgIFNlY3VyaXR5R3JvdXBzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdFY3NDbHVzdGVyRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXBJbnN0YW5jZVNlY3VyaXR5R3JvdXA5MTJFMTIzMScsXG4gICAgICAgICAgICAgICdHcm91cElkJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVXNlckRhdGE6IHtcbiAgICAgICAgICAnRm46OkJhc2U2NCc6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnIyEvYmluL2Jhc2hcXG5lY2hvIEVDU19DTFVTVEVSPScsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnRWNzQ2x1c3Rlcjk3MjQyQjg0JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICAgICAgICAgICAgJyA+PiAvZXRjL2Vjcy9lY3MuY29uZmlnXFxuc3VkbyBpcHRhYmxlcyAtLWluc2VydCBGT1JXQVJEIDEgLS1pbi1pbnRlcmZhY2UgZG9ja2VyKyAtLWRlc3RpbmF0aW9uIDE2OS4yNTQuMTY5LjI1NC8zMiAtLWp1bXAgRFJPUFxcbnN1ZG8gc2VydmljZSBpcHRhYmxlcyBzYXZlXFxuZWNobyBFQ1NfQVdTVlBDX0JMT0NLX0lNRFM9dHJ1ZSA+PiAvZXRjL2Vjcy9lY3MuY29uZmlnJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgICAgTWF4U2l6ZTogJzEnLFxuICAgICAgICBNaW5TaXplOiAnMScsXG4gICAgICAgIExhdW5jaENvbmZpZ3VyYXRpb25OYW1lOiB7XG4gICAgICAgICAgUmVmOiAnRWNzQ2x1c3RlckRlZmF1bHRBdXRvU2NhbGluZ0dyb3VwTGF1bmNoQ29uZmlnQjdFMzc2QzEnLFxuICAgICAgICB9LFxuICAgICAgICBUYWdzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgS2V5OiAnTmFtZScsXG4gICAgICAgICAgICBQcm9wYWdhdGVBdExhdW5jaDogdHJ1ZSxcbiAgICAgICAgICAgIFZhbHVlOiAnRGVmYXVsdC9FY3NDbHVzdGVyL0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWUENab25lSWRlbnRpZmllcjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ015VnBjUHJpdmF0ZVN1Ym5ldDFTdWJuZXQ1MDU3Q0Y3RScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdNeVZwY1ByaXZhdGVTdWJuZXQyU3VibmV0MDA0MEM5ODMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJywge1xuICAgICAgICBHcm91cERlc2NyaXB0aW9uOiAnRGVmYXVsdC9FY3NDbHVzdGVyL0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwL0luc3RhbmNlU2VjdXJpdHlHcm91cCcsXG4gICAgICAgIFNlY3VyaXR5R3JvdXBFZ3Jlc3M6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBDaWRySXA6ICcwLjAuMC4wLzAnLFxuICAgICAgICAgICAgRGVzY3JpcHRpb246ICdBbGxvdyBhbGwgb3V0Ym91bmQgdHJhZmZpYyBieSBkZWZhdWx0JyxcbiAgICAgICAgICAgIElwUHJvdG9jb2w6ICctMScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVGFnczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEtleTogJ05hbWUnLFxuICAgICAgICAgICAgVmFsdWU6ICdEZWZhdWx0L0Vjc0NsdXN0ZXIvRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZwY0lkOiB7XG4gICAgICAgICAgUmVmOiAnTXlWcGNGOUYwQ0E2RicsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICAgIFNlcnZpY2U6ICdlYzIuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAnZWNzOkRlcmVnaXN0ZXJDb250YWluZXJJbnN0YW5jZScsXG4gICAgICAgICAgICAgICAgJ2VjczpSZWdpc3RlckNvbnRhaW5lckluc3RhbmNlJyxcbiAgICAgICAgICAgICAgICAnZWNzOlN1Ym1pdConLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnRWNzQ2x1c3Rlcjk3MjQyQjg0JyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAnZWNzOlBvbGwnLFxuICAgICAgICAgICAgICAgICdlY3M6U3RhcnRUZWxlbWV0cnlTZXNzaW9uJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgICAgICBBcm5FcXVhbHM6IHtcbiAgICAgICAgICAgICAgICAgICdlY3M6Y2x1c3Rlcic6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcsXG4gICAgICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAnZWNzOkRpc2NvdmVyUG9sbEVuZHBvaW50JyxcbiAgICAgICAgICAgICAgICAnZWNyOkdldEF1dGhvcml6YXRpb25Ub2tlbicsXG4gICAgICAgICAgICAgICAgJ2xvZ3M6Q3JlYXRlTG9nU3RyZWFtJyxcbiAgICAgICAgICAgICAgICAnbG9nczpQdXRMb2dFdmVudHMnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdERlcHJlY2F0ZWQoJ211bHRpcGxlIGNsdXN0ZXJzIHdpdGggZGVmYXVsdCBjYXBhY2l0eScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssIGBFY3NDbHVzdGVyJHtpfWAsIHsgdnBjIH0pO1xuICAgICAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdNeUNhcGFjaXR5Jywge1xuICAgICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ20zLm1lZGl1bScpLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0RGVwcmVjYXRlZCgnbGlmZWN5Y2xlIGhvb2sgaXMgYXV0b21hdGljYWxseSBhZGRlZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHtcbiAgICAgICAgdnBjLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpMaWZlY3ljbGVIb29rJywge1xuICAgICAgICBBdXRvU2NhbGluZ0dyb3VwTmFtZTogeyBSZWY6ICdFY3NDbHVzdGVyRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXBBU0dDMUE3ODVEQicgfSxcbiAgICAgICAgTGlmZWN5Y2xlVHJhbnNpdGlvbjogJ2F1dG9zY2FsaW5nOkVDMl9JTlNUQU5DRV9URVJNSU5BVElORycsXG4gICAgICAgIERlZmF1bHRSZXN1bHQ6ICdDT05USU5VRScsXG4gICAgICAgIEhlYXJ0YmVhdFRpbWVvdXQ6IDMwMCxcbiAgICAgICAgTm90aWZpY2F0aW9uVGFyZ2V0QVJOOiB7IFJlZjogJ0Vjc0NsdXN0ZXJEZWZhdWx0QXV0b1NjYWxpbmdHcm91cExpZmVjeWNsZUhvb2tEcmFpbkhvb2tUb3BpY0FDRDJENEE0JyB9LFxuICAgICAgICBSb2xlQVJOOiB7ICdGbjo6R2V0QXR0JzogWydFY3NDbHVzdGVyRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXBMaWZlY3ljbGVIb29rRHJhaW5Ib29rUm9sZUEzOEVDODNCJywgJ0FybiddIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgICAgVGltZW91dDogMzEwLFxuICAgICAgICBFbnZpcm9ubWVudDoge1xuICAgICAgICAgIFZhcmlhYmxlczoge1xuICAgICAgICAgICAgQ0xVU1RFUjoge1xuICAgICAgICAgICAgICBSZWY6ICdFY3NDbHVzdGVyOTcyNDJCODQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBIYW5kbGVyOiAnaW5kZXgubGFtYmRhX2hhbmRsZXInLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAnZWMyOkRlc2NyaWJlSW5zdGFuY2VzJyxcbiAgICAgICAgICAgICAgICAnZWMyOkRlc2NyaWJlSW5zdGFuY2VBdHRyaWJ1dGUnLFxuICAgICAgICAgICAgICAgICdlYzI6RGVzY3JpYmVJbnN0YW5jZVN0YXR1cycsXG4gICAgICAgICAgICAgICAgJ2VjMjpEZXNjcmliZUhvc3RzJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnYXV0b3NjYWxpbmc6Q29tcGxldGVMaWZlY3ljbGVBY3Rpb24nLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzphdXRvc2NhbGluZzonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6YXV0b1NjYWxpbmdHcm91cDoqOmF1dG9TY2FsaW5nR3JvdXBOYW1lLycsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdFY3NDbHVzdGVyRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXBBU0dDMUE3ODVEQicsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAnZWNzOkRlc2NyaWJlQ29udGFpbmVySW5zdGFuY2VzJyxcbiAgICAgICAgICAgICAgICAnZWNzOkRlc2NyaWJlVGFza3MnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgICAgIEFybkVxdWFsczoge1xuICAgICAgICAgICAgICAgICAgJ2VjczpjbHVzdGVyJzoge1xuICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAnRWNzQ2x1c3Rlcjk3MjQyQjg0JyxcbiAgICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdlY3M6TGlzdENvbnRhaW5lckluc3RhbmNlcycsXG4gICAgICAgICAgICAgICAgJ2VjczpTdWJtaXRDb250YWluZXJTdGF0ZUNoYW5nZScsXG4gICAgICAgICAgICAgICAgJ2VjczpTdWJtaXRUYXNrU3RhdGVDaGFuZ2UnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnRWNzQ2x1c3Rlcjk3MjQyQjg0JyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAnZWNzOlVwZGF0ZUNvbnRhaW5lckluc3RhbmNlc1N0YXRlJyxcbiAgICAgICAgICAgICAgICAnZWNzOkxpc3RUYXNrcycsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgICAgIEFybkVxdWFsczoge1xuICAgICAgICAgICAgICAgICAgJ2VjczpjbHVzdGVyJzoge1xuICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAnRWNzQ2x1c3Rlcjk3MjQyQjg0JyxcbiAgICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgICAgUG9saWN5TmFtZTogJ0Vjc0NsdXN0ZXJEZWZhdWx0QXV0b1NjYWxpbmdHcm91cERyYWluRUNTSG9va0Z1bmN0aW9uU2VydmljZVJvbGVEZWZhdWx0UG9saWN5QTQ1QkYzOTYnLFxuICAgICAgICBSb2xlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ0Vjc0NsdXN0ZXJEZWZhdWx0QXV0b1NjYWxpbmdHcm91cERyYWluRUNTSG9va0Z1bmN0aW9uU2VydmljZVJvbGU5NDU0M0VEQScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3REZXByZWNhdGVkKCdsaWZlY3ljbGUgaG9vayB3aXRoIGVuY3J5cHRlZCBTTlMgaXMgYWRkZWQgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywge1xuICAgICAgICB2cGMsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnS2V5Jyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpLFxuICAgICAgICB0b3BpY0VuY3J5cHRpb25LZXk6IGtleSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTTlM6OlRvcGljJywge1xuICAgICAgICBLbXNNYXN0ZXJLZXlJZDoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0tleTk2MUI3M0ZEJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0RGVwcmVjYXRlZCgnd2l0aCBjYXBhY2l0eSBhbmQgY2xvdWRtYXAgbmFtZXNwYWNlIHByb3BlcnRpZXMgc2V0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgY2FwYWNpdHk6IHtcbiAgICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpLFxuICAgICAgICB9LFxuICAgICAgICBkZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2U6IHtcbiAgICAgICAgICBuYW1lOiAnZm9vLmNvbScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VydmljZURpc2NvdmVyeTo6UHJpdmF0ZURuc05hbWVzcGFjZScsIHtcbiAgICAgICAgTmFtZTogJ2Zvby5jb20nLFxuICAgICAgICBWcGM6IHtcbiAgICAgICAgICBSZWY6ICdNeVZwY0Y5RjBDQTZGJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQ1M6OkNsdXN0ZXInLCAxKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWUEMnLCB7XG4gICAgICAgIENpZHJCbG9jazogJzEwLjAuMC4wLzE2JyxcbiAgICAgICAgRW5hYmxlRG5zSG9zdG5hbWVzOiB0cnVlLFxuICAgICAgICBFbmFibGVEbnNTdXBwb3J0OiB0cnVlLFxuICAgICAgICBJbnN0YW5jZVRlbmFuY3k6IGVjMi5EZWZhdWx0SW5zdGFuY2VUZW5hbmN5LkRFRkFVTFQsXG4gICAgICAgIFRhZ3M6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBLZXk6ICdOYW1lJyxcbiAgICAgICAgICAgIFZhbHVlOiAnRGVmYXVsdC9NeVZwYycsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6TGF1bmNoQ29uZmlndXJhdGlvbicsIHtcbiAgICAgICAgSW1hZ2VJZDoge1xuICAgICAgICAgIFJlZjogJ1NzbVBhcmFtZXRlclZhbHVlYXdzc2VydmljZWVjc29wdGltaXplZGFtaWFtYXpvbmxpbnV4MnJlY29tbWVuZGVkaW1hZ2VpZEM5NjU4NEI2RjAwQTQ2NEVBRDE5NTNBRkY0QjA1MTE4UGFyYW1ldGVyJyxcbiAgICAgICAgfSxcbiAgICAgICAgSW5zdGFuY2VUeXBlOiAndDIubWljcm8nLFxuICAgICAgICBJYW1JbnN0YW5jZVByb2ZpbGU6IHtcbiAgICAgICAgICBSZWY6ICdFY3NDbHVzdGVyRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXBJbnN0YW5jZVByb2ZpbGUyQ0U2MDZCMycsXG4gICAgICAgIH0sXG4gICAgICAgIFNlY3VyaXR5R3JvdXBzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdFY3NDbHVzdGVyRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXBJbnN0YW5jZVNlY3VyaXR5R3JvdXA5MTJFMTIzMScsXG4gICAgICAgICAgICAgICdHcm91cElkJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVXNlckRhdGE6IHtcbiAgICAgICAgICAnRm46OkJhc2U2NCc6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnIyEvYmluL2Jhc2hcXG5lY2hvIEVDU19DTFVTVEVSPScsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnRWNzQ2x1c3Rlcjk3MjQyQjg0JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICAgICAgICAgICAgJyA+PiAvZXRjL2Vjcy9lY3MuY29uZmlnXFxuc3VkbyBpcHRhYmxlcyAtLWluc2VydCBGT1JXQVJEIDEgLS1pbi1pbnRlcmZhY2UgZG9ja2VyKyAtLWRlc3RpbmF0aW9uIDE2OS4yNTQuMTY5LjI1NC8zMiAtLWp1bXAgRFJPUFxcbnN1ZG8gc2VydmljZSBpcHRhYmxlcyBzYXZlXFxuZWNobyBFQ1NfQVdTVlBDX0JMT0NLX0lNRFM9dHJ1ZSA+PiAvZXRjL2Vjcy9lY3MuY29uZmlnJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgICAgTWF4U2l6ZTogJzEnLFxuICAgICAgICBNaW5TaXplOiAnMScsXG4gICAgICAgIExhdW5jaENvbmZpZ3VyYXRpb25OYW1lOiB7XG4gICAgICAgICAgUmVmOiAnRWNzQ2x1c3RlckRlZmF1bHRBdXRvU2NhbGluZ0dyb3VwTGF1bmNoQ29uZmlnQjdFMzc2QzEnLFxuICAgICAgICB9LFxuICAgICAgICBUYWdzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgS2V5OiAnTmFtZScsXG4gICAgICAgICAgICBQcm9wYWdhdGVBdExhdW5jaDogdHJ1ZSxcbiAgICAgICAgICAgIFZhbHVlOiAnRGVmYXVsdC9FY3NDbHVzdGVyL0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWUENab25lSWRlbnRpZmllcjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ015VnBjUHJpdmF0ZVN1Ym5ldDFTdWJuZXQ1MDU3Q0Y3RScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdNeVZwY1ByaXZhdGVTdWJuZXQyU3VibmV0MDA0MEM5ODMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJywge1xuICAgICAgICBHcm91cERlc2NyaXB0aW9uOiAnRGVmYXVsdC9FY3NDbHVzdGVyL0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwL0luc3RhbmNlU2VjdXJpdHlHcm91cCcsXG4gICAgICAgIFNlY3VyaXR5R3JvdXBFZ3Jlc3M6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBDaWRySXA6ICcwLjAuMC4wLzAnLFxuICAgICAgICAgICAgRGVzY3JpcHRpb246ICdBbGxvdyBhbGwgb3V0Ym91bmQgdHJhZmZpYyBieSBkZWZhdWx0JyxcbiAgICAgICAgICAgIElwUHJvdG9jb2w6ICctMScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVGFnczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEtleTogJ05hbWUnLFxuICAgICAgICAgICAgVmFsdWU6ICdEZWZhdWx0L0Vjc0NsdXN0ZXIvRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZwY0lkOiB7XG4gICAgICAgICAgUmVmOiAnTXlWcGNGOUYwQ0E2RicsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICAgIFNlcnZpY2U6ICdlYzIuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAnZWNzOkRlcmVnaXN0ZXJDb250YWluZXJJbnN0YW5jZScsXG4gICAgICAgICAgICAgICAgJ2VjczpSZWdpc3RlckNvbnRhaW5lckluc3RhbmNlJyxcbiAgICAgICAgICAgICAgICAnZWNzOlN1Ym1pdConLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnRWNzQ2x1c3Rlcjk3MjQyQjg0JyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAnZWNzOlBvbGwnLFxuICAgICAgICAgICAgICAgICdlY3M6U3RhcnRUZWxlbWV0cnlTZXNzaW9uJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgICAgICBBcm5FcXVhbHM6IHtcbiAgICAgICAgICAgICAgICAgICdlY3M6Y2x1c3Rlcic6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcsXG4gICAgICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAnZWNzOkRpc2NvdmVyUG9sbEVuZHBvaW50JyxcbiAgICAgICAgICAgICAgICAnZWNyOkdldEF1dGhvcml6YXRpb25Ub2tlbicsXG4gICAgICAgICAgICAgICAgJ2xvZ3M6Q3JlYXRlTG9nU3RyZWFtJyxcbiAgICAgICAgICAgICAgICAnbG9nczpQdXRMb2dFdmVudHMnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnYWxsb3dzIHNwZWNpZnlpbmcgaW5zdGFuY2UgdHlwZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnbTMubGFyZ2UnKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6TGF1bmNoQ29uZmlndXJhdGlvbicsIHtcbiAgICAgIEluc3RhbmNlVHlwZTogJ20zLmxhcmdlJyxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdhbGxvd3Mgc3BlY2lmeWluZyBjbHVzdGVyIHNpemUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgICBkZXNpcmVkQ2FwYWNpdHk6IDMsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICBNYXhTaXplOiAnMycsXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnY29uZmlndXJlcyB1c2VyZGF0YSB3aXRoIHBvd2Vyc2hlbGwgaWYgd2luZG93cyBtYWNoaW5lIGltYWdlIGlzIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ1dpbmRvd3NBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjcy5FY3NPcHRpbWl6ZWRBbWkoe1xuICAgICAgICB3aW5kb3dzVmVyc2lvbjogZWNzLldpbmRvd3NPcHRpbWl6ZWRWZXJzaW9uLlNFUlZFUl8yMDE5LFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkxhdW5jaENvbmZpZ3VyYXRpb24nLCB7XG4gICAgICBJbWFnZUlkOiB7XG4gICAgICAgIFJlZjogJ1NzbVBhcmFtZXRlclZhbHVlYXdzc2VydmljZWVjc29wdGltaXplZGFtaXdpbmRvd3NzZXJ2ZXIyMDE5ZW5nbGlzaGZ1bGxyZWNvbW1lbmRlZGltYWdlaWRDOTY1ODRCNkYwMEE0NjRFQUQxOTUzQUZGNEIwNTExOFBhcmFtZXRlcicsXG4gICAgICB9LFxuICAgICAgSW5zdGFuY2VUeXBlOiAndDIubWljcm8nLFxuICAgICAgSWFtSW5zdGFuY2VQcm9maWxlOiB7XG4gICAgICAgIFJlZjogJ0Vjc0NsdXN0ZXJXaW5kb3dzQXV0b1NjYWxpbmdHcm91cEluc3RhbmNlUHJvZmlsZTY1REZBNkJCJyxcbiAgICAgIH0sXG4gICAgICBTZWN1cml0eUdyb3VwczogW1xuICAgICAgICB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnRWNzQ2x1c3RlcldpbmRvd3NBdXRvU2NhbGluZ0dyb3VwSW5zdGFuY2VTZWN1cml0eUdyb3VwREE0NjhERjEnLFxuICAgICAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgVXNlckRhdGE6IHtcbiAgICAgICAgJ0ZuOjpCYXNlNjQnOiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICc8cG93ZXJzaGVsbD5SZW1vdmUtSXRlbSAtUmVjdXJzZSBDOlxcXFxQcm9ncmFtRGF0YVxcXFxBbWF6b25cXFxcRUNTXFxcXENhY2hlXFxuSW1wb3J0LU1vZHVsZSBFQ1NUb29sc1xcbltFbnZpcm9ubWVudF06OlNldEVudmlyb25tZW50VmFyaWFibGUoXCJFQ1NfQ0xVU1RFUlwiLCBcIicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdFY3NDbHVzdGVyOTcyNDJCODQnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIlxcXCIsIFxcXCJNYWNoaW5lXFxcIilcXG5bRW52aXJvbm1lbnRdOjpTZXRFbnZpcm9ubWVudFZhcmlhYmxlKFxcXCJFQ1NfRU5BQkxFX0FXU0xPR1NfRVhFQ1VUSU9OUk9MRV9PVkVSUklERVxcXCIsIFxcXCJ0cnVlXFxcIiwgXFxcIk1hY2hpbmVcXFwiKVxcbltFbnZpcm9ubWVudF06OlNldEVudmlyb25tZW50VmFyaWFibGUoXFxcIkVDU19BVkFJTEFCTEVfTE9HR0lOR19EUklWRVJTXFxcIiwgJ1tcXFwianNvbi1maWxlXFxcIixcXFwiYXdzbG9nc1xcXCJdJywgXFxcIk1hY2hpbmVcXFwiKVxcbltFbnZpcm9ubWVudF06OlNldEVudmlyb25tZW50VmFyaWFibGUoXFxcIkVDU19FTkFCTEVfVEFTS19JQU1fUk9MRVxcXCIsIFxcXCJ0cnVlXFxcIiwgXFxcIk1hY2hpbmVcXFwiKVxcbkluaXRpYWxpemUtRUNTQWdlbnQgLUNsdXN0ZXIgJ1wiLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnRWNzQ2x1c3Rlcjk3MjQyQjg0JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCInIC1FbmFibGVUYXNrSUFNUm9sZTwvcG93ZXJzaGVsbD5cIixcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICAvKlxuICAgKiBUT0RPOnYyLjAuMCBCRUdJTk5JTkcgT0YgT0JTT0xFVEUgQkxPQ0tcbiAgICovXG4gIHRlc3REZXByZWNhdGVkKCdhbGxvd3Mgc3BlY2lmeWluZyBzcGVjaWFsIEhXIEFNSSBUeXBlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnR3B1QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlY3MuRWNzT3B0aW1pemVkQW1pKHtcbiAgICAgICAgaGFyZHdhcmVUeXBlOiBlY3MuQW1pSGFyZHdhcmVUeXBlLkdQVSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3QgdGVtcGxhdGUgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpMYXVuY2hDb25maWd1cmF0aW9uJywge1xuICAgICAgSW1hZ2VJZDoge1xuICAgICAgICBSZWY6ICdTc21QYXJhbWV0ZXJWYWx1ZWF3c3NlcnZpY2VlY3NvcHRpbWl6ZWRhbWlhbWF6b25saW51eDJncHVyZWNvbW1lbmRlZGltYWdlaWRDOTY1ODRCNkYwMEE0NjRFQUQxOTUzQUZGNEIwNTExOFBhcmFtZXRlcicsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHRlbXBsYXRlLlBhcmFtZXRlcnMpLnRvRXF1YWwoe1xuICAgICAgU3NtUGFyYW1ldGVyVmFsdWVhd3NzZXJ2aWNlZWNzb3B0aW1pemVkYW1pYW1hem9ubGludXgyZ3B1cmVjb21tZW5kZWRpbWFnZWlkQzk2NTg0QjZGMDBBNDY0RUFEMTk1M0FGRjRCMDUxMThQYXJhbWV0ZXI6IHtcbiAgICAgICAgVHlwZTogJ0FXUzo6U1NNOjpQYXJhbWV0ZXI6OlZhbHVlPEFXUzo6RUMyOjpJbWFnZTo6SWQ+JyxcbiAgICAgICAgRGVmYXVsdDogJy9hd3Mvc2VydmljZS9lY3Mvb3B0aW1pemVkLWFtaS9hbWF6b24tbGludXgtMi9ncHUvcmVjb21tZW5kZWQvaW1hZ2VfaWQnLFxuICAgICAgfSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdlcnJvcnMgaWYgYW1hem9uIGxpbnV4IGdpdmVuIHdpdGggc3BlY2lhbCBIVyB0eXBlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0dwdUF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjcy5FY3NPcHRpbWl6ZWRBbWkoe1xuICAgICAgICAgIGdlbmVyYXRpb246IGVjMi5BbWF6b25MaW51eEdlbmVyYXRpb24uQU1BWk9OX0xJTlVYLFxuICAgICAgICAgIGhhcmR3YXJlVHlwZTogZWNzLkFtaUhhcmR3YXJlVHlwZS5HUFUsXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvQW1hem9uIExpbnV4IGRvZXMgbm90IHN1cHBvcnQgc3BlY2lhbCBoYXJkd2FyZSB0eXBlLyk7XG5cblxuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnYWxsb3dzIHNwZWNpZnlpbmcgd2luZG93cyBpbWFnZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAndGVzdCcpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ1dpbmRvd3NBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjcy5FY3NPcHRpbWl6ZWRBbWkoe1xuICAgICAgICB3aW5kb3dzVmVyc2lvbjogZWNzLldpbmRvd3NPcHRpbWl6ZWRWZXJzaW9uLlNFUlZFUl8yMDE5LFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgZXhwZWN0KHRlbXBsYXRlLlBhcmFtZXRlcnMpLnRvRXF1YWwoe1xuICAgICAgU3NtUGFyYW1ldGVyVmFsdWVhd3NzZXJ2aWNlZWNzb3B0aW1pemVkYW1pd2luZG93c3NlcnZlcjIwMTllbmdsaXNoZnVsbHJlY29tbWVuZGVkaW1hZ2VpZEM5NjU4NEI2RjAwQTQ2NEVBRDE5NTNBRkY0QjA1MTE4UGFyYW1ldGVyOiB7XG4gICAgICAgIFR5cGU6ICdBV1M6OlNTTTo6UGFyYW1ldGVyOjpWYWx1ZTxBV1M6OkVDMjo6SW1hZ2U6OklkPicsXG4gICAgICAgIERlZmF1bHQ6ICcvYXdzL3NlcnZpY2UvZWNzL29wdGltaXplZC1hbWkvd2luZG93c19zZXJ2ZXIvMjAxOS9lbmdsaXNoL2Z1bGwvcmVjb21tZW5kZWQvaW1hZ2VfaWQnLFxuICAgICAgfSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdlcnJvcnMgaWYgd2luZG93cyBnaXZlbiB3aXRoIHNwZWNpYWwgSFcgdHlwZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdXaW5kb3dzR3B1QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSxcbiAgICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWNzLkVjc09wdGltaXplZEFtaSh7XG4gICAgICAgICAgd2luZG93c1ZlcnNpb246IGVjcy5XaW5kb3dzT3B0aW1pemVkVmVyc2lvbi5TRVJWRVJfMjAxOSxcbiAgICAgICAgICBoYXJkd2FyZVR5cGU6IGVjcy5BbWlIYXJkd2FyZVR5cGUuR1BVLFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL1dpbmRvd3MgU2VydmVyIGRvZXMgbm90IHN1cHBvcnQgc3BlY2lhbCBoYXJkd2FyZSB0eXBlLyk7XG5cblxuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnZXJyb3JzIGlmIHdpbmRvd3NWZXJzaW9uIGFuZCBsaW51eCBnZW5lcmF0aW9uIGFyZSBzZXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnV2luZG93c1NjYWxpbmdHcm91cCcsIHtcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSxcbiAgICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWNzLkVjc09wdGltaXplZEFtaSh7XG4gICAgICAgICAgd2luZG93c1ZlcnNpb246IGVjcy5XaW5kb3dzT3B0aW1pemVkVmVyc2lvbi5TRVJWRVJfMjAxOSxcbiAgICAgICAgICBnZW5lcmF0aW9uOiBlYzIuQW1hem9uTGludXhHZW5lcmF0aW9uLkFNQVpPTl9MSU5VWCxcbiAgICAgICAgfSksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9cIndpbmRvd3NWZXJzaW9uXCIgYW5kIExpbnV4IGltYWdlIFwiZ2VuZXJhdGlvblwiIGNhbm5vdCBiZSBib3RoIHNldC8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2FsbG93cyByZXR1cm5pbmcgdGhlIGNvcnJlY3QgaW1hZ2UgZm9yIHdpbmRvd3MgZm9yIEVjc09wdGltaXplZEFtaScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFtaSA9IG5ldyBlY3MuRWNzT3B0aW1pemVkQW1pKHtcbiAgICAgIHdpbmRvd3NWZXJzaW9uOiBlY3MuV2luZG93c09wdGltaXplZFZlcnNpb24uU0VSVkVSXzIwMTksXG4gICAgfSk7XG5cbiAgICBleHBlY3QoYW1pLmdldEltYWdlKHN0YWNrKS5vc1R5cGUpLnRvRXF1YWwoZWMyLk9wZXJhdGluZ1N5c3RlbVR5cGUuV0lORE9XUyk7XG5cblxuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnYWxsb3dzIHJldHVybmluZyB0aGUgY29ycmVjdCBpbWFnZSBmb3IgbGludXggZm9yIEVjc09wdGltaXplZEFtaScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFtaSA9IG5ldyBlY3MuRWNzT3B0aW1pemVkQW1pKHtcbiAgICAgIGdlbmVyYXRpb246IGVjMi5BbWF6b25MaW51eEdlbmVyYXRpb24uQU1BWk9OX0xJTlVYLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KGFtaS5nZXRJbWFnZShzdGFjaykub3NUeXBlKS50b0VxdWFsKGVjMi5PcGVyYXRpbmdTeXN0ZW1UeXBlLkxJTlVYKTtcblxuXG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdhbGxvd3MgcmV0dXJuaW5nIHRoZSBjb3JyZWN0IGltYWdlIGZvciBsaW51eCAyIGZvciBFY3NPcHRpbWl6ZWRBbWknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhbWkgPSBuZXcgZWNzLkVjc09wdGltaXplZEFtaSh7XG4gICAgICBnZW5lcmF0aW9uOiBlYzIuQW1hem9uTGludXhHZW5lcmF0aW9uLkFNQVpPTl9MSU5VWF8yLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KGFtaS5nZXRJbWFnZShzdGFjaykub3NUeXBlKS50b0VxdWFsKGVjMi5PcGVyYXRpbmdTeXN0ZW1UeXBlLkxJTlVYKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2FsbG93cyByZXR1cm5pbmcgdGhlIGNvcnJlY3QgaW1hZ2UgZm9yIGxpbnV4IGZvciBFY3NPcHRpbWl6ZWRJbWFnZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgZXhwZWN0KGVjcy5FY3NPcHRpbWl6ZWRJbWFnZS5hbWF6b25MaW51eCgpLmdldEltYWdlKHN0YWNrKS5vc1R5cGUpLnRvRXF1YWwoXG4gICAgICBlYzIuT3BlcmF0aW5nU3lzdGVtVHlwZS5MSU5VWCk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdhbGxvd3MgcmV0dXJuaW5nIHRoZSBjb3JyZWN0IGltYWdlIGZvciBsaW51eCAyIGZvciBFY3NPcHRpbWl6ZWRJbWFnZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgZXhwZWN0KGVjcy5FY3NPcHRpbWl6ZWRJbWFnZS5hbWF6b25MaW51eDIoKS5nZXRJbWFnZShzdGFjaykub3NUeXBlKS50b0VxdWFsKFxuICAgICAgZWMyLk9wZXJhdGluZ1N5c3RlbVR5cGUuTElOVVgpO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnYWxsb3dzIHJldHVybmluZyB0aGUgY29ycmVjdCBpbWFnZSBmb3IgbGludXggMiBmb3IgRWNzT3B0aW1pemVkSW1hZ2Ugd2l0aCBBUk0gaGFyZHdhcmUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGV4cGVjdChlY3MuRWNzT3B0aW1pemVkSW1hZ2UuYW1hem9uTGludXgyKGVjcy5BbWlIYXJkd2FyZVR5cGUuQVJNKS5nZXRJbWFnZShzdGFjaykub3NUeXBlKS50b0VxdWFsKFxuICAgICAgZWMyLk9wZXJhdGluZ1N5c3RlbVR5cGUuTElOVVgpO1xuXG5cbiAgfSk7XG5cblxuICB0ZXN0KCdhbGxvd3MgcmV0dXJuaW5nIHRoZSBjb3JyZWN0IGltYWdlIGZvciB3aW5kb3dzIGZvciBFY3NPcHRpbWl6ZWRJbWFnZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgZXhwZWN0KGVjcy5FY3NPcHRpbWl6ZWRJbWFnZS53aW5kb3dzKGVjcy5XaW5kb3dzT3B0aW1pemVkVmVyc2lvbi5TRVJWRVJfMjAxOSkuZ2V0SW1hZ2Uoc3RhY2spLm9zVHlwZSkudG9FcXVhbChcbiAgICAgIGVjMi5PcGVyYXRpbmdTeXN0ZW1UeXBlLldJTkRPV1MpO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnYWxsb3dzIHNldHRpbmcgY2x1c3RlciBTZXJ2aWNlQ29ubmVjdERlZmF1bHRzLk5hbWVzcGFjZSBwcm9wZXJ0eSB3aGVuIHVzZUFzU2VydmljZUNvbm5lY3REZWZhdWx0IGlzIHRydWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7XG4gICAgICBuYW1lOiAnZm9vLmNvbScsXG4gICAgICB1c2VGb3JTZXJ2aWNlQ29ubmVjdDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKGNsdXN0ZXIgYXMgYW55KS5fY2ZuQ2x1c3Rlci5zZXJ2aWNlQ29ubmVjdERlZmF1bHRzLm5hbWVzcGFjZSkudG9CZSgnZm9vLmNvbScpO1xuICB9KTtcblxuICB0ZXN0KCdhbGxvd3Mgc2V0dGluZyBjbHVzdGVyIF9kZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2UgZm9yIEhUVFAgbmFtZXNwYWNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBuYW1lc3BhY2UgPSBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7XG4gICAgICBuYW1lOiAnZm9vJyxcbiAgICAgIHR5cGU6IGNsb3VkbWFwLk5hbWVzcGFjZVR5cGUuSFRUUCxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KG5hbWVzcGFjZS5uYW1lc3BhY2VOYW1lKS50b0JlKCdmb28nKTtcbiAgfSk7XG5cbiAgLypcbiAgICogVE9ETzp2Mi4wLjAgRU5EIE9GIE9CU09MRVRFIEJMT0NLXG4gICAqL1xuXG4gIHRlc3REZXByZWNhdGVkKCdhbGxvd3Mgc3BlY2lmeWluZyBzcGVjaWFsIEhXIEFNSSBUeXBlIHYyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnR3B1QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IGVjcy5FY3NPcHRpbWl6ZWRJbWFnZS5hbWF6b25MaW51eDIoZWNzLkFtaUhhcmR3YXJlVHlwZS5HUFUpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3QgdGVtcGxhdGUgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpMYXVuY2hDb25maWd1cmF0aW9uJywge1xuICAgICAgSW1hZ2VJZDoge1xuICAgICAgICBSZWY6ICdTc21QYXJhbWV0ZXJWYWx1ZWF3c3NlcnZpY2VlY3NvcHRpbWl6ZWRhbWlhbWF6b25saW51eDJncHVyZWNvbW1lbmRlZGltYWdlaWRDOTY1ODRCNkYwMEE0NjRFQUQxOTUzQUZGNEIwNTExOFBhcmFtZXRlcicsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHRlbXBsYXRlLlBhcmFtZXRlcnMpLnRvRXF1YWwoe1xuICAgICAgU3NtUGFyYW1ldGVyVmFsdWVhd3NzZXJ2aWNlZWNzb3B0aW1pemVkYW1pYW1hem9ubGludXgyZ3B1cmVjb21tZW5kZWRpbWFnZWlkQzk2NTg0QjZGMDBBNDY0RUFEMTk1M0FGRjRCMDUxMThQYXJhbWV0ZXI6IHtcbiAgICAgICAgVHlwZTogJ0FXUzo6U1NNOjpQYXJhbWV0ZXI6OlZhbHVlPEFXUzo6RUMyOjpJbWFnZTo6SWQ+JyxcbiAgICAgICAgRGVmYXVsdDogJy9hd3Mvc2VydmljZS9lY3Mvb3B0aW1pemVkLWFtaS9hbWF6b24tbGludXgtMi9ncHUvcmVjb21tZW5kZWQvaW1hZ2VfaWQnLFxuICAgICAgfSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdhbGxvd3Mgc3BlY2lmeWluZyBBbWF6b24gTGludXggdjEgQU1JJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnR3B1QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IGVjcy5FY3NPcHRpbWl6ZWRJbWFnZS5hbWF6b25MaW51eCgpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3QgdGVtcGxhdGUgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpMYXVuY2hDb25maWd1cmF0aW9uJywge1xuICAgICAgSW1hZ2VJZDoge1xuICAgICAgICBSZWY6ICdTc21QYXJhbWV0ZXJWYWx1ZWF3c3NlcnZpY2VlY3NvcHRpbWl6ZWRhbWlhbWF6b25saW51eHJlY29tbWVuZGVkaW1hZ2VpZEM5NjU4NEI2RjAwQTQ2NEVBRDE5NTNBRkY0QjA1MTE4UGFyYW1ldGVyJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QodGVtcGxhdGUuUGFyYW1ldGVycykudG9FcXVhbCh7XG4gICAgICBTc21QYXJhbWV0ZXJWYWx1ZWF3c3NlcnZpY2VlY3NvcHRpbWl6ZWRhbWlhbWF6b25saW51eHJlY29tbWVuZGVkaW1hZ2VpZEM5NjU4NEI2RjAwQTQ2NEVBRDE5NTNBRkY0QjA1MTE4UGFyYW1ldGVyOiB7XG4gICAgICAgIFR5cGU6ICdBV1M6OlNTTTo6UGFyYW1ldGVyOjpWYWx1ZTxBV1M6OkVDMjo6SW1hZ2U6OklkPicsXG4gICAgICAgIERlZmF1bHQ6ICcvYXdzL3NlcnZpY2UvZWNzL29wdGltaXplZC1hbWkvYW1hem9uLWxpbnV4L3JlY29tbWVuZGVkL2ltYWdlX2lkJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnYWxsb3dzIHNwZWNpZnlpbmcgd2luZG93cyBpbWFnZSB2MicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAndGVzdCcpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ1dpbmRvd3NBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogZWNzLkVjc09wdGltaXplZEltYWdlLndpbmRvd3MoZWNzLldpbmRvd3NPcHRpbWl6ZWRWZXJzaW9uLlNFUlZFUl8yMDE5KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IHRlbXBsYXRlID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICBleHBlY3QodGVtcGxhdGUuUGFyYW1ldGVycykudG9FcXVhbCh7XG4gICAgICBTc21QYXJhbWV0ZXJWYWx1ZWF3c3NlcnZpY2VlY3NvcHRpbWl6ZWRhbWl3aW5kb3dzc2VydmVyMjAxOWVuZ2xpc2hmdWxscmVjb21tZW5kZWRpbWFnZWlkQzk2NTg0QjZGMDBBNDY0RUFEMTk1M0FGRjRCMDUxMThQYXJhbWV0ZXI6IHtcbiAgICAgICAgVHlwZTogJ0FXUzo6U1NNOjpQYXJhbWV0ZXI6OlZhbHVlPEFXUzo6RUMyOjpJbWFnZTo6SWQ+JyxcbiAgICAgICAgRGVmYXVsdDogJy9hd3Mvc2VydmljZS9lY3Mvb3B0aW1pemVkLWFtaS93aW5kb3dzX3NlcnZlci8yMDE5L2VuZ2xpc2gvZnVsbC9yZWNvbW1lbmRlZC9pbWFnZV9pZCcsXG4gICAgICB9LFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2FsbG93cyBzcGVjaWZ5aW5nIHNwb3QgZmxlZXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgICBzcG90UHJpY2U6ICcwLjMxJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6TGF1bmNoQ29uZmlndXJhdGlvbicsIHtcbiAgICAgIFNwb3RQcmljZTogJzAuMzEnLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2FsbG93cyBzcGVjaWZ5aW5nIGRyYWluIHRpbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgICB0YXNrRHJhaW5UaW1lOiBjZGsuRHVyYXRpb24ubWludXRlcygxKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6TGlmZWN5Y2xlSG9vaycsIHtcbiAgICAgIEhlYXJ0YmVhdFRpbWVvdXQ6IDYwLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2FsbG93cyBzcGVjaWZ5aW5nIGF1dG9tYXRlZCBzcG90IGRyYWluaW5nJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdjNS54bGFyZ2UnKSxcbiAgICAgIHNwb3RQcmljZTogJzAuMDczNScsXG4gICAgICBzcG90SW5zdGFuY2VEcmFpbmluZzogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6TGF1bmNoQ29uZmlndXJhdGlvbicsIHtcbiAgICAgIFVzZXJEYXRhOiB7XG4gICAgICAgICdGbjo6QmFzZTY0Jzoge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnIyEvYmluL2Jhc2hcXG5lY2hvIEVDU19DTFVTVEVSPScsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdFY3NDbHVzdGVyOTcyNDJCODQnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnID4+IC9ldGMvZWNzL2Vjcy5jb25maWdcXG5zdWRvIGlwdGFibGVzIC0taW5zZXJ0IEZPUldBUkQgMSAtLWluLWludGVyZmFjZSBkb2NrZXIrIC0tZGVzdGluYXRpb24gMTY5LjI1NC4xNjkuMjU0LzMyIC0tanVtcCBEUk9QXFxuc3VkbyBzZXJ2aWNlIGlwdGFibGVzIHNhdmVcXG5lY2hvIEVDU19BV1NWUENfQkxPQ0tfSU1EUz10cnVlID4+IC9ldGMvZWNzL2Vjcy5jb25maWdcXG5lY2hvIEVDU19FTkFCTEVfU1BPVF9JTlNUQU5DRV9EUkFJTklORz10cnVlID4+IC9ldGMvZWNzL2Vjcy5jb25maWcnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdhbGxvd3MgY29udGFpbmVycyBhY2Nlc3MgdG8gaW5zdGFuY2UgbWV0YWRhdGEgc2VydmljZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSxcbiAgICAgIGNhbkNvbnRhaW5lcnNBY2Nlc3NJbnN0YW5jZVJvbGU6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkxhdW5jaENvbmZpZ3VyYXRpb24nLCB7XG4gICAgICBVc2VyRGF0YToge1xuICAgICAgICAnRm46OkJhc2U2NCc6IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgJyMhL2Jpbi9iYXNoXFxuZWNobyBFQ1NfQ0xVU1RFUj0nLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnRWNzQ2x1c3Rlcjk3MjQyQjg0JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJyA+PiAvZXRjL2Vjcy9lY3MuY29uZmlnJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnYWxsb3dzIGFkZGluZyBkZWZhdWx0IHNlcnZpY2UgZGlzY292ZXJ5IG5hbWVzcGFjZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7XG4gICAgICBuYW1lOiAnZm9vLmNvbScsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VydmljZURpc2NvdmVyeTo6UHJpdmF0ZURuc05hbWVzcGFjZScsIHtcbiAgICAgIE5hbWU6ICdmb28uY29tJyxcbiAgICAgIFZwYzoge1xuICAgICAgICBSZWY6ICdNeVZwY0Y5RjBDQTZGJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnYWxsb3dzIGFkZGluZyBwdWJsaWMgc2VydmljZSBkaXNjb3ZlcnkgbmFtZXNwYWNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNsdXN0ZXIuYWRkRGVmYXVsdENsb3VkTWFwTmFtZXNwYWNlKHtcbiAgICAgIG5hbWU6ICdmb28uY29tJyxcbiAgICAgIHR5cGU6IGNsb3VkbWFwLk5hbWVzcGFjZVR5cGUuRE5TX1BVQkxJQyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTZXJ2aWNlRGlzY292ZXJ5OjpQdWJsaWNEbnNOYW1lc3BhY2UnLCB7XG4gICAgICBOYW1lOiAnZm9vLmNvbScsXG4gICAgfSk7XG5cbiAgICBleHBlY3QoY2x1c3Rlci5kZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2UhLnR5cGUpLnRvRXF1YWwoY2xvdWRtYXAuTmFtZXNwYWNlVHlwZS5ETlNfUFVCTElDKTtcblxuXG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCd0aHJvd3MgaWYgZGVmYXVsdCBzZXJ2aWNlIGRpc2NvdmVyeSBuYW1lc3BhY2UgYWRkZWQgbW9yZSB0aGFuIG9uY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2x1c3Rlci5hZGREZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2Uoe1xuICAgICAgbmFtZTogJ2Zvby5jb20nLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7XG4gICAgICAgIG5hbWU6ICdmb28uY29tJyxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0NhbiBvbmx5IGFkZCBkZWZhdWx0IG5hbWVzcGFjZSBvbmNlLi8pO1xuXG5cbiAgfSk7XG5cblxuICB0ZXN0KCdleHBvcnQvaW1wb3J0IG9mIGEgY2x1c3RlciB3aXRoIGEgbmFtZXNwYWNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYzEgPSBuZXcgZWMyLlZwYyhzdGFjazEsICdWcGMnKTtcbiAgICBjb25zdCBjbHVzdGVyMSA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjazEsICdDbHVzdGVyJywgeyB2cGM6IHZwYzEgfSk7XG4gICAgY2x1c3RlcjEuYWRkRGVmYXVsdENsb3VkTWFwTmFtZXNwYWNlKHtcbiAgICAgIG5hbWU6ICdoZWxsby5jb20nLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc3RhY2syID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsdXN0ZXIyID0gZWNzLkNsdXN0ZXIuZnJvbUNsdXN0ZXJBdHRyaWJ1dGVzKHN0YWNrMiwgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGM6IHZwYzEsXG4gICAgICBzZWN1cml0eUdyb3VwczogY2x1c3RlcjEuY29ubmVjdGlvbnMuc2VjdXJpdHlHcm91cHMsXG4gICAgICBkZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2U6IGNsb3VkbWFwLlByaXZhdGVEbnNOYW1lc3BhY2UuZnJvbVByaXZhdGVEbnNOYW1lc3BhY2VBdHRyaWJ1dGVzKHN0YWNrMiwgJ25zJywge1xuICAgICAgICBuYW1lc3BhY2VJZDogJ2ltcG9ydC1uYW1lc3BhY2UtaWQnLFxuICAgICAgICBuYW1lc3BhY2VBcm46ICdpbXBvcnQtbmFtZXNwYWNlLWFybicsXG4gICAgICAgIG5hbWVzcGFjZU5hbWU6ICdpbXBvcnQtbmFtZXNwYWNlLW5hbWUnLFxuICAgICAgfSksXG4gICAgICBjbHVzdGVyTmFtZTogJ2NsdXN0ZXItbmFtZScsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGNsdXN0ZXIyLmRlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSEudHlwZSkudG9FcXVhbChjbG91ZG1hcC5OYW1lc3BhY2VUeXBlLkROU19QUklWQVRFKTtcbiAgICBleHBlY3Qoc3RhY2syLnJlc29sdmUoY2x1c3RlcjIuZGVmYXVsdENsb3VkTWFwTmFtZXNwYWNlIS5uYW1lc3BhY2VJZCkpLnRvRXF1YWwoJ2ltcG9ydC1uYW1lc3BhY2UtaWQnKTtcblxuICAgIC8vIENhbiByZXRyaWV2ZSBzdWJuZXRzIGZyb20gVlBDIC0gd2lsbCB0aHJvdyAnVGhlcmUgYXJlIG5vICdQcml2YXRlJyBzdWJuZXRzIGluIHRoaXMgVlBDLiBVc2UgYSBkaWZmZXJlbnQgVlBDIHN1Ym5ldCBzZWxlY3Rpb24uJyBpZiBicm9rZW4uXG4gICAgY2x1c3RlcjIudnBjLnNlbGVjdFN1Ym5ldHMoKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2ltcG9ydGVkIGNsdXN0ZXIgd2l0aCBpbXBvcnRlZCBzZWN1cml0eSBncm91cHMgaG9ub3JzIGFsbG93QWxsT3V0Ym91bmQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycpO1xuXG4gICAgY29uc3QgaW1wb3J0ZWRTZzEgPSBlYzIuU2VjdXJpdHlHcm91cC5mcm9tU2VjdXJpdHlHcm91cElkKHN0YWNrLCAnU0cxJywgJ3NnLTEnLCB7IGFsbG93QWxsT3V0Ym91bmQ6IGZhbHNlIH0pO1xuICAgIGNvbnN0IGltcG9ydGVkU2cyID0gZWMyLlNlY3VyaXR5R3JvdXAuZnJvbVNlY3VyaXR5R3JvdXBJZChzdGFjaywgJ1NHMicsICdzZy0yJyk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gZWNzLkNsdXN0ZXIuZnJvbUNsdXN0ZXJBdHRyaWJ1dGVzKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgIGNsdXN0ZXJOYW1lOiAnY2x1c3Rlci1uYW1lJyxcbiAgICAgIHNlY3VyaXR5R3JvdXBzOiBbaW1wb3J0ZWRTZzEsIGltcG9ydGVkU2cyXSxcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmNvbm5lY3Rpb25zLmFsbG93VG9BbnlJcHY0KGVjMi5Qb3J0LnRjcCg0NDMpKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBFZ3Jlc3MnLCB7XG4gICAgICBHcm91cElkOiAnc2ctMScsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBFZ3Jlc3MnLCAxKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ01ldHJpYycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGNsdXN0ZXIubWV0cmljQ3B1UmVzZXJ2YXRpb24oKSkpLnRvRXF1YWwoe1xuICAgICAgZGltZW5zaW9uczoge1xuICAgICAgICBDbHVzdGVyTmFtZTogeyBSZWY6ICdFY3NDbHVzdGVyOTcyNDJCODQnIH0sXG4gICAgICB9LFxuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VDUycsXG4gICAgICBtZXRyaWNOYW1lOiAnQ1BVUmVzZXJ2YXRpb24nLFxuICAgICAgcGVyaW9kOiBjZGsuRHVyYXRpb24ubWludXRlcyg1KSxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoY2x1c3Rlci5tZXRyaWNNZW1vcnlSZXNlcnZhdGlvbigpKSkudG9FcXVhbCh7XG4gICAgICBkaW1lbnNpb25zOiB7XG4gICAgICAgIENsdXN0ZXJOYW1lOiB7IFJlZjogJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcgfSxcbiAgICAgIH0sXG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUNTJyxcbiAgICAgIG1ldHJpY05hbWU6ICdNZW1vcnlSZXNlcnZhdGlvbicsXG4gICAgICBwZXJpb2Q6IGNkay5EdXJhdGlvbi5taW51dGVzKDUpLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfSk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShjbHVzdGVyLm1ldHJpYygnbXlNZXRyaWMnKSkpLnRvRXF1YWwoe1xuICAgICAgZGltZW5zaW9uczoge1xuICAgICAgICBDbHVzdGVyTmFtZTogeyBSZWY6ICdFY3NDbHVzdGVyOTcyNDJCODQnIH0sXG4gICAgICB9LFxuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VDUycsXG4gICAgICBtZXRyaWNOYW1lOiAnbXlNZXRyaWMnLFxuICAgICAgcGVyaW9kOiBjZGsuRHVyYXRpb24ubWludXRlcyg1KSxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ0FTRyB3aXRoIGEgcHVibGljIFZQQyB3aXRob3V0IE5BVCBHYXRld2F5cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlQdWJsaWNWcGMnLCB7XG4gICAgICBuYXRHYXRld2F5czogMCxcbiAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgeyBjaWRyTWFzazogMjQsIG5hbWU6ICdpbmdyZXNzJywgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgICBhc3NvY2lhdGVQdWJsaWNJcEFkZHJlc3M6IHRydWUsXG4gICAgICB2cGNTdWJuZXRzOiB7XG4gICAgICAgIG9uZVBlckF6OiB0cnVlLFxuICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUNTOjpDbHVzdGVyJywgMSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQQycsIHtcbiAgICAgIENpZHJCbG9jazogJzEwLjAuMC4wLzE2JyxcbiAgICAgIEVuYWJsZURuc0hvc3RuYW1lczogdHJ1ZSxcbiAgICAgIEVuYWJsZURuc1N1cHBvcnQ6IHRydWUsXG4gICAgICBJbnN0YW5jZVRlbmFuY3k6IGVjMi5EZWZhdWx0SW5zdGFuY2VUZW5hbmN5LkRFRkFVTFQsXG4gICAgICBUYWdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBLZXk6ICdOYW1lJyxcbiAgICAgICAgICBWYWx1ZTogJ0RlZmF1bHQvTXlQdWJsaWNWcGMnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpMYXVuY2hDb25maWd1cmF0aW9uJywge1xuICAgICAgSW1hZ2VJZDoge1xuICAgICAgICBSZWY6ICdTc21QYXJhbWV0ZXJWYWx1ZWF3c3NlcnZpY2VlY3NvcHRpbWl6ZWRhbWlhbWF6b25saW51eDJyZWNvbW1lbmRlZGltYWdlaWRDOTY1ODRCNkYwMEE0NjRFQUQxOTUzQUZGNEIwNTExOFBhcmFtZXRlcicsXG4gICAgICB9LFxuICAgICAgSW5zdGFuY2VUeXBlOiAndDIubWljcm8nLFxuICAgICAgQXNzb2NpYXRlUHVibGljSXBBZGRyZXNzOiB0cnVlLFxuICAgICAgSWFtSW5zdGFuY2VQcm9maWxlOiB7XG4gICAgICAgIFJlZjogJ0Vjc0NsdXN0ZXJEZWZhdWx0QXV0b1NjYWxpbmdHcm91cEluc3RhbmNlUHJvZmlsZTJDRTYwNkIzJyxcbiAgICAgIH0sXG4gICAgICBTZWN1cml0eUdyb3VwczogW1xuICAgICAgICB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnRWNzQ2x1c3RlckRlZmF1bHRBdXRvU2NhbGluZ0dyb3VwSW5zdGFuY2VTZWN1cml0eUdyb3VwOTEyRTEyMzEnLFxuICAgICAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgVXNlckRhdGE6IHtcbiAgICAgICAgJ0ZuOjpCYXNlNjQnOiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICcjIS9iaW4vYmFzaFxcbmVjaG8gRUNTX0NMVVNURVI9JyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICAgICAgICAgICcgPj4gL2V0Yy9lY3MvZWNzLmNvbmZpZ1xcbnN1ZG8gaXB0YWJsZXMgLS1pbnNlcnQgRk9SV0FSRCAxIC0taW4taW50ZXJmYWNlIGRvY2tlcisgLS1kZXN0aW5hdGlvbiAxNjkuMjU0LjE2OS4yNTQvMzIgLS1qdW1wIERST1BcXG5zdWRvIHNlcnZpY2UgaXB0YWJsZXMgc2F2ZVxcbmVjaG8gRUNTX0FXU1ZQQ19CTE9DS19JTURTPXRydWUgPj4gL2V0Yy9lY3MvZWNzLmNvbmZpZycsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICBNYXhTaXplOiAnMScsXG4gICAgICBNaW5TaXplOiAnMScsXG4gICAgICBMYXVuY2hDb25maWd1cmF0aW9uTmFtZToge1xuICAgICAgICBSZWY6ICdFY3NDbHVzdGVyRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXBMYXVuY2hDb25maWdCN0UzNzZDMScsXG4gICAgICB9LFxuICAgICAgVGFnczogW1xuICAgICAgICB7XG4gICAgICAgICAgS2V5OiAnTmFtZScsXG4gICAgICAgICAgUHJvcGFnYXRlQXRMYXVuY2g6IHRydWUsXG4gICAgICAgICAgVmFsdWU6ICdEZWZhdWx0L0Vjc0NsdXN0ZXIvRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFZQQ1pvbmVJZGVudGlmaWVyOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdNeVB1YmxpY1ZwY2luZ3Jlc3NTdWJuZXQxU3VibmV0OTE5MTA0NEMnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnTXlQdWJsaWNWcGNpbmdyZXNzU3VibmV0MlN1Ym5ldEQyRjJFMDM0JyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICBHcm91cERlc2NyaXB0aW9uOiAnRGVmYXVsdC9FY3NDbHVzdGVyL0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwL0luc3RhbmNlU2VjdXJpdHlHcm91cCcsXG4gICAgICBTZWN1cml0eUdyb3VwRWdyZXNzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBDaWRySXA6ICcwLjAuMC4wLzAnLFxuICAgICAgICAgIERlc2NyaXB0aW9uOiAnQWxsb3cgYWxsIG91dGJvdW5kIHRyYWZmaWMgYnkgZGVmYXVsdCcsXG4gICAgICAgICAgSXBQcm90b2NvbDogJy0xJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBUYWdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBLZXk6ICdOYW1lJyxcbiAgICAgICAgICBWYWx1ZTogJ0RlZmF1bHQvRWNzQ2x1c3Rlci9EZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgVnBjSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlQdWJsaWNWcGNBMkJGNkNEQScsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuXG4gIH0pO1xuXG4gIHRlc3QoJ2VuYWJsZSBjb250YWluZXIgaW5zaWdodHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG5cbiAgICBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyBjb250YWluZXJJbnNpZ2h0czogdHJ1ZSB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OkNsdXN0ZXInLCB7XG4gICAgICBDbHVzdGVyU2V0dGluZ3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIE5hbWU6ICdjb250YWluZXJJbnNpZ2h0cycsXG4gICAgICAgICAgVmFsdWU6ICdlbmFibGVkJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdkaXNhYmxlIGNvbnRhaW5lciBpbnNpZ2h0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3Rlc3QnKTtcblxuICAgIG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IGNvbnRhaW5lckluc2lnaHRzOiBmYWxzZSB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OkNsdXN0ZXInLCB7XG4gICAgICBDbHVzdGVyU2V0dGluZ3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIE5hbWU6ICdjb250YWluZXJJbnNpZ2h0cycsXG4gICAgICAgICAgVmFsdWU6ICdkaXNhYmxlZCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnZGVmYXVsdCBjb250YWluZXIgaW5zaWdodHMgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAndGVzdCcpO1xuXG4gICAgbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicpO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3Qgc3RhY2tBc3NlbWJseSA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSk7XG4gICAgY29uc3QgdGVtcGxhdGUgPSBzdGFja0Fzc2VtYmx5LnRlbXBsYXRlO1xuXG4gICAgZXhwZWN0KFxuICAgICAgdGVtcGxhdGUuUmVzb3VyY2VzLkVjc0NsdXN0ZXI5NzI0MkI4NC5Qcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgfHxcbiAgICAgIHRlbXBsYXRlLlJlc291cmNlcy5FY3NDbHVzdGVyOTcyNDJCODQuUHJvcGVydGllcy5DbHVzdGVyU2V0dGluZ3MgPT09IHVuZGVmaW5lZCxcbiAgICApLnRvRXF1YWwodHJ1ZSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdCb3R0bGVSb2NrZXRJbWFnZSgpIHJldHVybnMgY29ycmVjdCBBTUknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjcy5Cb3R0bGVSb2NrZXRJbWFnZSgpLmdldEltYWdlKHN0YWNrKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IHBhcmFtZXRlcnMgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlLlBhcmFtZXRlcnM7XG4gICAgZXhwZWN0KE9iamVjdC5lbnRyaWVzKHBhcmFtZXRlcnMpLnNvbWUoXG4gICAgICAoW2ssIHZdKSA9PiBrLnN0YXJ0c1dpdGgoJ1NzbVBhcmFtZXRlclZhbHVlYXdzc2VydmljZWJvdHRsZXJvY2tldGF3c2VjcycpICYmXG4gICAgICAgICh2IGFzIGFueSkuRGVmYXVsdC5pbmNsdWRlcygnL2JvdHRsZXJvY2tldC8nKSxcbiAgICApKS50b0VxdWFsKHRydWUpO1xuICAgIGV4cGVjdChPYmplY3QuZW50cmllcyhwYXJhbWV0ZXJzKS5zb21lKFxuICAgICAgKFtrLCB2XSkgPT4gay5zdGFydHNXaXRoKCdTc21QYXJhbWV0ZXJWYWx1ZWF3c3NlcnZpY2Vib3R0bGVyb2NrZXRhd3NlY3MnKSAmJlxuICAgICAgICAodiBhcyBhbnkpLkRlZmF1bHQuaW5jbHVkZXMoJy9hd3MtZWNzLTEvJyksXG4gICAgKSkudG9FcXVhbCh0cnVlKTtcblxuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnY2x1c3RlciBjYXBhY2l0eSB3aXRoIGJvdHRsZXJvY2tldCBBTUksIGJ5IHNldHRpbmcgbWFjaGluZUltYWdlVHlwZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3Rlc3QnKTtcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJyk7XG4gICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnYm90dGxlcm9ja2V0LWFzZycsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2M1LmxhcmdlJyksXG4gICAgICBtYWNoaW5lSW1hZ2VUeXBlOiBlY3MuTWFjaGluZUltYWdlVHlwZS5CT1RUTEVST0NLRVQsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUNTOjpDbHVzdGVyJywgMSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCAxKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6TGF1bmNoQ29uZmlndXJhdGlvbicsIHtcbiAgICAgIEltYWdlSWQ6IHtcbiAgICAgICAgUmVmOiAnU3NtUGFyYW1ldGVyVmFsdWVhd3NzZXJ2aWNlYm90dGxlcm9ja2V0YXdzZWNzMXg4NjY0bGF0ZXN0aW1hZ2VpZEM5NjU4NEI2RjAwQTQ2NEVBRDE5NTNBRkY0QjA1MTE4UGFyYW1ldGVyJyxcbiAgICAgIH0sXG4gICAgICBVc2VyRGF0YToge1xuICAgICAgICAnRm46OkJhc2U2NCc6IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgJ1xcbltzZXR0aW5ncy5lY3NdXFxuY2x1c3RlciA9IFwiJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdcIicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgU2VydmljZTogJ2VjMi5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICAgIE1hbmFnZWRQb2xpY3lBcm5zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnOmlhbTo6YXdzOnBvbGljeS9BbWF6b25TU01NYW5hZ2VkSW5zdGFuY2VDb3JlJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICc6aWFtOjphd3M6cG9saWN5L3NlcnZpY2Utcm9sZS9BbWF6b25FQzJDb250YWluZXJTZXJ2aWNlZm9yRUMyUm9sZScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgVGFnczogW1xuICAgICAgICB7XG4gICAgICAgICAgS2V5OiAnTmFtZScsXG4gICAgICAgICAgVmFsdWU6ICd0ZXN0L0Vjc0NsdXN0ZXIvYm90dGxlcm9ja2V0LWFzZycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnY29ycmVjdCBib3R0bGVyb2NrZXQgQU1JIGZvciBBUk02NCBhcmNoaXRlY3R1cmUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicpO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ2JvdHRsZXJvY2tldC1hc2cnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNmcubGFyZ2UnKSxcbiAgICAgIG1hY2hpbmVJbWFnZVR5cGU6IGVjcy5NYWNoaW5lSW1hZ2VUeXBlLkJPVFRMRVJPQ0tFVCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6TGF1bmNoQ29uZmlndXJhdGlvbicsIHtcbiAgICAgIEltYWdlSWQ6IHtcbiAgICAgICAgUmVmOiAnU3NtUGFyYW1ldGVyVmFsdWVhd3NzZXJ2aWNlYm90dGxlcm9ja2V0YXdzZWNzMWFybTY0bGF0ZXN0aW1hZ2VpZEM5NjU4NEI2RjAwQTQ2NEVBRDE5NTNBRkY0QjA1MTE4UGFyYW1ldGVyJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1BhcmFtZXRlcignU3NtUGFyYW1ldGVyVmFsdWVhd3NzZXJ2aWNlYm90dGxlcm9ja2V0YXdzZWNzMWFybTY0bGF0ZXN0aW1hZ2VpZEM5NjU4NEI2RjAwQTQ2NEVBRDE5NTNBRkY0QjA1MTE4UGFyYW1ldGVyJywge1xuICAgICAgVHlwZTogJ0FXUzo6U1NNOjpQYXJhbWV0ZXI6OlZhbHVlPEFXUzo6RUMyOjpJbWFnZTo6SWQ+JyxcbiAgICAgIERlZmF1bHQ6ICcvYXdzL3NlcnZpY2UvYm90dGxlcm9ja2V0L2F3cy1lY3MtMS9hcm02NC9sYXRlc3QvaW1hZ2VfaWQnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgndGhyb3dzIHdoZW4gbWFjaGluZUltYWdlIGFuZCBtYWNoaW5lSW1hZ2VUeXBlIGJvdGggc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAndGVzdCcpO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInKTtcbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdib3R0bGVyb2NrZXQtYXNnJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzUubGFyZ2UnKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjcy5Cb3R0bGVSb2NrZXRJbWFnZSgpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpMYXVuY2hDb25maWd1cmF0aW9uJywge1xuICAgICAgVXNlckRhdGE6IHtcbiAgICAgICAgJ0ZuOjpCYXNlNjQnOiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdcXG5bc2V0dGluZ3MuZWNzXVxcbmNsdXN0ZXIgPSBcIicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdFY3NDbHVzdGVyOTcyNDJCODQnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnXCInLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgndXBkYXRlUG9saWN5IHNldCB3aGVuIHBhc3NlZCB3aXRob3V0IHVwZGF0ZVR5cGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicpO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ2JvdHRsZXJvY2tldC1hc2cnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdjNS5sYXJnZScpLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWNzLkJvdHRsZVJvY2tldEltYWdlKCksXG4gICAgICB1cGRhdGVQb2xpY3k6IGF1dG9zY2FsaW5nLlVwZGF0ZVBvbGljeS5yZXBsYWNpbmdVcGRhdGUoKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgVXBkYXRlUG9saWN5OiB7XG4gICAgICAgIEF1dG9TY2FsaW5nUmVwbGFjaW5nVXBkYXRlOiB7XG4gICAgICAgICAgV2lsbFJlcGxhY2U6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgndW5kZWZpbmVkIHVwZGF0ZVR5cGUgJiB1cGRhdGVQb2xpY3kgcmVwbGFjZWQgYnkgZGVmYXVsdCB1cGRhdGVQb2xpY3knLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicpO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ2JvdHRsZXJvY2tldC1hc2cnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdjNS5sYXJnZScpLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWNzLkJvdHRsZVJvY2tldEltYWdlKCksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIFVwZGF0ZVBvbGljeToge1xuICAgICAgICBBdXRvU2NhbGluZ1JlcGxhY2luZ1VwZGF0ZToge1xuICAgICAgICAgIFdpbGxSZXBsYWNlOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ3VwZGF0ZVR5cGUuTk9ORSByZXBsYWNlZCBieSB1cGRhdGVQb2xpY3kgZXF1aXZhbGVudCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3Rlc3QnKTtcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJyk7XG4gICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnYm90dGxlcm9ja2V0LWFzZycsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2M1LmxhcmdlJyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlY3MuQm90dGxlUm9ja2V0SW1hZ2UoKSxcbiAgICAgIHVwZGF0ZVR5cGU6IGF1dG9zY2FsaW5nLlVwZGF0ZVR5cGUuTk9ORSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgVXBkYXRlUG9saWN5OiB7XG4gICAgICAgIEF1dG9TY2FsaW5nU2NoZWR1bGVkQWN0aW9uOiB7XG4gICAgICAgICAgSWdub3JlVW5tb2RpZmllZEdyb3VwU2l6ZVByb3BlcnRpZXM6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgndXBkYXRlVHlwZS5SRVBMQUNJTkdfVVBEQVRFIHJlcGxhY2VkIGJ5IHVwZGF0ZVBvbGljeSBlcXVpdmFsZW50JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAndGVzdCcpO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInKTtcbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdib3R0bGVyb2NrZXQtYXNnJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzUubGFyZ2UnKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjcy5Cb3R0bGVSb2NrZXRJbWFnZSgpLFxuICAgICAgdXBkYXRlVHlwZTogYXV0b3NjYWxpbmcuVXBkYXRlVHlwZS5SRVBMQUNJTkdfVVBEQVRFLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICBVcGRhdGVQb2xpY3k6IHtcbiAgICAgICAgQXV0b1NjYWxpbmdSZXBsYWNpbmdVcGRhdGU6IHtcbiAgICAgICAgICBXaWxsUmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCd1cGRhdGVUeXBlLlJPTExJTkdfVVBEQVRFIHJlcGxhY2VkIGJ5IHVwZGF0ZVBvbGljeSBlcXVpdmFsZW50JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAndGVzdCcpO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInKTtcbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdib3R0bGVyb2NrZXQtYXNnJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzUubGFyZ2UnKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjcy5Cb3R0bGVSb2NrZXRJbWFnZSgpLFxuICAgICAgdXBkYXRlVHlwZTogYXV0b3NjYWxpbmcuVXBkYXRlVHlwZS5ST0xMSU5HX1VQREFURSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgVXBkYXRlUG9saWN5OiB7XG4gICAgICAgIEF1dG9TY2FsaW5nUm9sbGluZ1VwZGF0ZToge1xuICAgICAgICAgIFdhaXRPblJlc291cmNlU2lnbmFsczogZmFsc2UsXG4gICAgICAgICAgUGF1c2VUaW1lOiAnUFQwUycsXG4gICAgICAgICAgU3VzcGVuZFByb2Nlc3NlczogW1xuICAgICAgICAgICAgJ0hlYWx0aENoZWNrJyxcbiAgICAgICAgICAgICdSZXBsYWNlVW5oZWFsdGh5JyxcbiAgICAgICAgICAgICdBWlJlYmFsYW5jZScsXG4gICAgICAgICAgICAnQWxhcm1Ob3RpZmljYXRpb24nLFxuICAgICAgICAgICAgJ1NjaGVkdWxlZEFjdGlvbnMnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIEF1dG9TY2FsaW5nU2NoZWR1bGVkQWN0aW9uOiB7XG4gICAgICAgICAgSWdub3JlVW5tb2RpZmllZEdyb3VwU2l6ZVByb3BlcnRpZXM6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgndGhyb3dzIHdoZW4gdXBkYXRlUG9saWN5IGFuZCB1cGRhdGVUeXBlIGJvdGggc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAndGVzdCcpO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdib3R0bGVyb2NrZXQtYXNnJywge1xuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdjNS5sYXJnZScpLFxuICAgICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlY3MuQm90dGxlUm9ja2V0SW1hZ2UoKSxcbiAgICAgICAgdXBkYXRlUG9saWN5OiBhdXRvc2NhbGluZy5VcGRhdGVQb2xpY3kucmVwbGFjaW5nVXBkYXRlKCksXG4gICAgICAgIHVwZGF0ZVR5cGU6IGF1dG9zY2FsaW5nLlVwZGF0ZVR5cGUuUkVQTEFDSU5HX1VQREFURSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coXCJDYW5ub3Qgc2V0ICdzaWduYWxzJy8ndXBkYXRlUG9saWN5JyBhbmQgJ3VwZGF0ZVR5cGUnIHRvZ2V0aGVyLiBQcmVmZXIgJ3NpZ25hbHMnLyd1cGRhdGVQb2xpY3knXCIpO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnYWxsb3dzIHNwZWNpZnlpbmcgY2FwYWNpdHlQcm92aWRlcnMgKGRlcHJlY2F0ZWQpJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAndGVzdCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IGNhcGFjaXR5UHJvdmlkZXJzOiBbJ0ZBUkdBVEVfU1BPVCddIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6Q2x1c3RlcicsIHtcbiAgICAgIENhcGFjaXR5UHJvdmlkZXJzOiBNYXRjaC5hYnNlbnQoKSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6Q2x1c3RlckNhcGFjaXR5UHJvdmlkZXJBc3NvY2lhdGlvbnMnLCB7XG4gICAgICBDYXBhY2l0eVByb3ZpZGVyczogWydGQVJHQVRFX1NQT1QnXSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2FsbG93cyBzcGVjaWZ5aW5nIEZhcmdhdGUgY2FwYWNpdHlQcm92aWRlcnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHtcbiAgICAgIGVuYWJsZUZhcmdhdGVDYXBhY2l0eVByb3ZpZGVyczogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OkNsdXN0ZXInLCB7XG4gICAgICBDYXBhY2l0eVByb3ZpZGVyczogTWF0Y2guYWJzZW50KCksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OkNsdXN0ZXJDYXBhY2l0eVByb3ZpZGVyQXNzb2NpYXRpb25zJywge1xuICAgICAgQ2FwYWNpdHlQcm92aWRlcnM6IFsnRkFSR0FURScsICdGQVJHQVRFX1NQT1QnXSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2FsbG93cyBzcGVjaWZ5aW5nIGNhcGFjaXR5UHJvdmlkZXJzIChhbHRlcm5hdGUgbWV0aG9kKScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3Rlc3QnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicpO1xuICAgIGNsdXN0ZXIuZW5hYmxlRmFyZ2F0ZUNhcGFjaXR5UHJvdmlkZXJzKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpDbHVzdGVyJywge1xuICAgICAgQ2FwYWNpdHlQcm92aWRlcnM6IE1hdGNoLmFic2VudCgpLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpDbHVzdGVyQ2FwYWNpdHlQcm92aWRlckFzc29jaWF0aW9ucycsIHtcbiAgICAgIENhcGFjaXR5UHJvdmlkZXJzOiBbJ0ZBUkdBVEUnLCAnRkFSR0FURV9TUE9UJ10sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnYWxsb3dzIGFkZGluZyBjYXBhY2l0eVByb3ZpZGVycyBwb3N0LWNvbnN0cnVjdGlvbiAoZGVwcmVjYXRlZCknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInKTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5UHJvdmlkZXIoJ0ZBUkdBVEUnKTtcbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5UHJvdmlkZXIoJ0ZBUkdBVEUnKTsgLy8gZG9lcyBub3QgYWRkIHR3aWNlXG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpDbHVzdGVyJywge1xuICAgICAgQ2FwYWNpdHlQcm92aWRlcnM6IE1hdGNoLmFic2VudCgpLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpDbHVzdGVyQ2FwYWNpdHlQcm92aWRlckFzc29jaWF0aW9ucycsIHtcbiAgICAgIENhcGFjaXR5UHJvdmlkZXJzOiBbJ0ZBUkdBVEUnXSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdhbGxvd3MgYWRkaW5nIGNhcGFjaXR5UHJvdmlkZXJzIHBvc3QtY29uc3RydWN0aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAndGVzdCcpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2x1c3Rlci5hZGRDYXBhY2l0eVByb3ZpZGVyKCdGQVJHQVRFJyk7XG4gICAgY2x1c3Rlci5hZGRDYXBhY2l0eVByb3ZpZGVyKCdGQVJHQVRFJyk7IC8vIGRvZXMgbm90IGFkZCB0d2ljZVxuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6Q2x1c3RlcicsIHtcbiAgICAgIENhcGFjaXR5UHJvdmlkZXJzOiBNYXRjaC5hYnNlbnQoKSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6Q2x1c3RlckNhcGFjaXR5UHJvdmlkZXJBc3NvY2lhdGlvbnMnLCB7XG4gICAgICBDYXBhY2l0eVByb3ZpZGVyczogWydGQVJHQVRFJ10sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgndGhyb3dzIGZvciB1bnN1cHBvcnRlZCBjYXBhY2l0eSBwcm92aWRlcnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgY2x1c3Rlci5hZGRDYXBhY2l0eVByb3ZpZGVyKCdIT05LJyk7XG4gICAgfSkudG9UaHJvdygvQ2FwYWNpdHlQcm92aWRlciBub3Qgc3VwcG9ydGVkLyk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdjcmVhdGVzIEFTRyBjYXBhY2l0eSBwcm92aWRlcnMgd2l0aCBleHBlY3RlZCBkZWZhdWx0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3Rlc3QnKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycpO1xuICAgIGNvbnN0IGF1dG9TY2FsaW5nR3JvdXAgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ2FzZycsIHtcbiAgICAgIHZwYyxcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2JvZ3VzJyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IGVjcy5FY3NPcHRpbWl6ZWRJbWFnZS5hbWF6b25MaW51eDIoKSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWNzLkFzZ0NhcGFjaXR5UHJvdmlkZXIoc3RhY2ssICdwcm92aWRlcicsIHtcbiAgICAgIGF1dG9TY2FsaW5nR3JvdXAsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpDYXBhY2l0eVByb3ZpZGVyJywge1xuICAgICAgQXV0b1NjYWxpbmdHcm91cFByb3ZpZGVyOiB7XG4gICAgICAgIEF1dG9TY2FsaW5nR3JvdXBBcm46IHtcbiAgICAgICAgICBSZWY6ICdhc2dBU0c0RDAxNDY3MCcsXG4gICAgICAgIH0sXG4gICAgICAgIE1hbmFnZWRTY2FsaW5nOiB7XG4gICAgICAgICAgU3RhdHVzOiAnRU5BQkxFRCcsXG4gICAgICAgICAgVGFyZ2V0Q2FwYWNpdHk6IDEwMCxcbiAgICAgICAgfSxcbiAgICAgICAgTWFuYWdlZFRlcm1pbmF0aW9uUHJvdGVjdGlvbjogJ0VOQUJMRUQnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICB9KTtcblxuICB0ZXN0KCdjYW4gZGlzYWJsZSBNYW5hZ2VkIFNjYWxpbmcgYW5kIE1hbmFnZWQgVGVybWluYXRpb24gUHJvdGVjdGlvbiBmb3IgQVNHIGNhcGFjaXR5IHByb3ZpZGVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAndGVzdCcpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJyk7XG4gICAgY29uc3QgYXV0b1NjYWxpbmdHcm91cCA9IG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnYXNnJywge1xuICAgICAgdnBjLFxuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYm9ndXMnKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogZWNzLkVjc09wdGltaXplZEltYWdlLmFtYXpvbkxpbnV4MigpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlY3MuQXNnQ2FwYWNpdHlQcm92aWRlcihzdGFjaywgJ3Byb3ZpZGVyJywge1xuICAgICAgYXV0b1NjYWxpbmdHcm91cCxcbiAgICAgIGVuYWJsZU1hbmFnZWRTY2FsaW5nOiBmYWxzZSxcbiAgICAgIGVuYWJsZU1hbmFnZWRUZXJtaW5hdGlvblByb3RlY3Rpb246IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6Q2FwYWNpdHlQcm92aWRlcicsIHtcbiAgICAgIEF1dG9TY2FsaW5nR3JvdXBQcm92aWRlcjoge1xuICAgICAgICBBdXRvU2NhbGluZ0dyb3VwQXJuOiB7XG4gICAgICAgICAgUmVmOiAnYXNnQVNHNEQwMTQ2NzAnLFxuICAgICAgICB9LFxuICAgICAgICBNYW5hZ2VkU2NhbGluZzogTWF0Y2guYWJzZW50KCksXG4gICAgICAgIE1hbmFnZWRUZXJtaW5hdGlvblByb3RlY3Rpb246ICdESVNBQkxFRCcsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gZGlzYWJsZSBNYW5hZ2VkIFRlcm1pbmF0aW9uIFByb3RlY3Rpb24gZm9yIEFTRyBjYXBhY2l0eSBwcm92aWRlcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3Rlc3QnKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycpO1xuICAgIGNvbnN0IGF1dG9TY2FsaW5nR3JvdXAgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ2FzZycsIHtcbiAgICAgIHZwYyxcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2JvZ3VzJyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IGVjcy5FY3NPcHRpbWl6ZWRJbWFnZS5hbWF6b25MaW51eDIoKSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWNzLkFzZ0NhcGFjaXR5UHJvdmlkZXIoc3RhY2ssICdwcm92aWRlcicsIHtcbiAgICAgIGF1dG9TY2FsaW5nR3JvdXAsXG4gICAgICBlbmFibGVNYW5hZ2VkVGVybWluYXRpb25Qcm90ZWN0aW9uOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OkNhcGFjaXR5UHJvdmlkZXInLCB7XG4gICAgICBBdXRvU2NhbGluZ0dyb3VwUHJvdmlkZXI6IHtcbiAgICAgICAgQXV0b1NjYWxpbmdHcm91cEFybjoge1xuICAgICAgICAgIFJlZjogJ2FzZ0FTRzREMDE0NjcwJyxcbiAgICAgICAgfSxcbiAgICAgICAgTWFuYWdlZFNjYWxpbmc6IHtcbiAgICAgICAgICBTdGF0dXM6ICdFTkFCTEVEJyxcbiAgICAgICAgICBUYXJnZXRDYXBhY2l0eTogMTAwLFxuICAgICAgICB9LFxuICAgICAgICBNYW5hZ2VkVGVybWluYXRpb25Qcm90ZWN0aW9uOiAnRElTQUJMRUQnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIGVycm9yLCB3aGVuIEFTRyBjYXBhY2l0eSBwcm92aWRlciBoYXMgTWFuYWdlZCBTY2FsaW5nIGRpc2FibGVkIGFuZCBNYW5hZ2VkIFRlcm1pbmF0aW9uIFByb3RlY3Rpb24gaXMgdW5kZWZpbmVkIChkZWZhdWx0cyB0byB0cnVlKScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3Rlc3QnKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycpO1xuICAgIGNvbnN0IGF1dG9TY2FsaW5nR3JvdXAgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ2FzZycsIHtcbiAgICAgIHZwYyxcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2JvZ3VzJyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IGVjcy5FY3NPcHRpbWl6ZWRJbWFnZS5hbWF6b25MaW51eDIoKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGVjcy5Bc2dDYXBhY2l0eVByb3ZpZGVyKHN0YWNrLCAncHJvdmlkZXInLCB7XG4gICAgICAgIGF1dG9TY2FsaW5nR3JvdXAsXG4gICAgICAgIGVuYWJsZU1hbmFnZWRTY2FsaW5nOiBmYWxzZSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3dFcnJvcignQ2Fubm90IGVuYWJsZSBNYW5hZ2VkIFRlcm1pbmF0aW9uIFByb3RlY3Rpb24gb24gYSBDYXBhY2l0eSBQcm92aWRlciB3aGVuIE1hbmFnZWQgU2NhbGluZyBpcyBkaXNhYmxlZC4gRWl0aGVyIGVuYWJsZSBNYW5hZ2VkIFNjYWxpbmcgb3IgZGlzYWJsZSBNYW5hZ2VkIFRlcm1pbmF0aW9uIFByb3RlY3Rpb24uJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBlcnJvciwgd2hlbiBNYW5hZ2VkIFNjYWxpbmcgaXMgZGlzYWJsZWQgYW5kIE1hbmFnZWQgVGVybWluYXRpb24gUHJvdGVjdGlvbiBpcyBlbmFibGVkLicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3Rlc3QnKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycpO1xuICAgIGNvbnN0IGF1dG9TY2FsaW5nR3JvdXAgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ2FzZycsIHtcbiAgICAgIHZwYyxcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2JvZ3VzJyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IGVjcy5FY3NPcHRpbWl6ZWRJbWFnZS5hbWF6b25MaW51eDIoKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGVjcy5Bc2dDYXBhY2l0eVByb3ZpZGVyKHN0YWNrLCAncHJvdmlkZXInLCB7XG4gICAgICAgIGF1dG9TY2FsaW5nR3JvdXAsXG4gICAgICAgIGVuYWJsZU1hbmFnZWRTY2FsaW5nOiBmYWxzZSxcbiAgICAgICAgZW5hYmxlTWFuYWdlZFRlcm1pbmF0aW9uUHJvdGVjdGlvbjogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3dFcnJvcignQ2Fubm90IGVuYWJsZSBNYW5hZ2VkIFRlcm1pbmF0aW9uIFByb3RlY3Rpb24gb24gYSBDYXBhY2l0eSBQcm92aWRlciB3aGVuIE1hbmFnZWQgU2NhbGluZyBpcyBkaXNhYmxlZC4gRWl0aGVyIGVuYWJsZSBNYW5hZ2VkIFNjYWxpbmcgb3IgZGlzYWJsZSBNYW5hZ2VkIFRlcm1pbmF0aW9uIFByb3RlY3Rpb24uJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhcGFjaXR5IHByb3ZpZGVyIGVuYWJsZXMgQVNHIG5ldyBpbnN0YW5jZSBzY2FsZS1pbiBwcm90ZWN0aW9uIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcbiAgICBjb25zdCBhdXRvU2NhbGluZ0dyb3VwID0gbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdhc2cnLCB7XG4gICAgICB2cGMsXG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdib2d1cycpLFxuICAgICAgbWFjaGluZUltYWdlOiBlY3MuRWNzT3B0aW1pemVkSW1hZ2UuYW1hem9uTGludXgyKCksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjcy5Bc2dDYXBhY2l0eVByb3ZpZGVyKHN0YWNrLCAncHJvdmlkZXInLCB7XG4gICAgICBhdXRvU2NhbGluZ0dyb3VwLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgTmV3SW5zdGFuY2VzUHJvdGVjdGVkRnJvbVNjYWxlSW46IHRydWUsXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnY2FwYWNpdHkgcHJvdmlkZXIgZGlzYWJsZXMgQVNHIG5ldyBpbnN0YW5jZSBzY2FsZS1pbiBwcm90ZWN0aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAndGVzdCcpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJyk7XG4gICAgY29uc3QgYXV0b1NjYWxpbmdHcm91cCA9IG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnYXNnJywge1xuICAgICAgdnBjLFxuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYm9ndXMnKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogZWNzLkVjc09wdGltaXplZEltYWdlLmFtYXpvbkxpbnV4MigpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlY3MuQXNnQ2FwYWNpdHlQcm92aWRlcihzdGFjaywgJ3Byb3ZpZGVyJywge1xuICAgICAgYXV0b1NjYWxpbmdHcm91cCxcbiAgICAgIGVuYWJsZU1hbmFnZWRUZXJtaW5hdGlvblByb3RlY3Rpb246IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgTmV3SW5zdGFuY2VzUHJvdGVjdGVkRnJvbVNjYWxlSW46IE1hdGNoLmFic2VudCgpLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYWRkIEFTRyBjYXBhY2l0eSB2aWEgQ2FwYWNpdHkgUHJvdmlkZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicpO1xuXG4gICAgY29uc3QgYXV0b1NjYWxpbmdHcm91cCA9IG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnYXNnJywge1xuICAgICAgdnBjLFxuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYm9ndXMnKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogZWNzLkVjc09wdGltaXplZEltYWdlLmFtYXpvbkxpbnV4MigpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNhcGFjaXR5UHJvdmlkZXIgPSBuZXcgZWNzLkFzZ0NhcGFjaXR5UHJvdmlkZXIoc3RhY2ssICdwcm92aWRlcicsIHtcbiAgICAgIGF1dG9TY2FsaW5nR3JvdXAsXG4gICAgICBlbmFibGVNYW5hZ2VkVGVybWluYXRpb25Qcm90ZWN0aW9uOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIGNsdXN0ZXIuZW5hYmxlRmFyZ2F0ZUNhcGFjaXR5UHJvdmlkZXJzKCk7XG5cbiAgICAvLyBFbnN1cmUgbm90IGFkZGVkIHR3aWNlXG4gICAgY2x1c3Rlci5hZGRBc2dDYXBhY2l0eVByb3ZpZGVyKGNhcGFjaXR5UHJvdmlkZXIpO1xuICAgIGNsdXN0ZXIuYWRkQXNnQ2FwYWNpdHlQcm92aWRlcihjYXBhY2l0eVByb3ZpZGVyKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OkNsdXN0ZXJDYXBhY2l0eVByb3ZpZGVyQXNzb2NpYXRpb25zJywge1xuICAgICAgQ2x1c3Rlcjoge1xuICAgICAgICBSZWY6ICdFY3NDbHVzdGVyOTcyNDJCODQnLFxuICAgICAgfSxcbiAgICAgIENhcGFjaXR5UHJvdmlkZXJzOiBbXG4gICAgICAgICdGQVJHQVRFJyxcbiAgICAgICAgJ0ZBUkdBVEVfU1BPVCcsXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdwcm92aWRlckQzRkY0RDNBJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBEZWZhdWx0Q2FwYWNpdHlQcm92aWRlclN0cmF0ZWd5OiBbXSxcbiAgICB9KTtcblxuICB9KTtcblxuICB0ZXN0KCdzaG91bGQgdGhyb3cgYW4gZXJyb3IgaWYgY2FwYWNpdHkgcHJvdmlkZXIgd2l0aCBkZWZhdWx0IHN0cmF0ZWd5IGlzIG5vdCBwcmVzZW50IGluIGNhcGFjaXR5IHByb3ZpZGVycycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3Rlc3QnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHtcbiAgICAgICAgZW5hYmxlRmFyZ2F0ZUNhcGFjaXR5UHJvdmlkZXJzOiB0cnVlLFxuICAgICAgfSkuYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneShbXG4gICAgICAgIHsgY2FwYWNpdHlQcm92aWRlcjogJ3Rlc3QgY2FwYWNpdHlQcm92aWRlcicsIGJhc2U6IDEwLCB3ZWlnaHQ6IDUwIH0sXG4gICAgICBdKTtcbiAgICB9KS50b1Rocm93KCdDYXBhY2l0eSBwcm92aWRlciB0ZXN0IGNhcGFjaXR5UHJvdmlkZXIgbXVzdCBiZSBhZGRlZCB0byB0aGUgY2x1c3RlciB3aXRoIGFkZEFzZ0NhcGFjaXR5UHJvdmlkZXIoKSBiZWZvcmUgaXQgY2FuIGJlIHVzZWQgaW4gYSBkZWZhdWx0IGNhcGFjaXR5IHByb3ZpZGVyIHN0cmF0ZWd5LicpO1xuICB9KTtcblxuICB0ZXN0KCdzaG91bGQgdGhyb3cgYW4gZXJyb3Igd2hlbiBjYXBhY2l0eSBwcm92aWRlcnMgaXMgbGVuZ3RoIDAgYW5kIGRlZmF1bHQgY2FwYWNpdHkgcHJvdmlkZXIgc3RhcnRlZ3kgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3Rlc3QnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHtcbiAgICAgICAgZW5hYmxlRmFyZ2F0ZUNhcGFjaXR5UHJvdmlkZXJzOiBmYWxzZSxcbiAgICAgIH0pLmFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyU3RyYXRlZ3koW1xuICAgICAgICB7IGNhcGFjaXR5UHJvdmlkZXI6ICd0ZXN0IGNhcGFjaXR5UHJvdmlkZXInLCBiYXNlOiAxMCwgd2VpZ2h0OiA1MCB9LFxuICAgICAgXSk7XG4gICAgfSkudG9UaHJvdygnQ2FwYWNpdHkgcHJvdmlkZXIgdGVzdCBjYXBhY2l0eVByb3ZpZGVyIG11c3QgYmUgYWRkZWQgdG8gdGhlIGNsdXN0ZXIgd2l0aCBhZGRBc2dDYXBhY2l0eVByb3ZpZGVyKCkgYmVmb3JlIGl0IGNhbiBiZSB1c2VkIGluIGEgZGVmYXVsdCBjYXBhY2l0eSBwcm92aWRlciBzdHJhdGVneS4nKTtcbiAgfSk7XG5cbiAgdGVzdCgnc2hvdWxkIHRocm93IGFuIGVycm9yIHdoZW4gbW9yZSB0aGFuIDEgZGVmYXVsdCBjYXBhY2l0eSBwcm92aWRlciBoYXZlIGJhc2Ugc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3Rlc3QnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHtcbiAgICAgICAgZW5hYmxlRmFyZ2F0ZUNhcGFjaXR5UHJvdmlkZXJzOiB0cnVlLFxuICAgICAgfSkuYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneShbXG4gICAgICAgIHsgY2FwYWNpdHlQcm92aWRlcjogJ0ZBUkdBVEUnLCBiYXNlOiAxMCwgd2VpZ2h0OiA1MCB9LFxuICAgICAgICB7IGNhcGFjaXR5UHJvdmlkZXI6ICdGQVJHQVRFX1NQT1QnLCBiYXNlOiAxMCwgd2VpZ2h0OiA1MCB9LFxuICAgICAgXSk7XG4gICAgfSkudG9UaHJvdygvT25seSAxIGNhcGFjaXR5IHByb3ZpZGVyIGluIGEgY2FwYWNpdHkgcHJvdmlkZXIgc3RyYXRlZ3kgY2FuIGhhdmUgYSBub256ZXJvIGJhc2UuLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Nob3VsZCB0aHJvdyBhbiBlcnJvciB3aGVuIGEgY2FwYWNpdHkgcHJvdmlkZXIgc3RyYXRlZ3kgY29udGFpbnMgYSBtaXggb2YgQXV0byBTY2FsaW5nIGdyb3VwcyBhbmQgRmFyZ2F0ZSBwcm92aWRlcnMnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAndGVzdCcpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJyk7XG4gICAgY29uc3QgYXV0b1NjYWxpbmdHcm91cCA9IG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnYXNnJywge1xuICAgICAgdnBjLFxuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYm9ndXMnKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogZWNzLkVjc09wdGltaXplZEltYWdlLmFtYXpvbkxpbnV4MigpLFxuICAgIH0pO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywge1xuICAgICAgZW5hYmxlRmFyZ2F0ZUNhcGFjaXR5UHJvdmlkZXJzOiB0cnVlLFxuICAgIH0pO1xuICAgIGNvbnN0IGNhcGFjaXR5UHJvdmlkZXIgPSBuZXcgZWNzLkFzZ0NhcGFjaXR5UHJvdmlkZXIoc3RhY2ssICdwcm92aWRlcicsIHtcbiAgICAgIGF1dG9TY2FsaW5nR3JvdXAsXG4gICAgICBlbmFibGVNYW5hZ2VkVGVybWluYXRpb25Qcm90ZWN0aW9uOiBmYWxzZSxcbiAgICB9KTtcbiAgICBjbHVzdGVyLmFkZEFzZ0NhcGFjaXR5UHJvdmlkZXIoY2FwYWNpdHlQcm92aWRlcik7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGNsdXN0ZXIuYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneShbXG4gICAgICAgIHsgY2FwYWNpdHlQcm92aWRlcjogJ0ZBUkdBVEUnLCBiYXNlOiAxMCwgd2VpZ2h0OiA1MCB9LFxuICAgICAgICB7IGNhcGFjaXR5UHJvdmlkZXI6ICdGQVJHQVRFX1NQT1QnIH0sXG4gICAgICAgIHsgY2FwYWNpdHlQcm92aWRlcjogY2FwYWNpdHlQcm92aWRlci5jYXBhY2l0eVByb3ZpZGVyTmFtZSB9LFxuICAgICAgXSk7XG4gICAgfSkudG9UaHJvdygvQSBjYXBhY2l0eSBwcm92aWRlciBzdHJhdGVneSBjYW5ub3QgY29udGFpbiBhIG1peCBvZiBjYXBhY2l0eSBwcm92aWRlcnMgdXNpbmcgQXV0byBTY2FsaW5nIGdyb3VwcyBhbmQgRmFyZ2F0ZSBwcm92aWRlcnMuIFNwZWNpZnkgb25lIG9yIHRoZSBvdGhlciBhbmQgdHJ5IGFnYWluLi8pO1xuICB9KTtcblxuICB0ZXN0KCdzaG91bGQgdGhyb3cgYW4gZXJyb3IgaWYgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneSBpcyBjYWxsZWQgbW9yZSB0aGFuIG9uY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywge1xuICAgICAgICBlbmFibGVGYXJnYXRlQ2FwYWNpdHlQcm92aWRlcnM6IHRydWUsXG4gICAgICB9KTtcbiAgICAgIGNsdXN0ZXIuYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneShbXG4gICAgICAgIHsgY2FwYWNpdHlQcm92aWRlcjogJ0ZBUkdBVEUnLCBiYXNlOiAxMCwgd2VpZ2h0OiA1MCB9LFxuICAgICAgICB7IGNhcGFjaXR5UHJvdmlkZXI6ICdGQVJHQVRFX1NQT1QnIH0sXG4gICAgICBdKTtcbiAgICAgIGNsdXN0ZXIuYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneShbXG4gICAgICAgIHsgY2FwYWNpdHlQcm92aWRlcjogJ0ZBUkdBVEUnLCBiYXNlOiAxMCwgd2VpZ2h0OiA1MCB9LFxuICAgICAgICB7IGNhcGFjaXR5UHJvdmlkZXI6ICdGQVJHQVRFX1NQT1QnIH0sXG4gICAgICBdKTtcbiAgICB9KS50b1Rocm93KC9DbHVzdGVyIGRlZmF1bHQgY2FwYWNpdHkgcHJvdmlkZXIgc3RyYXRlZ3kgaXMgYWxyZWFkeSBzZXQuLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBhZGQgQVNHIGNhcGFjaXR5IHZpYSBDYXBhY2l0eSBQcm92aWRlciB3aXRoIGRlZmF1bHQgY2FwYWNpdHkgcHJvdmlkZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHtcbiAgICAgIGVuYWJsZUZhcmdhdGVDYXBhY2l0eVByb3ZpZGVyczogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGNsdXN0ZXIuYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneShbXG4gICAgICB7IGNhcGFjaXR5UHJvdmlkZXI6ICdGQVJHQVRFJywgYmFzZTogMTAsIHdlaWdodDogNTAgfSxcbiAgICAgIHsgY2FwYWNpdHlQcm92aWRlcjogJ0ZBUkdBVEVfU1BPVCcgfSxcbiAgICBdKTtcblxuICAgIGNvbnN0IGF1dG9TY2FsaW5nR3JvdXAgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ2FzZycsIHtcbiAgICAgIHZwYyxcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2JvZ3VzJyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IGVjcy5FY3NPcHRpbWl6ZWRJbWFnZS5hbWF6b25MaW51eDIoKSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjYXBhY2l0eVByb3ZpZGVyID0gbmV3IGVjcy5Bc2dDYXBhY2l0eVByb3ZpZGVyKHN0YWNrLCAncHJvdmlkZXInLCB7XG4gICAgICBhdXRvU2NhbGluZ0dyb3VwLFxuICAgICAgZW5hYmxlTWFuYWdlZFRlcm1pbmF0aW9uUHJvdGVjdGlvbjogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBjbHVzdGVyLmFkZEFzZ0NhcGFjaXR5UHJvdmlkZXIoY2FwYWNpdHlQcm92aWRlcik7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpDbHVzdGVyQ2FwYWNpdHlQcm92aWRlckFzc29jaWF0aW9ucycsIHtcbiAgICAgIENsdXN0ZXI6IHtcbiAgICAgICAgUmVmOiAnRWNzQ2x1c3Rlcjk3MjQyQjg0JyxcbiAgICAgIH0sXG4gICAgICBDYXBhY2l0eVByb3ZpZGVyczogW1xuICAgICAgICAnRkFSR0FURScsXG4gICAgICAgICdGQVJHQVRFX1NQT1QnLFxuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAncHJvdmlkZXJEM0ZGNEQzQScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgRGVmYXVsdENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneTogW1xuICAgICAgICB7IENhcGFjaXR5UHJvdmlkZXI6ICdGQVJHQVRFJywgQmFzZTogMTAsIFdlaWdodDogNTAgfSxcbiAgICAgICAgeyBDYXBhY2l0eVByb3ZpZGVyOiAnRkFSR0FURV9TUE9UJyB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGFkZCBBU0cgZGVmYXVsdCBjYXBhY2l0eSBwcm92aWRlcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3Rlc3QnKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJyk7XG5cbiAgICBjb25zdCBhdXRvU2NhbGluZ0dyb3VwID0gbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdhc2cnLCB7XG4gICAgICB2cGMsXG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdib2d1cycpLFxuICAgICAgbWFjaGluZUltYWdlOiBlY3MuRWNzT3B0aW1pemVkSW1hZ2UuYW1hem9uTGludXgyKCksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2FwYWNpdHlQcm92aWRlciA9IG5ldyBlY3MuQXNnQ2FwYWNpdHlQcm92aWRlcihzdGFjaywgJ3Byb3ZpZGVyJywge1xuICAgICAgYXV0b1NjYWxpbmdHcm91cCxcbiAgICAgIGVuYWJsZU1hbmFnZWRUZXJtaW5hdGlvblByb3RlY3Rpb246IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgY2x1c3Rlci5hZGRBc2dDYXBhY2l0eVByb3ZpZGVyKGNhcGFjaXR5UHJvdmlkZXIpO1xuXG4gICAgY2x1c3Rlci5hZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlclN0cmF0ZWd5KFtcbiAgICAgIHsgY2FwYWNpdHlQcm92aWRlcjogY2FwYWNpdHlQcm92aWRlci5jYXBhY2l0eVByb3ZpZGVyTmFtZSB9LFxuICAgIF0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6Q2x1c3RlckNhcGFjaXR5UHJvdmlkZXJBc3NvY2lhdGlvbnMnLCB7XG4gICAgICBDbHVzdGVyOiB7XG4gICAgICAgIFJlZjogJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcsXG4gICAgICB9LFxuICAgICAgQ2FwYWNpdHlQcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlZjogJ3Byb3ZpZGVyRDNGRjREM0EnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyU3RyYXRlZ3k6IFtcbiAgICAgICAge1xuICAgICAgICAgIENhcGFjaXR5UHJvdmlkZXI6IHtcbiAgICAgICAgICAgIFJlZjogJ3Byb3ZpZGVyRDNGRjREM0EnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjb3JyZWN0bHkgc2V0cyBsb2cgY29uZmlndXJhdGlvbiBmb3IgZXhlY3V0ZSBjb21tYW5kJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAndGVzdCcpO1xuXG4gICAgY29uc3Qga21zS2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdLbXNLZXknKTtcblxuICAgIGNvbnN0IGxvZ0dyb3VwID0gbmV3IGxvZ3MuTG9nR3JvdXAoc3RhY2ssICdMb2dHcm91cCcsIHtcbiAgICAgIGVuY3J5cHRpb25LZXk6IGttc0tleSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGV4ZWNCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnRWNzRXhlY0J1Y2tldCcsIHtcbiAgICAgIGVuY3J5cHRpb25LZXk6IGttc0tleSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywge1xuICAgICAgZXhlY3V0ZUNvbW1hbmRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIGttc0tleToga21zS2V5LFxuICAgICAgICBsb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgY2xvdWRXYXRjaExvZ0dyb3VwOiBsb2dHcm91cCxcbiAgICAgICAgICBjbG91ZFdhdGNoRW5jcnlwdGlvbkVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgczNCdWNrZXQ6IGV4ZWNCdWNrZXQsXG4gICAgICAgICAgczNFbmNyeXB0aW9uRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICBzM0tleVByZWZpeDogJ2V4ZWMtb3V0cHV0JyxcbiAgICAgICAgfSxcbiAgICAgICAgbG9nZ2luZzogZWNzLkV4ZWN1dGVDb21tYW5kTG9nZ2luZy5PVkVSUklERSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpDbHVzdGVyJywge1xuICAgICAgQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBFeGVjdXRlQ29tbWFuZENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBLbXNLZXlJZDoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdLbXNLZXk0NjY5M0FERCcsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIExvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIENsb3VkV2F0Y2hFbmNyeXB0aW9uRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIENsb3VkV2F0Y2hMb2dHcm91cE5hbWU6IHtcbiAgICAgICAgICAgICAgUmVmOiAnTG9nR3JvdXBGNUI0NjkzMScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUzNCdWNrZXROYW1lOiB7XG4gICAgICAgICAgICAgIFJlZjogJ0Vjc0V4ZWNCdWNrZXQ0RjQ2ODY1MScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUzNFbmNyeXB0aW9uRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIFMzS2V5UHJlZml4OiAnZXhlYy1vdXRwdXQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgTG9nZ2luZzogJ09WRVJSSURFJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2hlbiBubyBsb2cgY29uZmlndXJhdGlvbiBpcyBwcm92aWRlZCB3aGVuIGxvZ2dpbmcgaXMgc2V0IHRvIE9WRVJSSURFJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAndGVzdCcpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywge1xuICAgICAgICBleGVjdXRlQ29tbWFuZENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBsb2dnaW5nOiBlY3MuRXhlY3V0ZUNvbW1hbmRMb2dnaW5nLk9WRVJSSURFLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvRXhlY3V0ZSBjb21tYW5kIGxvZyBjb25maWd1cmF0aW9uIG11c3Qgb25seSBiZSBzcGVjaWZpZWQgd2hlbiBsb2dnaW5nIGlzIE9WRVJSSURFLi8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIHdoZW4gbG9nIGNvbmZpZ3VyYXRpb24gcHJvdmlkZWQgYnV0IGxvZ2dpbmcgaXMgc2V0IHRvIERFRkFVTFQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG5cbiAgICBjb25zdCBsb2dHcm91cCA9IG5ldyBsb2dzLkxvZ0dyb3VwKHN0YWNrLCAnTG9nR3JvdXAnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHtcbiAgICAgICAgZXhlY3V0ZUNvbW1hbmRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgbG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgY2xvdWRXYXRjaExvZ0dyb3VwOiBsb2dHcm91cCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGxvZ2dpbmc6IGVjcy5FeGVjdXRlQ29tbWFuZExvZ2dpbmcuREVGQVVMVCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0V4ZWN1dGUgY29tbWFuZCBsb2cgY29uZmlndXJhdGlvbiBtdXN0IG9ubHkgYmUgc3BlY2lmaWVkIHdoZW4gbG9nZ2luZyBpcyBPVkVSUklERS4vKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIENsb3VkV2F0Y2hFbmNyeXB0aW9uRW5hYmxlZCB3aXRob3V0IHByb3ZpZGluZyBDbG91ZFdhdGNoIExvZ3MgbG9nIGdyb3VwIG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7XG4gICAgICAgIGV4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIGxvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIGNsb3VkV2F0Y2hFbmNyeXB0aW9uRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGxvZ2dpbmc6IGVjcy5FeGVjdXRlQ29tbWFuZExvZ2dpbmcuT1ZFUlJJREUsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9Zb3UgbXVzdCBzcGVjaWZ5IGEgQ2xvdWRXYXRjaCBsb2cgZ3JvdXAgaW4gdGhlIGV4ZWN1dGUgY29tbWFuZCBsb2cgY29uZmlndXJhdGlvbiB0byBlbmFibGUgQ2xvdWRXYXRjaCBlbmNyeXB0aW9uLi8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIHdoZW4gUzNFbmNyeXB0aW9uRW5hYmxlZCB3aXRob3V0IHByb3ZpZGluZyBTMyBCdWNrZXQgbmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3Rlc3QnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHtcbiAgICAgICAgZXhlY3V0ZUNvbW1hbmRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgbG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgczNFbmNyeXB0aW9uRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGxvZ2dpbmc6IGVjcy5FeGVjdXRlQ29tbWFuZExvZ2dpbmcuT1ZFUlJJREUsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9Zb3UgbXVzdCBzcGVjaWZ5IGFuIFMzIGJ1Y2tldCBuYW1lIGluIHRoZSBleGVjdXRlIGNvbW1hbmQgbG9nIGNvbmZpZ3VyYXRpb24gdG8gZW5hYmxlIFMzIGVuY3J5cHRpb24uLyk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdXaGVuIGltcG9ydGluZyBFQ1MgQ2x1c3RlciB2aWEgQXJuJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgY2x1c3Rlck5hbWUgPSAnbXktY2x1c3Rlcic7XG4gICAgY29uc3QgcmVnaW9uID0gJ3NlcnZpY2UtcmVnaW9uJztcbiAgICBjb25zdCBhY2NvdW50ID0gJ3NlcnZpY2UtYWNjb3VudCc7XG4gICAgY29uc3QgY2x1c3RlciA9IGVjcy5DbHVzdGVyLmZyb21DbHVzdGVyQXJuKHN0YWNrLCAnQ2x1c3RlcicsIGBhcm46YXdzOmVjczoke3JlZ2lvbn06JHthY2NvdW50fTpjbHVzdGVyLyR7Y2x1c3Rlck5hbWV9YCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGNsdXN0ZXIuY2x1c3Rlck5hbWUpLnRvRXF1YWwoY2x1c3Rlck5hbWUpO1xuICAgIGV4cGVjdChjbHVzdGVyLmVudi5yZWdpb24pLnRvRXF1YWwocmVnaW9uKTtcbiAgICBleHBlY3QoY2x1c3Rlci5lbnYuYWNjb3VudCkudG9FcXVhbChhY2NvdW50KTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIGVycm9yIHdoZW4gaW1wb3J0IEVDUyBDbHVzdGVyIHdpdGhvdXQgcmVzb3VyY2UgbmFtZSBpbiBhcm4nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgZWNzLkNsdXN0ZXIuZnJvbUNsdXN0ZXJBcm4oc3RhY2ssICdDbHVzdGVyJywgJ2Fybjphd3M6ZWNzOnNlcnZpY2UtcmVnaW9uOnNlcnZpY2UtYWNjb3VudDpjbHVzdGVyJyk7XG4gICAgfSkudG9UaHJvd0Vycm9yKC9NaXNzaW5nIHJlcXVpcmVkIENsdXN0ZXIgTmFtZSBmcm9tIENsdXN0ZXIgQVJOOiAvKTtcbiAgfSk7XG59KTtcblxudGVzdCgnY2FuIGFkZCBBU0cgY2FwYWNpdHkgdmlhIENhcGFjaXR5IFByb3ZpZGVyIGJ5IG5vdCBzcGVjaWZ5aW5nIG1hY2hpbmVJbWFnZVR5cGUnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG4gIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJyk7XG4gIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJyk7XG5cbiAgY29uc3QgYXV0b1NjYWxpbmdHcm91cEFsMiA9IG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnYXNnYWwyJywge1xuICAgIHZwYyxcbiAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdib2d1cycpLFxuICAgIG1hY2hpbmVJbWFnZTogZWNzLkVjc09wdGltaXplZEltYWdlLmFtYXpvbkxpbnV4MigpLFxuICB9KTtcblxuICBjb25zdCBhdXRvU2NhbGluZ0dyb3VwQm90dGxlcm9ja2V0ID0gbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdhc2dCb3R0bGVyb2NrZXQnLCB7XG4gICAgdnBjLFxuICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2JvZ3VzJyksXG4gICAgbWFjaGluZUltYWdlOiBuZXcgZWNzLkJvdHRsZVJvY2tldEltYWdlKCksXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgY29uc3QgY2FwYWNpdHlQcm92aWRlckFsMiA9IG5ldyBlY3MuQXNnQ2FwYWNpdHlQcm92aWRlcihzdGFjaywgJ3Byb3ZpZGVyYWwyJywge1xuICAgIGF1dG9TY2FsaW5nR3JvdXA6IGF1dG9TY2FsaW5nR3JvdXBBbDIsXG4gICAgZW5hYmxlTWFuYWdlZFRlcm1pbmF0aW9uUHJvdGVjdGlvbjogZmFsc2UsXG4gIH0pO1xuXG4gIGNvbnN0IGNhcGFjaXR5UHJvdmlkZXJCb3R0bGVyb2NrZXQgPSBuZXcgZWNzLkFzZ0NhcGFjaXR5UHJvdmlkZXIoc3RhY2ssICdwcm92aWRlckJvdHRsZXJvY2tldCcsIHtcbiAgICBhdXRvU2NhbGluZ0dyb3VwOiBhdXRvU2NhbGluZ0dyb3VwQm90dGxlcm9ja2V0LFxuICAgIGVuYWJsZU1hbmFnZWRUZXJtaW5hdGlvblByb3RlY3Rpb246IGZhbHNlLFxuICAgIG1hY2hpbmVJbWFnZVR5cGU6IGVjcy5NYWNoaW5lSW1hZ2VUeXBlLkJPVFRMRVJPQ0tFVCxcbiAgfSk7XG5cbiAgY2x1c3Rlci5lbmFibGVGYXJnYXRlQ2FwYWNpdHlQcm92aWRlcnMoKTtcblxuICAvLyBFbnN1cmUgbm90IGFkZGVkIHR3aWNlXG4gIGNsdXN0ZXIuYWRkQXNnQ2FwYWNpdHlQcm92aWRlcihjYXBhY2l0eVByb3ZpZGVyQWwyKTtcbiAgY2x1c3Rlci5hZGRBc2dDYXBhY2l0eVByb3ZpZGVyKGNhcGFjaXR5UHJvdmlkZXJBbDIpO1xuXG4gIC8vIEFkZCBCb3R0bGVyb2NrZXQgQVNHIENhcGFjaXR5IFByb3ZpZGVyXG4gIGNsdXN0ZXIuYWRkQXNnQ2FwYWNpdHlQcm92aWRlcihjYXBhY2l0eVByb3ZpZGVyQm90dGxlcm9ja2V0KTtcblxuXG4gIC8vIFRIRU4gQm90dGxlcm9ja2V0IExhdW5jaENvbmZpZ3VyYXRpb25cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkxhdW5jaENvbmZpZ3VyYXRpb24nLCB7XG4gICAgSW1hZ2VJZDoge1xuICAgICAgUmVmOiAnU3NtUGFyYW1ldGVyVmFsdWVhd3NzZXJ2aWNlYm90dGxlcm9ja2V0YXdzZWNzMXg4NjY0bGF0ZXN0aW1hZ2VpZEM5NjU4NEI2RjAwQTQ2NEVBRDE5NTNBRkY0QjA1MTE4UGFyYW1ldGVyJyxcblxuICAgIH0sXG4gICAgVXNlckRhdGE6IHtcbiAgICAgICdGbjo6QmFzZTY0Jzoge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ1xcbltzZXR0aW5ncy5lY3NdXFxuY2x1c3RlciA9IFxcXCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdFY3NDbHVzdGVyOTcyNDJCODQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdcXFwiJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcblxuICAvLyBUSEVOIEFtYXpvbkxpbnV4MiBMYXVuY2hDb25maWd1cmF0aW9uXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpMYXVuY2hDb25maWd1cmF0aW9uJywge1xuICAgIEltYWdlSWQ6IHtcbiAgICAgIFJlZjogJ1NzbVBhcmFtZXRlclZhbHVlYXdzc2VydmljZWVjc29wdGltaXplZGFtaWFtYXpvbmxpbnV4MnJlY29tbWVuZGVkaW1hZ2VpZEM5NjU4NEI2RjAwQTQ2NEVBRDE5NTNBRkY0QjA1MTE4UGFyYW1ldGVyJyxcbiAgICB9LFxuICAgIFVzZXJEYXRhOiB7XG4gICAgICAnRm46OkJhc2U2NCc6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICcjIS9iaW4vYmFzaFxcbmVjaG8gRUNTX0NMVVNURVI9JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnRWNzQ2x1c3Rlcjk3MjQyQjg0JyxcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICcgPj4gL2V0Yy9lY3MvZWNzLmNvbmZpZ1xcbnN1ZG8gaXB0YWJsZXMgLS1pbnNlcnQgRk9SV0FSRCAxIC0taW4taW50ZXJmYWNlIGRvY2tlcisgLS1kZXN0aW5hdGlvbiAxNjkuMjU0LjE2OS4yNTQvMzIgLS1qdW1wIERST1BcXG5zdWRvIHNlcnZpY2UgaXB0YWJsZXMgc2F2ZVxcbmVjaG8gRUNTX0FXU1ZQQ19CTE9DS19JTURTPXRydWUgPj4gL2V0Yy9lY3MvZWNzLmNvbmZpZycsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpDbHVzdGVyQ2FwYWNpdHlQcm92aWRlckFzc29jaWF0aW9ucycsIHtcbiAgICBDYXBhY2l0eVByb3ZpZGVyczogW1xuICAgICAgJ0ZBUkdBVEUnLFxuICAgICAgJ0ZBUkdBVEVfU1BPVCcsXG4gICAgICB7XG4gICAgICAgIFJlZjogJ3Byb3ZpZGVyYWwyQTQyN0NCQzAnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgUmVmOiAncHJvdmlkZXJCb3R0bGVyb2NrZXQ5MEMwMzlGQScsXG4gICAgICB9LFxuICAgIF0sXG4gICAgQ2x1c3Rlcjoge1xuICAgICAgUmVmOiAnRWNzQ2x1c3Rlcjk3MjQyQjg0JyxcbiAgICB9LFxuICAgIERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyU3RyYXRlZ3k6IFtdLFxuICB9KTtcblxufSk7XG5cbnRlc3QoJ3Rocm93cyB3aGVuIEFTRyBDYXBhY2l0eSBQcm92aWRlciB3aXRoIGNhcGFjaXR5UHJvdmlkZXJOYW1lIHN0YXJ0aW5nIHdpdGggYXdzLCBlY3Mgb3IgZmFyYWd0ZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3Rlc3QnKTtcbiAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcbiAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInKTtcblxuICBjb25zdCBhdXRvU2NhbGluZ0dyb3VwQWwyID0gbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdhc2dhbDInLCB7XG4gICAgdnBjLFxuICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2JvZ3VzJyksXG4gICAgbWFjaGluZUltYWdlOiBlY3MuRWNzT3B0aW1pemVkSW1hZ2UuYW1hem9uTGludXgyKCksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IHtcbiAgICAvLyBXSEVOIENhcGFjaXR5IFByb3ZpZGVyIGRlZmluZSBjYXBhY2l0eVByb3ZpZGVyTmFtZSBzdGFydCB3aXRoIGF3cy5cbiAgICBjb25zdCBjYXBhY2l0eVByb3ZpZGVyQWwyID0gbmV3IGVjcy5Bc2dDYXBhY2l0eVByb3ZpZGVyKHN0YWNrLCAncHJvdmlkZXJhbDInLCB7XG4gICAgICBhdXRvU2NhbGluZ0dyb3VwOiBhdXRvU2NhbGluZ0dyb3VwQWwyLFxuICAgICAgZW5hYmxlTWFuYWdlZFRlcm1pbmF0aW9uUHJvdGVjdGlvbjogZmFsc2UsXG4gICAgICBjYXBhY2l0eVByb3ZpZGVyTmFtZTogJ2F3c2NwJyxcbiAgICB9KTtcblxuICAgIGNsdXN0ZXIuYWRkQXNnQ2FwYWNpdHlQcm92aWRlcihjYXBhY2l0eVByb3ZpZGVyQWwyKTtcbiAgfSkudG9UaHJvdygvSW52YWxpZCBDYXBhY2l0eSBQcm92aWRlciBOYW1lOiBhd3NjcCwgSWYgYSBuYW1lIGlzIHNwZWNpZmllZCwgaXQgY2Fubm90IHN0YXJ0IHdpdGggYXdzLCBlY3MsIG9yIGZhcmdhdGUuLyk7XG5cbiAgZXhwZWN0KCgpID0+IHtcbiAgICAvLyBXSEVOIENhcGFjaXR5IFByb3ZpZGVyIGRlZmluZSBjYXBhY2l0eVByb3ZpZGVyTmFtZSBzdGFydCB3aXRoIGVjcy5cbiAgICBjb25zdCBjYXBhY2l0eVByb3ZpZGVyQWwyID0gbmV3IGVjcy5Bc2dDYXBhY2l0eVByb3ZpZGVyKHN0YWNrLCAncHJvdmlkZXJhbDItMicsIHtcbiAgICAgIGF1dG9TY2FsaW5nR3JvdXA6IGF1dG9TY2FsaW5nR3JvdXBBbDIsXG4gICAgICBlbmFibGVNYW5hZ2VkVGVybWluYXRpb25Qcm90ZWN0aW9uOiBmYWxzZSxcbiAgICAgIGNhcGFjaXR5UHJvdmlkZXJOYW1lOiAnZWNzY3AnLFxuICAgIH0pO1xuXG4gICAgY2x1c3Rlci5hZGRBc2dDYXBhY2l0eVByb3ZpZGVyKGNhcGFjaXR5UHJvdmlkZXJBbDIpO1xuICB9KS50b1Rocm93KC9JbnZhbGlkIENhcGFjaXR5IFByb3ZpZGVyIE5hbWU6IGVjc2NwLCBJZiBhIG5hbWUgaXMgc3BlY2lmaWVkLCBpdCBjYW5ub3Qgc3RhcnQgd2l0aCBhd3MsIGVjcywgb3IgZmFyZ2F0ZS4vKTtcbn0pO1xuXG5kZXNjcmliZSgnQWNjZXNzaW5nIGNvbnRhaW5lciBpbnN0YW5jZSByb2xlJywgZnVuY3Rpb24gKCkge1xuXG4gIGNvbnN0IGFkZFVzZXJEYXRhTW9jayA9IGplc3QuZm4oKTtcbiAgY29uc3QgYXV0b1NjYWxpbmdHcm91cDogYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cCA9IHtcbiAgICBhZGRVc2VyRGF0YTogYWRkVXNlckRhdGFNb2NrLFxuICAgIGFkZFRvUm9sZVBvbGljeTogamVzdC5mbigpLFxuICAgIHByb3RlY3ROZXdJbnN0YW5jZXNGcm9tU2NhbGVJbjogamVzdC5mbigpLFxuICB9IGFzIHVua25vd24gYXMgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cDtcblxuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIGFkZFVzZXJEYXRhTW9jay5tb2NrQ2xlYXIoKTtcbiAgfSk7XG5cbiAgdGVzdCgnYmxvY2sgZWNzIGZyb20gYWNjZXNzaW5nIG1ldGFkYXRhIHNlcnZpY2Ugd2hlbiBjYW5Db250YWluZXJzQWNjZXNzSW5zdGFuY2VSb2xlIG5vdCBzZXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInKTtcblxuICAgIC8vIFdIRU5cblxuICAgIGNvbnN0IGNhcGFjaXR5UHJvdmlkZXIgPSBuZXcgZWNzLkFzZ0NhcGFjaXR5UHJvdmlkZXIoc3RhY2ssICdQcm92aWRlcicsIHtcbiAgICAgIGF1dG9TY2FsaW5nR3JvdXA6IGF1dG9TY2FsaW5nR3JvdXAsXG4gICAgfSk7XG5cbiAgICBjbHVzdGVyLmFkZEFzZ0NhcGFjaXR5UHJvdmlkZXIoY2FwYWNpdHlQcm92aWRlcik7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGF1dG9TY2FsaW5nR3JvdXAuYWRkVXNlckRhdGEpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdzdWRvIGlwdGFibGVzIC0taW5zZXJ0IEZPUldBUkQgMSAtLWluLWludGVyZmFjZSBkb2NrZXIrIC0tZGVzdGluYXRpb24gMTY5LjI1NC4xNjkuMjU0LzMyIC0tanVtcCBEUk9QJyk7XG4gICAgZXhwZWN0KGF1dG9TY2FsaW5nR3JvdXAuYWRkVXNlckRhdGEpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdzdWRvIHNlcnZpY2UgaXB0YWJsZXMgc2F2ZScpO1xuICAgIGV4cGVjdChhdXRvU2NhbGluZ0dyb3VwLmFkZFVzZXJEYXRhKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnZWNobyBFQ1NfQVdTVlBDX0JMT0NLX0lNRFM9dHJ1ZSA+PiAvZXRjL2Vjcy9lY3MuY29uZmlnJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FsbG93IGVjcyBhY2Nlc3NpbmcgbWV0YWRhdGEgc2VydmljZSB3aGVuIGNhbkNvbnRhaW5lcnNBY2Nlc3NJbnN0YW5jZVJvbGUgaXMgc2V0IG9uIGFkZEFzZ0NhcGFjaXR5UHJvdmlkZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjYXBhY2l0eVByb3ZpZGVyID0gbmV3IGVjcy5Bc2dDYXBhY2l0eVByb3ZpZGVyKHN0YWNrLCAnUHJvdmlkZXInLCB7XG4gICAgICBhdXRvU2NhbGluZ0dyb3VwOiBhdXRvU2NhbGluZ0dyb3VwLFxuICAgIH0pO1xuXG4gICAgY2x1c3Rlci5hZGRBc2dDYXBhY2l0eVByb3ZpZGVyKGNhcGFjaXR5UHJvdmlkZXIsIHtcbiAgICAgIGNhbkNvbnRhaW5lcnNBY2Nlc3NJbnN0YW5jZVJvbGU6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGF1dG9TY2FsaW5nR3JvdXAuYWRkVXNlckRhdGEpLm5vdC50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnc3VkbyBpcHRhYmxlcyAtLWluc2VydCBGT1JXQVJEIDEgLS1pbi1pbnRlcmZhY2UgZG9ja2VyKyAtLWRlc3RpbmF0aW9uIDE2OS4yNTQuMTY5LjI1NC8zMiAtLWp1bXAgRFJPUCcpO1xuICAgIGV4cGVjdChhdXRvU2NhbGluZ0dyb3VwLmFkZFVzZXJEYXRhKS5ub3QudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3N1ZG8gc2VydmljZSBpcHRhYmxlcyBzYXZlJyk7XG4gICAgZXhwZWN0KGF1dG9TY2FsaW5nR3JvdXAuYWRkVXNlckRhdGEpLm5vdC50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnZWNobyBFQ1NfQVdTVlBDX0JMT0NLX0lNRFM9dHJ1ZSA+PiAvZXRjL2Vjcy9lY3MuY29uZmlnJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FsbG93IGVjcyBhY2Nlc3NpbmcgbWV0YWRhdGEgc2VydmljZSB3aGVuIGNhbkNvbnRhaW5lcnNBY2Nlc3NJbnN0YW5jZVJvbGUgaXMgc2V0IG9uIEFzZ0NhcGFjaXR5UHJvdmlkZXIgaW5zdGFudGlhdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3Rlc3QnKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNhcGFjaXR5UHJvdmlkZXIgPSBuZXcgZWNzLkFzZ0NhcGFjaXR5UHJvdmlkZXIoc3RhY2ssICdQcm92aWRlcicsIHtcbiAgICAgIGF1dG9TY2FsaW5nR3JvdXA6IGF1dG9TY2FsaW5nR3JvdXAsXG4gICAgICBjYW5Db250YWluZXJzQWNjZXNzSW5zdGFuY2VSb2xlOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgY2x1c3Rlci5hZGRBc2dDYXBhY2l0eVByb3ZpZGVyKGNhcGFjaXR5UHJvdmlkZXIpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChhdXRvU2NhbGluZ0dyb3VwLmFkZFVzZXJEYXRhKS5ub3QudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3N1ZG8gaXB0YWJsZXMgLS1pbnNlcnQgRk9SV0FSRCAxIC0taW4taW50ZXJmYWNlIGRvY2tlcisgLS1kZXN0aW5hdGlvbiAxNjkuMjU0LjE2OS4yNTQvMzIgLS1qdW1wIERST1AnKTtcbiAgICBleHBlY3QoYXV0b1NjYWxpbmdHcm91cC5hZGRVc2VyRGF0YSkubm90LnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdzdWRvIHNlcnZpY2UgaXB0YWJsZXMgc2F2ZScpO1xuICAgIGV4cGVjdChhdXRvU2NhbGluZ0dyb3VwLmFkZFVzZXJEYXRhKS5ub3QudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2VjaG8gRUNTX0FXU1ZQQ19CTE9DS19JTURTPXRydWUgPj4gL2V0Yy9lY3MvZWNzLmNvbmZpZycpO1xuICB9KTtcblxuICB0ZXN0KCdhbGxvdyBlY3MgYWNjZXNzaW5nIG1ldGFkYXRhIHNlcnZpY2Ugd2hlbiBjYW5Db250YWluZXJzQWNjZXNzSW5zdGFuY2VSb2xlIGlzIHNldCBvbiBjb25zdHJ1Y3RvciBhbmQgbWV0aG9kJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAndGVzdCcpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2FwYWNpdHlQcm92aWRlciA9IG5ldyBlY3MuQXNnQ2FwYWNpdHlQcm92aWRlcihzdGFjaywgJ1Byb3ZpZGVyJywge1xuICAgICAgYXV0b1NjYWxpbmdHcm91cDogYXV0b1NjYWxpbmdHcm91cCxcbiAgICAgIGNhbkNvbnRhaW5lcnNBY2Nlc3NJbnN0YW5jZVJvbGU6IHRydWUsXG4gICAgfSk7XG5cbiAgICBjbHVzdGVyLmFkZEFzZ0NhcGFjaXR5UHJvdmlkZXIoY2FwYWNpdHlQcm92aWRlciwge1xuICAgICAgY2FuQ29udGFpbmVyc0FjY2Vzc0luc3RhbmNlUm9sZTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoYXV0b1NjYWxpbmdHcm91cC5hZGRVc2VyRGF0YSkubm90LnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdzdWRvIGlwdGFibGVzIC0taW5zZXJ0IEZPUldBUkQgMSAtLWluLWludGVyZmFjZSBkb2NrZXIrIC0tZGVzdGluYXRpb24gMTY5LjI1NC4xNjkuMjU0LzMyIC0tanVtcCBEUk9QJyk7XG4gICAgZXhwZWN0KGF1dG9TY2FsaW5nR3JvdXAuYWRkVXNlckRhdGEpLm5vdC50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnc3VkbyBzZXJ2aWNlIGlwdGFibGVzIHNhdmUnKTtcbiAgICBleHBlY3QoYXV0b1NjYWxpbmdHcm91cC5hZGRVc2VyRGF0YSkubm90LnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdlY2hvIEVDU19BV1NWUENfQkxPQ0tfSU1EUz10cnVlID4+IC9ldGMvZWNzL2Vjcy5jb25maWcnKTtcbiAgfSk7XG5cbiAgdGVzdCgnYmxvY2sgZWNzIGZyb20gYWNjZXNzaW5nIG1ldGFkYXRhIHNlcnZpY2Ugd2hlbiBjYW5Db250YWluZXJzQWNjZXNzSW5zdGFuY2VSb2xlIHNldCBvbiBjb25zdHJ1Y3RvciBhbmQgbm90IHNldCBvbiBtZXRob2QnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICd0ZXN0Jyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjYXBhY2l0eVByb3ZpZGVyID0gbmV3IGVjcy5Bc2dDYXBhY2l0eVByb3ZpZGVyKHN0YWNrLCAnUHJvdmlkZXInLCB7XG4gICAgICBhdXRvU2NhbGluZ0dyb3VwOiBhdXRvU2NhbGluZ0dyb3VwLFxuICAgICAgY2FuQ29udGFpbmVyc0FjY2Vzc0luc3RhbmNlUm9sZTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGNsdXN0ZXIuYWRkQXNnQ2FwYWNpdHlQcm92aWRlcihjYXBhY2l0eVByb3ZpZGVyLCB7XG4gICAgICBjYW5Db250YWluZXJzQWNjZXNzSW5zdGFuY2VSb2xlOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoYXV0b1NjYWxpbmdHcm91cC5hZGRVc2VyRGF0YSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3N1ZG8gaXB0YWJsZXMgLS1pbnNlcnQgRk9SV0FSRCAxIC0taW4taW50ZXJmYWNlIGRvY2tlcisgLS1kZXN0aW5hdGlvbiAxNjkuMjU0LjE2OS4yNTQvMzIgLS1qdW1wIERST1AnKTtcbiAgICBleHBlY3QoYXV0b1NjYWxpbmdHcm91cC5hZGRVc2VyRGF0YSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3N1ZG8gc2VydmljZSBpcHRhYmxlcyBzYXZlJyk7XG4gICAgZXhwZWN0KGF1dG9TY2FsaW5nR3JvdXAuYWRkVXNlckRhdGEpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdlY2hvIEVDU19BV1NWUENfQkxPQ0tfSU1EUz10cnVlID4+IC9ldGMvZWNzL2Vjcy5jb25maWcnKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWxsb3cgZWNzIGFjY2Vzc2luZyBtZXRhZGF0YSBzZXJ2aWNlIHdoZW4gY2FuQ29udGFpbmVyc0FjY2Vzc0luc3RhbmNlUm9sZSBpcyBub3Qgc2V0IG9uIGNvbnN0cnVjdG9yIGFuZCBzZXQgb24gbWV0aG9kJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAndGVzdCcpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2FwYWNpdHlQcm92aWRlciA9IG5ldyBlY3MuQXNnQ2FwYWNpdHlQcm92aWRlcihzdGFjaywgJ1Byb3ZpZGVyJywge1xuICAgICAgYXV0b1NjYWxpbmdHcm91cDogYXV0b1NjYWxpbmdHcm91cCxcbiAgICAgIGNhbkNvbnRhaW5lcnNBY2Nlc3NJbnN0YW5jZVJvbGU6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgY2x1c3Rlci5hZGRBc2dDYXBhY2l0eVByb3ZpZGVyKGNhcGFjaXR5UHJvdmlkZXIsIHtcbiAgICAgIGNhbkNvbnRhaW5lcnNBY2Nlc3NJbnN0YW5jZVJvbGU6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGF1dG9TY2FsaW5nR3JvdXAuYWRkVXNlckRhdGEpLm5vdC50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnc3VkbyBpcHRhYmxlcyAtLWluc2VydCBGT1JXQVJEIDEgLS1pbi1pbnRlcmZhY2UgZG9ja2VyKyAtLWRlc3RpbmF0aW9uIDE2OS4yNTQuMTY5LjI1NC8zMiAtLWp1bXAgRFJPUCcpO1xuICAgIGV4cGVjdChhdXRvU2NhbGluZ0dyb3VwLmFkZFVzZXJEYXRhKS5ub3QudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3N1ZG8gc2VydmljZSBpcHRhYmxlcyBzYXZlJyk7XG4gICAgZXhwZWN0KGF1dG9TY2FsaW5nR3JvdXAuYWRkVXNlckRhdGEpLm5vdC50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnZWNobyBFQ1NfQVdTVlBDX0JMT0NLX0lNRFM9dHJ1ZSA+PiAvZXRjL2Vjcy9lY3MuY29uZmlnJyk7XG4gIH0pO1xufSk7XG4iXX0=