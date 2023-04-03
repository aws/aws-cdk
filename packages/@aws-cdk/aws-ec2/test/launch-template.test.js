"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const aws_kms_1 = require("@aws-cdk/aws-kms");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const util_1 = require("./util");
const lib_1 = require("../lib");
/* eslint-disable jest/expect-expect */
describe('LaunchTemplate', () => {
    let app;
    let stack;
    beforeEach(() => {
        app = new core_1.App();
        stack = new core_1.Stack(app);
    });
    test('Empty props', () => {
        // WHEN
        const template = new lib_1.LaunchTemplate(stack, 'Template');
        // THEN
        // Note: The following is intentionally a haveResource instead of haveResourceLike
        // to ensure that only the bare minimum of properties have values when no properties
        // are given to a LaunchTemplate.
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                TagSpecifications: [
                    {
                        ResourceType: 'instance',
                        Tags: [
                            {
                                Key: 'Name',
                                Value: 'Default/Template',
                            },
                        ],
                    },
                    {
                        ResourceType: 'volume',
                        Tags: [
                            {
                                Key: 'Name',
                                Value: 'Default/Template',
                            },
                        ],
                    },
                ],
            },
            TagSpecifications: [
                {
                    ResourceType: 'launch-template',
                    Tags: [
                        {
                            Key: 'Name',
                            Value: 'Default/Template',
                        },
                    ],
                },
            ],
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::InstanceProfile', 0);
        expect(() => { template.grantPrincipal; }).toThrow();
        expect(() => { template.connections; }).toThrow();
        expect(template.osType).toBeUndefined();
        expect(template.role).toBeUndefined();
        expect(template.userData).toBeUndefined();
    });
    test('Import from attributes with name', () => {
        // WHEN
        const template = lib_1.LaunchTemplate.fromLaunchTemplateAttributes(stack, 'Template', {
            launchTemplateName: 'TestName',
            versionNumber: 'TestVersion',
        });
        // THEN
        expect(template.launchTemplateId).toBeUndefined();
        expect(template.launchTemplateName).toBe('TestName');
        expect(template.versionNumber).toBe('TestVersion');
    });
    test('Import from attributes with id', () => {
        // WHEN
        const template = lib_1.LaunchTemplate.fromLaunchTemplateAttributes(stack, 'Template', {
            launchTemplateId: 'TestId',
            versionNumber: 'TestVersion',
        });
        // THEN
        expect(template.launchTemplateId).toBe('TestId');
        expect(template.launchTemplateName).toBeUndefined();
        expect(template.versionNumber).toBe('TestVersion');
    });
    test('Import from attributes fails with name and id', () => {
        expect(() => {
            lib_1.LaunchTemplate.fromLaunchTemplateAttributes(stack, 'Template', {
                launchTemplateName: 'TestName',
                launchTemplateId: 'TestId',
                versionNumber: 'TestVersion',
            });
        }).toThrow();
    });
    test('Given name', () => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            launchTemplateName: 'LTName',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateName: 'LTName',
        });
    });
    test('Given instanceType', () => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            instanceType: new lib_1.InstanceType('tt.test'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                InstanceType: 'tt.test',
            },
        });
    });
    test('Given machineImage (Linux)', () => {
        // WHEN
        const template = new lib_1.LaunchTemplate(stack, 'Template', {
            machineImage: new lib_1.AmazonLinuxImage(),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                ImageId: {
                    Ref: util_1.stringLike('SsmParameterValueawsserviceamiamazonlinuxlatestamznami.*Parameter'),
                },
            },
        });
        expect(template.osType).toBe(lib_1.OperatingSystemType.LINUX);
        expect(template.userData).toBeUndefined();
    });
    test('Given machineImage (Windows)', () => {
        // WHEN
        const template = new lib_1.LaunchTemplate(stack, 'Template', {
            machineImage: new lib_1.WindowsImage(lib_1.WindowsVersion.WINDOWS_SERVER_2019_ENGLISH_FULL_BASE),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                ImageId: {
                    Ref: util_1.stringLike('SsmParameterValueawsserviceamiwindowslatestWindowsServer2019EnglishFullBase.*Parameter'),
                },
            },
        });
        expect(template.osType).toBe(lib_1.OperatingSystemType.WINDOWS);
        expect(template.userData).toBeUndefined();
    });
    test('Given userData', () => {
        // GIVEN
        const userData = lib_1.UserData.forLinux();
        userData.addCommands('echo Test');
        // WHEN
        const template = new lib_1.LaunchTemplate(stack, 'Template', {
            userData,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                UserData: {
                    'Fn::Base64': '#!/bin/bash\necho Test',
                },
            },
        });
        expect(template.userData).toBeDefined();
    });
    test('Given role', () => {
        // GIVEN
        const role = new aws_iam_1.Role(stack, 'TestRole', {
            assumedBy: new aws_iam_1.ServicePrincipal('ec2.amazonaws.com'),
        });
        // WHEN
        const template = new lib_1.LaunchTemplate(stack, 'Template', {
            role,
        });
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::InstanceProfile', {
            Roles: [
                {
                    Ref: 'TestRole6C9272DF',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                IamInstanceProfile: {
                    Arn: stack.resolve(template.node.findChild('Profile').getAtt('Arn')),
                },
                TagSpecifications: [
                    {
                        ResourceType: 'instance',
                        Tags: [
                            {
                                Key: 'Name',
                                Value: 'Default/Template',
                            },
                        ],
                    },
                    {
                        ResourceType: 'volume',
                        Tags: [
                            {
                                Key: 'Name',
                                Value: 'Default/Template',
                            },
                        ],
                    },
                ],
            },
            TagSpecifications: [
                {
                    ResourceType: 'launch-template',
                    Tags: [
                        {
                            Key: 'Name',
                            Value: 'Default/Template',
                        },
                    ],
                },
            ],
        });
        expect(template.role).toBeDefined();
        expect(template.grantPrincipal).toBeDefined();
    });
    test('Given blockDeviceMapping', () => {
        // GIVEN
        const kmsKey = new aws_kms_1.Key(stack, 'EbsKey');
        const blockDevices = [
            {
                deviceName: 'ebs',
                mappingEnabled: true,
                volume: lib_1.BlockDeviceVolume.ebs(15, {
                    deleteOnTermination: true,
                    encrypted: true,
                    volumeType: lib_1.EbsDeviceVolumeType.IO1,
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
            },
        ];
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            blockDevices,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
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
                        NoDevice: '',
                    },
                    {
                        DeviceName: 'ephemeral',
                        VirtualName: 'ephemeral0',
                    },
                ],
            },
        });
    });
    describe('feature flag @aws-cdk/aws-ec2:launchTemplateDefaultUserData', () => {
        test('Given machineImage (Linux)', () => {
            // WHEN
            stack.node.setContext(cxapi.EC2_LAUNCH_TEMPLATE_DEFAULT_USER_DATA, true);
            const template = new lib_1.LaunchTemplate(stack, 'Template', {
                machineImage: new lib_1.AmazonLinuxImage(),
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
                LaunchTemplateData: {
                    ImageId: {
                        Ref: util_1.stringLike('SsmParameterValueawsserviceamiamazonlinuxlatestamznami.*Parameter'),
                    },
                },
            });
            expect(template.osType).toBe(lib_1.OperatingSystemType.LINUX);
            expect(template.userData).toBeDefined();
        });
        test('Given machineImage (Windows)', () => {
            // WHEN
            stack.node.setContext(cxapi.EC2_LAUNCH_TEMPLATE_DEFAULT_USER_DATA, true);
            const template = new lib_1.LaunchTemplate(stack, 'Template', {
                machineImage: new lib_1.WindowsImage(lib_1.WindowsVersion.WINDOWS_SERVER_2019_ENGLISH_FULL_BASE),
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
                LaunchTemplateData: {
                    ImageId: {
                        Ref: util_1.stringLike('SsmParameterValueawsserviceamiwindowslatestWindowsServer2019EnglishFullBase.*Parameter'),
                    },
                },
            });
            expect(template.osType).toBe(lib_1.OperatingSystemType.WINDOWS);
            expect(template.userData).toBeDefined();
        });
    });
    test.each([
        [lib_1.CpuCredits.STANDARD, 'standard'],
        [lib_1.CpuCredits.UNLIMITED, 'unlimited'],
    ])('Given cpuCredits %p', (given, expected) => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            cpuCredits: given,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                CreditSpecification: {
                    CpuCredits: expected,
                },
            },
        });
    });
    test.each([
        [true, true],
        [false, false],
    ])('Given disableApiTermination %p', (given, expected) => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            disableApiTermination: given,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                DisableApiTermination: expected,
            },
        });
    });
    test.each([
        [true, true],
        [false, false],
    ])('Given ebsOptimized %p', (given, expected) => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            ebsOptimized: given,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                EbsOptimized: expected,
            },
        });
    });
    test.each([
        [true, true],
        [false, false],
    ])('Given nitroEnclaveEnabled %p', (given, expected) => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            nitroEnclaveEnabled: given,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                EnclaveOptions: {
                    Enabled: expected,
                },
            },
        });
    });
    test.each([
        [lib_1.InstanceInitiatedShutdownBehavior.STOP, 'stop'],
        [lib_1.InstanceInitiatedShutdownBehavior.TERMINATE, 'terminate'],
    ])('Given instanceInitiatedShutdownBehavior %p', (given, expected) => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            instanceInitiatedShutdownBehavior: given,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                InstanceInitiatedShutdownBehavior: expected,
            },
        });
    });
    test('Given keyName', () => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            keyName: 'TestKeyname',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                KeyName: 'TestKeyname',
            },
        });
    });
    test.each([
        [true, true],
        [false, false],
    ])('Given detailedMonitoring %p', (given, expected) => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            detailedMonitoring: given,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                Monitoring: {
                    Enabled: expected,
                },
            },
        });
    });
    test('Given securityGroup', () => {
        // GIVEN
        const vpc = new lib_1.Vpc(stack, 'VPC');
        const sg = new lib_1.SecurityGroup(stack, 'SG', { vpc });
        // WHEN
        const template = new lib_1.LaunchTemplate(stack, 'Template', {
            securityGroup: sg,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                SecurityGroupIds: [
                    {
                        'Fn::GetAtt': [
                            'SGADB53937',
                            'GroupId',
                        ],
                    },
                ],
            },
        });
        expect(template.connections).toBeDefined();
        expect(template.connections.securityGroups).toHaveLength(1);
        expect(template.connections.securityGroups[0]).toBe(sg);
    });
    test('Adding tags', () => {
        // GIVEN
        const template = new lib_1.LaunchTemplate(stack, 'Template');
        // WHEN
        core_1.Tags.of(template).add('TestKey', 'TestValue');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                TagSpecifications: [
                    {
                        ResourceType: 'instance',
                        Tags: [
                            {
                                Key: 'Name',
                                Value: 'Default/Template',
                            },
                            {
                                Key: 'TestKey',
                                Value: 'TestValue',
                            },
                        ],
                    },
                    {
                        ResourceType: 'volume',
                        Tags: [
                            {
                                Key: 'Name',
                                Value: 'Default/Template',
                            },
                            {
                                Key: 'TestKey',
                                Value: 'TestValue',
                            },
                        ],
                    },
                ],
            },
            TagSpecifications: [
                {
                    ResourceType: 'launch-template',
                    Tags: [
                        {
                            Key: 'Name',
                            Value: 'Default/Template',
                        },
                        {
                            Key: 'TestKey',
                            Value: 'TestValue',
                        },
                    ],
                },
            ],
        });
    });
    test('Requires IMDSv2', () => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            requireImdsv2: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                MetadataOptions: {
                    HttpTokens: 'required',
                },
            },
        });
    });
});
describe('LaunchTemplate marketOptions', () => {
    let app;
    let stack;
    beforeEach(() => {
        app = new core_1.App();
        stack = new core_1.Stack(app);
    });
    test('given spotOptions', () => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            spotOptions: {},
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                InstanceMarketOptions: {
                    MarketType: 'spot',
                },
            },
        });
    });
    test.each([
        [0, 1],
        [1, 0],
        [6, 0],
        [7, 1],
    ])('for range duration errors: %p', (duration, expectedErrors) => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            spotOptions: {
                blockDuration: core_1.Duration.hours(duration),
            },
        });
        // THEN
        const errors = assertions_1.Annotations.fromStack(stack).findError('/Default/Template', assertions_1.Match.anyValue());
        expect(errors).toHaveLength(expectedErrors);
    });
    test('for bad duration', () => {
        expect(() => {
            new lib_1.LaunchTemplate(stack, 'Template', {
                spotOptions: {
                    // Duration must be an integral number of hours.
                    blockDuration: core_1.Duration.minutes(61),
                },
            });
        }).toThrow();
    });
    test('given blockDuration', () => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            spotOptions: {
                blockDuration: core_1.Duration.hours(1),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                InstanceMarketOptions: {
                    MarketType: 'spot',
                    SpotOptions: {
                        BlockDurationMinutes: 60,
                    },
                },
            },
        });
    });
    test.each([
        [lib_1.SpotInstanceInterruption.STOP, 'stop'],
        [lib_1.SpotInstanceInterruption.TERMINATE, 'terminate'],
        [lib_1.SpotInstanceInterruption.HIBERNATE, 'hibernate'],
    ])('given interruptionBehavior %p', (given, expected) => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            spotOptions: {
                interruptionBehavior: given,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                InstanceMarketOptions: {
                    MarketType: 'spot',
                    SpotOptions: {
                        InstanceInterruptionBehavior: expected,
                    },
                },
            },
        });
    });
    test.each([
        [0.001, '0.001'],
        [1, '1'],
        [2.5, '2.5'],
    ])('given maxPrice %p', (given, expected) => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            spotOptions: {
                maxPrice: given,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                InstanceMarketOptions: {
                    MarketType: 'spot',
                    SpotOptions: {
                        MaxPrice: expected,
                    },
                },
            },
        });
    });
    test.each([
        [lib_1.SpotRequestType.ONE_TIME, 'one-time'],
        [lib_1.SpotRequestType.PERSISTENT, 'persistent'],
    ])('given requestType %p', (given, expected) => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            spotOptions: {
                requestType: given,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                InstanceMarketOptions: {
                    MarketType: 'spot',
                    SpotOptions: {
                        SpotInstanceType: expected,
                    },
                },
            },
        });
    });
    test('given validUntil', () => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            spotOptions: {
                validUntil: core_1.Expiration.atTimestamp(0),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                InstanceMarketOptions: {
                    MarketType: 'spot',
                    SpotOptions: {
                        ValidUntil: 'Thu, 01 Jan 1970 00:00:00 GMT',
                    },
                },
            },
        });
    });
});
describe('LaunchTemplate metadataOptions', () => {
    let app;
    let stack;
    beforeEach(() => {
        app = new core_1.App();
        stack = new core_1.Stack(app);
    });
    test.each([
        [true, 'enabled'],
        [false, 'disabled'],
    ])('given httpEndpoint %p', (given, expected) => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            httpEndpoint: given,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                MetadataOptions: {
                    HttpEndpoint: expected,
                },
            },
        });
    });
    test.each([
        [true, 'enabled'],
        [false, 'disabled'],
    ])('given httpProtocolIpv6 %p', (given, expected) => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            httpProtocolIpv6: given,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                MetadataOptions: {
                    HttpProtocolIpv6: expected,
                },
            },
        });
    });
    test.each([
        [1, 1],
        [2, 2],
    ])('given httpPutResponseHopLimit %p', (given, expected) => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            httpPutResponseHopLimit: given,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                MetadataOptions: {
                    HttpPutResponseHopLimit: expected,
                },
            },
        });
    });
    test.each([
        [lib_1.LaunchTemplateHttpTokens.OPTIONAL, 'optional'],
        [lib_1.LaunchTemplateHttpTokens.REQUIRED, 'required'],
    ])('given httpTokens %p', (given, expected) => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            httpTokens: given,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                MetadataOptions: {
                    HttpTokens: expected,
                },
            },
        });
    });
    test.each([
        [true, 'enabled'],
        [false, 'disabled'],
    ])('given instanceMetadataTags %p', (given, expected) => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            instanceMetadataTags: given,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                MetadataOptions: {
                    InstanceMetadataTags: expected,
                },
            },
        });
    });
    test.each([
        [0, 1],
        [-1, 1],
        [1, 0],
        [64, 0],
        [65, 1],
    ])('given instanceMetadataTags %p', (given, expected) => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            httpPutResponseHopLimit: given,
        });
        // THEN
        const errors = assertions_1.Annotations.fromStack(stack).findError('/Default/Template', assertions_1.Match.anyValue());
        expect(errors).toHaveLength(expected);
    });
    test('throw when requireImdsv2 is true and httpTokens is OPTIONAL', () => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            requireImdsv2: true,
            httpTokens: lib_1.LaunchTemplateHttpTokens.OPTIONAL,
        });
        // THEN
        const errors = assertions_1.Annotations.fromStack(stack).findError('/Default/Template', assertions_1.Match.anyValue());
        expect(errors[0].entry.data).toMatch(/httpTokens must be required when requireImdsv2 is true/);
    });
    test('httpTokens REQUIRED is allowed when requireImdsv2 is true', () => {
        // WHEN
        new lib_1.LaunchTemplate(stack, 'Template', {
            requireImdsv2: true,
            httpTokens: lib_1.LaunchTemplateHttpTokens.REQUIRED,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                MetadataOptions: {
                    HttpTokens: 'required',
                },
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF1bmNoLXRlbXBsYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYXVuY2gtdGVtcGxhdGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFtRTtBQUNuRSw4Q0FJMEI7QUFDMUIsOENBQXVDO0FBQ3ZDLHdDQU11QjtBQUN2Qix5Q0FBeUM7QUFDekMsaUNBQW9DO0FBQ3BDLGdDQWtCZ0I7QUFFaEIsdUNBQXVDO0FBRXZDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7SUFDOUIsSUFBSSxHQUFRLENBQUM7SUFDYixJQUFJLEtBQVksQ0FBQztJQUVqQixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7UUFDaEIsS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7UUFDdkIsT0FBTztRQUNQLE1BQU0sUUFBUSxHQUFHLElBQUksb0JBQWMsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFdkQsT0FBTztRQUNQLGtGQUFrRjtRQUNsRixvRkFBb0Y7UUFDcEYsaUNBQWlDO1FBQ2pDLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDBCQUEwQixFQUFFO1lBQzFFLGtCQUFrQixFQUFFO2dCQUNsQixpQkFBaUIsRUFBRTtvQkFDakI7d0JBQ0UsWUFBWSxFQUFFLFVBQVU7d0JBQ3hCLElBQUksRUFBRTs0QkFDSjtnQ0FDRSxHQUFHLEVBQUUsTUFBTTtnQ0FDWCxLQUFLLEVBQUUsa0JBQWtCOzZCQUMxQjt5QkFDRjtxQkFDRjtvQkFDRDt3QkFDRSxZQUFZLEVBQUUsUUFBUTt3QkFDdEIsSUFBSSxFQUFFOzRCQUNKO2dDQUNFLEdBQUcsRUFBRSxNQUFNO2dDQUNYLEtBQUssRUFBRSxrQkFB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bXBvcnQgeyBBbm5vdGF0aW9ucywgVGVtcGxhdGUsIE1hdGNoIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQge1xuICBDZm5JbnN0YW5jZVByb2ZpbGUsXG4gIFJvbGUsXG4gIFNlcnZpY2VQcmluY2lwYWwsXG59IGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgS2V5IH0gZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQge1xuICBBcHAsXG4gIER1cmF0aW9uLFxuICBFeHBpcmF0aW9uLFxuICBTdGFjayxcbiAgVGFncyxcbn0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgc3RyaW5nTGlrZSB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQge1xuICBBbWF6b25MaW51eEltYWdlLFxuICBCbG9ja0RldmljZSxcbiAgQmxvY2tEZXZpY2VWb2x1bWUsXG4gIENwdUNyZWRpdHMsXG4gIEVic0RldmljZVZvbHVtZVR5cGUsXG4gIEluc3RhbmNlSW5pdGlhdGVkU2h1dGRvd25CZWhhdmlvcixcbiAgSW5zdGFuY2VUeXBlLFxuICBMYXVuY2hUZW1wbGF0ZSxcbiAgTGF1bmNoVGVtcGxhdGVIdHRwVG9rZW5zLFxuICBPcGVyYXRpbmdTeXN0ZW1UeXBlLFxuICBTZWN1cml0eUdyb3VwLFxuICBTcG90SW5zdGFuY2VJbnRlcnJ1cHRpb24sXG4gIFNwb3RSZXF1ZXN0VHlwZSxcbiAgVXNlckRhdGEsXG4gIFZwYyxcbiAgV2luZG93c0ltYWdlLFxuICBXaW5kb3dzVmVyc2lvbixcbn0gZnJvbSAnLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgamVzdC9leHBlY3QtZXhwZWN0ICovXG5cbmRlc2NyaWJlKCdMYXVuY2hUZW1wbGF0ZScsICgpID0+IHtcbiAgbGV0IGFwcDogQXBwO1xuICBsZXQgc3RhY2s6IFN0YWNrO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGFwcCA9IG5ldyBBcHAoKTtcbiAgICBzdGFjayA9IG5ldyBTdGFjayhhcHApO1xuICB9KTtcblxuICB0ZXN0KCdFbXB0eSBwcm9wcycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdGVtcGxhdGUgPSBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScpO1xuXG4gICAgLy8gVEhFTlxuICAgIC8vIE5vdGU6IFRoZSBmb2xsb3dpbmcgaXMgaW50ZW50aW9uYWxseSBhIGhhdmVSZXNvdXJjZSBpbnN0ZWFkIG9mIGhhdmVSZXNvdXJjZUxpa2VcbiAgICAvLyB0byBlbnN1cmUgdGhhdCBvbmx5IHRoZSBiYXJlIG1pbmltdW0gb2YgcHJvcGVydGllcyBoYXZlIHZhbHVlcyB3aGVuIG5vIHByb3BlcnRpZXNcbiAgICAvLyBhcmUgZ2l2ZW4gdG8gYSBMYXVuY2hUZW1wbGF0ZS5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIFRhZ1NwZWNpZmljYXRpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVzb3VyY2VUeXBlOiAnaW5zdGFuY2UnLFxuICAgICAgICAgICAgVGFnczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgS2V5OiAnTmFtZScsXG4gICAgICAgICAgICAgICAgVmFsdWU6ICdEZWZhdWx0L1RlbXBsYXRlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZXNvdXJjZVR5cGU6ICd2b2x1bWUnLFxuICAgICAgICAgICAgVGFnczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgS2V5OiAnTmFtZScsXG4gICAgICAgICAgICAgICAgVmFsdWU6ICdEZWZhdWx0L1RlbXBsYXRlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBUYWdTcGVjaWZpY2F0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVzb3VyY2VUeXBlOiAnbGF1bmNoLXRlbXBsYXRlJyxcbiAgICAgICAgICBUYWdzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEtleTogJ05hbWUnLFxuICAgICAgICAgICAgICBWYWx1ZTogJ0RlZmF1bHQvVGVtcGxhdGUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06Okluc3RhbmNlUHJvZmlsZScsIDApO1xuICAgIGV4cGVjdCgoKSA9PiB7IHRlbXBsYXRlLmdyYW50UHJpbmNpcGFsOyB9KS50b1Rocm93KCk7XG4gICAgZXhwZWN0KCgpID0+IHsgdGVtcGxhdGUuY29ubmVjdGlvbnM7IH0pLnRvVGhyb3coKTtcbiAgICBleHBlY3QodGVtcGxhdGUub3NUeXBlKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgZXhwZWN0KHRlbXBsYXRlLnJvbGUpLnRvQmVVbmRlZmluZWQoKTtcbiAgICBleHBlY3QodGVtcGxhdGUudXNlckRhdGEpLnRvQmVVbmRlZmluZWQoKTtcbiAgfSk7XG5cbiAgdGVzdCgnSW1wb3J0IGZyb20gYXR0cmlidXRlcyB3aXRoIG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHRlbXBsYXRlID0gTGF1bmNoVGVtcGxhdGUuZnJvbUxhdW5jaFRlbXBsYXRlQXR0cmlidXRlcyhzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgbGF1bmNoVGVtcGxhdGVOYW1lOiAnVGVzdE5hbWUnLFxuICAgICAgdmVyc2lvbk51bWJlcjogJ1Rlc3RWZXJzaW9uJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodGVtcGxhdGUubGF1bmNoVGVtcGxhdGVJZCkudG9CZVVuZGVmaW5lZCgpO1xuICAgIGV4cGVjdCh0ZW1wbGF0ZS5sYXVuY2hUZW1wbGF0ZU5hbWUpLnRvQmUoJ1Rlc3ROYW1lJyk7XG4gICAgZXhwZWN0KHRlbXBsYXRlLnZlcnNpb25OdW1iZXIpLnRvQmUoJ1Rlc3RWZXJzaW9uJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ0ltcG9ydCBmcm9tIGF0dHJpYnV0ZXMgd2l0aCBpZCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdGVtcGxhdGUgPSBMYXVuY2hUZW1wbGF0ZS5mcm9tTGF1bmNoVGVtcGxhdGVBdHRyaWJ1dGVzKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBsYXVuY2hUZW1wbGF0ZUlkOiAnVGVzdElkJyxcbiAgICAgIHZlcnNpb25OdW1iZXI6ICdUZXN0VmVyc2lvbicsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHRlbXBsYXRlLmxhdW5jaFRlbXBsYXRlSWQpLnRvQmUoJ1Rlc3RJZCcpO1xuICAgIGV4cGVjdCh0ZW1wbGF0ZS5sYXVuY2hUZW1wbGF0ZU5hbWUpLnRvQmVVbmRlZmluZWQoKTtcbiAgICBleHBlY3QodGVtcGxhdGUudmVyc2lvbk51bWJlcikudG9CZSgnVGVzdFZlcnNpb24nKTtcbiAgfSk7XG5cbiAgdGVzdCgnSW1wb3J0IGZyb20gYXR0cmlidXRlcyBmYWlscyB3aXRoIG5hbWUgYW5kIGlkJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZS5mcm9tTGF1bmNoVGVtcGxhdGVBdHRyaWJ1dGVzKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICAgIGxhdW5jaFRlbXBsYXRlTmFtZTogJ1Rlc3ROYW1lJyxcbiAgICAgICAgbGF1bmNoVGVtcGxhdGVJZDogJ1Rlc3RJZCcsXG4gICAgICAgIHZlcnNpb25OdW1iZXI6ICdUZXN0VmVyc2lvbicsXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ0dpdmVuIG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgbGF1bmNoVGVtcGxhdGVOYW1lOiAnTFROYW1lJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVOYW1lOiAnTFROYW1lJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnR2l2ZW4gaW5zdGFuY2VUeXBlJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IEluc3RhbmNlVHlwZSgndHQudGVzdCcpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgSW5zdGFuY2VUeXBlOiAndHQudGVzdCcsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdHaXZlbiBtYWNoaW5lSW1hZ2UgKExpbnV4KScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdGVtcGxhdGUgPSBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIEltYWdlSWQ6IHtcbiAgICAgICAgICBSZWY6IHN0cmluZ0xpa2UoJ1NzbVBhcmFtZXRlclZhbHVlYXdzc2VydmljZWFtaWFtYXpvbmxpbnV4bGF0ZXN0YW16bmFtaS4qUGFyYW1ldGVyJyksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGV4cGVjdCh0ZW1wbGF0ZS5vc1R5cGUpLnRvQmUoT3BlcmF0aW5nU3lzdGVtVHlwZS5MSU5VWCk7XG4gICAgZXhwZWN0KHRlbXBsYXRlLnVzZXJEYXRhKS50b0JlVW5kZWZpbmVkKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ0dpdmVuIG1hY2hpbmVJbWFnZSAoV2luZG93cyknLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHRlbXBsYXRlID0gbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBXaW5kb3dzSW1hZ2UoV2luZG93c1ZlcnNpb24uV0lORE9XU19TRVJWRVJfMjAxOV9FTkdMSVNIX0ZVTExfQkFTRSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBJbWFnZUlkOiB7XG4gICAgICAgICAgUmVmOiBzdHJpbmdMaWtlKCdTc21QYXJhbWV0ZXJWYWx1ZWF3c3NlcnZpY2VhbWl3aW5kb3dzbGF0ZXN0V2luZG93c1NlcnZlcjIwMTlFbmdsaXNoRnVsbEJhc2UuKlBhcmFtZXRlcicpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBleHBlY3QodGVtcGxhdGUub3NUeXBlKS50b0JlKE9wZXJhdGluZ1N5c3RlbVR5cGUuV0lORE9XUyk7XG4gICAgZXhwZWN0KHRlbXBsYXRlLnVzZXJEYXRhKS50b0JlVW5kZWZpbmVkKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ0dpdmVuIHVzZXJEYXRhJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgdXNlckRhdGEgPSBVc2VyRGF0YS5mb3JMaW51eCgpO1xuICAgIHVzZXJEYXRhLmFkZENvbW1hbmRzKCdlY2hvIFRlc3QnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgdXNlckRhdGEsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBVc2VyRGF0YToge1xuICAgICAgICAgICdGbjo6QmFzZTY0JzogJyMhL2Jpbi9iYXNoXFxuZWNobyBUZXN0JyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgZXhwZWN0KHRlbXBsYXRlLnVzZXJEYXRhKS50b0JlRGVmaW5lZCgpO1xuICB9KTtcblxuICB0ZXN0KCdHaXZlbiByb2xlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnVGVzdFJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdlYzIuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHRlbXBsYXRlID0gbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICByb2xlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OklBTTo6Um9sZScsIDEpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6SW5zdGFuY2VQcm9maWxlJywge1xuICAgICAgUm9sZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlZjogJ1Rlc3RSb2xlNkM5MjcyREYnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIElhbUluc3RhbmNlUHJvZmlsZToge1xuICAgICAgICAgIEFybjogc3RhY2sucmVzb2x2ZSgodGVtcGxhdGUubm9kZS5maW5kQ2hpbGQoJ1Byb2ZpbGUnKSBhcyBDZm5JbnN0YW5jZVByb2ZpbGUpLmdldEF0dCgnQXJuJykpLFxuICAgICAgICB9LFxuICAgICAgICBUYWdTcGVjaWZpY2F0aW9uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlc291cmNlVHlwZTogJ2luc3RhbmNlJyxcbiAgICAgICAgICAgIFRhZ3M6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEtleTogJ05hbWUnLFxuICAgICAgICAgICAgICAgIFZhbHVlOiAnRGVmYXVsdC9UZW1wbGF0ZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVzb3VyY2VUeXBlOiAndm9sdW1lJyxcbiAgICAgICAgICAgIFRhZ3M6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEtleTogJ05hbWUnLFxuICAgICAgICAgICAgICAgIFZhbHVlOiAnRGVmYXVsdC9UZW1wbGF0ZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgVGFnU3BlY2lmaWNhdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlc291cmNlVHlwZTogJ2xhdW5jaC10ZW1wbGF0ZScsXG4gICAgICAgICAgVGFnczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBLZXk6ICdOYW1lJyxcbiAgICAgICAgICAgICAgVmFsdWU6ICdEZWZhdWx0L1RlbXBsYXRlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgZXhwZWN0KHRlbXBsYXRlLnJvbGUpLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KHRlbXBsYXRlLmdyYW50UHJpbmNpcGFsKS50b0JlRGVmaW5lZCgpO1xuICB9KTtcblxuICB0ZXN0KCdHaXZlbiBibG9ja0RldmljZU1hcHBpbmcnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBrbXNLZXkgPSBuZXcgS2V5KHN0YWNrLCAnRWJzS2V5Jyk7XG4gICAgY29uc3QgYmxvY2tEZXZpY2VzOiBCbG9ja0RldmljZVtdID0gW1xuICAgICAge1xuICAgICAgICBkZXZpY2VOYW1lOiAnZWJzJyxcbiAgICAgICAgbWFwcGluZ0VuYWJsZWQ6IHRydWUsXG4gICAgICAgIHZvbHVtZTogQmxvY2tEZXZpY2VWb2x1bWUuZWJzKDE1LCB7XG4gICAgICAgICAgZGVsZXRlT25UZXJtaW5hdGlvbjogdHJ1ZSxcbiAgICAgICAgICBlbmNyeXB0ZWQ6IHRydWUsXG4gICAgICAgICAgdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5JTzEsXG4gICAgICAgICAgaW9wczogNTAwMCxcbiAgICAgICAgfSksXG4gICAgICB9LCB7XG4gICAgICAgIGRldmljZU5hbWU6ICdlYnMtY21rJyxcbiAgICAgICAgbWFwcGluZ0VuYWJsZWQ6IHRydWUsXG4gICAgICAgIHZvbHVtZTogQmxvY2tEZXZpY2VWb2x1bWUuZWJzKDE1LCB7XG4gICAgICAgICAgZGVsZXRlT25UZXJtaW5hdGlvbjogdHJ1ZSxcbiAgICAgICAgICBlbmNyeXB0ZWQ6IHRydWUsXG4gICAgICAgICAga21zS2V5OiBrbXNLZXksXG4gICAgICAgICAgdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5JTzEsXG4gICAgICAgICAgaW9wczogNTAwMCxcbiAgICAgICAgfSksXG4gICAgICB9LCB7XG4gICAgICAgIGRldmljZU5hbWU6ICdlYnMtc25hcHNob3QnLFxuICAgICAgICBtYXBwaW5nRW5hYmxlZDogZmFsc2UsXG4gICAgICAgIHZvbHVtZTogQmxvY2tEZXZpY2VWb2x1bWUuZWJzRnJvbVNuYXBzaG90KCdzbmFwc2hvdC1pZCcsIHtcbiAgICAgICAgICB2b2x1bWVTaXplOiA1MDAsXG4gICAgICAgICAgZGVsZXRlT25UZXJtaW5hdGlvbjogZmFsc2UsXG4gICAgICAgICAgdm9sdW1lVHlwZTogRWJzRGV2aWNlVm9sdW1lVHlwZS5TQzEsXG4gICAgICAgIH0pLFxuICAgICAgfSwge1xuICAgICAgICBkZXZpY2VOYW1lOiAnZXBoZW1lcmFsJyxcbiAgICAgICAgdm9sdW1lOiBCbG9ja0RldmljZVZvbHVtZS5lcGhlbWVyYWwoMCksXG4gICAgICB9LFxuICAgIF07XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBibG9ja0RldmljZXMsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBCbG9ja0RldmljZU1hcHBpbmdzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgRGV2aWNlTmFtZTogJ2VicycsXG4gICAgICAgICAgICBFYnM6IHtcbiAgICAgICAgICAgICAgRGVsZXRlT25UZXJtaW5hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgRW5jcnlwdGVkOiB0cnVlLFxuICAgICAgICAgICAgICBJb3BzOiA1MDAwLFxuICAgICAgICAgICAgICBWb2x1bWVTaXplOiAxNSxcbiAgICAgICAgICAgICAgVm9sdW1lVHlwZTogJ2lvMScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgRGV2aWNlTmFtZTogJ2Vicy1jbWsnLFxuICAgICAgICAgICAgRWJzOiB7XG4gICAgICAgICAgICAgIERlbGV0ZU9uVGVybWluYXRpb246IHRydWUsXG4gICAgICAgICAgICAgIEVuY3J5cHRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgS21zS2V5SWQ6IHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdFYnNLZXlEM0ZFRTU1MScsXG4gICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBJb3BzOiA1MDAwLFxuICAgICAgICAgICAgICBWb2x1bWVTaXplOiAxNSxcbiAgICAgICAgICAgICAgVm9sdW1lVHlwZTogJ2lvMScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgRGV2aWNlTmFtZTogJ2Vicy1zbmFwc2hvdCcsXG4gICAgICAgICAgICBFYnM6IHtcbiAgICAgICAgICAgICAgRGVsZXRlT25UZXJtaW5hdGlvbjogZmFsc2UsXG4gICAgICAgICAgICAgIFNuYXBzaG90SWQ6ICdzbmFwc2hvdC1pZCcsXG4gICAgICAgICAgICAgIFZvbHVtZVNpemU6IDUwMCxcbiAgICAgICAgICAgICAgVm9sdW1lVHlwZTogJ3NjMScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgTm9EZXZpY2U6ICcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgRGV2aWNlTmFtZTogJ2VwaGVtZXJhbCcsXG4gICAgICAgICAgICBWaXJ0dWFsTmFtZTogJ2VwaGVtZXJhbDAnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZmVhdHVyZSBmbGFnIEBhd3MtY2RrL2F3cy1lYzI6bGF1bmNoVGVtcGxhdGVEZWZhdWx0VXNlckRhdGEnLCAoKSA9PiB7XG4gICAgdGVzdCgnR2l2ZW4gbWFjaGluZUltYWdlIChMaW51eCknLCAoKSA9PiB7XG4gICAgICAvLyBXSEVOXG4gICAgICBzdGFjay5ub2RlLnNldENvbnRleHQoY3hhcGkuRUMyX0xBVU5DSF9URU1QTEFURV9ERUZBVUxUX1VTRVJfREFUQSwgdHJ1ZSk7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBBbWF6b25MaW51eEltYWdlKCksXG4gICAgICB9KTtcbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICAgIExhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICAgIEltYWdlSWQ6IHtcbiAgICAgICAgICAgIFJlZjogc3RyaW5nTGlrZSgnU3NtUGFyYW1ldGVyVmFsdWVhd3NzZXJ2aWNlYW1pYW1hem9ubGludXhsYXRlc3RhbXpuYW1pLipQYXJhbWV0ZXInKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBleHBlY3QodGVtcGxhdGUub3NUeXBlKS50b0JlKE9wZXJhdGluZ1N5c3RlbVR5cGUuTElOVVgpO1xuICAgICAgZXhwZWN0KHRlbXBsYXRlLnVzZXJEYXRhKS50b0JlRGVmaW5lZCgpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnR2l2ZW4gbWFjaGluZUltYWdlIChXaW5kb3dzKScsICgpID0+IHtcbiAgICAgIC8vIFdIRU5cbiAgICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChjeGFwaS5FQzJfTEFVTkNIX1RFTVBMQVRFX0RFRkFVTFRfVVNFUl9EQVRBLCB0cnVlKTtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICAgIG1hY2hpbmVJbWFnZTogbmV3IFdpbmRvd3NJbWFnZShXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDE5X0VOR0xJU0hfRlVMTF9CQVNFKSxcbiAgICAgIH0pO1xuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgICAgSW1hZ2VJZDoge1xuICAgICAgICAgICAgUmVmOiBzdHJpbmdMaWtlKCdTc21QYXJhbWV0ZXJWYWx1ZWF3c3NlcnZpY2VhbWl3aW5kb3dzbGF0ZXN0V2luZG93c1NlcnZlcjIwMTlFbmdsaXNoRnVsbEJhc2UuKlBhcmFtZXRlcicpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGV4cGVjdCh0ZW1wbGF0ZS5vc1R5cGUpLnRvQmUoT3BlcmF0aW5nU3lzdGVtVHlwZS5XSU5ET1dTKTtcbiAgICAgIGV4cGVjdCh0ZW1wbGF0ZS51c2VyRGF0YSkudG9CZURlZmluZWQoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdC5lYWNoKFtcbiAgICBbQ3B1Q3JlZGl0cy5TVEFOREFSRCwgJ3N0YW5kYXJkJ10sXG4gICAgW0NwdUNyZWRpdHMuVU5MSU1JVEVELCAndW5saW1pdGVkJ10sXG4gIF0pKCdHaXZlbiBjcHVDcmVkaXRzICVwJywgKGdpdmVuOiBDcHVDcmVkaXRzLCBleHBlY3RlZDogc3RyaW5nKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgY3B1Q3JlZGl0czogZ2l2ZW4sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBDcmVkaXRTcGVjaWZpY2F0aW9uOiB7XG4gICAgICAgICAgQ3B1Q3JlZGl0czogZXhwZWN0ZWQsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0LmVhY2goW1xuICAgIFt0cnVlLCB0cnVlXSxcbiAgICBbZmFsc2UsIGZhbHNlXSxcbiAgXSkoJ0dpdmVuIGRpc2FibGVBcGlUZXJtaW5hdGlvbiAlcCcsIChnaXZlbjogYm9vbGVhbiwgZXhwZWN0ZWQ6IGJvb2xlYW4pID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBkaXNhYmxlQXBpVGVybWluYXRpb246IGdpdmVuLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgRGlzYWJsZUFwaVRlcm1pbmF0aW9uOiBleHBlY3RlZCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChbXG4gICAgW3RydWUsIHRydWVdLFxuICAgIFtmYWxzZSwgZmFsc2VdLFxuICBdKSgnR2l2ZW4gZWJzT3B0aW1pemVkICVwJywgKGdpdmVuOiBib29sZWFuLCBleHBlY3RlZDogYm9vbGVhbikgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIGVic09wdGltaXplZDogZ2l2ZW4sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBFYnNPcHRpbWl6ZWQ6IGV4cGVjdGVkLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdC5lYWNoKFtcbiAgICBbdHJ1ZSwgdHJ1ZV0sXG4gICAgW2ZhbHNlLCBmYWxzZV0sXG4gIF0pKCdHaXZlbiBuaXRyb0VuY2xhdmVFbmFibGVkICVwJywgKGdpdmVuOiBib29sZWFuLCBleHBlY3RlZDogYm9vbGVhbikgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIG5pdHJvRW5jbGF2ZUVuYWJsZWQ6IGdpdmVuLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgRW5jbGF2ZU9wdGlvbnM6IHtcbiAgICAgICAgICBFbmFibGVkOiBleHBlY3RlZCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChbXG4gICAgW0luc3RhbmNlSW5pdGlhdGVkU2h1dGRvd25CZWhhdmlvci5TVE9QLCAnc3RvcCddLFxuICAgIFtJbnN0YW5jZUluaXRpYXRlZFNodXRkb3duQmVoYXZpb3IuVEVSTUlOQVRFLCAndGVybWluYXRlJ10sXG4gIF0pKCdHaXZlbiBpbnN0YW5jZUluaXRpYXRlZFNodXRkb3duQmVoYXZpb3IgJXAnLCAoZ2l2ZW46IEluc3RhbmNlSW5pdGlhdGVkU2h1dGRvd25CZWhhdmlvciwgZXhwZWN0ZWQ6IHN0cmluZykgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIGluc3RhbmNlSW5pdGlhdGVkU2h1dGRvd25CZWhhdmlvcjogZ2l2ZW4sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBJbnN0YW5jZUluaXRpYXRlZFNodXRkb3duQmVoYXZpb3I6IGV4cGVjdGVkLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnR2l2ZW4ga2V5TmFtZScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBrZXlOYW1lOiAnVGVzdEtleW5hbWUnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgS2V5TmFtZTogJ1Rlc3RLZXluYW1lJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChbXG4gICAgW3RydWUsIHRydWVdLFxuICAgIFtmYWxzZSwgZmFsc2VdLFxuICBdKSgnR2l2ZW4gZGV0YWlsZWRNb25pdG9yaW5nICVwJywgKGdpdmVuOiBib29sZWFuLCBleHBlY3RlZDogYm9vbGVhbikgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIGRldGFpbGVkTW9uaXRvcmluZzogZ2l2ZW4sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBNb25pdG9yaW5nOiB7XG4gICAgICAgICAgRW5hYmxlZDogZXhwZWN0ZWQsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdHaXZlbiBzZWN1cml0eUdyb3VwJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IHNnID0gbmV3IFNlY3VyaXR5R3JvdXAoc3RhY2ssICdTRycsIHsgdnBjIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHRlbXBsYXRlID0gbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBzZWN1cml0eUdyb3VwOiBzZyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIFNlY3VyaXR5R3JvdXBJZHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ1NHQURCNTM5MzcnLFxuICAgICAgICAgICAgICAnR3JvdXBJZCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGV4cGVjdCh0ZW1wbGF0ZS5jb25uZWN0aW9ucykudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QodGVtcGxhdGUuY29ubmVjdGlvbnMuc2VjdXJpdHlHcm91cHMpLnRvSGF2ZUxlbmd0aCgxKTtcbiAgICBleHBlY3QodGVtcGxhdGUuY29ubmVjdGlvbnMuc2VjdXJpdHlHcm91cHNbMF0pLnRvQmUoc2cpO1xuICB9KTtcblxuICB0ZXN0KCdBZGRpbmcgdGFncycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHRlbXBsYXRlID0gbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnKTtcblxuICAgIC8vIFdIRU5cbiAgICBUYWdzLm9mKHRlbXBsYXRlKS5hZGQoJ1Rlc3RLZXknLCAnVGVzdFZhbHVlJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBUYWdTcGVjaWZpY2F0aW9uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlc291cmNlVHlwZTogJ2luc3RhbmNlJyxcbiAgICAgICAgICAgIFRhZ3M6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEtleTogJ05hbWUnLFxuICAgICAgICAgICAgICAgIFZhbHVlOiAnRGVmYXVsdC9UZW1wbGF0ZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBLZXk6ICdUZXN0S2V5JyxcbiAgICAgICAgICAgICAgICBWYWx1ZTogJ1Rlc3RWYWx1ZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVzb3VyY2VUeXBlOiAndm9sdW1lJyxcbiAgICAgICAgICAgIFRhZ3M6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEtleTogJ05hbWUnLFxuICAgICAgICAgICAgICAgIFZhbHVlOiAnRGVmYXVsdC9UZW1wbGF0ZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBLZXk6ICdUZXN0S2V5JyxcbiAgICAgICAgICAgICAgICBWYWx1ZTogJ1Rlc3RWYWx1ZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgVGFnU3BlY2lmaWNhdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlc291cmNlVHlwZTogJ2xhdW5jaC10ZW1wbGF0ZScsXG4gICAgICAgICAgVGFnczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBLZXk6ICdOYW1lJyxcbiAgICAgICAgICAgICAgVmFsdWU6ICdEZWZhdWx0L1RlbXBsYXRlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEtleTogJ1Rlc3RLZXknLFxuICAgICAgICAgICAgICBWYWx1ZTogJ1Rlc3RWYWx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdSZXF1aXJlcyBJTURTdjInLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgcmVxdWlyZUltZHN2MjogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIE1ldGFkYXRhT3B0aW9uczoge1xuICAgICAgICAgIEh0dHBUb2tlbnM6ICdyZXF1aXJlZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnTGF1bmNoVGVtcGxhdGUgbWFya2V0T3B0aW9ucycsICgpID0+IHtcbiAgbGV0IGFwcDogQXBwO1xuICBsZXQgc3RhY2s6IFN0YWNrO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGFwcCA9IG5ldyBBcHAoKTtcbiAgICBzdGFjayA9IG5ldyBTdGFjayhhcHApO1xuICB9KTtcblxuICB0ZXN0KCdnaXZlbiBzcG90T3B0aW9ucycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBzcG90T3B0aW9uczoge30sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBJbnN0YW5jZU1hcmtldE9wdGlvbnM6IHtcbiAgICAgICAgICBNYXJrZXRUeXBlOiAnc3BvdCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0LmVhY2goW1xuICAgIFswLCAxXSxcbiAgICBbMSwgMF0sXG4gICAgWzYsIDBdLFxuICAgIFs3LCAxXSxcbiAgXSkoJ2ZvciByYW5nZSBkdXJhdGlvbiBlcnJvcnM6ICVwJywgKGR1cmF0aW9uOiBudW1iZXIsIGV4cGVjdGVkRXJyb3JzOiBudW1iZXIpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBzcG90T3B0aW9uczoge1xuICAgICAgICBibG9ja0R1cmF0aW9uOiBEdXJhdGlvbi5ob3VycyhkdXJhdGlvbiksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGVycm9ycyA9IEFubm90YXRpb25zLmZyb21TdGFjayhzdGFjaykuZmluZEVycm9yKCcvRGVmYXVsdC9UZW1wbGF0ZScsIE1hdGNoLmFueVZhbHVlKCkpO1xuICAgIGV4cGVjdChlcnJvcnMpLnRvSGF2ZUxlbmd0aChleHBlY3RlZEVycm9ycyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZvciBiYWQgZHVyYXRpb24nLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgICBzcG90T3B0aW9uczoge1xuICAgICAgICAgIC8vIER1cmF0aW9uIG11c3QgYmUgYW4gaW50ZWdyYWwgbnVtYmVyIG9mIGhvdXJzLlxuICAgICAgICAgIGJsb2NrRHVyYXRpb246IER1cmF0aW9uLm1pbnV0ZXMoNjEpLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygpO1xuICB9KTtcblxuICB0ZXN0KCdnaXZlbiBibG9ja0R1cmF0aW9uJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIHNwb3RPcHRpb25zOiB7XG4gICAgICAgIGJsb2NrRHVyYXRpb246IER1cmF0aW9uLmhvdXJzKDEpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIEluc3RhbmNlTWFya2V0T3B0aW9uczoge1xuICAgICAgICAgIE1hcmtldFR5cGU6ICdzcG90JyxcbiAgICAgICAgICBTcG90T3B0aW9uczoge1xuICAgICAgICAgICAgQmxvY2tEdXJhdGlvbk1pbnV0ZXM6IDYwLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0LmVhY2goW1xuICAgIFtTcG90SW5zdGFuY2VJbnRlcnJ1cHRpb24uU1RPUCwgJ3N0b3AnXSxcbiAgICBbU3BvdEluc3RhbmNlSW50ZXJydXB0aW9uLlRFUk1JTkFURSwgJ3Rlcm1pbmF0ZSddLFxuICAgIFtTcG90SW5zdGFuY2VJbnRlcnJ1cHRpb24uSElCRVJOQVRFLCAnaGliZXJuYXRlJ10sXG4gIF0pKCdnaXZlbiBpbnRlcnJ1cHRpb25CZWhhdmlvciAlcCcsIChnaXZlbjogU3BvdEluc3RhbmNlSW50ZXJydXB0aW9uLCBleHBlY3RlZDogc3RyaW5nKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgc3BvdE9wdGlvbnM6IHtcbiAgICAgICAgaW50ZXJydXB0aW9uQmVoYXZpb3I6IGdpdmVuLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIEluc3RhbmNlTWFya2V0T3B0aW9uczoge1xuICAgICAgICAgIE1hcmtldFR5cGU6ICdzcG90JyxcbiAgICAgICAgICBTcG90T3B0aW9uczoge1xuICAgICAgICAgICAgSW5zdGFuY2VJbnRlcnJ1cHRpb25CZWhhdmlvcjogZXhwZWN0ZWQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChbXG4gICAgWzAuMDAxLCAnMC4wMDEnXSxcbiAgICBbMSwgJzEnXSxcbiAgICBbMi41LCAnMi41J10sXG4gIF0pKCdnaXZlbiBtYXhQcmljZSAlcCcsIChnaXZlbjogbnVtYmVyLCBleHBlY3RlZDogc3RyaW5nKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgc3BvdE9wdGlvbnM6IHtcbiAgICAgICAgbWF4UHJpY2U6IGdpdmVuLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIEluc3RhbmNlTWFya2V0T3B0aW9uczoge1xuICAgICAgICAgIE1hcmtldFR5cGU6ICdzcG90JyxcbiAgICAgICAgICBTcG90T3B0aW9uczoge1xuICAgICAgICAgICAgTWF4UHJpY2U6IGV4cGVjdGVkLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0LmVhY2goW1xuICAgIFtTcG90UmVxdWVzdFR5cGUuT05FX1RJTUUsICdvbmUtdGltZSddLFxuICAgIFtTcG90UmVxdWVzdFR5cGUuUEVSU0lTVEVOVCwgJ3BlcnNpc3RlbnQnXSxcbiAgXSkoJ2dpdmVuIHJlcXVlc3RUeXBlICVwJywgKGdpdmVuOiBTcG90UmVxdWVzdFR5cGUsIGV4cGVjdGVkOiBzdHJpbmcpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBzcG90T3B0aW9uczoge1xuICAgICAgICByZXF1ZXN0VHlwZTogZ2l2ZW4sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgSW5zdGFuY2VNYXJrZXRPcHRpb25zOiB7XG4gICAgICAgICAgTWFya2V0VHlwZTogJ3Nwb3QnLFxuICAgICAgICAgIFNwb3RPcHRpb25zOiB7XG4gICAgICAgICAgICBTcG90SW5zdGFuY2VUeXBlOiBleHBlY3RlZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZ2l2ZW4gdmFsaWRVbnRpbCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBzcG90T3B0aW9uczoge1xuICAgICAgICB2YWxpZFVudGlsOiBFeHBpcmF0aW9uLmF0VGltZXN0YW1wKDApLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIEluc3RhbmNlTWFya2V0T3B0aW9uczoge1xuICAgICAgICAgIE1hcmtldFR5cGU6ICdzcG90JyxcbiAgICAgICAgICBTcG90T3B0aW9uczoge1xuICAgICAgICAgICAgVmFsaWRVbnRpbDogJ1RodSwgMDEgSmFuIDE5NzAgMDA6MDA6MDAgR01UJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ0xhdW5jaFRlbXBsYXRlIG1ldGFkYXRhT3B0aW9ucycsICgpID0+IHtcbiAgbGV0IGFwcDogQXBwO1xuICBsZXQgc3RhY2s6IFN0YWNrO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGFwcCA9IG5ldyBBcHAoKTtcbiAgICBzdGFjayA9IG5ldyBTdGFjayhhcHApO1xuICB9KTtcblxuICB0ZXN0LmVhY2goW1xuICAgIFt0cnVlLCAnZW5hYmxlZCddLFxuICAgIFtmYWxzZSwgJ2Rpc2FibGVkJ10sXG4gIF0pKCdnaXZlbiBodHRwRW5kcG9pbnQgJXAnLCAoZ2l2ZW46IGJvb2xlYW4sIGV4cGVjdGVkOiBzdHJpbmcpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBodHRwRW5kcG9pbnQ6IGdpdmVuLFxuICAgIH0pO1xuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIE1ldGFkYXRhT3B0aW9uczoge1xuICAgICAgICAgIEh0dHBFbmRwb2ludDogZXhwZWN0ZWQsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0LmVhY2goW1xuICAgIFt0cnVlLCAnZW5hYmxlZCddLFxuICAgIFtmYWxzZSwgJ2Rpc2FibGVkJ10sXG4gIF0pKCdnaXZlbiBodHRwUHJvdG9jb2xJcHY2ICVwJywgKGdpdmVuOiBib29sZWFuLCBleHBlY3RlZDogc3RyaW5nKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgaHR0cFByb3RvY29sSXB2NjogZ2l2ZW4sXG4gICAgfSk7XG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgTWV0YWRhdGFPcHRpb25zOiB7XG4gICAgICAgICAgSHR0cFByb3RvY29sSXB2NjogZXhwZWN0ZWQsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0LmVhY2goW1xuICAgIFsxLCAxXSxcbiAgICBbMiwgMl0sXG4gIF0pKCdnaXZlbiBodHRwUHV0UmVzcG9uc2VIb3BMaW1pdCAlcCcsIChnaXZlbjogbnVtYmVyLCBleHBlY3RlZDogbnVtYmVyKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgaHR0cFB1dFJlc3BvbnNlSG9wTGltaXQ6IGdpdmVuLFxuICAgIH0pO1xuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIE1ldGFkYXRhT3B0aW9uczoge1xuICAgICAgICAgIEh0dHBQdXRSZXNwb25zZUhvcExpbWl0OiBleHBlY3RlZCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChbXG4gICAgW0xhdW5jaFRlbXBsYXRlSHR0cFRva2Vucy5PUFRJT05BTCwgJ29wdGlvbmFsJ10sXG4gICAgW0xhdW5jaFRlbXBsYXRlSHR0cFRva2Vucy5SRVFVSVJFRCwgJ3JlcXVpcmVkJ10sXG4gIF0pKCdnaXZlbiBodHRwVG9rZW5zICVwJywgKGdpdmVuOiBMYXVuY2hUZW1wbGF0ZUh0dHBUb2tlbnMsIGV4cGVjdGVkOiBzdHJpbmcpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBodHRwVG9rZW5zOiBnaXZlbixcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBNZXRhZGF0YU9wdGlvbnM6IHtcbiAgICAgICAgICBIdHRwVG9rZW5zOiBleHBlY3RlZCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChbXG4gICAgW3RydWUsICdlbmFibGVkJ10sXG4gICAgW2ZhbHNlLCAnZGlzYWJsZWQnXSxcbiAgXSkoJ2dpdmVuIGluc3RhbmNlTWV0YWRhdGFUYWdzICVwJywgKGdpdmVuOiBib29sZWFuLCBleHBlY3RlZDogc3RyaW5nKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgaW5zdGFuY2VNZXRhZGF0YVRhZ3M6IGdpdmVuLFxuICAgIH0pO1xuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIE1ldGFkYXRhT3B0aW9uczoge1xuICAgICAgICAgIEluc3RhbmNlTWV0YWRhdGFUYWdzOiBleHBlY3RlZCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChbXG4gICAgWzAsIDFdLFxuICAgIFstMSwgMV0sXG4gICAgWzEsIDBdLFxuICAgIFs2NCwgMF0sXG4gICAgWzY1LCAxXSxcbiAgXSkoJ2dpdmVuIGluc3RhbmNlTWV0YWRhdGFUYWdzICVwJywgKGdpdmVuOiBudW1iZXIsIGV4cGVjdGVkOiBudW1iZXIpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBodHRwUHV0UmVzcG9uc2VIb3BMaW1pdDogZ2l2ZW4sXG4gICAgfSk7XG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGVycm9ycyA9IEFubm90YXRpb25zLmZyb21TdGFjayhzdGFjaykuZmluZEVycm9yKCcvRGVmYXVsdC9UZW1wbGF0ZScsIE1hdGNoLmFueVZhbHVlKCkpO1xuICAgIGV4cGVjdChlcnJvcnMpLnRvSGF2ZUxlbmd0aChleHBlY3RlZCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93IHdoZW4gcmVxdWlyZUltZHN2MiBpcyB0cnVlIGFuZCBodHRwVG9rZW5zIGlzIE9QVElPTkFMJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIHJlcXVpcmVJbWRzdjI6IHRydWUsXG4gICAgICBodHRwVG9rZW5zOiBMYXVuY2hUZW1wbGF0ZUh0dHBUb2tlbnMuT1BUSU9OQUwsXG4gICAgfSk7XG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGVycm9ycyA9IEFubm90YXRpb25zLmZyb21TdGFjayhzdGFjaykuZmluZEVycm9yKCcvRGVmYXVsdC9UZW1wbGF0ZScsIE1hdGNoLmFueVZhbHVlKCkpO1xuICAgIGV4cGVjdChlcnJvcnNbMF0uZW50cnkuZGF0YSkudG9NYXRjaCgvaHR0cFRva2VucyBtdXN0IGJlIHJlcXVpcmVkIHdoZW4gcmVxdWlyZUltZHN2MiBpcyB0cnVlLyk7XG4gIH0pO1xuICB0ZXN0KCdodHRwVG9rZW5zIFJFUVVJUkVEIGlzIGFsbG93ZWQgd2hlbiByZXF1aXJlSW1kc3YyIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgcmVxdWlyZUltZHN2MjogdHJ1ZSxcbiAgICAgIGh0dHBUb2tlbnM6IExhdW5jaFRlbXBsYXRlSHR0cFRva2Vucy5SRVFVSVJFRCxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBNZXRhZGF0YU9wdGlvbnM6IHtcbiAgICAgICAgICBIdHRwVG9rZW5zOiAncmVxdWlyZWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==