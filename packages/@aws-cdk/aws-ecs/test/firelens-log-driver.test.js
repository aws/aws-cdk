"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const secretsmanager = require("@aws-cdk/aws-secretsmanager");
const ssm = require("@aws-cdk/aws-ssm");
const cdk = require("@aws-cdk/core");
const ecs = require("../lib");
let stack;
let td;
const image = ecs.ContainerImage.fromRegistry('test-image');
describe('firelens log driver', () => {
    beforeEach(() => {
        stack = new cdk.Stack();
        td = new ecs.Ec2TaskDefinition(stack, 'TaskDefinition');
    });
    test('create a firelens log driver with default options', () => {
        // WHEN
        td.addContainer('Container', {
            image,
            logging: ecs.LogDrivers.firelens({}),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'awsfirelens',
                    },
                }),
                assertions_1.Match.objectLike({
                    Essential: true,
                    FirelensConfiguration: {
                        Type: 'fluentbit',
                    },
                }),
            ],
        });
    });
    test('create a firelens log driver with secret options', () => {
        const secret = new secretsmanager.Secret(stack, 'Secret');
        const parameter = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'Parameter', {
            parameterName: '/host',
            version: 1,
        });
        // WHEN
        td.addContainer('Container', {
            image,
            logging: ecs.LogDrivers.firelens({
                options: {
                    Name: 'datadog',
                    TLS: 'on',
                    dd_service: 'my-httpd-service',
                    dd_source: 'httpd',
                    dd_tags: 'project:example',
                    provider: 'ecs',
                },
                secretOptions: {
                    apikey: ecs.Secret.fromSecretsManager(secret),
                    Host: ecs.Secret.fromSsmParameter(parameter),
                },
            }),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'awsfirelens',
                        Options: {
                            Name: 'datadog',
                            TLS: 'on',
                            dd_service: 'my-httpd-service',
                            dd_source: 'httpd',
                            dd_tags: 'project:example',
                            provider: 'ecs',
                        },
                        SecretOptions: [
                            {
                                Name: 'apikey',
                                ValueFrom: {
                                    Ref: 'SecretA720EF05',
                                },
                            },
                            {
                                Name: 'Host',
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
                                            ':parameter/host',
                                        ],
                                    ],
                                },
                            },
                        ],
                    },
                }),
                assertions_1.Match.objectLike({
                    Essential: true,
                    FirelensConfiguration: {
                        Type: 'fluentbit',
                    },
                }),
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: assertions_1.Match.arrayWith([
                    {
                        Action: [
                            'secretsmanager:GetSecretValue',
                            'secretsmanager:DescribeSecret',
                        ],
                        Effect: 'Allow',
                        Resource: {
                            Ref: 'SecretA720EF05',
                        },
                    },
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
                                    ':parameter/host',
                                ],
                            ],
                        },
                    },
                ]),
                Version: '2012-10-17',
            },
        });
    });
    test('create a firelens log driver to route logs to CloudWatch Logs with Fluent Bit', () => {
        // WHEN
        td.addContainer('Container', {
            image,
            logging: ecs.LogDrivers.firelens({
                options: {
                    Name: 'cloudwatch',
                    region: 'us-west-2',
                    log_group_name: 'firelens-fluent-bit',
                    auto_create_group: 'true',
                    log_stream_prefix: 'from-fluent-bit',
                },
            }),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'awsfirelens',
                        Options: {
                            Name: 'cloudwatch',
                            region: 'us-west-2',
                            log_group_name: 'firelens-fluent-bit',
                            auto_create_group: 'true',
                            log_stream_prefix: 'from-fluent-bit',
                        },
                    },
                }),
                assertions_1.Match.objectLike({
                    Essential: true,
                    FirelensConfiguration: {
                        Type: 'fluentbit',
                    },
                }),
            ],
        });
    });
    test('create a firelens log driver to route logs to kinesis firehose Logs with Fluent Bit', () => {
        // WHEN
        td.addContainer('Container', {
            image,
            logging: ecs.LogDrivers.firelens({
                options: {
                    Name: 'firehose',
                    region: 'us-west-2',
                    delivery_stream: 'my-stream',
                },
            }),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'awsfirelens',
                        Options: {
                            Name: 'firehose',
                            region: 'us-west-2',
                            delivery_stream: 'my-stream',
                        },
                    },
                }),
                assertions_1.Match.objectLike({
                    Essential: true,
                    FirelensConfiguration: {
                        Type: 'fluentbit',
                    },
                }),
            ],
        });
    });
    describe('Firelens Configuration', () => {
        test('fluentd log router container', () => {
            // GIVEN
            td.addFirelensLogRouter('log_router', {
                image: ecs.ContainerImage.fromRegistry('fluent/fluentd'),
                firelensConfig: {
                    type: ecs.FirelensLogRouterType.FLUENTD,
                },
                memoryReservationMiB: 50,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    {
                        Essential: true,
                        Image: 'fluent/fluentd',
                        MemoryReservation: 50,
                        Name: 'log_router',
                        FirelensConfiguration: {
                            Type: 'fluentd',
                        },
                    },
                ],
            });
        });
        test('fluent-bit log router container with options', () => {
            // GIVEN
            const stack2 = new cdk.Stack(undefined, 'Stack2', { env: { region: 'us-east-1' } });
            const td2 = new ecs.Ec2TaskDefinition(stack2, 'TaskDefinition');
            td2.addFirelensLogRouter('log_router', {
                image: ecs.obtainDefaultFluentBitECRImage(td2, undefined, '2.1.0'),
                firelensConfig: {
                    type: ecs.FirelensLogRouterType.FLUENTBIT,
                    options: {
                        enableECSLogMetadata: false,
                        configFileValue: 'arn:aws:s3:::mybucket/fluent.conf',
                        configFileType: ecs.FirelensConfigFileType.S3,
                    },
                },
                logging: new ecs.AwsLogDriver({ streamPrefix: 'firelens' }),
                memoryReservationMiB: 50,
            });
            // THEN
            assertions_1.Template.fromStack(stack2).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    assertions_1.Match.objectLike({
                        Essential: true,
                        MemoryReservation: 50,
                        Name: 'log_router',
                        FirelensConfiguration: {
                            Type: 'fluentbit',
                            Options: {
                                'enable-ecs-log-metadata': 'false',
                                'config-file-type': 's3',
                                'config-file-value': 'arn:aws:s3:::mybucket/fluent.conf',
                            },
                        },
                    }),
                ],
            });
        });
        test('fluent-bit log router with file config type', () => {
            // GIVEN
            td.addFirelensLogRouter('log_router', {
                image: ecs.obtainDefaultFluentBitECRImage(td, undefined, '2.1.0'),
                firelensConfig: {
                    type: ecs.FirelensLogRouterType.FLUENTBIT,
                    options: {
                        enableECSLogMetadata: false,
                        configFileType: ecs.FirelensConfigFileType.FILE,
                        configFileValue: '/my/working/dir/firelens/config',
                    },
                },
                logging: new ecs.AwsLogDriver({ streamPrefix: 'firelens' }),
                memoryReservationMiB: 50,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    assertions_1.Match.objectLike({
                        Essential: true,
                        MemoryReservation: 50,
                        Name: 'log_router',
                        FirelensConfiguration: {
                            Type: 'fluentbit',
                            Options: {
                                'enable-ecs-log-metadata': 'false',
                                'config-file-type': 'file',
                                'config-file-value': '/my/working/dir/firelens/config',
                            },
                        },
                    }),
                ],
            });
        });
        test('firelens config options are fully optional', () => {
            // GIVEN
            td.addFirelensLogRouter('log_router', {
                image: ecs.obtainDefaultFluentBitECRImage(td, undefined, '2.1.0'),
                firelensConfig: {
                    type: ecs.FirelensLogRouterType.FLUENTBIT,
                    options: {
                        enableECSLogMetadata: false,
                    },
                },
                logging: new ecs.AwsLogDriver({ streamPrefix: 'firelens' }),
                memoryReservationMiB: 50,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    assertions_1.Match.objectLike({
                        Essential: true,
                        MemoryReservation: 50,
                        Name: 'log_router',
                        FirelensConfiguration: {
                            Type: 'fluentbit',
                            Options: {
                                'enable-ecs-log-metadata': 'false',
                            },
                        },
                    }),
                ],
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlyZWxlbnMtbG9nLWRyaXZlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlyZWxlbnMtbG9nLWRyaXZlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELDhEQUE4RDtBQUM5RCx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLDhCQUE4QjtBQUU5QixJQUFJLEtBQWdCLENBQUM7QUFDckIsSUFBSSxFQUFzQixDQUFDO0FBQzNCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBRTVELFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7SUFDbkMsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4QixFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFHMUQsQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFJLENBQUMsbURBQW1ELEVBQUUsR0FBRyxFQUFFO1FBQzdELE9BQU87UUFDUCxFQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRTtZQUMzQixLQUFLO1lBQ0wsT0FBTyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztZQUNwQyxjQUFjLEVBQUUsR0FBRztTQUNwQixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMEJBQTBCLEVBQUU7WUFDMUUsb0JBQW9CLEVBQUU7Z0JBQ3BCLGtCQUFLLENBQUMsVUFBVSxDQUFDO29CQUNmLGdCQUFnQixFQUFFO3dCQUNoQixTQUFTLEVBQUUsYUFBYTtxQkFDekI7aUJBQ0YsQ0FBQztnQkFDRixrQkFBSyxDQUFDLFVBQVUsQ0FBQztv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QUFFLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQztnQkFDakUsY0FBYyxFQUFFO29CQUNkLElBQUksRUFBRSxHQUFHLENBQUMscUJBQXFCLENBQUMsU0FBUztvQkFDekMsT0FBTyxFQUFFO3dCQUNQLG9CQUFvQixFQUFFLEtBQUs7cUJBQzVCO2lCQUNGO2dCQUNELE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLENBQUM7Z0JBQzNELG9CQUFvQixFQUFFLEVBQUU7YUFDekIsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDBCQUEwQixFQUFFO2dCQUMxRSxvQkFBb0IsRUFBRTtvQkFDcEIsa0JBQUssQ0FBQyxVQUFVLENBQUM7d0JBQ2YsU0FBUyxFQUFFLElBQUk7d0JBQ2YsaUJBQWlCLEVBQUUsRUFBRTt3QkFDckIsSUFBSSxFQUFFLFlBQVk7d0JBQ2xCLHFCQUFxQixFQUFFOzRCQUNyQixJQUFJLEVBQUUsV0FBVzs0QkFDakIsT0FBTyxFQUFFO2dDQUNQLHlCQUF5QixFQUFFLE9BQU87NkJBQ25DO3lCQUNGO3FCQUNGLENBQUM7aUJBQ0g7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIHNlY3JldHNtYW5hZ2VyIGZyb20gJ0Bhd3MtY2RrL2F3cy1zZWNyZXRzbWFuYWdlcic7XG5pbXBvcnQgKiBhcyBzc20gZnJvbSAnQGF3cy1jZGsvYXdzLXNzbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnLi4vbGliJztcblxubGV0IHN0YWNrOiBjZGsuU3RhY2s7XG5sZXQgdGQ6IGVjcy5UYXNrRGVmaW5pdGlvbjtcbmNvbnN0IGltYWdlID0gZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdC1pbWFnZScpO1xuXG5kZXNjcmliZSgnZmlyZWxlbnMgbG9nIGRyaXZlcicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgdGQgPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZmluaXRpb24nKTtcblxuXG4gIH0pO1xuICB0ZXN0KCdjcmVhdGUgYSBmaXJlbGVucyBsb2cgZHJpdmVyIHdpdGggZGVmYXVsdCBvcHRpb25zJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICB0ZC5hZGRDb250YWluZXIoJ0NvbnRhaW5lcicsIHtcbiAgICAgIGltYWdlLFxuICAgICAgbG9nZ2luZzogZWNzLkxvZ0RyaXZlcnMuZmlyZWxlbnMoe30pLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEyOCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgTG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgTG9nRHJpdmVyOiAnYXdzZmlyZWxlbnMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBFc3NlbnRpYWw6IHRydWUsXG4gICAgICAgICAgRmlyZWxlbnNDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBUeXBlOiAnZmx1ZW50Yml0JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBhIGZpcmVsZW5zIGxvZyBkcml2ZXIgd2l0aCBzZWNyZXQgb3B0aW9ucycsICgpID0+IHtcbiAgICBjb25zdCBzZWNyZXQgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnU2VjcmV0Jyk7XG4gICAgY29uc3QgcGFyYW1ldGVyID0gc3NtLlN0cmluZ1BhcmFtZXRlci5mcm9tU2VjdXJlU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyhzdGFjaywgJ1BhcmFtZXRlcicsIHtcbiAgICAgIHBhcmFtZXRlck5hbWU6ICcvaG9zdCcsXG4gICAgICB2ZXJzaW9uOiAxLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHRkLmFkZENvbnRhaW5lcignQ29udGFpbmVyJywge1xuICAgICAgaW1hZ2UsXG4gICAgICBsb2dnaW5nOiBlY3MuTG9nRHJpdmVycy5maXJlbGVucyh7XG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICBOYW1lOiAnZGF0YWRvZycsXG4gICAgICAgICAgVExTOiAnb24nLFxuICAgICAgICAgIGRkX3NlcnZpY2U6ICdteS1odHRwZC1zZXJ2aWNlJyxcbiAgICAgICAgICBkZF9zb3VyY2U6ICdodHRwZCcsXG4gICAgICAgICAgZGRfdGFnczogJ3Byb2plY3Q6ZXhhbXBsZScsXG4gICAgICAgICAgcHJvdmlkZXI6ICdlY3MnLFxuICAgICAgICB9LFxuICAgICAgICBzZWNyZXRPcHRpb25zOiB7XG4gICAgICAgICAgYXBpa2V5OiBlY3MuU2VjcmV0LmZyb21TZWNyZXRzTWFuYWdlcihzZWNyZXQpLFxuICAgICAgICAgIEhvc3Q6IGVjcy5TZWNyZXQuZnJvbVNzbVBhcmFtZXRlcihwYXJhbWV0ZXIpLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTI4LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBMb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBMb2dEcml2ZXI6ICdhd3NmaXJlbGVucycsXG4gICAgICAgICAgICBPcHRpb25zOiB7XG4gICAgICAgICAgICAgIE5hbWU6ICdkYXRhZG9nJyxcbiAgICAgICAgICAgICAgVExTOiAnb24nLFxuICAgICAgICAgICAgICBkZF9zZXJ2aWNlOiAnbXktaHR0cGQtc2VydmljZScsXG4gICAgICAgICAgICAgIGRkX3NvdXJjZTogJ2h0dHBkJyxcbiAgICAgICAgICAgICAgZGRfdGFnczogJ3Byb2plY3Q6ZXhhbXBsZScsXG4gICAgICAgICAgICAgIHByb3ZpZGVyOiAnZWNzJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTZWNyZXRPcHRpb25zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBOYW1lOiAnYXBpa2V5JyxcbiAgICAgICAgICAgICAgICBWYWx1ZUZyb206IHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ1NlY3JldEE3MjBFRjA1JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgTmFtZTogJ0hvc3QnLFxuICAgICAgICAgICAgICAgIFZhbHVlRnJvbToge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnOnNzbTonLFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnOnBhcmFtZXRlci9ob3N0JyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIEVzc2VudGlhbDogdHJ1ZSxcbiAgICAgICAgICBGaXJlbGVuc0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIFR5cGU6ICdmbHVlbnRiaXQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6R2V0U2VjcmV0VmFsdWUnLFxuICAgICAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6RGVzY3JpYmVTZWNyZXQnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgIFJlZjogJ1NlY3JldEE3MjBFRjA1JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgJ3NzbTpEZXNjcmliZVBhcmFtZXRlcnMnLFxuICAgICAgICAgICAgICAnc3NtOkdldFBhcmFtZXRlcnMnLFxuICAgICAgICAgICAgICAnc3NtOkdldFBhcmFtZXRlcicsXG4gICAgICAgICAgICAgICdzc206R2V0UGFyYW1ldGVySGlzdG9yeScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6c3NtOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOnBhcmFtZXRlci9ob3N0JyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdKSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIGEgZmlyZWxlbnMgbG9nIGRyaXZlciB0byByb3V0ZSBsb2dzIHRvIENsb3VkV2F0Y2ggTG9ncyB3aXRoIEZsdWVudCBCaXQnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIHRkLmFkZENvbnRhaW5lcignQ29udGFpbmVyJywge1xuICAgICAgaW1hZ2UsXG4gICAgICBsb2dnaW5nOiBlY3MuTG9nRHJpdmVycy5maXJlbGVucyh7XG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICBOYW1lOiAnY2xvdWR3YXRjaCcsXG4gICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcbiAgICAgICAgICBsb2dfZ3JvdXBfbmFtZTogJ2ZpcmVsZW5zLWZsdWVudC1iaXQnLFxuICAgICAgICAgIGF1dG9fY3JlYXRlX2dyb3VwOiAndHJ1ZScsXG4gICAgICAgICAgbG9nX3N0cmVhbV9wcmVmaXg6ICdmcm9tLWZsdWVudC1iaXQnLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTI4LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBMb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBMb2dEcml2ZXI6ICdhd3NmaXJlbGVucycsXG4gICAgICAgICAgICBPcHRpb25zOiB7XG4gICAgICAgICAgICAgIE5hbWU6ICdjbG91ZHdhdGNoJyxcbiAgICAgICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcbiAgICAgICAgICAgICAgbG9nX2dyb3VwX25hbWU6ICdmaXJlbGVucy1mbHVlbnQtYml0JyxcbiAgICAgICAgICAgICAgYXV0b19jcmVhdGVfZ3JvdXA6ICd0cnVlJyxcbiAgICAgICAgICAgICAgbG9nX3N0cmVhbV9wcmVmaXg6ICdmcm9tLWZsdWVudC1iaXQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgRXNzZW50aWFsOiB0cnVlLFxuICAgICAgICAgIEZpcmVsZW5zQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgVHlwZTogJ2ZsdWVudGJpdCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgYSBmaXJlbGVucyBsb2cgZHJpdmVyIHRvIHJvdXRlIGxvZ3MgdG8ga2luZXNpcyBmaXJlaG9zZSBMb2dzIHdpdGggRmx1ZW50IEJpdCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgdGQuYWRkQ29udGFpbmVyKCdDb250YWluZXInLCB7XG4gICAgICBpbWFnZSxcbiAgICAgIGxvZ2dpbmc6IGVjcy5Mb2dEcml2ZXJzLmZpcmVsZW5zKHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIE5hbWU6ICdmaXJlaG9zZScsXG4gICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcbiAgICAgICAgICBkZWxpdmVyeV9zdHJlYW06ICdteS1zdHJlYW0nLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTI4LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBMb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBMb2dEcml2ZXI6ICdhd3NmaXJlbGVucycsXG4gICAgICAgICAgICBPcHRpb25zOiB7XG4gICAgICAgICAgICAgIE5hbWU6ICdmaXJlaG9zZScsXG4gICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXG4gICAgICAgICAgICAgIGRlbGl2ZXJ5X3N0cmVhbTogJ215LXN0cmVhbScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBFc3NlbnRpYWw6IHRydWUsXG4gICAgICAgICAgRmlyZWxlbnNDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBUeXBlOiAnZmx1ZW50Yml0JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdGaXJlbGVucyBDb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgIHRlc3QoJ2ZsdWVudGQgbG9nIHJvdXRlciBjb250YWluZXInLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgdGQuYWRkRmlyZWxlbnNMb2dSb3V0ZXIoJ2xvZ19yb3V0ZXInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdmbHVlbnQvZmx1ZW50ZCcpLFxuICAgICAgICBmaXJlbGVuc0NvbmZpZzoge1xuICAgICAgICAgIHR5cGU6IGVjcy5GaXJlbGVuc0xvZ1JvdXRlclR5cGUuRkxVRU5URCxcbiAgICAgICAgfSxcbiAgICAgICAgbWVtb3J5UmVzZXJ2YXRpb25NaUI6IDUwLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgRXNzZW50aWFsOiB0cnVlLFxuICAgICAgICAgICAgSW1hZ2U6ICdmbHVlbnQvZmx1ZW50ZCcsXG4gICAgICAgICAgICBNZW1vcnlSZXNlcnZhdGlvbjogNTAsXG4gICAgICAgICAgICBOYW1lOiAnbG9nX3JvdXRlcicsXG4gICAgICAgICAgICBGaXJlbGVuc0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgVHlwZTogJ2ZsdWVudGQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdmbHVlbnQtYml0IGxvZyByb3V0ZXIgY29udGFpbmVyIHdpdGggb3B0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjazIgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgJ1N0YWNrMicsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScgfSB9KTtcbiAgICAgIGNvbnN0IHRkMiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2syLCAnVGFza0RlZmluaXRpb24nKTtcbiAgICAgIHRkMi5hZGRGaXJlbGVuc0xvZ1JvdXRlcignbG9nX3JvdXRlcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5vYnRhaW5EZWZhdWx0Rmx1ZW50Qml0RUNSSW1hZ2UodGQyLCB1bmRlZmluZWQsICcyLjEuMCcpLFxuICAgICAgICBmaXJlbGVuc0NvbmZpZzoge1xuICAgICAgICAgIHR5cGU6IGVjcy5GaXJlbGVuc0xvZ1JvdXRlclR5cGUuRkxVRU5UQklULFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGVuYWJsZUVDU0xvZ01ldGFkYXRhOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ0ZpbGVWYWx1ZTogJ2Fybjphd3M6czM6OjpteWJ1Y2tldC9mbHVlbnQuY29uZicsXG4gICAgICAgICAgICBjb25maWdGaWxlVHlwZTogZWNzLkZpcmVsZW5zQ29uZmlnRmlsZVR5cGUuUzMsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgbG9nZ2luZzogbmV3IGVjcy5Bd3NMb2dEcml2ZXIoeyBzdHJlYW1QcmVmaXg6ICdmaXJlbGVucycgfSksXG4gICAgICAgIG1lbW9yeVJlc2VydmF0aW9uTWlCOiA1MCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2syKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgIEVzc2VudGlhbDogdHJ1ZSxcbiAgICAgICAgICAgIE1lbW9yeVJlc2VydmF0aW9uOiA1MCxcbiAgICAgICAgICAgIE5hbWU6ICdsb2dfcm91dGVyJyxcbiAgICAgICAgICAgIEZpcmVsZW5zQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICBUeXBlOiAnZmx1ZW50Yml0JyxcbiAgICAgICAgICAgICAgT3B0aW9uczoge1xuICAgICAgICAgICAgICAgICdlbmFibGUtZWNzLWxvZy1tZXRhZGF0YSc6ICdmYWxzZScsXG4gICAgICAgICAgICAgICAgJ2NvbmZpZy1maWxlLXR5cGUnOiAnczMnLFxuICAgICAgICAgICAgICAgICdjb25maWctZmlsZS12YWx1ZSc6ICdhcm46YXdzOnMzOjo6bXlidWNrZXQvZmx1ZW50LmNvbmYnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZmx1ZW50LWJpdCBsb2cgcm91dGVyIHdpdGggZmlsZSBjb25maWcgdHlwZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICB0ZC5hZGRGaXJlbGVuc0xvZ1JvdXRlcignbG9nX3JvdXRlcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5vYnRhaW5EZWZhdWx0Rmx1ZW50Qml0RUNSSW1hZ2UodGQsIHVuZGVmaW5lZCwgJzIuMS4wJyksXG4gICAgICAgIGZpcmVsZW5zQ29uZmlnOiB7XG4gICAgICAgICAgdHlwZTogZWNzLkZpcmVsZW5zTG9nUm91dGVyVHlwZS5GTFVFTlRCSVQsXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgZW5hYmxlRUNTTG9nTWV0YWRhdGE6IGZhbHNlLFxuICAgICAgICAgICAgY29uZmlnRmlsZVR5cGU6IGVjcy5GaXJlbGVuc0NvbmZpZ0ZpbGVUeXBlLkZJTEUsXG4gICAgICAgICAgICBjb25maWdGaWxlVmFsdWU6ICcvbXkvd29ya2luZy9kaXIvZmlyZWxlbnMvY29uZmlnJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBsb2dnaW5nOiBuZXcgZWNzLkF3c0xvZ0RyaXZlcih7IHN0cmVhbVByZWZpeDogJ2ZpcmVsZW5zJyB9KSxcbiAgICAgICAgbWVtb3J5UmVzZXJ2YXRpb25NaUI6IDUwLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICBFc3NlbnRpYWw6IHRydWUsXG4gICAgICAgICAgICBNZW1vcnlSZXNlcnZhdGlvbjogNTAsXG4gICAgICAgICAgICBOYW1lOiAnbG9nX3JvdXRlcicsXG4gICAgICAgICAgICBGaXJlbGVuc0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgVHlwZTogJ2ZsdWVudGJpdCcsXG4gICAgICAgICAgICAgIE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAnZW5hYmxlLWVjcy1sb2ctbWV0YWRhdGEnOiAnZmFsc2UnLFxuICAgICAgICAgICAgICAgICdjb25maWctZmlsZS10eXBlJzogJ2ZpbGUnLFxuICAgICAgICAgICAgICAgICdjb25maWctZmlsZS12YWx1ZSc6ICcvbXkvd29ya2luZy9kaXIvZmlyZWxlbnMvY29uZmlnJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2ZpcmVsZW5zIGNvbmZpZyBvcHRpb25zIGFyZSBmdWxseSBvcHRpb25hbCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICB0ZC5hZGRGaXJlbGVuc0xvZ1JvdXRlcignbG9nX3JvdXRlcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5vYnRhaW5EZWZhdWx0Rmx1ZW50Qml0RUNSSW1hZ2UodGQsIHVuZGVmaW5lZCwgJzIuMS4wJyksXG4gICAgICAgIGZpcmVsZW5zQ29uZmlnOiB7XG4gICAgICAgICAgdHlwZTogZWNzLkZpcmVsZW5zTG9nUm91dGVyVHlwZS5GTFVFTlRCSVQsXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgZW5hYmxlRUNTTG9nTWV0YWRhdGE6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGxvZ2dpbmc6IG5ldyBlY3MuQXdzTG9nRHJpdmVyKHsgc3RyZWFtUHJlZml4OiAnZmlyZWxlbnMnIH0pLFxuICAgICAgICBtZW1vcnlSZXNlcnZhdGlvbk1pQjogNTAsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgIEVzc2VudGlhbDogdHJ1ZSxcbiAgICAgICAgICAgIE1lbW9yeVJlc2VydmF0aW9uOiA1MCxcbiAgICAgICAgICAgIE5hbWU6ICdsb2dfcm91dGVyJyxcbiAgICAgICAgICAgIEZpcmVsZW5zQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICBUeXBlOiAnZmx1ZW50Yml0JyxcbiAgICAgICAgICAgICAgT3B0aW9uczoge1xuICAgICAgICAgICAgICAgICdlbmFibGUtZWNzLWxvZy1tZXRhZGF0YSc6ICdmYWxzZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=