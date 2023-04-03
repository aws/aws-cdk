"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const aws_kms_1 = require("@aws-cdk/aws-kms");
const aws_s3_assets_1 = require("@aws-cdk/aws-s3-assets");
const aws_ssm_1 = require("@aws-cdk/aws-ssm");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const lib_1 = require("../lib");
let stack;
let vpc;
beforeEach(() => {
    stack = new core_1.Stack();
    vpc = new lib_1.Vpc(stack, 'VPC');
});
describe('instance', () => {
    test('instance is created with source/dest check switched off', () => {
        // WHEN
        new lib_1.Instance(stack, 'Instance', {
            vpc,
            machineImage: new lib_1.AmazonLinuxImage(),
            instanceType: lib_1.InstanceType.of(lib_1.InstanceClass.T3, lib_1.InstanceSize.LARGE),
            sourceDestCheck: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
            InstanceType: 't3.large',
            SourceDestCheck: false,
        });
    });
    test('instance is grantable', () => {
        // GIVEN
        const param = new aws_ssm_1.StringParameter(stack, 'Param', { stringValue: 'Foobar' });
        const instance = new lib_1.Instance(stack, 'Instance', {
            vpc,
            machineImage: new lib_1.AmazonLinuxImage(),
            instanceType: lib_1.InstanceType.of(lib_1.InstanceClass.T3, lib_1.InstanceSize.LARGE),
        });
        // WHEN
        param.grantRead(instance);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: [
                            'ssm:DescribeParameters',
                            'ssm:GetParameters',
                            'ssm:GetParameter',
                            'ssm:GetParameterHistory',
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
                                    ':ssm:',
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    ':',
                                    {
                                        Ref: 'AWS::AccountId',
                                    },
                                    ':parameter/',
                                    {
                                        Ref: 'Param165332EC',
                                    },
                                ],
                            ],
                        },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('instance architecture is correctly discerned for arm instances', () => {
        // GIVEN
        const sampleInstanceClasses = [
            'a1', 't4g', 'c6g', 'c7g', 'c6gd', 'c6gn', 'm6g', 'm6gd', 'r6g', 'r6gd', 'g5g', 'im4gn', 'is4gen',
            'a13', 't11g', 'y10ng', 'z11ngd',
        ];
        for (const instanceClass of sampleInstanceClasses) {
            // WHEN
            const instanceType = lib_1.InstanceType.of(instanceClass, lib_1.InstanceSize.XLARGE18);
            // THEN
            expect(instanceType.architecture).toBe(lib_1.InstanceArchitecture.ARM_64);
        }
    });
    test('instance architecture is correctly discerned for x86-64 instance', () => {
        // GIVEN
        const sampleInstanceClasses = ['c5', 'm5ad', 'r5n', 'm6', 't3a', 'r6i', 'r6a', 'p4de']; // A sample of x86-64 instance classes
        for (const instanceClass of sampleInstanceClasses) {
            // WHEN
            const instanceType = lib_1.InstanceType.of(instanceClass, lib_1.InstanceSize.XLARGE18);
            // THEN
            expect(instanceType.architecture).toBe(lib_1.InstanceArchitecture.X86_64);
        }
    });
    test('instances with local NVME drive are correctly named', () => {
        // GIVEN
        const sampleInstanceClassKeys = [{
                key: lib_1.InstanceClass.R5D,
                value: 'r5d',
            }, {
                key: lib_1.InstanceClass.MEMORY5_NVME_DRIVE,
                value: 'r5d',
            }, {
                key: lib_1.InstanceClass.R5AD,
                value: 'r5ad',
            }, {
                key: lib_1.InstanceClass.MEMORY5_AMD_NVME_DRIVE,
                value: 'r5ad',
            }, {
                key: lib_1.InstanceClass.M5AD,
                value: 'm5ad',
            }, {
                key: lib_1.InstanceClass.STANDARD5_AMD_NVME_DRIVE,
                value: 'm5ad',
            }]; // A sample of instances with NVME drives
        for (const instanceClass of sampleInstanceClassKeys) {
            // WHEN
            const instanceType = lib_1.InstanceType.of(instanceClass.key, lib_1.InstanceSize.LARGE);
            // THEN
            expect(instanceType.toString().split('.')[0]).toBe(instanceClass.value);
        }
    });
    test('instance architecture throws an error when instance type is invalid', () => {
        // GIVEN
        const malformedInstanceTypes = ['t4', 't4g.nano.', 't4gnano', ''];
        for (const malformedInstanceType of malformedInstanceTypes) {
            // WHEN
            const instanceType = new lib_1.InstanceType(malformedInstanceType);
            // THEN
            expect(() => instanceType.architecture).toThrow('Malformed instance type identifier');
        }
    });
    test('can propagate EBS volume tags', () => {
        // WHEN
        new lib_1.Instance(stack, 'Instance', {
            vpc,
            machineImage: new lib_1.AmazonLinuxImage(),
            instanceType: lib_1.InstanceType.of(lib_1.InstanceClass.T3, lib_1.InstanceSize.LARGE),
            propagateTagsToVolumeOnCreation: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
            PropagateTagsToVolumeOnCreation: true,
        });
    });
    describe('blockDeviceMappings', () => {
        test('can set blockDeviceMappings', () => {
            // WHEN
            const kmsKey = new aws_kms_1.Key(stack, 'EbsKey');
            new lib_1.Instance(stack, 'Instance', {
                vpc,
                machineImage: new lib_1.AmazonLinuxImage(),
                instanceType: lib_1.InstanceType.of(lib_1.InstanceClass.T3, lib_1.InstanceSize.LARGE),
                blockDevices: [{
                        deviceName: 'ebs',
                        mappingEnabled: true,
                        volume: lib_1.BlockDeviceVolume.ebs(15, {
                            deleteOnTermination: true,
                            encrypted: true,
                            volumeType: lib_1.EbsDeviceVolumeType.IO1,
                            iops: 5000,
                        }),
                    }, {
                        deviceName: 'ebs-gp3',
                        mappingEnabled: true,
                        volume: lib_1.BlockDeviceVolume.ebs(15, {
                            deleteOnTermination: true,
                            encrypted: true,
                            volumeType: lib_1.EbsDeviceVolumeType.GP3,
                            iops: 5000,
                        }),
                    }, {
                        deviceName: 'ebs-cmk',
                        mappingEnabled: true,
                        volume: lib_1.BlockDeviceVolume.ebs(15, {
                            deleteOnTermination: true,
                            encrypted: true,
                            kmsKey: kmsKey,
                            volumeType: lib_1.EbsDeviceVolumeType.IO1,
                            iops: 5000,
                        }),
                    }, {
                        deviceName: 'ebs-snapshot',
                        mappingEnabled: false,
                        volume: lib_1.BlockDeviceVolume.ebsFromSnapshot('snapshot-id', {
                            volumeSize: 500,
                            deleteOnTermination: false,
                            volumeType: lib_1.EbsDeviceVolumeType.SC1,
                        }),
                    }, {
                        deviceName: 'ephemeral',
                        volume: lib_1.BlockDeviceVolume.ephemeral(0),
                    }],
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
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
                    },
                    {
                        DeviceName: 'ebs-gp3',
                        Ebs: {
                            DeleteOnTermination: true,
                            Encrypted: true,
                            Iops: 5000,
                            VolumeSize: 15,
                            VolumeType: 'gp3',
                        },
                    },
                    {
                        DeviceName: 'ebs-cmk',
                        Ebs: {
                            DeleteOnTermination: true,
                            Encrypted: true,
                            KmsKeyId: {
                                'Fn::GetAtt': [
                                    'EbsKeyD3FEE551',
                                    'Arn',
                                ],
                            },
                            Iops: 5000,
                            VolumeSize: 15,
                            VolumeType: 'io1',
                        },
                    },
                    {
                        DeviceName: 'ebs-snapshot',
                        Ebs: {
                            DeleteOnTermination: false,
                            SnapshotId: 'snapshot-id',
                            VolumeSize: 500,
                            VolumeType: 'sc1',
                        },
                        NoDevice: {},
                    },
                    {
                        DeviceName: 'ephemeral',
                        VirtualName: 'ephemeral0',
                    },
                ],
            });
        });
        test('throws if ephemeral volumeIndex < 0', () => {
            // THEN
            expect(() => {
                new lib_1.Instance(stack, 'Instance', {
                    vpc,
                    machineImage: new lib_1.AmazonLinuxImage(),
                    instanceType: lib_1.InstanceType.of(lib_1.InstanceClass.T3, lib_1.InstanceSize.LARGE),
                    blockDevices: [{
                            deviceName: 'ephemeral',
                            volume: lib_1.BlockDeviceVolume.ephemeral(-1),
                        }],
                });
            }).toThrow(/volumeIndex must be a number starting from 0/);
        });
        test('throws if volumeType === IO1 without iops', () => {
            // THEN
            expect(() => {
                new lib_1.Instance(stack, 'Instance', {
                    vpc,
                    machineImage: new lib_1.AmazonLinuxImage(),
                    instanceType: lib_1.InstanceType.of(lib_1.InstanceClass.T3, lib_1.InstanceSize.LARGE),
                    blockDevices: [{
                            deviceName: 'ebs',
                            volume: lib_1.BlockDeviceVolume.ebs(15, {
                                deleteOnTermination: true,
                                encrypted: true,
                                volumeType: lib_1.EbsDeviceVolumeType.IO1,
                            }),
                        }],
                });
            }).toThrow(/ops property is required with volumeType: EbsDeviceVolumeType.IO1/);
        });
        test('throws if volumeType === IO2 without iops', () => {
            // THEN
            expect(() => {
                new lib_1.Instance(stack, 'Instance', {
                    vpc,
                    machineImage: new lib_1.AmazonLinuxImage(),
                    instanceType: lib_1.InstanceType.of(lib_1.InstanceClass.T3, lib_1.InstanceSize.LARGE),
                    blockDevices: [{
                            deviceName: 'ebs',
                            volume: lib_1.BlockDeviceVolume.ebs(15, {
                                deleteOnTermination: true,
                                encrypted: true,
                                volumeType: lib_1.EbsDeviceVolumeType.IO2,
                            }),
                        }],
                });
            }).toThrow(/ops property is required with volumeType: EbsDeviceVolumeType.IO1 and EbsDeviceVolumeType.IO2/);
        });
        test('warning if iops without volumeType', () => {
            new lib_1.Instance(stack, 'Instance', {
                vpc,
                machineImage: new lib_1.AmazonLinuxImage(),
                instanceType: lib_1.InstanceType.of(lib_1.InstanceClass.T3, lib_1.InstanceSize.LARGE),
                blockDevices: [{
                        deviceName: 'ebs',
                        volume: lib_1.BlockDeviceVolume.ebs(15, {
                            deleteOnTermination: true,
                            encrypted: true,
                            iops: 5000,
                        }),
                    }],
            });
            // THEN
            assertions_1.Annotations.fromStack(stack).hasWarning('/Default/Instance', 'iops will be ignored without volumeType: IO1, IO2, or GP3');
        });
        test('warning if iops and invalid volumeType', () => {
            new lib_1.Instance(stack, 'Instance', {
                vpc,
                machineImage: new lib_1.AmazonLinuxImage(),
                instanceType: lib_1.InstanceType.of(lib_1.InstanceClass.T3, lib_1.InstanceSize.LARGE),
                blockDevices: [{
                        deviceName: 'ebs',
                        volume: lib_1.BlockDeviceVolume.ebs(15, {
                            deleteOnTermination: true,
                            encrypted: true,
                            volumeType: lib_1.EbsDeviceVolumeType.GP2,
                            iops: 5000,
                        }),
                    }],
            });
            // THEN
            assertions_1.Annotations.fromStack(stack).hasWarning('/Default/Instance', 'iops will be ignored without volumeType: IO1, IO2, or GP3');
        });
    });
    test('instance can be created with Private IP Address', () => {
        // WHEN
        new lib_1.Instance(stack, 'Instance', {
            vpc,
            machineImage: new lib_1.AmazonLinuxImage(),
            instanceType: lib_1.InstanceType.of(lib_1.InstanceClass.T3, lib_1.InstanceSize.LARGE),
            privateIpAddress: '10.0.0.2',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
            InstanceType: 't3.large',
            PrivateIpAddress: '10.0.0.2',
        });
    });
    test('instance requires IMDSv2', () => {
        // WHEN
        const instance = new lib_1.Instance(stack, 'Instance', {
            vpc,
            machineImage: new lib_1.AmazonLinuxImage(),
            instanceType: new lib_1.InstanceType('t2.micro'),
            requireImdsv2: true,
        });
        // Force stack synth so the InstanceRequireImdsv2Aspect is applied
        assertions_1.Template.fromStack(stack);
        // THEN
        const launchTemplate = instance.node.tryFindChild('LaunchTemplate');
        expect(launchTemplate).toBeDefined();
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateName: stack.resolve(launchTemplate.launchTemplateName),
            LaunchTemplateData: {
                MetadataOptions: {
                    HttpTokens: 'required',
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
            LaunchTemplate: {
                LaunchTemplateName: stack.resolve(launchTemplate.launchTemplateName),
            },
        });
    });
    describe('Detailed Monitoring', () => {
        test('instance with Detailed Monitoring enabled', () => {
            // WHEN
            new lib_1.Instance(stack, 'Instance', {
                vpc,
                machineImage: new lib_1.AmazonLinuxImage(),
                instanceType: new lib_1.InstanceType('t2.micro'),
                detailedMonitoring: true,
            });
            // Force stack synth so the Instance is applied
            assertions_1.Template.fromStack(stack);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
                Monitoring: true,
            });
        });
        test('instance with Detailed Monitoring disabled', () => {
            // WHEN
            new lib_1.Instance(stack, 'Instance', {
                vpc,
                machineImage: new lib_1.AmazonLinuxImage(),
                instanceType: new lib_1.InstanceType('t2.micro'),
                detailedMonitoring: false,
            });
            // Force stack synth so the Instance is applied
            assertions_1.Template.fromStack(stack);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
                Monitoring: false,
            });
        });
        test('instance with Detailed Monitoring unset falls back to disabled', () => {
            // WHEN
            new lib_1.Instance(stack, 'Instance', {
                vpc,
                machineImage: new lib_1.AmazonLinuxImage(),
                instanceType: new lib_1.InstanceType('t2.micro'),
            });
            // Force stack synth so the Instance is applied
            assertions_1.Template.fromStack(stack);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
                Monitoring: assertions_1.Match.absent(),
            });
        });
    });
});
test('add CloudFormation Init to instance', () => {
    // GIVEN
    new lib_1.Instance(stack, 'Instance', {
        vpc,
        machineImage: new lib_1.AmazonLinuxImage(),
        instanceType: lib_1.InstanceType.of(lib_1.InstanceClass.T3, lib_1.InstanceSize.LARGE),
        init: lib_1.CloudFormationInit.fromElements(lib_1.InitCommand.shellCommand('echo hello')),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
        UserData: {
            'Fn::Base64': {
                'Fn::Join': ['', [
                        '#!/bin/bash\n# fingerprint: 85ac432b1de1144f\n(\n  set +e\n  /opt/aws/bin/cfn-init -v --region ',
                        { Ref: 'AWS::Region' },
                        ' --stack ',
                        { Ref: 'AWS::StackName' },
                        ' --resource InstanceC1063A87 -c default\n  /opt/aws/bin/cfn-signal -e $? --region ',
                        { Ref: 'AWS::Region' },
                        ' --stack ',
                        { Ref: 'AWS::StackName' },
                        ' --resource InstanceC1063A87\n  cat /var/log/cfn-init.log >&2\n)',
                    ]],
            },
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: assertions_1.Match.arrayWith([{
                    Action: ['cloudformation:DescribeStackResource', 'cloudformation:SignalResource'],
                    Effect: 'Allow',
                    Resource: { Ref: 'AWS::StackId' },
                }]),
            Version: '2012-10-17',
        },
    });
    assertions_1.Template.fromStack(stack).hasResource('AWS::EC2::Instance', {
        CreationPolicy: {
            ResourceSignal: {
                Count: 1,
                Timeout: 'PT5M',
            },
        },
    });
});
test('cause replacement from s3 asset in userdata', () => {
    // GIVEN
    const app = new core_1.App({
        context: {
            [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
        },
    });
    stack = new core_1.Stack(app);
    vpc = new lib_1.Vpc(stack, 'Vpc)');
    const userData1 = lib_1.UserData.forLinux();
    const asset1 = new aws_s3_assets_1.Asset(stack, 'UserDataAssets1', {
        path: path.join(__dirname, 'asset-fixture', 'data.txt'),
    });
    userData1.addS3DownloadCommand({ bucket: asset1.bucket, bucketKey: asset1.s3ObjectKey });
    const userData2 = lib_1.UserData.forLinux();
    const asset2 = new aws_s3_assets_1.Asset(stack, 'UserDataAssets2', {
        path: path.join(__dirname, 'asset-fixture', 'data.txt'),
    });
    userData2.addS3DownloadCommand({ bucket: asset2.bucket, bucketKey: asset2.s3ObjectKey });
    // WHEN
    new lib_1.Instance(stack, 'InstanceOne', {
        vpc,
        machineImage: new lib_1.AmazonLinuxImage(),
        instanceType: lib_1.InstanceType.of(lib_1.InstanceClass.T3, lib_1.InstanceSize.LARGE),
        userData: userData1,
        userDataCausesReplacement: true,
    });
    new lib_1.Instance(stack, 'InstanceTwo', {
        vpc,
        machineImage: new lib_1.AmazonLinuxImage(),
        instanceType: lib_1.InstanceType.of(lib_1.InstanceClass.T3, lib_1.InstanceSize.LARGE),
        userData: userData2,
        userDataCausesReplacement: true,
    });
    // THEN -- both instances have the same userData hash, telling us the hash is based
    // on the actual asset hash and not accidentally on the token stringification of them.
    // (which would base the hash on '${Token[1234.bla]}'
    const hash = 'f88eace39faf39d7';
    assertions_1.Template.fromStack(stack).templateMatches(assertions_1.Match.objectLike({
        Resources: assertions_1.Match.objectLike({
            [`InstanceOne5B821005${hash}`]: assertions_1.Match.objectLike({
                Type: 'AWS::EC2::Instance',
                Properties: assertions_1.Match.anyValue(),
            }),
            [`InstanceTwoDC29A7A7${hash}`]: assertions_1.Match.objectLike({
                Type: 'AWS::EC2::Instance',
                Properties: assertions_1.Match.anyValue(),
            }),
        }),
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFuY2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluc3RhbmNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0Isb0RBQW1FO0FBQ25FLDhDQUF1QztBQUN2QywwREFBK0M7QUFDL0MsOENBQW1EO0FBQ25ELHdDQUEyQztBQUMzQyx5Q0FBeUM7QUFDekMsZ0NBY2dCO0FBRWhCLElBQUksS0FBWSxDQUFDO0FBQ2pCLElBQUksR0FBUSxDQUFDO0FBQ2IsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBQ3BCLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDOUIsQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtJQUN4QixJQUFJLENBQUMseURBQXlELEVBQUUsR0FBRyxFQUFFO1FBQ25FLE9BQU87UUFDUCxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQzlCLEdBQUc7WUFDSCxZQUFZLEVBQUUsSUFBSSxzQkFBZ0IsRUFBRTtZQUNwQyxZQUFZLEVBQUUsa0JBQVksQ0FBQyxFQUFFLENBQUMsbUJBQWEsQ0FBQyxFQUFFLEVBQUUsa0JBQVksQ0FBQyxLQUFLLENBQUM7WUFDbkUsZUFBZSxFQUFFLEtBQUs7U0FDdkIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLG9CQUFvQixFQUFFO1lBQ3BFLFlBQVksRUFBRSxVQUFVO1lBQ3hCLGVBQWUsRUFBRSxLQUFLO1NBQ3ZCLENBQUMsQ0FBQztJQUdMLENBQUMsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRTtRQUNqQyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFB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Q0FBQyxtQkFBYSxDQUFDLEVBQUUsRUFBRSxrQkFBWSxDQUFDLEtBQUssQ0FBQztRQUNuRSxRQUFRLEVBQUUsU0FBUztRQUNuQix5QkFBeUIsRUFBRSxJQUFJO0tBQ2hDLENBQUMsQ0FBQztJQUNILElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7UUFDakMsR0FBRztRQUNILFlBQVksRUFBRSxJQUFJLHNCQUFnQixFQUFFO1FBQ3BDLFlBQVksRUFBRSxrQkFBWSxDQUFDLEVBQUUsQ0FBQyxtQkFBYSxDQUFDLEVBQUUsRUFBRSxrQkFBWSxDQUFDLEtBQUssQ0FBQztRQUNuRSxRQUFRLEVBQUUsU0FBUztRQUNuQix5QkFBeUIsRUFBRSxJQUFJO0tBQ2hDLENBQUMsQ0FBQztJQUVILG1GQUFtRjtJQUNuRixzRkFBc0Y7SUFDdEYscURBQXFEO0lBQ3JELE1BQU0sSUFBSSxHQUFHLGtCQUFrQixDQUFDO0lBQ2hDLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQyxrQkFBSyxDQUFDLFVBQVUsQ0FBQztRQUN6RCxTQUFTLEVBQUUsa0JBQUssQ0FBQyxVQUFVLENBQUM7WUFDMUIsQ0FBQyxzQkFBc0IsSUFBSSxFQUFFLENBQUMsRUFBRSxrQkFBSyxDQUFDLFVBQVUsQ0FBQztnQkFDL0MsSUFBSSxFQUFFLG9CQUFvQjtnQkFDMUIsVUFBVSxFQUFFLGtCQUFLLENBQUMsUUFBUSxFQUFFO2FBQzdCLENBQUM7WUFDRixDQUFDLHNCQUFzQixJQUFJLEVBQUUsQ0FBQyxFQUFFLGtCQUFLLENBQUMsVUFBVSxDQUFDO2dCQUMvQyxJQUFJLEVBQUUsb0JBQW9CO2dCQUMxQixVQUFVLEVBQUUsa0JBQUssQ0FBQyxRQUFRLEVBQUU7YUFDN0IsQ0FBQztTQUNILENBQUM7S0FDSCxDQUFDLENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEFubm90YXRpb25zLCBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IEtleSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1rbXMnO1xuaW1wb3J0IHsgQXNzZXQgfSBmcm9tICdAYXdzLWNkay9hd3MtczMtYXNzZXRzJztcbmltcG9ydCB7IFN0cmluZ1BhcmFtZXRlciB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1zc20nO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7XG4gIEFtYXpvbkxpbnV4SW1hZ2UsXG4gIEJsb2NrRGV2aWNlVm9sdW1lLFxuICBDbG91ZEZvcm1hdGlvbkluaXQsXG4gIEVic0RldmljZVZvbHVtZVR5cGUsXG4gIEluaXRDb21tYW5kLFxuICBJbnN0YW5jZSxcbiAgSW5zdGFuY2VBcmNoaXRlY3R1cmUsXG4gIEluc3RhbmNlQ2xhc3MsXG4gIEluc3RhbmNlU2l6ZSxcbiAgSW5zdGFuY2VUeXBlLFxuICBMYXVuY2hUZW1wbGF0ZSxcbiAgVXNlckRhdGEsXG4gIFZwYyxcbn0gZnJvbSAnLi4vbGliJztcblxubGV0IHN0YWNrOiBTdGFjaztcbmxldCB2cGM6IFZwYztcbmJlZm9yZUVhY2goKCkgPT4ge1xuICBzdGFjayA9IG5ldyBTdGFjaygpO1xuICB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG59KTtcblxuZGVzY3JpYmUoJ2luc3RhbmNlJywgKCkgPT4ge1xuICB0ZXN0KCdpbnN0YW5jZSBpcyBjcmVhdGVkIHdpdGggc291cmNlL2Rlc3QgY2hlY2sgc3dpdGNoZWQgb2ZmJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZScsIHtcbiAgICAgIHZwYyxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuVDMsIEluc3RhbmNlU2l6ZS5MQVJHRSksXG4gICAgICBzb3VyY2VEZXN0Q2hlY2s6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6SW5zdGFuY2UnLCB7XG4gICAgICBJbnN0YW5jZVR5cGU6ICd0My5sYXJnZScsXG4gICAgICBTb3VyY2VEZXN0Q2hlY2s6IGZhbHNlLFxuICAgIH0pO1xuXG5cbiAgfSk7XG4gIHRlc3QoJ2luc3RhbmNlIGlzIGdyYW50YWJsZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHBhcmFtID0gbmV3IFN0cmluZ1BhcmFtZXRlcihzdGFjaywgJ1BhcmFtJywgeyBzdHJpbmdWYWx1ZTogJ0Zvb2JhcicgfSk7XG4gICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZScsIHtcbiAgICAgIHZwYyxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuVDMsIEluc3RhbmNlU2l6ZS5MQVJHRSksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgcGFyYW0uZ3JhbnRSZWFkKGluc3RhbmNlKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnc3NtOkRlc2NyaWJlUGFyYW1ldGVycycsXG4gICAgICAgICAgICAgICdzc206R2V0UGFyYW1ldGVycycsXG4gICAgICAgICAgICAgICdzc206R2V0UGFyYW1ldGVyJyxcbiAgICAgICAgICAgICAgJ3NzbTpHZXRQYXJhbWV0ZXJIaXN0b3J5JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzpzc206JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6cGFyYW1ldGVyLycsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ1BhcmFtMTY1MzMyRUMnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuXG5cbiAgfSk7XG4gIHRlc3QoJ2luc3RhbmNlIGFyY2hpdGVjdHVyZSBpcyBjb3JyZWN0bHkgZGlzY2VybmVkIGZvciBhcm0gaW5zdGFuY2VzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc2FtcGxlSW5zdGFuY2VDbGFzc2VzID0gW1xuICAgICAgJ2ExJywgJ3Q0ZycsICdjNmcnLCAnYzdnJywgJ2M2Z2QnLCAnYzZnbicsICdtNmcnLCAnbTZnZCcsICdyNmcnLCAncjZnZCcsICdnNWcnLCAnaW00Z24nLCAnaXM0Z2VuJywgLy8gY3VycmVudCBHcmF2aXRvbi1iYXNlZCBpbnN0YW5jZSBjbGFzc2VzXG4gICAgICAnYTEzJywgJ3QxMWcnLCAneTEwbmcnLCAnejExbmdkJywgLy8gdGhlb3JldGljYWwgZnV0dXJlIEdyYXZpdG9uLWJhc2VkIGluc3RhbmNlIGNsYXNzZXNcbiAgICBdO1xuXG4gICAgZm9yIChjb25zdCBpbnN0YW5jZUNsYXNzIG9mIHNhbXBsZUluc3RhbmNlQ2xhc3Nlcykge1xuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgaW5zdGFuY2VUeXBlID0gSW5zdGFuY2VUeXBlLm9mKGluc3RhbmNlQ2xhc3MgYXMgSW5zdGFuY2VDbGFzcywgSW5zdGFuY2VTaXplLlhMQVJHRTE4KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGluc3RhbmNlVHlwZS5hcmNoaXRlY3R1cmUpLnRvQmUoSW5zdGFuY2VBcmNoaXRlY3R1cmUuQVJNXzY0KTtcbiAgICB9XG5cblxuICB9KTtcbiAgdGVzdCgnaW5zdGFuY2UgYXJjaGl0ZWN0dXJlIGlzIGNvcnJlY3RseSBkaXNjZXJuZWQgZm9yIHg4Ni02NCBpbnN0YW5jZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHNhbXBsZUluc3RhbmNlQ2xhc3NlcyA9IFsnYzUnLCAnbTVhZCcsICdyNW4nLCAnbTYnLCAndDNhJywgJ3I2aScsICdyNmEnLCAncDRkZSddOyAvLyBBIHNhbXBsZSBvZiB4ODYtNjQgaW5zdGFuY2UgY2xhc3Nlc1xuXG4gICAgZm9yIChjb25zdCBpbnN0YW5jZUNsYXNzIG9mIHNhbXBsZUluc3RhbmNlQ2xhc3Nlcykge1xuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgaW5zdGFuY2VUeXBlID0gSW5zdGFuY2VUeXBlLm9mKGluc3RhbmNlQ2xhc3MgYXMgSW5zdGFuY2VDbGFzcywgSW5zdGFuY2VTaXplLlhMQVJHRTE4KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGluc3RhbmNlVHlwZS5hcmNoaXRlY3R1cmUpLnRvQmUoSW5zdGFuY2VBcmNoaXRlY3R1cmUuWDg2XzY0KTtcbiAgICB9XG5cblxuICB9KTtcblxuICB0ZXN0KCdpbnN0YW5jZXMgd2l0aCBsb2NhbCBOVk1FIGRyaXZlIGFyZSBjb3JyZWN0bHkgbmFtZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzYW1wbGVJbnN0YW5jZUNsYXNzS2V5cyA9IFt7XG4gICAgICBrZXk6IEluc3RhbmNlQ2xhc3MuUjVELFxuICAgICAgdmFsdWU6ICdyNWQnLFxuICAgIH0sIHtcbiAgICAgIGtleTogSW5zdGFuY2VDbGFzcy5NRU1PUlk1X05WTUVfRFJJVkUsXG4gICAgICB2YWx1ZTogJ3I1ZCcsXG4gICAgfSwge1xuICAgICAga2V5OiBJbnN0YW5jZUNsYXNzLlI1QUQsXG4gICAgICB2YWx1ZTogJ3I1YWQnLFxuICAgIH0sIHtcbiAgICAgIGtleTogSW5zdGFuY2VDbGFzcy5NRU1PUlk1X0FNRF9OVk1FX0RSSVZFLFxuICAgICAgdmFsdWU6ICdyNWFkJyxcbiAgICB9LCB7XG4gICAgICBrZXk6IEluc3RhbmNlQ2xhc3MuTTVBRCxcbiAgICAgIHZhbHVlOiAnbTVhZCcsXG4gICAgfSwge1xuICAgICAga2V5OiBJbnN0YW5jZUNsYXNzLlNUQU5EQVJENV9BTURfTlZNRV9EUklWRSxcbiAgICAgIHZhbHVlOiAnbTVhZCcsXG4gICAgfV07IC8vIEEgc2FtcGxlIG9mIGluc3RhbmNlcyB3aXRoIE5WTUUgZHJpdmVzXG5cbiAgICBmb3IgKGNvbnN0IGluc3RhbmNlQ2xhc3Mgb2Ygc2FtcGxlSW5zdGFuY2VDbGFzc0tleXMpIHtcbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGluc3RhbmNlVHlwZSA9IEluc3RhbmNlVHlwZS5vZihpbnN0YW5jZUNsYXNzLmtleSwgSW5zdGFuY2VTaXplLkxBUkdFKTtcbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChpbnN0YW5jZVR5cGUudG9TdHJpbmcoKS5zcGxpdCgnLicpWzBdKS50b0JlKGluc3RhbmNlQ2xhc3MudmFsdWUpO1xuICAgIH1cbiAgfSk7XG4gIHRlc3QoJ2luc3RhbmNlIGFyY2hpdGVjdHVyZSB0aHJvd3MgYW4gZXJyb3Igd2hlbiBpbnN0YW5jZSB0eXBlIGlzIGludmFsaWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBtYWxmb3JtZWRJbnN0YW5jZVR5cGVzID0gWyd0NCcsICd0NGcubmFuby4nLCAndDRnbmFubycsICcnXTtcblxuICAgIGZvciAoY29uc3QgbWFsZm9ybWVkSW5zdGFuY2VUeXBlIG9mIG1hbGZvcm1lZEluc3RhbmNlVHlwZXMpIHtcbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGluc3RhbmNlVHlwZSA9IG5ldyBJbnN0YW5jZVR5cGUobWFsZm9ybWVkSW5zdGFuY2VUeXBlKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IGluc3RhbmNlVHlwZS5hcmNoaXRlY3R1cmUpLnRvVGhyb3coJ01hbGZvcm1lZCBpbnN0YW5jZSB0eXBlIGlkZW50aWZpZXInKTtcbiAgICB9XG5cblxuICB9KTtcbiAgdGVzdCgnY2FuIHByb3BhZ2F0ZSBFQlMgdm9sdW1lIHRhZ3MnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBJbnN0YW5jZShzdGFjaywgJ0luc3RhbmNlJywge1xuICAgICAgdnBjLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgaW5zdGFuY2VUeXBlOiBJbnN0YW5jZVR5cGUub2YoSW5zdGFuY2VDbGFzcy5UMywgSW5zdGFuY2VTaXplLkxBUkdFKSxcbiAgICAgIHByb3BhZ2F0ZVRhZ3NUb1ZvbHVtZU9uQ3JlYXRpb246IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpJbnN0YW5jZScsIHtcbiAgICAgIFByb3BhZ2F0ZVRhZ3NUb1ZvbHVtZU9uQ3JlYXRpb246IHRydWUsXG4gICAgfSk7XG4gIH0pO1xuICBkZXNjcmliZSgnYmxvY2tEZXZpY2VNYXBwaW5ncycsICgpID0+IHtcbiAgICB0ZXN0KCdjYW4gc2V0IGJsb2NrRGV2aWNlTWFwcGluZ3MnLCAoKSA9PiB7XG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBrbXNLZXkgPSBuZXcgS2V5KHN0YWNrLCAnRWJzS2V5Jyk7XG4gICAgICBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZScsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBBbWF6b25MaW51eEltYWdlKCksXG4gICAgICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuVDMsIEluc3RhbmNlU2l6ZS5MQVJHRSksXG4gICAgICAgIGJsb2NrRGV2aWNlczogW3tcbiAgICAgICAgICBkZXZpY2VOYW1lOiAnZWJzJyxcbiAgICAgICAgICBtYXBwaW5nRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICB2b2x1bWU6IEJsb2NrRGV2aWNlVm9sdW1lLmVicygxNSwge1xuICAgICAgICAgICAgZGVsZXRlT25UZXJtaW5hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIGVuY3J5cHRlZDogdHJ1ZSxcbiAgICAgICAgICAgIHZvbHVtZVR5cGU6IEVic0RldmljZVZvbHVtZVR5cGUuSU8xLFxuICAgICAgICAgICAgaW9wczogNTAwMCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSwge1xuICAgICAgICAgIGRldmljZU5hbWU6ICdlYnMtZ3AzJyxcbiAgICAgICAgICBtYXBwaW5nRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICB2b2x1bWU6IEJsb2NrRGV2aWNlVm9sdW1lLmVicygxNSwge1xuICAgICAgICAgICAgZGVsZXRlT25UZXJtaW5hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIGVuY3J5cHRlZDogdHJ1ZSxcbiAgICAgICAgICAgIHZvbHVtZVR5cGU6IEVic0RldmljZVZvbHVtZVR5cGUuR1AzLFxuICAgICAgICAgICAgaW9wczogNTAwMCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSwge1xuICAgICAgICAgIGRldmljZU5hbWU6ICdlYnMtY21rJyxcbiAgICAgICAgICBtYXBwaW5nRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICB2b2x1bWU6IEJsb2NrRGV2aWNlVm9sdW1lLmVicygxNSwge1xuICAgICAgICAgICAgZGVsZXRlT25UZXJtaW5hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIGVuY3J5cHRlZDogdHJ1ZSxcbiAgICAgICAgICAgIGttc0tleToga21zS2V5LFxuICAgICAgICAgICAgdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5JTzEsXG4gICAgICAgICAgICBpb3BzOiA1MDAwLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZGV2aWNlTmFtZTogJ2Vicy1zbmFwc2hvdCcsXG4gICAgICAgICAgbWFwcGluZ0VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgIHZvbHVtZTogQmxvY2tEZXZpY2VWb2x1bWUuZWJzRnJvbVNuYXBzaG90KCdzbmFwc2hvdC1pZCcsIHtcbiAgICAgICAgICAgIHZvbHVtZVNpemU6IDUwMCxcbiAgICAgICAgICAgIGRlbGV0ZU9uVGVybWluYXRpb246IGZhbHNlLFxuICAgICAgICAgICAgdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5TQzEsXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBkZXZpY2VOYW1lOiAnZXBoZW1lcmFsJyxcbiAgICAgICAgICB2b2x1bWU6IEJsb2NrRGV2aWNlVm9sdW1lLmVwaGVtZXJhbCgwKSxcbiAgICAgICAgfV0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpJbnN0YW5jZScsIHtcbiAgICAgICAgQmxvY2tEZXZpY2VNYXBwaW5nczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIERldmljZU5hbWU6ICdlYnMnLFxuICAgICAgICAgICAgRWJzOiB7XG4gICAgICAgICAgICAgIERlbGV0ZU9uVGVybWluYXRpb246IHRydWUsXG4gICAgICAgICAgICAgIEVuY3J5cHRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgSW9wczogNTAwMCxcbiAgICAgICAgICAgICAgVm9sdW1lU2l6ZTogMTUsXG4gICAgICAgICAgICAgIFZvbHVtZVR5cGU6ICdpbzEnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIERldmljZU5hbWU6ICdlYnMtZ3AzJyxcbiAgICAgICAgICAgIEViczoge1xuICAgICAgICAgICAgICBEZWxldGVPblRlcm1pbmF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgICBFbmNyeXB0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgIElvcHM6IDUwMDAsXG4gICAgICAgICAgICAgIFZvbHVtZVNpemU6IDE1LFxuICAgICAgICAgICAgICBWb2x1bWVUeXBlOiAnZ3AzJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBEZXZpY2VOYW1lOiAnZWJzLWNtaycsXG4gICAgICAgICAgICBFYnM6IHtcbiAgICAgICAgICAgICAgRGVsZXRlT25UZXJtaW5hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgRW5jcnlwdGVkOiB0cnVlLFxuICAgICAgICAgICAgICBLbXNLZXlJZDoge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ0Vic0tleUQzRkVFNTUxJyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIElvcHM6IDUwMDAsXG4gICAgICAgICAgICAgIFZvbHVtZVNpemU6IDE1LFxuICAgICAgICAgICAgICBWb2x1bWVUeXBlOiAnaW8xJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBEZXZpY2VOYW1lOiAnZWJzLXNuYXBzaG90JyxcbiAgICAgICAgICAgIEViczoge1xuICAgICAgICAgICAgICBEZWxldGVPblRlcm1pbmF0aW9uOiBmYWxzZSxcbiAgICAgICAgICAgICAgU25hcHNob3RJZDogJ3NuYXBzaG90LWlkJyxcbiAgICAgICAgICAgICAgVm9sdW1lU2l6ZTogNTAwLFxuICAgICAgICAgICAgICBWb2x1bWVUeXBlOiAnc2MxJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBOb0RldmljZToge30sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBEZXZpY2VOYW1lOiAnZXBoZW1lcmFsJyxcbiAgICAgICAgICAgIFZpcnR1YWxOYW1lOiAnZXBoZW1lcmFsMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBpZiBlcGhlbWVyYWwgdm9sdW1lSW5kZXggPCAwJywgKCkgPT4ge1xuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IEluc3RhbmNlKHN0YWNrLCAnSW5zdGFuY2UnLCB7XG4gICAgICAgICAgdnBjLFxuICAgICAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgICAgICBpbnN0YW5jZVR5cGU6IEluc3RhbmNlVHlwZS5vZihJbnN0YW5jZUNsYXNzLlQzLCBJbnN0YW5jZVNpemUuTEFSR0UpLFxuICAgICAgICAgIGJsb2NrRGV2aWNlczogW3tcbiAgICAgICAgICAgIGRldmljZU5hbWU6ICdlcGhlbWVyYWwnLFxuICAgICAgICAgICAgdm9sdW1lOiBCbG9ja0RldmljZVZvbHVtZS5lcGhlbWVyYWwoLTEpLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL3ZvbHVtZUluZGV4IG11c3QgYmUgYSBudW1iZXIgc3RhcnRpbmcgZnJvbSAwLyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIGlmIHZvbHVtZVR5cGUgPT09IElPMSB3aXRob3V0IGlvcHMnLCAoKSA9PiB7XG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZScsIHtcbiAgICAgICAgICB2cGMsXG4gICAgICAgICAgbWFjaGluZUltYWdlOiBuZXcgQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuVDMsIEluc3RhbmNlU2l6ZS5MQVJHRSksXG4gICAgICAgICAgYmxvY2tEZXZpY2VzOiBbe1xuICAgICAgICAgICAgZGV2aWNlTmFtZTogJ2VicycsXG4gICAgICAgICAgICB2b2x1bWU6IEJsb2NrRGV2aWNlVm9sdW1lLmVicygxNSwge1xuICAgICAgICAgICAgICBkZWxldGVPblRlcm1pbmF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgICBlbmNyeXB0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgIHZvbHVtZVR5cGU6IEVic0RldmljZVZvbHVtZVR5cGUuSU8xLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvb3BzIHByb3BlcnR5IGlzIHJlcXVpcmVkIHdpdGggdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5JTzEvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBpZiB2b2x1bWVUeXBlID09PSBJTzIgd2l0aG91dCBpb3BzJywgKCkgPT4ge1xuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IEluc3RhbmNlKHN0YWNrLCAnSW5zdGFuY2UnLCB7XG4gICAgICAgICAgdnBjLFxuICAgICAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgICAgICBpbnN0YW5jZVR5cGU6IEluc3RhbmNlVHlwZS5vZihJbnN0YW5jZUNsYXNzLlQzLCBJbnN0YW5jZVNpemUuTEFSR0UpLFxuICAgICAgICAgIGJsb2NrRGV2aWNlczogW3tcbiAgICAgICAgICAgIGRldmljZU5hbWU6ICdlYnMnLFxuICAgICAgICAgICAgdm9sdW1lOiBCbG9ja0RldmljZVZvbHVtZS5lYnMoMTUsIHtcbiAgICAgICAgICAgICAgZGVsZXRlT25UZXJtaW5hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgZW5jcnlwdGVkOiB0cnVlLFxuICAgICAgICAgICAgICB2b2x1bWVUeXBlOiBFYnNEZXZpY2VWb2x1bWVUeXBlLklPMixcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL29wcyBwcm9wZXJ0eSBpcyByZXF1aXJlZCB3aXRoIHZvbHVtZVR5cGU6IEVic0RldmljZVZvbHVtZVR5cGUuSU8xIGFuZCBFYnNEZXZpY2VWb2x1bWVUeXBlLklPMi8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnd2FybmluZyBpZiBpb3BzIHdpdGhvdXQgdm9sdW1lVHlwZScsICgpID0+IHtcbiAgICAgIG5ldyBJbnN0YW5jZShzdGFjaywgJ0luc3RhbmNlJywge1xuICAgICAgICB2cGMsXG4gICAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBJbnN0YW5jZVR5cGUub2YoSW5zdGFuY2VDbGFzcy5UMywgSW5zdGFuY2VTaXplLkxBUkdFKSxcbiAgICAgICAgYmxvY2tEZXZpY2VzOiBbe1xuICAgICAgICAgIGRldmljZU5hbWU6ICdlYnMnLFxuICAgICAgICAgIHZvbHVtZTogQmxvY2tEZXZpY2VWb2x1bWUuZWJzKDE1LCB7XG4gICAgICAgICAgICBkZWxldGVPblRlcm1pbmF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgZW5jcnlwdGVkOiB0cnVlLFxuICAgICAgICAgICAgaW9wczogNTAwMCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfV0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5oYXNXYXJuaW5nKCcvRGVmYXVsdC9JbnN0YW5jZScsICdpb3BzIHdpbGwgYmUgaWdub3JlZCB3aXRob3V0IHZvbHVtZVR5cGU6IElPMSwgSU8yLCBvciBHUDMnKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dhcm5pbmcgaWYgaW9wcyBhbmQgaW52YWxpZCB2b2x1bWVUeXBlJywgKCkgPT4ge1xuICAgICAgbmV3IEluc3RhbmNlKHN0YWNrLCAnSW5zdGFuY2UnLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgbWFjaGluZUltYWdlOiBuZXcgQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgICBpbnN0YW5jZVR5cGU6IEluc3RhbmNlVHlwZS5vZihJbnN0YW5jZUNsYXNzLlQzLCBJbnN0YW5jZVNpemUuTEFSR0UpLFxuICAgICAgICBibG9ja0RldmljZXM6IFt7XG4gICAgICAgICAgZGV2aWNlTmFtZTogJ2VicycsXG4gICAgICAgICAgdm9sdW1lOiBCbG9ja0RldmljZVZvbHVtZS5lYnMoMTUsIHtcbiAgICAgICAgICAgIGRlbGV0ZU9uVGVybWluYXRpb246IHRydWUsXG4gICAgICAgICAgICBlbmNyeXB0ZWQ6IHRydWUsXG4gICAgICAgICAgICB2b2x1bWVUeXBlOiBFYnNEZXZpY2VWb2x1bWVUeXBlLkdQMixcbiAgICAgICAgICAgIGlvcHM6IDUwMDAsXG4gICAgICAgICAgfSksXG4gICAgICAgIH1dLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIEFubm90YXRpb25zLmZyb21TdGFjayhzdGFjaykuaGFzV2FybmluZygnL0RlZmF1bHQvSW5zdGFuY2UnLCAnaW9wcyB3aWxsIGJlIGlnbm9yZWQgd2l0aG91dCB2b2x1bWVUeXBlOiBJTzEsIElPMiwgb3IgR1AzJyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2luc3RhbmNlIGNhbiBiZSBjcmVhdGVkIHdpdGggUHJpdmF0ZSBJUCBBZGRyZXNzJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZScsIHtcbiAgICAgIHZwYyxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuVDMsIEluc3RhbmNlU2l6ZS5MQVJHRSksXG4gICAgICBwcml2YXRlSXBBZGRyZXNzOiAnMTAuMC4wLjInLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6SW5zdGFuY2UnLCB7XG4gICAgICBJbnN0YW5jZVR5cGU6ICd0My5sYXJnZScsXG4gICAgICBQcml2YXRlSXBBZGRyZXNzOiAnMTAuMC4wLjInLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnaW5zdGFuY2UgcmVxdWlyZXMgSU1EU3YyJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyBJbnN0YW5jZShzdGFjaywgJ0luc3RhbmNlJywge1xuICAgICAgdnBjLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpLFxuICAgICAgcmVxdWlyZUltZHN2MjogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIEZvcmNlIHN0YWNrIHN5bnRoIHNvIHRoZSBJbnN0YW5jZVJlcXVpcmVJbWRzdjJBc3BlY3QgaXMgYXBwbGllZFxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgbGF1bmNoVGVtcGxhdGUgPSBpbnN0YW5jZS5ub2RlLnRyeUZpbmRDaGlsZCgnTGF1bmNoVGVtcGxhdGUnKSBhcyBMYXVuY2hUZW1wbGF0ZTtcbiAgICBleHBlY3QobGF1bmNoVGVtcGxhdGUpLnRvQmVEZWZpbmVkKCk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlTmFtZTogc3RhY2sucmVzb2x2ZShsYXVuY2hUZW1wbGF0ZS5sYXVuY2hUZW1wbGF0ZU5hbWUpLFxuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIE1ldGFkYXRhT3B0aW9uczoge1xuICAgICAgICAgIEh0dHBUb2tlbnM6ICdyZXF1aXJlZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6SW5zdGFuY2UnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZToge1xuICAgICAgICBMYXVuY2hUZW1wbGF0ZU5hbWU6IHN0YWNrLnJlc29sdmUobGF1bmNoVGVtcGxhdGUubGF1bmNoVGVtcGxhdGVOYW1lKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdEZXRhaWxlZCBNb25pdG9yaW5nJywgKCkgPT4ge1xuICAgIHRlc3QoJ2luc3RhbmNlIHdpdGggRGV0YWlsZWQgTW9uaXRvcmluZyBlbmFibGVkJywgKCkgPT4ge1xuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IEluc3RhbmNlKHN0YWNrLCAnSW5zdGFuY2UnLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgbWFjaGluZUltYWdlOiBuZXcgQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgICAgIGRldGFpbGVkTW9uaXRvcmluZzogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBGb3JjZSBzdGFjayBzeW50aCBzbyB0aGUgSW5zdGFuY2UgaXMgYXBwbGllZFxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpJbnN0YW5jZScsIHtcbiAgICAgICAgTW9uaXRvcmluZzogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaW5zdGFuY2Ugd2l0aCBEZXRhaWxlZCBNb25pdG9yaW5nIGRpc2FibGVkJywgKCkgPT4ge1xuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IEluc3RhbmNlKHN0YWNrLCAnSW5zdGFuY2UnLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgbWFjaGluZUltYWdlOiBuZXcgQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgICAgIGRldGFpbGVkTW9uaXRvcmluZzogZmFsc2UsXG4gICAgICB9KTtcblxuICAgICAgLy8gRm9yY2Ugc3RhY2sgc3ludGggc28gdGhlIEluc3RhbmNlIGlzIGFwcGxpZWRcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6SW5zdGFuY2UnLCB7XG4gICAgICAgIE1vbml0b3Jpbmc6IGZhbHNlLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpbnN0YW5jZSB3aXRoIERldGFpbGVkIE1vbml0b3JpbmcgdW5zZXQgZmFsbHMgYmFjayB0byBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBJbnN0YW5jZShzdGFjaywgJ0luc3RhbmNlJywge1xuICAgICAgICB2cGMsXG4gICAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIEZvcmNlIHN0YWNrIHN5bnRoIHNvIHRoZSBJbnN0YW5jZSBpcyBhcHBsaWVkXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6Okluc3RhbmNlJywge1xuICAgICAgICBNb25pdG9yaW5nOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxufSk7XG5cbnRlc3QoJ2FkZCBDbG91ZEZvcm1hdGlvbiBJbml0IHRvIGluc3RhbmNlJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZScsIHtcbiAgICB2cGMsXG4gICAgbWFjaGluZUltYWdlOiBuZXcgQW1hem9uTGludXhJbWFnZSgpLFxuICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuVDMsIEluc3RhbmNlU2l6ZS5MQVJHRSksXG4gICAgaW5pdDogQ2xvdWRGb3JtYXRpb25Jbml0LmZyb21FbGVtZW50cyhcbiAgICAgIEluaXRDb21tYW5kLnNoZWxsQ29tbWFuZCgnZWNobyBoZWxsbycpLFxuICAgICksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpJbnN0YW5jZScsIHtcbiAgICBVc2VyRGF0YToge1xuICAgICAgJ0ZuOjpCYXNlNjQnOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICcjIS9iaW4vYmFzaFxcbiMgZmluZ2VycHJpbnQ6IDg1YWM0MzJiMWRlMTE0NGZcXG4oXFxuICBzZXQgK2VcXG4gIC9vcHQvYXdzL2Jpbi9jZm4taW5pdCAtdiAtLXJlZ2lvbiAnLFxuICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgJyAtLXN0YWNrICcsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OlN0YWNrTmFtZScgfSxcbiAgICAgICAgICAnIC0tcmVzb3VyY2UgSW5zdGFuY2VDMTA2M0E4NyAtYyBkZWZhdWx0XFxuICAvb3B0L2F3cy9iaW4vY2ZuLXNpZ25hbCAtZSAkPyAtLXJlZ2lvbiAnLFxuICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgJyAtLXN0YWNrICcsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OlN0YWNrTmFtZScgfSxcbiAgICAgICAgICAnIC0tcmVzb3VyY2UgSW5zdGFuY2VDMTA2M0E4N1xcbiAgY2F0IC92YXIvbG9nL2Nmbi1pbml0LmxvZyA+JjJcXG4pJyxcbiAgICAgICAgXV0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoW3tcbiAgICAgICAgQWN0aW9uOiBbJ2Nsb3VkZm9ybWF0aW9uOkRlc2NyaWJlU3RhY2tSZXNvdXJjZScsICdjbG91ZGZvcm1hdGlvbjpTaWduYWxSZXNvdXJjZSddLFxuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFJlc291cmNlOiB7IFJlZjogJ0FXUzo6U3RhY2tJZCcgfSxcbiAgICAgIH1dKSxcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICB9LFxuICB9KTtcbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpFQzI6Okluc3RhbmNlJywge1xuICAgIENyZWF0aW9uUG9saWN5OiB7XG4gICAgICBSZXNvdXJjZVNpZ25hbDoge1xuICAgICAgICBDb3VudDogMSxcbiAgICAgICAgVGltZW91dDogJ1BUNU0nLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdjYXVzZSByZXBsYWNlbWVudCBmcm9tIHMzIGFzc2V0IGluIHVzZXJkYXRhJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICBjb250ZXh0OiB7XG4gICAgICBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UsXG4gICAgfSxcbiAgfSk7XG4gIHN0YWNrID0gbmV3IFN0YWNrKGFwcCk7XG4gIHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWcGMpJyk7XG4gIGNvbnN0IHVzZXJEYXRhMSA9IFVzZXJEYXRhLmZvckxpbnV4KCk7XG4gIGNvbnN0IGFzc2V0MSA9IG5ldyBBc3NldChzdGFjaywgJ1VzZXJEYXRhQXNzZXRzMScsIHtcbiAgICBwYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnYXNzZXQtZml4dHVyZScsICdkYXRhLnR4dCcpLFxuICB9KTtcbiAgdXNlckRhdGExLmFkZFMzRG93bmxvYWRDb21tYW5kKHsgYnVja2V0OiBhc3NldDEuYnVja2V0LCBidWNrZXRLZXk6IGFzc2V0MS5zM09iamVjdEtleSB9KTtcblxuICBjb25zdCB1c2VyRGF0YTIgPSBVc2VyRGF0YS5mb3JMaW51eCgpO1xuICBjb25zdCBhc3NldDIgPSBuZXcgQXNzZXQoc3RhY2ssICdVc2VyRGF0YUFzc2V0czInLCB7XG4gICAgcGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2Fzc2V0LWZpeHR1cmUnLCAnZGF0YS50eHQnKSxcbiAgfSk7XG4gIHVzZXJEYXRhMi5hZGRTM0Rvd25sb2FkQ29tbWFuZCh7IGJ1Y2tldDogYXNzZXQyLmJ1Y2tldCwgYnVja2V0S2V5OiBhc3NldDIuczNPYmplY3RLZXkgfSk7XG5cbiAgLy8gV0hFTlxuICBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZU9uZScsIHtcbiAgICB2cGMsXG4gICAgbWFjaGluZUltYWdlOiBuZXcgQW1hem9uTGludXhJbWFnZSgpLFxuICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuVDMsIEluc3RhbmNlU2l6ZS5MQVJHRSksXG4gICAgdXNlckRhdGE6IHVzZXJEYXRhMSxcbiAgICB1c2VyRGF0YUNhdXNlc1JlcGxhY2VtZW50OiB0cnVlLFxuICB9KTtcbiAgbmV3IEluc3RhbmNlKHN0YWNrLCAnSW5zdGFuY2VUd28nLCB7XG4gICAgdnBjLFxuICAgIG1hY2hpbmVJbWFnZTogbmV3IEFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICBpbnN0YW5jZVR5cGU6IEluc3RhbmNlVHlwZS5vZihJbnN0YW5jZUNsYXNzLlQzLCBJbnN0YW5jZVNpemUuTEFSR0UpLFxuICAgIHVzZXJEYXRhOiB1c2VyRGF0YTIsXG4gICAgdXNlckRhdGFDYXVzZXNSZXBsYWNlbWVudDogdHJ1ZSxcbiAgfSk7XG5cbiAgLy8gVEhFTiAtLSBib3RoIGluc3RhbmNlcyBoYXZlIHRoZSBzYW1lIHVzZXJEYXRhIGhhc2gsIHRlbGxpbmcgdXMgdGhlIGhhc2ggaXMgYmFzZWRcbiAgLy8gb24gdGhlIGFjdHVhbCBhc3NldCBoYXNoIGFuZCBub3QgYWNjaWRlbnRhbGx5IG9uIHRoZSB0b2tlbiBzdHJpbmdpZmljYXRpb24gb2YgdGhlbS5cbiAgLy8gKHdoaWNoIHdvdWxkIGJhc2UgdGhlIGhhc2ggb24gJyR7VG9rZW5bMTIzNC5ibGFdfSdcbiAgY29uc3QgaGFzaCA9ICdmODhlYWNlMzlmYWYzOWQ3JztcbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgUmVzb3VyY2VzOiBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgIFtgSW5zdGFuY2VPbmU1QjgyMTAwNSR7aGFzaH1gXTogTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgIFR5cGU6ICdBV1M6OkVDMjo6SW5zdGFuY2UnLFxuICAgICAgICBQcm9wZXJ0aWVzOiBNYXRjaC5hbnlWYWx1ZSgpLFxuICAgICAgfSksXG4gICAgICBbYEluc3RhbmNlVHdvREMyOUE3QTcke2hhc2h9YF06IE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICBUeXBlOiAnQVdTOjpFQzI6Okluc3RhbmNlJyxcbiAgICAgICAgUHJvcGVydGllczogTWF0Y2guYW55VmFsdWUoKSxcbiAgICAgIH0pLFxuICAgIH0pLFxuICB9KSk7XG59KTtcbiJdfQ==