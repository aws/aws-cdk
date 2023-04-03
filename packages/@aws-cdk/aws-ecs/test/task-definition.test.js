"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ecr = require("@aws-cdk/aws-ecr");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const ecs = require("../lib");
describe('task definition', () => {
    describe('When creating a new TaskDefinition', () => {
        test('A task definition with EC2 and Fargate compatibilities defaults to networkmode AwsVpc', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            new ecs.TaskDefinition(stack, 'TD', {
                cpu: '512',
                memoryMiB: '512',
                compatibility: ecs.Compatibility.EC2_AND_FARGATE,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                NetworkMode: 'awsvpc',
            });
        });
        test('A task definition with External compatibility defaults to networkmode Bridge', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            new ecs.TaskDefinition(stack, 'TD', {
                cpu: '512',
                memoryMiB: '512',
                compatibility: ecs.Compatibility.EXTERNAL,
            });
            //THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                NetworkMode: 'bridge',
            });
        });
        test('A task definition creates the correct policy for grantRun', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const role = new iam.Role(stack, 'Role', {
                assumedBy: new iam.AccountRootPrincipal(),
            });
            const taskDef = new ecs.TaskDefinition(stack, 'TD', {
                cpu: '512',
                memoryMiB: '512',
                compatibility: ecs.Compatibility.EC2_AND_FARGATE,
            });
            taskDef.grantRun(role);
            // THEN
            const template = assertions_1.Template.fromStack(stack);
            template.hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'TDTaskRoleC497AFFC',
                                    'Arn',
                                ],
                            },
                        },
                        {
                            Action: 'ecs:RunTask',
                            Effect: 'Allow',
                            Resource: {
                                Ref: 'TD49C78F36',
                            },
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
        });
        test('A task definition with executionRole creates the correct policy for grantRun', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const role = new iam.Role(stack, 'Role', {
                assumedBy: new iam.AccountRootPrincipal(),
            });
            const executionRole = new iam.Role(stack, 'ExecutionRole', {
                assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
            });
            const taskDef = new ecs.TaskDefinition(stack, 'TD', {
                cpu: '512',
                memoryMiB: '512',
                compatibility: ecs.Compatibility.EC2_AND_FARGATE,
                executionRole: executionRole,
            });
            taskDef.grantRun(role);
            // THEN
            const template = assertions_1.Template.fromStack(stack);
            template.hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::GetAtt': [
                                        'TDTaskRoleC497AFFC',
                                        'Arn',
                                    ],
                                },
                                {
                                    'Fn::GetAtt': [
                                        'ExecutionRole605A040B',
                                        'Arn',
                                    ],
                                },
                            ],
                        },
                        {
                            Action: 'ecs:RunTask',
                            Effect: 'Allow',
                            Resource: {
                                Ref: 'TD49C78F36',
                            },
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
        });
        test('A task definition creates the correct policy for grantRun with ContainerDefinition added late', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const role = new iam.Role(stack, 'Role', {
                assumedBy: new iam.AccountRootPrincipal(),
            });
            const repo = ecr.Repository.fromRepositoryAttributes(stack, 'Repo', {
                repositoryArn: 'arn:aws:ecr:us-east-1:012345678901:repository/repo',
                repositoryName: 'repo',
            });
            const taskDef = new ecs.TaskDefinition(stack, 'TD', {
                cpu: '512',
                memoryMiB: '512',
                compatibility: ecs.Compatibility.EC2_AND_FARGATE,
            });
            // Creates policy statement before executionRole is defined
            taskDef.grantRun(role);
            // Defines executionRole
            taskDef.addContainer('ECRContainer', {
                image: ecs.ContainerImage.fromEcrRepository(repo),
                memoryLimitMiB: 2048,
            });
            // THEN
            const template = assertions_1.Template.fromStack(stack);
            template.hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::GetAtt': [
                                        'TDTaskRoleC497AFFC',
                                        'Arn',
                                    ],
                                },
                                {
                                    'Fn::GetAtt': [
                                        'TDExecutionRole88C96BCD',
                                        'Arn',
                                    ],
                                },
                            ],
                        },
                        {
                            Action: 'ecs:RunTask',
                            Effect: 'Allow',
                            Resource: {
                                Ref: 'TD49C78F36',
                            },
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
        });
        test('A task definition where multiple containers have a port mapping with the same name throws an error', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
            new ecs.ContainerDefinition(stack, 'Container', {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                taskDefinition,
                memoryLimitMiB: 2048,
                portMappings: [{
                        containerPort: 80,
                        name: 'api',
                    }],
            });
            new ecs.ContainerDefinition(stack, 'Container2', {
                taskDefinition,
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                memoryLimitMiB: 2048,
                portMappings: [{
                        containerPort: 8080,
                        name: 'api',
                    }],
            });
            // THEN
            expect(() => {
                assertions_1.Template.fromStack(stack);
            }).toThrow("Port mapping name 'api' cannot appear in both 'Container2' and 'Container'");
        });
    });
    describe('When importing from an existing Task definition', () => {
        test('can import using a task definition arn', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinitionArn = 'TDArn';
            // WHEN
            const taskDefinition = ecs.TaskDefinition.fromTaskDefinitionArn(stack, 'TD_ID', taskDefinitionArn);
            // THEN
            expect(taskDefinition.taskDefinitionArn).toEqual(taskDefinitionArn);
            expect(taskDefinition.compatibility).toEqual(ecs.Compatibility.EC2_AND_FARGATE);
            expect(taskDefinition.executionRole).toEqual(undefined);
        });
        test('can import a Task Definition using attributes', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const expectTaskDefinitionArn = 'TD_ARN';
            const expectCompatibility = ecs.Compatibility.EC2;
            const expectNetworkMode = ecs.NetworkMode.AWS_VPC;
            const expectTaskRole = new iam.Role(stack, 'TaskRole', {
                assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
            });
            // WHEN
            const taskDefinition = ecs.TaskDefinition.fromTaskDefinitionAttributes(stack, 'TD_ID', {
                taskDefinitionArn: expectTaskDefinitionArn,
                compatibility: expectCompatibility,
                networkMode: expectNetworkMode,
                taskRole: expectTaskRole,
            });
            // THEN
            expect(taskDefinition.taskDefinitionArn).toEqual(expectTaskDefinitionArn);
            expect(taskDefinition.compatibility).toEqual(expectCompatibility);
            expect(taskDefinition.executionRole).toEqual(undefined);
            expect(taskDefinition.networkMode).toEqual(expectNetworkMode);
            expect(taskDefinition.taskRole).toEqual(expectTaskRole);
        });
        test('returns an imported TaskDefinition that will throw an error when trying to access its yet to defined networkMode', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const expectTaskDefinitionArn = 'TD_ARN';
            const expectCompatibility = ecs.Compatibility.EC2;
            const expectTaskRole = new iam.Role(stack, 'TaskRole', {
                assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
            });
            // WHEN
            const taskDefinition = ecs.TaskDefinition.fromTaskDefinitionAttributes(stack, 'TD_ID', {
                taskDefinitionArn: expectTaskDefinitionArn,
                compatibility: expectCompatibility,
                taskRole: expectTaskRole,
            });
            // THEN
            expect(() => {
                taskDefinition.networkMode;
            }).toThrow('This operation requires the networkMode in ImportedTaskDefinition to be defined. ' +
                'Add the \'networkMode\' in ImportedTaskDefinitionProps to instantiate ImportedTaskDefinition');
        });
        test('returns an imported TaskDefinition that will throw an error when trying to access its yet to defined taskRole', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const expectTaskDefinitionArn = 'TD_ARN';
            const expectCompatibility = ecs.Compatibility.EC2;
            const expectNetworkMode = ecs.NetworkMode.AWS_VPC;
            // WHEN
            const taskDefinition = ecs.TaskDefinition.fromTaskDefinitionAttributes(stack, 'TD_ID', {
                taskDefinitionArn: expectTaskDefinitionArn,
                compatibility: expectCompatibility,
                networkMode: expectNetworkMode,
            });
            // THEN
            expect(() => {
                taskDefinition.taskRole;
            }).toThrow('This operation requires the taskRole in ImportedTaskDefinition to be defined. ' +
                'Add the \'taskRole\' in ImportedTaskDefinitionProps to instantiate ImportedTaskDefinition');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay1kZWZpbml0aW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0YXNrLWRlZmluaXRpb24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQyw4QkFBOEI7QUFFOUIsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtJQUMvQixRQUFRLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO1FBQ2xELElBQUksQ0FBQyx1RkFBdUYsRUFBRSxHQUFHLEVBQUU7WUFDakcsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRTlCLE9BQU87WUFDUCxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtnQkFDbEMsR0FBRyxFQUFFLEtBQUs7Z0JBQ1YsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLGVBQWU7YUFDakQsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDBCQUEwQixFQUFFO2dCQUMxRSxXQUFXLEVBQUUsUUFBUTthQUN0QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyw4RUFBOEUsRUFBRSxHQUFHLEVBQUU7WUFDeEYsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRTlCLE9BQU87WUFDUCxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtnQkFDbEMsR0FBRyxFQUFFLEtBQUs7Z0JBQ1YsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLFFB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UTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLE1BQU0sdUJBQXVCLEdBQUcsUUFBUSxDQUFDO1lBQ3pDLE1BQU0sbUJBQW1CLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUM7WUFDbEQsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztZQUVsRCxPQUFPO1lBQ1AsTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyw0QkFBNEIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO2dCQUNyRixpQkFBaUIsRUFBRSx1QkFBdUI7Z0JBQzFDLGFBQWEsRUFBRSxtQkFBbUI7Z0JBQ2xDLFdBQVcsRUFBRSxpQkFBaUI7YUFDL0IsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUU7Z0JBQ1YsY0FBYyxDQUFDLFFBQVEsQ0FBQztZQUMxQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0ZBQWdGO2dCQUN6RiwyRkFBMkYsQ0FBQyxDQUFDO1FBR2pHLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBlY3IgZnJvbSAnQGF3cy1jZGsvYXdzLWVjcic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ3Rhc2sgZGVmaW5pdGlvbicsICgpID0+IHtcbiAgZGVzY3JpYmUoJ1doZW4gY3JlYXRpbmcgYSBuZXcgVGFza0RlZmluaXRpb24nLCAoKSA9PiB7XG4gICAgdGVzdCgnQSB0YXNrIGRlZmluaXRpb24gd2l0aCBFQzIgYW5kIEZhcmdhdGUgY29tcGF0aWJpbGl0aWVzIGRlZmF1bHRzIHRvIG5ldHdvcmttb2RlIEF3c1ZwYycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVjcy5UYXNrRGVmaW5pdGlvbihzdGFjaywgJ1REJywge1xuICAgICAgICBjcHU6ICc1MTInLFxuICAgICAgICBtZW1vcnlNaUI6ICc1MTInLFxuICAgICAgICBjb21wYXRpYmlsaXR5OiBlY3MuQ29tcGF0aWJpbGl0eS5FQzJfQU5EX0ZBUkdBVEUsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgTmV0d29ya01vZGU6ICdhd3N2cGMnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdBIHRhc2sgZGVmaW5pdGlvbiB3aXRoIEV4dGVybmFsIGNvbXBhdGliaWxpdHkgZGVmYXVsdHMgdG8gbmV0d29ya21vZGUgQnJpZGdlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgZWNzLlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVEQnLCB7XG4gICAgICAgIGNwdTogJzUxMicsXG4gICAgICAgIG1lbW9yeU1pQjogJzUxMicsXG4gICAgICAgIGNvbXBhdGliaWxpdHk6IGVjcy5Db21wYXRpYmlsaXR5LkVYVEVSTkFMLFxuICAgICAgfSk7XG5cbiAgICAgIC8vVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgTmV0d29ya01vZGU6ICdicmlkZ2UnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdBIHRhc2sgZGVmaW5pdGlvbiBjcmVhdGVzIHRoZSBjb3JyZWN0IHBvbGljeSBmb3IgZ3JhbnRSdW4nLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdGFza0RlZiA9IG5ldyBlY3MuVGFza0RlZmluaXRpb24oc3RhY2ssICdURCcsIHtcbiAgICAgICAgY3B1OiAnNTEyJyxcbiAgICAgICAgbWVtb3J5TWlCOiAnNTEyJyxcbiAgICAgICAgY29tcGF0aWJpbGl0eTogZWNzLkNvbXBhdGliaWxpdHkuRUMyX0FORF9GQVJHQVRFLFxuICAgICAgfSk7XG4gICAgICB0YXNrRGVmLmdyYW50UnVuKHJvbGUpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ2lhbTpQYXNzUm9sZScsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdURFRhc2tSb2xlQzQ5N0FGRkMnLFxuICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ2VjczpSdW5UYXNrJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAgIFJlZjogJ1RENDlDNzhGMzYnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnQSB0YXNrIGRlZmluaXRpb24gd2l0aCBleGVjdXRpb25Sb2xlIGNyZWF0ZXMgdGhlIGNvcnJlY3QgcG9saWN5IGZvciBncmFudFJ1bicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBleGVjdXRpb25Sb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnRXhlY3V0aW9uUm9sZScsIHtcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2Vjcy10YXNrcy5hbWF6b25hd3MuY29tJyksXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHRhc2tEZWYgPSBuZXcgZWNzLlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVEQnLCB7XG4gICAgICAgIGNwdTogJzUxMicsXG4gICAgICAgIG1lbW9yeU1pQjogJzUxMicsXG4gICAgICAgIGNvbXBhdGliaWxpdHk6IGVjcy5Db21wYXRpYmlsaXR5LkVDMl9BTkRfRkFSR0FURSxcbiAgICAgICAgZXhlY3V0aW9uUm9sZTogZXhlY3V0aW9uUm9sZSxcbiAgICAgIH0pO1xuICAgICAgdGFza0RlZi5ncmFudFJ1bihyb2xlKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdpYW06UGFzc1JvbGUnLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICdURFRhc2tSb2xlQzQ5N0FGRkMnLFxuICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ0V4ZWN1dGlvblJvbGU2MDVBMDQwQicsXG4gICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnZWNzOlJ1blRhc2snLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgUmVmOiAnVEQ0OUM3OEYzNicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdBIHRhc2sgZGVmaW5pdGlvbiBjcmVhdGVzIHRoZSBjb3JyZWN0IHBvbGljeSBmb3IgZ3JhbnRSdW4gd2l0aCBDb250YWluZXJEZWZpbml0aW9uIGFkZGVkIGxhdGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgcmVwbyA9IGVjci5SZXBvc2l0b3J5LmZyb21SZXBvc2l0b3J5QXR0cmlidXRlcyhcbiAgICAgICAgc3RhY2ssICdSZXBvJywge1xuICAgICAgICAgIHJlcG9zaXRvcnlBcm46ICdhcm46YXdzOmVjcjp1cy1lYXN0LTE6MDEyMzQ1Njc4OTAxOnJlcG9zaXRvcnkvcmVwbycsXG4gICAgICAgICAgcmVwb3NpdG9yeU5hbWU6ICdyZXBvJyxcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgICBjb25zdCB0YXNrRGVmID0gbmV3IGVjcy5UYXNrRGVmaW5pdGlvbihzdGFjaywgJ1REJywge1xuICAgICAgICBjcHU6ICc1MTInLFxuICAgICAgICBtZW1vcnlNaUI6ICc1MTInLFxuICAgICAgICBjb21wYXRpYmlsaXR5OiBlY3MuQ29tcGF0aWJpbGl0eS5FQzJfQU5EX0ZBUkdBVEUsXG4gICAgICB9KTtcbiAgICAgIC8vIENyZWF0ZXMgcG9saWN5IHN0YXRlbWVudCBiZWZvcmUgZXhlY3V0aW9uUm9sZSBpcyBkZWZpbmVkXG4gICAgICB0YXNrRGVmLmdyYW50UnVuKHJvbGUpO1xuICAgICAgLy8gRGVmaW5lcyBleGVjdXRpb25Sb2xlXG4gICAgICB0YXNrRGVmLmFkZENvbnRhaW5lcignRUNSQ29udGFpbmVyJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21FY3JSZXBvc2l0b3J5KHJlcG8pLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogMjA0OCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ2lhbTpQYXNzUm9sZScsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ1REVGFza1JvbGVDNDk3QUZGQycsXG4gICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAnVERFeGVjdXRpb25Sb2xlODhDOTZCQ0QnLFxuICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ2VjczpSdW5UYXNrJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAgIFJlZjogJ1RENDlDNzhGMzYnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnQSB0YXNrIGRlZmluaXRpb24gd2hlcmUgbXVsdGlwbGUgY29udGFpbmVycyBoYXZlIGEgcG9ydCBtYXBwaW5nIHdpdGggdGhlIHNhbWUgbmFtZSB0aHJvd3MgYW4gZXJyb3InLCAoKSA9PntcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJyk7XG5cbiAgICAgIG5ldyBlY3MuQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0NvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJy9hd3MvYXdzLWV4YW1wbGUtYXBwJyksXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogMjA0OCxcbiAgICAgICAgcG9ydE1hcHBpbmdzOiBbe1xuICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgICAgIG5hbWU6ICdhcGknLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuICAgICAgbmV3IGVjcy5Db250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnQ29udGFpbmVyMicsIHtcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCcvYXdzL2F3cy1leGFtcGxlLWFwcCcpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogMjA0OCxcbiAgICAgICAgcG9ydE1hcHBpbmdzOiBbe1xuICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwODAsXG4gICAgICAgICAgbmFtZTogJ2FwaScsXG4gICAgICAgIH1dLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICB9KS50b1Rocm93KFwiUG9ydCBtYXBwaW5nIG5hbWUgJ2FwaScgY2Fubm90IGFwcGVhciBpbiBib3RoICdDb250YWluZXIyJyBhbmQgJ0NvbnRhaW5lcidcIik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdXaGVuIGltcG9ydGluZyBmcm9tIGFuIGV4aXN0aW5nIFRhc2sgZGVmaW5pdGlvbicsICgpID0+IHtcbiAgICB0ZXN0KCdjYW4gaW1wb3J0IHVzaW5nIGEgdGFzayBkZWZpbml0aW9uIGFybicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uQXJuID0gJ1REQXJuJztcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBlY3MuVGFza0RlZmluaXRpb24uZnJvbVRhc2tEZWZpbml0aW9uQXJuKHN0YWNrLCAnVERfSUQnLCB0YXNrRGVmaW5pdGlvbkFybik7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCh0YXNrRGVmaW5pdGlvbi50YXNrRGVmaW5pdGlvbkFybikudG9FcXVhbCh0YXNrRGVmaW5pdGlvbkFybik7XG4gICAgICBleHBlY3QodGFza0RlZmluaXRpb24uY29tcGF0aWJpbGl0eSkudG9FcXVhbChlY3MuQ29tcGF0aWJpbGl0eS5FQzJfQU5EX0ZBUkdBVEUpO1xuICAgICAgZXhwZWN0KHRhc2tEZWZpbml0aW9uLmV4ZWN1dGlvblJvbGUpLnRvRXF1YWwodW5kZWZpbmVkKTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gaW1wb3J0IGEgVGFzayBEZWZpbml0aW9uIHVzaW5nIGF0dHJpYnV0ZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBleHBlY3RUYXNrRGVmaW5pdGlvbkFybiA9ICdURF9BUk4nO1xuICAgICAgY29uc3QgZXhwZWN0Q29tcGF0aWJpbGl0eSA9IGVjcy5Db21wYXRpYmlsaXR5LkVDMjtcbiAgICAgIGNvbnN0IGV4cGVjdE5ldHdvcmtNb2RlID0gZWNzLk5ldHdvcmtNb2RlLkFXU19WUEM7XG4gICAgICBjb25zdCBleHBlY3RUYXNrUm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1Rhc2tSb2xlJywge1xuICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZWNzLXRhc2tzLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IGVjcy5UYXNrRGVmaW5pdGlvbi5mcm9tVGFza0RlZmluaXRpb25BdHRyaWJ1dGVzKHN0YWNrLCAnVERfSUQnLCB7XG4gICAgICAgIHRhc2tEZWZpbml0aW9uQXJuOiBleHBlY3RUYXNrRGVmaW5pdGlvbkFybixcbiAgICAgICAgY29tcGF0aWJpbGl0eTogZXhwZWN0Q29tcGF0aWJpbGl0eSxcbiAgICAgICAgbmV0d29ya01vZGU6IGV4cGVjdE5ldHdvcmtNb2RlLFxuICAgICAgICB0YXNrUm9sZTogZXhwZWN0VGFza1JvbGUsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHRhc2tEZWZpbml0aW9uLnRhc2tEZWZpbml0aW9uQXJuKS50b0VxdWFsKGV4cGVjdFRhc2tEZWZpbml0aW9uQXJuKTtcbiAgICAgIGV4cGVjdCh0YXNrRGVmaW5pdGlvbi5jb21wYXRpYmlsaXR5KS50b0VxdWFsKGV4cGVjdENvbXBhdGliaWxpdHkpO1xuICAgICAgZXhwZWN0KHRhc2tEZWZpbml0aW9uLmV4ZWN1dGlvblJvbGUpLnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgICAgIGV4cGVjdCh0YXNrRGVmaW5pdGlvbi5uZXR3b3JrTW9kZSkudG9FcXVhbChleHBlY3ROZXR3b3JrTW9kZSk7XG4gICAgICBleHBlY3QodGFza0RlZmluaXRpb24udGFza1JvbGUpLnRvRXF1YWwoZXhwZWN0VGFza1JvbGUpO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3JldHVybnMgYW4gaW1wb3J0ZWQgVGFza0RlZmluaXRpb24gdGhhdCB3aWxsIHRocm93IGFuIGVycm9yIHdoZW4gdHJ5aW5nIHRvIGFjY2VzcyBpdHMgeWV0IHRvIGRlZmluZWQgbmV0d29ya01vZGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBleHBlY3RUYXNrRGVmaW5pdGlvbkFybiA9ICdURF9BUk4nO1xuICAgICAgY29uc3QgZXhwZWN0Q29tcGF0aWJpbGl0eSA9IGVjcy5Db21wYXRpYmlsaXR5LkVDMjtcbiAgICAgIGNvbnN0IGV4cGVjdFRhc2tSb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnVGFza1JvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlY3MtdGFza3MuYW1hem9uYXdzLmNvbScpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gZWNzLlRhc2tEZWZpbml0aW9uLmZyb21UYXNrRGVmaW5pdGlvbkF0dHJpYnV0ZXMoc3RhY2ssICdURF9JRCcsIHtcbiAgICAgICAgdGFza0RlZmluaXRpb25Bcm46IGV4cGVjdFRhc2tEZWZpbml0aW9uQXJuLFxuICAgICAgICBjb21wYXRpYmlsaXR5OiBleHBlY3RDb21wYXRpYmlsaXR5LFxuICAgICAgICB0YXNrUm9sZTogZXhwZWN0VGFza1JvbGUsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgdGFza0RlZmluaXRpb24ubmV0d29ya01vZGU7XG4gICAgICB9KS50b1Rocm93KCdUaGlzIG9wZXJhdGlvbiByZXF1aXJlcyB0aGUgbmV0d29ya01vZGUgaW4gSW1wb3J0ZWRUYXNrRGVmaW5pdGlvbiB0byBiZSBkZWZpbmVkLiAnICtcbiAgICAgICAgJ0FkZCB0aGUgXFwnbmV0d29ya01vZGVcXCcgaW4gSW1wb3J0ZWRUYXNrRGVmaW5pdGlvblByb3BzIHRvIGluc3RhbnRpYXRlIEltcG9ydGVkVGFza0RlZmluaXRpb24nKTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdyZXR1cm5zIGFuIGltcG9ydGVkIFRhc2tEZWZpbml0aW9uIHRoYXQgd2lsbCB0aHJvdyBhbiBlcnJvciB3aGVuIHRyeWluZyB0byBhY2Nlc3MgaXRzIHlldCB0byBkZWZpbmVkIHRhc2tSb2xlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgZXhwZWN0VGFza0RlZmluaXRpb25Bcm4gPSAnVERfQVJOJztcbiAgICAgIGNvbnN0IGV4cGVjdENvbXBhdGliaWxpdHkgPSBlY3MuQ29tcGF0aWJpbGl0eS5FQzI7XG4gICAgICBjb25zdCBleHBlY3ROZXR3b3JrTW9kZSA9IGVjcy5OZXR3b3JrTW9kZS5BV1NfVlBDO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IGVjcy5UYXNrRGVmaW5pdGlvbi5mcm9tVGFza0RlZmluaXRpb25BdHRyaWJ1dGVzKHN0YWNrLCAnVERfSUQnLCB7XG4gICAgICAgIHRhc2tEZWZpbml0aW9uQXJuOiBleHBlY3RUYXNrRGVmaW5pdGlvbkFybixcbiAgICAgICAgY29tcGF0aWJpbGl0eTogZXhwZWN0Q29tcGF0aWJpbGl0eSxcbiAgICAgICAgbmV0d29ya01vZGU6IGV4cGVjdE5ldHdvcmtNb2RlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHRhc2tEZWZpbml0aW9uLnRhc2tSb2xlO1xuICAgICAgfSkudG9UaHJvdygnVGhpcyBvcGVyYXRpb24gcmVxdWlyZXMgdGhlIHRhc2tSb2xlIGluIEltcG9ydGVkVGFza0RlZmluaXRpb24gdG8gYmUgZGVmaW5lZC4gJyArXG4gICAgICAgICdBZGQgdGhlIFxcJ3Rhc2tSb2xlXFwnIGluIEltcG9ydGVkVGFza0RlZmluaXRpb25Qcm9wcyB0byBpbnN0YW50aWF0ZSBJbXBvcnRlZFRhc2tEZWZpbml0aW9uJyk7XG5cblxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19