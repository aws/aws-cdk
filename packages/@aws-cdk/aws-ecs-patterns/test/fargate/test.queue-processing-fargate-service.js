"use strict";
const assert_1 = require("@aws-cdk/assert");
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const sqs = require("@aws-cdk/aws-sqs");
const cdk = require("@aws-cdk/core");
const ecsPatterns = require("../../lib");
module.exports = {
    'test fargate queue worker service construct - with only required props'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
        // WHEN
        new ecsPatterns.QueueProcessingFargateService(stack, 'Service', {
            cluster,
            memoryLimitMiB: 512,
            image: ecs.ContainerImage.fromRegistry('test'),
        });
        // THEN - QueueWorker is of FARGATE launch type, an SQS queue is created and all default properties are set.
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
            DesiredCount: 1,
            LaunchType: 'FARGATE',
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::SQS::Queue', {
            RedrivePolicy: {
                deadLetterTargetArn: {
                    'Fn::GetAtt': [
                        'ServiceEcsProcessingDeadLetterQueue4A89196E',
                        'Arn',
                    ],
                },
                maxReceiveCount: 3,
            },
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::SQS::Queue', {
            MessageRetentionPeriod: 1209600,
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: [
                            'sqs:ReceiveMessage',
                            'sqs:ChangeMessageVisibility',
                            'sqs:GetQueueUrl',
                            'sqs:DeleteMessage',
                            'sqs:GetQueueAttributes',
                        ],
                        Effect: 'Allow',
                        Resource: {
                            'Fn::GetAtt': [
                                'ServiceEcsProcessingQueueC266885C',
                                'Arn',
                            ],
                        },
                    },
                ],
                Version: '2012-10-17',
            },
        }));
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                {
                    Environment: [
                        {
                            Name: 'QUEUE_NAME',
                            Value: {
                                'Fn::GetAtt': [
                                    'ServiceEcsProcessingQueueC266885C',
                                    'QueueName',
                                ],
                            },
                        },
                    ],
                    LogConfiguration: {
                        LogDriver: 'awslogs',
                        Options: {
                            'awslogs-group': {
                                Ref: 'ServiceQueueProcessingTaskDefQueueProcessingContainerLogGroupD52338D1',
                            },
                            'awslogs-stream-prefix': 'Service',
                            'awslogs-region': {
                                Ref: 'AWS::Region',
                            },
                        },
                    },
                    Image: 'test',
                },
            ],
            Family: 'ServiceQueueProcessingTaskDef83DB34F1',
        }));
        test.done();
    },
    'test fargate queue worker service construct - with optional props for queues'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
        // WHEN
        new ecsPatterns.QueueProcessingFargateService(stack, 'Service', {
            cluster,
            memoryLimitMiB: 512,
            image: ecs.ContainerImage.fromRegistry('test'),
            maxReceiveCount: 42,
            retentionPeriod: cdk.Duration.days(7),
        });
        // THEN - QueueWorker is of FARGATE launch type, an SQS queue is created and all default properties are set.
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
            DesiredCount: 1,
            LaunchType: 'FARGATE',
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::SQS::Queue', {
            RedrivePolicy: {
                deadLetterTargetArn: {
                    'Fn::GetAtt': [
                        'ServiceEcsProcessingDeadLetterQueue4A89196E',
                        'Arn',
                    ],
                },
                maxReceiveCount: 42,
            },
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::SQS::Queue', {
            MessageRetentionPeriod: 604800,
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: [
                            'sqs:ReceiveMessage',
                            'sqs:ChangeMessageVisibility',
                            'sqs:GetQueueUrl',
                            'sqs:DeleteMessage',
                            'sqs:GetQueueAttributes',
                        ],
                        Effect: 'Allow',
                        Resource: {
                            'Fn::GetAtt': [
                                'ServiceEcsProcessingQueueC266885C',
                                'Arn',
                            ],
                        },
                    },
                ],
                Version: '2012-10-17',
            },
        }));
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                {
                    Environment: [
                        {
                            Name: 'QUEUE_NAME',
                            Value: {
                                'Fn::GetAtt': [
                                    'ServiceEcsProcessingQueueC266885C',
                                    'QueueName',
                                ],
                            },
                        },
                    ],
                    LogConfiguration: {
                        LogDriver: 'awslogs',
                        Options: {
                            'awslogs-group': {
                                Ref: 'ServiceQueueProcessingTaskDefQueueProcessingContainerLogGroupD52338D1',
                            },
                            'awslogs-stream-prefix': 'Service',
                            'awslogs-region': {
                                Ref: 'AWS::Region',
                            },
                        },
                    },
                    Image: 'test',
                },
            ],
            Family: 'ServiceQueueProcessingTaskDef83DB34F1',
        }));
        test.done();
    },
    'test Fargate queue worker service construct - with optional props'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
        const queue = new sqs.Queue(stack, 'fargate-test-queue', {
            queueName: 'fargate-test-sqs-queue',
        });
        // WHEN
        new ecsPatterns.QueueProcessingFargateService(stack, 'Service', {
            cluster,
            memoryLimitMiB: 512,
            image: ecs.ContainerImage.fromRegistry('test'),
            command: ['-c', '4', 'amazon.com'],
            enableLogging: false,
            desiredTaskCount: 2,
            environment: {
                TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
                TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
            },
            queue,
            maxScalingCapacity: 5,
            minHealthyPercent: 60,
            maxHealthyPercent: 150,
            serviceName: 'fargate-test-service',
            family: 'fargate-task-family',
            platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
        });
        // THEN - QueueWorker is of FARGATE launch type, an SQS queue is created and all optional properties are set.
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
            DesiredCount: 2,
            DeploymentConfiguration: {
                MinimumHealthyPercent: 60,
                MaximumPercent: 150,
            },
            LaunchType: 'FARGATE',
            ServiceName: 'fargate-test-service',
            PlatformVersion: ecs.FargatePlatformVersion.VERSION1_4,
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::SQS::Queue', { QueueName: 'fargate-test-sqs-queue' }));
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                {
                    Command: [
                        '-c',
                        '4',
                        'amazon.com',
                    ],
                    Environment: [
                        {
                            Name: 'TEST_ENVIRONMENT_VARIABLE1',
                            Value: 'test environment variable 1 value',
                        },
                        {
                            Name: 'TEST_ENVIRONMENT_VARIABLE2',
                            Value: 'test environment variable 2 value',
                        },
                        {
                            Name: 'QUEUE_NAME',
                            Value: {
                                'Fn::GetAtt': [
                                    'fargatetestqueue28B43841',
                                    'QueueName',
                                ],
                            },
                        },
                    ],
                    Image: 'test',
                },
            ],
            Family: 'fargate-task-family',
        }));
        test.done();
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5xdWV1ZS1wcm9jZXNzaW5nLWZhcmdhdGUtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QucXVldWUtcHJvY2Vzc2luZy1mYXJnYXRlLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDRDQUF5RTtBQUN6RSx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFFckMseUNBQXlDO0FBRXpDLGlCQUFTO0lBQ1Asd0VBQXdFLENBQUMsSUFBVTtRQUNqRixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN0QyxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDM0QsT0FBTyxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRW5HLE9BQU87UUFDUCxJQUFJLFdBQVcsQ0FBQyw2QkFBNkIsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQzlELE9BQU87WUFDUCxjQUFjLEVBQUUsR0FBRztZQUNuQixLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1NBQy9DLENBQUMsQ0FBQztRQUVILDRHQUE0RztRQUM1RyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLHFCQUFZLENBQUMsbUJBQW1CLEVBQUU7WUFDakQsWUFBWSxFQUFFLENBQUM7WUFDZixVQUFVLEVBQUUsU0FBUztTQUN0QixDQUFDLENBQUMsQ0FBQztR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STt3QkFDSixHQUFHO3dCQUNILFlBQVk7cUJBQ2I7b0JBQ0QsV0FBVyxFQUFFO3dCQUNYOzRCQUNFLElBQUksRUFBRSw0QkFBNEI7NEJBQ2xDLEtBQUssRUFBRSxtQ0FBbUM7eUJBQzNDO3dCQUNEOzRCQUNFLElBQUksRUFBRSw0QkFBNEI7NEJBQ2xDLEtBQUssRUFBRSxtQ0FBbUM7eUJBQzNDO3dCQUNEOzRCQUNFLElBQUksRUFBRSxZQUFZOzRCQUNsQixLQUFLLEVBQUU7Z0NBQ0wsWUFBWSxFQUFFO29DQUNaLDBCQUEwQjtvQ0FDMUIsV0FBVztpQ0FDWjs2QkFDRjt5QkFDRjtxQkFDRjtvQkFDRCxLQUFLLEVBQUUsTUFBTTtpQkFDZDthQUNGO1lBQ0QsTUFBTSxFQUFFLHFCQUFxQjtTQUM5QixDQUFDLENBQUMsQ0FBQztRQUVKLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNkLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhwZWN0LCBoYXZlUmVzb3VyY2UsIGhhdmVSZXNvdXJjZUxpa2UgfSBmcm9tICdAYXdzLWNkay9hc3NlcnQnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJ0Bhd3MtY2RrL2F3cy1lY3MnO1xuaW1wb3J0ICogYXMgc3FzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zcXMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgVGVzdCB9IGZyb20gJ25vZGV1bml0JztcbmltcG9ydCAqIGFzIGVjc1BhdHRlcm5zIGZyb20gJy4uLy4uL2xpYic7XG5cbmV4cG9ydCA9IHtcbiAgJ3Rlc3QgZmFyZ2F0ZSBxdWV1ZSB3b3JrZXIgc2VydmljZSBjb25zdHJ1Y3QgLSB3aXRoIG9ubHkgcmVxdWlyZWQgcHJvcHMnKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHsgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWNzUGF0dGVybnMuUXVldWVQcm9jZXNzaW5nRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTiAtIFF1ZXVlV29ya2VyIGlzIG9mIEZBUkdBVEUgbGF1bmNoIHR5cGUsIGFuIFNRUyBxdWV1ZSBpcyBjcmVhdGVkIGFuZCBhbGwgZGVmYXVsdCBwcm9wZXJ0aWVzIGFyZSBzZXQuXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgRGVzaXJlZENvdW50OiAxLFxuICAgICAgTGF1bmNoVHlwZTogJ0ZBUkdBVEUnLFxuICAgIH0pKTtcblxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OlNRUzo6UXVldWUnLCB7XG4gICAgICBSZWRyaXZlUG9saWN5OiB7XG4gICAgICAgIGRlYWRMZXR0ZXJUYXJnZXRBcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdTZXJ2aWNlRWNzUHJvY2Vzc2luZ0RlYWRMZXR0ZXJRdWV1ZTRBODkxOTZFJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIG1heFJlY2VpdmVDb3VudDogMyxcbiAgICAgIH0sXG4gICAgfSkpO1xuXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6U1FTOjpRdWV1ZScsIHtcbiAgICAgIE1lc3NhZ2VSZXRlbnRpb25QZXJpb2Q6IDEyMDk2MDAsXG4gICAgfSkpO1xuXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6SUFNOjpQb2xpY3knLCAge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICdzcXM6UmVjZWl2ZU1lc3NhZ2UnLFxuICAgICAgICAgICAgICAnc3FzOkNoYW5nZU1lc3NhZ2VWaXNpYmlsaXR5JyxcbiAgICAgICAgICAgICAgJ3NxczpHZXRRdWV1ZVVybCcsXG4gICAgICAgICAgICAgICdzcXM6RGVsZXRlTWVzc2FnZScsXG4gICAgICAgICAgICAgICdzcXM6R2V0UXVldWVBdHRyaWJ1dGVzJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnU2VydmljZUVjc1Byb2Nlc3NpbmdRdWV1ZUMyNjY4ODVDJyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBFbnZpcm9ubWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBOYW1lOiAnUVVFVUVfTkFNRScsXG4gICAgICAgICAgICAgIFZhbHVlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnU2VydmljZUVjc1Byb2Nlc3NpbmdRdWV1ZUMyNjY4ODVDJyxcbiAgICAgICAgICAgICAgICAgICdRdWV1ZU5hbWUnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgTG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgTG9nRHJpdmVyOiAnYXdzbG9ncycsXG4gICAgICAgICAgICBPcHRpb25zOiB7XG4gICAgICAgICAgICAgICdhd3Nsb2dzLWdyb3VwJzoge1xuICAgICAgICAgICAgICAgIFJlZjogJ1NlcnZpY2VRdWV1ZVByb2Nlc3NpbmdUYXNrRGVmUXVldWVQcm9jZXNzaW5nQ29udGFpbmVyTG9nR3JvdXBENTIzMzhEMScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdhd3Nsb2dzLXN0cmVhbS1wcmVmaXgnOiAnU2VydmljZScsXG4gICAgICAgICAgICAgICdhd3Nsb2dzLXJlZ2lvbic6IHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgSW1hZ2U6ICd0ZXN0JyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBGYW1pbHk6ICdTZXJ2aWNlUXVldWVQcm9jZXNzaW5nVGFza0RlZjgzREIzNEYxJyxcbiAgICB9KSk7XG5cbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcblxuICAndGVzdCBmYXJnYXRlIHF1ZXVlIHdvcmtlciBzZXJ2aWNlIGNvbnN0cnVjdCAtIHdpdGggb3B0aW9uYWwgcHJvcHMgZm9yIHF1ZXVlcycodGVzdDogVGVzdCkge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywgeyBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlY3NQYXR0ZXJucy5RdWV1ZVByb2Nlc3NpbmdGYXJnYXRlU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICBtYXhSZWNlaXZlQ291bnQ6IDQyLFxuICAgICAgcmV0ZW50aW9uUGVyaW9kOiBjZGsuRHVyYXRpb24uZGF5cyg3KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU4gLSBRdWV1ZVdvcmtlciBpcyBvZiBGQVJHQVRFIGxhdW5jaCB0eXBlLCBhbiBTUVMgcXVldWUgaXMgY3JlYXRlZCBhbmQgYWxsIGRlZmF1bHQgcHJvcGVydGllcyBhcmUgc2V0LlxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgIERlc2lyZWRDb3VudDogMSxcbiAgICAgIExhdW5jaFR5cGU6ICdGQVJHQVRFJyxcbiAgICB9KSk7XG5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpTUVM6OlF1ZXVlJywge1xuICAgICAgUmVkcml2ZVBvbGljeToge1xuICAgICAgICBkZWFkTGV0dGVyVGFyZ2V0QXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnU2VydmljZUVjc1Byb2Nlc3NpbmdEZWFkTGV0dGVyUXVldWU0QTg5MTk2RScsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBtYXhSZWNlaXZlQ291bnQ6IDQyLFxuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpTUVM6OlF1ZXVlJywge1xuICAgICAgTWVzc2FnZVJldGVudGlvblBlcmlvZDogNjA0ODAwLFxuICAgIH0pKTtcblxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OklBTTo6UG9saWN5JywgIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnc3FzOlJlY2VpdmVNZXNzYWdlJyxcbiAgICAgICAgICAgICAgJ3NxczpDaGFuZ2VNZXNzYWdlVmlzaWJpbGl0eScsXG4gICAgICAgICAgICAgICdzcXM6R2V0UXVldWVVcmwnLFxuICAgICAgICAgICAgICAnc3FzOkRlbGV0ZU1lc3NhZ2UnLFxuICAgICAgICAgICAgICAnc3FzOkdldFF1ZXVlQXR0cmlidXRlcycsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ1NlcnZpY2VFY3NQcm9jZXNzaW5nUXVldWVDMjY2ODg1QycsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSkpO1xuXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgRW52aXJvbm1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgTmFtZTogJ1FVRVVFX05BTUUnLFxuICAgICAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ1NlcnZpY2VFY3NQcm9jZXNzaW5nUXVldWVDMjY2ODg1QycsXG4gICAgICAgICAgICAgICAgICAnUXVldWVOYW1lJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIExvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIExvZ0RyaXZlcjogJ2F3c2xvZ3MnLFxuICAgICAgICAgICAgT3B0aW9uczoge1xuICAgICAgICAgICAgICAnYXdzbG9ncy1ncm91cCc6IHtcbiAgICAgICAgICAgICAgICBSZWY6ICdTZXJ2aWNlUXVldWVQcm9jZXNzaW5nVGFza0RlZlF1ZXVlUHJvY2Vzc2luZ0NvbnRhaW5lckxvZ0dyb3VwRDUyMzM4RDEnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnYXdzbG9ncy1zdHJlYW0tcHJlZml4JzogJ1NlcnZpY2UnLFxuICAgICAgICAgICAgICAnYXdzbG9ncy1yZWdpb24nOiB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIEltYWdlOiAndGVzdCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgRmFtaWx5OiAnU2VydmljZVF1ZXVlUHJvY2Vzc2luZ1Rhc2tEZWY4M0RCMzRGMScsXG4gICAgfSkpO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ3Rlc3QgRmFyZ2F0ZSBxdWV1ZSB3b3JrZXIgc2VydmljZSBjb25zdHJ1Y3QgLSB3aXRoIG9wdGlvbmFsIHByb3BzJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLCB7IGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJykgfSk7XG4gICAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnZmFyZ2F0ZS10ZXN0LXF1ZXVlJywge1xuICAgICAgcXVldWVOYW1lOiAnZmFyZ2F0ZS10ZXN0LXNxcy1xdWV1ZScsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjc1BhdHRlcm5zLlF1ZXVlUHJvY2Vzc2luZ0ZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgIGNvbW1hbmQ6IFsnLWMnLCAnNCcsICdhbWF6b24uY29tJ10sXG4gICAgICBlbmFibGVMb2dnaW5nOiBmYWxzZSxcbiAgICAgIGRlc2lyZWRUYXNrQ291bnQ6IDIsXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMTogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgMSB2YWx1ZScsXG4gICAgICAgIFRFU1RfRU5WSVJPTk1FTlRfVkFSSUFCTEUyOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAyIHZhbHVlJyxcbiAgICAgIH0sXG4gICAgICBxdWV1ZSxcbiAgICAgIG1heFNjYWxpbmdDYXBhY2l0eTogNSxcbiAgICAgIG1pbkhlYWx0aHlQZXJjZW50OiA2MCxcbiAgICAgIG1heEhlYWx0aHlQZXJjZW50OiAxNTAsXG4gICAgICBzZXJ2aWNlTmFtZTogJ2ZhcmdhdGUtdGVzdC1zZXJ2aWNlJyxcbiAgICAgIGZhbWlseTogJ2ZhcmdhdGUtdGFzay1mYW1pbHknLFxuICAgICAgcGxhdGZvcm1WZXJzaW9uOiBlY3MuRmFyZ2F0ZVBsYXRmb3JtVmVyc2lvbi5WRVJTSU9OMV80LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTiAtIFF1ZXVlV29ya2VyIGlzIG9mIEZBUkdBVEUgbGF1bmNoIHR5cGUsIGFuIFNRUyBxdWV1ZSBpcyBjcmVhdGVkIGFuZCBhbGwgb3B0aW9uYWwgcHJvcGVydGllcyBhcmUgc2V0LlxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgIERlc2lyZWRDb3VudDogMixcbiAgICAgIERlcGxveW1lbnRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIE1pbmltdW1IZWFsdGh5UGVyY2VudDogNjAsXG4gICAgICAgIE1heGltdW1QZXJjZW50OiAxNTAsXG4gICAgICB9LFxuICAgICAgTGF1bmNoVHlwZTogJ0ZBUkdBVEUnLFxuICAgICAgU2VydmljZU5hbWU6ICdmYXJnYXRlLXRlc3Qtc2VydmljZScsXG4gICAgICBQbGF0Zm9ybVZlcnNpb246IGVjcy5GYXJnYXRlUGxhdGZvcm1WZXJzaW9uLlZFUlNJT04xXzQsXG4gICAgfSkpO1xuXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6U1FTOjpRdWV1ZScsIHsgUXVldWVOYW1lOiAnZmFyZ2F0ZS10ZXN0LXNxcy1xdWV1ZScgfSkpO1xuXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgQ29tbWFuZDogW1xuICAgICAgICAgICAgJy1jJyxcbiAgICAgICAgICAgICc0JyxcbiAgICAgICAgICAgICdhbWF6b24uY29tJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIEVudmlyb25tZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMScsXG4gICAgICAgICAgICAgIFZhbHVlOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAxIHZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMicsXG4gICAgICAgICAgICAgIFZhbHVlOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAyIHZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdRVUVVRV9OQU1FJyxcbiAgICAgICAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdmYXJnYXRldGVzdHF1ZXVlMjhCNDM4NDEnLFxuICAgICAgICAgICAgICAgICAgJ1F1ZXVlTmFtZScsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBJbWFnZTogJ3Rlc3QnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIEZhbWlseTogJ2ZhcmdhdGUtdGFzay1mYW1pbHknLFxuICAgIH0pKTtcblxuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxufTtcbiJdfQ==