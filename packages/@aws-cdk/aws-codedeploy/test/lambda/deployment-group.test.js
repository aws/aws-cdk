"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
const codedeploy = require("../../lib");
const lib_1 = require("../../lib");
function mockFunction(stack, id) {
    return new lambda.Function(stack, id, {
        code: lambda.Code.fromInline('mock'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_14_X,
    });
}
function mockAlias(stack) {
    return new lambda.Alias(stack, 'Alias', {
        aliasName: 'my-alias',
        version: new lambda.Version(stack, 'Version', {
            lambda: mockFunction(stack, 'Function'),
        }),
    });
}
describe('CodeDeploy Lambda DeploymentGroup', () => {
    test('can be created with default AllAtOnce IN_PLACE configuration', () => {
        const stack = new cdk.Stack();
        stack.node.setContext('@aws-cdk/aws-codedeploy:removeAlarmsFromDeploymentGroup', true);
        const application = new codedeploy.LambdaApplication(stack, 'MyApp');
        const alias = mockAlias(stack);
        new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
            application,
            alias,
            deploymentConfig: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            ApplicationName: {
                Ref: 'MyApp3CE31C26',
            },
            ServiceRoleArn: {
                'Fn::GetAtt': [
                    'MyDGServiceRole5E94FD88',
                    'Arn',
                ],
            },
            AlarmConfiguration: {
                Enabled: false,
                Alarms: assertions_1.Match.absent(),
            },
            AutoRollbackConfiguration: {
                Enabled: true,
                Events: [
                    'DEPLOYMENT_FAILURE',
                ],
            },
            DeploymentConfigName: 'CodeDeployDefault.LambdaAllAtOnce',
            DeploymentStyle: {
                DeploymentOption: 'WITH_TRAFFIC_CONTROL',
                DeploymentType: 'BLUE_GREEN',
            },
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Alias', {
            Type: 'AWS::Lambda::Alias',
            Properties: {
                FunctionName: {
                    Ref: 'Function76856677',
                },
                FunctionVersion: {
                    'Fn::GetAtt': [
                        'Version6A868472',
                        'Version',
                    ],
                },
                Name: 'my-alias',
            },
            UpdatePolicy: {
                CodeDeployLambdaAliasUpdate: {
                    ApplicationName: {
                        Ref: 'MyApp3CE31C26',
                    },
                    DeploymentGroupName: {
                        Ref: 'MyDGC350BD3F',
                    },
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [{
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: {
                            Service: {
                                'Fn::FindInMap': [
                                    'ServiceprincipalMap',
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    'codedeploy',
                                ],
                            },
                        },
                    }],
                Version: '2012-10-17',
            },
            ManagedPolicyArns: [
                {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            { Ref: 'AWS::Partition' },
                            ':iam::aws:policy/service-role/AWSCodeDeployRoleForLambdaLimited',
                        ],
                    ],
                },
            ],
        });
    });
    test('can be created with explicit name', () => {
        const stack = new cdk.Stack();
        const application = new codedeploy.LambdaApplication(stack, 'MyApp');
        const alias = mockAlias(stack);
        new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
            application,
            alias,
            deploymentConfig: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE,
            deploymentGroupName: 'test',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            DeploymentGroupName: 'test',
        });
    });
    test('fail with more than 100 characters in name', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        const alias = mockAlias(stack);
        new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
            alias,
            deploymentGroupName: 'a'.repeat(101),
        });
        expect(() => app.synth()).toThrow(`Deployment group name: "${'a'.repeat(101)}" can be a max of 100 characters.`);
    });
    test('fail with unallowed characters in name', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        const alias = mockAlias(stack);
        new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
            alias,
            deploymentGroupName: 'my name',
        });
        expect(() => app.synth()).toThrow('Deployment group name: "my name" can only contain letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), + (plus signs), = (equals signs), , (commas), @ (at signs), - (minus signs).');
    });
    test('can be created with explicit role', () => {
        const stack = new cdk.Stack();
        const application = new codedeploy.LambdaApplication(stack, 'MyApp');
        const alias = mockAlias(stack);
        const serviceRole = new iam.Role(stack, 'MyRole', {
            assumedBy: new iam.ServicePrincipal('not-codedeploy.test'),
        });
        new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
            application,
            alias,
            deploymentConfig: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE,
            role: serviceRole,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [{
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: {
                            Service: 'not-codedeploy.test',
                        },
                    }],
                Version: '2012-10-17',
            },
            ManagedPolicyArns: [
                {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            { Ref: 'AWS::Partition' },
                            ':iam::aws:policy/service-role/AWSCodeDeployRoleForLambdaLimited',
                        ],
                    ],
                },
            ],
        });
    });
    test('can configure blue/green traffic shifting', () => {
        const stack = new cdk.Stack();
        const application = new codedeploy.LambdaApplication(stack, 'MyApp');
        const alias = mockAlias(stack);
        new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
            application,
            alias,
            deploymentConfig: codedeploy.LambdaDeploymentConfig.LINEAR_10PERCENT_EVERY_1MINUTE,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            ApplicationName: {
                Ref: 'MyApp3CE31C26',
            },
            ServiceRoleArn: {
                'Fn::GetAtt': [
                    'MyDGServiceRole5E94FD88',
                    'Arn',
                ],
            },
            AutoRollbackConfiguration: {
                Enabled: true,
                Events: [
                    'DEPLOYMENT_FAILURE',
                ],
            },
            DeploymentConfigName: 'CodeDeployDefault.LambdaLinear10PercentEvery1Minute',
            DeploymentStyle: {
                DeploymentOption: 'WITH_TRAFFIC_CONTROL',
                DeploymentType: 'BLUE_GREEN',
            },
        });
    });
    test('can rollback on alarm', () => {
        const stack = new cdk.Stack();
        const application = new codedeploy.LambdaApplication(stack, 'MyApp');
        const alias = mockAlias(stack);
        new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
            application,
            alias,
            deploymentConfig: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE,
            alarms: [new cloudwatch.Alarm(stack, 'Failures', {
                    metric: alias.metricErrors(),
                    comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
                    threshold: 1,
                    evaluationPeriods: 1,
                })],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            AlarmConfiguration: {
                Alarms: [{
                        Name: {
                            Ref: 'Failures8A3E1A2F',
                        },
                    }],
                Enabled: true,
            },
            AutoRollbackConfiguration: {
                Enabled: true,
                Events: [
                    'DEPLOYMENT_FAILURE',
                    'DEPLOYMENT_STOP_ON_ALARM',
                ],
            },
        });
    });
    test('onPreHook throws error if pre-hook already defined', () => {
        const stack = new cdk.Stack();
        const alias = mockAlias(stack);
        const group = new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
            alias,
            preHook: mockFunction(stack, 'PreHook'),
            deploymentConfig: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE,
        });
        expect(() => group.addPreHook(mockFunction(stack, 'PreHook2'))).toThrow();
    });
    test('onPostHook throws error if post-hook already defined', () => {
        const stack = new cdk.Stack();
        const alias = mockAlias(stack);
        const group = new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
            alias,
            postHook: mockFunction(stack, 'PostHook'),
            deploymentConfig: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE,
        });
        expect(() => group.addPostHook(mockFunction(stack, 'PostHook2'))).toThrow();
    });
    test('can run pre hook lambda function before deployment', () => {
        const stack = new cdk.Stack();
        const application = new codedeploy.LambdaApplication(stack, 'MyApp');
        const alias = mockAlias(stack);
        new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
            application,
            alias,
            preHook: mockFunction(stack, 'PreHook'),
            deploymentConfig: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE,
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Alias', {
            UpdatePolicy: {
                CodeDeployLambdaAliasUpdate: {
                    ApplicationName: {
                        Ref: 'MyApp3CE31C26',
                    },
                    DeploymentGroupName: {
                        Ref: 'MyDGC350BD3F',
                    },
                    BeforeAllowTrafficHook: {
                        Ref: 'PreHook8B53F672',
                    },
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyName: 'MyDGServiceRoleDefaultPolicy65E8E1EA',
            Roles: [{
                    Ref: 'MyDGServiceRole5E94FD88',
                }],
            PolicyDocument: {
                Statement: [{
                        Action: 'lambda:InvokeFunction',
                        Resource: [
                            { 'Fn::GetAtt': ['PreHook8B53F672', 'Arn'] },
                            { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['PreHook8B53F672', 'Arn'] }, ':*']] },
                        ],
                        Effect: 'Allow',
                    }],
                Version: '2012-10-17',
            },
        });
    });
    test('can add pre hook lambda function after creating the deployment group', () => {
        const stack = new cdk.Stack();
        const application = new codedeploy.LambdaApplication(stack, 'MyApp');
        const alias = mockAlias(stack);
        const group = new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
            application,
            alias,
            deploymentConfig: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE,
        });
        group.addPreHook(mockFunction(stack, 'PreHook'));
        assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Alias', {
            UpdatePolicy: {
                CodeDeployLambdaAliasUpdate: {
                    ApplicationName: {
                        Ref: 'MyApp3CE31C26',
                    },
                    DeploymentGroupName: {
                        Ref: 'MyDGC350BD3F',
                    },
                    BeforeAllowTrafficHook: {
                        Ref: 'PreHook8B53F672',
                    },
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyName: 'MyDGServiceRoleDefaultPolicy65E8E1EA',
            Roles: [{
                    Ref: 'MyDGServiceRole5E94FD88',
                }],
            PolicyDocument: {
                Statement: [{
                        Action: 'lambda:InvokeFunction',
                        Resource: [
                            { 'Fn::GetAtt': ['PreHook8B53F672', 'Arn'] },
                            { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['PreHook8B53F672', 'Arn'] }, ':*']] },
                        ],
                        Effect: 'Allow',
                    }],
                Version: '2012-10-17',
            },
        });
    });
    test('can run post hook lambda function before deployment', () => {
        const stack = new cdk.Stack();
        const application = new codedeploy.LambdaApplication(stack, 'MyApp');
        const alias = mockAlias(stack);
        new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
            application,
            alias,
            postHook: mockFunction(stack, 'PostHook'),
            deploymentConfig: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE,
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Alias', {
            UpdatePolicy: {
                CodeDeployLambdaAliasUpdate: {
                    ApplicationName: {
                        Ref: 'MyApp3CE31C26',
                    },
                    DeploymentGroupName: {
                        Ref: 'MyDGC350BD3F',
                    },
                    AfterAllowTrafficHook: {
                        Ref: 'PostHookF2E49B30',
                    },
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyName: 'MyDGServiceRoleDefaultPolicy65E8E1EA',
            Roles: [{
                    Ref: 'MyDGServiceRole5E94FD88',
                }],
            PolicyDocument: {
                Statement: [{
                        Action: 'lambda:InvokeFunction',
                        Resource: [
                            { 'Fn::GetAtt': ['PostHookF2E49B30', 'Arn'] },
                            { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['PostHookF2E49B30', 'Arn'] }, ':*']] },
                        ],
                        Effect: 'Allow',
                    }],
                Version: '2012-10-17',
            },
        });
    });
    test('can add post hook lambda function after creating the deployment group', () => {
        const stack = new cdk.Stack();
        const application = new codedeploy.LambdaApplication(stack, 'MyApp');
        const alias = mockAlias(stack);
        const group = new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
            application,
            alias,
            deploymentConfig: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE,
        });
        group.addPostHook(mockFunction(stack, 'PostHook'));
        assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Alias', {
            UpdatePolicy: {
                CodeDeployLambdaAliasUpdate: {
                    ApplicationName: {
                        Ref: 'MyApp3CE31C26',
                    },
                    DeploymentGroupName: {
                        Ref: 'MyDGC350BD3F',
                    },
                    AfterAllowTrafficHook: {
                        Ref: 'PostHookF2E49B30',
                    },
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyName: 'MyDGServiceRoleDefaultPolicy65E8E1EA',
            Roles: [{
                    Ref: 'MyDGServiceRole5E94FD88',
                }],
            PolicyDocument: {
                Statement: [{
                        Action: 'lambda:InvokeFunction',
                        Resource: [
                            { 'Fn::GetAtt': ['PostHookF2E49B30', 'Arn'] },
                            { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['PostHookF2E49B30', 'Arn'] }, ':*']] },
                        ],
                        Effect: 'Allow',
                    }],
                Version: '2012-10-17',
            },
        });
    });
    test('can disable rollback when alarm polling fails', () => {
        const stack = new cdk.Stack();
        const application = new codedeploy.LambdaApplication(stack, 'MyApp');
        const alias = mockAlias(stack);
        new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
            application,
            alias,
            postHook: mockFunction(stack, 'PostHook'),
            deploymentConfig: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE,
            ignorePollAlarmsFailure: true,
            alarms: [new cloudwatch.Alarm(stack, 'Failures', {
                    metric: alias.metricErrors(),
                    comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
                    threshold: 1,
                    evaluationPeriods: 1,
                })],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            AlarmConfiguration: {
                Alarms: [{
                        Name: {
                            Ref: 'Failures8A3E1A2F',
                        },
                    }],
                Enabled: true,
                IgnorePollAlarmFailure: true,
            },
        });
    });
    test('can disable rollback when deployment fails', () => {
        const stack = new cdk.Stack();
        const application = new codedeploy.LambdaApplication(stack, 'MyApp');
        const alias = mockAlias(stack);
        new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
            application,
            alias,
            postHook: mockFunction(stack, 'PostHook'),
            deploymentConfig: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE,
            autoRollback: {
                failedDeployment: false,
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            ApplicationName: {
                Ref: 'MyApp3CE31C26',
            },
            ServiceRoleArn: {
                'Fn::GetAtt': [
                    'MyDGServiceRole5E94FD88',
                    'Arn',
                ],
            },
            DeploymentConfigName: 'CodeDeployDefault.LambdaAllAtOnce',
            DeploymentStyle: {
                DeploymentOption: 'WITH_TRAFFIC_CONTROL',
                DeploymentType: 'BLUE_GREEN',
            },
        });
    });
    test('can enable rollback when deployment stops', () => {
        const stack = new cdk.Stack();
        const application = new codedeploy.LambdaApplication(stack, 'MyApp');
        const alias = mockAlias(stack);
        new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
            application,
            alias,
            postHook: mockFunction(stack, 'PostHook'),
            deploymentConfig: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE,
            autoRollback: {
                stoppedDeployment: true,
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            AutoRollbackConfiguration: {
                Enabled: true,
                Events: [
                    'DEPLOYMENT_FAILURE',
                    'DEPLOYMENT_STOP_ON_REQUEST',
                ],
            },
        });
    });
    test('can disable rollback when alarm in failure state', () => {
        const stack = new cdk.Stack();
        const application = new codedeploy.LambdaApplication(stack, 'MyApp');
        const alias = mockAlias(stack);
        new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
            application,
            alias,
            postHook: mockFunction(stack, 'PostHook'),
            deploymentConfig: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE,
            autoRollback: {
                deploymentInAlarm: false,
            },
            alarms: [new cloudwatch.Alarm(stack, 'Failures', {
                    metric: alias.metricErrors(),
                    comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
                    threshold: 1,
                    evaluationPeriods: 1,
                })],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            AutoRollbackConfiguration: {
                Enabled: true,
                Events: [
                    'DEPLOYMENT_FAILURE',
                ],
            },
        });
    });
    test('uses the correct Service Principal in the us-isob-east-1 region', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'CodeDeployLambdaStack', {
            env: { region: 'us-isob-east-1' },
        });
        const alias = mockAlias(stack);
        new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
            alias,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [
                    {
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: {
                            Service: 'codedeploy.amazonaws.com',
                        },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    describe('deploymentGroup from ARN in different account and region', () => {
        let stack;
        let application;
        let group;
        const account = '222222222222';
        const region = 'theregion-1';
        beforeEach(() => {
            stack = new cdk.Stack(undefined, 'Stack', { env: { account: '111111111111', region: 'blabla-1' } });
            application = codedeploy.LambdaApplication.fromLambdaApplicationArn(stack, 'Application', `arn:aws:codedeploy:${region}:${account}:application:MyApplication`);
            group = codedeploy.LambdaDeploymentGroup.fromLambdaDeploymentGroupAttributes(stack, 'Group', {
                application,
                deploymentGroupName: 'DeploymentGroup',
            });
        });
        test('knows its account and region', () => {
            // THEN
            expect(application.env).toEqual(expect.objectContaining({ account, region }));
            expect(group.env).toEqual(expect.objectContaining({ account, region }));
        });
        test('references the predefined DeploymentGroupConfig in the right region', () => {
            expect(group.deploymentConfig.deploymentConfigArn).toEqual(expect.stringContaining(`:codedeploy:${region}:${account}:deploymentconfig:CodeDeployDefault.LambdaCanary10Percent5Minutes`));
        });
    });
});
describe('imported with fromLambdaDeploymentGroupAttributes', () => {
    test('defaults the Deployment Config to Canary10Percent5Minutes', () => {
        const stack = new cdk.Stack();
        const lambdaApp = codedeploy.LambdaApplication.fromLambdaApplicationName(stack, 'LA', 'LambdaApplication');
        const importedGroup = codedeploy.LambdaDeploymentGroup.fromLambdaDeploymentGroupAttributes(stack, 'LDG', {
            application: lambdaApp,
            deploymentGroupName: 'LambdaDeploymentGroup',
        });
        expect(importedGroup.deploymentConfig.deploymentConfigName).toEqual('CodeDeployDefault.LambdaCanary10Percent5Minutes');
    });
});
test('dependency on the config exists to ensure ordering', () => {
    // WHEN
    const stack = new cdk.Stack();
    const application = new codedeploy.LambdaApplication(stack, 'MyApp');
    const alias = mockAlias(stack);
    const config = new codedeploy.LambdaDeploymentConfig(stack, 'MyConfig', {
        trafficRouting: lib_1.TrafficRouting.timeBasedCanary({
            interval: cdk.Duration.minutes(1),
            percentage: 5,
        }),
    });
    new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
        application,
        alias,
        deploymentConfig: config,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResource('AWS::CodeDeploy::DeploymentGroup', {
        Properties: {
            DeploymentConfigName: stack.resolve(config.deploymentConfigName),
        },
        DependsOn: [
            stack.getLogicalId(config.node.defaultChild),
        ],
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95bWVudC1ncm91cC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGVwbG95bWVudC1ncm91cC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELHNEQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMsOENBQThDO0FBQzlDLHFDQUFxQztBQUVyQyx3Q0FBd0M7QUFDeEMsbUNBQTJDO0FBRTNDLFNBQVMsWUFBWSxDQUFDLEtBQWdCLEVBQUUsRUFBVTtJQUNoRCxPQUFPLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1FBQ3BDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDcEMsT0FBTyxFQUFFLGVBQWU7UUFDeEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztLQUNwQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBQ0QsU0FBUyxTQUFTLENBQUMsS0FBZ0I7SUFDakMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtRQUN0QyxTQUFTLEVBQUUsVUFBVTtRQUNyQixPQUFPLEVBQUUsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDNUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDO1NBQ3hDLENBQUM7S0FDSCxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsUUFBUSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtJQUNqRCxJQUFJLENBQUMsOERBQThELEVBQUUsR0FBRyxFQUFFO1FBQ3hFLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLHlEQUF5RCxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZGLE1BQU0s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QUFFSCxJQUFJLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO0lBQzlELE9BQU87SUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM5QixNQUFNLFdBQVcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDckUsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLE1BQU0sTUFBTSxHQUFHLElBQUksVUFBVSxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7UUFDdEUsY0FBYyxFQUFFLG9CQUFjLENBQUMsZUFBZSxDQUFDO1lBQzdDLFFBQVEsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDakMsVUFBVSxFQUFFLENBQUM7U0FDZCxDQUFDO0tBQ0gsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxVQUFVLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtRQUNsRCxXQUFXO1FBQ1gsS0FBSztRQUNMLGdCQUFnQixFQUFFLE1BQU07S0FDekIsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxrQ0FBa0MsRUFBRTtRQUN4RSxVQUFVLEVBQUU7WUFDVixvQkFBb0IsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQztTQUNqRTtRQUNELFNBQVMsRUFBRTtZQUNULEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUE4QyxDQUFDO1NBQy9FO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNvZGVkZXBsb3kgZnJvbSAnLi4vLi4vbGliJztcbmltcG9ydCB7IFRyYWZmaWNSb3V0aW5nIH0gZnJvbSAnLi4vLi4vbGliJztcblxuZnVuY3Rpb24gbW9ja0Z1bmN0aW9uKHN0YWNrOiBjZGsuU3RhY2ssIGlkOiBzdHJpbmcpIHtcbiAgcmV0dXJuIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssIGlkLCB7XG4gICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnbW9jaycpLFxuICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgfSk7XG59XG5mdW5jdGlvbiBtb2NrQWxpYXMoc3RhY2s6IGNkay5TdGFjaykge1xuICByZXR1cm4gbmV3IGxhbWJkYS5BbGlhcyhzdGFjaywgJ0FsaWFzJywge1xuICAgIGFsaWFzTmFtZTogJ215LWFsaWFzJyxcbiAgICB2ZXJzaW9uOiBuZXcgbGFtYmRhLlZlcnNpb24oc3RhY2ssICdWZXJzaW9uJywge1xuICAgICAgbGFtYmRhOiBtb2NrRnVuY3Rpb24oc3RhY2ssICdGdW5jdGlvbicpLFxuICAgIH0pLFxuICB9KTtcbn1cblxuZGVzY3JpYmUoJ0NvZGVEZXBsb3kgTGFtYmRhIERlcGxveW1lbnRHcm91cCcsICgpID0+IHtcbiAgdGVzdCgnY2FuIGJlIGNyZWF0ZWQgd2l0aCBkZWZhdWx0IEFsbEF0T25jZSBJTl9QTEFDRSBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dCgnQGF3cy1jZGsvYXdzLWNvZGVkZXBsb3k6cmVtb3ZlQWxhcm1zRnJvbURlcGxveW1lbnRHcm91cCcsIHRydWUpO1xuICAgIGNvbnN0IGFwcGxpY2F0aW9uID0gbmV3IGNvZGVkZXBsb3kuTGFtYmRhQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcCcpO1xuICAgIGNvbnN0IGFsaWFzID0gbW9ja0FsaWFzKHN0YWNrKTtcbiAgICBuZXcgY29kZWRlcGxveS5MYW1iZGFEZXBsb3ltZW50R3JvdXAoc3RhY2ssICdNeURHJywge1xuICAgICAgYXBwbGljYXRpb24sXG4gICAgICBhbGlhcyxcbiAgICAgIGRlcGxveW1lbnRDb25maWc6IGNvZGVkZXBsb3kuTGFtYmRhRGVwbG95bWVudENvbmZpZy5BTExfQVRfT05DRSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVEZXBsb3k6OkRlcGxveW1lbnRHcm91cCcsIHtcbiAgICAgIEFwcGxpY2F0aW9uTmFtZToge1xuICAgICAgICBSZWY6ICdNeUFwcDNDRTMxQzI2JyxcbiAgICAgIH0sXG4gICAgICBTZXJ2aWNlUm9sZUFybjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnTXlER1NlcnZpY2VSb2xlNUU5NEZEODgnLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIEFsYXJtQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBFbmFibGVkOiBmYWxzZSxcbiAgICAgICAgQWxhcm1zOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgIH0sXG4gICAgICBBdXRvUm9sbGJhY2tDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIEV2ZW50czogW1xuICAgICAgICAgICdERVBMT1lNRU5UX0ZBSUxVUkUnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIERlcGxveW1lbnRDb25maWdOYW1lOiAnQ29kZURlcGxveURlZmF1bHQuTGFtYmRhQWxsQXRPbmNlJyxcbiAgICAgIERlcGxveW1lbnRTdHlsZToge1xuICAgICAgICBEZXBsb3ltZW50T3B0aW9uOiAnV0lUSF9UUkFGRklDX0NPTlRST0wnLFxuICAgICAgICBEZXBsb3ltZW50VHlwZTogJ0JMVUVfR1JFRU4nLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6TGFtYmRhOjpBbGlhcycsIHtcbiAgICAgIFR5cGU6ICdBV1M6OkxhbWJkYTo6QWxpYXMnLFxuICAgICAgUHJvcGVydGllczoge1xuICAgICAgICBGdW5jdGlvbk5hbWU6IHtcbiAgICAgICAgICBSZWY6ICdGdW5jdGlvbjc2ODU2Njc3JyxcbiAgICAgICAgfSxcbiAgICAgICAgRnVuY3Rpb25WZXJzaW9uOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnVmVyc2lvbjZBODY4NDcyJyxcbiAgICAgICAgICAgICdWZXJzaW9uJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBOYW1lOiAnbXktYWxpYXMnLFxuICAgICAgfSxcbiAgICAgIFVwZGF0ZVBvbGljeToge1xuICAgICAgICBDb2RlRGVwbG95TGFtYmRhQWxpYXNVcGRhdGU6IHtcbiAgICAgICAgICBBcHBsaWNhdGlvbk5hbWU6IHtcbiAgICAgICAgICAgIFJlZjogJ015QXBwM0NFMzFDMjYnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRGVwbG95bWVudEdyb3VwTmFtZToge1xuICAgICAgICAgICAgUmVmOiAnTXlER0MzNTBCRDNGJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFt7XG4gICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgIFNlcnZpY2U6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpGaW5kSW5NYXAnOiBbXG4gICAgICAgICAgICAgICAgJ1NlcnZpY2VwcmluY2lwYWxNYXAnLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdjb2RlZGVwbG95JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfV0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgICBNYW5hZ2VkUG9saWN5QXJuczogW1xuICAgICAgICB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgJzppYW06OmF3czpwb2xpY3kvc2VydmljZS1yb2xlL0FXU0NvZGVEZXBsb3lSb2xlRm9yTGFtYmRhTGltaXRlZCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYmUgY3JlYXRlZCB3aXRoIGV4cGxpY2l0IG5hbWUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBwbGljYXRpb24gPSBuZXcgY29kZWRlcGxveS5MYW1iZGFBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwJyk7XG4gICAgY29uc3QgYWxpYXMgPSBtb2NrQWxpYXMoc3RhY2spO1xuICAgIG5ldyBjb2RlZGVwbG95LkxhbWJkYURlcGxveW1lbnRHcm91cChzdGFjaywgJ015REcnLCB7XG4gICAgICBhcHBsaWNhdGlvbixcbiAgICAgIGFsaWFzLFxuICAgICAgZGVwbG95bWVudENvbmZpZzogY29kZWRlcGxveS5MYW1iZGFEZXBsb3ltZW50Q29uZmlnLkFMTF9BVF9PTkNFLFxuICAgICAgZGVwbG95bWVudEdyb3VwTmFtZTogJ3Rlc3QnLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZURlcGxveTo6RGVwbG95bWVudEdyb3VwJywge1xuICAgICAgRGVwbG95bWVudEdyb3VwTmFtZTogJ3Rlc3QnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlsIHdpdGggbW9yZSB0aGFuIDEwMCBjaGFyYWN0ZXJzIGluIG5hbWUnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwKTtcbiAgICBjb25zdCBhbGlhcyA9IG1vY2tBbGlhcyhzdGFjayk7XG4gICAgbmV3IGNvZGVkZXBsb3kuTGFtYmRhRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGFsaWFzLFxuICAgICAgZGVwbG95bWVudEdyb3VwTmFtZTogJ2EnLnJlcGVhdCgxMDEpLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IGFwcC5zeW50aCgpKS50b1Rocm93KGBEZXBsb3ltZW50IGdyb3VwIG5hbWU6IFwiJHsnYScucmVwZWF0KDEwMSl9XCIgY2FuIGJlIGEgbWF4IG9mIDEwMCBjaGFyYWN0ZXJzLmApO1xuICB9KTtcblxuICB0ZXN0KCdmYWlsIHdpdGggdW5hbGxvd2VkIGNoYXJhY3RlcnMgaW4gbmFtZScsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xuICAgIGNvbnN0IGFsaWFzID0gbW9ja0FsaWFzKHN0YWNrKTtcbiAgICBuZXcgY29kZWRlcGxveS5MYW1iZGFEZXBsb3ltZW50R3JvdXAoc3RhY2ssICdNeURHJywge1xuICAgICAgYWxpYXMsXG4gICAgICBkZXBsb3ltZW50R3JvdXBOYW1lOiAnbXkgbmFtZScsXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4gYXBwLnN5bnRoKCkpLnRvVGhyb3coJ0RlcGxveW1lbnQgZ3JvdXAgbmFtZTogXCJteSBuYW1lXCIgY2FuIG9ubHkgY29udGFpbiBsZXR0ZXJzIChhLXosIEEtWiksIG51bWJlcnMgKDAtOSksIHBlcmlvZHMgKC4pLCB1bmRlcnNjb3JlcyAoXyksICsgKHBsdXMgc2lnbnMpLCA9IChlcXVhbHMgc2lnbnMpLCAsIChjb21tYXMpLCBAIChhdCBzaWducyksIC0gKG1pbnVzIHNpZ25zKS4nKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGJlIGNyZWF0ZWQgd2l0aCBleHBsaWNpdCByb2xlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwcGxpY2F0aW9uID0gbmV3IGNvZGVkZXBsb3kuTGFtYmRhQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcCcpO1xuICAgIGNvbnN0IGFsaWFzID0gbW9ja0FsaWFzKHN0YWNrKTtcbiAgICBjb25zdCBzZXJ2aWNlUm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ015Um9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdub3QtY29kZWRlcGxveS50ZXN0JyksXG4gICAgfSk7XG5cbiAgICBuZXcgY29kZWRlcGxveS5MYW1iZGFEZXBsb3ltZW50R3JvdXAoc3RhY2ssICdNeURHJywge1xuICAgICAgYXBwbGljYXRpb24sXG4gICAgICBhbGlhcyxcbiAgICAgIGRlcGxveW1lbnRDb25maWc6IGNvZGVkZXBsb3kuTGFtYmRhRGVwbG95bWVudENvbmZpZy5BTExfQVRfT05DRSxcbiAgICAgIHJvbGU6IHNlcnZpY2VSb2xlLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW3tcbiAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgU2VydmljZTogJ25vdC1jb2RlZGVwbG95LnRlc3QnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH1dLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgTWFuYWdlZFBvbGljeUFybnM6IFtcbiAgICAgICAge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICc6aWFtOjphd3M6cG9saWN5L3NlcnZpY2Utcm9sZS9BV1NDb2RlRGVwbG95Um9sZUZvckxhbWJkYUxpbWl0ZWQnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGNvbmZpZ3VyZSBibHVlL2dyZWVuIHRyYWZmaWMgc2hpZnRpbmcnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBwbGljYXRpb24gPSBuZXcgY29kZWRlcGxveS5MYW1iZGFBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwJyk7XG4gICAgY29uc3QgYWxpYXMgPSBtb2NrQWxpYXMoc3RhY2spO1xuICAgIG5ldyBjb2RlZGVwbG95LkxhbWJkYURlcGxveW1lbnRHcm91cChzdGFjaywgJ015REcnLCB7XG4gICAgICBhcHBsaWNhdGlvbixcbiAgICAgIGFsaWFzLFxuICAgICAgZGVwbG95bWVudENvbmZpZzogY29kZWRlcGxveS5MYW1iZGFEZXBsb3ltZW50Q29uZmlnLkxJTkVBUl8xMFBFUkNFTlRfRVZFUllfMU1JTlVURSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVEZXBsb3k6OkRlcGxveW1lbnRHcm91cCcsIHtcbiAgICAgIEFwcGxpY2F0aW9uTmFtZToge1xuICAgICAgICBSZWY6ICdNeUFwcDNDRTMxQzI2JyxcbiAgICAgIH0sXG4gICAgICBTZXJ2aWNlUm9sZUFybjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnTXlER1NlcnZpY2VSb2xlNUU5NEZEODgnLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIEF1dG9Sb2xsYmFja0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgRXZlbnRzOiBbXG4gICAgICAgICAgJ0RFUExPWU1FTlRfRkFJTFVSRScsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgRGVwbG95bWVudENvbmZpZ05hbWU6ICdDb2RlRGVwbG95RGVmYXVsdC5MYW1iZGFMaW5lYXIxMFBlcmNlbnRFdmVyeTFNaW51dGUnLFxuICAgICAgRGVwbG95bWVudFN0eWxlOiB7XG4gICAgICAgIERlcGxveW1lbnRPcHRpb246ICdXSVRIX1RSQUZGSUNfQ09OVFJPTCcsXG4gICAgICAgIERlcGxveW1lbnRUeXBlOiAnQkxVRV9HUkVFTicsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gcm9sbGJhY2sgb24gYWxhcm0nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBwbGljYXRpb24gPSBuZXcgY29kZWRlcGxveS5MYW1iZGFBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwJyk7XG4gICAgY29uc3QgYWxpYXMgPSBtb2NrQWxpYXMoc3RhY2spO1xuICAgIG5ldyBjb2RlZGVwbG95LkxhbWJkYURlcGxveW1lbnRHcm91cChzdGFjaywgJ015REcnLCB7XG4gICAgICBhcHBsaWNhdGlvbixcbiAgICAgIGFsaWFzLFxuICAgICAgZGVwbG95bWVudENvbmZpZzogY29kZWRlcGxveS5MYW1iZGFEZXBsb3ltZW50Q29uZmlnLkFMTF9BVF9PTkNFLFxuICAgICAgYWxhcm1zOiBbbmV3IGNsb3Vkd2F0Y2guQWxhcm0oc3RhY2ssICdGYWlsdXJlcycsIHtcbiAgICAgICAgbWV0cmljOiBhbGlhcy5tZXRyaWNFcnJvcnMoKSxcbiAgICAgICAgY29tcGFyaXNvbk9wZXJhdG9yOiBjbG91ZHdhdGNoLkNvbXBhcmlzb25PcGVyYXRvci5HUkVBVEVSX1RIQU5fVEhSRVNIT0xELFxuICAgICAgICB0aHJlc2hvbGQ6IDEsXG4gICAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICAgICAgfSldLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZURlcGxveTo6RGVwbG95bWVudEdyb3VwJywge1xuICAgICAgQWxhcm1Db25maWd1cmF0aW9uOiB7XG4gICAgICAgIEFsYXJtczogW3tcbiAgICAgICAgICBOYW1lOiB7XG4gICAgICAgICAgICBSZWY6ICdGYWlsdXJlczhBM0UxQTJGJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9XSxcbiAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBBdXRvUm9sbGJhY2tDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIEV2ZW50czogW1xuICAgICAgICAgICdERVBMT1lNRU5UX0ZBSUxVUkUnLFxuICAgICAgICAgICdERVBMT1lNRU5UX1NUT1BfT05fQUxBUk0nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnb25QcmVIb29rIHRocm93cyBlcnJvciBpZiBwcmUtaG9vayBhbHJlYWR5IGRlZmluZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYWxpYXMgPSBtb2NrQWxpYXMoc3RhY2spO1xuICAgIGNvbnN0IGdyb3VwID0gbmV3IGNvZGVkZXBsb3kuTGFtYmRhRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGFsaWFzLFxuICAgICAgcHJlSG9vazogbW9ja0Z1bmN0aW9uKHN0YWNrLCAnUHJlSG9vaycpLFxuICAgICAgZGVwbG95bWVudENvbmZpZzogY29kZWRlcGxveS5MYW1iZGFEZXBsb3ltZW50Q29uZmlnLkFMTF9BVF9PTkNFLFxuICAgIH0pO1xuICAgIGV4cGVjdCgoKSA9PiBncm91cC5hZGRQcmVIb29rKG1vY2tGdW5jdGlvbihzdGFjaywgJ1ByZUhvb2syJykpKS50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ29uUG9zdEhvb2sgdGhyb3dzIGVycm9yIGlmIHBvc3QtaG9vayBhbHJlYWR5IGRlZmluZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYWxpYXMgPSBtb2NrQWxpYXMoc3RhY2spO1xuICAgIGNvbnN0IGdyb3VwID0gbmV3IGNvZGVkZXBsb3kuTGFtYmRhRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGFsaWFzLFxuICAgICAgcG9zdEhvb2s6IG1vY2tGdW5jdGlvbihzdGFjaywgJ1Bvc3RIb29rJyksXG4gICAgICBkZXBsb3ltZW50Q29uZmlnOiBjb2RlZGVwbG95LkxhbWJkYURlcGxveW1lbnRDb25maWcuQUxMX0FUX09OQ0UsXG4gICAgfSk7XG4gICAgZXhwZWN0KCgpID0+IGdyb3VwLmFkZFBvc3RIb29rKG1vY2tGdW5jdGlvbihzdGFjaywgJ1Bvc3RIb29rMicpKSkudG9UaHJvdygpO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gcnVuIHByZSBob29rIGxhbWJkYSBmdW5jdGlvbiBiZWZvcmUgZGVwbG95bWVudCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcHBsaWNhdGlvbiA9IG5ldyBjb2RlZGVwbG95LkxhbWJkYUFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHAnKTtcbiAgICBjb25zdCBhbGlhcyA9IG1vY2tBbGlhcyhzdGFjayk7XG4gICAgbmV3IGNvZGVkZXBsb3kuTGFtYmRhRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGFwcGxpY2F0aW9uLFxuICAgICAgYWxpYXMsXG4gICAgICBwcmVIb29rOiBtb2NrRnVuY3Rpb24oc3RhY2ssICdQcmVIb29rJyksXG4gICAgICBkZXBsb3ltZW50Q29uZmlnOiBjb2RlZGVwbG95LkxhbWJkYURlcGxveW1lbnRDb25maWcuQUxMX0FUX09OQ0UsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkxhbWJkYTo6QWxpYXMnLCB7XG4gICAgICBVcGRhdGVQb2xpY3k6IHtcbiAgICAgICAgQ29kZURlcGxveUxhbWJkYUFsaWFzVXBkYXRlOiB7XG4gICAgICAgICAgQXBwbGljYXRpb25OYW1lOiB7XG4gICAgICAgICAgICBSZWY6ICdNeUFwcDNDRTMxQzI2JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIERlcGxveW1lbnRHcm91cE5hbWU6IHtcbiAgICAgICAgICAgIFJlZjogJ015REdDMzUwQkQzRicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBCZWZvcmVBbGxvd1RyYWZmaWNIb29rOiB7XG4gICAgICAgICAgICBSZWY6ICdQcmVIb29rOEI1M0Y2NzInLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lOYW1lOiAnTXlER1NlcnZpY2VSb2xlRGVmYXVsdFBvbGljeTY1RThFMUVBJyxcbiAgICAgIFJvbGVzOiBbe1xuICAgICAgICBSZWY6ICdNeURHU2VydmljZVJvbGU1RTk0RkQ4OCcsXG4gICAgICB9XSxcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW3tcbiAgICAgICAgICBBY3Rpb246ICdsYW1iZGE6SW52b2tlRnVuY3Rpb24nLFxuICAgICAgICAgIFJlc291cmNlOiBbXG4gICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydQcmVIb29rOEI1M0Y2NzInLCAnQXJuJ10gfSxcbiAgICAgICAgICAgIHsgJ0ZuOjpKb2luJzogWycnLCBbeyAnRm46OkdldEF0dCc6IFsnUHJlSG9vazhCNTNGNjcyJywgJ0FybiddIH0sICc6KiddXSB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICB9XSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGFkZCBwcmUgaG9vayBsYW1iZGEgZnVuY3Rpb24gYWZ0ZXIgY3JlYXRpbmcgdGhlIGRlcGxveW1lbnQgZ3JvdXAnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBwbGljYXRpb24gPSBuZXcgY29kZWRlcGxveS5MYW1iZGFBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwJyk7XG4gICAgY29uc3QgYWxpYXMgPSBtb2NrQWxpYXMoc3RhY2spO1xuICAgIGNvbnN0IGdyb3VwID0gbmV3IGNvZGVkZXBsb3kuTGFtYmRhRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGFwcGxpY2F0aW9uLFxuICAgICAgYWxpYXMsXG4gICAgICBkZXBsb3ltZW50Q29uZmlnOiBjb2RlZGVwbG95LkxhbWJkYURlcGxveW1lbnRDb25maWcuQUxMX0FUX09OQ0UsXG4gICAgfSk7XG4gICAgZ3JvdXAuYWRkUHJlSG9vayhtb2NrRnVuY3Rpb24oc3RhY2ssICdQcmVIb29rJykpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpMYW1iZGE6OkFsaWFzJywge1xuICAgICAgVXBkYXRlUG9saWN5OiB7XG4gICAgICAgIENvZGVEZXBsb3lMYW1iZGFBbGlhc1VwZGF0ZToge1xuICAgICAgICAgIEFwcGxpY2F0aW9uTmFtZToge1xuICAgICAgICAgICAgUmVmOiAnTXlBcHAzQ0UzMUMyNicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBEZXBsb3ltZW50R3JvdXBOYW1lOiB7XG4gICAgICAgICAgICBSZWY6ICdNeURHQzM1MEJEM0YnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgQmVmb3JlQWxsb3dUcmFmZmljSG9vazoge1xuICAgICAgICAgICAgUmVmOiAnUHJlSG9vazhCNTNGNjcyJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5TmFtZTogJ015REdTZXJ2aWNlUm9sZURlZmF1bHRQb2xpY3k2NUU4RTFFQScsXG4gICAgICBSb2xlczogW3tcbiAgICAgICAgUmVmOiAnTXlER1NlcnZpY2VSb2xlNUU5NEZEODgnLFxuICAgICAgfV0sXG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFt7XG4gICAgICAgICAgQWN0aW9uOiAnbGFtYmRhOkludm9rZUZ1bmN0aW9uJyxcbiAgICAgICAgICBSZXNvdXJjZTogW1xuICAgICAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnUHJlSG9vazhCNTNGNjcyJywgJ0FybiddIH0sXG4gICAgICAgICAgICB7ICdGbjo6Sm9pbic6IFsnJywgW3sgJ0ZuOjpHZXRBdHQnOiBbJ1ByZUhvb2s4QjUzRjY3MicsICdBcm4nXSB9LCAnOionXV0gfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgfV0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBydW4gcG9zdCBob29rIGxhbWJkYSBmdW5jdGlvbiBiZWZvcmUgZGVwbG95bWVudCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcHBsaWNhdGlvbiA9IG5ldyBjb2RlZGVwbG95LkxhbWJkYUFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHAnKTtcbiAgICBjb25zdCBhbGlhcyA9IG1vY2tBbGlhcyhzdGFjayk7XG4gICAgbmV3IGNvZGVkZXBsb3kuTGFtYmRhRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGFwcGxpY2F0aW9uLFxuICAgICAgYWxpYXMsXG4gICAgICBwb3N0SG9vazogbW9ja0Z1bmN0aW9uKHN0YWNrLCAnUG9zdEhvb2snKSxcbiAgICAgIGRlcGxveW1lbnRDb25maWc6IGNvZGVkZXBsb3kuTGFtYmRhRGVwbG95bWVudENvbmZpZy5BTExfQVRfT05DRSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6TGFtYmRhOjpBbGlhcycsIHtcbiAgICAgIFVwZGF0ZVBvbGljeToge1xuICAgICAgICBDb2RlRGVwbG95TGFtYmRhQWxpYXNVcGRhdGU6IHtcbiAgICAgICAgICBBcHBsaWNhdGlvbk5hbWU6IHtcbiAgICAgICAgICAgIFJlZjogJ015QXBwM0NFMzFDMjYnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRGVwbG95bWVudEdyb3VwTmFtZToge1xuICAgICAgICAgICAgUmVmOiAnTXlER0MzNTBCRDNGJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIEFmdGVyQWxsb3dUcmFmZmljSG9vazoge1xuICAgICAgICAgICAgUmVmOiAnUG9zdEhvb2tGMkU0OUIzMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeU5hbWU6ICdNeURHU2VydmljZVJvbGVEZWZhdWx0UG9saWN5NjVFOEUxRUEnLFxuICAgICAgUm9sZXM6IFt7XG4gICAgICAgIFJlZjogJ015REdTZXJ2aWNlUm9sZTVFOTRGRDg4JyxcbiAgICAgIH1dLFxuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbe1xuICAgICAgICAgIEFjdGlvbjogJ2xhbWJkYTpJbnZva2VGdW5jdGlvbicsXG4gICAgICAgICAgUmVzb3VyY2U6IFtcbiAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ1Bvc3RIb29rRjJFNDlCMzAnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgIHsgJ0ZuOjpKb2luJzogWycnLCBbeyAnRm46OkdldEF0dCc6IFsnUG9zdEhvb2tGMkU0OUIzMCcsICdBcm4nXSB9LCAnOionXV0gfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgfV0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBhZGQgcG9zdCBob29rIGxhbWJkYSBmdW5jdGlvbiBhZnRlciBjcmVhdGluZyB0aGUgZGVwbG95bWVudCBncm91cCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcHBsaWNhdGlvbiA9IG5ldyBjb2RlZGVwbG95LkxhbWJkYUFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHAnKTtcbiAgICBjb25zdCBhbGlhcyA9IG1vY2tBbGlhcyhzdGFjayk7XG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgY29kZWRlcGxveS5MYW1iZGFEZXBsb3ltZW50R3JvdXAoc3RhY2ssICdNeURHJywge1xuICAgICAgYXBwbGljYXRpb24sXG4gICAgICBhbGlhcyxcbiAgICAgIGRlcGxveW1lbnRDb25maWc6IGNvZGVkZXBsb3kuTGFtYmRhRGVwbG95bWVudENvbmZpZy5BTExfQVRfT05DRSxcbiAgICB9KTtcbiAgICBncm91cC5hZGRQb3N0SG9vayhtb2NrRnVuY3Rpb24oc3RhY2ssICdQb3N0SG9vaycpKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6TGFtYmRhOjpBbGlhcycsIHtcbiAgICAgIFVwZGF0ZVBvbGljeToge1xuICAgICAgICBDb2RlRGVwbG95TGFtYmRhQWxpYXNVcGRhdGU6IHtcbiAgICAgICAgICBBcHBsaWNhdGlvbk5hbWU6IHtcbiAgICAgICAgICAgIFJlZjogJ015QXBwM0NFMzFDMjYnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRGVwbG95bWVudEdyb3VwTmFtZToge1xuICAgICAgICAgICAgUmVmOiAnTXlER0MzNTBCRDNGJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIEFmdGVyQWxsb3dUcmFmZmljSG9vazoge1xuICAgICAgICAgICAgUmVmOiAnUG9zdEhvb2tGMkU0OUIzMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeU5hbWU6ICdNeURHU2VydmljZVJvbGVEZWZhdWx0UG9saWN5NjVFOEUxRUEnLFxuICAgICAgUm9sZXM6IFt7XG4gICAgICAgIFJlZjogJ015REdTZXJ2aWNlUm9sZTVFOTRGRDg4JyxcbiAgICAgIH1dLFxuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbe1xuICAgICAgICAgIEFjdGlvbjogJ2xhbWJkYTpJbnZva2VGdW5jdGlvbicsXG4gICAgICAgICAgUmVzb3VyY2U6IFtcbiAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ1Bvc3RIb29rRjJFNDlCMzAnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgIHsgJ0ZuOjpKb2luJzogWycnLCBbeyAnRm46OkdldEF0dCc6IFsnUG9zdEhvb2tGMkU0OUIzMCcsICdBcm4nXSB9LCAnOionXV0gfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgfV0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBkaXNhYmxlIHJvbGxiYWNrIHdoZW4gYWxhcm0gcG9sbGluZyBmYWlscycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcHBsaWNhdGlvbiA9IG5ldyBjb2RlZGVwbG95LkxhbWJkYUFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHAnKTtcbiAgICBjb25zdCBhbGlhcyA9IG1vY2tBbGlhcyhzdGFjayk7XG4gICAgbmV3IGNvZGVkZXBsb3kuTGFtYmRhRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGFwcGxpY2F0aW9uLFxuICAgICAgYWxpYXMsXG4gICAgICBwb3N0SG9vazogbW9ja0Z1bmN0aW9uKHN0YWNrLCAnUG9zdEhvb2snKSxcbiAgICAgIGRlcGxveW1lbnRDb25maWc6IGNvZGVkZXBsb3kuTGFtYmRhRGVwbG95bWVudENvbmZpZy5BTExfQVRfT05DRSxcbiAgICAgIGlnbm9yZVBvbGxBbGFybXNGYWlsdXJlOiB0cnVlLFxuICAgICAgYWxhcm1zOiBbbmV3IGNsb3Vkd2F0Y2guQWxhcm0oc3RhY2ssICdGYWlsdXJlcycsIHtcbiAgICAgICAgbWV0cmljOiBhbGlhcy5tZXRyaWNFcnJvcnMoKSxcbiAgICAgICAgY29tcGFyaXNvbk9wZXJhdG9yOiBjbG91ZHdhdGNoLkNvbXBhcmlzb25PcGVyYXRvci5HUkVBVEVSX1RIQU5fVEhSRVNIT0xELFxuICAgICAgICB0aHJlc2hvbGQ6IDEsXG4gICAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICAgICAgfSldLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZURlcGxveTo6RGVwbG95bWVudEdyb3VwJywge1xuICAgICAgQWxhcm1Db25maWd1cmF0aW9uOiB7XG4gICAgICAgIEFsYXJtczogW3tcbiAgICAgICAgICBOYW1lOiB7XG4gICAgICAgICAgICBSZWY6ICdGYWlsdXJlczhBM0UxQTJGJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9XSxcbiAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgSWdub3JlUG9sbEFsYXJtRmFpbHVyZTogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBkaXNhYmxlIHJvbGxiYWNrIHdoZW4gZGVwbG95bWVudCBmYWlscycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcHBsaWNhdGlvbiA9IG5ldyBjb2RlZGVwbG95LkxhbWJkYUFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHAnKTtcbiAgICBjb25zdCBhbGlhcyA9IG1vY2tBbGlhcyhzdGFjayk7XG4gICAgbmV3IGNvZGVkZXBsb3kuTGFtYmRhRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGFwcGxpY2F0aW9uLFxuICAgICAgYWxpYXMsXG4gICAgICBwb3N0SG9vazogbW9ja0Z1bmN0aW9uKHN0YWNrLCAnUG9zdEhvb2snKSxcbiAgICAgIGRlcGxveW1lbnRDb25maWc6IGNvZGVkZXBsb3kuTGFtYmRhRGVwbG95bWVudENvbmZpZy5BTExfQVRfT05DRSxcbiAgICAgIGF1dG9Sb2xsYmFjazoge1xuICAgICAgICBmYWlsZWREZXBsb3ltZW50OiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlRGVwbG95OjpEZXBsb3ltZW50R3JvdXAnLCB7XG4gICAgICBBcHBsaWNhdGlvbk5hbWU6IHtcbiAgICAgICAgUmVmOiAnTXlBcHAzQ0UzMUMyNicsXG4gICAgICB9LFxuICAgICAgU2VydmljZVJvbGVBcm46IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ015REdTZXJ2aWNlUm9sZTVFOTRGRDg4JyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBEZXBsb3ltZW50Q29uZmlnTmFtZTogJ0NvZGVEZXBsb3lEZWZhdWx0LkxhbWJkYUFsbEF0T25jZScsXG4gICAgICBEZXBsb3ltZW50U3R5bGU6IHtcbiAgICAgICAgRGVwbG95bWVudE9wdGlvbjogJ1dJVEhfVFJBRkZJQ19DT05UUk9MJyxcbiAgICAgICAgRGVwbG95bWVudFR5cGU6ICdCTFVFX0dSRUVOJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBlbmFibGUgcm9sbGJhY2sgd2hlbiBkZXBsb3ltZW50IHN0b3BzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwcGxpY2F0aW9uID0gbmV3IGNvZGVkZXBsb3kuTGFtYmRhQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcCcpO1xuICAgIGNvbnN0IGFsaWFzID0gbW9ja0FsaWFzKHN0YWNrKTtcbiAgICBuZXcgY29kZWRlcGxveS5MYW1iZGFEZXBsb3ltZW50R3JvdXAoc3RhY2ssICdNeURHJywge1xuICAgICAgYXBwbGljYXRpb24sXG4gICAgICBhbGlhcyxcbiAgICAgIHBvc3RIb29rOiBtb2NrRnVuY3Rpb24oc3RhY2ssICdQb3N0SG9vaycpLFxuICAgICAgZGVwbG95bWVudENvbmZpZzogY29kZWRlcGxveS5MYW1iZGFEZXBsb3ltZW50Q29uZmlnLkFMTF9BVF9PTkNFLFxuICAgICAgYXV0b1JvbGxiYWNrOiB7XG4gICAgICAgIHN0b3BwZWREZXBsb3ltZW50OiB0cnVlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVEZXBsb3k6OkRlcGxveW1lbnRHcm91cCcsIHtcbiAgICAgIEF1dG9Sb2xsYmFja0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgRXZlbnRzOiBbXG4gICAgICAgICAgJ0RFUExPWU1FTlRfRkFJTFVSRScsXG4gICAgICAgICAgJ0RFUExPWU1FTlRfU1RPUF9PTl9SRVFVRVNUJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBkaXNhYmxlIHJvbGxiYWNrIHdoZW4gYWxhcm0gaW4gZmFpbHVyZSBzdGF0ZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcHBsaWNhdGlvbiA9IG5ldyBjb2RlZGVwbG95LkxhbWJkYUFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHAnKTtcbiAgICBjb25zdCBhbGlhcyA9IG1vY2tBbGlhcyhzdGFjayk7XG4gICAgbmV3IGNvZGVkZXBsb3kuTGFtYmRhRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGFwcGxpY2F0aW9uLFxuICAgICAgYWxpYXMsXG4gICAgICBwb3N0SG9vazogbW9ja0Z1bmN0aW9uKHN0YWNrLCAnUG9zdEhvb2snKSxcbiAgICAgIGRlcGxveW1lbnRDb25maWc6IGNvZGVkZXBsb3kuTGFtYmRhRGVwbG95bWVudENvbmZpZy5BTExfQVRfT05DRSxcbiAgICAgIGF1dG9Sb2xsYmFjazoge1xuICAgICAgICBkZXBsb3ltZW50SW5BbGFybTogZmFsc2UsXG4gICAgICB9LFxuICAgICAgYWxhcm1zOiBbbmV3IGNsb3Vkd2F0Y2guQWxhcm0oc3RhY2ssICdGYWlsdXJlcycsIHtcbiAgICAgICAgbWV0cmljOiBhbGlhcy5tZXRyaWNFcnJvcnMoKSxcbiAgICAgICAgY29tcGFyaXNvbk9wZXJhdG9yOiBjbG91ZHdhdGNoLkNvbXBhcmlzb25PcGVyYXRvci5HUkVBVEVSX1RIQU5fVEhSRVNIT0xELFxuICAgICAgICB0aHJlc2hvbGQ6IDEsXG4gICAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICAgICAgfSldLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZURlcGxveTo6RGVwbG95bWVudEdyb3VwJywge1xuICAgICAgQXV0b1JvbGxiYWNrQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBFbmFibGVkOiB0cnVlLFxuICAgICAgICBFdmVudHM6IFtcbiAgICAgICAgICAnREVQTE9ZTUVOVF9GQUlMVVJFJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3VzZXMgdGhlIGNvcnJlY3QgU2VydmljZSBQcmluY2lwYWwgaW4gdGhlIHVzLWlzb2ItZWFzdC0xIHJlZ2lvbicsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdDb2RlRGVwbG95TGFtYmRhU3RhY2snLCB7XG4gICAgICBlbnY6IHsgcmVnaW9uOiAndXMtaXNvYi1lYXN0LTEnIH0sXG4gICAgfSk7XG4gICAgY29uc3QgYWxpYXMgPSBtb2NrQWxpYXMoc3RhY2spO1xuICAgIG5ldyBjb2RlZGVwbG95LkxhbWJkYURlcGxveW1lbnRHcm91cChzdGFjaywgJ015REcnLCB7XG4gICAgICBhbGlhcyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgU2VydmljZTogJ2NvZGVkZXBsb3kuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdkZXBsb3ltZW50R3JvdXAgZnJvbSBBUk4gaW4gZGlmZmVyZW50IGFjY291bnQgYW5kIHJlZ2lvbicsICgpID0+IHtcbiAgICBsZXQgc3RhY2s6IFN0YWNrO1xuICAgIGxldCBhcHBsaWNhdGlvbjogY29kZWRlcGxveS5JTGFtYmRhQXBwbGljYXRpb247XG4gICAgbGV0IGdyb3VwOiBjb2RlZGVwbG95LklMYW1iZGFEZXBsb3ltZW50R3JvdXA7XG5cbiAgICBjb25zdCBhY2NvdW50ID0gJzIyMjIyMjIyMjIyMic7XG4gICAgY29uc3QgcmVnaW9uID0gJ3RoZXJlZ2lvbi0xJztcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgJ1N0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzExMTExMTExMTExMScsIHJlZ2lvbjogJ2JsYWJsYS0xJyB9IH0pO1xuXG4gICAgICBhcHBsaWNhdGlvbiA9IGNvZGVkZXBsb3kuTGFtYmRhQXBwbGljYXRpb24uZnJvbUxhbWJkYUFwcGxpY2F0aW9uQXJuKHN0YWNrLCAnQXBwbGljYXRpb24nLCBgYXJuOmF3czpjb2RlZGVwbG95OiR7cmVnaW9ufToke2FjY291bnR9OmFwcGxpY2F0aW9uOk15QXBwbGljYXRpb25gKTtcbiAgICAgIGdyb3VwID0gY29kZWRlcGxveS5MYW1iZGFEZXBsb3ltZW50R3JvdXAuZnJvbUxhbWJkYURlcGxveW1lbnRHcm91cEF0dHJpYnV0ZXMoc3RhY2ssICdHcm91cCcsIHtcbiAgICAgICAgYXBwbGljYXRpb24sXG4gICAgICAgIGRlcGxveW1lbnRHcm91cE5hbWU6ICdEZXBsb3ltZW50R3JvdXAnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdrbm93cyBpdHMgYWNjb3VudCBhbmQgcmVnaW9uJywgKCkgPT4ge1xuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGFwcGxpY2F0aW9uLmVudikudG9FcXVhbChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IGFjY291bnQsIHJlZ2lvbiB9KSk7XG4gICAgICBleHBlY3QoZ3JvdXAuZW52KS50b0VxdWFsKGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgYWNjb3VudCwgcmVnaW9uIH0pKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3JlZmVyZW5jZXMgdGhlIHByZWRlZmluZWQgRGVwbG95bWVudEdyb3VwQ29uZmlnIGluIHRoZSByaWdodCByZWdpb24nLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZ3JvdXAuZGVwbG95bWVudENvbmZpZy5kZXBsb3ltZW50Q29uZmlnQXJuKS50b0VxdWFsKGV4cGVjdC5zdHJpbmdDb250YWluaW5nKFxuICAgICAgICBgOmNvZGVkZXBsb3k6JHtyZWdpb259OiR7YWNjb3VudH06ZGVwbG95bWVudGNvbmZpZzpDb2RlRGVwbG95RGVmYXVsdC5MYW1iZGFDYW5hcnkxMFBlcmNlbnQ1TWludXRlc2AsXG4gICAgICApKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2ltcG9ydGVkIHdpdGggZnJvbUxhbWJkYURlcGxveW1lbnRHcm91cEF0dHJpYnV0ZXMnLCAoKSA9PiB7XG4gIHRlc3QoJ2RlZmF1bHRzIHRoZSBEZXBsb3ltZW50IENvbmZpZyB0byBDYW5hcnkxMFBlcmNlbnQ1TWludXRlcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGxhbWJkYUFwcCA9IGNvZGVkZXBsb3kuTGFtYmRhQXBwbGljYXRpb24uZnJvbUxhbWJkYUFwcGxpY2F0aW9uTmFtZShzdGFjaywgJ0xBJywgJ0xhbWJkYUFwcGxpY2F0aW9uJyk7XG4gICAgY29uc3QgaW1wb3J0ZWRHcm91cCA9IGNvZGVkZXBsb3kuTGFtYmRhRGVwbG95bWVudEdyb3VwLmZyb21MYW1iZGFEZXBsb3ltZW50R3JvdXBBdHRyaWJ1dGVzKHN0YWNrLCAnTERHJywge1xuICAgICAgYXBwbGljYXRpb246IGxhbWJkYUFwcCxcbiAgICAgIGRlcGxveW1lbnRHcm91cE5hbWU6ICdMYW1iZGFEZXBsb3ltZW50R3JvdXAnLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KGltcG9ydGVkR3JvdXAuZGVwbG95bWVudENvbmZpZy5kZXBsb3ltZW50Q29uZmlnTmFtZSkudG9FcXVhbCgnQ29kZURlcGxveURlZmF1bHQuTGFtYmRhQ2FuYXJ5MTBQZXJjZW50NU1pbnV0ZXMnKTtcbiAgfSk7XG59KTtcblxudGVzdCgnZGVwZW5kZW5jeSBvbiB0aGUgY29uZmlnIGV4aXN0cyB0byBlbnN1cmUgb3JkZXJpbmcnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IGFwcGxpY2F0aW9uID0gbmV3IGNvZGVkZXBsb3kuTGFtYmRhQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcCcpO1xuICBjb25zdCBhbGlhcyA9IG1vY2tBbGlhcyhzdGFjayk7XG4gIGNvbnN0IGNvbmZpZyA9IG5ldyBjb2RlZGVwbG95LkxhbWJkYURlcGxveW1lbnRDb25maWcoc3RhY2ssICdNeUNvbmZpZycsIHtcbiAgICB0cmFmZmljUm91dGluZzogVHJhZmZpY1JvdXRpbmcudGltZUJhc2VkQ2FuYXJ5KHtcbiAgICAgIGludGVydmFsOiBjZGsuRHVyYXRpb24ubWludXRlcygxKSxcbiAgICAgIHBlcmNlbnRhZ2U6IDUsXG4gICAgfSksXG4gIH0pO1xuICBuZXcgY29kZWRlcGxveS5MYW1iZGFEZXBsb3ltZW50R3JvdXAoc3RhY2ssICdNeURHJywge1xuICAgIGFwcGxpY2F0aW9uLFxuICAgIGFsaWFzLFxuICAgIGRlcGxveW1lbnRDb25maWc6IGNvbmZpZyxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkNvZGVEZXBsb3k6OkRlcGxveW1lbnRHcm91cCcsIHtcbiAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICBEZXBsb3ltZW50Q29uZmlnTmFtZTogc3RhY2sucmVzb2x2ZShjb25maWcuZGVwbG95bWVudENvbmZpZ05hbWUpLFxuICAgIH0sXG4gICAgRGVwZW5kc09uOiBbXG4gICAgICBzdGFjay5nZXRMb2dpY2FsSWQoY29uZmlnLm5vZGUuZGVmYXVsdENoaWxkIGFzIGNvZGVkZXBsb3kuQ2ZuRGVwbG95bWVudENvbmZpZyksXG4gICAgXSxcbiAgfSk7XG59KTtcbiJdfQ==