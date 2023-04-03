"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const ec2 = require("@aws-cdk/aws-ec2");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const aws_elasticloadbalancingv2_1 = require("@aws-cdk/aws-elasticloadbalancingv2");
const iam = require("@aws-cdk/aws-iam");
const sns = require("@aws-cdk/aws-sns");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const autoscaling = require("../lib");
const lib_1 = require("../lib");
/* eslint-disable quote-props */
describe('auto scaling group', () => {
    test('default fleet', () => {
        const stack = getTestStack();
        const vpc = mockVpc(stack);
        new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            'Parameters': {
                'SsmParameterValueawsserviceamiamazonlinuxlatestamznamihvmx8664gp2C96584B6F00A464EAD1953AFF4B05118Parameter': {
                    'Type': 'AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>',
                    'Default': '/aws/service/ami-amazon-linux-latest/amzn-ami-hvm-x86_64-gp2',
                },
            },
            'Resources': {
                'MyFleetInstanceSecurityGroup774E8234': {
                    'Type': 'AWS::EC2::SecurityGroup',
                    'Properties': {
                        'GroupDescription': 'TestStack/MyFleet/InstanceSecurityGroup',
                        'SecurityGroupEgress': [
                            {
                                'CidrIp': '0.0.0.0/0',
                                'Description': 'Allow all outbound traffic by default',
                                'IpProtocol': '-1',
                            },
                        ],
                        'Tags': [
                            {
                                'Key': 'Name',
                                'Value': 'TestStack/MyFleet',
                            },
                        ],
                        'VpcId': 'my-vpc',
                    },
                },
                'MyFleetInstanceRole25A84AB8': {
                    'Type': 'AWS::IAM::Role',
                    'Properties': {
                        'AssumeRolePolicyDocument': {
                            'Statement': [
                                {
                                    'Action': 'sts:AssumeRole',
                                    'Effect': 'Allow',
                                    'Principal': {
                                        'Service': 'ec2.amazonaws.com',
                                    },
                                },
                            ],
                            'Version': '2012-10-17',
                        },
                        'Tags': [
                            {
                                'Key': 'Name',
                                'Value': 'TestStack/MyFleet',
                            },
                        ],
                    },
                },
                'MyFleetInstanceProfile70A58496': {
                    'Type': 'AWS::IAM::InstanceProfile',
                    'Properties': {
                        'Roles': [
                            {
                                'Ref': 'MyFleetInstanceRole25A84AB8',
                            },
                        ],
                    },
                },
                'MyFleetLaunchConfig5D7F9801': {
                    'Type': 'AWS::AutoScaling::LaunchConfiguration',
                    'Properties': {
                        'IamInstanceProfile': {
                            'Ref': 'MyFleetInstanceProfile70A58496',
                        },
                        'ImageId': { 'Ref': 'SsmParameterValueawsserviceamiamazonlinuxlatestamznamihvmx8664gp2C96584B6F00A464EAD1953AFF4B05118Parameter' },
                        'InstanceType': 'm4.micro',
                        'SecurityGroups': [
                            {
                                'Fn::GetAtt': [
                                    'MyFleetInstanceSecurityGroup774E8234',
                                    'GroupId',
                                ],
                            },
                        ],
                        'UserData': {
                            'Fn::Base64': '#!/bin/bash',
                        },
                    },
                    'DependsOn': [
                        'MyFleetInstanceRole25A84AB8',
                    ],
                },
                'MyFleetASG88E55886': {
                    'Type': 'AWS::AutoScaling::AutoScalingGroup',
                    'UpdatePolicy': {
                        'AutoScalingScheduledAction': {
                            'IgnoreUnmodifiedGroupSizeProperties': true,
                        },
                    },
                    'Properties': {
                        'LaunchConfigurationName': {
                            'Ref': 'MyFleetLaunchConfig5D7F9801',
                        },
                        'Tags': [
                            {
                                'Key': 'Name',
                                'PropagateAtLaunch': true,
                                'Value': 'TestStack/MyFleet',
                            },
                        ],
                        'MaxSize': '1',
                        'MinSize': '1',
                        'VPCZoneIdentifier': [
                            'pri1',
                        ],
                    },
                },
            },
        });
    });
    test('can set minCapacity, maxCapacity, desiredCapacity to 0', () => {
        const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
        const vpc = mockVpc(stack);
        new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            minCapacity: 0,
            maxCapacity: 0,
            desiredCapacity: 0,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            MinSize: '0',
            MaxSize: '0',
            DesiredCapacity: '0',
        });
    });
    test('validation is not performed when using Tokens', () => {
        const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
        const vpc = mockVpc(stack);
        new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            minCapacity: cdk.Lazy.number({ produce: () => 5 }),
            maxCapacity: cdk.Lazy.number({ produce: () => 1 }),
            desiredCapacity: cdk.Lazy.number({ produce: () => 20 }),
        });
        // THEN: no exception
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            MinSize: '5',
            MaxSize: '1',
            DesiredCapacity: '20',
        });
    });
    test('userdata can be overridden by image', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        const ud = ec2.UserData.forLinux();
        ud.addCommands('it me!');
        // WHEN
        const asg = new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage({
                userData: ud,
            }),
            vpc,
        });
        // THEN
        expect(asg.userData.render()).toEqual('#!/bin/bash\nit me!');
    });
    test('userdata can be overridden at ASG directly', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        const ud1 = ec2.UserData.forLinux();
        ud1.addCommands('it me!');
        const ud2 = ec2.UserData.forLinux();
        ud2.addCommands('no me!');
        // WHEN
        const asg = new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage({
                userData: ud1,
            }),
            vpc,
            userData: ud2,
        });
        // THEN
        expect(asg.userData.render()).toEqual('#!/bin/bash\nno me!');
    });
    test('can specify only min capacity', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            minCapacity: 10,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            MinSize: '10',
            MaxSize: '10',
        });
    });
    test('can specify only max capacity', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            maxCapacity: 10,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            MinSize: '1',
            MaxSize: '10',
        });
    });
    test('can specify only desiredCount', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            desiredCapacity: 10,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            MinSize: '1',
            MaxSize: '10',
            DesiredCapacity: '10',
        });
    });
    test('can specify only defaultInstanceWarmup', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            defaultInstanceWarmup: cdk.Duration.seconds(5),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            DefaultInstanceWarmup: 5,
        });
    });
    test('addToRolePolicy can be used to add statements to the role policy', () => {
        const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
        const vpc = mockVpc(stack);
        const fleet = new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
        });
        fleet.addToRolePolicy(new iam.PolicyStatement({
            actions: ['test:SpecialName'],
            resources: ['*'],
        }));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'test:SpecialName',
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
            },
        });
    });
    cdk_build_tools_1.testDeprecated('can configure replacing update', () => {
        // GIVEN
        const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
        const vpc = mockVpc(stack);
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            updateType: autoscaling.UpdateType.REPLACING_UPDATE,
            replacingUpdateMinSuccessfulInstancesPercent: 50,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
            UpdatePolicy: {
                AutoScalingReplacingUpdate: {
                    WillReplace: true,
                },
            },
            CreationPolicy: {
                AutoScalingCreationPolicy: {
                    MinSuccessfulInstancesPercent: 50,
                },
            },
        });
    });
    cdk_build_tools_1.testDeprecated('can configure rolling update', () => {
        // GIVEN
        const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
        const vpc = mockVpc(stack);
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            updateType: autoscaling.UpdateType.ROLLING_UPDATE,
            rollingUpdateConfiguration: {
                minSuccessfulInstancesPercent: 50,
                pauseTime: cdk.Duration.seconds(345),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
            UpdatePolicy: {
                'AutoScalingRollingUpdate': {
                    'MinSuccessfulInstancesPercent': 50,
                    'WaitOnResourceSignals': true,
                    'PauseTime': 'PT5M45S',
                    'SuspendProcesses': ['HealthCheck', 'ReplaceUnhealthy', 'AZRebalance', 'AlarmNotification', 'ScheduledActions'],
                },
            },
        });
    });
    cdk_build_tools_1.testDeprecated('can configure resource signals', () => {
        // GIVEN
        const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
        const vpc = mockVpc(stack);
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            resourceSignalCount: 5,
            resourceSignalTimeout: cdk.Duration.seconds(666),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
            CreationPolicy: {
                ResourceSignal: {
                    Count: 5,
                    Timeout: 'PT11M6S',
                },
            },
        });
    });
    test('can configure EC2 health check', () => {
        // GIVEN
        const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
        const vpc = mockVpc(stack);
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            healthCheck: autoscaling.HealthCheck.ec2(),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            HealthCheckType: 'EC2',
        });
    });
    test('can configure EBS health check', () => {
        // GIVEN
        const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
        const vpc = mockVpc(stack);
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            healthCheck: autoscaling.HealthCheck.elb({ grace: cdk.Duration.minutes(15) }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            HealthCheckType: 'ELB',
            HealthCheckGracePeriod: 900,
        });
    });
    test('can add Security Group to Fleet', () => {
        // GIVEN
        const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
        const vpc = mockVpc(stack);
        // WHEN
        const asg = new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
        });
        asg.addSecurityGroup(mockSecurityGroup(stack));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            SecurityGroups: [
                {
                    'Fn::GetAtt': [
                        'MyFleetInstanceSecurityGroup774E8234',
                        'GroupId',
                    ],
                },
                'most-secure',
            ],
        });
    });
    test('can set tags', () => {
        // GIVEN
        const stack = getTestStack();
        // new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' }});
        const vpc = mockVpc(stack);
        // WHEN
        const asg = new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            updatePolicy: autoscaling.UpdatePolicy.rollingUpdate(),
        });
        cdk.Tags.of(asg).add('superfood', 'acai');
        cdk.Tags.of(asg).add('notsuper', 'caramel', { applyToLaunchedInstances: false });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            Tags: [
                {
                    Key: 'Name',
                    PropagateAtLaunch: true,
                    Value: 'TestStack/MyFleet',
                },
                {
                    Key: 'notsuper',
                    PropagateAtLaunch: false,
                    Value: 'caramel',
                },
                {
                    Key: 'superfood',
                    PropagateAtLaunch: true,
                    Value: 'acai',
                },
            ],
        });
    });
    test('allows setting spot price', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // WHEN
        const asg = new autoscaling.AutoScalingGroup(stack, 'MyStack', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            spotPrice: '0.05',
        });
        // THEN
        expect(asg.spotPrice).toEqual('0.05');
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            SpotPrice: '0.05',
        });
    });
    test('allows association of public IP address', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyStack', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            minCapacity: 0,
            maxCapacity: 0,
            desiredCapacity: 0,
            vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
            associatePublicIpAddress: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            AssociatePublicIpAddress: true,
        });
    });
    test('association of public IP address requires public subnet', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // WHEN
        expect(() => {
            new autoscaling.AutoScalingGroup(stack, 'MyStack', {
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
                machineImage: new ec2.AmazonLinuxImage(),
                vpc,
                minCapacity: 0,
                maxCapacity: 0,
                desiredCapacity: 0,
                associatePublicIpAddress: true,
            });
        }).toThrow();
    });
    test('allows disassociation of public IP address', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyStack', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            minCapacity: 0,
            maxCapacity: 0,
            desiredCapacity: 0,
            associatePublicIpAddress: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            AssociatePublicIpAddress: false,
        });
    });
    test('does not specify public IP address association by default', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyStack', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            minCapacity: 0,
            maxCapacity: 0,
            desiredCapacity: 0,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            AssociatePublicIpAddress: assertions_1.Match.absent(),
        });
    });
    test('an existing security group can be specified instead of auto-created', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(stack, 'MySG', 'most-secure');
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyASG', {
            vpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            securityGroup,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            SecurityGroups: ['most-secure'],
        });
    });
    test('an existing role can be specified instead of auto-created', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        const importedRole = iam.Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/HelloDude');
        // WHEN
        const asg = new autoscaling.AutoScalingGroup(stack, 'MyASG', {
            vpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            role: importedRole,
        });
        // THEN
        expect(asg.role).toEqual(importedRole);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::InstanceProfile', {
            'Roles': ['HelloDude'],
        });
    });
    test('defaultChild is available on an ASG', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        const asg = new autoscaling.AutoScalingGroup(stack, 'MyStack', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
        });
        // THEN
        expect(asg.node.defaultChild instanceof autoscaling.CfnAutoScalingGroup).toEqual(true);
    });
    cdk_build_tools_1.testDeprecated('can set blockDeviceMappings', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        new autoscaling.AutoScalingGroup(stack, 'MyStack', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            blockDevices: [{
                    deviceName: 'ebs',
                    mappingEnabled: true,
                    volume: autoscaling.BlockDeviceVolume.ebs(15, {
                        deleteOnTermination: true,
                        encrypted: true,
                        volumeType: autoscaling.EbsDeviceVolumeType.IO1,
                        iops: 5000,
                    }),
                }, {
                    deviceName: 'ebs-snapshot',
                    volume: autoscaling.BlockDeviceVolume.ebsFromSnapshot('snapshot-id', {
                        volumeSize: 500,
                        deleteOnTermination: false,
                        volumeType: autoscaling.EbsDeviceVolumeType.SC1,
                    }),
                }, {
                    deviceName: 'ephemeral',
                    volume: autoscaling.BlockDeviceVolume.ephemeral(0),
                }, {
                    deviceName: 'disabled',
                    volume: autoscaling.BlockDeviceVolume.ephemeral(1),
                    mappingEnabled: false,
                }, {
                    deviceName: 'none',
                    volume: autoscaling.BlockDeviceVolume.noDevice(),
                }, {
                    deviceName: 'gp3-with-throughput',
                    volume: autoscaling.BlockDeviceVolume.ebs(15, {
                        volumeType: autoscaling.EbsDeviceVolumeType.GP3,
                        throughput: 350,
                    }),
                }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            BlockDeviceMappings: [
                {
                    DeviceName: 'ebs',
                    Ebs: {
                        DeleteOnTermination: true,
                        Encrypted: true,
                        Iops: 5000,
                        VolumeSize: 15,
                        VolumeType: 'io1',
                    },
                    NoDevice: assertions_1.Match.absent(),
                },
                {
                    DeviceName: 'ebs-snapshot',
                    Ebs: {
                        DeleteOnTermination: false,
                        SnapshotId: 'snapshot-id',
                        VolumeSize: 500,
                        VolumeType: 'sc1',
                    },
                    NoDevice: assertions_1.Match.absent(),
                },
                {
                    DeviceName: 'ephemeral',
                    VirtualName: 'ephemeral0',
                    NoDevice: assertions_1.Match.absent(),
                },
                {
                    DeviceName: 'disabled',
                    NoDevice: true,
                },
                {
                    DeviceName: 'none',
                    NoDevice: true,
                },
                {
                    DeviceName: 'gp3-with-throughput',
                    Ebs: {
                        VolumeSize: 15,
                        VolumeType: 'gp3',
                        Throughput: 350,
                    },
                },
            ],
        });
    });
    test('can configure maxInstanceLifetime', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        new autoscaling.AutoScalingGroup(stack, 'MyStack', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            maxInstanceLifetime: cdk.Duration.days(7),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            'MaxInstanceLifetime': 604800,
        });
    });
    test('can configure maxInstanceLifetime with 0', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        new autoscaling.AutoScalingGroup(stack, 'MyStack', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            maxInstanceLifetime: cdk.Duration.days(0),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            'MaxInstanceLifetime': 0,
        });
    });
    test('throws if maxInstanceLifetime < 1 day', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // THEN
        expect(() => {
            new autoscaling.AutoScalingGroup(stack, 'MyStack', {
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
                machineImage: new ec2.AmazonLinuxImage(),
                vpc,
                maxInstanceLifetime: cdk.Duration.hours(23),
            });
        }).toThrow(/maxInstanceLifetime must be between 1 and 365 days \(inclusive\)/);
    });
    test('throws if maxInstanceLifetime > 365 days', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // THEN
        expect(() => {
            new autoscaling.AutoScalingGroup(stack, 'MyStack', {
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
                machineImage: new ec2.AmazonLinuxImage(),
                vpc,
                maxInstanceLifetime: cdk.Duration.days(366),
            });
        }).toThrow(/maxInstanceLifetime must be between 1 and 365 days \(inclusive\)/);
    });
    test.each([124, 1001])('throws if throughput is set less than 125 or more than 1000', (throughput) => {
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        expect(() => {
            new autoscaling.AutoScalingGroup(stack, 'MyStack', {
                machineImage: new ec2.AmazonLinuxImage(),
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
                vpc,
                maxInstanceLifetime: cdk.Duration.days(0),
                blockDevices: [{
                        deviceName: 'ebs',
                        volume: autoscaling.BlockDeviceVolume.ebs(15, {
                            volumeType: autoscaling.EbsDeviceVolumeType.GP3,
                            throughput,
                        }),
                    }],
            });
        }).toThrow(/throughput property takes a minimum of 125 and a maximum of 1000/);
    });
    test.each([
        ...Object.values(autoscaling.EbsDeviceVolumeType).filter((v) => v !== 'gp3'),
    ])('throws if throughput is set on any volume type other than GP3', (volumeType) => {
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        expect(() => {
            new autoscaling.AutoScalingGroup(stack, 'MyStack', {
                machineImage: new ec2.AmazonLinuxImage(),
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
                vpc,
                maxInstanceLifetime: cdk.Duration.days(0),
                blockDevices: [{
                        deviceName: 'ebs',
                        volume: autoscaling.BlockDeviceVolume.ebs(15, {
                            volumeType: volumeType,
                            throughput: 150,
                        }),
                    }],
            });
        }).toThrow(/throughput property requires volumeType: EbsDeviceVolumeType.GP3/);
    });
    test('throws if throughput / iops ratio is greater than 0.25', () => {
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        expect(() => {
            new autoscaling.AutoScalingGroup(stack, 'MyStack', {
                machineImage: new ec2.AmazonLinuxImage(),
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
                vpc,
                maxInstanceLifetime: cdk.Duration.days(0),
                blockDevices: [{
                        deviceName: 'ebs',
                        volume: autoscaling.BlockDeviceVolume.ebs(15, {
                            volumeType: autoscaling.EbsDeviceVolumeType.GP3,
                            throughput: 751,
                            iops: 3000,
                        }),
                    }],
            });
        }).toThrow('Throughput (MiBps) to iops ratio of 0.25033333333333335 is too high; maximum is 0.25 MiBps per iops');
    });
    test('can configure instance monitoring', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyStack', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            instanceMonitoring: autoscaling.Monitoring.BASIC,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            InstanceMonitoring: false,
        });
    });
    test('instance monitoring defaults to absent', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyStack', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            InstanceMonitoring: assertions_1.Match.absent(),
        });
    });
    test('throws if ephemeral volumeIndex < 0', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // THEN
        expect(() => {
            new autoscaling.AutoScalingGroup(stack, 'MyStack', {
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
                machineImage: new ec2.AmazonLinuxImage(),
                vpc,
                blockDevices: [{
                        deviceName: 'ephemeral',
                        volume: autoscaling.BlockDeviceVolume.ephemeral(-1),
                    }],
            });
        }).toThrow(/volumeIndex must be a number starting from 0/);
    });
    test('throws if volumeType === IO1 without iops', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // THEN
        expect(() => {
            new autoscaling.AutoScalingGroup(stack, 'MyStack', {
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
                machineImage: new ec2.AmazonLinuxImage(),
                vpc,
                blockDevices: [{
                        deviceName: 'ebs',
                        volume: autoscaling.BlockDeviceVolume.ebs(15, {
                            deleteOnTermination: true,
                            encrypted: true,
                            volumeType: autoscaling.EbsDeviceVolumeType.IO1,
                        }),
                    }],
            });
        }).toThrow(/ops property is required with volumeType: EbsDeviceVolumeType.IO1/);
    });
    test('warning if iops without volumeType', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        new autoscaling.AutoScalingGroup(stack, 'MyStack', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            blockDevices: [{
                    deviceName: 'ebs',
                    volume: autoscaling.BlockDeviceVolume.ebs(15, {
                        deleteOnTermination: true,
                        encrypted: true,
                        iops: 5000,
                    }),
                }],
        });
        // THEN
        assertions_1.Annotations.fromStack(stack).hasWarning('/Default/MyStack', 'iops will be ignored without volumeType: EbsDeviceVolumeType.IO1');
    });
    test('warning if iops and volumeType !== IO1', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        new autoscaling.AutoScalingGroup(stack, 'MyStack', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            blockDevices: [{
                    deviceName: 'ebs',
                    volume: autoscaling.BlockDeviceVolume.ebs(15, {
                        deleteOnTermination: true,
                        encrypted: true,
                        volumeType: autoscaling.EbsDeviceVolumeType.GP2,
                        iops: 5000,
                    }),
                }],
        });
        // THEN
        assertions_1.Annotations.fromStack(stack).hasWarning('/Default/MyStack', 'iops will be ignored without volumeType: EbsDeviceVolumeType.IO1');
    });
    test('step scaling on metric', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        const asg = new autoscaling.AutoScalingGroup(stack, 'MyStack', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
        });
        // WHEN
        asg.scaleOnMetric('Metric', {
            metric: new cloudwatch.Metric({
                namespace: 'Test',
                metricName: 'Metric',
            }),
            adjustmentType: autoscaling.AdjustmentType.CHANGE_IN_CAPACITY,
            scalingSteps: [
                { change: -1, lower: 0, upper: 49 },
                { change: 0, lower: 50, upper: 99 },
                { change: 1, lower: 100 },
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
            ComparisonOperator: 'LessThanOrEqualToThreshold',
            EvaluationPeriods: 1,
            MetricName: 'Metric',
            Namespace: 'Test',
            Period: 300,
        });
    });
    test('step scaling on MathExpression', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        const asg = new autoscaling.AutoScalingGroup(stack, 'MyStack', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
        });
        // WHEN
        asg.scaleOnMetric('Metric', {
            metric: new cloudwatch.MathExpression({
                expression: 'a',
                usingMetrics: {
                    a: new cloudwatch.Metric({
                        namespace: 'Test',
                        metricName: 'Metric',
                    }),
                },
            }),
            adjustmentType: autoscaling.AdjustmentType.CHANGE_IN_CAPACITY,
            scalingSteps: [
                { change: -1, lower: 0, upper: 49 },
                { change: 0, lower: 50, upper: 99 },
                { change: 1, lower: 100 },
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', assertions_1.Match.not({
            Period: 60,
        }));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
            'ComparisonOperator': 'LessThanOrEqualToThreshold',
            'EvaluationPeriods': 1,
            'Metrics': [
                {
                    'Expression': 'a',
                    'Id': 'expr_1',
                },
                {
                    'Id': 'a',
                    'MetricStat': {
                        'Metric': {
                            'MetricName': 'Metric',
                            'Namespace': 'Test',
                        },
                        'Period': 300,
                        'Stat': 'Average',
                    },
                    'ReturnData': false,
                },
            ],
            'Threshold': 49,
        });
    });
    test('test GroupMetrics.all(), adds a single MetricsCollection with no Metrics specified', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // When
        new autoscaling.AutoScalingGroup(stack, 'ASG', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            groupMetrics: [autoscaling.GroupMetrics.all()],
        });
        // Then
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            MetricsCollection: [
                {
                    Granularity: '1Minute',
                    Metrics: assertions_1.Match.absent(),
                },
            ],
        });
    });
    test('test can specify a subset of group metrics', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'ASG', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            groupMetrics: [
                new autoscaling.GroupMetrics(autoscaling.GroupMetric.MIN_SIZE, autoscaling.GroupMetric.MAX_SIZE, autoscaling.GroupMetric.DESIRED_CAPACITY, autoscaling.GroupMetric.IN_SERVICE_INSTANCES),
                new autoscaling.GroupMetrics(autoscaling.GroupMetric.PENDING_INSTANCES, autoscaling.GroupMetric.STANDBY_INSTANCES, autoscaling.GroupMetric.TOTAL_INSTANCES, autoscaling.GroupMetric.TERMINATING_INSTANCES),
            ],
            vpc,
        });
        // Then
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            MetricsCollection: [
                {
                    Granularity: '1Minute',
                    Metrics: ['GroupMinSize', 'GroupMaxSize', 'GroupDesiredCapacity', 'GroupInServiceInstances'],
                }, {
                    Granularity: '1Minute',
                    Metrics: ['GroupPendingInstances', 'GroupStandbyInstances', 'GroupTotalInstances', 'GroupTerminatingInstances'],
                },
            ],
        });
    });
    test('test deduplication of group metrics ', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        new autoscaling.AutoScalingGroup(stack, 'ASG', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            groupMetrics: [new autoscaling.GroupMetrics(autoscaling.GroupMetric.MIN_SIZE, autoscaling.GroupMetric.MAX_SIZE, autoscaling.GroupMetric.MAX_SIZE, autoscaling.GroupMetric.MIN_SIZE)],
        });
        // Then
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            MetricsCollection: [
                {
                    Granularity: '1Minute',
                    Metrics: ['GroupMinSize', 'GroupMaxSize'],
                },
            ],
        });
    });
    test('allow configuring notifications', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        const topic = new sns.Topic(stack, 'MyTopic');
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyASG', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            notifications: [
                {
                    topic,
                    scalingEvents: autoscaling.ScalingEvents.ERRORS,
                },
                {
                    topic,
                    scalingEvents: new autoscaling.ScalingEvents(autoscaling.ScalingEvent.INSTANCE_TERMINATE),
                },
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            NotificationConfigurations: [
                {
                    TopicARN: { Ref: 'MyTopic86869434' },
                    NotificationTypes: [
                        'autoscaling:EC2_INSTANCE_LAUNCH_ERROR',
                        'autoscaling:EC2_INSTANCE_TERMINATE_ERROR',
                    ],
                },
                {
                    TopicARN: { Ref: 'MyTopic86869434' },
                    NotificationTypes: [
                        'autoscaling:EC2_INSTANCE_TERMINATE',
                    ],
                },
            ],
        });
    });
    cdk_build_tools_1.testDeprecated('throw if notification and notificationsTopics are both configured', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        const topic = new sns.Topic(stack, 'MyTopic');
        // THEN
        expect(() => {
            new autoscaling.AutoScalingGroup(stack, 'MyASG', {
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
                machineImage: new ec2.AmazonLinuxImage(),
                vpc,
                notificationsTopic: topic,
                notifications: [{
                        topic,
                    }],
            });
        }).toThrow('Cannot set \'notificationsTopic\' and \'notifications\', \'notificationsTopic\' is deprecated use \'notifications\' instead');
    });
    test('notificationTypes default includes all non test NotificationType', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        const topic = new sns.Topic(stack, 'MyTopic');
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyASG', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            notifications: [
                {
                    topic,
                },
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            NotificationConfigurations: [
                {
                    TopicARN: { Ref: 'MyTopic86869434' },
                    NotificationTypes: [
                        'autoscaling:EC2_INSTANCE_LAUNCH',
                        'autoscaling:EC2_INSTANCE_LAUNCH_ERROR',
                        'autoscaling:EC2_INSTANCE_TERMINATE',
                        'autoscaling:EC2_INSTANCE_TERMINATE_ERROR',
                    ],
                },
            ],
        });
    });
    cdk_build_tools_1.testDeprecated('setting notificationTopic configures all non test NotificationType', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        const topic = new sns.Topic(stack, 'MyTopic');
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyASG', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            notificationsTopic: topic,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            NotificationConfigurations: [
                {
                    TopicARN: { Ref: 'MyTopic86869434' },
                    NotificationTypes: [
                        'autoscaling:EC2_INSTANCE_LAUNCH',
                        'autoscaling:EC2_INSTANCE_LAUNCH_ERROR',
                        'autoscaling:EC2_INSTANCE_TERMINATE',
                        'autoscaling:EC2_INSTANCE_TERMINATE_ERROR',
                    ],
                },
            ],
        });
    });
    test('NotificationTypes.ALL includes all non test NotificationType', () => {
        expect(Object.values(autoscaling.ScalingEvent).length - 1).toEqual(autoscaling.ScalingEvents.ALL._types.length);
    });
    test('Can set Capacity Rebalancing via constructor property', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyASG', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            capacityRebalance: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            CapacityRebalance: true,
        });
    });
    test('Can protect new instances from scale-in via constructor property', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // WHEN
        const asg = new autoscaling.AutoScalingGroup(stack, 'MyASG', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
            newInstancesProtectedFromScaleIn: true,
        });
        // THEN
        expect(asg.areNewInstancesProtectedFromScaleIn()).toEqual(true);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            NewInstancesProtectedFromScaleIn: true,
        });
    });
    test('Can protect new instances from scale-in via setter', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // WHEN
        const asg = new autoscaling.AutoScalingGroup(stack, 'MyASG', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc,
        });
        asg.protectNewInstancesFromScaleIn();
        // THEN
        expect(asg.areNewInstancesProtectedFromScaleIn()).toEqual(true);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            NewInstancesProtectedFromScaleIn: true,
        });
    });
    test('requires imdsv2', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyASG', {
            vpc,
            instanceType: new ec2.InstanceType('t2.micro'),
            machineImage: ec2.MachineImage.latestAmazonLinux(),
            requireImdsv2: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            MetadataOptions: {
                HttpTokens: 'required',
            },
        });
    });
    test('supports termination policies', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = mockVpc(stack);
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'MyASG', {
            vpc,
            instanceType: new ec2.InstanceType('t2.micro'),
            machineImage: ec2.MachineImage.latestAmazonLinux(),
            terminationPolicies: [
                autoscaling.TerminationPolicy.OLDEST_INSTANCE,
                autoscaling.TerminationPolicy.DEFAULT,
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            TerminationPolicies: [
                'OldestInstance',
                'Default',
            ],
        });
    });
    test('Can use imported Launch Template with ID', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'imported-lt-asg', {
            launchTemplate: aws_ec2_1.LaunchTemplate.fromLaunchTemplateAttributes(stack, 'imported-lt', {
                launchTemplateId: 'test-lt-id',
                versionNumber: '0',
            }),
            vpc: mockVpc(stack),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            LaunchTemplate: {
                LaunchTemplateId: 'test-lt-id',
                Version: '0',
            },
        });
    });
    test('Can use imported Launch Template with name', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new autoscaling.AutoScalingGroup(stack, 'imported-lt-asg', {
            launchTemplate: aws_ec2_1.LaunchTemplate.fromLaunchTemplateAttributes(stack, 'imported-lt', {
                launchTemplateName: 'test-lt',
                versionNumber: '0',
            }),
            vpc: mockVpc(stack),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            LaunchTemplate: {
                LaunchTemplateName: 'test-lt',
                Version: '0',
            },
        });
    });
    test('Can use in-stack Launch Template reference', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const lt = new aws_ec2_1.LaunchTemplate(stack, 'lt', {
            instanceType: new aws_ec2_1.InstanceType('t3.micro'),
            machineImage: new aws_ec2_1.AmazonLinuxImage({
                generation: aws_ec2_1.AmazonLinuxGeneration.AMAZON_LINUX_2,
                cpuType: aws_ec2_1.AmazonLinuxCpuType.X86_64,
            }),
        });
        new autoscaling.AutoScalingGroup(stack, 'imported-lt-asg', {
            launchTemplate: lt,
            vpc: mockVpc(stack),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            LaunchTemplate: {
                LaunchTemplateId: {
                    'Ref': 'ltB6511CF5',
                },
                Version: {
                    'Fn::GetAtt': [
                        'ltB6511CF5',
                        'LatestVersionNumber',
                    ],
                },
            },
        });
    });
    test('Can use mixed instance policy', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const lt = aws_ec2_1.LaunchTemplate.fromLaunchTemplateAttributes(stack, 'imported-lt', {
            launchTemplateId: 'test-lt-id',
            versionNumber: '0',
        });
        new autoscaling.AutoScalingGroup(stack, 'mip-asg', {
            mixedInstancesPolicy: {
                launchTemplate: lt,
                launchTemplateOverrides: [{
                        instanceType: new aws_ec2_1.InstanceType('t4g.micro'),
                        launchTemplate: lt,
                        weightedCapacity: 9,
                    }],
                instancesDistribution: {
                    onDemandAllocationStrategy: lib_1.OnDemandAllocationStrategy.PRIORITIZED,
                    onDemandBaseCapacity: 1,
                    onDemandPercentageAboveBaseCapacity: 2,
                    spotAllocationStrategy: lib_1.SpotAllocationStrategy.CAPACITY_OPTIMIZED_PRIORITIZED,
                    spotInstancePools: 3,
                    spotMaxPrice: '4',
                },
            },
            vpc: mockVpc(stack),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            MixedInstancesPolicy: {
                LaunchTemplate: {
                    LaunchTemplateSpecification: {
                        LaunchTemplateId: 'test-lt-id',
                        Version: '0',
                    },
                    Overrides: [
                        {
                            InstanceType: 't4g.micro',
                            LaunchTemplateSpecification: {
                                LaunchTemplateId: 'test-lt-id',
                                Version: '0',
                            },
                            WeightedCapacity: '9',
                        },
                    ],
                },
                InstancesDistribution: {
                    OnDemandAllocationStrategy: 'prioritized',
                    OnDemandBaseCapacity: 1,
                    OnDemandPercentageAboveBaseCapacity: 2,
                    SpotAllocationStrategy: 'capacity-optimized-prioritized',
                    SpotInstancePools: 3,
                    SpotMaxPrice: '4',
                },
            },
        });
    });
    test('Can use mixed instance policy without instances distribution', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const lt = aws_ec2_1.LaunchTemplate.fromLaunchTemplateAttributes(stack, 'imported-lt', {
            launchTemplateId: 'test-lt-id',
            versionNumber: '0',
        });
        new autoscaling.AutoScalingGroup(stack, 'mip-asg', {
            mixedInstancesPolicy: {
                launchTemplate: lt,
                launchTemplateOverrides: [{
                        instanceType: new aws_ec2_1.InstanceType('t4g.micro'),
                        launchTemplate: lt,
                        weightedCapacity: 9,
                    }],
            },
            vpc: mockVpc(stack),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            MixedInstancesPolicy: {
                LaunchTemplate: {
                    LaunchTemplateSpecification: {
                        LaunchTemplateId: 'test-lt-id',
                        Version: '0',
                    },
                    Overrides: [
                        {
                            InstanceType: 't4g.micro',
                            LaunchTemplateSpecification: {
                                LaunchTemplateId: 'test-lt-id',
                                Version: '0',
                            },
                            WeightedCapacity: '9',
                        },
                    ],
                },
            },
        });
    });
    test('Cannot specify both Launch Template and Launch Config', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const lt = aws_ec2_1.LaunchTemplate.fromLaunchTemplateAttributes(stack, 'imported-lt', {
            launchTemplateId: 'test-lt-id',
            versionNumber: '0',
        });
        const vpc = mockVpc(stack);
        // THEN
        expect(() => {
            new autoscaling.AutoScalingGroup(stack, 'imported-lt-asg', {
                launchTemplate: lt,
                instanceType: new aws_ec2_1.InstanceType('t3.micro'),
                machineImage: new aws_ec2_1.AmazonLinuxImage({
                    generation: aws_ec2_1.AmazonLinuxGeneration.AMAZON_LINUX_2,
                    cpuType: aws_ec2_1.AmazonLinuxCpuType.X86_64,
                }),
                vpc,
            });
        }).toThrow('Setting \'machineImage\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
        expect(() => {
            new autoscaling.AutoScalingGroup(stack, 'imported-lt-asg-2', {
                launchTemplate: lt,
                associatePublicIpAddress: true,
                vpc,
            });
        }).toThrow('Setting \'associatePublicIpAddress\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
    });
    test('Cannot specify Launch Template without instance type', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const lt = new aws_ec2_1.LaunchTemplate(stack, 'lt', {
            machineImage: new aws_ec2_1.AmazonLinuxImage({
                generation: aws_ec2_1.AmazonLinuxGeneration.AMAZON_LINUX_2,
                cpuType: aws_ec2_1.AmazonLinuxCpuType.X86_64,
            }),
        });
        // THEN
        expect(() => {
            new autoscaling.AutoScalingGroup(stack, 'imported-lt-asg', {
                launchTemplate: lt,
                vpc: mockVpc(stack),
            });
        }).toThrow('Setting \'launchTemplate\' requires its \'instanceType\' to be set');
    });
    test('Cannot specify Launch Template without machine image', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const lt = new aws_ec2_1.LaunchTemplate(stack, 'lt', {
            instanceType: new aws_ec2_1.InstanceType('t3.micro'),
        });
        // THEN
        expect(() => {
            new autoscaling.AutoScalingGroup(stack, 'imported-lt-asg', {
                launchTemplate: lt,
                vpc: mockVpc(stack),
            });
        }).toThrow('Setting \'launchTemplate\' requires its \'machineImage\' to be set');
    });
    test('Cannot specify mixed instance policy without machine image', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const lt = new aws_ec2_1.LaunchTemplate(stack, 'lt', {
            instanceType: new aws_ec2_1.InstanceType('t3.micro'),
        });
        // THEN
        expect(() => {
            new autoscaling.AutoScalingGroup(stack, 'imported-lt-asg', {
                mixedInstancesPolicy: {
                    launchTemplate: lt,
                    launchTemplateOverrides: [{
                            instanceType: new aws_ec2_1.InstanceType('t3.micro'),
                        }],
                },
                vpc: mockVpc(stack),
            });
        }).toThrow('Setting \'mixedInstancesPolicy.launchTemplate\' requires its \'machineImage\' to be set');
    });
    test('Cannot be created with launch configuration without machine image', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // THEN
        expect(() => {
            new autoscaling.AutoScalingGroup(stack, 'imported-lt-asg', {
                instanceType: new aws_ec2_1.InstanceType('t3.micro'),
                vpc: mockVpc(stack),
            });
        }).toThrow('Setting \'machineImage\' is required when \'launchTemplate\' and \'mixedInstancesPolicy\' is not set');
    });
    test('Cannot be created with launch configuration without instance type', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // THEN
        expect(() => {
            new autoscaling.AutoScalingGroup(stack, 'imported-lt-asg', {
                machineImage: new aws_ec2_1.AmazonLinuxImage({
                    generation: aws_ec2_1.AmazonLinuxGeneration.AMAZON_LINUX_2,
                    cpuType: aws_ec2_1.AmazonLinuxCpuType.X86_64,
                }),
                vpc: mockVpc(stack),
            });
        }).toThrow('Setting \'instanceType\' is required when \'launchTemplate\' and \'mixedInstancesPolicy\' is not set');
    });
    test('Should throw when accessing inferred fields with imported Launch Template', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const asg = new autoscaling.AutoScalingGroup(stack, 'imported-lt-asg', {
            launchTemplate: aws_ec2_1.LaunchTemplate.fromLaunchTemplateAttributes(stack, 'imported-lt', {
                launchTemplateId: 'test-lt-id',
                versionNumber: '0',
            }),
            vpc: mockVpc(stack),
        });
        // THEN
        expect(() => {
            asg.userData;
        }).toThrow('The provided launch template does not expose its user data.');
        expect(() => {
            asg.connections;
        }).toThrow('AutoScalingGroup can only be used as IConnectable if it is not created from an imported Launch Template.');
        expect(() => {
            asg.role;
        }).toThrow('The provided launch template does not expose or does not define its role.');
        expect(() => {
            asg.addSecurityGroup(mockSecurityGroup(stack));
        }).toThrow('You cannot add security groups when the Auto Scaling Group is created from a Launch Template.');
    });
    test('Should throw when accessing inferred fields with in-stack Launch Template not having corresponding properties', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const asg = new autoscaling.AutoScalingGroup(stack, 'imported-lt-asg', {
            launchTemplate: new aws_ec2_1.LaunchTemplate(stack, 'in-stack-lt', {
                instanceType: new ec2.InstanceType('t3.micro'),
                machineImage: new ec2.AmazonLinuxImage({
                    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
                    cpuType: ec2.AmazonLinuxCpuType.X86_64,
                }),
            }),
            vpc: mockVpc(stack),
        });
        // THEN
        expect(() => {
            asg.userData;
        }).toThrow('The provided launch template does not expose its user data.');
        expect(() => {
            asg.connections;
        }).toThrow('LaunchTemplate can only be used as IConnectable if a securityGroup is provided when constructing it.');
        expect(() => {
            asg.role;
        }).toThrow('The provided launch template does not expose or does not define its role.');
        expect(() => {
            asg.addSecurityGroup(mockSecurityGroup(stack));
        }).toThrow('You cannot add security groups when the Auto Scaling Group is created from a Launch Template.');
    });
    test('Should not throw when accessing inferred fields with in-stack Launch Template having corresponding properties', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const asg = new autoscaling.AutoScalingGroup(stack, 'imported-lt-asg', {
            launchTemplate: new aws_ec2_1.LaunchTemplate(stack, 'in-stack-lt', {
                instanceType: new ec2.InstanceType('t3.micro'),
                machineImage: new ec2.AmazonLinuxImage({
                    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
                    cpuType: ec2.AmazonLinuxCpuType.X86_64,
                }),
                userData: ec2.UserData.forLinux(),
                securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'MySG2', 'most-secure'),
                role: iam.Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/HelloDude'),
            }),
            vpc: mockVpc(stack),
        });
        // THEN
        expect(() => {
            asg.userData;
        }).not.toThrow();
        expect(() => {
            asg.connections;
        }).not.toThrow();
        expect(() => {
            asg.role;
        }).not.toThrow();
        expect(() => {
            asg.addSecurityGroup(mockSecurityGroup(stack));
        }).toThrow('You cannot add security groups when the Auto Scaling Group is created from a Launch Template.');
    });
    test('Should not throw when LaunchTemplate is used with CloudformationInit', () => {
        const stack = new cdk.Stack();
        // WHEN
        const lt = new aws_ec2_1.LaunchTemplate(stack, 'LaunchTemplate', {
            machineImage: new aws_ec2_1.AmazonLinuxImage(),
            instanceType: new ec2.InstanceType('t3.micro'),
            userData: ec2.UserData.forLinux(),
            securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'ImportedSg', 'securityGroupId'),
            role: iam.Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/MockRole'),
        });
        const cfInit = ec2.CloudFormationInit.fromElements(ec2.InitCommand.shellCommand('/bash'));
        // THEN
        expect(() => new autoscaling.AutoScalingGroup(stack, 'Asg', {
            launchTemplate: lt,
            init: cfInit,
            vpc: mockVpc(stack),
            signals: autoscaling.Signals.waitForAll(),
        })).not.toThrow();
    });
    describe('multiple target groups', () => {
        let asg;
        let stack;
        let vpc;
        let alb;
        let listener;
        beforeEach(() => {
            stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
            vpc = mockVpc(stack);
            alb = new aws_elasticloadbalancingv2_1.ApplicationLoadBalancer(stack, 'alb', {
                vpc,
                internetFacing: true,
            });
            listener = alb.addListener('Listener', {
                port: 80,
                open: true,
            });
            asg = new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
                machineImage: new ec2.AmazonLinuxImage(),
                vpc,
            });
        });
        test('Adding two application target groups should succeed validation', () => {
            const atg1 = new aws_elasticloadbalancingv2_1.ApplicationTargetGroup(stack, 'ATG1', { port: 443 });
            const atg2 = new aws_elasticloadbalancingv2_1.ApplicationTargetGroup(stack, 'ATG2', { port: 443 });
            listener.addTargetGroups('tgs', { targetGroups: [atg1, atg2] });
            asg.attachToApplicationTargetGroup(atg1);
            asg.attachToApplicationTargetGroup(atg2);
            expect(asg.node.validate()).toEqual([]);
        });
        test('Adding two application target groups should fail validation validate if `scaleOnRequestCount()` has been called', () => {
            const atg1 = new aws_elasticloadbalancingv2_1.ApplicationTargetGroup(stack, 'ATG1', { port: 443 });
            const atg2 = new aws_elasticloadbalancingv2_1.ApplicationTargetGroup(stack, 'ATG2', { port: 443 });
            listener.addTargetGroups('tgs', { targetGroups: [atg1, atg2] });
            asg.attachToApplicationTargetGroup(atg1);
            asg.attachToApplicationTargetGroup(atg2);
            asg.scaleOnRequestCount('requests-per-minute', { targetRequestsPerMinute: 60 });
            expect(asg.node.validate()).toContainEqual('Cannon use multiple target groups if `scaleOnRequestCount()` is being used.');
        });
    });
});
function mockVpc(stack) {
    return ec2.Vpc.fromVpcAttributes(stack, 'MyVpc', {
        vpcId: 'my-vpc',
        availabilityZones: ['az1'],
        publicSubnetIds: ['pub1'],
        privateSubnetIds: ['pri1'],
        isolatedSubnetIds: [],
    });
}
test('Can set autoScalingGroupName', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyASG', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
        machineImage: new ec2.AmazonLinuxImage(),
        vpc,
        autoScalingGroupName: 'MyAsg',
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
        AutoScalingGroupName: 'MyAsg',
    });
});
test('can use Vpc imported from unparseable list tokens', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpcId = cdk.Fn.importValue('myVpcId');
    const availabilityZones = cdk.Fn.split(',', cdk.Fn.importValue('myAvailabilityZones'));
    const publicSubnetIds = cdk.Fn.split(',', cdk.Fn.importValue('myPublicSubnetIds'));
    const privateSubnetIds = cdk.Fn.split(',', cdk.Fn.importValue('myPrivateSubnetIds'));
    const isolatedSubnetIds = cdk.Fn.split(',', cdk.Fn.importValue('myIsolatedSubnetIds'));
    const vpc = ec2.Vpc.fromVpcAttributes(stack, 'importedVpc', {
        vpcId,
        availabilityZones,
        publicSubnetIds,
        privateSubnetIds,
        isolatedSubnetIds,
    });
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'ecs-ec2-asg', {
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: new ec2.AmazonLinuxImage(),
        minCapacity: 1,
        maxCapacity: 1,
        desiredCapacity: 1,
        vpc,
        allowAllOutbound: false,
        associatePublicIpAddress: false,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
        VPCZoneIdentifier: {
            'Fn::Split': [',', { 'Fn::ImportValue': 'myPrivateSubnetIds' }],
        },
    });
});
test('add price-capacity-optimized', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // WHEN
    const lt = aws_ec2_1.LaunchTemplate.fromLaunchTemplateAttributes(stack, 'imported-lt', {
        launchTemplateId: 'test-lt-id',
        versionNumber: '0',
    });
    new autoscaling.AutoScalingGroup(stack, 'mip-asg', {
        mixedInstancesPolicy: {
            launchTemplate: lt,
            launchTemplateOverrides: [{
                    instanceType: new aws_ec2_1.InstanceType('t4g.micro'),
                    launchTemplate: lt,
                    weightedCapacity: 9,
                }],
            instancesDistribution: {
                onDemandAllocationStrategy: lib_1.OnDemandAllocationStrategy.PRIORITIZED,
                onDemandBaseCapacity: 1,
                onDemandPercentageAboveBaseCapacity: 2,
                spotAllocationStrategy: lib_1.SpotAllocationStrategy.PRICE_CAPACITY_OPTIMIZED,
                spotInstancePools: 3,
                spotMaxPrice: '4',
            },
        },
        vpc: mockVpc(stack),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
        MixedInstancesPolicy: {
            InstancesDistribution: {
                SpotAllocationStrategy: 'price-capacity-optimized',
            },
        },
    });
});
function mockSecurityGroup(stack) {
    return ec2.SecurityGroup.fromSecurityGroupId(stack, 'MySG', 'most-secure');
}
function getTestStack() {
    return new cdk.Stack(undefined, 'TestStack', { env: { account: '1234', region: 'us-east-1' } });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1zY2FsaW5nLWdyb3VwLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhdXRvLXNjYWxpbmctZ3JvdXAudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFtRTtBQUNuRSxzREFBc0Q7QUFDdEQsd0NBQXdDO0FBQ3hDLDhDQUE2SDtBQUM3SCxvRkFBMkg7QUFDM0gsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyw4REFBMEQ7QUFDMUQscUNBQXFDO0FBQ3JDLHNDQUFzQztBQUN0QyxnQ0FBNEU7QUFFNUUsZ0NBQWdDO0FBRWhDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7SUFDbEMsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7UUFDekIsTUFBTSxLQUFLLEdBQUcsWUFBWSxFQUFFLENBQUM7UUFDN0IsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTNCLElBQUksV0FBVyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDakQsWUFBWSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO1lBQy9FLFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtZQUN4QyxHQUFHO1NBQ0osQ0FBQyxDQUFDO1FBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDO1lBQ3hDLFlBQVksRUFBRTtnQkFDWiw0R0FBNEcsRUFBRTtvQkFDNUcsTUFBTSxFQUFFLGlEQUFpRDtvQkFDekQsU0FBUyxFQUFFLDhEQUE4RDtpQkFDMUU7YUFDRjtZQUNELFdBQVcsRUFBRTtnQkFDWCxzQ0FBc0MsRUFBRTtvQkFDdEMsTUFBTSxFQUFFLHlCQUF5QjtvQkFDakMsWUFBWSxFQUFFO3dCQUNaLGtCQUFr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QkFBc0IsQ0FBQyx3QkFBd0I7Z0JBQ3ZFLGlCQUFpQixFQUFFLENBQUM7Z0JBQ3BCLFlBQVksRUFBRSxHQUFHO2FBQ2xCO1NBQ0Y7UUFDRCxHQUFHLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQztLQUNwQixDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsb0NBQW9DLEVBQUU7UUFDcEYsb0JBQW9CLEVBQUU7WUFDcEIscUJBQXFCLEVBQUU7Z0JBQ3JCLHNCQUFzQixFQUFFLDBCQUEwQjthQUNuRDtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFHSCxTQUFTLGlCQUFpQixDQUFDLEtBQWdCO0lBQ3pDLE9BQU8sR0FBRyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQzdFLENBQUM7QUFFRCxTQUFTLFlBQVk7SUFDbkIsT0FBTyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNsRyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5ub3RhdGlvbnMsIE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgY2xvdWR3YXRjaCBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWR3YXRjaCc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgeyBBbWF6b25MaW51eENwdVR5cGUsIEFtYXpvbkxpbnV4R2VuZXJhdGlvbiwgQW1hem9uTGludXhJbWFnZSwgSW5zdGFuY2VUeXBlLCBMYXVuY2hUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0IHsgQXBwbGljYXRpb25MaXN0ZW5lciwgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIsIEFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAgfSBmcm9tICdAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBzbnMgZnJvbSAnQGF3cy1jZGsvYXdzLXNucyc7XG5pbXBvcnQgeyB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBhdXRvc2NhbGluZyBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgT25EZW1hbmRBbGxvY2F0aW9uU3RyYXRlZ3ksIFNwb3RBbGxvY2F0aW9uU3RyYXRlZ3kgfSBmcm9tICcuLi9saWInO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuXG5kZXNjcmliZSgnYXV0byBzY2FsaW5nIGdyb3VwJywgKCkgPT4ge1xuICB0ZXN0KCdkZWZhdWx0IGZsZWV0JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbW9ja1ZwYyhzdGFjayk7XG5cbiAgICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015RmxlZXQnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdQYXJhbWV0ZXJzJzoge1xuICAgICAgICAnU3NtUGFyYW1ldGVyVmFsdWVhd3NzZXJ2aWNlYW1pYW1hem9ubGludXhsYXRlc3RhbXpuYW1paHZteDg2NjRncDJDOTY1ODRCNkYwMEE0NjRFQUQxOTUzQUZGNEIwNTExOFBhcmFtZXRlcic6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlNTTTo6UGFyYW1ldGVyOjpWYWx1ZTxBV1M6OkVDMjo6SW1hZ2U6OklkPicsXG4gICAgICAgICAgJ0RlZmF1bHQnOiAnL2F3cy9zZXJ2aWNlL2FtaS1hbWF6b24tbGludXgtbGF0ZXN0L2Ftem4tYW1pLWh2bS14ODZfNjQtZ3AyJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlGbGVldEluc3RhbmNlU2VjdXJpdHlHcm91cDc3NEU4MjM0Jzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdHcm91cERlc2NyaXB0aW9uJzogJ1Rlc3RTdGFjay9NeUZsZWV0L0luc3RhbmNlU2VjdXJpdHlHcm91cCcsXG4gICAgICAgICAgICAnU2VjdXJpdHlHcm91cEVncmVzcyc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdDaWRySXAnOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgICAgICAgICAnRGVzY3JpcHRpb24nOiAnQWxsb3cgYWxsIG91dGJvdW5kIHRyYWZmaWMgYnkgZGVmYXVsdCcsXG4gICAgICAgICAgICAgICAgJ0lwUHJvdG9jb2wnOiAnLTEnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdUYWdzJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0tleSc6ICdOYW1lJyxcbiAgICAgICAgICAgICAgICAnVmFsdWUnOiAnVGVzdFN0YWNrL015RmxlZXQnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcblxuICAgICAgICAgICAgJ1ZwY0lkJzogJ215LXZwYycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ015RmxlZXRJbnN0YW5jZVJvbGUyNUE4NEFCOCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OklBTTo6Um9sZScsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnQXNzdW1lUm9sZVBvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdBY3Rpb24nOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICAnUHJpbmNpcGFsJzoge1xuICAgICAgICAgICAgICAgICAgICAnU2VydmljZSc6ICdlYzIuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdUYWdzJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0tleSc6ICdOYW1lJyxcbiAgICAgICAgICAgICAgICAnVmFsdWUnOiAnVGVzdFN0YWNrL015RmxlZXQnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnTXlGbGVldEluc3RhbmNlUHJvZmlsZTcwQTU4NDk2Jzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6SUFNOjpJbnN0YW5jZVByb2ZpbGUnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ1JvbGVzJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ1JlZic6ICdNeUZsZWV0SW5zdGFuY2VSb2xlMjVBODRBQjgnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnTXlGbGVldExhdW5jaENvbmZpZzVEN0Y5ODAxJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6QXV0b1NjYWxpbmc6OkxhdW5jaENvbmZpZ3VyYXRpb24nLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ0lhbUluc3RhbmNlUHJvZmlsZSc6IHtcbiAgICAgICAgICAgICAgJ1JlZic6ICdNeUZsZWV0SW5zdGFuY2VQcm9maWxlNzBBNTg0OTYnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdJbWFnZUlkJzogeyAnUmVmJzogJ1NzbVBhcmFtZXRlclZhbHVlYXdzc2VydmljZWFtaWFtYXpvbmxpbnV4bGF0ZXN0YW16bmFtaWh2bXg4NjY0Z3AyQzk2NTg0QjZGMDBBNDY0RUFEMTk1M0FGRjRCMDUxMThQYXJhbWV0ZXInIH0sXG4gICAgICAgICAgICAnSW5zdGFuY2VUeXBlJzogJ200Lm1pY3JvJyxcbiAgICAgICAgICAgICdTZWN1cml0eUdyb3Vwcyc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ015RmxlZXRJbnN0YW5jZVNlY3VyaXR5R3JvdXA3NzRFODIzNCcsXG4gICAgICAgICAgICAgICAgICAnR3JvdXBJZCcsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAnVXNlckRhdGEnOiB7XG4gICAgICAgICAgICAgICdGbjo6QmFzZTY0JzogJyMhL2Jpbi9iYXNoJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnRGVwZW5kc09uJzogW1xuICAgICAgICAgICAgJ015RmxlZXRJbnN0YW5jZVJvbGUyNUE4NEFCOCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ015RmxlZXRBU0c4OEU1NTg4Nic6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJyxcbiAgICAgICAgICAnVXBkYXRlUG9saWN5Jzoge1xuICAgICAgICAgICAgJ0F1dG9TY2FsaW5nU2NoZWR1bGVkQWN0aW9uJzoge1xuICAgICAgICAgICAgICAnSWdub3JlVW5tb2RpZmllZEdyb3VwU2l6ZVByb3BlcnRpZXMnOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ0xhdW5jaENvbmZpZ3VyYXRpb25OYW1lJzoge1xuICAgICAgICAgICAgICAnUmVmJzogJ015RmxlZXRMYXVuY2hDb25maWc1RDdGOTgwMScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1RhZ3MnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnS2V5JzogJ05hbWUnLFxuICAgICAgICAgICAgICAgICdQcm9wYWdhdGVBdExhdW5jaCc6IHRydWUsXG4gICAgICAgICAgICAgICAgJ1ZhbHVlJzogJ1Rlc3RTdGFjay9NeUZsZWV0JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG5cbiAgICAgICAgICAgICdNYXhTaXplJzogJzEnLFxuICAgICAgICAgICAgJ01pblNpemUnOiAnMScsXG4gICAgICAgICAgICAnVlBDWm9uZUlkZW50aWZpZXInOiBbXG4gICAgICAgICAgICAgICdwcmkxJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBzZXQgbWluQ2FwYWNpdHksIG1heENhcGFjaXR5LCBkZXNpcmVkQ2FwYWNpdHkgdG8gMCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2sodW5kZWZpbmVkLCAnTXlTdGFjaycsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScsIGFjY291bnQ6ICcxMjM0JyB9IH0pO1xuICAgIGNvbnN0IHZwYyA9IG1vY2tWcGMoc3RhY2spO1xuXG4gICAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdNeUZsZWV0Jywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLk00LCBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCksXG4gICAgICB2cGMsXG4gICAgICBtaW5DYXBhY2l0eTogMCxcbiAgICAgIG1heENhcGFjaXR5OiAwLFxuICAgICAgZGVzaXJlZENhcGFjaXR5OiAwLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICBNaW5TaXplOiAnMCcsXG4gICAgICBNYXhTaXplOiAnMCcsXG4gICAgICBEZXNpcmVkQ2FwYWNpdHk6ICcwJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndmFsaWRhdGlvbiBpcyBub3QgcGVyZm9ybWVkIHdoZW4gdXNpbmcgVG9rZW5zJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsICdNeVN0YWNrJywgeyBlbnY6IHsgcmVnaW9uOiAndXMtZWFzdC0xJywgYWNjb3VudDogJzEyMzQnIH0gfSk7XG4gICAgY29uc3QgdnBjID0gbW9ja1ZwYyhzdGFjayk7XG5cbiAgICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015RmxlZXQnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHZwYyxcbiAgICAgIG1pbkNhcGFjaXR5OiBjZGsuTGF6eS5udW1iZXIoeyBwcm9kdWNlOiAoKSA9PiA1IH0pLFxuICAgICAgbWF4Q2FwYWNpdHk6IGNkay5MYXp5Lm51bWJlcih7IHByb2R1Y2U6ICgpID0+IDEgfSksXG4gICAgICBkZXNpcmVkQ2FwYWNpdHk6IGNkay5MYXp5Lm51bWJlcih7IHByb2R1Y2U6ICgpID0+IDIwIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTjogbm8gZXhjZXB0aW9uXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICBNaW5TaXplOiAnNScsXG4gICAgICBNYXhTaXplOiAnMScsXG4gICAgICBEZXNpcmVkQ2FwYWNpdHk6ICcyMCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3VzZXJkYXRhIGNhbiBiZSBvdmVycmlkZGVuIGJ5IGltYWdlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbW9ja1ZwYyhzdGFjayk7XG5cbiAgICBjb25zdCB1ZCA9IGVjMi5Vc2VyRGF0YS5mb3JMaW51eCgpO1xuICAgIHVkLmFkZENvbW1hbmRzKCdpdCBtZSEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc2cgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015RmxlZXQnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2Uoe1xuICAgICAgICB1c2VyRGF0YTogdWQsXG4gICAgICB9KSxcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoYXNnLnVzZXJEYXRhLnJlbmRlcigpKS50b0VxdWFsKCcjIS9iaW4vYmFzaFxcbml0IG1lIScpO1xuICB9KTtcblxuICB0ZXN0KCd1c2VyZGF0YSBjYW4gYmUgb3ZlcnJpZGRlbiBhdCBBU0cgZGlyZWN0bHknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBtb2NrVnBjKHN0YWNrKTtcblxuICAgIGNvbnN0IHVkMSA9IGVjMi5Vc2VyRGF0YS5mb3JMaW51eCgpO1xuICAgIHVkMS5hZGRDb21tYW5kcygnaXQgbWUhJyk7XG5cbiAgICBjb25zdCB1ZDIgPSBlYzIuVXNlckRhdGEuZm9yTGludXgoKTtcbiAgICB1ZDIuYWRkQ29tbWFuZHMoJ25vIG1lIScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFzZyA9IG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnTXlGbGVldCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSh7XG4gICAgICAgIHVzZXJEYXRhOiB1ZDEsXG4gICAgICB9KSxcbiAgICAgIHZwYyxcbiAgICAgIHVzZXJEYXRhOiB1ZDIsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGFzZy51c2VyRGF0YS5yZW5kZXIoKSkudG9FcXVhbCgnIyEvYmluL2Jhc2hcXG5ubyBtZSEnKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHNwZWNpZnkgb25seSBtaW4gY2FwYWNpdHknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBtb2NrVnBjKHN0YWNrKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015RmxlZXQnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHZwYyxcbiAgICAgIG1pbkNhcGFjaXR5OiAxMCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIE1pblNpemU6ICcxMCcsXG4gICAgICBNYXhTaXplOiAnMTAnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gc3BlY2lmeSBvbmx5IG1heCBjYXBhY2l0eScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG1vY2tWcGMoc3RhY2spO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnTXlGbGVldCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgdnBjLFxuICAgICAgbWF4Q2FwYWNpdHk6IDEwLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgTWluU2l6ZTogJzEnLFxuICAgICAgTWF4U2l6ZTogJzEwJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHNwZWNpZnkgb25seSBkZXNpcmVkQ291bnQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBtb2NrVnBjKHN0YWNrKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015RmxlZXQnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHZwYyxcbiAgICAgIGRlc2lyZWRDYXBhY2l0eTogMTAsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICBNaW5TaXplOiAnMScsXG4gICAgICBNYXhTaXplOiAnMTAnLFxuICAgICAgRGVzaXJlZENhcGFjaXR5OiAnMTAnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gc3BlY2lmeSBvbmx5IGRlZmF1bHRJbnN0YW5jZVdhcm11cCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG1vY2tWcGMoc3RhY2spO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnTXlGbGVldCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgdnBjLFxuICAgICAgZGVmYXVsdEluc3RhbmNlV2FybXVwOiBjZGsuRHVyYXRpb24uc2Vjb25kcyg1KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIERlZmF1bHRJbnN0YW5jZVdhcm11cDogNSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkVG9Sb2xlUG9saWN5IGNhbiBiZSB1c2VkIHRvIGFkZCBzdGF0ZW1lbnRzIHRvIHRoZSByb2xlIHBvbGljeScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2sodW5kZWZpbmVkLCAnTXlTdGFjaycsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScsIGFjY291bnQ6ICcxMjM0JyB9IH0pO1xuICAgIGNvbnN0IHZwYyA9IG1vY2tWcGMoc3RhY2spO1xuXG4gICAgY29uc3QgZmxlZXQgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015RmxlZXQnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIGZsZWV0LmFkZFRvUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ3Rlc3Q6U3BlY2lhbE5hbWUnXSxcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgfSkpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ3Rlc3Q6U3BlY2lhbE5hbWUnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnY2FuIGNvbmZpZ3VyZSByZXBsYWNpbmcgdXBkYXRlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgJ015U3RhY2snLCB7IGVudjogeyByZWdpb246ICd1cy1lYXN0LTEnLCBhY2NvdW50OiAnMTIzNCcgfSB9KTtcbiAgICBjb25zdCB2cGMgPSBtb2NrVnBjKHN0YWNrKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015RmxlZXQnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHZwYyxcbiAgICAgIHVwZGF0ZVR5cGU6IGF1dG9zY2FsaW5nLlVwZGF0ZVR5cGUuUkVQTEFDSU5HX1VQREFURSxcbiAgICAgIHJlcGxhY2luZ1VwZGF0ZU1pblN1Y2Nlc3NmdWxJbnN0YW5jZXNQZXJjZW50OiA1MCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgVXBkYXRlUG9saWN5OiB7XG4gICAgICAgIEF1dG9TY2FsaW5nUmVwbGFjaW5nVXBkYXRlOiB7XG4gICAgICAgICAgV2lsbFJlcGxhY2U6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgQ3JlYXRpb25Qb2xpY3k6IHtcbiAgICAgICAgQXV0b1NjYWxpbmdDcmVhdGlvblBvbGljeToge1xuICAgICAgICAgIE1pblN1Y2Nlc3NmdWxJbnN0YW5jZXNQZXJjZW50OiA1MCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdjYW4gY29uZmlndXJlIHJvbGxpbmcgdXBkYXRlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgJ015U3RhY2snLCB7IGVudjogeyByZWdpb246ICd1cy1lYXN0LTEnLCBhY2NvdW50OiAnMTIzNCcgfSB9KTtcbiAgICBjb25zdCB2cGMgPSBtb2NrVnBjKHN0YWNrKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015RmxlZXQnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHZwYyxcbiAgICAgIHVwZGF0ZVR5cGU6IGF1dG9zY2FsaW5nLlVwZGF0ZVR5cGUuUk9MTElOR19VUERBVEUsXG4gICAgICByb2xsaW5nVXBkYXRlQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBtaW5TdWNjZXNzZnVsSW5zdGFuY2VzUGVyY2VudDogNTAsXG4gICAgICAgIHBhdXNlVGltZTogY2RrLkR1cmF0aW9uLnNlY29uZHMoMzQ1KSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIFVwZGF0ZVBvbGljeToge1xuICAgICAgICAnQXV0b1NjYWxpbmdSb2xsaW5nVXBkYXRlJzoge1xuICAgICAgICAgICdNaW5TdWNjZXNzZnVsSW5zdGFuY2VzUGVyY2VudCc6IDUwLFxuICAgICAgICAgICdXYWl0T25SZXNvdXJjZVNpZ25hbHMnOiB0cnVlLFxuICAgICAgICAgICdQYXVzZVRpbWUnOiAnUFQ1TTQ1UycsXG4gICAgICAgICAgJ1N1c3BlbmRQcm9jZXNzZXMnOiBbJ0hlYWx0aENoZWNrJywgJ1JlcGxhY2VVbmhlYWx0aHknLCAnQVpSZWJhbGFuY2UnLCAnQWxhcm1Ob3RpZmljYXRpb24nLCAnU2NoZWR1bGVkQWN0aW9ucyddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2NhbiBjb25maWd1cmUgcmVzb3VyY2Ugc2lnbmFscycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsICdNeVN0YWNrJywgeyBlbnY6IHsgcmVnaW9uOiAndXMtZWFzdC0xJywgYWNjb3VudDogJzEyMzQnIH0gfSk7XG4gICAgY29uc3QgdnBjID0gbW9ja1ZwYyhzdGFjayk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdNeUZsZWV0Jywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLk00LCBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCksXG4gICAgICB2cGMsXG4gICAgICByZXNvdXJjZVNpZ25hbENvdW50OiA1LFxuICAgICAgcmVzb3VyY2VTaWduYWxUaW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcyg2NjYpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICBDcmVhdGlvblBvbGljeToge1xuICAgICAgICBSZXNvdXJjZVNpZ25hbDoge1xuICAgICAgICAgIENvdW50OiA1LFxuICAgICAgICAgIFRpbWVvdXQ6ICdQVDExTTZTJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBjb25maWd1cmUgRUMyIGhlYWx0aCBjaGVjaycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsICdNeVN0YWNrJywgeyBlbnY6IHsgcmVnaW9uOiAndXMtZWFzdC0xJywgYWNjb3VudDogJzEyMzQnIH0gfSk7XG4gICAgY29uc3QgdnBjID0gbW9ja1ZwYyhzdGFjayk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdNeUZsZWV0Jywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLk00LCBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCksXG4gICAgICB2cGMsXG4gICAgICBoZWFsdGhDaGVjazogYXV0b3NjYWxpbmcuSGVhbHRoQ2hlY2suZWMyKCksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICBIZWFsdGhDaGVja1R5cGU6ICdFQzInLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gY29uZmlndXJlIEVCUyBoZWFsdGggY2hlY2snLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2sodW5kZWZpbmVkLCAnTXlTdGFjaycsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScsIGFjY291bnQ6ICcxMjM0JyB9IH0pO1xuICAgIGNvbnN0IHZwYyA9IG1vY2tWcGMoc3RhY2spO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnTXlGbGVldCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgdnBjLFxuICAgICAgaGVhbHRoQ2hlY2s6IGF1dG9zY2FsaW5nLkhlYWx0aENoZWNrLmVsYih7IGdyYWNlOiBjZGsuRHVyYXRpb24ubWludXRlcygxNSkgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICBIZWFsdGhDaGVja1R5cGU6ICdFTEInLFxuICAgICAgSGVhbHRoQ2hlY2tHcmFjZVBlcmlvZDogOTAwLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYWRkIFNlY3VyaXR5IEdyb3VwIHRvIEZsZWV0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgJ015U3RhY2snLCB7IGVudjogeyByZWdpb246ICd1cy1lYXN0LTEnLCBhY2NvdW50OiAnMTIzNCcgfSB9KTtcbiAgICBjb25zdCB2cGMgPSBtb2NrVnBjKHN0YWNrKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc2cgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015RmxlZXQnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHZwYyxcbiAgICB9KTtcbiAgICBhc2cuYWRkU2VjdXJpdHlHcm91cChtb2NrU2VjdXJpdHlHcm91cChzdGFjaykpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpMYXVuY2hDb25maWd1cmF0aW9uJywge1xuICAgICAgU2VjdXJpdHlHcm91cHM6IFtcbiAgICAgICAge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ015RmxlZXRJbnN0YW5jZVNlY3VyaXR5R3JvdXA3NzRFODIzNCcsXG4gICAgICAgICAgICAnR3JvdXBJZCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ21vc3Qtc2VjdXJlJyxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBzZXQgdGFncycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgLy8gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsICdNeVN0YWNrJywgeyBlbnY6IHsgcmVnaW9uOiAndXMtZWFzdC0xJywgYWNjb3VudDogJzEyMzQnIH19KTtcbiAgICBjb25zdCB2cGMgPSBtb2NrVnBjKHN0YWNrKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc2cgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015RmxlZXQnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHZwYyxcbiAgICAgIHVwZGF0ZVBvbGljeTogYXV0b3NjYWxpbmcuVXBkYXRlUG9saWN5LnJvbGxpbmdVcGRhdGUoKSxcbiAgICB9KTtcblxuICAgIGNkay5UYWdzLm9mKGFzZykuYWRkKCdzdXBlcmZvb2QnLCAnYWNhaScpO1xuICAgIGNkay5UYWdzLm9mKGFzZykuYWRkKCdub3RzdXBlcicsICdjYXJhbWVsJywgeyBhcHBseVRvTGF1bmNoZWRJbnN0YW5jZXM6IGZhbHNlIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgVGFnczogW1xuICAgICAgICB7XG4gICAgICAgICAgS2V5OiAnTmFtZScsXG4gICAgICAgICAgUHJvcGFnYXRlQXRMYXVuY2g6IHRydWUsXG4gICAgICAgICAgVmFsdWU6ICdUZXN0U3RhY2svTXlGbGVldCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBLZXk6ICdub3RzdXBlcicsXG4gICAgICAgICAgUHJvcGFnYXRlQXRMYXVuY2g6IGZhbHNlLFxuICAgICAgICAgIFZhbHVlOiAnY2FyYW1lbCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBLZXk6ICdzdXBlcmZvb2QnLFxuICAgICAgICAgIFByb3BhZ2F0ZUF0TGF1bmNoOiB0cnVlLFxuICAgICAgICAgIFZhbHVlOiAnYWNhaScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhbGxvd3Mgc2V0dGluZyBzcG90IHByaWNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbW9ja1ZwYyhzdGFjayk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXNnID0gbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdNeVN0YWNrJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLk00LCBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCksXG4gICAgICB2cGMsXG5cbiAgICAgIHNwb3RQcmljZTogJzAuMDUnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChhc2cuc3BvdFByaWNlKS50b0VxdWFsKCcwLjA1Jyk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkxhdW5jaENvbmZpZ3VyYXRpb24nLCB7XG4gICAgICBTcG90UHJpY2U6ICcwLjA1JyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWxsb3dzIGFzc29jaWF0aW9uIG9mIHB1YmxpYyBJUCBhZGRyZXNzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbW9ja1ZwYyhzdGFjayk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdNeVN0YWNrJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLk00LCBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCksXG4gICAgICB2cGMsXG4gICAgICBtaW5DYXBhY2l0eTogMCxcbiAgICAgIG1heENhcGFjaXR5OiAwLFxuICAgICAgZGVzaXJlZENhcGFjaXR5OiAwLFxuXG4gICAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9LFxuICAgICAgYXNzb2NpYXRlUHVibGljSXBBZGRyZXNzOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpMYXVuY2hDb25maWd1cmF0aW9uJywge1xuICAgICAgQXNzb2NpYXRlUHVibGljSXBBZGRyZXNzOiB0cnVlLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhc3NvY2lhdGlvbiBvZiBwdWJsaWMgSVAgYWRkcmVzcyByZXF1aXJlcyBwdWJsaWMgc3VibmV0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbW9ja1ZwYyhzdGFjayk7XG5cbiAgICAvLyBXSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnTXlTdGFjaycsIHtcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLk00LCBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPKSxcbiAgICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgICAgdnBjLFxuICAgICAgICBtaW5DYXBhY2l0eTogMCxcbiAgICAgICAgbWF4Q2FwYWNpdHk6IDAsXG4gICAgICAgIGRlc2lyZWRDYXBhY2l0eTogMCxcbiAgICAgICAgYXNzb2NpYXRlUHVibGljSXBBZGRyZXNzOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygpO1xuICB9KTtcblxuICB0ZXN0KCdhbGxvd3MgZGlzYXNzb2NpYXRpb24gb2YgcHVibGljIElQIGFkZHJlc3MnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBtb2NrVnBjKHN0YWNrKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015U3RhY2snLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHZwYyxcbiAgICAgIG1pbkNhcGFjaXR5OiAwLFxuICAgICAgbWF4Q2FwYWNpdHk6IDAsXG4gICAgICBkZXNpcmVkQ2FwYWNpdHk6IDAsXG4gICAgICBhc3NvY2lhdGVQdWJsaWNJcEFkZHJlc3M6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpMYXVuY2hDb25maWd1cmF0aW9uJywge1xuICAgICAgQXNzb2NpYXRlUHVibGljSXBBZGRyZXNzOiBmYWxzZSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZG9lcyBub3Qgc3BlY2lmeSBwdWJsaWMgSVAgYWRkcmVzcyBhc3NvY2lhdGlvbiBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbW9ja1ZwYyhzdGFjayk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdNeVN0YWNrJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLk00LCBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCksXG4gICAgICB2cGMsXG4gICAgICBtaW5DYXBhY2l0eTogMCxcbiAgICAgIG1heENhcGFjaXR5OiAwLFxuICAgICAgZGVzaXJlZENhcGFjaXR5OiAwLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpMYXVuY2hDb25maWd1cmF0aW9uJywge1xuICAgICAgQXNzb2NpYXRlUHVibGljSXBBZGRyZXNzOiBNYXRjaC5hYnNlbnQoKSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYW4gZXhpc3Rpbmcgc2VjdXJpdHkgZ3JvdXAgY2FuIGJlIHNwZWNpZmllZCBpbnN0ZWFkIG9mIGF1dG8tY3JlYXRlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG1vY2tWcGMoc3RhY2spO1xuICAgIGNvbnN0IHNlY3VyaXR5R3JvdXAgPSBlYzIuU2VjdXJpdHlHcm91cC5mcm9tU2VjdXJpdHlHcm91cElkKHN0YWNrLCAnTXlTRycsICdtb3N0LXNlY3VyZScpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnTXlBU0cnLCB7XG4gICAgICB2cGMsXG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHNlY3VyaXR5R3JvdXAsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkxhdW5jaENvbmZpZ3VyYXRpb24nLCB7XG4gICAgICBTZWN1cml0eUdyb3VwczogWydtb3N0LXNlY3VyZSddLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhbiBleGlzdGluZyByb2xlIGNhbiBiZSBzcGVjaWZpZWQgaW5zdGVhZCBvZiBhdXRvLWNyZWF0ZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBtb2NrVnBjKHN0YWNrKTtcbiAgICBjb25zdCBpbXBvcnRlZFJvbGUgPSBpYW0uUm9sZS5mcm9tUm9sZUFybihzdGFjaywgJ0ltcG9ydGVkUm9sZScsICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvSGVsbG9EdWRlJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXNnID0gbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdNeUFTRycsIHtcbiAgICAgIHZwYyxcbiAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgcm9sZTogaW1wb3J0ZWRSb2xlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChhc2cucm9sZSkudG9FcXVhbChpbXBvcnRlZFJvbGUpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6SW5zdGFuY2VQcm9maWxlJywge1xuICAgICAgJ1JvbGVzJzogWydIZWxsb0R1ZGUnXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZGVmYXVsdENoaWxkIGlzIGF2YWlsYWJsZSBvbiBhbiBBU0cnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBtb2NrVnBjKHN0YWNrKTtcbiAgICBjb25zdCBhc2cgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015U3RhY2snLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoYXNnLm5vZGUuZGVmYXVsdENoaWxkIGluc3RhbmNlb2YgYXV0b3NjYWxpbmcuQ2ZuQXV0b1NjYWxpbmdHcm91cCkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2NhbiBzZXQgYmxvY2tEZXZpY2VNYXBwaW5ncycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG1vY2tWcGMoc3RhY2spO1xuICAgIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnTXlTdGFjaycsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgdnBjLFxuICAgICAgYmxvY2tEZXZpY2VzOiBbe1xuICAgICAgICBkZXZpY2VOYW1lOiAnZWJzJyxcbiAgICAgICAgbWFwcGluZ0VuYWJsZWQ6IHRydWUsXG4gICAgICAgIHZvbHVtZTogYXV0b3NjYWxpbmcuQmxvY2tEZXZpY2VWb2x1bWUuZWJzKDE1LCB7XG4gICAgICAgICAgZGVsZXRlT25UZXJtaW5hdGlvbjogdHJ1ZSxcbiAgICAgICAgICBlbmNyeXB0ZWQ6IHRydWUsXG4gICAgICAgICAgdm9sdW1lVHlwZTogYXV0b3NjYWxpbmcuRWJzRGV2aWNlVm9sdW1lVHlwZS5JTzEsXG4gICAgICAgICAgaW9wczogNTAwMCxcbiAgICAgICAgfSksXG4gICAgICB9LCB7XG4gICAgICAgIGRldmljZU5hbWU6ICdlYnMtc25hcHNob3QnLFxuICAgICAgICB2b2x1bWU6IGF1dG9zY2FsaW5nLkJsb2NrRGV2aWNlVm9sdW1lLmVic0Zyb21TbmFwc2hvdCgnc25hcHNob3QtaWQnLCB7XG4gICAgICAgICAgdm9sdW1lU2l6ZTogNTAwLFxuICAgICAgICAgIGRlbGV0ZU9uVGVybWluYXRpb246IGZhbHNlLFxuICAgICAgICAgIHZvbHVtZVR5cGU6IGF1dG9zY2FsaW5nLkVic0RldmljZVZvbHVtZVR5cGUuU0MxLFxuICAgICAgICB9KSxcbiAgICAgIH0sIHtcbiAgICAgICAgZGV2aWNlTmFtZTogJ2VwaGVtZXJhbCcsXG4gICAgICAgIHZvbHVtZTogYXV0b3NjYWxpbmcuQmxvY2tEZXZpY2VWb2x1bWUuZXBoZW1lcmFsKDApLFxuICAgICAgfSwge1xuICAgICAgICBkZXZpY2VOYW1lOiAnZGlzYWJsZWQnLFxuICAgICAgICB2b2x1bWU6IGF1dG9zY2FsaW5nLkJsb2NrRGV2aWNlVm9sdW1lLmVwaGVtZXJhbCgxKSxcbiAgICAgICAgbWFwcGluZ0VuYWJsZWQ6IGZhbHNlLFxuICAgICAgfSwge1xuICAgICAgICBkZXZpY2VOYW1lOiAnbm9uZScsXG4gICAgICAgIHZvbHVtZTogYXV0b3NjYWxpbmcuQmxvY2tEZXZpY2VWb2x1bWUubm9EZXZpY2UoKSxcbiAgICAgIH0sIHtcbiAgICAgICAgZGV2aWNlTmFtZTogJ2dwMy13aXRoLXRocm91Z2hwdXQnLFxuICAgICAgICB2b2x1bWU6IGF1dG9zY2FsaW5nLkJsb2NrRGV2aWNlVm9sdW1lLmVicygxNSwge1xuICAgICAgICAgIHZvbHVtZVR5cGU6IGF1dG9zY2FsaW5nLkVic0RldmljZVZvbHVtZVR5cGUuR1AzLFxuICAgICAgICAgIHRocm91Z2hwdXQ6IDM1MCxcbiAgICAgICAgfSksXG4gICAgICB9XSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6TGF1bmNoQ29uZmlndXJhdGlvbicsIHtcbiAgICAgIEJsb2NrRGV2aWNlTWFwcGluZ3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIERldmljZU5hbWU6ICdlYnMnLFxuICAgICAgICAgIEViczoge1xuICAgICAgICAgICAgRGVsZXRlT25UZXJtaW5hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIEVuY3J5cHRlZDogdHJ1ZSxcbiAgICAgICAgICAgIElvcHM6IDUwMDAsXG4gICAgICAgICAgICBWb2x1bWVTaXplOiAxNSxcbiAgICAgICAgICAgIFZvbHVtZVR5cGU6ICdpbzEnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgTm9EZXZpY2U6IE1hdGNoLmFic2VudCgpLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgRGV2aWNlTmFtZTogJ2Vicy1zbmFwc2hvdCcsXG4gICAgICAgICAgRWJzOiB7XG4gICAgICAgICAgICBEZWxldGVPblRlcm1pbmF0aW9uOiBmYWxzZSxcbiAgICAgICAgICAgIFNuYXBzaG90SWQ6ICdzbmFwc2hvdC1pZCcsXG4gICAgICAgICAgICBWb2x1bWVTaXplOiA1MDAsXG4gICAgICAgICAgICBWb2x1bWVUeXBlOiAnc2MxJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIE5vRGV2aWNlOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIERldmljZU5hbWU6ICdlcGhlbWVyYWwnLFxuICAgICAgICAgIFZpcnR1YWxOYW1lOiAnZXBoZW1lcmFsMCcsXG4gICAgICAgICAgTm9EZXZpY2U6IE1hdGNoLmFic2VudCgpLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgRGV2aWNlTmFtZTogJ2Rpc2FibGVkJyxcbiAgICAgICAgICBOb0RldmljZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIERldmljZU5hbWU6ICdub25lJyxcbiAgICAgICAgICBOb0RldmljZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIERldmljZU5hbWU6ICdncDMtd2l0aC10aHJvdWdocHV0JyxcbiAgICAgICAgICBFYnM6IHtcbiAgICAgICAgICAgIFZvbHVtZVNpemU6IDE1LFxuICAgICAgICAgICAgVm9sdW1lVHlwZTogJ2dwMycsXG4gICAgICAgICAgICBUaHJvdWdocHV0OiAzNTAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBjb25maWd1cmUgbWF4SW5zdGFuY2VMaWZldGltZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG1vY2tWcGMoc3RhY2spO1xuICAgIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnTXlTdGFjaycsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgdnBjLFxuICAgICAgbWF4SW5zdGFuY2VMaWZldGltZTogY2RrLkR1cmF0aW9uLmRheXMoNyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICAnTWF4SW5zdGFuY2VMaWZldGltZSc6IDYwNDgwMCxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGNvbmZpZ3VyZSBtYXhJbnN0YW5jZUxpZmV0aW1lIHdpdGggMCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG1vY2tWcGMoc3RhY2spO1xuICAgIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnTXlTdGFjaycsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgdnBjLFxuICAgICAgbWF4SW5zdGFuY2VMaWZldGltZTogY2RrLkR1cmF0aW9uLmRheXMoMCksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICAnTWF4SW5zdGFuY2VMaWZldGltZSc6IDAsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBpZiBtYXhJbnN0YW5jZUxpZmV0aW1lIDwgMSBkYXknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBtb2NrVnBjKHN0YWNrKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdNeVN0YWNrJywge1xuICAgICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgICB2cGMsXG4gICAgICAgIG1heEluc3RhbmNlTGlmZXRpbWU6IGNkay5EdXJhdGlvbi5ob3VycygyMyksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9tYXhJbnN0YW5jZUxpZmV0aW1lIG11c3QgYmUgYmV0d2VlbiAxIGFuZCAzNjUgZGF5cyBcXChpbmNsdXNpdmVcXCkvKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIGlmIG1heEluc3RhbmNlTGlmZXRpbWUgPiAzNjUgZGF5cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG1vY2tWcGMoc3RhY2spO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015U3RhY2snLCB7XG4gICAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCksXG4gICAgICAgIHZwYyxcbiAgICAgICAgbWF4SW5zdGFuY2VMaWZldGltZTogY2RrLkR1cmF0aW9uLmRheXMoMzY2KSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL21heEluc3RhbmNlTGlmZXRpbWUgbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDM2NSBkYXlzIFxcKGluY2x1c2l2ZVxcKS8pO1xuICB9KTtcblxuICB0ZXN0LmVhY2goWzEyNCwgMTAwMV0pKCd0aHJvd3MgaWYgdGhyb3VnaHB1dCBpcyBzZXQgbGVzcyB0aGFuIDEyNSBvciBtb3JlIHRoYW4gMTAwMCcsICh0aHJvdWdocHV0KSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbW9ja1ZwYyhzdGFjayk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdNeVN0YWNrJywge1xuICAgICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgICB2cGMsXG4gICAgICAgIG1heEluc3RhbmNlTGlmZXRpbWU6IGNkay5EdXJhdGlvbi5kYXlzKDApLFxuICAgICAgICBibG9ja0RldmljZXM6IFt7XG4gICAgICAgICAgZGV2aWNlTmFtZTogJ2VicycsXG4gICAgICAgICAgdm9sdW1lOiBhdXRvc2NhbGluZy5CbG9ja0RldmljZVZvbHVtZS5lYnMoMTUsIHtcbiAgICAgICAgICAgIHZvbHVtZVR5cGU6IGF1dG9zY2FsaW5nLkVic0RldmljZVZvbHVtZVR5cGUuR1AzLFxuICAgICAgICAgICAgdGhyb3VnaHB1dCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfV0sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC90aHJvdWdocHV0IHByb3BlcnR5IHRha2VzIGEgbWluaW11bSBvZiAxMjUgYW5kIGEgbWF4aW11bSBvZiAxMDAwLyk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChbXG4gICAgLi4uT2JqZWN0LnZhbHVlcyhhdXRvc2NhbGluZy5FYnNEZXZpY2VWb2x1bWVUeXBlKS5maWx0ZXIoKHYpID0+IHYgIT09ICdncDMnKSxcbiAgXSkoJ3Rocm93cyBpZiB0aHJvdWdocHV0IGlzIHNldCBvbiBhbnkgdm9sdW1lIHR5cGUgb3RoZXIgdGhhbiBHUDMnLCAodm9sdW1lVHlwZSkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG1vY2tWcGMoc3RhY2spO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnTXlTdGFjaycsIHtcbiAgICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLk00LCBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPKSxcbiAgICAgICAgdnBjLFxuICAgICAgICBtYXhJbnN0YW5jZUxpZmV0aW1lOiBjZGsuRHVyYXRpb24uZGF5cygwKSxcbiAgICAgICAgYmxvY2tEZXZpY2VzOiBbe1xuICAgICAgICAgIGRldmljZU5hbWU6ICdlYnMnLFxuICAgICAgICAgIHZvbHVtZTogYXV0b3NjYWxpbmcuQmxvY2tEZXZpY2VWb2x1bWUuZWJzKDE1LCB7XG4gICAgICAgICAgICB2b2x1bWVUeXBlOiB2b2x1bWVUeXBlLFxuICAgICAgICAgICAgdGhyb3VnaHB1dDogMTUwLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL3Rocm91Z2hwdXQgcHJvcGVydHkgcmVxdWlyZXMgdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5HUDMvKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIGlmIHRocm91Z2hwdXQgLyBpb3BzIHJhdGlvIGlzIGdyZWF0ZXIgdGhhbiAwLjI1JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG1vY2tWcGMoc3RhY2spO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015U3RhY2snLCB7XG4gICAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCksXG4gICAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgICAgIHZwYyxcbiAgICAgICAgbWF4SW5zdGFuY2VMaWZldGltZTogY2RrLkR1cmF0aW9uLmRheXMoMCksXG4gICAgICAgIGJsb2NrRGV2aWNlczogW3tcbiAgICAgICAgICBkZXZpY2VOYW1lOiAnZWJzJyxcbiAgICAgICAgICB2b2x1bWU6IGF1dG9zY2FsaW5nLkJsb2NrRGV2aWNlVm9sdW1lLmVicygxNSwge1xuICAgICAgICAgICAgdm9sdW1lVHlwZTogYXV0b3NjYWxpbmcuRWJzRGV2aWNlVm9sdW1lVHlwZS5HUDMsXG4gICAgICAgICAgICB0aHJvdWdocHV0OiA3NTEsXG4gICAgICAgICAgICBpb3BzOiAzMDAwLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coJ1Rocm91Z2hwdXQgKE1pQnBzKSB0byBpb3BzIHJhdGlvIG9mIDAuMjUwMzMzMzMzMzMzMzMzMzUgaXMgdG9vIGhpZ2g7IG1heGltdW0gaXMgMC4yNSBNaUJwcyBwZXIgaW9wcycpO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gY29uZmlndXJlIGluc3RhbmNlIG1vbml0b3JpbmcnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBtb2NrVnBjKHN0YWNrKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015U3RhY2snLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHZwYyxcbiAgICAgIGluc3RhbmNlTW9uaXRvcmluZzogYXV0b3NjYWxpbmcuTW9uaXRvcmluZy5CQVNJQyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6TGF1bmNoQ29uZmlndXJhdGlvbicsIHtcbiAgICAgIEluc3RhbmNlTW9uaXRvcmluZzogZmFsc2UsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2luc3RhbmNlIG1vbml0b3JpbmcgZGVmYXVsdHMgdG8gYWJzZW50JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbW9ja1ZwYyhzdGFjayk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdNeVN0YWNrJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLk00LCBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCksXG4gICAgICB2cGMsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkxhdW5jaENvbmZpZ3VyYXRpb24nLCB7XG4gICAgICBJbnN0YW5jZU1vbml0b3Jpbmc6IE1hdGNoLmFic2VudCgpLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3MgaWYgZXBoZW1lcmFsIHZvbHVtZUluZGV4IDwgMCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG1vY2tWcGMoc3RhY2spO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015U3RhY2snLCB7XG4gICAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCksXG4gICAgICAgIHZwYyxcbiAgICAgICAgYmxvY2tEZXZpY2VzOiBbe1xuICAgICAgICAgIGRldmljZU5hbWU6ICdlcGhlbWVyYWwnLFxuICAgICAgICAgIHZvbHVtZTogYXV0b3NjYWxpbmcuQmxvY2tEZXZpY2VWb2x1bWUuZXBoZW1lcmFsKC0xKSxcbiAgICAgICAgfV0sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC92b2x1bWVJbmRleCBtdXN0IGJlIGEgbnVtYmVyIHN0YXJ0aW5nIGZyb20gMC8pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3MgaWYgdm9sdW1lVHlwZSA9PT0gSU8xIHdpdGhvdXQgaW9wcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG1vY2tWcGMoc3RhY2spO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015U3RhY2snLCB7XG4gICAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCksXG4gICAgICAgIHZwYyxcbiAgICAgICAgYmxvY2tEZXZpY2VzOiBbe1xuICAgICAgICAgIGRldmljZU5hbWU6ICdlYnMnLFxuICAgICAgICAgIHZvbHVtZTogYXV0b3NjYWxpbmcuQmxvY2tEZXZpY2VWb2x1bWUuZWJzKDE1LCB7XG4gICAgICAgICAgICBkZWxldGVPblRlcm1pbmF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgZW5jcnlwdGVkOiB0cnVlLFxuICAgICAgICAgICAgdm9sdW1lVHlwZTogYXV0b3NjYWxpbmcuRWJzRGV2aWNlVm9sdW1lVHlwZS5JTzEsXG4gICAgICAgICAgfSksXG4gICAgICAgIH1dLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvb3BzIHByb3BlcnR5IGlzIHJlcXVpcmVkIHdpdGggdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5JTzEvKTtcbiAgfSk7XG5cbiAgdGVzdCgnd2FybmluZyBpZiBpb3BzIHdpdGhvdXQgdm9sdW1lVHlwZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG1vY2tWcGMoc3RhY2spO1xuXG4gICAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdNeVN0YWNrJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLk00LCBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCksXG4gICAgICB2cGMsXG4gICAgICBibG9ja0RldmljZXM6IFt7XG4gICAgICAgIGRldmljZU5hbWU6ICdlYnMnLFxuICAgICAgICB2b2x1bWU6IGF1dG9zY2FsaW5nLkJsb2NrRGV2aWNlVm9sdW1lLmVicygxNSwge1xuICAgICAgICAgIGRlbGV0ZU9uVGVybWluYXRpb246IHRydWUsXG4gICAgICAgICAgZW5jcnlwdGVkOiB0cnVlLFxuICAgICAgICAgIGlvcHM6IDUwMDAsXG4gICAgICAgIH0pLFxuICAgICAgfV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5oYXNXYXJuaW5nKCcvRGVmYXVsdC9NeVN0YWNrJywgJ2lvcHMgd2lsbCBiZSBpZ25vcmVkIHdpdGhvdXQgdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5JTzEnKTtcbiAgfSk7XG5cbiAgdGVzdCgnd2FybmluZyBpZiBpb3BzIGFuZCB2b2x1bWVUeXBlICE9PSBJTzEnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBtb2NrVnBjKHN0YWNrKTtcblxuICAgIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnTXlTdGFjaycsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgdnBjLFxuICAgICAgYmxvY2tEZXZpY2VzOiBbe1xuICAgICAgICBkZXZpY2VOYW1lOiAnZWJzJyxcbiAgICAgICAgdm9sdW1lOiBhdXRvc2NhbGluZy5CbG9ja0RldmljZVZvbHVtZS5lYnMoMTUsIHtcbiAgICAgICAgICBkZWxldGVPblRlcm1pbmF0aW9uOiB0cnVlLFxuICAgICAgICAgIGVuY3J5cHRlZDogdHJ1ZSxcbiAgICAgICAgICB2b2x1bWVUeXBlOiBhdXRvc2NhbGluZy5FYnNEZXZpY2VWb2x1bWVUeXBlLkdQMixcbiAgICAgICAgICBpb3BzOiA1MDAwLFxuICAgICAgICB9KSxcbiAgICAgIH1dLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIEFubm90YXRpb25zLmZyb21TdGFjayhzdGFjaykuaGFzV2FybmluZygnL0RlZmF1bHQvTXlTdGFjaycsICdpb3BzIHdpbGwgYmUgaWdub3JlZCB3aXRob3V0IHZvbHVtZVR5cGU6IEVic0RldmljZVZvbHVtZVR5cGUuSU8xJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0ZXAgc2NhbGluZyBvbiBtZXRyaWMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBtb2NrVnBjKHN0YWNrKTtcbiAgICBjb25zdCBhc2cgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015U3RhY2snLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBhc2cuc2NhbGVPbk1ldHJpYygnTWV0cmljJywge1xuICAgICAgbWV0cmljOiBuZXcgY2xvdWR3YXRjaC5NZXRyaWMoe1xuICAgICAgICBuYW1lc3BhY2U6ICdUZXN0JyxcbiAgICAgICAgbWV0cmljTmFtZTogJ01ldHJpYycsXG4gICAgICB9KSxcbiAgICAgIGFkanVzdG1lbnRUeXBlOiBhdXRvc2NhbGluZy5BZGp1c3RtZW50VHlwZS5DSEFOR0VfSU5fQ0FQQUNJVFksXG4gICAgICBzY2FsaW5nU3RlcHM6IFtcbiAgICAgICAgeyBjaGFuZ2U6IC0xLCBsb3dlcjogMCwgdXBwZXI6IDQ5IH0sXG4gICAgICAgIHsgY2hhbmdlOiAwLCBsb3dlcjogNTAsIHVwcGVyOiA5OSB9LFxuICAgICAgICB7IGNoYW5nZTogMSwgbG93ZXI6IDEwMCB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZFdhdGNoOjpBbGFybScsIHtcbiAgICAgIENvbXBhcmlzb25PcGVyYXRvcjogJ0xlc3NUaGFuT3JFcXVhbFRvVGhyZXNob2xkJyxcbiAgICAgIEV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICAgICAgTWV0cmljTmFtZTogJ01ldHJpYycsXG4gICAgICBOYW1lc3BhY2U6ICdUZXN0JyxcbiAgICAgIFBlcmlvZDogMzAwLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzdGVwIHNjYWxpbmcgb24gTWF0aEV4cHJlc3Npb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBtb2NrVnBjKHN0YWNrKTtcbiAgICBjb25zdCBhc2cgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015U3RhY2snLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBhc2cuc2NhbGVPbk1ldHJpYygnTWV0cmljJywge1xuICAgICAgbWV0cmljOiBuZXcgY2xvdWR3YXRjaC5NYXRoRXhwcmVzc2lvbih7XG4gICAgICAgIGV4cHJlc3Npb246ICdhJyxcbiAgICAgICAgdXNpbmdNZXRyaWNzOiB7XG4gICAgICAgICAgYTogbmV3IGNsb3Vkd2F0Y2guTWV0cmljKHtcbiAgICAgICAgICAgIG5hbWVzcGFjZTogJ1Rlc3QnLFxuICAgICAgICAgICAgbWV0cmljTmFtZTogJ01ldHJpYycsXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIGFkanVzdG1lbnRUeXBlOiBhdXRvc2NhbGluZy5BZGp1c3RtZW50VHlwZS5DSEFOR0VfSU5fQ0FQQUNJVFksXG4gICAgICBzY2FsaW5nU3RlcHM6IFtcbiAgICAgICAgeyBjaGFuZ2U6IC0xLCBsb3dlcjogMCwgdXBwZXI6IDQ5IH0sXG4gICAgICAgIHsgY2hhbmdlOiAwLCBsb3dlcjogNTAsIHVwcGVyOiA5OSB9LFxuICAgICAgICB7IGNoYW5nZTogMSwgbG93ZXI6IDEwMCB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZFdhdGNoOjpBbGFybScsIE1hdGNoLm5vdCh7XG4gICAgICBQZXJpb2Q6IDYwLFxuICAgIH0pKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkV2F0Y2g6OkFsYXJtJywge1xuICAgICAgJ0NvbXBhcmlzb25PcGVyYXRvcic6ICdMZXNzVGhhbk9yRXF1YWxUb1RocmVzaG9sZCcsXG4gICAgICAnRXZhbHVhdGlvblBlcmlvZHMnOiAxLFxuICAgICAgJ01ldHJpY3MnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnRXhwcmVzc2lvbic6ICdhJyxcbiAgICAgICAgICAnSWQnOiAnZXhwcl8xJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICdJZCc6ICdhJyxcbiAgICAgICAgICAnTWV0cmljU3RhdCc6IHtcbiAgICAgICAgICAgICdNZXRyaWMnOiB7XG4gICAgICAgICAgICAgICdNZXRyaWNOYW1lJzogJ01ldHJpYycsXG4gICAgICAgICAgICAgICdOYW1lc3BhY2UnOiAnVGVzdCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1BlcmlvZCc6IDMwMCxcbiAgICAgICAgICAgICdTdGF0JzogJ0F2ZXJhZ2UnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1JldHVybkRhdGEnOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICAnVGhyZXNob2xkJzogNDksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rlc3QgR3JvdXBNZXRyaWNzLmFsbCgpLCBhZGRzIGEgc2luZ2xlIE1ldHJpY3NDb2xsZWN0aW9uIHdpdGggbm8gTWV0cmljcyBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBtb2NrVnBjKHN0YWNrKTtcbiAgICAvLyBXaGVuXG4gICAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdBU0cnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHZwYyxcbiAgICAgIGdyb3VwTWV0cmljczogW2F1dG9zY2FsaW5nLkdyb3VwTWV0cmljcy5hbGwoKV0sXG4gICAgfSk7XG5cbiAgICAvLyBUaGVuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICBNZXRyaWNzQ29sbGVjdGlvbjogW1xuICAgICAgICB7XG4gICAgICAgICAgR3JhbnVsYXJpdHk6ICcxTWludXRlJyxcbiAgICAgICAgICBNZXRyaWNzOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rlc3QgY2FuIHNwZWNpZnkgYSBzdWJzZXQgb2YgZ3JvdXAgbWV0cmljcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG1vY2tWcGMoc3RhY2spO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnQVNHJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLk00LCBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCksXG4gICAgICBncm91cE1ldHJpY3M6IFtcbiAgICAgICAgbmV3IGF1dG9zY2FsaW5nLkdyb3VwTWV0cmljcyhhdXRvc2NhbGluZy5Hcm91cE1ldHJpYy5NSU5fU0laRSxcbiAgICAgICAgICBhdXRvc2NhbGluZy5Hcm91cE1ldHJpYy5NQVhfU0laRSxcbiAgICAgICAgICBhdXRvc2NhbGluZy5Hcm91cE1ldHJpYy5ERVNJUkVEX0NBUEFDSVRZLFxuICAgICAgICAgIGF1dG9zY2FsaW5nLkdyb3VwTWV0cmljLklOX1NFUlZJQ0VfSU5TVEFOQ0VTKSxcbiAgICAgICAgbmV3IGF1dG9zY2FsaW5nLkdyb3VwTWV0cmljcyhhdXRvc2NhbGluZy5Hcm91cE1ldHJpYy5QRU5ESU5HX0lOU1RBTkNFUyxcbiAgICAgICAgICBhdXRvc2NhbGluZy5Hcm91cE1ldHJpYy5TVEFOREJZX0lOU1RBTkNFUyxcbiAgICAgICAgICBhdXRvc2NhbGluZy5Hcm91cE1ldHJpYy5UT1RBTF9JTlNUQU5DRVMsXG4gICAgICAgICAgYXV0b3NjYWxpbmcuR3JvdXBNZXRyaWMuVEVSTUlOQVRJTkdfSU5TVEFOQ0VTLFxuICAgICAgICApLFxuICAgICAgXSxcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIC8vIFRoZW5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIE1ldHJpY3NDb2xsZWN0aW9uOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBHcmFudWxhcml0eTogJzFNaW51dGUnLFxuICAgICAgICAgIE1ldHJpY3M6IFsnR3JvdXBNaW5TaXplJywgJ0dyb3VwTWF4U2l6ZScsICdHcm91cERlc2lyZWRDYXBhY2l0eScsICdHcm91cEluU2VydmljZUluc3RhbmNlcyddLFxuICAgICAgICB9LCB7XG4gICAgICAgICAgR3JhbnVsYXJpdHk6ICcxTWludXRlJyxcbiAgICAgICAgICBNZXRyaWNzOiBbJ0dyb3VwUGVuZGluZ0luc3RhbmNlcycsICdHcm91cFN0YW5kYnlJbnN0YW5jZXMnLCAnR3JvdXBUb3RhbEluc3RhbmNlcycsICdHcm91cFRlcm1pbmF0aW5nSW5zdGFuY2VzJ10sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0ZXN0IGRlZHVwbGljYXRpb24gb2YgZ3JvdXAgbWV0cmljcyAnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBtb2NrVnBjKHN0YWNrKTtcbiAgICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ0FTRycsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgdnBjLFxuICAgICAgZ3JvdXBNZXRyaWNzOiBbbmV3IGF1dG9zY2FsaW5nLkdyb3VwTWV0cmljcyhhdXRvc2NhbGluZy5Hcm91cE1ldHJpYy5NSU5fU0laRSxcbiAgICAgICAgYXV0b3NjYWxpbmcuR3JvdXBNZXRyaWMuTUFYX1NJWkUsXG4gICAgICAgIGF1dG9zY2FsaW5nLkdyb3VwTWV0cmljLk1BWF9TSVpFLFxuICAgICAgICBhdXRvc2NhbGluZy5Hcm91cE1ldHJpYy5NSU5fU0laRSxcbiAgICAgICldLFxuICAgIH0pO1xuXG4gICAgLy8gVGhlblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgTWV0cmljc0NvbGxlY3Rpb246IFtcbiAgICAgICAge1xuICAgICAgICAgIEdyYW51bGFyaXR5OiAnMU1pbnV0ZScsXG4gICAgICAgICAgTWV0cmljczogWydHcm91cE1pblNpemUnLCAnR3JvdXBNYXhTaXplJ10sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhbGxvdyBjb25maWd1cmluZyBub3RpZmljYXRpb25zJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbW9ja1ZwYyhzdGFjayk7XG4gICAgY29uc3QgdG9waWMgPSBuZXcgc25zLlRvcGljKHN0YWNrLCAnTXlUb3BpYycpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnTXlBU0cnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHZwYyxcbiAgICAgIG5vdGlmaWNhdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHRvcGljLFxuICAgICAgICAgIHNjYWxpbmdFdmVudHM6IGF1dG9zY2FsaW5nLlNjYWxpbmdFdmVudHMuRVJST1JTLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdG9waWMsXG4gICAgICAgICAgc2NhbGluZ0V2ZW50czogbmV3IGF1dG9zY2FsaW5nLlNjYWxpbmdFdmVudHMoYXV0b3NjYWxpbmcuU2NhbGluZ0V2ZW50LklOU1RBTkNFX1RFUk1JTkFURSksXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgTm90aWZpY2F0aW9uQ29uZmlndXJhdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFRvcGljQVJOOiB7IFJlZjogJ015VG9waWM4Njg2OTQzNCcgfSxcbiAgICAgICAgICBOb3RpZmljYXRpb25UeXBlczogW1xuICAgICAgICAgICAgJ2F1dG9zY2FsaW5nOkVDMl9JTlNUQU5DRV9MQVVOQ0hfRVJST1InLFxuICAgICAgICAgICAgJ2F1dG9zY2FsaW5nOkVDMl9JTlNUQU5DRV9URVJNSU5BVEVfRVJST1InLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBUb3BpY0FSTjogeyBSZWY6ICdNeVRvcGljODY4Njk0MzQnIH0sXG4gICAgICAgICAgTm90aWZpY2F0aW9uVHlwZXM6IFtcbiAgICAgICAgICAgICdhdXRvc2NhbGluZzpFQzJfSU5TVEFOQ0VfVEVSTUlOQVRFJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ3Rocm93IGlmIG5vdGlmaWNhdGlvbiBhbmQgbm90aWZpY2F0aW9uc1RvcGljcyBhcmUgYm90aCBjb25maWd1cmVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbW9ja1ZwYyhzdGFjayk7XG4gICAgY29uc3QgdG9waWMgPSBuZXcgc25zLlRvcGljKHN0YWNrLCAnTXlUb3BpYycpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015QVNHJywge1xuICAgICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgICB2cGMsXG4gICAgICAgIG5vdGlmaWNhdGlvbnNUb3BpYzogdG9waWMsXG4gICAgICAgIG5vdGlmaWNhdGlvbnM6IFt7XG4gICAgICAgICAgdG9waWMsXG4gICAgICAgIH1dLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygnQ2Fubm90IHNldCBcXCdub3RpZmljYXRpb25zVG9waWNcXCcgYW5kIFxcJ25vdGlmaWNhdGlvbnNcXCcsIFxcJ25vdGlmaWNhdGlvbnNUb3BpY1xcJyBpcyBkZXByZWNhdGVkIHVzZSBcXCdub3RpZmljYXRpb25zXFwnIGluc3RlYWQnKTtcbiAgfSk7XG5cbiAgdGVzdCgnbm90aWZpY2F0aW9uVHlwZXMgZGVmYXVsdCBpbmNsdWRlcyBhbGwgbm9uIHRlc3QgTm90aWZpY2F0aW9uVHlwZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG1vY2tWcGMoc3RhY2spO1xuICAgIGNvbnN0IHRvcGljID0gbmV3IHNucy5Ub3BpYyhzdGFjaywgJ015VG9waWMnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015QVNHJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLk00LCBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCksXG4gICAgICB2cGMsXG4gICAgICBub3RpZmljYXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0b3BpYyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICBOb3RpZmljYXRpb25Db25maWd1cmF0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgVG9waWNBUk46IHsgUmVmOiAnTXlUb3BpYzg2ODY5NDM0JyB9LFxuICAgICAgICAgIE5vdGlmaWNhdGlvblR5cGVzOiBbXG4gICAgICAgICAgICAnYXV0b3NjYWxpbmc6RUMyX0lOU1RBTkNFX0xBVU5DSCcsXG4gICAgICAgICAgICAnYXV0b3NjYWxpbmc6RUMyX0lOU1RBTkNFX0xBVU5DSF9FUlJPUicsXG4gICAgICAgICAgICAnYXV0b3NjYWxpbmc6RUMyX0lOU1RBTkNFX1RFUk1JTkFURScsXG4gICAgICAgICAgICAnYXV0b3NjYWxpbmc6RUMyX0lOU1RBTkNFX1RFUk1JTkFURV9FUlJPUicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdzZXR0aW5nIG5vdGlmaWNhdGlvblRvcGljIGNvbmZpZ3VyZXMgYWxsIG5vbiB0ZXN0IE5vdGlmaWNhdGlvblR5cGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBtb2NrVnBjKHN0YWNrKTtcbiAgICBjb25zdCB0b3BpYyA9IG5ldyBzbnMuVG9waWMoc3RhY2ssICdNeVRvcGljJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdNeUFTRycsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgdnBjLFxuICAgICAgbm90aWZpY2F0aW9uc1RvcGljOiB0b3BpYyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIE5vdGlmaWNhdGlvbkNvbmZpZ3VyYXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBUb3BpY0FSTjogeyBSZWY6ICdNeVRvcGljODY4Njk0MzQnIH0sXG4gICAgICAgICAgTm90aWZpY2F0aW9uVHlwZXM6IFtcbiAgICAgICAgICAgICdhdXRvc2NhbGluZzpFQzJfSU5TVEFOQ0VfTEFVTkNIJyxcbiAgICAgICAgICAgICdhdXRvc2NhbGluZzpFQzJfSU5TVEFOQ0VfTEFVTkNIX0VSUk9SJyxcbiAgICAgICAgICAgICdhdXRvc2NhbGluZzpFQzJfSU5TVEFOQ0VfVEVSTUlOQVRFJyxcbiAgICAgICAgICAgICdhdXRvc2NhbGluZzpFQzJfSU5TVEFOQ0VfVEVSTUlOQVRFX0VSUk9SJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnTm90aWZpY2F0aW9uVHlwZXMuQUxMIGluY2x1ZGVzIGFsbCBub24gdGVzdCBOb3RpZmljYXRpb25UeXBlJywgKCkgPT4ge1xuICAgIGV4cGVjdChPYmplY3QudmFsdWVzKGF1dG9zY2FsaW5nLlNjYWxpbmdFdmVudCkubGVuZ3RoIC0gMSkudG9FcXVhbChhdXRvc2NhbGluZy5TY2FsaW5nRXZlbnRzLkFMTC5fdHlwZXMubGVuZ3RoKTtcblxuICB9KTtcblxuICB0ZXN0KCdDYW4gc2V0IENhcGFjaXR5IFJlYmFsYW5jaW5nIHZpYSBjb25zdHJ1Y3RvciBwcm9wZXJ0eScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG1vY2tWcGMoc3RhY2spO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnTXlBU0cnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTQsIGVjMi5JbnN0YW5jZVNpemUuTUlDUk8pLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHZwYyxcbiAgICAgIGNhcGFjaXR5UmViYWxhbmNlOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgQ2FwYWNpdHlSZWJhbGFuY2U6IHRydWUsXG4gICAgfSk7XG5cbiAgfSk7XG5cblxuICB0ZXN0KCdDYW4gcHJvdGVjdCBuZXcgaW5zdGFuY2VzIGZyb20gc2NhbGUtaW4gdmlhIGNvbnN0cnVjdG9yIHByb3BlcnR5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbW9ja1ZwYyhzdGFjayk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXNnID0gbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdNeUFTRycsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgdnBjLFxuICAgICAgbmV3SW5zdGFuY2VzUHJvdGVjdGVkRnJvbVNjYWxlSW46IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGFzZy5hcmVOZXdJbnN0YW5jZXNQcm90ZWN0ZWRGcm9tU2NhbGVJbigpKS50b0VxdWFsKHRydWUpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgTmV3SW5zdGFuY2VzUHJvdGVjdGVkRnJvbVNjYWxlSW46IHRydWUsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0NhbiBwcm90ZWN0IG5ldyBpbnN0YW5jZXMgZnJvbSBzY2FsZS1pbiB2aWEgc2V0dGVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbW9ja1ZwYyhzdGFjayk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXNnID0gbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdNeUFTRycsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgdnBjLFxuICAgIH0pO1xuICAgIGFzZy5wcm90ZWN0TmV3SW5zdGFuY2VzRnJvbVNjYWxlSW4oKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoYXNnLmFyZU5ld0luc3RhbmNlc1Byb3RlY3RlZEZyb21TY2FsZUluKCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICBOZXdJbnN0YW5jZXNQcm90ZWN0ZWRGcm9tU2NhbGVJbjogdHJ1ZSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVxdWlyZXMgaW1kc3YyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbW9ja1ZwYyhzdGFjayk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdNeUFTRycsIHtcbiAgICAgIHZwYyxcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IGVjMi5NYWNoaW5lSW1hZ2UubGF0ZXN0QW1hem9uTGludXgoKSxcbiAgICAgIHJlcXVpcmVJbWRzdjI6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkxhdW5jaENvbmZpZ3VyYXRpb24nLCB7XG4gICAgICBNZXRhZGF0YU9wdGlvbnM6IHtcbiAgICAgICAgSHR0cFRva2VuczogJ3JlcXVpcmVkJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N1cHBvcnRzIHRlcm1pbmF0aW9uIHBvbGljaWVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbW9ja1ZwYyhzdGFjayk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdNeUFTRycsIHtcbiAgICAgIHZwYyxcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IGVjMi5NYWNoaW5lSW1hZ2UubGF0ZXN0QW1hem9uTGludXgoKSxcbiAgICAgIHRlcm1pbmF0aW9uUG9saWNpZXM6IFtcbiAgICAgICAgYXV0b3NjYWxpbmcuVGVybWluYXRpb25Qb2xpY3kuT0xERVNUX0lOU1RBTkNFLFxuICAgICAgICBhdXRvc2NhbGluZy5UZXJtaW5hdGlvblBvbGljeS5ERUZBVUxULFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIFRlcm1pbmF0aW9uUG9saWNpZXM6IFtcbiAgICAgICAgJ09sZGVzdEluc3RhbmNlJyxcbiAgICAgICAgJ0RlZmF1bHQnLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQ2FuIHVzZSBpbXBvcnRlZCBMYXVuY2ggVGVtcGxhdGUgd2l0aCBJRCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnaW1wb3J0ZWQtbHQtYXNnJywge1xuICAgICAgbGF1bmNoVGVtcGxhdGU6IExhdW5jaFRlbXBsYXRlLmZyb21MYXVuY2hUZW1wbGF0ZUF0dHJpYnV0ZXMoc3RhY2ssICdpbXBvcnRlZC1sdCcsIHtcbiAgICAgICAgbGF1bmNoVGVtcGxhdGVJZDogJ3Rlc3QtbHQtaWQnLFxuICAgICAgICB2ZXJzaW9uTnVtYmVyOiAnMCcsXG4gICAgICB9KSxcbiAgICAgIHZwYzogbW9ja1ZwYyhzdGFjayksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZToge1xuICAgICAgICBMYXVuY2hUZW1wbGF0ZUlkOiAndGVzdC1sdC1pZCcsXG4gICAgICAgIFZlcnNpb246ICcwJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0NhbiB1c2UgaW1wb3J0ZWQgTGF1bmNoIFRlbXBsYXRlIHdpdGggbmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnaW1wb3J0ZWQtbHQtYXNnJywge1xuICAgICAgbGF1bmNoVGVtcGxhdGU6IExhdW5jaFRlbXBsYXRlLmZyb21MYXVuY2hUZW1wbGF0ZUF0dHJpYnV0ZXMoc3RhY2ssICdpbXBvcnRlZC1sdCcsIHtcbiAgICAgICAgbGF1bmNoVGVtcGxhdGVOYW1lOiAndGVzdC1sdCcsXG4gICAgICAgIHZlcnNpb25OdW1iZXI6ICcwJyxcbiAgICAgIH0pLFxuICAgICAgdnBjOiBtb2NrVnBjKHN0YWNrKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlOiB7XG4gICAgICAgIExhdW5jaFRlbXBsYXRlTmFtZTogJ3Rlc3QtbHQnLFxuICAgICAgICBWZXJzaW9uOiAnMCcsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdDYW4gdXNlIGluLXN0YWNrIExhdW5jaCBUZW1wbGF0ZSByZWZlcmVuY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBsdCA9IG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ2x0Jywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgSW5zdGFuY2VUeXBlKCd0My5taWNybycpLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgQW1hem9uTGludXhJbWFnZSh7XG4gICAgICAgIGdlbmVyYXRpb246IEFtYXpvbkxpbnV4R2VuZXJhdGlvbi5BTUFaT05fTElOVVhfMixcbiAgICAgICAgY3B1VHlwZTogQW1hem9uTGludXhDcHVUeXBlLlg4Nl82NCxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdpbXBvcnRlZC1sdC1hc2cnLCB7XG4gICAgICBsYXVuY2hUZW1wbGF0ZTogbHQsXG4gICAgICB2cGM6IG1vY2tWcGMoc3RhY2spLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGU6IHtcbiAgICAgICAgTGF1bmNoVGVtcGxhdGVJZDoge1xuICAgICAgICAgICdSZWYnOiAnbHRCNjUxMUNGNScsXG4gICAgICAgIH0sXG4gICAgICAgIFZlcnNpb246IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdsdEI2NTExQ0Y1JyxcbiAgICAgICAgICAgICdMYXRlc3RWZXJzaW9uTnVtYmVyJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQ2FuIHVzZSBtaXhlZCBpbnN0YW5jZSBwb2xpY3knLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBsdCA9IExhdW5jaFRlbXBsYXRlLmZyb21MYXVuY2hUZW1wbGF0ZUF0dHJpYnV0ZXMoc3RhY2ssICdpbXBvcnRlZC1sdCcsIHtcbiAgICAgIGxhdW5jaFRlbXBsYXRlSWQ6ICd0ZXN0LWx0LWlkJyxcbiAgICAgIHZlcnNpb25OdW1iZXI6ICcwJyxcbiAgICB9KTtcblxuICAgIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnbWlwLWFzZycsIHtcbiAgICAgIG1peGVkSW5zdGFuY2VzUG9saWN5OiB7XG4gICAgICAgIGxhdW5jaFRlbXBsYXRlOiBsdCxcbiAgICAgICAgbGF1bmNoVGVtcGxhdGVPdmVycmlkZXM6IFt7XG4gICAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgSW5zdGFuY2VUeXBlKCd0NGcubWljcm8nKSxcbiAgICAgICAgICBsYXVuY2hUZW1wbGF0ZTogbHQsXG4gICAgICAgICAgd2VpZ2h0ZWRDYXBhY2l0eTogOSxcbiAgICAgICAgfV0sXG4gICAgICAgIGluc3RhbmNlc0Rpc3RyaWJ1dGlvbjoge1xuICAgICAgICAgIG9uRGVtYW5kQWxsb2NhdGlvblN0cmF0ZWd5OiBPbkRlbWFuZEFsbG9jYXRpb25TdHJhdGVneS5QUklPUklUSVpFRCxcbiAgICAgICAgICBvbkRlbWFuZEJhc2VDYXBhY2l0eTogMSxcbiAgICAgICAgICBvbkRlbWFuZFBlcmNlbnRhZ2VBYm92ZUJhc2VDYXBhY2l0eTogMixcbiAgICAgICAgICBzcG90QWxsb2NhdGlvblN0cmF0ZWd5OiBTcG90QWxsb2NhdGlvblN0cmF0ZWd5LkNBUEFDSVRZX09QVElNSVpFRF9QUklPUklUSVpFRCxcbiAgICAgICAgICBzcG90SW5zdGFuY2VQb29sczogMyxcbiAgICAgICAgICBzcG90TWF4UHJpY2U6ICc0JyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB2cGM6IG1vY2tWcGMoc3RhY2spLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgTWl4ZWRJbnN0YW5jZXNQb2xpY3k6IHtcbiAgICAgICAgTGF1bmNoVGVtcGxhdGU6IHtcbiAgICAgICAgICBMYXVuY2hUZW1wbGF0ZVNwZWNpZmljYXRpb246IHtcbiAgICAgICAgICAgIExhdW5jaFRlbXBsYXRlSWQ6ICd0ZXN0LWx0LWlkJyxcbiAgICAgICAgICAgIFZlcnNpb246ICcwJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIE92ZXJyaWRlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBJbnN0YW5jZVR5cGU6ICd0NGcubWljcm8nLFxuICAgICAgICAgICAgICBMYXVuY2hUZW1wbGF0ZVNwZWNpZmljYXRpb246IHtcbiAgICAgICAgICAgICAgICBMYXVuY2hUZW1wbGF0ZUlkOiAndGVzdC1sdC1pZCcsXG4gICAgICAgICAgICAgICAgVmVyc2lvbjogJzAnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBXZWlnaHRlZENhcGFjaXR5OiAnOScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIEluc3RhbmNlc0Rpc3RyaWJ1dGlvbjoge1xuICAgICAgICAgIE9uRGVtYW5kQWxsb2NhdGlvblN0cmF0ZWd5OiAncHJpb3JpdGl6ZWQnLFxuICAgICAgICAgIE9uRGVtYW5kQmFzZUNhcGFjaXR5OiAxLFxuICAgICAgICAgIE9uRGVtYW5kUGVyY2VudGFnZUFib3ZlQmFzZUNhcGFjaXR5OiAyLFxuICAgICAgICAgIFNwb3RBbGxvY2F0aW9uU3RyYXRlZ3k6ICdjYXBhY2l0eS1vcHRpbWl6ZWQtcHJpb3JpdGl6ZWQnLFxuICAgICAgICAgIFNwb3RJbnN0YW5jZVBvb2xzOiAzLFxuICAgICAgICAgIFNwb3RNYXhQcmljZTogJzQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQ2FuIHVzZSBtaXhlZCBpbnN0YW5jZSBwb2xpY3kgd2l0aG91dCBpbnN0YW5jZXMgZGlzdHJpYnV0aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbHQgPSBMYXVuY2hUZW1wbGF0ZS5mcm9tTGF1bmNoVGVtcGxhdGVBdHRyaWJ1dGVzKHN0YWNrLCAnaW1wb3J0ZWQtbHQnLCB7XG4gICAgICBsYXVuY2hUZW1wbGF0ZUlkOiAndGVzdC1sdC1pZCcsXG4gICAgICB2ZXJzaW9uTnVtYmVyOiAnMCcsXG4gICAgfSk7XG5cbiAgICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ21pcC1hc2cnLCB7XG4gICAgICBtaXhlZEluc3RhbmNlc1BvbGljeToge1xuICAgICAgICBsYXVuY2hUZW1wbGF0ZTogbHQsXG4gICAgICAgIGxhdW5jaFRlbXBsYXRlT3ZlcnJpZGVzOiBbe1xuICAgICAgICAgIGluc3RhbmNlVHlwZTogbmV3IEluc3RhbmNlVHlwZSgndDRnLm1pY3JvJyksXG4gICAgICAgICAgbGF1bmNoVGVtcGxhdGU6IGx0LFxuICAgICAgICAgIHdlaWdodGVkQ2FwYWNpdHk6IDksXG4gICAgICAgIH1dLFxuICAgICAgfSxcbiAgICAgIHZwYzogbW9ja1ZwYyhzdGFjayksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICBNaXhlZEluc3RhbmNlc1BvbGljeToge1xuICAgICAgICBMYXVuY2hUZW1wbGF0ZToge1xuICAgICAgICAgIExhdW5jaFRlbXBsYXRlU3BlY2lmaWNhdGlvbjoge1xuICAgICAgICAgICAgTGF1bmNoVGVtcGxhdGVJZDogJ3Rlc3QtbHQtaWQnLFxuICAgICAgICAgICAgVmVyc2lvbjogJzAnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgT3ZlcnJpZGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEluc3RhbmNlVHlwZTogJ3Q0Zy5taWNybycsXG4gICAgICAgICAgICAgIExhdW5jaFRlbXBsYXRlU3BlY2lmaWNhdGlvbjoge1xuICAgICAgICAgICAgICAgIExhdW5jaFRlbXBsYXRlSWQ6ICd0ZXN0LWx0LWlkJyxcbiAgICAgICAgICAgICAgICBWZXJzaW9uOiAnMCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFdlaWdodGVkQ2FwYWNpdHk6ICc5JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0Nhbm5vdCBzcGVjaWZ5IGJvdGggTGF1bmNoIFRlbXBsYXRlIGFuZCBMYXVuY2ggQ29uZmlnJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbHQgPSBMYXVuY2hUZW1wbGF0ZS5mcm9tTGF1bmNoVGVtcGxhdGVBdHRyaWJ1dGVzKHN0YWNrLCAnaW1wb3J0ZWQtbHQnLCB7XG4gICAgICBsYXVuY2hUZW1wbGF0ZUlkOiAndGVzdC1sdC1pZCcsXG4gICAgICB2ZXJzaW9uTnVtYmVyOiAnMCcsXG4gICAgfSk7XG4gICAgY29uc3QgdnBjID0gbW9ja1ZwYyhzdGFjayk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnaW1wb3J0ZWQtbHQtYXNnJywge1xuICAgICAgICBsYXVuY2hUZW1wbGF0ZTogbHQsXG4gICAgICAgIGluc3RhbmNlVHlwZTogbmV3IEluc3RhbmNlVHlwZSgndDMubWljcm8nKSxcbiAgICAgICAgbWFjaGluZUltYWdlOiBuZXcgQW1hem9uTGludXhJbWFnZSh7XG4gICAgICAgICAgZ2VuZXJhdGlvbjogQW1hem9uTGludXhHZW5lcmF0aW9uLkFNQVpPTl9MSU5VWF8yLFxuICAgICAgICAgIGNwdVR5cGU6IEFtYXpvbkxpbnV4Q3B1VHlwZS5YODZfNjQsXG4gICAgICAgIH0pLFxuICAgICAgICB2cGMsXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KCdTZXR0aW5nIFxcJ21hY2hpbmVJbWFnZVxcJyBtdXN0IG5vdCBiZSBzZXQgd2hlbiBcXCdsYXVuY2hUZW1wbGF0ZVxcJyBvciBcXCdtaXhlZEluc3RhbmNlc1BvbGljeVxcJyBpcyBzZXQnKTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdpbXBvcnRlZC1sdC1hc2ctMicsIHtcbiAgICAgICAgbGF1bmNoVGVtcGxhdGU6IGx0LFxuICAgICAgICBhc3NvY2lhdGVQdWJsaWNJcEFkZHJlc3M6IHRydWUsXG4gICAgICAgIHZwYyxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coJ1NldHRpbmcgXFwnYXNzb2NpYXRlUHVibGljSXBBZGRyZXNzXFwnIG11c3Qgbm90IGJlIHNldCB3aGVuIFxcJ2xhdW5jaFRlbXBsYXRlXFwnIG9yIFxcJ21peGVkSW5zdGFuY2VzUG9saWN5XFwnIGlzIHNldCcpO1xuICB9KTtcblxuICB0ZXN0KCdDYW5ub3Qgc3BlY2lmeSBMYXVuY2ggVGVtcGxhdGUgd2l0aG91dCBpbnN0YW5jZSB0eXBlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbHQgPSBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdsdCcsIHtcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEFtYXpvbkxpbnV4SW1hZ2Uoe1xuICAgICAgICBnZW5lcmF0aW9uOiBBbWF6b25MaW51eEdlbmVyYXRpb24uQU1BWk9OX0xJTlVYXzIsXG4gICAgICAgIGNwdVR5cGU6IEFtYXpvbkxpbnV4Q3B1VHlwZS5YODZfNjQsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdpbXBvcnRlZC1sdC1hc2cnLCB7XG4gICAgICAgIGxhdW5jaFRlbXBsYXRlOiBsdCxcbiAgICAgICAgdnBjOiBtb2NrVnBjKHN0YWNrKSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coJ1NldHRpbmcgXFwnbGF1bmNoVGVtcGxhdGVcXCcgcmVxdWlyZXMgaXRzIFxcJ2luc3RhbmNlVHlwZVxcJyB0byBiZSBzZXQnKTtcbiAgfSk7XG5cbiAgdGVzdCgnQ2Fubm90IHNwZWNpZnkgTGF1bmNoIFRlbXBsYXRlIHdpdGhvdXQgbWFjaGluZSBpbWFnZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGx0ID0gbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnbHQnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QzLm1pY3JvJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnaW1wb3J0ZWQtbHQtYXNnJywge1xuICAgICAgICBsYXVuY2hUZW1wbGF0ZTogbHQsXG4gICAgICAgIHZwYzogbW9ja1ZwYyhzdGFjayksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KCdTZXR0aW5nIFxcJ2xhdW5jaFRlbXBsYXRlXFwnIHJlcXVpcmVzIGl0cyBcXCdtYWNoaW5lSW1hZ2VcXCcgdG8gYmUgc2V0Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ0Nhbm5vdCBzcGVjaWZ5IG1peGVkIGluc3RhbmNlIHBvbGljeSB3aXRob3V0IG1hY2hpbmUgaW1hZ2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBsdCA9IG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ2x0Jywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgSW5zdGFuY2VUeXBlKCd0My5taWNybycpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ2ltcG9ydGVkLWx0LWFzZycsIHtcbiAgICAgICAgbWl4ZWRJbnN0YW5jZXNQb2xpY3k6IHtcbiAgICAgICAgICBsYXVuY2hUZW1wbGF0ZTogbHQsXG4gICAgICAgICAgbGF1bmNoVGVtcGxhdGVPdmVycmlkZXM6IFt7XG4gICAgICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QzLm1pY3JvJyksXG4gICAgICAgICAgfV0sXG4gICAgICAgIH0sXG4gICAgICAgIHZwYzogbW9ja1ZwYyhzdGFjayksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KCdTZXR0aW5nIFxcJ21peGVkSW5zdGFuY2VzUG9saWN5LmxhdW5jaFRlbXBsYXRlXFwnIHJlcXVpcmVzIGl0cyBcXCdtYWNoaW5lSW1hZ2VcXCcgdG8gYmUgc2V0Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ0Nhbm5vdCBiZSBjcmVhdGVkIHdpdGggbGF1bmNoIGNvbmZpZ3VyYXRpb24gd2l0aG91dCBtYWNoaW5lIGltYWdlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnaW1wb3J0ZWQtbHQtYXNnJywge1xuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QzLm1pY3JvJyksXG4gICAgICAgIHZwYzogbW9ja1ZwYyhzdGFjayksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KCdTZXR0aW5nIFxcJ21hY2hpbmVJbWFnZVxcJyBpcyByZXF1aXJlZCB3aGVuIFxcJ2xhdW5jaFRlbXBsYXRlXFwnIGFuZCBcXCdtaXhlZEluc3RhbmNlc1BvbGljeVxcJyBpcyBub3Qgc2V0Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ0Nhbm5vdCBiZSBjcmVhdGVkIHdpdGggbGF1bmNoIGNvbmZpZ3VyYXRpb24gd2l0aG91dCBpbnN0YW5jZSB0eXBlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnaW1wb3J0ZWQtbHQtYXNnJywge1xuICAgICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBBbWF6b25MaW51eEltYWdlKHtcbiAgICAgICAgICBnZW5lcmF0aW9uOiBBbWF6b25MaW51eEdlbmVyYXRpb24uQU1BWk9OX0xJTlVYXzIsXG4gICAgICAgICAgY3B1VHlwZTogQW1hem9uTGludXhDcHVUeXBlLlg4Nl82NCxcbiAgICAgICAgfSksXG4gICAgICAgIHZwYzogbW9ja1ZwYyhzdGFjayksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KCdTZXR0aW5nIFxcJ2luc3RhbmNlVHlwZVxcJyBpcyByZXF1aXJlZCB3aGVuIFxcJ2xhdW5jaFRlbXBsYXRlXFwnIGFuZCBcXCdtaXhlZEluc3RhbmNlc1BvbGljeVxcJyBpcyBub3Qgc2V0Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ1Nob3VsZCB0aHJvdyB3aGVuIGFjY2Vzc2luZyBpbmZlcnJlZCBmaWVsZHMgd2l0aCBpbXBvcnRlZCBMYXVuY2ggVGVtcGxhdGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc2cgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ2ltcG9ydGVkLWx0LWFzZycsIHtcbiAgICAgIGxhdW5jaFRlbXBsYXRlOiBMYXVuY2hUZW1wbGF0ZS5mcm9tTGF1bmNoVGVtcGxhdGVBdHRyaWJ1dGVzKHN0YWNrLCAnaW1wb3J0ZWQtbHQnLCB7XG4gICAgICAgIGxhdW5jaFRlbXBsYXRlSWQ6ICd0ZXN0LWx0LWlkJyxcbiAgICAgICAgdmVyc2lvbk51bWJlcjogJzAnLFxuICAgICAgfSksXG4gICAgICB2cGM6IG1vY2tWcGMoc3RhY2spLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBhc2cudXNlckRhdGE7XG4gICAgfSkudG9UaHJvdygnVGhlIHByb3ZpZGVkIGxhdW5jaCB0ZW1wbGF0ZSBkb2VzIG5vdCBleHBvc2UgaXRzIHVzZXIgZGF0YS4nKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBhc2cuY29ubmVjdGlvbnM7XG4gICAgfSkudG9UaHJvdygnQXV0b1NjYWxpbmdHcm91cCBjYW4gb25seSBiZSB1c2VkIGFzIElDb25uZWN0YWJsZSBpZiBpdCBpcyBub3QgY3JlYXRlZCBmcm9tIGFuIGltcG9ydGVkIExhdW5jaCBUZW1wbGF0ZS4nKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBhc2cucm9sZTtcbiAgICB9KS50b1Rocm93KCdUaGUgcHJvdmlkZWQgbGF1bmNoIHRlbXBsYXRlIGRvZXMgbm90IGV4cG9zZSBvciBkb2VzIG5vdCBkZWZpbmUgaXRzIHJvbGUuJyk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgYXNnLmFkZFNlY3VyaXR5R3JvdXAobW9ja1NlY3VyaXR5R3JvdXAoc3RhY2spKTtcbiAgICB9KS50b1Rocm93KCdZb3UgY2Fubm90IGFkZCBzZWN1cml0eSBncm91cHMgd2hlbiB0aGUgQXV0byBTY2FsaW5nIEdyb3VwIGlzIGNyZWF0ZWQgZnJvbSBhIExhdW5jaCBUZW1wbGF0ZS4nKTtcbiAgfSk7XG5cbiAgdGVzdCgnU2hvdWxkIHRocm93IHdoZW4gYWNjZXNzaW5nIGluZmVycmVkIGZpZWxkcyB3aXRoIGluLXN0YWNrIExhdW5jaCBUZW1wbGF0ZSBub3QgaGF2aW5nIGNvcnJlc3BvbmRpbmcgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFzZyA9IG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnaW1wb3J0ZWQtbHQtYXNnJywge1xuICAgICAgbGF1bmNoVGVtcGxhdGU6IG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ2luLXN0YWNrLWx0Jywge1xuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0My5taWNybycpLFxuICAgICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSh7XG4gICAgICAgICAgZ2VuZXJhdGlvbjogZWMyLkFtYXpvbkxpbnV4R2VuZXJhdGlvbi5BTUFaT05fTElOVVhfMixcbiAgICAgICAgICBjcHVUeXBlOiBlYzIuQW1hem9uTGludXhDcHVUeXBlLlg4Nl82NCxcbiAgICAgICAgfSksXG4gICAgICB9KSxcbiAgICAgIHZwYzogbW9ja1ZwYyhzdGFjayksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGFzZy51c2VyRGF0YTtcbiAgICB9KS50b1Rocm93KCdUaGUgcHJvdmlkZWQgbGF1bmNoIHRlbXBsYXRlIGRvZXMgbm90IGV4cG9zZSBpdHMgdXNlciBkYXRhLicpO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGFzZy5jb25uZWN0aW9ucztcbiAgICB9KS50b1Rocm93KCdMYXVuY2hUZW1wbGF0ZSBjYW4gb25seSBiZSB1c2VkIGFzIElDb25uZWN0YWJsZSBpZiBhIHNlY3VyaXR5R3JvdXAgaXMgcHJvdmlkZWQgd2hlbiBjb25zdHJ1Y3RpbmcgaXQuJyk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgYXNnLnJvbGU7XG4gICAgfSkudG9UaHJvdygnVGhlIHByb3ZpZGVkIGxhdW5jaCB0ZW1wbGF0ZSBkb2VzIG5vdCBleHBvc2Ugb3IgZG9lcyBub3QgZGVmaW5lIGl0cyByb2xlLicpO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGFzZy5hZGRTZWN1cml0eUdyb3VwKG1vY2tTZWN1cml0eUdyb3VwKHN0YWNrKSk7XG4gICAgfSkudG9UaHJvdygnWW91IGNhbm5vdCBhZGQgc2VjdXJpdHkgZ3JvdXBzIHdoZW4gdGhlIEF1dG8gU2NhbGluZyBHcm91cCBpcyBjcmVhdGVkIGZyb20gYSBMYXVuY2ggVGVtcGxhdGUuJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ1Nob3VsZCBub3QgdGhyb3cgd2hlbiBhY2Nlc3NpbmcgaW5mZXJyZWQgZmllbGRzIHdpdGggaW4tc3RhY2sgTGF1bmNoIFRlbXBsYXRlIGhhdmluZyBjb3JyZXNwb25kaW5nIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc2cgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ2ltcG9ydGVkLWx0LWFzZycsIHtcbiAgICAgIGxhdW5jaFRlbXBsYXRlOiBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdpbi1zdGFjay1sdCcsIHtcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDMubWljcm8nKSxcbiAgICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2Uoe1xuICAgICAgICAgIGdlbmVyYXRpb246IGVjMi5BbWF6b25MaW51eEdlbmVyYXRpb24uQU1BWk9OX0xJTlVYXzIsXG4gICAgICAgICAgY3B1VHlwZTogZWMyLkFtYXpvbkxpbnV4Q3B1VHlwZS5YODZfNjQsXG4gICAgICAgIH0pLFxuICAgICAgICB1c2VyRGF0YTogZWMyLlVzZXJEYXRhLmZvckxpbnV4KCksXG4gICAgICAgIHNlY3VyaXR5R3JvdXA6IGVjMi5TZWN1cml0eUdyb3VwLmZyb21TZWN1cml0eUdyb3VwSWQoc3RhY2ssICdNeVNHMicsICdtb3N0LXNlY3VyZScpLFxuICAgICAgICByb2xlOiBpYW0uUm9sZS5mcm9tUm9sZUFybihzdGFjaywgJ0ltcG9ydGVkUm9sZScsICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvSGVsbG9EdWRlJyksXG4gICAgICB9KSxcbiAgICAgIHZwYzogbW9ja1ZwYyhzdGFjayksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGFzZy51c2VyRGF0YTtcbiAgICB9KS5ub3QudG9UaHJvdygpO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGFzZy5jb25uZWN0aW9ucztcbiAgICB9KS5ub3QudG9UaHJvdygpO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGFzZy5yb2xlO1xuICAgIH0pLm5vdC50b1Rocm93KCk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgYXNnLmFkZFNlY3VyaXR5R3JvdXAobW9ja1NlY3VyaXR5R3JvdXAoc3RhY2spKTtcbiAgICB9KS50b1Rocm93KCdZb3UgY2Fubm90IGFkZCBzZWN1cml0eSBncm91cHMgd2hlbiB0aGUgQXV0byBTY2FsaW5nIEdyb3VwIGlzIGNyZWF0ZWQgZnJvbSBhIExhdW5jaCBUZW1wbGF0ZS4nKTtcbiAgfSk7XG5cbiAgdGVzdCgnU2hvdWxkIG5vdCB0aHJvdyB3aGVuIExhdW5jaFRlbXBsYXRlIGlzIHVzZWQgd2l0aCBDbG91ZGZvcm1hdGlvbkluaXQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbHQgPSBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QzLm1pY3JvJyksXG4gICAgICB1c2VyRGF0YTogZWMyLlVzZXJEYXRhLmZvckxpbnV4KCksXG4gICAgICBzZWN1cml0eUdyb3VwOiBlYzIuU2VjdXJpdHlHcm91cC5mcm9tU2VjdXJpdHlHcm91cElkKHN0YWNrLCAnSW1wb3J0ZWRTZycsICdzZWN1cml0eUdyb3VwSWQnKSxcbiAgICAgIHJvbGU6IGlhbS5Sb2xlLmZyb21Sb2xlQXJuKHN0YWNrLCAnSW1wb3J0ZWRSb2xlJywgJ2Fybjphd3M6aWFtOjoxMjM0NTY3ODkwMTI6cm9sZS9Nb2NrUm9sZScpLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2ZJbml0ID0gZWMyLkNsb3VkRm9ybWF0aW9uSW5pdC5mcm9tRWxlbWVudHMoXG4gICAgICBlYzIuSW5pdENvbW1hbmQuc2hlbGxDb21tYW5kKCcvYmFzaCcpLFxuICAgICk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnQXNnJywge1xuICAgICAgbGF1bmNoVGVtcGxhdGU6IGx0LFxuICAgICAgaW5pdDogY2ZJbml0LFxuICAgICAgdnBjOiBtb2NrVnBjKHN0YWNrKSxcbiAgICAgIHNpZ25hbHM6IGF1dG9zY2FsaW5nLlNpZ25hbHMud2FpdEZvckFsbCgpLFxuICAgIH0pKS5ub3QudG9UaHJvdygpO1xuXG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdtdWx0aXBsZSB0YXJnZXQgZ3JvdXBzJywgKCkgPT4ge1xuICAgIGxldCBhc2c6IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXA7XG4gICAgbGV0IHN0YWNrOiBjZGsuU3RhY2s7XG4gICAgbGV0IHZwYzogZWMyLklWcGM7XG4gICAgbGV0IGFsYjogQXBwbGljYXRpb25Mb2FkQmFsYW5jZXI7XG4gICAgbGV0IGxpc3RlbmVyOiBBcHBsaWNhdGlvbkxpc3RlbmVyO1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2sodW5kZWZpbmVkLCAnTXlTdGFjaycsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScsIGFjY291bnQ6ICcxMjM0JyB9IH0pO1xuICAgICAgdnBjID0gbW9ja1ZwYyhzdGFjayk7XG4gICAgICBhbGIgPSBuZXcgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdhbGInLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgaW50ZXJuZXRGYWNpbmc6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgbGlzdGVuZXIgPSBhbGIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywge1xuICAgICAgICBwb3J0OiA4MCxcbiAgICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICBhc2cgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015RmxlZXQnLCB7XG4gICAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCksXG4gICAgICAgIHZwYyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnQWRkaW5nIHR3byBhcHBsaWNhdGlvbiB0YXJnZXQgZ3JvdXBzIHNob3VsZCBzdWNjZWVkIHZhbGlkYXRpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBhdGcxID0gbmV3IEFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoc3RhY2ssICdBVEcxJywgeyBwb3J0OiA0NDMgfSk7XG4gICAgICBjb25zdCBhdGcyID0gbmV3IEFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoc3RhY2ssICdBVEcyJywgeyBwb3J0OiA0NDMgfSk7XG5cbiAgICAgIGxpc3RlbmVyLmFkZFRhcmdldEdyb3VwcygndGdzJywgeyB0YXJnZXRHcm91cHM6IFthdGcxLCBhdGcyXSB9KTtcblxuICAgICAgYXNnLmF0dGFjaFRvQXBwbGljYXRpb25UYXJnZXRHcm91cChhdGcxKTtcbiAgICAgIGFzZy5hdHRhY2hUb0FwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoYXRnMik7XG5cbiAgICAgIGV4cGVjdChhc2cubm9kZS52YWxpZGF0ZSgpKS50b0VxdWFsKFtdKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ0FkZGluZyB0d28gYXBwbGljYXRpb24gdGFyZ2V0IGdyb3VwcyBzaG91bGQgZmFpbCB2YWxpZGF0aW9uIHZhbGlkYXRlIGlmIGBzY2FsZU9uUmVxdWVzdENvdW50KClgIGhhcyBiZWVuIGNhbGxlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGF0ZzEgPSBuZXcgQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ0FURzEnLCB7IHBvcnQ6IDQ0MyB9KTtcbiAgICAgIGNvbnN0IGF0ZzIgPSBuZXcgQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ0FURzInLCB7IHBvcnQ6IDQ0MyB9KTtcblxuICAgICAgbGlzdGVuZXIuYWRkVGFyZ2V0R3JvdXBzKCd0Z3MnLCB7IHRhcmdldEdyb3VwczogW2F0ZzEsIGF0ZzJdIH0pO1xuXG4gICAgICBhc2cuYXR0YWNoVG9BcHBsaWNhdGlvblRhcmdldEdyb3VwKGF0ZzEpO1xuICAgICAgYXNnLmF0dGFjaFRvQXBwbGljYXRpb25UYXJnZXRHcm91cChhdGcyKTtcblxuICAgICAgYXNnLnNjYWxlT25SZXF1ZXN0Q291bnQoJ3JlcXVlc3RzLXBlci1taW51dGUnLCB7IHRhcmdldFJlcXVlc3RzUGVyTWludXRlOiA2MCB9KTtcblxuICAgICAgZXhwZWN0KGFzZy5ub2RlLnZhbGlkYXRlKCkpLnRvQ29udGFpbkVxdWFsKCdDYW5ub24gdXNlIG11bHRpcGxlIHRhcmdldCBncm91cHMgaWYgYHNjYWxlT25SZXF1ZXN0Q291bnQoKWAgaXMgYmVpbmcgdXNlZC4nKTtcbiAgICB9KTtcbiAgfSk7XG5cbn0pO1xuXG5mdW5jdGlvbiBtb2NrVnBjKHN0YWNrOiBjZGsuU3RhY2spIHtcbiAgcmV0dXJuIGVjMi5WcGMuZnJvbVZwY0F0dHJpYnV0ZXMoc3RhY2ssICdNeVZwYycsIHtcbiAgICB2cGNJZDogJ215LXZwYycsXG4gICAgYXZhaWxhYmlsaXR5Wm9uZXM6IFsnYXoxJ10sXG4gICAgcHVibGljU3VibmV0SWRzOiBbJ3B1YjEnXSxcbiAgICBwcml2YXRlU3VibmV0SWRzOiBbJ3ByaTEnXSxcbiAgICBpc29sYXRlZFN1Ym5ldElkczogW10sXG4gIH0pO1xufVxuXG50ZXN0KCdDYW4gc2V0IGF1dG9TY2FsaW5nR3JvdXBOYW1lJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgdnBjID0gbW9ja1ZwYyhzdGFjayk7XG5cbiAgLy8gV0hFTlxuICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ015QVNHJywge1xuICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICB2cGMsXG4gICAgYXV0b1NjYWxpbmdHcm91cE5hbWU6ICdNeUFzZycsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgQXV0b1NjYWxpbmdHcm91cE5hbWU6ICdNeUFzZycsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2NhbiB1c2UgVnBjIGltcG9ydGVkIGZyb20gdW5wYXJzZWFibGUgbGlzdCB0b2tlbnMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIGNvbnN0IHZwY0lkID0gY2RrLkZuLmltcG9ydFZhbHVlKCdteVZwY0lkJyk7XG4gIGNvbnN0IGF2YWlsYWJpbGl0eVpvbmVzID0gY2RrLkZuLnNwbGl0KCcsJywgY2RrLkZuLmltcG9ydFZhbHVlKCdteUF2YWlsYWJpbGl0eVpvbmVzJykpO1xuICBjb25zdCBwdWJsaWNTdWJuZXRJZHMgPSBjZGsuRm4uc3BsaXQoJywnLCBjZGsuRm4uaW1wb3J0VmFsdWUoJ215UHVibGljU3VibmV0SWRzJykpO1xuICBjb25zdCBwcml2YXRlU3VibmV0SWRzID0gY2RrLkZuLnNwbGl0KCcsJywgY2RrLkZuLmltcG9ydFZhbHVlKCdteVByaXZhdGVTdWJuZXRJZHMnKSk7XG4gIGNvbnN0IGlzb2xhdGVkU3VibmV0SWRzID0gY2RrLkZuLnNwbGl0KCcsJywgY2RrLkZuLmltcG9ydFZhbHVlKCdteUlzb2xhdGVkU3VibmV0SWRzJykpO1xuXG4gIGNvbnN0IHZwYyA9IGVjMi5WcGMuZnJvbVZwY0F0dHJpYnV0ZXMoc3RhY2ssICdpbXBvcnRlZFZwYycsIHtcbiAgICB2cGNJZCxcbiAgICBhdmFpbGFiaWxpdHlab25lcyxcbiAgICBwdWJsaWNTdWJuZXRJZHMsXG4gICAgcHJpdmF0ZVN1Ym5ldElkcyxcbiAgICBpc29sYXRlZFN1Ym5ldElkcyxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ2Vjcy1lYzItYXNnJywge1xuICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICBtaW5DYXBhY2l0eTogMSxcbiAgICBtYXhDYXBhY2l0eTogMSxcbiAgICBkZXNpcmVkQ2FwYWNpdHk6IDEsXG4gICAgdnBjLFxuICAgIGFsbG93QWxsT3V0Ym91bmQ6IGZhbHNlLFxuICAgIGFzc29jaWF0ZVB1YmxpY0lwQWRkcmVzczogZmFsc2UsXG4gICAgdnBjU3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTIH0sXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgVlBDWm9uZUlkZW50aWZpZXI6IHtcbiAgICAgICdGbjo6U3BsaXQnOiBbJywnLCB7ICdGbjo6SW1wb3J0VmFsdWUnOiAnbXlQcml2YXRlU3VibmV0SWRzJyB9XSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdhZGQgcHJpY2UtY2FwYWNpdHktb3B0aW1pemVkJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIGNvbnN0IGx0ID0gTGF1bmNoVGVtcGxhdGUuZnJvbUxhdW5jaFRlbXBsYXRlQXR0cmlidXRlcyhzdGFjaywgJ2ltcG9ydGVkLWx0Jywge1xuICAgIGxhdW5jaFRlbXBsYXRlSWQ6ICd0ZXN0LWx0LWlkJyxcbiAgICB2ZXJzaW9uTnVtYmVyOiAnMCcsXG4gIH0pO1xuXG4gIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnbWlwLWFzZycsIHtcbiAgICBtaXhlZEluc3RhbmNlc1BvbGljeToge1xuICAgICAgbGF1bmNoVGVtcGxhdGU6IGx0LFxuICAgICAgbGF1bmNoVGVtcGxhdGVPdmVycmlkZXM6IFt7XG4gICAgICAgIGluc3RhbmNlVHlwZTogbmV3IEluc3RhbmNlVHlwZSgndDRnLm1pY3JvJyksXG4gICAgICAgIGxhdW5jaFRlbXBsYXRlOiBsdCxcbiAgICAgICAgd2VpZ2h0ZWRDYXBhY2l0eTogOSxcbiAgICAgIH1dLFxuICAgICAgaW5zdGFuY2VzRGlzdHJpYnV0aW9uOiB7XG4gICAgICAgIG9uRGVtYW5kQWxsb2NhdGlvblN0cmF0ZWd5OiBPbkRlbWFuZEFsbG9jYXRpb25TdHJhdGVneS5QUklPUklUSVpFRCxcbiAgICAgICAgb25EZW1hbmRCYXNlQ2FwYWNpdHk6IDEsXG4gICAgICAgIG9uRGVtYW5kUGVyY2VudGFnZUFib3ZlQmFzZUNhcGFjaXR5OiAyLFxuICAgICAgICBzcG90QWxsb2NhdGlvblN0cmF0ZWd5OiBTcG90QWxsb2NhdGlvblN0cmF0ZWd5LlBSSUNFX0NBUEFDSVRZX09QVElNSVpFRCxcbiAgICAgICAgc3BvdEluc3RhbmNlUG9vbHM6IDMsXG4gICAgICAgIHNwb3RNYXhQcmljZTogJzQnLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHZwYzogbW9ja1ZwYyhzdGFjayksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgTWl4ZWRJbnN0YW5jZXNQb2xpY3k6IHtcbiAgICAgIEluc3RhbmNlc0Rpc3RyaWJ1dGlvbjoge1xuICAgICAgICBTcG90QWxsb2NhdGlvblN0cmF0ZWd5OiAncHJpY2UtY2FwYWNpdHktb3B0aW1pemVkJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxuXG5mdW5jdGlvbiBtb2NrU2VjdXJpdHlHcm91cChzdGFjazogY2RrLlN0YWNrKSB7XG4gIHJldHVybiBlYzIuU2VjdXJpdHlHcm91cC5mcm9tU2VjdXJpdHlHcm91cElkKHN0YWNrLCAnTXlTRycsICdtb3N0LXNlY3VyZScpO1xufVxuXG5mdW5jdGlvbiBnZXRUZXN0U3RhY2soKTogY2RrLlN0YWNrIHtcbiAgcmV0dXJuIG5ldyBjZGsuU3RhY2sodW5kZWZpbmVkLCAnVGVzdFN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzEyMzQnLCByZWdpb246ICd1cy1lYXN0LTEnIH0gfSk7XG59XG4iXX0=