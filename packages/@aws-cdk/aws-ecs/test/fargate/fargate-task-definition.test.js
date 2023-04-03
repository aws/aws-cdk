"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const ecs = require("../../lib");
describe('fargate task definition', () => {
    describe('When creating a Fargate TaskDefinition', () => {
        test('with only required properties set, it correctly sets default properties', () => {
            // GIVEN
            const stack = new cdk.Stack();
            new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Family: 'FargateTaskDef',
                NetworkMode: ecs.NetworkMode.AWS_VPC,
                RequiresCompatibilities: ['FARGATE'],
                Cpu: '256',
                Memory: '512',
            });
        });
        test('support lazy cpu and memory values', () => {
            // GIVEN
            const stack = new cdk.Stack();
            new ecs.FargateTaskDefinition(stack, 'FargateTaskDef', {
                cpu: cdk.Lazy.number({ produce: () => 128 }),
                memoryLimitMiB: cdk.Lazy.number({ produce: () => 1024 }),
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Cpu: '128',
                Memory: '1024',
            });
        });
        test('with all properties set', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef', {
                cpu: 128,
                executionRole: new iam.Role(stack, 'ExecutionRole', {
                    path: '/',
                    assumedBy: new iam.CompositePrincipal(new iam.ServicePrincipal('ecs.amazonaws.com'), new iam.ServicePrincipal('ecs-tasks.amazonaws.com')),
                }),
                family: 'myApp',
                memoryLimitMiB: 1024,
                taskRole: new iam.Role(stack, 'TaskRole', {
                    assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
                }),
                ephemeralStorageGiB: 21,
                runtimePlatform: {
                    cpuArchitecture: ecs.CpuArchitecture.X86_64,
                    operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
                },
            });
            taskDefinition.addVolume({
                host: {
                    sourcePath: '/tmp/cache',
                },
                name: 'scratch',
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Cpu: '128',
                ExecutionRoleArn: {
                    'Fn::GetAtt': [
                        'ExecutionRole605A040B',
                        'Arn',
                    ],
                },
                EphemeralStorage: {
                    SizeInGiB: 21,
                },
                Family: 'myApp',
                Memory: '1024',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: [
                    ecs.LaunchType.FARGATE,
                ],
                RuntimePlatform: {
                    CpuArchitecture: 'X86_64',
                    OperatingSystemFamily: 'LINUX',
                },
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
        test('throws when adding placement constraint', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
            // THEN
            expect(() => {
                taskDefinition.addPlacementConstraint(ecs.PlacementConstraint.memberOf('attribute:ecs.instance-type =~ t2.*'));
            }).toThrow(/Cannot set placement constraints on tasks that run on Fargate/);
        });
        test('throws when adding inference accelerators', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
            const inferenceAccelerator = {
                deviceName: 'device1',
                deviceType: 'eia2.medium',
            };
            // THEN
            expect(() => {
                taskDefinition.addInferenceAccelerator(inferenceAccelerator);
            }).toThrow(/Cannot use inference accelerators on tasks that run on Fargate/);
        });
        test('throws when ephemeral storage request is too high', () => {
            // GIVEN
            const stack = new cdk.Stack();
            expect(() => {
                new ecs.FargateTaskDefinition(stack, 'FargateTaskDef', {
                    ephemeralStorageGiB: 201,
                });
            }).toThrow(/Ephemeral storage size must be between 21GiB and 200GiB/);
            // THEN
        });
        test('throws when ephemeral storage request is too low', () => {
            // GIVEN
            const stack = new cdk.Stack();
            expect(() => {
                new ecs.FargateTaskDefinition(stack, 'FargateTaskDef', {
                    ephemeralStorageGiB: 20,
                });
            }).toThrow(/Ephemeral storage size must be between 21GiB and 200GiB/);
            // THEN
        });
    });
    describe('When importing from an existing Fargate TaskDefinition', () => {
        test('can succeed using TaskDefinition Arn', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const expectTaskDefinitionArn = 'TD_ARN';
            // WHEN
            const taskDefinition = ecs.FargateTaskDefinition.fromFargateTaskDefinitionArn(stack, 'FARGATE_TD_ID', expectTaskDefinitionArn);
            // THEN
            expect(taskDefinition.taskDefinitionArn).toEqual(expectTaskDefinitionArn);
        });
        test('can succeed using attributes', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const expectTaskDefinitionArn = 'TD_ARN';
            const expectNetworkMode = ecs.NetworkMode.AWS_VPC;
            const expectTaskRole = new iam.Role(stack, 'TaskRole', {
                assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
            });
            // WHEN
            const taskDefinition = ecs.FargateTaskDefinition.fromFargateTaskDefinitionAttributes(stack, 'TD_ID', {
                taskDefinitionArn: expectTaskDefinitionArn,
                networkMode: expectNetworkMode,
                taskRole: expectTaskRole,
            });
            // THEN
            expect(taskDefinition.taskDefinitionArn).toEqual(expectTaskDefinitionArn);
            expect(taskDefinition.compatibility).toEqual(ecs.Compatibility.FARGATE);
            expect(taskDefinition.isFargateCompatible).toEqual(true);
            expect(taskDefinition.isEc2Compatible).toEqual(false);
            expect(taskDefinition.networkMode).toEqual(expectNetworkMode);
            expect(taskDefinition.taskRole).toEqual(expectTaskRole);
        });
        test('returns a Fargate TaskDefinition that will throw an error when trying to access its networkMode but its networkMode is undefined', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const expectTaskDefinitionArn = 'TD_ARN';
            const expectTaskRole = new iam.Role(stack, 'TaskRole', {
                assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
            });
            // WHEN
            const taskDefinition = ecs.FargateTaskDefinition.fromFargateTaskDefinitionAttributes(stack, 'TD_ID', {
                taskDefinitionArn: expectTaskDefinitionArn,
                taskRole: expectTaskRole,
            });
            // THEN
            expect(() => {
                taskDefinition.networkMode;
            }).toThrow('This operation requires the networkMode in ImportedTaskDefinition to be defined. ' +
                'Add the \'networkMode\' in ImportedTaskDefinitionProps to instantiate ImportedTaskDefinition');
        });
        test('returns a Fargate TaskDefinition that will throw an error when trying to access its taskRole but its taskRole is undefined', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const expectTaskDefinitionArn = 'TD_ARN';
            const expectNetworkMode = ecs.NetworkMode.AWS_VPC;
            // WHEN
            const taskDefinition = ecs.FargateTaskDefinition.fromFargateTaskDefinitionAttributes(stack, 'TD_ID', {
                taskDefinitionArn: expectTaskDefinitionArn,
                networkMode: expectNetworkMode,
            });
            // THEN
            expect(() => {
                taskDefinition.taskRole;
            }).toThrow('This operation requires the taskRole in ImportedTaskDefinition to be defined. ' +
                'Add the \'taskRole\' in ImportedTaskDefinitionProps to instantiate ImportedTaskDefinition');
        });
        test('Passing in token for ephemeral storage will not throw error', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const param = new cdk.CfnParameter(stack, 'prammm', {
                type: 'Number',
                default: 1,
            });
            const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef', {
                ephemeralStorageGiB: param.valueAsNumber,
            });
            // THEN
            expect(() => {
                taskDefinition.ephemeralStorageGiB;
            }).toBeTruthy;
        });
        test('runtime testing for windows container', () => {
            // GIVEN
            const stack = new cdk.Stack();
            new ecs.FargateTaskDefinition(stack, 'FargateTaskDef', {
                cpu: 1024,
                memoryLimitMiB: 2048,
                runtimePlatform: {
                    operatingSystemFamily: ecs.OperatingSystemFamily.WINDOWS_SERVER_2019_CORE,
                    cpuArchitecture: ecs.CpuArchitecture.X86_64,
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Cpu: '1024',
                Family: 'FargateTaskDef',
                Memory: '2048',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: [
                    ecs.LaunchType.FARGATE,
                ],
                RuntimePlatform: {
                    CpuArchitecture: 'X86_64',
                    OperatingSystemFamily: 'WINDOWS_SERVER_2019_CORE',
                },
                TaskRoleArn: {
                    'Fn::GetAtt': [
                        'FargateTaskDefTaskRole0B257552',
                        'Arn',
                    ],
                },
            });
        });
        test('runtime testing for linux container', () => {
            // GIVEN
            const stack = new cdk.Stack();
            new ecs.FargateTaskDefinition(stack, 'FargateTaskDef', {
                cpu: 1024,
                memoryLimitMiB: 2048,
                runtimePlatform: {
                    operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
                    cpuArchitecture: ecs.CpuArchitecture.ARM64,
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Cpu: '1024',
                Family: 'FargateTaskDef',
                Memory: '2048',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: [
                    ecs.LaunchType.FARGATE,
                ],
                RuntimePlatform: {
                    CpuArchitecture: 'ARM64',
                    OperatingSystemFamily: 'LINUX',
                },
                TaskRoleArn: {
                    'Fn::GetAtt': [
                        'FargateTaskDefTaskRole0B257552',
                        'Arn',
                    ],
                },
            });
        });
        test('creating a Fargate TaskDefinition with WINDOWS_SERVER_X operatingSystemFamily and incorrect cpu throws an error', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // Not in CPU Ranage.
            expect(() => {
                new ecs.FargateTaskDefinition(stack, 'FargateTaskDefCPU', {
                    cpu: 128,
                    memoryLimitMiB: 1024,
                    runtimePlatform: {
                        cpuArchitecture: ecs.CpuArchitecture.X86_64,
                        operatingSystemFamily: ecs.OperatingSystemFamily.WINDOWS_SERVER_2019_CORE,
                    },
                });
            }).toThrowError(`If operatingSystemFamily is ${ecs.OperatingSystemFamily.WINDOWS_SERVER_2019_CORE._operatingSystemFamily}, then cpu must be in 1024 (1 vCPU), 2048 (2 vCPU), or 4096 (4 vCPU).`);
            // Memory is not in 1 GB increments.
            expect(() => {
                new ecs.FargateTaskDefinition(stack, 'FargateTaskDefMemory', {
                    cpu: 1024,
                    memoryLimitMiB: 1025,
                    runtimePlatform: {
                        cpuArchitecture: ecs.CpuArchitecture.X86_64,
                        operatingSystemFamily: ecs.OperatingSystemFamily.WINDOWS_SERVER_2019_CORE,
                    },
                });
            }).toThrowError('If provided cpu is 1024, then memoryMiB must have a min of 1024 and a max of 8192, in 1024 increments. Provided memoryMiB was 1025.');
            // Check runtimePlatform was been defined ,but not undefined cpu and memoryLimitMiB.
            expect(() => {
                new ecs.FargateTaskDefinition(stack, 'FargateTaskDef', {
                    runtimePlatform: {
                        cpuArchitecture: ecs.CpuArchitecture.X86_64,
                        operatingSystemFamily: ecs.OperatingSystemFamily.WINDOWS_SERVER_2004_CORE,
                    },
                });
            }).toThrowError('If operatingSystemFamily is WINDOWS_SERVER_2004_CORE, then cpu must be in 1024 (1 vCPU), 2048 (2 vCPU), or 4096 (4 vCPU). Provided value was: 256');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFyZ2F0ZS10YXNrLWRlZmluaXRpb24udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZhcmdhdGUtdGFzay1kZWZpbml0aW9uLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQyxpQ0FBaUM7QUFFakMsUUFBUSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRTtJQUN2QyxRQUFRLENBQUMsd0NBQXdDLEVBQUUsR0FBRyxFQUFFO1FBQ3RELElBQUksQ0FBQyx5RUFBeUUsRUFBRSxHQUFHLEVBQUU7WUFDbkYsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLElBQUksR0FBRyxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBRXZELE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQywwQkFBMEIsRUFBRTtnQkFDMUUsTUFBTSxFQUFFLGdCQUFnQjtnQkFDeEIsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTztnQkFDcEMsdUJBQXVCLEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0JBQ3BDLEdBQUcsRUFBRSxLQUFLO2dCQUNWLE1BQU0sRUFBRSxLQUFLO2FBQ2QsQ0FBQyxDQUFDO1FBR0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO1lBQzlDLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUU5QixJQUFJLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBQ3JELEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFH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QztZQUNMLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxxSUFBcUksQ0FBQyxDQUFDO1lBRXZKLG9GQUFvRjtZQUNwRixNQUFNLENBQUMsR0FBRyxFQUFFO2dCQUNWLElBQUksR0FBRyxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtvQkFDckQsZUFBZSxFQUFFO3dCQUNmLGVBQWUsRUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDLE1BQU07d0JBQzNDLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0I7cUJBQzFFO2lCQUNGLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxtSkFBbUosQ0FBQyxDQUFDO1FBRXZLLENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnLi4vLi4vbGliJztcblxuZGVzY3JpYmUoJ2ZhcmdhdGUgdGFzayBkZWZpbml0aW9uJywgKCkgPT4ge1xuICBkZXNjcmliZSgnV2hlbiBjcmVhdGluZyBhIEZhcmdhdGUgVGFza0RlZmluaXRpb24nLCAoKSA9PiB7XG4gICAgdGVzdCgnd2l0aCBvbmx5IHJlcXVpcmVkIHByb3BlcnRpZXMgc2V0LCBpdCBjb3JyZWN0bHkgc2V0cyBkZWZhdWx0IHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIEZhbWlseTogJ0ZhcmdhdGVUYXNrRGVmJyxcbiAgICAgICAgTmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5BV1NfVlBDLFxuICAgICAgICBSZXF1aXJlc0NvbXBhdGliaWxpdGllczogWydGQVJHQVRFJ10sXG4gICAgICAgIENwdTogJzI1NicsXG4gICAgICAgIE1lbW9yeTogJzUxMicsXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdzdXBwb3J0IGxhenkgY3B1IGFuZCBtZW1vcnkgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJywge1xuICAgICAgICBjcHU6IGNkay5MYXp5Lm51bWJlcih7IHByb2R1Y2U6ICgpID0+IDEyOCB9KSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IGNkay5MYXp5Lm51bWJlcih7IHByb2R1Y2U6ICgpID0+IDEwMjQgfSksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgQ3B1OiAnMTI4JyxcbiAgICAgICAgTWVtb3J5OiAnMTAyNCcsXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIGFsbCBwcm9wZXJ0aWVzIHNldCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdGYXJnYXRlVGFza0RlZicsIHtcbiAgICAgICAgY3B1OiAxMjgsXG4gICAgICAgIGV4ZWN1dGlvblJvbGU6IG5ldyBpYW0uUm9sZShzdGFjaywgJ0V4ZWN1dGlvblJvbGUnLCB7XG4gICAgICAgICAgcGF0aDogJy8nLFxuICAgICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5Db21wb3NpdGVQcmluY2lwYWwoXG4gICAgICAgICAgICBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2Vjcy5hbWF6b25hd3MuY29tJyksXG4gICAgICAgICAgICBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2Vjcy10YXNrcy5hbWF6b25hd3MuY29tJyksXG4gICAgICAgICAgKSxcbiAgICAgICAgfSksXG4gICAgICAgIGZhbWlseTogJ215QXBwJyxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICAgIHRhc2tSb2xlOiBuZXcgaWFtLlJvbGUoc3RhY2ssICdUYXNrUm9sZScsIHtcbiAgICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZWNzLXRhc2tzLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgICAgfSksXG4gICAgICAgIGVwaGVtZXJhbFN0b3JhZ2VHaUI6IDIxLFxuICAgICAgICBydW50aW1lUGxhdGZvcm06IHtcbiAgICAgICAgICBjcHVBcmNoaXRlY3R1cmU6IGVjcy5DcHVBcmNoaXRlY3R1cmUuWDg2XzY0LFxuICAgICAgICAgIG9wZXJhdGluZ1N5c3RlbUZhbWlseTogZWNzLk9wZXJhdGluZ1N5c3RlbUZhbWlseS5MSU5VWCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRWb2x1bWUoe1xuICAgICAgICBob3N0OiB7XG4gICAgICAgICAgc291cmNlUGF0aDogJy90bXAvY2FjaGUnLFxuICAgICAgICB9LFxuICAgICAgICBuYW1lOiAnc2NyYXRjaCcsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgQ3B1OiAnMTI4JyxcbiAgICAgICAgRXhlY3V0aW9uUm9sZUFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0V4ZWN1dGlvblJvbGU2MDVBMDQwQicsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBFcGhlbWVyYWxTdG9yYWdlOiB7XG4gICAgICAgICAgU2l6ZUluR2lCOiAyMSxcbiAgICAgICAgfSxcbiAgICAgICAgRmFtaWx5OiAnbXlBcHAnLFxuICAgICAgICBNZW1vcnk6ICcxMDI0JyxcbiAgICAgICAgTmV0d29ya01vZGU6ICdhd3N2cGMnLFxuICAgICAgICBSZXF1aXJlc0NvbXBhdGliaWxpdGllczogW1xuICAgICAgICAgIGVjcy5MYXVuY2hUeXBlLkZBUkdBVEUsXG4gICAgICAgIF0sXG4gICAgICAgIFJ1bnRpbWVQbGF0Zm9ybToge1xuICAgICAgICAgIENwdUFyY2hpdGVjdHVyZTogJ1g4Nl82NCcsXG4gICAgICAgICAgT3BlcmF0aW5nU3lzdGVtRmFtaWx5OiAnTElOVVgnLFxuICAgICAgICB9LFxuICAgICAgICBUYXNrUm9sZUFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ1Rhc2tSb2xlMzBGQzBGQkInLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgVm9sdW1lczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEhvc3Q6IHtcbiAgICAgICAgICAgICAgU291cmNlUGF0aDogJy90bXAvY2FjaGUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE5hbWU6ICdzY3JhdGNoJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIHdoZW4gYWRkaW5nIHBsYWNlbWVudCBjb25zdHJhaW50JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHRhc2tEZWZpbml0aW9uLmFkZFBsYWNlbWVudENvbnN0cmFpbnQoZWNzLlBsYWNlbWVudENvbnN0cmFpbnQubWVtYmVyT2YoJ2F0dHJpYnV0ZTplY3MuaW5zdGFuY2UtdHlwZSA9fiB0Mi4qJykpO1xuICAgICAgfSkudG9UaHJvdygvQ2Fubm90IHNldCBwbGFjZW1lbnQgY29uc3RyYWludHMgb24gdGFza3MgdGhhdCBydW4gb24gRmFyZ2F0ZS8pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyB3aGVuIGFkZGluZyBpbmZlcmVuY2UgYWNjZWxlcmF0b3JzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJyk7XG5cbiAgICAgIGNvbnN0IGluZmVyZW5jZUFjY2VsZXJhdG9yID0ge1xuICAgICAgICBkZXZpY2VOYW1lOiAnZGV2aWNlMScsXG4gICAgICAgIGRldmljZVR5cGU6ICdlaWEyLm1lZGl1bScsXG4gICAgICB9O1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICB0YXNrRGVmaW5pdGlvbi5hZGRJbmZlcmVuY2VBY2NlbGVyYXRvcihpbmZlcmVuY2VBY2NlbGVyYXRvcik7XG4gICAgICB9KS50b1Rocm93KC9DYW5ub3QgdXNlIGluZmVyZW5jZSBhY2NlbGVyYXRvcnMgb24gdGFza3MgdGhhdCBydW4gb24gRmFyZ2F0ZS8pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyB3aGVuIGVwaGVtZXJhbCBzdG9yYWdlIHJlcXVlc3QgaXMgdG9vIGhpZ2gnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJywge1xuICAgICAgICAgIGVwaGVtZXJhbFN0b3JhZ2VHaUI6IDIwMSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9FcGhlbWVyYWwgc3RvcmFnZSBzaXplIG11c3QgYmUgYmV0d2VlbiAyMUdpQiBhbmQgMjAwR2lCLyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyB3aGVuIGVwaGVtZXJhbCBzdG9yYWdlIHJlcXVlc3QgaXMgdG9vIGxvdycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnLCB7XG4gICAgICAgICAgZXBoZW1lcmFsU3RvcmFnZUdpQjogMjAsXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvRXBoZW1lcmFsIHN0b3JhZ2Ugc2l6ZSBtdXN0IGJlIGJldHdlZW4gMjFHaUIgYW5kIDIwMEdpQi8pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdXaGVuIGltcG9ydGluZyBmcm9tIGFuIGV4aXN0aW5nIEZhcmdhdGUgVGFza0RlZmluaXRpb24nLCAoKSA9PiB7XG4gICAgdGVzdCgnY2FuIHN1Y2NlZWQgdXNpbmcgVGFza0RlZmluaXRpb24gQXJuJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgZXhwZWN0VGFza0RlZmluaXRpb25Bcm4gPSAnVERfQVJOJztcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uLmZyb21GYXJnYXRlVGFza0RlZmluaXRpb25Bcm4oc3RhY2ssICdGQVJHQVRFX1REX0lEJywgZXhwZWN0VGFza0RlZmluaXRpb25Bcm4pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QodGFza0RlZmluaXRpb24udGFza0RlZmluaXRpb25Bcm4pLnRvRXF1YWwoZXhwZWN0VGFza0RlZmluaXRpb25Bcm4pO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gc3VjY2VlZCB1c2luZyBhdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgZXhwZWN0VGFza0RlZmluaXRpb25Bcm4gPSAnVERfQVJOJztcbiAgICAgIGNvbnN0IGV4cGVjdE5ldHdvcmtNb2RlID0gZWNzLk5ldHdvcmtNb2RlLkFXU19WUEM7XG4gICAgICBjb25zdCBleHBlY3RUYXNrUm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1Rhc2tSb2xlJywge1xuICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZWNzLXRhc2tzLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24uZnJvbUZhcmdhdGVUYXNrRGVmaW5pdGlvbkF0dHJpYnV0ZXMoc3RhY2ssICdURF9JRCcsIHtcbiAgICAgICAgdGFza0RlZmluaXRpb25Bcm46IGV4cGVjdFRhc2tEZWZpbml0aW9uQXJuLFxuICAgICAgICBuZXR3b3JrTW9kZTogZXhwZWN0TmV0d29ya01vZGUsXG4gICAgICAgIHRhc2tSb2xlOiBleHBlY3RUYXNrUm9sZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QodGFza0RlZmluaXRpb24udGFza0RlZmluaXRpb25Bcm4pLnRvRXF1YWwoZXhwZWN0VGFza0RlZmluaXRpb25Bcm4pO1xuICAgICAgZXhwZWN0KHRhc2tEZWZpbml0aW9uLmNvbXBhdGliaWxpdHkpLnRvRXF1YWwoZWNzLkNvbXBhdGliaWxpdHkuRkFSR0FURSk7XG4gICAgICBleHBlY3QodGFza0RlZmluaXRpb24uaXNGYXJnYXRlQ29tcGF0aWJsZSkudG9FcXVhbCh0cnVlKTtcbiAgICAgIGV4cGVjdCh0YXNrRGVmaW5pdGlvbi5pc0VjMkNvbXBhdGlibGUpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgZXhwZWN0KHRhc2tEZWZpbml0aW9uLm5ldHdvcmtNb2RlKS50b0VxdWFsKGV4cGVjdE5ldHdvcmtNb2RlKTtcbiAgICAgIGV4cGVjdCh0YXNrRGVmaW5pdGlvbi50YXNrUm9sZSkudG9FcXVhbChleHBlY3RUYXNrUm9sZSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgncmV0dXJucyBhIEZhcmdhdGUgVGFza0RlZmluaXRpb24gdGhhdCB3aWxsIHRocm93IGFuIGVycm9yIHdoZW4gdHJ5aW5nIHRvIGFjY2VzcyBpdHMgbmV0d29ya01vZGUgYnV0IGl0cyBuZXR3b3JrTW9kZSBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBleHBlY3RUYXNrRGVmaW5pdGlvbkFybiA9ICdURF9BUk4nO1xuICAgICAgY29uc3QgZXhwZWN0VGFza1JvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdUYXNrUm9sZScsIHtcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2Vjcy10YXNrcy5hbWF6b25hd3MuY29tJyksXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uLmZyb21GYXJnYXRlVGFza0RlZmluaXRpb25BdHRyaWJ1dGVzKHN0YWNrLCAnVERfSUQnLCB7XG4gICAgICAgIHRhc2tEZWZpbml0aW9uQXJuOiBleHBlY3RUYXNrRGVmaW5pdGlvbkFybixcbiAgICAgICAgdGFza1JvbGU6IGV4cGVjdFRhc2tSb2xlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHRhc2tEZWZpbml0aW9uLm5ldHdvcmtNb2RlO1xuICAgICAgfSkudG9UaHJvdygnVGhpcyBvcGVyYXRpb24gcmVxdWlyZXMgdGhlIG5ldHdvcmtNb2RlIGluIEltcG9ydGVkVGFza0RlZmluaXRpb24gdG8gYmUgZGVmaW5lZC4gJyArXG4gICAgICAgICdBZGQgdGhlIFxcJ25ldHdvcmtNb2RlXFwnIGluIEltcG9ydGVkVGFza0RlZmluaXRpb25Qcm9wcyB0byBpbnN0YW50aWF0ZSBJbXBvcnRlZFRhc2tEZWZpbml0aW9uJyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgncmV0dXJucyBhIEZhcmdhdGUgVGFza0RlZmluaXRpb24gdGhhdCB3aWxsIHRocm93IGFuIGVycm9yIHdoZW4gdHJ5aW5nIHRvIGFjY2VzcyBpdHMgdGFza1JvbGUgYnV0IGl0cyB0YXNrUm9sZSBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBleHBlY3RUYXNrRGVmaW5pdGlvbkFybiA9ICdURF9BUk4nO1xuICAgICAgY29uc3QgZXhwZWN0TmV0d29ya01vZGUgPSBlY3MuTmV0d29ya01vZGUuQVdTX1ZQQztcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uLmZyb21GYXJnYXRlVGFza0RlZmluaXRpb25BdHRyaWJ1dGVzKHN0YWNrLCAnVERfSUQnLCB7XG4gICAgICAgIHRhc2tEZWZpbml0aW9uQXJuOiBleHBlY3RUYXNrRGVmaW5pdGlvbkFybixcbiAgICAgICAgbmV0d29ya01vZGU6IGV4cGVjdE5ldHdvcmtNb2RlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHRhc2tEZWZpbml0aW9uLnRhc2tSb2xlO1xuICAgICAgfSkudG9UaHJvdygnVGhpcyBvcGVyYXRpb24gcmVxdWlyZXMgdGhlIHRhc2tSb2xlIGluIEltcG9ydGVkVGFza0RlZmluaXRpb24gdG8gYmUgZGVmaW5lZC4gJyArXG4gICAgICAgICdBZGQgdGhlIFxcJ3Rhc2tSb2xlXFwnIGluIEltcG9ydGVkVGFza0RlZmluaXRpb25Qcm9wcyB0byBpbnN0YW50aWF0ZSBJbXBvcnRlZFRhc2tEZWZpbml0aW9uJyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdQYXNzaW5nIGluIHRva2VuIGZvciBlcGhlbWVyYWwgc3RvcmFnZSB3aWxsIG5vdCB0aHJvdyBlcnJvcicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgcGFyYW0gPSBuZXcgY2RrLkNmblBhcmFtZXRlcihzdGFjaywgJ3ByYW1tbScsIHtcbiAgICAgICAgdHlwZTogJ051bWJlcicsXG4gICAgICAgIGRlZmF1bHQ6IDEsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJywge1xuICAgICAgICBlcGhlbWVyYWxTdG9yYWdlR2lCOiBwYXJhbS52YWx1ZUFzTnVtYmVyLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHRhc2tEZWZpbml0aW9uLmVwaGVtZXJhbFN0b3JhZ2VHaUI7XG4gICAgICB9KS50b0JlVHJ1dGh5O1xuICAgIH0pO1xuXG4gICAgdGVzdCgncnVudGltZSB0ZXN0aW5nIGZvciB3aW5kb3dzIGNvbnRhaW5lcicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnLCB7XG4gICAgICAgIGNwdTogMTAyNCxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDIwNDgsXG4gICAgICAgIHJ1bnRpbWVQbGF0Zm9ybToge1xuICAgICAgICAgIG9wZXJhdGluZ1N5c3RlbUZhbWlseTogZWNzLk9wZXJhdGluZ1N5c3RlbUZhbWlseS5XSU5ET1dTX1NFUlZFUl8yMDE5X0NPUkUsXG4gICAgICAgICAgY3B1QXJjaGl0ZWN0dXJlOiBlY3MuQ3B1QXJjaGl0ZWN0dXJlLlg4Nl82NCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgICBDcHU6ICcxMDI0JyxcbiAgICAgICAgRmFtaWx5OiAnRmFyZ2F0ZVRhc2tEZWYnLFxuICAgICAgICBNZW1vcnk6ICcyMDQ4JyxcbiAgICAgICAgTmV0d29ya01vZGU6ICdhd3N2cGMnLFxuICAgICAgICBSZXF1aXJlc0NvbXBhdGliaWxpdGllczogW1xuICAgICAgICAgIGVjcy5MYXVuY2hUeXBlLkZBUkdBVEUsXG4gICAgICAgIF0sXG4gICAgICAgIFJ1bnRpbWVQbGF0Zm9ybToge1xuICAgICAgICAgIENwdUFyY2hpdGVjdHVyZTogJ1g4Nl82NCcsXG4gICAgICAgICAgT3BlcmF0aW5nU3lzdGVtRmFtaWx5OiAnV0lORE9XU19TRVJWRVJfMjAxOV9DT1JFJyxcbiAgICAgICAgfSxcbiAgICAgICAgVGFza1JvbGVBcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdGYXJnYXRlVGFza0RlZlRhc2tSb2xlMEIyNTc1NTInLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncnVudGltZSB0ZXN0aW5nIGZvciBsaW51eCBjb250YWluZXInLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmJywge1xuICAgICAgICBjcHU6IDEwMjQsXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiAyMDQ4LFxuICAgICAgICBydW50aW1lUGxhdGZvcm06IHtcbiAgICAgICAgICBvcGVyYXRpbmdTeXN0ZW1GYW1pbHk6IGVjcy5PcGVyYXRpbmdTeXN0ZW1GYW1pbHkuTElOVVgsXG4gICAgICAgICAgY3B1QXJjaGl0ZWN0dXJlOiBlY3MuQ3B1QXJjaGl0ZWN0dXJlLkFSTTY0LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIENwdTogJzEwMjQnLFxuICAgICAgICBGYW1pbHk6ICdGYXJnYXRlVGFza0RlZicsXG4gICAgICAgIE1lbW9yeTogJzIwNDgnLFxuICAgICAgICBOZXR3b3JrTW9kZTogJ2F3c3ZwYycsXG4gICAgICAgIFJlcXVpcmVzQ29tcGF0aWJpbGl0aWVzOiBbXG4gICAgICAgICAgZWNzLkxhdW5jaFR5cGUuRkFSR0FURSxcbiAgICAgICAgXSxcbiAgICAgICAgUnVudGltZVBsYXRmb3JtOiB7XG4gICAgICAgICAgQ3B1QXJjaGl0ZWN0dXJlOiAnQVJNNjQnLFxuICAgICAgICAgIE9wZXJhdGluZ1N5c3RlbUZhbWlseTogJ0xJTlVYJyxcbiAgICAgICAgfSxcbiAgICAgICAgVGFza1JvbGVBcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdGYXJnYXRlVGFza0RlZlRhc2tSb2xlMEIyNTc1NTInLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY3JlYXRpbmcgYSBGYXJnYXRlIFRhc2tEZWZpbml0aW9uIHdpdGggV0lORE9XU19TRVJWRVJfWCBvcGVyYXRpbmdTeXN0ZW1GYW1pbHkgYW5kIGluY29ycmVjdCBjcHUgdGhyb3dzIGFuIGVycm9yJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAvLyBOb3QgaW4gQ1BVIFJhbmFnZS5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWZDUFUnLCB7XG4gICAgICAgICAgY3B1OiAxMjgsXG4gICAgICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICAgICAgcnVudGltZVBsYXRmb3JtOiB7XG4gICAgICAgICAgICBjcHVBcmNoaXRlY3R1cmU6IGVjcy5DcHVBcmNoaXRlY3R1cmUuWDg2XzY0LFxuICAgICAgICAgICAgb3BlcmF0aW5nU3lzdGVtRmFtaWx5OiBlY3MuT3BlcmF0aW5nU3lzdGVtRmFtaWx5LldJTkRPV1NfU0VSVkVSXzIwMTlfQ09SRSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3dFcnJvcihgSWYgb3BlcmF0aW5nU3lzdGVtRmFtaWx5IGlzICR7ZWNzLk9wZXJhdGluZ1N5c3RlbUZhbWlseS5XSU5ET1dTX1NFUlZFUl8yMDE5X0NPUkUuX29wZXJhdGluZ1N5c3RlbUZhbWlseX0sIHRoZW4gY3B1IG11c3QgYmUgaW4gMTAyNCAoMSB2Q1BVKSwgMjA0OCAoMiB2Q1BVKSwgb3IgNDA5NiAoNCB2Q1BVKS5gKTtcblxuICAgICAgLy8gTWVtb3J5IGlzIG5vdCBpbiAxIEdCIGluY3JlbWVudHMuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0ZhcmdhdGVUYXNrRGVmTWVtb3J5Jywge1xuICAgICAgICAgIGNwdTogMTAyNCxcbiAgICAgICAgICBtZW1vcnlMaW1pdE1pQjogMTAyNSxcbiAgICAgICAgICBydW50aW1lUGxhdGZvcm06IHtcbiAgICAgICAgICAgIGNwdUFyY2hpdGVjdHVyZTogZWNzLkNwdUFyY2hpdGVjdHVyZS5YODZfNjQsXG4gICAgICAgICAgICBvcGVyYXRpbmdTeXN0ZW1GYW1pbHk6IGVjcy5PcGVyYXRpbmdTeXN0ZW1GYW1pbHkuV0lORE9XU19TRVJWRVJfMjAxOV9DT1JFLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvd0Vycm9yKCdJZiBwcm92aWRlZCBjcHUgaXMgMTAyNCwgdGhlbiBtZW1vcnlNaUIgbXVzdCBoYXZlIGEgbWluIG9mIDEwMjQgYW5kIGEgbWF4IG9mIDgxOTIsIGluIDEwMjQgaW5jcmVtZW50cy4gUHJvdmlkZWQgbWVtb3J5TWlCIHdhcyAxMDI1LicpO1xuXG4gICAgICAvLyBDaGVjayBydW50aW1lUGxhdGZvcm0gd2FzIGJlZW4gZGVmaW5lZCAsYnV0IG5vdCB1bmRlZmluZWQgY3B1IGFuZCBtZW1vcnlMaW1pdE1pQi5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnLCB7XG4gICAgICAgICAgcnVudGltZVBsYXRmb3JtOiB7XG4gICAgICAgICAgICBjcHVBcmNoaXRlY3R1cmU6IGVjcy5DcHVBcmNoaXRlY3R1cmUuWDg2XzY0LFxuICAgICAgICAgICAgb3BlcmF0aW5nU3lzdGVtRmFtaWx5OiBlY3MuT3BlcmF0aW5nU3lzdGVtRmFtaWx5LldJTkRPV1NfU0VSVkVSXzIwMDRfQ09SRSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3dFcnJvcignSWYgb3BlcmF0aW5nU3lzdGVtRmFtaWx5IGlzIFdJTkRPV1NfU0VSVkVSXzIwMDRfQ09SRSwgdGhlbiBjcHUgbXVzdCBiZSBpbiAxMDI0ICgxIHZDUFUpLCAyMDQ4ICgyIHZDUFUpLCBvciA0MDk2ICg0IHZDUFUpLiBQcm92aWRlZCB2YWx1ZSB3YXM6IDI1NicpO1xuXG4gICAgfSk7XG5cbiAgfSk7XG59KTsiXX0=