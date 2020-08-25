"use strict";
const assert_1 = require("@aws-cdk/assert");
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const sqs = require("@aws-cdk/aws-sqs");
const cdk = require("@aws-cdk/core");
const ecsPatterns = require("../../lib");
module.exports = {
    'test ECS queue worker service construct - with only required props'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
        // WHEN
        new ecsPatterns.QueueProcessingEc2Service(stack, 'Service', {
            cluster,
            memoryLimitMiB: 512,
            image: ecs.ContainerImage.fromRegistry('test'),
        });
        // THEN - QueueWorker is of EC2 launch type, an SQS queue is created and all default properties are set.
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
            DesiredCount: 1,
            LaunchType: 'EC2',
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
                    Essential: true,
                    Image: 'test',
                    Memory: 512,
                },
            ],
            Family: 'ServiceQueueProcessingTaskDef83DB34F1',
        }));
        test.done();
    },
    'test ECS queue worker service construct - with optional props for queues'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
        // WHEN
        new ecsPatterns.QueueProcessingEc2Service(stack, 'Service', {
            cluster,
            memoryLimitMiB: 512,
            image: ecs.ContainerImage.fromRegistry('test'),
            maxReceiveCount: 42,
            retentionPeriod: cdk.Duration.days(7),
        });
        // THEN - QueueWorker is of EC2 launch type, an SQS queue is created and all default properties are set.
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
            DesiredCount: 1,
            LaunchType: 'EC2',
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
                    Essential: true,
                    Image: 'test',
                    Memory: 512,
                },
            ],
            Family: 'ServiceQueueProcessingTaskDef83DB34F1',
        }));
        test.done();
    },
    'test ECS queue worker service construct - with optional props'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
        const queue = new sqs.Queue(stack, 'ecs-test-queue', {
            queueName: 'ecs-test-sqs-queue',
        });
        // WHEN
        new ecsPatterns.QueueProcessingEc2Service(stack, 'Service', {
            cluster,
            memoryLimitMiB: 1024,
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
            serviceName: 'ecs-test-service',
            family: 'ecs-task-family',
        });
        // THEN - QueueWorker is of EC2 launch type, an SQS queue is created and all optional properties are set.
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
            DesiredCount: 2,
            DeploymentConfiguration: {
                MinimumHealthyPercent: 60,
                MaximumPercent: 150,
            },
            LaunchType: 'EC2',
            ServiceName: 'ecs-test-service',
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::SQS::Queue', {
            QueueName: 'ecs-test-sqs-queue',
        }));
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
                                    'ecstestqueueD1FDA34B',
                                    'QueueName',
                                ],
                            },
                        },
                    ],
                    Image: 'test',
                    Memory: 1024,
                },
            ],
            Family: 'ecs-task-family',
        }));
        test.done();
    },
    'can set desiredTaskCount to 0'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
        // WHEN
        new ecsPatterns.QueueProcessingEc2Service(stack, 'Service', {
            cluster,
            desiredTaskCount: 0,
            maxScalingCapacity: 2,
            memoryLimitMiB: 512,
            image: ecs.ContainerImage.fromRegistry('test'),
        });
        // THEN - QueueWorker is of EC2 launch type, an SQS queue is created and all default properties are set.
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
            DesiredCount: 0,
            LaunchType: 'EC2',
        }));
        test.done();
    },
    'throws if desiredTaskCount and maxScalingCapacity are 0'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
        // THEN
        test.throws(() => new ecsPatterns.QueueProcessingEc2Service(stack, 'Service', {
            cluster,
            desiredTaskCount: 0,
            memoryLimitMiB: 512,
            image: ecs.ContainerImage.fromRegistry('test'),
        }), /maxScalingCapacity must be set and greater than 0 if desiredCount is 0/);
        test.done();
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5xdWV1ZS1wcm9jZXNzaW5nLWVjcy1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGVzdC5xdWV1ZS1wcm9jZXNzaW5nLWVjcy1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBeUU7QUFDekUsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBRXJDLHlDQUF5QztBQUV6QyxpQkFBUztJQUNQLG9FQUFvRSxDQUFDLElBQVU7UUFDN0UsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzNELE9BQU8sQ0FBQyxXQUFXLENBQUMseUJBQXlCLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVuRyxPQUFPO1FBQ1AsSUFBSSxXQUFXLENBQUMseUJBQXlCLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUMxRCxPQUFPO1lBQ1AsY0FBYyxFQUFFLEdBQUc7WUFDbkIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztTQUMvQyxDQUFDLENBQUM7UUFFSCx3R0FBd0c7UUFDeEcsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxxQkFBWSxDQUFDLG1CQUFtQixFQUFFO1lBQ2pELFlBQVksRUFBRSxDQUFDO1lBQ2YsVUFBVSxFQUFFLEtBQUs7U0FDbEIsQ0FBQyxDQUFDLENBQUM7UUFFSixlQUFN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RTtZQUMxRCxPQUFPO1lBQ1AsZ0JBQWdCLEVBQUUsQ0FBQztZQUNuQixjQUFjLEVBQUUsR0FBRztZQUNuQixLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1NBQy9DLENBQUMsRUFDRix3RUFBd0UsQ0FBQyxDQUFDO1FBRTVFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNkLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhwZWN0LCBoYXZlUmVzb3VyY2UsIGhhdmVSZXNvdXJjZUxpa2UgfSBmcm9tICdAYXdzLWNkay9hc3NlcnQnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJ0Bhd3MtY2RrL2F3cy1lY3MnO1xuaW1wb3J0ICogYXMgc3FzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zcXMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgVGVzdCB9IGZyb20gJ25vZGV1bml0JztcbmltcG9ydCAqIGFzIGVjc1BhdHRlcm5zIGZyb20gJy4uLy4uL2xpYic7XG5cbmV4cG9ydCA9IHtcbiAgJ3Rlc3QgRUNTIHF1ZXVlIHdvcmtlciBzZXJ2aWNlIGNvbnN0cnVjdCAtIHdpdGggb25seSByZXF1aXJlZCBwcm9wcycodGVzdDogVGVzdCkge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywgeyBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlY3NQYXR0ZXJucy5RdWV1ZVByb2Nlc3NpbmdFYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU4gLSBRdWV1ZVdvcmtlciBpcyBvZiBFQzIgbGF1bmNoIHR5cGUsIGFuIFNRUyBxdWV1ZSBpcyBjcmVhdGVkIGFuZCBhbGwgZGVmYXVsdCBwcm9wZXJ0aWVzIGFyZSBzZXQuXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgRGVzaXJlZENvdW50OiAxLFxuICAgICAgTGF1bmNoVHlwZTogJ0VDMicsXG4gICAgfSkpO1xuXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6U1FTOjpRdWV1ZScsIHtcbiAgICAgIFJlZHJpdmVQb2xpY3k6IHtcbiAgICAgICAgZGVhZExldHRlclRhcmdldEFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ1NlcnZpY2VFY3NQcm9jZXNzaW5nRGVhZExldHRlclF1ZXVlNEE4OTE5NkUnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgbWF4UmVjZWl2ZUNvdW50OiAzLFxuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpTUVM6OlF1ZXVlJywge1xuICAgICAgTWVzc2FnZVJldGVudGlvblBlcmlvZDogMTIwOTYwMCxcbiAgICB9KSk7XG5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBFbnZpcm9ubWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBOYW1lOiAnUVVFVUVfTkFNRScsXG4gICAgICAgICAgICAgIFZhbHVlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnU2VydmljZUVjc1Byb2Nlc3NpbmdRdWV1ZUMyNjY4ODVDJyxcbiAgICAgICAgICAgICAgICAgICdRdWV1ZU5hbWUnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgTG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgTG9nRHJpdmVyOiAnYXdzbG9ncycsXG4gICAgICAgICAgICBPcHRpb25zOiB7XG4gICAgICAgICAgICAgICdhd3Nsb2dzLWdyb3VwJzoge1xuICAgICAgICAgICAgICAgIFJlZjogJ1NlcnZpY2VRdWV1ZVByb2Nlc3NpbmdUYXNrRGVmUXVldWVQcm9jZXNzaW5nQ29udGFpbmVyTG9nR3JvdXBENTIzMzhEMScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdhd3Nsb2dzLXN0cmVhbS1wcmVmaXgnOiAnU2VydmljZScsXG4gICAgICAgICAgICAgICdhd3Nsb2dzLXJlZ2lvbic6IHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRXNzZW50aWFsOiB0cnVlLFxuICAgICAgICAgIEltYWdlOiAndGVzdCcsXG4gICAgICAgICAgTWVtb3J5OiA1MTIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgRmFtaWx5OiAnU2VydmljZVF1ZXVlUHJvY2Vzc2luZ1Rhc2tEZWY4M0RCMzRGMScsXG4gICAgfSkpO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ3Rlc3QgRUNTIHF1ZXVlIHdvcmtlciBzZXJ2aWNlIGNvbnN0cnVjdCAtIHdpdGggb3B0aW9uYWwgcHJvcHMgZm9yIHF1ZXVlcycodGVzdDogVGVzdCkge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywgeyBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlY3NQYXR0ZXJucy5RdWV1ZVByb2Nlc3NpbmdFYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgIG1heFJlY2VpdmVDb3VudDogNDIsXG4gICAgICByZXRlbnRpb25QZXJpb2Q6IGNkay5EdXJhdGlvbi5kYXlzKDcpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTiAtIFF1ZXVlV29ya2VyIGlzIG9mIEVDMiBsYXVuY2ggdHlwZSwgYW4gU1FTIHF1ZXVlIGlzIGNyZWF0ZWQgYW5kIGFsbCBkZWZhdWx0IHByb3BlcnRpZXMgYXJlIHNldC5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICBEZXNpcmVkQ291bnQ6IDEsXG4gICAgICBMYXVuY2hUeXBlOiAnRUMyJyxcbiAgICB9KSk7XG5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpTUVM6OlF1ZXVlJywge1xuICAgICAgUmVkcml2ZVBvbGljeToge1xuICAgICAgICBkZWFkTGV0dGVyVGFyZ2V0QXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnU2VydmljZUVjc1Byb2Nlc3NpbmdEZWFkTGV0dGVyUXVldWU0QTg5MTk2RScsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBtYXhSZWNlaXZlQ291bnQ6IDQyLFxuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpTUVM6OlF1ZXVlJywge1xuICAgICAgTWVzc2FnZVJldGVudGlvblBlcmlvZDogNjA0ODAwLFxuICAgIH0pKTtcblxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlTGlrZSgnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEVudmlyb25tZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdRVUVVRV9OQU1FJyxcbiAgICAgICAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdTZXJ2aWNlRWNzUHJvY2Vzc2luZ1F1ZXVlQzI2Njg4NUMnLFxuICAgICAgICAgICAgICAgICAgJ1F1ZXVlTmFtZScsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBMb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBMb2dEcml2ZXI6ICdhd3Nsb2dzJyxcbiAgICAgICAgICAgIE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgJ2F3c2xvZ3MtZ3JvdXAnOiB7XG4gICAgICAgICAgICAgICAgUmVmOiAnU2VydmljZVF1ZXVlUHJvY2Vzc2luZ1Rhc2tEZWZRdWV1ZVByb2Nlc3NpbmdDb250YWluZXJMb2dHcm91cEQ1MjMzOEQxJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ2F3c2xvZ3Mtc3RyZWFtLXByZWZpeCc6ICdTZXJ2aWNlJyxcbiAgICAgICAgICAgICAgJ2F3c2xvZ3MtcmVnaW9uJzoge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBFc3NlbnRpYWw6IHRydWUsXG4gICAgICAgICAgSW1hZ2U6ICd0ZXN0JyxcbiAgICAgICAgICBNZW1vcnk6IDUxMixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBGYW1pbHk6ICdTZXJ2aWNlUXVldWVQcm9jZXNzaW5nVGFza0RlZjgzREIzNEYxJyxcbiAgICB9KSk7XG5cbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcblxuICAndGVzdCBFQ1MgcXVldWUgd29ya2VyIHNlcnZpY2UgY29uc3RydWN0IC0gd2l0aCBvcHRpb25hbCBwcm9wcycodGVzdDogVGVzdCkge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywgeyBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpIH0pO1xuICAgIGNvbnN0IHF1ZXVlID0gbmV3IHNxcy5RdWV1ZShzdGFjaywgJ2Vjcy10ZXN0LXF1ZXVlJywge1xuICAgICAgcXVldWVOYW1lOiAnZWNzLXRlc3Qtc3FzLXF1ZXVlJyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWNzUGF0dGVybnMuUXVldWVQcm9jZXNzaW5nRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgY29tbWFuZDogWyctYycsICc0JywgJ2FtYXpvbi5jb20nXSxcbiAgICAgIGVuYWJsZUxvZ2dpbmc6IGZhbHNlLFxuICAgICAgZGVzaXJlZFRhc2tDb3VudDogMixcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFRFU1RfRU5WSVJPTk1FTlRfVkFSSUFCTEUxOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAxIHZhbHVlJyxcbiAgICAgICAgVEVTVF9FTlZJUk9OTUVOVF9WQVJJQUJMRTI6ICd0ZXN0IGVudmlyb25tZW50IHZhcmlhYmxlIDIgdmFsdWUnLFxuICAgICAgfSxcbiAgICAgIHF1ZXVlLFxuICAgICAgbWF4U2NhbGluZ0NhcGFjaXR5OiA1LFxuICAgICAgbWluSGVhbHRoeVBlcmNlbnQ6IDYwLFxuICAgICAgbWF4SGVhbHRoeVBlcmNlbnQ6IDE1MCxcbiAgICAgIHNlcnZpY2VOYW1lOiAnZWNzLXRlc3Qtc2VydmljZScsXG4gICAgICBmYW1pbHk6ICdlY3MtdGFzay1mYW1pbHknLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTiAtIFF1ZXVlV29ya2VyIGlzIG9mIEVDMiBsYXVuY2ggdHlwZSwgYW4gU1FTIHF1ZXVlIGlzIGNyZWF0ZWQgYW5kIGFsbCBvcHRpb25hbCBwcm9wZXJ0aWVzIGFyZSBzZXQuXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgRGVzaXJlZENvdW50OiAyLFxuICAgICAgRGVwbG95bWVudENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgTWluaW11bUhlYWx0aHlQZXJjZW50OiA2MCxcbiAgICAgICAgTWF4aW11bVBlcmNlbnQ6IDE1MCxcbiAgICAgIH0sXG4gICAgICBMYXVuY2hUeXBlOiAnRUMyJyxcbiAgICAgIFNlcnZpY2VOYW1lOiAnZWNzLXRlc3Qtc2VydmljZScsXG4gICAgfSkpO1xuXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6U1FTOjpRdWV1ZScsIHtcbiAgICAgIFF1ZXVlTmFtZTogJ2Vjcy10ZXN0LXNxcy1xdWV1ZScsXG4gICAgfSkpO1xuXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgQ29tbWFuZDogW1xuICAgICAgICAgICAgJy1jJyxcbiAgICAgICAgICAgICc0JyxcbiAgICAgICAgICAgICdhbWF6b24uY29tJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIEVudmlyb25tZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMScsXG4gICAgICAgICAgICAgIFZhbHVlOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAxIHZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMicsXG4gICAgICAgICAgICAgIFZhbHVlOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAyIHZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdRVUVVRV9OQU1FJyxcbiAgICAgICAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdlY3N0ZXN0cXVldWVEMUZEQTM0QicsXG4gICAgICAgICAgICAgICAgICAnUXVldWVOYW1lJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIEltYWdlOiAndGVzdCcsXG4gICAgICAgICAgTWVtb3J5OiAxMDI0LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIEZhbWlseTogJ2Vjcy10YXNrLWZhbWlseScsXG4gICAgfSkpO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ2NhbiBzZXQgZGVzaXJlZFRhc2tDb3VudCB0byAwJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLCB7IGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJykgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjc1BhdHRlcm5zLlF1ZXVlUHJvY2Vzc2luZ0VjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGRlc2lyZWRUYXNrQ291bnQ6IDAsXG4gICAgICBtYXhTY2FsaW5nQ2FwYWNpdHk6IDIsXG4gICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU4gLSBRdWV1ZVdvcmtlciBpcyBvZiBFQzIgbGF1bmNoIHR5cGUsIGFuIFNRUyBxdWV1ZSBpcyBjcmVhdGVkIGFuZCBhbGwgZGVmYXVsdCBwcm9wZXJ0aWVzIGFyZSBzZXQuXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgRGVzaXJlZENvdW50OiAwLFxuICAgICAgTGF1bmNoVHlwZTogJ0VDMicsXG4gICAgfSkpO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ3Rocm93cyBpZiBkZXNpcmVkVGFza0NvdW50IGFuZCBtYXhTY2FsaW5nQ2FwYWNpdHkgYXJlIDAnKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHsgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSB9KTtcblxuICAgIC8vIFRIRU5cbiAgICB0ZXN0LnRocm93cygoKSA9PlxuICAgICAgbmV3IGVjc1BhdHRlcm5zLlF1ZXVlUHJvY2Vzc2luZ0VjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICBkZXNpcmVkVGFza0NvdW50OiAwLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgfSlcbiAgICAsIC9tYXhTY2FsaW5nQ2FwYWNpdHkgbXVzdCBiZSBzZXQgYW5kIGdyZWF0ZXIgdGhhbiAwIGlmIGRlc2lyZWRDb3VudCBpcyAwLyk7XG5cbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcbn07XG4iXX0=