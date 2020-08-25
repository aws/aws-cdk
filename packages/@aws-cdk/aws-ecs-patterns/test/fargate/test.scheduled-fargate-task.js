"use strict";
const assert_1 = require("@aws-cdk/assert");
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const events = require("@aws-cdk/aws-events");
const cdk = require("@aws-cdk/core");
const lib_1 = require("../../lib");
module.exports = {
    'Can create a scheduled Fargate Task - with only required props'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        new lib_1.ScheduledFargateTask(stack, 'ScheduledFargateTask', {
            cluster,
            scheduledFargateTaskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('henk'),
                memoryLimitMiB: 512,
            },
            schedule: events.Schedule.expression('rate(1 minute)'),
        });
        // THEN
        assert_1.expect(stack).to(assert_1.haveResource('AWS::Events::Rule', {
            Targets: [
                {
                    Arn: { 'Fn::GetAtt': ['EcsCluster97242B84', 'Arn'] },
                    EcsParameters: {
                        LaunchType: 'FARGATE',
                        NetworkConfiguration: {
                            AwsVpcConfiguration: {
                                AssignPublicIp: 'DISABLED',
                                SecurityGroups: [
                                    {
                                        'Fn::GetAtt': [
                                            'ScheduledFargateTaskScheduledTaskDefSecurityGroupE075BC19',
                                            'GroupId',
                                        ],
                                    },
                                ],
                                Subnets: [
                                    {
                                        Ref: 'VpcPrivateSubnet1Subnet536B997A',
                                    },
                                ],
                            },
                        },
                        TaskCount: 1,
                        TaskDefinitionArn: { Ref: 'ScheduledFargateTaskScheduledTaskDef521FA675' },
                    },
                    Id: 'Target0',
                    Input: '{}',
                    RoleArn: { 'Fn::GetAtt': ['ScheduledFargateTaskScheduledTaskDefEventsRole6CE19522', 'Arn'] },
                },
            ],
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                {
                    Essential: true,
                    Image: 'henk',
                    LogConfiguration: {
                        LogDriver: 'awslogs',
                        Options: {
                            'awslogs-group': {
                                Ref: 'ScheduledFargateTaskScheduledTaskDefScheduledContainerLogGroup4134B16C',
                            },
                            'awslogs-stream-prefix': 'ScheduledFargateTask',
                            'awslogs-region': {
                                Ref: 'AWS::Region',
                            },
                        },
                    },
                    Name: 'ScheduledContainer',
                },
            ],
        }));
        test.done();
    },
    'Can create a scheduled Fargate Task - with optional props'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        new lib_1.ScheduledFargateTask(stack, 'ScheduledFargateTask', {
            cluster,
            scheduledFargateTaskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('henk'),
                memoryLimitMiB: 512,
                cpu: 2,
                environment: { TRIGGER: 'CloudWatch Events' },
            },
            desiredTaskCount: 2,
            schedule: events.Schedule.expression('rate(1 minute)'),
        });
        // THEN
        assert_1.expect(stack).to(assert_1.haveResource('AWS::Events::Rule', {
            Targets: [
                {
                    Arn: { 'Fn::GetAtt': ['EcsCluster97242B84', 'Arn'] },
                    EcsParameters: {
                        LaunchType: 'FARGATE',
                        NetworkConfiguration: {
                            AwsVpcConfiguration: {
                                AssignPublicIp: 'DISABLED',
                                SecurityGroups: [
                                    {
                                        'Fn::GetAtt': [
                                            'ScheduledFargateTaskScheduledTaskDefSecurityGroupE075BC19',
                                            'GroupId',
                                        ],
                                    },
                                ],
                                Subnets: [
                                    {
                                        Ref: 'VpcPrivateSubnet1Subnet536B997A',
                                    },
                                ],
                            },
                        },
                        TaskCount: 2,
                        TaskDefinitionArn: { Ref: 'ScheduledFargateTaskScheduledTaskDef521FA675' },
                    },
                    Id: 'Target0',
                    Input: '{}',
                    RoleArn: { 'Fn::GetAtt': ['ScheduledFargateTaskScheduledTaskDefEventsRole6CE19522', 'Arn'] },
                },
            ],
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                {
                    Environment: [
                        {
                            Name: 'TRIGGER',
                            Value: 'CloudWatch Events',
                        },
                    ],
                    Essential: true,
                    Image: 'henk',
                    LogConfiguration: {
                        LogDriver: 'awslogs',
                        Options: {
                            'awslogs-group': {
                                Ref: 'ScheduledFargateTaskScheduledTaskDefScheduledContainerLogGroup4134B16C',
                            },
                            'awslogs-stream-prefix': 'ScheduledFargateTask',
                            'awslogs-region': {
                                Ref: 'AWS::Region',
                            },
                        },
                    },
                    Name: 'ScheduledContainer',
                },
            ],
        }));
        test.done();
    },
    'Scheduled Fargate Task - with MemoryReservation defined'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        new lib_1.ScheduledFargateTask(stack, 'ScheduledFargateTask', {
            cluster,
            scheduledFargateTaskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('henk'),
            },
            schedule: events.Schedule.expression('rate(1 minute)'),
        });
        // THEN
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                {
                    Essential: true,
                    Image: 'henk',
                    LogConfiguration: {
                        LogDriver: 'awslogs',
                        Options: {
                            'awslogs-group': {
                                Ref: 'ScheduledFargateTaskScheduledTaskDefScheduledContainerLogGroup4134B16C',
                            },
                            'awslogs-stream-prefix': 'ScheduledFargateTask',
                            'awslogs-region': {
                                Ref: 'AWS::Region',
                            },
                        },
                    },
                    Name: 'ScheduledContainer',
                },
            ],
        }));
        test.done();
    },
    'Scheduled Fargate Task - with Command defined'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        new lib_1.ScheduledFargateTask(stack, 'ScheduledFargateTask', {
            cluster,
            scheduledFargateTaskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('henk'),
                command: ['-c', '4', 'amazon.com'],
            },
            schedule: events.Schedule.expression('rate(1 minute)'),
        });
        // THEN
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                {
                    Command: [
                        '-c',
                        '4',
                        'amazon.com',
                    ],
                    Essential: true,
                    Image: 'henk',
                    LogConfiguration: {
                        LogDriver: 'awslogs',
                        Options: {
                            'awslogs-group': {
                                Ref: 'ScheduledFargateTaskScheduledTaskDefScheduledContainerLogGroup4134B16C',
                            },
                            'awslogs-stream-prefix': 'ScheduledFargateTask',
                            'awslogs-region': {
                                Ref: 'AWS::Region',
                            },
                        },
                    },
                    Name: 'ScheduledContainer',
                },
            ],
        }));
        test.done();
    },
    'Scheduled Fargate Task - with subnetSelection defined'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc', {
            maxAzs: 1,
            subnetConfiguration: [
                { name: 'Public', cidrMask: 28, subnetType: ec2.SubnetType.PUBLIC },
            ],
        });
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        new lib_1.ScheduledFargateTask(stack, 'ScheduledFargateTask', {
            cluster,
            scheduledFargateTaskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('henk'),
            },
            subnetSelection: { subnetType: ec2.SubnetType.PUBLIC },
            schedule: events.Schedule.expression('rate(1 minute)'),
        });
        // THEN
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::Events::Rule', {
            Targets: [
                {
                    EcsParameters: {
                        NetworkConfiguration: {
                            AwsVpcConfiguration: {
                                AssignPublicIp: 'ENABLED',
                                Subnets: [
                                    {
                                        Ref: 'VpcPublicSubnet1Subnet5C2D37C4',
                                    },
                                ],
                            },
                        },
                    },
                },
            ],
        }));
        test.done();
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5zY2hlZHVsZWQtZmFyZ2F0ZS10YXNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGVzdC5zY2hlZHVsZWQtZmFyZ2F0ZS10YXNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBeUU7QUFDekUsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyw4Q0FBOEM7QUFDOUMscUNBQXFDO0FBRXJDLG1DQUFpRDtBQUVqRCxpQkFBUztJQUNQLGdFQUFnRSxDQUFDLElBQVU7UUFDekUsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDckQsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBRTlELElBQUksMEJBQW9CLENBQUMsS0FBSyxFQUFFLHNCQUFzQixFQUFFO1lBQ3RELE9BQU87WUFDUCxnQ0FBZ0MsRUFBRTtnQkFDaEMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztnQkFDOUMsY0FBYyxFQUFFLEdBQUc7YUFDcEI7WUFDRCxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7U0FDdkQsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMscUJBQVksQ0FBQyxtQkFBbUIsRUFBRTtZQUNqRCxPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsR0FBRyxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLEVBQUU7b0JBQ3BELGFB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Q0Y7YUFDRjtTQUNGLENBQUMsQ0FBQyxDQUFDO1FBRUosSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleHBlY3QsIGhhdmVSZXNvdXJjZSwgaGF2ZVJlc291cmNlTGlrZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydCc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnQGF3cy1jZGsvYXdzLWVjcyc7XG5pbXBvcnQgKiBhcyBldmVudHMgZnJvbSAnQGF3cy1jZGsvYXdzLWV2ZW50cyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBUZXN0IH0gZnJvbSAnbm9kZXVuaXQnO1xuaW1wb3J0IHsgU2NoZWR1bGVkRmFyZ2F0ZVRhc2sgfSBmcm9tICcuLi8uLi9saWInO1xuXG5leHBvcnQgPSB7XG4gICdDYW4gY3JlYXRlIGEgc2NoZWR1bGVkIEZhcmdhdGUgVGFzayAtIHdpdGggb25seSByZXF1aXJlZCBwcm9wcycodGVzdDogVGVzdCkge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnLCB7IG1heEF6czogMSB9KTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4gICAgbmV3IFNjaGVkdWxlZEZhcmdhdGVUYXNrKHN0YWNrLCAnU2NoZWR1bGVkRmFyZ2F0ZVRhc2snLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgc2NoZWR1bGVkRmFyZ2F0ZVRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbmsnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0sXG4gICAgICBzY2hlZHVsZTogZXZlbnRzLlNjaGVkdWxlLmV4cHJlc3Npb24oJ3JhdGUoMSBtaW51dGUpJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgVGFyZ2V0czogW1xuICAgICAgICB7XG4gICAgICAgICAgQXJuOiB7ICdGbjo6R2V0QXR0JzogWydFY3NDbHVzdGVyOTcyNDJCODQnLCAnQXJuJ10gfSxcbiAgICAgICAgICBFY3NQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICBMYXVuY2hUeXBlOiAnRkFSR0FURScsXG4gICAgICAgICAgICBOZXR3b3JrQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICBBd3NWcGNDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgQXNzaWduUHVibGljSXA6ICdESVNBQkxFRCcsXG4gICAgICAgICAgICAgICAgU2VjdXJpdHlHcm91cHM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJ1NjaGVkdWxlZEZhcmdhdGVUYXNrU2NoZWR1bGVkVGFza0RlZlNlY3VyaXR5R3JvdXBFMDc1QkMxOScsXG4gICAgICAgICAgICAgICAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFN1Ym5ldHM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnVnBjUHJpdmF0ZVN1Ym5ldDFTdWJuZXQ1MzZCOTk3QScsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgVGFza0NvdW50OiAxLFxuICAgICAgICAgICAgVGFza0RlZmluaXRpb25Bcm46IHsgUmVmOiAnU2NoZWR1bGVkRmFyZ2F0ZVRhc2tTY2hlZHVsZWRUYXNrRGVmNTIxRkE2NzUnIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgICAgIElucHV0OiAne30nLFxuICAgICAgICAgIFJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ1NjaGVkdWxlZEZhcmdhdGVUYXNrU2NoZWR1bGVkVGFza0RlZkV2ZW50c1JvbGU2Q0UxOTUyMicsICdBcm4nXSB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KSk7XG5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEVzc2VudGlhbDogdHJ1ZSxcbiAgICAgICAgICBJbWFnZTogJ2hlbmsnLFxuICAgICAgICAgIExvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIExvZ0RyaXZlcjogJ2F3c2xvZ3MnLFxuICAgICAgICAgICAgT3B0aW9uczoge1xuICAgICAgICAgICAgICAnYXdzbG9ncy1ncm91cCc6IHtcbiAgICAgICAgICAgICAgICBSZWY6ICdTY2hlZHVsZWRGYXJnYXRlVGFza1NjaGVkdWxlZFRhc2tEZWZTY2hlZHVsZWRDb250YWluZXJMb2dHcm91cDQxMzRCMTZDJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ2F3c2xvZ3Mtc3RyZWFtLXByZWZpeCc6ICdTY2hlZHVsZWRGYXJnYXRlVGFzaycsXG4gICAgICAgICAgICAgICdhd3Nsb2dzLXJlZ2lvbic6IHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgTmFtZTogJ1NjaGVkdWxlZENvbnRhaW5lcicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pKTtcblxuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxuXG4gICdDYW4gY3JlYXRlIGEgc2NoZWR1bGVkIEZhcmdhdGUgVGFzayAtIHdpdGggb3B0aW9uYWwgcHJvcHMnKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJywgeyBtYXhBenM6IDEgfSk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgIG5ldyBTY2hlZHVsZWRGYXJnYXRlVGFzayhzdGFjaywgJ1NjaGVkdWxlZEZhcmdhdGVUYXNrJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHNjaGVkdWxlZEZhcmdhdGVUYXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZW5rJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICAgIGNwdTogMixcbiAgICAgICAgZW52aXJvbm1lbnQ6IHsgVFJJR0dFUjogJ0Nsb3VkV2F0Y2ggRXZlbnRzJyB9LFxuICAgICAgfSxcbiAgICAgIGRlc2lyZWRUYXNrQ291bnQ6IDIsXG4gICAgICBzY2hlZHVsZTogZXZlbnRzLlNjaGVkdWxlLmV4cHJlc3Npb24oJ3JhdGUoMSBtaW51dGUpJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgVGFyZ2V0czogW1xuICAgICAgICB7XG4gICAgICAgICAgQXJuOiB7ICdGbjo6R2V0QXR0JzogWydFY3NDbHVzdGVyOTcyNDJCODQnLCAnQXJuJ10gfSxcbiAgICAgICAgICBFY3NQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICBMYXVuY2hUeXBlOiAnRkFSR0FURScsXG4gICAgICAgICAgICBOZXR3b3JrQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICBBd3NWcGNDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgQXNzaWduUHVibGljSXA6ICdESVNBQkxFRCcsXG4gICAgICAgICAgICAgICAgU2VjdXJpdHlHcm91cHM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJ1NjaGVkdWxlZEZhcmdhdGVUYXNrU2NoZWR1bGVkVGFza0RlZlNlY3VyaXR5R3JvdXBFMDc1QkMxOScsXG4gICAgICAgICAgICAgICAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFN1Ym5ldHM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnVnBjUHJpdmF0ZVN1Ym5ldDFTdWJuZXQ1MzZCOTk3QScsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgVGFza0NvdW50OiAyLFxuICAgICAgICAgICAgVGFza0RlZmluaXRpb25Bcm46IHsgUmVmOiAnU2NoZWR1bGVkRmFyZ2F0ZVRhc2tTY2hlZHVsZWRUYXNrRGVmNTIxRkE2NzUnIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgICAgIElucHV0OiAne30nLFxuICAgICAgICAgIFJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ1NjaGVkdWxlZEZhcmdhdGVUYXNrU2NoZWR1bGVkVGFza0RlZkV2ZW50c1JvbGU2Q0UxOTUyMicsICdBcm4nXSB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KSk7XG5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEVudmlyb25tZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdUUklHR0VSJyxcbiAgICAgICAgICAgICAgVmFsdWU6ICdDbG91ZFdhdGNoIEV2ZW50cycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgRXNzZW50aWFsOiB0cnVlLFxuICAgICAgICAgIEltYWdlOiAnaGVuaycsXG4gICAgICAgICAgTG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgTG9nRHJpdmVyOiAnYXdzbG9ncycsXG4gICAgICAgICAgICBPcHRpb25zOiB7XG4gICAgICAgICAgICAgICdhd3Nsb2dzLWdyb3VwJzoge1xuICAgICAgICAgICAgICAgIFJlZjogJ1NjaGVkdWxlZEZhcmdhdGVUYXNrU2NoZWR1bGVkVGFza0RlZlNjaGVkdWxlZENvbnRhaW5lckxvZ0dyb3VwNDEzNEIxNkMnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnYXdzbG9ncy1zdHJlYW0tcHJlZml4JzogJ1NjaGVkdWxlZEZhcmdhdGVUYXNrJyxcbiAgICAgICAgICAgICAgJ2F3c2xvZ3MtcmVnaW9uJzoge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBOYW1lOiAnU2NoZWR1bGVkQ29udGFpbmVyJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSkpO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ1NjaGVkdWxlZCBGYXJnYXRlIFRhc2sgLSB3aXRoIE1lbW9yeVJlc2VydmF0aW9uIGRlZmluZWQnKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJywgeyBtYXhBenM6IDEgfSk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgIG5ldyBTY2hlZHVsZWRGYXJnYXRlVGFzayhzdGFjaywgJ1NjaGVkdWxlZEZhcmdhdGVUYXNrJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHNjaGVkdWxlZEZhcmdhdGVUYXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZW5rJyksXG4gICAgICB9LFxuICAgICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEgbWludXRlKScpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgRXNzZW50aWFsOiB0cnVlLFxuICAgICAgICAgIEltYWdlOiAnaGVuaycsXG4gICAgICAgICAgTG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgTG9nRHJpdmVyOiAnYXdzbG9ncycsXG4gICAgICAgICAgICBPcHRpb25zOiB7XG4gICAgICAgICAgICAgICdhd3Nsb2dzLWdyb3VwJzoge1xuICAgICAgICAgICAgICAgIFJlZjogJ1NjaGVkdWxlZEZhcmdhdGVUYXNrU2NoZWR1bGVkVGFza0RlZlNjaGVkdWxlZENvbnRhaW5lckxvZ0dyb3VwNDEzNEIxNkMnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnYXdzbG9ncy1zdHJlYW0tcHJlZml4JzogJ1NjaGVkdWxlZEZhcmdhdGVUYXNrJyxcbiAgICAgICAgICAgICAgJ2F3c2xvZ3MtcmVnaW9uJzoge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBOYW1lOiAnU2NoZWR1bGVkQ29udGFpbmVyJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSkpO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ1NjaGVkdWxlZCBGYXJnYXRlIFRhc2sgLSB3aXRoIENvbW1hbmQgZGVmaW5lZCcodGVzdDogVGVzdCkge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnLCB7IG1heEF6czogMSB9KTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4gICAgbmV3IFNjaGVkdWxlZEZhcmdhdGVUYXNrKHN0YWNrLCAnU2NoZWR1bGVkRmFyZ2F0ZVRhc2snLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgc2NoZWR1bGVkRmFyZ2F0ZVRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbmsnKSxcbiAgICAgICAgY29tbWFuZDogWyctYycsICc0JywgJ2FtYXpvbi5jb20nXSxcbiAgICAgIH0sXG4gICAgICBzY2hlZHVsZTogZXZlbnRzLlNjaGVkdWxlLmV4cHJlc3Npb24oJ3JhdGUoMSBtaW51dGUpJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBDb21tYW5kOiBbXG4gICAgICAgICAgICAnLWMnLFxuICAgICAgICAgICAgJzQnLFxuICAgICAgICAgICAgJ2FtYXpvbi5jb20nLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgRXNzZW50aWFsOiB0cnVlLFxuICAgICAgICAgIEltYWdlOiAnaGVuaycsXG4gICAgICAgICAgTG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgTG9nRHJpdmVyOiAnYXdzbG9ncycsXG4gICAgICAgICAgICBPcHRpb25zOiB7XG4gICAgICAgICAgICAgICdhd3Nsb2dzLWdyb3VwJzoge1xuICAgICAgICAgICAgICAgIFJlZjogJ1NjaGVkdWxlZEZhcmdhdGVUYXNrU2NoZWR1bGVkVGFza0RlZlNjaGVkdWxlZENvbnRhaW5lckxvZ0dyb3VwNDEzNEIxNkMnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnYXdzbG9ncy1zdHJlYW0tcHJlZml4JzogJ1NjaGVkdWxlZEZhcmdhdGVUYXNrJyxcbiAgICAgICAgICAgICAgJ2F3c2xvZ3MtcmVnaW9uJzoge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBOYW1lOiAnU2NoZWR1bGVkQ29udGFpbmVyJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSkpO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ1NjaGVkdWxlZCBGYXJnYXRlIFRhc2sgLSB3aXRoIHN1Ym5ldFNlbGVjdGlvbiBkZWZpbmVkJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycsIHtcbiAgICAgIG1heEF6czogMSxcbiAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgeyBuYW1lOiAnUHVibGljJywgY2lkck1hc2s6IDI4LCBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgIG5ldyBTY2hlZHVsZWRGYXJnYXRlVGFzayhzdGFjaywgJ1NjaGVkdWxlZEZhcmdhdGVUYXNrJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHNjaGVkdWxlZEZhcmdhdGVUYXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZW5rJyksXG4gICAgICB9LFxuICAgICAgc3VibmV0U2VsZWN0aW9uOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9LFxuICAgICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEgbWludXRlKScpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlTGlrZSgnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICBUYXJnZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBFY3NQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICBOZXR3b3JrQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICBBd3NWcGNDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgQXNzaWduUHVibGljSXA6ICdFTkFCTEVEJyxcbiAgICAgICAgICAgICAgICBTdWJuZXRzOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ1ZwY1B1YmxpY1N1Ym5ldDFTdWJuZXQ1QzJEMzdDNCcsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pKTtcblxuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxufTtcbiJdfQ==