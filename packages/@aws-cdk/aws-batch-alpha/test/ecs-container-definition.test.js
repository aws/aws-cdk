"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("aws-cdk-lib/assertions");
const path = require("path");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
const ecr = require("aws-cdk-lib/aws-ecr");
const efs = require("aws-cdk-lib/aws-efs");
const ssm = require("aws-cdk-lib/aws-ssm");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const logs = require("aws-cdk-lib/aws-logs");
const secretsmanager = require("aws-cdk-lib/aws-secretsmanager");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const cdk = require("aws-cdk-lib");
const lib_1 = require("../lib");
const utils_1 = require("./utils");
const aws_ecr_assets_1 = require("aws-cdk-lib/aws-ecr-assets");
// GIVEN
const defaultContainerProps = {
    cpu: 256,
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memory: aws_cdk_lib_1.Size.mebibytes(2048),
};
const defaultExpectedProps = {
    type: 'container',
    containerProperties: {
        image: 'amazon/amazon-ecs-sample',
        resourceRequirements: [
            {
                type: 'MEMORY',
                value: '2048',
            },
            {
                type: 'VCPU',
                value: '256',
            },
        ],
    },
};
let stack;
let pascalCaseExpectedProps;
describe.each([lib_1.EcsEc2ContainerDefinition, lib_1.EcsFargateContainerDefinition])('%p', (ContainerDefinition) => {
    // GIVEN
    beforeEach(() => {
        stack = new aws_cdk_lib_1.Stack();
        pascalCaseExpectedProps = (0, utils_1.capitalizePropertyNames)(stack, {
            ...defaultExpectedProps,
            containerProperties: {
                ...defaultExpectedProps.containerProperties,
                executionRoleArn: {
                    'Fn::GetAtt': ['EcsContainerExecutionRole3B199293', 'Arn'],
                },
            },
        });
    });
    test('ecs container defaults', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new ContainerDefinition(stack, 'EcsContainer', {
                ...defaultContainerProps,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ExecutionRoleArn: {
                    'Fn::GetAtt': ['EcsContainerExecutionRole3B199293', 'Arn'],
                },
                ...pascalCaseExpectedProps.ContainerProperties,
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [
                    {
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: { Service: 'ecs-tasks.amazonaws.com' },
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
                            'logs:CreateLogStream',
                            'logs:PutLogEvents',
                        ],
                        Effect: 'Allow',
                        Resource: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    { Ref: 'AWS::Partition' },
                                    ':logs:',
                                    { Ref: 'AWS::Region' },
                                    ':',
                                    { Ref: 'AWS::AccountId' },
                                    ':log-group:/aws/batch/job:*',
                                ],
                            ],
                        },
                    },
                ],
                Version: '2012-10-17',
            },
            PolicyName: 'EcsContainerExecutionRoleDefaultPolicy6F59CD37',
            Roles: [{
                    Ref: 'EcsContainerExecutionRole3B199293',
                }],
        });
    });
    test('respects command', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new ContainerDefinition(stack, 'EcsContainer', {
                ...defaultContainerProps,
                command: ['echo', 'foo'],
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                Command: ['echo', 'foo'],
            },
        });
    });
    test('respects environment', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new ContainerDefinition(stack, 'EcsContainer', {
                ...defaultContainerProps,
                privileged: true,
                environment: {
                    foo: 'bar',
                },
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                Environment: [{
                        Name: 'foo',
                        Value: 'bar',
                    }],
            },
        });
    });
    test('respects executionRole', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new ContainerDefinition(stack, 'EcsContainer', {
                ...defaultContainerProps,
                privileged: true,
                executionRole: new aws_iam_1.Role(stack, 'execRole', {
                    assumedBy: new aws_iam_1.ArnPrincipal('arn:aws:iam:123456789012:user/user-name'),
                }),
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                ExecutionRoleArn: {
                    'Fn::GetAtt': ['execRole623CB63A', 'Arn'],
                },
            },
        });
    });
    test('respects jobRole', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new ContainerDefinition(stack, 'EcsContainer', {
                ...defaultContainerProps,
                privileged: true,
                jobRole: new aws_iam_1.Role(stack, 'jobRole', {
                    assumedBy: new aws_iam_1.ArnPrincipal('arn:aws:iam:123456789012:user/user-name'),
                }),
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                JobRoleArn: {
                    'Fn::GetAtt': ['jobRoleA2173686', 'Arn'],
                },
            },
        });
    });
    test('respects linuxParameters', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new ContainerDefinition(stack, 'EcsContainer', {
                ...defaultContainerProps,
                privileged: true,
                linuxParameters: new lib_1.LinuxParameters(stack, 'linuxParameters', {
                    initProcessEnabled: true,
                    maxSwap: aws_cdk_lib_1.Size.kibibytes(4096),
                    sharedMemorySize: aws_cdk_lib_1.Size.mebibytes(256),
                    swappiness: 30,
                }),
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                LinuxParameters: {
                    InitProcessEnabled: true,
                    MaxSwap: 4,
                    SharedMemorySize: 256,
                    Swappiness: 30,
                },
            },
        });
    });
    test('respects logging', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new ContainerDefinition(stack, 'EcsContainer', {
                ...defaultContainerProps,
                logging: ecs.LogDriver.awsLogs({
                    datetimeFormat: 'format',
                    logRetention: logs.RetentionDays.ONE_MONTH,
                    multilinePattern: 'pattern',
                    streamPrefix: 'hello',
                }),
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ExecutionRoleArn: {
                    'Fn::GetAtt': ['EcsContainerExecutionRole3B199293', 'Arn'],
                },
                ...pascalCaseExpectedProps.ContainerProperties,
                LogConfiguration: {
                    Options: {
                        'awslogs-datetime-format': 'format',
                        'awslogs-group': { Ref: 'EcsContainerLogGroup6C5D5962' },
                        'awslogs-multiline-pattern': 'pattern',
                        'awslogs-region': { Ref: 'AWS::Region' },
                        'awslogs-stream-prefix': 'hello',
                    },
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [
                    {
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: { Service: 'ecs-tasks.amazonaws.com' },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('respects readonlyRootFilesystem', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new ContainerDefinition(stack, 'EcsContainer', {
                ...defaultContainerProps,
                readonlyRootFilesystem: true,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                ReadonlyRootFilesystem: true,
            },
        });
    });
    test('respects secrets from secrestsmanager', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new ContainerDefinition(stack, 'EcsContainer', {
                ...defaultContainerProps,
                secrets: {
                    envName: lib_1.Secret.fromSecretsManager(new secretsmanager.Secret(stack, 'testSecret')),
                },
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                Secrets: [
                    {
                        Name: 'envName',
                        ValueFrom: { Ref: 'testSecretB96AD12C' },
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                        Effect: 'Allow',
                        Resource: {
                            'Fn::Join': [
                                '', [
                                    'arn:',
                                    { Ref: 'AWS::Partition' },
                                    ':logs:',
                                    { Ref: 'AWS::Region' },
                                    ':',
                                    { Ref: 'AWS::AccountId' },
                                    ':log-group:/aws/batch/job:*',
                                ],
                            ],
                        },
                    },
                    {
                        Action: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
                        Effect: 'Allow',
                        Resource: { Ref: 'testSecretB96AD12C' },
                    },
                ],
            },
        });
    });
    test('respects versioned secrets from secrestsmanager', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new ContainerDefinition(stack, 'EcsContainer', {
                ...defaultContainerProps,
                secrets: {
                    envName: lib_1.Secret.fromSecretsManagerVersion(new secretsmanager.Secret(stack, 'testSecret'), {
                        versionId: 'versionID',
                        versionStage: 'stage',
                    }),
                },
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                Secrets: [
                    {
                        Name: 'envName',
                        ValueFrom: {
                            'Fn::Join': [
                                '', [
                                    { Ref: 'testSecretB96AD12C' },
                                    '::stage:versionID',
                                ],
                            ],
                        },
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                        Effect: 'Allow',
                        Resource: {
                            'Fn::Join': [
                                '', [
                                    'arn:',
                                    { Ref: 'AWS::Partition' },
                                    ':logs:',
                                    { Ref: 'AWS::Region' },
                                    ':',
                                    { Ref: 'AWS::AccountId' },
                                    ':log-group:/aws/batch/job:*',
                                ],
                            ],
                        },
                    },
                    {
                        Action: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
                        Effect: 'Allow',
                        Resource: { Ref: 'testSecretB96AD12C' },
                    },
                ],
            },
        });
    });
    test('respects secrets from ssm', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new ContainerDefinition(stack, 'EcsContainer', {
                ...defaultContainerProps,
                secrets: {
                    envName: lib_1.Secret.fromSsmParameter(new ssm.StringParameter(stack, 'myParam', { stringValue: 'super secret' })),
                },
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                Secrets: [
                    {
                        Name: 'envName',
                        ValueFrom: {
                            'Fn::Join': [
                                '', [
                                    'arn:',
                                    {
                                        Ref: 'AWS::Partition',
                                    },
                                    ':ssm:',
                                    { Ref: 'AWS::Region' },
                                    ':',
                                    { Ref: 'AWS::AccountId' },
                                    ':parameter/',
                                    { Ref: 'myParam03610B68' },
                                ],
                            ],
                        },
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                        Effect: 'Allow',
                        Resource: {
                            'Fn::Join': [
                                '', [
                                    'arn:',
                                    { Ref: 'AWS::Partition' },
                                    ':logs:',
                                    { Ref: 'AWS::Region' },
                                    ':',
                                    { Ref: 'AWS::AccountId' },
                                    ':log-group:/aws/batch/job:*',
                                ],
                            ],
                        },
                    },
                    {
                        Action: ['ssm:DescribeParameters', 'ssm:GetParameters', 'ssm:GetParameter', 'ssm:GetParameterHistory'],
                        Effect: 'Allow',
                        Resource: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    { Ref: 'AWS::Partition' },
                                    ':ssm:',
                                    { Ref: 'AWS::Region' },
                                    ':',
                                    { Ref: 'AWS::AccountId' },
                                    ':parameter/',
                                    { Ref: 'myParam03610B68' },
                                ],
                            ],
                        },
                    },
                ],
            },
        });
    });
    test('respects user', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new ContainerDefinition(stack, 'EcsContainer', {
                ...defaultContainerProps,
                user: 'foo',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                User: 'foo',
            },
        });
    });
    test('respects efs volumes', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new ContainerDefinition(stack, 'EcsContainer', {
                ...defaultContainerProps,
                volumes: [
                    lib_1.EcsVolume.efs({
                        containerPath: '/first/path',
                        fileSystem: new efs.FileSystem(stack, 'efs', {
                            vpc: new aws_ec2_1.Vpc(stack, 'vpc'),
                        }),
                        name: 'firstEfsVolume',
                        accessPointId: 'EfsVolumeAccessPointId',
                        readonly: true,
                        rootDirectory: 'efsRootDir',
                        enableTransitEncryption: true,
                        transitEncryptionPort: 20181,
                        useJobRole: true,
                    }),
                    lib_1.EcsVolume.efs({
                        containerPath: '/second/path',
                        fileSystem: new efs.FileSystem(stack, 'efs2', {
                            vpc: new aws_ec2_1.Vpc(stack, 'vpc2'),
                        }),
                        name: 'secondEfsVolume',
                    }),
                ],
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                Volumes: [
                    {
                        EfsVolumeConfiguration: {
                            FileSystemId: {
                                Ref: 'efs6C17982A',
                            },
                            RootDirectory: 'efsRootDir',
                            TransitEncryptionPort: 20181,
                            AuthorizationConfig: {
                                AccessPointId: 'EfsVolumeAccessPointId',
                                Iam: 'ENABLED',
                            },
                        },
                        Name: 'firstEfsVolume',
                    },
                    {
                        EfsVolumeConfiguration: {
                            FileSystemId: {
                                Ref: 'efs2CB3916C1',
                            },
                        },
                        Name: 'secondEfsVolume',
                    },
                ],
                MountPoints: [
                    {
                        ContainerPath: '/first/path',
                        ReadOnly: true,
                        SourceVolume: 'firstEfsVolume',
                    },
                    {
                        ContainerPath: '/second/path',
                        SourceVolume: 'secondEfsVolume',
                    },
                ],
            },
        });
    });
    test('respects host volumes', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new ContainerDefinition(stack, 'EcsContainer', {
                ...defaultContainerProps,
                volumes: [
                    lib_1.EcsVolume.host({
                        containerPath: '/container/path',
                        name: 'EcsHostPathVolume',
                        hostPath: '/host/path',
                    }),
                ],
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                Volumes: [
                    {
                        Name: 'EcsHostPathVolume',
                        Host: {
                            SourcePath: '/host/path',
                        },
                    },
                ],
                MountPoints: [
                    {
                        ContainerPath: '/container/path',
                        SourceVolume: 'EcsHostPathVolume',
                    },
                ],
            },
        });
    });
    test('respects addVolume() with an EfsVolume', () => {
        // GIVEN
        const jobDefn = new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new ContainerDefinition(stack, 'EcsContainer', {
                ...defaultContainerProps,
            }),
        });
        // WHEN
        jobDefn.container.addVolume(lib_1.EcsVolume.efs({
            containerPath: '/container/path',
            fileSystem: new efs.FileSystem(stack, 'efs', {
                vpc: new aws_ec2_1.Vpc(stack, 'vpc'),
            }),
            name: 'AddedEfsVolume',
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                Volumes: [{
                        Name: 'AddedEfsVolume',
                        EfsVolumeConfiguration: {
                            FileSystemId: {
                                Ref: 'efs6C17982A',
                            },
                        },
                    }],
                MountPoints: [{
                        ContainerPath: '/container/path',
                        SourceVolume: 'AddedEfsVolume',
                    }],
            },
        });
    });
    test('respects addVolume() with a host volume', () => {
        // GIVEN
        const jobDefn = new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new ContainerDefinition(stack, 'EcsContainer', {
                ...defaultContainerProps,
            }),
        });
        // WHEN
        jobDefn.container.addVolume(lib_1.EcsVolume.host({
            containerPath: '/container/path/new',
            name: 'hostName',
            hostPath: '/host/path',
            readonly: false,
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                Volumes: [{
                        Name: 'hostName',
                        Host: {
                            SourcePath: '/host/path',
                        },
                    }],
                MountPoints: [{
                        ContainerPath: '/container/path/new',
                        SourceVolume: 'hostName',
                    }],
            },
        });
    });
    test('correctly renders docker images', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new ContainerDefinition(stack, 'EcsContainer', {
                ...defaultContainerProps,
                image: ecs.ContainerImage.fromDockerImageAsset(new aws_ecr_assets_1.DockerImageAsset(stack, 'dockerImageAsset', {
                    directory: path.join(__dirname, 'batchjob-image'),
                })),
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                Image: {
                    'Fn::Sub': '${AWS::AccountId}.dkr.ecr.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-container-assets-${AWS::AccountId}-${AWS::Region}:8b518243ecbfcfd08b4734069e7e74ff97b7889dfde0a60d16e7bdc96e6c593b',
                },
            },
        });
    });
    test('correctly renders images from repositories', () => {
        // GIVEN
        const repo = new ecr.Repository(stack, 'Repo');
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new ContainerDefinition(stack, 'EcsContainer', {
                ...defaultContainerProps,
                image: ecs.ContainerImage.fromEcrRepository(repo, 'my-tag'),
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                Image: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::Select': [
                                    4,
                                    {
                                        'Fn::Split': [
                                            ':',
                                            { 'Fn::GetAtt': ['Repo02AC86CF', 'Arn'] },
                                        ],
                                    },
                                ],
                            },
                            '.dkr.ecr.',
                            {
                                'Fn::Select': [
                                    3,
                                    {
                                        'Fn::Split': [
                                            ':',
                                            { 'Fn::GetAtt': ['Repo02AC86CF', 'Arn'] },
                                        ],
                                    },
                                ],
                            },
                            '.',
                            { Ref: 'AWS::URLSuffix' },
                            '/',
                            { Ref: 'Repo02AC86CF' },
                            ':my-tag',
                        ],
                    ],
                },
            },
        });
    });
});
describe('EC2 containers', () => {
    // GIVEN
    beforeEach(() => {
        stack = new aws_cdk_lib_1.Stack();
        pascalCaseExpectedProps = (0, utils_1.capitalizePropertyNames)(stack, {
            ...defaultExpectedProps,
            containerProperties: {
                ...defaultExpectedProps.containerProperties,
                executionRoleArn: {
                    'Fn::GetAtt': ['EcsEc2ContainerExecutionRole90E18680', 'Arn'],
                },
            },
        });
    });
    test('respects addUlimit()', () => {
        // GIVEN
        const jobDefn = new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new lib_1.EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
            }),
        });
        // WHEN
        jobDefn.container.addUlimit({
            hardLimit: 10,
            name: lib_1.UlimitName.SIGPENDING,
            softLimit: 1,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                Ulimits: [{
                        HardLimit: 10,
                        SoftLimit: 1,
                        Name: 'sigpending',
                    }],
            },
        });
    });
    test('respects ulimits', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new lib_1.EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                ulimits: [
                    {
                        hardLimit: 100,
                        name: lib_1.UlimitName.CORE,
                        softLimit: 10,
                    },
                ],
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                Ulimits: [
                    {
                        HardLimit: 100,
                        Name: 'core',
                        SoftLimit: 10,
                    },
                ],
            },
        });
    });
    test('respects privileged', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new lib_1.EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                privileged: true,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                Privileged: true,
            },
        });
    });
    test('respects gpu', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new lib_1.EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                privileged: true,
                gpu: 12,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                ResourceRequirements: [
                    {
                        Type: 'MEMORY',
                        Value: '2048',
                    },
                    {
                        Type: 'VCPU',
                        Value: '256',
                    },
                    {
                        Type: 'GPU',
                        Value: '12',
                    },
                ],
            },
        });
    });
    test('can use an assset as a container', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new lib_1.EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                image: ecs.ContainerImage.fromAsset(path.join(__dirname, 'batchjob-image')),
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                Image: {
                    'Fn::Sub': '${AWS::AccountId}.dkr.ecr.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-container-assets-${AWS::AccountId}-${AWS::Region}:8b518243ecbfcfd08b4734069e7e74ff97b7889dfde0a60d16e7bdc96e6c593b',
                },
                ExecutionRoleArn: { 'Fn::GetAtt': ['EcsEc2ContainerExecutionRole90E18680', 'Arn'] },
            },
        });
    });
});
describe('Fargate containers', () => {
    // GIVEN
    beforeEach(() => {
        stack = new aws_cdk_lib_1.Stack();
        pascalCaseExpectedProps = (0, utils_1.capitalizePropertyNames)(stack, {
            ...defaultExpectedProps,
            containerProperties: {
                ...defaultExpectedProps.containerProperties,
                executionRoleArn: {
                    'Fn::GetAtt': ['EcsContainerExecutionRole3B199293', 'Arn'],
                },
            },
        });
    });
    test('create executionRole by default', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new lib_1.EcsFargateContainerDefinition(stack, 'EcsFargateContainer', {
                ...defaultContainerProps,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                ExecutionRoleArn: {
                    'Fn::GetAtt': ['EcsFargateContainerExecutionRole3286EAFE', 'Arn'],
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [{
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: { Service: 'ecs-tasks.amazonaws.com' },
                    }],
                Version: '2012-10-17',
            },
        });
    });
    test('can set ephemeralStorageSize', () => {
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new lib_1.EcsFargateContainerDefinition(stack, 'EcsFargateContainer', {
                ...defaultContainerProps,
                fargatePlatformVersion: ecs.FargatePlatformVersion.LATEST,
                ephemeralStorageSize: aws_cdk_lib_1.Size.gibibytes(100),
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                ExecutionRoleArn: {
                    'Fn::GetAtt': ['EcsFargateContainerExecutionRole3286EAFE', 'Arn'],
                },
                EphemeralStorage: {
                    SizeInGiB: aws_cdk_lib_1.Size.gibibytes(100).toGibibytes(),
                },
            },
        });
    });
    test('can set ephemeralStorageSize as token', () => {
        const ephemeralStorageValue = cdk.Token.asNumber(150);
        // WHEN
        new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new lib_1.EcsFargateContainerDefinition(stack, 'EcsFargateContainer', {
                ...defaultContainerProps,
                fargatePlatformVersion: ecs.FargatePlatformVersion.LATEST,
                ephemeralStorageSize: aws_cdk_lib_1.Size.gibibytes(ephemeralStorageValue),
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            ContainerProperties: {
                ...pascalCaseExpectedProps.ContainerProperties,
                ExecutionRoleArn: {
                    'Fn::GetAtt': ['EcsFargateContainerExecutionRole3286EAFE', 'Arn'],
                },
                EphemeralStorage: {
                    SizeInGiB: aws_cdk_lib_1.Size.gibibytes(150).toGibibytes(),
                },
            },
        });
    });
    test('ephemeralStorageSize throws error when out of range', () => {
        expect(() => new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
            container: new lib_1.EcsFargateContainerDefinition(stack, 'EcsFargateContainer', {
                ...defaultContainerProps,
                fargatePlatformVersion: ecs.FargatePlatformVersion.LATEST,
                ephemeralStorageSize: aws_cdk_lib_1.Size.gibibytes(19),
            }),
        })).toThrow("ECS Fargate container 'EcsFargateContainer' specifies 'ephemeralStorageSize' at 19 < 21 GB");
        expect(() => new lib_1.EcsJobDefinition(stack, 'ECSJobDefn2', {
            container: new lib_1.EcsFargateContainerDefinition(stack, 'EcsFargateContainer2', {
                ...defaultContainerProps,
                fargatePlatformVersion: ecs.FargatePlatformVersion.LATEST,
                ephemeralStorageSize: aws_cdk_lib_1.Size.gibibytes(201),
            }),
        })).toThrow("ECS Fargate container 'EcsFargateContainer2' specifies 'ephemeralStorageSize' at 201 > 200 GB");
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLWNvbnRhaW5lci1kZWZpbml0aW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlY3MtY29udGFpbmVyLWRlZmluaXRpb24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVEQUFrRDtBQUNsRCw2QkFBNkI7QUFDN0IsaURBQTBDO0FBQzFDLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyxpREFBeUQ7QUFDekQsNkNBQTZDO0FBQzdDLGlFQUFpRTtBQUNqRSw2Q0FBMEM7QUFDMUMsbUNBQW1DO0FBQ25DLGdDQUE2TTtBQUU3TSxtQ0FBa0Q7QUFDbEQsK0RBQThEO0FBRTlELFFBQVE7QUFDUixNQUFNLHFCQUFxQixHQUFnQztJQUN6RCxHQUFHLEVBQUUsR0FBRztJQUNSLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztJQUNsRSxNQUFNLEVBQUUsa0JBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO0NBQzdCLENBQUM7QUFFRixNQUFNLG9CQUFvQixHQUEwQjtJQUNsRCxJQUFJLEVBQUUsV0FBVztJQUNqQixtQkFBbUIsRUFBRTtRQUNuQixLQUFLLEVBQUUsMEJBQTBCO1FBQ2pDLG9CQUFvQixFQUFFO1lBQ3BCO2dCQUNFLElBQUksRUFBRSxRQUFRO2dCQUNkLEtBQUssRUFBRSxNQUFNO2FBQ2Q7WUFDRDtnQkFDRSxJQUFJLEVBQUUsTUFBTTtnQkFDWixLQUFLLEVBQUUsS0FBSzthQUNiO1NBQ0Y7S0FDRjtDQUNGLENBQUM7QUFFRixJQUFJLEtBQVksQ0FBQztBQUNqQixJQUFJLHVCQUE0QixDQUFDO0FBRWpDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQywrQkFBeUIsRUFBRSxtQ0FBNkIsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsbUJBQW1CLEVBQUUsRUFBRTtJQUN0RyxRQUFRO0lBQ1IsVUFBVSxDQUFD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IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnYXdzLWNkay1saWIvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgVnBjIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5pbXBvcnQgKiBhcyBlY3IgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcic7XG5pbXBvcnQgKiBhcyBlZnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVmcyc7XG5pbXBvcnQgKiBhcyBzc20gZnJvbSAnYXdzLWNkay1saWIvYXdzLXNzbSc7XG5pbXBvcnQgeyBBcm5QcmluY2lwYWwsIFJvbGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxvZ3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxvZ3MnO1xuaW1wb3J0ICogYXMgc2VjcmV0c21hbmFnZXIgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNlY3JldHNtYW5hZ2VyJztcbmltcG9ydCB7IFNpemUsIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEVjc0NvbnRhaW5lckRlZmluaXRpb25Qcm9wcywgRWNzRWMyQ29udGFpbmVyRGVmaW5pdGlvbiwgRWNzRmFyZ2F0ZUNvbnRhaW5lckRlZmluaXRpb24sIEVjc0pvYkRlZmluaXRpb24sIEVjc1ZvbHVtZSwgSUVjc0VjMkNvbnRhaW5lckRlZmluaXRpb24sIExpbnV4UGFyYW1ldGVycywgU2VjcmV0LCBVbGltaXROYW1lIH0gZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IENmbkpvYkRlZmluaXRpb25Qcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1iYXRjaCc7XG5pbXBvcnQgeyBjYXBpdGFsaXplUHJvcGVydHlOYW1lcyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgRG9ja2VySW1hZ2VBc3NldCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3ItYXNzZXRzJztcblxuLy8gR0lWRU5cbmNvbnN0IGRlZmF1bHRDb250YWluZXJQcm9wczogRWNzQ29udGFpbmVyRGVmaW5pdGlvblByb3BzID0ge1xuICBjcHU6IDI1NixcbiAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICBtZW1vcnk6IFNpemUubWViaWJ5dGVzKDIwNDgpLFxufTtcblxuY29uc3QgZGVmYXVsdEV4cGVjdGVkUHJvcHM6IENmbkpvYkRlZmluaXRpb25Qcm9wcyA9IHtcbiAgdHlwZTogJ2NvbnRhaW5lcicsXG4gIGNvbnRhaW5lclByb3BlcnRpZXM6IHtcbiAgICBpbWFnZTogJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScsXG4gICAgcmVzb3VyY2VSZXF1aXJlbWVudHM6IFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ01FTU9SWScsXG4gICAgICAgIHZhbHVlOiAnMjA0OCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0eXBlOiAnVkNQVScsXG4gICAgICAgIHZhbHVlOiAnMjU2JyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbn07XG5cbmxldCBzdGFjazogU3RhY2s7XG5sZXQgcGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHM6IGFueTtcblxuZGVzY3JpYmUuZWFjaChbRWNzRWMyQ29udGFpbmVyRGVmaW5pdGlvbiwgRWNzRmFyZ2F0ZUNvbnRhaW5lckRlZmluaXRpb25dKSgnJXAnLCAoQ29udGFpbmVyRGVmaW5pdGlvbikgPT4ge1xuICAvLyBHSVZFTlxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIHBhc2NhbENhc2VFeHBlY3RlZFByb3BzID0gY2FwaXRhbGl6ZVByb3BlcnR5TmFtZXMoc3RhY2ssIHtcbiAgICAgIC4uLmRlZmF1bHRFeHBlY3RlZFByb3BzLFxuICAgICAgY29udGFpbmVyUHJvcGVydGllczoge1xuICAgICAgICAuLi5kZWZhdWx0RXhwZWN0ZWRQcm9wcy5jb250YWluZXJQcm9wZXJ0aWVzLFxuICAgICAgICBleGVjdXRpb25Sb2xlQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ0Vjc0NvbnRhaW5lckV4ZWN1dGlvblJvbGUzQjE5OTI5MycsICdBcm4nXSxcbiAgICAgICAgfSBhcyBhbnksXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlY3MgY29udGFpbmVyIGRlZmF1bHRzJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgRWNzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0VDU0pvYkRlZm4nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnRWNzQ29udGFpbmVyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgQ29udGFpbmVyUHJvcGVydGllczoge1xuICAgICAgICBFeGVjdXRpb25Sb2xlQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ0Vjc0NvbnRhaW5lckV4ZWN1dGlvblJvbGUzQjE5OTI5MycsICdBcm4nXSxcbiAgICAgICAgfSxcbiAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuQ29udGFpbmVyUHJvcGVydGllcyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICdlY3MtdGFza3MuYW1hem9uYXdzLmNvbScgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgJ2xvZ3M6Q3JlYXRlTG9nU3RyZWFtJyxcbiAgICAgICAgICAgICAgJ2xvZ3M6UHV0TG9nRXZlbnRzJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAgICc6bG9nczonLFxuICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgICAgICAgICAnOmxvZy1ncm91cDovYXdzL2JhdGNoL2pvYjoqJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgUG9saWN5TmFtZTogJ0Vjc0NvbnRhaW5lckV4ZWN1dGlvblJvbGVEZWZhdWx0UG9saWN5NkY1OUNEMzcnLFxuICAgICAgUm9sZXM6IFt7XG4gICAgICAgIFJlZjogJ0Vjc0NvbnRhaW5lckV4ZWN1dGlvblJvbGUzQjE5OTI5MycsXG4gICAgICB9XSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzcGVjdHMgY29tbWFuZCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEVjc0pvYkRlZmluaXRpb24oc3RhY2ssICdFQ1NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0NvbnRhaW5lcicsIHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnRhaW5lclByb3BzLFxuICAgICAgICBjb21tYW5kOiBbJ2VjaG8nLCAnZm9vJ10sXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgQ29udGFpbmVyUHJvcGVydGllczoge1xuICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Db250YWluZXJQcm9wZXJ0aWVzLFxuICAgICAgICBDb21tYW5kOiBbJ2VjaG8nLCAnZm9vJ10sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNwZWN0cyBlbnZpcm9ubWVudCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEVjc0pvYkRlZmluaXRpb24oc3RhY2ssICdFQ1NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0NvbnRhaW5lcicsIHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnRhaW5lclByb3BzLFxuICAgICAgICBwcml2aWxlZ2VkOiB0cnVlLFxuICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgIGZvbzogJ2JhcicsXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgQ29udGFpbmVyUHJvcGVydGllczoge1xuICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Db250YWluZXJQcm9wZXJ0aWVzLFxuICAgICAgICBFbnZpcm9ubWVudDogW3tcbiAgICAgICAgICBOYW1lOiAnZm9vJyxcbiAgICAgICAgICBWYWx1ZTogJ2JhcicsXG4gICAgICAgIH1dLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzcGVjdHMgZXhlY3V0aW9uUm9sZScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEVjc0pvYkRlZmluaXRpb24oc3RhY2ssICdFQ1NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0NvbnRhaW5lcicsIHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnRhaW5lclByb3BzLFxuICAgICAgICBwcml2aWxlZ2VkOiB0cnVlLFxuICAgICAgICBleGVjdXRpb25Sb2xlOiBuZXcgUm9sZShzdGFjaywgJ2V4ZWNSb2xlJywge1xuICAgICAgICAgIGFzc3VtZWRCeTogbmV3IEFyblByaW5jaXBhbCgnYXJuOmF3czppYW06MTIzNDU2Nzg5MDEyOnVzZXIvdXNlci1uYW1lJyksXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcyxcbiAgICAgIENvbnRhaW5lclByb3BlcnRpZXM6IHtcbiAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuQ29udGFpbmVyUHJvcGVydGllcyxcbiAgICAgICAgRXhlY3V0aW9uUm9sZUFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogWydleGVjUm9sZTYyM0NCNjNBJywgJ0FybiddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzcGVjdHMgam9iUm9sZScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEVjc0pvYkRlZmluaXRpb24oc3RhY2ssICdFQ1NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0NvbnRhaW5lcicsIHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnRhaW5lclByb3BzLFxuICAgICAgICBwcml2aWxlZ2VkOiB0cnVlLFxuICAgICAgICBqb2JSb2xlOiBuZXcgUm9sZShzdGFjaywgJ2pvYlJvbGUnLCB7XG4gICAgICAgICAgYXNzdW1lZEJ5OiBuZXcgQXJuUHJpbmNpcGFsKCdhcm46YXdzOmlhbToxMjM0NTY3ODkwMTI6dXNlci91c2VyLW5hbWUnKSxcbiAgICAgICAgfSksXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgQ29udGFpbmVyUHJvcGVydGllczoge1xuICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Db250YWluZXJQcm9wZXJ0aWVzLFxuICAgICAgICBKb2JSb2xlQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ2pvYlJvbGVBMjE3MzY4NicsICdBcm4nXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc3BlY3RzIGxpbnV4UGFyYW1ldGVycycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEVjc0pvYkRlZmluaXRpb24oc3RhY2ssICdFQ1NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0NvbnRhaW5lcicsIHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnRhaW5lclByb3BzLFxuICAgICAgICBwcml2aWxlZ2VkOiB0cnVlLFxuICAgICAgICBsaW51eFBhcmFtZXRlcnM6IG5ldyBMaW51eFBhcmFtZXRlcnMoc3RhY2ssICdsaW51eFBhcmFtZXRlcnMnLCB7XG4gICAgICAgICAgaW5pdFByb2Nlc3NFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIG1heFN3YXA6IFNpemUua2liaWJ5dGVzKDQwOTYpLFxuICAgICAgICAgIHNoYXJlZE1lbW9yeVNpemU6IFNpemUubWViaWJ5dGVzKDI1NiksXG4gICAgICAgICAgc3dhcHBpbmVzczogMzAsXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcyxcbiAgICAgIENvbnRhaW5lclByb3BlcnRpZXM6IHtcbiAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuQ29udGFpbmVyUHJvcGVydGllcyxcbiAgICAgICAgTGludXhQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgSW5pdFByb2Nlc3NFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIE1heFN3YXA6IDQsXG4gICAgICAgICAgU2hhcmVkTWVtb3J5U2l6ZTogMjU2LFxuICAgICAgICAgIFN3YXBwaW5lc3M6IDMwLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzcGVjdHMgbG9nZ2luZycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEVjc0pvYkRlZmluaXRpb24oc3RhY2ssICdFQ1NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0NvbnRhaW5lcicsIHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnRhaW5lclByb3BzLFxuICAgICAgICBsb2dnaW5nOiBlY3MuTG9nRHJpdmVyLmF3c0xvZ3Moe1xuICAgICAgICAgIGRhdGV0aW1lRm9ybWF0OiAnZm9ybWF0JyxcbiAgICAgICAgICBsb2dSZXRlbnRpb246IGxvZ3MuUmV0ZW50aW9uRGF5cy5PTkVfTU9OVEgsXG4gICAgICAgICAgbXVsdGlsaW5lUGF0dGVybjogJ3BhdHRlcm4nLFxuICAgICAgICAgIHN0cmVhbVByZWZpeDogJ2hlbGxvJyxcbiAgICAgICAgfSksXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgQ29udGFpbmVyUHJvcGVydGllczoge1xuICAgICAgICBFeGVjdXRpb25Sb2xlQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ0Vjc0NvbnRhaW5lckV4ZWN1dGlvblJvbGUzQjE5OTI5MycsICdBcm4nXSxcbiAgICAgICAgfSxcbiAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuQ29udGFpbmVyUHJvcGVydGllcyxcbiAgICAgICAgTG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIE9wdGlvbnM6IHtcbiAgICAgICAgICAgICdhd3Nsb2dzLWRhdGV0aW1lLWZvcm1hdCc6ICdmb3JtYXQnLFxuICAgICAgICAgICAgJ2F3c2xvZ3MtZ3JvdXAnOiB7IFJlZjogJ0Vjc0NvbnRhaW5lckxvZ0dyb3VwNkM1RDU5NjInIH0sXG4gICAgICAgICAgICAnYXdzbG9ncy1tdWx0aWxpbmUtcGF0dGVybic6ICdwYXR0ZXJuJyxcbiAgICAgICAgICAgICdhd3Nsb2dzLXJlZ2lvbic6IHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICAnYXdzbG9ncy1zdHJlYW0tcHJlZml4JzogJ2hlbGxvJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ2Vjcy10YXNrcy5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc3BlY3RzIHJlYWRvbmx5Um9vdEZpbGVzeXN0ZW0nLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBFY3NKb2JEZWZpbml0aW9uKHN0YWNrLCAnRUNTSm9iRGVmbicsIHtcbiAgICAgIGNvbnRhaW5lcjogbmV3IENvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdFY3NDb250YWluZXInLCB7XG4gICAgICAgIC4uLmRlZmF1bHRDb250YWluZXJQcm9wcyxcbiAgICAgICAgcmVhZG9ubHlSb290RmlsZXN5c3RlbTogdHJ1ZSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpKb2JEZWZpbml0aW9uJywge1xuICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMsXG4gICAgICBDb250YWluZXJQcm9wZXJ0aWVzOiB7XG4gICAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLkNvbnRhaW5lclByb3BlcnRpZXMsXG4gICAgICAgIFJlYWRvbmx5Um9vdEZpbGVzeXN0ZW06IHRydWUsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNwZWN0cyBzZWNyZXRzIGZyb20gc2VjcmVzdHNtYW5hZ2VyJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgRWNzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0VDU0pvYkRlZm4nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnRWNzQ29udGFpbmVyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICAgIHNlY3JldHM6IHtcbiAgICAgICAgICBlbnZOYW1lOiBTZWNyZXQuZnJvbVNlY3JldHNNYW5hZ2VyKG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQoc3RhY2ssICd0ZXN0U2VjcmV0JykpLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcyxcbiAgICAgIENvbnRhaW5lclByb3BlcnRpZXM6IHtcbiAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuQ29udGFpbmVyUHJvcGVydGllcyxcbiAgICAgICAgU2VjcmV0czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIE5hbWU6ICdlbnZOYW1lJyxcbiAgICAgICAgICAgIFZhbHVlRnJvbTogeyBSZWY6ICd0ZXN0U2VjcmV0Qjk2QUQxMkMnIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogWydsb2dzOkNyZWF0ZUxvZ1N0cmVhbScsICdsb2dzOlB1dExvZ0V2ZW50cyddLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLCBbXG4gICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICAgJzpsb2dzOicsXG4gICAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICAgICAgICc6bG9nLWdyb3VwOi9hd3MvYmF0Y2gvam9iOionLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiBbJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJywgJ3NlY3JldHNtYW5hZ2VyOkRlc2NyaWJlU2VjcmV0J10sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogeyBSZWY6ICd0ZXN0U2VjcmV0Qjk2QUQxMkMnIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc3BlY3RzIHZlcnNpb25lZCBzZWNyZXRzIGZyb20gc2VjcmVzdHNtYW5hZ2VyJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgRWNzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0VDU0pvYkRlZm4nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnRWNzQ29udGFpbmVyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICAgIHNlY3JldHM6IHtcbiAgICAgICAgICBlbnZOYW1lOiBTZWNyZXQuZnJvbVNlY3JldHNNYW5hZ2VyVmVyc2lvbihuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAndGVzdFNlY3JldCcpLCB7XG4gICAgICAgICAgICB2ZXJzaW9uSWQ6ICd2ZXJzaW9uSUQnLFxuICAgICAgICAgICAgdmVyc2lvblN0YWdlOiAnc3RhZ2UnLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcyxcbiAgICAgIENvbnRhaW5lclByb3BlcnRpZXM6IHtcbiAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuQ29udGFpbmVyUHJvcGVydGllcyxcbiAgICAgICAgU2VjcmV0czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIE5hbWU6ICdlbnZOYW1lJyxcbiAgICAgICAgICAgIFZhbHVlRnJvbToge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsIFtcbiAgICAgICAgICAgICAgICAgIHsgUmVmOiAndGVzdFNlY3JldEI5NkFEMTJDJyB9LFxuICAgICAgICAgICAgICAgICAgJzo6c3RhZ2U6dmVyc2lvbklEJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiBbJ2xvZ3M6Q3JlYXRlTG9nU3RyZWFtJywgJ2xvZ3M6UHV0TG9nRXZlbnRzJ10sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgICAnOmxvZ3M6JyxcbiAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgICAgICAgICAgICAgJzpsb2ctZ3JvdXA6L2F3cy9iYXRjaC9qb2I6KicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFsnc2VjcmV0c21hbmFnZXI6R2V0U2VjcmV0VmFsdWUnLCAnc2VjcmV0c21hbmFnZXI6RGVzY3JpYmVTZWNyZXQnXSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiB7IFJlZjogJ3Rlc3RTZWNyZXRCOTZBRDEyQycgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzcGVjdHMgc2VjcmV0cyBmcm9tIHNzbScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEVjc0pvYkRlZmluaXRpb24oc3RhY2ssICdFQ1NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0NvbnRhaW5lcicsIHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnRhaW5lclByb3BzLFxuICAgICAgICBzZWNyZXRzOiB7XG4gICAgICAgICAgZW52TmFtZTogU2VjcmV0LmZyb21Tc21QYXJhbWV0ZXIobmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICdteVBhcmFtJywgeyBzdHJpbmdWYWx1ZTogJ3N1cGVyIHNlY3JldCcgfSkpLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcyxcbiAgICAgIENvbnRhaW5lclByb3BlcnRpZXM6IHtcbiAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuQ29udGFpbmVyUHJvcGVydGllcyxcbiAgICAgICAgU2VjcmV0czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIE5hbWU6ICdlbnZOYW1lJyxcbiAgICAgICAgICAgIFZhbHVlRnJvbToge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6c3NtOicsXG4gICAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICAgICAgICc6cGFyYW1ldGVyLycsXG4gICAgICAgICAgICAgICAgICB7IFJlZjogJ215UGFyYW0wMzYxMEI2OCcgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiBbJ2xvZ3M6Q3JlYXRlTG9nU3RyZWFtJywgJ2xvZ3M6UHV0TG9nRXZlbnRzJ10sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgICAnOmxvZ3M6JyxcbiAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgICAgICAgICAgICAgJzpsb2ctZ3JvdXA6L2F3cy9iYXRjaC9qb2I6KicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFsnc3NtOkRlc2NyaWJlUGFyYW1ldGVycycsICdzc206R2V0UGFyYW1ldGVycycsICdzc206R2V0UGFyYW1ldGVyJywgJ3NzbTpHZXRQYXJhbWV0ZXJIaXN0b3J5J10sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAgICc6c3NtOicsXG4gICAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICAgICAgICc6cGFyYW1ldGVyLycsXG4gICAgICAgICAgICAgICAgICB7IFJlZjogJ215UGFyYW0wMzYxMEI2OCcgfSxcbiAgICAgICAgICAgICAgICBdLFxuXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNwZWN0cyB1c2VyJywgKCkgPT4ge1xuICAvLyBXSEVOXG4gICAgbmV3IEVjc0pvYkRlZmluaXRpb24oc3RhY2ssICdFQ1NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0NvbnRhaW5lcicsIHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnRhaW5lclByb3BzLFxuICAgICAgICB1c2VyOiAnZm9vJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpKb2JEZWZpbml0aW9uJywge1xuICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMsXG4gICAgICBDb250YWluZXJQcm9wZXJ0aWVzOiB7XG4gICAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLkNvbnRhaW5lclByb3BlcnRpZXMsXG4gICAgICAgIFVzZXI6ICdmb28nLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzcGVjdHMgZWZzIHZvbHVtZXMnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBFY3NKb2JEZWZpbml0aW9uKHN0YWNrLCAnRUNTSm9iRGVmbicsIHtcbiAgICAgIGNvbnRhaW5lcjogbmV3IENvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdFY3NDb250YWluZXInLCB7XG4gICAgICAgIC4uLmRlZmF1bHRDb250YWluZXJQcm9wcyxcbiAgICAgICAgdm9sdW1lczogW1xuICAgICAgICAgIEVjc1ZvbHVtZS5lZnMoe1xuICAgICAgICAgICAgY29udGFpbmVyUGF0aDogJy9maXJzdC9wYXRoJyxcbiAgICAgICAgICAgIGZpbGVTeXN0ZW06IG5ldyBlZnMuRmlsZVN5c3RlbShzdGFjaywgJ2VmcycsIHtcbiAgICAgICAgICAgICAgdnBjOiBuZXcgVnBjKHN0YWNrLCAndnBjJyksXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIG5hbWU6ICdmaXJzdEVmc1ZvbHVtZScsXG4gICAgICAgICAgICBhY2Nlc3NQb2ludElkOiAnRWZzVm9sdW1lQWNjZXNzUG9pbnRJZCcsXG4gICAgICAgICAgICByZWFkb25seTogdHJ1ZSxcbiAgICAgICAgICAgIHJvb3REaXJlY3Rvcnk6ICdlZnNSb290RGlyJyxcbiAgICAgICAgICAgIGVuYWJsZVRyYW5zaXRFbmNyeXB0aW9uOiB0cnVlLFxuICAgICAgICAgICAgdHJhbnNpdEVuY3J5cHRpb25Qb3J0OiAyMDE4MSxcbiAgICAgICAgICAgIHVzZUpvYlJvbGU6IHRydWUsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgRWNzVm9sdW1lLmVmcyh7XG4gICAgICAgICAgICBjb250YWluZXJQYXRoOiAnL3NlY29uZC9wYXRoJyxcbiAgICAgICAgICAgIGZpbGVTeXN0ZW06IG5ldyBlZnMuRmlsZVN5c3RlbShzdGFjaywgJ2VmczInLCB7XG4gICAgICAgICAgICAgIHZwYzogbmV3IFZwYyhzdGFjaywgJ3ZwYzInKSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgbmFtZTogJ3NlY29uZEVmc1ZvbHVtZScsXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgQ29udGFpbmVyUHJvcGVydGllczoge1xuICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Db250YWluZXJQcm9wZXJ0aWVzLFxuICAgICAgICBWb2x1bWVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgRWZzVm9sdW1lQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICBGaWxlU3lzdGVtSWQ6IHtcbiAgICAgICAgICAgICAgICBSZWY6ICdlZnM2QzE3OTgyQScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFJvb3REaXJlY3Rvcnk6ICdlZnNSb290RGlyJyxcbiAgICAgICAgICAgICAgVHJhbnNpdEVuY3J5cHRpb25Qb3J0OiAyMDE4MSxcbiAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbkNvbmZpZzoge1xuICAgICAgICAgICAgICAgIEFjY2Vzc1BvaW50SWQ6ICdFZnNWb2x1bWVBY2Nlc3NQb2ludElkJyxcbiAgICAgICAgICAgICAgICBJYW06ICdFTkFCTEVEJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBOYW1lOiAnZmlyc3RFZnNWb2x1bWUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgRWZzVm9sdW1lQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICBGaWxlU3lzdGVtSWQ6IHtcbiAgICAgICAgICAgICAgICBSZWY6ICdlZnMyQ0IzOTE2QzEnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE5hbWU6ICdzZWNvbmRFZnNWb2x1bWUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIE1vdW50UG9pbnRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ29udGFpbmVyUGF0aDogJy9maXJzdC9wYXRoJyxcbiAgICAgICAgICAgIFJlYWRPbmx5OiB0cnVlLFxuICAgICAgICAgICAgU291cmNlVm9sdW1lOiAnZmlyc3RFZnNWb2x1bWUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ29udGFpbmVyUGF0aDogJy9zZWNvbmQvcGF0aCcsXG4gICAgICAgICAgICBTb3VyY2VWb2x1bWU6ICdzZWNvbmRFZnNWb2x1bWUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNwZWN0cyBob3N0IHZvbHVtZXMnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBFY3NKb2JEZWZpbml0aW9uKHN0YWNrLCAnRUNTSm9iRGVmbicsIHtcbiAgICAgIGNvbnRhaW5lcjogbmV3IENvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdFY3NDb250YWluZXInLCB7XG4gICAgICAgIC4uLmRlZmF1bHRDb250YWluZXJQcm9wcyxcbiAgICAgICAgdm9sdW1lczogW1xuICAgICAgICAgIEVjc1ZvbHVtZS5ob3N0KHtcbiAgICAgICAgICAgIGNvbnRhaW5lclBhdGg6ICcvY29udGFpbmVyL3BhdGgnLFxuICAgICAgICAgICAgbmFtZTogJ0Vjc0hvc3RQYXRoVm9sdW1lJyxcbiAgICAgICAgICAgIGhvc3RQYXRoOiAnL2hvc3QvcGF0aCcsXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgQ29udGFpbmVyUHJvcGVydGllczoge1xuICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Db250YWluZXJQcm9wZXJ0aWVzLFxuICAgICAgICBWb2x1bWVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgTmFtZTogJ0Vjc0hvc3RQYXRoVm9sdW1lJyxcbiAgICAgICAgICAgIEhvc3Q6IHtcbiAgICAgICAgICAgICAgU291cmNlUGF0aDogJy9ob3N0L3BhdGgnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBNb3VudFBvaW50czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENvbnRhaW5lclBhdGg6ICcvY29udGFpbmVyL3BhdGgnLFxuICAgICAgICAgICAgU291cmNlVm9sdW1lOiAnRWNzSG9zdFBhdGhWb2x1bWUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNwZWN0cyBhZGRWb2x1bWUoKSB3aXRoIGFuIEVmc1ZvbHVtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGpvYkRlZm4gPSBuZXcgRWNzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0VDU0pvYkRlZm4nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnRWNzQ29udGFpbmVyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBqb2JEZWZuLmNvbnRhaW5lci5hZGRWb2x1bWUoRWNzVm9sdW1lLmVmcyh7XG4gICAgICBjb250YWluZXJQYXRoOiAnL2NvbnRhaW5lci9wYXRoJyxcbiAgICAgIGZpbGVTeXN0ZW06IG5ldyBlZnMuRmlsZVN5c3RlbShzdGFjaywgJ2VmcycsIHtcbiAgICAgICAgdnBjOiBuZXcgVnBjKHN0YWNrLCAndnBjJyksXG4gICAgICB9KSxcbiAgICAgIG5hbWU6ICdBZGRlZEVmc1ZvbHVtZScsXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpKb2JEZWZpbml0aW9uJywge1xuICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMsXG4gICAgICBDb250YWluZXJQcm9wZXJ0aWVzOiB7XG4gICAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLkNvbnRhaW5lclByb3BlcnRpZXMsXG4gICAgICAgIFZvbHVtZXM6IFt7XG4gICAgICAgICAgTmFtZTogJ0FkZGVkRWZzVm9sdW1lJyxcbiAgICAgICAgICBFZnNWb2x1bWVDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBGaWxlU3lzdGVtSWQ6IHtcbiAgICAgICAgICAgICAgUmVmOiAnZWZzNkMxNzk4MkEnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9XSxcbiAgICAgICAgTW91bnRQb2ludHM6IFt7XG4gICAgICAgICAgQ29udGFpbmVyUGF0aDogJy9jb250YWluZXIvcGF0aCcsXG4gICAgICAgICAgU291cmNlVm9sdW1lOiAnQWRkZWRFZnNWb2x1bWUnLFxuICAgICAgICB9XSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc3BlY3RzIGFkZFZvbHVtZSgpIHdpdGggYSBob3N0IHZvbHVtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGpvYkRlZm4gPSBuZXcgRWNzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0VDU0pvYkRlZm4nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnRWNzQ29udGFpbmVyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBqb2JEZWZuLmNvbnRhaW5lci5hZGRWb2x1bWUoRWNzVm9sdW1lLmhvc3Qoe1xuICAgICAgY29udGFpbmVyUGF0aDogJy9jb250YWluZXIvcGF0aC9uZXcnLFxuICAgICAgbmFtZTogJ2hvc3ROYW1lJyxcbiAgICAgIGhvc3RQYXRoOiAnL2hvc3QvcGF0aCcsXG4gICAgICByZWFkb25seTogZmFsc2UsXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpKb2JEZWZpbml0aW9uJywge1xuICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMsXG4gICAgICBDb250YWluZXJQcm9wZXJ0aWVzOiB7XG4gICAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLkNvbnRhaW5lclByb3BlcnRpZXMsXG4gICAgICAgIFZvbHVtZXM6IFt7XG4gICAgICAgICAgTmFtZTogJ2hvc3ROYW1lJyxcbiAgICAgICAgICBIb3N0OiB7XG4gICAgICAgICAgICBTb3VyY2VQYXRoOiAnL2hvc3QvcGF0aCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfV0sXG4gICAgICAgIE1vdW50UG9pbnRzOiBbe1xuICAgICAgICAgIENvbnRhaW5lclBhdGg6ICcvY29udGFpbmVyL3BhdGgvbmV3JyxcbiAgICAgICAgICBTb3VyY2VWb2x1bWU6ICdob3N0TmFtZScsXG4gICAgICAgIH1dLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY29ycmVjdGx5IHJlbmRlcnMgZG9ja2VyIGltYWdlcycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEVjc0pvYkRlZmluaXRpb24oc3RhY2ssICdFQ1NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0NvbnRhaW5lcicsIHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnRhaW5lclByb3BzLFxuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21Eb2NrZXJJbWFnZUFzc2V0KG5ldyBEb2NrZXJJbWFnZUFzc2V0KHN0YWNrLCAnZG9ja2VySW1hZ2VBc3NldCcsIHtcbiAgICAgICAgICBkaXJlY3Rvcnk6IHBhdGguam9pbihfX2Rpcm5hbWUsICdiYXRjaGpvYi1pbWFnZScpLFxuICAgICAgICB9KSksXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgQ29udGFpbmVyUHJvcGVydGllczoge1xuICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Db250YWluZXJQcm9wZXJ0aWVzLFxuICAgICAgICBJbWFnZToge1xuICAgICAgICAgICdGbjo6U3ViJzogJyR7QVdTOjpBY2NvdW50SWR9LmRrci5lY3IuJHtBV1M6OlJlZ2lvbn0uJHtBV1M6OlVSTFN1ZmZpeH0vY2RrLWhuYjY1OWZkcy1jb250YWluZXItYXNzZXRzLSR7QVdTOjpBY2NvdW50SWR9LSR7QVdTOjpSZWdpb259OjhiNTE4MjQzZWNiZmNmZDA4YjQ3MzQwNjllN2U3NGZmOTdiNzg4OWRmZGUwYTYwZDE2ZTdiZGM5NmU2YzU5M2InLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY29ycmVjdGx5IHJlbmRlcnMgaW1hZ2VzIGZyb20gcmVwb3NpdG9yaWVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgcmVwbyA9IG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgRWNzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0VDU0pvYkRlZm4nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnRWNzQ29udGFpbmVyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbUVjclJlcG9zaXRvcnkocmVwbywgJ215LXRhZycpLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcyxcbiAgICAgIENvbnRhaW5lclByb3BlcnRpZXM6IHtcbiAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuQ29udGFpbmVyUHJvcGVydGllcyxcbiAgICAgICAgSW1hZ2U6IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAgICAgNCxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnUmVwbzAyQUM4NkNGJywgJ0FybiddIH0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICcuZGtyLmVjci4nLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgICAzLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydSZXBvMDJBQzg2Q0YnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJy4nLFxuICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6VVJMU3VmZml4JyB9LFxuICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgIHsgUmVmOiAnUmVwbzAyQUM4NkNGJyB9LFxuICAgICAgICAgICAgICAnOm15LXRhZycsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnRUMyIGNvbnRhaW5lcnMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgcGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMgPSBjYXBpdGFsaXplUHJvcGVydHlOYW1lcyhzdGFjaywge1xuICAgICAgLi4uZGVmYXVsdEV4cGVjdGVkUHJvcHMsXG4gICAgICBjb250YWluZXJQcm9wZXJ0aWVzOiB7XG4gICAgICAgIC4uLmRlZmF1bHRFeHBlY3RlZFByb3BzLmNvbnRhaW5lclByb3BlcnRpZXMsXG4gICAgICAgIGV4ZWN1dGlvblJvbGVBcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFsnRWNzRWMyQ29udGFpbmVyRXhlY3V0aW9uUm9sZTkwRTE4NjgwJywgJ0FybiddLFxuICAgICAgICB9IGFzIGFueSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc3BlY3RzIGFkZFVsaW1pdCgpJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgam9iRGVmbiA9IG5ldyBFY3NKb2JEZWZpbml0aW9uKHN0YWNrLCAnRUNTSm9iRGVmbicsIHtcbiAgICAgIGNvbnRhaW5lcjogbmV3IEVjc0VjMkNvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdFY3NFYzJDb250YWluZXInLCB7XG4gICAgICAgIC4uLmRlZmF1bHRDb250YWluZXJQcm9wcyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIChqb2JEZWZuLmNvbnRhaW5lciBhcyBJRWNzRWMyQ29udGFpbmVyRGVmaW5pdGlvbikuYWRkVWxpbWl0KHtcbiAgICAgIGhhcmRMaW1pdDogMTAsXG4gICAgICBuYW1lOiBVbGltaXROYW1lLlNJR1BFTkRJTkcsXG4gICAgICBzb2Z0TGltaXQ6IDEsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcyxcbiAgICAgIENvbnRhaW5lclByb3BlcnRpZXM6IHtcbiAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuQ29udGFpbmVyUHJvcGVydGllcyxcbiAgICAgICAgVWxpbWl0czogW3tcbiAgICAgICAgICBIYXJkTGltaXQ6IDEwLFxuICAgICAgICAgIFNvZnRMaW1pdDogMSxcbiAgICAgICAgICBOYW1lOiAnc2lncGVuZGluZycsXG4gICAgICAgIH1dLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzcGVjdHMgdWxpbWl0cycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEVjc0pvYkRlZmluaXRpb24oc3RhY2ssICdFQ1NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgRWNzRWMyQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0VjMkNvbnRhaW5lcicsIHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnRhaW5lclByb3BzLFxuICAgICAgICB1bGltaXRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaGFyZExpbWl0OiAxMDAsXG4gICAgICAgICAgICBuYW1lOiBVbGltaXROYW1lLkNPUkUsXG4gICAgICAgICAgICBzb2Z0TGltaXQ6IDEwLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgQ29udGFpbmVyUHJvcGVydGllczoge1xuICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Db250YWluZXJQcm9wZXJ0aWVzLFxuICAgICAgICBVbGltaXRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgSGFyZExpbWl0OiAxMDAsXG4gICAgICAgICAgICBOYW1lOiAnY29yZScsXG4gICAgICAgICAgICBTb2Z0TGltaXQ6IDEwLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNwZWN0cyBwcml2aWxlZ2VkJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgRWNzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0VDU0pvYkRlZm4nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBFY3NFYzJDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnRWNzRWMyQ29udGFpbmVyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICAgIHByaXZpbGVnZWQ6IHRydWUsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgQ29udGFpbmVyUHJvcGVydGllczoge1xuICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Db250YWluZXJQcm9wZXJ0aWVzLFxuICAgICAgICBQcml2aWxlZ2VkOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzcGVjdHMgZ3B1JywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgRWNzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0VDU0pvYkRlZm4nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBFY3NFYzJDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnRWNzRWMyQ29udGFpbmVyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICAgIHByaXZpbGVnZWQ6IHRydWUsXG4gICAgICAgIGdwdTogMTIsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgQ29udGFpbmVyUHJvcGVydGllczoge1xuICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Db250YWluZXJQcm9wZXJ0aWVzLFxuICAgICAgICBSZXNvdXJjZVJlcXVpcmVtZW50czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFR5cGU6ICdNRU1PUlknLFxuICAgICAgICAgICAgVmFsdWU6ICcyMDQ4JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFR5cGU6ICdWQ1BVJyxcbiAgICAgICAgICAgIFZhbHVlOiAnMjU2JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFR5cGU6ICdHUFUnLFxuICAgICAgICAgICAgVmFsdWU6ICcxMicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiB1c2UgYW4gYXNzc2V0IGFzIGEgY29udGFpbmVyJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgRWNzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0VDU0pvYkRlZm4nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBFY3NFYzJDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnRWNzRWMyQ29udGFpbmVyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbUFzc2V0KFxuICAgICAgICAgIHBhdGguam9pbihfX2Rpcm5hbWUsICdiYXRjaGpvYi1pbWFnZScpLFxuICAgICAgICApLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcyxcbiAgICAgIENvbnRhaW5lclByb3BlcnRpZXM6IHtcbiAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuQ29udGFpbmVyUHJvcGVydGllcyxcbiAgICAgICAgSW1hZ2U6IHtcbiAgICAgICAgICAnRm46OlN1Yic6ICcke0FXUzo6QWNjb3VudElkfS5ka3IuZWNyLiR7QVdTOjpSZWdpb259LiR7QVdTOjpVUkxTdWZmaXh9L2Nkay1obmI2NTlmZHMtY29udGFpbmVyLWFzc2V0cy0ke0FXUzo6QWNjb3VudElkfS0ke0FXUzo6UmVnaW9ufTo4YjUxODI0M2VjYmZjZmQwOGI0NzM0MDY5ZTdlNzRmZjk3Yjc4ODlkZmRlMGE2MGQxNmU3YmRjOTZlNmM1OTNiJyxcbiAgICAgICAgfSxcbiAgICAgICAgRXhlY3V0aW9uUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnRWNzRWMyQ29udGFpbmVyRXhlY3V0aW9uUm9sZTkwRTE4NjgwJywgJ0FybiddIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnRmFyZ2F0ZSBjb250YWluZXJzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIHBhc2NhbENhc2VFeHBlY3RlZFByb3BzID0gY2FwaXRhbGl6ZVByb3BlcnR5TmFtZXMoc3RhY2ssIHtcbiAgICAgIC4uLmRlZmF1bHRFeHBlY3RlZFByb3BzLFxuICAgICAgY29udGFpbmVyUHJvcGVydGllczoge1xuICAgICAgICAuLi5kZWZhdWx0RXhwZWN0ZWRQcm9wcy5jb250YWluZXJQcm9wZXJ0aWVzLFxuICAgICAgICBleGVjdXRpb25Sb2xlQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ0Vjc0NvbnRhaW5lckV4ZWN1dGlvblJvbGUzQjE5OTI5MycsICdBcm4nXSxcbiAgICAgICAgfSBhcyBhbnksXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgZXhlY3V0aW9uUm9sZSBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgRWNzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0VDU0pvYkRlZm4nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBFY3NGYXJnYXRlQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0ZhcmdhdGVDb250YWluZXInLCB7XG4gICAgICAgIC4uLmRlZmF1bHRDb250YWluZXJQcm9wcyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpKb2JEZWZpbml0aW9uJywge1xuICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMsXG4gICAgICBDb250YWluZXJQcm9wZXJ0aWVzOiB7XG4gICAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLkNvbnRhaW5lclByb3BlcnRpZXMsXG4gICAgICAgIEV4ZWN1dGlvblJvbGVBcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFsnRWNzRmFyZ2F0ZUNvbnRhaW5lckV4ZWN1dGlvblJvbGUzMjg2RUFGRScsICdBcm4nXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbe1xuICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICdlY3MtdGFza3MuYW1hem9uYXdzLmNvbScgfSxcbiAgICAgICAgfV0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBzZXQgZXBoZW1lcmFsU3RvcmFnZVNpemUnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBFY3NKb2JEZWZpbml0aW9uKHN0YWNrLCAnRUNTSm9iRGVmbicsIHtcbiAgICAgIGNvbnRhaW5lcjogbmV3IEVjc0ZhcmdhdGVDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnRWNzRmFyZ2F0ZUNvbnRhaW5lcicsIHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnRhaW5lclByb3BzLFxuICAgICAgICBmYXJnYXRlUGxhdGZvcm1WZXJzaW9uOiBlY3MuRmFyZ2F0ZVBsYXRmb3JtVmVyc2lvbi5MQVRFU1QsXG4gICAgICAgIGVwaGVtZXJhbFN0b3JhZ2VTaXplOiBTaXplLmdpYmlieXRlcygxMDApLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcyxcbiAgICAgIENvbnRhaW5lclByb3BlcnRpZXM6IHtcbiAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuQ29udGFpbmVyUHJvcGVydGllcyxcbiAgICAgICAgRXhlY3V0aW9uUm9sZUFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogWydFY3NGYXJnYXRlQ29udGFpbmVyRXhlY3V0aW9uUm9sZTMyODZFQUZFJywgJ0FybiddLFxuICAgICAgICB9LFxuICAgICAgICBFcGhlbWVyYWxTdG9yYWdlOiB7XG4gICAgICAgICAgU2l6ZUluR2lCOiBTaXplLmdpYmlieXRlcygxMDApLnRvR2liaWJ5dGVzKCksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gc2V0IGVwaGVtZXJhbFN0b3JhZ2VTaXplIGFzIHRva2VuJywgKCkgPT4ge1xuICAgIGNvbnN0IGVwaGVtZXJhbFN0b3JhZ2VWYWx1ZTogbnVtYmVyID0gY2RrLlRva2VuLmFzTnVtYmVyKDE1MCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IEVjc0pvYkRlZmluaXRpb24oc3RhY2ssICdFQ1NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgRWNzRmFyZ2F0ZUNvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdFY3NGYXJnYXRlQ29udGFpbmVyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICAgIGZhcmdhdGVQbGF0Zm9ybVZlcnNpb246IGVjcy5GYXJnYXRlUGxhdGZvcm1WZXJzaW9uLkxBVEVTVCxcbiAgICAgICAgZXBoZW1lcmFsU3RvcmFnZVNpemU6IFNpemUuZ2liaWJ5dGVzKGVwaGVtZXJhbFN0b3JhZ2VWYWx1ZSksXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgQ29udGFpbmVyUHJvcGVydGllczoge1xuICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Db250YWluZXJQcm9wZXJ0aWVzLFxuICAgICAgICBFeGVjdXRpb25Sb2xlQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ0Vjc0ZhcmdhdGVDb250YWluZXJFeGVjdXRpb25Sb2xlMzI4NkVBRkUnLCAnQXJuJ10sXG4gICAgICAgIH0sXG4gICAgICAgIEVwaGVtZXJhbFN0b3JhZ2U6IHtcbiAgICAgICAgICBTaXplSW5HaUI6IFNpemUuZ2liaWJ5dGVzKDE1MCkudG9HaWJpYnl0ZXMoKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2VwaGVtZXJhbFN0b3JhZ2VTaXplIHRocm93cyBlcnJvciB3aGVuIG91dCBvZiByYW5nZScsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gbmV3IEVjc0pvYkRlZmluaXRpb24oc3RhY2ssICdFQ1NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgRWNzRmFyZ2F0ZUNvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdFY3NGYXJnYXRlQ29udGFpbmVyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICAgIGZhcmdhdGVQbGF0Zm9ybVZlcnNpb246IGVjcy5GYXJnYXRlUGxhdGZvcm1WZXJzaW9uLkxBVEVTVCxcbiAgICAgICAgZXBoZW1lcmFsU3RvcmFnZVNpemU6IFNpemUuZ2liaWJ5dGVzKDE5KSxcbiAgICAgIH0pLFxuICAgIH0pKS50b1Rocm93KFwiRUNTIEZhcmdhdGUgY29udGFpbmVyICdFY3NGYXJnYXRlQ29udGFpbmVyJyBzcGVjaWZpZXMgJ2VwaGVtZXJhbFN0b3JhZ2VTaXplJyBhdCAxOSA8IDIxIEdCXCIpO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBFY3NKb2JEZWZpbml0aW9uKHN0YWNrLCAnRUNTSm9iRGVmbjInLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBFY3NGYXJnYXRlQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0ZhcmdhdGVDb250YWluZXIyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICAgIGZhcmdhdGVQbGF0Zm9ybVZlcnNpb246IGVjcy5GYXJnYXRlUGxhdGZvcm1WZXJzaW9uLkxBVEVTVCxcbiAgICAgICAgZXBoZW1lcmFsU3RvcmFnZVNpemU6IFNpemUuZ2liaWJ5dGVzKDIwMSksXG4gICAgICB9KSxcbiAgICB9KSkudG9UaHJvdyhcIkVDUyBGYXJnYXRlIGNvbnRhaW5lciAnRWNzRmFyZ2F0ZUNvbnRhaW5lcjInIHNwZWNpZmllcyAnZXBoZW1lcmFsU3RvcmFnZVNpemUnIGF0IDIwMSA+IDIwMCBHQlwiKTtcbiAgfSk7XG59KTtcbiJdfQ==