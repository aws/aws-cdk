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
                    Ref: (0, util_1.stringLike)('SsmParameterValueawsserviceamiamazonlinuxlatestamznami.*Parameter'),
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
                    Ref: (0, util_1.stringLike)('SsmParameterValueawsserviceamiwindowslatestWindowsServer2019EnglishFullBase.*Parameter'),
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
                        Ref: (0, util_1.stringLike)('SsmParameterValueawsserviceamiamazonlinuxlatestamznami.*Parameter'),
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
                        Ref: (0, util_1.stringLike)('SsmParameterValueawsserviceamiwindowslatestWindowsServer2019EnglishFullBase.*Parameter'),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF1bmNoLXRlbXBsYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYXVuY2gtdGVtcGxhdGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFtRTtBQUNuRSw4Q0FJMEI7QUFDMUIsOENBQXVDO0FBQ3ZDLHdDQU11QjtBQUN2Qix5Q0FBeUM7QUFDekMsaUNBQW9DO0FBQ3BDLGdDQWtCZ0I7QUFFaEIsdUNBQXVDO0FBRXZDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7SUFDOUIsSUFBSSxHQUFRLENBQUM7SUFDYixJQUFJLEtBQVksQ0FBQztJQUVqQixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7UUFDaEIsS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7UUFDdkIsT0FBTztRQUNQLE1BQU0sUUFBUSxHQUFHLElBQUksb0JBQWMsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFdkQsT0FBTztRQUNQLGtGQUFrRjtRQUNsRixvRkFBb0Y7UUFDcEYsaUNBQWlDO1FBQ2pDLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDBCQUEwQixFQUFFO1lBQzFFLGtCQUFrQixFQUFFO2dCQUNsQixpQkFBaUIsRUFBRTtvQkFDakI7d0JBQ0UsWUFBWSxFQUFFLFVBQVU7d0JBQ3hCLElBQUksRUFBRTs0QkFDSjtnQ0FDRSxHQUFHLEVBQUUsTUFBTTtnQ0FDWCxLQUFLLEVBQUUsa0JBQWtCOzZCQUMxQjt5QkFDRjtxQkFDRjtvQkFDRDt3QkFDRSxZQUFZLEVBQUUsUUFBUTt3QkFDdEIsSUFBSSxFQUFFOzRCQUNKO2dDQUNFLEdBQUcsRUFBRSxNQUFNO2dDQUNYLEtBQUssRUFBRSxrQkFB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InNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFubm90YXRpb25zLCBUZW1wbGF0ZSwgTWF0Y2ggfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7XG4gIENmbkluc3RhbmNlUHJvZmlsZSxcbiAgUm9sZSxcbiAgU2VydmljZVByaW5jaXBhbCxcbn0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBLZXkgfSBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCB7XG4gIEFwcCxcbiAgRHVyYXRpb24sXG4gIEV4cGlyYXRpb24sXG4gIFN0YWNrLFxuICBUYWdzLFxufSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBzdHJpbmdMaWtlIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7XG4gIEFtYXpvbkxpbnV4SW1hZ2UsXG4gIEJsb2NrRGV2aWNlLFxuICBCbG9ja0RldmljZVZvbHVtZSxcbiAgQ3B1Q3JlZGl0cyxcbiAgRWJzRGV2aWNlVm9sdW1lVHlwZSxcbiAgSW5zdGFuY2VJbml0aWF0ZWRTaHV0ZG93bkJlaGF2aW9yLFxuICBJbnN0YW5jZVR5cGUsXG4gIExhdW5jaFRlbXBsYXRlLFxuICBMYXVuY2hUZW1wbGF0ZUh0dHBUb2tlbnMsXG4gIE9wZXJhdGluZ1N5c3RlbVR5cGUsXG4gIFNlY3VyaXR5R3JvdXAsXG4gIFNwb3RJbnN0YW5jZUludGVycnVwdGlvbixcbiAgU3BvdFJlcXVlc3RUeXBlLFxuICBVc2VyRGF0YSxcbiAgVnBjLFxuICBXaW5kb3dzSW1hZ2UsXG4gIFdpbmRvd3NWZXJzaW9uLFxufSBmcm9tICcuLi9saWInO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBqZXN0L2V4cGVjdC1leHBlY3QgKi9cblxuZGVzY3JpYmUoJ0xhdW5jaFRlbXBsYXRlJywgKCkgPT4ge1xuICBsZXQgYXBwOiBBcHA7XG4gIGxldCBzdGFjazogU3RhY2s7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXBwID0gbmV3IEFwcCgpO1xuICAgIHN0YWNrID0gbmV3IFN0YWNrKGFwcCk7XG4gIH0pO1xuXG4gIHRlc3QoJ0VtcHR5IHByb3BzJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgLy8gTm90ZTogVGhlIGZvbGxvd2luZyBpcyBpbnRlbnRpb25hbGx5IGEgaGF2ZVJlc291cmNlIGluc3RlYWQgb2YgaGF2ZVJlc291cmNlTGlrZVxuICAgIC8vIHRvIGVuc3VyZSB0aGF0IG9ubHkgdGhlIGJhcmUgbWluaW11bSBvZiBwcm9wZXJ0aWVzIGhhdmUgdmFsdWVzIHdoZW4gbm8gcHJvcGVydGllc1xuICAgIC8vIGFyZSBnaXZlbiB0byBhIExhdW5jaFRlbXBsYXRlLlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgVGFnU3BlY2lmaWNhdGlvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZXNvdXJjZVR5cGU6ICdpbnN0YW5jZScsXG4gICAgICAgICAgICBUYWdzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBLZXk6ICdOYW1lJyxcbiAgICAgICAgICAgICAgICBWYWx1ZTogJ0RlZmF1bHQvVGVtcGxhdGUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlc291cmNlVHlwZTogJ3ZvbHVtZScsXG4gICAgICAgICAgICBUYWdzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBLZXk6ICdOYW1lJyxcbiAgICAgICAgICAgICAgICBWYWx1ZTogJ0RlZmF1bHQvVGVtcGxhdGUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIFRhZ1NwZWNpZmljYXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZXNvdXJjZVR5cGU6ICdsYXVuY2gtdGVtcGxhdGUnLFxuICAgICAgICAgIFRhZ3M6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgS2V5OiAnTmFtZScsXG4gICAgICAgICAgICAgIFZhbHVlOiAnRGVmYXVsdC9UZW1wbGF0ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OklBTTo6SW5zdGFuY2VQcm9maWxlJywgMCk7XG4gICAgZXhwZWN0KCgpID0+IHsgdGVtcGxhdGUuZ3JhbnRQcmluY2lwYWw7IH0pLnRvVGhyb3coKTtcbiAgICBleHBlY3QoKCkgPT4geyB0ZW1wbGF0ZS5jb25uZWN0aW9uczsgfSkudG9UaHJvdygpO1xuICAgIGV4cGVjdCh0ZW1wbGF0ZS5vc1R5cGUpLnRvQmVVbmRlZmluZWQoKTtcbiAgICBleHBlY3QodGVtcGxhdGUucm9sZSkudG9CZVVuZGVmaW5lZCgpO1xuICAgIGV4cGVjdCh0ZW1wbGF0ZS51c2VyRGF0YSkudG9CZVVuZGVmaW5lZCgpO1xuICB9KTtcblxuICB0ZXN0KCdJbXBvcnQgZnJvbSBhdHRyaWJ1dGVzIHdpdGggbmFtZScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdGVtcGxhdGUgPSBMYXVuY2hUZW1wbGF0ZS5mcm9tTGF1bmNoVGVtcGxhdGVBdHRyaWJ1dGVzKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBsYXVuY2hUZW1wbGF0ZU5hbWU6ICdUZXN0TmFtZScsXG4gICAgICB2ZXJzaW9uTnVtYmVyOiAnVGVzdFZlcnNpb24nLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh0ZW1wbGF0ZS5sYXVuY2hUZW1wbGF0ZUlkKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgZXhwZWN0KHRlbXBsYXRlLmxhdW5jaFRlbXBsYXRlTmFtZSkudG9CZSgnVGVzdE5hbWUnKTtcbiAgICBleHBlY3QodGVtcGxhdGUudmVyc2lvbk51bWJlcikudG9CZSgnVGVzdFZlcnNpb24nKTtcbiAgfSk7XG5cbiAgdGVzdCgnSW1wb3J0IGZyb20gYXR0cmlidXRlcyB3aXRoIGlkJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IExhdW5jaFRlbXBsYXRlLmZyb21MYXVuY2hUZW1wbGF0ZUF0dHJpYnV0ZXMoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIGxhdW5jaFRlbXBsYXRlSWQ6ICdUZXN0SWQnLFxuICAgICAgdmVyc2lvbk51bWJlcjogJ1Rlc3RWZXJzaW9uJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodGVtcGxhdGUubGF1bmNoVGVtcGxhdGVJZCkudG9CZSgnVGVzdElkJyk7XG4gICAgZXhwZWN0KHRlbXBsYXRlLmxhdW5jaFRlbXBsYXRlTmFtZSkudG9CZVVuZGVmaW5lZCgpO1xuICAgIGV4cGVjdCh0ZW1wbGF0ZS52ZXJzaW9uTnVtYmVyKS50b0JlKCdUZXN0VmVyc2lvbicpO1xuICB9KTtcblxuICB0ZXN0KCdJbXBvcnQgZnJvbSBhdHRyaWJ1dGVzIGZhaWxzIHdpdGggbmFtZSBhbmQgaWQnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIExhdW5jaFRlbXBsYXRlLmZyb21MYXVuY2hUZW1wbGF0ZUF0dHJpYnV0ZXMoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgICAgbGF1bmNoVGVtcGxhdGVOYW1lOiAnVGVzdE5hbWUnLFxuICAgICAgICBsYXVuY2hUZW1wbGF0ZUlkOiAnVGVzdElkJyxcbiAgICAgICAgdmVyc2lvbk51bWJlcjogJ1Rlc3RWZXJzaW9uJyxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgdGVzdCgnR2l2ZW4gbmFtZScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBsYXVuY2hUZW1wbGF0ZU5hbWU6ICdMVE5hbWUnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZU5hbWU6ICdMVE5hbWUnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdHaXZlbiBpbnN0YW5jZVR5cGUnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgSW5zdGFuY2VUeXBlKCd0dC50ZXN0JyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBJbnN0YW5jZVR5cGU6ICd0dC50ZXN0JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0dpdmVuIG1hY2hpbmVJbWFnZSAoTGludXgpJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgbWFjaGluZUltYWdlOiBuZXcgQW1hem9uTGludXhJbWFnZSgpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgSW1hZ2VJZDoge1xuICAgICAgICAgIFJlZjogc3RyaW5nTGlrZSgnU3NtUGFyYW1ldGVyVmFsdWVhd3NzZXJ2aWNlYW1pYW1hem9ubGludXhsYXRlc3RhbXpuYW1pLipQYXJhbWV0ZXInKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgZXhwZWN0KHRlbXBsYXRlLm9zVHlwZSkudG9CZShPcGVyYXRpbmdTeXN0ZW1UeXBlLkxJTlVYKTtcbiAgICBleHBlY3QodGVtcGxhdGUudXNlckRhdGEpLnRvQmVVbmRlZmluZWQoKTtcbiAgfSk7XG5cbiAgdGVzdCgnR2l2ZW4gbWFjaGluZUltYWdlIChXaW5kb3dzKScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdGVtcGxhdGUgPSBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IFdpbmRvd3NJbWFnZShXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDE5X0VOR0xJU0hfRlVMTF9CQVNFKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIEltYWdlSWQ6IHtcbiAgICAgICAgICBSZWY6IHN0cmluZ0xpa2UoJ1NzbVBhcmFtZXRlclZhbHVlYXdzc2VydmljZWFtaXdpbmRvd3NsYXRlc3RXaW5kb3dzU2VydmVyMjAxOUVuZ2xpc2hGdWxsQmFzZS4qUGFyYW1ldGVyJyksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGV4cGVjdCh0ZW1wbGF0ZS5vc1R5cGUpLnRvQmUoT3BlcmF0aW5nU3lzdGVtVHlwZS5XSU5ET1dTKTtcbiAgICBleHBlY3QodGVtcGxhdGUudXNlckRhdGEpLnRvQmVVbmRlZmluZWQoKTtcbiAgfSk7XG5cbiAgdGVzdCgnR2l2ZW4gdXNlckRhdGEnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB1c2VyRGF0YSA9IFVzZXJEYXRhLmZvckxpbnV4KCk7XG4gICAgdXNlckRhdGEuYWRkQ29tbWFuZHMoJ2VjaG8gVGVzdCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHRlbXBsYXRlID0gbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICB1c2VyRGF0YSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIFVzZXJEYXRhOiB7XG4gICAgICAgICAgJ0ZuOjpCYXNlNjQnOiAnIyEvYmluL2Jhc2hcXG5lY2hvIFRlc3QnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBleHBlY3QodGVtcGxhdGUudXNlckRhdGEpLnRvQmVEZWZpbmVkKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ0dpdmVuIHJvbGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCByb2xlID0gbmV3IFJvbGUoc3RhY2ssICdUZXN0Um9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2VjMi5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdGVtcGxhdGUgPSBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIHJvbGUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpSb2xlJywgMSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpJbnN0YW5jZVByb2ZpbGUnLCB7XG4gICAgICBSb2xlczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnVGVzdFJvbGU2QzkyNzJERicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgSWFtSW5zdGFuY2VQcm9maWxlOiB7XG4gICAgICAgICAgQXJuOiBzdGFjay5yZXNvbHZlKCh0ZW1wbGF0ZS5ub2RlLmZpbmRDaGlsZCgnUHJvZmlsZScpIGFzIENmbkluc3RhbmNlUHJvZmlsZSkuZ2V0QXR0KCdBcm4nKSksXG4gICAgICAgIH0sXG4gICAgICAgIFRhZ1NwZWNpZmljYXRpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVzb3VyY2VUeXBlOiAnaW5zdGFuY2UnLFxuICAgICAgICAgICAgVGFnczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgS2V5OiAnTmFtZScsXG4gICAgICAgICAgICAgICAgVmFsdWU6ICdEZWZhdWx0L1RlbXBsYXRlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZXNvdXJjZVR5cGU6ICd2b2x1bWUnLFxuICAgICAgICAgICAgVGFnczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgS2V5OiAnTmFtZScsXG4gICAgICAgICAgICAgICAgVmFsdWU6ICdEZWZhdWx0L1RlbXBsYXRlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBUYWdTcGVjaWZpY2F0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVzb3VyY2VUeXBlOiAnbGF1bmNoLXRlbXBsYXRlJyxcbiAgICAgICAgICBUYWdzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEtleTogJ05hbWUnLFxuICAgICAgICAgICAgICBWYWx1ZTogJ0RlZmF1bHQvVGVtcGxhdGUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBleHBlY3QodGVtcGxhdGUucm9sZSkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QodGVtcGxhdGUuZ3JhbnRQcmluY2lwYWwpLnRvQmVEZWZpbmVkKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ0dpdmVuIGJsb2NrRGV2aWNlTWFwcGluZycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGttc0tleSA9IG5ldyBLZXkoc3RhY2ssICdFYnNLZXknKTtcbiAgICBjb25zdCBibG9ja0RldmljZXM6IEJsb2NrRGV2aWNlW10gPSBbXG4gICAgICB7XG4gICAgICAgIGRldmljZU5hbWU6ICdlYnMnLFxuICAgICAgICBtYXBwaW5nRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgdm9sdW1lOiBCbG9ja0RldmljZVZvbHVtZS5lYnMoMTUsIHtcbiAgICAgICAgICBkZWxldGVPblRlcm1pbmF0aW9uOiB0cnVlLFxuICAgICAgICAgIGVuY3J5cHRlZDogdHJ1ZSxcbiAgICAgICAgICB2b2x1bWVUeXBlOiBFYnNEZXZpY2VWb2x1bWVUeXBlLklPMSxcbiAgICAgICAgICBpb3BzOiA1MDAwLFxuICAgICAgICB9KSxcbiAgICAgIH0sIHtcbiAgICAgICAgZGV2aWNlTmFtZTogJ2Vicy1jbWsnLFxuICAgICAgICBtYXBwaW5nRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgdm9sdW1lOiBCbG9ja0RldmljZVZvbHVtZS5lYnMoMTUsIHtcbiAgICAgICAgICBkZWxldGVPblRlcm1pbmF0aW9uOiB0cnVlLFxuICAgICAgICAgIGVuY3J5cHRlZDogdHJ1ZSxcbiAgICAgICAgICBrbXNLZXk6IGttc0tleSxcbiAgICAgICAgICB2b2x1bWVUeXBlOiBFYnNEZXZpY2VWb2x1bWVUeXBlLklPMSxcbiAgICAgICAgICBpb3BzOiA1MDAwLFxuICAgICAgICB9KSxcbiAgICAgIH0sIHtcbiAgICAgICAgZGV2aWNlTmFtZTogJ2Vicy1zbmFwc2hvdCcsXG4gICAgICAgIG1hcHBpbmdFbmFibGVkOiBmYWxzZSxcbiAgICAgICAgdm9sdW1lOiBCbG9ja0RldmljZVZvbHVtZS5lYnNGcm9tU25hcHNob3QoJ3NuYXBzaG90LWlkJywge1xuICAgICAgICAgIHZvbHVtZVNpemU6IDUwMCxcbiAgICAgICAgICBkZWxldGVPblRlcm1pbmF0aW9uOiBmYWxzZSxcbiAgICAgICAgICB2b2x1bWVUeXBlOiBFYnNEZXZpY2VWb2x1bWVUeXBlLlNDMSxcbiAgICAgICAgfSksXG4gICAgICB9LCB7XG4gICAgICAgIGRldmljZU5hbWU6ICdlcGhlbWVyYWwnLFxuICAgICAgICB2b2x1bWU6IEJsb2NrRGV2aWNlVm9sdW1lLmVwaGVtZXJhbCgwKSxcbiAgICAgIH0sXG4gICAgXTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIGJsb2NrRGV2aWNlcyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIEJsb2NrRGV2aWNlTWFwcGluZ3M6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBEZXZpY2VOYW1lOiAnZWJzJyxcbiAgICAgICAgICAgIEViczoge1xuICAgICAgICAgICAgICBEZWxldGVPblRlcm1pbmF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgICBFbmNyeXB0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgIElvcHM6IDUwMDAsXG4gICAgICAgICAgICAgIFZvbHVtZVNpemU6IDE1LFxuICAgICAgICAgICAgICBWb2x1bWVUeXBlOiAnaW8xJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBEZXZpY2VOYW1lOiAnZWJzLWNtaycsXG4gICAgICAgICAgICBFYnM6IHtcbiAgICAgICAgICAgICAgRGVsZXRlT25UZXJtaW5hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgRW5jcnlwdGVkOiB0cnVlLFxuICAgICAgICAgICAgICBLbXNLZXlJZDoge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ0Vic0tleUQzRkVFNTUxJyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIElvcHM6IDUwMDAsXG4gICAgICAgICAgICAgIFZvbHVtZVNpemU6IDE1LFxuICAgICAgICAgICAgICBWb2x1bWVUeXBlOiAnaW8xJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBEZXZpY2VOYW1lOiAnZWJzLXNuYXBzaG90JyxcbiAgICAgICAgICAgIEViczoge1xuICAgICAgICAgICAgICBEZWxldGVPblRlcm1pbmF0aW9uOiBmYWxzZSxcbiAgICAgICAgICAgICAgU25hcHNob3RJZDogJ3NuYXBzaG90LWlkJyxcbiAgICAgICAgICAgICAgVm9sdW1lU2l6ZTogNTAwLFxuICAgICAgICAgICAgICBWb2x1bWVUeXBlOiAnc2MxJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBOb0RldmljZTogJycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBEZXZpY2VOYW1lOiAnZXBoZW1lcmFsJyxcbiAgICAgICAgICAgIFZpcnR1YWxOYW1lOiAnZXBoZW1lcmFsMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdmZWF0dXJlIGZsYWcgQGF3cy1jZGsvYXdzLWVjMjpsYXVuY2hUZW1wbGF0ZURlZmF1bHRVc2VyRGF0YScsICgpID0+IHtcbiAgICB0ZXN0KCdHaXZlbiBtYWNoaW5lSW1hZ2UgKExpbnV4KScsICgpID0+IHtcbiAgICAgIC8vIFdIRU5cbiAgICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChjeGFwaS5FQzJfTEFVTkNIX1RFTVBMQVRFX0RFRkFVTFRfVVNFUl9EQVRBLCB0cnVlKTtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIH0pO1xuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgICAgSW1hZ2VJZDoge1xuICAgICAgICAgICAgUmVmOiBzdHJpbmdMaWtlKCdTc21QYXJhbWV0ZXJWYWx1ZWF3c3NlcnZpY2VhbWlhbWF6b25saW51eGxhdGVzdGFtem5hbWkuKlBhcmFtZXRlcicpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGV4cGVjdCh0ZW1wbGF0ZS5vc1R5cGUpLnRvQmUoT3BlcmF0aW5nU3lzdGVtVHlwZS5MSU5VWCk7XG4gICAgICBleHBlY3QodGVtcGxhdGUudXNlckRhdGEpLnRvQmVEZWZpbmVkKCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdHaXZlbiBtYWNoaW5lSW1hZ2UgKFdpbmRvd3MpJywgKCkgPT4ge1xuICAgICAgLy8gV0hFTlxuICAgICAgc3RhY2subm9kZS5zZXRDb250ZXh0KGN4YXBpLkVDMl9MQVVOQ0hfVEVNUExBVEVfREVGQVVMVF9VU0VSX0RBVEEsIHRydWUpO1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgICAgbWFjaGluZUltYWdlOiBuZXcgV2luZG93c0ltYWdlKFdpbmRvd3NWZXJzaW9uLldJTkRPV1NfU0VSVkVSXzIwMTlfRU5HTElTSF9GVUxMX0JBU0UpLFxuICAgICAgfSk7XG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgICBJbWFnZUlkOiB7XG4gICAgICAgICAgICBSZWY6IHN0cmluZ0xpa2UoJ1NzbVBhcmFtZXRlclZhbHVlYXdzc2VydmljZWFtaXdpbmRvd3NsYXRlc3RXaW5kb3dzU2VydmVyMjAxOUVuZ2xpc2hGdWxsQmFzZS4qUGFyYW1ldGVyJyksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KHRlbXBsYXRlLm9zVHlwZSkudG9CZShPcGVyYXRpbmdTeXN0ZW1UeXBlLldJTkRPV1MpO1xuICAgICAgZXhwZWN0KHRlbXBsYXRlLnVzZXJEYXRhKS50b0JlRGVmaW5lZCgpO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0LmVhY2goW1xuICAgIFtDcHVDcmVkaXRzLlNUQU5EQVJELCAnc3RhbmRhcmQnXSxcbiAgICBbQ3B1Q3JlZGl0cy5VTkxJTUlURUQsICd1bmxpbWl0ZWQnXSxcbiAgXSkoJ0dpdmVuIGNwdUNyZWRpdHMgJXAnLCAoZ2l2ZW46IENwdUNyZWRpdHMsIGV4cGVjdGVkOiBzdHJpbmcpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBjcHVDcmVkaXRzOiBnaXZlbixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIENyZWRpdFNwZWNpZmljYXRpb246IHtcbiAgICAgICAgICBDcHVDcmVkaXRzOiBleHBlY3RlZCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChbXG4gICAgW3RydWUsIHRydWVdLFxuICAgIFtmYWxzZSwgZmFsc2VdLFxuICBdKSgnR2l2ZW4gZGlzYWJsZUFwaVRlcm1pbmF0aW9uICVwJywgKGdpdmVuOiBib29sZWFuLCBleHBlY3RlZDogYm9vbGVhbikgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIGRpc2FibGVBcGlUZXJtaW5hdGlvbjogZ2l2ZW4sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBEaXNhYmxlQXBpVGVybWluYXRpb246IGV4cGVjdGVkLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdC5lYWNoKFtcbiAgICBbdHJ1ZSwgdHJ1ZV0sXG4gICAgW2ZhbHNlLCBmYWxzZV0sXG4gIF0pKCdHaXZlbiBlYnNPcHRpbWl6ZWQgJXAnLCAoZ2l2ZW46IGJvb2xlYW4sIGV4cGVjdGVkOiBib29sZWFuKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgZWJzT3B0aW1pemVkOiBnaXZlbixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIEVic09wdGltaXplZDogZXhwZWN0ZWQsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0LmVhY2goW1xuICAgIFt0cnVlLCB0cnVlXSxcbiAgICBbZmFsc2UsIGZhbHNlXSxcbiAgXSkoJ0dpdmVuIG5pdHJvRW5jbGF2ZUVuYWJsZWQgJXAnLCAoZ2l2ZW46IGJvb2xlYW4sIGV4cGVjdGVkOiBib29sZWFuKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgbml0cm9FbmNsYXZlRW5hYmxlZDogZ2l2ZW4sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBFbmNsYXZlT3B0aW9uczoge1xuICAgICAgICAgIEVuYWJsZWQ6IGV4cGVjdGVkLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdC5lYWNoKFtcbiAgICBbSW5zdGFuY2VJbml0aWF0ZWRTaHV0ZG93bkJlaGF2aW9yLlNUT1AsICdzdG9wJ10sXG4gICAgW0luc3RhbmNlSW5pdGlhdGVkU2h1dGRvd25CZWhhdmlvci5URVJNSU5BVEUsICd0ZXJtaW5hdGUnXSxcbiAgXSkoJ0dpdmVuIGluc3RhbmNlSW5pdGlhdGVkU2h1dGRvd25CZWhhdmlvciAlcCcsIChnaXZlbjogSW5zdGFuY2VJbml0aWF0ZWRTaHV0ZG93bkJlaGF2aW9yLCBleHBlY3RlZDogc3RyaW5nKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgaW5zdGFuY2VJbml0aWF0ZWRTaHV0ZG93bkJlaGF2aW9yOiBnaXZlbixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIEluc3RhbmNlSW5pdGlhdGVkU2h1dGRvd25CZWhhdmlvcjogZXhwZWN0ZWQsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdHaXZlbiBrZXlOYW1lJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIGtleU5hbWU6ICdUZXN0S2V5bmFtZScsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBLZXlOYW1lOiAnVGVzdEtleW5hbWUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdC5lYWNoKFtcbiAgICBbdHJ1ZSwgdHJ1ZV0sXG4gICAgW2ZhbHNlLCBmYWxzZV0sXG4gIF0pKCdHaXZlbiBkZXRhaWxlZE1vbml0b3JpbmcgJXAnLCAoZ2l2ZW46IGJvb2xlYW4sIGV4cGVjdGVkOiBib29sZWFuKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgZGV0YWlsZWRNb25pdG9yaW5nOiBnaXZlbixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIE1vbml0b3Jpbmc6IHtcbiAgICAgICAgICBFbmFibGVkOiBleHBlY3RlZCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0dpdmVuIHNlY3VyaXR5R3JvdXAnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3Qgc2cgPSBuZXcgU2VjdXJpdHlHcm91cChzdGFjaywgJ1NHJywgeyB2cGMgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdGVtcGxhdGUgPSBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIHNlY3VyaXR5R3JvdXA6IHNnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgU2VjdXJpdHlHcm91cElkczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnU0dBREI1MzkzNycsXG4gICAgICAgICAgICAgICdHcm91cElkJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgZXhwZWN0KHRlbXBsYXRlLmNvbm5lY3Rpb25zKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdCh0ZW1wbGF0ZS5jb25uZWN0aW9ucy5zZWN1cml0eUdyb3VwcykudG9IYXZlTGVuZ3RoKDEpO1xuICAgIGV4cGVjdCh0ZW1wbGF0ZS5jb25uZWN0aW9ucy5zZWN1cml0eUdyb3Vwc1swXSkudG9CZShzZyk7XG4gIH0pO1xuXG4gIHRlc3QoJ0FkZGluZyB0YWdzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgdGVtcGxhdGUgPSBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScpO1xuXG4gICAgLy8gV0hFTlxuICAgIFRhZ3Mub2YodGVtcGxhdGUpLmFkZCgnVGVzdEtleScsICdUZXN0VmFsdWUnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIFRhZ1NwZWNpZmljYXRpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVzb3VyY2VUeXBlOiAnaW5zdGFuY2UnLFxuICAgICAgICAgICAgVGFnczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgS2V5OiAnTmFtZScsXG4gICAgICAgICAgICAgICAgVmFsdWU6ICdEZWZhdWx0L1RlbXBsYXRlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEtleTogJ1Rlc3RLZXknLFxuICAgICAgICAgICAgICAgIFZhbHVlOiAnVGVzdFZhbHVlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZXNvdXJjZVR5cGU6ICd2b2x1bWUnLFxuICAgICAgICAgICAgVGFnczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgS2V5OiAnTmFtZScsXG4gICAgICAgICAgICAgICAgVmFsdWU6ICdEZWZhdWx0L1RlbXBsYXRlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEtleTogJ1Rlc3RLZXknLFxuICAgICAgICAgICAgICAgIFZhbHVlOiAnVGVzdFZhbHVlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBUYWdTcGVjaWZpY2F0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVzb3VyY2VUeXBlOiAnbGF1bmNoLXRlbXBsYXRlJyxcbiAgICAgICAgICBUYWdzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEtleTogJ05hbWUnLFxuICAgICAgICAgICAgICBWYWx1ZTogJ0RlZmF1bHQvVGVtcGxhdGUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgS2V5OiAnVGVzdEtleScsXG4gICAgICAgICAgICAgIFZhbHVlOiAnVGVzdFZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1JlcXVpcmVzIElNRFN2MicsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICByZXF1aXJlSW1kc3YyOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgTWV0YWRhdGFPcHRpb25zOiB7XG4gICAgICAgICAgSHR0cFRva2VuczogJ3JlcXVpcmVkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdMYXVuY2hUZW1wbGF0ZSBtYXJrZXRPcHRpb25zJywgKCkgPT4ge1xuICBsZXQgYXBwOiBBcHA7XG4gIGxldCBzdGFjazogU3RhY2s7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXBwID0gbmV3IEFwcCgpO1xuICAgIHN0YWNrID0gbmV3IFN0YWNrKGFwcCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dpdmVuIHNwb3RPcHRpb25zJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIHNwb3RPcHRpb25zOiB7fSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIEluc3RhbmNlTWFya2V0T3B0aW9uczoge1xuICAgICAgICAgIE1hcmtldFR5cGU6ICdzcG90JyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChbXG4gICAgWzAsIDFdLFxuICAgIFsxLCAwXSxcbiAgICBbNiwgMF0sXG4gICAgWzcsIDFdLFxuICBdKSgnZm9yIHJhbmdlIGR1cmF0aW9uIGVycm9yczogJXAnLCAoZHVyYXRpb246IG51bWJlciwgZXhwZWN0ZWRFcnJvcnM6IG51bWJlcikgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIHNwb3RPcHRpb25zOiB7XG4gICAgICAgIGJsb2NrRHVyYXRpb246IER1cmF0aW9uLmhvdXJzKGR1cmF0aW9uKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgZXJyb3JzID0gQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5maW5kRXJyb3IoJy9EZWZhdWx0L1RlbXBsYXRlJywgTWF0Y2guYW55VmFsdWUoKSk7XG4gICAgZXhwZWN0KGVycm9ycykudG9IYXZlTGVuZ3RoKGV4cGVjdGVkRXJyb3JzKTtcbiAgfSk7XG5cbiAgdGVzdCgnZm9yIGJhZCBkdXJhdGlvbicsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICAgIHNwb3RPcHRpb25zOiB7XG4gICAgICAgICAgLy8gRHVyYXRpb24gbXVzdCBiZSBhbiBpbnRlZ3JhbCBudW1iZXIgb2YgaG91cnMuXG4gICAgICAgICAgYmxvY2tEdXJhdGlvbjogRHVyYXRpb24ubWludXRlcyg2MSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dpdmVuIGJsb2NrRHVyYXRpb24nLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgc3BvdE9wdGlvbnM6IHtcbiAgICAgICAgYmxvY2tEdXJhdGlvbjogRHVyYXRpb24uaG91cnMoMSksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgSW5zdGFuY2VNYXJrZXRPcHRpb25zOiB7XG4gICAgICAgICAgTWFya2V0VHlwZTogJ3Nwb3QnLFxuICAgICAgICAgIFNwb3RPcHRpb25zOiB7XG4gICAgICAgICAgICBCbG9ja0R1cmF0aW9uTWludXRlczogNjAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChbXG4gICAgW1Nwb3RJbnN0YW5jZUludGVycnVwdGlvbi5TVE9QLCAnc3RvcCddLFxuICAgIFtTcG90SW5zdGFuY2VJbnRlcnJ1cHRpb24uVEVSTUlOQVRFLCAndGVybWluYXRlJ10sXG4gICAgW1Nwb3RJbnN0YW5jZUludGVycnVwdGlvbi5ISUJFUk5BVEUsICdoaWJlcm5hdGUnXSxcbiAgXSkoJ2dpdmVuIGludGVycnVwdGlvbkJlaGF2aW9yICVwJywgKGdpdmVuOiBTcG90SW5zdGFuY2VJbnRlcnJ1cHRpb24sIGV4cGVjdGVkOiBzdHJpbmcpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBzcG90T3B0aW9uczoge1xuICAgICAgICBpbnRlcnJ1cHRpb25CZWhhdmlvcjogZ2l2ZW4sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgSW5zdGFuY2VNYXJrZXRPcHRpb25zOiB7XG4gICAgICAgICAgTWFya2V0VHlwZTogJ3Nwb3QnLFxuICAgICAgICAgIFNwb3RPcHRpb25zOiB7XG4gICAgICAgICAgICBJbnN0YW5jZUludGVycnVwdGlvbkJlaGF2aW9yOiBleHBlY3RlZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdC5lYWNoKFtcbiAgICBbMC4wMDEsICcwLjAwMSddLFxuICAgIFsxLCAnMSddLFxuICAgIFsyLjUsICcyLjUnXSxcbiAgXSkoJ2dpdmVuIG1heFByaWNlICVwJywgKGdpdmVuOiBudW1iZXIsIGV4cGVjdGVkOiBzdHJpbmcpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBzcG90T3B0aW9uczoge1xuICAgICAgICBtYXhQcmljZTogZ2l2ZW4sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgSW5zdGFuY2VNYXJrZXRPcHRpb25zOiB7XG4gICAgICAgICAgTWFya2V0VHlwZTogJ3Nwb3QnLFxuICAgICAgICAgIFNwb3RPcHRpb25zOiB7XG4gICAgICAgICAgICBNYXhQcmljZTogZXhwZWN0ZWQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChbXG4gICAgW1Nwb3RSZXF1ZXN0VHlwZS5PTkVfVElNRSwgJ29uZS10aW1lJ10sXG4gICAgW1Nwb3RSZXF1ZXN0VHlwZS5QRVJTSVNURU5ULCAncGVyc2lzdGVudCddLFxuICBdKSgnZ2l2ZW4gcmVxdWVzdFR5cGUgJXAnLCAoZ2l2ZW46IFNwb3RSZXF1ZXN0VHlwZSwgZXhwZWN0ZWQ6IHN0cmluZykgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIHNwb3RPcHRpb25zOiB7XG4gICAgICAgIHJlcXVlc3RUeXBlOiBnaXZlbixcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBJbnN0YW5jZU1hcmtldE9wdGlvbnM6IHtcbiAgICAgICAgICBNYXJrZXRUeXBlOiAnc3BvdCcsXG4gICAgICAgICAgU3BvdE9wdGlvbnM6IHtcbiAgICAgICAgICAgIFNwb3RJbnN0YW5jZVR5cGU6IGV4cGVjdGVkLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdnaXZlbiB2YWxpZFVudGlsJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIHNwb3RPcHRpb25zOiB7XG4gICAgICAgIHZhbGlkVW50aWw6IEV4cGlyYXRpb24uYXRUaW1lc3RhbXAoMCksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgSW5zdGFuY2VNYXJrZXRPcHRpb25zOiB7XG4gICAgICAgICAgTWFya2V0VHlwZTogJ3Nwb3QnLFxuICAgICAgICAgIFNwb3RPcHRpb25zOiB7XG4gICAgICAgICAgICBWYWxpZFVudGlsOiAnVGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMCBHTVQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnTGF1bmNoVGVtcGxhdGUgbWV0YWRhdGFPcHRpb25zJywgKCkgPT4ge1xuICBsZXQgYXBwOiBBcHA7XG4gIGxldCBzdGFjazogU3RhY2s7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXBwID0gbmV3IEFwcCgpO1xuICAgIHN0YWNrID0gbmV3IFN0YWNrKGFwcCk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChbXG4gICAgW3RydWUsICdlbmFibGVkJ10sXG4gICAgW2ZhbHNlLCAnZGlzYWJsZWQnXSxcbiAgXSkoJ2dpdmVuIGh0dHBFbmRwb2ludCAlcCcsIChnaXZlbjogYm9vbGVhbiwgZXhwZWN0ZWQ6IHN0cmluZykgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIGh0dHBFbmRwb2ludDogZ2l2ZW4sXG4gICAgfSk7XG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgTWV0YWRhdGFPcHRpb25zOiB7XG4gICAgICAgICAgSHR0cEVuZHBvaW50OiBleHBlY3RlZCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChbXG4gICAgW3RydWUsICdlbmFibGVkJ10sXG4gICAgW2ZhbHNlLCAnZGlzYWJsZWQnXSxcbiAgXSkoJ2dpdmVuIGh0dHBQcm90b2NvbElwdjYgJXAnLCAoZ2l2ZW46IGJvb2xlYW4sIGV4cGVjdGVkOiBzdHJpbmcpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBodHRwUHJvdG9jb2xJcHY2OiBnaXZlbixcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIExhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBNZXRhZGF0YU9wdGlvbnM6IHtcbiAgICAgICAgICBIdHRwUHJvdG9jb2xJcHY2OiBleHBlY3RlZCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChbXG4gICAgWzEsIDFdLFxuICAgIFsyLCAyXSxcbiAgXSkoJ2dpdmVuIGh0dHBQdXRSZXNwb25zZUhvcExpbWl0ICVwJywgKGdpdmVuOiBudW1iZXIsIGV4cGVjdGVkOiBudW1iZXIpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBodHRwUHV0UmVzcG9uc2VIb3BMaW1pdDogZ2l2ZW4sXG4gICAgfSk7XG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgTWV0YWRhdGFPcHRpb25zOiB7XG4gICAgICAgICAgSHR0cFB1dFJlc3BvbnNlSG9wTGltaXQ6IGV4cGVjdGVkLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdC5lYWNoKFtcbiAgICBbTGF1bmNoVGVtcGxhdGVIdHRwVG9rZW5zLk9QVElPTkFMLCAnb3B0aW9uYWwnXSxcbiAgICBbTGF1bmNoVGVtcGxhdGVIdHRwVG9rZW5zLlJFUVVJUkVELCAncmVxdWlyZWQnXSxcbiAgXSkoJ2dpdmVuIGh0dHBUb2tlbnMgJXAnLCAoZ2l2ZW46IExhdW5jaFRlbXBsYXRlSHR0cFRva2VucywgZXhwZWN0ZWQ6IHN0cmluZykgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIGh0dHBUb2tlbnM6IGdpdmVuLFxuICAgIH0pO1xuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIE1ldGFkYXRhT3B0aW9uczoge1xuICAgICAgICAgIEh0dHBUb2tlbnM6IGV4cGVjdGVkLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdC5lYWNoKFtcbiAgICBbdHJ1ZSwgJ2VuYWJsZWQnXSxcbiAgICBbZmFsc2UsICdkaXNhYmxlZCddLFxuICBdKSgnZ2l2ZW4gaW5zdGFuY2VNZXRhZGF0YVRhZ3MgJXAnLCAoZ2l2ZW46IGJvb2xlYW4sIGV4cGVjdGVkOiBzdHJpbmcpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICBpbnN0YW5jZU1ldGFkYXRhVGFnczogZ2l2ZW4sXG4gICAgfSk7XG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgTWV0YWRhdGFPcHRpb25zOiB7XG4gICAgICAgICAgSW5zdGFuY2VNZXRhZGF0YVRhZ3M6IGV4cGVjdGVkLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdC5lYWNoKFtcbiAgICBbMCwgMV0sXG4gICAgWy0xLCAxXSxcbiAgICBbMSwgMF0sXG4gICAgWzY0LCAwXSxcbiAgICBbNjUsIDFdLFxuICBdKSgnZ2l2ZW4gaW5zdGFuY2VNZXRhZGF0YVRhZ3MgJXAnLCAoZ2l2ZW46IG51bWJlciwgZXhwZWN0ZWQ6IG51bWJlcikgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdUZW1wbGF0ZScsIHtcbiAgICAgIGh0dHBQdXRSZXNwb25zZUhvcExpbWl0OiBnaXZlbixcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgY29uc3QgZXJyb3JzID0gQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5maW5kRXJyb3IoJy9EZWZhdWx0L1RlbXBsYXRlJywgTWF0Y2guYW55VmFsdWUoKSk7XG4gICAgZXhwZWN0KGVycm9ycykudG9IYXZlTGVuZ3RoKGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3cgd2hlbiByZXF1aXJlSW1kc3YyIGlzIHRydWUgYW5kIGh0dHBUb2tlbnMgaXMgT1BUSU9OQUwnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBMYXVuY2hUZW1wbGF0ZShzdGFjaywgJ1RlbXBsYXRlJywge1xuICAgICAgcmVxdWlyZUltZHN2MjogdHJ1ZSxcbiAgICAgIGh0dHBUb2tlbnM6IExhdW5jaFRlbXBsYXRlSHR0cFRva2Vucy5PUFRJT05BTCxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgY29uc3QgZXJyb3JzID0gQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5maW5kRXJyb3IoJy9EZWZhdWx0L1RlbXBsYXRlJywgTWF0Y2guYW55VmFsdWUoKSk7XG4gICAgZXhwZWN0KGVycm9yc1swXS5lbnRyeS5kYXRhKS50b01hdGNoKC9odHRwVG9rZW5zIG11c3QgYmUgcmVxdWlyZWQgd2hlbiByZXF1aXJlSW1kc3YyIGlzIHRydWUvKTtcbiAgfSk7XG4gIHRlc3QoJ2h0dHBUb2tlbnMgUkVRVUlSRUQgaXMgYWxsb3dlZCB3aGVuIHJlcXVpcmVJbWRzdjIgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnVGVtcGxhdGUnLCB7XG4gICAgICByZXF1aXJlSW1kc3YyOiB0cnVlLFxuICAgICAgaHR0cFRva2VuczogTGF1bmNoVGVtcGxhdGVIdHRwVG9rZW5zLlJFUVVJUkVELFxuICAgIH0pO1xuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIE1ldGFkYXRhT3B0aW9uczoge1xuICAgICAgICAgIEh0dHBUb2tlbnM6ICdyZXF1aXJlZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19