"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const logs = require("@aws-cdk/aws-logs");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const sfn = require("../lib");
const fake_task_1 = require("./private/fake-task");
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUtbWFjaGluZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RhdGUtbWFjaGluZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUF3QztBQUN4QywwQ0FBMEM7QUFDMUMsc0NBQXNDO0FBQ3RDLHFDQUFxQztBQUNyQyw4QkFBOEI7QUFDOUIsbURBQStDO0FBRS9DLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO0lBQzdCLElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7UUFDN0MsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLE9BQU87UUFDUCxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO1lBQzVDLGdCQUFnQixFQUFFLGdCQUFnQjtZQUNsQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztTQUN6RCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsa0NBQWtDLEVBQUU7WUFDbEYsZ0JBQWdCLEVBQUUsZ0JBQWdCO1lBQ2xDLGdCQUFnQixFQUFFLGlFQUFpRTtTQUNwRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUM7UUFFRixJQUFJLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO1lBQzlDLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUU5QixPQUFPO1lBQ1AsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtnQkFDNUMsZ0JBQWdCLEVBQUUsZ0JBQWdCO2dCQUNsQyxVQUFV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JztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxvZ3MgZnJvbSAnQGF3cy1jZGsvYXdzLWxvZ3MnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIHNmbiBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgRmFrZVRhc2sgfSBmcm9tICcuL3ByaXZhdGUvZmFrZS10YXNrJztcblxuZGVzY3JpYmUoJ1N0YXRlIE1hY2hpbmUnLCAoKSA9PiB7XG4gIHRlc3QoJ0luc3RhbnRpYXRlIERlZmF1bHQgU3RhdGUgTWFjaGluZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBzZm4uU3RhdGVNYWNoaW5lKHN0YWNrLCAnTXlTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBzdGF0ZU1hY2hpbmVOYW1lOiAnTXlTdGF0ZU1hY2hpbmUnLFxuICAgICAgZGVmaW5pdGlvbjogc2ZuLkNoYWluLnN0YXJ0KG5ldyBzZm4uUGFzcyhzdGFjaywgJ1Bhc3MnKSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U3RlcEZ1bmN0aW9uczo6U3RhdGVNYWNoaW5lJywge1xuICAgICAgU3RhdGVNYWNoaW5lTmFtZTogJ015U3RhdGVNYWNoaW5lJyxcbiAgICAgIERlZmluaXRpb25TdHJpbmc6ICd7XCJTdGFydEF0XCI6XCJQYXNzXCIsXCJTdGF0ZXNcIjp7XCJQYXNzXCI6e1wiVHlwZVwiOlwiUGFzc1wiLFwiRW5kXCI6dHJ1ZX19fScsXG4gICAgfSk7XG4gIH0pLFxuXG4gIHRlc3QoJ0luc3RhbnRpYXRlIFN0YW5kYXJkIFN0YXRlIE1hY2hpbmUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgc2ZuLlN0YXRlTWFjaGluZShzdGFjaywgJ015U3RhdGVNYWNoaW5lJywge1xuICAgICAgc3RhdGVNYWNoaW5lTmFtZTogJ015U3RhdGVNYWNoaW5lJyxcbiAgICAgIGRlZmluaXRpb246IHNmbi5DaGFpbi5zdGFydChuZXcgc2ZuLlBhc3Moc3RhY2ssICdQYXNzJykpLFxuICAgICAgc3RhdGVNYWNoaW5lVHlwZTogc2ZuLlN0YXRlTWFjaGluZVR5cGUuU1RBTkRBUkQsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U3RlcEZ1bmN0aW9uczo6U3RhdGVNYWNoaW5lJywge1xuICAgICAgU3RhdGVNYWNoaW5lTmFtZTogJ015U3RhdGVNYWNoaW5lJyxcbiAgICAgIFN0YXRlTWFjaGluZVR5cGU6ICdTVEFOREFSRCcsXG4gICAgICBEZWZpbml0aW9uU3RyaW5nOiAne1wiU3RhcnRBdFwiOlwiUGFzc1wiLFwiU3RhdGVzXCI6e1wiUGFzc1wiOntcIlR5cGVcIjpcIlBhc3NcIixcIkVuZFwiOnRydWV9fX0nLFxuICAgIH0pO1xuXG4gIH0pLFxuXG4gIHRlc3QoJ0luc3RhbnRpYXRlIEV4cHJlc3MgU3RhdGUgTWFjaGluZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBzZm4uU3RhdGVNYWNoaW5lKHN0YWNrLCAnTXlTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBzdGF0ZU1hY2hpbmVOYW1lOiAnTXlTdGF0ZU1hY2hpbmUnLFxuICAgICAgZGVmaW5pdGlvbjogc2ZuLkNoYWluLnN0YXJ0KG5ldyBzZm4uUGFzcyhzdGFjaywgJ1Bhc3MnKSksXG4gICAgICBzdGF0ZU1hY2hpbmVUeXBlOiBzZm4uU3RhdGVNYWNoaW5lVHlwZS5FWFBSRVNTLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlN0ZXBGdW5jdGlvbnM6OlN0YXRlTWFjaGluZScsIHtcbiAgICAgIFN0YXRlTWFjaGluZU5hbWU6ICdNeVN0YXRlTWFjaGluZScsXG4gICAgICBTdGF0ZU1hY2hpbmVUeXBlOiAnRVhQUkVTUycsXG4gICAgICBEZWZpbml0aW9uU3RyaW5nOiAne1wiU3RhcnRBdFwiOlwiUGFzc1wiLFwiU3RhdGVzXCI6e1wiUGFzc1wiOntcIlR5cGVcIjpcIlBhc3NcIixcIkVuZFwiOnRydWV9fX0nLFxuICAgIH0pO1xuXG4gIH0pLFxuXG4gIHRlc3QoJ1N0YXRlIE1hY2hpbmUgd2l0aCBpbnZhbGlkIG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjcmVhdGVTdGF0ZU1hY2hpbmUgPSAobmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICBuZXcgc2ZuLlN0YXRlTWFjaGluZShzdGFjaywgbmFtZSArICdTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICAgIHN0YXRlTWFjaGluZU5hbWU6IG5hbWUsXG4gICAgICAgIGRlZmluaXRpb246IHNmbi5DaGFpbi5zdGFydChuZXcgc2ZuLlBhc3Moc3RhY2ssIG5hbWUgKyAnUGFzcycpKSxcbiAgICAgICAgc3RhdGVNYWNoaW5lVHlwZTogc2ZuLlN0YXRlTWFjaGluZVR5cGUuRVhQUkVTUyxcbiAgICAgIH0pO1xuICAgIH07XG4gICAgY29uc3QgdG9vU2hvcnROYW1lID0gJyc7XG4gICAgY29uc3QgdG9vTG9uZ05hbWUgPSAnTScucmVwZWF0KDgxKTtcbiAgICBjb25zdCBpbnZhbGlkQ2hhcmFjdGVyc05hbWUgPSAnKic7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGNyZWF0ZVN0YXRlTWFjaGluZSh0b29TaG9ydE5hbWUpO1xuICAgIH0pLnRvVGhyb3coYFN0YXRlIE1hY2hpbmUgbmFtZSBtdXN0IGJlIGJldHdlZW4gMSBhbmQgODAgY2hhcmFjdGVycy4gUmVjZWl2ZWQ6ICR7dG9vU2hvcnROYW1lfWApO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGNyZWF0ZVN0YXRlTWFjaGluZSh0b29Mb25nTmFtZSk7XG4gICAgfSkudG9UaHJvdyhgU3RhdGUgTWFjaGluZSBuYW1lIG11c3QgYmUgYmV0d2VlbiAxIGFuZCA4MCBjaGFyYWN0ZXJzLiBSZWNlaXZlZDogJHt0b29Mb25nTmFtZX1gKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBjcmVhdGVTdGF0ZU1hY2hpbmUoaW52YWxpZENoYXJhY3RlcnNOYW1lKTtcbiAgICB9KS50b1Rocm93KGBTdGF0ZSBNYWNoaW5lIG5hbWUgbXVzdCBtYXRjaCBcIl5bYS16MC05KyFALigpLT1fJ10rJC9pXCIuIFJlY2VpdmVkOiAke2ludmFsaWRDaGFyYWN0ZXJzTmFtZX1gKTtcbiAgfSk7XG5cbiAgdGVzdCgnU3RhdGUgTWFjaGluZSB3aXRoIHZhbGlkIG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBuZXdTdGF0ZU1hY2hpbmUgPSBuZXcgc2ZuLlN0YXRlTWFjaGluZShzdGFjaywgJ2R1bW15U3RhdGVNYWNoaW5lVG9rZW4nLCB7XG4gICAgICBkZWZpbml0aW9uOiBzZm4uQ2hhaW4uc3RhcnQobmV3IHNmbi5QYXNzKHN0YWNrLCAnZHVtbXlTdGF0ZU1hY2hpbmVUb2tlblBhc3MnKSksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbmFtZUNvbnRhaW5pbmdUb2tlbiA9IG5ld1N0YXRlTWFjaGluZS5zdGF0ZU1hY2hpbmVOYW1lICsgJy1OYW1lJztcbiAgICBjb25zdCB2YWxpZE5hbWUgPSAnQVdTLVN0ZXBmdW5jdGlvbnNfTmFtZS5UZXN0KEBhd3MtY2RrKykhPVxcJzFcXCcnO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgc2ZuLlN0YXRlTWFjaGluZShzdGFjaywgJ1Rva2VuVGVzdC1TdGF0ZU1hY2hpbmUnLCB7XG4gICAgICAgIHN0YXRlTWFjaGluZU5hbWU6IG5hbWVDb250YWluaW5nVG9rZW4sXG4gICAgICAgIGRlZmluaXRpb246IHNmbi5DaGFpbi5zdGFydChuZXcgc2ZuLlBhc3Moc3RhY2ssICdUb2tlblRlc3QtU3RhdGVNYWNoaW5lUGFzcycpKSxcbiAgICAgICAgc3RhdGVNYWNoaW5lVHlwZTogc2ZuLlN0YXRlTWFjaGluZVR5cGUuRVhQUkVTUyxcbiAgICAgIH0pO1xuICAgIH0pLm5vdC50b1Rocm93KCk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IHNmbi5TdGF0ZU1hY2hpbmUoc3RhY2ssICdWYWxpZE5hbWVUZXN0LVN0YXRlTWFjaGluZScsIHtcbiAgICAgICAgc3RhdGVNYWNoaW5lTmFtZTogdmFsaWROYW1lLFxuICAgICAgICBkZWZpbml0aW9uOiBzZm4uQ2hhaW4uc3RhcnQobmV3IHNmbi5QYXNzKHN0YWNrLCAnVmFsaWROYW1lVGVzdC1TdGF0ZU1hY2hpbmVQYXNzJykpLFxuICAgICAgICBzdGF0ZU1hY2hpbmVUeXBlOiBzZm4uU3RhdGVNYWNoaW5lVHlwZS5FWFBSRVNTLFxuICAgICAgfSk7XG4gICAgfSkubm90LnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgdGVzdCgnbG9nIGNvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBsb2dHcm91cCA9IG5ldyBsb2dzLkxvZ0dyb3VwKHN0YWNrLCAnTXlMb2dHcm91cCcpO1xuXG4gICAgbmV3IHNmbi5TdGF0ZU1hY2hpbmUoc3RhY2ssICdNeVN0YXRlTWFjaGluZScsIHtcbiAgICAgIGRlZmluaXRpb246IHNmbi5DaGFpbi5zdGFydChuZXcgc2ZuLlBhc3Moc3RhY2ssICdQYXNzJykpLFxuICAgICAgbG9nczoge1xuICAgICAgICBkZXN0aW5hdGlvbjogbG9nR3JvdXAsXG4gICAgICAgIGxldmVsOiBzZm4uTG9nTGV2ZWwuRkFUQUwsXG4gICAgICAgIGluY2x1ZGVFeGVjdXRpb25EYXRhOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U3RlcEZ1bmN0aW9uczo6U3RhdGVNYWNoaW5lJywge1xuICAgICAgRGVmaW5pdGlvblN0cmluZzogJ3tcIlN0YXJ0QXRcIjpcIlBhc3NcIixcIlN0YXRlc1wiOntcIlBhc3NcIjp7XCJUeXBlXCI6XCJQYXNzXCIsXCJFbmRcIjp0cnVlfX19JyxcbiAgICAgIExvZ2dpbmdDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIERlc3RpbmF0aW9uczogW3tcbiAgICAgICAgICBDbG91ZFdhdGNoTG9nc0xvZ0dyb3VwOiB7XG4gICAgICAgICAgICBMb2dHcm91cEFybjoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnTXlMb2dHcm91cDVDMERBRDg1JywgJ0FybiddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9XSxcbiAgICAgICAgSW5jbHVkZUV4ZWN1dGlvbkRhdGE6IGZhbHNlLFxuICAgICAgICBMZXZlbDogJ0ZBVEFMJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW3tcbiAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICdsb2dzOkNyZWF0ZUxvZ0RlbGl2ZXJ5JyxcbiAgICAgICAgICAgICdsb2dzOkdldExvZ0RlbGl2ZXJ5JyxcbiAgICAgICAgICAgICdsb2dzOlVwZGF0ZUxvZ0RlbGl2ZXJ5JyxcbiAgICAgICAgICAgICdsb2dzOkRlbGV0ZUxvZ0RlbGl2ZXJ5JyxcbiAgICAgICAgICAgICdsb2dzOkxpc3RMb2dEZWxpdmVyaWVzJyxcbiAgICAgICAgICAgICdsb2dzOlB1dFJlc291cmNlUG9saWN5JyxcbiAgICAgICAgICAgICdsb2dzOkRlc2NyaWJlUmVzb3VyY2VQb2xpY2llcycsXG4gICAgICAgICAgICAnbG9nczpEZXNjcmliZUxvZ0dyb3VwcycsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgfV0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgICBQb2xpY3lOYW1lOiAnTXlTdGF0ZU1hY2hpbmVSb2xlRGVmYXVsdFBvbGljeUU0NjhFQjE4JyxcbiAgICAgIFJvbGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdNeVN0YXRlTWFjaGluZVJvbGVENTlGRkVCQycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0cmFjaW5nIGNvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgc2ZuLlN0YXRlTWFjaGluZShzdGFjaywgJ015U3RhdGVNYWNoaW5lJywge1xuICAgICAgZGVmaW5pdGlvbjogc2ZuLkNoYWluLnN0YXJ0KG5ldyBzZm4uUGFzcyhzdGFjaywgJ1Bhc3MnKSksXG4gICAgICB0cmFjaW5nRW5hYmxlZDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTdGVwRnVuY3Rpb25zOjpTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBEZWZpbml0aW9uU3RyaW5nOiAne1wiU3RhcnRBdFwiOlwiUGFzc1wiLFwiU3RhdGVzXCI6e1wiUGFzc1wiOntcIlR5cGVcIjpcIlBhc3NcIixcIkVuZFwiOnRydWV9fX0nLFxuICAgICAgVHJhY2luZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW3tcbiAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICd4cmF5OlB1dFRyYWNlU2VnbWVudHMnLFxuICAgICAgICAgICAgJ3hyYXk6UHV0VGVsZW1ldHJ5UmVjb3JkcycsXG4gICAgICAgICAgICAneHJheTpHZXRTYW1wbGluZ1J1bGVzJyxcbiAgICAgICAgICAgICd4cmF5OkdldFNhbXBsaW5nVGFyZ2V0cycsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgfV0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgICBQb2xpY3lOYW1lOiAnTXlTdGF0ZU1hY2hpbmVSb2xlRGVmYXVsdFBvbGljeUU0NjhFQjE4JyxcbiAgICAgIFJvbGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdNeVN0YXRlTWFjaGluZVJvbGVENTlGRkVCQycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdncmFudCBhY2Nlc3MnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzbSA9IG5ldyBzZm4uU3RhdGVNYWNoaW5lKHN0YWNrLCAnTXlTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBkZWZpbml0aW9uOiBzZm4uQ2hhaW4uc3RhcnQobmV3IHNmbi5QYXNzKHN0YWNrLCAnUGFzcycpKSxcbiAgICB9KTtcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKTtcbiAgICBidWNrZXQuZ3JhbnRSZWFkKHNtKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnczM6R2V0T2JqZWN0KicsXG4gICAgICAgICAgICAgICdzMzpHZXRCdWNrZXQqJyxcbiAgICAgICAgICAgICAgJ3MzOkxpc3QqJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICcvKicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgICBQb2xpY3lOYW1lOiAnTXlTdGF0ZU1hY2hpbmVSb2xlRGVmYXVsdFBvbGljeUU0NjhFQjE4JyxcbiAgICAgIFJvbGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdNeVN0YXRlTWFjaGluZVJvbGVENTlGRkVCQycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdJbnN0YW50aWF0ZSBhIFN0YXRlIE1hY2hpbmUgd2l0aCBhIHRhc2sgYXNzdW1pbmcgYSBsaXRlcmFsIHJvbGVBcm4gKGNyb3NzLWFjY291bnQpJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGF0ZU1hY2hpbmVTdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU3RhdGVNYWNoaW5lU3RhY2snLCB7IGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5JyB9IH0pO1xuICAgIGNvbnN0IHJvbGVTdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnUm9sZVN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzk4NzY1NDMyMScgfSB9KTtcbiAgICBjb25zdCByb2xlID0gaWFtLlJvbGUuZnJvbVJvbGVOYW1lKHJvbGVTdGFjaywgJ1JvbGUnLCAnZXhhbXBsZS1yb2xlJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IHNmbi5TdGF0ZU1hY2hpbmUoc3RhdGVNYWNoaW5lU3RhY2ssICdNeVN0YXRlTWFjaGluZScsIHtcbiAgICAgIGRlZmluaXRpb246IG5ldyBGYWtlVGFzayhzdGF0ZU1hY2hpbmVTdGFjaywgJ2Zha2VUYXNrJywgeyBjcmVkZW50aWFsczogeyByb2xlOiBzZm4uVGFza1JvbGUuZnJvbVJvbGUocm9sZSkgfSB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhdGVNYWNoaW5lU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTdGVwRnVuY3Rpb25zOjpTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBEZWZpbml0aW9uU3RyaW5nOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAne1wiU3RhcnRBdFwiOlwiZmFrZVRhc2tcIixcIlN0YXRlc1wiOntcImZha2VUYXNrXCI6e1wiRW5kXCI6dHJ1ZSxcIlR5cGVcIjpcIlRhc2tcIixcIkNyZWRlbnRpYWxzXCI6e1wiUm9sZUFyblwiOlwiYXJuOicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnOmlhbTo6OTg3NjU0MzIxOnJvbGUvZXhhbXBsZS1yb2xlXCJ9LFwiUmVzb3VyY2VcIjpcIm15LXJlc291cmNlXCIsXCJQYXJhbWV0ZXJzXCI6e1wiTXlQYXJhbWV0ZXJcIjpcIm15UGFyYW1ldGVyXCJ9fX19JyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGF0ZU1hY2hpbmVTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6aWFtOjo5ODc2NTQzMjE6cm9sZS9leGFtcGxlLXJvbGUnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgICBQb2xpY3lOYW1lOiAnTXlTdGF0ZU1hY2hpbmVSb2xlRGVmYXVsdFBvbGljeUU0NjhFQjE4JyxcbiAgICAgIFJvbGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdNeVN0YXRlTWFjaGluZVJvbGVENTlGRkVCQycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdJbnN0YW50aWF0ZSBhIFN0YXRlIE1hY2hpbmUgd2l0aCBhIHRhc2sgYXNzdW1pbmcgYSBsaXRlcmFsIHJvbGVBcm4gKHNhbWUtYWNjb3VudCknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByb2xlID0gaWFtLlJvbGUuZnJvbVJvbGVOYW1lKHN0YWNrLCAnUm9sZScsICdleGFtcGxlLXJvbGUnKTtcbiAgICBuZXcgc2ZuLlN0YXRlTWFjaGluZShzdGFjaywgJ015U3RhdGVNYWNoaW5lJywge1xuICAgICAgZGVmaW5pdGlvbjogbmV3IEZha2VUYXNrKHN0YWNrLCAnZmFrZVRhc2snLCB7IGNyZWRlbnRpYWxzOiB7IHJvbGU6IHNmbi5UYXNrUm9sZS5mcm9tUm9sZShyb2xlKSB9IH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlN0ZXBGdW5jdGlvbnM6OlN0YXRlTWFjaGluZScsIHtcbiAgICAgIERlZmluaXRpb25TdHJpbmc6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICd7XCJTdGFydEF0XCI6XCJmYWtlVGFza1wiLFwiU3RhdGVzXCI6e1wiZmFrZVRhc2tcIjp7XCJFbmRcIjp0cnVlLFwiVHlwZVwiOlwiVGFza1wiLFwiQ3JlZGVudGlhbHNcIjp7XCJSb2xlQXJuXCI6XCJhcm46JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6aWFtOjonLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJzpyb2xlL2V4YW1wbGUtcm9sZVwifSxcIlJlc291cmNlXCI6XCJteS1yZXNvdXJjZVwiLFwiUGFyYW1ldGVyc1wiOntcIk15UGFyYW1ldGVyXCI6XCJteVBhcmFtZXRlclwifX19fScsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOmlhbTo6JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6cm9sZS9leGFtcGxlLXJvbGUnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgICBQb2xpY3lOYW1lOiAnTXlTdGF0ZU1hY2hpbmVSb2xlRGVmYXVsdFBvbGljeUU0NjhFQjE4JyxcbiAgICAgIFJvbGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdNeVN0YXRlTWFjaGluZVJvbGVENTlGRkVCQycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdJbnN0YW50aWF0ZSBhIFN0YXRlIE1hY2hpbmUgd2l0aCBhIHRhc2sgYXNzdW1pbmcgYSBKU09OUGF0aCByb2xlQXJuJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IHNmbi5TdGF0ZU1hY2hpbmUoc3RhY2ssICdNeVN0YXRlTWFjaGluZScsIHtcbiAgICAgIGRlZmluaXRpb246IG5ldyBGYWtlVGFzayhzdGFjaywgJ2Zha2VUYXNrJywgeyBjcmVkZW50aWFsczogeyByb2xlOiBzZm4uVGFza1JvbGUuZnJvbVJvbGVBcm5Kc29uUGF0aCgnJC5Sb2xlQXJuJykgfSB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTdGVwRnVuY3Rpb25zOjpTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBEZWZpbml0aW9uU3RyaW5nOiAne1wiU3RhcnRBdFwiOlwiZmFrZVRhc2tcIixcIlN0YXRlc1wiOntcImZha2VUYXNrXCI6e1wiRW5kXCI6dHJ1ZSxcIlR5cGVcIjpcIlRhc2tcIixcIkNyZWRlbnRpYWxzXCI6e1wiUm9sZUFybi4kXCI6XCIkLlJvbGVBcm5cIn0sXCJSZXNvdXJjZVwiOlwibXktcmVzb3VyY2VcIixcIlBhcmFtZXRlcnNcIjp7XCJNeVBhcmFtZXRlclwiOlwibXlQYXJhbWV0ZXJcIn19fX0nLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgICBQb2xpY3lOYW1lOiAnTXlTdGF0ZU1hY2hpbmVSb2xlRGVmYXVsdFBvbGljeUU0NjhFQjE4JyxcbiAgICAgIFJvbGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdNeVN0YXRlTWFjaGluZVJvbGVENTlGRkVCQycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnU3RhdGVNYWNoaW5lLmZyb21TdGF0ZU1hY2hpbmVBcm4oKScsICgpID0+IHtcbiAgICBsZXQgc3RhY2s6IGNkay5TdGFjaztcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdCYXNlJywge1xuICAgICAgICBlbnY6IHsgYWNjb3VudDogJzExMTExMTExMTExMScsIHJlZ2lvbjogJ3N0YWNrLXJlZ2lvbicgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2ZvciBhIHN0YXRlIG1hY2hpbmUgaW4gYSBkaWZmZXJlbnQgYWNjb3VudCBhbmQgcmVnaW9uJywgKCkgPT4ge1xuICAgICAgbGV0IG1hY2g6IHNmbi5JU3RhdGVNYWNoaW5lO1xuXG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgbWFjaCA9IHNmbi5TdGF0ZU1hY2hpbmUuZnJvbVN0YXRlTWFjaGluZUFybihcbiAgICAgICAgICBzdGFjayxcbiAgICAgICAgICAnaU1hY2gnLFxuICAgICAgICAgICdhcm46YXdzOnN0YXRlczptYWNoaW5lLXJlZ2lvbjoyMjIyMjIyMjIyMjI6c3RhdGVNYWNoaW5lOm1hY2hpbmUtbmFtZScsXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdChcInRoZSBzdGF0ZSBtYWNoaW5lJ3MgcmVnaW9uIGlzIHRha2VuIGZyb20gdGhlIEFSTlwiLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtYWNoLmVudi5yZWdpb24pLnRvQmUoJ21hY2hpbmUtcmVnaW9uJyk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdChcInRoZSBzdGF0ZSBtYWNoaW5lJ3MgYWNjb3VudCBpcyB0YWtlbiBmcm9tIHRoZSBBUk5cIiwgKCkgPT4ge1xuICAgICAgICBleHBlY3QobWFjaC5lbnYuYWNjb3VudCkudG9CZSgnMjIyMjIyMjIyMjIyJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1N0YXRlTWFjaGluZS5mcm9tU3RhdGVNYWNoaW5lTmFtZSgpJywgKCkgPT4ge1xuICAgIGxldCBzdGFjazogY2RrLlN0YWNrO1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgICAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ0Jhc2UnLCB7XG4gICAgICAgIGVudjogeyBhY2NvdW50OiAnMTExMTExMTExMTExJywgcmVnaW9uOiAnc3RhY2stcmVnaW9uJyB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZm9yIGEgc3RhdGUgbWFjaGluZSBpbiB0aGUgc2FtZSBhY2NvdW50IGFuZCByZWdpb24nLCAoKSA9PiB7XG4gICAgICBsZXQgbWFjaDogc2ZuLklTdGF0ZU1hY2hpbmU7XG5cbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBtYWNoID0gc2ZuLlN0YXRlTWFjaGluZS5mcm9tU3RhdGVNYWNoaW5lTmFtZShcbiAgICAgICAgICBzdGFjayxcbiAgICAgICAgICAnaU1hY2gnLFxuICAgICAgICAgICdtYWNoaW5lLW5hbWUnLFxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoXCJ0aGUgc3RhdGUgbWFjaGluZSdzIHJlZ2lvbiBpcyB0YWtlbiBmcm9tIHRoZSBjdXJyZW50IHN0YWNrXCIsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1hY2guZW52LnJlZ2lvbikudG9CZSgnc3RhY2stcmVnaW9uJyk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdChcInRoZSBzdGF0ZSBtYWNoaW5lJ3MgYWNjb3VudCBpcyB0YWtlbiBmcm9tIHRoZSBjdXJyZW50IHN0YWNrXCIsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1hY2guZW52LmFjY291bnQpLnRvQmUoJzExMTExMTExMTExMScpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoXCJ0aGUgc3RhdGUgbWFjaGluZSdzIGFjY291bnQgaXMgdGFrZW4gZnJvbSB0aGUgY3VycmVudCBzdGFja1wiLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtYWNoLnN0YXRlTWFjaGluZUFybi5lbmRzV2l0aCgnOnN0YXRlczpzdGFjay1yZWdpb246MTExMTExMTExMTExOnN0YXRlTWFjaGluZTptYWNoaW5lLW5hbWUnKSkudG9CZVRydXRoeSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=