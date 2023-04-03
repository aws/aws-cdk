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
            'a1', 't4g', 'c6g', 'c7g', 'c6gd', 'c6gn', 'm6g', 'm6gd', 'm7g', 'r6g', 'r6gd', 'r7g', 'g5g', 'im4gn', 'is4gen',
            'a13', 't11g', 'y10ng', 'z11ngd', // theoretical future Graviton-based instance classes
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
test('ssm permissions adds right managed policy', () => {
    // WHEN
    new lib_1.Instance(stack, 'InstanceOne', {
        vpc,
        machineImage: new lib_1.AmazonLinuxImage(),
        instanceType: lib_1.InstanceType.of(lib_1.InstanceClass.T3, lib_1.InstanceSize.LARGE),
        ssmSessionPermissions: true,
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        ManagedPolicyArns: [
            {
                'Fn::Join': ['', [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':iam::aws:policy/AmazonSSMManagedInstanceCore',
                    ]],
            },
        ],
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFuY2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluc3RhbmNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0Isb0RBQW1FO0FBQ25FLDhDQUF1QztBQUN2QywwREFBK0M7QUFDL0MsOENBQW1EO0FBQ25ELHdDQUEyQztBQUMzQyx5Q0FBeUM7QUFDekMsZ0NBY2dCO0FBRWhCLElBQUksS0FBWSxDQUFDO0FBQ2pCLElBQUksR0FBUSxDQUFDO0FBQ2IsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBQ3BCLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDOUIsQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtJQUN4QixJQUFJLENBQUMseURBQXlELEVBQUUsR0FBRyxFQUFFO1FBQ25FLE9BQU87UUFDUCxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQzlCLEdBQUc7WUFDSCxZQUFZLEVBQUUsSUFBSSxzQkFBZ0IsRUFBRTtZQUNwQyxZQUFZLEVBQUUsa0JBQVksQ0FBQyxFQUFFLENBQUMsbUJBQWEsQ0FBQyxFQUFFLEVBQUUsa0JBQVksQ0FBQyxLQUFLLENBQUM7WUFDbkUsZUFBZSxFQUFFLEtBQUs7U0FDdkIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLG9CQUFvQixFQUFFO1lBQ3BFLFlBQVksRUFBRSxVQUFVO1lBQ3hCLGVBQWUsRUFBRSxLQUFLO1NBQ3ZCLENBQUMsQ0FBQztJQUdMLENBQUMsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRTtRQUNqQyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFB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QU87SUFDUCxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1FBQ2pDLEdBQUc7UUFDSCxZQUFZLEVBQUUsSUFBSSxzQkFBZ0IsRUFBRTtRQUNwQyxZQUFZLEVBQUUsa0JBQVksQ0FBQyxFQUFFLENBQUMsbUJBQWEsQ0FBQyxFQUFFLEVBQUUsa0JBQVksQ0FBQyxLQUFLLENBQUM7UUFDbkUscUJBQXFCLEVBQUUsSUFBSTtLQUM1QixDQUFDLENBQUM7SUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBZ0IsRUFBRTtRQUNoRSxpQkFBaUIsRUFBRTtZQUNqQjtnQkFDRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ2YsTUFBTTt3QkFDTixFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRTt3QkFDekIsK0NBQStDO3FCQUNoRCxDQUFDO2FBQ0g7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEFubm90YXRpb25zLCBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IEtleSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1rbXMnO1xuaW1wb3J0IHsgQXNzZXQgfSBmcm9tICdAYXdzLWNkay9hd3MtczMtYXNzZXRzJztcbmltcG9ydCB7IFN0cmluZ1BhcmFtZXRlciB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1zc20nO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7XG4gIEFtYXpvbkxpbnV4SW1hZ2UsXG4gIEJsb2NrRGV2aWNlVm9sdW1lLFxuICBDbG91ZEZvcm1hdGlvbkluaXQsXG4gIEVic0RldmljZVZvbHVtZVR5cGUsXG4gIEluaXRDb21tYW5kLFxuICBJbnN0YW5jZSxcbiAgSW5zdGFuY2VBcmNoaXRlY3R1cmUsXG4gIEluc3RhbmNlQ2xhc3MsXG4gIEluc3RhbmNlU2l6ZSxcbiAgSW5zdGFuY2VUeXBlLFxuICBMYXVuY2hUZW1wbGF0ZSxcbiAgVXNlckRhdGEsXG4gIFZwYyxcbn0gZnJvbSAnLi4vbGliJztcblxubGV0IHN0YWNrOiBTdGFjaztcbmxldCB2cGM6IFZwYztcbmJlZm9yZUVhY2goKCkgPT4ge1xuICBzdGFjayA9IG5ldyBTdGFjaygpO1xuICB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG59KTtcblxuZGVzY3JpYmUoJ2luc3RhbmNlJywgKCkgPT4ge1xuICB0ZXN0KCdpbnN0YW5jZSBpcyBjcmVhdGVkIHdpdGggc291cmNlL2Rlc3QgY2hlY2sgc3dpdGNoZWQgb2ZmJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZScsIHtcbiAgICAgIHZwYyxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuVDMsIEluc3RhbmNlU2l6ZS5MQVJHRSksXG4gICAgICBzb3VyY2VEZXN0Q2hlY2s6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6SW5zdGFuY2UnLCB7XG4gICAgICBJbnN0YW5jZVR5cGU6ICd0My5sYXJnZScsXG4gICAgICBTb3VyY2VEZXN0Q2hlY2s6IGZhbHNlLFxuICAgIH0pO1xuXG5cbiAgfSk7XG4gIHRlc3QoJ2luc3RhbmNlIGlzIGdyYW50YWJsZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHBhcmFtID0gbmV3IFN0cmluZ1BhcmFtZXRlcihzdGFjaywgJ1BhcmFtJywgeyBzdHJpbmdWYWx1ZTogJ0Zvb2JhcicgfSk7XG4gICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZScsIHtcbiAgICAgIHZwYyxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuVDMsIEluc3RhbmNlU2l6ZS5MQVJHRSksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgcGFyYW0uZ3JhbnRSZWFkKGluc3RhbmNlKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnc3NtOkRlc2NyaWJlUGFyYW1ldGVycycsXG4gICAgICAgICAgICAgICdzc206R2V0UGFyYW1ldGVycycsXG4gICAgICAgICAgICAgICdzc206R2V0UGFyYW1ldGVyJyxcbiAgICAgICAgICAgICAgJ3NzbTpHZXRQYXJhbWV0ZXJIaXN0b3J5JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzpzc206JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6cGFyYW1ldGVyLycsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ1BhcmFtMTY1MzMyRUMnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuXG5cbiAgfSk7XG4gIHRlc3QoJ2luc3RhbmNlIGFyY2hpdGVjdHVyZSBpcyBjb3JyZWN0bHkgZGlzY2VybmVkIGZvciBhcm0gaW5zdGFuY2VzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc2FtcGxlSW5zdGFuY2VDbGFzc2VzID0gW1xuICAgICAgJ2ExJywgJ3Q0ZycsICdjNmcnLCAnYzdnJywgJ2M2Z2QnLCAnYzZnbicsICdtNmcnLCAnbTZnZCcsICdtN2cnLCAncjZnJywgJ3I2Z2QnLCAncjdnJywgJ2c1ZycsICdpbTRnbicsICdpczRnZW4nLCAvLyBjdXJyZW50IEdyYXZpdG9uLWJhc2VkIGluc3RhbmNlIGNsYXNzZXNcbiAgICAgICdhMTMnLCAndDExZycsICd5MTBuZycsICd6MTFuZ2QnLCAvLyB0aGVvcmV0aWNhbCBmdXR1cmUgR3Jhdml0b24tYmFzZWQgaW5zdGFuY2UgY2xhc3Nlc1xuICAgIF07XG5cbiAgICBmb3IgKGNvbnN0IGluc3RhbmNlQ2xhc3Mgb2Ygc2FtcGxlSW5zdGFuY2VDbGFzc2VzKSB7XG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBpbnN0YW5jZVR5cGUgPSBJbnN0YW5jZVR5cGUub2YoaW5zdGFuY2VDbGFzcyBhcyBJbnN0YW5jZUNsYXNzLCBJbnN0YW5jZVNpemUuWExBUkdFMTgpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoaW5zdGFuY2VUeXBlLmFyY2hpdGVjdHVyZSkudG9CZShJbnN0YW5jZUFyY2hpdGVjdHVyZS5BUk1fNjQpO1xuICAgIH1cblxuXG4gIH0pO1xuICB0ZXN0KCdpbnN0YW5jZSBhcmNoaXRlY3R1cmUgaXMgY29ycmVjdGx5IGRpc2Nlcm5lZCBmb3IgeDg2LTY0IGluc3RhbmNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc2FtcGxlSW5zdGFuY2VDbGFzc2VzID0gWydjNScsICdtNWFkJywgJ3I1bicsICdtNicsICd0M2EnLCAncjZpJywgJ3I2YScsICdwNGRlJ107IC8vIEEgc2FtcGxlIG9mIHg4Ni02NCBpbnN0YW5jZSBjbGFzc2VzXG5cbiAgICBmb3IgKGNvbnN0IGluc3RhbmNlQ2xhc3Mgb2Ygc2FtcGxlSW5zdGFuY2VDbGFzc2VzKSB7XG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBpbnN0YW5jZVR5cGUgPSBJbnN0YW5jZVR5cGUub2YoaW5zdGFuY2VDbGFzcyBhcyBJbnN0YW5jZUNsYXNzLCBJbnN0YW5jZVNpemUuWExBUkdFMTgpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoaW5zdGFuY2VUeXBlLmFyY2hpdGVjdHVyZSkudG9CZShJbnN0YW5jZUFyY2hpdGVjdHVyZS5YODZfNjQpO1xuICAgIH1cblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2luc3RhbmNlcyB3aXRoIGxvY2FsIE5WTUUgZHJpdmUgYXJlIGNvcnJlY3RseSBuYW1lZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHNhbXBsZUluc3RhbmNlQ2xhc3NLZXlzID0gW3tcbiAgICAgIGtleTogSW5zdGFuY2VDbGFzcy5SNUQsXG4gICAgICB2YWx1ZTogJ3I1ZCcsXG4gICAgfSwge1xuICAgICAga2V5OiBJbnN0YW5jZUNsYXNzLk1FTU9SWTVfTlZNRV9EUklWRSxcbiAgICAgIHZhbHVlOiAncjVkJyxcbiAgICB9LCB7XG4gICAgICBrZXk6IEluc3RhbmNlQ2xhc3MuUjVBRCxcbiAgICAgIHZhbHVlOiAncjVhZCcsXG4gICAgfSwge1xuICAgICAga2V5OiBJbnN0YW5jZUNsYXNzLk1FTU9SWTVfQU1EX05WTUVfRFJJVkUsXG4gICAgICB2YWx1ZTogJ3I1YWQnLFxuICAgIH0sIHtcbiAgICAgIGtleTogSW5zdGFuY2VDbGFzcy5NNUFELFxuICAgICAgdmFsdWU6ICdtNWFkJyxcbiAgICB9LCB7XG4gICAgICBrZXk6IEluc3RhbmNlQ2xhc3MuU1RBTkRBUkQ1X0FNRF9OVk1FX0RSSVZFLFxuICAgICAgdmFsdWU6ICdtNWFkJyxcbiAgICB9XTsgLy8gQSBzYW1wbGUgb2YgaW5zdGFuY2VzIHdpdGggTlZNRSBkcml2ZXNcblxuICAgIGZvciAoY29uc3QgaW5zdGFuY2VDbGFzcyBvZiBzYW1wbGVJbnN0YW5jZUNsYXNzS2V5cykge1xuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgaW5zdGFuY2VUeXBlID0gSW5zdGFuY2VUeXBlLm9mKGluc3RhbmNlQ2xhc3Mua2V5LCBJbnN0YW5jZVNpemUuTEFSR0UpO1xuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGluc3RhbmNlVHlwZS50b1N0cmluZygpLnNwbGl0KCcuJylbMF0pLnRvQmUoaW5zdGFuY2VDbGFzcy52YWx1ZSk7XG4gICAgfVxuICB9KTtcbiAgdGVzdCgnaW5zdGFuY2UgYXJjaGl0ZWN0dXJlIHRocm93cyBhbiBlcnJvciB3aGVuIGluc3RhbmNlIHR5cGUgaXMgaW52YWxpZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IG1hbGZvcm1lZEluc3RhbmNlVHlwZXMgPSBbJ3Q0JywgJ3Q0Zy5uYW5vLicsICd0NGduYW5vJywgJyddO1xuXG4gICAgZm9yIChjb25zdCBtYWxmb3JtZWRJbnN0YW5jZVR5cGUgb2YgbWFsZm9ybWVkSW5zdGFuY2VUeXBlcykge1xuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgaW5zdGFuY2VUeXBlID0gbmV3IEluc3RhbmNlVHlwZShtYWxmb3JtZWRJbnN0YW5jZVR5cGUpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4gaW5zdGFuY2VUeXBlLmFyY2hpdGVjdHVyZSkudG9UaHJvdygnTWFsZm9ybWVkIGluc3RhbmNlIHR5cGUgaWRlbnRpZmllcicpO1xuICAgIH1cblxuXG4gIH0pO1xuICB0ZXN0KCdjYW4gcHJvcGFnYXRlIEVCUyB2b2x1bWUgdGFncycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEluc3RhbmNlKHN0YWNrLCAnSW5zdGFuY2UnLCB7XG4gICAgICB2cGMsXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBBbWF6b25MaW51eEltYWdlKCksXG4gICAgICBpbnN0YW5jZVR5cGU6IEluc3RhbmNlVHlwZS5vZihJbnN0YW5jZUNsYXNzLlQzLCBJbnN0YW5jZVNpemUuTEFSR0UpLFxuICAgICAgcHJvcGFnYXRlVGFnc1RvVm9sdW1lT25DcmVhdGlvbjogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6Okluc3RhbmNlJywge1xuICAgICAgUHJvcGFnYXRlVGFnc1RvVm9sdW1lT25DcmVhdGlvbjogdHJ1ZSxcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdibG9ja0RldmljZU1hcHBpbmdzJywgKCkgPT4ge1xuICAgIHRlc3QoJ2NhbiBzZXQgYmxvY2tEZXZpY2VNYXBwaW5ncycsICgpID0+IHtcbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGttc0tleSA9IG5ldyBLZXkoc3RhY2ssICdFYnNLZXknKTtcbiAgICAgIG5ldyBJbnN0YW5jZShzdGFjaywgJ0luc3RhbmNlJywge1xuICAgICAgICB2cGMsXG4gICAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBJbnN0YW5jZVR5cGUub2YoSW5zdGFuY2VDbGFzcy5UMywgSW5zdGFuY2VTaXplLkxBUkdFKSxcbiAgICAgICAgYmxvY2tEZXZpY2VzOiBbe1xuICAgICAgICAgIGRldmljZU5hbWU6ICdlYnMnLFxuICAgICAgICAgIG1hcHBpbmdFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIHZvbHVtZTogQmxvY2tEZXZpY2VWb2x1bWUuZWJzKDE1LCB7XG4gICAgICAgICAgICBkZWxldGVPblRlcm1pbmF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgZW5jcnlwdGVkOiB0cnVlLFxuICAgICAgICAgICAgdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5JTzEsXG4gICAgICAgICAgICBpb3BzOiA1MDAwLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZGV2aWNlTmFtZTogJ2Vicy1ncDMnLFxuICAgICAgICAgIG1hcHBpbmdFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIHZvbHVtZTogQmxvY2tEZXZpY2VWb2x1bWUuZWJzKDE1LCB7XG4gICAgICAgICAgICBkZWxldGVPblRlcm1pbmF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgZW5jcnlwdGVkOiB0cnVlLFxuICAgICAgICAgICAgdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5HUDMsXG4gICAgICAgICAgICBpb3BzOiA1MDAwLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZGV2aWNlTmFtZTogJ2Vicy1jbWsnLFxuICAgICAgICAgIG1hcHBpbmdFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIHZvbHVtZTogQmxvY2tEZXZpY2VWb2x1bWUuZWJzKDE1LCB7XG4gICAgICAgICAgICBkZWxldGVPblRlcm1pbmF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgZW5jcnlwdGVkOiB0cnVlLFxuICAgICAgICAgICAga21zS2V5OiBrbXNLZXksXG4gICAgICAgICAgICB2b2x1bWVUeXBlOiBFYnNEZXZpY2VWb2x1bWVUeXBlLklPMSxcbiAgICAgICAgICAgIGlvcHM6IDUwMDAsXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBkZXZpY2VOYW1lOiAnZWJzLXNuYXBzaG90JyxcbiAgICAgICAgICBtYXBwaW5nRW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgdm9sdW1lOiBCbG9ja0RldmljZVZvbHVtZS5lYnNGcm9tU25hcHNob3QoJ3NuYXBzaG90LWlkJywge1xuICAgICAgICAgICAgdm9sdW1lU2l6ZTogNTAwLFxuICAgICAgICAgICAgZGVsZXRlT25UZXJtaW5hdGlvbjogZmFsc2UsXG4gICAgICAgICAgICB2b2x1bWVUeXBlOiBFYnNEZXZpY2VWb2x1bWVUeXBlLlNDMSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSwge1xuICAgICAgICAgIGRldmljZU5hbWU6ICdlcGhlbWVyYWwnLFxuICAgICAgICAgIHZvbHVtZTogQmxvY2tEZXZpY2VWb2x1bWUuZXBoZW1lcmFsKDApLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6Okluc3RhbmNlJywge1xuICAgICAgICBCbG9ja0RldmljZU1hcHBpbmdzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgRGV2aWNlTmFtZTogJ2VicycsXG4gICAgICAgICAgICBFYnM6IHtcbiAgICAgICAgICAgICAgRGVsZXRlT25UZXJtaW5hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgRW5jcnlwdGVkOiB0cnVlLFxuICAgICAgICAgICAgICBJb3BzOiA1MDAwLFxuICAgICAgICAgICAgICBWb2x1bWVTaXplOiAxNSxcbiAgICAgICAgICAgICAgVm9sdW1lVHlwZTogJ2lvMScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgRGV2aWNlTmFtZTogJ2Vicy1ncDMnLFxuICAgICAgICAgICAgRWJzOiB7XG4gICAgICAgICAgICAgIERlbGV0ZU9uVGVybWluYXRpb246IHRydWUsXG4gICAgICAgICAgICAgIEVuY3J5cHRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgSW9wczogNTAwMCxcbiAgICAgICAgICAgICAgVm9sdW1lU2l6ZTogMTUsXG4gICAgICAgICAgICAgIFZvbHVtZVR5cGU6ICdncDMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIERldmljZU5hbWU6ICdlYnMtY21rJyxcbiAgICAgICAgICAgIEViczoge1xuICAgICAgICAgICAgICBEZWxldGVPblRlcm1pbmF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgICBFbmNyeXB0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgIEttc0tleUlkOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnRWJzS2V5RDNGRUU1NTEnLFxuICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgSW9wczogNTAwMCxcbiAgICAgICAgICAgICAgVm9sdW1lU2l6ZTogMTUsXG4gICAgICAgICAgICAgIFZvbHVtZVR5cGU6ICdpbzEnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIERldmljZU5hbWU6ICdlYnMtc25hcHNob3QnLFxuICAgICAgICAgICAgRWJzOiB7XG4gICAgICAgICAgICAgIERlbGV0ZU9uVGVybWluYXRpb246IGZhbHNlLFxuICAgICAgICAgICAgICBTbmFwc2hvdElkOiAnc25hcHNob3QtaWQnLFxuICAgICAgICAgICAgICBWb2x1bWVTaXplOiA1MDAsXG4gICAgICAgICAgICAgIFZvbHVtZVR5cGU6ICdzYzEnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE5vRGV2aWNlOiB7fSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIERldmljZU5hbWU6ICdlcGhlbWVyYWwnLFxuICAgICAgICAgICAgVmlydHVhbE5hbWU6ICdlcGhlbWVyYWwwJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIGlmIGVwaGVtZXJhbCB2b2x1bWVJbmRleCA8IDAnLCAoKSA9PiB7XG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZScsIHtcbiAgICAgICAgICB2cGMsXG4gICAgICAgICAgbWFjaGluZUltYWdlOiBuZXcgQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuVDMsIEluc3RhbmNlU2l6ZS5MQVJHRSksXG4gICAgICAgICAgYmxvY2tEZXZpY2VzOiBbe1xuICAgICAgICAgICAgZGV2aWNlTmFtZTogJ2VwaGVtZXJhbCcsXG4gICAgICAgICAgICB2b2x1bWU6IEJsb2NrRGV2aWNlVm9sdW1lLmVwaGVtZXJhbCgtMSksXG4gICAgICAgICAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvdm9sdW1lSW5kZXggbXVzdCBiZSBhIG51bWJlciBzdGFydGluZyBmcm9tIDAvKTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3MgaWYgdm9sdW1lVHlwZSA9PT0gSU8xIHdpdGhvdXQgaW9wcycsICgpID0+IHtcbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBJbnN0YW5jZShzdGFjaywgJ0luc3RhbmNlJywge1xuICAgICAgICAgIHZwYyxcbiAgICAgICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBBbWF6b25MaW51eEltYWdlKCksXG4gICAgICAgICAgaW5zdGFuY2VUeXBlOiBJbnN0YW5jZVR5cGUub2YoSW5zdGFuY2VDbGFzcy5UMywgSW5zdGFuY2VTaXplLkxBUkdFKSxcbiAgICAgICAgICBibG9ja0RldmljZXM6IFt7XG4gICAgICAgICAgICBkZXZpY2VOYW1lOiAnZWJzJyxcbiAgICAgICAgICAgIHZvbHVtZTogQmxvY2tEZXZpY2VWb2x1bWUuZWJzKDE1LCB7XG4gICAgICAgICAgICAgIGRlbGV0ZU9uVGVybWluYXRpb246IHRydWUsXG4gICAgICAgICAgICAgIGVuY3J5cHRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5JTzEsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9vcHMgcHJvcGVydHkgaXMgcmVxdWlyZWQgd2l0aCB2b2x1bWVUeXBlOiBFYnNEZXZpY2VWb2x1bWVUeXBlLklPMS8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIGlmIHZvbHVtZVR5cGUgPT09IElPMiB3aXRob3V0IGlvcHMnLCAoKSA9PiB7XG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZScsIHtcbiAgICAgICAgICB2cGMsXG4gICAgICAgICAgbWFjaGluZUltYWdlOiBuZXcgQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuVDMsIEluc3RhbmNlU2l6ZS5MQVJHRSksXG4gICAgICAgICAgYmxvY2tEZXZpY2VzOiBbe1xuICAgICAgICAgICAgZGV2aWNlTmFtZTogJ2VicycsXG4gICAgICAgICAgICB2b2x1bWU6IEJsb2NrRGV2aWNlVm9sdW1lLmVicygxNSwge1xuICAgICAgICAgICAgICBkZWxldGVPblRlcm1pbmF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgICBlbmNyeXB0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgIHZvbHVtZVR5cGU6IEVic0RldmljZVZvbHVtZVR5cGUuSU8yLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvb3BzIHByb3BlcnR5IGlzIHJlcXVpcmVkIHdpdGggdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5JTzEgYW5kIEVic0RldmljZVZvbHVtZVR5cGUuSU8yLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3YXJuaW5nIGlmIGlvcHMgd2l0aG91dCB2b2x1bWVUeXBlJywgKCkgPT4ge1xuICAgICAgbmV3IEluc3RhbmNlKHN0YWNrLCAnSW5zdGFuY2UnLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgbWFjaGluZUltYWdlOiBuZXcgQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgICBpbnN0YW5jZVR5cGU6IEluc3RhbmNlVHlwZS5vZihJbnN0YW5jZUNsYXNzLlQzLCBJbnN0YW5jZVNpemUuTEFSR0UpLFxuICAgICAgICBibG9ja0RldmljZXM6IFt7XG4gICAgICAgICAgZGV2aWNlTmFtZTogJ2VicycsXG4gICAgICAgICAgdm9sdW1lOiBCbG9ja0RldmljZVZvbHVtZS5lYnMoMTUsIHtcbiAgICAgICAgICAgIGRlbGV0ZU9uVGVybWluYXRpb246IHRydWUsXG4gICAgICAgICAgICBlbmNyeXB0ZWQ6IHRydWUsXG4gICAgICAgICAgICBpb3BzOiA1MDAwLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBBbm5vdGF0aW9ucy5mcm9tU3RhY2soc3RhY2spLmhhc1dhcm5pbmcoJy9EZWZhdWx0L0luc3RhbmNlJywgJ2lvcHMgd2lsbCBiZSBpZ25vcmVkIHdpdGhvdXQgdm9sdW1lVHlwZTogSU8xLCBJTzIsIG9yIEdQMycpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnd2FybmluZyBpZiBpb3BzIGFuZCBpbnZhbGlkIHZvbHVtZVR5cGUnLCAoKSA9PiB7XG4gICAgICBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZScsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBBbWF6b25MaW51eEltYWdlKCksXG4gICAgICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuVDMsIEluc3RhbmNlU2l6ZS5MQVJHRSksXG4gICAgICAgIGJsb2NrRGV2aWNlczogW3tcbiAgICAgICAgICBkZXZpY2VOYW1lOiAnZWJzJyxcbiAgICAgICAgICB2b2x1bWU6IEJsb2NrRGV2aWNlVm9sdW1lLmVicygxNSwge1xuICAgICAgICAgICAgZGVsZXRlT25UZXJtaW5hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIGVuY3J5cHRlZDogdHJ1ZSxcbiAgICAgICAgICAgIHZvbHVtZVR5cGU6IEVic0RldmljZVZvbHVtZVR5cGUuR1AyLFxuICAgICAgICAgICAgaW9wczogNTAwMCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfV0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5oYXNXYXJuaW5nKCcvRGVmYXVsdC9JbnN0YW5jZScsICdpb3BzIHdpbGwgYmUgaWdub3JlZCB3aXRob3V0IHZvbHVtZVR5cGU6IElPMSwgSU8yLCBvciBHUDMnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaW5zdGFuY2UgY2FuIGJlIGNyZWF0ZWQgd2l0aCBQcml2YXRlIElQIEFkZHJlc3MnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBJbnN0YW5jZShzdGFjaywgJ0luc3RhbmNlJywge1xuICAgICAgdnBjLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgaW5zdGFuY2VUeXBlOiBJbnN0YW5jZVR5cGUub2YoSW5zdGFuY2VDbGFzcy5UMywgSW5zdGFuY2VTaXplLkxBUkdFKSxcbiAgICAgIHByaXZhdGVJcEFkZHJlc3M6ICcxMC4wLjAuMicsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpJbnN0YW5jZScsIHtcbiAgICAgIEluc3RhbmNlVHlwZTogJ3QzLmxhcmdlJyxcbiAgICAgIFByaXZhdGVJcEFkZHJlc3M6ICcxMC4wLjAuMicsXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdpbnN0YW5jZSByZXF1aXJlcyBJTURTdjInLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IEluc3RhbmNlKHN0YWNrLCAnSW5zdGFuY2UnLCB7XG4gICAgICB2cGMsXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBBbWF6b25MaW51eEltYWdlKCksXG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgICByZXF1aXJlSW1kc3YyOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gRm9yY2Ugc3RhY2sgc3ludGggc28gdGhlIEluc3RhbmNlUmVxdWlyZUltZHN2MkFzcGVjdCBpcyBhcHBsaWVkXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBsYXVuY2hUZW1wbGF0ZSA9IGluc3RhbmNlLm5vZGUudHJ5RmluZENoaWxkKCdMYXVuY2hUZW1wbGF0ZScpIGFzIExhdW5jaFRlbXBsYXRlO1xuICAgIGV4cGVjdChsYXVuY2hUZW1wbGF0ZSkudG9CZURlZmluZWQoKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVOYW1lOiBzdGFjay5yZXNvbHZlKGxhdW5jaFRlbXBsYXRlLmxhdW5jaFRlbXBsYXRlTmFtZSksXG4gICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgTWV0YWRhdGFPcHRpb25zOiB7XG4gICAgICAgICAgSHR0cFRva2VuczogJ3JlcXVpcmVkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpJbnN0YW5jZScsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlOiB7XG4gICAgICAgIExhdW5jaFRlbXBsYXRlTmFtZTogc3RhY2sucmVzb2x2ZShsYXVuY2hUZW1wbGF0ZS5sYXVuY2hUZW1wbGF0ZU5hbWUpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0RldGFpbGVkIE1vbml0b3JpbmcnLCAoKSA9PiB7XG4gICAgdGVzdCgnaW5zdGFuY2Ugd2l0aCBEZXRhaWxlZCBNb25pdG9yaW5nIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZScsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBBbWF6b25MaW51eEltYWdlKCksXG4gICAgICAgIGluc3RhbmNlVHlwZTogbmV3IEluc3RhbmNlVHlwZSgndDIubWljcm8nKSxcbiAgICAgICAgZGV0YWlsZWRNb25pdG9yaW5nOiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIEZvcmNlIHN0YWNrIHN5bnRoIHNvIHRoZSBJbnN0YW5jZSBpcyBhcHBsaWVkXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6Okluc3RhbmNlJywge1xuICAgICAgICBNb25pdG9yaW5nOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpbnN0YW5jZSB3aXRoIERldGFpbGVkIE1vbml0b3JpbmcgZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZScsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBBbWF6b25MaW51eEltYWdlKCksXG4gICAgICAgIGluc3RhbmNlVHlwZTogbmV3IEluc3RhbmNlVHlwZSgndDIubWljcm8nKSxcbiAgICAgICAgZGV0YWlsZWRNb25pdG9yaW5nOiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBGb3JjZSBzdGFjayBzeW50aCBzbyB0aGUgSW5zdGFuY2UgaXMgYXBwbGllZFxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpJbnN0YW5jZScsIHtcbiAgICAgICAgTW9uaXRvcmluZzogZmFsc2UsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2luc3RhbmNlIHdpdGggRGV0YWlsZWQgTW9uaXRvcmluZyB1bnNldCBmYWxscyBiYWNrIHRvIGRpc2FibGVkJywgKCkgPT4ge1xuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IEluc3RhbmNlKHN0YWNrLCAnSW5zdGFuY2UnLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgbWFjaGluZUltYWdlOiBuZXcgQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgICB9KTtcblxuICAgICAgLy8gRm9yY2Ugc3RhY2sgc3ludGggc28gdGhlIEluc3RhbmNlIGlzIGFwcGxpZWRcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6SW5zdGFuY2UnLCB7XG4gICAgICAgIE1vbml0b3Jpbmc6IE1hdGNoLmFic2VudCgpLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG59KTtcblxudGVzdCgnYWRkIENsb3VkRm9ybWF0aW9uIEluaXQgdG8gaW5zdGFuY2UnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIG5ldyBJbnN0YW5jZShzdGFjaywgJ0luc3RhbmNlJywge1xuICAgIHZwYyxcbiAgICBtYWNoaW5lSW1hZ2U6IG5ldyBBbWF6b25MaW51eEltYWdlKCksXG4gICAgaW5zdGFuY2VUeXBlOiBJbnN0YW5jZVR5cGUub2YoSW5zdGFuY2VDbGFzcy5UMywgSW5zdGFuY2VTaXplLkxBUkdFKSxcbiAgICBpbml0OiBDbG91ZEZvcm1hdGlvbkluaXQuZnJvbUVsZW1lbnRzKFxuICAgICAgSW5pdENvbW1hbmQuc2hlbGxDb21tYW5kKCdlY2hvIGhlbGxvJyksXG4gICAgKSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6Okluc3RhbmNlJywge1xuICAgIFVzZXJEYXRhOiB7XG4gICAgICAnRm46OkJhc2U2NCc6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgJyMhL2Jpbi9iYXNoXFxuIyBmaW5nZXJwcmludDogODVhYzQzMmIxZGUxMTQ0ZlxcbihcXG4gIHNldCArZVxcbiAgL29wdC9hd3MvYmluL2Nmbi1pbml0IC12IC0tcmVnaW9uICcsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAnIC0tc3RhY2sgJyxcbiAgICAgICAgICB7IFJlZjogJ0FXUzo6U3RhY2tOYW1lJyB9LFxuICAgICAgICAgICcgLS1yZXNvdXJjZSBJbnN0YW5jZUMxMDYzQTg3IC1jIGRlZmF1bHRcXG4gIC9vcHQvYXdzL2Jpbi9jZm4tc2lnbmFsIC1lICQ/IC0tcmVnaW9uICcsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAnIC0tc3RhY2sgJyxcbiAgICAgICAgICB7IFJlZjogJ0FXUzo6U3RhY2tOYW1lJyB9LFxuICAgICAgICAgICcgLS1yZXNvdXJjZSBJbnN0YW5jZUMxMDYzQTg3XFxuICBjYXQgL3Zhci9sb2cvY2ZuLWluaXQubG9nID4mMlxcbiknLFxuICAgICAgICBdXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICBTdGF0ZW1lbnQ6IE1hdGNoLmFycmF5V2l0aChbe1xuICAgICAgICBBY3Rpb246IFsnY2xvdWRmb3JtYXRpb246RGVzY3JpYmVTdGFja1Jlc291cmNlJywgJ2Nsb3VkZm9ybWF0aW9uOlNpZ25hbFJlc291cmNlJ10sXG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgUmVzb3VyY2U6IHsgUmVmOiAnQVdTOjpTdGFja0lkJyB9LFxuICAgICAgfV0pLFxuICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgIH0sXG4gIH0pO1xuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkVDMjo6SW5zdGFuY2UnLCB7XG4gICAgQ3JlYXRpb25Qb2xpY3k6IHtcbiAgICAgIFJlc291cmNlU2lnbmFsOiB7XG4gICAgICAgIENvdW50OiAxLFxuICAgICAgICBUaW1lb3V0OiAnUFQ1TScsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2NhdXNlIHJlcGxhY2VtZW50IGZyb20gczMgYXNzZXQgaW4gdXNlcmRhdGEnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgIGNvbnRleHQ6IHtcbiAgICAgIFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSxcbiAgICB9LFxuICB9KTtcbiAgc3RhY2sgPSBuZXcgU3RhY2soYXBwKTtcbiAgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZwYyknKTtcbiAgY29uc3QgdXNlckRhdGExID0gVXNlckRhdGEuZm9yTGludXgoKTtcbiAgY29uc3QgYXNzZXQxID0gbmV3IEFzc2V0KHN0YWNrLCAnVXNlckRhdGFBc3NldHMxJywge1xuICAgIHBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICdhc3NldC1maXh0dXJlJywgJ2RhdGEudHh0JyksXG4gIH0pO1xuICB1c2VyRGF0YTEuYWRkUzNEb3dubG9hZENvbW1hbmQoeyBidWNrZXQ6IGFzc2V0MS5idWNrZXQsIGJ1Y2tldEtleTogYXNzZXQxLnMzT2JqZWN0S2V5IH0pO1xuXG4gIGNvbnN0IHVzZXJEYXRhMiA9IFVzZXJEYXRhLmZvckxpbnV4KCk7XG4gIGNvbnN0IGFzc2V0MiA9IG5ldyBBc3NldChzdGFjaywgJ1VzZXJEYXRhQXNzZXRzMicsIHtcbiAgICBwYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnYXNzZXQtZml4dHVyZScsICdkYXRhLnR4dCcpLFxuICB9KTtcbiAgdXNlckRhdGEyLmFkZFMzRG93bmxvYWRDb21tYW5kKHsgYnVja2V0OiBhc3NldDIuYnVja2V0LCBidWNrZXRLZXk6IGFzc2V0Mi5zM09iamVjdEtleSB9KTtcblxuICAvLyBXSEVOXG4gIG5ldyBJbnN0YW5jZShzdGFjaywgJ0luc3RhbmNlT25lJywge1xuICAgIHZwYyxcbiAgICBtYWNoaW5lSW1hZ2U6IG5ldyBBbWF6b25MaW51eEltYWdlKCksXG4gICAgaW5zdGFuY2VUeXBlOiBJbnN0YW5jZVR5cGUub2YoSW5zdGFuY2VDbGFzcy5UMywgSW5zdGFuY2VTaXplLkxBUkdFKSxcbiAgICB1c2VyRGF0YTogdXNlckRhdGExLFxuICAgIHVzZXJEYXRhQ2F1c2VzUmVwbGFjZW1lbnQ6IHRydWUsXG4gIH0pO1xuICBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZVR3bycsIHtcbiAgICB2cGMsXG4gICAgbWFjaGluZUltYWdlOiBuZXcgQW1hem9uTGludXhJbWFnZSgpLFxuICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuVDMsIEluc3RhbmNlU2l6ZS5MQVJHRSksXG4gICAgdXNlckRhdGE6IHVzZXJEYXRhMixcbiAgICB1c2VyRGF0YUNhdXNlc1JlcGxhY2VtZW50OiB0cnVlLFxuICB9KTtcblxuICAvLyBUSEVOIC0tIGJvdGggaW5zdGFuY2VzIGhhdmUgdGhlIHNhbWUgdXNlckRhdGEgaGFzaCwgdGVsbGluZyB1cyB0aGUgaGFzaCBpcyBiYXNlZFxuICAvLyBvbiB0aGUgYWN0dWFsIGFzc2V0IGhhc2ggYW5kIG5vdCBhY2NpZGVudGFsbHkgb24gdGhlIHRva2VuIHN0cmluZ2lmaWNhdGlvbiBvZiB0aGVtLlxuICAvLyAod2hpY2ggd291bGQgYmFzZSB0aGUgaGFzaCBvbiAnJHtUb2tlblsxMjM0LmJsYV19J1xuICBjb25zdCBoYXNoID0gJ2Y4OGVhY2UzOWZhZjM5ZDcnO1xuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyhNYXRjaC5vYmplY3RMaWtlKHtcbiAgICBSZXNvdXJjZXM6IE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgW2BJbnN0YW5jZU9uZTVCODIxMDA1JHtoYXNofWBdOiBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgVHlwZTogJ0FXUzo6RUMyOjpJbnN0YW5jZScsXG4gICAgICAgIFByb3BlcnRpZXM6IE1hdGNoLmFueVZhbHVlKCksXG4gICAgICB9KSxcbiAgICAgIFtgSW5zdGFuY2VUd29EQzI5QTdBNyR7aGFzaH1gXTogTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgIFR5cGU6ICdBV1M6OkVDMjo6SW5zdGFuY2UnLFxuICAgICAgICBQcm9wZXJ0aWVzOiBNYXRjaC5hbnlWYWx1ZSgpLFxuICAgICAgfSksXG4gICAgfSksXG4gIH0pKTtcbn0pO1xuXG50ZXN0KCdzc20gcGVybWlzc2lvbnMgYWRkcyByaWdodCBtYW5hZ2VkIHBvbGljeScsICgpID0+IHtcbiAgLy8gV0hFTlxuICBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZU9uZScsIHtcbiAgICB2cGMsXG4gICAgbWFjaGluZUltYWdlOiBuZXcgQW1hem9uTGludXhJbWFnZSgpLFxuICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuVDMsIEluc3RhbmNlU2l6ZS5MQVJHRSksXG4gICAgc3NtU2Vzc2lvblBlcm1pc3Npb25zOiB0cnVlLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgTWFuYWdlZFBvbGljeUFybnM6IFtcbiAgICAgIHtcbiAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgJ2FybjonLFxuICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgJzppYW06OmF3czpwb2xpY3kvQW1hem9uU1NNTWFuYWdlZEluc3RhbmNlQ29yZScsXG4gICAgICAgIF1dLFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn0pO1xuXG4iXX0=