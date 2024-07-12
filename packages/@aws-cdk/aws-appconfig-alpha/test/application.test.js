"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const assertions_1 = require("aws-cdk-lib/assertions");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const lib_1 = require("../lib");
describe('appconfig', () => {
    test('basic appconfig', () => {
        const stack = new cdk.Stack();
        new lib_1.Application(stack, 'MyAppConfig');
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Application', {
            Name: 'MyAppConfig',
        });
    });
    test('appconfig with name', () => {
        const stack = new cdk.Stack();
        new lib_1.Application(stack, 'MyAppConfig', {
            applicationName: 'TestApp',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Application', {
            Name: 'TestApp',
        });
    });
    test('appconfig with description', () => {
        const stack = new cdk.Stack();
        new lib_1.Application(stack, 'MyAppConfig', {
            description: 'This is my description',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Application', {
            Name: 'MyAppConfig',
            Description: 'This is my description',
        });
    });
    test('get lambda layer arn', () => {
        expect(lib_1.Application.getLambdaLayerVersionArn('us-east-1')).toEqual('arn:aws:lambda:us-east-1:027255383542:layer:AWS-AppConfig-Extension:128');
        expect(lib_1.Application.getLambdaLayerVersionArn('us-east-1', lib_1.Platform.ARM_64)).toEqual('arn:aws:lambda:us-east-1:027255383542:layer:AWS-AppConfig-Extension-Arm64:61');
    });
    test('add agent to ecs', () => {
        const stack = new cdk.Stack();
        const taskDef = new aws_ecs_1.FargateTaskDefinition(stack, 'TaskDef');
        lib_1.Application.addAgentToEcs(taskDef);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                {
                    Image: 'public.ecr.aws/aws-appconfig/aws-appconfig-agent:latest',
                    Name: 'AppConfigAgentContainer',
                    Essential: true,
                },
            ],
        });
    });
    test('specifying action point for extensible action on', () => {
        const stack = new cdk.Stack();
        const appconfig = new lib_1.Application(stack, 'MyAppConfig');
        const func = new aws_lambda_1.Function(stack, 'MyFunc', {
            handler: 'index.handler',
            runtime: aws_lambda_1.Runtime.PYTHON_3_7,
            code: aws_lambda_1.Code.fromInline('# this is my code'),
        });
        appconfig.on(lib_1.ActionPoint.ON_DEPLOYMENT_STEP, new lib_1.LambdaDestination(func));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
            Name: 'MyAppConfig-Extension',
            Actions: {
                ON_DEPLOYMENT_STEP: [
                    {
                        Name: 'MyAppConfig-Extension-0',
                        RoleArn: { 'Fn::GetAtt': ['MyAppConfigExtensionF845ERole0D30970E5A7E5', 'Arn'] },
                        Uri: { 'Fn::GetAtt': ['MyFunc8A243A2C', 'Arn'] },
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ExtensionAssociation', {
            ExtensionIdentifier: {
                'Fn::GetAtt': ['MyAppConfigExtensionF845EC11D4079', 'Id'],
            },
            ExtensionVersionNumber: {
                'Fn::GetAtt': ['MyAppConfigExtensionF845EC11D4079', 'VersionNumber'],
            },
            ResourceIdentifier: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':appconfig:',
                        { Ref: 'AWS::Region' },
                        ':',
                        { Ref: 'AWS::AccountId' },
                        ':application/',
                        { Ref: 'MyAppConfigB4B63E75' },
                    ],
                ],
            },
        });
    });
    test('pre create hosted configuration version', () => {
        const stack = new cdk.Stack();
        const appconfig = new lib_1.Application(stack, 'MyAppConfig');
        const func = new aws_lambda_1.Function(stack, 'MyFunc', {
            handler: 'index.handler',
            runtime: aws_lambda_1.Runtime.PYTHON_3_7,
            code: aws_lambda_1.Code.fromInline('# this is my code'),
        });
        appconfig.preCreateHostedConfigurationVersion(new lib_1.LambdaDestination(func), {
            description: 'This is my description',
            extensionName: 'MyExtension',
            latestVersionNumber: 1,
            parameters: [
                lib_1.Parameter.required('myparam', 'val'),
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
            Name: 'MyExtension',
            Description: 'This is my description',
            LatestVersionNumber: 1,
            Actions: {
                PRE_CREATE_HOSTED_CONFIGURATION_VERSION: [
                    {
                        Name: 'MyExtension-0',
                        RoleArn: { 'Fn::GetAtt': ['MyAppConfigExtensionE4CCERole467D69791333F', 'Arn'] },
                        Uri: { 'Fn::GetAtt': ['MyFunc8A243A2C', 'Arn'] },
                    },
                ],
            },
            Parameters: {
                myparam: { Required: true },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ExtensionAssociation', {
            ExtensionIdentifier: {
                'Fn::GetAtt': ['MyAppConfigExtensionE4CCE34485313', 'Id'],
            },
            ExtensionVersionNumber: {
                'Fn::GetAtt': ['MyAppConfigExtensionE4CCE34485313', 'VersionNumber'],
            },
            Parameters: {
                myparam: 'val',
            },
            ResourceIdentifier: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':appconfig:',
                        { Ref: 'AWS::Region' },
                        ':',
                        { Ref: 'AWS::AccountId' },
                        ':application/',
                        { Ref: 'MyAppConfigB4B63E75' },
                    ],
                ],
            },
        });
    });
    test('pre start deployment', () => {
        const stack = new cdk.Stack();
        const appconfig = new lib_1.Application(stack, 'MyAppConfig');
        const func = new aws_lambda_1.Function(stack, 'MyFunc', {
            handler: 'index.handler',
            runtime: aws_lambda_1.Runtime.PYTHON_3_7,
            code: aws_lambda_1.Code.fromInline('# this is my code'),
        });
        Object.defineProperty(func, 'functionArn', {
            value: 'arn:lambda:us-east-1:123456789012:function:my-function',
        });
        appconfig.preStartDeployment(new lib_1.LambdaDestination(func));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
            Name: 'MyAppConfig-Extension',
            Actions: {
                PRE_START_DEPLOYMENT: [
                    {
                        Name: 'MyAppConfig-Extension-0',
                        RoleArn: { 'Fn::GetAtt': ['MyAppConfigExtensionF845ERole0D30970E5A7E5', 'Arn'] },
                        Uri: 'arn:lambda:us-east-1:123456789012:function:my-function',
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ExtensionAssociation', {
            ExtensionIdentifier: {
                'Fn::GetAtt': ['MyAppConfigExtensionF845EC11D4079', 'Id'],
            },
            ExtensionVersionNumber: {
                'Fn::GetAtt': ['MyAppConfigExtensionF845EC11D4079', 'VersionNumber'],
            },
            ResourceIdentifier: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':appconfig:',
                        { Ref: 'AWS::Region' },
                        ':',
                        { Ref: 'AWS::AccountId' },
                        ':application/',
                        { Ref: 'MyAppConfigB4B63E75' },
                    ],
                ],
            },
        });
    });
    test('on deployment start', () => {
        const stack = new cdk.Stack();
        const appconfig = new lib_1.Application(stack, 'MyAppConfig');
        Object.defineProperty(appconfig, 'applicationArn', {
            value: 'arn:aws:appconfig:us-east-1:123456789012:application/abc123',
        });
        const func = new aws_lambda_1.Function(stack, 'MyFunc', {
            handler: 'index.handler',
            runtime: aws_lambda_1.Runtime.PYTHON_3_7,
            code: aws_lambda_1.Code.fromInline('# this is my code'),
        });
        Object.defineProperty(func, 'functionArn', {
            value: 'arn:lambda:us-east-1:123456789012:function:my-function',
        });
        appconfig.onDeploymentStart(new lib_1.LambdaDestination(func));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
            Name: 'MyAppConfig-Extension',
            Actions: {
                ON_DEPLOYMENT_START: [
                    {
                        Name: 'MyAppConfig-Extension-0',
                        RoleArn: { 'Fn::GetAtt': ['MyAppConfigExtensionF845ERole0D30970E5A7E5', 'Arn'] },
                        Uri: 'arn:lambda:us-east-1:123456789012:function:my-function',
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ExtensionAssociation', {
            ExtensionIdentifier: {
                'Fn::GetAtt': ['MyAppConfigExtensionF845EC11D4079', 'Id'],
            },
            ExtensionVersionNumber: {
                'Fn::GetAtt': ['MyAppConfigExtensionF845EC11D4079', 'VersionNumber'],
            },
            ResourceIdentifier: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':appconfig:',
                        { Ref: 'AWS::Region' },
                        ':',
                        { Ref: 'AWS::AccountId' },
                        ':application/',
                        { Ref: 'MyAppConfigB4B63E75' },
                    ],
                ],
            },
        });
    });
    test('on deployment step', () => {
        const stack = new cdk.Stack();
        const appconfig = new lib_1.Application(stack, 'MyAppConfig');
        const func = new aws_lambda_1.Function(stack, 'MyFunc', {
            handler: 'index.handler',
            runtime: aws_lambda_1.Runtime.PYTHON_3_7,
            code: aws_lambda_1.Code.fromInline('# this is my code'),
        });
        Object.defineProperty(func, 'functionArn', {
            value: 'arn:lambda:us-east-1:123456789012:function:my-function',
        });
        appconfig.onDeploymentStep(new lib_1.LambdaDestination(func));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
            Name: 'MyAppConfig-Extension',
            Actions: {
                ON_DEPLOYMENT_STEP: [
                    {
                        Name: 'MyAppConfig-Extension-0',
                        RoleArn: { 'Fn::GetAtt': ['MyAppConfigExtensionF845ERole0D30970E5A7E5', 'Arn'] },
                        Uri: 'arn:lambda:us-east-1:123456789012:function:my-function',
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ExtensionAssociation', {
            ExtensionIdentifier: {
                'Fn::GetAtt': ['MyAppConfigExtensionF845EC11D4079', 'Id'],
            },
            ExtensionVersionNumber: {
                'Fn::GetAtt': ['MyAppConfigExtensionF845EC11D4079', 'VersionNumber'],
            },
            ResourceIdentifier: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':appconfig:',
                        { Ref: 'AWS::Region' },
                        ':',
                        { Ref: 'AWS::AccountId' },
                        ':application/',
                        { Ref: 'MyAppConfigB4B63E75' },
                    ],
                ],
            },
        });
    });
    test('on deployment complete', () => {
        const stack = new cdk.Stack();
        const appconfig = new lib_1.Application(stack, 'MyAppConfig');
        const func = new aws_lambda_1.Function(stack, 'MyFunc', {
            handler: 'index.handler',
            runtime: aws_lambda_1.Runtime.PYTHON_3_7,
            code: aws_lambda_1.Code.fromInline('# this is my code'),
        });
        Object.defineProperty(func, 'functionArn', {
            value: 'arn:lambda:us-east-1:123456789012:function:my-function',
        });
        appconfig.onDeploymentComplete(new lib_1.LambdaDestination(func));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
            Name: 'MyAppConfig-Extension',
            Actions: {
                ON_DEPLOYMENT_COMPLETE: [
                    {
                        Name: 'MyAppConfig-Extension-0',
                        RoleArn: { 'Fn::GetAtt': ['MyAppConfigExtensionF845ERole0D30970E5A7E5', 'Arn'] },
                        Uri: 'arn:lambda:us-east-1:123456789012:function:my-function',
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ExtensionAssociation', {
            ExtensionIdentifier: {
                'Fn::GetAtt': ['MyAppConfigExtensionF845EC11D4079', 'Id'],
            },
            ExtensionVersionNumber: {
                'Fn::GetAtt': ['MyAppConfigExtensionF845EC11D4079', 'VersionNumber'],
            },
            ResourceIdentifier: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':appconfig:',
                        { Ref: 'AWS::Region' },
                        ':',
                        { Ref: 'AWS::AccountId' },
                        ':application/',
                        { Ref: 'MyAppConfigB4B63E75' },
                    ],
                ],
            },
        });
    });
    test('on deployment bake', () => {
        const stack = new cdk.Stack();
        const appconfig = new lib_1.Application(stack, 'MyAppConfig');
        const func = new aws_lambda_1.Function(stack, 'MyFunc', {
            handler: 'index.handler',
            runtime: aws_lambda_1.Runtime.PYTHON_3_7,
            code: aws_lambda_1.Code.fromInline('# this is my code'),
        });
        Object.defineProperty(func, 'functionArn', {
            value: 'arn:lambda:us-east-1:123456789012:function:my-function',
        });
        appconfig.onDeploymentBaking(new lib_1.LambdaDestination(func));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
            Name: 'MyAppConfig-Extension',
            Actions: {
                ON_DEPLOYMENT_BAKING: [
                    {
                        Name: 'MyAppConfig-Extension-0',
                        RoleArn: { 'Fn::GetAtt': ['MyAppConfigExtensionF845ERole0D30970E5A7E5', 'Arn'] },
                        Uri: 'arn:lambda:us-east-1:123456789012:function:my-function',
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ExtensionAssociation', {
            ExtensionIdentifier: {
                'Fn::GetAtt': ['MyAppConfigExtensionF845EC11D4079', 'Id'],
            },
            ExtensionVersionNumber: {
                'Fn::GetAtt': ['MyAppConfigExtensionF845EC11D4079', 'VersionNumber'],
            },
            ResourceIdentifier: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':appconfig:',
                        { Ref: 'AWS::Region' },
                        ':',
                        { Ref: 'AWS::AccountId' },
                        ':application/',
                        { Ref: 'MyAppConfigB4B63E75' },
                    ],
                ],
            },
        });
    });
    test('on deployment rolled back', () => {
        const stack = new cdk.Stack();
        const appconfig = new lib_1.Application(stack, 'MyAppConfig');
        const func = new aws_lambda_1.Function(stack, 'MyFunc', {
            handler: 'index.handler',
            runtime: aws_lambda_1.Runtime.PYTHON_3_7,
            code: aws_lambda_1.Code.fromInline('# this is my code'),
        });
        Object.defineProperty(func, 'functionArn', {
            value: 'arn:lambda:us-east-1:123456789012:function:my-function',
        });
        appconfig.onDeploymentRolledBack(new lib_1.LambdaDestination(func));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
            Name: 'MyAppConfig-Extension',
            Actions: {
                ON_DEPLOYMENT_ROLLED_BACK: [
                    {
                        Name: 'MyAppConfig-Extension-0',
                        RoleArn: { 'Fn::GetAtt': ['MyAppConfigExtensionF845ERole0D30970E5A7E5', 'Arn'] },
                        Uri: 'arn:lambda:us-east-1:123456789012:function:my-function',
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ExtensionAssociation', {
            ExtensionIdentifier: {
                'Fn::GetAtt': ['MyAppConfigExtensionF845EC11D4079', 'Id'],
            },
            ExtensionVersionNumber: {
                'Fn::GetAtt': ['MyAppConfigExtensionF845EC11D4079', 'VersionNumber'],
            },
            ResourceIdentifier: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':appconfig:',
                        { Ref: 'AWS::Region' },
                        ':',
                        { Ref: 'AWS::AccountId' },
                        ':application/',
                        { Ref: 'MyAppConfigB4B63E75' },
                    ],
                ],
            },
        });
    });
    test('create same extension twice', () => {
        const stack = new cdk.Stack();
        const appconfig = new lib_1.Application(stack, 'MyAppConfig');
        const func = new aws_lambda_1.Function(stack, 'MyFunc', {
            handler: 'index.handler',
            runtime: aws_lambda_1.Runtime.PYTHON_3_7,
            code: aws_lambda_1.Code.fromInline('# this is my code'),
        });
        Object.defineProperty(func, 'functionArn', {
            value: 'arn:lambda:us-east-1:123456789012:function:my-function',
        });
        appconfig.preStartDeployment(new lib_1.LambdaDestination(func));
        expect(() => {
            appconfig.preStartDeployment(new lib_1.LambdaDestination(func));
        }).toThrow();
    });
    test('from application arn', () => {
        const stack = new cdk.Stack();
        const app = lib_1.Application.fromApplicationArn(stack, 'Application', 'arn:aws:appconfig:us-west-2:123456789012:application/abc123');
        expect(app.applicationId).toEqual('abc123');
    });
    test('from application arn with no resource name', () => {
        const stack = new cdk.Stack();
        expect(() => {
            lib_1.Application.fromApplicationArn(stack, 'Application', 'arn:aws:appconfig:us-west-2:123456789012:application/');
        }).toThrow('Missing required application id from application ARN');
    });
    test('from application id', () => {
        const cdkApp = new cdk.App();
        const stack = new cdk.Stack(cdkApp, 'Stack', {
            env: {
                region: 'us-west-2',
                account: '123456789012',
            },
        });
        const app = lib_1.Application.fromApplicationId(stack, 'Application', 'abc123');
        expect(app.applicationId).toEqual('abc123');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcGxpY2F0aW9uLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsdURBQWtEO0FBQ2xELGlEQUE0RDtBQUM1RCx1REFBaUU7QUFDakUsZ0NBTWdCO0FBRWhCLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO0lBQ3pCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7UUFDM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztRQUV0QyxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw2QkFBNkIsRUFBRTtZQUM3RSxJQUFJLEVBQUUsYUFBYTtTQUNwQixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7UUFDL0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7WUFDcEMsZUFBZSxFQUFFLFNBQVM7U0FDM0IsQ0FBQyxDQUFDO1FBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsNkJBQTZCLEVBQUU7WUFDN0UsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO1FBQ3RDLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLElBQUksaUJBQVcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQ3BD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a0JBQWtCLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFDN0QsNkRBQTZELENBQUMsQ0FBQztRQUVqRSxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7UUFDdEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLGlCQUFXLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFDakQsdURBQXVELENBQUMsQ0FBQztRQUM3RCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsc0RBQXNELENBQUMsQ0FBQztJQUNyRSxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7UUFDL0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDN0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUU7WUFDM0MsR0FBRyxFQUFFO2dCQUNILE1BQU0sRUFBRSxXQUFXO2dCQUNuQixPQUFPLEVBQUUsY0FBYzthQUN4QjtTQUNGLENBQUMsQ0FBQztRQUNILE1BQU0sR0FBRyxHQUFHLGlCQUFXLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUUxRSxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnYXdzLWNkay1saWIvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBGYXJnYXRlVGFza0RlZmluaXRpb24gfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCB7IENvZGUsIEZ1bmN0aW9uLCBSdW50aW1lIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQge1xuICBBcHBsaWNhdGlvbixcbiAgUGxhdGZvcm0sXG4gIExhbWJkYURlc3RpbmF0aW9uLFxuICBQYXJhbWV0ZXIsXG4gIEFjdGlvblBvaW50LFxufSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnYXBwY29uZmlnJywgKCkgPT4ge1xuICB0ZXN0KCdiYXNpYyBhcHBjb25maWcnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IEFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHBDb25maWcnKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6QXBwbGljYXRpb24nLCB7XG4gICAgICBOYW1lOiAnTXlBcHBDb25maWcnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhcHBjb25maWcgd2l0aCBuYW1lJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwQ29uZmlnJywge1xuICAgICAgYXBwbGljYXRpb25OYW1lOiAnVGVzdEFwcCcsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkFwcGxpY2F0aW9uJywge1xuICAgICAgTmFtZTogJ1Rlc3RBcHAnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhcHBjb25maWcgd2l0aCBkZXNjcmlwdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcENvbmZpZycsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyBteSBkZXNjcmlwdGlvbicsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkFwcGxpY2F0aW9uJywge1xuICAgICAgTmFtZTogJ015QXBwQ29uZmlnJyxcbiAgICAgIERlc2NyaXB0aW9uOiAnVGhpcyBpcyBteSBkZXNjcmlwdGlvbicsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dldCBsYW1iZGEgbGF5ZXIgYXJuJywgKCkgPT4ge1xuICAgIGV4cGVjdChBcHBsaWNhdGlvbi5nZXRMYW1iZGFMYXllclZlcnNpb25Bcm4oJ3VzLWVhc3QtMScpKS50b0VxdWFsKCdhcm46YXdzOmxhbWJkYTp1cy1lYXN0LTE6MDI3MjU1MzgzNTQyOmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uOjEyOCcpO1xuICAgIGV4cGVjdChBcHBsaWNhdGlvbi5nZXRMYW1iZGFMYXllclZlcnNpb25Bcm4oJ3VzLWVhc3QtMScsIFBsYXRmb3JtLkFSTV82NCkpLnRvRXF1YWwoJ2Fybjphd3M6bGFtYmRhOnVzLWVhc3QtMTowMjcyNTUzODM1NDI6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb24tQXJtNjQ6NjEnKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkIGFnZW50IHRvIGVjcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB0YXNrRGVmID0gbmV3IEZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcbiAgICBBcHBsaWNhdGlvbi5hZGRBZ2VudFRvRWNzKHRhc2tEZWYpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBJbWFnZTogJ3B1YmxpYy5lY3IuYXdzL2F3cy1hcHBjb25maWcvYXdzLWFwcGNvbmZpZy1hZ2VudDpsYXRlc3QnLFxuICAgICAgICAgIE5hbWU6ICdBcHBDb25maWdBZ2VudENvbnRhaW5lcicsXG4gICAgICAgICAgRXNzZW50aWFsOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc3BlY2lmeWluZyBhY3Rpb24gcG9pbnQgZm9yIGV4dGVuc2libGUgYWN0aW9uIG9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwcGNvbmZpZyA9IG5ldyBBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwQ29uZmlnJyk7XG4gICAgY29uc3QgZnVuYyA9IG5ldyBGdW5jdGlvbihzdGFjaywgJ015RnVuYycsIHtcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuUFlUSE9OXzNfNyxcbiAgICAgIGNvZGU6IENvZGUuZnJvbUlubGluZSgnIyB0aGlzIGlzIG15IGNvZGUnKSxcbiAgICB9KTtcbiAgICBhcHBjb25maWcub24oQWN0aW9uUG9pbnQuT05fREVQTE9ZTUVOVF9TVEVQLCBuZXcgTGFtYmRhRGVzdGluYXRpb24oZnVuYykpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpFeHRlbnNpb24nLCB7XG4gICAgICBOYW1lOiAnTXlBcHBDb25maWctRXh0ZW5zaW9uJyxcbiAgICAgIEFjdGlvbnM6IHtcbiAgICAgICAgT05fREVQTE9ZTUVOVF9TVEVQOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgTmFtZTogJ015QXBwQ29uZmlnLUV4dGVuc2lvbi0wJyxcbiAgICAgICAgICAgIFJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ015QXBwQ29uZmlnRXh0ZW5zaW9uRjg0NUVSb2xlMEQzMDk3MEU1QTdFNScsICdBcm4nXSB9LFxuICAgICAgICAgICAgVXJpOiB7ICdGbjo6R2V0QXR0JzogWydNeUZ1bmM4QTI0M0EyQycsICdBcm4nXSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6RXh0ZW5zaW9uQXNzb2NpYXRpb24nLCB7XG4gICAgICBFeHRlbnNpb25JZGVudGlmaWVyOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogWydNeUFwcENvbmZpZ0V4dGVuc2lvbkY4NDVFQzExRDQwNzknLCAnSWQnXSxcbiAgICAgIH0sXG4gICAgICBFeHRlbnNpb25WZXJzaW9uTnVtYmVyOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogWydNeUFwcENvbmZpZ0V4dGVuc2lvbkY4NDVFQzExRDQwNzknLCAnVmVyc2lvbk51bWJlciddLFxuICAgICAgfSxcbiAgICAgIFJlc291cmNlSWRlbnRpZmllcjoge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICc6YXBwY29uZmlnOicsXG4gICAgICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICc6YXBwbGljYXRpb24vJyxcbiAgICAgICAgICAgIHsgUmVmOiAnTXlBcHBDb25maWdCNEI2M0U3NScgfSxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncHJlIGNyZWF0ZSBob3N0ZWQgY29uZmlndXJhdGlvbiB2ZXJzaW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwcGNvbmZpZyA9IG5ldyBBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwQ29uZmlnJyk7XG4gICAgY29uc3QgZnVuYyA9IG5ldyBGdW5jdGlvbihzdGFjaywgJ015RnVuYycsIHtcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuUFlUSE9OXzNfNyxcbiAgICAgIGNvZGU6IENvZGUuZnJvbUlubGluZSgnIyB0aGlzIGlzIG15IGNvZGUnKSxcbiAgICB9KTtcbiAgICBhcHBjb25maWcucHJlQ3JlYXRlSG9zdGVkQ29uZmlndXJhdGlvblZlcnNpb24obmV3IExhbWJkYURlc3RpbmF0aW9uKGZ1bmMpLCB7XG4gICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgbXkgZGVzY3JpcHRpb24nLFxuICAgICAgZXh0ZW5zaW9uTmFtZTogJ015RXh0ZW5zaW9uJyxcbiAgICAgIGxhdGVzdFZlcnNpb25OdW1iZXI6IDEsXG4gICAgICBwYXJhbWV0ZXJzOiBbXG4gICAgICAgIFBhcmFtZXRlci5yZXF1aXJlZCgnbXlwYXJhbScsICd2YWwnKSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkV4dGVuc2lvbicsIHtcbiAgICAgIE5hbWU6ICdNeUV4dGVuc2lvbicsXG4gICAgICBEZXNjcmlwdGlvbjogJ1RoaXMgaXMgbXkgZGVzY3JpcHRpb24nLFxuICAgICAgTGF0ZXN0VmVyc2lvbk51bWJlcjogMSxcbiAgICAgIEFjdGlvbnM6IHtcbiAgICAgICAgUFJFX0NSRUFURV9IT1NURURfQ09ORklHVVJBVElPTl9WRVJTSU9OOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgTmFtZTogJ015RXh0ZW5zaW9uLTAnLFxuICAgICAgICAgICAgUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnTXlBcHBDb25maWdFeHRlbnNpb25FNENDRVJvbGU0NjdENjk3OTEzMzNGJywgJ0FybiddIH0sXG4gICAgICAgICAgICBVcmk6IHsgJ0ZuOjpHZXRBdHQnOiBbJ015RnVuYzhBMjQzQTJDJywgJ0FybiddIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIG15cGFyYW06IHsgUmVxdWlyZWQ6IHRydWUgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpFeHRlbnNpb25Bc3NvY2lhdGlvbicsIHtcbiAgICAgIEV4dGVuc2lvbklkZW50aWZpZXI6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ015QXBwQ29uZmlnRXh0ZW5zaW9uRTRDQ0UzNDQ4NTMxMycsICdJZCddLFxuICAgICAgfSxcbiAgICAgIEV4dGVuc2lvblZlcnNpb25OdW1iZXI6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ015QXBwQ29uZmlnRXh0ZW5zaW9uRTRDQ0UzNDQ4NTMxMycsICdWZXJzaW9uTnVtYmVyJ10sXG4gICAgICB9LFxuICAgICAgUGFyYW1ldGVyczoge1xuICAgICAgICBteXBhcmFtOiAndmFsJyxcbiAgICAgIH0sXG4gICAgICBSZXNvdXJjZUlkZW50aWZpZXI6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAnOmFwcGNvbmZpZzonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgICAnOmFwcGxpY2F0aW9uLycsXG4gICAgICAgICAgICB7IFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3ByZSBzdGFydCBkZXBsb3ltZW50JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwcGNvbmZpZyA9IG5ldyBBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwQ29uZmlnJyk7XG4gICAgY29uc3QgZnVuYyA9IG5ldyBGdW5jdGlvbihzdGFjaywgJ015RnVuYycsIHtcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuUFlUSE9OXzNfNyxcbiAgICAgIGNvZGU6IENvZGUuZnJvbUlubGluZSgnIyB0aGlzIGlzIG15IGNvZGUnKSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZnVuYywgJ2Z1bmN0aW9uQXJuJywge1xuICAgICAgdmFsdWU6ICdhcm46bGFtYmRhOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6ZnVuY3Rpb246bXktZnVuY3Rpb24nLFxuICAgIH0pO1xuICAgIGFwcGNvbmZpZy5wcmVTdGFydERlcGxveW1lbnQobmV3IExhbWJkYURlc3RpbmF0aW9uKGZ1bmMpKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6RXh0ZW5zaW9uJywge1xuICAgICAgTmFtZTogJ015QXBwQ29uZmlnLUV4dGVuc2lvbicsXG4gICAgICBBY3Rpb25zOiB7XG4gICAgICAgIFBSRV9TVEFSVF9ERVBMT1lNRU5UOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgTmFtZTogJ015QXBwQ29uZmlnLUV4dGVuc2lvbi0wJyxcbiAgICAgICAgICAgIFJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ015QXBwQ29uZmlnRXh0ZW5zaW9uRjg0NUVSb2xlMEQzMDk3MEU1QTdFNScsICdBcm4nXSB9LFxuICAgICAgICAgICAgVXJpOiAnYXJuOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkV4dGVuc2lvbkFzc29jaWF0aW9uJywge1xuICAgICAgRXh0ZW5zaW9uSWRlbnRpZmllcjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFsnTXlBcHBDb25maWdFeHRlbnNpb25GODQ1RUMxMUQ0MDc5JywgJ0lkJ10sXG4gICAgICB9LFxuICAgICAgRXh0ZW5zaW9uVmVyc2lvbk51bWJlcjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFsnTXlBcHBDb25maWdFeHRlbnNpb25GODQ1RUMxMUQ0MDc5JywgJ1ZlcnNpb25OdW1iZXInXSxcbiAgICAgIH0sXG4gICAgICBSZXNvdXJjZUlkZW50aWZpZXI6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAnOmFwcGNvbmZpZzonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgICAnOmFwcGxpY2F0aW9uLycsXG4gICAgICAgICAgICB7IFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ29uIGRlcGxveW1lbnQgc3RhcnQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBwY29uZmlnID0gbmV3IEFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHBDb25maWcnKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoYXBwY29uZmlnLCAnYXBwbGljYXRpb25Bcm4nLCB7XG4gICAgICB2YWx1ZTogJ2Fybjphd3M6YXBwY29uZmlnOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6YXBwbGljYXRpb24vYWJjMTIzJyxcbiAgICB9KTtcbiAgICBjb25zdCBmdW5jID0gbmV3IEZ1bmN0aW9uKHN0YWNrLCAnTXlGdW5jJywge1xuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogUnVudGltZS5QWVRIT05fM183LFxuICAgICAgY29kZTogQ29kZS5mcm9tSW5saW5lKCcjIHRoaXMgaXMgbXkgY29kZScpLFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmdW5jLCAnZnVuY3Rpb25Bcm4nLCB7XG4gICAgICB2YWx1ZTogJ2FybjpsYW1iZGE6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpmdW5jdGlvbjpteS1mdW5jdGlvbicsXG4gICAgfSk7XG4gICAgYXBwY29uZmlnLm9uRGVwbG95bWVudFN0YXJ0KG5ldyBMYW1iZGFEZXN0aW5hdGlvbihmdW5jKSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkV4dGVuc2lvbicsIHtcbiAgICAgIE5hbWU6ICdNeUFwcENvbmZpZy1FeHRlbnNpb24nLFxuICAgICAgQWN0aW9uczoge1xuICAgICAgICBPTl9ERVBMT1lNRU5UX1NUQVJUOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgTmFtZTogJ015QXBwQ29uZmlnLUV4dGVuc2lvbi0wJyxcbiAgICAgICAgICAgIFJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ015QXBwQ29uZmlnRXh0ZW5zaW9uRjg0NUVSb2xlMEQzMDk3MEU1QTdFNScsICdBcm4nXSB9LFxuICAgICAgICAgICAgVXJpOiAnYXJuOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkV4dGVuc2lvbkFzc29jaWF0aW9uJywge1xuICAgICAgRXh0ZW5zaW9uSWRlbnRpZmllcjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFsnTXlBcHBDb25maWdFeHRlbnNpb25GODQ1RUMxMUQ0MDc5JywgJ0lkJ10sXG4gICAgICB9LFxuICAgICAgRXh0ZW5zaW9uVmVyc2lvbk51bWJlcjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFsnTXlBcHBDb25maWdFeHRlbnNpb25GODQ1RUMxMUQ0MDc5JywgJ1ZlcnNpb25OdW1iZXInXSxcbiAgICAgIH0sXG4gICAgICBSZXNvdXJjZUlkZW50aWZpZXI6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAnOmFwcGNvbmZpZzonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgICAnOmFwcGxpY2F0aW9uLycsXG4gICAgICAgICAgICB7IFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ29uIGRlcGxveW1lbnQgc3RlcCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcHBjb25maWcgPSBuZXcgQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcENvbmZpZycpO1xuICAgIGNvbnN0IGZ1bmMgPSBuZXcgRnVuY3Rpb24oc3RhY2ssICdNeUZ1bmMnLCB7XG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBSdW50aW1lLlBZVEhPTl8zXzcsXG4gICAgICBjb2RlOiBDb2RlLmZyb21JbmxpbmUoJyMgdGhpcyBpcyBteSBjb2RlJyksXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZ1bmMsICdmdW5jdGlvbkFybicsIHtcbiAgICAgIHZhbHVlOiAnYXJuOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uJyxcbiAgICB9KTtcbiAgICBhcHBjb25maWcub25EZXBsb3ltZW50U3RlcChuZXcgTGFtYmRhRGVzdGluYXRpb24oZnVuYykpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpFeHRlbnNpb24nLCB7XG4gICAgICBOYW1lOiAnTXlBcHBDb25maWctRXh0ZW5zaW9uJyxcbiAgICAgIEFjdGlvbnM6IHtcbiAgICAgICAgT05fREVQTE9ZTUVOVF9TVEVQOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgTmFtZTogJ015QXBwQ29uZmlnLUV4dGVuc2lvbi0wJyxcbiAgICAgICAgICAgIFJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ015QXBwQ29uZmlnRXh0ZW5zaW9uRjg0NUVSb2xlMEQzMDk3MEU1QTdFNScsICdBcm4nXSB9LFxuICAgICAgICAgICAgVXJpOiAnYXJuOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkV4dGVuc2lvbkFzc29jaWF0aW9uJywge1xuICAgICAgRXh0ZW5zaW9uSWRlbnRpZmllcjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFsnTXlBcHBDb25maWdFeHRlbnNpb25GODQ1RUMxMUQ0MDc5JywgJ0lkJ10sXG4gICAgICB9LFxuICAgICAgRXh0ZW5zaW9uVmVyc2lvbk51bWJlcjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFsnTXlBcHBDb25maWdFeHRlbnNpb25GODQ1RUMxMUQ0MDc5JywgJ1ZlcnNpb25OdW1iZXInXSxcbiAgICAgIH0sXG4gICAgICBSZXNvdXJjZUlkZW50aWZpZXI6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAnOmFwcGNvbmZpZzonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgICAnOmFwcGxpY2F0aW9uLycsXG4gICAgICAgICAgICB7IFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ29uIGRlcGxveW1lbnQgY29tcGxldGUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBwY29uZmlnID0gbmV3IEFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHBDb25maWcnKTtcbiAgICBjb25zdCBmdW5jID0gbmV3IEZ1bmN0aW9uKHN0YWNrLCAnTXlGdW5jJywge1xuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogUnVudGltZS5QWVRIT05fM183LFxuICAgICAgY29kZTogQ29kZS5mcm9tSW5saW5lKCcjIHRoaXMgaXMgbXkgY29kZScpLFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmdW5jLCAnZnVuY3Rpb25Bcm4nLCB7XG4gICAgICB2YWx1ZTogJ2FybjpsYW1iZGE6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpmdW5jdGlvbjpteS1mdW5jdGlvbicsXG4gICAgfSk7XG4gICAgYXBwY29uZmlnLm9uRGVwbG95bWVudENvbXBsZXRlKG5ldyBMYW1iZGFEZXN0aW5hdGlvbihmdW5jKSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkV4dGVuc2lvbicsIHtcbiAgICAgIE5hbWU6ICdNeUFwcENvbmZpZy1FeHRlbnNpb24nLFxuICAgICAgQWN0aW9uczoge1xuICAgICAgICBPTl9ERVBMT1lNRU5UX0NPTVBMRVRFOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgTmFtZTogJ015QXBwQ29uZmlnLUV4dGVuc2lvbi0wJyxcbiAgICAgICAgICAgIFJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ015QXBwQ29uZmlnRXh0ZW5zaW9uRjg0NUVSb2xlMEQzMDk3MEU1QTdFNScsICdBcm4nXSB9LFxuICAgICAgICAgICAgVXJpOiAnYXJuOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkV4dGVuc2lvbkFzc29jaWF0aW9uJywge1xuICAgICAgRXh0ZW5zaW9uSWRlbnRpZmllcjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFsnTXlBcHBDb25maWdFeHRlbnNpb25GODQ1RUMxMUQ0MDc5JywgJ0lkJ10sXG4gICAgICB9LFxuICAgICAgRXh0ZW5zaW9uVmVyc2lvbk51bWJlcjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFsnTXlBcHBDb25maWdFeHRlbnNpb25GODQ1RUMxMUQ0MDc5JywgJ1ZlcnNpb25OdW1iZXInXSxcbiAgICAgIH0sXG4gICAgICBSZXNvdXJjZUlkZW50aWZpZXI6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAnOmFwcGNvbmZpZzonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgICAnOmFwcGxpY2F0aW9uLycsXG4gICAgICAgICAgICB7IFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ29uIGRlcGxveW1lbnQgYmFrZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcHBjb25maWcgPSBuZXcgQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcENvbmZpZycpO1xuICAgIGNvbnN0IGZ1bmMgPSBuZXcgRnVuY3Rpb24oc3RhY2ssICdNeUZ1bmMnLCB7XG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBSdW50aW1lLlBZVEhPTl8zXzcsXG4gICAgICBjb2RlOiBDb2RlLmZyb21JbmxpbmUoJyMgdGhpcyBpcyBteSBjb2RlJyksXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZ1bmMsICdmdW5jdGlvbkFybicsIHtcbiAgICAgIHZhbHVlOiAnYXJuOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uJyxcbiAgICB9KTtcbiAgICBhcHBjb25maWcub25EZXBsb3ltZW50QmFraW5nKG5ldyBMYW1iZGFEZXN0aW5hdGlvbihmdW5jKSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkV4dGVuc2lvbicsIHtcbiAgICAgIE5hbWU6ICdNeUFwcENvbmZpZy1FeHRlbnNpb24nLFxuICAgICAgQWN0aW9uczoge1xuICAgICAgICBPTl9ERVBMT1lNRU5UX0JBS0lORzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIE5hbWU6ICdNeUFwcENvbmZpZy1FeHRlbnNpb24tMCcsXG4gICAgICAgICAgICBSb2xlQXJuOiB7ICdGbjo6R2V0QXR0JzogWydNeUFwcENvbmZpZ0V4dGVuc2lvbkY4NDVFUm9sZTBEMzA5NzBFNUE3RTUnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgIFVyaTogJ2FybjpsYW1iZGE6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpmdW5jdGlvbjpteS1mdW5jdGlvbicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpFeHRlbnNpb25Bc3NvY2lhdGlvbicsIHtcbiAgICAgIEV4dGVuc2lvbklkZW50aWZpZXI6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ015QXBwQ29uZmlnRXh0ZW5zaW9uRjg0NUVDMTFENDA3OScsICdJZCddLFxuICAgICAgfSxcbiAgICAgIEV4dGVuc2lvblZlcnNpb25OdW1iZXI6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ015QXBwQ29uZmlnRXh0ZW5zaW9uRjg0NUVDMTFENDA3OScsICdWZXJzaW9uTnVtYmVyJ10sXG4gICAgICB9LFxuICAgICAgUmVzb3VyY2VJZGVudGlmaWVyOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgJzphcHBjb25maWc6JyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICAnOicsXG4gICAgICAgICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgICAgICAgJzphcHBsaWNhdGlvbi8nLFxuICAgICAgICAgICAgeyBSZWY6ICdNeUFwcENvbmZpZ0I0QjYzRTc1JyB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdvbiBkZXBsb3ltZW50IHJvbGxlZCBiYWNrJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwcGNvbmZpZyA9IG5ldyBBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwQ29uZmlnJyk7XG4gICAgY29uc3QgZnVuYyA9IG5ldyBGdW5jdGlvbihzdGFjaywgJ015RnVuYycsIHtcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuUFlUSE9OXzNfNyxcbiAgICAgIGNvZGU6IENvZGUuZnJvbUlubGluZSgnIyB0aGlzIGlzIG15IGNvZGUnKSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZnVuYywgJ2Z1bmN0aW9uQXJuJywge1xuICAgICAgdmFsdWU6ICdhcm46bGFtYmRhOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6ZnVuY3Rpb246bXktZnVuY3Rpb24nLFxuICAgIH0pO1xuICAgIGFwcGNvbmZpZy5vbkRlcGxveW1lbnRSb2xsZWRCYWNrKG5ldyBMYW1iZGFEZXN0aW5hdGlvbihmdW5jKSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkV4dGVuc2lvbicsIHtcbiAgICAgIE5hbWU6ICdNeUFwcENvbmZpZy1FeHRlbnNpb24nLFxuICAgICAgQWN0aW9uczoge1xuICAgICAgICBPTl9ERVBMT1lNRU5UX1JPTExFRF9CQUNLOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgTmFtZTogJ015QXBwQ29uZmlnLUV4dGVuc2lvbi0wJyxcbiAgICAgICAgICAgIFJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ015QXBwQ29uZmlnRXh0ZW5zaW9uRjg0NUVSb2xlMEQzMDk3MEU1QTdFNScsICdBcm4nXSB9LFxuICAgICAgICAgICAgVXJpOiAnYXJuOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkV4dGVuc2lvbkFzc29jaWF0aW9uJywge1xuICAgICAgRXh0ZW5zaW9uSWRlbnRpZmllcjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFsnTXlBcHBDb25maWdFeHRlbnNpb25GODQ1RUMxMUQ0MDc5JywgJ0lkJ10sXG4gICAgICB9LFxuICAgICAgRXh0ZW5zaW9uVmVyc2lvbk51bWJlcjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFsnTXlBcHBDb25maWdFeHRlbnNpb25GODQ1RUMxMUQ0MDc5JywgJ1ZlcnNpb25OdW1iZXInXSxcbiAgICAgIH0sXG4gICAgICBSZXNvdXJjZUlkZW50aWZpZXI6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAnOmFwcGNvbmZpZzonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgICAnOmFwcGxpY2F0aW9uLycsXG4gICAgICAgICAgICB7IFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBzYW1lIGV4dGVuc2lvbiB0d2ljZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcHBjb25maWcgPSBuZXcgQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcENvbmZpZycpO1xuICAgIGNvbnN0IGZ1bmMgPSBuZXcgRnVuY3Rpb24oc3RhY2ssICdNeUZ1bmMnLCB7XG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBSdW50aW1lLlBZVEhPTl8zXzcsXG4gICAgICBjb2RlOiBDb2RlLmZyb21JbmxpbmUoJyMgdGhpcyBpcyBteSBjb2RlJyksXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZ1bmMsICdmdW5jdGlvbkFybicsIHtcbiAgICAgIHZhbHVlOiAnYXJuOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uJyxcbiAgICB9KTtcbiAgICBhcHBjb25maWcucHJlU3RhcnREZXBsb3ltZW50KG5ldyBMYW1iZGFEZXN0aW5hdGlvbihmdW5jKSk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgYXBwY29uZmlnLnByZVN0YXJ0RGVwbG95bWVudChuZXcgTGFtYmRhRGVzdGluYXRpb24oZnVuYykpO1xuICAgIH0pLnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgdGVzdCgnZnJvbSBhcHBsaWNhdGlvbiBhcm4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBwID0gQXBwbGljYXRpb24uZnJvbUFwcGxpY2F0aW9uQXJuKHN0YWNrLCAnQXBwbGljYXRpb24nLFxuICAgICAgJ2Fybjphd3M6YXBwY29uZmlnOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6YXBwbGljYXRpb24vYWJjMTIzJyk7XG5cbiAgICBleHBlY3QoYXBwLmFwcGxpY2F0aW9uSWQpLnRvRXF1YWwoJ2FiYzEyMycpO1xuICB9KTtcblxuICB0ZXN0KCdmcm9tIGFwcGxpY2F0aW9uIGFybiB3aXRoIG5vIHJlc291cmNlIG5hbWUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIEFwcGxpY2F0aW9uLmZyb21BcHBsaWNhdGlvbkFybihzdGFjaywgJ0FwcGxpY2F0aW9uJyxcbiAgICAgICAgJ2Fybjphd3M6YXBwY29uZmlnOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6YXBwbGljYXRpb24vJyk7XG4gICAgfSkudG9UaHJvdygnTWlzc2luZyByZXF1aXJlZCBhcHBsaWNhdGlvbiBpZCBmcm9tIGFwcGxpY2F0aW9uIEFSTicpO1xuICB9KTtcblxuICB0ZXN0KCdmcm9tIGFwcGxpY2F0aW9uIGlkJywgKCkgPT4ge1xuICAgIGNvbnN0IGNka0FwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGNka0FwcCwgJ1N0YWNrJywge1xuICAgICAgZW52OiB7XG4gICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXG4gICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBhcHAgPSBBcHBsaWNhdGlvbi5mcm9tQXBwbGljYXRpb25JZChzdGFjaywgJ0FwcGxpY2F0aW9uJywgJ2FiYzEyMycpO1xuXG4gICAgZXhwZWN0KGFwcC5hcHBsaWNhdGlvbklkKS50b0VxdWFsKCdhYmMxMjMnKTtcbiAgfSk7XG59KTsiXX0=