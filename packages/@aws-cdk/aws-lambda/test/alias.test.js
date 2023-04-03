"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const appscaling = require("@aws-cdk/aws-applicationautoscaling");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const core_1 = require("@aws-cdk/core");
const lambda = require("../lib");
describe('alias', () => {
    cdk_build_tools_1.testDeprecated('version and aliases', () => {
        const stack = new core_1.Stack();
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const version = fn.addVersion('1');
        new lambda.Alias(stack, 'Alias', {
            aliasName: 'prod',
            version,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Version', {
            FunctionName: { Ref: 'MyLambdaCCE802FB' },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Alias', {
            FunctionName: { Ref: 'MyLambdaCCE802FB' },
            FunctionVersion: stack.resolve(version.version),
            Name: 'prod',
        });
    });
    test('can create an alias to $LATEST', () => {
        const stack = new core_1.Stack();
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        new lambda.Alias(stack, 'Alias', {
            aliasName: 'latest',
            version: fn.latestVersion,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Alias', {
            FunctionName: { Ref: 'MyLambdaCCE802FB' },
            FunctionVersion: '$LATEST',
            Name: 'latest',
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Lambda::Version', 0);
    });
    cdk_build_tools_1.testDeprecated('can use newVersion to create a new Version', () => {
        const stack = new core_1.Stack();
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const version = fn.addVersion('NewVersion');
        new lambda.Alias(stack, 'Alias', {
            aliasName: 'prod',
            version,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Version', {
            FunctionName: { Ref: 'MyLambdaCCE802FB' },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Alias', {
            FunctionName: { Ref: 'MyLambdaCCE802FB' },
            Name: 'prod',
        });
    });
    cdk_build_tools_1.testDeprecated('can add additional versions to alias', () => {
        const stack = new core_1.Stack();
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const version1 = fn.addVersion('1');
        const version2 = fn.addVersion('2');
        new lambda.Alias(stack, 'Alias', {
            aliasName: 'prod',
            version: version1,
            additionalVersions: [{ version: version2, weight: 0.1 }],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Alias', {
            FunctionVersion: stack.resolve(version1.version),
            RoutingConfig: {
                AdditionalVersionWeights: [
                    {
                        FunctionVersion: stack.resolve(version2.version),
                        FunctionWeight: 0.1,
                    },
                ],
            },
        });
    });
    cdk_build_tools_1.testDeprecated('version and aliases with provisioned execution', () => {
        const stack = new core_1.Stack();
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const pce = 5;
        const version = fn.addVersion('1', undefined, 'testing', pce);
        new lambda.Alias(stack, 'Alias', {
            aliasName: 'prod',
            version,
            provisionedConcurrentExecutions: pce,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Version', {
            ProvisionedConcurrencyConfig: {
                ProvisionedConcurrentExecutions: 5,
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Alias', {
            FunctionVersion: stack.resolve(version.version),
            Name: 'prod',
            ProvisionedConcurrencyConfig: {
                ProvisionedConcurrentExecutions: 5,
            },
        });
    });
    test('sanity checks on version weights', () => {
        const stack = new core_1.Stack();
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const version = fn.currentVersion;
        // WHEN: Individual weight too high
        expect(() => {
            new lambda.Alias(stack, 'Alias1', {
                aliasName: 'prod',
                version,
                additionalVersions: [{ version, weight: 5 }],
            });
        }).toThrow();
        // WHEN: Sum too high
        expect(() => {
            new lambda.Alias(stack, 'Alias2', {
                aliasName: 'prod',
                version,
                additionalVersions: [{ version, weight: 0.5 }, { version, weight: 0.6 }],
            });
        }).toThrow();
    });
    test('metric adds Resource: aliasArn to dimensions', () => {
        const stack = new core_1.Stack();
        // GIVEN
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const version = fn.currentVersion;
        const alias = new lambda.Alias(stack, 'Alias', { aliasName: 'prod', version });
        // WHEN
        new cloudwatch.Alarm(stack, 'Alarm', {
            metric: alias.metric('Test'),
            alarmName: 'Test',
            threshold: 1,
            evaluationPeriods: 1,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
            Dimensions: [{
                    Name: 'FunctionName',
                    Value: {
                        Ref: 'MyLambdaCCE802FB',
                    },
                }, {
                    Name: 'Resource',
                    Value: {
                        'Fn::Join': [
                            '',
                            [
                                { Ref: 'MyLambdaCCE802FB' },
                                ':prod',
                            ],
                        ],
                    },
                }],
        });
    });
    cdk_build_tools_1.testDeprecated('sanity checks provisionedConcurrentExecutions', () => {
        const stack = new core_1.Stack();
        const pce = -1;
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        // WHEN: Alias provisionedConcurrencyConfig less than 0
        expect(() => {
            new lambda.Alias(stack, 'Alias1', {
                aliasName: 'prod',
                version: fn.currentVersion,
                provisionedConcurrentExecutions: pce,
            });
        }).toThrow();
        // WHEN: Version provisionedConcurrencyConfig less than 0
        expect(() => {
            new lambda.Version(stack, 'Version 1', {
                lambda: fn,
                codeSha256: undefined,
                description: undefined,
                provisionedConcurrentExecutions: pce,
            });
        }).toThrow();
        // WHEN: Adding a version provisionedConcurrencyConfig less than 0
        expect(() => {
            fn.addVersion('1', undefined, undefined, pce);
        }).toThrow();
    });
    test('alias exposes real Lambdas role', () => {
        const stack = new core_1.Stack();
        // GIVEN
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const version = fn.currentVersion;
        const alias = new lambda.Alias(stack, 'Alias', { aliasName: 'prod', version });
        // THEN
        expect(alias.role).toEqual(fn.role);
    });
    test('functionName is derived from the aliasArn so that dependencies are sound', () => {
        const stack = new core_1.Stack();
        // GIVEN
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const version = fn.currentVersion;
        const alias = new lambda.Alias(stack, 'Alias', { aliasName: 'prod', version });
        // WHEN
        expect(stack.resolve(alias.functionName)).toEqual({
            'Fn::Join': [
                '',
                [
                    {
                        'Fn::Select': [
                            6,
                            {
                                'Fn::Split': [
                                    ':',
                                    {
                                        Ref: 'Alias325C5727',
                                    },
                                ],
                            },
                        ],
                    },
                    ':prod',
                ],
            ],
        });
    });
    test('with event invoke config', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const fn = new lambda.Function(stack, 'fn', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        // WHEN
        new lambda.Alias(stack, 'Alias', {
            aliasName: 'prod',
            version: fn.currentVersion,
            onSuccess: {
                bind: () => ({
                    destination: 'on-success-arn',
                }),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
            FunctionName: {
                Ref: 'fn5FF616E3',
            },
            Qualifier: {
                'Fn::Select': [
                    7,
                    {
                        'Fn::Split': [
                            ':',
                            {
                                Ref: 'Alias325C5727',
                            },
                        ],
                    },
                ],
            },
            DestinationConfig: {
                OnSuccess: {
                    Destination: 'on-success-arn',
                },
            },
        });
    });
    test('throws when calling configureAsyncInvoke on already configured alias', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const fn = new lambda.Function(stack, 'fn', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const alias = new lambda.Alias(stack, 'Alias', {
            aliasName: 'prod',
            version: fn.currentVersion,
            onSuccess: {
                bind: () => ({
                    destination: 'on-success-arn',
                }),
            },
        });
        // THEN
        expect(() => alias.configureAsyncInvoke({ retryAttempts: 0 })).toThrow(/An EventInvokeConfig has already been configured/);
    });
    test('event invoke config on imported alias', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const fn = lambda.Version.fromVersionArn(stack, 'Fn', 'arn:aws:lambda:region:account-id:function:function-name:version');
        const alias = lambda.Alias.fromAliasAttributes(stack, 'Alias', { aliasName: 'alias-name', aliasVersion: fn });
        // WHEN
        alias.configureAsyncInvoke({
            retryAttempts: 1,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
            FunctionName: 'function-name',
            Qualifier: 'alias-name',
            MaximumRetryAttempts: 1,
        });
    });
    cdk_build_tools_1.testDeprecated('can enable AutoScaling on aliases', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const alias = new lambda.Alias(stack, 'Alias', {
            aliasName: 'prod',
            version: fn.currentVersion,
        });
        // WHEN
        alias.addAutoScaling({ maxCapacity: 5 });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalableTarget', {
            MinCapacity: 1,
            MaxCapacity: 5,
            ResourceId: assertions_1.Match.objectLike({
                'Fn::Join': assertions_1.Match.arrayWith([assertions_1.Match.arrayWith([
                        'function:',
                        assertions_1.Match.objectLike({
                            'Fn::Select': assertions_1.Match.arrayWith([
                                {
                                    'Fn::Split': assertions_1.Match.arrayWith([
                                        { Ref: 'Alias325C5727' },
                                    ]),
                                },
                            ]),
                        }),
                        ':prod',
                    ])]),
            }),
        });
    });
    test('can enable AutoScaling on aliases with Provisioned Concurrency set', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const alias = new lambda.Alias(stack, 'Alias', {
            aliasName: 'prod',
            version: fn.currentVersion,
            provisionedConcurrentExecutions: 10,
        });
        // WHEN
        alias.addAutoScaling({ maxCapacity: 5 });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalableTarget', {
            MinCapacity: 1,
            MaxCapacity: 5,
            ResourceId: assertions_1.Match.objectLike({
                'Fn::Join': assertions_1.Match.arrayWith([assertions_1.Match.arrayWith([
                        'function:',
                        assertions_1.Match.objectLike({
                            'Fn::Select': assertions_1.Match.arrayWith([
                                {
                                    'Fn::Split': assertions_1.Match.arrayWith([
                                        { Ref: 'Alias325C5727' },
                                    ]),
                                },
                            ]),
                        }),
                        ':prod',
                    ])]),
            }),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Alias', {
            ProvisionedConcurrencyConfig: {
                ProvisionedConcurrentExecutions: 10,
            },
        });
    });
    test('validation for utilizationTarget does not fail when using Tokens', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const alias = new lambda.Alias(stack, 'Alias', {
            aliasName: 'prod',
            version: fn.currentVersion,
            provisionedConcurrentExecutions: 10,
        });
        // WHEN
        const target = alias.addAutoScaling({ maxCapacity: 5 });
        target.scaleOnUtilization({ utilizationTarget: core_1.Lazy.number({ produce: () => 0.95 }) });
        // THEN: no exception
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
            PolicyType: 'TargetTrackingScaling',
            TargetTrackingScalingPolicyConfiguration: {
                PredefinedMetricSpecification: { PredefinedMetricType: 'LambdaProvisionedConcurrencyUtilization' },
                TargetValue: 0.95,
            },
        });
    });
    test('cannot enable AutoScaling twice on same property', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const alias = new lambda.Alias(stack, 'Alias', {
            aliasName: 'prod',
            version: fn.currentVersion,
        });
        // WHEN
        alias.addAutoScaling({ maxCapacity: 5 });
        // THEN
        expect(() => alias.addAutoScaling({ maxCapacity: 8 })).toThrow(/AutoScaling already enabled for this alias/);
    });
    test('error when specifying invalid utilization value when AutoScaling on utilization', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const alias = new lambda.Alias(stack, 'Alias', {
            aliasName: 'prod',
            version: fn.currentVersion,
        });
        // WHEN
        const target = alias.addAutoScaling({ maxCapacity: 5 });
        // THEN
        expect(() => target.scaleOnUtilization({ utilizationTarget: 0.95 })).toThrow(/Utilization Target should be between 0.1 and 0.9. Found 0.95/);
    });
    test('can autoscale on a schedule', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const alias = new lambda.Alias(stack, 'Alias', {
            aliasName: 'prod',
            version: fn.currentVersion,
        });
        // WHEN
        const target = alias.addAutoScaling({ maxCapacity: 5 });
        target.scaleOnSchedule('Scheduling', {
            schedule: appscaling.Schedule.cron({}),
            maxCapacity: 10,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalableTarget', {
            ScheduledActions: [
                {
                    ScalableTargetAction: { MaxCapacity: 10 },
                    Schedule: 'cron(* * * * ? *)',
                    ScheduledActionName: 'Scheduling',
                },
            ],
        });
    });
    test('scheduled scaling shows warning when minute is not defined in cron', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const alias = new lambda.Alias(stack, 'Alias', {
            aliasName: 'prod',
            version: fn.currentVersion,
        });
        // WHEN
        const target = alias.addAutoScaling({ maxCapacity: 5 });
        target.scaleOnSchedule('Scheduling', {
            schedule: appscaling.Schedule.cron({}),
            maxCapacity: 10,
        });
        // THEN
        assertions_1.Annotations.fromStack(stack).hasWarning('/Default/Alias/AliasScaling/Target', "cron: If you don't pass 'minute', by default the event runs every minute. Pass 'minute: '*'' if that's what you intend, or 'minute: 0' to run once per hour instead.");
    });
    test('scheduled scaling shows no warning when minute is * in cron', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const alias = new lambda.Alias(stack, 'Alias', {
            aliasName: 'prod',
            version: fn.currentVersion,
        });
        // WHEN
        const target = alias.addAutoScaling({ maxCapacity: 5 });
        target.scaleOnSchedule('Scheduling', {
            schedule: appscaling.Schedule.cron({ minute: '*' }),
            maxCapacity: 10,
        });
        // THEN
        const annotations = assertions_1.Annotations.fromStack(stack).findWarning('*', assertions_1.Match.anyValue());
        expect(annotations.length).toBe(0);
    });
    test('addFunctionUrl creates a function url', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const aliasName = 'prod';
        const alias = new lambda.Alias(stack, 'Alias', {
            aliasName,
            version: fn.currentVersion,
        });
        // WHEN
        alias.addFunctionUrl();
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Url', {
            AuthType: 'AWS_IAM',
            TargetFunctionArn: {
                'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'],
            },
            Qualifier: aliasName,
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxpYXMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFsaWFzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBbUU7QUFDbkUsa0VBQWtFO0FBQ2xFLHNEQUFzRDtBQUN0RCw4REFBMEQ7QUFDMUQsd0NBQTRDO0FBQzVDLGlDQUFpQztBQUVqQyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUNyQixnQ0FBYyxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtRQUN6QyxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBQzFCLE1BQU0sRUFBRSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQ2hELElBQUksRUFBRSxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO1lBQ3RDLE9BQU8sRUFBRSxhQUFhO1lBQ3RCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7U0FDcEMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVuQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtZQUMvQixTQUFTLEVBQUUsTUFBTTtZQUNqQixPQUFPO1NBQ1IsQ0FBQyxDQUFDO1FBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsc0JBQXNCLEVBQUU7WUFDdEUsWUFBWSxFQUFFLEVBQUUsR0FBRyxFQUFFLGtCQUFrQixFQUFFO1NBQzFDLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLG9CQUFvQixFQUFFO1lBQ3BFLFlBQVksRUFBRSxFQUFFLEdBQUcsRUFBRSxrQkFBa0IsRUFBRTtZQUN6QyxlQUFlLEVBQUUsS0FBSyxD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Q3RDLE9BQU8sRUFBRSxhQUFhO1lBQ3RCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7U0FDcEMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDO1FBQ3pCLE1BQU0sS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQzdDLFNBQVM7WUFDVCxPQUFPLEVBQUUsRUFBRSxDQUFDLGNBQWM7U0FDM0IsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUV2QixPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsa0JBQWtCLEVBQUU7WUFDbEUsUUFBUSxFQUFFLFNBQVM7WUFDbkIsaUJBQWlCLEVBQUU7Z0JBQ2pCLFlBQVksRUFBRSxDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQzthQUMxQztZQUNELFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbm5vdGF0aW9ucywgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBhcHBzY2FsaW5nIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBsaWNhdGlvbmF1dG9zY2FsaW5nJztcbmltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0IHsgTGF6eSwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnYWxpYXMnLCAoKSA9PiB7XG4gIHRlc3REZXByZWNhdGVkKCd2ZXJzaW9uIGFuZCBhbGlhc2VzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2hlbGxvKCknKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oZWxsbycsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHZlcnNpb24gPSBmbi5hZGRWZXJzaW9uKCcxJyk7XG5cbiAgICBuZXcgbGFtYmRhLkFsaWFzKHN0YWNrLCAnQWxpYXMnLCB7XG4gICAgICBhbGlhc05hbWU6ICdwcm9kJyxcbiAgICAgIHZlcnNpb24sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlZlcnNpb24nLCB7XG4gICAgICBGdW5jdGlvbk5hbWU6IHsgUmVmOiAnTXlMYW1iZGFDQ0U4MDJGQicgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6QWxpYXMnLCB7XG4gICAgICBGdW5jdGlvbk5hbWU6IHsgUmVmOiAnTXlMYW1iZGFDQ0U4MDJGQicgfSxcbiAgICAgIEZ1bmN0aW9uVmVyc2lvbjogc3RhY2sucmVzb2x2ZSh2ZXJzaW9uLnZlcnNpb24pLFxuICAgICAgTmFtZTogJ3Byb2QnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gY3JlYXRlIGFuIGFsaWFzIHRvICRMQVRFU1QnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBmbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnaGVsbG8oKScpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhlbGxvJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIH0pO1xuXG4gICAgbmV3IGxhbWJkYS5BbGlhcyhzdGFjaywgJ0FsaWFzJywge1xuICAgICAgYWxpYXNOYW1lOiAnbGF0ZXN0JyxcbiAgICAgIHZlcnNpb246IGZuLmxhdGVzdFZlcnNpb24sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkFsaWFzJywge1xuICAgICAgRnVuY3Rpb25OYW1lOiB7IFJlZjogJ015TGFtYmRhQ0NFODAyRkInIH0sXG4gICAgICBGdW5jdGlvblZlcnNpb246ICckTEFURVNUJyxcbiAgICAgIE5hbWU6ICdsYXRlc3QnLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkxhbWJkYTo6VmVyc2lvbicsIDApO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnY2FuIHVzZSBuZXdWZXJzaW9uIHRvIGNyZWF0ZSBhIG5ldyBWZXJzaW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2hlbGxvKCknKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oZWxsbycsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHZlcnNpb24gPSBmbi5hZGRWZXJzaW9uKCdOZXdWZXJzaW9uJyk7XG5cbiAgICBuZXcgbGFtYmRhLkFsaWFzKHN0YWNrLCAnQWxpYXMnLCB7XG4gICAgICBhbGlhc05hbWU6ICdwcm9kJyxcbiAgICAgIHZlcnNpb24sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlZlcnNpb24nLCB7XG4gICAgICBGdW5jdGlvbk5hbWU6IHsgUmVmOiAnTXlMYW1iZGFDQ0U4MDJGQicgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6QWxpYXMnLCB7XG4gICAgICBGdW5jdGlvbk5hbWU6IHsgUmVmOiAnTXlMYW1iZGFDQ0U4MDJGQicgfSxcbiAgICAgIE5hbWU6ICdwcm9kJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2NhbiBhZGQgYWRkaXRpb25hbCB2ZXJzaW9ucyB0byBhbGlhcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2hlbGxvKCknKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oZWxsbycsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHZlcnNpb24xID0gZm4uYWRkVmVyc2lvbignMScpO1xuICAgIGNvbnN0IHZlcnNpb24yID0gZm4uYWRkVmVyc2lvbignMicpO1xuXG4gICAgbmV3IGxhbWJkYS5BbGlhcyhzdGFjaywgJ0FsaWFzJywge1xuICAgICAgYWxpYXNOYW1lOiAncHJvZCcsXG4gICAgICB2ZXJzaW9uOiB2ZXJzaW9uMSxcbiAgICAgIGFkZGl0aW9uYWxWZXJzaW9uczogW3sgdmVyc2lvbjogdmVyc2lvbjIsIHdlaWdodDogMC4xIH1dLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpBbGlhcycsIHtcbiAgICAgIEZ1bmN0aW9uVmVyc2lvbjogc3RhY2sucmVzb2x2ZSh2ZXJzaW9uMS52ZXJzaW9uKSxcbiAgICAgIFJvdXRpbmdDb25maWc6IHtcbiAgICAgICAgQWRkaXRpb25hbFZlcnNpb25XZWlnaHRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgRnVuY3Rpb25WZXJzaW9uOiBzdGFjay5yZXNvbHZlKHZlcnNpb24yLnZlcnNpb24pLFxuICAgICAgICAgICAgRnVuY3Rpb25XZWlnaHQ6IDAuMSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ3ZlcnNpb24gYW5kIGFsaWFzZXMgd2l0aCBwcm92aXNpb25lZCBleGVjdXRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBmbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnaGVsbG8oKScpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhlbGxvJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcGNlID0gNTtcbiAgICBjb25zdCB2ZXJzaW9uID0gZm4uYWRkVmVyc2lvbignMScsIHVuZGVmaW5lZCwgJ3Rlc3RpbmcnLCBwY2UpO1xuXG4gICAgbmV3IGxhbWJkYS5BbGlhcyhzdGFjaywgJ0FsaWFzJywge1xuICAgICAgYWxpYXNOYW1lOiAncHJvZCcsXG4gICAgICB2ZXJzaW9uLFxuICAgICAgcHJvdmlzaW9uZWRDb25jdXJyZW50RXhlY3V0aW9uczogcGNlLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpWZXJzaW9uJywge1xuICAgICAgUHJvdmlzaW9uZWRDb25jdXJyZW5jeUNvbmZpZzoge1xuICAgICAgICBQcm92aXNpb25lZENvbmN1cnJlbnRFeGVjdXRpb25zOiA1LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6QWxpYXMnLCB7XG4gICAgICBGdW5jdGlvblZlcnNpb246IHN0YWNrLnJlc29sdmUodmVyc2lvbi52ZXJzaW9uKSxcbiAgICAgIE5hbWU6ICdwcm9kJyxcbiAgICAgIFByb3Zpc2lvbmVkQ29uY3VycmVuY3lDb25maWc6IHtcbiAgICAgICAgUHJvdmlzaW9uZWRDb25jdXJyZW50RXhlY3V0aW9uczogNSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Nhbml0eSBjaGVja3Mgb24gdmVyc2lvbiB3ZWlnaHRzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBmbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnaGVsbG8oKScpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhlbGxvJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdmVyc2lvbiA9IGZuLmN1cnJlbnRWZXJzaW9uO1xuXG4gICAgLy8gV0hFTjogSW5kaXZpZHVhbCB3ZWlnaHQgdG9vIGhpZ2hcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGxhbWJkYS5BbGlhcyhzdGFjaywgJ0FsaWFzMScsIHtcbiAgICAgICAgYWxpYXNOYW1lOiAncHJvZCcsXG4gICAgICAgIHZlcnNpb24sXG4gICAgICAgIGFkZGl0aW9uYWxWZXJzaW9uczogW3sgdmVyc2lvbiwgd2VpZ2h0OiA1IH1dLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygpO1xuXG4gICAgLy8gV0hFTjogU3VtIHRvbyBoaWdoXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBsYW1iZGEuQWxpYXMoc3RhY2ssICdBbGlhczInLCB7XG4gICAgICAgIGFsaWFzTmFtZTogJ3Byb2QnLFxuICAgICAgICB2ZXJzaW9uLFxuICAgICAgICBhZGRpdGlvbmFsVmVyc2lvbnM6IFt7IHZlcnNpb24sIHdlaWdodDogMC41IH0sIHsgdmVyc2lvbiwgd2VpZ2h0OiAwLjYgfV0sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ21ldHJpYyBhZGRzIFJlc291cmNlOiBhbGlhc0FybiB0byBkaW1lbnNpb25zJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdoZWxsbygpJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGVsbG8nLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG5cbiAgICBjb25zdCB2ZXJzaW9uID0gZm4uY3VycmVudFZlcnNpb247XG4gICAgY29uc3QgYWxpYXMgPSBuZXcgbGFtYmRhLkFsaWFzKHN0YWNrLCAnQWxpYXMnLCB7IGFsaWFzTmFtZTogJ3Byb2QnLCB2ZXJzaW9uIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBjbG91ZHdhdGNoLkFsYXJtKHN0YWNrLCAnQWxhcm0nLCB7XG4gICAgICBtZXRyaWM6IGFsaWFzLm1ldHJpYygnVGVzdCcpLFxuICAgICAgYWxhcm1OYW1lOiAnVGVzdCcsXG4gICAgICB0aHJlc2hvbGQ6IDEsXG4gICAgICBldmFsdWF0aW9uUGVyaW9kczogMSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZFdhdGNoOjpBbGFybScsIHtcbiAgICAgIERpbWVuc2lvbnM6IFt7XG4gICAgICAgIE5hbWU6ICdGdW5jdGlvbk5hbWUnLFxuICAgICAgICBWYWx1ZToge1xuICAgICAgICAgIFJlZjogJ015TGFtYmRhQ0NFODAyRkInLFxuICAgICAgICB9LFxuICAgICAgfSwge1xuICAgICAgICBOYW1lOiAnUmVzb3VyY2UnLFxuICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICB7IFJlZjogJ015TGFtYmRhQ0NFODAyRkInIH0sXG4gICAgICAgICAgICAgICc6cHJvZCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9XSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ3Nhbml0eSBjaGVja3MgcHJvdmlzaW9uZWRDb25jdXJyZW50RXhlY3V0aW9ucycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHBjZSA9IC0xO1xuXG4gICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2hlbGxvKCknKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oZWxsbycsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIC8vIFdIRU46IEFsaWFzIHByb3Zpc2lvbmVkQ29uY3VycmVuY3lDb25maWcgbGVzcyB0aGFuIDBcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGxhbWJkYS5BbGlhcyhzdGFjaywgJ0FsaWFzMScsIHtcbiAgICAgICAgYWxpYXNOYW1lOiAncHJvZCcsXG4gICAgICAgIHZlcnNpb246IGZuLmN1cnJlbnRWZXJzaW9uLFxuICAgICAgICBwcm92aXNpb25lZENvbmN1cnJlbnRFeGVjdXRpb25zOiBwY2UsXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KCk7XG5cbiAgICAvLyBXSEVOOiBWZXJzaW9uIHByb3Zpc2lvbmVkQ29uY3VycmVuY3lDb25maWcgbGVzcyB0aGFuIDBcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGxhbWJkYS5WZXJzaW9uKHN0YWNrLCAnVmVyc2lvbiAxJywge1xuICAgICAgICBsYW1iZGE6IGZuLFxuICAgICAgICBjb2RlU2hhMjU2OiB1bmRlZmluZWQsXG4gICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgIHByb3Zpc2lvbmVkQ29uY3VycmVudEV4ZWN1dGlvbnM6IHBjZSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coKTtcblxuICAgIC8vIFdIRU46IEFkZGluZyBhIHZlcnNpb24gcHJvdmlzaW9uZWRDb25jdXJyZW5jeUNvbmZpZyBsZXNzIHRoYW4gMFxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBmbi5hZGRWZXJzaW9uKCcxJywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHBjZSk7XG4gICAgfSkudG9UaHJvdygpO1xuICB9KTtcblxuICB0ZXN0KCdhbGlhcyBleHBvc2VzIHJlYWwgTGFtYmRhcyByb2xlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdoZWxsbygpJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGVsbG8nLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG5cbiAgICBjb25zdCB2ZXJzaW9uID0gZm4uY3VycmVudFZlcnNpb247XG4gICAgY29uc3QgYWxpYXMgPSBuZXcgbGFtYmRhLkFsaWFzKHN0YWNrLCAnQWxpYXMnLCB7IGFsaWFzTmFtZTogJ3Byb2QnLCB2ZXJzaW9uIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChhbGlhcy5yb2xlKS50b0VxdWFsKGZuLnJvbGUpO1xuICB9KTtcblxuICB0ZXN0KCdmdW5jdGlvbk5hbWUgaXMgZGVyaXZlZCBmcm9tIHRoZSBhbGlhc0FybiBzbyB0aGF0IGRlcGVuZGVuY2llcyBhcmUgc291bmQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2hlbGxvKCknKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oZWxsbycsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHZlcnNpb24gPSBmbi5jdXJyZW50VmVyc2lvbjtcbiAgICBjb25zdCBhbGlhcyA9IG5ldyBsYW1iZGEuQWxpYXMoc3RhY2ssICdBbGlhcycsIHsgYWxpYXNOYW1lOiAncHJvZCcsIHZlcnNpb24gfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoYWxpYXMuZnVuY3Rpb25OYW1lKSkudG9FcXVhbCh7XG4gICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICcnLFxuICAgICAgICBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBbGlhczMyNUM1NzI3JyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnOnByb2QnLFxuICAgICAgICBdLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnd2l0aCBldmVudCBpbnZva2UgY29uZmlnJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBmbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdmbicsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnZm9vJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgbGFtYmRhLkFsaWFzKHN0YWNrLCAnQWxpYXMnLCB7XG4gICAgICBhbGlhc05hbWU6ICdwcm9kJyxcbiAgICAgIHZlcnNpb246IGZuLmN1cnJlbnRWZXJzaW9uLFxuICAgICAgb25TdWNjZXNzOiB7XG4gICAgICAgIGJpbmQ6ICgpID0+ICh7XG4gICAgICAgICAgZGVzdGluYXRpb246ICdvbi1zdWNjZXNzLWFybicsXG4gICAgICAgIH0pLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkV2ZW50SW52b2tlQ29uZmlnJywge1xuICAgICAgRnVuY3Rpb25OYW1lOiB7XG4gICAgICAgIFJlZjogJ2ZuNUZGNjE2RTMnLFxuICAgICAgfSxcbiAgICAgIFF1YWxpZmllcjoge1xuICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICA3LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FsaWFzMzI1QzU3MjcnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIERlc3RpbmF0aW9uQ29uZmlnOiB7XG4gICAgICAgIE9uU3VjY2Vzczoge1xuICAgICAgICAgIERlc3RpbmF0aW9uOiAnb24tc3VjY2Vzcy1hcm4nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIHdoZW4gY2FsbGluZyBjb25maWd1cmVBc3luY0ludm9rZSBvbiBhbHJlYWR5IGNvbmZpZ3VyZWQgYWxpYXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ2ZuJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdmb28nKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIH0pO1xuICAgIGNvbnN0IGFsaWFzID0gbmV3IGxhbWJkYS5BbGlhcyhzdGFjaywgJ0FsaWFzJywge1xuICAgICAgYWxpYXNOYW1lOiAncHJvZCcsXG4gICAgICB2ZXJzaW9uOiBmbi5jdXJyZW50VmVyc2lvbixcbiAgICAgIG9uU3VjY2Vzczoge1xuICAgICAgICBiaW5kOiAoKSA9PiAoe1xuICAgICAgICAgIGRlc3RpbmF0aW9uOiAnb24tc3VjY2Vzcy1hcm4nLFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGFsaWFzLmNvbmZpZ3VyZUFzeW5jSW52b2tlKHsgcmV0cnlBdHRlbXB0czogMCB9KSkudG9UaHJvdygvQW4gRXZlbnRJbnZva2VDb25maWcgaGFzIGFscmVhZHkgYmVlbiBjb25maWd1cmVkLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2V2ZW50IGludm9rZSBjb25maWcgb24gaW1wb3J0ZWQgYWxpYXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGZuID0gbGFtYmRhLlZlcnNpb24uZnJvbVZlcnNpb25Bcm4oc3RhY2ssICdGbicsICdhcm46YXdzOmxhbWJkYTpyZWdpb246YWNjb3VudC1pZDpmdW5jdGlvbjpmdW5jdGlvbi1uYW1lOnZlcnNpb24nKTtcbiAgICBjb25zdCBhbGlhcyA9IGxhbWJkYS5BbGlhcy5mcm9tQWxpYXNBdHRyaWJ1dGVzKHN0YWNrLCAnQWxpYXMnLCB7IGFsaWFzTmFtZTogJ2FsaWFzLW5hbWUnLCBhbGlhc1ZlcnNpb246IGZuIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGFsaWFzLmNvbmZpZ3VyZUFzeW5jSW52b2tlKHtcbiAgICAgIHJldHJ5QXR0ZW1wdHM6IDEsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpFdmVudEludm9rZUNvbmZpZycsIHtcbiAgICAgIEZ1bmN0aW9uTmFtZTogJ2Z1bmN0aW9uLW5hbWUnLFxuICAgICAgUXVhbGlmaWVyOiAnYWxpYXMtbmFtZScsXG4gICAgICBNYXhpbXVtUmV0cnlBdHRlbXB0czogMSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2NhbiBlbmFibGUgQXV0b1NjYWxpbmcgb24gYWxpYXNlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2hlbGxvKCknKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oZWxsbycsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFsaWFzID0gbmV3IGxhbWJkYS5BbGlhcyhzdGFjaywgJ0FsaWFzJywge1xuICAgICAgYWxpYXNOYW1lOiAncHJvZCcsXG4gICAgICB2ZXJzaW9uOiBmbi5jdXJyZW50VmVyc2lvbixcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBhbGlhcy5hZGRBdXRvU2NhbGluZyh7IG1heENhcGFjaXR5OiA1IH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcGxpY2F0aW9uQXV0b1NjYWxpbmc6OlNjYWxhYmxlVGFyZ2V0Jywge1xuICAgICAgTWluQ2FwYWNpdHk6IDEsXG4gICAgICBNYXhDYXBhY2l0eTogNSxcbiAgICAgIFJlc291cmNlSWQ6IE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAnRm46OkpvaW4nOiBNYXRjaC5hcnJheVdpdGgoW01hdGNoLmFycmF5V2l0aChbXG4gICAgICAgICAgJ2Z1bmN0aW9uOicsXG4gICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICAnRm46OlNlbGVjdCc6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQWxpYXMzMjVDNTcyNycgfSxcbiAgICAgICAgICAgICAgICBdKSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0pLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgICc6cHJvZCcsXG4gICAgICAgIF0pXSksXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGVuYWJsZSBBdXRvU2NhbGluZyBvbiBhbGlhc2VzIHdpdGggUHJvdmlzaW9uZWQgQ29uY3VycmVuY3kgc2V0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBmbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnaGVsbG8oKScpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhlbGxvJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYWxpYXMgPSBuZXcgbGFtYmRhLkFsaWFzKHN0YWNrLCAnQWxpYXMnLCB7XG4gICAgICBhbGlhc05hbWU6ICdwcm9kJyxcbiAgICAgIHZlcnNpb246IGZuLmN1cnJlbnRWZXJzaW9uLFxuICAgICAgcHJvdmlzaW9uZWRDb25jdXJyZW50RXhlY3V0aW9uczogMTAsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgYWxpYXMuYWRkQXV0b1NjYWxpbmcoeyBtYXhDYXBhY2l0eTogNSB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBsaWNhdGlvbkF1dG9TY2FsaW5nOjpTY2FsYWJsZVRhcmdldCcsIHtcbiAgICAgIE1pbkNhcGFjaXR5OiAxLFxuICAgICAgTWF4Q2FwYWNpdHk6IDUsXG4gICAgICBSZXNvdXJjZUlkOiBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgJ0ZuOjpKb2luJzogTWF0Y2guYXJyYXlXaXRoKFtNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICAgICdmdW5jdGlvbjonLFxuICAgICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICAgICAgICAgICAgICB7IFJlZjogJ0FsaWFzMzI1QzU3MjcnIH0sXG4gICAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICAnOnByb2QnLFxuICAgICAgICBdKV0pLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkFsaWFzJywge1xuICAgICAgUHJvdmlzaW9uZWRDb25jdXJyZW5jeUNvbmZpZzoge1xuICAgICAgICBQcm92aXNpb25lZENvbmN1cnJlbnRFeGVjdXRpb25zOiAxMCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3ZhbGlkYXRpb24gZm9yIHV0aWxpemF0aW9uVGFyZ2V0IGRvZXMgbm90IGZhaWwgd2hlbiB1c2luZyBUb2tlbnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdoZWxsbygpJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGVsbG8nLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhbGlhcyA9IG5ldyBsYW1iZGEuQWxpYXMoc3RhY2ssICdBbGlhcycsIHtcbiAgICAgIGFsaWFzTmFtZTogJ3Byb2QnLFxuICAgICAgdmVyc2lvbjogZm4uY3VycmVudFZlcnNpb24sXG4gICAgICBwcm92aXNpb25lZENvbmN1cnJlbnRFeGVjdXRpb25zOiAxMCxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB0YXJnZXQgPSBhbGlhcy5hZGRBdXRvU2NhbGluZyh7IG1heENhcGFjaXR5OiA1IH0pO1xuXG4gICAgdGFyZ2V0LnNjYWxlT25VdGlsaXphdGlvbih7IHV0aWxpemF0aW9uVGFyZ2V0OiBMYXp5Lm51bWJlcih7IHByb2R1Y2U6ICgpID0+IDAuOTUgfSkgfSk7XG5cbiAgICAvLyBUSEVOOiBubyBleGNlcHRpb25cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBsaWNhdGlvbkF1dG9TY2FsaW5nOjpTY2FsaW5nUG9saWN5Jywge1xuICAgICAgUG9saWN5VHlwZTogJ1RhcmdldFRyYWNraW5nU2NhbGluZycsXG4gICAgICBUYXJnZXRUcmFja2luZ1NjYWxpbmdQb2xpY3lDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIFByZWRlZmluZWRNZXRyaWNTcGVjaWZpY2F0aW9uOiB7IFByZWRlZmluZWRNZXRyaWNUeXBlOiAnTGFtYmRhUHJvdmlzaW9uZWRDb25jdXJyZW5jeVV0aWxpemF0aW9uJyB9LFxuICAgICAgICBUYXJnZXRWYWx1ZTogMC45NSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Nhbm5vdCBlbmFibGUgQXV0b1NjYWxpbmcgdHdpY2Ugb24gc2FtZSBwcm9wZXJ0eScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2hlbGxvKCknKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oZWxsbycsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFsaWFzID0gbmV3IGxhbWJkYS5BbGlhcyhzdGFjaywgJ0FsaWFzJywge1xuICAgICAgYWxpYXNOYW1lOiAncHJvZCcsXG4gICAgICB2ZXJzaW9uOiBmbi5jdXJyZW50VmVyc2lvbixcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBhbGlhcy5hZGRBdXRvU2NhbGluZyh7IG1heENhcGFjaXR5OiA1IH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBhbGlhcy5hZGRBdXRvU2NhbGluZyh7IG1heENhcGFjaXR5OiA4IH0pKS50b1Rocm93KC9BdXRvU2NhbGluZyBhbHJlYWR5IGVuYWJsZWQgZm9yIHRoaXMgYWxpYXMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnZXJyb3Igd2hlbiBzcGVjaWZ5aW5nIGludmFsaWQgdXRpbGl6YXRpb24gdmFsdWUgd2hlbiBBdXRvU2NhbGluZyBvbiB1dGlsaXphdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2hlbGxvKCknKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oZWxsbycsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFsaWFzID0gbmV3IGxhbWJkYS5BbGlhcyhzdGFjaywgJ0FsaWFzJywge1xuICAgICAgYWxpYXNOYW1lOiAncHJvZCcsXG4gICAgICB2ZXJzaW9uOiBmbi5jdXJyZW50VmVyc2lvbixcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB0YXJnZXQgPSBhbGlhcy5hZGRBdXRvU2NhbGluZyh7IG1heENhcGFjaXR5OiA1IH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB0YXJnZXQuc2NhbGVPblV0aWxpemF0aW9uKHsgdXRpbGl6YXRpb25UYXJnZXQ6IDAuOTUgfSkpLnRvVGhyb3coL1V0aWxpemF0aW9uIFRhcmdldCBzaG91bGQgYmUgYmV0d2VlbiAwLjEgYW5kIDAuOS4gRm91bmQgMC45NS8pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYXV0b3NjYWxlIG9uIGEgc2NoZWR1bGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdoZWxsbygpJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGVsbG8nLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhbGlhcyA9IG5ldyBsYW1iZGEuQWxpYXMoc3RhY2ssICdBbGlhcycsIHtcbiAgICAgIGFsaWFzTmFtZTogJ3Byb2QnLFxuICAgICAgdmVyc2lvbjogZm4uY3VycmVudFZlcnNpb24sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdGFyZ2V0ID0gYWxpYXMuYWRkQXV0b1NjYWxpbmcoeyBtYXhDYXBhY2l0eTogNSB9KTtcbiAgICB0YXJnZXQuc2NhbGVPblNjaGVkdWxlKCdTY2hlZHVsaW5nJywge1xuICAgICAgc2NoZWR1bGU6IGFwcHNjYWxpbmcuU2NoZWR1bGUuY3Jvbih7fSksXG4gICAgICBtYXhDYXBhY2l0eTogMTAsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwbGljYXRpb25BdXRvU2NhbGluZzo6U2NhbGFibGVUYXJnZXQnLCB7XG4gICAgICBTY2hlZHVsZWRBY3Rpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBTY2FsYWJsZVRhcmdldEFjdGlvbjogeyBNYXhDYXBhY2l0eTogMTAgfSxcbiAgICAgICAgICBTY2hlZHVsZTogJ2Nyb24oKiAqICogKiA/ICopJyxcbiAgICAgICAgICBTY2hlZHVsZWRBY3Rpb25OYW1lOiAnU2NoZWR1bGluZycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzY2hlZHVsZWQgc2NhbGluZyBzaG93cyB3YXJuaW5nIHdoZW4gbWludXRlIGlzIG5vdCBkZWZpbmVkIGluIGNyb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdoZWxsbygpJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGVsbG8nLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhbGlhcyA9IG5ldyBsYW1iZGEuQWxpYXMoc3RhY2ssICdBbGlhcycsIHtcbiAgICAgIGFsaWFzTmFtZTogJ3Byb2QnLFxuICAgICAgdmVyc2lvbjogZm4uY3VycmVudFZlcnNpb24sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdGFyZ2V0ID0gYWxpYXMuYWRkQXV0b1NjYWxpbmcoeyBtYXhDYXBhY2l0eTogNSB9KTtcbiAgICB0YXJnZXQuc2NhbGVPblNjaGVkdWxlKCdTY2hlZHVsaW5nJywge1xuICAgICAgc2NoZWR1bGU6IGFwcHNjYWxpbmcuU2NoZWR1bGUuY3Jvbih7fSksXG4gICAgICBtYXhDYXBhY2l0eTogMTAsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5oYXNXYXJuaW5nKCcvRGVmYXVsdC9BbGlhcy9BbGlhc1NjYWxpbmcvVGFyZ2V0JywgXCJjcm9uOiBJZiB5b3UgZG9uJ3QgcGFzcyAnbWludXRlJywgYnkgZGVmYXVsdCB0aGUgZXZlbnQgcnVucyBldmVyeSBtaW51dGUuIFBhc3MgJ21pbnV0ZTogJyonJyBpZiB0aGF0J3Mgd2hhdCB5b3UgaW50ZW5kLCBvciAnbWludXRlOiAwJyB0byBydW4gb25jZSBwZXIgaG91ciBpbnN0ZWFkLlwiKTtcbiAgfSk7XG5cbiAgdGVzdCgnc2NoZWR1bGVkIHNjYWxpbmcgc2hvd3Mgbm8gd2FybmluZyB3aGVuIG1pbnV0ZSBpcyAqIGluIGNyb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdoZWxsbygpJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGVsbG8nLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhbGlhcyA9IG5ldyBsYW1iZGEuQWxpYXMoc3RhY2ssICdBbGlhcycsIHtcbiAgICAgIGFsaWFzTmFtZTogJ3Byb2QnLFxuICAgICAgdmVyc2lvbjogZm4uY3VycmVudFZlcnNpb24sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdGFyZ2V0ID0gYWxpYXMuYWRkQXV0b1NjYWxpbmcoeyBtYXhDYXBhY2l0eTogNSB9KTtcbiAgICB0YXJnZXQuc2NhbGVPblNjaGVkdWxlKCdTY2hlZHVsaW5nJywge1xuICAgICAgc2NoZWR1bGU6IGFwcHNjYWxpbmcuU2NoZWR1bGUuY3Jvbih7IG1pbnV0ZTogJyonIH0pLFxuICAgICAgbWF4Q2FwYWNpdHk6IDEwLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFubm90YXRpb25zID0gQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5maW5kV2FybmluZygnKicsIE1hdGNoLmFueVZhbHVlKCkpO1xuICAgIGV4cGVjdChhbm5vdGF0aW9ucy5sZW5ndGgpLnRvQmUoMCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZEZ1bmN0aW9uVXJsIGNyZWF0ZXMgYSBmdW5jdGlvbiB1cmwnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdoZWxsbygpJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGVsbG8nLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG4gICAgY29uc3QgYWxpYXNOYW1lID0gJ3Byb2QnO1xuICAgIGNvbnN0IGFsaWFzID0gbmV3IGxhbWJkYS5BbGlhcyhzdGFjaywgJ0FsaWFzJywge1xuICAgICAgYWxpYXNOYW1lLFxuICAgICAgdmVyc2lvbjogZm4uY3VycmVudFZlcnNpb24sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgYWxpYXMuYWRkRnVuY3Rpb25VcmwoKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlVybCcsIHtcbiAgICAgIEF1dGhUeXBlOiAnQVdTX0lBTScsXG4gICAgICBUYXJnZXRGdW5jdGlvbkFybjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFsnTXlMYW1iZGFDQ0U4MDJGQicsICdBcm4nXSxcbiAgICAgIH0sXG4gICAgICBRdWFsaWZpZXI6IGFsaWFzTmFtZSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==