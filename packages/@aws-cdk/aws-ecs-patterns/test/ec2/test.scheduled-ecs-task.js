"use strict";
const assert_1 = require("@aws-cdk/assert");
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const events = require("@aws-cdk/aws-events");
const cdk = require("@aws-cdk/core");
const lib_1 = require("../../lib");
module.exports = {
    'Can create a scheduled Ec2 Task - with only required props'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
        });
        new lib_1.ScheduledEc2Task(stack, 'ScheduledEc2Task', {
            cluster,
            scheduledEc2TaskImageOptions: {
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
                        TaskCount: 1,
                        TaskDefinitionArn: { Ref: 'ScheduledEc2TaskScheduledTaskDef56328BA4' },
                    },
                    Id: 'Target0',
                    Input: '{}',
                    RoleArn: { 'Fn::GetAtt': ['ScheduledEc2TaskScheduledTaskDefEventsRole64113C5F', 'Arn'] },
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
                                Ref: 'ScheduledEc2TaskScheduledTaskDefScheduledContainerLogGroupA85E11E6',
                            },
                            'awslogs-stream-prefix': 'ScheduledEc2Task',
                            'awslogs-region': {
                                Ref: 'AWS::Region',
                            },
                        },
                    },
                    Memory: 512,
                    Name: 'ScheduledContainer',
                },
            ],
        }));
        test.done();
    },
    'Can create a scheduled Ec2 Task - with optional props'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
        });
        new lib_1.ScheduledEc2Task(stack, 'ScheduledEc2Task', {
            cluster,
            scheduledEc2TaskImageOptions: {
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
                        TaskCount: 2,
                        TaskDefinitionArn: { Ref: 'ScheduledEc2TaskScheduledTaskDef56328BA4' },
                    },
                    Id: 'Target0',
                    Input: '{}',
                    RoleArn: { 'Fn::GetAtt': ['ScheduledEc2TaskScheduledTaskDefEventsRole64113C5F', 'Arn'] },
                },
            ],
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                {
                    Cpu: 2,
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
                                Ref: 'ScheduledEc2TaskScheduledTaskDefScheduledContainerLogGroupA85E11E6',
                            },
                            'awslogs-stream-prefix': 'ScheduledEc2Task',
                            'awslogs-region': {
                                Ref: 'AWS::Region',
                            },
                        },
                    },
                    Memory: 512,
                    Name: 'ScheduledContainer',
                },
            ],
        }));
        test.done();
    },
    'Scheduled Ec2 Task - with MemoryReservation defined'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
        });
        new lib_1.ScheduledEc2Task(stack, 'ScheduledEc2Task', {
            cluster,
            scheduledEc2TaskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('henk'),
                memoryReservationMiB: 512,
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
                                Ref: 'ScheduledEc2TaskScheduledTaskDefScheduledContainerLogGroupA85E11E6',
                            },
                            'awslogs-stream-prefix': 'ScheduledEc2Task',
                            'awslogs-region': {
                                Ref: 'AWS::Region',
                            },
                        },
                    },
                    MemoryReservation: 512,
                    Name: 'ScheduledContainer',
                },
            ],
        }));
        test.done();
    },
    'Scheduled Ec2 Task - with Command defined'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
        });
        new lib_1.ScheduledEc2Task(stack, 'ScheduledEc2Task', {
            cluster,
            scheduledEc2TaskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('henk'),
                memoryReservationMiB: 512,
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
                                Ref: 'ScheduledEc2TaskScheduledTaskDefScheduledContainerLogGroupA85E11E6',
                            },
                            'awslogs-stream-prefix': 'ScheduledEc2Task',
                            'awslogs-region': {
                                Ref: 'AWS::Region',
                            },
                        },
                    },
                    MemoryReservation: 512,
                    Name: 'ScheduledContainer',
                },
            ],
        }));
        test.done();
    },
    'throws if desiredTaskCount is 0'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
        });
        // THEN
        test.throws(() => new lib_1.ScheduledEc2Task(stack, 'ScheduledEc2Task', {
            cluster,
            scheduledEc2TaskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('henk'),
                memoryLimitMiB: 512,
            },
            schedule: events.Schedule.expression('rate(1 minute)'),
            desiredTaskCount: 0,
        }), /You must specify a desiredTaskCount greater than 0/);
        test.done();
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5zY2hlZHVsZWQtZWNzLXRhc2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZXN0LnNjaGVkdWxlZC1lY3MtdGFzay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNENBQXVEO0FBQ3ZELHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsOENBQThDO0FBQzlDLHFDQUFxQztBQUVyQyxtQ0FBNkM7QUFFN0MsaUJBQVM7SUFDUCw0REFBNEQsQ0FBQyxJQUFVO1FBQ3JFLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM5RCxPQUFPLENBQUMsV0FBVyxDQUFDLHlCQUF5QixFQUFFO1lBQzdDLFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO1NBQy9DLENBQUMsQ0FBQztRQUVILElBQUksc0JBQWdCLENBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFFO1lBQzlDLE9BQU87WUFDUCw0QkFBNEIsRUFBRTtnQkFDNUIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztnQkFDOUMsY0FBYyxFQUFFLEdBQUc7YUFDcEI7WUFDRCxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7U0FDdkQsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMscUJBQVksQ0FBQyxtQkFBbUIsRUFB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ZGsvYXNzZXJ0JztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICdAYXdzLWNkay9hd3MtZWNzJztcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFRlc3QgfSBmcm9tICdub2RldW5pdCc7XG5pbXBvcnQgeyBTY2hlZHVsZWRFYzJUYXNrIH0gZnJvbSAnLi4vLi4vbGliJztcblxuZXhwb3J0ID0ge1xuICAnQ2FuIGNyZWF0ZSBhIHNjaGVkdWxlZCBFYzIgVGFzayAtIHdpdGggb25seSByZXF1aXJlZCBwcm9wcycodGVzdDogVGVzdCkge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnLCB7IG1heEF6czogMSB9KTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSxcbiAgICB9KTtcblxuICAgIG5ldyBTY2hlZHVsZWRFYzJUYXNrKHN0YWNrLCAnU2NoZWR1bGVkRWMyVGFzaycsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBzY2hlZHVsZWRFYzJUYXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZW5rJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICB9LFxuICAgICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEgbWludXRlKScpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgIFRhcmdldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFybjogeyAnRm46OkdldEF0dCc6IFsnRWNzQ2x1c3Rlcjk3MjQyQjg0JywgJ0FybiddIH0sXG4gICAgICAgICAgRWNzUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgVGFza0NvdW50OiAxLFxuICAgICAgICAgICAgVGFza0RlZmluaXRpb25Bcm46IHsgUmVmOiAnU2NoZWR1bGVkRWMyVGFza1NjaGVkdWxlZFRhc2tEZWY1NjMyOEJBNCcgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIElkOiAnVGFyZ2V0MCcsXG4gICAgICAgICAgSW5wdXQ6ICd7fScsXG4gICAgICAgICAgUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnU2NoZWR1bGVkRWMyVGFza1NjaGVkdWxlZFRhc2tEZWZFdmVudHNSb2xlNjQxMTNDNUYnLCAnQXJuJ10gfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSkpO1xuXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBFc3NlbnRpYWw6IHRydWUsXG4gICAgICAgICAgSW1hZ2U6ICdoZW5rJyxcbiAgICAgICAgICBMb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBMb2dEcml2ZXI6ICdhd3Nsb2dzJyxcbiAgICAgICAgICAgIE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgJ2F3c2xvZ3MtZ3JvdXAnOiB7XG4gICAgICAgICAgICAgICAgUmVmOiAnU2NoZWR1bGVkRWMyVGFza1NjaGVkdWxlZFRhc2tEZWZTY2hlZHVsZWRDb250YWluZXJMb2dHcm91cEE4NUUxMUU2JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ2F3c2xvZ3Mtc3RyZWFtLXByZWZpeCc6ICdTY2hlZHVsZWRFYzJUYXNrJyxcbiAgICAgICAgICAgICAgJ2F3c2xvZ3MtcmVnaW9uJzoge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBNZW1vcnk6IDUxMixcbiAgICAgICAgICBOYW1lOiAnU2NoZWR1bGVkQ29udGFpbmVyJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSkpO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ0NhbiBjcmVhdGUgYSBzY2hlZHVsZWQgRWMyIFRhc2sgLSB3aXRoIG9wdGlvbmFsIHByb3BzJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycsIHsgbWF4QXpzOiAxIH0pO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpLFxuICAgIH0pO1xuXG4gICAgbmV3IFNjaGVkdWxlZEVjMlRhc2soc3RhY2ssICdTY2hlZHVsZWRFYzJUYXNrJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHNjaGVkdWxlZEVjMlRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbmsnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgICAgY3B1OiAyLFxuICAgICAgICBlbnZpcm9ubWVudDogeyBUUklHR0VSOiAnQ2xvdWRXYXRjaCBFdmVudHMnIH0sXG4gICAgICB9LFxuICAgICAgZGVzaXJlZFRhc2tDb3VudDogMixcbiAgICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxIG1pbnV0ZSknKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICBUYXJnZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcsICdBcm4nXSB9LFxuICAgICAgICAgIEVjc1BhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgIFRhc2tDb3VudDogMixcbiAgICAgICAgICAgIFRhc2tEZWZpbml0aW9uQXJuOiB7IFJlZjogJ1NjaGVkdWxlZEVjMlRhc2tTY2hlZHVsZWRUYXNrRGVmNTYzMjhCQTQnIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgICAgIElucHV0OiAne30nLFxuICAgICAgICAgIFJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ1NjaGVkdWxlZEVjMlRhc2tTY2hlZHVsZWRUYXNrRGVmRXZlbnRzUm9sZTY0MTEzQzVGJywgJ0FybiddIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pKTtcblxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgQ3B1OiAyLFxuICAgICAgICAgIEVudmlyb25tZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdUUklHR0VSJyxcbiAgICAgICAgICAgICAgVmFsdWU6ICdDbG91ZFdhdGNoIEV2ZW50cycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgRXNzZW50aWFsOiB0cnVlLFxuICAgICAgICAgIEltYWdlOiAnaGVuaycsXG4gICAgICAgICAgTG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgTG9nRHJpdmVyOiAnYXdzbG9ncycsXG4gICAgICAgICAgICBPcHRpb25zOiB7XG4gICAgICAgICAgICAgICdhd3Nsb2dzLWdyb3VwJzoge1xuICAgICAgICAgICAgICAgIFJlZjogJ1NjaGVkdWxlZEVjMlRhc2tTY2hlZHVsZWRUYXNrRGVmU2NoZWR1bGVkQ29udGFpbmVyTG9nR3JvdXBBODVFMTFFNicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdhd3Nsb2dzLXN0cmVhbS1wcmVmaXgnOiAnU2NoZWR1bGVkRWMyVGFzaycsXG4gICAgICAgICAgICAgICdhd3Nsb2dzLXJlZ2lvbic6IHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgTWVtb3J5OiA1MTIsXG4gICAgICAgICAgTmFtZTogJ1NjaGVkdWxlZENvbnRhaW5lcicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pKTtcblxuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxuXG4gICdTY2hlZHVsZWQgRWMyIFRhc2sgLSB3aXRoIE1lbW9yeVJlc2VydmF0aW9uIGRlZmluZWQnKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJywgeyBtYXhBenM6IDEgfSk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgfSk7XG5cbiAgICBuZXcgU2NoZWR1bGVkRWMyVGFzayhzdGFjaywgJ1NjaGVkdWxlZEVjMlRhc2snLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgc2NoZWR1bGVkRWMyVGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVuaycpLFxuICAgICAgICBtZW1vcnlSZXNlcnZhdGlvbk1pQjogNTEyLFxuICAgICAgfSxcbiAgICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxIG1pbnV0ZSknKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEVzc2VudGlhbDogdHJ1ZSxcbiAgICAgICAgICBJbWFnZTogJ2hlbmsnLFxuICAgICAgICAgIExvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIExvZ0RyaXZlcjogJ2F3c2xvZ3MnLFxuICAgICAgICAgICAgT3B0aW9uczoge1xuICAgICAgICAgICAgICAnYXdzbG9ncy1ncm91cCc6IHtcbiAgICAgICAgICAgICAgICBSZWY6ICdTY2hlZHVsZWRFYzJUYXNrU2NoZWR1bGVkVGFza0RlZlNjaGVkdWxlZENvbnRhaW5lckxvZ0dyb3VwQTg1RTExRTYnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnYXdzbG9ncy1zdHJlYW0tcHJlZml4JzogJ1NjaGVkdWxlZEVjMlRhc2snLFxuICAgICAgICAgICAgICAnYXdzbG9ncy1yZWdpb24nOiB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIE1lbW9yeVJlc2VydmF0aW9uOiA1MTIsXG4gICAgICAgICAgTmFtZTogJ1NjaGVkdWxlZENvbnRhaW5lcicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pKTtcblxuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxuXG4gICdTY2hlZHVsZWQgRWMyIFRhc2sgLSB3aXRoIENvbW1hbmQgZGVmaW5lZCcodGVzdDogVGVzdCkge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnLCB7IG1heEF6czogMSB9KTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSxcbiAgICB9KTtcblxuICAgIG5ldyBTY2hlZHVsZWRFYzJUYXNrKHN0YWNrLCAnU2NoZWR1bGVkRWMyVGFzaycsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBzY2hlZHVsZWRFYzJUYXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZW5rJyksXG4gICAgICAgIG1lbW9yeVJlc2VydmF0aW9uTWlCOiA1MTIsXG4gICAgICAgIGNvbW1hbmQ6IFsnLWMnLCAnNCcsICdhbWF6b24uY29tJ10sXG4gICAgICB9LFxuICAgICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEgbWludXRlKScpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgQ29tbWFuZDogW1xuICAgICAgICAgICAgJy1jJyxcbiAgICAgICAgICAgICc0JyxcbiAgICAgICAgICAgICdhbWF6b24uY29tJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIEVzc2VudGlhbDogdHJ1ZSxcbiAgICAgICAgICBJbWFnZTogJ2hlbmsnLFxuICAgICAgICAgIExvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIExvZ0RyaXZlcjogJ2F3c2xvZ3MnLFxuICAgICAgICAgICAgT3B0aW9uczoge1xuICAgICAgICAgICAgICAnYXdzbG9ncy1ncm91cCc6IHtcbiAgICAgICAgICAgICAgICBSZWY6ICdTY2hlZHVsZWRFYzJUYXNrU2NoZWR1bGVkVGFza0RlZlNjaGVkdWxlZENvbnRhaW5lckxvZ0dyb3VwQTg1RTExRTYnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnYXdzbG9ncy1zdHJlYW0tcHJlZml4JzogJ1NjaGVkdWxlZEVjMlRhc2snLFxuICAgICAgICAgICAgICAnYXdzbG9ncy1yZWdpb24nOiB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIE1lbW9yeVJlc2VydmF0aW9uOiA1MTIsXG4gICAgICAgICAgTmFtZTogJ1NjaGVkdWxlZENvbnRhaW5lcicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pKTtcblxuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxuXG4gICd0aHJvd3MgaWYgZGVzaXJlZFRhc2tDb3VudCBpcyAwJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycsIHsgbWF4QXpzOiAxIH0pO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIHRlc3QudGhyb3dzKCgpID0+XG4gICAgICBuZXcgU2NoZWR1bGVkRWMyVGFzayhzdGFjaywgJ1NjaGVkdWxlZEVjMlRhc2snLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHNjaGVkdWxlZEVjMlRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVuaycpLFxuICAgICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICAgIH0sXG4gICAgICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxIG1pbnV0ZSknKSxcbiAgICAgICAgZGVzaXJlZFRhc2tDb3VudDogMCxcbiAgICAgIH0pLFxuICAgIC9Zb3UgbXVzdCBzcGVjaWZ5IGEgZGVzaXJlZFRhc2tDb3VudCBncmVhdGVyIHRoYW4gMC8pO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG59O1xuIl19