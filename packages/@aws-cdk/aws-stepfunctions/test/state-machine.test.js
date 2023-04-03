"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const logs = require("@aws-cdk/aws-logs");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const fake_task_1 = require("./private/fake-task");
const sfn = require("../lib");
describe('State Machine', () => {
    test('Instantiate Default State Machine', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new sfn.StateMachine(stack, 'MyStateMachine', {
            stateMachineName: 'MyStateMachine',
            definition: sfn.Chain.start(new sfn.Pass(stack, 'Pass')),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
            StateMachineName: 'MyStateMachine',
            DefinitionString: '{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}}}',
        });
    }),
        test('Instantiate Standard State Machine', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            new sfn.StateMachine(stack, 'MyStateMachine', {
                stateMachineName: 'MyStateMachine',
                definition: sfn.Chain.start(new sfn.Pass(stack, 'Pass')),
                stateMachineType: sfn.StateMachineType.STANDARD,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
                StateMachineName: 'MyStateMachine',
                StateMachineType: 'STANDARD',
                DefinitionString: '{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}}}',
            });
        }),
        test('Instantiate Express State Machine', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            new sfn.StateMachine(stack, 'MyStateMachine', {
                stateMachineName: 'MyStateMachine',
                definition: sfn.Chain.start(new sfn.Pass(stack, 'Pass')),
                stateMachineType: sfn.StateMachineType.EXPRESS,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
                StateMachineName: 'MyStateMachine',
                StateMachineType: 'EXPRESS',
                DefinitionString: '{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}}}',
            });
        }),
        test('State Machine with invalid name', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const createStateMachine = (name) => {
                new sfn.StateMachine(stack, name + 'StateMachine', {
                    stateMachineName: name,
                    definition: sfn.Chain.start(new sfn.Pass(stack, name + 'Pass')),
                    stateMachineType: sfn.StateMachineType.EXPRESS,
                });
            };
            const tooShortName = '';
            const tooLongName = 'M'.repeat(81);
            const invalidCharactersName = '*';
            // THEN
            expect(() => {
                createStateMachine(tooShortName);
            }).toThrow(`State Machine name must be between 1 and 80 characters. Received: ${tooShortName}`);
            expect(() => {
                createStateMachine(tooLongName);
            }).toThrow(`State Machine name must be between 1 and 80 characters. Received: ${tooLongName}`);
            expect(() => {
                createStateMachine(invalidCharactersName);
            }).toThrow(`State Machine name must match "^[a-z0-9+!@.()-=_']+$/i". Received: ${invalidCharactersName}`);
        });
    test('State Machine with valid name', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const newStateMachine = new sfn.StateMachine(stack, 'dummyStateMachineToken', {
            definition: sfn.Chain.start(new sfn.Pass(stack, 'dummyStateMachineTokenPass')),
        });
        // WHEN
        const nameContainingToken = newStateMachine.stateMachineName + '-Name';
        const validName = 'AWS-Stepfunctions_Name.Test(@aws-cdk+)!=\'1\'';
        // THEN
        expect(() => {
            new sfn.StateMachine(stack, 'TokenTest-StateMachine', {
                stateMachineName: nameContainingToken,
                definition: sfn.Chain.start(new sfn.Pass(stack, 'TokenTest-StateMachinePass')),
                stateMachineType: sfn.StateMachineType.EXPRESS,
            });
        }).not.toThrow();
        expect(() => {
            new sfn.StateMachine(stack, 'ValidNameTest-StateMachine', {
                stateMachineName: validName,
                definition: sfn.Chain.start(new sfn.Pass(stack, 'ValidNameTest-StateMachinePass')),
                stateMachineType: sfn.StateMachineType.EXPRESS,
            });
        }).not.toThrow();
    });
    test('log configuration', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const logGroup = new logs.LogGroup(stack, 'MyLogGroup');
        new sfn.StateMachine(stack, 'MyStateMachine', {
            definition: sfn.Chain.start(new sfn.Pass(stack, 'Pass')),
            logs: {
                destination: logGroup,
                level: sfn.LogLevel.FATAL,
                includeExecutionData: false,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
            DefinitionString: '{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}}}',
            LoggingConfiguration: {
                Destinations: [{
                        CloudWatchLogsLogGroup: {
                            LogGroupArn: {
                                'Fn::GetAtt': ['MyLogGroup5C0DAD85', 'Arn'],
                            },
                        },
                    }],
                IncludeExecutionData: false,
                Level: 'FATAL',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [{
                        Action: [
                            'logs:CreateLogDelivery',
                            'logs:GetLogDelivery',
                            'logs:UpdateLogDelivery',
                            'logs:DeleteLogDelivery',
                            'logs:ListLogDeliveries',
                            'logs:PutResourcePolicy',
                            'logs:DescribeResourcePolicies',
                            'logs:DescribeLogGroups',
                        ],
                        Effect: 'Allow',
                        Resource: '*',
                    }],
                Version: '2012-10-17',
            },
            PolicyName: 'MyStateMachineRoleDefaultPolicyE468EB18',
            Roles: [
                {
                    Ref: 'MyStateMachineRoleD59FFEBC',
                },
            ],
        });
    });
    test('tracing configuration', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new sfn.StateMachine(stack, 'MyStateMachine', {
            definition: sfn.Chain.start(new sfn.Pass(stack, 'Pass')),
            tracingEnabled: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
            DefinitionString: '{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}}}',
            TracingConfiguration: {
                Enabled: true,
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [{
                        Action: [
                            'xray:PutTraceSegments',
                            'xray:PutTelemetryRecords',
                            'xray:GetSamplingRules',
                            'xray:GetSamplingTargets',
                        ],
                        Effect: 'Allow',
                        Resource: '*',
                    }],
                Version: '2012-10-17',
            },
            PolicyName: 'MyStateMachineRoleDefaultPolicyE468EB18',
            Roles: [
                {
                    Ref: 'MyStateMachineRoleD59FFEBC',
                },
            ],
        });
    });
    test('grant access', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const sm = new sfn.StateMachine(stack, 'MyStateMachine', {
            definition: sfn.Chain.start(new sfn.Pass(stack, 'Pass')),
        });
        const bucket = new s3.Bucket(stack, 'MyBucket');
        bucket.grantRead(sm);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: [
                            's3:GetObject*',
                            's3:GetBucket*',
                            's3:List*',
                        ],
                        Effect: 'Allow',
                        Resource: [
                            {
                                'Fn::GetAtt': [
                                    'MyBucketF68F3FF0',
                                    'Arn',
                                ],
                            },
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::GetAtt': [
                                                'MyBucketF68F3FF0',
                                                'Arn',
                                            ],
                                        },
                                        '/*',
                                    ],
                                ],
                            },
                        ],
                    },
                ],
                Version: '2012-10-17',
            },
            PolicyName: 'MyStateMachineRoleDefaultPolicyE468EB18',
            Roles: [
                {
                    Ref: 'MyStateMachineRoleD59FFEBC',
                },
            ],
        });
    });
    test('Instantiate a State Machine with a task assuming a literal roleArn (cross-account)', () => {
        // GIVEN
        const app = new cdk.App();
        const stateMachineStack = new cdk.Stack(app, 'StateMachineStack', { env: { account: '123456789' } });
        const roleStack = new cdk.Stack(app, 'RoleStack', { env: { account: '987654321' } });
        const role = iam.Role.fromRoleName(roleStack, 'Role', 'example-role');
        // WHEN
        new sfn.StateMachine(stateMachineStack, 'MyStateMachine', {
            definition: new fake_task_1.FakeTask(stateMachineStack, 'fakeTask', { credentials: { role: sfn.TaskRole.fromRole(role) } }),
        });
        // THEN
        assertions_1.Template.fromStack(stateMachineStack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
            DefinitionString: {
                'Fn::Join': [
                    '',
                    [
                        '{"StartAt":"fakeTask","States":{"fakeTask":{"End":true,"Type":"Task","Credentials":{"RoleArn":"arn:',
                        {
                            Ref: 'AWS::Partition',
                        },
                        ':iam::987654321:role/example-role"},"Resource":"my-resource","Parameters":{"MyParameter":"myParameter"}}}}',
                    ],
                ],
            },
        });
        assertions_1.Template.fromStack(stateMachineStack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Effect: 'Allow',
                        Action: 'sts:AssumeRole',
                        Resource: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {
                                        Ref: 'AWS::Partition',
                                    },
                                    ':iam::987654321:role/example-role',
                                ],
                            ],
                        },
                    },
                ],
                Version: '2012-10-17',
            },
            PolicyName: 'MyStateMachineRoleDefaultPolicyE468EB18',
            Roles: [
                {
                    Ref: 'MyStateMachineRoleD59FFEBC',
                },
            ],
        });
    });
    test('Instantiate a State Machine with a task assuming a literal roleArn (same-account)', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const role = iam.Role.fromRoleName(stack, 'Role', 'example-role');
        new sfn.StateMachine(stack, 'MyStateMachine', {
            definition: new fake_task_1.FakeTask(stack, 'fakeTask', { credentials: { role: sfn.TaskRole.fromRole(role) } }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
            DefinitionString: {
                'Fn::Join': [
                    '',
                    [
                        '{"StartAt":"fakeTask","States":{"fakeTask":{"End":true,"Type":"Task","Credentials":{"RoleArn":"arn:',
                        {
                            Ref: 'AWS::Partition',
                        },
                        ':iam::',
                        {
                            Ref: 'AWS::AccountId',
                        },
                        ':role/example-role"},"Resource":"my-resource","Parameters":{"MyParameter":"myParameter"}}}}',
                    ],
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Effect: 'Allow',
                        Action: 'sts:AssumeRole',
                        Resource: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {
                                        Ref: 'AWS::Partition',
                                    },
                                    ':iam::',
                                    {
                                        Ref: 'AWS::AccountId',
                                    },
                                    ':role/example-role',
                                ],
                            ],
                        },
                    },
                ],
                Version: '2012-10-17',
            },
            PolicyName: 'MyStateMachineRoleDefaultPolicyE468EB18',
            Roles: [
                {
                    Ref: 'MyStateMachineRoleD59FFEBC',
                },
            ],
        });
    });
    test('Instantiate a State Machine with a task assuming a JSONPath roleArn', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new sfn.StateMachine(stack, 'MyStateMachine', {
            definition: new fake_task_1.FakeTask(stack, 'fakeTask', { credentials: { role: sfn.TaskRole.fromRoleArnJsonPath('$.RoleArn') } }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
            DefinitionString: '{"StartAt":"fakeTask","States":{"fakeTask":{"End":true,"Type":"Task","Credentials":{"RoleArn.$":"$.RoleArn"},"Resource":"my-resource","Parameters":{"MyParameter":"myParameter"}}}}',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Effect: 'Allow',
                        Action: 'sts:AssumeRole',
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
            PolicyName: 'MyStateMachineRoleDefaultPolicyE468EB18',
            Roles: [
                {
                    Ref: 'MyStateMachineRoleD59FFEBC',
                },
            ],
        });
    });
    describe('StateMachine.fromStateMachineArn()', () => {
        let stack;
        beforeEach(() => {
            const app = new cdk.App();
            stack = new cdk.Stack(app, 'Base', {
                env: { account: '111111111111', region: 'stack-region' },
            });
        });
        describe('for a state machine in a different account and region', () => {
            let mach;
            beforeEach(() => {
                mach = sfn.StateMachine.fromStateMachineArn(stack, 'iMach', 'arn:aws:states:machine-region:222222222222:stateMachine:machine-name');
            });
            test("the state machine's region is taken from the ARN", () => {
                expect(mach.env.region).toBe('machine-region');
            });
            test("the state machine's account is taken from the ARN", () => {
                expect(mach.env.account).toBe('222222222222');
            });
        });
    });
    describe('StateMachine.fromStateMachineName()', () => {
        let stack;
        beforeEach(() => {
            const app = new cdk.App();
            stack = new cdk.Stack(app, 'Base', {
                env: { account: '111111111111', region: 'stack-region' },
            });
        });
        describe('for a state machine in the same account and region', () => {
            let mach;
            beforeEach(() => {
                mach = sfn.StateMachine.fromStateMachineName(stack, 'iMach', 'machine-name');
            });
            test("the state machine's region is taken from the current stack", () => {
                expect(mach.env.region).toBe('stack-region');
            });
            test("the state machine's account is taken from the current stack", () => {
                expect(mach.env.account).toBe('111111111111');
            });
            test("the state machine's account is taken from the current stack", () => {
                expect(mach.stateMachineArn.endsWith(':states:stack-region:111111111111:stateMachine:machine-name')).toBeTruthy();
            });
        });
    });
    test('with removal policy', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new sfn.StateMachine(stack, 'MyStateMachine', {
            definition: new sfn.Pass(stack, 'Pass'),
            removalPolicy: cdk.RemovalPolicy.RETAIN,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('AWS::StepFunctions::StateMachine', {
            DeletionPolicy: 'Retain',
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUtbWFjaGluZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RhdGUtbWFjaGluZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUF3QztBQUN4QywwQ0FBMEM7QUFDMUMsc0NBQXNDO0FBQ3RDLHFDQUFxQztBQUNyQyxtREFBK0M7QUFDL0MsOEJBQThCO0FBRTlCLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO0lBQzdCLElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7UUFDN0MsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLE9BQU87UUFDUCxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO1lBQzVDLGdCQUFnQixFQUFFLGdCQUFnQjtZQUNsQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztTQUN6RCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsa0NBQWtDLEVBQUU7WUFDbEYsZ0JBQWdCLEVBQUUsZ0JBQWdCO1lBQ2xDLGdCQUFnQixFQUFFLGlFQUFpRTtTQUNwRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUM7UUFFRixJQUFJLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO1lBQzlDLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUU5QixPQUFPO1lBQ1AsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtnQkFDNUMsZ0JBQWdCLEVBQUUsZ0JBQWdCO2dCQUNsQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDeEQsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFFBQVE7YUFDaEQsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtDQUFrQyxFQUFFO2dCQUNsRixnQkFBZ0IsRUFBRSxnQkFBZ0I7Z0JBQ2xDLGdCQUFnQixFQUFFLFVBQVU7Z0JBQzVCLGdCQUFnQixFQUFFLGlFQUFpRTthQUNwRixDQUFDLENBQUM7UUFFTCxDQUFDLENBQUM7UUFFRixJQUFJLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1lBQzdDLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUU5QixPQUFPO1lBQ1AsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtnQkFDNUMsZ0JBQWdCLEVBQUUsZ0JBQWdCO2dCQUNsQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDeEQsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE9BQU87YUFDL0MsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtDQUFrQyxFQUFFO2dCQUNsRixnQkFBZ0IsRUFBRSxnQkFBZ0I7Z0JBQ2xDLGdCQUFnQixFQUFFLFNBQVM7Z0JBQzNCLGdCQUFnQixFQUFFLGlFQUFpRTthQUNwRixDQUFDLENBQUM7UUFFTCxDQUFDLENBQUM7UUFFRixJQUFJLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxFQUFFO1lBQzNDLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUU5QixPQUFPO1lBQ1AsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLElBQVksRUFBRSxFQUFFO2dCQUMxQyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksR0FBRyxjQUFjLEVBQUU7b0JBQ2pELGdCQUFnQixFQUFFLElBQUk7b0JBQ3RCLFVBQVUsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQztvQkFDL0QsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE9BQU87aUJBQy9DLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQztZQUNGLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztZQUN4QixNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25DLE1BQU0scUJBQXFCLEdBQUcsR0FBRyxDQUFDO1lBRWxDLE9BQU87WUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFO2dCQUNWLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ25DLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxRUFBcUUsWUFBWSxFQUFFLENBQUMsQ0FBQztZQUVoRyxNQUFNLENBQUMsR0FBRyxFQUFFO2dCQUNWLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxRUFBcUUsV0FBVyxFQUFFLENBQUMsQ0FBQztZQUUvRixNQUFNLENBQUMsR0FBRyxFQUFFO2dCQUNWLGtCQUFrQixDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDNUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHNFQUFzRSxxQkFBcUIsRUFBRSxDQUFDLENBQUM7UUFDNUcsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO1FBQ3pDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLGVBQWUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLHdCQUF3QixFQUFFO1lBQzVFLFVBQVUsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLDRCQUE0QixDQUFDLENBQUM7U0FDL0UsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sbUJBQW1CLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQztRQUN2RSxNQUFNLFNBQVMsR0FBRywrQ0FBK0MsQ0FBQztRQUVsRSxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsd0JBQXdCLEVBQUU7Z0JBQ3BELGdCQUFnQixFQUFFLG1CQUFtQjtnQkFDckMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztnQkFDOUUsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE9BQU87YUFDL0MsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRWpCLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLDRCQUE0QixFQUFFO2dCQUN4RCxnQkFBZ0IsRUFBRSxTQUFTO2dCQUMzQixVQUFVLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO2dCQUNsRixnQkFBZ0IsRUFBRSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTzthQUMvQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbkIsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO1FBQzdCLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixPQUFPO1FBQ1AsTUFBTSxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztRQUV4RCxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO1lBQzVDLFVBQVUsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3hELElBQUksRUFBRTtnQkFDSixXQUFXLEVBQUUsUUFBUTtnQkFDckIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSztnQkFDekIsb0JBQW9CLEVBQUUsS0FBSzthQUM1QjtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxrQ0FBa0MsRUFBRTtZQUNsRixnQkFBZ0IsRUFBRSxpRUFBaUU7WUFDbkYsb0JBQW9CLEVBQUU7Z0JBQ3BCLFlBQVksRUFBRSxDQUFDO3dCQUNiLHNCQUFzQixFQUFFOzRCQUN0QixXQUFXLEVBQUU7Z0NBQ1gsWUFBWSxFQUFFLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDOzZCQUM1Qzt5QkFDRjtxQkFDRixDQUFDO2dCQUNGLG9CQUFvQixFQUFFLEtBQUs7Z0JBQzNCLEtBQUssRUFBRSxPQUFPO2FBQ2Y7U0FDRixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRTtZQUNsRSxjQUFjLEVBQUU7Z0JBQ2QsU0FBUyxFQUFFLENBQUM7d0JBQ1YsTUFBTSxFQUFFOzRCQUNOLHdCQUF3Qjs0QkFDeEIscUJBQXFCOzRCQUNyQix3QkFBd0I7NEJBQ3hCLHdCQUF3Qjs0QkFDeEIsd0JBQXdCOzRCQUN4Qix3QkFBd0I7NEJBQ3hCLCtCQUErQjs0QkFDL0Isd0JBQXdCO3lCQUN6Qjt3QkFDRCxNQUFNLEVBQUUsT0FBTzt3QkFDZixRQUFRLEVBQUUsR0FBRztxQkFDZCxDQUFDO2dCQUNGLE9BQU8sRUFBRSxZQUFZO2FBQ3RCO1lBQ0QsVUFBVSxFQUFFLHlDQUF5QztZQUNyRCxLQUFLLEVBQUU7Z0JBQ0w7b0JBQ0UsR0FBRyxFQUFFLDRCQUE0QjtpQkFDbEM7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRTtRQUNqQyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsT0FBTztRQUNQLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7WUFDNUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDeEQsY0FBYyxFQUFFLElBQUk7U0FDckIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtDQUFrQyxFQUFFO1lBQ2xGLGdCQUFnQixFQUFFLGlFQUFpRTtZQUNuRixvQkFBb0IsRUFBRTtnQkFDcEIsT0FBTyxFQUFFLElBQUk7YUFDZDtTQUNGLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO1lBQ2xFLGNBQWMsRUFBRTtnQkFDZCxTQUFTLEVBQUUsQ0FBQzt3QkFDVixNQUFNLEVBQUU7NEJBQ04sdUJBQXVCOzRCQUN2QiwwQkFBMEI7NEJBQzFCLHVCQUF1Qjs0QkFDdkIseUJBQXlCO3lCQUMxQjt3QkFDRCxNQUFNLEVBQUUsT0FBTzt3QkFDZixRQUFRLEVBQUUsR0FBRztxQkFDZCxDQUFDO2dCQUNGLE9BQU8sRUFBRSxZQUFZO2FBQ3RCO1lBQ0QsVUFBVSxFQUFFLHlDQUF5QztZQUNyRCxLQUFLLEVBQUU7Z0JBQ0w7b0JBQ0UsR0FBRyxFQUFFLDRCQUE0QjtpQkFDbEM7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7UUFDeEIsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLE9BQU87UUFDUCxNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO1lBQ3ZELFVBQVUsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3pELENBQUMsQ0FBQztRQUNILE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVyQixPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsa0JBQWtCLEVBQUU7WUFDbEUsY0FBYyxFQUFFO2dCQUNkLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxNQUFNLEVBQUU7NEJBQ04sZUFBZTs0QkFDZixlQUFlOzRCQUNmLFVBQVU7eUJBQ1g7d0JBQ0QsTUFBTSxFQUFFLE9BQU87d0JBQ2YsUUFBUSxFQUFFOzRCQUNSO2dDQUNFLFlBQVksRUFBRTtvQ0FDWixrQkFBa0I7b0NBQ2xCLEtBQUs7aUNBQ047NkJBQ0Y7NEJBQ0Q7Z0NBQ0UsVUFBVSxFQUFFO29DQUNWLEVBQUU7b0NBQ0Y7d0NBQ0U7NENBQ0UsWUFBWSxFQUFFO2dEQUNaLGtCQUFrQjtnREFDbEIsS0FBSzs2Q0FDTjt5Q0FDRjt3Q0FDRCxJQUFJO3FDQUNMO2lDQUNGOzZCQUNGO3lCQUNGO3FCQUNGO2lCQUNGO2dCQUNELE9BQU8sRUFBRSxZQUFZO2FBQ3RCO1lBQ0QsVUFBVSxFQUFFLHlDQUF5QztZQUNyRCxLQUFLLEVBQUU7Z0JBQ0w7b0JBQ0UsR0FBRyxFQUFFLDRCQUE0QjtpQkFDbEM7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG9GQUFvRixFQUFFLEdBQUcsRUFBRTtRQUM5RixRQUFRO1FBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLG1CQUFtQixFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNyRyxNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDckYsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQztRQUV0RSxPQUFPO1FBQ1AsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFO1lBQ3hELFVBQVUsRUFBRSxJQUFJLG9CQUFRLENBQUMsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztTQUNoSCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxrQ0FBa0MsRUFBRTtZQUM5RixnQkFBZ0IsRUFBRTtnQkFDaEIsVUFBVSxFQUFFO29CQUNWLEVBQUU7b0JBQ0Y7d0JBQ0UscUdBQXFHO3dCQUNyRzs0QkFDRSxHQUFHLEVBQUUsZ0JBQWdCO3lCQUN0Qjt3QkFDRCw0R0FBNEc7cUJBQzdHO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO1lBQzlFLGNBQWMsRUFBRTtnQkFDZCxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsTUFBTSxFQUFFLE9BQU87d0JBQ2YsTUFBTSxFQUFFLGdCQUFnQjt3QkFDeEIsUUFBUSxFQUFFOzRCQUNSLFVBQVUsRUFBRTtnQ0FDVixFQUFFO2dDQUNGO29DQUNFLE1BQU07b0NBQ047d0NBQ0UsR0FBRyxFQUFFLGdCQUFnQjtxQ0FDdEI7b0NBQ0QsbUNBQW1DO2lDQUNwQzs2QkFDRjt5QkFDRjtxQkFDRjtpQkFDRjtnQkFDRCxPQUFPLEVBQUUsWUFBWTthQUN0QjtZQUNELFVBQVUsRUFBRSx5Q0FBeUM7WUFDckQsS0FBSyxFQUFFO2dCQUNMO29CQUNFLEdBQUcsRUFBRSw0QkFBNEI7aUJBQ2xDO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxtRkFBbUYsRUFBRSxHQUFHLEVBQUU7UUFDN0YsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLE9BQU87UUFDUCxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7WUFDNUMsVUFBVSxFQUFFLElBQUksb0JBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztTQUNwRyxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsa0NBQWtDLEVBQUU7WUFDbEYsZ0JBQWdCLEVBQUU7Z0JBQ2hCLFVBQVUsRUFBRTtvQkFDVixFQUFFO29CQUNGO3dCQUNFLHFHQUFxRzt3QkFDckc7NEJBQ0UsR0FBRyxFQUFFLGdCQUFnQjt5QkFDdEI7d0JBQ0QsUUFBUTt3QkFDUjs0QkFDRSxHQUFHLEVBQUUsZ0JBQWdCO3lCQUN0Qjt3QkFDRCw2RkFBNkY7cUJBQzlGO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRTtZQUNsRSxjQUFjLEVBQUU7Z0JBQ2QsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE1BQU0sRUFBRSxPQUFPO3dCQUNmLE1BQU0sRUFBRSxnQkFBZ0I7d0JBQ3hCLFFBQVEsRUFBRTs0QkFDUixVQUFVLEVBQUU7Z0NBQ1YsRUFBRTtnQ0FDRjtvQ0FDRSxNQUFNO29DQUNOO3dDQUNFLEdBQUcsRUFBRSxnQkFBZ0I7cUNBQ3RCO29DQUNELFFBQVE7b0NBQ1I7d0NBQ0UsR0FBRyxFQUFFLGdCQUFnQjtxQ0FDdEI7b0NBQ0Qsb0JBQW9CO2lDQUNyQjs2QkFDRjt5QkFDRjtxQkFDRjtpQkFDRjtnQkFDRCxPQUFPLEVBQUUsWUFBWTthQUN0QjtZQUNELFVBQVUsRUFBRSx5Q0FBeUM7WUFDckQsS0FBSyxFQUFFO2dCQUNMO29CQUNFLEdBQUcsRUFBRSw0QkFBNEI7aUJBQ2xDO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxxRUFBcUUsRUFBRSxHQUFHLEVBQUU7UUFDL0UsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLE9BQU87UUFDUCxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO1lBQzVDLFVBQVUsRUFBRSxJQUFJLG9CQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsQ0FBQztTQUN0SCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsa0NBQWtDLEVBQUU7WUFDbEYsZ0JBQWdCLEVBQUUscUxBQXFMO1NBQ3hNLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO1lBQ2xFLGNBQWMsRUFBRTtnQkFDZCxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsTUFBTSxFQUFFLE9BQU87d0JBQ2YsTUFBTSxFQUFFLGdCQUFnQjt3QkFDeEIsUUFBUSxFQUFFLEdBQUc7cUJBQ2Q7aUJBQ0Y7Z0JBQ0QsT0FBTyxFQUFFLFlBQVk7YUFDdEI7WUFDRCxVQUFVLEVBQUUseUNBQXlDO1lBQ3JELEtBQUssRUFBRTtnQkFDTDtvQkFDRSxHQUFHLEVBQUUsNEJBQTRCO2lCQUNsQzthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO1FBQ2xELElBQUksS0FBZ0IsQ0FBQztRQUVyQixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDMUIsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFO2dCQUNqQyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUU7YUFDekQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsdURBQXVELEVBQUUsR0FBRyxFQUFFO1lBQ3JFLElBQUksSUFBdUIsQ0FBQztZQUU1QixVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLElBQUksR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUN6QyxLQUFLLEVBQ0wsT0FBTyxFQUNQLHNFQUFzRSxDQUN2RSxDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsa0RBQWtELEVBQUUsR0FBRyxFQUFFO2dCQUM1RCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNqRCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxtREFBbUQsRUFBRSxHQUFHLEVBQUU7Z0JBQzdELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNoRCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1FBQ25ELElBQUksS0FBZ0IsQ0FBQztRQUVyQixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDMUIsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFO2dCQUNqQyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUU7YUFDekQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO1lBQ2xFLElBQUksSUFBdUIsQ0FBQztZQUU1QixVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLElBQUksR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUMxQyxLQUFLLEVBQ0wsT0FBTyxFQUNQLGNBQWMsQ0FDZixDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsNERBQTRELEVBQUUsR0FBRyxFQUFFO2dCQUN0RSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDL0MsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsNkRBQTZELEVBQUUsR0FBRyxFQUFFO2dCQUN2RSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDaEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsNkRBQTZELEVBQUUsR0FBRyxFQUFFO2dCQUN2RSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsNkRBQTZELENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3BILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7UUFDL0IsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLE9BQU87UUFDUCxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO1lBQzVDLFVBQVUsRUFBRSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztZQUN2QyxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNO1NBQ3hDLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsa0NBQWtDLEVBQUU7WUFDeEUsY0FBYyxFQUFFLFFBQVE7U0FDekIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBsb2dzIGZyb20gJ0Bhd3MtY2RrL2F3cy1sb2dzJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBGYWtlVGFzayB9IGZyb20gJy4vcHJpdmF0ZS9mYWtlLXRhc2snO1xuaW1wb3J0ICogYXMgc2ZuIGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdTdGF0ZSBNYWNoaW5lJywgKCkgPT4ge1xuICB0ZXN0KCdJbnN0YW50aWF0ZSBEZWZhdWx0IFN0YXRlIE1hY2hpbmUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgc2ZuLlN0YXRlTWFjaGluZShzdGFjaywgJ015U3RhdGVNYWNoaW5lJywge1xuICAgICAgc3RhdGVNYWNoaW5lTmFtZTogJ015U3RhdGVNYWNoaW5lJyxcbiAgICAgIGRlZmluaXRpb246IHNmbi5DaGFpbi5zdGFydChuZXcgc2ZuLlBhc3Moc3RhY2ssICdQYXNzJykpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlN0ZXBGdW5jdGlvbnM6OlN0YXRlTWFjaGluZScsIHtcbiAgICAgIFN0YXRlTWFjaGluZU5hbWU6ICdNeVN0YXRlTWFjaGluZScsXG4gICAgICBEZWZpbml0aW9uU3RyaW5nOiAne1wiU3RhcnRBdFwiOlwiUGFzc1wiLFwiU3RhdGVzXCI6e1wiUGFzc1wiOntcIlR5cGVcIjpcIlBhc3NcIixcIkVuZFwiOnRydWV9fX0nLFxuICAgIH0pO1xuICB9KSxcblxuICB0ZXN0KCdJbnN0YW50aWF0ZSBTdGFuZGFyZCBTdGF0ZSBNYWNoaW5lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IHNmbi5TdGF0ZU1hY2hpbmUoc3RhY2ssICdNeVN0YXRlTWFjaGluZScsIHtcbiAgICAgIHN0YXRlTWFjaGluZU5hbWU6ICdNeVN0YXRlTWFjaGluZScsXG4gICAgICBkZWZpbml0aW9uOiBzZm4uQ2hhaW4uc3RhcnQobmV3IHNmbi5QYXNzKHN0YWNrLCAnUGFzcycpKSxcbiAgICAgIHN0YXRlTWFjaGluZVR5cGU6IHNmbi5TdGF0ZU1hY2hpbmVUeXBlLlNUQU5EQVJELFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlN0ZXBGdW5jdGlvbnM6OlN0YXRlTWFjaGluZScsIHtcbiAgICAgIFN0YXRlTWFjaGluZU5hbWU6ICdNeVN0YXRlTWFjaGluZScsXG4gICAgICBTdGF0ZU1hY2hpbmVUeXBlOiAnU1RBTkRBUkQnLFxuICAgICAgRGVmaW5pdGlvblN0cmluZzogJ3tcIlN0YXJ0QXRcIjpcIlBhc3NcIixcIlN0YXRlc1wiOntcIlBhc3NcIjp7XCJUeXBlXCI6XCJQYXNzXCIsXCJFbmRcIjp0cnVlfX19JyxcbiAgICB9KTtcblxuICB9KSxcblxuICB0ZXN0KCdJbnN0YW50aWF0ZSBFeHByZXNzIFN0YXRlIE1hY2hpbmUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgc2ZuLlN0YXRlTWFjaGluZShzdGFjaywgJ015U3RhdGVNYWNoaW5lJywge1xuICAgICAgc3RhdGVNYWNoaW5lTmFtZTogJ015U3RhdGVNYWNoaW5lJyxcbiAgICAgIGRlZmluaXRpb246IHNmbi5DaGFpbi5zdGFydChuZXcgc2ZuLlBhc3Moc3RhY2ssICdQYXNzJykpLFxuICAgICAgc3RhdGVNYWNoaW5lVHlwZTogc2ZuLlN0YXRlTWFjaGluZVR5cGUuRVhQUkVTUyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTdGVwRnVuY3Rpb25zOjpTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBTdGF0ZU1hY2hpbmVOYW1lOiAnTXlTdGF0ZU1hY2hpbmUnLFxuICAgICAgU3RhdGVNYWNoaW5lVHlwZTogJ0VYUFJFU1MnLFxuICAgICAgRGVmaW5pdGlvblN0cmluZzogJ3tcIlN0YXJ0QXRcIjpcIlBhc3NcIixcIlN0YXRlc1wiOntcIlBhc3NcIjp7XCJUeXBlXCI6XCJQYXNzXCIsXCJFbmRcIjp0cnVlfX19JyxcbiAgICB9KTtcblxuICB9KSxcblxuICB0ZXN0KCdTdGF0ZSBNYWNoaW5lIHdpdGggaW52YWxpZCBuYW1lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY3JlYXRlU3RhdGVNYWNoaW5lID0gKG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgbmV3IHNmbi5TdGF0ZU1hY2hpbmUoc3RhY2ssIG5hbWUgKyAnU3RhdGVNYWNoaW5lJywge1xuICAgICAgICBzdGF0ZU1hY2hpbmVOYW1lOiBuYW1lLFxuICAgICAgICBkZWZpbml0aW9uOiBzZm4uQ2hhaW4uc3RhcnQobmV3IHNmbi5QYXNzKHN0YWNrLCBuYW1lICsgJ1Bhc3MnKSksXG4gICAgICAgIHN0YXRlTWFjaGluZVR5cGU6IHNmbi5TdGF0ZU1hY2hpbmVUeXBlLkVYUFJFU1MsXG4gICAgICB9KTtcbiAgICB9O1xuICAgIGNvbnN0IHRvb1Nob3J0TmFtZSA9ICcnO1xuICAgIGNvbnN0IHRvb0xvbmdOYW1lID0gJ00nLnJlcGVhdCg4MSk7XG4gICAgY29uc3QgaW52YWxpZENoYXJhY3RlcnNOYW1lID0gJyonO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBjcmVhdGVTdGF0ZU1hY2hpbmUodG9vU2hvcnROYW1lKTtcbiAgICB9KS50b1Rocm93KGBTdGF0ZSBNYWNoaW5lIG5hbWUgbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDgwIGNoYXJhY3RlcnMuIFJlY2VpdmVkOiAke3Rvb1Nob3J0TmFtZX1gKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBjcmVhdGVTdGF0ZU1hY2hpbmUodG9vTG9uZ05hbWUpO1xuICAgIH0pLnRvVGhyb3coYFN0YXRlIE1hY2hpbmUgbmFtZSBtdXN0IGJlIGJldHdlZW4gMSBhbmQgODAgY2hhcmFjdGVycy4gUmVjZWl2ZWQ6ICR7dG9vTG9uZ05hbWV9YCk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgY3JlYXRlU3RhdGVNYWNoaW5lKGludmFsaWRDaGFyYWN0ZXJzTmFtZSk7XG4gICAgfSkudG9UaHJvdyhgU3RhdGUgTWFjaGluZSBuYW1lIG11c3QgbWF0Y2ggXCJeW2EtejAtOSshQC4oKS09XyddKyQvaVwiLiBSZWNlaXZlZDogJHtpbnZhbGlkQ2hhcmFjdGVyc05hbWV9YCk7XG4gIH0pO1xuXG4gIHRlc3QoJ1N0YXRlIE1hY2hpbmUgd2l0aCB2YWxpZCBuYW1lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgbmV3U3RhdGVNYWNoaW5lID0gbmV3IHNmbi5TdGF0ZU1hY2hpbmUoc3RhY2ssICdkdW1teVN0YXRlTWFjaGluZVRva2VuJywge1xuICAgICAgZGVmaW5pdGlvbjogc2ZuLkNoYWluLnN0YXJ0KG5ldyBzZm4uUGFzcyhzdGFjaywgJ2R1bW15U3RhdGVNYWNoaW5lVG9rZW5QYXNzJykpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG5hbWVDb250YWluaW5nVG9rZW4gPSBuZXdTdGF0ZU1hY2hpbmUuc3RhdGVNYWNoaW5lTmFtZSArICctTmFtZSc7XG4gICAgY29uc3QgdmFsaWROYW1lID0gJ0FXUy1TdGVwZnVuY3Rpb25zX05hbWUuVGVzdChAYXdzLWNkayspIT1cXCcxXFwnJztcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IHNmbi5TdGF0ZU1hY2hpbmUoc3RhY2ssICdUb2tlblRlc3QtU3RhdGVNYWNoaW5lJywge1xuICAgICAgICBzdGF0ZU1hY2hpbmVOYW1lOiBuYW1lQ29udGFpbmluZ1Rva2VuLFxuICAgICAgICBkZWZpbml0aW9uOiBzZm4uQ2hhaW4uc3RhcnQobmV3IHNmbi5QYXNzKHN0YWNrLCAnVG9rZW5UZXN0LVN0YXRlTWFjaGluZVBhc3MnKSksXG4gICAgICAgIHN0YXRlTWFjaGluZVR5cGU6IHNmbi5TdGF0ZU1hY2hpbmVUeXBlLkVYUFJFU1MsXG4gICAgICB9KTtcbiAgICB9KS5ub3QudG9UaHJvdygpO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBzZm4uU3RhdGVNYWNoaW5lKHN0YWNrLCAnVmFsaWROYW1lVGVzdC1TdGF0ZU1hY2hpbmUnLCB7XG4gICAgICAgIHN0YXRlTWFjaGluZU5hbWU6IHZhbGlkTmFtZSxcbiAgICAgICAgZGVmaW5pdGlvbjogc2ZuLkNoYWluLnN0YXJ0KG5ldyBzZm4uUGFzcyhzdGFjaywgJ1ZhbGlkTmFtZVRlc3QtU3RhdGVNYWNoaW5lUGFzcycpKSxcbiAgICAgICAgc3RhdGVNYWNoaW5lVHlwZTogc2ZuLlN0YXRlTWFjaGluZVR5cGUuRVhQUkVTUyxcbiAgICAgIH0pO1xuICAgIH0pLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2xvZyBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbG9nR3JvdXAgPSBuZXcgbG9ncy5Mb2dHcm91cChzdGFjaywgJ015TG9nR3JvdXAnKTtcblxuICAgIG5ldyBzZm4uU3RhdGVNYWNoaW5lKHN0YWNrLCAnTXlTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBkZWZpbml0aW9uOiBzZm4uQ2hhaW4uc3RhcnQobmV3IHNmbi5QYXNzKHN0YWNrLCAnUGFzcycpKSxcbiAgICAgIGxvZ3M6IHtcbiAgICAgICAgZGVzdGluYXRpb246IGxvZ0dyb3VwLFxuICAgICAgICBsZXZlbDogc2ZuLkxvZ0xldmVsLkZBVEFMLFxuICAgICAgICBpbmNsdWRlRXhlY3V0aW9uRGF0YTogZmFsc2UsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlN0ZXBGdW5jdGlvbnM6OlN0YXRlTWFjaGluZScsIHtcbiAgICAgIERlZmluaXRpb25TdHJpbmc6ICd7XCJTdGFydEF0XCI6XCJQYXNzXCIsXCJTdGF0ZXNcIjp7XCJQYXNzXCI6e1wiVHlwZVwiOlwiUGFzc1wiLFwiRW5kXCI6dHJ1ZX19fScsXG4gICAgICBMb2dnaW5nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBEZXN0aW5hdGlvbnM6IFt7XG4gICAgICAgICAgQ2xvdWRXYXRjaExvZ3NMb2dHcm91cDoge1xuICAgICAgICAgICAgTG9nR3JvdXBBcm46IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ015TG9nR3JvdXA1QzBEQUQ4NScsICdBcm4nXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfV0sXG4gICAgICAgIEluY2x1ZGVFeGVjdXRpb25EYXRhOiBmYWxzZSxcbiAgICAgICAgTGV2ZWw6ICdGQVRBTCcsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFt7XG4gICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAnbG9nczpDcmVhdGVMb2dEZWxpdmVyeScsXG4gICAgICAgICAgICAnbG9nczpHZXRMb2dEZWxpdmVyeScsXG4gICAgICAgICAgICAnbG9nczpVcGRhdGVMb2dEZWxpdmVyeScsXG4gICAgICAgICAgICAnbG9nczpEZWxldGVMb2dEZWxpdmVyeScsXG4gICAgICAgICAgICAnbG9nczpMaXN0TG9nRGVsaXZlcmllcycsXG4gICAgICAgICAgICAnbG9nczpQdXRSZXNvdXJjZVBvbGljeScsXG4gICAgICAgICAgICAnbG9nczpEZXNjcmliZVJlc291cmNlUG9saWNpZXMnLFxuICAgICAgICAgICAgJ2xvZ3M6RGVzY3JpYmVMb2dHcm91cHMnLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgIH1dLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgUG9saWN5TmFtZTogJ015U3RhdGVNYWNoaW5lUm9sZURlZmF1bHRQb2xpY3lFNDY4RUIxOCcsXG4gICAgICBSb2xlczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnTXlTdGF0ZU1hY2hpbmVSb2xlRDU5RkZFQkMnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndHJhY2luZyBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IHNmbi5TdGF0ZU1hY2hpbmUoc3RhY2ssICdNeVN0YXRlTWFjaGluZScsIHtcbiAgICAgIGRlZmluaXRpb246IHNmbi5DaGFpbi5zdGFydChuZXcgc2ZuLlBhc3Moc3RhY2ssICdQYXNzJykpLFxuICAgICAgdHJhY2luZ0VuYWJsZWQ6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U3RlcEZ1bmN0aW9uczo6U3RhdGVNYWNoaW5lJywge1xuICAgICAgRGVmaW5pdGlvblN0cmluZzogJ3tcIlN0YXJ0QXRcIjpcIlBhc3NcIixcIlN0YXRlc1wiOntcIlBhc3NcIjp7XCJUeXBlXCI6XCJQYXNzXCIsXCJFbmRcIjp0cnVlfX19JyxcbiAgICAgIFRyYWNpbmdDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIEVuYWJsZWQ6IHRydWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFt7XG4gICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAneHJheTpQdXRUcmFjZVNlZ21lbnRzJyxcbiAgICAgICAgICAgICd4cmF5OlB1dFRlbGVtZXRyeVJlY29yZHMnLFxuICAgICAgICAgICAgJ3hyYXk6R2V0U2FtcGxpbmdSdWxlcycsXG4gICAgICAgICAgICAneHJheTpHZXRTYW1wbGluZ1RhcmdldHMnLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgIH1dLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgUG9saWN5TmFtZTogJ015U3RhdGVNYWNoaW5lUm9sZURlZmF1bHRQb2xpY3lFNDY4RUIxOCcsXG4gICAgICBSb2xlczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnTXlTdGF0ZU1hY2hpbmVSb2xlRDU5RkZFQkMnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZ3JhbnQgYWNjZXNzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc20gPSBuZXcgc2ZuLlN0YXRlTWFjaGluZShzdGFjaywgJ015U3RhdGVNYWNoaW5lJywge1xuICAgICAgZGVmaW5pdGlvbjogc2ZuLkNoYWluLnN0YXJ0KG5ldyBzZm4uUGFzcyhzdGFjaywgJ1Bhc3MnKSksXG4gICAgfSk7XG4gICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jyk7XG4gICAgYnVja2V0LmdyYW50UmVhZChzbSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgJ3MzOkdldE9iamVjdConLFxuICAgICAgICAgICAgICAnczM6R2V0QnVja2V0KicsXG4gICAgICAgICAgICAgICdzMzpMaXN0KicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnLFxuICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnLyonLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgUG9saWN5TmFtZTogJ015U3RhdGVNYWNoaW5lUm9sZURlZmF1bHRQb2xpY3lFNDY4RUIxOCcsXG4gICAgICBSb2xlczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnTXlTdGF0ZU1hY2hpbmVSb2xlRDU5RkZFQkMnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnSW5zdGFudGlhdGUgYSBTdGF0ZSBNYWNoaW5lIHdpdGggYSB0YXNrIGFzc3VtaW5nIGEgbGl0ZXJhbCByb2xlQXJuIChjcm9zcy1hY2NvdW50KScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhdGVNYWNoaW5lU3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YXRlTWFjaGluZVN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OScgfSB9KTtcbiAgICBjb25zdCByb2xlU3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1JvbGVTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6ICc5ODc2NTQzMjEnIH0gfSk7XG4gICAgY29uc3Qgcm9sZSA9IGlhbS5Sb2xlLmZyb21Sb2xlTmFtZShyb2xlU3RhY2ssICdSb2xlJywgJ2V4YW1wbGUtcm9sZScpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBzZm4uU3RhdGVNYWNoaW5lKHN0YXRlTWFjaGluZVN0YWNrLCAnTXlTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBkZWZpbml0aW9uOiBuZXcgRmFrZVRhc2soc3RhdGVNYWNoaW5lU3RhY2ssICdmYWtlVGFzaycsIHsgY3JlZGVudGlhbHM6IHsgcm9sZTogc2ZuLlRhc2tSb2xlLmZyb21Sb2xlKHJvbGUpIH0gfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YXRlTWFjaGluZVN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U3RlcEZ1bmN0aW9uczo6U3RhdGVNYWNoaW5lJywge1xuICAgICAgRGVmaW5pdGlvblN0cmluZzoge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ3tcIlN0YXJ0QXRcIjpcImZha2VUYXNrXCIsXCJTdGF0ZXNcIjp7XCJmYWtlVGFza1wiOntcIkVuZFwiOnRydWUsXCJUeXBlXCI6XCJUYXNrXCIsXCJDcmVkZW50aWFsc1wiOntcIlJvbGVBcm5cIjpcImFybjonLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJzppYW06Ojk4NzY1NDMyMTpyb2xlL2V4YW1wbGUtcm9sZVwifSxcIlJlc291cmNlXCI6XCJteS1yZXNvdXJjZVwiLFwiUGFyYW1ldGVyc1wiOntcIk15UGFyYW1ldGVyXCI6XCJteVBhcmFtZXRlclwifX19fScsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhdGVNYWNoaW5lU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOmlhbTo6OTg3NjU0MzIxOnJvbGUvZXhhbXBsZS1yb2xlJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgUG9saWN5TmFtZTogJ015U3RhdGVNYWNoaW5lUm9sZURlZmF1bHRQb2xpY3lFNDY4RUIxOCcsXG4gICAgICBSb2xlczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnTXlTdGF0ZU1hY2hpbmVSb2xlRDU5RkZFQkMnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnSW5zdGFudGlhdGUgYSBTdGF0ZSBNYWNoaW5lIHdpdGggYSB0YXNrIGFzc3VtaW5nIGEgbGl0ZXJhbCByb2xlQXJuIChzYW1lLWFjY291bnQpJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgcm9sZSA9IGlhbS5Sb2xlLmZyb21Sb2xlTmFtZShzdGFjaywgJ1JvbGUnLCAnZXhhbXBsZS1yb2xlJyk7XG4gICAgbmV3IHNmbi5TdGF0ZU1hY2hpbmUoc3RhY2ssICdNeVN0YXRlTWFjaGluZScsIHtcbiAgICAgIGRlZmluaXRpb246IG5ldyBGYWtlVGFzayhzdGFjaywgJ2Zha2VUYXNrJywgeyBjcmVkZW50aWFsczogeyByb2xlOiBzZm4uVGFza1JvbGUuZnJvbVJvbGUocm9sZSkgfSB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTdGVwRnVuY3Rpb25zOjpTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBEZWZpbml0aW9uU3RyaW5nOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAne1wiU3RhcnRBdFwiOlwiZmFrZVRhc2tcIixcIlN0YXRlc1wiOntcImZha2VUYXNrXCI6e1wiRW5kXCI6dHJ1ZSxcIlR5cGVcIjpcIlRhc2tcIixcIkNyZWRlbnRpYWxzXCI6e1wiUm9sZUFyblwiOlwiYXJuOicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnOmlhbTo6JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6cm9sZS9leGFtcGxlLXJvbGVcIn0sXCJSZXNvdXJjZVwiOlwibXktcmVzb3VyY2VcIixcIlBhcmFtZXRlcnNcIjp7XCJNeVBhcmFtZXRlclwiOlwibXlQYXJhbWV0ZXJcIn19fX0nLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzppYW06OicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOnJvbGUvZXhhbXBsZS1yb2xlJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgUG9saWN5TmFtZTogJ015U3RhdGVNYWNoaW5lUm9sZURlZmF1bHRQb2xpY3lFNDY4RUIxOCcsXG4gICAgICBSb2xlczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnTXlTdGF0ZU1hY2hpbmVSb2xlRDU5RkZFQkMnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnSW5zdGFudGlhdGUgYSBTdGF0ZSBNYWNoaW5lIHdpdGggYSB0YXNrIGFzc3VtaW5nIGEgSlNPTlBhdGggcm9sZUFybicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBzZm4uU3RhdGVNYWNoaW5lKHN0YWNrLCAnTXlTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBkZWZpbml0aW9uOiBuZXcgRmFrZVRhc2soc3RhY2ssICdmYWtlVGFzaycsIHsgY3JlZGVudGlhbHM6IHsgcm9sZTogc2ZuLlRhc2tSb2xlLmZyb21Sb2xlQXJuSnNvblBhdGgoJyQuUm9sZUFybicpIH0gfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U3RlcEZ1bmN0aW9uczo6U3RhdGVNYWNoaW5lJywge1xuICAgICAgRGVmaW5pdGlvblN0cmluZzogJ3tcIlN0YXJ0QXRcIjpcImZha2VUYXNrXCIsXCJTdGF0ZXNcIjp7XCJmYWtlVGFza1wiOntcIkVuZFwiOnRydWUsXCJUeXBlXCI6XCJUYXNrXCIsXCJDcmVkZW50aWFsc1wiOntcIlJvbGVBcm4uJFwiOlwiJC5Sb2xlQXJuXCJ9LFwiUmVzb3VyY2VcIjpcIm15LXJlc291cmNlXCIsXCJQYXJhbWV0ZXJzXCI6e1wiTXlQYXJhbWV0ZXJcIjpcIm15UGFyYW1ldGVyXCJ9fX19JyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgUG9saWN5TmFtZTogJ015U3RhdGVNYWNoaW5lUm9sZURlZmF1bHRQb2xpY3lFNDY4RUIxOCcsXG4gICAgICBSb2xlczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnTXlTdGF0ZU1hY2hpbmVSb2xlRDU5RkZFQkMnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1N0YXRlTWFjaGluZS5mcm9tU3RhdGVNYWNoaW5lQXJuKCknLCAoKSA9PiB7XG4gICAgbGV0IHN0YWNrOiBjZGsuU3RhY2s7XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnQmFzZScsIHtcbiAgICAgICAgZW52OiB7IGFjY291bnQ6ICcxMTExMTExMTExMTEnLCByZWdpb246ICdzdGFjay1yZWdpb24nIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdmb3IgYSBzdGF0ZSBtYWNoaW5lIGluIGEgZGlmZmVyZW50IGFjY291bnQgYW5kIHJlZ2lvbicsICgpID0+IHtcbiAgICAgIGxldCBtYWNoOiBzZm4uSVN0YXRlTWFjaGluZTtcblxuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIG1hY2ggPSBzZm4uU3RhdGVNYWNoaW5lLmZyb21TdGF0ZU1hY2hpbmVBcm4oXG4gICAgICAgICAgc3RhY2ssXG4gICAgICAgICAgJ2lNYWNoJyxcbiAgICAgICAgICAnYXJuOmF3czpzdGF0ZXM6bWFjaGluZS1yZWdpb246MjIyMjIyMjIyMjIyOnN0YXRlTWFjaGluZTptYWNoaW5lLW5hbWUnLFxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoXCJ0aGUgc3RhdGUgbWFjaGluZSdzIHJlZ2lvbiBpcyB0YWtlbiBmcm9tIHRoZSBBUk5cIiwgKCkgPT4ge1xuICAgICAgICBleHBlY3QobWFjaC5lbnYucmVnaW9uKS50b0JlKCdtYWNoaW5lLXJlZ2lvbicpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoXCJ0aGUgc3RhdGUgbWFjaGluZSdzIGFjY291bnQgaXMgdGFrZW4gZnJvbSB0aGUgQVJOXCIsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1hY2guZW52LmFjY291bnQpLnRvQmUoJzIyMjIyMjIyMjIyMicpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdTdGF0ZU1hY2hpbmUuZnJvbVN0YXRlTWFjaGluZU5hbWUoKScsICgpID0+IHtcbiAgICBsZXQgc3RhY2s6IGNkay5TdGFjaztcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdCYXNlJywge1xuICAgICAgICBlbnY6IHsgYWNjb3VudDogJzExMTExMTExMTExMScsIHJlZ2lvbjogJ3N0YWNrLXJlZ2lvbicgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2ZvciBhIHN0YXRlIG1hY2hpbmUgaW4gdGhlIHNhbWUgYWNjb3VudCBhbmQgcmVnaW9uJywgKCkgPT4ge1xuICAgICAgbGV0IG1hY2g6IHNmbi5JU3RhdGVNYWNoaW5lO1xuXG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgbWFjaCA9IHNmbi5TdGF0ZU1hY2hpbmUuZnJvbVN0YXRlTWFjaGluZU5hbWUoXG4gICAgICAgICAgc3RhY2ssXG4gICAgICAgICAgJ2lNYWNoJyxcbiAgICAgICAgICAnbWFjaGluZS1uYW1lJyxcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KFwidGhlIHN0YXRlIG1hY2hpbmUncyByZWdpb24gaXMgdGFrZW4gZnJvbSB0aGUgY3VycmVudCBzdGFja1wiLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtYWNoLmVudi5yZWdpb24pLnRvQmUoJ3N0YWNrLXJlZ2lvbicpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoXCJ0aGUgc3RhdGUgbWFjaGluZSdzIGFjY291bnQgaXMgdGFrZW4gZnJvbSB0aGUgY3VycmVudCBzdGFja1wiLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtYWNoLmVudi5hY2NvdW50KS50b0JlKCcxMTExMTExMTExMTEnKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KFwidGhlIHN0YXRlIG1hY2hpbmUncyBhY2NvdW50IGlzIHRha2VuIGZyb20gdGhlIGN1cnJlbnQgc3RhY2tcIiwgKCkgPT4ge1xuICAgICAgICBleHBlY3QobWFjaC5zdGF0ZU1hY2hpbmVBcm4uZW5kc1dpdGgoJzpzdGF0ZXM6c3RhY2stcmVnaW9uOjExMTExMTExMTExMTpzdGF0ZU1hY2hpbmU6bWFjaGluZS1uYW1lJykpLnRvQmVUcnV0aHkoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd3aXRoIHJlbW92YWwgcG9saWN5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IHNmbi5TdGF0ZU1hY2hpbmUoc3RhY2ssICdNeVN0YXRlTWFjaGluZScsIHtcbiAgICAgIGRlZmluaXRpb246IG5ldyBzZm4uUGFzcyhzdGFjaywgJ1Bhc3MnKSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LlJFVEFJTixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OlN0ZXBGdW5jdGlvbnM6OlN0YXRlTWFjaGluZScsIHtcbiAgICAgIERlbGV0aW9uUG9saWN5OiAnUmV0YWluJyxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==