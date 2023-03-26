"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const stepfunctions = require("../lib");
describe('State Machine Resources', () => {
    cdk_build_tools_1.testDeprecated('Tasks can add permissions to the execution role', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const task = new stepfunctions.Task(stack, 'Task', {
            task: {
                bind: () => ({
                    resourceArn: 'resource',
                    policyStatements: [new iam.PolicyStatement({
                            actions: ['resource:Everything'],
                            resources: ['resource'],
                        })],
                }),
            },
        });
        // WHEN
        new stepfunctions.StateMachine(stack, 'SM', {
            definition: task,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'resource:Everything',
                        Effect: 'Allow',
                        Resource: 'resource',
                    },
                ],
            },
        });
    }),
        test('Tasks hidden inside a Parallel state are also included', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const task = new FakeTask(stack, 'Task', {
                policies: [
                    new iam.PolicyStatement({
                        actions: ['resource:Everything'],
                        resources: ['resource'],
                    }),
                ],
            });
            const para = new stepfunctions.Parallel(stack, 'Para');
            para.branch(task);
            // WHEN
            new stepfunctions.StateMachine(stack, 'SM', {
                definition: para,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Action: 'resource:Everything',
                            Effect: 'Allow',
                            Resource: 'resource',
                        },
                    ],
                },
            });
        }),
        cdk_build_tools_1.testDeprecated('Task should render InputPath / Parameters / OutputPath correctly', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const task = new stepfunctions.Task(stack, 'Task', {
                inputPath: '$',
                outputPath: '$.state',
                task: {
                    bind: () => ({
                        resourceArn: 'resource',
                        parameters: {
                            'input.$': '$',
                            'stringArgument': 'inital-task',
                            'numberArgument': 123,
                            'booleanArgument': true,
                            'arrayArgument': ['a', 'b', 'c'],
                        },
                    }),
                },
            });
            // WHEN
            const taskState = task.toStateJson();
            // THEN
            expect(taskState).toStrictEqual({
                End: true,
                Retry: undefined,
                Catch: undefined,
                InputPath: '$',
                Parameters: {
                    'input.$': '$',
                    'stringArgument': 'inital-task',
                    'numberArgument': 123,
                    'booleanArgument': true,
                    'arrayArgument': ['a', 'b', 'c'],
                },
                OutputPath: '$.state',
                Type: 'Task',
                Comment: undefined,
                Resource: 'resource',
                ResultPath: undefined,
                TimeoutSeconds: undefined,
                HeartbeatSeconds: undefined,
            });
        }),
        cdk_build_tools_1.testDeprecated('Task combines taskobject parameters with direct parameters', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const task = new stepfunctions.Task(stack, 'Task', {
                inputPath: '$',
                outputPath: '$.state',
                task: {
                    bind: () => ({
                        resourceArn: 'resource',
                        parameters: {
                            a: 'aa',
                        },
                    }),
                },
                parameters: {
                    b: 'bb',
                },
            });
            // WHEN
            const taskState = task.toStateJson();
            // THEN
            expect(taskState).toStrictEqual({
                End: true,
                Retry: undefined,
                Catch: undefined,
                InputPath: '$',
                Parameters: {
                    a: 'aa',
                    b: 'bb',
                },
                OutputPath: '$.state',
                Type: 'Task',
                Comment: undefined,
                Resource: 'resource',
                ResultPath: undefined,
                TimeoutSeconds: undefined,
                HeartbeatSeconds: undefined,
            });
        }),
        test('Created state machine can grant start execution to a role', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const task = new FakeTask(stack, 'Task');
            const stateMachine = new stepfunctions.StateMachine(stack, 'StateMachine', {
                definition: task,
            });
            const role = new iam.Role(stack, 'Role', {
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            });
            // WHEN
            stateMachine.grantStartExecution(role);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: assertions_1.Match.arrayWith([assertions_1.Match.objectLike({
                            Action: 'states:StartExecution',
                            Effect: 'Allow',
                            Resource: {
                                Ref: 'StateMachine2E01A3A5',
                            },
                        })]),
                },
            });
        }),
        test('Created state machine can grant start sync execution to a role', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const task = new FakeTask(stack, 'Task');
            const stateMachine = new stepfunctions.StateMachine(stack, 'StateMachine', {
                definition: task,
                stateMachineType: stepfunctions.StateMachineType.EXPRESS,
            });
            const role = new iam.Role(stack, 'Role', {
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            });
            // WHEN
            stateMachine.grantStartSyncExecution(role);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: assertions_1.Match.arrayWith([assertions_1.Match.objectLike({
                            Action: 'states:StartSyncExecution',
                            Effect: 'Allow',
                            Resource: {
                                Ref: 'StateMachine2E01A3A5',
                            },
                        })]),
                },
            });
        }),
        test('Created state machine can grant read access to a role', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const task = new FakeTask(stack, 'Task');
            const stateMachine = new stepfunctions.StateMachine(stack, 'StateMachine', {
                definition: task,
            });
            const role = new iam.Role(stack, 'Role', {
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            });
            // WHEN
            stateMachine.grantRead(role);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'states:ListExecutions',
                                'states:ListStateMachines',
                            ],
                            Effect: 'Allow',
                            Resource: {
                                Ref: 'StateMachine2E01A3A5',
                            },
                        },
                        {
                            Action: [
                                'states:DescribeExecution',
                                'states:DescribeStateMachineForExecution',
                                'states:GetExecutionHistory',
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
                                        ':states:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':execution:',
                                        {
                                            'Fn::Select': [
                                                6,
                                                {
                                                    'Fn::Split': [
                                                        ':',
                                                        {
                                                            Ref: 'StateMachine2E01A3A5',
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        ':*',
                                    ],
                                ],
                            },
                        },
                        {
                            Action: [
                                'states:ListActivities',
                                'states:DescribeStateMachine',
                                'states:DescribeActivity',
                            ],
                            Effect: 'Allow',
                            Resource: '*',
                        },
                    ],
                },
            });
        }),
        test('Created state machine can grant task response actions to the state machine', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const task = new FakeTask(stack, 'Task');
            const stateMachine = new stepfunctions.StateMachine(stack, 'StateMachine', {
                definition: task,
            });
            const role = new iam.Role(stack, 'Role', {
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            });
            // WHEN
            stateMachine.grantTaskResponse(role);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'states:SendTaskSuccess',
                                'states:SendTaskFailure',
                                'states:SendTaskHeartbeat',
                            ],
                            Effect: 'Allow',
                            Resource: {
                                Ref: 'StateMachine2E01A3A5',
                            },
                        },
                    ],
                },
            });
        }),
        test('Created state machine can grant actions to the executions', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const task = new FakeTask(stack, 'Task');
            const stateMachine = new stepfunctions.StateMachine(stack, 'StateMachine', {
                definition: task,
            });
            const role = new iam.Role(stack, 'Role', {
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            });
            // WHEN
            stateMachine.grantExecution(role, 'states:GetExecutionHistory');
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'states:GetExecutionHistory',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {
                                            Ref: 'AWS::Partition',
                                        },
                                        ':states:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':execution:',
                                        {
                                            'Fn::Select': [
                                                6,
                                                {
                                                    'Fn::Split': [
                                                        ':',
                                                        {
                                                            Ref: 'StateMachine2E01A3A5',
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        ':*',
                                    ],
                                ],
                            },
                        },
                    ],
                },
            });
        }),
        test('Created state machine can grant actions to a role', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const task = new FakeTask(stack, 'Task');
            const stateMachine = new stepfunctions.StateMachine(stack, 'StateMachine', {
                definition: task,
            });
            const role = new iam.Role(stack, 'Role', {
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            });
            // WHEN
            stateMachine.grant(role, 'states:ListExecution');
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'states:ListExecution',
                            Effect: 'Allow',
                            Resource: {
                                Ref: 'StateMachine2E01A3A5',
                            },
                        },
                    ],
                },
            });
        }),
        test('Imported state machine can grant start execution to a role', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const stateMachineArn = 'arn:aws:states:::my-state-machine';
            const stateMachine = stepfunctions.StateMachine.fromStateMachineArn(stack, 'StateMachine', stateMachineArn);
            const role = new iam.Role(stack, 'Role', {
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            });
            // WHEN
            stateMachine.grantStartExecution(role);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'states:StartExecution',
                            Effect: 'Allow',
                            Resource: stateMachineArn,
                        },
                    ],
                    Version: '2012-10-17',
                },
                PolicyName: 'RoleDefaultPolicy5FFB7DAB',
                Roles: [
                    {
                        Ref: 'Role1ABCC5F0',
                    },
                ],
            });
        }),
        test('Imported state machine can grant read access to a role', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const stateMachineArn = 'arn:aws:states:::my-state-machine';
            const stateMachine = stepfunctions.StateMachine.fromStateMachineArn(stack, 'StateMachine', stateMachineArn);
            const role = new iam.Role(stack, 'Role', {
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            });
            // WHEN
            stateMachine.grantRead(role);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'states:ListExecutions',
                                'states:ListStateMachines',
                            ],
                            Effect: 'Allow',
                            Resource: stateMachineArn,
                        },
                        {
                            Action: [
                                'states:DescribeExecution',
                                'states:DescribeStateMachineForExecution',
                                'states:GetExecutionHistory',
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
                                        ':states:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':execution:*',
                                    ],
                                ],
                            },
                        },
                        {
                            Action: [
                                'states:ListActivities',
                                'states:DescribeStateMachine',
                                'states:DescribeActivity',
                            ],
                            Effect: 'Allow',
                            Resource: '*',
                        },
                    ],
                },
            });
        }),
        test('Imported state machine can task response permissions to the state machine', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const stateMachineArn = 'arn:aws:states:::my-state-machine';
            const stateMachine = stepfunctions.StateMachine.fromStateMachineArn(stack, 'StateMachine', stateMachineArn);
            const role = new iam.Role(stack, 'Role', {
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            });
            // WHEN
            stateMachine.grantTaskResponse(role);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'states:SendTaskSuccess',
                                'states:SendTaskFailure',
                                'states:SendTaskHeartbeat',
                            ],
                            Effect: 'Allow',
                            Resource: stateMachineArn,
                        },
                    ],
                },
            });
        }),
        test('Imported state machine can grant access to a role', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const stateMachineArn = 'arn:aws:states:::my-state-machine';
            const stateMachine = stepfunctions.StateMachine.fromStateMachineArn(stack, 'StateMachine', stateMachineArn);
            const role = new iam.Role(stack, 'Role', {
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            });
            // WHEN
            stateMachine.grant(role, 'states:ListExecution');
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'states:ListExecution',
                            Effect: 'Allow',
                            Resource: stateMachine.stateMachineArn,
                        },
                    ],
                },
            });
        }),
        test('Imported state machine can provide metrics', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const stateMachineArn = 'arn:aws:states:us-east-1:123456789012:stateMachine:my-state-machine';
            const stateMachine = stepfunctions.StateMachine.fromStateMachineArn(stack, 'StateMachine', stateMachineArn);
            const color = '#00ff00';
            // WHEN
            const metrics = new Array();
            metrics.push(stateMachine.metricAborted({ color }));
            metrics.push(stateMachine.metricFailed({ color }));
            metrics.push(stateMachine.metricStarted({ color }));
            metrics.push(stateMachine.metricSucceeded({ color }));
            metrics.push(stateMachine.metricThrottled({ color }));
            metrics.push(stateMachine.metricTime({ color }));
            metrics.push(stateMachine.metricTimedOut({ color }));
            // THEN
            for (const metric of metrics) {
                expect(metric.namespace).toEqual('AWS/States');
                expect(metric.dimensions).toEqual({ StateMachineArn: stateMachineArn });
                expect(metric.color).toEqual(color);
            }
        }),
        test('Pass should render InputPath / Parameters / OutputPath correctly', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const task = new stepfunctions.Pass(stack, 'Pass', {
                inputPath: '$',
                outputPath: '$.state',
                parameters: {
                    'input.$': '$',
                    'stringArgument': 'inital-task',
                    'numberArgument': 123,
                    'booleanArgument': true,
                    'arrayArgument': ['a', 'b', 'c'],
                },
            });
            // WHEN
            const taskState = task.toStateJson();
            // THEN
            expect(taskState).toStrictEqual({
                End: true,
                InputPath: '$',
                OutputPath: '$.state',
                Parameters: {
                    'input.$': '$',
                    'stringArgument': 'inital-task',
                    'numberArgument': 123,
                    'booleanArgument': true,
                    'arrayArgument': ['a', 'b', 'c'],
                },
                Type: 'Pass',
                Comment: undefined,
                Result: undefined,
                ResultPath: undefined,
            });
        }),
        test('parameters can be selected from the input with a path', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const task = new stepfunctions.Pass(stack, 'Pass', {
                parameters: {
                    input: stepfunctions.JsonPath.stringAt('$.myField'),
                },
            });
            // WHEN
            const taskState = task.toStateJson();
            // THEN
            expect(taskState).toEqual({
                End: true,
                Parameters: { 'input.$': '$.myField' },
                Type: 'Pass',
            });
        }),
        test('State machines must depend on their roles', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const task = new FakeTask(stack, 'Task', {
                policies: [
                    new iam.PolicyStatement({
                        resources: ['resource'],
                        actions: ['lambda:InvokeFunction'],
                    }),
                ],
            });
            new stepfunctions.StateMachine(stack, 'StateMachine', {
                definition: task,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResource('AWS::StepFunctions::StateMachine', {
                DependsOn: [
                    'StateMachineRoleDefaultPolicyDF1E6607',
                    'StateMachineRoleB840431D',
                ],
            });
        });
});
class FakeTask extends stepfunctions.TaskStateBase {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        this.taskPolicies = props.policies;
    }
    _renderTask() {
        return {
            Resource: 'my-resource',
            Parameters: stepfunctions.FieldUtils.renderObject({
                MyParameter: 'myParameter',
            }),
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUtbWFjaGluZS1yZXNvdXJjZXMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YXRlLW1hY2hpbmUtcmVzb3VyY2VzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFFdEQsd0NBQXdDO0FBQ3hDLDhEQUEwRDtBQUMxRCxxQ0FBcUM7QUFFckMsd0NBQXdDO0FBRXhDLFFBQVEsQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUU7SUFDdkMsZ0NBQWMsQ0FBQyxpREFBaUQsRUFBRSxHQUFHLEVBQUU7UUFDckUsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sSUFBSSxHQUFHLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQ2pELElBQUksRUFBRTtnQkFDSixJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztvQkFDWCxXQUFXLEVBQUUsVUFBVTtvQkFDdkIsZ0JBQWdCLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7NEJBQ3pDLE9BQU8sRUFBRSxDQUFDLHFCQUFxQixDQUFDOzRCQUNoQyxTQUFTLEVBQUUsQ0FBQyxVQUFVLENBQUM7eUJBQ3hCLENBQUMsQ0FBQztpQkFDSixDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsSUFBSSxhQUFhLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7WUFDMUMsVUFBVSxFQUFFLElBQUk7U0FDakIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO1lBQ2xFLGNBQWMsRUFBRTtnQkFDZCxPQUFPLEVBQUUsWUFBWTtnQkFDckIsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE1BQU0sRUFBRSxxQkFBcUI7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QyxZQUFZLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztLQUNwQztJQUVTLFdBQVc7UUFDbkIsT0FBTztZQUNMLFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFVBQVUsRUFBRSxhQUFhLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQztnQkFDaEQsV0FBVyxFQUFFLGFBQWE7YUFDM0IsQ0FBQztTQUNILENBQUM7S0FDSDtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjbG91ZHdhdGNoIGZyb20gJ0Bhd3MtY2RrL2F3cy1jbG91ZHdhdGNoJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IHRlc3REZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgc3RlcGZ1bmN0aW9ucyBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnU3RhdGUgTWFjaGluZSBSZXNvdXJjZXMnLCAoKSA9PiB7XG4gIHRlc3REZXByZWNhdGVkKCdUYXNrcyBjYW4gYWRkIHBlcm1pc3Npb25zIHRvIHRoZSBleGVjdXRpb24gcm9sZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHRhc2sgPSBuZXcgc3RlcGZ1bmN0aW9ucy5UYXNrKHN0YWNrLCAnVGFzaycsIHtcbiAgICAgIHRhc2s6IHtcbiAgICAgICAgYmluZDogKCkgPT4gKHtcbiAgICAgICAgICByZXNvdXJjZUFybjogJ3Jlc291cmNlJyxcbiAgICAgICAgICBwb2xpY3lTdGF0ZW1lbnRzOiBbbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgYWN0aW9uczogWydyZXNvdXJjZTpFdmVyeXRoaW5nJ10sXG4gICAgICAgICAgICByZXNvdXJjZXM6IFsncmVzb3VyY2UnXSxcbiAgICAgICAgICB9KV0sXG4gICAgICAgIH0pLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgc3RlcGZ1bmN0aW9ucy5TdGF0ZU1hY2hpbmUoc3RhY2ssICdTTScsIHtcbiAgICAgIGRlZmluaXRpb246IHRhc2ssXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ3Jlc291cmNlOkV2ZXJ5dGhpbmcnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6ICdyZXNvdXJjZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pLFxuXG4gIHRlc3QoJ1Rhc2tzIGhpZGRlbiBpbnNpZGUgYSBQYXJhbGxlbCBzdGF0ZSBhcmUgYWxzbyBpbmNsdWRlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHRhc2sgPSBuZXcgRmFrZVRhc2soc3RhY2ssICdUYXNrJywge1xuICAgICAgcG9saWNpZXM6IFtcbiAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgIGFjdGlvbnM6IFsncmVzb3VyY2U6RXZlcnl0aGluZyddLFxuICAgICAgICAgIHJlc291cmNlczogWydyZXNvdXJjZSddLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBwYXJhID0gbmV3IHN0ZXBmdW5jdGlvbnMuUGFyYWxsZWwoc3RhY2ssICdQYXJhJyk7XG4gICAgcGFyYS5icmFuY2godGFzayk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IHN0ZXBmdW5jdGlvbnMuU3RhdGVNYWNoaW5lKHN0YWNrLCAnU00nLCB7XG4gICAgICBkZWZpbml0aW9uOiBwYXJhLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdyZXNvdXJjZTpFdmVyeXRoaW5nJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiAncmVzb3VyY2UnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KSxcblxuICB0ZXN0RGVwcmVjYXRlZCgnVGFzayBzaG91bGQgcmVuZGVyIElucHV0UGF0aCAvIFBhcmFtZXRlcnMgLyBPdXRwdXRQYXRoIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHRhc2sgPSBuZXcgc3RlcGZ1bmN0aW9ucy5UYXNrKHN0YWNrLCAnVGFzaycsIHtcbiAgICAgIGlucHV0UGF0aDogJyQnLFxuICAgICAgb3V0cHV0UGF0aDogJyQuc3RhdGUnLFxuICAgICAgdGFzazoge1xuICAgICAgICBiaW5kOiAoKSA9PiAoe1xuICAgICAgICAgIHJlc291cmNlQXJuOiAncmVzb3VyY2UnLFxuICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICdpbnB1dC4kJzogJyQnLFxuICAgICAgICAgICAgJ3N0cmluZ0FyZ3VtZW50JzogJ2luaXRhbC10YXNrJyxcbiAgICAgICAgICAgICdudW1iZXJBcmd1bWVudCc6IDEyMyxcbiAgICAgICAgICAgICdib29sZWFuQXJndW1lbnQnOiB0cnVlLFxuICAgICAgICAgICAgJ2FycmF5QXJndW1lbnQnOiBbJ2EnLCAnYicsICdjJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHRhc2tTdGF0ZSA9IHRhc2sudG9TdGF0ZUpzb24oKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodGFza1N0YXRlKS50b1N0cmljdEVxdWFsKHtcbiAgICAgIEVuZDogdHJ1ZSxcbiAgICAgIFJldHJ5OiB1bmRlZmluZWQsXG4gICAgICBDYXRjaDogdW5kZWZpbmVkLFxuICAgICAgSW5wdXRQYXRoOiAnJCcsXG4gICAgICBQYXJhbWV0ZXJzOlxuICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICdpbnB1dC4kJzogJyQnLFxuICAgICAgICAgICAgICAgJ3N0cmluZ0FyZ3VtZW50JzogJ2luaXRhbC10YXNrJyxcbiAgICAgICAgICAgICAgICdudW1iZXJBcmd1bWVudCc6IDEyMyxcbiAgICAgICAgICAgICAgICdib29sZWFuQXJndW1lbnQnOiB0cnVlLFxuICAgICAgICAgICAgICAgJ2FycmF5QXJndW1lbnQnOiBbJ2EnLCAnYicsICdjJ10sXG4gICAgICAgICAgICAgfSxcbiAgICAgIE91dHB1dFBhdGg6ICckLnN0YXRlJyxcbiAgICAgIFR5cGU6ICdUYXNrJyxcbiAgICAgIENvbW1lbnQ6IHVuZGVmaW5lZCxcbiAgICAgIFJlc291cmNlOiAncmVzb3VyY2UnLFxuICAgICAgUmVzdWx0UGF0aDogdW5kZWZpbmVkLFxuICAgICAgVGltZW91dFNlY29uZHM6IHVuZGVmaW5lZCxcbiAgICAgIEhlYXJ0YmVhdFNlY29uZHM6IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgfSksXG5cbiAgdGVzdERlcHJlY2F0ZWQoJ1Rhc2sgY29tYmluZXMgdGFza29iamVjdCBwYXJhbWV0ZXJzIHdpdGggZGlyZWN0IHBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB0YXNrID0gbmV3IHN0ZXBmdW5jdGlvbnMuVGFzayhzdGFjaywgJ1Rhc2snLCB7XG4gICAgICBpbnB1dFBhdGg6ICckJyxcbiAgICAgIG91dHB1dFBhdGg6ICckLnN0YXRlJyxcbiAgICAgIHRhc2s6IHtcbiAgICAgICAgYmluZDogKCkgPT4gKHtcbiAgICAgICAgICByZXNvdXJjZUFybjogJ3Jlc291cmNlJyxcbiAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICBhOiAnYWEnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgfSxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgYjogJ2JiJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdGFza1N0YXRlID0gdGFzay50b1N0YXRlSnNvbigpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh0YXNrU3RhdGUpLnRvU3RyaWN0RXF1YWwoe1xuICAgICAgRW5kOiB0cnVlLFxuICAgICAgUmV0cnk6IHVuZGVmaW5lZCxcbiAgICAgIENhdGNoOiB1bmRlZmluZWQsXG4gICAgICBJbnB1dFBhdGg6ICckJyxcbiAgICAgIFBhcmFtZXRlcnM6XG4gICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgYTogJ2FhJyxcbiAgICAgICAgICAgICAgIGI6ICdiYicsXG4gICAgICAgICAgICAgfSxcbiAgICAgIE91dHB1dFBhdGg6ICckLnN0YXRlJyxcbiAgICAgIFR5cGU6ICdUYXNrJyxcbiAgICAgIENvbW1lbnQ6IHVuZGVmaW5lZCxcbiAgICAgIFJlc291cmNlOiAncmVzb3VyY2UnLFxuICAgICAgUmVzdWx0UGF0aDogdW5kZWZpbmVkLFxuICAgICAgVGltZW91dFNlY29uZHM6IHVuZGVmaW5lZCxcbiAgICAgIEhlYXJ0YmVhdFNlY29uZHM6IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgfSksXG5cbiAgdGVzdCgnQ3JlYXRlZCBzdGF0ZSBtYWNoaW5lIGNhbiBncmFudCBzdGFydCBleGVjdXRpb24gdG8gYSByb2xlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdGFzayA9IG5ldyBGYWtlVGFzayhzdGFjaywgJ1Rhc2snKTtcbiAgICBjb25zdCBzdGF0ZU1hY2hpbmUgPSBuZXcgc3RlcGZ1bmN0aW9ucy5TdGF0ZU1hY2hpbmUoc3RhY2ssICdTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBkZWZpbml0aW9uOiB0YXNrLFxuICAgIH0pO1xuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgc3RhdGVNYWNoaW5lLmdyYW50U3RhcnRFeGVjdXRpb24ocm9sZSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IE1hdGNoLmFycmF5V2l0aChbTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgQWN0aW9uOiAnc3RhdGVzOlN0YXJ0RXhlY3V0aW9uJyxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgIFJlZjogJ1N0YXRlTWFjaGluZTJFMDFBM0E1JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KV0pLFxuICAgICAgfSxcbiAgICB9KTtcblxuICB9KSxcblxuICB0ZXN0KCdDcmVhdGVkIHN0YXRlIG1hY2hpbmUgY2FuIGdyYW50IHN0YXJ0IHN5bmMgZXhlY3V0aW9uIHRvIGEgcm9sZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHRhc2sgPSBuZXcgRmFrZVRhc2soc3RhY2ssICdUYXNrJyk7XG4gICAgY29uc3Qgc3RhdGVNYWNoaW5lID0gbmV3IHN0ZXBmdW5jdGlvbnMuU3RhdGVNYWNoaW5lKHN0YWNrLCAnU3RhdGVNYWNoaW5lJywge1xuICAgICAgZGVmaW5pdGlvbjogdGFzayxcbiAgICAgIHN0YXRlTWFjaGluZVR5cGU6IHN0ZXBmdW5jdGlvbnMuU3RhdGVNYWNoaW5lVHlwZS5FWFBSRVNTLFxuICAgIH0pO1xuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgc3RhdGVNYWNoaW5lLmdyYW50U3RhcnRTeW5jRXhlY3V0aW9uKHJvbGUpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoW01hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIEFjdGlvbjogJ3N0YXRlczpTdGFydFN5bmNFeGVjdXRpb24nLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgUmVmOiAnU3RhdGVNYWNoaW5lMkUwMUEzQTUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXSksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gIH0pLFxuXG4gIHRlc3QoJ0NyZWF0ZWQgc3RhdGUgbWFjaGluZSBjYW4gZ3JhbnQgcmVhZCBhY2Nlc3MgdG8gYSByb2xlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdGFzayA9IG5ldyBGYWtlVGFzayhzdGFjaywgJ1Rhc2snKTtcbiAgICBjb25zdCBzdGF0ZU1hY2hpbmUgPSBuZXcgc3RlcGZ1bmN0aW9ucy5TdGF0ZU1hY2hpbmUoc3RhY2ssICdTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBkZWZpbml0aW9uOiB0YXNrLFxuICAgIH0pO1xuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgc3RhdGVNYWNoaW5lLmdyYW50UmVhZChyb2xlKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnc3RhdGVzOkxpc3RFeGVjdXRpb25zJyxcbiAgICAgICAgICAgICAgJ3N0YXRlczpMaXN0U3RhdGVNYWNoaW5lcycsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgUmVmOiAnU3RhdGVNYWNoaW5lMkUwMUEzQTUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnc3RhdGVzOkRlc2NyaWJlRXhlY3V0aW9uJyxcbiAgICAgICAgICAgICAgJ3N0YXRlczpEZXNjcmliZVN0YXRlTWFjaGluZUZvckV4ZWN1dGlvbicsXG4gICAgICAgICAgICAgICdzdGF0ZXM6R2V0RXhlY3V0aW9uSGlzdG9yeScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6c3RhdGVzOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOmV4ZWN1dGlvbjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ1N0YXRlTWFjaGluZTJFMDFBM0E1JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOionLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICdzdGF0ZXM6TGlzdEFjdGl2aXRpZXMnLFxuICAgICAgICAgICAgICAnc3RhdGVzOkRlc2NyaWJlU3RhdGVNYWNoaW5lJyxcbiAgICAgICAgICAgICAgJ3N0YXRlczpEZXNjcmliZUFjdGl2aXR5JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgKTtcblxuICB9KSxcblxuICB0ZXN0KCdDcmVhdGVkIHN0YXRlIG1hY2hpbmUgY2FuIGdyYW50IHRhc2sgcmVzcG9uc2UgYWN0aW9ucyB0byB0aGUgc3RhdGUgbWFjaGluZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHRhc2sgPSBuZXcgRmFrZVRhc2soc3RhY2ssICdUYXNrJyk7XG4gICAgY29uc3Qgc3RhdGVNYWNoaW5lID0gbmV3IHN0ZXBmdW5jdGlvbnMuU3RhdGVNYWNoaW5lKHN0YWNrLCAnU3RhdGVNYWNoaW5lJywge1xuICAgICAgZGVmaW5pdGlvbjogdGFzayxcbiAgICB9KTtcbiAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHN0YXRlTWFjaGluZS5ncmFudFRhc2tSZXNwb25zZShyb2xlKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnc3RhdGVzOlNlbmRUYXNrU3VjY2VzcycsXG4gICAgICAgICAgICAgICdzdGF0ZXM6U2VuZFRhc2tGYWlsdXJlJyxcbiAgICAgICAgICAgICAgJ3N0YXRlczpTZW5kVGFza0hlYXJ0YmVhdCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgUmVmOiAnU3RhdGVNYWNoaW5lMkUwMUEzQTUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSksXG5cbiAgdGVzdCgnQ3JlYXRlZCBzdGF0ZSBtYWNoaW5lIGNhbiBncmFudCBhY3Rpb25zIHRvIHRoZSBleGVjdXRpb25zJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdGFzayA9IG5ldyBGYWtlVGFzayhzdGFjaywgJ1Rhc2snKTtcbiAgICBjb25zdCBzdGF0ZU1hY2hpbmUgPSBuZXcgc3RlcGZ1bmN0aW9ucy5TdGF0ZU1hY2hpbmUoc3RhY2ssICdTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBkZWZpbml0aW9uOiB0YXNrLFxuICAgIH0pO1xuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgc3RhdGVNYWNoaW5lLmdyYW50RXhlY3V0aW9uKHJvbGUsICdzdGF0ZXM6R2V0RXhlY3V0aW9uSGlzdG9yeScpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnc3RhdGVzOkdldEV4ZWN1dGlvbkhpc3RvcnknLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6c3RhdGVzOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOmV4ZWN1dGlvbjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ1N0YXRlTWFjaGluZTJFMDFBM0E1JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOionLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KSxcblxuICB0ZXN0KCdDcmVhdGVkIHN0YXRlIG1hY2hpbmUgY2FuIGdyYW50IGFjdGlvbnMgdG8gYSByb2xlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdGFzayA9IG5ldyBGYWtlVGFzayhzdGFjaywgJ1Rhc2snKTtcbiAgICBjb25zdCBzdGF0ZU1hY2hpbmUgPSBuZXcgc3RlcGZ1bmN0aW9ucy5TdGF0ZU1hY2hpbmUoc3RhY2ssICdTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBkZWZpbml0aW9uOiB0YXNrLFxuICAgIH0pO1xuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgc3RhdGVNYWNoaW5lLmdyYW50KHJvbGUsICdzdGF0ZXM6TGlzdEV4ZWN1dGlvbicpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnc3RhdGVzOkxpc3RFeGVjdXRpb24nLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgUmVmOiAnU3RhdGVNYWNoaW5lMkUwMUEzQTUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICB9KSxcblxuICB0ZXN0KCdJbXBvcnRlZCBzdGF0ZSBtYWNoaW5lIGNhbiBncmFudCBzdGFydCBleGVjdXRpb24gdG8gYSByb2xlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qgc3RhdGVNYWNoaW5lQXJuID0gJ2Fybjphd3M6c3RhdGVzOjo6bXktc3RhdGUtbWFjaGluZSc7XG4gICAgY29uc3Qgc3RhdGVNYWNoaW5lID0gc3RlcGZ1bmN0aW9ucy5TdGF0ZU1hY2hpbmUuZnJvbVN0YXRlTWFjaGluZUFybihzdGFjaywgJ1N0YXRlTWFjaGluZScsIHN0YXRlTWFjaGluZUFybik7XG4gICAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbGFtYmRhLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBzdGF0ZU1hY2hpbmUuZ3JhbnRTdGFydEV4ZWN1dGlvbihyb2xlKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ3N0YXRlczpTdGFydEV4ZWN1dGlvbicsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogc3RhdGVNYWNoaW5lQXJuLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgICBQb2xpY3lOYW1lOiAnUm9sZURlZmF1bHRQb2xpY3k1RkZCN0RBQicsXG4gICAgICBSb2xlczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnUm9sZTFBQkNDNUYwJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pLFxuXG4gIHRlc3QoJ0ltcG9ydGVkIHN0YXRlIG1hY2hpbmUgY2FuIGdyYW50IHJlYWQgYWNjZXNzIHRvIGEgcm9sZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHN0YXRlTWFjaGluZUFybiA9ICdhcm46YXdzOnN0YXRlczo6Om15LXN0YXRlLW1hY2hpbmUnO1xuICAgIGNvbnN0IHN0YXRlTWFjaGluZSA9IHN0ZXBmdW5jdGlvbnMuU3RhdGVNYWNoaW5lLmZyb21TdGF0ZU1hY2hpbmVBcm4oc3RhY2ssICdTdGF0ZU1hY2hpbmUnLCBzdGF0ZU1hY2hpbmVBcm4pO1xuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgc3RhdGVNYWNoaW5lLmdyYW50UmVhZChyb2xlKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnc3RhdGVzOkxpc3RFeGVjdXRpb25zJyxcbiAgICAgICAgICAgICAgJ3N0YXRlczpMaXN0U3RhdGVNYWNoaW5lcycsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHN0YXRlTWFjaGluZUFybixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnc3RhdGVzOkRlc2NyaWJlRXhlY3V0aW9uJyxcbiAgICAgICAgICAgICAgJ3N0YXRlczpEZXNjcmliZVN0YXRlTWFjaGluZUZvckV4ZWN1dGlvbicsXG4gICAgICAgICAgICAgICdzdGF0ZXM6R2V0RXhlY3V0aW9uSGlzdG9yeScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6c3RhdGVzOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOmV4ZWN1dGlvbjoqJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnc3RhdGVzOkxpc3RBY3Rpdml0aWVzJyxcbiAgICAgICAgICAgICAgJ3N0YXRlczpEZXNjcmliZVN0YXRlTWFjaGluZScsXG4gICAgICAgICAgICAgICdzdGF0ZXM6RGVzY3JpYmVBY3Rpdml0eScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9LFxuICAgICk7XG4gIH0pLFxuXG4gIHRlc3QoJ0ltcG9ydGVkIHN0YXRlIG1hY2hpbmUgY2FuIHRhc2sgcmVzcG9uc2UgcGVybWlzc2lvbnMgdG8gdGhlIHN0YXRlIG1hY2hpbmUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBzdGF0ZU1hY2hpbmVBcm4gPSAnYXJuOmF3czpzdGF0ZXM6OjpteS1zdGF0ZS1tYWNoaW5lJztcbiAgICBjb25zdCBzdGF0ZU1hY2hpbmUgPSBzdGVwZnVuY3Rpb25zLlN0YXRlTWFjaGluZS5mcm9tU3RhdGVNYWNoaW5lQXJuKHN0YWNrLCAnU3RhdGVNYWNoaW5lJywgc3RhdGVNYWNoaW5lQXJuKTtcbiAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHN0YXRlTWFjaGluZS5ncmFudFRhc2tSZXNwb25zZShyb2xlKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnc3RhdGVzOlNlbmRUYXNrU3VjY2VzcycsXG4gICAgICAgICAgICAgICdzdGF0ZXM6U2VuZFRhc2tGYWlsdXJlJyxcbiAgICAgICAgICAgICAgJ3N0YXRlczpTZW5kVGFza0hlYXJ0YmVhdCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHN0YXRlTWFjaGluZUFybixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSksXG5cbiAgdGVzdCgnSW1wb3J0ZWQgc3RhdGUgbWFjaGluZSBjYW4gZ3JhbnQgYWNjZXNzIHRvIGEgcm9sZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHN0YXRlTWFjaGluZUFybiA9ICdhcm46YXdzOnN0YXRlczo6Om15LXN0YXRlLW1hY2hpbmUnO1xuICAgIGNvbnN0IHN0YXRlTWFjaGluZSA9IHN0ZXBmdW5jdGlvbnMuU3RhdGVNYWNoaW5lLmZyb21TdGF0ZU1hY2hpbmVBcm4oc3RhY2ssICdTdGF0ZU1hY2hpbmUnLCBzdGF0ZU1hY2hpbmVBcm4pO1xuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgc3RhdGVNYWNoaW5lLmdyYW50KHJvbGUsICdzdGF0ZXM6TGlzdEV4ZWN1dGlvbicpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnc3RhdGVzOkxpc3RFeGVjdXRpb24nLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHN0YXRlTWFjaGluZS5zdGF0ZU1hY2hpbmVBcm4sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pLFxuXG4gIHRlc3QoJ0ltcG9ydGVkIHN0YXRlIG1hY2hpbmUgY2FuIHByb3ZpZGUgbWV0cmljcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHN0YXRlTWFjaGluZUFybiA9ICdhcm46YXdzOnN0YXRlczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOnN0YXRlTWFjaGluZTpteS1zdGF0ZS1tYWNoaW5lJztcbiAgICBjb25zdCBzdGF0ZU1hY2hpbmUgPSBzdGVwZnVuY3Rpb25zLlN0YXRlTWFjaGluZS5mcm9tU3RhdGVNYWNoaW5lQXJuKHN0YWNrLCAnU3RhdGVNYWNoaW5lJywgc3RhdGVNYWNoaW5lQXJuKTtcbiAgICBjb25zdCBjb2xvciA9ICcjMDBmZjAwJztcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBtZXRyaWNzID0gbmV3IEFycmF5PGNsb3Vkd2F0Y2guTWV0cmljPigpO1xuICAgIG1ldHJpY3MucHVzaChzdGF0ZU1hY2hpbmUubWV0cmljQWJvcnRlZCh7IGNvbG9yIH0pKTtcbiAgICBtZXRyaWNzLnB1c2goc3RhdGVNYWNoaW5lLm1ldHJpY0ZhaWxlZCh7IGNvbG9yIH0pKTtcbiAgICBtZXRyaWNzLnB1c2goc3RhdGVNYWNoaW5lLm1ldHJpY1N0YXJ0ZWQoeyBjb2xvciB9KSk7XG4gICAgbWV0cmljcy5wdXNoKHN0YXRlTWFjaGluZS5tZXRyaWNTdWNjZWVkZWQoeyBjb2xvciB9KSk7XG4gICAgbWV0cmljcy5wdXNoKHN0YXRlTWFjaGluZS5tZXRyaWNUaHJvdHRsZWQoeyBjb2xvciB9KSk7XG4gICAgbWV0cmljcy5wdXNoKHN0YXRlTWFjaGluZS5tZXRyaWNUaW1lKHsgY29sb3IgfSkpO1xuICAgIG1ldHJpY3MucHVzaChzdGF0ZU1hY2hpbmUubWV0cmljVGltZWRPdXQoeyBjb2xvciB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZm9yIChjb25zdCBtZXRyaWMgb2YgbWV0cmljcykge1xuICAgICAgZXhwZWN0KG1ldHJpYy5uYW1lc3BhY2UpLnRvRXF1YWwoJ0FXUy9TdGF0ZXMnKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuZGltZW5zaW9ucykudG9FcXVhbCh7IFN0YXRlTWFjaGluZUFybjogc3RhdGVNYWNoaW5lQXJuIH0pO1xuICAgICAgZXhwZWN0KG1ldHJpYy5jb2xvcikudG9FcXVhbChjb2xvcik7XG4gICAgfVxuICB9KSxcblxuICB0ZXN0KCdQYXNzIHNob3VsZCByZW5kZXIgSW5wdXRQYXRoIC8gUGFyYW1ldGVycyAvIE91dHB1dFBhdGggY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdGFzayA9IG5ldyBzdGVwZnVuY3Rpb25zLlBhc3Moc3RhY2ssICdQYXNzJywge1xuICAgICAgaW5wdXRQYXRoOiAnJCcsXG4gICAgICBvdXRwdXRQYXRoOiAnJC5zdGF0ZScsXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICdpbnB1dC4kJzogJyQnLFxuICAgICAgICAnc3RyaW5nQXJndW1lbnQnOiAnaW5pdGFsLXRhc2snLFxuICAgICAgICAnbnVtYmVyQXJndW1lbnQnOiAxMjMsXG4gICAgICAgICdib29sZWFuQXJndW1lbnQnOiB0cnVlLFxuICAgICAgICAnYXJyYXlBcmd1bWVudCc6IFsnYScsICdiJywgJ2MnXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdGFza1N0YXRlID0gdGFzay50b1N0YXRlSnNvbigpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh0YXNrU3RhdGUpLnRvU3RyaWN0RXF1YWwoe1xuICAgICAgRW5kOiB0cnVlLFxuICAgICAgSW5wdXRQYXRoOiAnJCcsXG4gICAgICBPdXRwdXRQYXRoOiAnJC5zdGF0ZScsXG4gICAgICBQYXJhbWV0ZXJzOlxuICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICdpbnB1dC4kJzogJyQnLFxuICAgICAgICAgICAgICAgJ3N0cmluZ0FyZ3VtZW50JzogJ2luaXRhbC10YXNrJyxcbiAgICAgICAgICAgICAgICdudW1iZXJBcmd1bWVudCc6IDEyMyxcbiAgICAgICAgICAgICAgICdib29sZWFuQXJndW1lbnQnOiB0cnVlLFxuICAgICAgICAgICAgICAgJ2FycmF5QXJndW1lbnQnOiBbJ2EnLCAnYicsICdjJ10sXG4gICAgICAgICAgICAgfSxcbiAgICAgIFR5cGU6ICdQYXNzJyxcbiAgICAgIENvbW1lbnQ6IHVuZGVmaW5lZCxcbiAgICAgIFJlc3VsdDogdW5kZWZpbmVkLFxuICAgICAgUmVzdWx0UGF0aDogdW5kZWZpbmVkLFxuICAgIH0pO1xuICB9KSxcblxuICB0ZXN0KCdwYXJhbWV0ZXJzIGNhbiBiZSBzZWxlY3RlZCBmcm9tIHRoZSBpbnB1dCB3aXRoIGEgcGF0aCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHRhc2sgPSBuZXcgc3RlcGZ1bmN0aW9ucy5QYXNzKHN0YWNrLCAnUGFzcycsIHtcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgaW5wdXQ6IHN0ZXBmdW5jdGlvbnMuSnNvblBhdGguc3RyaW5nQXQoJyQubXlGaWVsZCcpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB0YXNrU3RhdGUgPSB0YXNrLnRvU3RhdGVKc29uKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHRhc2tTdGF0ZSkudG9FcXVhbCh7XG4gICAgICBFbmQ6IHRydWUsXG4gICAgICBQYXJhbWV0ZXJzOlxuICAgICAgeyAnaW5wdXQuJCc6ICckLm15RmllbGQnIH0sXG4gICAgICBUeXBlOiAnUGFzcycsXG4gICAgfSk7XG4gIH0pLFxuXG4gIHRlc3QoJ1N0YXRlIG1hY2hpbmVzIG11c3QgZGVwZW5kIG9uIHRoZWlyIHJvbGVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdGFzayA9IG5ldyBGYWtlVGFzayhzdGFjaywgJ1Rhc2snLCB7XG4gICAgICBwb2xpY2llczogW1xuICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgcmVzb3VyY2VzOiBbJ3Jlc291cmNlJ10sXG4gICAgICAgICAgYWN0aW9uczogWydsYW1iZGE6SW52b2tlRnVuY3Rpb24nXSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuICAgIG5ldyBzdGVwZnVuY3Rpb25zLlN0YXRlTWFjaGluZShzdGFjaywgJ1N0YXRlTWFjaGluZScsIHtcbiAgICAgIGRlZmluaXRpb246IHRhc2ssXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpTdGVwRnVuY3Rpb25zOjpTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBEZXBlbmRzT246IFtcbiAgICAgICAgJ1N0YXRlTWFjaGluZVJvbGVEZWZhdWx0UG9saWN5REYxRTY2MDcnLFxuICAgICAgICAnU3RhdGVNYWNoaW5lUm9sZUI4NDA0MzFEJyxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG59KTtcblxuaW50ZXJmYWNlIEZha2VUYXNrUHJvcHMgZXh0ZW5kcyBzdGVwZnVuY3Rpb25zLlRhc2tTdGF0ZUJhc2VQcm9wcyB7XG4gIHJlYWRvbmx5IHBvbGljaWVzPzogaWFtLlBvbGljeVN0YXRlbWVudFtdO1xufVxuXG5jbGFzcyBGYWtlVGFzayBleHRlbmRzIHN0ZXBmdW5jdGlvbnMuVGFza1N0YXRlQmFzZSB7XG4gIHByb3RlY3RlZCByZWFkb25seSB0YXNrTWV0cmljcz86IHN0ZXBmdW5jdGlvbnMuVGFza01ldHJpY3NDb25maWc7XG4gIHByb3RlY3RlZCByZWFkb25seSB0YXNrUG9saWNpZXM/OiBpYW0uUG9saWN5U3RhdGVtZW50W107XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEZha2VUYXNrUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuICAgIHRoaXMudGFza1BvbGljaWVzID0gcHJvcHMucG9saWNpZXM7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3JlbmRlclRhc2soKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgUmVzb3VyY2U6ICdteS1yZXNvdXJjZScsXG4gICAgICBQYXJhbWV0ZXJzOiBzdGVwZnVuY3Rpb25zLkZpZWxkVXRpbHMucmVuZGVyT2JqZWN0KHtcbiAgICAgICAgTXlQYXJhbWV0ZXI6ICdteVBhcmFtZXRlcicsXG4gICAgICB9KSxcbiAgICB9O1xuICB9XG59XG4iXX0=