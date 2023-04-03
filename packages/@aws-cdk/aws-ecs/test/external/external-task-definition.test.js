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
const ecs = require("../../lib");
describe('external task definition', () => {
    describe('When creating an External TaskDefinition', () => {
        test('with only required properties set, it correctly sets default properties', () => {
            // GIVEN
            const stack = new cdk.Stack();
            new ecs.ExternalTaskDefinition(stack, 'ExternalTaskDef');
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Family: 'ExternalTaskDef',
                NetworkMode: ecs.NetworkMode.BRIDGE,
                RequiresCompatibilities: ['EXTERNAL'],
            });
        });
        test('with all properties set', () => {
            // GIVEN
            const stack = new cdk.Stack();
            new ecs.ExternalTaskDefinition(stack, 'ExternalTaskDef', {
                executionRole: new iam.Role(stack, 'ExecutionRole', {
                    path: '/',
                    assumedBy: new iam.CompositePrincipal(new iam.ServicePrincipal('ecs.amazonaws.com'), new iam.ServicePrincipal('ecs-tasks.amazonaws.com')),
                }),
                family: 'ecs-tasks',
                networkMode: ecs.NetworkMode.HOST,
                taskRole: new iam.Role(stack, 'TaskRole', {
                    assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
                }),
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
                NetworkMode: 'host',
                RequiresCompatibilities: [
                    'EXTERNAL',
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': [
                        'TaskRole30FC0FBB',
                        'Arn',
                    ],
                },
            });
        });
        test('error when an invalid networkmode is set', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // THEN
            expect(() => {
                new ecs.ExternalTaskDefinition(stack, 'ExternalTaskDef', {
                    networkMode: ecs.NetworkMode.AWS_VPC,
                });
            }).toThrow('External tasks can only have Bridge, Host or None network mode, got: awsvpc');
        });
        test('correctly sets containers', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'ExternalTaskDef');
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
            container.addToExecutionPolicy(new iam.PolicyStatement({
                resources: ['*'],
                actions: ['ecs:*'],
            }));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Family: 'ExternalTaskDef',
                NetworkMode: ecs.NetworkMode.BRIDGE,
                RequiresCompatibilities: ['EXTERNAL'],
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
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'ExternalTaskDef');
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
                secrets: {
                    SECRET: ecs.Secret.fromSecretsManager(secret),
                    PARAMETER: ecs.Secret.fromSsmParameter(parameter),
                },
                user: 'amazon',
                workingDirectory: 'app/',
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Family: 'ExternalTaskDef',
                NetworkMode: ecs.NetworkMode.BRIDGE,
                RequiresCompatibilities: ['EXTERNAL'],
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
                                                'Fn::Sub': 'cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}',
                                            },
                                            '/872561bf078edd1685d50c9ff821cdd60d2b2ddfb0013c4087e79bf2bb50724d.env',
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
                                    Ref: 'ExternalTaskDefwebLogGroup827719D6',
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
            const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'ExternalTaskDef');
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
                Family: 'ExternalTaskDef',
                NetworkMode: ecs.NetworkMode.BRIDGE,
                RequiresCompatibilities: ['EXTERNAL'],
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
    });
    test('correctly sets containers from ECR repository using an image tag', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'ExternalTaskDef');
        taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromEcrRepository(new aws_ecr_1.Repository(stack, 'myECRImage'), 'myTag'),
            memoryLimitMiB: 512,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            Family: 'ExternalTaskDef',
            NetworkMode: ecs.NetworkMode.BRIDGE,
            RequiresCompatibilities: ['EXTERNAL'],
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
        const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'ExternalTaskDef');
        taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromEcrRepository(new aws_ecr_1.Repository(stack, 'myECRImage'), 'sha256:94afd1f2e64d908bc90dbca0035a5b567EXAMPLE'),
            memoryLimitMiB: 512,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            Family: 'ExternalTaskDef',
            NetworkMode: ecs.NetworkMode.BRIDGE,
            RequiresCompatibilities: ['EXTERNAL'],
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
        const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'ExternalTaskDef');
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
        const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'ExternalTaskDef');
        // WHEN
        taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromRegistry('ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY'),
            memoryLimitMiB: 512,
        });
        // THEN
        assertions_1.Annotations.fromStack(stack).hasWarning('/Default/ExternalTaskDef/web', "Proper policies need to be attached before pulling from ECR repository, or use 'fromEcrRepository'.");
    });
    test('correctly sets volumes', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'ExternalTaskDef', {});
        // WHEN
        taskDefinition.addVolume({
            host: {
                sourcePath: '/tmp/cache',
            },
            name: 'scratch',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
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
    test('error when interferenceAccelerators set', () => {
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'ExternalTaskDef', {});
        // THEN
        expect(() => taskDefinition.addInferenceAccelerator({
            deviceName: 'device1',
            deviceType: 'eia2.medium',
        })).toThrow('Cannot use inference accelerators on tasks that run on External service');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZXJuYWwtdGFzay1kZWZpbml0aW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJleHRlcm5hbC10YXNrLWRlZmluaXRpb24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3QixvREFBNEQ7QUFDNUQsOENBQTRDO0FBQzVDLDhDQUE4QztBQUM5Qyx3Q0FBd0M7QUFDeEMsOERBQThEO0FBQzlELHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFDckMsaUNBQWlDO0FBRWpDLFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7SUFDeEMsUUFBUSxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsRUFBRTtRQUN4RCxJQUFJLENBQUMseUVBQXlFLEVBQUUsR0FBRyxFQUFFO1lBQ25GLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixJQUFJLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUV6RCxPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMEJBQTBCLEVBQUU7Z0JBQzFFLE1BQU0sRUFBRSxpQkFBaUI7Z0JBQ3pCLFdBQVcsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU07Z0JBQ25DLHVCQUF1QixFQUFFLENBQUMsVUFBVSxDQUFDO2FBQ3RDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRTtZQUNuQyxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDOUIsSUFBSSxHQUFHLENBQUMsc0JBQXNCLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFO2dCQUN2RCxhQUFhLEVBQUUsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFD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Q0FBQyxTQUFTLENBQUM7WUFDdkIsSUFBSSxFQUFFO2dCQUNKLFVBQVUsRUFBRSxZQUFZO2FBQ3pCO1lBQ0QsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDBCQUEwQixFQUFFO1lBQzFFLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxJQUFJLEVBQUU7d0JBQ0osVUFBVSxFQUFFLFlBQVk7cUJBQ3pCO29CQUNELElBQUksRUFBRSxTQUFTO2lCQUNoQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMseUNBQXlDLEVBQUUsR0FBRyxFQUFFO1FBQ25ELE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVwRixPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQztZQUNsRCxVQUFVLEVBQUUsU0FBUztZQUNyQixVQUFVLEVBQUUsYUFBYTtTQUMxQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMseUVBQXlFLENBQUMsQ0FBQztJQUN6RixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEFubm90YXRpb25zLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgUHJvdG9jb2wgfSBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCB7IFJlcG9zaXRvcnkgfSBmcm9tICdAYXdzLWNkay9hd3MtZWNyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHNlY3JldHNtYW5hZ2VyIGZyb20gJ0Bhd3MtY2RrL2F3cy1zZWNyZXRzbWFuYWdlcic7XG5pbXBvcnQgKiBhcyBzc20gZnJvbSAnQGF3cy1jZGsvYXdzLXNzbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnLi4vLi4vbGliJztcblxuZGVzY3JpYmUoJ2V4dGVybmFsIHRhc2sgZGVmaW5pdGlvbicsICgpID0+IHtcbiAgZGVzY3JpYmUoJ1doZW4gY3JlYXRpbmcgYW4gRXh0ZXJuYWwgVGFza0RlZmluaXRpb24nLCAoKSA9PiB7XG4gICAgdGVzdCgnd2l0aCBvbmx5IHJlcXVpcmVkIHByb3BlcnRpZXMgc2V0LCBpdCBjb3JyZWN0bHkgc2V0cyBkZWZhdWx0IHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBuZXcgZWNzLkV4dGVybmFsVGFza0RlZmluaXRpb24oc3RhY2ssICdFeHRlcm5hbFRhc2tEZWYnKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgRmFtaWx5OiAnRXh0ZXJuYWxUYXNrRGVmJyxcbiAgICAgICAgTmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5CUklER0UsXG4gICAgICAgIFJlcXVpcmVzQ29tcGF0aWJpbGl0aWVzOiBbJ0VYVEVSTkFMJ10sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggYWxsIHByb3BlcnRpZXMgc2V0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgbmV3IGVjcy5FeHRlcm5hbFRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRXh0ZXJuYWxUYXNrRGVmJywge1xuICAgICAgICBleGVjdXRpb25Sb2xlOiBuZXcgaWFtLlJvbGUoc3RhY2ssICdFeGVjdXRpb25Sb2xlJywge1xuICAgICAgICAgIHBhdGg6ICcvJyxcbiAgICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQ29tcG9zaXRlUHJpbmNpcGFsKFxuICAgICAgICAgICAgbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlY3MuYW1hem9uYXdzLmNvbScpLFxuICAgICAgICAgICAgbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlY3MtdGFza3MuYW1hem9uYXdzLmNvbScpLFxuICAgICAgICAgICksXG4gICAgICAgIH0pLFxuICAgICAgICBmYW1pbHk6ICdlY3MtdGFza3MnLFxuICAgICAgICBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLkhPU1QsXG4gICAgICAgIHRhc2tSb2xlOiBuZXcgaWFtLlJvbGUoc3RhY2ssICdUYXNrUm9sZScsIHtcbiAgICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZWNzLXRhc2tzLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgICAgfSksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgRXhlY3V0aW9uUm9sZUFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0V4ZWN1dGlvblJvbGU2MDVBMDQwQicsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBGYW1pbHk6ICdlY3MtdGFza3MnLFxuICAgICAgICBOZXR3b3JrTW9kZTogJ2hvc3QnLFxuICAgICAgICBSZXF1aXJlc0NvbXBhdGliaWxpdGllczogW1xuICAgICAgICAgICdFWFRFUk5BTCcsXG4gICAgICAgIF0sXG4gICAgICAgIFRhc2tSb2xlQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnVGFza1JvbGUzMEZDMEZCQicsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdlcnJvciB3aGVuIGFuIGludmFsaWQgbmV0d29ya21vZGUgaXMgc2V0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgZWNzLkV4dGVybmFsVGFza0RlZmluaXRpb24oc3RhY2ssICdFeHRlcm5hbFRhc2tEZWYnLCB7XG4gICAgICAgICAgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5BV1NfVlBDLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coJ0V4dGVybmFsIHRhc2tzIGNhbiBvbmx5IGhhdmUgQnJpZGdlLCBIb3N0IG9yIE5vbmUgbmV0d29yayBtb2RlLCBnb3Q6IGF3c3ZwYycpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY29ycmVjdGx5IHNldHMgY29udGFpbmVycycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkV4dGVybmFsVGFza0RlZmluaXRpb24oc3RhY2ssICdFeHRlcm5hbFRhc2tEZWYnKTtcblxuICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMiwgLy8gYWRkIHZhbGlkYXRpb24/XG4gICAgICB9KTtcblxuICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7XG4gICAgICAgIGNvbnRhaW5lclBvcnQ6IDMwMDAsXG4gICAgICB9KTtcblxuICAgICAgY29udGFpbmVyLmFkZFVsaW1pdHMoe1xuICAgICAgICBoYXJkTGltaXQ6IDEyOCxcbiAgICAgICAgbmFtZTogZWNzLlVsaW1pdE5hbWUuUlNTLFxuICAgICAgICBzb2Z0TGltaXQ6IDEyOCxcbiAgICAgIH0pO1xuXG4gICAgICBjb250YWluZXIuYWRkVG9FeGVjdXRpb25Qb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgICBhY3Rpb25zOiBbJ2VjczoqJ10sXG4gICAgICB9KSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIEZhbWlseTogJ0V4dGVybmFsVGFza0RlZicsXG4gICAgICAgIE5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQlJJREdFLFxuICAgICAgICBSZXF1aXJlc0NvbXBhdGliaWxpdGllczogWydFWFRFUk5BTCddLFxuICAgICAgICBDb250YWluZXJEZWZpbml0aW9uczogW3tcbiAgICAgICAgICBFc3NlbnRpYWw6IHRydWUsXG4gICAgICAgICAgTWVtb3J5OiA1MTIsXG4gICAgICAgICAgSW1hZ2U6ICdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnLFxuICAgICAgICAgIE5hbWU6ICd3ZWInLFxuICAgICAgICAgIFBvcnRNYXBwaW5nczogW3tcbiAgICAgICAgICAgIENvbnRhaW5lclBvcnQ6IDMwMDAsXG4gICAgICAgICAgICBIb3N0UG9ydDogMCxcbiAgICAgICAgICAgIFByb3RvY29sOiBQcm90b2NvbC5UQ1AsXG4gICAgICAgICAgfV0sXG4gICAgICAgICAgVWxpbWl0czogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBIYXJkTGltaXQ6IDEyOCxcbiAgICAgICAgICAgICAgTmFtZTogJ3JzcycsXG4gICAgICAgICAgICAgIFNvZnRMaW1pdDogMTI4LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ2VjczoqJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhbGwgY29udGFpbmVyIGRlZmluaXRpb24gb3B0aW9ucyBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FeHRlcm5hbFRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRXh0ZXJuYWxUYXNrRGVmJyk7XG4gICAgICBjb25zdCBzZWNyZXQgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnU2VjcmV0Jyk7XG4gICAgICBjb25zdCBwYXJhbWV0ZXIgPSBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TZWN1cmVTdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHN0YWNrLCAnUGFyYW1ldGVyJywge1xuICAgICAgICBwYXJhbWV0ZXJOYW1lOiAnL25hbWUnLFxuICAgICAgICB2ZXJzaW9uOiAxLFxuICAgICAgfSk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiAyMDQ4LFxuICAgICAgICBjcHU6IDI1NixcbiAgICAgICAgZGlzYWJsZU5ldHdvcmtpbmc6IHRydWUsXG4gICAgICAgIGNvbW1hbmQ6IFsnQ01EIGVudiddLFxuICAgICAgICBkbnNTZWFyY2hEb21haW5zOiBbJzAuMC4wLjAnXSxcbiAgICAgICAgZG5zU2VydmVyczogWycxLjEuMS4xJ10sXG4gICAgICAgIGRvY2tlckxhYmVsczogeyBMQUJFTDogJ2xhYmVsJyB9LFxuICAgICAgICBkb2NrZXJTZWN1cml0eU9wdGlvbnM6IFsnRUNTX1NFTElOVVhfQ0FQQUJMRT10cnVlJ10sXG4gICAgICAgIGVudHJ5UG9pbnQ6IFsnL2FwcC9ub2RlX21vZHVsZXMvLmJpbi9jZGsnXSxcbiAgICAgICAgZW52aXJvbm1lbnQ6IHsgVEVTVF9FTlZJUk9OTUVOVF9WQVJJQUJMRTogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgdmFsdWUnIH0sXG4gICAgICAgIGVudmlyb25tZW50RmlsZXM6IFtlY3MuRW52aXJvbm1lbnRGaWxlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vZGVtby1lbnZmaWxlcy90ZXN0LWVudmZpbGUuZW52JykpXSxcbiAgICAgICAgZXNzZW50aWFsOiB0cnVlLFxuICAgICAgICBleHRyYUhvc3RzOiB7IEVYVFJBSE9TVDogJ2V4dHJhIGhvc3QnIH0sXG4gICAgICAgIGhlYWx0aENoZWNrOiB7XG4gICAgICAgICAgY29tbWFuZDogWydjdXJsIGxvY2FsaG9zdDo4MDAwJ10sXG4gICAgICAgICAgaW50ZXJ2YWw6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDIwKSxcbiAgICAgICAgICByZXRyaWVzOiA1LFxuICAgICAgICAgIHN0YXJ0UGVyaW9kOiBjZGsuRHVyYXRpb24uc2Vjb25kcygxMCksXG4gICAgICAgIH0sXG4gICAgICAgIGhvc3RuYW1lOiAnd2ViSG9zdCcsXG4gICAgICAgIGxpbnV4UGFyYW1ldGVyczogbmV3IGVjcy5MaW51eFBhcmFtZXRlcnMoc3RhY2ssICdMaW51eFBhcmFtZXRlcnMnLCB7XG4gICAgICAgICAgaW5pdFByb2Nlc3NFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIHNoYXJlZE1lbW9yeVNpemU6IDEwMjQsXG4gICAgICAgIH0pLFxuICAgICAgICBsb2dnaW5nOiBuZXcgZWNzLkF3c0xvZ0RyaXZlcih7IHN0cmVhbVByZWZpeDogJ3ByZWZpeCcgfSksXG4gICAgICAgIG1lbW9yeVJlc2VydmF0aW9uTWlCOiAxMDI0LFxuICAgICAgICBzZWNyZXRzOiB7XG4gICAgICAgICAgU0VDUkVUOiBlY3MuU2VjcmV0LmZyb21TZWNyZXRzTWFuYWdlcihzZWNyZXQpLFxuICAgICAgICAgIFBBUkFNRVRFUjogZWNzLlNlY3JldC5mcm9tU3NtUGFyYW1ldGVyKHBhcmFtZXRlciksXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXI6ICdhbWF6b24nLFxuICAgICAgICB3b3JraW5nRGlyZWN0b3J5OiAnYXBwLycsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgRmFtaWx5OiAnRXh0ZXJuYWxUYXNrRGVmJyxcbiAgICAgICAgTmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5CUklER0UsXG4gICAgICAgIFJlcXVpcmVzQ29tcGF0aWJpbGl0aWVzOiBbJ0VYVEVSTkFMJ10sXG4gICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ29tbWFuZDogW1xuICAgICAgICAgICAgICAnQ01EIGVudicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgQ3B1OiAyNTYsXG4gICAgICAgICAgICBEaXNhYmxlTmV0d29ya2luZzogdHJ1ZSxcbiAgICAgICAgICAgIERuc1NlYXJjaERvbWFpbnM6IFtcbiAgICAgICAgICAgICAgJzAuMC4wLjAnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIERuc1NlcnZlcnM6IFtcbiAgICAgICAgICAgICAgJzEuMS4xLjEnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIERvY2tlckxhYmVsczoge1xuICAgICAgICAgICAgICBMQUJFTDogJ2xhYmVsJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBEb2NrZXJTZWN1cml0eU9wdGlvbnM6IFtcbiAgICAgICAgICAgICAgJ0VDU19TRUxJTlVYX0NBUEFCTEU9dHJ1ZScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRW50cnlQb2ludDogW1xuICAgICAgICAgICAgICAnL2FwcC9ub2RlX21vZHVsZXMvLmJpbi9jZGsnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEVudmlyb25tZW50OiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBOYW1lOiAnVEVTVF9FTlZJUk9OTUVOVF9WQVJJQUJMRScsXG4gICAgICAgICAgICAgICAgVmFsdWU6ICd0ZXN0IGVudmlyb25tZW50IHZhcmlhYmxlIHZhbHVlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFbnZpcm9ubWVudEZpbGVzOiBbe1xuICAgICAgICAgICAgICBUeXBlOiAnczMnLFxuICAgICAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6czM6OjonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTdWInOiAnY2RrLWhuYjY1OWZkcy1hc3NldHMtJHtBV1M6OkFjY291bnRJZH0tJHtBV1M6OlJlZ2lvbn0nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnLzg3MjU2MWJmMDc4ZWRkMTY4NWQ1MGM5ZmY4MjFjZGQ2MGQyYjJkZGZiMDAxM2M0MDg3ZTc5YmYyYmI1MDcyNGQuZW52JyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgRXNzZW50aWFsOiB0cnVlLFxuICAgICAgICAgICAgRXh0cmFIb3N0czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgSG9zdG5hbWU6ICdFWFRSQUhPU1QnLFxuICAgICAgICAgICAgICAgIElwQWRkcmVzczogJ2V4dHJhIGhvc3QnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEhlYWx0aENoZWNrOiB7XG4gICAgICAgICAgICAgIENvbW1hbmQ6IFtcbiAgICAgICAgICAgICAgICAnQ01ELVNIRUxMJyxcbiAgICAgICAgICAgICAgICAnY3VybCBsb2NhbGhvc3Q6ODAwMCcsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIEludGVydmFsOiAyMCxcbiAgICAgICAgICAgICAgUmV0cmllczogNSxcbiAgICAgICAgICAgICAgU3RhcnRQZXJpb2Q6IDEwLFxuICAgICAgICAgICAgICBUaW1lb3V0OiA1LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEhvc3RuYW1lOiAnd2ViSG9zdCcsXG4gICAgICAgICAgICBJbWFnZTogJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScsXG4gICAgICAgICAgICBMaW51eFBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgQ2FwYWJpbGl0aWVzOiB7fSxcbiAgICAgICAgICAgICAgSW5pdFByb2Nlc3NFbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICBTaGFyZWRNZW1vcnlTaXplOiAxMDI0LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIExvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgTG9nRHJpdmVyOiAnYXdzbG9ncycsXG4gICAgICAgICAgICAgIE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAnYXdzbG9ncy1ncm91cCc6IHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0V4dGVybmFsVGFza0RlZndlYkxvZ0dyb3VwODI3NzE5RDYnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2F3c2xvZ3Mtc3RyZWFtLXByZWZpeCc6ICdwcmVmaXgnLFxuICAgICAgICAgICAgICAgICdhd3Nsb2dzLXJlZ2lvbic6IHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE1lbW9yeTogMjA0OCxcbiAgICAgICAgICAgIE1lbW9yeVJlc2VydmF0aW9uOiAxMDI0LFxuICAgICAgICAgICAgTmFtZTogJ3dlYicsXG4gICAgICAgICAgICBTZWNyZXRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBOYW1lOiAnU0VDUkVUJyxcbiAgICAgICAgICAgICAgICBWYWx1ZUZyb206IHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ1NlY3JldEE3MjBFRjA1JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgTmFtZTogJ1BBUkFNRVRFUicsXG4gICAgICAgICAgICAgICAgVmFsdWVGcm9tOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICc6c3NtOicsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICc6cGFyYW1ldGVyL25hbWUnLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFVzZXI6ICdhbWF6b24nLFxuICAgICAgICAgICAgV29ya2luZ0RpcmVjdG9yeTogJ2FwcC8nLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NvcnJlY3RseSBzZXRzIGNvbnRhaW5lcnMgZnJvbSBFQ1IgcmVwb3NpdG9yeSB1c2luZyBhbGwgcHJvcHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FeHRlcm5hbFRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRXh0ZXJuYWxUYXNrRGVmJyk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21FY3JSZXBvc2l0b3J5KG5ldyBSZXBvc2l0b3J5KHN0YWNrLCAnbXlFQ1JJbWFnZScsIHtcbiAgICAgICAgICBsaWZlY3ljbGVSZWdpc3RyeUlkOiAnMTIzNDU2Nzg5MTAxJyxcbiAgICAgICAgICBsaWZlY3ljbGVSdWxlczogW3tcbiAgICAgICAgICAgIHJ1bGVQcmlvcml0eTogMTAsXG4gICAgICAgICAgICB0YWdQcmVmaXhMaXN0OiBbJ2FiYyddLFxuICAgICAgICAgICAgbWF4SW1hZ2VDb3VudDogMSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgICAgIHJlcG9zaXRvcnlOYW1lOiAncHJvamVjdC1hL2FtYXpvbi1lY3Mtc2FtcGxlJyxcbiAgICAgICAgfSkpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUjo6UmVwb3NpdG9yeScsIHtcbiAgICAgICAgTGlmZWN5Y2xlUG9saWN5OiB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgICAgICBMaWZlY3ljbGVQb2xpY3lUZXh0OiAne1wicnVsZXNcIjpbe1wicnVsZVByaW9yaXR5XCI6MTAsXCJzZWxlY3Rpb25cIjp7XCJ0YWdTdGF0dXNcIjpcInRhZ2dlZFwiLFwidGFnUHJlZml4TGlzdFwiOltcImFiY1wiXSxcImNvdW50VHlwZVwiOlwiaW1hZ2VDb3VudE1vcmVUaGFuXCIsXCJjb3VudE51bWJlclwiOjF9LFwiYWN0aW9uXCI6e1widHlwZVwiOlwiZXhwaXJlXCJ9fV19JyxcbiAgICAgICAgICBSZWdpc3RyeUlkOiAnMTIzNDU2Nzg5MTAxJyxcbiAgICAgICAgfSxcbiAgICAgICAgUmVwb3NpdG9yeU5hbWU6ICdwcm9qZWN0LWEvYW1hem9uLWVjcy1zYW1wbGUnLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIEZhbWlseTogJ0V4dGVybmFsVGFza0RlZicsXG4gICAgICAgIE5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQlJJREdFLFxuICAgICAgICBSZXF1aXJlc0NvbXBhdGliaWxpdGllczogWydFWFRFUk5BTCddLFxuICAgICAgICBDb250YWluZXJEZWZpbml0aW9uczogW3tcbiAgICAgICAgICBFc3NlbnRpYWw6IHRydWUsXG4gICAgICAgICAgTWVtb3J5OiA1MTIsXG4gICAgICAgICAgSW1hZ2U6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgNCxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdteUVDUkltYWdlN0RFQUU0NzQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICcuZGtyLmVjci4nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAgICAgICAzLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ215RUNSSW1hZ2U3REVBRTQ3NCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJy4nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6VVJMU3VmZml4JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICcvJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdteUVDUkltYWdlN0RFQUU0NzQnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzpsYXRlc3QnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIE5hbWU6ICd3ZWInLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjb3JyZWN0bHkgc2V0cyBjb250YWluZXJzIGZyb20gRUNSIHJlcG9zaXRvcnkgdXNpbmcgYW4gaW1hZ2UgdGFnJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRXh0ZXJuYWxUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0V4dGVybmFsVGFza0RlZicpO1xuICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tRWNyUmVwb3NpdG9yeShuZXcgUmVwb3NpdG9yeShzdGFjaywgJ215RUNSSW1hZ2UnKSwgJ215VGFnJyksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBGYW1pbHk6ICdFeHRlcm5hbFRhc2tEZWYnLFxuICAgICAgTmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5CUklER0UsXG4gICAgICBSZXF1aXJlc0NvbXBhdGliaWxpdGllczogWydFWFRFUk5BTCddLFxuICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFt7XG4gICAgICAgIEVzc2VudGlhbDogdHJ1ZSxcbiAgICAgICAgTWVtb3J5OiA1MTIsXG4gICAgICAgIEltYWdlOiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAgIDQsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnbXlFQ1JJbWFnZTdERUFFNDc0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICcuZGtyLmVjci4nLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgICAzLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ215RUNSSW1hZ2U3REVBRTQ3NCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnLicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlVSTFN1ZmZpeCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICcvJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ215RUNSSW1hZ2U3REVBRTQ3NCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICc6bXlUYWcnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBOYW1lOiAnd2ViJyxcbiAgICAgIH1dLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjb3JyZWN0bHkgc2V0cyBjb250YWluZXJzIGZyb20gRUNSIHJlcG9zaXRvcnkgdXNpbmcgYW4gaW1hZ2UgZGlnZXN0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkV4dGVybmFsVGFza0RlZmluaXRpb24oc3RhY2ssICdFeHRlcm5hbFRhc2tEZWYnKTtcbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbUVjclJlcG9zaXRvcnkobmV3IFJlcG9zaXRvcnkoc3RhY2ssICdteUVDUkltYWdlJyksICdzaGEyNTY6OTRhZmQxZjJlNjRkOTA4YmM5MGRiY2EwMDM1YTViNTY3RVhBTVBMRScpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgRmFtaWx5OiAnRXh0ZXJuYWxUYXNrRGVmJyxcbiAgICAgIE5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQlJJREdFLFxuICAgICAgUmVxdWlyZXNDb21wYXRpYmlsaXRpZXM6IFsnRVhURVJOQUwnXSxcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbe1xuICAgICAgICBFc3NlbnRpYWw6IHRydWUsXG4gICAgICAgIE1lbW9yeTogNTEyLFxuICAgICAgICBJbWFnZToge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgICA0LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ215RUNSSW1hZ2U3REVBRTQ3NCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnLmRrci5lY3IuJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAgICAgMyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdteUVDUkltYWdlN0RFQUU0NzQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJy4nLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpVUkxTdWZmaXgnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdteUVDUkltYWdlN0RFQUU0NzQnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnQHNoYTI1Njo5NGFmZDFmMmU2NGQ5MDhiYzkwZGJjYTAwMzVhNWI1NjdFWEFNUExFJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgTmFtZTogJ3dlYicsXG4gICAgICB9XSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY29ycmVjdGx5IHNldHMgY29udGFpbmVycyBmcm9tIEVDUiByZXBvc2l0b3J5IHVzaW5nIGRlZmF1bHQgcHJvcHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRXh0ZXJuYWxUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0V4dGVybmFsVGFza0RlZicpO1xuXG4gICAgLy8gV0hFTlxuICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tRWNyUmVwb3NpdG9yeShuZXcgUmVwb3NpdG9yeShzdGFjaywgJ215RUNSSW1hZ2UnKSksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUjo6UmVwb3NpdG9yeScsIHt9KTtcbiAgfSk7XG5cbiAgdGVzdCgnd2FybnMgd2hlbiBzZXR0aW5nIGNvbnRhaW5lcnMgZnJvbSBFQ1IgcmVwb3NpdG9yeSB1c2luZyBmcm9tUmVnaXN0cnkgbWV0aG9kJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRXh0ZXJuYWxUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0V4dGVybmFsVGFza0RlZicpO1xuXG4gICAgLy8gV0hFTlxuICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ0FDQ09VTlQuZGtyLmVjci5SRUdJT04uYW1hem9uYXdzLmNvbS9SRVBPU0lUT1JZJyksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIEFubm90YXRpb25zLmZyb21TdGFjayhzdGFjaykuaGFzV2FybmluZygnL0RlZmF1bHQvRXh0ZXJuYWxUYXNrRGVmL3dlYicsIFwiUHJvcGVyIHBvbGljaWVzIG5lZWQgdG8gYmUgYXR0YWNoZWQgYmVmb3JlIHB1bGxpbmcgZnJvbSBFQ1IgcmVwb3NpdG9yeSwgb3IgdXNlICdmcm9tRWNyUmVwb3NpdG9yeScuXCIpO1xuICB9KTtcblxuICB0ZXN0KCdjb3JyZWN0bHkgc2V0cyB2b2x1bWVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkV4dGVybmFsVGFza0RlZmluaXRpb24oc3RhY2ssICdFeHRlcm5hbFRhc2tEZWYnLCB7fSk7XG5cbiAgICAvLyBXSEVOXG4gICAgdGFza0RlZmluaXRpb24uYWRkVm9sdW1lKHtcbiAgICAgIGhvc3Q6IHtcbiAgICAgICAgc291cmNlUGF0aDogJy90bXAvY2FjaGUnLFxuICAgICAgfSxcbiAgICAgIG5hbWU6ICdzY3JhdGNoJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgVm9sdW1lczogW1xuICAgICAgICB7XG4gICAgICAgICAgSG9zdDoge1xuICAgICAgICAgICAgU291cmNlUGF0aDogJy90bXAvY2FjaGUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgTmFtZTogJ3NjcmF0Y2gnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZXJyb3Igd2hlbiBpbnRlcmZlcmVuY2VBY2NlbGVyYXRvcnMgc2V0JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FeHRlcm5hbFRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRXh0ZXJuYWxUYXNrRGVmJywge30pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB0YXNrRGVmaW5pdGlvbi5hZGRJbmZlcmVuY2VBY2NlbGVyYXRvcih7XG4gICAgICBkZXZpY2VOYW1lOiAnZGV2aWNlMScsXG4gICAgICBkZXZpY2VUeXBlOiAnZWlhMi5tZWRpdW0nLFxuICAgIH0pKS50b1Rocm93KCdDYW5ub3QgdXNlIGluZmVyZW5jZSBhY2NlbGVyYXRvcnMgb24gdGFza3MgdGhhdCBydW4gb24gRXh0ZXJuYWwgc2VydmljZScpO1xuICB9KTtcbn0pO1xuIl19