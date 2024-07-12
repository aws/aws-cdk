"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const assertions_1 = require("aws-cdk-lib/assertions");
const aws_events_1 = require("aws-cdk-lib/aws-events");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const lambda = require("aws-cdk-lib/aws-lambda");
const aws_sns_1 = require("aws-cdk-lib/aws-sns");
const aws_sqs_1 = require("aws-cdk-lib/aws-sqs");
const lib_1 = require("../lib");
describe('extension', () => {
    test('simple extension with lambda', () => {
        const stack = new cdk.Stack();
        const func = new lambda.Function(stack, 'MyFunction', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromInline('# dummy func'),
            handler: 'index.handler',
        });
        new lib_1.Extension(stack, 'MyExtension', {
            actions: [
                new lib_1.Action({
                    actionPoints: [
                        lib_1.ActionPoint.ON_DEPLOYMENT_COMPLETE,
                        lib_1.ActionPoint.ON_DEPLOYMENT_ROLLED_BACK,
                    ],
                    eventDestination: new lib_1.LambdaDestination(func),
                }),
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
            Name: 'MyExtension',
            Actions: {
                ON_DEPLOYMENT_COMPLETE: [
                    {
                        Name: 'MyExtension-0',
                        RoleArn: { 'Fn::GetAtt': ['MyExtensionRole467D6FCDEEFA5', 'Arn'] },
                        Uri: { 'Fn::GetAtt': ['MyFunction3BAA72D1', 'Arn'] },
                    },
                ],
                ON_DEPLOYMENT_ROLLED_BACK: [
                    {
                        Name: 'MyExtension-0',
                        RoleArn: { 'Fn::GetAtt': ['MyExtensionRole467D6FCDEEFA5', 'Arn'] },
                        Uri: { 'Fn::GetAtt': ['MyFunction3BAA72D1', 'Arn'] },
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            Policies: [
                {
                    PolicyDocument: {
                        Statement: [
                            {
                                Effect: aws_iam_1.Effect.ALLOW,
                                Resource: { 'Fn::GetAtt': ['MyFunction3BAA72D1', 'Arn'] },
                                Action: [
                                    'lambda:InvokeFunction',
                                    'lambda:InvokeAsync',
                                ],
                            },
                        ],
                    },
                    PolicyName: 'AllowAppConfigInvokeExtensionEventSourcePolicy',
                },
            ],
        });
    });
    test('simple extension with two lambdas', () => {
        const stack = new cdk.Stack();
        const func1 = new lambda.Function(stack, 'MyFunction1', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromInline('# dummy func'),
            handler: 'index.handler',
        });
        const func2 = new lambda.Function(stack, 'MyFunction2', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromInline('# dummy func'),
            handler: 'index.handler',
        });
        Object.defineProperty(func1, 'functionArn', {
            value: 'arn:lambda:us-east-1:123456789012:function:my-function',
        });
        Object.defineProperty(func2, 'functionArn', {
            value: 'arn:lambda:us-east-1:123456789012:function:my-diff-function',
        });
        new lib_1.Extension(stack, 'MyExtension', {
            actions: [
                new lib_1.Action({
                    actionPoints: [
                        lib_1.ActionPoint.ON_DEPLOYMENT_COMPLETE,
                    ],
                    eventDestination: new lib_1.LambdaDestination(func1),
                }),
                new lib_1.Action({
                    actionPoints: [
                        lib_1.ActionPoint.ON_DEPLOYMENT_ROLLED_BACK,
                    ],
                    eventDestination: new lib_1.LambdaDestination(func2),
                }),
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
            Name: 'MyExtension',
            Actions: {
                ON_DEPLOYMENT_COMPLETE: [
                    {
                        Name: 'MyExtension-0',
                        RoleArn: { 'Fn::GetAtt': ['MyExtensionRole467D6FCDEEFA5', 'Arn'] },
                        Uri: 'arn:lambda:us-east-1:123456789012:function:my-function',
                    },
                ],
                ON_DEPLOYMENT_ROLLED_BACK: [
                    {
                        Name: 'MyExtension-1',
                        RoleArn: { 'Fn::GetAtt': ['MyExtensionRoleBE614F182C70A', 'Arn'] },
                        Uri: 'arn:lambda:us-east-1:123456789012:function:my-diff-function',
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).resourcePropertiesCountIs('AWS::IAM::Role', {
            Policies: [
                {
                    PolicyDocument: {
                        Statement: [
                            {
                                Effect: aws_iam_1.Effect.ALLOW,
                                Resource: 'arn:lambda:us-east-1:123456789012:function:my-function',
                                Action: [
                                    'lambda:InvokeFunction',
                                    'lambda:InvokeAsync',
                                ],
                            },
                        ],
                    },
                    PolicyName: 'AllowAppConfigInvokeExtensionEventSourcePolicy',
                },
            ],
        }, 1);
        assertions_1.Template.fromStack(stack).resourcePropertiesCountIs('AWS::IAM::Role', {
            Policies: [
                {
                    PolicyDocument: {
                        Statement: [
                            {
                                Effect: aws_iam_1.Effect.ALLOW,
                                Resource: 'arn:lambda:us-east-1:123456789012:function:my-diff-function',
                                Action: [
                                    'lambda:InvokeFunction',
                                    'lambda:InvokeAsync',
                                ],
                            },
                        ],
                    },
                    PolicyName: 'AllowAppConfigInvokeExtensionEventSourcePolicy',
                },
            ],
        }, 1);
    });
    test('extension with all props using lambda', () => {
        const stack = new cdk.Stack();
        const func = new lambda.Function(stack, 'MyFunction', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromInline('# dummy func'),
            handler: 'index.handler',
        });
        Object.defineProperty(func, 'functionArn', {
            value: 'arn:lambda:us-east-1:123456789012:function:my-function',
        });
        const appconfig = new lib_1.Application(stack, 'MyApplication', {
            applicationName: 'MyApplication',
        });
        const ext = new lib_1.Extension(stack, 'MyExtension', {
            actions: [
                new lib_1.Action({
                    actionPoints: [
                        lib_1.ActionPoint.ON_DEPLOYMENT_COMPLETE,
                    ],
                    eventDestination: new lib_1.LambdaDestination(func),
                }),
            ],
            extensionName: 'TestExtension',
            description: 'This is my extension',
            parameters: [
                lib_1.Parameter.required('testVariable', 'hello'),
                lib_1.Parameter.notRequired('testNotRequiredVariable'),
            ],
            latestVersionNumber: 1,
        });
        appconfig.addExtension(ext);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
            Name: 'TestExtension',
            Actions: {
                ON_DEPLOYMENT_COMPLETE: [
                    {
                        Name: 'TestExtension-0',
                        RoleArn: { 'Fn::GetAtt': ['MyExtensionRoleCA98491716207', 'Arn'] },
                        Uri: 'arn:lambda:us-east-1:123456789012:function:my-function',
                    },
                ],
            },
            Description: 'This is my extension',
            Parameters: {
                testVariable: { Required: true },
                testNotRequiredVariable: { Required: false },
            },
            LatestVersionNumber: 1,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ExtensionAssociation', {
            ExtensionIdentifier: {
                'Fn::GetAtt': ['MyExtension89A915D0', 'Id'],
            },
            ExtensionVersionNumber: {
                'Fn::GetAtt': ['MyExtension89A915D0', 'VersionNumber'],
            },
            Parameters: {
                testVariable: 'hello',
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
                        { Ref: 'MyApplication5C63EC1D' },
                    ],
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            Policies: [
                {
                    PolicyDocument: {
                        Statement: [
                            {
                                Effect: aws_iam_1.Effect.ALLOW,
                                Resource: 'arn:lambda:us-east-1:123456789012:function:my-function',
                                Action: [
                                    'lambda:InvokeFunction',
                                    'lambda:InvokeAsync',
                                ],
                            },
                        ],
                    },
                    PolicyName: 'AllowAppConfigInvokeExtensionEventSourcePolicy',
                },
            ],
        });
    });
    test('extension with queue', () => {
        const stack = new cdk.Stack();
        const queue = new aws_sqs_1.Queue(stack, 'MyQueue');
        Object.defineProperty(queue, 'queueArn', {
            value: 'arn:sqs:us-east-1:123456789012:my-queue',
        });
        new lib_1.Extension(stack, 'MyExtension', {
            actions: [
                new lib_1.Action({
                    actionPoints: [
                        lib_1.ActionPoint.ON_DEPLOYMENT_ROLLED_BACK,
                    ],
                    eventDestination: new lib_1.SqsDestination(queue),
                    name: 'ActionTestName',
                    description: 'This is my action description',
                }),
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
            Name: 'MyExtension',
            Actions: {
                ON_DEPLOYMENT_ROLLED_BACK: [
                    {
                        Description: 'This is my action description',
                        Name: 'ActionTestName',
                        RoleArn: { 'Fn::GetAtt': ['MyExtensionRole76B022BC4F2BC', 'Arn'] },
                        Uri: 'arn:sqs:us-east-1:123456789012:my-queue',
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            Policies: [
                {
                    PolicyDocument: {
                        Statement: [
                            {
                                Effect: aws_iam_1.Effect.ALLOW,
                                Resource: 'arn:sqs:us-east-1:123456789012:my-queue',
                                Action: 'sqs:SendMessage',
                            },
                        ],
                    },
                    PolicyName: 'AllowAppConfigInvokeExtensionEventSourcePolicy',
                },
            ],
        });
    });
    test('extension with topic', () => {
        const stack = new cdk.Stack();
        const topic = new aws_sns_1.Topic(stack, 'MyTopic');
        Object.defineProperty(topic, 'topicArn', {
            value: 'arn:sns:us-east-1:123456789012:my-topic',
        });
        new lib_1.Extension(stack, 'MyExtension', {
            actions: [
                new lib_1.Action({
                    actionPoints: [
                        lib_1.ActionPoint.ON_DEPLOYMENT_BAKING,
                    ],
                    eventDestination: new lib_1.SnsDestination(topic),
                }),
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
            Name: 'MyExtension',
            Actions: {
                ON_DEPLOYMENT_BAKING: [
                    {
                        Name: 'MyExtension-0',
                        RoleArn: { 'Fn::GetAtt': ['MyExtensionRole467D6FCDEEFA5', 'Arn'] },
                        Uri: 'arn:sns:us-east-1:123456789012:my-topic',
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            Policies: [
                {
                    PolicyDocument: {
                        Statement: [
                            {
                                Effect: aws_iam_1.Effect.ALLOW,
                                Resource: 'arn:sns:us-east-1:123456789012:my-topic',
                                Action: 'sns:Publish',
                            },
                        ],
                    },
                    PolicyName: 'AllowAppConfigInvokeExtensionEventSourcePolicy',
                },
            ],
        });
    });
    test('extension with bus', () => {
        const stack = new cdk.Stack();
        const bus = new aws_events_1.EventBus(stack, 'MyEventBus');
        Object.defineProperty(bus, 'eventBusArn', {
            value: 'arn:aws:events:us-east-1:123456789012:event-bus/aws.partner/PartnerName/acct1/repo1',
        });
        new lib_1.Extension(stack, 'MyExtension', {
            actions: [
                new lib_1.Action({
                    actionPoints: [
                        lib_1.ActionPoint.ON_DEPLOYMENT_BAKING,
                    ],
                    eventDestination: new lib_1.EventBridgeDestination(bus),
                }),
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
            Name: 'MyExtension',
            Actions: {
                ON_DEPLOYMENT_BAKING: [
                    {
                        Name: 'MyExtension-0',
                        Uri: 'arn:aws:events:us-east-1:123456789012:event-bus/aws.partner/PartnerName/acct1/repo1',
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
    });
    test('extension with associated environment', () => {
        const stack = new cdk.Stack();
        const func = new lambda.Function(stack, 'MyFunction', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromInline('# dummy func'),
            handler: 'index.handler',
        });
        Object.defineProperty(func, 'functionArn', {
            value: 'arn:lambda:us-east-1:123456789012:function:my-function',
        });
        const app = new lib_1.Application(stack, 'MyApplication');
        const env = app.addEnvironment('MyEnvironment');
        const ext = new lib_1.Extension(stack, 'MyExtension', {
            actions: [
                new lib_1.Action({
                    actionPoints: [
                        lib_1.ActionPoint.ON_DEPLOYMENT_COMPLETE,
                    ],
                    eventDestination: new lib_1.LambdaDestination(func),
                }),
            ],
        });
        env.addExtension(ext);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
            Name: 'MyExtension',
            Actions: {
                ON_DEPLOYMENT_COMPLETE: [
                    {
                        Name: 'MyExtension-0',
                        RoleArn: { 'Fn::GetAtt': ['MyExtensionRole467D6FCDEEFA5', 'Arn'] },
                        Uri: 'arn:lambda:us-east-1:123456789012:function:my-function',
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ExtensionAssociation', {
            ExtensionIdentifier: {
                'Fn::GetAtt': ['MyExtension89A915D0', 'Id'],
            },
            ExtensionVersionNumber: {
                'Fn::GetAtt': ['MyExtension89A915D0', 'VersionNumber'],
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
                        { Ref: 'MyApplication5C63EC1D' },
                        '/environment/',
                        { Ref: 'MyApplicationMyEnvironment10D94356' },
                    ],
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            Policies: [
                {
                    PolicyDocument: {
                        Statement: [
                            {
                                Effect: aws_iam_1.Effect.ALLOW,
                                Resource: 'arn:lambda:us-east-1:123456789012:function:my-function',
                                Action: [
                                    'lambda:InvokeFunction',
                                    'lambda:InvokeAsync',
                                ],
                            },
                        ],
                    },
                    PolicyName: 'AllowAppConfigInvokeExtensionEventSourcePolicy',
                },
            ],
        });
    });
    test('extension with associated configuration profile', () => {
        const stack = new cdk.Stack();
        const func = new lambda.Function(stack, 'MyFunction', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromInline('# dummy func'),
            handler: 'index.handler',
        });
        Object.defineProperty(func, 'functionArn', {
            value: 'arn:lambda:us-east-1:123456789012:function:my-function',
        });
        const app = new lib_1.Application(stack, 'MyApplication');
        const configProfile = new lib_1.HostedConfiguration(stack, 'MyConfiguration', {
            application: app,
            content: lib_1.ConfigurationContent.fromInlineJson('This is my content.'),
        });
        const ext = new lib_1.Extension(stack, 'MyExtension', {
            actions: [
                new lib_1.Action({
                    actionPoints: [
                        lib_1.ActionPoint.ON_DEPLOYMENT_COMPLETE,
                    ],
                    eventDestination: new lib_1.LambdaDestination(func),
                }),
            ],
        });
        configProfile.addExtension(ext);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
            Name: 'MyExtension',
            Actions: {
                ON_DEPLOYMENT_COMPLETE: [
                    {
                        Name: 'MyExtension-0',
                        RoleArn: { 'Fn::GetAtt': ['MyExtensionRole467D6FCDEEFA5', 'Arn'] },
                        Uri: 'arn:lambda:us-east-1:123456789012:function:my-function',
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ExtensionAssociation', {
            ExtensionIdentifier: {
                'Fn::GetAtt': ['MyExtension89A915D0', 'Id'],
            },
            ExtensionVersionNumber: {
                'Fn::GetAtt': ['MyExtension89A915D0', 'VersionNumber'],
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
                        { Ref: 'MyApplication5C63EC1D' },
                        '/configurationprofile/',
                        { Ref: 'MyConfigurationConfigurationProfileEE0ECA85' },
                    ],
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            Policies: [
                {
                    PolicyDocument: {
                        Statement: [
                            {
                                Effect: aws_iam_1.Effect.ALLOW,
                                Resource: 'arn:lambda:us-east-1:123456789012:function:my-function',
                                Action: [
                                    'lambda:InvokeFunction',
                                    'lambda:InvokeAsync',
                                ],
                            },
                        ],
                    },
                    PolicyName: 'AllowAppConfigInvokeExtensionEventSourcePolicy',
                },
            ],
        });
    });
    test('extension with execution role', () => {
        const stack = new cdk.Stack();
        const func = new lambda.Function(stack, 'MyFunction', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromInline('# dummy func'),
            handler: 'index.handler',
        });
        Object.defineProperty(func, 'functionArn', {
            value: 'arn:lambda:us-east-1:123456789012:function:my-function',
        });
        const role = new aws_iam_1.Role(stack, 'MyRole', {
            assumedBy: new aws_iam_1.ServicePrincipal('appconfig.amazonaws.com'),
        });
        Object.defineProperty(role, 'roleArn', {
            value: 'arn:iam::123456789012:role/my-role',
        });
        new lib_1.Extension(stack, 'MyExtension', {
            actions: [
                new lib_1.Action({
                    actionPoints: [
                        lib_1.ActionPoint.ON_DEPLOYMENT_COMPLETE,
                    ],
                    eventDestination: new lib_1.LambdaDestination(func),
                    executionRole: role,
                }),
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Extension', {
            Name: 'MyExtension',
            Actions: {
                ON_DEPLOYMENT_COMPLETE: [
                    {
                        Name: 'MyExtension-0',
                        RoleArn: 'arn:iam::123456789012:role/my-role',
                        Uri: 'arn:lambda:us-east-1:123456789012:function:my-function',
                    },
                ],
            },
        });
    });
    test('from extension arn', () => {
        const stack = new cdk.Stack();
        const extension = lib_1.Extension.fromExtensionArn(stack, 'MyExtension', 'arn:aws:appconfig:us-west-2:123456789012:extension/abc123/1');
        expect(extension.extensionId).toEqual('abc123');
        expect(extension.extensionVersionNumber).toEqual(1);
        expect(extension.env.account).toEqual('123456789012');
        expect(extension.env.region).toEqual('us-west-2');
    });
    test('from extension arn with no resource name', () => {
        const stack = new cdk.Stack();
        expect(() => {
            lib_1.Extension.fromExtensionArn(stack, 'MyExtension', 'arn:aws:appconfig:us-west-2:123456789012:extension/');
        }).toThrow('Missing required /$/{extensionId}//$/{extensionVersionNumber} from configuration profile ARN:');
    });
    test('from extension arn with no extension id', () => {
        const stack = new cdk.Stack();
        expect(() => {
            lib_1.Extension.fromExtensionArn(stack, 'MyExtension', 'arn:aws:appconfig:us-west-2:123456789012:extension//1');
        }).toThrow('Missing required parameters for extension ARN: format should be /$/{extensionId}//$/{extensionVersionNumber}');
    });
    test('from extension arn with no extension version number', () => {
        const stack = new cdk.Stack();
        expect(() => {
            lib_1.Extension.fromExtensionArn(stack, 'MyExtension', 'arn:aws:appconfig:us-west-2:123456789012:extension/abc123/');
        }).toThrow('Missing required parameters for extension ARN: format should be /$/{extensionId}//$/{extensionVersionNumber}');
    });
    test('from extension id', () => {
        const cdkApp = new aws_cdk_lib_1.App();
        const stack = new cdk.Stack(cdkApp, 'Stack', {
            env: {
                region: 'us-west-2',
                account: '123456789012',
            },
        });
        const extension = lib_1.Extension.fromExtensionAttributes(stack, 'Extension', {
            extensionId: 'abc123',
            extensionVersionNumber: 1,
        });
        expect(extension.extensionId).toEqual('abc123');
        expect(extension.extensionVersionNumber).toEqual(1);
        expect(extension.env.account).toEqual('123456789012');
        expect(extension.env.region).toEqual('us-west-2');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJleHRlbnNpb24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyw2Q0FBa0M7QUFDbEMsdURBQWtEO0FBQ2xELHVEQUFrRDtBQUNsRCxpREFBcUU7QUFDckUsaURBQWlEO0FBQ2pELGlEQUE0QztBQUM1QyxpREFBNEM7QUFDNUMsZ0NBWWdCO0FBRWhCLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO0lBQ3pCLElBQUksQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7UUFDeEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7WUFDcEQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNsQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO1lBQzVDLE9BQU8sRUFBRSxlQUFlO1NBQ3pCLENBQUMsQ0FBQztRQUNILElBQUksZUFBUyxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7WUFDbEMsT0FBTyxFQUFFO2dCQUNQLElBQUksWUFBTSxDQUFDO29CQUNULFlBQVksRUFBRTt3QkFDWixpQkFBVyxDQUFDLHNCQUFzQjt3QkFDbEMsaUJBQVcsQ0FBQyx5QkFBeUI7cUJBQ3RDO29CQUNELGdCQUFnQixFQUFFLElBQUksdUJBQWlCLENBQUMsSUFBSSxDQUFDO2lCQUM5QyxDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQywyQkFBMkIsRUFBRTtZQUMzRSxJQUFJLEVBQUUsYUFBYTtZQUNuQixPQUFPLEVBQUU7Z0JBQ1Asc0JBQXNCLEVBQUU7b0JBQ3RCO3dCQUNFLElBQUksRUFBRSxlQUFlO3dCQUNyQixPQUFPLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxLQUFLLENBQUMsRUFBRTt3QkFDbEUsR0FBRyxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLEVBQUU7cUJBQ3JEO2lCQUNGO2dCQUNELHlCQUF5QixFQUFFO29CQUN6Qjt3QkFDRSxJQUFJLEVBQUUsZUFBZTt3QkFDckIsT0FBTyxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsOEJBQThCLEVBQUUsS0FBSyxDQUFDLEVBQUU7d0JBQ2xFLEdBQUcsRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxFQUFFO3FCQUNyRDtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsZ0JBQWdCLEVBQUU7WUFDaEUsUUFBUSxFQUFFO2dCQUNSO29CQUNFLGNBQWMsRUFBRTt3QkFDZCxTQUFTLEVBQUU7NEJBQ1Q7Z0NBQ0UsTUFBTSxFQUFFLGdCQUFNLENBQUMsS0FBSztnQ0FDcEIsUUFBUSxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0NBQ3pELE1BQU0sRUFBRTtvQ0FDTix1QkFBdUI7b0NBQ3ZCLG9CQUFvQjtpQ0FDckI7NkJBQ0Y7eUJBQ0Y7cUJBQ0Y7b0JBQ0QsVUFBVSxFQUFFLGdEQUFnRDtpQkFDN0Q7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtRQUM3QyxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtZQUN0RCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQ2xDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7WUFDNUMsT0FBTyxFQUFFLGVBQWU7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7WUFDdEQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNsQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO1lBQzVDLE9BQU8sRUFBRSxlQUFlO1NBQ3pCLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtZQUMxQyxLQUFLLEVBQUUsd0RBQXdEO1NBQ2hFLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtZQUMxQyxLQUFLLEVBQUUsNkRBQTZEO1NBQ3JFLENBQUMsQ0FBQztRQUNILElBQUksZUFBUyxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7WUFDbEMsT0FBTyxFQUFFO2dCQUNQLElBQUksWUFBTSxDQUFDO29CQUNULFlBQVksRUFBRTt3QkFDWixpQkFBVyxDQUFDLHNCQUFzQjtxQkFDbkM7b0JBQ0QsZ0JBQWdCLEVBQUUsSUFBSSx1QkFBaUIsQ0FBQyxLQUFLLENBQUM7aUJBQy9DLENBQUM7Z0JBQ0YsSUFBSSxZQUFNLENBQUM7b0JBQ1QsWUFBWSxFQUFFO3dCQUNaLGlCQUFXLENBQUMseUJBQXlCO3FCQUN0QztvQkFDRCxnQkFBZ0IsRUFBRSxJQUFJLHVCQUFpQixDQUFDLEtBQUssQ0FBQztpQkFDL0MsQ0FBQzthQUNIO1NBQ0YsQ0FBQyxDQUFDO1FBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMkJBQTJCLEVBQUU7WUFDM0UsSUFBSSxFQUFFLGFBQWE7WUFDbkIsT0FBTyxFQUFFO2dCQUNQLHNCQUFzQixFQUFFO29CQUN0Qjt3QkFDRSxJQUFJLEVBQUUsZUFBZTt3QkFDckIsT0FBTyxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsOEJBQThCLEVBQUUsS0FBSyxDQUFDLEVBQUU7d0JBQ2xFLEdBQUcsRUFBRSx3REFBd0Q7cUJBQzlEO2lCQUNGO2dCQUNELHlCQUF5QixFQUFFO29CQUN6Qjt3QkFDRSxJQUFJLEVBQUUsZUFBZTt3QkFDckIsT0FBTyxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsOEJBQThCLEVBQUUsS0FBSyxDQUFDLEVBQUU7d0JBQ2xFLEdBQUcsRUFBRSw2REFBNkQ7cUJBQ25FO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFDSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxnQkFBZ0IsRUFBRTtZQUNwRSxRQUFRLEVBQUU7Z0JBQ1I7b0JBQ0UsY0FBYyxFQUFFO3dCQUNkLFNBQVMsRUFBRTs0QkFDVDtnQ0FDRSxNQUFNLEVBQUUsZ0JBQU0sQ0FBQyxLQUFLO2dDQUNwQixRQUFRLEVBQUUsd0RBQXdEO2dDQUNsRSxNQUFNLEVBQUU7b0NBQ04sdUJBQXVCO29DQUN2QixvQkFBb0I7aUNBQ3JCOzZCQUNGO3lCQUNGO3FCQUNGO29CQUNELFVBQVUsRUFBRSxnREFBZ0Q7aUJBQzdEO2FBQ0Y7U0FDRixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ04scUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMseUJBQXlCLENBQUMsZ0JBQWdCLEVBQUU7WUFDcEUsUUFBUSxFQUFFO2dCQUNSO29CQUNFLGNBQWMsRUFBRTt3QkFDZCxTQUFTLEVBQUU7NEJBQ1Q7Z0NBQ0UsTUFBTSxFQUFFLGdCQUFNLENBQUMsS0FBSztnQ0FDcEIsUUFBUSxFQUFFLDZEQUE2RDtnQ0FDdkUsTUFBTSxFQUFFO29DQUNOLHVCQUF1QjtvQ0FDdkIsb0JBQW9CO2lDQUNyQjs2QkFDRjt5QkFDRjtxQkFDRjtvQkFDRCxVQUFVLEVBQUUsZ0RBQWdEO2lCQUM3RDthQUNGO1NBQ0YsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtRQUNqRCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUNwRCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQ2xDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7WUFDNUMsT0FBTyxFQUFFLGVBQWU7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3pDLEtBQUssRUFBRSx3REFBd0Q7U0FDaEUsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxTQUFTLEdBQUcsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUU7WUFDeEQsZUFBZSxFQUFFLGVBQWU7U0FDakMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxHQUFHLEdBQUcsSUFBSSxlQUFTLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtZQUM5QyxPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxZQUFNLENBQUM7b0JBQ1QsWUFBWSxFQUFFO3dCQUNaLGlCQUFXLENBQUMsc0JBQXNCO3FCQUNuQztvQkFDRCxnQkFBZ0IsRUFBRSxJQUFJLHVCQUFpQixDQUFDLElBQUksQ0FBQztpQkFDOUMsQ0FBQzthQUNIO1lBQ0QsYUFBYSxFQUFFLGVBQWU7WUFDOUIsV0FBVyxFQUFFLHNCQUFzQjtZQUNuQyxVQUFVLEVBQUU7Z0JBQ1YsZUFBUyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDO2dCQUMzQyxlQUFTLENBQUMsV0FBVyxDQUFDLHlCQUF5QixDQUFDO2FBQ2pEO1lBQ0QsbUJBQW1CLEVBQUUsQ0FBQztTQUN2QixDQUFDLENBQUM7UUFDSCxTQUFTLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTVCLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDJCQUEyQixFQUFFO1lBQzNFLElBQUksRUFBRSxlQUFlO1lBQ3JCLE9BQU8sRUFBRTtnQkFDUCxzQkFBc0IsRUFBRTtvQkFDdEI7d0JBQ0UsSUFBSSxFQUFFLGlCQUFpQjt3QkFDdkIsT0FBTyxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsOEJBQThCLEVBQUUsS0FBSyxDQUFDLEVBQUU7d0JBQ2xFLEdBQUcsRUFBRSx3REFBd0Q7cUJBQzlEO2lCQUNGO2FBQ0Y7WUFDRCxXQUFXLEVBQUUsc0JBQXNCO1lBQ25DLFVBQVUsRUFBRTtnQkFDVixZQUFZLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUNoQyx1QkFBdUIsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDN0M7WUFDRCxtQkFBbUIsRUFBRSxDQUFDO1NBQ3ZCLENBQUMsQ0FBQztRQUNILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHNDQUFzQyxFQUFFO1lBQ3RGLG1CQUFtQixFQUFFO2dCQUNuQixZQUFZLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUM7YUFDNUM7WUFDRCxzQkFBc0IsRUFBRTtnQkFDdEIsWUFBWSxFQUFFLENBQUMscUJBQXFCLEVBQUUsZUFBZSxDQUFDO2FBQ3ZEO1lBQ0QsVUFBVSxFQUFFO2dCQUNWLFlBQVksRUFBRSxPQUFPO2FBQ3RCO1lBQ0Qsa0JBQWtCLEVBQUU7Z0JBQ2xCLFVBQVUsRUFBRTtvQkFDVixFQUFFO29CQUNGO3dCQUNFLE1BQU07d0JBQ04sRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUU7d0JBQ3pCLGFBQWE7d0JBQ2IsRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFO3dCQUN0QixHQUFHO3dCQUNILEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFO3dCQUN6QixlQUFlO3dCQUNmLEVBQUUsR0FBRyxFQUFFLHVCQUF1QixFQUFFO3FCQUNqQztpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsZ0JBQWdCLEVBQUU7WUFDaEUsUUFBUSxFQUFFO2dCQUNSO29CQUNFLGNBQWMsRUFBRTt3QkFDZCxTQUFTLEVBQUU7NEJBQ1Q7Z0NBQ0UsTUFBTSxFQUFFLGdCQUFNLENBQUMsS0FBSztnQ0FDcEIsUUFBUSxFQUFFLHdEQUF3RDtnQ0FDbEUsTUFBTSxFQUFFO29DQUNOLHVCQUF1QjtvQ0FDdkIsb0JBQW9CO2lDQUNyQjs2QkFDRjt5QkFDRjtxQkFDRjtvQkFDRCxVQUFVLEVBQUUsZ0RBQWdEO2lCQUM3RDthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO1FBQ2hDLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sS0FBSyxHQUFHLElBQUksZUFBSyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDdkMsS0FBSyxFQUFFLHlDQUF5QztTQUNqRCxDQUFDLENBQUM7UUFDSCxJQUFJLGVBQVMsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQ2xDLE9BQU8sRUFBRTtnQkFDUCxJQUFJLFlBQU0sQ0FBQztvQkFDVCxZQUFZLEVBQUU7d0JBQ1osaUJBQVcsQ0FBQyx5QkFBeUI7cUJBQ3RDO29CQUNELGdCQUFnQixFQUFFLElBQUksb0JBQWMsQ0FBQyxLQUFLLENBQUM7b0JBQzNDLElBQUksRUFBRSxnQkFBZ0I7b0JBQ3RCLFdBQVcsRUFBRSwrQkFBK0I7aUJBQzdDLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDJCQUEyQixFQUFFO1lBQzNFLElBQUksRUFBRSxhQUFhO1lBQ25CLE9BQU8sRUFBRTtnQkFDUCx5QkFBeUIsRUFBRTtvQkFDekI7d0JBQ0UsV0FBVyxFQUFFLCtCQUErQjt3QkFDNUMsSUFBSSxFQUFFLGdCQUFnQjt3QkFDdEIsT0FBTyxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsOEJBQThCLEVBQUUsS0FBSyxDQUFDLEVBQUU7d0JBQ2xFLEdBQUcsRUFBRSx5Q0FBeUM7cUJBQy9DO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFDSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBZ0IsRUFBRTtZQUNoRSxRQUFRLEVBQUU7Z0JBQ1I7b0JBQ0UsY0FBYyxFQUFFO3dCQUNkLFNBQVMsRUFBRTs0QkFDVDtnQ0FDRSxNQUFNLEVBQUUsZ0JBQU0sQ0FBQyxLQUFLO2dDQUNwQixRQUFRLEVBQUUseUNBQXlDO2dDQUNuRCxNQUFNLEVBQUUsaUJBQWlCOzZCQUMxQjt5QkFDRjtxQkFDRjtvQkFDRCxVQUFVLEVBQUUsZ0RBQWdEO2lCQUM3RDthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO1FBQ2hDLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sS0FBSyxHQUFHLElBQUksZUFBSyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDdkMsS0FBSyxFQUFFLHlDQUF5QztTQUNqRCxDQUFDLENBQUM7UUFDSCxJQUFJLGVBQVMsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQ2xDLE9BQU8sRUFBRTtnQkFDUCxJQUFJLFlBQU0sQ0FBQztvQkFDVCxZQUFZLEVBQUU7d0JBQ1osaUJBQVcsQ0FBQyxvQkFBb0I7cUJBQ2pDO29CQUNELGdCQUFnQixFQUFFLElBQUksb0JBQWMsQ0FBQyxLQUFLLENBQUM7aUJBQzVDLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDJCQUEyQixFQUFFO1lBQzNFLElBQUksRUFBRSxhQUFhO1lBQ25CLE9BQU8sRUFBRTtnQkFDUCxvQkFBb0IsRUFBRTtvQkFDcEI7d0JBQ0UsSUFBSSxFQUFFLGVBQWU7d0JBQ3JCLE9BQU8sRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLDhCQUE4QixFQUFFLEtBQUssQ0FBQyxFQUFFO3dCQUNsRSxHQUFHLEVBQUUseUNBQXlDO3FCQUMvQztpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsZ0JBQWdCLEVBQUU7WUFDaEUsUUFBUSxFQUFFO2dCQUNSO29CQUNFLGNBQWMsRUFBRTt3QkFDZCxTQUFTLEVBQUU7NEJBQ1Q7Z0NBQ0UsTUFBTSxFQUFFLGdCQUFNLENBQUMsS0FBSztnQ0FDcEIsUUFBUSxFQUFFLHlDQUF5QztnQ0FDbkQsTUFBTSxFQUFFLGFBQWE7NkJBQ3RCO3lCQUNGO3FCQUNGO29CQUNELFVBQVUsRUFBRSxnREFBZ0Q7aUJBQzdEO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7UUFDOUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxxQkFBUSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztRQUM5QyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxhQUFhLEVBQUU7WUFDeEMsS0FBSyxFQUFFLHFGQUFxRjtTQUM3RixDQUFDLENBQUM7UUFDSCxJQUFJLGVBQVMsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQ2xDLE9BQU8sRUFBRTtnQkFDUCxJQUFJLFlBQU0sQ0FBQztvQkFDVCxZQUFZLEVBQUU7d0JBQ1osaUJBQVcsQ0FBQyxvQkFBb0I7cUJBQ2pDO29CQUNELGdCQUFnQixFQUFFLElBQUksNEJBQXNCLENBQUMsR0FBRyxDQUFDO2lCQUNsRCxDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQywyQkFBMkIsRUFBRTtZQUMzRSxJQUFJLEVBQUUsYUFBYTtZQUNuQixPQUFPLEVBQUU7Z0JBQ1Asb0JBQW9CLEVBQUU7b0JBQ3BCO3dCQUNFLElBQUksRUFBRSxlQUFlO3dCQUNyQixHQUFHLEVBQUUscUZBQXFGO3FCQUMzRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtRQUNqRCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUNwRCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQ2xDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7WUFDNUMsT0FBTyxFQUFFLGVBQWU7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3pDLEtBQUssRUFBRSx3REFBd0Q7U0FDaEUsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxlQUFlLENBQUMsQ0FBQztRQUNwRCxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sR0FBRyxHQUFHLElBQUksZUFBUyxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7WUFDOUMsT0FBTyxFQUFFO2dCQUNQLElBQUksWUFBTSxDQUFDO29CQUNULFlBQVksRUFBRTt3QkFDWixpQkFBVyxDQUFDLHNCQUFzQjtxQkFDbkM7b0JBQ0QsZ0JBQWdCLEVBQUUsSUFBSSx1QkFBaUIsQ0FBQyxJQUFJLENBQUM7aUJBQzlDLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztRQUNILEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFdEIscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMkJBQTJCLEVBQUU7WUFDM0UsSUFBSSxFQUFFLGFBQWE7WUFDbkIsT0FBTyxFQUFFO2dCQUNQLHNCQUFzQixFQUFFO29CQUN0Qjt3QkFDRSxJQUFJLEVBQUUsZUFBZTt3QkFDckIsT0FBTyxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsOEJBQThCLEVBQUUsS0FBSyxDQUFDLEVBQUU7d0JBQ2xFLEdBQUcsRUFBRSx3REFBd0Q7cUJBQzlEO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFDSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxzQ0FBc0MsRUFBRTtZQUN0RixtQkFBbUIsRUFBRTtnQkFDbkIsWUFBWSxFQUFFLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDO2FBQzVDO1lBQ0Qsc0JBQXNCLEVBQUU7Z0JBQ3RCLFlBQVksRUFBRSxDQUFDLHFCQUFxQixFQUFFLGVBQWUsQ0FBQzthQUN2RDtZQUNELGtCQUFrQixFQUFFO2dCQUNsQixVQUFVLEVBQUU7b0JBQ1YsRUFBRTtvQkFDRjt3QkFDRSxNQUFNO3dCQUNOLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFO3dCQUN6QixhQUFhO3dCQUNiLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRTt3QkFDdEIsR0FBRzt3QkFDSCxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRTt3QkFDekIsZUFBZTt3QkFDZixFQUFFLEdBQUcsRUFBRSx1QkFBdUIsRUFBRTt3QkFDaEMsZUFBZTt3QkFDZixFQUFFLEdBQUcsRUFBRSxvQ0FBb0MsRUFBRTtxQkFDOUM7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUNILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGdCQUFnQixFQUFFO1lBQ2hFLFFBQVEsRUFBRTtnQkFDUjtvQkFDRSxjQUFjLEVBQUU7d0JBQ2QsU0FBUyxFQUFFOzRCQUNUO2dDQUNFLE1BQU0sRUFBRSxnQkFBTSxDQUFDLEtBQUs7Z0NBQ3BCLFFBQVEsRUFBRSx3REFBd0Q7Z0NBQ2xFLE1BQU0sRUFBRTtvQ0FDTix1QkFBdUI7b0NBQ3ZCLG9CQUFvQjtpQ0FDckI7NkJBQ0Y7eUJBQ0Y7cUJBQ0Y7b0JBQ0QsVUFBVSxFQUFFLGdEQUFnRDtpQkFDN0Q7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGlEQUFpRCxFQUFFLEdBQUcsRUFBRTtRQUMzRCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUNwRCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQ2xDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7WUFDNUMsT0FBTyxFQUFFLGVBQWU7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3pDLEtBQUssRUFBRSx3REFBd0Q7U0FDaEUsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxlQUFlLENBQUMsQ0FBQztRQUNwRCxNQUFNLGFBQWEsR0FBRyxJQUFJLHlCQUFtQixDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRTtZQUN0RSxXQUFXLEVBQUUsR0FBRztZQUNoQixPQUFPLEVBQUUsMEJBQW9CLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFDO1NBQ3BFLENBQUMsQ0FBQztRQUNILE1BQU0sR0FBRyxHQUFHLElBQUksZUFBUyxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7WUFDOUMsT0FBTyxFQUFFO2dCQUNQLElBQUksWUFBTSxDQUFDO29CQUNULFlBQVksRUFBRTt3QkFDWixpQkFBVyxDQUFDLHNCQUFzQjtxQkFDbkM7b0JBQ0QsZ0JBQWdCLEVBQUUsSUFBSSx1QkFBaUIsQ0FBQyxJQUFJLENBQUM7aUJBQzlDLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztRQUNILGFBQWEsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFaEMscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMkJBQTJCLEVBQUU7WUFDM0UsSUFBSSxFQUFFLGFBQWE7WUFDbkIsT0FBTyxFQUFFO2dCQUNQLHNCQUFzQixFQUFFO29CQUN0Qjt3QkFDRSxJQUFJLEVBQUUsZUFBZTt3QkFDckIsT0FBTyxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsOEJBQThCLEVBQUUsS0FBSyxDQUFDLEVBQUU7d0JBQ2xFLEdBQUcsRUFBRSx3REFBd0Q7cUJBQzlEO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFDSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxzQ0FBc0MsRUFBRTtZQUN0RixtQkFBbUIsRUFBRTtnQkFDbkIsWUFBWSxFQUFFLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDO2FBQzVDO1lBQ0Qsc0JBQXNCLEVBQUU7Z0JBQ3RCLFlBQVksRUFBRSxDQUFDLHFCQUFxQixFQUFFLGVBQWUsQ0FBQzthQUN2RDtZQUNELGtCQUFrQixFQUFFO2dCQUNsQixVQUFVLEVBQUU7b0JBQ1YsRUFBRTtvQkFDRjt3QkFDRSxNQUFNO3dCQUNOLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFO3dCQUN6QixhQUFhO3dCQUNiLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRTt3QkFDdEIsR0FBRzt3QkFDSCxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRTt3QkFDekIsZUFBZTt3QkFDZixFQUFFLEdBQUcsRUFBRSx1QkFBdUIsRUFBRTt3QkFDaEMsd0JBQXdCO3dCQUN4QixFQUFFLEdBQUcsRUFBRSw2Q0FBNkMsRUFBRTtxQkFDdkQ7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUNILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGdCQUFnQixFQUFFO1lBQ2hFLFFBQVEsRUFBRTtnQkFDUjtvQkFDRSxjQUFjLEVBQUU7d0JBQ2QsU0FBUyxFQUFFOzRCQUNUO2dDQUNFLE1BQU0sRUFBRSxnQkFBTSxDQUFDLEtBQUs7Z0NBQ3BCLFFBQVEsRUFBRSx3REFBd0Q7Z0NBQ2xFLE1BQU0sRUFBRTtvQ0FDTix1QkFBdUI7b0NBQ3ZCLG9CQUFvQjtpQ0FDckI7NkJBQ0Y7eUJBQ0Y7cUJBQ0Y7b0JBQ0QsVUFBVSxFQUFFLGdEQUFnRDtpQkFDN0Q7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtRQUN6QyxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUNwRCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQ2xDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7WUFDNUMsT0FBTyxFQUFFLGVBQWU7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3pDLEtBQUssRUFBRSx3REFBd0Q7U0FDaEUsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUNyQyxTQUFTLEVBQUUsSUFBSSwwQkFBZ0IsQ0FBQyx5QkFBeUIsQ0FBQztTQUMzRCxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDckMsS0FBSyxFQUFFLG9DQUFvQztTQUM1QyxDQUFDLENBQUM7UUFDSCxJQUFJLGVBQVMsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQ2xDLE9BQU8sRUFBRTtnQkFDUCxJQUFJLFlBQU0sQ0FBQztvQkFDVCxZQUFZLEVBQUU7d0JBQ1osaUJBQVcsQ0FBQyxzQkFBc0I7cUJBQ25DO29CQUNELGdCQUFnQixFQUFFLElBQUksdUJBQWlCLENBQUMsSUFBSSxDQUFDO29CQUM3QyxhQUFhLEVBQUUsSUFBSTtpQkFDcEIsQ0FBQzthQUNIO1NBQ0YsQ0FBQyxDQUFDO1FBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMkJBQTJCLEVBQUU7WUFDM0UsSUFBSSxFQUFFLGFBQWE7WUFDbkIsT0FBTyxFQUFFO2dCQUNQLHNCQUFzQixFQUFFO29CQUN0Qjt3QkFDRSxJQUFJLEVBQUUsZUFBZTt3QkFDckIsT0FBTyxFQUFFLG9DQUFvQzt3QkFDN0MsR0FBRyxFQUFFLHdEQUF3RDtxQkFDOUQ7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtRQUM5QixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLFNBQVMsR0FBRyxlQUFTLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFDL0QsNkRBQTZELENBQUMsQ0FBQztRQUVqRSxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoRCxNQUFNLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN0RCxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1FBQ3BELE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixlQUFTLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFDN0MscURBQXFELENBQUMsQ0FBQztRQUMzRCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsK0ZBQStGLENBQUMsQ0FBQztJQUM5RyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx5Q0FBeUMsRUFBRSxHQUFHLEVBQUU7UUFDbkQsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLGVBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUM3Qyx1REFBdUQsQ0FBQyxDQUFDO1FBQzdELENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw4R0FBOEcsQ0FBQyxDQUFDO0lBQzdILENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHFEQUFxRCxFQUFFLEdBQUcsRUFBRTtRQUMvRCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1YsZUFBUyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxhQUFhLEVBQzdDLDREQUE0RCxDQUFDLENBQUM7UUFDbEUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDhHQUE4RyxDQUFDLENBQUM7SUFDN0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO1FBQzdCLE1BQU0sTUFBTSxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO1FBQ3pCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFO1lBQzNDLEdBQUcsRUFBRTtnQkFDSCxNQUFNLEVBQUUsV0FBVztnQkFDbkIsT0FBTyxFQUFFLGNBQWM7YUFDeEI7U0FDRixDQUFDLENBQUM7UUFDSCxNQUFNLFNBQVMsR0FBRyxlQUFTLENBQUMsdUJBQXVCLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUN0RSxXQUFXLEVBQUUsUUFBUTtZQUNyQixzQkFBc0IsRUFBRSxDQUFDO1NBQzFCLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNwRCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEFwcCB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnYXdzLWNkay1saWIvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBFdmVudEJ1cyB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1ldmVudHMnO1xuaW1wb3J0IHsgRWZmZWN0LCBSb2xlLCBTZXJ2aWNlUHJpbmNpcGFsIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBUb3BpYyB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zbnMnO1xuaW1wb3J0IHsgUXVldWUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3FzJztcbmltcG9ydCB7XG4gIEFjdGlvbixcbiAgQWN0aW9uUG9pbnQsXG4gIEFwcGxpY2F0aW9uLFxuICBDb25maWd1cmF0aW9uQ29udGVudCxcbiAgRXh0ZW5zaW9uLFxuICBIb3N0ZWRDb25maWd1cmF0aW9uLFxuICBQYXJhbWV0ZXIsXG4gIExhbWJkYURlc3RpbmF0aW9uLFxuICBTcXNEZXN0aW5hdGlvbixcbiAgU25zRGVzdGluYXRpb24sXG4gIEV2ZW50QnJpZGdlRGVzdGluYXRpb24sXG59IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdleHRlbnNpb24nLCAoKSA9PiB7XG4gIHRlc3QoJ3NpbXBsZSBleHRlbnNpb24gd2l0aCBsYW1iZGEnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgZnVuYyA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUZ1bmN0aW9uJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOCxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJyMgZHVtbXkgZnVuYycpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgIH0pO1xuICAgIG5ldyBFeHRlbnNpb24oc3RhY2ssICdNeUV4dGVuc2lvbicsIHtcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IEFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uUG9pbnRzOiBbXG4gICAgICAgICAgICBBY3Rpb25Qb2ludC5PTl9ERVBMT1lNRU5UX0NPTVBMRVRFLFxuICAgICAgICAgICAgQWN0aW9uUG9pbnQuT05fREVQTE9ZTUVOVF9ST0xMRURfQkFDSyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGV2ZW50RGVzdGluYXRpb246IG5ldyBMYW1iZGFEZXN0aW5hdGlvbihmdW5jKSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpFeHRlbnNpb24nLCB7XG4gICAgICBOYW1lOiAnTXlFeHRlbnNpb24nLFxuICAgICAgQWN0aW9uczoge1xuICAgICAgICBPTl9ERVBMT1lNRU5UX0NPTVBMRVRFOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgTmFtZTogJ015RXh0ZW5zaW9uLTAnLFxuICAgICAgICAgICAgUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnTXlFeHRlbnNpb25Sb2xlNDY3RDZGQ0RFRUZBNScsICdBcm4nXSB9LFxuICAgICAgICAgICAgVXJpOiB7ICdGbjo6R2V0QXR0JzogWydNeUZ1bmN0aW9uM0JBQTcyRDEnLCAnQXJuJ10gfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBPTl9ERVBMT1lNRU5UX1JPTExFRF9CQUNLOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgTmFtZTogJ015RXh0ZW5zaW9uLTAnLFxuICAgICAgICAgICAgUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnTXlFeHRlbnNpb25Sb2xlNDY3RDZGQ0RFRUZBNScsICdBcm4nXSB9LFxuICAgICAgICAgICAgVXJpOiB7ICdGbjo6R2V0QXR0JzogWydNeUZ1bmN0aW9uM0JBQTcyRDEnLCAnQXJuJ10gfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBQb2xpY2llczogW1xuICAgICAgICB7XG4gICAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgRWZmZWN0OiBFZmZlY3QuQUxMT1csXG4gICAgICAgICAgICAgICAgUmVzb3VyY2U6IHsgJ0ZuOjpHZXRBdHQnOiBbJ015RnVuY3Rpb24zQkFBNzJEMScsICdBcm4nXSB9LFxuICAgICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICAgJ2xhbWJkYTpJbnZva2VGdW5jdGlvbicsXG4gICAgICAgICAgICAgICAgICAnbGFtYmRhOkludm9rZUFzeW5jJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFBvbGljeU5hbWU6ICdBbGxvd0FwcENvbmZpZ0ludm9rZUV4dGVuc2lvbkV2ZW50U291cmNlUG9saWN5JyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NpbXBsZSBleHRlbnNpb24gd2l0aCB0d28gbGFtYmRhcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBmdW5jMSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUZ1bmN0aW9uMScsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzgsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCcjIGR1bW15IGZ1bmMnKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICB9KTtcbiAgICBjb25zdCBmdW5jMiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUZ1bmN0aW9uMicsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzgsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCcjIGR1bW15IGZ1bmMnKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZnVuYzEsICdmdW5jdGlvbkFybicsIHtcbiAgICAgIHZhbHVlOiAnYXJuOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uJyxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZnVuYzIsICdmdW5jdGlvbkFybicsIHtcbiAgICAgIHZhbHVlOiAnYXJuOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWRpZmYtZnVuY3Rpb24nLFxuICAgIH0pO1xuICAgIG5ldyBFeHRlbnNpb24oc3RhY2ssICdNeUV4dGVuc2lvbicsIHtcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IEFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uUG9pbnRzOiBbXG4gICAgICAgICAgICBBY3Rpb25Qb2ludC5PTl9ERVBMT1lNRU5UX0NPTVBMRVRFLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgZXZlbnREZXN0aW5hdGlvbjogbmV3IExhbWJkYURlc3RpbmF0aW9uKGZ1bmMxKSxcbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvblBvaW50czogW1xuICAgICAgICAgICAgQWN0aW9uUG9pbnQuT05fREVQTE9ZTUVOVF9ST0xMRURfQkFDSyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGV2ZW50RGVzdGluYXRpb246IG5ldyBMYW1iZGFEZXN0aW5hdGlvbihmdW5jMiksXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6RXh0ZW5zaW9uJywge1xuICAgICAgTmFtZTogJ015RXh0ZW5zaW9uJyxcbiAgICAgIEFjdGlvbnM6IHtcbiAgICAgICAgT05fREVQTE9ZTUVOVF9DT01QTEVURTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIE5hbWU6ICdNeUV4dGVuc2lvbi0wJyxcbiAgICAgICAgICAgIFJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ015RXh0ZW5zaW9uUm9sZTQ2N0Q2RkNERUVGQTUnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgIFVyaTogJ2FybjpsYW1iZGE6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpmdW5jdGlvbjpteS1mdW5jdGlvbicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgT05fREVQTE9ZTUVOVF9ST0xMRURfQkFDSzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIE5hbWU6ICdNeUV4dGVuc2lvbi0xJyxcbiAgICAgICAgICAgIFJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ015RXh0ZW5zaW9uUm9sZUJFNjE0RjE4MkM3MEEnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgIFVyaTogJ2FybjpsYW1iZGE6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpmdW5jdGlvbjpteS1kaWZmLWZ1bmN0aW9uJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlUHJvcGVydGllc0NvdW50SXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgUG9saWNpZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgICAgICAgICAgIFJlc291cmNlOiAnYXJuOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uJyxcbiAgICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAgICdsYW1iZGE6SW52b2tlRnVuY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgJ2xhbWJkYTpJbnZva2VBc3luYycsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBQb2xpY3lOYW1lOiAnQWxsb3dBcHBDb25maWdJbnZva2VFeHRlbnNpb25FdmVudFNvdXJjZVBvbGljeScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sIDEpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VQcm9wZXJ0aWVzQ291bnRJcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBQb2xpY2llczogW1xuICAgICAgICB7XG4gICAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgRWZmZWN0OiBFZmZlY3QuQUxMT1csXG4gICAgICAgICAgICAgICAgUmVzb3VyY2U6ICdhcm46bGFtYmRhOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6ZnVuY3Rpb246bXktZGlmZi1mdW5jdGlvbicsXG4gICAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgICAnbGFtYmRhOkludm9rZUZ1bmN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICdsYW1iZGE6SW52b2tlQXN5bmMnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgUG9saWN5TmFtZTogJ0FsbG93QXBwQ29uZmlnSW52b2tlRXh0ZW5zaW9uRXZlbnRTb3VyY2VQb2xpY3knLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgdGVzdCgnZXh0ZW5zaW9uIHdpdGggYWxsIHByb3BzIHVzaW5nIGxhbWJkYScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBmdW5jID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015RnVuY3Rpb24nLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM184LFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnIyBkdW1teSBmdW5jJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZ1bmMsICdmdW5jdGlvbkFybicsIHtcbiAgICAgIHZhbHVlOiAnYXJuOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uJyxcbiAgICB9KTtcbiAgICBjb25zdCBhcHBjb25maWcgPSBuZXcgQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcGxpY2F0aW9uJywge1xuICAgICAgYXBwbGljYXRpb25OYW1lOiAnTXlBcHBsaWNhdGlvbicsXG4gICAgfSk7XG4gICAgY29uc3QgZXh0ID0gbmV3IEV4dGVuc2lvbihzdGFjaywgJ015RXh0ZW5zaW9uJywge1xuICAgICAgYWN0aW9uczogW1xuICAgICAgICBuZXcgQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25Qb2ludHM6IFtcbiAgICAgICAgICAgIEFjdGlvblBvaW50Lk9OX0RFUExPWU1FTlRfQ09NUExFVEUsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBldmVudERlc3RpbmF0aW9uOiBuZXcgTGFtYmRhRGVzdGluYXRpb24oZnVuYyksXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICAgIGV4dGVuc2lvbk5hbWU6ICdUZXN0RXh0ZW5zaW9uJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyBteSBleHRlbnNpb24nLFxuICAgICAgcGFyYW1ldGVyczogW1xuICAgICAgICBQYXJhbWV0ZXIucmVxdWlyZWQoJ3Rlc3RWYXJpYWJsZScsICdoZWxsbycpLFxuICAgICAgICBQYXJhbWV0ZXIubm90UmVxdWlyZWQoJ3Rlc3ROb3RSZXF1aXJlZFZhcmlhYmxlJyksXG4gICAgICBdLFxuICAgICAgbGF0ZXN0VmVyc2lvbk51bWJlcjogMSxcbiAgICB9KTtcbiAgICBhcHBjb25maWcuYWRkRXh0ZW5zaW9uKGV4dCk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkV4dGVuc2lvbicsIHtcbiAgICAgIE5hbWU6ICdUZXN0RXh0ZW5zaW9uJyxcbiAgICAgIEFjdGlvbnM6IHtcbiAgICAgICAgT05fREVQTE9ZTUVOVF9DT01QTEVURTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIE5hbWU6ICdUZXN0RXh0ZW5zaW9uLTAnLFxuICAgICAgICAgICAgUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnTXlFeHRlbnNpb25Sb2xlQ0E5ODQ5MTcxNjIwNycsICdBcm4nXSB9LFxuICAgICAgICAgICAgVXJpOiAnYXJuOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIERlc2NyaXB0aW9uOiAnVGhpcyBpcyBteSBleHRlbnNpb24nLFxuICAgICAgUGFyYW1ldGVyczoge1xuICAgICAgICB0ZXN0VmFyaWFibGU6IHsgUmVxdWlyZWQ6IHRydWUgfSxcbiAgICAgICAgdGVzdE5vdFJlcXVpcmVkVmFyaWFibGU6IHsgUmVxdWlyZWQ6IGZhbHNlIH0sXG4gICAgICB9LFxuICAgICAgTGF0ZXN0VmVyc2lvbk51bWJlcjogMSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkV4dGVuc2lvbkFzc29jaWF0aW9uJywge1xuICAgICAgRXh0ZW5zaW9uSWRlbnRpZmllcjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFsnTXlFeHRlbnNpb244OUE5MTVEMCcsICdJZCddLFxuICAgICAgfSxcbiAgICAgIEV4dGVuc2lvblZlcnNpb25OdW1iZXI6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ015RXh0ZW5zaW9uODlBOTE1RDAnLCAnVmVyc2lvbk51bWJlciddLFxuICAgICAgfSxcbiAgICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICAgdGVzdFZhcmlhYmxlOiAnaGVsbG8nLFxuICAgICAgfSxcbiAgICAgIFJlc291cmNlSWRlbnRpZmllcjoge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICc6YXBwY29uZmlnOicsXG4gICAgICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICc6YXBwbGljYXRpb24vJyxcbiAgICAgICAgICAgIHsgUmVmOiAnTXlBcHBsaWNhdGlvbjVDNjNFQzFEJyB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIFBvbGljaWVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBFZmZlY3Q6IEVmZmVjdC5BTExPVyxcbiAgICAgICAgICAgICAgICBSZXNvdXJjZTogJ2FybjpsYW1iZGE6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpmdW5jdGlvbjpteS1mdW5jdGlvbicsXG4gICAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgICAnbGFtYmRhOkludm9rZUZ1bmN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICdsYW1iZGE6SW52b2tlQXN5bmMnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgUG9saWN5TmFtZTogJ0FsbG93QXBwQ29uZmlnSW52b2tlRXh0ZW5zaW9uRXZlbnRTb3VyY2VQb2xpY3knLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZXh0ZW5zaW9uIHdpdGggcXVldWUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgcXVldWUgPSBuZXcgUXVldWUoc3RhY2ssICdNeVF1ZXVlJyk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHF1ZXVlLCAncXVldWVBcm4nLCB7XG4gICAgICB2YWx1ZTogJ2FybjpzcXM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpteS1xdWV1ZScsXG4gICAgfSk7XG4gICAgbmV3IEV4dGVuc2lvbihzdGFjaywgJ015RXh0ZW5zaW9uJywge1xuICAgICAgYWN0aW9uczogW1xuICAgICAgICBuZXcgQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25Qb2ludHM6IFtcbiAgICAgICAgICAgIEFjdGlvblBvaW50Lk9OX0RFUExPWU1FTlRfUk9MTEVEX0JBQ0ssXG4gICAgICAgICAgXSxcbiAgICAgICAgICBldmVudERlc3RpbmF0aW9uOiBuZXcgU3FzRGVzdGluYXRpb24ocXVldWUpLFxuICAgICAgICAgIG5hbWU6ICdBY3Rpb25UZXN0TmFtZScsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdUaGlzIGlzIG15IGFjdGlvbiBkZXNjcmlwdGlvbicsXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6RXh0ZW5zaW9uJywge1xuICAgICAgTmFtZTogJ015RXh0ZW5zaW9uJyxcbiAgICAgIEFjdGlvbnM6IHtcbiAgICAgICAgT05fREVQTE9ZTUVOVF9ST0xMRURfQkFDSzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIERlc2NyaXB0aW9uOiAnVGhpcyBpcyBteSBhY3Rpb24gZGVzY3JpcHRpb24nLFxuICAgICAgICAgICAgTmFtZTogJ0FjdGlvblRlc3ROYW1lJyxcbiAgICAgICAgICAgIFJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ015RXh0ZW5zaW9uUm9sZTc2QjAyMkJDNEYyQkMnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgIFVyaTogJ2FybjpzcXM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpteS1xdWV1ZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgUG9saWNpZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgICAgICAgICAgIFJlc291cmNlOiAnYXJuOnNxczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOm15LXF1ZXVlJyxcbiAgICAgICAgICAgICAgICBBY3Rpb246ICdzcXM6U2VuZE1lc3NhZ2UnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFBvbGljeU5hbWU6ICdBbGxvd0FwcENvbmZpZ0ludm9rZUV4dGVuc2lvbkV2ZW50U291cmNlUG9saWN5JyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2V4dGVuc2lvbiB3aXRoIHRvcGljJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHRvcGljID0gbmV3IFRvcGljKHN0YWNrLCAnTXlUb3BpYycpO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0b3BpYywgJ3RvcGljQXJuJywge1xuICAgICAgdmFsdWU6ICdhcm46c25zOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6bXktdG9waWMnLFxuICAgIH0pO1xuICAgIG5ldyBFeHRlbnNpb24oc3RhY2ssICdNeUV4dGVuc2lvbicsIHtcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IEFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uUG9pbnRzOiBbXG4gICAgICAgICAgICBBY3Rpb25Qb2ludC5PTl9ERVBMT1lNRU5UX0JBS0lORyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGV2ZW50RGVzdGluYXRpb246IG5ldyBTbnNEZXN0aW5hdGlvbih0b3BpYyksXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6RXh0ZW5zaW9uJywge1xuICAgICAgTmFtZTogJ015RXh0ZW5zaW9uJyxcbiAgICAgIEFjdGlvbnM6IHtcbiAgICAgICAgT05fREVQTE9ZTUVOVF9CQUtJTkc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBOYW1lOiAnTXlFeHRlbnNpb24tMCcsXG4gICAgICAgICAgICBSb2xlQXJuOiB7ICdGbjo6R2V0QXR0JzogWydNeUV4dGVuc2lvblJvbGU0NjdENkZDREVFRkE1JywgJ0FybiddIH0sXG4gICAgICAgICAgICBVcmk6ICdhcm46c25zOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6bXktdG9waWMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIFBvbGljaWVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBFZmZlY3Q6IEVmZmVjdC5BTExPVyxcbiAgICAgICAgICAgICAgICBSZXNvdXJjZTogJ2FybjpzbnM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpteS10b3BpYycsXG4gICAgICAgICAgICAgICAgQWN0aW9uOiAnc25zOlB1Ymxpc2gnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFBvbGljeU5hbWU6ICdBbGxvd0FwcENvbmZpZ0ludm9rZUV4dGVuc2lvbkV2ZW50U291cmNlUG9saWN5JyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2V4dGVuc2lvbiB3aXRoIGJ1cycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBidXMgPSBuZXcgRXZlbnRCdXMoc3RhY2ssICdNeUV2ZW50QnVzJyk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGJ1cywgJ2V2ZW50QnVzQXJuJywge1xuICAgICAgdmFsdWU6ICdhcm46YXdzOmV2ZW50czp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmV2ZW50LWJ1cy9hd3MucGFydG5lci9QYXJ0bmVyTmFtZS9hY2N0MS9yZXBvMScsXG4gICAgfSk7XG4gICAgbmV3IEV4dGVuc2lvbihzdGFjaywgJ015RXh0ZW5zaW9uJywge1xuICAgICAgYWN0aW9uczogW1xuICAgICAgICBuZXcgQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25Qb2ludHM6IFtcbiAgICAgICAgICAgIEFjdGlvblBvaW50Lk9OX0RFUExPWU1FTlRfQkFLSU5HLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgZXZlbnREZXN0aW5hdGlvbjogbmV3IEV2ZW50QnJpZGdlRGVzdGluYXRpb24oYnVzKSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpFeHRlbnNpb24nLCB7XG4gICAgICBOYW1lOiAnTXlFeHRlbnNpb24nLFxuICAgICAgQWN0aW9uczoge1xuICAgICAgICBPTl9ERVBMT1lNRU5UX0JBS0lORzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIE5hbWU6ICdNeUV4dGVuc2lvbi0wJyxcbiAgICAgICAgICAgIFVyaTogJ2Fybjphd3M6ZXZlbnRzOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6ZXZlbnQtYnVzL2F3cy5wYXJ0bmVyL1BhcnRuZXJOYW1lL2FjY3QxL3JlcG8xJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlJvbGUnLCAwKTtcbiAgfSk7XG5cbiAgdGVzdCgnZXh0ZW5zaW9uIHdpdGggYXNzb2NpYXRlZCBlbnZpcm9ubWVudCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBmdW5jID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015RnVuY3Rpb24nLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM184LFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnIyBkdW1teSBmdW5jJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZ1bmMsICdmdW5jdGlvbkFybicsIHtcbiAgICAgIHZhbHVlOiAnYXJuOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uJyxcbiAgICB9KTtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcGxpY2F0aW9uJyk7XG4gICAgY29uc3QgZW52ID0gYXBwLmFkZEVudmlyb25tZW50KCdNeUVudmlyb25tZW50Jyk7XG4gICAgY29uc3QgZXh0ID0gbmV3IEV4dGVuc2lvbihzdGFjaywgJ015RXh0ZW5zaW9uJywge1xuICAgICAgYWN0aW9uczogW1xuICAgICAgICBuZXcgQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25Qb2ludHM6IFtcbiAgICAgICAgICAgIEFjdGlvblBvaW50Lk9OX0RFUExPWU1FTlRfQ09NUExFVEUsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBldmVudERlc3RpbmF0aW9uOiBuZXcgTGFtYmRhRGVzdGluYXRpb24oZnVuYyksXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBlbnYuYWRkRXh0ZW5zaW9uKGV4dCk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkV4dGVuc2lvbicsIHtcbiAgICAgIE5hbWU6ICdNeUV4dGVuc2lvbicsXG4gICAgICBBY3Rpb25zOiB7XG4gICAgICAgIE9OX0RFUExPWU1FTlRfQ09NUExFVEU6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBOYW1lOiAnTXlFeHRlbnNpb24tMCcsXG4gICAgICAgICAgICBSb2xlQXJuOiB7ICdGbjo6R2V0QXR0JzogWydNeUV4dGVuc2lvblJvbGU0NjdENkZDREVFRkE1JywgJ0FybiddIH0sXG4gICAgICAgICAgICBVcmk6ICdhcm46bGFtYmRhOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6ZnVuY3Rpb246bXktZnVuY3Rpb24nLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6RXh0ZW5zaW9uQXNzb2NpYXRpb24nLCB7XG4gICAgICBFeHRlbnNpb25JZGVudGlmaWVyOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogWydNeUV4dGVuc2lvbjg5QTkxNUQwJywgJ0lkJ10sXG4gICAgICB9LFxuICAgICAgRXh0ZW5zaW9uVmVyc2lvbk51bWJlcjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFsnTXlFeHRlbnNpb244OUE5MTVEMCcsICdWZXJzaW9uTnVtYmVyJ10sXG4gICAgICB9LFxuICAgICAgUmVzb3VyY2VJZGVudGlmaWVyOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgJzphcHBjb25maWc6JyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICAnOicsXG4gICAgICAgICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgICAgICAgJzphcHBsaWNhdGlvbi8nLFxuICAgICAgICAgICAgeyBSZWY6ICdNeUFwcGxpY2F0aW9uNUM2M0VDMUQnIH0sXG4gICAgICAgICAgICAnL2Vudmlyb25tZW50LycsXG4gICAgICAgICAgICB7IFJlZjogJ015QXBwbGljYXRpb25NeUVudmlyb25tZW50MTBEOTQzNTYnIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgUG9saWNpZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgICAgICAgICAgIFJlc291cmNlOiAnYXJuOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uJyxcbiAgICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAgICdsYW1iZGE6SW52b2tlRnVuY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgJ2xhbWJkYTpJbnZva2VBc3luYycsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBQb2xpY3lOYW1lOiAnQWxsb3dBcHBDb25maWdJbnZva2VFeHRlbnNpb25FdmVudFNvdXJjZVBvbGljeScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdleHRlbnNpb24gd2l0aCBhc3NvY2lhdGVkIGNvbmZpZ3VyYXRpb24gcHJvZmlsZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBmdW5jID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015RnVuY3Rpb24nLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM184LFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnIyBkdW1teSBmdW5jJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZ1bmMsICdmdW5jdGlvbkFybicsIHtcbiAgICAgIHZhbHVlOiAnYXJuOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uJyxcbiAgICB9KTtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcGxpY2F0aW9uJyk7XG4gICAgY29uc3QgY29uZmlnUHJvZmlsZSA9IG5ldyBIb3N0ZWRDb25maWd1cmF0aW9uKHN0YWNrLCAnTXlDb25maWd1cmF0aW9uJywge1xuICAgICAgYXBwbGljYXRpb246IGFwcCxcbiAgICAgIGNvbnRlbnQ6IENvbmZpZ3VyYXRpb25Db250ZW50LmZyb21JbmxpbmVKc29uKCdUaGlzIGlzIG15IGNvbnRlbnQuJyksXG4gICAgfSk7XG4gICAgY29uc3QgZXh0ID0gbmV3IEV4dGVuc2lvbihzdGFjaywgJ015RXh0ZW5zaW9uJywge1xuICAgICAgYWN0aW9uczogW1xuICAgICAgICBuZXcgQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25Qb2ludHM6IFtcbiAgICAgICAgICAgIEFjdGlvblBvaW50Lk9OX0RFUExPWU1FTlRfQ09NUExFVEUsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBldmVudERlc3RpbmF0aW9uOiBuZXcgTGFtYmRhRGVzdGluYXRpb24oZnVuYyksXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBjb25maWdQcm9maWxlLmFkZEV4dGVuc2lvbihleHQpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpFeHRlbnNpb24nLCB7XG4gICAgICBOYW1lOiAnTXlFeHRlbnNpb24nLFxuICAgICAgQWN0aW9uczoge1xuICAgICAgICBPTl9ERVBMT1lNRU5UX0NPTVBMRVRFOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgTmFtZTogJ015RXh0ZW5zaW9uLTAnLFxuICAgICAgICAgICAgUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnTXlFeHRlbnNpb25Sb2xlNDY3RDZGQ0RFRUZBNScsICdBcm4nXSB9LFxuICAgICAgICAgICAgVXJpOiAnYXJuOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkV4dGVuc2lvbkFzc29jaWF0aW9uJywge1xuICAgICAgRXh0ZW5zaW9uSWRlbnRpZmllcjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFsnTXlFeHRlbnNpb244OUE5MTVEMCcsICdJZCddLFxuICAgICAgfSxcbiAgICAgIEV4dGVuc2lvblZlcnNpb25OdW1iZXI6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ015RXh0ZW5zaW9uODlBOTE1RDAnLCAnVmVyc2lvbk51bWJlciddLFxuICAgICAgfSxcbiAgICAgIFJlc291cmNlSWRlbnRpZmllcjoge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICc6YXBwY29uZmlnOicsXG4gICAgICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICc6YXBwbGljYXRpb24vJyxcbiAgICAgICAgICAgIHsgUmVmOiAnTXlBcHBsaWNhdGlvbjVDNjNFQzFEJyB9LFxuICAgICAgICAgICAgJy9jb25maWd1cmF0aW9ucHJvZmlsZS8nLFxuICAgICAgICAgICAgeyBSZWY6ICdNeUNvbmZpZ3VyYXRpb25Db25maWd1cmF0aW9uUHJvZmlsZUVFMEVDQTg1JyB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIFBvbGljaWVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBFZmZlY3Q6IEVmZmVjdC5BTExPVyxcbiAgICAgICAgICAgICAgICBSZXNvdXJjZTogJ2FybjpsYW1iZGE6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpmdW5jdGlvbjpteS1mdW5jdGlvbicsXG4gICAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgICAnbGFtYmRhOkludm9rZUZ1bmN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICdsYW1iZGE6SW52b2tlQXN5bmMnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgUG9saWN5TmFtZTogJ0FsbG93QXBwQ29uZmlnSW52b2tlRXh0ZW5zaW9uRXZlbnRTb3VyY2VQb2xpY3knLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZXh0ZW5zaW9uIHdpdGggZXhlY3V0aW9uIHJvbGUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgZnVuYyA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUZ1bmN0aW9uJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOCxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJyMgZHVtbXkgZnVuYycpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmdW5jLCAnZnVuY3Rpb25Bcm4nLCB7XG4gICAgICB2YWx1ZTogJ2FybjpsYW1iZGE6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpmdW5jdGlvbjpteS1mdW5jdGlvbicsXG4gICAgfSk7XG4gICAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnYXBwY29uZmlnLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocm9sZSwgJ3JvbGVBcm4nLCB7XG4gICAgICB2YWx1ZTogJ2FybjppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL215LXJvbGUnLFxuICAgIH0pO1xuICAgIG5ldyBFeHRlbnNpb24oc3RhY2ssICdNeUV4dGVuc2lvbicsIHtcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IEFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uUG9pbnRzOiBbXG4gICAgICAgICAgICBBY3Rpb25Qb2ludC5PTl9ERVBMT1lNRU5UX0NPTVBMRVRFLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgZXZlbnREZXN0aW5hdGlvbjogbmV3IExhbWJkYURlc3RpbmF0aW9uKGZ1bmMpLFxuICAgICAgICAgIGV4ZWN1dGlvblJvbGU6IHJvbGUsXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6RXh0ZW5zaW9uJywge1xuICAgICAgTmFtZTogJ015RXh0ZW5zaW9uJyxcbiAgICAgIEFjdGlvbnM6IHtcbiAgICAgICAgT05fREVQTE9ZTUVOVF9DT01QTEVURTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIE5hbWU6ICdNeUV4dGVuc2lvbi0wJyxcbiAgICAgICAgICAgIFJvbGVBcm46ICdhcm46aWFtOjoxMjM0NTY3ODkwMTI6cm9sZS9teS1yb2xlJyxcbiAgICAgICAgICAgIFVyaTogJ2FybjpsYW1iZGE6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpmdW5jdGlvbjpteS1mdW5jdGlvbicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Zyb20gZXh0ZW5zaW9uIGFybicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBleHRlbnNpb24gPSBFeHRlbnNpb24uZnJvbUV4dGVuc2lvbkFybihzdGFjaywgJ015RXh0ZW5zaW9uJyxcbiAgICAgICdhcm46YXdzOmFwcGNvbmZpZzp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOmV4dGVuc2lvbi9hYmMxMjMvMScpO1xuXG4gICAgZXhwZWN0KGV4dGVuc2lvbi5leHRlbnNpb25JZCkudG9FcXVhbCgnYWJjMTIzJyk7XG4gICAgZXhwZWN0KGV4dGVuc2lvbi5leHRlbnNpb25WZXJzaW9uTnVtYmVyKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChleHRlbnNpb24uZW52LmFjY291bnQpLnRvRXF1YWwoJzEyMzQ1Njc4OTAxMicpO1xuICAgIGV4cGVjdChleHRlbnNpb24uZW52LnJlZ2lvbikudG9FcXVhbCgndXMtd2VzdC0yJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Zyb20gZXh0ZW5zaW9uIGFybiB3aXRoIG5vIHJlc291cmNlIG5hbWUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIEV4dGVuc2lvbi5mcm9tRXh0ZW5zaW9uQXJuKHN0YWNrLCAnTXlFeHRlbnNpb24nLFxuICAgICAgICAnYXJuOmF3czphcHBjb25maWc6dXMtd2VzdC0yOjEyMzQ1Njc4OTAxMjpleHRlbnNpb24vJyk7XG4gICAgfSkudG9UaHJvdygnTWlzc2luZyByZXF1aXJlZCAvJC97ZXh0ZW5zaW9uSWR9Ly8kL3tleHRlbnNpb25WZXJzaW9uTnVtYmVyfSBmcm9tIGNvbmZpZ3VyYXRpb24gcHJvZmlsZSBBUk46Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Zyb20gZXh0ZW5zaW9uIGFybiB3aXRoIG5vIGV4dGVuc2lvbiBpZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgRXh0ZW5zaW9uLmZyb21FeHRlbnNpb25Bcm4oc3RhY2ssICdNeUV4dGVuc2lvbicsXG4gICAgICAgICdhcm46YXdzOmFwcGNvbmZpZzp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOmV4dGVuc2lvbi8vMScpO1xuICAgIH0pLnRvVGhyb3coJ01pc3NpbmcgcmVxdWlyZWQgcGFyYW1ldGVycyBmb3IgZXh0ZW5zaW9uIEFSTjogZm9ybWF0IHNob3VsZCBiZSAvJC97ZXh0ZW5zaW9uSWR9Ly8kL3tleHRlbnNpb25WZXJzaW9uTnVtYmVyfScpO1xuICB9KTtcblxuICB0ZXN0KCdmcm9tIGV4dGVuc2lvbiBhcm4gd2l0aCBubyBleHRlbnNpb24gdmVyc2lvbiBudW1iZXInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIEV4dGVuc2lvbi5mcm9tRXh0ZW5zaW9uQXJuKHN0YWNrLCAnTXlFeHRlbnNpb24nLFxuICAgICAgICAnYXJuOmF3czphcHBjb25maWc6dXMtd2VzdC0yOjEyMzQ1Njc4OTAxMjpleHRlbnNpb24vYWJjMTIzLycpO1xuICAgIH0pLnRvVGhyb3coJ01pc3NpbmcgcmVxdWlyZWQgcGFyYW1ldGVycyBmb3IgZXh0ZW5zaW9uIEFSTjogZm9ybWF0IHNob3VsZCBiZSAvJC97ZXh0ZW5zaW9uSWR9Ly8kL3tleHRlbnNpb25WZXJzaW9uTnVtYmVyfScpO1xuICB9KTtcblxuICB0ZXN0KCdmcm9tIGV4dGVuc2lvbiBpZCcsICgpID0+IHtcbiAgICBjb25zdCBjZGtBcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGNka0FwcCwgJ1N0YWNrJywge1xuICAgICAgZW52OiB7XG4gICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXG4gICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBleHRlbnNpb24gPSBFeHRlbnNpb24uZnJvbUV4dGVuc2lvbkF0dHJpYnV0ZXMoc3RhY2ssICdFeHRlbnNpb24nLCB7XG4gICAgICBleHRlbnNpb25JZDogJ2FiYzEyMycsXG4gICAgICBleHRlbnNpb25WZXJzaW9uTnVtYmVyOiAxLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KGV4dGVuc2lvbi5leHRlbnNpb25JZCkudG9FcXVhbCgnYWJjMTIzJyk7XG4gICAgZXhwZWN0KGV4dGVuc2lvbi5leHRlbnNpb25WZXJzaW9uTnVtYmVyKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChleHRlbnNpb24uZW52LmFjY291bnQpLnRvRXF1YWwoJzEyMzQ1Njc4OTAxMicpO1xuICAgIGV4cGVjdChleHRlbnNpb24uZW52LnJlZ2lvbikudG9FcXVhbCgndXMtd2VzdC0yJyk7XG4gIH0pO1xufSk7Il19