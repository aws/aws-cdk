"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const cdk = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('volume', () => {
    test('basic volume', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(8),
            volumeName: 'MyVolume',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Volume', {
            AvailabilityZone: 'us-east-1a',
            MultiAttachEnabled: false,
            Size: 8,
            VolumeType: 'gp2',
            Tags: [
                {
                    Key: 'Name',
                    Value: 'MyVolume',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::EC2::Volume', {
            DeletionPolicy: 'Retain',
        });
    });
    test('fromVolumeAttributes', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const encryptionKey = new kms.Key(stack, 'Key');
        const volumeId = 'vol-000000';
        const availabilityZone = 'us-east-1a';
        // WHEN
        const volume = lib_1.Volume.fromVolumeAttributes(stack, 'Volume', {
            volumeId,
            availabilityZone,
            encryptionKey,
        });
        // THEN
        expect(volume.volumeId).toEqual(volumeId);
        expect(volume.availabilityZone).toEqual(availabilityZone);
        expect(volume.encryptionKey).toEqual(encryptionKey);
    });
    test('tagged volume', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const volume = new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(8),
        });
        // WHEN
        cdk.Tags.of(volume).add('TagKey', 'TagValue');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Volume', {
            AvailabilityZone: 'us-east-1a',
            MultiAttachEnabled: false,
            Size: 8,
            VolumeType: 'gp2',
            Tags: [{
                    Key: 'TagKey',
                    Value: 'TagValue',
                }],
        });
    });
    test('autoenableIO', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(500),
            autoEnableIo: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Volume', {
            AutoEnableIO: true,
        });
    });
    test('encryption', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(500),
            encrypted: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Volume', {
            Encrypted: true,
        });
    });
    test('encryption with kms', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const encryptionKey = new kms.Key(stack, 'Key');
        // WHEN
        new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(500),
            encrypted: true,
            encryptionKey,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Volume', {
            Encrypted: true,
            KmsKeyId: {
                'Fn::GetAtt': [
                    'Key961B73FD',
                    'Arn',
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: assertions_1.Match.arrayWith([{
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
                        Action: [
                            'kms:DescribeKey',
                            'kms:GenerateDataKeyWithoutPlainText',
                        ],
                        Condition: {
                            StringEquals: {
                                'kms:ViaService': {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'ec2.',
                                            {
                                                Ref: 'AWS::Region',
                                            },
                                            '.amazonaws.com',
                                        ],
                                    ],
                                },
                                'kms:CallerAccount': {
                                    Ref: 'AWS::AccountId',
                                },
                            },
                        },
                    }]),
            },
        });
    });
    test('iops', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(500),
            iops: 500,
            volumeType: lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Volume', {
            Iops: 500,
            VolumeType: 'io1',
        });
    });
    test('multi-attach', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(500),
            iops: 500,
            volumeType: lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
            enableMultiAttach: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Volume', {
            MultiAttachEnabled: true,
        });
    });
    test('snapshotId', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            snapshotId: 'snap-00000000',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Volume', {
            SnapshotId: 'snap-00000000',
        });
    });
    test('throughput', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(1),
            volumeType: lib_1.EbsDeviceVolumeType.GP3,
            throughput: 200,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Volume', {
            Throughput: 200,
        });
    });
    test('volume: standard', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(500),
            volumeType: lib_1.EbsDeviceVolumeType.MAGNETIC,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Volume', {
            VolumeType: 'standard',
        });
    });
    test('volume: io1', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(500),
            volumeType: lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
            iops: 300,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Volume', {
            VolumeType: 'io1',
        });
    });
    test('volume: io2', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(500),
            volumeType: lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2,
            iops: 300,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Volume', {
            VolumeType: 'io2',
        });
    });
    test('volume: gp2', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(500),
            volumeType: lib_1.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Volume', {
            VolumeType: 'gp2',
        });
    });
    test('volume: gp3', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(500),
            volumeType: lib_1.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Volume', {
            VolumeType: 'gp3',
        });
    });
    test('volume: st1', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(500),
            volumeType: lib_1.EbsDeviceVolumeType.THROUGHPUT_OPTIMIZED_HDD,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Volume', {
            VolumeType: 'st1',
        });
    });
    test('volume: sc1', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(500),
            volumeType: lib_1.EbsDeviceVolumeType.COLD_HDD,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Volume', {
            VolumeType: 'sc1',
        });
    });
    test('grantAttachVolume to any instance', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const role = new aws_iam_1.Role(stack, 'Role', { assumedBy: new aws_iam_1.AccountRootPrincipal() });
        const volume = new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(8),
        });
        // WHEN
        volume.grantAttachVolume(role);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [{
                        Action: 'ec2:AttachVolume',
                        Effect: 'Allow',
                        Resource: [
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {
                                            Ref: 'AWS::Partition',
                                        },
                                        ':ec2:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':volume/',
                                        {
                                            Ref: 'VolumeA92988D3',
                                        },
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
                                        ':ec2:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':instance/*',
                                    ],
                                ],
                            },
                        ],
                    }],
            },
        });
    });
    describe('grantAttachVolume to any instance with encryption', () => {
        test('with default key policies', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const role = new aws_iam_1.Role(stack, 'Role', { assumedBy: new aws_iam_1.AccountRootPrincipal() });
            const encryptionKey = new kms.Key(stack, 'Key');
            const volume = new lib_1.Volume(stack, 'Volume', {
                availabilityZone: 'us-east-1a',
                size: cdk.Size.gibibytes(8),
                encrypted: true,
                encryptionKey,
            });
            // WHEN
            volume.grantAttachVolume(role);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: assertions_1.Match.arrayWith([{
                            Effect: 'Allow',
                            Action: 'kms:CreateGrant',
                            Condition: {
                                Bool: {
                                    'kms:GrantIsForAWSResource': true,
                                },
                                StringEquals: {
                                    'kms:ViaService': {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'ec2.',
                                                {
                                                    Ref: 'AWS::Region',
                                                },
                                                '.amazonaws.com',
                                            ],
                                        ],
                                    },
                                    'kms:GrantConstraintType': 'EncryptionContextSubset',
                                },
                            },
                            Resource: {
                                'Fn::GetAtt': [
                                    'Key961B73FD',
                                    'Arn',
                                ],
                            },
                        }]),
                },
            });
        });
    });
    test('grantAttachVolume to any instance with KMS.fromKeyArn() encryption', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const role = new aws_iam_1.Role(stack, 'Role', { assumedBy: new aws_iam_1.AccountRootPrincipal() });
        const kmsKey = new kms.Key(stack, 'Key');
        // kmsKey policy is not strictly necessary for the test.
        // Demonstrating how to properly construct the Key.
        const principal = new kms.ViaServicePrincipal(`ec2.${stack.region}.amazonaws.com`, new aws_iam_1.AccountRootPrincipal()).withConditions({
            StringEquals: {
                'kms:CallerAccount': stack.account,
            },
        });
        kmsKey.grant(principal, 
        // Describe & Generate are required to be able to create the CMK-encrypted Volume.
        'kms:DescribeKey', 'kms:GenerateDataKeyWithoutPlainText', 
        // ReEncrypt is required for when the CMK is rotated.
        'kms:ReEncrypt*');
        const encryptionKey = kms.Key.fromKeyArn(stack, 'KeyArn', kmsKey.keyArn);
        const volume = new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(8),
            encrypted: true,
            encryptionKey,
        });
        // WHEN
        volume.grantAttachVolume(role);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: assertions_1.Match.arrayWith([{
                        Effect: 'Allow',
                        Action: 'kms:CreateGrant',
                        Resource: {
                            'Fn::GetAtt': [
                                'Key961B73FD',
                                'Arn',
                            ],
                        },
                        Condition: {
                            Bool: {
                                'kms:GrantIsForAWSResource': true,
                            },
                            StringEquals: {
                                'kms:ViaService': {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'ec2.',
                                            {
                                                Ref: 'AWS::Region',
                                            },
                                            '.amazonaws.com',
                                        ],
                                    ],
                                },
                                'kms:GrantConstraintType': 'EncryptionContextSubset',
                            },
                        },
                    }]),
            },
        });
    });
    test('grantAttachVolume to specific instances', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const role = new aws_iam_1.Role(stack, 'Role', { assumedBy: new aws_iam_1.AccountRootPrincipal() });
        const vpc = new lib_1.Vpc(stack, 'Vpc');
        const instance1 = new lib_1.Instance(stack, 'Instance1', {
            vpc,
            instanceType: new lib_1.InstanceType('t3.small'),
            machineImage: lib_1.MachineImage.latestAmazonLinux({ generation: lib_1.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
            availabilityZone: 'us-east-1a',
        });
        const instance2 = new lib_1.Instance(stack, 'Instance2', {
            vpc,
            instanceType: new lib_1.InstanceType('t3.small'),
            machineImage: lib_1.MachineImage.latestAmazonLinux({ generation: lib_1.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
            availabilityZone: 'us-east-1a',
        });
        const volume = new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(8),
        });
        // WHEN
        volume.grantAttachVolume(role, [instance1, instance2]);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [{
                        Action: 'ec2:AttachVolume',
                        Effect: 'Allow',
                        Resource: assertions_1.Match.arrayWith([{
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {
                                            Ref: 'AWS::Partition',
                                        },
                                        ':ec2:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':instance/',
                                        {
                                            Ref: 'Instance14BC3991D',
                                        },
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
                                        ':ec2:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':instance/',
                                        {
                                            Ref: 'Instance255F35265',
                                        },
                                    ],
                                ],
                            }]),
                    }],
            },
        });
    });
    test('grantAttachVolume to instance self', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new lib_1.Vpc(stack, 'Vpc');
        const instance = new lib_1.Instance(stack, 'Instance', {
            vpc,
            instanceType: new lib_1.InstanceType('t3.small'),
            machineImage: lib_1.MachineImage.latestAmazonLinux({ generation: lib_1.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
            availabilityZone: 'us-east-1a',
        });
        const volume = new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(8),
        });
        // WHEN
        volume.grantAttachVolumeByResourceTag(instance.grantPrincipal, [instance]);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [{
                        Action: 'ec2:AttachVolume',
                        Effect: 'Allow',
                        Resource: assertions_1.Match.arrayWith([{
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {
                                            Ref: 'AWS::Partition',
                                        },
                                        ':ec2:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':instance/*',
                                    ],
                                ],
                            }]),
                        Condition: {
                            'ForAnyValue:StringEquals': {
                                'ec2:ResourceTag/VolumeGrantAttach-B2376B2BDA': 'b2376b2bda65cb40f83c290dd844c4aa',
                            },
                        },
                    }],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Volume', {
            Tags: [
                {
                    Key: 'VolumeGrantAttach-B2376B2BDA',
                    Value: 'b2376b2bda65cb40f83c290dd844c4aa',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
            Tags: assertions_1.Match.arrayWith([{
                    Key: 'VolumeGrantAttach-B2376B2BDA',
                    Value: 'b2376b2bda65cb40f83c290dd844c4aa',
                }]),
        });
    });
    test('grantAttachVolume to instance self with suffix', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new lib_1.Vpc(stack, 'Vpc');
        const instance = new lib_1.Instance(stack, 'Instance', {
            vpc,
            instanceType: new lib_1.InstanceType('t3.small'),
            machineImage: lib_1.MachineImage.latestAmazonLinux({ generation: lib_1.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
            availabilityZone: 'us-east-1a',
        });
        const volume = new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(8),
        });
        // WHEN
        volume.grantAttachVolumeByResourceTag(instance.grantPrincipal, [instance], 'TestSuffix');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [{
                        Action: 'ec2:AttachVolume',
                        Effect: 'Allow',
                        Resource: assertions_1.Match.arrayWith([{
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {
                                            Ref: 'AWS::Partition',
                                        },
                                        ':ec2:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':instance/*',
                                    ],
                                ],
                            }]),
                        Condition: {
                            'ForAnyValue:StringEquals': {
                                'ec2:ResourceTag/VolumeGrantAttach-TestSuffix': 'b2376b2bda65cb40f83c290dd844c4aa',
                            },
                        },
                    }],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Volume', {
            Tags: [
                {
                    Key: 'VolumeGrantAttach-TestSuffix',
                    Value: 'b2376b2bda65cb40f83c290dd844c4aa',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
            Tags: assertions_1.Match.arrayWith([{
                    Key: 'VolumeGrantAttach-TestSuffix',
                    Value: 'b2376b2bda65cb40f83c290dd844c4aa',
                }]),
        });
    });
    test('grantDetachVolume to any instance', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const role = new aws_iam_1.Role(stack, 'Role', { assumedBy: new aws_iam_1.AccountRootPrincipal() });
        const volume = new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(8),
        });
        // WHEN
        volume.grantDetachVolume(role);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [{
                        Action: 'ec2:DetachVolume',
                        Effect: 'Allow',
                        Resource: [
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {
                                            Ref: 'AWS::Partition',
                                        },
                                        ':ec2:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':volume/',
                                        {
                                            Ref: 'VolumeA92988D3',
                                        },
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
                                        ':ec2:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':instance/*',
                                    ],
                                ],
                            },
                        ],
                    }],
            },
        });
    });
    test('grantDetachVolume from specific instance', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const role = new aws_iam_1.Role(stack, 'Role', { assumedBy: new aws_iam_1.AccountRootPrincipal() });
        const vpc = new lib_1.Vpc(stack, 'Vpc');
        const instance1 = new lib_1.Instance(stack, 'Instance1', {
            vpc,
            instanceType: new lib_1.InstanceType('t3.small'),
            machineImage: lib_1.MachineImage.latestAmazonLinux({ generation: lib_1.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
            availabilityZone: 'us-east-1a',
        });
        const instance2 = new lib_1.Instance(stack, 'Instance2', {
            vpc,
            instanceType: new lib_1.InstanceType('t3.small'),
            machineImage: lib_1.MachineImage.latestAmazonLinux({ generation: lib_1.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
            availabilityZone: 'us-east-1a',
        });
        const volume = new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(8),
        });
        // WHEN
        volume.grantDetachVolume(role, [instance1, instance2]);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [{
                        Action: 'ec2:DetachVolume',
                        Effect: 'Allow',
                        Resource: assertions_1.Match.arrayWith([{
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {
                                            Ref: 'AWS::Partition',
                                        },
                                        ':ec2:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':instance/',
                                        {
                                            Ref: 'Instance14BC3991D',
                                        },
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
                                        ':ec2:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':instance/',
                                        {
                                            Ref: 'Instance255F35265',
                                        },
                                    ],
                                ],
                            }]),
                    }],
            },
        });
    });
    test('grantDetachVolume from instance self', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new lib_1.Vpc(stack, 'Vpc');
        const instance = new lib_1.Instance(stack, 'Instance', {
            vpc,
            instanceType: new lib_1.InstanceType('t3.small'),
            machineImage: lib_1.MachineImage.latestAmazonLinux({ generation: lib_1.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
            availabilityZone: 'us-east-1a',
        });
        const volume = new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(8),
        });
        // WHEN
        volume.grantDetachVolumeByResourceTag(instance.grantPrincipal, [instance]);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [{
                        Action: 'ec2:DetachVolume',
                        Effect: 'Allow',
                        Resource: assertions_1.Match.arrayWith([{
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {
                                            Ref: 'AWS::Partition',
                                        },
                                        ':ec2:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':instance/*',
                                    ],
                                ],
                            }]),
                        Condition: {
                            'ForAnyValue:StringEquals': {
                                'ec2:ResourceTag/VolumeGrantDetach-B2376B2BDA': 'b2376b2bda65cb40f83c290dd844c4aa',
                            },
                        },
                    }],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Volume', {
            Tags: [
                {
                    Key: 'VolumeGrantDetach-B2376B2BDA',
                    Value: 'b2376b2bda65cb40f83c290dd844c4aa',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
            Tags: assertions_1.Match.arrayWith([{
                    Key: 'VolumeGrantDetach-B2376B2BDA',
                    Value: 'b2376b2bda65cb40f83c290dd844c4aa',
                }]),
        });
    });
    test('grantDetachVolume from instance self with suffix', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new lib_1.Vpc(stack, 'Vpc');
        const instance = new lib_1.Instance(stack, 'Instance', {
            vpc,
            instanceType: new lib_1.InstanceType('t3.small'),
            machineImage: lib_1.MachineImage.latestAmazonLinux({ generation: lib_1.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
            availabilityZone: 'us-east-1a',
        });
        const volume = new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(8),
        });
        // WHEN
        volume.grantDetachVolumeByResourceTag(instance.grantPrincipal, [instance], 'TestSuffix');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [{
                        Action: 'ec2:DetachVolume',
                        Effect: 'Allow',
                        Resource: assertions_1.Match.arrayWith([
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {
                                            Ref: 'AWS::Partition',
                                        },
                                        ':ec2:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':instance/*',
                                    ],
                                ],
                            },
                        ]),
                        Condition: {
                            'ForAnyValue:StringEquals': {
                                'ec2:ResourceTag/VolumeGrantDetach-TestSuffix': 'b2376b2bda65cb40f83c290dd844c4aa',
                            },
                        },
                    }],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Volume', {
            Tags: [
                {
                    Key: 'VolumeGrantDetach-TestSuffix',
                    Value: 'b2376b2bda65cb40f83c290dd844c4aa',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
            Tags: assertions_1.Match.arrayWith([{
                    Key: 'VolumeGrantDetach-TestSuffix',
                    Value: 'b2376b2bda65cb40f83c290dd844c4aa',
                }]),
        });
    });
    test('validation fromVolumeAttributes', () => {
        // GIVEN
        let idx = 0;
        const stack = new cdk.Stack();
        const volume = new lib_1.Volume(stack, 'Volume', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(8),
        });
        // THEN
        expect(() => {
            lib_1.Volume.fromVolumeAttributes(stack, `Volume${idx++}`, {
                volumeId: volume.volumeId,
                availabilityZone: volume.availabilityZone,
            });
        }).not.toThrow();
        expect(() => {
            lib_1.Volume.fromVolumeAttributes(stack, `Volume${idx++}`, {
                volumeId: 'vol-0123456789abcdefABCDEF',
                availabilityZone: 'us-east-1a',
            });
        }).not.toThrow();
        expect(() => {
            lib_1.Volume.fromVolumeAttributes(stack, `Volume${idx++}`, {
                volumeId: ' vol-0123456789abcdefABCDEF',
                availabilityZone: 'us-east-1a',
            });
        }).toThrow('`volumeId` does not match expected pattern. Expected `vol-<hexadecmial value>` (ex: `vol-05abe246af`) or a Token');
        expect(() => {
            lib_1.Volume.fromVolumeAttributes(stack, `Volume${idx++}`, {
                volumeId: 'vol-0123456789abcdefABCDEF ',
                availabilityZone: 'us-east-1a',
            });
        }).toThrow('`volumeId` does not match expected pattern. Expected `vol-<hexadecmial value>` (ex: `vol-05abe246af`) or a Token');
    });
    test('validation required props', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const key = new kms.Key(stack, 'Key');
        let idx = 0;
        // THEN
        expect(() => {
            new lib_1.Volume(stack, `Volume${idx++}`, {
                availabilityZone: 'us-east-1a',
            });
        }).toThrow('Must provide at least one of `size` or `snapshotId`');
        expect(() => {
            new lib_1.Volume(stack, `Volume${idx++}`, {
                availabilityZone: 'us-east-1a',
                size: cdk.Size.gibibytes(8),
            });
        }).not.toThrow();
        expect(() => {
            new lib_1.Volume(stack, `Volume${idx++}`, {
                availabilityZone: 'us-east-1a',
                snapshotId: 'snap-000000000',
            });
        }).not.toThrow();
        expect(() => {
            new lib_1.Volume(stack, `Volume${idx++}`, {
                availabilityZone: 'us-east-1a',
                size: cdk.Size.gibibytes(8),
                snapshotId: 'snap-000000000',
            });
        }).not.toThrow();
        expect(() => {
            new lib_1.Volume(stack, `Volume${idx++}`, {
                availabilityZone: 'us-east-1a',
                size: cdk.Size.gibibytes(8),
                encryptionKey: key,
            });
        }).toThrow('`encrypted` must be true when providing an `encryptionKey`.');
        expect(() => {
            new lib_1.Volume(stack, `Volume${idx++}`, {
                availabilityZone: 'us-east-1a',
                size: cdk.Size.gibibytes(8),
                encrypted: false,
                encryptionKey: key,
            });
        }).toThrow('`encrypted` must be true when providing an `encryptionKey`.');
        expect(() => {
            new lib_1.Volume(stack, `Volume${idx++}`, {
                availabilityZone: 'us-east-1a',
                size: cdk.Size.gibibytes(8),
                encrypted: true,
                encryptionKey: key,
            });
        }).not.toThrow();
    });
    test('validation snapshotId', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const volume = new lib_1.Volume(stack, 'ForToken', {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(8),
        });
        let idx = 0;
        // THEN
        expect(() => {
            // Should not throw if we provide a Token for the snapshotId
            new lib_1.Volume(stack, `Volume${idx++}`, {
                availabilityZone: 'us-east-1a',
                snapshotId: volume.volumeId,
            });
        }).not.toThrow();
        expect(() => {
            new lib_1.Volume(stack, `Volume${idx++}`, {
                availabilityZone: 'us-east-1a',
                snapshotId: 'snap-0123456789abcdefABCDEF',
            });
        }).not.toThrow();
        expect(() => {
            new lib_1.Volume(stack, `Volume${idx++}`, {
                availabilityZone: 'us-east-1a',
                snapshotId: ' snap-1234', // leading extra character(s)
            });
        }).toThrow('`snapshotId` does match expected pattern. Expected `snap-<hexadecmial value>` (ex: `snap-05abe246af`) or Token');
        expect(() => {
            new lib_1.Volume(stack, `Volume${idx++}`, {
                availabilityZone: 'us-east-1a',
                snapshotId: 'snap-1234 ', // trailing extra character(s)
            });
        }).toThrow('`snapshotId` does match expected pattern. Expected `snap-<hexadecmial value>` (ex: `snap-05abe246af`) or Token');
    });
    test('validation iops', () => {
        // GIVEN
        const stack = new cdk.Stack();
        let idx = 0;
        // THEN
        // Test: Type of volume
        for (const volumeType of [
            lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
            lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2,
            lib_1.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
        ]) {
            expect(() => {
                new lib_1.Volume(stack, `Volume${idx++}`, {
                    availabilityZone: 'us-east-1a',
                    size: cdk.Size.gibibytes(500),
                    iops: 3000,
                    volumeType,
                });
            }).not.toThrow();
        }
        for (const volumeType of [
            lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
            lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2,
        ]) {
            expect(() => {
                new lib_1.Volume(stack, `Volume${idx++}`, {
                    availabilityZone: 'us-east-1a',
                    size: cdk.Size.gibibytes(500),
                    volumeType,
                });
            }).toThrow(/`iops` must be specified if the `volumeType` is/);
        }
        for (const volumeType of [
            lib_1.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
            lib_1.EbsDeviceVolumeType.THROUGHPUT_OPTIMIZED_HDD,
            lib_1.EbsDeviceVolumeType.COLD_HDD,
            lib_1.EbsDeviceVolumeType.MAGNETIC,
        ]) {
            expect(() => {
                new lib_1.Volume(stack, `Volume${idx++}`, {
                    availabilityZone: 'us-east-1a',
                    size: cdk.Size.gibibytes(500),
                    iops: 100,
                    volumeType,
                });
            }).toThrow(/`iops` may only be specified if the `volumeType` is/);
        }
        // Test: iops in range
        for (const testData of [
            [lib_1.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3, 3000, 16000],
            [lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD, 100, 64000],
            [lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2, 100, 64000],
        ]) {
            const volumeType = testData[0];
            const min = testData[1];
            const max = testData[2];
            expect(() => {
                new lib_1.Volume(stack, `Volume${idx++}`, {
                    availabilityZone: 'us-east-1a',
                    size: cdk.Size.tebibytes(10),
                    volumeType,
                    iops: min - 1,
                });
            }).toThrow(/iops must be between/);
            expect(() => {
                new lib_1.Volume(stack, `Volume${idx++}`, {
                    availabilityZone: 'us-east-1a',
                    size: cdk.Size.tebibytes(10),
                    volumeType,
                    iops: min,
                });
            }).not.toThrow();
            expect(() => {
                new lib_1.Volume(stack, `Volume${idx++}`, {
                    availabilityZone: 'us-east-1a',
                    size: cdk.Size.tebibytes(10),
                    volumeType,
                    iops: max,
                });
            }).not.toThrow();
            expect(() => {
                new lib_1.Volume(stack, `Volume${idx++}`, {
                    availabilityZone: 'us-east-1a',
                    size: cdk.Size.tebibytes(10),
                    volumeType,
                    iops: max + 1,
                });
            }).toThrow(/iops must be between/);
        }
        // Test: iops ratio
        for (const testData of [
            [lib_1.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3, 500],
            [lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD, 50],
            [lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2, 500],
        ]) {
            const volumeType = testData[0];
            const max = testData[1];
            const size = 10;
            expect(() => {
                new lib_1.Volume(stack, `Volume${idx++}`, {
                    availabilityZone: 'us-east-1a',
                    size: cdk.Size.gibibytes(size),
                    volumeType,
                    iops: max * size,
                });
            }).not.toThrow();
            expect(() => {
                new lib_1.Volume(stack, `Volume${idx++}`, {
                    availabilityZone: 'us-east-1a',
                    size: cdk.Size.gibibytes(size),
                    volumeType,
                    iops: max * size + 1,
                });
            }).toThrow(/iops has a maximum ratio of/);
        }
    });
    test('validation multi-attach', () => {
        // GIVEN
        const stack = new cdk.Stack();
        let idx = 0;
        // THEN
        for (const volumeType of [
            lib_1.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
            lib_1.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
            lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
            lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2,
            lib_1.EbsDeviceVolumeType.THROUGHPUT_OPTIMIZED_HDD,
            lib_1.EbsDeviceVolumeType.COLD_HDD,
            lib_1.EbsDeviceVolumeType.MAGNETIC,
        ]) {
            if ([
                lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
                lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2,
            ].includes(volumeType)) {
                expect(() => {
                    new lib_1.Volume(stack, `Volume${idx++}`, {
                        availabilityZone: 'us-east-1a',
                        size: cdk.Size.gibibytes(500),
                        enableMultiAttach: true,
                        volumeType,
                        iops: 100,
                    });
                }).not.toThrow();
            }
            else {
                expect(() => {
                    new lib_1.Volume(stack, `Volume${idx++}`, {
                        availabilityZone: 'us-east-1a',
                        size: cdk.Size.gibibytes(500),
                        enableMultiAttach: true,
                        volumeType,
                    });
                }).toThrow(/multi-attach is supported exclusively/);
            }
        }
    });
    test('validation size in range', () => {
        // GIVEN
        const stack = new cdk.Stack();
        let idx = 0;
        // THEN
        for (const testData of [
            [lib_1.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD, 1, 16384],
            [lib_1.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3, 1, 16384],
            [lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD, 4, 16384],
            [lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2, 4, 16384],
            [lib_1.EbsDeviceVolumeType.THROUGHPUT_OPTIMIZED_HDD, 125, 16384],
            [lib_1.EbsDeviceVolumeType.COLD_HDD, 125, 16384],
            [lib_1.EbsDeviceVolumeType.MAGNETIC, 1, 1024],
        ]) {
            const volumeType = testData[0];
            const min = testData[1];
            const max = testData[2];
            const iops = [
                lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
                lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2,
            ].includes(volumeType) ? 100 : null;
            expect(() => {
                new lib_1.Volume(stack, `Volume${idx++}`, {
                    availabilityZone: 'us-east-1a',
                    size: cdk.Size.gibibytes(min - 1),
                    volumeType,
                    ...iops
                        ? { iops }
                        : {},
                });
            }).toThrow(/volumes must be between/);
            expect(() => {
                new lib_1.Volume(stack, `Volume${idx++}`, {
                    availabilityZone: 'us-east-1a',
                    size: cdk.Size.gibibytes(min),
                    volumeType,
                    ...iops
                        ? { iops }
                        : {},
                });
            }).not.toThrow();
            expect(() => {
                new lib_1.Volume(stack, `Volume${idx++}`, {
                    availabilityZone: 'us-east-1a',
                    size: cdk.Size.gibibytes(max),
                    volumeType,
                    ...iops
                        ? { iops }
                        : {},
                });
            }).not.toThrow();
            expect(() => {
                new lib_1.Volume(stack, `Volume${idx++}`, {
                    availabilityZone: 'us-east-1a',
                    size: cdk.Size.gibibytes(max + 1),
                    volumeType,
                    ...iops
                        ? { iops }
                        : {},
                });
            }).toThrow(/volumes must be between/);
        }
    });
    test.each([124, 1001])('throws if throughput is set less than 125 or more than 1000', (throughput) => {
        const stack = new cdk.Stack();
        expect(() => {
            new lib_1.Volume(stack, 'Volume', {
                availabilityZone: 'us-east-1a',
                size: cdk.Size.gibibytes(1),
                volumeType: lib_1.EbsDeviceVolumeType.GP3,
                throughput,
            });
        }).toThrow(/throughput property takes a minimum of 125 and a maximum of 1000/);
    });
    test.each([
        ...Object.values(lib_1.EbsDeviceVolumeType).filter((v) => v !== 'gp3'),
    ])('throws if throughput is set on any volume type other than GP3', (volumeType) => {
        const stack = new cdk.Stack();
        const iops = [
            lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
            lib_1.EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2,
        ].includes(volumeType) ? 100 : null;
        expect(() => {
            new lib_1.Volume(stack, 'Volume', {
                availabilityZone: 'us-east-1a',
                size: cdk.Size.gibibytes(125),
                volumeType,
                ...iops ? { iops } : {},
                throughput: 125,
            });
        }).toThrow(/throughput property requires volumeType: EbsDeviceVolumeType.GP3/);
    });
    test('Invalid iops to throughput ratio', () => {
        const stack = new cdk.Stack();
        expect(() => {
            new lib_1.Volume(stack, 'Volume', {
                availabilityZone: 'us-east-1a',
                size: cdk.Size.gibibytes(125),
                volumeType: lib_1.EbsDeviceVolumeType.GP3,
                iops: 3000,
                throughput: 751,
            });
        }).toThrow('Throughput (MiBps) to iops ratio of 0.25033333333333335 is too high; maximum is 0.25 MiBps per iops');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm9sdW1lLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2b2x1bWUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCw4Q0FBOEQ7QUFDOUQsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQyxnQ0FRZ0I7QUFFaEIsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDdEIsSUFBSSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7UUFDeEIsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLE9BQU87UUFDUCxJQUFJLFlBQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQzFCLGdCQUFnQixFQUFFLFlBQVk7WUFDOUIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUMzQixVQUFVLEVBQUUsVUFBVTtTQUN2QixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsa0JBQWtCLEVBQUU7WUFDbEUsZ0JBQWdCLEVBQUUsWUFBWTtZQUM5QixrQkFBa0IsRUFBRSxLQUFLO1lBQ3pCLElBQUksRUFBRSxDQUFDO1lBQ1AsVUFBVSxFQUFFLEtBQUs7WUFDakIsSUFBSSxFQUFFO2dCQUNKO29CQUNFLEdBQUcsRUFBRSxNQUFNO29CQUNYLEtBQUssRUFBRSxVQUFVO2lCQUNsQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLGtCQUFrQixFQUFFO1lBQ3hELGNBQWMsRUFBRSxRQUFRO1NBQ3pCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtRQUNoQyxRQUFRO1FBQ1IsTUFB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QUM3QixVQUFVLEVBQUUseUJBQW1CLENBQUMsR0FBRztnQkFDbkMsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsVUFBVSxFQUFFLEdBQUc7YUFDaEIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHFHQUFxRyxDQUFDLENBQUM7SUFDcEgsQ0FBQyxDQUFDLENBQUM7QUFFTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgQWNjb3VudFJvb3RQcmluY2lwYWwsIFJvbGUgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7XG4gIEFtYXpvbkxpbnV4R2VuZXJhdGlvbixcbiAgRWJzRGV2aWNlVm9sdW1lVHlwZSxcbiAgSW5zdGFuY2UsXG4gIEluc3RhbmNlVHlwZSxcbiAgTWFjaGluZUltYWdlLFxuICBWb2x1bWUsXG4gIFZwYyxcbn0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ3ZvbHVtZScsICgpID0+IHtcbiAgdGVzdCgnYmFzaWMgdm9sdW1lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFZvbHVtZShzdGFjaywgJ1ZvbHVtZScsIHtcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgIHNpemU6IGNkay5TaXplLmdpYmlieXRlcyg4KSxcbiAgICAgIHZvbHVtZU5hbWU6ICdNeVZvbHVtZScsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWb2x1bWUnLCB7XG4gICAgICBBdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgICBNdWx0aUF0dGFjaEVuYWJsZWQ6IGZhbHNlLFxuICAgICAgU2l6ZTogOCxcbiAgICAgIFZvbHVtZVR5cGU6ICdncDInLFxuICAgICAgVGFnczogW1xuICAgICAgICB7XG4gICAgICAgICAgS2V5OiAnTmFtZScsXG4gICAgICAgICAgVmFsdWU6ICdNeVZvbHVtZScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpFQzI6OlZvbHVtZScsIHtcbiAgICAgIERlbGV0aW9uUG9saWN5OiAnUmV0YWluJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZnJvbVZvbHVtZUF0dHJpYnV0ZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBlbmNyeXB0aW9uS2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdLZXknKTtcbiAgICBjb25zdCB2b2x1bWVJZCA9ICd2b2wtMDAwMDAwJztcbiAgICBjb25zdCBhdmFpbGFiaWxpdHlab25lID0gJ3VzLWVhc3QtMWEnO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHZvbHVtZSA9IFZvbHVtZS5mcm9tVm9sdW1lQXR0cmlidXRlcyhzdGFjaywgJ1ZvbHVtZScsIHtcbiAgICAgIHZvbHVtZUlkLFxuICAgICAgYXZhaWxhYmlsaXR5Wm9uZSxcbiAgICAgIGVuY3J5cHRpb25LZXksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHZvbHVtZS52b2x1bWVJZCkudG9FcXVhbCh2b2x1bWVJZCk7XG4gICAgZXhwZWN0KHZvbHVtZS5hdmFpbGFiaWxpdHlab25lKS50b0VxdWFsKGF2YWlsYWJpbGl0eVpvbmUpO1xuICAgIGV4cGVjdCh2b2x1bWUuZW5jcnlwdGlvbktleSkudG9FcXVhbChlbmNyeXB0aW9uS2V5KTtcbiAgfSk7XG5cbiAgdGVzdCgndGFnZ2VkIHZvbHVtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZvbHVtZSA9IG5ldyBWb2x1bWUoc3RhY2ssICdWb2x1bWUnLCB7XG4gICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgICBzaXplOiBjZGsuU2l6ZS5naWJpYnl0ZXMoOCksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2RrLlRhZ3Mub2Yodm9sdW1lKS5hZGQoJ1RhZ0tleScsICdUYWdWYWx1ZScpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Vm9sdW1lJywge1xuICAgICAgQXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWEnLFxuICAgICAgTXVsdGlBdHRhY2hFbmFibGVkOiBmYWxzZSxcbiAgICAgIFNpemU6IDgsXG4gICAgICBWb2x1bWVUeXBlOiAnZ3AyJyxcbiAgICAgIFRhZ3M6IFt7XG4gICAgICAgIEtleTogJ1RhZ0tleScsXG4gICAgICAgIFZhbHVlOiAnVGFnVmFsdWUnLFxuICAgICAgfV0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2F1dG9lbmFibGVJTycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBWb2x1bWUoc3RhY2ssICdWb2x1bWUnLCB7XG4gICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgICBzaXplOiBjZGsuU2l6ZS5naWJpYnl0ZXMoNTAwKSxcbiAgICAgIGF1dG9FbmFibGVJbzogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZvbHVtZScsIHtcbiAgICAgIEF1dG9FbmFibGVJTzogdHJ1ZSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZW5jcnlwdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBWb2x1bWUoc3RhY2ssICdWb2x1bWUnLCB7XG4gICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgICBzaXplOiBjZGsuU2l6ZS5naWJpYnl0ZXMoNTAwKSxcbiAgICAgIGVuY3J5cHRlZDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZvbHVtZScsIHtcbiAgICAgIEVuY3J5cHRlZDogdHJ1ZSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZW5jcnlwdGlvbiB3aXRoIGttcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGVuY3J5cHRpb25LZXkgPSBuZXcga21zLktleShzdGFjaywgJ0tleScpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBWb2x1bWUoc3RhY2ssICdWb2x1bWUnLCB7XG4gICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgICBzaXplOiBjZGsuU2l6ZS5naWJpYnl0ZXMoNTAwKSxcbiAgICAgIGVuY3J5cHRlZDogdHJ1ZSxcbiAgICAgIGVuY3J5cHRpb25LZXksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWb2x1bWUnLCB7XG4gICAgICBFbmNyeXB0ZWQ6IHRydWUsXG4gICAgICBLbXNLZXlJZDoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnS2V5OTYxQjczRkQnLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICAgIEtleVBvbGljeToge1xuICAgICAgICBTdGF0ZW1lbnQ6IE1hdGNoLmFycmF5V2l0aChbe1xuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgIEFXUzoge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzppYW06OicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOnJvb3QnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICdrbXM6RGVzY3JpYmVLZXknLFxuICAgICAgICAgICAgJ2ttczpHZW5lcmF0ZURhdGFLZXlXaXRob3V0UGxhaW5UZXh0JyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAgICdrbXM6VmlhU2VydmljZSc6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ2VjMi4nLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAna21zOkNhbGxlckFjY291bnQnOiB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9XSksXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpb3BzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFZvbHVtZShzdGFjaywgJ1ZvbHVtZScsIHtcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgIHNpemU6IGNkay5TaXplLmdpYmlieXRlcyg1MDApLFxuICAgICAgaW9wczogNTAwLFxuICAgICAgdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5QUk9WSVNJT05FRF9JT1BTX1NTRCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZvbHVtZScsIHtcbiAgICAgIElvcHM6IDUwMCxcbiAgICAgIFZvbHVtZVR5cGU6ICdpbzEnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdtdWx0aS1hdHRhY2gnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgVm9sdW1lKHN0YWNrLCAnVm9sdW1lJywge1xuICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWEnLFxuICAgICAgc2l6ZTogY2RrLlNpemUuZ2liaWJ5dGVzKDUwMCksXG4gICAgICBpb3BzOiA1MDAsXG4gICAgICB2b2x1bWVUeXBlOiBFYnNEZXZpY2VWb2x1bWVUeXBlLlBST1ZJU0lPTkVEX0lPUFNfU1NELFxuICAgICAgZW5hYmxlTXVsdGlBdHRhY2g6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWb2x1bWUnLCB7XG4gICAgICBNdWx0aUF0dGFjaEVuYWJsZWQ6IHRydWUsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NuYXBzaG90SWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgVm9sdW1lKHN0YWNrLCAnVm9sdW1lJywge1xuICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWEnLFxuICAgICAgc25hcHNob3RJZDogJ3NuYXAtMDAwMDAwMDAnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Vm9sdW1lJywge1xuICAgICAgU25hcHNob3RJZDogJ3NuYXAtMDAwMDAwMDAnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvdWdocHV0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFZvbHVtZShzdGFjaywgJ1ZvbHVtZScsIHtcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgIHNpemU6IGNkay5TaXplLmdpYmlieXRlcygxKSxcbiAgICAgIHZvbHVtZVR5cGU6IEVic0RldmljZVZvbHVtZVR5cGUuR1AzLFxuICAgICAgdGhyb3VnaHB1dDogMjAwLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Vm9sdW1lJywge1xuICAgICAgVGhyb3VnaHB1dDogMjAwLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd2b2x1bWU6IHN0YW5kYXJkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFZvbHVtZShzdGFjaywgJ1ZvbHVtZScsIHtcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgIHNpemU6IGNkay5TaXplLmdpYmlieXRlcyg1MDApLFxuICAgICAgdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5NQUdORVRJQyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZvbHVtZScsIHtcbiAgICAgIFZvbHVtZVR5cGU6ICdzdGFuZGFyZCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3ZvbHVtZTogaW8xJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFZvbHVtZShzdGFjaywgJ1ZvbHVtZScsIHtcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgIHNpemU6IGNkay5TaXplLmdpYmlieXRlcyg1MDApLFxuICAgICAgdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5QUk9WSVNJT05FRF9JT1BTX1NTRCxcbiAgICAgIGlvcHM6IDMwMCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZvbHVtZScsIHtcbiAgICAgIFZvbHVtZVR5cGU6ICdpbzEnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd2b2x1bWU6IGlvMicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBWb2x1bWUoc3RhY2ssICdWb2x1bWUnLCB7XG4gICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgICBzaXplOiBjZGsuU2l6ZS5naWJpYnl0ZXMoNTAwKSxcbiAgICAgIHZvbHVtZVR5cGU6IEVic0RldmljZVZvbHVtZVR5cGUuUFJPVklTSU9ORURfSU9QU19TU0RfSU8yLFxuICAgICAgaW9wczogMzAwLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Vm9sdW1lJywge1xuICAgICAgVm9sdW1lVHlwZTogJ2lvMicsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3ZvbHVtZTogZ3AyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFZvbHVtZShzdGFjaywgJ1ZvbHVtZScsIHtcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgIHNpemU6IGNkay5TaXplLmdpYmlieXRlcyg1MDApLFxuICAgICAgdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5HRU5FUkFMX1BVUlBPU0VfU1NELFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Vm9sdW1lJywge1xuICAgICAgVm9sdW1lVHlwZTogJ2dwMicsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3ZvbHVtZTogZ3AzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFZvbHVtZShzdGFjaywgJ1ZvbHVtZScsIHtcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgIHNpemU6IGNkay5TaXplLmdpYmlieXRlcyg1MDApLFxuICAgICAgdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5HRU5FUkFMX1BVUlBPU0VfU1NEX0dQMyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZvbHVtZScsIHtcbiAgICAgIFZvbHVtZVR5cGU6ICdncDMnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd2b2x1bWU6IHN0MScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBWb2x1bWUoc3RhY2ssICdWb2x1bWUnLCB7XG4gICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgICBzaXplOiBjZGsuU2l6ZS5naWJpYnl0ZXMoNTAwKSxcbiAgICAgIHZvbHVtZVR5cGU6IEVic0RldmljZVZvbHVtZVR5cGUuVEhST1VHSFBVVF9PUFRJTUlaRURfSERELFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Vm9sdW1lJywge1xuICAgICAgVm9sdW1lVHlwZTogJ3N0MScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3ZvbHVtZTogc2MxJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFZvbHVtZShzdGFjaywgJ1ZvbHVtZScsIHtcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgIHNpemU6IGNkay5TaXplLmdpYmlieXRlcyg1MDApLFxuICAgICAgdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5DT0xEX0hERCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZvbHVtZScsIHtcbiAgICAgIFZvbHVtZVR5cGU6ICdzYzEnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdncmFudEF0dGFjaFZvbHVtZSB0byBhbnkgaW5zdGFuY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCByb2xlID0gbmV3IFJvbGUoc3RhY2ssICdSb2xlJywgeyBhc3N1bWVkQnk6IG5ldyBBY2NvdW50Um9vdFByaW5jaXBhbCgpIH0pO1xuICAgIGNvbnN0IHZvbHVtZSA9IG5ldyBWb2x1bWUoc3RhY2ssICdWb2x1bWUnLCB7XG4gICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgICBzaXplOiBjZGsuU2l6ZS5naWJpYnl0ZXMoOCksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgdm9sdW1lLmdyYW50QXR0YWNoVm9sdW1lKHJvbGUpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICBTdGF0ZW1lbnQ6IFt7XG4gICAgICAgICAgQWN0aW9uOiAnZWMyOkF0dGFjaFZvbHVtZScsXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFJlc291cmNlOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOmVjMjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzp2b2x1bWUvJyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnVm9sdW1lQTkyOTg4RDMnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6ZWMyOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOmluc3RhbmNlLyonLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH1dLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dyYW50QXR0YWNoVm9sdW1lIHRvIGFueSBpbnN0YW5jZSB3aXRoIGVuY3J5cHRpb24nLCAoKSA9PiB7XG4gICAgdGVzdCgnd2l0aCBkZWZhdWx0IGtleSBwb2xpY2llcycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHJvbGUgPSBuZXcgUm9sZShzdGFjaywgJ1JvbGUnLCB7IGFzc3VtZWRCeTogbmV3IEFjY291bnRSb290UHJpbmNpcGFsKCkgfSk7XG4gICAgICBjb25zdCBlbmNyeXB0aW9uS2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdLZXknKTtcbiAgICAgIGNvbnN0IHZvbHVtZSA9IG5ldyBWb2x1bWUoc3RhY2ssICdWb2x1bWUnLCB7XG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgc2l6ZTogY2RrLlNpemUuZ2liaWJ5dGVzKDgpLFxuICAgICAgICBlbmNyeXB0ZWQ6IHRydWUsXG4gICAgICAgIGVuY3J5cHRpb25LZXksXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgdm9sdW1lLmdyYW50QXR0YWNoVm9sdW1lKHJvbGUpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IE1hdGNoLmFycmF5V2l0aChbe1xuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgQWN0aW9uOiAna21zOkNyZWF0ZUdyYW50JyxcbiAgICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgICBCb29sOiB7XG4gICAgICAgICAgICAgICAgJ2ttczpHcmFudElzRm9yQVdTUmVzb3VyY2UnOiB0cnVlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAgICAgICAna21zOlZpYVNlcnZpY2UnOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgJ2VjMi4nLFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICcuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2ttczpHcmFudENvbnN0cmFpbnRUeXBlJzogJ0VuY3J5cHRpb25Db250ZXh0U3Vic2V0JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnS2V5OTYxQjczRkQnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZ3JhbnRBdHRhY2hWb2x1bWUgdG8gYW55IGluc3RhbmNlIHdpdGggS01TLmZyb21LZXlBcm4oKSBlbmNyeXB0aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnUm9sZScsIHsgYXNzdW1lZEJ5OiBuZXcgQWNjb3VudFJvb3RQcmluY2lwYWwoKSB9KTtcbiAgICBjb25zdCBrbXNLZXkgPSBuZXcga21zLktleShzdGFjaywgJ0tleScpO1xuICAgIC8vIGttc0tleSBwb2xpY3kgaXMgbm90IHN0cmljdGx5IG5lY2Vzc2FyeSBmb3IgdGhlIHRlc3QuXG4gICAgLy8gRGVtb25zdHJhdGluZyBob3cgdG8gcHJvcGVybHkgY29uc3RydWN0IHRoZSBLZXkuXG4gICAgY29uc3QgcHJpbmNpcGFsID1cbiAgICAgIG5ldyBrbXMuVmlhU2VydmljZVByaW5jaXBhbChgZWMyLiR7c3RhY2sucmVnaW9ufS5hbWF6b25hd3MuY29tYCwgbmV3IEFjY291bnRSb290UHJpbmNpcGFsKCkpLndpdGhDb25kaXRpb25zKHtcbiAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgJ2ttczpDYWxsZXJBY2NvdW50Jzogc3RhY2suYWNjb3VudCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIGttc0tleS5ncmFudChwcmluY2lwYWwsXG4gICAgICAvLyBEZXNjcmliZSAmIEdlbmVyYXRlIGFyZSByZXF1aXJlZCB0byBiZSBhYmxlIHRvIGNyZWF0ZSB0aGUgQ01LLWVuY3J5cHRlZCBWb2x1bWUuXG4gICAgICAna21zOkRlc2NyaWJlS2V5JyxcbiAgICAgICdrbXM6R2VuZXJhdGVEYXRhS2V5V2l0aG91dFBsYWluVGV4dCcsXG4gICAgICAvLyBSZUVuY3J5cHQgaXMgcmVxdWlyZWQgZm9yIHdoZW4gdGhlIENNSyBpcyByb3RhdGVkLlxuICAgICAgJ2ttczpSZUVuY3J5cHQqJyxcbiAgICApO1xuXG4gICAgY29uc3QgZW5jcnlwdGlvbktleSA9IGttcy5LZXkuZnJvbUtleUFybihzdGFjaywgJ0tleUFybicsIGttc0tleS5rZXlBcm4pO1xuICAgIGNvbnN0IHZvbHVtZSA9IG5ldyBWb2x1bWUoc3RhY2ssICdWb2x1bWUnLCB7XG4gICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgICBzaXplOiBjZGsuU2l6ZS5naWJpYnl0ZXMoOCksXG4gICAgICBlbmNyeXB0ZWQ6IHRydWUsXG4gICAgICBlbmNyeXB0aW9uS2V5LFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHZvbHVtZS5ncmFudEF0dGFjaFZvbHVtZShyb2xlKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoW3tcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgQWN0aW9uOiAna21zOkNyZWF0ZUdyYW50JyxcbiAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdLZXk5NjFCNzNGRCcsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgQm9vbDoge1xuICAgICAgICAgICAgICAna21zOkdyYW50SXNGb3JBV1NSZXNvdXJjZSc6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAgICdrbXM6VmlhU2VydmljZSc6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ2VjMi4nLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAna21zOkdyYW50Q29uc3RyYWludFR5cGUnOiAnRW5jcnlwdGlvbkNvbnRleHRTdWJzZXQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9XSksXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdncmFudEF0dGFjaFZvbHVtZSB0byBzcGVjaWZpYyBpbnN0YW5jZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCByb2xlID0gbmV3IFJvbGUoc3RhY2ssICdSb2xlJywgeyBhc3N1bWVkQnk6IG5ldyBBY2NvdW50Um9vdFByaW5jaXBhbCgpIH0pO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWcGMnKTtcbiAgICBjb25zdCBpbnN0YW5jZTEgPSBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZTEnLCB7XG4gICAgICB2cGMsXG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QzLnNtYWxsJyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IE1hY2hpbmVJbWFnZS5sYXRlc3RBbWF6b25MaW51eCh7IGdlbmVyYXRpb246IEFtYXpvbkxpbnV4R2VuZXJhdGlvbi5BTUFaT05fTElOVVhfMiB9KSxcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICB9KTtcbiAgICBjb25zdCBpbnN0YW5jZTIgPSBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZTInLCB7XG4gICAgICB2cGMsXG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QzLnNtYWxsJyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IE1hY2hpbmVJbWFnZS5sYXRlc3RBbWF6b25MaW51eCh7IGdlbmVyYXRpb246IEFtYXpvbkxpbnV4R2VuZXJhdGlvbi5BTUFaT05fTElOVVhfMiB9KSxcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICB9KTtcbiAgICBjb25zdCB2b2x1bWUgPSBuZXcgVm9sdW1lKHN0YWNrLCAnVm9sdW1lJywge1xuICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWEnLFxuICAgICAgc2l6ZTogY2RrLlNpemUuZ2liaWJ5dGVzKDgpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHZvbHVtZS5ncmFudEF0dGFjaFZvbHVtZShyb2xlLCBbaW5zdGFuY2UxLCBpbnN0YW5jZTJdKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgU3RhdGVtZW50OiBbe1xuICAgICAgICAgIEFjdGlvbjogJ2VjMjpBdHRhY2hWb2x1bWUnLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6ZWMyOicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6aW5zdGFuY2UvJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdJbnN0YW5jZTE0QkMzOTkxRCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6ZWMyOicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6aW5zdGFuY2UvJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdJbnN0YW5jZTI1NUYzNTI2NScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfV0pLFxuICAgICAgICB9XSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dyYW50QXR0YWNoVm9sdW1lIHRvIGluc3RhbmNlIHNlbGYnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVnBjJyk7XG4gICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZScsIHtcbiAgICAgIHZwYyxcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IEluc3RhbmNlVHlwZSgndDMuc21hbGwnKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogTWFjaGluZUltYWdlLmxhdGVzdEFtYXpvbkxpbnV4KHsgZ2VuZXJhdGlvbjogQW1hem9uTGludXhHZW5lcmF0aW9uLkFNQVpPTl9MSU5VWF8yIH0pLFxuICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWEnLFxuICAgIH0pO1xuICAgIGNvbnN0IHZvbHVtZSA9IG5ldyBWb2x1bWUoc3RhY2ssICdWb2x1bWUnLCB7XG4gICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgICBzaXplOiBjZGsuU2l6ZS5naWJpYnl0ZXMoOCksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgdm9sdW1lLmdyYW50QXR0YWNoVm9sdW1lQnlSZXNvdXJjZVRhZyhpbnN0YW5jZS5ncmFudFByaW5jaXBhbCwgW2luc3RhbmNlXSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIFN0YXRlbWVudDogW3tcbiAgICAgICAgICBBY3Rpb246ICdlYzI6QXR0YWNoVm9sdW1lJyxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUmVzb3VyY2U6IE1hdGNoLmFycmF5V2l0aChbe1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnOmVjMjonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnOmluc3RhbmNlLyonLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9XSksXG4gICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAnRm9yQW55VmFsdWU6U3RyaW5nRXF1YWxzJzoge1xuICAgICAgICAgICAgICAnZWMyOlJlc291cmNlVGFnL1ZvbHVtZUdyYW50QXR0YWNoLUIyMzc2QjJCREEnOiAnYjIzNzZiMmJkYTY1Y2I0MGY4M2MyOTBkZDg0NGM0YWEnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9XSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpWb2x1bWUnLCB7XG4gICAgICBUYWdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBLZXk6ICdWb2x1bWVHcmFudEF0dGFjaC1CMjM3NkIyQkRBJyxcbiAgICAgICAgICBWYWx1ZTogJ2IyMzc2YjJiZGE2NWNiNDBmODNjMjkwZGQ4NDRjNGFhJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpJbnN0YW5jZScsIHtcbiAgICAgIFRhZ3M6IE1hdGNoLmFycmF5V2l0aChbe1xuICAgICAgICBLZXk6ICdWb2x1bWVHcmFudEF0dGFjaC1CMjM3NkIyQkRBJyxcbiAgICAgICAgVmFsdWU6ICdiMjM3NmIyYmRhNjVjYjQwZjgzYzI5MGRkODQ0YzRhYScsXG4gICAgICB9XSksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dyYW50QXR0YWNoVm9sdW1lIHRvIGluc3RhbmNlIHNlbGYgd2l0aCBzdWZmaXgnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVnBjJyk7XG4gICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZScsIHtcbiAgICAgIHZwYyxcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IEluc3RhbmNlVHlwZSgndDMuc21hbGwnKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogTWFjaGluZUltYWdlLmxhdGVzdEFtYXpvbkxpbnV4KHsgZ2VuZXJhdGlvbjogQW1hem9uTGludXhHZW5lcmF0aW9uLkFNQVpPTl9MSU5VWF8yIH0pLFxuICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWEnLFxuICAgIH0pO1xuICAgIGNvbnN0IHZvbHVtZSA9IG5ldyBWb2x1bWUoc3RhY2ssICdWb2x1bWUnLCB7XG4gICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgICBzaXplOiBjZGsuU2l6ZS5naWJpYnl0ZXMoOCksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgdm9sdW1lLmdyYW50QXR0YWNoVm9sdW1lQnlSZXNvdXJjZVRhZyhpbnN0YW5jZS5ncmFudFByaW5jaXBhbCwgW2luc3RhbmNlXSwgJ1Rlc3RTdWZmaXgnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgU3RhdGVtZW50OiBbe1xuICAgICAgICAgIEFjdGlvbjogJ2VjMjpBdHRhY2hWb2x1bWUnLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6ZWMyOicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6aW5zdGFuY2UvKicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH1dKSxcbiAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgICdGb3JBbnlWYWx1ZTpTdHJpbmdFcXVhbHMnOiB7XG4gICAgICAgICAgICAgICdlYzI6UmVzb3VyY2VUYWcvVm9sdW1lR3JhbnRBdHRhY2gtVGVzdFN1ZmZpeCc6ICdiMjM3NmIyYmRhNjVjYjQwZjgzYzI5MGRkODQ0YzRhYScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH1dLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZvbHVtZScsIHtcbiAgICAgIFRhZ3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ1ZvbHVtZUdyYW50QXR0YWNoLVRlc3RTdWZmaXgnLFxuICAgICAgICAgIFZhbHVlOiAnYjIzNzZiMmJkYTY1Y2I0MGY4M2MyOTBkZDg0NGM0YWEnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6Okluc3RhbmNlJywge1xuICAgICAgVGFnczogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgIEtleTogJ1ZvbHVtZUdyYW50QXR0YWNoLVRlc3RTdWZmaXgnLFxuICAgICAgICBWYWx1ZTogJ2IyMzc2YjJiZGE2NWNiNDBmODNjMjkwZGQ4NDRjNGFhJyxcbiAgICAgIH1dKSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZ3JhbnREZXRhY2hWb2x1bWUgdG8gYW55IGluc3RhbmNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnUm9sZScsIHsgYXNzdW1lZEJ5OiBuZXcgQWNjb3VudFJvb3RQcmluY2lwYWwoKSB9KTtcbiAgICBjb25zdCB2b2x1bWUgPSBuZXcgVm9sdW1lKHN0YWNrLCAnVm9sdW1lJywge1xuICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWEnLFxuICAgICAgc2l6ZTogY2RrLlNpemUuZ2liaWJ5dGVzKDgpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHZvbHVtZS5ncmFudERldGFjaFZvbHVtZShyb2xlKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgU3RhdGVtZW50OiBbe1xuICAgICAgICAgIEFjdGlvbjogJ2VjMjpEZXRhY2hWb2x1bWUnLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzplYzI6JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6dm9sdW1lLycsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ1ZvbHVtZUE5Mjk4OEQzJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOmVjMjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzppbnN0YW5jZS8qJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9XSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dyYW50RGV0YWNoVm9sdW1lIGZyb20gc3BlY2lmaWMgaW5zdGFuY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCByb2xlID0gbmV3IFJvbGUoc3RhY2ssICdSb2xlJywgeyBhc3N1bWVkQnk6IG5ldyBBY2NvdW50Um9vdFByaW5jaXBhbCgpIH0pO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWcGMnKTtcbiAgICBjb25zdCBpbnN0YW5jZTEgPSBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZTEnLCB7XG4gICAgICB2cGMsXG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QzLnNtYWxsJyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IE1hY2hpbmVJbWFnZS5sYXRlc3RBbWF6b25MaW51eCh7IGdlbmVyYXRpb246IEFtYXpvbkxpbnV4R2VuZXJhdGlvbi5BTUFaT05fTElOVVhfMiB9KSxcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICB9KTtcbiAgICBjb25zdCBpbnN0YW5jZTIgPSBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZTInLCB7XG4gICAgICB2cGMsXG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QzLnNtYWxsJyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IE1hY2hpbmVJbWFnZS5sYXRlc3RBbWF6b25MaW51eCh7IGdlbmVyYXRpb246IEFtYXpvbkxpbnV4R2VuZXJhdGlvbi5BTUFaT05fTElOVVhfMiB9KSxcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICB9KTtcbiAgICBjb25zdCB2b2x1bWUgPSBuZXcgVm9sdW1lKHN0YWNrLCAnVm9sdW1lJywge1xuICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWEnLFxuICAgICAgc2l6ZTogY2RrLlNpemUuZ2liaWJ5dGVzKDgpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHZvbHVtZS5ncmFudERldGFjaFZvbHVtZShyb2xlLCBbaW5zdGFuY2UxLCBpbnN0YW5jZTJdKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgU3RhdGVtZW50OiBbe1xuICAgICAgICAgIEFjdGlvbjogJ2VjMjpEZXRhY2hWb2x1bWUnLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6ZWMyOicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6aW5zdGFuY2UvJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdJbnN0YW5jZTE0QkMzOTkxRCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6ZWMyOicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6aW5zdGFuY2UvJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdJbnN0YW5jZTI1NUYzNTI2NScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfV0pLFxuICAgICAgICB9XSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dyYW50RGV0YWNoVm9sdW1lIGZyb20gaW5zdGFuY2Ugc2VsZicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWcGMnKTtcbiAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyBJbnN0YW5jZShzdGFjaywgJ0luc3RhbmNlJywge1xuICAgICAgdnBjLFxuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgSW5zdGFuY2VUeXBlKCd0My5zbWFsbCcpLFxuICAgICAgbWFjaGluZUltYWdlOiBNYWNoaW5lSW1hZ2UubGF0ZXN0QW1hem9uTGludXgoeyBnZW5lcmF0aW9uOiBBbWF6b25MaW51eEdlbmVyYXRpb24uQU1BWk9OX0xJTlVYXzIgfSksXG4gICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgfSk7XG4gICAgY29uc3Qgdm9sdW1lID0gbmV3IFZvbHVtZShzdGFjaywgJ1ZvbHVtZScsIHtcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgIHNpemU6IGNkay5TaXplLmdpYmlieXRlcyg4KSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICB2b2x1bWUuZ3JhbnREZXRhY2hWb2x1bWVCeVJlc291cmNlVGFnKGluc3RhbmNlLmdyYW50UHJpbmNpcGFsLCBbaW5zdGFuY2VdKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgU3RhdGVtZW50OiBbe1xuICAgICAgICAgIEFjdGlvbjogJ2VjMjpEZXRhY2hWb2x1bWUnLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6ZWMyOicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6aW5zdGFuY2UvKicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH1dKSxcbiAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgICdGb3JBbnlWYWx1ZTpTdHJpbmdFcXVhbHMnOiB7XG4gICAgICAgICAgICAgICdlYzI6UmVzb3VyY2VUYWcvVm9sdW1lR3JhbnREZXRhY2gtQjIzNzZCMkJEQSc6ICdiMjM3NmIyYmRhNjVjYjQwZjgzYzI5MGRkODQ0YzRhYScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH1dLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZvbHVtZScsIHtcbiAgICAgIFRhZ3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ1ZvbHVtZUdyYW50RGV0YWNoLUIyMzc2QjJCREEnLFxuICAgICAgICAgIFZhbHVlOiAnYjIzNzZiMmJkYTY1Y2I0MGY4M2MyOTBkZDg0NGM0YWEnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6Okluc3RhbmNlJywge1xuICAgICAgVGFnczogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgIEtleTogJ1ZvbHVtZUdyYW50RGV0YWNoLUIyMzc2QjJCREEnLFxuICAgICAgICBWYWx1ZTogJ2IyMzc2YjJiZGE2NWNiNDBmODNjMjkwZGQ4NDRjNGFhJyxcbiAgICAgIH1dKSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZ3JhbnREZXRhY2hWb2x1bWUgZnJvbSBpbnN0YW5jZSBzZWxmIHdpdGggc3VmZml4JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZwYycpO1xuICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IEluc3RhbmNlKHN0YWNrLCAnSW5zdGFuY2UnLCB7XG4gICAgICB2cGMsXG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QzLnNtYWxsJyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IE1hY2hpbmVJbWFnZS5sYXRlc3RBbWF6b25MaW51eCh7IGdlbmVyYXRpb246IEFtYXpvbkxpbnV4R2VuZXJhdGlvbi5BTUFaT05fTElOVVhfMiB9KSxcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICB9KTtcbiAgICBjb25zdCB2b2x1bWUgPSBuZXcgVm9sdW1lKHN0YWNrLCAnVm9sdW1lJywge1xuICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWEnLFxuICAgICAgc2l6ZTogY2RrLlNpemUuZ2liaWJ5dGVzKDgpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHZvbHVtZS5ncmFudERldGFjaFZvbHVtZUJ5UmVzb3VyY2VUYWcoaW5zdGFuY2UuZ3JhbnRQcmluY2lwYWwsIFtpbnN0YW5jZV0sICdUZXN0U3VmZml4Jyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIFN0YXRlbWVudDogW3tcbiAgICAgICAgICBBY3Rpb246ICdlYzI6RGV0YWNoVm9sdW1lJyxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUmVzb3VyY2U6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOmVjMjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzppbnN0YW5jZS8qJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdKSxcbiAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgICdGb3JBbnlWYWx1ZTpTdHJpbmdFcXVhbHMnOiB7XG4gICAgICAgICAgICAgICdlYzI6UmVzb3VyY2VUYWcvVm9sdW1lR3JhbnREZXRhY2gtVGVzdFN1ZmZpeCc6ICdiMjM3NmIyYmRhNjVjYjQwZjgzYzI5MGRkODQ0YzRhYScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH1dLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZvbHVtZScsIHtcbiAgICAgIFRhZ3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ1ZvbHVtZUdyYW50RGV0YWNoLVRlc3RTdWZmaXgnLFxuICAgICAgICAgIFZhbHVlOiAnYjIzNzZiMmJkYTY1Y2I0MGY4M2MyOTBkZDg0NGM0YWEnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6Okluc3RhbmNlJywge1xuICAgICAgVGFnczogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgIEtleTogJ1ZvbHVtZUdyYW50RGV0YWNoLVRlc3RTdWZmaXgnLFxuICAgICAgICBWYWx1ZTogJ2IyMzc2YjJiZGE2NWNiNDBmODNjMjkwZGQ4NDRjNGFhJyxcbiAgICAgIH1dKSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndmFsaWRhdGlvbiBmcm9tVm9sdW1lQXR0cmlidXRlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGxldCBpZHg6IG51bWJlciA9IDA7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qgdm9sdW1lID0gbmV3IFZvbHVtZShzdGFjaywgJ1ZvbHVtZScsIHtcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgIHNpemU6IGNkay5TaXplLmdpYmlieXRlcyg4KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgVm9sdW1lLmZyb21Wb2x1bWVBdHRyaWJ1dGVzKHN0YWNrLCBgVm9sdW1lJHtpZHgrK31gLCB7XG4gICAgICAgIHZvbHVtZUlkOiB2b2x1bWUudm9sdW1lSWQsXG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6IHZvbHVtZS5hdmFpbGFiaWxpdHlab25lLFxuICAgICAgfSk7XG4gICAgfSkubm90LnRvVGhyb3coKTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgVm9sdW1lLmZyb21Wb2x1bWVBdHRyaWJ1dGVzKHN0YWNrLCBgVm9sdW1lJHtpZHgrK31gLCB7XG4gICAgICAgIHZvbHVtZUlkOiAndm9sLTAxMjM0NTY3ODlhYmNkZWZBQkNERUYnLFxuICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgICB9KTtcbiAgICB9KS5ub3QudG9UaHJvdygpO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBWb2x1bWUuZnJvbVZvbHVtZUF0dHJpYnV0ZXMoc3RhY2ssIGBWb2x1bWUke2lkeCsrfWAsIHtcbiAgICAgICAgdm9sdW1lSWQ6ICcgdm9sLTAxMjM0NTY3ODlhYmNkZWZBQkNERUYnLCAvLyBsZWFkaW5nIGludmFsaWQgY2hhcmFjdGVyKHMpXG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coJ2B2b2x1bWVJZGAgZG9lcyBub3QgbWF0Y2ggZXhwZWN0ZWQgcGF0dGVybi4gRXhwZWN0ZWQgYHZvbC08aGV4YWRlY21pYWwgdmFsdWU+YCAoZXg6IGB2b2wtMDVhYmUyNDZhZmApIG9yIGEgVG9rZW4nKTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgVm9sdW1lLmZyb21Wb2x1bWVBdHRyaWJ1dGVzKHN0YWNrLCBgVm9sdW1lJHtpZHgrK31gLCB7XG4gICAgICAgIHZvbHVtZUlkOiAndm9sLTAxMjM0NTY3ODlhYmNkZWZBQkNERUYgJywgLy8gdHJhaWxpbmcgaW52YWxpZCBjaGFyYWN0ZXIocylcbiAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWEnLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygnYHZvbHVtZUlkYCBkb2VzIG5vdCBtYXRjaCBleHBlY3RlZCBwYXR0ZXJuLiBFeHBlY3RlZCBgdm9sLTxoZXhhZGVjbWlhbCB2YWx1ZT5gIChleDogYHZvbC0wNWFiZTI0NmFmYCkgb3IgYSBUb2tlbicpO1xuICB9KTtcblxuICB0ZXN0KCd2YWxpZGF0aW9uIHJlcXVpcmVkIHByb3BzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdLZXknKTtcbiAgICBsZXQgaWR4OiBudW1iZXIgPSAwO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgVm9sdW1lKHN0YWNrLCBgVm9sdW1lJHtpZHgrK31gLCB7XG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coJ011c3QgcHJvdmlkZSBhdCBsZWFzdCBvbmUgb2YgYHNpemVgIG9yIGBzbmFwc2hvdElkYCcpO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgVm9sdW1lKHN0YWNrLCBgVm9sdW1lJHtpZHgrK31gLCB7XG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgc2l6ZTogY2RrLlNpemUuZ2liaWJ5dGVzKDgpLFxuICAgICAgfSk7XG4gICAgfSkubm90LnRvVGhyb3coKTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IFZvbHVtZShzdGFjaywgYFZvbHVtZSR7aWR4Kyt9YCwge1xuICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgICAgIHNuYXBzaG90SWQ6ICdzbmFwLTAwMDAwMDAwMCcsXG4gICAgICB9KTtcbiAgICB9KS5ub3QudG9UaHJvdygpO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgVm9sdW1lKHN0YWNrLCBgVm9sdW1lJHtpZHgrK31gLCB7XG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgc2l6ZTogY2RrLlNpemUuZ2liaWJ5dGVzKDgpLFxuICAgICAgICBzbmFwc2hvdElkOiAnc25hcC0wMDAwMDAwMDAnLFxuICAgICAgfSk7XG4gICAgfSkubm90LnRvVGhyb3coKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgVm9sdW1lKHN0YWNrLCBgVm9sdW1lJHtpZHgrK31gLCB7XG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgc2l6ZTogY2RrLlNpemUuZ2liaWJ5dGVzKDgpLFxuICAgICAgICBlbmNyeXB0aW9uS2V5OiBrZXksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KCdgZW5jcnlwdGVkYCBtdXN0IGJlIHRydWUgd2hlbiBwcm92aWRpbmcgYW4gYGVuY3J5cHRpb25LZXlgLicpO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgVm9sdW1lKHN0YWNrLCBgVm9sdW1lJHtpZHgrK31gLCB7XG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgc2l6ZTogY2RrLlNpemUuZ2liaWJ5dGVzKDgpLFxuICAgICAgICBlbmNyeXB0ZWQ6IGZhbHNlLFxuICAgICAgICBlbmNyeXB0aW9uS2V5OiBrZXksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KCdgZW5jcnlwdGVkYCBtdXN0IGJlIHRydWUgd2hlbiBwcm92aWRpbmcgYW4gYGVuY3J5cHRpb25LZXlgLicpO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgVm9sdW1lKHN0YWNrLCBgVm9sdW1lJHtpZHgrK31gLCB7XG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgc2l6ZTogY2RrLlNpemUuZ2liaWJ5dGVzKDgpLFxuICAgICAgICBlbmNyeXB0ZWQ6IHRydWUsXG4gICAgICAgIGVuY3J5cHRpb25LZXk6IGtleSxcbiAgICAgIH0pO1xuICAgIH0pLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3ZhbGlkYXRpb24gc25hcHNob3RJZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZvbHVtZSA9IG5ldyBWb2x1bWUoc3RhY2ssICdGb3JUb2tlbicsIHtcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgIHNpemU6IGNkay5TaXplLmdpYmlieXRlcyg4KSxcbiAgICB9KTtcbiAgICBsZXQgaWR4OiBudW1iZXIgPSAwO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAvLyBTaG91bGQgbm90IHRocm93IGlmIHdlIHByb3ZpZGUgYSBUb2tlbiBmb3IgdGhlIHNuYXBzaG90SWRcbiAgICAgIG5ldyBWb2x1bWUoc3RhY2ssIGBWb2x1bWUke2lkeCsrfWAsIHtcbiAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWEnLFxuICAgICAgICBzbmFwc2hvdElkOiB2b2x1bWUudm9sdW1lSWQsXG4gICAgICB9KTtcbiAgICB9KS5ub3QudG9UaHJvdygpO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgVm9sdW1lKHN0YWNrLCBgVm9sdW1lJHtpZHgrK31gLCB7XG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgc25hcHNob3RJZDogJ3NuYXAtMDEyMzQ1Njc4OWFiY2RlZkFCQ0RFRicsXG4gICAgICB9KTtcbiAgICB9KS5ub3QudG9UaHJvdygpO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgVm9sdW1lKHN0YWNrLCBgVm9sdW1lJHtpZHgrK31gLCB7XG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgc25hcHNob3RJZDogJyBzbmFwLTEyMzQnLCAvLyBsZWFkaW5nIGV4dHJhIGNoYXJhY3RlcihzKVxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygnYHNuYXBzaG90SWRgIGRvZXMgbWF0Y2ggZXhwZWN0ZWQgcGF0dGVybi4gRXhwZWN0ZWQgYHNuYXAtPGhleGFkZWNtaWFsIHZhbHVlPmAgKGV4OiBgc25hcC0wNWFiZTI0NmFmYCkgb3IgVG9rZW4nKTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IFZvbHVtZShzdGFjaywgYFZvbHVtZSR7aWR4Kyt9YCwge1xuICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgICAgIHNuYXBzaG90SWQ6ICdzbmFwLTEyMzQgJywgLy8gdHJhaWxpbmcgZXh0cmEgY2hhcmFjdGVyKHMpXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KCdgc25hcHNob3RJZGAgZG9lcyBtYXRjaCBleHBlY3RlZCBwYXR0ZXJuLiBFeHBlY3RlZCBgc25hcC08aGV4YWRlY21pYWwgdmFsdWU+YCAoZXg6IGBzbmFwLTA1YWJlMjQ2YWZgKSBvciBUb2tlbicpO1xuICB9KTtcblxuICB0ZXN0KCd2YWxpZGF0aW9uIGlvcHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBsZXQgaWR4OiBudW1iZXIgPSAwO1xuXG4gICAgLy8gVEhFTlxuICAgIC8vIFRlc3Q6IFR5cGUgb2Ygdm9sdW1lXG4gICAgZm9yIChjb25zdCB2b2x1bWVUeXBlIG9mIFtcbiAgICAgIEVic0RldmljZVZvbHVtZVR5cGUuUFJPVklTSU9ORURfSU9QU19TU0QsXG4gICAgICBFYnNEZXZpY2VWb2x1bWVUeXBlLlBST1ZJU0lPTkVEX0lPUFNfU1NEX0lPMixcbiAgICAgIEVic0RldmljZVZvbHVtZVR5cGUuR0VORVJBTF9QVVJQT1NFX1NTRF9HUDMsXG4gICAgXSkge1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IFZvbHVtZShzdGFjaywgYFZvbHVtZSR7aWR4Kyt9YCwge1xuICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgICBzaXplOiBjZGsuU2l6ZS5naWJpYnl0ZXMoNTAwKSxcbiAgICAgICAgICBpb3BzOiAzMDAwLFxuICAgICAgICAgIHZvbHVtZVR5cGUsXG4gICAgICAgIH0pO1xuICAgICAgfSkubm90LnRvVGhyb3coKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHZvbHVtZVR5cGUgb2YgW1xuICAgICAgRWJzRGV2aWNlVm9sdW1lVHlwZS5QUk9WSVNJT05FRF9JT1BTX1NTRCxcbiAgICAgIEVic0RldmljZVZvbHVtZVR5cGUuUFJPVklTSU9ORURfSU9QU19TU0RfSU8yLFxuICAgIF0pIHtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBWb2x1bWUoc3RhY2ssIGBWb2x1bWUke2lkeCsrfWAsIHtcbiAgICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgICAgICAgc2l6ZTogY2RrLlNpemUuZ2liaWJ5dGVzKDUwMCksXG4gICAgICAgICAgdm9sdW1lVHlwZSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9gaW9wc2AgbXVzdCBiZSBzcGVjaWZpZWQgaWYgdGhlIGB2b2x1bWVUeXBlYCBpcy8pO1xuICAgIH1cblxuICAgIGZvciAoY29uc3Qgdm9sdW1lVHlwZSBvZiBbXG4gICAgICBFYnNEZXZpY2VWb2x1bWVUeXBlLkdFTkVSQUxfUFVSUE9TRV9TU0QsXG4gICAgICBFYnNEZXZpY2VWb2x1bWVUeXBlLlRIUk9VR0hQVVRfT1BUSU1JWkVEX0hERCxcbiAgICAgIEVic0RldmljZVZvbHVtZVR5cGUuQ09MRF9IREQsXG4gICAgICBFYnNEZXZpY2VWb2x1bWVUeXBlLk1BR05FVElDLFxuICAgIF0pIHtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBWb2x1bWUoc3RhY2ssIGBWb2x1bWUke2lkeCsrfWAsIHtcbiAgICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgICAgICAgc2l6ZTogY2RrLlNpemUuZ2liaWJ5dGVzKDUwMCksXG4gICAgICAgICAgaW9wczogMTAwLFxuICAgICAgICAgIHZvbHVtZVR5cGUsXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvYGlvcHNgIG1heSBvbmx5IGJlIHNwZWNpZmllZCBpZiB0aGUgYHZvbHVtZVR5cGVgIGlzLyk7XG4gICAgfVxuXG4gICAgLy8gVGVzdDogaW9wcyBpbiByYW5nZVxuICAgIGZvciAoY29uc3QgdGVzdERhdGEgb2YgW1xuICAgICAgW0Vic0RldmljZVZvbHVtZVR5cGUuR0VORVJBTF9QVVJQT1NFX1NTRF9HUDMsIDMwMDAsIDE2MDAwXSxcbiAgICAgIFtFYnNEZXZpY2VWb2x1bWVUeXBlLlBST1ZJU0lPTkVEX0lPUFNfU1NELCAxMDAsIDY0MDAwXSxcbiAgICAgIFtFYnNEZXZpY2VWb2x1bWVUeXBlLlBST1ZJU0lPTkVEX0lPUFNfU1NEX0lPMiwgMTAwLCA2NDAwMF0sXG4gICAgXSkge1xuICAgICAgY29uc3Qgdm9sdW1lVHlwZSA9IHRlc3REYXRhWzBdIGFzIEVic0RldmljZVZvbHVtZVR5cGU7XG4gICAgICBjb25zdCBtaW4gPSB0ZXN0RGF0YVsxXSBhcyBudW1iZXI7XG4gICAgICBjb25zdCBtYXggPSB0ZXN0RGF0YVsyXSBhcyBudW1iZXI7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgVm9sdW1lKHN0YWNrLCBgVm9sdW1lJHtpZHgrK31gLCB7XG4gICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWEnLFxuICAgICAgICAgIHNpemU6IGNkay5TaXplLnRlYmlieXRlcygxMCksXG4gICAgICAgICAgdm9sdW1lVHlwZSxcbiAgICAgICAgICBpb3BzOiBtaW4gLSAxLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL2lvcHMgbXVzdCBiZSBiZXR3ZWVuLyk7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgVm9sdW1lKHN0YWNrLCBgVm9sdW1lJHtpZHgrK31gLCB7XG4gICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWEnLFxuICAgICAgICAgIHNpemU6IGNkay5TaXplLnRlYmlieXRlcygxMCksXG4gICAgICAgICAgdm9sdW1lVHlwZSxcbiAgICAgICAgICBpb3BzOiBtaW4sXG4gICAgICAgIH0pO1xuICAgICAgfSkubm90LnRvVGhyb3coKTtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBWb2x1bWUoc3RhY2ssIGBWb2x1bWUke2lkeCsrfWAsIHtcbiAgICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgICAgICAgc2l6ZTogY2RrLlNpemUudGViaWJ5dGVzKDEwKSxcbiAgICAgICAgICB2b2x1bWVUeXBlLFxuICAgICAgICAgIGlvcHM6IG1heCxcbiAgICAgICAgfSk7XG4gICAgICB9KS5ub3QudG9UaHJvdygpO1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IFZvbHVtZShzdGFjaywgYFZvbHVtZSR7aWR4Kyt9YCwge1xuICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgICBzaXplOiBjZGsuU2l6ZS50ZWJpYnl0ZXMoMTApLFxuICAgICAgICAgIHZvbHVtZVR5cGUsXG4gICAgICAgICAgaW9wczogbWF4ICsgMSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9pb3BzIG11c3QgYmUgYmV0d2Vlbi8pO1xuICAgIH1cblxuICAgIC8vIFRlc3Q6IGlvcHMgcmF0aW9cbiAgICBmb3IgKGNvbnN0IHRlc3REYXRhIG9mIFtcbiAgICAgIFtFYnNEZXZpY2VWb2x1bWVUeXBlLkdFTkVSQUxfUFVSUE9TRV9TU0RfR1AzLCA1MDBdLFxuICAgICAgW0Vic0RldmljZVZvbHVtZVR5cGUuUFJPVklTSU9ORURfSU9QU19TU0QsIDUwXSxcbiAgICAgIFtFYnNEZXZpY2VWb2x1bWVUeXBlLlBST1ZJU0lPTkVEX0lPUFNfU1NEX0lPMiwgNTAwXSxcbiAgICBdKSB7XG4gICAgICBjb25zdCB2b2x1bWVUeXBlID0gdGVzdERhdGFbMF0gYXMgRWJzRGV2aWNlVm9sdW1lVHlwZTtcbiAgICAgIGNvbnN0IG1heCA9IHRlc3REYXRhWzFdIGFzIG51bWJlcjtcbiAgICAgIGNvbnN0IHNpemUgPSAxMDtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBWb2x1bWUoc3RhY2ssIGBWb2x1bWUke2lkeCsrfWAsIHtcbiAgICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgICAgICAgc2l6ZTogY2RrLlNpemUuZ2liaWJ5dGVzKHNpemUpLFxuICAgICAgICAgIHZvbHVtZVR5cGUsXG4gICAgICAgICAgaW9wczogbWF4ICogc2l6ZSxcbiAgICAgICAgfSk7XG4gICAgICB9KS5ub3QudG9UaHJvdygpO1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IFZvbHVtZShzdGFjaywgYFZvbHVtZSR7aWR4Kyt9YCwge1xuICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgICBzaXplOiBjZGsuU2l6ZS5naWJpYnl0ZXMoc2l6ZSksXG4gICAgICAgICAgdm9sdW1lVHlwZSxcbiAgICAgICAgICBpb3BzOiBtYXggKiBzaXplICsgMSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9pb3BzIGhhcyBhIG1heGltdW0gcmF0aW8gb2YvKTtcbiAgICB9XG4gIH0pO1xuXG4gIHRlc3QoJ3ZhbGlkYXRpb24gbXVsdGktYXR0YWNoJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbGV0IGlkeDogbnVtYmVyID0gMDtcblxuICAgIC8vIFRIRU5cbiAgICBmb3IgKGNvbnN0IHZvbHVtZVR5cGUgb2YgW1xuICAgICAgRWJzRGV2aWNlVm9sdW1lVHlwZS5HRU5FUkFMX1BVUlBPU0VfU1NELFxuICAgICAgRWJzRGV2aWNlVm9sdW1lVHlwZS5HRU5FUkFMX1BVUlBPU0VfU1NEX0dQMyxcbiAgICAgIEVic0RldmljZVZvbHVtZVR5cGUuUFJPVklTSU9ORURfSU9QU19TU0QsXG4gICAgICBFYnNEZXZpY2VWb2x1bWVUeXBlLlBST1ZJU0lPTkVEX0lPUFNfU1NEX0lPMixcbiAgICAgIEVic0RldmljZVZvbHVtZVR5cGUuVEhST1VHSFBVVF9PUFRJTUlaRURfSERELFxuICAgICAgRWJzRGV2aWNlVm9sdW1lVHlwZS5DT0xEX0hERCxcbiAgICAgIEVic0RldmljZVZvbHVtZVR5cGUuTUFHTkVUSUMsXG4gICAgXSkge1xuICAgICAgaWYgKFxuICAgICAgICBbXG4gICAgICAgICAgRWJzRGV2aWNlVm9sdW1lVHlwZS5QUk9WSVNJT05FRF9JT1BTX1NTRCxcbiAgICAgICAgICBFYnNEZXZpY2VWb2x1bWVUeXBlLlBST1ZJU0lPTkVEX0lPUFNfU1NEX0lPMixcbiAgICAgICAgXS5pbmNsdWRlcyh2b2x1bWVUeXBlKVxuICAgICAgKSB7XG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgbmV3IFZvbHVtZShzdGFjaywgYFZvbHVtZSR7aWR4Kyt9YCwge1xuICAgICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWEnLFxuICAgICAgICAgICAgc2l6ZTogY2RrLlNpemUuZ2liaWJ5dGVzKDUwMCksXG4gICAgICAgICAgICBlbmFibGVNdWx0aUF0dGFjaDogdHJ1ZSxcbiAgICAgICAgICAgIHZvbHVtZVR5cGUsXG4gICAgICAgICAgICBpb3BzOiAxMDAsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pLm5vdC50b1Rocm93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgIG5ldyBWb2x1bWUoc3RhY2ssIGBWb2x1bWUke2lkeCsrfWAsIHtcbiAgICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgICAgIHNpemU6IGNkay5TaXplLmdpYmlieXRlcyg1MDApLFxuICAgICAgICAgICAgZW5hYmxlTXVsdGlBdHRhY2g6IHRydWUsXG4gICAgICAgICAgICB2b2x1bWVUeXBlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KS50b1Rocm93KC9tdWx0aS1hdHRhY2ggaXMgc3VwcG9ydGVkIGV4Y2x1c2l2ZWx5Lyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICB0ZXN0KCd2YWxpZGF0aW9uIHNpemUgaW4gcmFuZ2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBsZXQgaWR4OiBudW1iZXIgPSAwO1xuXG4gICAgLy8gVEhFTlxuICAgIGZvciAoY29uc3QgdGVzdERhdGEgb2YgW1xuICAgICAgW0Vic0RldmljZVZvbHVtZVR5cGUuR0VORVJBTF9QVVJQT1NFX1NTRCwgMSwgMTYzODRdLFxuICAgICAgW0Vic0RldmljZVZvbHVtZVR5cGUuR0VORVJBTF9QVVJQT1NFX1NTRF9HUDMsIDEsIDE2Mzg0XSxcbiAgICAgIFtFYnNEZXZpY2VWb2x1bWVUeXBlLlBST1ZJU0lPTkVEX0lPUFNfU1NELCA0LCAxNjM4NF0sXG4gICAgICBbRWJzRGV2aWNlVm9sdW1lVHlwZS5QUk9WSVNJT05FRF9JT1BTX1NTRF9JTzIsIDQsIDE2Mzg0XSxcbiAgICAgIFtFYnNEZXZpY2VWb2x1bWVUeXBlLlRIUk9VR0hQVVRfT1BUSU1JWkVEX0hERCwgMTI1LCAxNjM4NF0sXG4gICAgICBbRWJzRGV2aWNlVm9sdW1lVHlwZS5DT0xEX0hERCwgMTI1LCAxNjM4NF0sXG4gICAgICBbRWJzRGV2aWNlVm9sdW1lVHlwZS5NQUdORVRJQywgMSwgMTAyNF0sXG4gICAgXSkge1xuICAgICAgY29uc3Qgdm9sdW1lVHlwZSA9IHRlc3REYXRhWzBdIGFzIEVic0RldmljZVZvbHVtZVR5cGU7XG4gICAgICBjb25zdCBtaW4gPSB0ZXN0RGF0YVsxXSBhcyBudW1iZXI7XG4gICAgICBjb25zdCBtYXggPSB0ZXN0RGF0YVsyXSBhcyBudW1iZXI7XG4gICAgICBjb25zdCBpb3BzID0gW1xuICAgICAgICBFYnNEZXZpY2VWb2x1bWVUeXBlLlBST1ZJU0lPTkVEX0lPUFNfU1NELFxuICAgICAgICBFYnNEZXZpY2VWb2x1bWVUeXBlLlBST1ZJU0lPTkVEX0lPUFNfU1NEX0lPMixcbiAgICAgIF0uaW5jbHVkZXModm9sdW1lVHlwZSkgPyAxMDAgOiBudWxsO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgVm9sdW1lKHN0YWNrLCBgVm9sdW1lJHtpZHgrK31gLCB7XG4gICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWEnLFxuICAgICAgICAgIHNpemU6IGNkay5TaXplLmdpYmlieXRlcyhtaW4gLSAxKSxcbiAgICAgICAgICB2b2x1bWVUeXBlLFxuICAgICAgICAgIC4uLmlvcHNcbiAgICAgICAgICAgID8geyBpb3BzIH1cbiAgICAgICAgICAgIDoge30sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvdm9sdW1lcyBtdXN0IGJlIGJldHdlZW4vKTtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBWb2x1bWUoc3RhY2ssIGBWb2x1bWUke2lkeCsrfWAsIHtcbiAgICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYScsXG4gICAgICAgICAgc2l6ZTogY2RrLlNpemUuZ2liaWJ5dGVzKG1pbiksXG4gICAgICAgICAgdm9sdW1lVHlwZSxcbiAgICAgICAgICAuLi5pb3BzXG4gICAgICAgICAgICA/IHsgaW9wcyB9XG4gICAgICAgICAgICA6IHt9LFxuICAgICAgICB9KTtcbiAgICAgIH0pLm5vdC50b1Rocm93KCk7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgVm9sdW1lKHN0YWNrLCBgVm9sdW1lJHtpZHgrK31gLCB7XG4gICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWEnLFxuICAgICAgICAgIHNpemU6IGNkay5TaXplLmdpYmlieXRlcyhtYXgpLFxuICAgICAgICAgIHZvbHVtZVR5cGUsXG4gICAgICAgICAgLi4uaW9wc1xuICAgICAgICAgICAgPyB7IGlvcHMgfVxuICAgICAgICAgICAgOiB7fSxcbiAgICAgICAgfSk7XG4gICAgICB9KS5ub3QudG9UaHJvdygpO1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IFZvbHVtZShzdGFjaywgYFZvbHVtZSR7aWR4Kyt9YCwge1xuICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgICBzaXplOiBjZGsuU2l6ZS5naWJpYnl0ZXMobWF4ICsgMSksXG4gICAgICAgICAgdm9sdW1lVHlwZSxcbiAgICAgICAgICAuLi5pb3BzXG4gICAgICAgICAgICA/IHsgaW9wcyB9XG4gICAgICAgICAgICA6IHt9LFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL3ZvbHVtZXMgbXVzdCBiZSBiZXR3ZWVuLyk7XG4gICAgfVxuICB9KTtcblxuICB0ZXN0LmVhY2goWzEyNCwgMTAwMV0pKCd0aHJvd3MgaWYgdGhyb3VnaHB1dCBpcyBzZXQgbGVzcyB0aGFuIDEyNSBvciBtb3JlIHRoYW4gMTAwMCcsICh0aHJvdWdocHV0KSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBWb2x1bWUoc3RhY2ssICdWb2x1bWUnLCB7XG4gICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgc2l6ZTogY2RrLlNpemUuZ2liaWJ5dGVzKDEpLFxuICAgICAgICB2b2x1bWVUeXBlOiBFYnNEZXZpY2VWb2x1bWVUeXBlLkdQMyxcbiAgICAgICAgdGhyb3VnaHB1dCxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL3Rocm91Z2hwdXQgcHJvcGVydHkgdGFrZXMgYSBtaW5pbXVtIG9mIDEyNSBhbmQgYSBtYXhpbXVtIG9mIDEwMDAvKTtcbiAgfSk7XG5cbiAgdGVzdC5lYWNoKFtcbiAgICAuLi5PYmplY3QudmFsdWVzKEVic0RldmljZVZvbHVtZVR5cGUpLmZpbHRlcigodikgPT4gdiAhPT0gJ2dwMycpLFxuICBdKSgndGhyb3dzIGlmIHRocm91Z2hwdXQgaXMgc2V0IG9uIGFueSB2b2x1bWUgdHlwZSBvdGhlciB0aGFuIEdQMycsICh2b2x1bWVUeXBlKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgaW9wcyA9IFtcbiAgICAgIEVic0RldmljZVZvbHVtZVR5cGUuUFJPVklTSU9ORURfSU9QU19TU0QsXG4gICAgICBFYnNEZXZpY2VWb2x1bWVUeXBlLlBST1ZJU0lPTkVEX0lPUFNfU1NEX0lPMixcbiAgICBdLmluY2x1ZGVzKHZvbHVtZVR5cGUpID8gMTAwIDogbnVsbDtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IFZvbHVtZShzdGFjaywgJ1ZvbHVtZScsIHtcbiAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWEnLFxuICAgICAgICBzaXplOiBjZGsuU2l6ZS5naWJpYnl0ZXMoMTI1KSxcbiAgICAgICAgdm9sdW1lVHlwZSxcbiAgICAgICAgLi4uaW9wcyA/IHsgaW9wcyB9OiB7fSxcbiAgICAgICAgdGhyb3VnaHB1dDogMTI1LFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvdGhyb3VnaHB1dCBwcm9wZXJ0eSByZXF1aXJlcyB2b2x1bWVUeXBlOiBFYnNEZXZpY2VWb2x1bWVUeXBlLkdQMy8pO1xuICB9KTtcblxuICB0ZXN0KCdJbnZhbGlkIGlvcHMgdG8gdGhyb3VnaHB1dCByYXRpbycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IFZvbHVtZShzdGFjaywgJ1ZvbHVtZScsIHtcbiAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWEnLFxuICAgICAgICBzaXplOiBjZGsuU2l6ZS5naWJpYnl0ZXMoMTI1KSxcbiAgICAgICAgdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5HUDMsXG4gICAgICAgIGlvcHM6IDMwMDAsXG4gICAgICAgIHRocm91Z2hwdXQ6IDc1MSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coJ1Rocm91Z2hwdXQgKE1pQnBzKSB0byBpb3BzIHJhdGlvIG9mIDAuMjUwMzMzMzMzMzMzMzMzMzUgaXMgdG9vIGhpZ2g7IG1heGltdW0gaXMgMC4yNSBNaUJwcyBwZXIgaW9wcycpO1xuICB9KTtcblxufSk7XG4iXX0=