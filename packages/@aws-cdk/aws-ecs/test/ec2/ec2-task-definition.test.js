"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const aws_ecr_1 = require("@aws-cdk/aws-ecr");
const iam = require("@aws-cdk/aws-iam");
const secretsmanager = require("@aws-cdk/aws-secretsmanager");
const ssm = require("@aws-cdk/aws-ssm");
const cdk = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const ecs = require("../../lib");
describe('ec2 task definition', () => {
    describe('When creating an ECS TaskDefinition', () => {
        test('with only required properties set, it correctly sets default properties', () => {
            // GIVEN
            const stack = new cdk.Stack();
            new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Family: 'Ec2TaskDef',
                NetworkMode: ecs.NetworkMode.BRIDGE,
                RequiresCompatibilities: ['EC2'],
            });
            // test error if no container defs?
        });
        test('with all properties set', () => {
            // GIVEN
            const stack = new cdk.Stack();
            new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                executionRole: new iam.Role(stack, 'ExecutionRole', {
                    path: '/',
                    assumedBy: new iam.CompositePrincipal(new iam.ServicePrincipal('ecs.amazonaws.com'), new iam.ServicePrincipal('ecs-tasks.amazonaws.com')),
                }),
                family: 'ecs-tasks',
                networkMode: ecs.NetworkMode.AWS_VPC,
                ipcMode: ecs.IpcMode.HOST,
                pidMode: ecs.PidMode.TASK,
                placementConstraints: [ecs.PlacementConstraint.memberOf('attribute:ecs.instance-type =~ t2.*')],
                taskRole: new iam.Role(stack, 'TaskRole', {
                    assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
                }),
                volumes: [{
                        host: {
                            sourcePath: '/tmp/cache',
                        },
                        name: 'scratch',
                    }],
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ExecutionRoleArn: {
                    'Fn::GetAtt': [
                        'ExecutionRole605A040B',
                        'Arn',
                    ],
                },
                Family: 'ecs-tasks',
                NetworkMode: 'awsvpc',
                IpcMode: 'host',
                PidMode: 'task',
                PlacementConstraints: [
                    {
                        Expression: 'attribute:ecs.instance-type =~ t2.*',
                        Type: 'memberOf',
                    },
                ],
                RequiresCompatibilities: [
                    'EC2',
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': [
                        'TaskRole30FC0FBB',
                        'Arn',
                    ],
                },
                Volumes: [
                    {
                        Host: {
                            SourcePath: '/tmp/cache',
                        },
                        Name: 'scratch',
                    },
                ],
            });
        });
        test('correctly sets placement constraint', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            // WHEN
            taskDefinition.addPlacementConstraint(ecs.PlacementConstraint.memberOf('attribute:ecs.instance-type =~ t2.*'));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                PlacementConstraints: [
                    {
                        Expression: 'attribute:ecs.instance-type =~ t2.*',
                        Type: 'memberOf',
                    },
                ],
            });
        });
        test('correctly sets network mode', () => {
            // GIVEN
            const stack = new cdk.Stack();
            new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                networkMode: ecs.NetworkMode.AWS_VPC,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                NetworkMode: ecs.NetworkMode.AWS_VPC,
            });
        });
        test('correctly sets ipc mode', () => {
            // GIVEN
            const stack = new cdk.Stack();
            new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                ipcMode: ecs.IpcMode.TASK,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                IpcMode: ecs.IpcMode.TASK,
            });
        });
        test('correctly sets pid mode', () => {
            // GIVEN
            const stack = new cdk.Stack();
            new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                pidMode: ecs.PidMode.HOST,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                PidMode: ecs.PidMode.HOST,
            });
        });
        test('correctly sets containers', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            const container = taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            container.addPortMappings({
                containerPort: 3000,
            });
            container.addUlimits({
                hardLimit: 128,
                name: ecs.UlimitName.RSS,
                softLimit: 128,
            });
            container.addVolumesFrom({
                sourceContainer: 'foo',
                readOnly: true,
            });
            container.addToExecutionPolicy(new iam.PolicyStatement({
                resources: ['*'],
                actions: ['ecs:*'],
            }));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Family: 'Ec2TaskDef',
                ContainerDefinitions: [{
                        Essential: true,
                        Memory: 512,
                        Image: 'amazon/amazon-ecs-sample',
                        Name: 'web',
                        PortMappings: [{
                                ContainerPort: 3000,
                                HostPort: 0,
                                Protocol: aws_ec2_1.Protocol.TCP,
                            }],
                        Ulimits: [
                            {
                                HardLimit: 128,
                                Name: 'rss',
                                SoftLimit: 128,
                            },
                        ],
                        VolumesFrom: [
                            {
                                ReadOnly: true,
                                SourceContainer: 'foo',
                            },
                        ],
                    }],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Action: 'ecs:*',
                            Effect: 'Allow',
                            Resource: '*',
                        },
                    ],
                },
            });
        });
        test('all container definition options defined', () => {
            // GIVEN
            const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
            const stack = new cdk.Stack(app);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            const secret = new secretsmanager.Secret(stack, 'Secret');
            const parameter = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'Parameter', {
                parameterName: '/name',
                version: 1,
            });
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 2048,
                cpu: 256,
                disableNetworking: true,
                command: ['CMD env'],
                dnsSearchDomains: ['0.0.0.0'],
                dnsServers: ['1.1.1.1'],
                dockerLabels: { LABEL: 'label' },
                dockerSecurityOptions: ['ECS_SELINUX_CAPABLE=true'],
                entryPoint: ['/app/node_modules/.bin/cdk'],
                environment: { TEST_ENVIRONMENT_VARIABLE: 'test environment variable value' },
                environmentFiles: [ecs.EnvironmentFile.fromAsset(path.join(__dirname, '../demo-envfiles/test-envfile.env'))],
                essential: true,
                extraHosts: { EXTRAHOST: 'extra host' },
                healthCheck: {
                    command: ['curl localhost:8000'],
                    interval: cdk.Duration.seconds(20),
                    retries: 5,
                    startPeriod: cdk.Duration.seconds(10),
                },
                hostname: 'webHost',
                linuxParameters: new ecs.LinuxParameters(stack, 'LinuxParameters', {
                    initProcessEnabled: true,
                    sharedMemorySize: 1024,
                }),
                logging: new ecs.AwsLogDriver({ streamPrefix: 'prefix' }),
                memoryReservationMiB: 1024,
                privileged: true,
                readonlyRootFilesystem: true,
                secrets: {
                    SECRET: ecs.Secret.fromSecretsManager(secret),
                    PARAMETER: ecs.Secret.fromSsmParameter(parameter),
                },
                user: 'amazon',
                workingDirectory: 'app/',
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Family: 'Ec2TaskDef',
                ContainerDefinitions: [
                    {
                        Command: [
                            'CMD env',
                        ],
                        Cpu: 256,
                        DisableNetworking: true,
                        DnsSearchDomains: [
                            '0.0.0.0',
                        ],
                        DnsServers: [
                            '1.1.1.1',
                        ],
                        DockerLabels: {
                            LABEL: 'label',
                        },
                        DockerSecurityOptions: [
                            'ECS_SELINUX_CAPABLE=true',
                        ],
                        EntryPoint: [
                            '/app/node_modules/.bin/cdk',
                        ],
                        Environment: [
                            {
                                Name: 'TEST_ENVIRONMENT_VARIABLE',
                                Value: 'test environment variable value',
                            },
                        ],
                        EnvironmentFiles: [{
                                Type: 's3',
                                Value: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {
                                                Ref: 'AWS::Partition',
                                            },
                                            ':s3:::',
                                            {
                                                Ref: 'AssetParameters872561bf078edd1685d50c9ff821cdd60d2b2ddfb0013c4087e79bf2bb50724dS3Bucket7B2069B7',
                                            },
                                            '/',
                                            {
                                                'Fn::Select': [
                                                    0,
                                                    {
                                                        'Fn::Split': [
                                                            '||',
                                                            {
                                                                Ref: 'AssetParameters872561bf078edd1685d50c9ff821cdd60d2b2ddfb0013c4087e79bf2bb50724dS3VersionKey40E12C15',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                'Fn::Select': [
                                                    1,
                                                    {
                                                        'Fn::Split': [
                                                            '||',
                                                            {
                                                                Ref: 'AssetParameters872561bf078edd1685d50c9ff821cdd60d2b2ddfb0013c4087e79bf2bb50724dS3VersionKey40E12C15',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    ],
                                },
                            }],
                        Essential: true,
                        ExtraHosts: [
                            {
                                Hostname: 'EXTRAHOST',
                                IpAddress: 'extra host',
                            },
                        ],
                        HealthCheck: {
                            Command: [
                                'CMD-SHELL',
                                'curl localhost:8000',
                            ],
                            Interval: 20,
                            Retries: 5,
                            StartPeriod: 10,
                            Timeout: 5,
                        },
                        Hostname: 'webHost',
                        Image: 'amazon/amazon-ecs-sample',
                        LinuxParameters: {
                            Capabilities: {},
                            InitProcessEnabled: true,
                            SharedMemorySize: 1024,
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'Ec2TaskDefwebLogGroup7F786C6B',
                                },
                                'awslogs-stream-prefix': 'prefix',
                                'awslogs-region': {
                                    Ref: 'AWS::Region',
                                },
                            },
                        },
                        Memory: 2048,
                        MemoryReservation: 1024,
                        Name: 'web',
                        Privileged: true,
                        ReadonlyRootFilesystem: true,
                        Secrets: [
                            {
                                Name: 'SECRET',
                                ValueFrom: {
                                    Ref: 'SecretA720EF05',
                                },
                            },
                            {
                                Name: 'PARAMETER',
                                ValueFrom: {
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
                                            ':parameter/name',
                                        ],
                                    ],
                                },
                            },
                        ],
                        User: 'amazon',
                        WorkingDirectory: 'app/',
                    },
                ],
            });
        });
        test('correctly sets containers from ECR repository using all props', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromEcrRepository(new aws_ecr_1.Repository(stack, 'myECRImage', {
                    lifecycleRegistryId: '123456789101',
                    lifecycleRules: [{
                            rulePriority: 10,
                            tagPrefixList: ['abc'],
                            maxImageCount: 1,
                        }],
                    removalPolicy: cdk.RemovalPolicy.DESTROY,
                    repositoryName: 'project-a/amazon-ecs-sample',
                })),
                memoryLimitMiB: 512,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
                LifecyclePolicy: {
                    // eslint-disable-next-line max-len
                    LifecyclePolicyText: '{"rules":[{"rulePriority":10,"selection":{"tagStatus":"tagged","tagPrefixList":["abc"],"countType":"imageCountMoreThan","countNumber":1},"action":{"type":"expire"}}]}',
                    RegistryId: '123456789101',
                },
                RepositoryName: 'project-a/amazon-ecs-sample',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Family: 'Ec2TaskDef',
                ContainerDefinitions: [{
                        Essential: true,
                        Memory: 512,
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
                                                    {
                                                        'Fn::GetAtt': [
                                                            'myECRImage7DEAE474',
                                                            'Arn',
                                                        ],
                                                    },
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
                                                    {
                                                        'Fn::GetAtt': [
                                                            'myECRImage7DEAE474',
                                                            'Arn',
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    '.',
                                    {
                                        Ref: 'AWS::URLSuffix',
                                    },
                                    '/',
                                    {
                                        Ref: 'myECRImage7DEAE474',
                                    },
                                    ':latest',
                                ],
                            ],
                        },
                        Name: 'web',
                    }],
            });
        });
        test('correctly sets containers from ECR repository using an image tag', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromEcrRepository(new aws_ecr_1.Repository(stack, 'myECRImage'), 'myTag'),
                memoryLimitMiB: 512,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [{
                        Essential: true,
                        Memory: 512,
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
                                                    {
                                                        'Fn::GetAtt': [
                                                            'myECRImage7DEAE474',
                                                            'Arn',
                                                        ],
                                                    },
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
                                                    {
                                                        'Fn::GetAtt': [
                                                            'myECRImage7DEAE474',
                                                            'Arn',
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    '.',
                                    {
                                        Ref: 'AWS::URLSuffix',
                                    },
                                    '/',
                                    {
                                        Ref: 'myECRImage7DEAE474',
                                    },
                                    ':myTag',
                                ],
                            ],
                        },
                        Name: 'web',
                    }],
            });
        });
        test('correctly sets containers from ECR repository using an image digest', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromEcrRepository(new aws_ecr_1.Repository(stack, 'myECRImage'), 'sha256:94afd1f2e64d908bc90dbca0035a5b567EXAMPLE'),
                memoryLimitMiB: 512,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [{
                        Essential: true,
                        Memory: 512,
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
                                                    {
                                                        'Fn::GetAtt': [
                                                            'myECRImage7DEAE474',
                                                            'Arn',
                                                        ],
                                                    },
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
                                                    {
                                                        'Fn::GetAtt': [
                                                            'myECRImage7DEAE474',
                                                            'Arn',
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    '.',
                                    {
                                        Ref: 'AWS::URLSuffix',
                                    },
                                    '/',
                                    {
                                        Ref: 'myECRImage7DEAE474',
                                    },
                                    '@sha256:94afd1f2e64d908bc90dbca0035a5b567EXAMPLE',
                                ],
                            ],
                        },
                        Name: 'web',
                    }],
            });
        });
        test('correctly sets containers from ECR repository using default props', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            // WHEN
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromEcrRepository(new aws_ecr_1.Repository(stack, 'myECRImage')),
                memoryLimitMiB: 512,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {});
        });
        test('warns when setting containers from ECR repository using fromRegistry method', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            // WHEN
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY'),
                memoryLimitMiB: 512,
            });
            // THEN
            assertions_1.Annotations.fromStack(stack).hasWarning('/Default/Ec2TaskDef/web', "Proper policies need to be attached before pulling from ECR repository, or use 'fromEcrRepository'.");
        });
        test('warns when setting containers from ECR repository by creating a RepositoryImage class', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            const repo = new ecs.RepositoryImage('ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY');
            // WHEN
            taskDefinition.addContainer('web', {
                image: repo,
                memoryLimitMiB: 512,
            });
            // THEN
            assertions_1.Annotations.fromStack(stack).hasWarning('/Default/Ec2TaskDef/web', "Proper policies need to be attached before pulling from ECR repository, or use 'fromEcrRepository'.");
        });
        test('correctly sets containers from asset using all props', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromAsset(path.join(__dirname, '..', 'demo-image'), {
                    buildArgs: { HTTP_PROXY: 'http://10.20.30.2:1234' },
                }),
                memoryLimitMiB: 512,
            });
        });
        test('correctly sets scratch space', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            const container = taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            container.addScratch({
                containerPath: './cache',
                readOnly: true,
                sourcePath: '/tmp/cache',
                name: 'scratch',
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Family: 'Ec2TaskDef',
                ContainerDefinitions: [assertions_1.Match.objectLike({
                        MountPoints: [
                            {
                                ContainerPath: './cache',
                                ReadOnly: true,
                                SourceVolume: 'scratch',
                            },
                        ],
                    })],
                Volumes: [{
                        Host: {
                            SourcePath: '/tmp/cache',
                        },
                        Name: 'scratch',
                    }],
            });
        });
        test('correctly sets container dependenices', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            const dependency1 = taskDefinition.addContainer('dependency1', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            const dependency2 = taskDefinition.addContainer('dependency2', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            const container = taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            container.addContainerDependencies({
                container: dependency1,
            }, {
                container: dependency2,
                condition: ecs.ContainerDependencyCondition.SUCCESS,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Family: 'Ec2TaskDef',
                ContainerDefinitions: [assertions_1.Match.objectLike({
                        Name: 'dependency1',
                    }),
                    assertions_1.Match.objectLike({
                        Name: 'dependency2',
                    }),
                    assertions_1.Match.objectLike({
                        Name: 'web',
                        DependsOn: [{
                                Condition: 'HEALTHY',
                                ContainerName: 'dependency1',
                            },
                            {
                                Condition: 'SUCCESS',
                                ContainerName: 'dependency2',
                            }],
                    })],
            });
        });
        test('correctly sets links', () => {
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                networkMode: ecs.NetworkMode.BRIDGE,
            });
            const container = taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            const linkedContainer1 = taskDefinition.addContainer('linked1', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            const linkedContainer2 = taskDefinition.addContainer('linked2', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            container.addLink(linkedContainer1, 'linked');
            container.addLink(linkedContainer2);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    assertions_1.Match.objectLike({
                        Links: [
                            'linked1:linked',
                            'linked2',
                        ],
                        Name: 'web',
                    }),
                    assertions_1.Match.objectLike({
                        Name: 'linked1',
                    }),
                    assertions_1.Match.objectLike({
                        Name: 'linked2',
                    }),
                ],
            });
        });
        test('correctly set policy statement to the task IAM role', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            // WHEN
            taskDefinition.addToTaskRolePolicy(new iam.PolicyStatement({
                actions: ['test:SpecialName'],
                resources: ['*'],
            }));
            // THEN
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
        test('correctly sets volumes from', () => {
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {});
            const container = taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            container.addVolumesFrom({
                sourceContainer: 'SourceContainer',
                readOnly: true,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [assertions_1.Match.objectLike({
                        VolumesFrom: [
                            {
                                SourceContainer: 'SourceContainer',
                                ReadOnly: true,
                            },
                        ],
                    })],
            });
        });
        test('correctly set policy statement to the task execution IAM role', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            // WHEN
            taskDefinition.addToExecutionRolePolicy(new iam.PolicyStatement({
                actions: ['test:SpecialName'],
                resources: ['*'],
            }));
            // THEN
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
        test('correctly sets volumes', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const volume = {
                host: {
                    sourcePath: '/tmp/cache',
                },
                name: 'scratch',
            };
            // Adding volumes via props is a bit clunky
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                volumes: [volume],
            });
            const container = taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            // this needs to be a better API -- should auto-add volumes
            container.addMountPoints({
                containerPath: './cache',
                readOnly: true,
                sourceVolume: 'scratch',
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Family: 'Ec2TaskDef',
                ContainerDefinitions: [assertions_1.Match.objectLike({
                        MountPoints: [
                            {
                                ContainerPath: './cache',
                                ReadOnly: true,
                                SourceVolume: 'scratch',
                            },
                        ],
                    })],
                Volumes: [{
                        Host: {
                            SourcePath: '/tmp/cache',
                        },
                        Name: 'scratch',
                    }],
            });
        });
        test('correctly sets placement constraints', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                placementConstraints: [
                    ecs.PlacementConstraint.memberOf('attribute:ecs.instance-type =~ t2.*'),
                ],
            });
            taskDefinition.addContainer('web', {
                memoryLimitMiB: 1024,
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                PlacementConstraints: [
                    {
                        Expression: 'attribute:ecs.instance-type =~ t2.*',
                        Type: 'memberOf',
                    },
                ],
            });
        });
        test('correctly sets taskRole', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                taskRole: new iam.Role(stack, 'TaskRole', {
                    assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
                }),
            });
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                TaskRoleArn: stack.resolve(taskDefinition.taskRole.roleArn),
            });
        });
        test('automatically sets taskRole by default', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                TaskRoleArn: stack.resolve(taskDefinition.taskRole.roleArn),
            });
        });
        test('correctly sets dockerVolumeConfiguration', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const volume = {
                name: 'scratch',
                dockerVolumeConfiguration: {
                    driver: 'local',
                    scope: ecs.Scope.TASK,
                    driverOpts: {
                        key1: 'value',
                    },
                },
            };
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                volumes: [volume],
            });
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Family: 'Ec2TaskDef',
                Volumes: [{
                        Name: 'scratch',
                        DockerVolumeConfiguration: {
                            Driver: 'local',
                            Scope: 'task',
                            DriverOpts: {
                                key1: 'value',
                            },
                        },
                    }],
            });
        });
        test('correctly sets efsVolumeConfiguration', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const volume = {
                name: 'scratch',
                efsVolumeConfiguration: {
                    fileSystemId: 'local',
                },
            };
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                volumes: [volume],
            });
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Family: 'Ec2TaskDef',
                Volumes: [{
                        Name: 'scratch',
                        EFSVolumeConfiguration: {
                            FilesystemId: 'local',
                        },
                    }],
            });
        });
    });
    describe('setting inferenceAccelerators', () => {
        test('correctly sets inferenceAccelerators using props', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const inferenceAccelerators = [{
                    deviceName: 'device1',
                    deviceType: 'eia2.medium',
                }];
            // WHEN
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                inferenceAccelerators,
            });
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Family: 'Ec2TaskDef',
                InferenceAccelerators: [{
                        DeviceName: 'device1',
                        DeviceType: 'eia2.medium',
                    }],
            });
        });
        test('correctly sets inferenceAccelerators using props and addInferenceAccelerator method', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const inferenceAccelerators = [{
                    deviceName: 'device1',
                    deviceType: 'eia2.medium',
                }];
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                inferenceAccelerators,
            });
            // WHEN
            taskDefinition.addInferenceAccelerator({
                deviceName: 'device2',
                deviceType: 'eia2.large',
            });
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Family: 'Ec2TaskDef',
                InferenceAccelerators: [{
                        DeviceName: 'device1',
                        DeviceType: 'eia2.medium',
                    }, {
                        DeviceName: 'device2',
                        DeviceType: 'eia2.large',
                    }],
            });
        });
    });
    describe('When importing from an existing Ec2 TaskDefinition', () => {
        test('can succeed using TaskDefinition Arn', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const expectTaskDefinitionArn = 'TD_ARN';
            // WHEN
            const taskDefinition = ecs.Ec2TaskDefinition.fromEc2TaskDefinitionArn(stack, 'EC2_TD_ID', expectTaskDefinitionArn);
            // THEN
            expect(taskDefinition.taskDefinitionArn).toBe(expectTaskDefinitionArn);
        });
    });
    describe('When importing from an existing Ec2 TaskDefinition using attributes', () => {
        test('can set the imported task attribuets successfully', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const expectTaskDefinitionArn = 'TD_ARN';
            const expectNetworkMode = ecs.NetworkMode.AWS_VPC;
            const expectTaskRole = new iam.Role(stack, 'TaskRole', {
                assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
            });
            // WHEN
            const taskDefinition = ecs.Ec2TaskDefinition.fromEc2TaskDefinitionAttributes(stack, 'TD_ID', {
                taskDefinitionArn: expectTaskDefinitionArn,
                networkMode: expectNetworkMode,
                taskRole: expectTaskRole,
            });
            // THEN
            expect(taskDefinition.taskDefinitionArn).toBe(expectTaskDefinitionArn);
            expect(taskDefinition.compatibility).toBe(ecs.Compatibility.EC2);
            expect(taskDefinition.isEc2Compatible).toBeTruthy();
            expect(taskDefinition.isFargateCompatible).toBeFalsy();
            expect(taskDefinition.networkMode).toBe(expectNetworkMode);
            expect(taskDefinition.taskRole).toBe(expectTaskRole);
        });
        test('returns an Ec2 TaskDefinition that will throw an error when trying to access its yet to defined networkMode', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const expectTaskDefinitionArn = 'TD_ARN';
            const expectTaskRole = new iam.Role(stack, 'TaskRole', {
                assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
            });
            // WHEN
            const taskDefinition = ecs.Ec2TaskDefinition.fromEc2TaskDefinitionAttributes(stack, 'TD_ID', {
                taskDefinitionArn: expectTaskDefinitionArn,
                taskRole: expectTaskRole,
            });
            // THEN
            expect(() => taskDefinition.networkMode).toThrow('This operation requires the networkMode in ImportedTaskDefinition to be defined. ' +
                'Add the \'networkMode\' in ImportedTaskDefinitionProps to instantiate ImportedTaskDefinition');
        });
        test('returns an Ec2 TaskDefinition that will throw an error when trying to access its yet to defined taskRole', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const expectTaskDefinitionArn = 'TD_ARN';
            const expectNetworkMode = ecs.NetworkMode.AWS_VPC;
            // WHEN
            const taskDefinition = ecs.Ec2TaskDefinition.fromEc2TaskDefinitionAttributes(stack, 'TD_ID', {
                taskDefinitionArn: expectTaskDefinitionArn,
                networkMode: expectNetworkMode,
            });
            // THEN
            expect(() => { taskDefinition.taskRole; }).toThrow('This operation requires the taskRole in ImportedTaskDefinition to be defined. ' +
                'Add the \'taskRole\' in ImportedTaskDefinitionProps to instantiate ImportedTaskDefinition');
        });
    });
    test('throws when setting proxyConfiguration without networkMode AWS_VPC', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const proxyConfiguration = ecs.ProxyConfigurations.appMeshProxyConfiguration({
            containerName: 'envoy',
            properties: {
                ignoredUID: 1337,
                proxyIngressPort: 15000,
                proxyEgressPort: 15001,
                appPorts: [9080, 9081],
                egressIgnoredIPs: ['169.254.170.2', '169.254.169.254'],
            },
        });
        // THEN
        expect(() => {
            new ecs.Ec2TaskDefinition(stack, 'TaskDef', { networkMode: ecs.NetworkMode.BRIDGE, proxyConfiguration });
        }).toThrow(/ProxyConfiguration can only be used with AwsVpc network mode, got: bridge/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWMyLXRhc2stZGVmaW5pdGlvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZWMyLXRhc2stZGVmaW5pdGlvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLG9EQUFtRTtBQUNuRSw4Q0FBNEM7QUFDNUMsOENBQThDO0FBQzlDLHdDQUF3QztBQUN4Qyw4REFBOEQ7QUFDOUQsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQyx5Q0FBeUM7QUFDekMsaUNBQWlDO0FBRWpDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7SUFDbkMsUUFBUSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtRQUNuRCxJQUFJLENBQUMseUVBQXlFLEVBQUUsR0FBRyxFQUFFO1lBQ25GLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFFL0MsT0FBTztZQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDBCQUEwQixFQUFFO2dCQUMxRSxNQUFNLEVBQUUsWUFBWTtnQkFDcEIsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTTtnQkFDbkMsdUJBQXVCLEVBQUUsQ0FBQyxLQUFLLENBQUM7YUFDakMsQ0FBQyxDQUFDO1lBRUgsbUNBQW1DO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRTtZQUNuQyxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDOUIsSUFBSSxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtnQkFDN0MsYUFBYSxFQUFFLElBQUksR0FBRyxDQUFD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V0FBVyxFQUFFLGlCQUFpQjthQUMvQixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQ2hELGdGQUFnRjtnQkFDaEYsMkZBQTJGLENBQUMsQ0FBQztRQUNqRyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG9FQUFvRSxFQUFFLEdBQUcsRUFBRTtRQUM5RSxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMseUJBQXlCLENBQUM7WUFDM0UsYUFBYSxFQUFFLE9BQU87WUFDdEIsVUFBVSxFQUFFO2dCQUNWLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixnQkFBZ0IsRUFBRSxLQUFLO2dCQUN2QixlQUFlLEVBQUUsS0FBSztnQkFDdEIsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDdEIsZ0JBQWdCLEVBQUUsQ0FBQyxlQUFlLEVBQUUsaUJBQWlCLENBQUM7YUFDdkQ7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLElBQUksR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxXQUFXLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO1FBQzNHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywyRUFBMkUsQ0FBQyxDQUFDO0lBQzFGLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQW5ub3RhdGlvbnMsIE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgUHJvdG9jb2wgfSBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCB7IFJlcG9zaXRvcnkgfSBmcm9tICdAYXdzLWNkay9hd3MtZWNyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHNlY3JldHNtYW5hZ2VyIGZyb20gJ0Bhd3MtY2RrL2F3cy1zZWNyZXRzbWFuYWdlcic7XG5pbXBvcnQgKiBhcyBzc20gZnJvbSAnQGF3cy1jZGsvYXdzLXNzbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJy4uLy4uL2xpYic7XG5cbmRlc2NyaWJlKCdlYzIgdGFzayBkZWZpbml0aW9uJywgKCkgPT4ge1xuICBkZXNjcmliZSgnV2hlbiBjcmVhdGluZyBhbiBFQ1MgVGFza0RlZmluaXRpb24nLCAoKSA9PiB7XG4gICAgdGVzdCgnd2l0aCBvbmx5IHJlcXVpcmVkIHByb3BlcnRpZXMgc2V0LCBpdCBjb3JyZWN0bHkgc2V0cyBkZWZhdWx0IHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgICBGYW1pbHk6ICdFYzJUYXNrRGVmJyxcbiAgICAgICAgTmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5CUklER0UsXG4gICAgICAgIFJlcXVpcmVzQ29tcGF0aWJpbGl0aWVzOiBbJ0VDMiddLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIHRlc3QgZXJyb3IgaWYgbm8gY29udGFpbmVyIGRlZnM/XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIGFsbCBwcm9wZXJ0aWVzIHNldCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJywge1xuICAgICAgICBleGVjdXRpb25Sb2xlOiBuZXcgaWFtLlJvbGUoc3RhY2ssICdFeGVjdXRpb25Sb2xlJywge1xuICAgICAgICAgIHBhdGg6ICcvJyxcbiAgICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQ29tcG9zaXRlUHJpbmNpcGFsKFxuICAgICAgICAgICAgbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlY3MuYW1hem9uYXdzLmNvbScpLFxuICAgICAgICAgICAgbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlY3MtdGFza3MuYW1hem9uYXdzLmNvbScpLFxuICAgICAgICAgICksXG4gICAgICAgIH0pLFxuICAgICAgICBmYW1pbHk6ICdlY3MtdGFza3MnLFxuICAgICAgICBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLkFXU19WUEMsXG4gICAgICAgIGlwY01vZGU6IGVjcy5JcGNNb2RlLkhPU1QsXG4gICAgICAgIHBpZE1vZGU6IGVjcy5QaWRNb2RlLlRBU0ssXG4gICAgICAgIHBsYWNlbWVudENvbnN0cmFpbnRzOiBbZWNzLlBsYWNlbWVudENvbnN0cmFpbnQubWVtYmVyT2YoJ2F0dHJpYnV0ZTplY3MuaW5zdGFuY2UtdHlwZSA9fiB0Mi4qJyldLFxuICAgICAgICB0YXNrUm9sZTogbmV3IGlhbS5Sb2xlKHN0YWNrLCAnVGFza1JvbGUnLCB7XG4gICAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2Vjcy10YXNrcy5hbWF6b25hd3MuY29tJyksXG4gICAgICAgIH0pLFxuICAgICAgICB2b2x1bWVzOiBbe1xuICAgICAgICAgIGhvc3Q6IHtcbiAgICAgICAgICAgIHNvdXJjZVBhdGg6ICcvdG1wL2NhY2hlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIG5hbWU6ICdzY3JhdGNoJyxcbiAgICAgICAgfV0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgRXhlY3V0aW9uUm9sZUFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0V4ZWN1dGlvblJvbGU2MDVBMDQwQicsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBGYW1pbHk6ICdlY3MtdGFza3MnLFxuICAgICAgICBOZXR3b3JrTW9kZTogJ2F3c3ZwYycsXG4gICAgICAgIElwY01vZGU6ICdob3N0JyxcbiAgICAgICAgUGlkTW9kZTogJ3Rhc2snLFxuICAgICAgICBQbGFjZW1lbnRDb25zdHJhaW50czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEV4cHJlc3Npb246ICdhdHRyaWJ1dGU6ZWNzLmluc3RhbmNlLXR5cGUgPX4gdDIuKicsXG4gICAgICAgICAgICBUeXBlOiAnbWVtYmVyT2YnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFJlcXVpcmVzQ29tcGF0aWJpbGl0aWVzOiBbXG4gICAgICAgICAgJ0VDMicsXG4gICAgICAgIF0sXG4gICAgICAgIFRhc2tSb2xlQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnVGFza1JvbGUzMEZDMEZCQicsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBWb2x1bWVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgSG9zdDoge1xuICAgICAgICAgICAgICBTb3VyY2VQYXRoOiAnL3RtcC9jYWNoZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgTmFtZTogJ3NjcmF0Y2gnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NvcnJlY3RseSBzZXRzIHBsYWNlbWVudCBjb25zdHJhaW50JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRQbGFjZW1lbnRDb25zdHJhaW50KGVjcy5QbGFjZW1lbnRDb25zdHJhaW50Lm1lbWJlck9mKCdhdHRyaWJ1dGU6ZWNzLmluc3RhbmNlLXR5cGUgPX4gdDIuKicpKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgUGxhY2VtZW50Q29uc3RyYWludHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBFeHByZXNzaW9uOiAnYXR0cmlidXRlOmVjcy5pbnN0YW5jZS10eXBlID1+IHQyLionLFxuICAgICAgICAgICAgVHlwZTogJ21lbWJlck9mJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjb3JyZWN0bHkgc2V0cyBuZXR3b3JrIG1vZGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicsIHtcbiAgICAgICAgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5BV1NfVlBDLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIE5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQVdTX1ZQQyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY29ycmVjdGx5IHNldHMgaXBjIG1vZGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicsIHtcbiAgICAgICAgaXBjTW9kZTogZWNzLklwY01vZGUuVEFTSyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgICBJcGNNb2RlOiBlY3MuSXBjTW9kZS5UQVNLLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjb3JyZWN0bHkgc2V0cyBwaWQgbW9kZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJywge1xuICAgICAgICBwaWRNb2RlOiBlY3MuUGlkTW9kZS5IT1NULFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIFBpZE1vZGU6IGVjcy5QaWRNb2RlLkhPU1QsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NvcnJlY3RseSBzZXRzIGNvbnRhaW5lcnMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnKTtcblxuICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMiwgLy8gYWRkIHZhbGlkYXRpb24/XG4gICAgICB9KTtcblxuICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7XG4gICAgICAgIGNvbnRhaW5lclBvcnQ6IDMwMDAsXG4gICAgICB9KTtcblxuICAgICAgY29udGFpbmVyLmFkZFVsaW1pdHMoe1xuICAgICAgICBoYXJkTGltaXQ6IDEyOCxcbiAgICAgICAgbmFtZTogZWNzLlVsaW1pdE5hbWUuUlNTLFxuICAgICAgICBzb2Z0TGltaXQ6IDEyOCxcbiAgICAgIH0pO1xuXG4gICAgICBjb250YWluZXIuYWRkVm9sdW1lc0Zyb20oe1xuICAgICAgICBzb3VyY2VDb250YWluZXI6ICdmb28nLFxuICAgICAgICByZWFkT25seTogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICBjb250YWluZXIuYWRkVG9FeGVjdXRpb25Qb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgICBhY3Rpb25zOiBbJ2VjczoqJ10sXG4gICAgICB9KSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIEZhbWlseTogJ0VjMlRhc2tEZWYnLFxuICAgICAgICBDb250YWluZXJEZWZpbml0aW9uczogW3tcbiAgICAgICAgICBFc3NlbnRpYWw6IHRydWUsXG4gICAgICAgICAgTWVtb3J5OiA1MTIsXG4gICAgICAgICAgSW1hZ2U6ICdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnLFxuICAgICAgICAgIE5hbWU6ICd3ZWInLFxuICAgICAgICAgIFBvcnRNYXBwaW5nczogW3tcbiAgICAgICAgICAgIENvbnRhaW5lclBvcnQ6IDMwMDAsXG4gICAgICAgICAgICBIb3N0UG9ydDogMCxcbiAgICAgICAgICAgIFByb3RvY29sOiBQcm90b2NvbC5UQ1AsXG4gICAgICAgICAgfV0sXG4gICAgICAgICAgVWxpbWl0czogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBIYXJkTGltaXQ6IDEyOCxcbiAgICAgICAgICAgICAgTmFtZTogJ3JzcycsXG4gICAgICAgICAgICAgIFNvZnRMaW1pdDogMTI4LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFZvbHVtZXNGcm9tOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlYWRPbmx5OiB0cnVlLFxuICAgICAgICAgICAgICBTb3VyY2VDb250YWluZXI6ICdmb28nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ2VjczoqJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhbGwgY29udGFpbmVyIGRlZmluaXRpb24gb3B0aW9ucyBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xuXG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJyk7XG4gICAgICBjb25zdCBzZWNyZXQgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnU2VjcmV0Jyk7XG4gICAgICBjb25zdCBwYXJhbWV0ZXIgPSBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TZWN1cmVTdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHN0YWNrLCAnUGFyYW1ldGVyJywge1xuICAgICAgICBwYXJhbWV0ZXJOYW1lOiAnL25hbWUnLFxuICAgICAgICB2ZXJzaW9uOiAxLFxuICAgICAgfSk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiAyMDQ4LFxuICAgICAgICBjcHU6IDI1NixcbiAgICAgICAgZGlzYWJsZU5ldHdvcmtpbmc6IHRydWUsXG4gICAgICAgIGNvbW1hbmQ6IFsnQ01EIGVudiddLFxuICAgICAgICBkbnNTZWFyY2hEb21haW5zOiBbJzAuMC4wLjAnXSxcbiAgICAgICAgZG5zU2VydmVyczogWycxLjEuMS4xJ10sXG4gICAgICAgIGRvY2tlckxhYmVsczogeyBMQUJFTDogJ2xhYmVsJyB9LFxuICAgICAgICBkb2NrZXJTZWN1cml0eU9wdGlvbnM6IFsnRUNTX1NFTElOVVhfQ0FQQUJMRT10cnVlJ10sXG4gICAgICAgIGVudHJ5UG9pbnQ6IFsnL2FwcC9ub2RlX21vZHVsZXMvLmJpbi9jZGsnXSxcbiAgICAgICAgZW52aXJvbm1lbnQ6IHsgVEVTVF9FTlZJUk9OTUVOVF9WQVJJQUJMRTogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgdmFsdWUnIH0sXG4gICAgICAgIGVudmlyb25tZW50RmlsZXM6IFtlY3MuRW52aXJvbm1lbnRGaWxlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vZGVtby1lbnZmaWxlcy90ZXN0LWVudmZpbGUuZW52JykpXSxcbiAgICAgICAgZXNzZW50aWFsOiB0cnVlLFxuICAgICAgICBleHRyYUhvc3RzOiB7IEVYVFJBSE9TVDogJ2V4dHJhIGhvc3QnIH0sXG4gICAgICAgIGhlYWx0aENoZWNrOiB7XG4gICAgICAgICAgY29tbWFuZDogWydjdXJsIGxvY2FsaG9zdDo4MDAwJ10sXG4gICAgICAgICAgaW50ZXJ2YWw6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDIwKSxcbiAgICAgICAgICByZXRyaWVzOiA1LFxuICAgICAgICAgIHN0YXJ0UGVyaW9kOiBjZGsuRHVyYXRpb24uc2Vjb25kcygxMCksXG4gICAgICAgIH0sXG4gICAgICAgIGhvc3RuYW1lOiAnd2ViSG9zdCcsXG4gICAgICAgIGxpbnV4UGFyYW1ldGVyczogbmV3IGVjcy5MaW51eFBhcmFtZXRlcnMoc3RhY2ssICdMaW51eFBhcmFtZXRlcnMnLCB7XG4gICAgICAgICAgaW5pdFByb2Nlc3NFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIHNoYXJlZE1lbW9yeVNpemU6IDEwMjQsXG4gICAgICAgIH0pLFxuICAgICAgICBsb2dnaW5nOiBuZXcgZWNzLkF3c0xvZ0RyaXZlcih7IHN0cmVhbVByZWZpeDogJ3ByZWZpeCcgfSksXG4gICAgICAgIG1lbW9yeVJlc2VydmF0aW9uTWlCOiAxMDI0LFxuICAgICAgICBwcml2aWxlZ2VkOiB0cnVlLFxuICAgICAgICByZWFkb25seVJvb3RGaWxlc3lzdGVtOiB0cnVlLFxuICAgICAgICBzZWNyZXRzOiB7XG4gICAgICAgICAgU0VDUkVUOiBlY3MuU2VjcmV0LmZyb21TZWNyZXRzTWFuYWdlcihzZWNyZXQpLFxuICAgICAgICAgIFBBUkFNRVRFUjogZWNzLlNlY3JldC5mcm9tU3NtUGFyYW1ldGVyKHBhcmFtZXRlciksXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXI6ICdhbWF6b24nLFxuICAgICAgICB3b3JraW5nRGlyZWN0b3J5OiAnYXBwLycsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgRmFtaWx5OiAnRWMyVGFza0RlZicsXG4gICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ29tbWFuZDogW1xuICAgICAgICAgICAgICAnQ01EIGVudicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgQ3B1OiAyNTYsXG4gICAgICAgICAgICBEaXNhYmxlTmV0d29ya2luZzogdHJ1ZSxcbiAgICAgICAgICAgIERuc1NlYXJjaERvbWFpbnM6IFtcbiAgICAgICAgICAgICAgJzAuMC4wLjAnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIERuc1NlcnZlcnM6IFtcbiAgICAgICAgICAgICAgJzEuMS4xLjEnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIERvY2tlckxhYmVsczoge1xuICAgICAgICAgICAgICBMQUJFTDogJ2xhYmVsJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBEb2NrZXJTZWN1cml0eU9wdGlvbnM6IFtcbiAgICAgICAgICAgICAgJ0VDU19TRUxJTlVYX0NBUEFCTEU9dHJ1ZScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRW50cnlQb2ludDogW1xuICAgICAgICAgICAgICAnL2FwcC9ub2RlX21vZHVsZXMvLmJpbi9jZGsnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEVudmlyb25tZW50OiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBOYW1lOiAnVEVTVF9FTlZJUk9OTUVOVF9WQVJJQUJMRScsXG4gICAgICAgICAgICAgICAgVmFsdWU6ICd0ZXN0IGVudmlyb25tZW50IHZhcmlhYmxlIHZhbHVlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFbnZpcm9ubWVudEZpbGVzOiBbe1xuICAgICAgICAgICAgICBUeXBlOiAnczMnLFxuICAgICAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6czM6OjonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQXNzZXRQYXJhbWV0ZXJzODcyNTYxYmYwNzhlZGQxNjg1ZDUwYzlmZjgyMWNkZDYwZDJiMmRkZmIwMDEzYzQwODdlNzliZjJiYjUwNzI0ZFMzQnVja2V0N0IyMDY5QjcnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3x8JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBc3NldFBhcmFtZXRlcnM4NzI1NjFiZjA3OGVkZDE2ODVkNTBjOWZmODIxY2RkNjBkMmIyZGRmYjAwMTNjNDA4N2U3OWJmMmJiNTA3MjRkUzNWZXJzaW9uS2V5NDBFMTJDMTUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3x8JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBc3NldFBhcmFtZXRlcnM4NzI1NjFiZjA3OGVkZDE2ODVkNTBjOWZmODIxY2RkNjBkMmIyZGRmYjAwMTNjNDA4N2U3OWJmMmJiNTA3MjRkUzNWZXJzaW9uS2V5NDBFMTJDMTUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIEVzc2VudGlhbDogdHJ1ZSxcbiAgICAgICAgICAgIEV4dHJhSG9zdHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEhvc3RuYW1lOiAnRVhUUkFIT1NUJyxcbiAgICAgICAgICAgICAgICBJcEFkZHJlc3M6ICdleHRyYSBob3N0JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBIZWFsdGhDaGVjazoge1xuICAgICAgICAgICAgICBDb21tYW5kOiBbXG4gICAgICAgICAgICAgICAgJ0NNRC1TSEVMTCcsXG4gICAgICAgICAgICAgICAgJ2N1cmwgbG9jYWxob3N0OjgwMDAnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBJbnRlcnZhbDogMjAsXG4gICAgICAgICAgICAgIFJldHJpZXM6IDUsXG4gICAgICAgICAgICAgIFN0YXJ0UGVyaW9kOiAxMCxcbiAgICAgICAgICAgICAgVGltZW91dDogNSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBIb3N0bmFtZTogJ3dlYkhvc3QnLFxuICAgICAgICAgICAgSW1hZ2U6ICdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnLFxuICAgICAgICAgICAgTGludXhQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgIENhcGFiaWxpdGllczoge30sXG4gICAgICAgICAgICAgIEluaXRQcm9jZXNzRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgU2hhcmVkTWVtb3J5U2l6ZTogMTAyNCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBMb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgIExvZ0RyaXZlcjogJ2F3c2xvZ3MnLFxuICAgICAgICAgICAgICBPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgJ2F3c2xvZ3MtZ3JvdXAnOiB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdFYzJUYXNrRGVmd2ViTG9nR3JvdXA3Rjc4NkM2QicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnYXdzbG9ncy1zdHJlYW0tcHJlZml4JzogJ3ByZWZpeCcsXG4gICAgICAgICAgICAgICAgJ2F3c2xvZ3MtcmVnaW9uJzoge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgTWVtb3J5OiAyMDQ4LFxuICAgICAgICAgICAgTWVtb3J5UmVzZXJ2YXRpb246IDEwMjQsXG4gICAgICAgICAgICBOYW1lOiAnd2ViJyxcbiAgICAgICAgICAgIFByaXZpbGVnZWQ6IHRydWUsXG4gICAgICAgICAgICBSZWFkb25seVJvb3RGaWxlc3lzdGVtOiB0cnVlLFxuICAgICAgICAgICAgU2VjcmV0czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgTmFtZTogJ1NFQ1JFVCcsXG4gICAgICAgICAgICAgICAgVmFsdWVGcm9tOiB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdTZWNyZXRBNzIwRUYwNScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIE5hbWU6ICdQQVJBTUVURVInLFxuICAgICAgICAgICAgICAgIFZhbHVlRnJvbToge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnOnNzbTonLFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnOnBhcmFtZXRlci9uYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBVc2VyOiAnYW1hem9uJyxcbiAgICAgICAgICAgIFdvcmtpbmdEaXJlY3Rvcnk6ICdhcHAvJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjb3JyZWN0bHkgc2V0cyBjb250YWluZXJzIGZyb20gRUNSIHJlcG9zaXRvcnkgdXNpbmcgYWxsIHByb3BzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJyk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21FY3JSZXBvc2l0b3J5KG5ldyBSZXBvc2l0b3J5KHN0YWNrLCAnbXlFQ1JJbWFnZScsIHtcbiAgICAgICAgICBsaWZlY3ljbGVSZWdpc3RyeUlkOiAnMTIzNDU2Nzg5MTAxJyxcbiAgICAgICAgICBsaWZlY3ljbGVSdWxlczogW3tcbiAgICAgICAgICAgIHJ1bGVQcmlvcml0eTogMTAsXG4gICAgICAgICAgICB0YWdQcmVmaXhMaXN0OiBbJ2FiYyddLFxuICAgICAgICAgICAgbWF4SW1hZ2VDb3VudDogMSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgICAgIHJlcG9zaXRvcnlOYW1lOiAncHJvamVjdC1hL2FtYXpvbi1lY3Mtc2FtcGxlJyxcbiAgICAgICAgfSkpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUjo6UmVwb3NpdG9yeScsIHtcbiAgICAgICAgTGlmZWN5Y2xlUG9saWN5OiB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgICAgICBMaWZlY3ljbGVQb2xpY3lUZXh0OiAne1wicnVsZXNcIjpbe1wicnVsZVByaW9yaXR5XCI6MTAsXCJzZWxlY3Rpb25cIjp7XCJ0YWdTdGF0dXNcIjpcInRhZ2dlZFwiLFwidGFnUHJlZml4TGlzdFwiOltcImFiY1wiXSxcImNvdW50VHlwZVwiOlwiaW1hZ2VDb3VudE1vcmVUaGFuXCIsXCJjb3VudE51bWJlclwiOjF9LFwiYWN0aW9uXCI6e1widHlwZVwiOlwiZXhwaXJlXCJ9fV19JyxcbiAgICAgICAgICBSZWdpc3RyeUlkOiAnMTIzNDU2Nzg5MTAxJyxcbiAgICAgICAgfSxcbiAgICAgICAgUmVwb3NpdG9yeU5hbWU6ICdwcm9qZWN0LWEvYW1hem9uLWVjcy1zYW1wbGUnLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIEZhbWlseTogJ0VjMlRhc2tEZWYnLFxuICAgICAgICBDb250YWluZXJEZWZpbml0aW9uczogW3tcbiAgICAgICAgICBFc3NlbnRpYWw6IHRydWUsXG4gICAgICAgICAgTWVtb3J5OiA1MTIsXG4gICAgICAgICAgSW1hZ2U6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgNCxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdteUVDUkltYWdlN0RFQUU0NzQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICcuZGtyLmVjci4nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAgICAgICAzLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ215RUNSSW1hZ2U3REVBRTQ3NCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJy4nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6VVJMU3VmZml4JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICcvJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdteUVDUkltYWdlN0RFQUU0NzQnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzpsYXRlc3QnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIE5hbWU6ICd3ZWInLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY29ycmVjdGx5IHNldHMgY29udGFpbmVycyBmcm9tIEVDUiByZXBvc2l0b3J5IHVzaW5nIGFuIGltYWdlIHRhZycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tRWNyUmVwb3NpdG9yeShuZXcgUmVwb3NpdG9yeShzdGFjaywgJ215RUNSSW1hZ2UnKSwgJ215VGFnJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFt7XG4gICAgICAgICAgRXNzZW50aWFsOiB0cnVlLFxuICAgICAgICAgIE1lbW9yeTogNTEyLFxuICAgICAgICAgIEltYWdlOiB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgICAgIDQsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbXlFQ1JJbWFnZTdERUFFNDc0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnLmRrci5lY3IuJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgMyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdteUVDUkltYWdlN0RFQUU0NzQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICcuJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlVSTFN1ZmZpeCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnbXlFQ1JJbWFnZTdERUFFNDc0JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6bXlUYWcnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIE5hbWU6ICd3ZWInLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY29ycmVjdGx5IHNldHMgY29udGFpbmVycyBmcm9tIEVDUiByZXBvc2l0b3J5IHVzaW5nIGFuIGltYWdlIGRpZ2VzdCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tRWNyUmVwb3NpdG9yeShuZXcgUmVwb3NpdG9yeShzdGFjaywgJ215RUNSSW1hZ2UnKSwgJ3NoYTI1Njo5NGFmZDFmMmU2NGQ5MDhiYzkwZGJjYTAwMzVhNWI1NjdFWEFNUExFJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFt7XG4gICAgICAgICAgRXNzZW50aWFsOiB0cnVlLFxuICAgICAgICAgIE1lbW9yeTogNTEyLFxuICAgICAgICAgIEltYWdlOiB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgICAgIDQsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbXlFQ1JJbWFnZTdERUFFNDc0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnLmRrci5lY3IuJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgMyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdteUVDUkltYWdlN0RFQUU0NzQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICcuJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlVSTFN1ZmZpeCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnbXlFQ1JJbWFnZTdERUFFNDc0JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdAc2hhMjU2Ojk0YWZkMWYyZTY0ZDkwOGJjOTBkYmNhMDAzNWE1YjU2N0VYQU1QTEUnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIE5hbWU6ICd3ZWInLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY29ycmVjdGx5IHNldHMgY29udGFpbmVycyBmcm9tIEVDUiByZXBvc2l0b3J5IHVzaW5nIGRlZmF1bHQgcHJvcHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbUVjclJlcG9zaXRvcnkobmV3IFJlcG9zaXRvcnkoc3RhY2ssICdteUVDUkltYWdlJykpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUjo6UmVwb3NpdG9yeScsIHt9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dhcm5zIHdoZW4gc2V0dGluZyBjb250YWluZXJzIGZyb20gRUNSIHJlcG9zaXRvcnkgdXNpbmcgZnJvbVJlZ2lzdHJ5IG1ldGhvZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ0FDQ09VTlQuZGtyLmVjci5SRUdJT04uYW1hem9uYXdzLmNvbS9SRVBPU0lUT1JZJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5oYXNXYXJuaW5nKCcvRGVmYXVsdC9FYzJUYXNrRGVmL3dlYicsIFwiUHJvcGVyIHBvbGljaWVzIG5lZWQgdG8gYmUgYXR0YWNoZWQgYmVmb3JlIHB1bGxpbmcgZnJvbSBFQ1IgcmVwb3NpdG9yeSwgb3IgdXNlICdmcm9tRWNyUmVwb3NpdG9yeScuXCIpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnd2FybnMgd2hlbiBzZXR0aW5nIGNvbnRhaW5lcnMgZnJvbSBFQ1IgcmVwb3NpdG9yeSBieSBjcmVhdGluZyBhIFJlcG9zaXRvcnlJbWFnZSBjbGFzcycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICBjb25zdCByZXBvID0gbmV3IGVjcy5SZXBvc2l0b3J5SW1hZ2UoJ0FDQ09VTlQuZGtyLmVjci5SRUdJT04uYW1hem9uYXdzLmNvbS9SRVBPU0lUT1JZJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogcmVwbyxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBBbm5vdGF0aW9ucy5mcm9tU3RhY2soc3RhY2spLmhhc1dhcm5pbmcoJy9EZWZhdWx0L0VjMlRhc2tEZWYvd2ViJywgXCJQcm9wZXIgcG9saWNpZXMgbmVlZCB0byBiZSBhdHRhY2hlZCBiZWZvcmUgcHVsbGluZyBmcm9tIEVDUiByZXBvc2l0b3J5LCBvciB1c2UgJ2Zyb21FY3JSZXBvc2l0b3J5Jy5cIik7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjb3JyZWN0bHkgc2V0cyBjb250YWluZXJzIGZyb20gYXNzZXQgdXNpbmcgYWxsIHByb3BzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJyk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnZGVtby1pbWFnZScpLCB7XG4gICAgICAgICAgYnVpbGRBcmdzOiB7IEhUVFBfUFJPWFk6ICdodHRwOi8vMTAuMjAuMzAuMjoxMjM0JyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY29ycmVjdGx5IHNldHMgc2NyYXRjaCBzcGFjZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnKTtcblxuICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuXG4gICAgICBjb250YWluZXIuYWRkU2NyYXRjaCh7XG4gICAgICAgIGNvbnRhaW5lclBhdGg6ICcuL2NhY2hlJyxcbiAgICAgICAgcmVhZE9ubHk6IHRydWUsXG4gICAgICAgIHNvdXJjZVBhdGg6ICcvdG1wL2NhY2hlJyxcbiAgICAgICAgbmFtZTogJ3NjcmF0Y2gnLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIEZhbWlseTogJ0VjMlRhc2tEZWYnLFxuICAgICAgICBDb250YWluZXJEZWZpbml0aW9uczogW01hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIE1vdW50UG9pbnRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIENvbnRhaW5lclBhdGg6ICcuL2NhY2hlJyxcbiAgICAgICAgICAgICAgUmVhZE9ubHk6IHRydWUsXG4gICAgICAgICAgICAgIFNvdXJjZVZvbHVtZTogJ3NjcmF0Y2gnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KV0sXG4gICAgICAgIFZvbHVtZXM6IFt7XG4gICAgICAgICAgSG9zdDoge1xuICAgICAgICAgICAgU291cmNlUGF0aDogJy90bXAvY2FjaGUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgTmFtZTogJ3NjcmF0Y2gnLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY29ycmVjdGx5IHNldHMgY29udGFpbmVyIGRlcGVuZGVuaWNlcycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnKTtcblxuICAgICAgY29uc3QgZGVwZW5kZW5jeTEgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ2RlcGVuZGVuY3kxJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZGVwZW5kZW5jeTIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ2RlcGVuZGVuY3kyJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuXG4gICAgICBjb250YWluZXIuYWRkQ29udGFpbmVyRGVwZW5kZW5jaWVzKHtcbiAgICAgICAgY29udGFpbmVyOiBkZXBlbmRlbmN5MSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbnRhaW5lcjogZGVwZW5kZW5jeTIsXG4gICAgICAgIGNvbmRpdGlvbjogZWNzLkNvbnRhaW5lckRlcGVuZGVuY3lDb25kaXRpb24uU1VDQ0VTUyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgICBGYW1pbHk6ICdFYzJUYXNrRGVmJyxcbiAgICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBOYW1lOiAnZGVwZW5kZW5jeTEnLFxuICAgICAgICB9KSxcbiAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgTmFtZTogJ2RlcGVuZGVuY3kyJyxcbiAgICAgICAgfSksXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIE5hbWU6ICd3ZWInLFxuICAgICAgICAgIERlcGVuZHNPbjogW3tcbiAgICAgICAgICAgIENvbmRpdGlvbjogJ0hFQUxUSFknLFxuICAgICAgICAgICAgQ29udGFpbmVyTmFtZTogJ2RlcGVuZGVuY3kxJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIENvbmRpdGlvbjogJ1NVQ0NFU1MnLFxuICAgICAgICAgICAgQ29udGFpbmVyTmFtZTogJ2RlcGVuZGVuY3kyJyxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfSldLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjb3JyZWN0bHkgc2V0cyBsaW5rcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJywge1xuICAgICAgICBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLkJSSURHRSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGxpbmtlZENvbnRhaW5lcjEgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ2xpbmtlZDEnLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBsaW5rZWRDb250YWluZXIyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdsaW5rZWQyJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgY29udGFpbmVyLmFkZExpbmsobGlua2VkQ29udGFpbmVyMSwgJ2xpbmtlZCcpO1xuICAgICAgY29udGFpbmVyLmFkZExpbmsobGlua2VkQ29udGFpbmVyMik7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICBMaW5rczogW1xuICAgICAgICAgICAgICAnbGlua2VkMTpsaW5rZWQnLFxuICAgICAgICAgICAgICAnbGlua2VkMicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgTmFtZTogJ3dlYicsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICBOYW1lOiAnbGlua2VkMScsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICBOYW1lOiAnbGlua2VkMicsXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NvcnJlY3RseSBzZXQgcG9saWN5IHN0YXRlbWVudCB0byB0aGUgdGFzayBJQU0gcm9sZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgdGFza0RlZmluaXRpb24uYWRkVG9UYXNrUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFsndGVzdDpTcGVjaWFsTmFtZSddLFxuICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgfSkpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3Rlc3Q6U3BlY2lhbE5hbWUnLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NvcnJlY3RseSBzZXRzIHZvbHVtZXMgZnJvbScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJywge30pO1xuXG4gICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnRhaW5lci5hZGRWb2x1bWVzRnJvbSh7XG4gICAgICAgIHNvdXJjZUNvbnRhaW5lcjogJ1NvdXJjZUNvbnRhaW5lcicsXG4gICAgICAgIHJlYWRPbmx5OiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgVm9sdW1lc0Zyb206IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgU291cmNlQ29udGFpbmVyOiAnU291cmNlQ29udGFpbmVyJyxcbiAgICAgICAgICAgICAgUmVhZE9ubHk6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY29ycmVjdGx5IHNldCBwb2xpY3kgc3RhdGVtZW50IHRvIHRoZSB0YXNrIGV4ZWN1dGlvbiBJQU0gcm9sZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgdGFza0RlZmluaXRpb24uYWRkVG9FeGVjdXRpb25Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogWyd0ZXN0OlNwZWNpYWxOYW1lJ10sXG4gICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICB9KSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAndGVzdDpTcGVjaWFsTmFtZScsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY29ycmVjdGx5IHNldHMgdm9sdW1lcycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZvbHVtZSA9IHtcbiAgICAgICAgaG9zdDoge1xuICAgICAgICAgIHNvdXJjZVBhdGg6ICcvdG1wL2NhY2hlJyxcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZTogJ3NjcmF0Y2gnLFxuICAgICAgfTtcblxuICAgICAgLy8gQWRkaW5nIHZvbHVtZXMgdmlhIHByb3BzIGlzIGEgYml0IGNsdW5reVxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicsIHtcbiAgICAgICAgdm9sdW1lczogW3ZvbHVtZV0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuXG4gICAgICAvLyB0aGlzIG5lZWRzIHRvIGJlIGEgYmV0dGVyIEFQSSAtLSBzaG91bGQgYXV0by1hZGQgdm9sdW1lc1xuICAgICAgY29udGFpbmVyLmFkZE1vdW50UG9pbnRzKHtcbiAgICAgICAgY29udGFpbmVyUGF0aDogJy4vY2FjaGUnLFxuICAgICAgICByZWFkT25seTogdHJ1ZSxcbiAgICAgICAgc291cmNlVm9sdW1lOiAnc2NyYXRjaCcsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgRmFtaWx5OiAnRWMyVGFza0RlZicsXG4gICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgTW91bnRQb2ludHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQ29udGFpbmVyUGF0aDogJy4vY2FjaGUnLFxuICAgICAgICAgICAgICBSZWFkT25seTogdHJ1ZSxcbiAgICAgICAgICAgICAgU291cmNlVm9sdW1lOiAnc2NyYXRjaCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pXSxcbiAgICAgICAgVm9sdW1lczogW3tcbiAgICAgICAgICBIb3N0OiB7XG4gICAgICAgICAgICBTb3VyY2VQYXRoOiAnL3RtcC9jYWNoZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBOYW1lOiAnc2NyYXRjaCcsXG4gICAgICAgIH1dLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjb3JyZWN0bHkgc2V0cyBwbGFjZW1lbnQgY29uc3RyYWludHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJywge1xuICAgICAgICBwbGFjZW1lbnRDb25zdHJhaW50czogW1xuICAgICAgICAgIGVjcy5QbGFjZW1lbnRDb25zdHJhaW50Lm1lbWJlck9mKCdhdHRyaWJ1dGU6ZWNzLmluc3RhbmNlLXR5cGUgPX4gdDIuKicpLFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBtZW1vcnlMaW1pdE1pQjogMTAyNCxcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIFBsYWNlbWVudENvbnN0cmFpbnRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgRXhwcmVzc2lvbjogJ2F0dHJpYnV0ZTplY3MuaW5zdGFuY2UtdHlwZSA9fiB0Mi4qJyxcbiAgICAgICAgICAgIFR5cGU6ICdtZW1iZXJPZicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY29ycmVjdGx5IHNldHMgdGFza1JvbGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJywge1xuICAgICAgICB0YXNrUm9sZTogbmV3IGlhbS5Sb2xlKHN0YWNrLCAnVGFza1JvbGUnLCB7XG4gICAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2Vjcy10YXNrcy5hbWF6b25hd3MuY29tJyksXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgVGFza1JvbGVBcm46IHN0YWNrLnJlc29sdmUodGFza0RlZmluaXRpb24udGFza1JvbGUucm9sZUFybiksXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2F1dG9tYXRpY2FsbHkgc2V0cyB0YXNrUm9sZSBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgICBUYXNrUm9sZUFybjogc3RhY2sucmVzb2x2ZSh0YXNrRGVmaW5pdGlvbi50YXNrUm9sZS5yb2xlQXJuKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY29ycmVjdGx5IHNldHMgZG9ja2VyVm9sdW1lQ29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZvbHVtZSA9IHtcbiAgICAgICAgbmFtZTogJ3NjcmF0Y2gnLFxuICAgICAgICBkb2NrZXJWb2x1bWVDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgZHJpdmVyOiAnbG9jYWwnLFxuICAgICAgICAgIHNjb3BlOiBlY3MuU2NvcGUuVEFTSyxcbiAgICAgICAgICBkcml2ZXJPcHRzOiB7XG4gICAgICAgICAgICBrZXkxOiAndmFsdWUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJywge1xuICAgICAgICB2b2x1bWVzOiBbdm9sdW1lXSxcbiAgICAgIH0pO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIEZhbWlseTogJ0VjMlRhc2tEZWYnLFxuICAgICAgICBWb2x1bWVzOiBbe1xuICAgICAgICAgIE5hbWU6ICdzY3JhdGNoJyxcbiAgICAgICAgICBEb2NrZXJWb2x1bWVDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBEcml2ZXI6ICdsb2NhbCcsXG4gICAgICAgICAgICBTY29wZTogJ3Rhc2snLFxuICAgICAgICAgICAgRHJpdmVyT3B0czoge1xuICAgICAgICAgICAgICBrZXkxOiAndmFsdWUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY29ycmVjdGx5IHNldHMgZWZzVm9sdW1lQ29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHZvbHVtZSA9IHtcbiAgICAgICAgbmFtZTogJ3NjcmF0Y2gnLFxuICAgICAgICBlZnNWb2x1bWVDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgZmlsZVN5c3RlbUlkOiAnbG9jYWwnLFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicsIHtcbiAgICAgICAgdm9sdW1lczogW3ZvbHVtZV0sXG4gICAgICB9KTtcblxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgICBGYW1pbHk6ICdFYzJUYXNrRGVmJyxcbiAgICAgICAgVm9sdW1lczogW3tcbiAgICAgICAgICBOYW1lOiAnc2NyYXRjaCcsXG4gICAgICAgICAgRUZTVm9sdW1lQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgRmlsZXN5c3RlbUlkOiAnbG9jYWwnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH1dLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzZXR0aW5nIGluZmVyZW5jZUFjY2VsZXJhdG9ycycsICgpID0+IHtcbiAgICB0ZXN0KCdjb3JyZWN0bHkgc2V0cyBpbmZlcmVuY2VBY2NlbGVyYXRvcnMgdXNpbmcgcHJvcHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBpbmZlcmVuY2VBY2NlbGVyYXRvcnMgPSBbe1xuICAgICAgICBkZXZpY2VOYW1lOiAnZGV2aWNlMScsXG4gICAgICAgIGRldmljZVR5cGU6ICdlaWEyLm1lZGl1bScsXG4gICAgICB9XTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicsIHtcbiAgICAgICAgaW5mZXJlbmNlQWNjZWxlcmF0b3JzLFxuICAgICAgfSk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgRmFtaWx5OiAnRWMyVGFza0RlZicsXG4gICAgICAgIEluZmVyZW5jZUFjY2VsZXJhdG9yczogW3tcbiAgICAgICAgICBEZXZpY2VOYW1lOiAnZGV2aWNlMScsXG4gICAgICAgICAgRGV2aWNlVHlwZTogJ2VpYTIubWVkaXVtJyxcbiAgICAgICAgfV0sXG4gICAgICB9KTtcblxuICAgIH0pO1xuICAgIHRlc3QoJ2NvcnJlY3RseSBzZXRzIGluZmVyZW5jZUFjY2VsZXJhdG9ycyB1c2luZyBwcm9wcyBhbmQgYWRkSW5mZXJlbmNlQWNjZWxlcmF0b3IgbWV0aG9kJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgaW5mZXJlbmNlQWNjZWxlcmF0b3JzID0gW3tcbiAgICAgICAgZGV2aWNlTmFtZTogJ2RldmljZTEnLFxuICAgICAgICBkZXZpY2VUeXBlOiAnZWlhMi5tZWRpdW0nLFxuICAgICAgfV07XG5cbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnLCB7XG4gICAgICAgIGluZmVyZW5jZUFjY2VsZXJhdG9ycyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRJbmZlcmVuY2VBY2NlbGVyYXRvcih7XG4gICAgICAgIGRldmljZU5hbWU6ICdkZXZpY2UyJyxcbiAgICAgICAgZGV2aWNlVHlwZTogJ2VpYTIubGFyZ2UnLFxuICAgICAgfSk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgRmFtaWx5OiAnRWMyVGFza0RlZicsXG4gICAgICAgIEluZmVyZW5jZUFjY2VsZXJhdG9yczogW3tcbiAgICAgICAgICBEZXZpY2VOYW1lOiAnZGV2aWNlMScsXG4gICAgICAgICAgRGV2aWNlVHlwZTogJ2VpYTIubWVkaXVtJyxcbiAgICAgICAgfSwge1xuICAgICAgICAgIERldmljZU5hbWU6ICdkZXZpY2UyJyxcbiAgICAgICAgICBEZXZpY2VUeXBlOiAnZWlhMi5sYXJnZScsXG4gICAgICAgIH1dLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdXaGVuIGltcG9ydGluZyBmcm9tIGFuIGV4aXN0aW5nIEVjMiBUYXNrRGVmaW5pdGlvbicsICgpID0+IHtcbiAgICB0ZXN0KCdjYW4gc3VjY2VlZCB1c2luZyBUYXNrRGVmaW5pdGlvbiBBcm4nLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBleHBlY3RUYXNrRGVmaW5pdGlvbkFybiA9ICdURF9BUk4nO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IGVjcy5FYzJUYXNrRGVmaW5pdGlvbi5mcm9tRWMyVGFza0RlZmluaXRpb25Bcm4oc3RhY2ssICdFQzJfVERfSUQnLCBleHBlY3RUYXNrRGVmaW5pdGlvbkFybik7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCh0YXNrRGVmaW5pdGlvbi50YXNrRGVmaW5pdGlvbkFybikudG9CZShleHBlY3RUYXNrRGVmaW5pdGlvbkFybik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdXaGVuIGltcG9ydGluZyBmcm9tIGFuIGV4aXN0aW5nIEVjMiBUYXNrRGVmaW5pdGlvbiB1c2luZyBhdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAgIHRlc3QoJ2NhbiBzZXQgdGhlIGltcG9ydGVkIHRhc2sgYXR0cmlidWV0cyBzdWNjZXNzZnVsbHknLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBleHBlY3RUYXNrRGVmaW5pdGlvbkFybiA9ICdURF9BUk4nO1xuICAgICAgY29uc3QgZXhwZWN0TmV0d29ya01vZGUgPSBlY3MuTmV0d29ya01vZGUuQVdTX1ZQQztcbiAgICAgIGNvbnN0IGV4cGVjdFRhc2tSb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnVGFza1JvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlY3MtdGFza3MuYW1hem9uYXdzLmNvbScpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gZWNzLkVjMlRhc2tEZWZpbml0aW9uLmZyb21FYzJUYXNrRGVmaW5pdGlvbkF0dHJpYnV0ZXMoc3RhY2ssICdURF9JRCcsIHtcbiAgICAgICAgdGFza0RlZmluaXRpb25Bcm46IGV4cGVjdFRhc2tEZWZpbml0aW9uQXJuLFxuICAgICAgICBuZXR3b3JrTW9kZTogZXhwZWN0TmV0d29ya01vZGUsXG4gICAgICAgIHRhc2tSb2xlOiBleHBlY3RUYXNrUm9sZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QodGFza0RlZmluaXRpb24udGFza0RlZmluaXRpb25Bcm4pLnRvQmUoZXhwZWN0VGFza0RlZmluaXRpb25Bcm4pO1xuICAgICAgZXhwZWN0KHRhc2tEZWZpbml0aW9uLmNvbXBhdGliaWxpdHkpLnRvQmUoZWNzLkNvbXBhdGliaWxpdHkuRUMyKTtcbiAgICAgIGV4cGVjdCh0YXNrRGVmaW5pdGlvbi5pc0VjMkNvbXBhdGlibGUpLnRvQmVUcnV0aHkoKTtcbiAgICAgIGV4cGVjdCh0YXNrRGVmaW5pdGlvbi5pc0ZhcmdhdGVDb21wYXRpYmxlKS50b0JlRmFsc3koKTtcbiAgICAgIGV4cGVjdCh0YXNrRGVmaW5pdGlvbi5uZXR3b3JrTW9kZSkudG9CZShleHBlY3ROZXR3b3JrTW9kZSk7XG4gICAgICBleHBlY3QodGFza0RlZmluaXRpb24udGFza1JvbGUpLnRvQmUoZXhwZWN0VGFza1JvbGUpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncmV0dXJucyBhbiBFYzIgVGFza0RlZmluaXRpb24gdGhhdCB3aWxsIHRocm93IGFuIGVycm9yIHdoZW4gdHJ5aW5nIHRvIGFjY2VzcyBpdHMgeWV0IHRvIGRlZmluZWQgbmV0d29ya01vZGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBleHBlY3RUYXNrRGVmaW5pdGlvbkFybiA9ICdURF9BUk4nO1xuICAgICAgY29uc3QgZXhwZWN0VGFza1JvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdUYXNrUm9sZScsIHtcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2Vjcy10YXNrcy5hbWF6b25hd3MuY29tJyksXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBlY3MuRWMyVGFza0RlZmluaXRpb24uZnJvbUVjMlRhc2tEZWZpbml0aW9uQXR0cmlidXRlcyhzdGFjaywgJ1REX0lEJywge1xuICAgICAgICB0YXNrRGVmaW5pdGlvbkFybjogZXhwZWN0VGFza0RlZmluaXRpb25Bcm4sXG4gICAgICAgIHRhc2tSb2xlOiBleHBlY3RUYXNrUm9sZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4gdGFza0RlZmluaXRpb24ubmV0d29ya01vZGUpLnRvVGhyb3coXG4gICAgICAgICdUaGlzIG9wZXJhdGlvbiByZXF1aXJlcyB0aGUgbmV0d29ya01vZGUgaW4gSW1wb3J0ZWRUYXNrRGVmaW5pdGlvbiB0byBiZSBkZWZpbmVkLiAnICtcbiAgICAgICAgJ0FkZCB0aGUgXFwnbmV0d29ya01vZGVcXCcgaW4gSW1wb3J0ZWRUYXNrRGVmaW5pdGlvblByb3BzIHRvIGluc3RhbnRpYXRlIEltcG9ydGVkVGFza0RlZmluaXRpb24nKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3JldHVybnMgYW4gRWMyIFRhc2tEZWZpbml0aW9uIHRoYXQgd2lsbCB0aHJvdyBhbiBlcnJvciB3aGVuIHRyeWluZyB0byBhY2Nlc3MgaXRzIHlldCB0byBkZWZpbmVkIHRhc2tSb2xlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgZXhwZWN0VGFza0RlZmluaXRpb25Bcm4gPSAnVERfQVJOJztcbiAgICAgIGNvbnN0IGV4cGVjdE5ldHdvcmtNb2RlID0gZWNzLk5ldHdvcmtNb2RlLkFXU19WUEM7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gZWNzLkVjMlRhc2tEZWZpbml0aW9uLmZyb21FYzJUYXNrRGVmaW5pdGlvbkF0dHJpYnV0ZXMoc3RhY2ssICdURF9JRCcsIHtcbiAgICAgICAgdGFza0RlZmluaXRpb25Bcm46IGV4cGVjdFRhc2tEZWZpbml0aW9uQXJuLFxuICAgICAgICBuZXR3b3JrTW9kZTogZXhwZWN0TmV0d29ya01vZGUsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHsgdGFza0RlZmluaXRpb24udGFza1JvbGU7IH0pLnRvVGhyb3coXG4gICAgICAgICdUaGlzIG9wZXJhdGlvbiByZXF1aXJlcyB0aGUgdGFza1JvbGUgaW4gSW1wb3J0ZWRUYXNrRGVmaW5pdGlvbiB0byBiZSBkZWZpbmVkLiAnICtcbiAgICAgICAgJ0FkZCB0aGUgXFwndGFza1JvbGVcXCcgaW4gSW1wb3J0ZWRUYXNrRGVmaW5pdGlvblByb3BzIHRvIGluc3RhbnRpYXRlIEltcG9ydGVkVGFza0RlZmluaXRpb24nKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIHdoZW4gc2V0dGluZyBwcm94eUNvbmZpZ3VyYXRpb24gd2l0aG91dCBuZXR3b3JrTW9kZSBBV1NfVlBDJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBwcm94eUNvbmZpZ3VyYXRpb24gPSBlY3MuUHJveHlDb25maWd1cmF0aW9ucy5hcHBNZXNoUHJveHlDb25maWd1cmF0aW9uKHtcbiAgICAgIGNvbnRhaW5lck5hbWU6ICdlbnZveScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGlnbm9yZWRVSUQ6IDEzMzcsXG4gICAgICAgIHByb3h5SW5ncmVzc1BvcnQ6IDE1MDAwLFxuICAgICAgICBwcm94eUVncmVzc1BvcnQ6IDE1MDAxLFxuICAgICAgICBhcHBQb3J0czogWzkwODAsIDkwODFdLFxuICAgICAgICBlZ3Jlc3NJZ25vcmVkSVBzOiBbJzE2OS4yNTQuMTcwLjInLCAnMTY5LjI1NC4xNjkuMjU0J10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicsIHsgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5CUklER0UsIHByb3h5Q29uZmlndXJhdGlvbiB9KTtcbiAgICB9KS50b1Rocm93KC9Qcm94eUNvbmZpZ3VyYXRpb24gY2FuIG9ubHkgYmUgdXNlZCB3aXRoIEF3c1ZwYyBuZXR3b3JrIG1vZGUsIGdvdDogYnJpZGdlLyk7XG4gIH0pO1xufSk7XG4iXX0=