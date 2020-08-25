"use strict";
const assert_1 = require("@aws-cdk/assert");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../../lib");
module.exports = {
    'When Application Load Balancer': {
        'test Fargate loadbalanced construct with default settings'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
            // WHEN
            new lib_1.ApplicationMultipleTargetGroupsFargateService(stack, 'Service', {
                cluster,
                taskImageOptions: {
                    image: ecs.ContainerImage.fromRegistry('test'),
                },
            });
            // THEN - stack contains a load balancer and a service
            assert_1.expect(stack).to(assert_1.haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));
            assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
                DesiredCount: 1,
                LaunchType: 'FARGATE',
                LoadBalancers: [
                    {
                        ContainerName: 'web',
                        ContainerPort: 80,
                        TargetGroupArn: {
                            Ref: 'ServiceLBPublicListenerECSGroup0CC8688C',
                        },
                    },
                ],
            }));
            assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    {
                        Image: 'test',
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'ServiceTaskDefwebLogGroup2A898F61',
                                },
                                'awslogs-stream-prefix': 'Service',
                                'awslogs-region': {
                                    Ref: 'AWS::Region',
                                },
                            },
                        },
                        Name: 'web',
                        PortMappings: [
                            {
                                ContainerPort: 80,
                                Protocol: 'tcp',
                            },
                        ],
                    },
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': [
                        'ServiceTaskDefExecutionRole919F7BE3',
                        'Arn',
                    ],
                },
                Family: 'ServiceTaskDef79D79521',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: [
                    'FARGATE',
                ],
            }));
            test.done();
        },
        'test Fargate loadbalanced construct with all settings'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
            // WHEN
            new lib_1.ApplicationMultipleTargetGroupsFargateService(stack, 'Service', {
                cluster,
                taskImageOptions: {
                    image: ecs.ContainerImage.fromRegistry('test'),
                    containerName: 'hello',
                    containerPorts: [80, 90],
                    enableLogging: false,
                    environment: {
                        TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
                        TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
                    },
                    logDriver: new ecs.AwsLogDriver({
                        streamPrefix: 'TestStream',
                    }),
                    family: 'Ec2TaskDef',
                    executionRole: new aws_iam_1.Role(stack, 'ExecutionRole', {
                        path: '/',
                        assumedBy: new aws_iam_1.CompositePrincipal(new aws_iam_1.ServicePrincipal('ecs.amazonaws.com'), new aws_iam_1.ServicePrincipal('ecs-tasks.amazonaws.com')),
                    }),
                    taskRole: new aws_iam_1.Role(stack, 'TaskRole', {
                        assumedBy: new aws_iam_1.ServicePrincipal('ecs-tasks.amazonaws.com'),
                    }),
                },
                cpu: 256,
                assignPublicIp: true,
                memoryLimitMiB: 512,
                desiredCount: 3,
                enableECSManagedTags: true,
                healthCheckGracePeriod: core_1.Duration.millis(2000),
                platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
                propagateTags: ecs.PropagatedTagSource.SERVICE,
                serviceName: 'myService',
                targetGroups: [
                    {
                        containerPort: 80,
                    },
                    {
                        containerPort: 90,
                        pathPattern: 'a/b/c',
                        priority: 10,
                        protocol: ecs.Protocol.TCP,
                    },
                ],
            });
            // THEN - stack contains a load balancer and a service
            assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
                DesiredCount: 3,
                EnableECSManagedTags: true,
                HealthCheckGracePeriodSeconds: 2,
                LaunchType: 'FARGATE',
                LoadBalancers: [
                    {
                        ContainerName: 'hello',
                        ContainerPort: 80,
                        TargetGroupArn: {
                            Ref: 'ServiceLBPublicListenerECSTargetGrouphello80Group233A4D54',
                        },
                    },
                    {
                        ContainerName: 'hello',
                        ContainerPort: 90,
                        TargetGroupArn: {
                            Ref: 'ServiceLBPublicListenerECSTargetGrouphello90GroupE58E4EAB',
                        },
                    },
                ],
                NetworkConfiguration: {
                    AwsvpcConfiguration: {
                        AssignPublicIp: 'ENABLED',
                        SecurityGroups: [
                            {
                                'Fn::GetAtt': [
                                    'ServiceSecurityGroupEEA09B68',
                                    'GroupId',
                                ],
                            },
                        ],
                        Subnets: [
                            {
                                Ref: 'VPCPublicSubnet1SubnetB4246D30',
                            },
                            {
                                Ref: 'VPCPublicSubnet2Subnet74179F39',
                            },
                        ],
                    },
                },
                PlatformVersion: ecs.FargatePlatformVersion.VERSION1_4,
                PropagateTags: 'SERVICE',
                ServiceName: 'myService',
            }));
            assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    {
                        Environment: [
                            {
                                Name: 'TEST_ENVIRONMENT_VARIABLE1',
                                Value: 'test environment variable 1 value',
                            },
                            {
                                Name: 'TEST_ENVIRONMENT_VARIABLE2',
                                Value: 'test environment variable 2 value',
                            },
                        ],
                        Essential: true,
                        Image: 'test',
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'ServiceTaskDefhelloLogGroup44519781',
                                },
                                'awslogs-stream-prefix': 'TestStream',
                                'awslogs-region': {
                                    Ref: 'AWS::Region',
                                },
                            },
                        },
                        Name: 'hello',
                        PortMappings: [
                            {
                                ContainerPort: 80,
                                Protocol: 'tcp',
                            },
                            {
                                ContainerPort: 90,
                                Protocol: 'tcp',
                            },
                        ],
                    },
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': [
                        'ExecutionRole605A040B',
                        'Arn',
                    ],
                },
                Family: 'Ec2TaskDef',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: [
                    'FARGATE',
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': [
                        'TaskRole30FC0FBB',
                        'Arn',
                    ],
                },
            }));
            test.done();
        },
        'errors if no essential container in pre-defined task definition'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
            const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
            // THEN
            test.throws(() => {
                new lib_1.ApplicationMultipleTargetGroupsFargateService(stack, 'Service', {
                    cluster,
                    taskDefinition,
                });
            }, /At least one essential container must be specified/);
            test.done();
        },
        'errors when setting both taskDefinition and taskImageOptions'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
            const taskDefinition = new ecs.FargateTaskDefinition(stack, 'Ec2TaskDef');
            // THEN
            test.throws(() => {
                new lib_1.ApplicationMultipleTargetGroupsFargateService(stack, 'Service', {
                    cluster,
                    taskImageOptions: {
                        image: ecs.ContainerImage.fromRegistry('test'),
                    },
                    taskDefinition,
                });
            }, /You must specify only one of TaskDefinition or TaskImageOptions./);
            test.done();
        },
        'errors when setting neither taskDefinition nor taskImageOptions'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
            // THEN
            test.throws(() => {
                new lib_1.ApplicationMultipleTargetGroupsFargateService(stack, 'Service', {
                    cluster,
                });
            }, /You must specify one of: taskDefinition or image/);
            test.done();
        },
    },
    'When Network Load Balancer': {
        'test Fargate loadbalanced construct with default settings'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
            // WHEN
            new lib_1.NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
                cluster,
                taskImageOptions: {
                    image: ecs.ContainerImage.fromRegistry('test'),
                },
            });
            // THEN - stack contains a load balancer and a service
            assert_1.expect(stack).to(assert_1.haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));
            assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
                DesiredCount: 1,
                LaunchType: 'FARGATE',
                LoadBalancers: [
                    {
                        ContainerName: 'web',
                        ContainerPort: 80,
                        TargetGroupArn: {
                            Ref: 'ServiceLBPublicListenerECSGroup0CC8688C',
                        },
                    },
                ],
            }));
            assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    {
                        Image: 'test',
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'ServiceTaskDefwebLogGroup2A898F61',
                                },
                                'awslogs-stream-prefix': 'Service',
                                'awslogs-region': {
                                    Ref: 'AWS::Region',
                                },
                            },
                        },
                        Name: 'web',
                        PortMappings: [
                            {
                                ContainerPort: 80,
                                Protocol: 'tcp',
                            },
                        ],
                    },
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': [
                        'ServiceTaskDefExecutionRole919F7BE3',
                        'Arn',
                    ],
                },
                Family: 'ServiceTaskDef79D79521',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: [
                    'FARGATE',
                ],
            }));
            test.done();
        },
        'test Fargate loadbalanced construct with all settings'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
            // WHEN
            new lib_1.NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
                cluster,
                taskImageOptions: {
                    image: ecs.ContainerImage.fromRegistry('test'),
                    containerName: 'hello',
                    containerPorts: [80, 90],
                    enableLogging: false,
                    environment: {
                        TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
                        TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
                    },
                    logDriver: new ecs.AwsLogDriver({
                        streamPrefix: 'TestStream',
                    }),
                    family: 'Ec2TaskDef',
                    executionRole: new aws_iam_1.Role(stack, 'ExecutionRole', {
                        path: '/',
                        assumedBy: new aws_iam_1.CompositePrincipal(new aws_iam_1.ServicePrincipal('ecs.amazonaws.com'), new aws_iam_1.ServicePrincipal('ecs-tasks.amazonaws.com')),
                    }),
                    taskRole: new aws_iam_1.Role(stack, 'TaskRole', {
                        assumedBy: new aws_iam_1.ServicePrincipal('ecs-tasks.amazonaws.com'),
                    }),
                },
                cpu: 256,
                assignPublicIp: true,
                memoryLimitMiB: 512,
                desiredCount: 3,
                enableECSManagedTags: true,
                healthCheckGracePeriod: core_1.Duration.millis(2000),
                propagateTags: ecs.PropagatedTagSource.SERVICE,
                serviceName: 'myService',
                targetGroups: [
                    {
                        containerPort: 80,
                    },
                    {
                        containerPort: 90,
                    },
                ],
            });
            // THEN - stack contains a load balancer and a service
            assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
                DesiredCount: 3,
                EnableECSManagedTags: true,
                HealthCheckGracePeriodSeconds: 2,
                LaunchType: 'FARGATE',
                LoadBalancers: [
                    {
                        ContainerName: 'hello',
                        ContainerPort: 80,
                        TargetGroupArn: {
                            Ref: 'ServiceLBPublicListenerECSTargetGrouphello80Group233A4D54',
                        },
                    },
                    {
                        ContainerName: 'hello',
                        ContainerPort: 90,
                        TargetGroupArn: {
                            Ref: 'ServiceLBPublicListenerECSTargetGrouphello90GroupE58E4EAB',
                        },
                    },
                ],
                NetworkConfiguration: {
                    AwsvpcConfiguration: {
                        AssignPublicIp: 'ENABLED',
                        SecurityGroups: [
                            {
                                'Fn::GetAtt': [
                                    'ServiceSecurityGroupEEA09B68',
                                    'GroupId',
                                ],
                            },
                        ],
                        Subnets: [
                            {
                                Ref: 'VPCPublicSubnet1SubnetB4246D30',
                            },
                            {
                                Ref: 'VPCPublicSubnet2Subnet74179F39',
                            },
                        ],
                    },
                },
                PropagateTags: 'SERVICE',
                ServiceName: 'myService',
            }));
            assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    {
                        Environment: [
                            {
                                Name: 'TEST_ENVIRONMENT_VARIABLE1',
                                Value: 'test environment variable 1 value',
                            },
                            {
                                Name: 'TEST_ENVIRONMENT_VARIABLE2',
                                Value: 'test environment variable 2 value',
                            },
                        ],
                        Essential: true,
                        Image: 'test',
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'ServiceTaskDefhelloLogGroup44519781',
                                },
                                'awslogs-stream-prefix': 'TestStream',
                                'awslogs-region': {
                                    Ref: 'AWS::Region',
                                },
                            },
                        },
                        Name: 'hello',
                        PortMappings: [
                            {
                                ContainerPort: 80,
                                Protocol: 'tcp',
                            },
                            {
                                ContainerPort: 90,
                                Protocol: 'tcp',
                            },
                        ],
                    },
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': [
                        'ExecutionRole605A040B',
                        'Arn',
                    ],
                },
                Family: 'Ec2TaskDef',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: [
                    'FARGATE',
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': [
                        'TaskRole30FC0FBB',
                        'Arn',
                    ],
                },
            }));
            test.done();
        },
        'errors if no essential container in pre-defined task definition'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
            const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
            // THEN
            test.throws(() => {
                new lib_1.NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
                    cluster,
                    taskDefinition,
                });
            }, /At least one essential container must be specified/);
            test.done();
        },
        'errors when setting both taskDefinition and taskImageOptions'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
            const taskDefinition = new ecs.FargateTaskDefinition(stack, 'Ec2TaskDef');
            // THEN
            test.throws(() => {
                new lib_1.NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
                    cluster,
                    taskImageOptions: {
                        image: ecs.ContainerImage.fromRegistry('test'),
                    },
                    taskDefinition,
                });
            }, /You must specify only one of TaskDefinition or TaskImageOptions./);
            test.done();
        },
        'errors when setting neither taskDefinition nor taskImageOptions'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
            // THEN
            test.throws(() => {
                new lib_1.NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
                    cluster,
                });
            }, /You must specify one of: taskDefinition or image/);
            test.done();
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5sb2FkLWJhbGFuY2VkLWZhcmdhdGUtc2VydmljZS12Mi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QubG9hZC1iYWxhbmNlZC1mYXJnYXRlLXNlcnZpY2UtdjIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDRDQUF5RTtBQUN6RSw4Q0FBdUM7QUFDdkMsd0NBQXdDO0FBQ3hDLDhDQUE4RTtBQUM5RSx3Q0FBZ0Q7QUFFaEQsbUNBQXFIO0FBRXJILGlCQUFTO0lBQ1AsZ0NBQWdDLEVBQUU7UUFDaEMsMkRBQTJELENBQUMsSUFBVTtZQUNwRSxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixNQUFNLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRTNELE9BQU87WUFDUCxJQUFJLG1EQUE2QyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7Z0JBQ2xFLE9BQU87Z0JBQ1AsZ0JBQWdCLEVBQUU7b0JBQ2hCLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7aUJBQy9DO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsc0RBQXNEO1lBQ3RELGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMscUJBQVksQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDLENBQUM7WUFFNUUsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxxQkFBWSxDQUFDLG1CQUFtQixFQUFFO2dCQUNqRCxZQUFZLEVBQUUsQ0FBQztnQkFDZixVQUFVLEVBQUUsU0FBUztnQkFDckIsYUFBYSxFQUFFO29CQUNiO3dCQUNFLGFBQWEsRUFBRSxLQUFLO3dCQUNwQixhQUFh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QUssRUFBRSxDQUFDO1lBQzFCLE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNsQyxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFFM0QsT0FBTztZQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFO2dCQUNmLElBQUksK0NBQXlDLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtvQkFDOUQsT0FBTztpQkFDUixDQUFDLENBQUM7WUFDTCxDQUFDLEVBQUUsa0RBQWtELENBQUMsQ0FBQztZQUV2RCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZCxDQUFDO0tBQ0Y7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhwZWN0LCBoYXZlUmVzb3VyY2UsIGhhdmVSZXNvdXJjZUxpa2UgfSBmcm9tICdAYXdzLWNkay9hc3NlcnQnO1xuaW1wb3J0IHsgVnBjIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnQGF3cy1jZGsvYXdzLWVjcyc7XG5pbXBvcnQgeyBDb21wb3NpdGVQcmluY2lwYWwsIFJvbGUsIFNlcnZpY2VQcmluY2lwYWwgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IER1cmF0aW9uLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgVGVzdCB9IGZyb20gJ25vZGV1bml0JztcbmltcG9ydCB7IEFwcGxpY2F0aW9uTXVsdGlwbGVUYXJnZXRHcm91cHNGYXJnYXRlU2VydmljZSwgTmV0d29ya011bHRpcGxlVGFyZ2V0R3JvdXBzRmFyZ2F0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9saWInO1xuXG5leHBvcnQgPSB7XG4gICdXaGVuIEFwcGxpY2F0aW9uIExvYWQgQmFsYW5jZXInOiB7XG4gICAgJ3Rlc3QgRmFyZ2F0ZSBsb2FkYmFsYW5jZWQgY29uc3RydWN0IHdpdGggZGVmYXVsdCBzZXR0aW5ncycodGVzdDogVGVzdCkge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgQXBwbGljYXRpb25NdWx0aXBsZVRhcmdldEdyb3Vwc0ZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTiAtIHN0YWNrIGNvbnRhaW5zIGEgbG9hZCBiYWxhbmNlciBhbmQgYSBzZXJ2aWNlXG4gICAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMb2FkQmFsYW5jZXInKSk7XG5cbiAgICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgRGVzaXJlZENvdW50OiAxLFxuICAgICAgICBMYXVuY2hUeXBlOiAnRkFSR0FURScsXG4gICAgICAgIExvYWRCYWxhbmNlcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBDb250YWluZXJOYW1lOiAnd2ViJyxcbiAgICAgICAgICAgIENvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgICAgICAgVGFyZ2V0R3JvdXBBcm46IHtcbiAgICAgICAgICAgICAgUmVmOiAnU2VydmljZUxCUHVibGljTGlzdGVuZXJFQ1NHcm91cDBDQzg2ODhDJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pKTtcblxuICAgICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgSW1hZ2U6ICd0ZXN0JyxcbiAgICAgICAgICAgIExvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgTG9nRHJpdmVyOiAnYXdzbG9ncycsXG4gICAgICAgICAgICAgIE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAnYXdzbG9ncy1ncm91cCc6IHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ1NlcnZpY2VUYXNrRGVmd2ViTG9nR3JvdXAyQTg5OEY2MScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnYXdzbG9ncy1zdHJlYW0tcHJlZml4JzogJ1NlcnZpY2UnLFxuICAgICAgICAgICAgICAgICdhd3Nsb2dzLXJlZ2lvbic6IHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE5hbWU6ICd3ZWInLFxuICAgICAgICAgICAgUG9ydE1hcHBpbmdzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBDb250YWluZXJQb3J0OiA4MCxcbiAgICAgICAgICAgICAgICBQcm90b2NvbDogJ3RjcCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIENwdTogJzI1NicsXG4gICAgICAgIEV4ZWN1dGlvblJvbGVBcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdTZXJ2aWNlVGFza0RlZkV4ZWN1dGlvblJvbGU5MTlGN0JFMycsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBGYW1pbHk6ICdTZXJ2aWNlVGFza0RlZjc5RDc5NTIxJyxcbiAgICAgICAgTWVtb3J5OiAnNTEyJyxcbiAgICAgICAgTmV0d29ya01vZGU6ICdhd3N2cGMnLFxuICAgICAgICBSZXF1aXJlc0NvbXBhdGliaWxpdGllczogW1xuICAgICAgICAgICdGQVJHQVRFJyxcbiAgICAgICAgXSxcbiAgICAgIH0pKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICd0ZXN0IEZhcmdhdGUgbG9hZGJhbGFuY2VkIGNvbnN0cnVjdCB3aXRoIGFsbCBzZXR0aW5ncycodGVzdDogVGVzdCkge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgQXBwbGljYXRpb25NdWx0aXBsZVRhcmdldEdyb3Vwc0ZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICAgICAgY29udGFpbmVyTmFtZTogJ2hlbGxvJyxcbiAgICAgICAgICBjb250YWluZXJQb3J0czogWzgwLCA5MF0sXG4gICAgICAgICAgZW5hYmxlTG9nZ2luZzogZmFsc2UsXG4gICAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICAgIFRFU1RfRU5WSVJPTk1FTlRfVkFSSUFCTEUxOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAxIHZhbHVlJyxcbiAgICAgICAgICAgIFRFU1RfRU5WSVJPTk1FTlRfVkFSSUFCTEUyOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAyIHZhbHVlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGxvZ0RyaXZlcjogbmV3IGVjcy5Bd3NMb2dEcml2ZXIoe1xuICAgICAgICAgICAgc3RyZWFtUHJlZml4OiAnVGVzdFN0cmVhbScsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgZmFtaWx5OiAnRWMyVGFza0RlZicsXG4gICAgICAgICAgZXhlY3V0aW9uUm9sZTogbmV3IFJvbGUoc3RhY2ssICdFeGVjdXRpb25Sb2xlJywge1xuICAgICAgICAgICAgcGF0aDogJy8nLFxuICAgICAgICAgICAgYXNzdW1lZEJ5OiBuZXcgQ29tcG9zaXRlUHJpbmNpcGFsKFxuICAgICAgICAgICAgICBuZXcgU2VydmljZVByaW5jaXBhbCgnZWNzLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgICAgICAgICAgbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2Vjcy10YXNrcy5hbWF6b25hd3MuY29tJyksXG4gICAgICAgICAgICApLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIHRhc2tSb2xlOiBuZXcgUm9sZShzdGFjaywgJ1Rhc2tSb2xlJywge1xuICAgICAgICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnZWNzLXRhc2tzLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSxcbiAgICAgICAgY3B1OiAyNTYsXG4gICAgICAgIGFzc2lnblB1YmxpY0lwOiB0cnVlLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgICBkZXNpcmVkQ291bnQ6IDMsXG4gICAgICAgIGVuYWJsZUVDU01hbmFnZWRUYWdzOiB0cnVlLFxuICAgICAgICBoZWFsdGhDaGVja0dyYWNlUGVyaW9kOiBEdXJhdGlvbi5taWxsaXMoMjAwMCksXG4gICAgICAgIHBsYXRmb3JtVmVyc2lvbjogZWNzLkZhcmdhdGVQbGF0Zm9ybVZlcnNpb24uVkVSU0lPTjFfNCxcbiAgICAgICAgcHJvcGFnYXRlVGFnczogZWNzLlByb3BhZ2F0ZWRUYWdTb3VyY2UuU0VSVklDRSxcbiAgICAgICAgc2VydmljZU5hbWU6ICdteVNlcnZpY2UnLFxuICAgICAgICB0YXJnZXRHcm91cHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb250YWluZXJQb3J0OiA4MCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDkwLFxuICAgICAgICAgICAgcGF0aFBhdHRlcm46ICdhL2IvYycsXG4gICAgICAgICAgICBwcmlvcml0eTogMTAsXG4gICAgICAgICAgICBwcm90b2NvbDogZWNzLlByb3RvY29sLlRDUCxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU4gLSBzdGFjayBjb250YWlucyBhIGxvYWQgYmFsYW5jZXIgYW5kIGEgc2VydmljZVxuICAgICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICBEZXNpcmVkQ291bnQ6IDMsXG4gICAgICAgIEVuYWJsZUVDU01hbmFnZWRUYWdzOiB0cnVlLFxuICAgICAgICBIZWFsdGhDaGVja0dyYWNlUGVyaW9kU2Vjb25kczogMixcbiAgICAgICAgTGF1bmNoVHlwZTogJ0ZBUkdBVEUnLFxuICAgICAgICBMb2FkQmFsYW5jZXJzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ29udGFpbmVyTmFtZTogJ2hlbGxvJyxcbiAgICAgICAgICAgIENvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgICAgICAgVGFyZ2V0R3JvdXBBcm46IHtcbiAgICAgICAgICAgICAgUmVmOiAnU2VydmljZUxCUHVibGljTGlzdGVuZXJFQ1NUYXJnZXRHcm91cGhlbGxvODBHcm91cDIzM0E0RDU0JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBDb250YWluZXJOYW1lOiAnaGVsbG8nLFxuICAgICAgICAgICAgQ29udGFpbmVyUG9ydDogOTAsXG4gICAgICAgICAgICBUYXJnZXRHcm91cEFybjoge1xuICAgICAgICAgICAgICBSZWY6ICdTZXJ2aWNlTEJQdWJsaWNMaXN0ZW5lckVDU1RhcmdldEdyb3VwaGVsbG85MEdyb3VwRTU4RTRFQUInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBOZXR3b3JrQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIEF3c3ZwY0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIEFzc2lnblB1YmxpY0lwOiAnRU5BQkxFRCcsXG4gICAgICAgICAgICBTZWN1cml0eUdyb3VwczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnU2VydmljZVNlY3VyaXR5R3JvdXBFRUEwOUI2OCcsXG4gICAgICAgICAgICAgICAgICAnR3JvdXBJZCcsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBTdWJuZXRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdWUENQdWJsaWNTdWJuZXQxU3VibmV0QjQyNDZEMzAnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnVlBDUHVibGljU3VibmV0MlN1Ym5ldDc0MTc5RjM5JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgUGxhdGZvcm1WZXJzaW9uOiBlY3MuRmFyZ2F0ZVBsYXRmb3JtVmVyc2lvbi5WRVJTSU9OMV80LFxuICAgICAgICBQcm9wYWdhdGVUYWdzOiAnU0VSVklDRScsXG4gICAgICAgIFNlcnZpY2VOYW1lOiAnbXlTZXJ2aWNlJyxcbiAgICAgIH0pKTtcblxuICAgICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgRW52aXJvbm1lbnQ6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIE5hbWU6ICdURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMScsXG4gICAgICAgICAgICAgICAgVmFsdWU6ICd0ZXN0IGVudmlyb25tZW50IHZhcmlhYmxlIDEgdmFsdWUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgTmFtZTogJ1RFU1RfRU5WSVJPTk1FTlRfVkFSSUFCTEUyJyxcbiAgICAgICAgICAgICAgICBWYWx1ZTogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgMiB2YWx1ZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRXNzZW50aWFsOiB0cnVlLFxuICAgICAgICAgICAgSW1hZ2U6ICd0ZXN0JyxcbiAgICAgICAgICAgIExvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgTG9nRHJpdmVyOiAnYXdzbG9ncycsXG4gICAgICAgICAgICAgIE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAnYXdzbG9ncy1ncm91cCc6IHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ1NlcnZpY2VUYXNrRGVmaGVsbG9Mb2dHcm91cDQ0NTE5NzgxJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdhd3Nsb2dzLXN0cmVhbS1wcmVmaXgnOiAnVGVzdFN0cmVhbScsXG4gICAgICAgICAgICAgICAgJ2F3c2xvZ3MtcmVnaW9uJzoge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgTmFtZTogJ2hlbGxvJyxcbiAgICAgICAgICAgIFBvcnRNYXBwaW5nczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQ29udGFpbmVyUG9ydDogODAsXG4gICAgICAgICAgICAgICAgUHJvdG9jb2w6ICd0Y3AnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQ29udGFpbmVyUG9ydDogOTAsXG4gICAgICAgICAgICAgICAgUHJvdG9jb2w6ICd0Y3AnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBDcHU6ICcyNTYnLFxuICAgICAgICBFeGVjdXRpb25Sb2xlQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnRXhlY3V0aW9uUm9sZTYwNUEwNDBCJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIEZhbWlseTogJ0VjMlRhc2tEZWYnLFxuICAgICAgICBNZW1vcnk6ICc1MTInLFxuICAgICAgICBOZXR3b3JrTW9kZTogJ2F3c3ZwYycsXG4gICAgICAgIFJlcXVpcmVzQ29tcGF0aWJpbGl0aWVzOiBbXG4gICAgICAgICAgJ0ZBUkdBVEUnLFxuICAgICAgICBdLFxuICAgICAgICBUYXNrUm9sZUFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ1Rhc2tSb2xlMzBGQzBGQkInLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICdlcnJvcnMgaWYgbm8gZXNzZW50aWFsIGNvbnRhaW5lciBpbiBwcmUtZGVmaW5lZCB0YXNrIGRlZmluaXRpb24nKHRlc3Q6IFRlc3QpIHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIHRlc3QudGhyb3dzKCgpID0+IHtcbiAgICAgICAgbmV3IEFwcGxpY2F0aW9uTXVsdGlwbGVUYXJnZXRHcm91cHNGYXJnYXRlU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgfSk7XG4gICAgICB9LCAvQXQgbGVhc3Qgb25lIGVzc2VudGlhbCBjb250YWluZXIgbXVzdCBiZSBzcGVjaWZpZWQvKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICdlcnJvcnMgd2hlbiBzZXR0aW5nIGJvdGggdGFza0RlZmluaXRpb24gYW5kIHRhc2tJbWFnZU9wdGlvbnMnKHRlc3Q6IFRlc3QpIHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIHRlc3QudGhyb3dzKCgpID0+IHtcbiAgICAgICAgbmV3IEFwcGxpY2F0aW9uTXVsdGlwbGVUYXJnZXRHcm91cHNGYXJnYXRlU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIH0pO1xuICAgICAgfSwgL1lvdSBtdXN0IHNwZWNpZnkgb25seSBvbmUgb2YgVGFza0RlZmluaXRpb24gb3IgVGFza0ltYWdlT3B0aW9ucy4vKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICdlcnJvcnMgd2hlbiBzZXR0aW5nIG5laXRoZXIgdGFza0RlZmluaXRpb24gbm9yIHRhc2tJbWFnZU9wdGlvbnMnKHRlc3Q6IFRlc3QpIHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgdGVzdC50aHJvd3MoKCkgPT4ge1xuICAgICAgICBuZXcgQXBwbGljYXRpb25NdWx0aXBsZVRhcmdldEdyb3Vwc0ZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICB9KTtcbiAgICAgIH0sIC9Zb3UgbXVzdCBzcGVjaWZ5IG9uZSBvZjogdGFza0RlZmluaXRpb24gb3IgaW1hZ2UvKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcbiAgfSxcblxuICAnV2hlbiBOZXR3b3JrIExvYWQgQmFsYW5jZXInOiB7XG4gICAgJ3Rlc3QgRmFyZ2F0ZSBsb2FkYmFsYW5jZWQgY29uc3RydWN0IHdpdGggZGVmYXVsdCBzZXR0aW5ncycodGVzdDogVGVzdCkge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgTmV0d29ya011bHRpcGxlVGFyZ2V0R3JvdXBzRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOIC0gc3RhY2sgY29udGFpbnMgYSBsb2FkIGJhbGFuY2VyIGFuZCBhIHNlcnZpY2VcbiAgICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OkxvYWRCYWxhbmNlcicpKTtcblxuICAgICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgICBEZXNpcmVkQ291bnQ6IDEsXG4gICAgICAgIExhdW5jaFR5cGU6ICdGQVJHQVRFJyxcbiAgICAgICAgTG9hZEJhbGFuY2VyczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENvbnRhaW5lck5hbWU6ICd3ZWInLFxuICAgICAgICAgICAgQ29udGFpbmVyUG9ydDogODAsXG4gICAgICAgICAgICBUYXJnZXRHcm91cEFybjoge1xuICAgICAgICAgICAgICBSZWY6ICdTZXJ2aWNlTEJQdWJsaWNMaXN0ZW5lckVDU0dyb3VwMENDODY4OEMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSkpO1xuXG4gICAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBJbWFnZTogJ3Rlc3QnLFxuICAgICAgICAgICAgTG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICBMb2dEcml2ZXI6ICdhd3Nsb2dzJyxcbiAgICAgICAgICAgICAgT3B0aW9uczoge1xuICAgICAgICAgICAgICAgICdhd3Nsb2dzLWdyb3VwJzoge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnU2VydmljZVRhc2tEZWZ3ZWJMb2dHcm91cDJBODk4RjYxJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdhd3Nsb2dzLXN0cmVhbS1wcmVmaXgnOiAnU2VydmljZScsXG4gICAgICAgICAgICAgICAgJ2F3c2xvZ3MtcmVnaW9uJzoge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgTmFtZTogJ3dlYicsXG4gICAgICAgICAgICBQb3J0TWFwcGluZ3M6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIENvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgICAgICAgICAgIFByb3RvY29sOiAndGNwJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgQ3B1OiAnMjU2JyxcbiAgICAgICAgRXhlY3V0aW9uUm9sZUFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ1NlcnZpY2VUYXNrRGVmRXhlY3V0aW9uUm9sZTkxOUY3QkUzJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIEZhbWlseTogJ1NlcnZpY2VUYXNrRGVmNzlENzk1MjEnLFxuICAgICAgICBNZW1vcnk6ICc1MTInLFxuICAgICAgICBOZXR3b3JrTW9kZTogJ2F3c3ZwYycsXG4gICAgICAgIFJlcXVpcmVzQ29tcGF0aWJpbGl0aWVzOiBbXG4gICAgICAgICAgJ0ZBUkdBVEUnLFxuICAgICAgICBdLFxuICAgICAgfSkpO1xuXG4gICAgICB0ZXN0LmRvbmUoKTtcbiAgICB9LFxuXG4gICAgJ3Rlc3QgRmFyZ2F0ZSBsb2FkYmFsYW5jZWQgY29uc3RydWN0IHdpdGggYWxsIHNldHRpbmdzJyh0ZXN0OiBUZXN0KSB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBOZXR3b3JrTXVsdGlwbGVUYXJnZXRHcm91cHNGYXJnYXRlU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICAgIGNvbnRhaW5lck5hbWU6ICdoZWxsbycsXG4gICAgICAgICAgY29udGFpbmVyUG9ydHM6IFs4MCwgOTBdLFxuICAgICAgICAgIGVuYWJsZUxvZ2dpbmc6IGZhbHNlLFxuICAgICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgICBURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMTogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgMSB2YWx1ZScsXG4gICAgICAgICAgICBURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMjogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgMiB2YWx1ZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBsb2dEcml2ZXI6IG5ldyBlY3MuQXdzTG9nRHJpdmVyKHtcbiAgICAgICAgICAgIHN0cmVhbVByZWZpeDogJ1Rlc3RTdHJlYW0nLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIGZhbWlseTogJ0VjMlRhc2tEZWYnLFxuICAgICAgICAgIGV4ZWN1dGlvblJvbGU6IG5ldyBSb2xlKHN0YWNrLCAnRXhlY3V0aW9uUm9sZScsIHtcbiAgICAgICAgICAgIHBhdGg6ICcvJyxcbiAgICAgICAgICAgIGFzc3VtZWRCeTogbmV3IENvbXBvc2l0ZVByaW5jaXBhbChcbiAgICAgICAgICAgICAgbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2Vjcy5hbWF6b25hd3MuY29tJyksXG4gICAgICAgICAgICAgIG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdlY3MtdGFza3MuYW1hem9uYXdzLmNvbScpLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICB0YXNrUm9sZTogbmV3IFJvbGUoc3RhY2ssICdUYXNrUm9sZScsIHtcbiAgICAgICAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2Vjcy10YXNrcy5hbWF6b25hd3MuY29tJyksXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICAgIGNwdTogMjU2LFxuICAgICAgICBhc3NpZ25QdWJsaWNJcDogdHJ1ZSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgICAgZGVzaXJlZENvdW50OiAzLFxuICAgICAgICBlbmFibGVFQ1NNYW5hZ2VkVGFnczogdHJ1ZSxcbiAgICAgICAgaGVhbHRoQ2hlY2tHcmFjZVBlcmlvZDogRHVyYXRpb24ubWlsbGlzKDIwMDApLFxuICAgICAgICBwcm9wYWdhdGVUYWdzOiBlY3MuUHJvcGFnYXRlZFRhZ1NvdXJjZS5TRVJWSUNFLFxuICAgICAgICBzZXJ2aWNlTmFtZTogJ215U2VydmljZScsXG4gICAgICAgIHRhcmdldEdyb3VwczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29udGFpbmVyUG9ydDogOTAsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOIC0gc3RhY2sgY29udGFpbnMgYSBsb2FkIGJhbGFuY2VyIGFuZCBhIHNlcnZpY2VcbiAgICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgRGVzaXJlZENvdW50OiAzLFxuICAgICAgICBFbmFibGVFQ1NNYW5hZ2VkVGFnczogdHJ1ZSxcbiAgICAgICAgSGVhbHRoQ2hlY2tHcmFjZVBlcmlvZFNlY29uZHM6IDIsXG4gICAgICAgIExhdW5jaFR5cGU6ICdGQVJHQVRFJyxcbiAgICAgICAgTG9hZEJhbGFuY2VyczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENvbnRhaW5lck5hbWU6ICdoZWxsbycsXG4gICAgICAgICAgICBDb250YWluZXJQb3J0OiA4MCxcbiAgICAgICAgICAgIFRhcmdldEdyb3VwQXJuOiB7XG4gICAgICAgICAgICAgIFJlZjogJ1NlcnZpY2VMQlB1YmxpY0xpc3RlbmVyRUNTVGFyZ2V0R3JvdXBoZWxsbzgwR3JvdXAyMzNBNEQ1NCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ29udGFpbmVyTmFtZTogJ2hlbGxvJyxcbiAgICAgICAgICAgIENvbnRhaW5lclBvcnQ6IDkwLFxuICAgICAgICAgICAgVGFyZ2V0R3JvdXBBcm46IHtcbiAgICAgICAgICAgICAgUmVmOiAnU2VydmljZUxCUHVibGljTGlzdGVuZXJFQ1NUYXJnZXRHcm91cGhlbGxvOTBHcm91cEU1OEU0RUFCJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgTmV0d29ya0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBBd3N2cGNDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBBc3NpZ25QdWJsaWNJcDogJ0VOQUJMRUQnLFxuICAgICAgICAgICAgU2VjdXJpdHlHcm91cHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ1NlcnZpY2VTZWN1cml0eUdyb3VwRUVBMDlCNjgnLFxuICAgICAgICAgICAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgU3VibmV0czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnVlBDUHVibGljU3VibmV0MVN1Ym5ldEI0MjQ2RDMwJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ1ZQQ1B1YmxpY1N1Ym5ldDJTdWJuZXQ3NDE3OUYzOScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFByb3BhZ2F0ZVRhZ3M6ICdTRVJWSUNFJyxcbiAgICAgICAgU2VydmljZU5hbWU6ICdteVNlcnZpY2UnLFxuICAgICAgfSkpO1xuXG4gICAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBFbnZpcm9ubWVudDogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgTmFtZTogJ1RFU1RfRU5WSVJPTk1FTlRfVkFSSUFCTEUxJyxcbiAgICAgICAgICAgICAgICBWYWx1ZTogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgMSB2YWx1ZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBOYW1lOiAnVEVTVF9FTlZJUk9OTUVOVF9WQVJJQUJMRTInLFxuICAgICAgICAgICAgICAgIFZhbHVlOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAyIHZhbHVlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFc3NlbnRpYWw6IHRydWUsXG4gICAgICAgICAgICBJbWFnZTogJ3Rlc3QnLFxuICAgICAgICAgICAgTG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICBMb2dEcml2ZXI6ICdhd3Nsb2dzJyxcbiAgICAgICAgICAgICAgT3B0aW9uczoge1xuICAgICAgICAgICAgICAgICdhd3Nsb2dzLWdyb3VwJzoge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnU2VydmljZVRhc2tEZWZoZWxsb0xvZ0dyb3VwNDQ1MTk3ODEnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2F3c2xvZ3Mtc3RyZWFtLXByZWZpeCc6ICdUZXN0U3RyZWFtJyxcbiAgICAgICAgICAgICAgICAnYXdzbG9ncy1yZWdpb24nOiB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBOYW1lOiAnaGVsbG8nLFxuICAgICAgICAgICAgUG9ydE1hcHBpbmdzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBDb250YWluZXJQb3J0OiA4MCxcbiAgICAgICAgICAgICAgICBQcm90b2NvbDogJ3RjcCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBDb250YWluZXJQb3J0OiA5MCxcbiAgICAgICAgICAgICAgICBQcm90b2NvbDogJ3RjcCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIENwdTogJzI1NicsXG4gICAgICAgIEV4ZWN1dGlvblJvbGVBcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdFeGVjdXRpb25Sb2xlNjA1QTA0MEInLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgRmFtaWx5OiAnRWMyVGFza0RlZicsXG4gICAgICAgIE1lbW9yeTogJzUxMicsXG4gICAgICAgIE5ldHdvcmtNb2RlOiAnYXdzdnBjJyxcbiAgICAgICAgUmVxdWlyZXNDb21wYXRpYmlsaXRpZXM6IFtcbiAgICAgICAgICAnRkFSR0FURScsXG4gICAgICAgIF0sXG4gICAgICAgIFRhc2tSb2xlQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnVGFza1JvbGUzMEZDMEZCQicsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSkpO1xuXG4gICAgICB0ZXN0LmRvbmUoKTtcbiAgICB9LFxuXG4gICAgJ2Vycm9ycyBpZiBubyBlc3NlbnRpYWwgY29udGFpbmVyIGluIHByZS1kZWZpbmVkIHRhc2sgZGVmaW5pdGlvbicodGVzdDogVGVzdCkge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgdGVzdC50aHJvd3MoKCkgPT4ge1xuICAgICAgICBuZXcgTmV0d29ya011bHRpcGxlVGFyZ2V0R3JvdXBzRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIH0pO1xuICAgICAgfSwgL0F0IGxlYXN0IG9uZSBlc3NlbnRpYWwgY29udGFpbmVyIG11c3QgYmUgc3BlY2lmaWVkLyk7XG5cbiAgICAgIHRlc3QuZG9uZSgpO1xuICAgIH0sXG5cbiAgICAnZXJyb3JzIHdoZW4gc2V0dGluZyBib3RoIHRhc2tEZWZpbml0aW9uIGFuZCB0YXNrSW1hZ2VPcHRpb25zJyh0ZXN0OiBUZXN0KSB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICB0ZXN0LnRocm93cygoKSA9PiB7XG4gICAgICAgIG5ldyBOZXR3b3JrTXVsdGlwbGVUYXJnZXRHcm91cHNGYXJnYXRlU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIH0pO1xuICAgICAgfSwgL1lvdSBtdXN0IHNwZWNpZnkgb25seSBvbmUgb2YgVGFza0RlZmluaXRpb24gb3IgVGFza0ltYWdlT3B0aW9ucy4vKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICdlcnJvcnMgd2hlbiBzZXR0aW5nIG5laXRoZXIgdGFza0RlZmluaXRpb24gbm9yIHRhc2tJbWFnZU9wdGlvbnMnKHRlc3Q6IFRlc3QpIHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgdGVzdC50aHJvd3MoKCkgPT4ge1xuICAgICAgICBuZXcgTmV0d29ya011bHRpcGxlVGFyZ2V0R3JvdXBzRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIH0pO1xuICAgICAgfSwgL1lvdSBtdXN0IHNwZWNpZnkgb25lIG9mOiB0YXNrRGVmaW5pdGlvbiBvciBpbWFnZS8pO1xuXG4gICAgICB0ZXN0LmRvbmUoKTtcbiAgICB9LFxuICB9LFxufTsiXX0=