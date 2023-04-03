"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const logs = require("@aws-cdk/aws-logs");
const core_1 = require("@aws-cdk/core");
const cr = require("../../lib");
const util = require("../../lib/provider-framework/util");
test('security groups are applied to all framework functions', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });
    // WHEN
    new cr.Provider(stack, 'MyProvider', {
        onEventHandler: new lambda.Function(stack, 'OnEvent', {
            code: lambda.Code.fromInline('foo'),
            handler: 'index.onEvent',
            runtime: lambda.Runtime.NODEJS_14_X,
        }),
        isCompleteHandler: new lambda.Function(stack, 'IsComplete', {
            code: lambda.Code.fromInline('foo'),
            handler: 'index.isComplete',
            runtime: lambda.Runtime.NODEJS_14_X,
        }),
        vpc: vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
        securityGroups: [securityGroup],
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Handler: 'framework.onEvent',
        VpcConfig: {
            SecurityGroupIds: [
                {
                    'Fn::GetAtt': [
                        'SecurityGroupDD263621',
                        'GroupId',
                    ],
                },
            ],
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Handler: 'framework.isComplete',
        VpcConfig: {
            SecurityGroupIds: [
                {
                    'Fn::GetAtt': [
                        'SecurityGroupDD263621',
                        'GroupId',
                    ],
                },
            ],
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Handler: 'framework.onTimeout',
        VpcConfig: {
            SecurityGroupIds: [
                {
                    'Fn::GetAtt': [
                        'SecurityGroupDD263621',
                        'GroupId',
                    ],
                },
            ],
        },
    });
});
test('vpc is applied to all framework functions', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    // WHEN
    new cr.Provider(stack, 'MyProvider', {
        onEventHandler: new lambda.Function(stack, 'OnEvent', {
            code: lambda.Code.fromInline('foo'),
            handler: 'index.onEvent',
            runtime: lambda.Runtime.NODEJS_14_X,
        }),
        isCompleteHandler: new lambda.Function(stack, 'IsComplete', {
            code: lambda.Code.fromInline('foo'),
            handler: 'index.isComplete',
            runtime: lambda.Runtime.NODEJS_14_X,
        }),
        vpc: vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Handler: 'framework.onEvent',
        VpcConfig: {
            SubnetIds: [
                { Ref: 'VpcPrivateSubnet1Subnet536B997A' },
                { Ref: 'VpcPrivateSubnet2Subnet3788AAA1' },
            ],
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Handler: 'framework.isComplete',
        VpcConfig: {
            SubnetIds: [
                { Ref: 'VpcPrivateSubnet1Subnet536B997A' },
                { Ref: 'VpcPrivateSubnet2Subnet3788AAA1' },
            ],
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Handler: 'framework.onTimeout',
        VpcConfig: {
            SubnetIds: [
                { Ref: 'VpcPrivateSubnet1Subnet536B997A' },
                { Ref: 'VpcPrivateSubnet2Subnet3788AAA1' },
            ],
        },
    });
});
test('minimal setup', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    new cr.Provider(stack, 'MyProvider', {
        onEventHandler: new lambda.Function(stack, 'MyHandler', {
            code: lambda.Code.fromAsset(path.join(__dirname, './integration-test-fixtures/s3-file-handler')),
            handler: 'index.onEvent',
            runtime: lambda.Runtime.NODEJS_14_X,
        }),
    });
    // THEN
    // framework "onEvent" handler
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Handler: 'framework.onEvent',
        Environment: { Variables: { USER_ON_EVENT_FUNCTION_ARN: { 'Fn::GetAtt': ['MyHandler6B74D312', 'Arn'] } } },
        Timeout: 900,
    });
    // user "onEvent" handler
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Handler: 'index.onEvent',
    });
    // no framework "is complete" handler or state machine
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::StepFunctions::StateMachine', 0);
    expect(assertions_1.Template.fromStack(stack).findResources('AWS::Lambda::Function', {
        Handler: 'framework.isComplete',
        Timeout: 900,
    })).toEqual({});
});
test('if isComplete is specified, the isComplete framework handler is also included', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const handler = new lambda.Function(stack, 'MyHandler', {
        code: lambda.Code.fromAsset(path.join(__dirname, './integration-test-fixtures/s3-file-handler')),
        handler: 'index.onEvent',
        runtime: lambda.Runtime.NODEJS_14_X,
    });
    // WHEN
    new cr.Provider(stack, 'MyProvider', {
        onEventHandler: handler,
        isCompleteHandler: handler,
    });
    // THEN
    // framework "onEvent" handler
    const expectedEnv = {
        Variables: {
            USER_ON_EVENT_FUNCTION_ARN: { 'Fn::GetAtt': ['MyHandler6B74D312', 'Arn'] },
            USER_IS_COMPLETE_FUNCTION_ARN: { 'Fn::GetAtt': ['MyHandler6B74D312', 'Arn'] },
        },
    };
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Handler: 'framework.onEvent',
        Timeout: 900,
        Environment: {
            Variables: {
                ...expectedEnv.Variables,
                WAITER_STATE_MACHINE_ARN: { Ref: 'MyProviderwaiterstatemachineC1FBB9F9' },
            },
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Handler: 'framework.isComplete',
        Timeout: 900,
        Environment: expectedEnv,
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Handler: 'framework.onTimeout',
        Timeout: 900,
        Environment: expectedEnv,
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
        DefinitionString: {
            'Fn::Join': [
                '',
                [
                    '{"StartAt":"framework-isComplete-task","States":{"framework-isComplete-task":{"End":true,"Retry":[{"ErrorEquals":["States.ALL"],"IntervalSeconds":5,"MaxAttempts":360,"BackoffRate":1}],"Catch":[{"ErrorEquals":["States.ALL"],"Next":"framework-onTimeout-task"}],"Type":"Task","Resource":"',
                    {
                        'Fn::GetAtt': [
                            'MyProviderframeworkisComplete364190E2',
                            'Arn',
                        ],
                    },
                    '"},"framework-onTimeout-task":{"End":true,"Type":"Task","Resource":"',
                    {
                        'Fn::GetAtt': [
                            'MyProviderframeworkonTimeoutD9D96588',
                            'Arn',
                        ],
                    },
                    '"}}}',
                ],
            ],
        },
    });
});
test('fails if "queryInterval" and/or "totalTimeout" are set without "isCompleteHandler"', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const handler = new lambda.Function(stack, 'MyHandler', {
        code: lambda.Code.fromAsset(path.join(__dirname, './integration-test-fixtures/s3-file-handler')),
        handler: 'index.onEvent',
        runtime: lambda.Runtime.NODEJS_14_X,
    });
    // THEN
    expect(() => new cr.Provider(stack, 'provider1', {
        onEventHandler: handler,
        queryInterval: core_1.Duration.seconds(10),
    })).toThrow(/\"queryInterval\" and \"totalTimeout\" can only be configured if \"isCompleteHandler\" is specified. Otherwise, they have no meaning/);
    expect(() => new cr.Provider(stack, 'provider2', {
        onEventHandler: handler,
        totalTimeout: core_1.Duration.seconds(100),
    })).toThrow(/\"queryInterval\" and \"totalTimeout\" can only be configured if \"isCompleteHandler\" is specified. Otherwise, they have no meaning/);
});
describe('retry policy', () => {
    it('default is 30 minutes timeout in 5 second intervals', () => {
        const policy = util.calculateRetryPolicy();
        expect(policy.backoffRate).toStrictEqual(1);
        expect(policy.interval && policy.interval.toSeconds()).toStrictEqual(5);
        expect(policy.maxAttempts).toStrictEqual(360);
    });
    it('if total timeout and query interval are the same we will have one attempt', () => {
        const policy = util.calculateRetryPolicy({
            totalTimeout: core_1.Duration.minutes(5),
            queryInterval: core_1.Duration.minutes(5),
        });
        expect(policy.maxAttempts).toStrictEqual(1);
    });
    it('fails if total timeout cannot be integrally divided', () => {
        expect(() => util.calculateRetryPolicy({
            totalTimeout: core_1.Duration.seconds(100),
            queryInterval: core_1.Duration.seconds(75),
        })).toThrow(/Cannot determine retry count since totalTimeout=100s is not integrally dividable by queryInterval=75s/);
    });
    it('fails if interval > timeout', () => {
        expect(() => util.calculateRetryPolicy({
            totalTimeout: core_1.Duration.seconds(5),
            queryInterval: core_1.Duration.seconds(10),
        })).toThrow(/Cannot determine retry count since totalTimeout=5s is not integrally dividable by queryInterval=10s/);
    });
});
describe('log retention', () => {
    it('includes a log rotation lambda when present', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new cr.Provider(stack, 'MyProvider', {
            onEventHandler: new lambda.Function(stack, 'MyHandler', {
                code: lambda.Code.fromAsset(path.join(__dirname, './integration-test-fixtures/s3-file-handler')),
                handler: 'index.onEvent',
                runtime: lambda.Runtime.NODEJS_14_X,
            }),
            logRetention: logs.RetentionDays.ONE_WEEK,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
            LogGroupName: {
                'Fn::Join': [
                    '',
                    [
                        '/aws/lambda/',
                        {
                            Ref: 'MyProviderframeworkonEvent9AF5C387',
                        },
                    ],
                ],
            },
            RetentionInDays: 7,
        });
    });
    it('does not include the log rotation lambda otherwise', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new cr.Provider(stack, 'MyProvider', {
            onEventHandler: new lambda.Function(stack, 'MyHandler', {
                code: lambda.Code.fromAsset(path.join(__dirname, './integration-test-fixtures/s3-file-handler')),
                handler: 'index.onEvent',
                runtime: lambda.Runtime.NODEJS_14_X,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs('Custom::LogRetention', 0);
    });
});
describe('role', () => {
    it('uses custom role when present', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new cr.Provider(stack, 'MyProvider', {
            onEventHandler: new lambda.Function(stack, 'MyHandler', {
                code: lambda.Code.fromAsset(path.join(__dirname, './integration-test-fixtures/s3-file-handler')),
                handler: 'index.onEvent',
                runtime: lambda.Runtime.NODEJS_14_X,
            }),
            role: new iam.Role(stack, 'MyRole', {
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
                managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Role: {
                'Fn::GetAtt': [
                    'MyRoleF48FFE04',
                    'Arn',
                ],
            },
        });
    });
    it('uses default role otherwise', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new cr.Provider(stack, 'MyProvider', {
            onEventHandler: new lambda.Function(stack, 'MyHandler', {
                code: lambda.Code.fromAsset(path.join(__dirname, './integration-test-fixtures/s3-file-handler')),
                handler: 'index.onEvent',
                runtime: lambda.Runtime.NODEJS_14_X,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Role: {
                'Fn::GetAtt': [
                    'MyProviderframeworkonEventServiceRole8761E48D',
                    'Arn',
                ],
            },
        });
    });
});
describe('name', () => {
    it('uses custom name when present', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const providerFunctionName = 'test-name';
        // WHEN
        new cr.Provider(stack, 'MyProvider', {
            onEventHandler: new lambda.Function(stack, 'MyHandler', {
                code: lambda.Code.fromAsset(path.join(__dirname, './integration-test-fixtures/s3-file-handler')),
                handler: 'index.onEvent',
                runtime: lambda.Runtime.NODEJS_14_X,
            }),
            providerFunctionName,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            FunctionName: providerFunctionName,
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb3ZpZGVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0Isb0RBQStDO0FBQy9DLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsOENBQThDO0FBQzlDLDBDQUEwQztBQUMxQyx3Q0FBZ0Q7QUFDaEQsZ0NBQWdDO0FBQ2hDLDBEQUEwRDtBQUUxRCxJQUFJLENBQUMsd0RBQXdELEVBQUUsR0FBRyxFQUFFO0lBRWxFLFFBQVE7SUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBRTFCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEMsTUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBRTdFLE9BQU87SUFDUCxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtRQUNuQyxjQUFjLEVBQUUsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDcEQsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztZQUNuQyxPQUFPLEVBQUUsZUFBZTtZQUN4QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1NBQ3BDLENBQUM7UUFDRixpQkFBaUIsRUFBRSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUMxRCxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1lBQ25DLE9BQU8sRUFBRSxrQkFBa0I7WUFDM0IsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFP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XG5pbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgbG9ncyBmcm9tICdAYXdzLWNkay9hd3MtbG9ncyc7XG5pbXBvcnQgeyBEdXJhdGlvbiwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNyIGZyb20gJy4uLy4uL2xpYic7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uLy4uL2xpYi9wcm92aWRlci1mcmFtZXdvcmsvdXRpbCc7XG5cbnRlc3QoJ3NlY3VyaXR5IGdyb3VwcyBhcmUgYXBwbGllZCB0byBhbGwgZnJhbWV3b3JrIGZ1bmN0aW9ucycsICgpID0+IHtcblxuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJyk7XG4gIGNvbnN0IHNlY3VyaXR5R3JvdXAgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdTZWN1cml0eUdyb3VwJywgeyB2cGMgfSk7XG5cbiAgLy8gV0hFTlxuICBuZXcgY3IuUHJvdmlkZXIoc3RhY2ssICdNeVByb3ZpZGVyJywge1xuICAgIG9uRXZlbnRIYW5kbGVyOiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnT25FdmVudCcsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4Lm9uRXZlbnQnLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSksXG4gICAgaXNDb21wbGV0ZUhhbmRsZXI6IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdJc0NvbXBsZXRlJywge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaXNDb21wbGV0ZScsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KSxcbiAgICB2cGM6IHZwYyxcbiAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MgfSxcbiAgICBzZWN1cml0eUdyb3VwczogW3NlY3VyaXR5R3JvdXBdLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgIEhhbmRsZXI6ICdmcmFtZXdvcmsub25FdmVudCcsXG4gICAgVnBjQ29uZmlnOiB7XG4gICAgICBTZWN1cml0eUdyb3VwSWRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdTZWN1cml0eUdyb3VwREQyNjM2MjEnLFxuICAgICAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgSGFuZGxlcjogJ2ZyYW1ld29yay5pc0NvbXBsZXRlJyxcbiAgICBWcGNDb25maWc6IHtcbiAgICAgIFNlY3VyaXR5R3JvdXBJZHM6IFtcbiAgICAgICAge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ1NlY3VyaXR5R3JvdXBERDI2MzYyMScsXG4gICAgICAgICAgICAnR3JvdXBJZCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICBIYW5kbGVyOiAnZnJhbWV3b3JrLm9uVGltZW91dCcsXG4gICAgVnBjQ29uZmlnOiB7XG4gICAgICBTZWN1cml0eUdyb3VwSWRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdTZWN1cml0eUdyb3VwREQyNjM2MjEnLFxuICAgICAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xuXG59KTtcblxudGVzdCgndnBjIGlzIGFwcGxpZWQgdG8gYWxsIGZyYW1ld29yayBmdW5jdGlvbnMnLCAoKSA9PiB7XG5cbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IGNyLlByb3ZpZGVyKHN0YWNrLCAnTXlQcm92aWRlcicsIHtcbiAgICBvbkV2ZW50SGFuZGxlcjogbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ09uRXZlbnQnLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdmb28nKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5vbkV2ZW50JyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIH0pLFxuICAgIGlzQ29tcGxldGVIYW5kbGVyOiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnSXNDb21wbGV0ZScsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmlzQ29tcGxldGUnLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSksXG4gICAgdnBjOiB2cGMsXG4gICAgdnBjU3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTIH0sXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgSGFuZGxlcjogJ2ZyYW1ld29yay5vbkV2ZW50JyxcbiAgICBWcGNDb25maWc6IHtcbiAgICAgIFN1Ym5ldElkczogW1xuICAgICAgICB7IFJlZjogJ1ZwY1ByaXZhdGVTdWJuZXQxU3VibmV0NTM2Qjk5N0EnIH0sXG4gICAgICAgIHsgUmVmOiAnVnBjUHJpdmF0ZVN1Ym5ldDJTdWJuZXQzNzg4QUFBMScgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICBIYW5kbGVyOiAnZnJhbWV3b3JrLmlzQ29tcGxldGUnLFxuICAgIFZwY0NvbmZpZzoge1xuICAgICAgU3VibmV0SWRzOiBbXG4gICAgICAgIHsgUmVmOiAnVnBjUHJpdmF0ZVN1Ym5ldDFTdWJuZXQ1MzZCOTk3QScgfSxcbiAgICAgICAgeyBSZWY6ICdWcGNQcml2YXRlU3VibmV0MlN1Ym5ldDM3ODhBQUExJyB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgIEhhbmRsZXI6ICdmcmFtZXdvcmsub25UaW1lb3V0JyxcbiAgICBWcGNDb25maWc6IHtcbiAgICAgIFN1Ym5ldElkczogW1xuICAgICAgICB7IFJlZjogJ1ZwY1ByaXZhdGVTdWJuZXQxU3VibmV0NTM2Qjk5N0EnIH0sXG4gICAgICAgIHsgUmVmOiAnVnBjUHJpdmF0ZVN1Ym5ldDJTdWJuZXQzNzg4QUFBMScgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSk7XG5cbn0pO1xuXG50ZXN0KCdtaW5pbWFsIHNldHVwJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IGNyLlByb3ZpZGVyKHN0YWNrLCAnTXlQcm92aWRlcicsIHtcbiAgICBvbkV2ZW50SGFuZGxlcjogbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015SGFuZGxlcicsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9pbnRlZ3JhdGlvbi10ZXN0LWZpeHR1cmVzL3MzLWZpbGUtaGFuZGxlcicpKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5vbkV2ZW50JyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIH0pLFxuICB9KTtcblxuICAvLyBUSEVOXG5cbiAgLy8gZnJhbWV3b3JrIFwib25FdmVudFwiIGhhbmRsZXJcbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICBIYW5kbGVyOiAnZnJhbWV3b3JrLm9uRXZlbnQnLFxuICAgIEVudmlyb25tZW50OiB7IFZhcmlhYmxlczogeyBVU0VSX09OX0VWRU5UX0ZVTkNUSU9OX0FSTjogeyAnRm46OkdldEF0dCc6IFsnTXlIYW5kbGVyNkI3NEQzMTInLCAnQXJuJ10gfSB9IH0sXG4gICAgVGltZW91dDogOTAwLFxuICB9KTtcblxuICAvLyB1c2VyIFwib25FdmVudFwiIGhhbmRsZXJcbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICBIYW5kbGVyOiAnaW5kZXgub25FdmVudCcsXG4gIH0pO1xuXG4gIC8vIG5vIGZyYW1ld29yayBcImlzIGNvbXBsZXRlXCIgaGFuZGxlciBvciBzdGF0ZSBtYWNoaW5lXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OlN0ZXBGdW5jdGlvbnM6OlN0YXRlTWFjaGluZScsIDApO1xuICBleHBlY3QoVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5maW5kUmVzb3VyY2VzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgSGFuZGxlcjogJ2ZyYW1ld29yay5pc0NvbXBsZXRlJyxcbiAgICBUaW1lb3V0OiA5MDAsXG4gIH0pKS50b0VxdWFsKHt9KTtcbn0pO1xuXG50ZXN0KCdpZiBpc0NvbXBsZXRlIGlzIHNwZWNpZmllZCwgdGhlIGlzQ29tcGxldGUgZnJhbWV3b3JrIGhhbmRsZXIgaXMgYWxzbyBpbmNsdWRlZCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgY29uc3QgaGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUhhbmRsZXInLCB7XG4gICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICcuL2ludGVncmF0aW9uLXRlc3QtZml4dHVyZXMvczMtZmlsZS1oYW5kbGVyJykpLFxuICAgIGhhbmRsZXI6ICdpbmRleC5vbkV2ZW50JyxcbiAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBuZXcgY3IuUHJvdmlkZXIoc3RhY2ssICdNeVByb3ZpZGVyJywge1xuICAgIG9uRXZlbnRIYW5kbGVyOiBoYW5kbGVyLFxuICAgIGlzQ29tcGxldGVIYW5kbGVyOiBoYW5kbGVyLFxuICB9KTtcblxuICAvLyBUSEVOXG5cbiAgLy8gZnJhbWV3b3JrIFwib25FdmVudFwiIGhhbmRsZXJcbiAgY29uc3QgZXhwZWN0ZWRFbnYgPSB7XG4gICAgVmFyaWFibGVzOiB7XG4gICAgICBVU0VSX09OX0VWRU5UX0ZVTkNUSU9OX0FSTjogeyAnRm46OkdldEF0dCc6IFsnTXlIYW5kbGVyNkI3NEQzMTInLCAnQXJuJ10gfSxcbiAgICAgIFVTRVJfSVNfQ09NUExFVEVfRlVOQ1RJT05fQVJOOiB7ICdGbjo6R2V0QXR0JzogWydNeUhhbmRsZXI2Qjc0RDMxMicsICdBcm4nXSB9LFxuICAgIH0sXG4gIH07XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICBIYW5kbGVyOiAnZnJhbWV3b3JrLm9uRXZlbnQnLFxuICAgIFRpbWVvdXQ6IDkwMCxcbiAgICBFbnZpcm9ubWVudDoge1xuICAgICAgVmFyaWFibGVzOiB7XG4gICAgICAgIC4uLmV4cGVjdGVkRW52LlZhcmlhYmxlcyxcbiAgICAgICAgV0FJVEVSX1NUQVRFX01BQ0hJTkVfQVJOOiB7IFJlZjogJ015UHJvdmlkZXJ3YWl0ZXJzdGF0ZW1hY2hpbmVDMUZCQjlGOScgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICBIYW5kbGVyOiAnZnJhbWV3b3JrLmlzQ29tcGxldGUnLFxuICAgIFRpbWVvdXQ6IDkwMCxcbiAgICBFbnZpcm9ubWVudDogZXhwZWN0ZWRFbnYsXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgSGFuZGxlcjogJ2ZyYW1ld29yay5vblRpbWVvdXQnLFxuICAgIFRpbWVvdXQ6IDkwMCxcbiAgICBFbnZpcm9ubWVudDogZXhwZWN0ZWRFbnYsXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlN0ZXBGdW5jdGlvbnM6OlN0YXRlTWFjaGluZScsIHtcbiAgICBEZWZpbml0aW9uU3RyaW5nOiB7XG4gICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICcnLFxuICAgICAgICBbXG4gICAgICAgICAgJ3tcIlN0YXJ0QXRcIjpcImZyYW1ld29yay1pc0NvbXBsZXRlLXRhc2tcIixcIlN0YXRlc1wiOntcImZyYW1ld29yay1pc0NvbXBsZXRlLXRhc2tcIjp7XCJFbmRcIjp0cnVlLFwiUmV0cnlcIjpbe1wiRXJyb3JFcXVhbHNcIjpbXCJTdGF0ZXMuQUxMXCJdLFwiSW50ZXJ2YWxTZWNvbmRzXCI6NSxcIk1heEF0dGVtcHRzXCI6MzYwLFwiQmFja29mZlJhdGVcIjoxfV0sXCJDYXRjaFwiOlt7XCJFcnJvckVxdWFsc1wiOltcIlN0YXRlcy5BTExcIl0sXCJOZXh0XCI6XCJmcmFtZXdvcmstb25UaW1lb3V0LXRhc2tcIn1dLFwiVHlwZVwiOlwiVGFza1wiLFwiUmVzb3VyY2VcIjpcIicsXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeVByb3ZpZGVyZnJhbWV3b3JraXNDb21wbGV0ZTM2NDE5MEUyJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1wifSxcImZyYW1ld29yay1vblRpbWVvdXQtdGFza1wiOntcIkVuZFwiOnRydWUsXCJUeXBlXCI6XCJUYXNrXCIsXCJSZXNvdXJjZVwiOlwiJyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015UHJvdmlkZXJmcmFtZXdvcmtvblRpbWVvdXREOUQ5NjU4OCcsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdcIn19fScsXG4gICAgICAgIF0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2ZhaWxzIGlmIFwicXVlcnlJbnRlcnZhbFwiIGFuZC9vciBcInRvdGFsVGltZW91dFwiIGFyZSBzZXQgd2l0aG91dCBcImlzQ29tcGxldGVIYW5kbGVyXCInLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IGhhbmRsZXIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlIYW5kbGVyJywge1xuICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9pbnRlZ3JhdGlvbi10ZXN0LWZpeHR1cmVzL3MzLWZpbGUtaGFuZGxlcicpKSxcbiAgICBoYW5kbGVyOiAnaW5kZXgub25FdmVudCcsXG4gICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IG5ldyBjci5Qcm92aWRlcihzdGFjaywgJ3Byb3ZpZGVyMScsIHtcbiAgICBvbkV2ZW50SGFuZGxlcjogaGFuZGxlcixcbiAgICBxdWVyeUludGVydmFsOiBEdXJhdGlvbi5zZWNvbmRzKDEwKSxcbiAgfSkpLnRvVGhyb3coL1xcXCJxdWVyeUludGVydmFsXFxcIiBhbmQgXFxcInRvdGFsVGltZW91dFxcXCIgY2FuIG9ubHkgYmUgY29uZmlndXJlZCBpZiBcXFwiaXNDb21wbGV0ZUhhbmRsZXJcXFwiIGlzIHNwZWNpZmllZC4gT3RoZXJ3aXNlLCB0aGV5IGhhdmUgbm8gbWVhbmluZy8pO1xuXG4gIGV4cGVjdCgoKSA9PiBuZXcgY3IuUHJvdmlkZXIoc3RhY2ssICdwcm92aWRlcjInLCB7XG4gICAgb25FdmVudEhhbmRsZXI6IGhhbmRsZXIsXG4gICAgdG90YWxUaW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDEwMCksXG4gIH0pKS50b1Rocm93KC9cXFwicXVlcnlJbnRlcnZhbFxcXCIgYW5kIFxcXCJ0b3RhbFRpbWVvdXRcXFwiIGNhbiBvbmx5IGJlIGNvbmZpZ3VyZWQgaWYgXFxcImlzQ29tcGxldGVIYW5kbGVyXFxcIiBpcyBzcGVjaWZpZWQuIE90aGVyd2lzZSwgdGhleSBoYXZlIG5vIG1lYW5pbmcvKTtcbn0pO1xuXG5kZXNjcmliZSgncmV0cnkgcG9saWN5JywgKCkgPT4ge1xuICBpdCgnZGVmYXVsdCBpcyAzMCBtaW51dGVzIHRpbWVvdXQgaW4gNSBzZWNvbmQgaW50ZXJ2YWxzJywgKCkgPT4ge1xuICAgIGNvbnN0IHBvbGljeSA9IHV0aWwuY2FsY3VsYXRlUmV0cnlQb2xpY3koKTtcbiAgICBleHBlY3QocG9saWN5LmJhY2tvZmZSYXRlKS50b1N0cmljdEVxdWFsKDEpO1xuICAgIGV4cGVjdChwb2xpY3kuaW50ZXJ2YWwgJiYgcG9saWN5LmludGVydmFsLnRvU2Vjb25kcygpKS50b1N0cmljdEVxdWFsKDUpO1xuICAgIGV4cGVjdChwb2xpY3kubWF4QXR0ZW1wdHMpLnRvU3RyaWN0RXF1YWwoMzYwKTtcbiAgfSk7XG5cbiAgaXQoJ2lmIHRvdGFsIHRpbWVvdXQgYW5kIHF1ZXJ5IGludGVydmFsIGFyZSB0aGUgc2FtZSB3ZSB3aWxsIGhhdmUgb25lIGF0dGVtcHQnLCAoKSA9PiB7XG4gICAgY29uc3QgcG9saWN5ID0gdXRpbC5jYWxjdWxhdGVSZXRyeVBvbGljeSh7XG4gICAgICB0b3RhbFRpbWVvdXQ6IER1cmF0aW9uLm1pbnV0ZXMoNSksXG4gICAgICBxdWVyeUludGVydmFsOiBEdXJhdGlvbi5taW51dGVzKDUpLFxuICAgIH0pO1xuICAgIGV4cGVjdChwb2xpY3kubWF4QXR0ZW1wdHMpLnRvU3RyaWN0RXF1YWwoMSk7XG4gIH0pO1xuXG4gIGl0KCdmYWlscyBpZiB0b3RhbCB0aW1lb3V0IGNhbm5vdCBiZSBpbnRlZ3JhbGx5IGRpdmlkZWQnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHV0aWwuY2FsY3VsYXRlUmV0cnlQb2xpY3koe1xuICAgICAgdG90YWxUaW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDEwMCksXG4gICAgICBxdWVyeUludGVydmFsOiBEdXJhdGlvbi5zZWNvbmRzKDc1KSxcbiAgICB9KSkudG9UaHJvdygvQ2Fubm90IGRldGVybWluZSByZXRyeSBjb3VudCBzaW5jZSB0b3RhbFRpbWVvdXQ9MTAwcyBpcyBub3QgaW50ZWdyYWxseSBkaXZpZGFibGUgYnkgcXVlcnlJbnRlcnZhbD03NXMvKTtcbiAgfSk7XG5cbiAgaXQoJ2ZhaWxzIGlmIGludGVydmFsID4gdGltZW91dCcsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gdXRpbC5jYWxjdWxhdGVSZXRyeVBvbGljeSh7XG4gICAgICB0b3RhbFRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoNSksXG4gICAgICBxdWVyeUludGVydmFsOiBEdXJhdGlvbi5zZWNvbmRzKDEwKSxcbiAgICB9KSkudG9UaHJvdygvQ2Fubm90IGRldGVybWluZSByZXRyeSBjb3VudCBzaW5jZSB0b3RhbFRpbWVvdXQ9NXMgaXMgbm90IGludGVncmFsbHkgZGl2aWRhYmxlIGJ5IHF1ZXJ5SW50ZXJ2YWw9MTBzLyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdsb2cgcmV0ZW50aW9uJywgKCkgPT4ge1xuICBpdCgnaW5jbHVkZXMgYSBsb2cgcm90YXRpb24gbGFtYmRhIHdoZW4gcHJlc2VudCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGNyLlByb3ZpZGVyKHN0YWNrLCAnTXlQcm92aWRlcicsIHtcbiAgICAgIG9uRXZlbnRIYW5kbGVyOiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlIYW5kbGVyJywge1xuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJy4vaW50ZWdyYXRpb24tdGVzdC1maXh0dXJlcy9zMy1maWxlLWhhbmRsZXInKSksXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5vbkV2ZW50JyxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICB9KSxcbiAgICAgIGxvZ1JldGVudGlvbjogbG9ncy5SZXRlbnRpb25EYXlzLk9ORV9XRUVLLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkxvZ1JldGVudGlvbicsIHtcbiAgICAgIExvZ0dyb3VwTmFtZToge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJy9hd3MvbGFtYmRhLycsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ015UHJvdmlkZXJmcmFtZXdvcmtvbkV2ZW50OUFGNUMzODcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIFJldGVudGlvbkluRGF5czogNyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ2RvZXMgbm90IGluY2x1ZGUgdGhlIGxvZyByb3RhdGlvbiBsYW1iZGEgb3RoZXJ3aXNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgY3IuUHJvdmlkZXIoc3RhY2ssICdNeVByb3ZpZGVyJywge1xuICAgICAgb25FdmVudEhhbmRsZXI6IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUhhbmRsZXInLCB7XG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9pbnRlZ3JhdGlvbi10ZXN0LWZpeHR1cmVzL3MzLWZpbGUtaGFuZGxlcicpKSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4Lm9uRXZlbnQnLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdDdXN0b206OkxvZ1JldGVudGlvbicsIDApO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgncm9sZScsICgpID0+IHtcbiAgaXQoJ3VzZXMgY3VzdG9tIHJvbGUgd2hlbiBwcmVzZW50JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgY3IuUHJvdmlkZXIoc3RhY2ssICdNeVByb3ZpZGVyJywge1xuICAgICAgb25FdmVudEhhbmRsZXI6IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUhhbmRsZXInLCB7XG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9pbnRlZ3JhdGlvbi10ZXN0LWZpeHR1cmVzL3MzLWZpbGUtaGFuZGxlcicpKSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4Lm9uRXZlbnQnLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIH0pLFxuICAgICAgcm9sZTogbmV3IGlhbS5Sb2xlKHN0YWNrLCAnTXlSb2xlJywge1xuICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbGFtYmRhLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgICAgbWFuYWdlZFBvbGljaWVzOiBbaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdzZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJyldLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgIFJvbGU6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ015Um9sZUY0OEZGRTA0JyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCd1c2VzIGRlZmF1bHQgcm9sZSBvdGhlcndpc2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBjci5Qcm92aWRlcihzdGFjaywgJ015UHJvdmlkZXInLCB7XG4gICAgICBvbkV2ZW50SGFuZGxlcjogbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015SGFuZGxlcicsIHtcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICcuL2ludGVncmF0aW9uLXRlc3QtZml4dHVyZXMvczMtZmlsZS1oYW5kbGVyJykpLFxuICAgICAgICBoYW5kbGVyOiAnaW5kZXgub25FdmVudCcsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgIFJvbGU6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ015UHJvdmlkZXJmcmFtZXdvcmtvbkV2ZW50U2VydmljZVJvbGU4NzYxRTQ4RCcsXG4gICAgICAgICAgJ0FybicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnbmFtZScsICgpID0+IHtcbiAgaXQoJ3VzZXMgY3VzdG9tIG5hbWUgd2hlbiBwcmVzZW50JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwcm92aWRlckZ1bmN0aW9uTmFtZSA9ICd0ZXN0LW5hbWUnO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBjci5Qcm92aWRlcihzdGFjaywgJ015UHJvdmlkZXInLCB7XG4gICAgICBvbkV2ZW50SGFuZGxlcjogbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015SGFuZGxlcicsIHtcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICcuL2ludGVncmF0aW9uLXRlc3QtZml4dHVyZXMvczMtZmlsZS1oYW5kbGVyJykpLFxuICAgICAgICBoYW5kbGVyOiAnaW5kZXgub25FdmVudCcsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgfSksXG4gICAgICBwcm92aWRlckZ1bmN0aW9uTmFtZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgRnVuY3Rpb25OYW1lOiBwcm92aWRlckZ1bmN0aW9uTmFtZSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==