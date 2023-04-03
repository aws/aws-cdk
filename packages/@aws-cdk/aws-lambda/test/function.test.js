"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const aws_codeguruprofiler_1 = require("@aws-cdk/aws-codeguruprofiler");
const ec2 = require("@aws-cdk/aws-ec2");
const efs = require("@aws-cdk/aws-efs");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const logs = require("@aws-cdk/aws-logs");
const s3 = require("@aws-cdk/aws-s3");
const signer = require("@aws-cdk/aws-signer");
const sns = require("@aws-cdk/aws-sns");
const sqs = require("@aws-cdk/aws-sqs");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const _ = require("lodash");
const lambda = require("../lib");
const adot_layers_1 = require("../lib/adot-layers");
const function_hash_1 = require("../lib/function-hash");
describe('function', () => {
    test('default function', () => {
        const stack = new cdk.Stack();
        new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [{
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: { Service: 'lambda.amazonaws.com' },
                    }],
                Version: '2012-10-17',
            },
            ManagedPolicyArns: [{ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']] }],
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
            Properties: {
                Code: { ZipFile: 'foo' },
                Handler: 'index.handler',
                Role: { 'Fn::GetAtt': ['MyLambdaServiceRole4539ECB6', 'Arn'] },
                Runtime: 'nodejs14.x',
            },
            DependsOn: ['MyLambdaServiceRole4539ECB6'],
        });
    });
    test('adds policy permissions', () => {
        const stack = new cdk.Stack();
        new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            initialPolicy: [new iam.PolicyStatement({ actions: ['*'], resources: ['*'] })],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [{
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: { Service: 'lambda.amazonaws.com' },
                    }],
                Version: '2012-10-17',
            },
            ManagedPolicyArns: 
            // eslint-disable-next-line max-len
            [{ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']] }],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: '*',
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
            PolicyName: 'MyLambdaServiceRoleDefaultPolicy5BBC6F68',
            Roles: [
                {
                    Ref: 'MyLambdaServiceRole4539ECB6',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
            Properties: {
                Code: { ZipFile: 'foo' },
                Handler: 'index.handler',
                Role: { 'Fn::GetAtt': ['MyLambdaServiceRole4539ECB6', 'Arn'] },
                Runtime: 'nodejs14.x',
            },
            DependsOn: ['MyLambdaServiceRoleDefaultPolicy5BBC6F68', 'MyLambdaServiceRole4539ECB6'],
        });
    });
    test('fails if inline code is used for an invalid runtime', () => {
        const stack = new cdk.Stack();
        expect(() => new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'bar',
            runtime: lambda.Runtime.DOTNET_CORE_2,
        })).toThrow();
    });
    describe('addPermissions', () => {
        test('can be used to add permissions to the Lambda function', () => {
            const stack = new cdk.Stack();
            const fn = newTestLambda(stack);
            fn.addPermission('S3Permission', {
                action: 'lambda:*',
                principal: new iam.ServicePrincipal('s3.amazonaws.com'),
                sourceAccount: stack.account,
                sourceArn: 'arn:aws:s3:::my_bucket',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {
                                Service: 'lambda.amazonaws.com',
                            },
                        },
                    ],
                    Version: '2012-10-17',
                },
                ManagedPolicyArns: 
                // eslint-disable-next-line max-len
                [{ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']] }],
            });
            assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
                Properties: {
                    Code: {
                        ZipFile: 'foo',
                    },
                    Handler: 'bar',
                    Role: {
                        'Fn::GetAtt': [
                            'MyLambdaServiceRole4539ECB6',
                            'Arn',
                        ],
                    },
                    Runtime: 'python3.9',
                },
                DependsOn: [
                    'MyLambdaServiceRole4539ECB6',
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
                Action: 'lambda:*',
                FunctionName: {
                    'Fn::GetAtt': [
                        'MyLambdaCCE802FB',
                        'Arn',
                    ],
                },
                Principal: 's3.amazonaws.com',
                SourceAccount: {
                    Ref: 'AWS::AccountId',
                },
                SourceArn: 'arn:aws:s3:::my_bucket',
            });
        });
        test('can supply principalOrgID via permission property', () => {
            const stack = new cdk.Stack();
            const fn = newTestLambda(stack);
            const org = new iam.OrganizationPrincipal('o-xxxxxxxxxx');
            const account = new iam.AccountPrincipal('123456789012');
            fn.addPermission('S3Permission', {
                action: 'lambda:*',
                principal: account,
                organizationId: org.organizationId,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
                Action: 'lambda:*',
                FunctionName: {
                    'Fn::GetAtt': [
                        'MyLambdaCCE802FB',
                        'Arn',
                    ],
                },
                Principal: account.accountId,
                PrincipalOrgID: org.organizationId,
            });
        });
        test('fails if the principal is not a service, account, arn, or organization principal', () => {
            const stack = new cdk.Stack();
            const fn = newTestLambda(stack);
            expect(() => fn.addPermission('F1', { principal: new iam.CanonicalUserPrincipal('org') }))
                .toThrow(/Invalid principal type for Lambda permission statement/);
            fn.addPermission('S1', { principal: new iam.ServicePrincipal('my-service') });
            fn.addPermission('S2', { principal: new iam.AccountPrincipal('account') });
            fn.addPermission('S3', { principal: new iam.ArnPrincipal('my:arn') });
            fn.addPermission('S4', { principal: new iam.OrganizationPrincipal('my:org') });
        });
        test('applies source account/ARN conditions if the principal has conditions', () => {
            const stack = new cdk.Stack();
            const fn = newTestLambda(stack);
            const sourceAccount = 'some-account';
            const sourceArn = 'some-arn';
            const service = 'my-service';
            const principal = new iam.PrincipalWithConditions(new iam.ServicePrincipal(service), {
                ArnLike: {
                    'aws:SourceArn': sourceArn,
                },
                StringEquals: {
                    'aws:SourceAccount': sourceAccount,
                },
            });
            fn.addPermission('S1', { principal: principal });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
                Action: 'lambda:InvokeFunction',
                FunctionName: {
                    'Fn::GetAtt': [
                        'MyLambdaCCE802FB',
                        'Arn',
                    ],
                },
                Principal: service,
                SourceAccount: sourceAccount,
                SourceArn: sourceArn,
            });
        });
        test('applies source arn condition if principal has conditions', () => {
            const stack = new cdk.Stack();
            const fn = newTestLambda(stack);
            const sourceArn = 'some-arn';
            const service = 'my-service';
            const principal = new iam.PrincipalWithConditions(new iam.ServicePrincipal(service), {
                ArnLike: {
                    'aws:SourceArn': sourceArn,
                },
            });
            fn.addPermission('S1', { principal: principal });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
                Action: 'lambda:InvokeFunction',
                FunctionName: {
                    'Fn::GetAtt': [
                        'MyLambdaCCE802FB',
                        'Arn',
                    ],
                },
                Principal: service,
                SourceArn: sourceArn,
            });
        });
        test('applies principal org id conditions if the principal has conditions', () => {
            const stack = new cdk.Stack();
            const fn = newTestLambda(stack);
            const principalOrgId = 'org-xxxxxxxxxx';
            const service = 'my-service';
            const principal = new iam.PrincipalWithConditions(new iam.ServicePrincipal(service), {
                StringEquals: {
                    'aws:PrincipalOrgID': principalOrgId,
                },
            });
            fn.addPermission('S1', { principal: principal });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
                Action: 'lambda:InvokeFunction',
                FunctionName: {
                    'Fn::GetAtt': [
                        'MyLambdaCCE802FB',
                        'Arn',
                    ],
                },
                Principal: service,
                PrincipalOrgID: principalOrgId,
            });
        });
        test('fails if the principal has conditions that are not supported', () => {
            const stack = new cdk.Stack();
            const fn = newTestLambda(stack);
            expect(() => fn.addPermission('F1', {
                principal: new iam.PrincipalWithConditions(new iam.ServicePrincipal('my-service'), {
                    ArnEquals: {
                        'aws:SourceArn': 'source-arn',
                    },
                }),
            })).toThrow(/PrincipalWithConditions had unsupported conditions for Lambda permission statement/);
            expect(() => fn.addPermission('F2', {
                principal: new iam.PrincipalWithConditions(new iam.ServicePrincipal('my-service'), {
                    StringLike: {
                        'aws:SourceAccount': 'source-account',
                    },
                }),
            })).toThrow(/PrincipalWithConditions had unsupported conditions for Lambda permission statement/);
            expect(() => fn.addPermission('F3', {
                principal: new iam.PrincipalWithConditions(new iam.ServicePrincipal('my-service'), {
                    ArnLike: {
                        's3:DataAccessPointArn': 'data-access-point-arn',
                    },
                }),
            })).toThrow(/PrincipalWithConditions had unsupported conditions for Lambda permission statement/);
        });
        test('fails if the principal has condition combinations that are not supported', () => {
            const stack = new cdk.Stack();
            const fn = newTestLambda(stack);
            expect(() => fn.addPermission('F2', {
                principal: new iam.PrincipalWithConditions(new iam.ServicePrincipal('my-service'), {
                    StringEquals: {
                        'aws:SourceAccount': 'source-account',
                        'aws:PrincipalOrgID': 'principal-org-id',
                    },
                    ArnLike: {
                        'aws:SourceArn': 'source-arn',
                    },
                }),
            })).toThrow(/PrincipalWithConditions had unsupported condition combinations for Lambda permission statement/);
        });
        test('BYORole', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const role = new iam.Role(stack, 'SomeRole', {
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            });
            role.addToPolicy(new iam.PolicyStatement({ actions: ['confirm:itsthesame'], resources: ['*'] }));
            // WHEN
            const fn = new lambda.Function(stack, 'Function', {
                code: new lambda.InlineCode('test'),
                runtime: lambda.Runtime.PYTHON_3_9,
                handler: 'index.test',
                role,
                initialPolicy: [
                    new iam.PolicyStatement({ actions: ['inline:inline'], resources: ['*'] }),
                ],
            });
            fn.addToRolePolicy(new iam.PolicyStatement({ actions: ['explicit:explicit'], resources: ['*'] }));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Version: '2012-10-17',
                    Statement: [
                        { Action: 'confirm:itsthesame', Effect: 'Allow', Resource: '*' },
                        { Action: 'inline:inline', Effect: 'Allow', Resource: '*' },
                        { Action: 'explicit:explicit', Effect: 'Allow', Resource: '*' },
                    ],
                },
            });
        });
    });
    test('fromFunctionArn', () => {
        // GIVEN
        const stack2 = new cdk.Stack();
        // WHEN
        const imported = lambda.Function.fromFunctionArn(stack2, 'Imported', 'arn:aws:lambda:us-east-1:123456789012:function:ProcessKinesisRecords');
        // THEN
        expect(imported.functionArn).toEqual('arn:aws:lambda:us-east-1:123456789012:function:ProcessKinesisRecords');
        expect(imported.functionName).toEqual('ProcessKinesisRecords');
    });
    test('Function.fromFunctionName', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const imported = lambda.Function.fromFunctionName(stack, 'Imported', 'my-function');
        // THEN
        expect(stack.resolve(imported.functionArn)).toStrictEqual({
            'Fn::Join': ['', [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':lambda:',
                    { Ref: 'AWS::Region' },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':function:my-function',
                ]],
        });
        expect(stack.resolve(imported.functionName)).toStrictEqual({
            'Fn::Select': [6, {
                    'Fn::Split': [':', {
                            'Fn::Join': ['', [
                                    'arn:',
                                    { Ref: 'AWS::Partition' },
                                    ':lambda:',
                                    { Ref: 'AWS::Region' },
                                    ':',
                                    { Ref: 'AWS::AccountId' },
                                    ':function:my-function',
                                ]],
                        }],
                }],
        });
    });
    describe('Function.fromFunctionAttributes()', () => {
        let stack;
        beforeEach(() => {
            const app = new cdk.App();
            stack = new cdk.Stack(app, 'Base', {
                env: { account: '111111111111', region: 'stack-region' },
            });
        });
        describe('for a function in a different account and region', () => {
            let func;
            beforeEach(() => {
                func = lambda.Function.fromFunctionAttributes(stack, 'iFunc', {
                    functionArn: 'arn:aws:lambda:function-region:222222222222:function:function-name',
                });
            });
            test("the function's region is taken from the ARN", () => {
                expect(func.env.region).toBe('function-region');
            });
            test("the function's account is taken from the ARN", () => {
                expect(func.env.account).toBe('222222222222');
            });
        });
    });
    describe('addPermissions', () => {
        test('imported Function w/ resolved account and function arn', () => {
            // GIVEN
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'Imports', {
                env: { account: '123456789012', region: 'us-east-1' },
            });
            // WHEN
            const iFunc = lambda.Function.fromFunctionAttributes(stack, 'iFunc', {
                functionArn: 'arn:aws:lambda:us-east-1:123456789012:function:BaseFunction',
            });
            iFunc.addPermission('iFunc', {
                principal: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
            });
            // THEN
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 1);
        });
        test('imported Function w/ unresolved account', () => {
            // GIVEN
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'Imports');
            // WHEN
            const iFunc = lambda.Function.fromFunctionAttributes(stack, 'iFunc', {
                functionArn: 'arn:aws:lambda:us-east-1:123456789012:function:BaseFunction',
            });
            iFunc.addPermission('iFunc', {
                principal: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
            });
            // THEN
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 0);
        });
        test('imported Function w/ unresolved account & allowPermissions set', () => {
            // GIVEN
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'Imports');
            // WHEN
            const iFunc = lambda.Function.fromFunctionAttributes(stack, 'iFunc', {
                functionArn: 'arn:aws:lambda:us-east-1:123456789012:function:BaseFunction',
                sameEnvironment: true,
            });
            iFunc.addPermission('iFunc', {
                principal: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
            });
            // THEN
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 1);
        });
        test('imported Function w/different account', () => {
            // GIVEN
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'Base', {
                env: { account: '111111111111' },
            });
            // WHEN
            const iFunc = lambda.Function.fromFunctionAttributes(stack, 'iFunc', {
                functionArn: 'arn:aws:lambda:us-east-1:123456789012:function:BaseFunction',
            });
            iFunc.addPermission('iFunc', {
                principal: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
            });
            // THEN
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 0);
        });
        describe('annotations on different IFunctions', () => {
            let stack;
            let fn;
            let warningMessage;
            beforeEach(() => {
                warningMessage = 'AWS Lambda has changed their authorization strategy';
                stack = new cdk.Stack();
                fn = new lambda.Function(stack, 'MyLambda', {
                    code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
                    handler: 'index.handler',
                    runtime: lambda.Runtime.PYTHON_3_9,
                });
            });
            describe('permissions on functions', () => {
                test('without lambda:InvokeFunction', () => {
                    // WHEN
                    fn.addPermission('MyPermission', {
                        action: 'lambda.GetFunction',
                        principal: new iam.ServicePrincipal('lambda.amazonaws.com'),
                    });
                    // Simulate a workflow where a user has created a currentVersion with the intent to invoke it later.
                    fn.currentVersion;
                    // THEN
                    assertions_1.Annotations.fromStack(stack).hasNoWarning('/Default/MyLambda', assertions_1.Match.stringLikeRegexp(warningMessage));
                });
                describe('with lambda:InvokeFunction', () => {
                    test('without invoking currentVersion', () => {
                        // WHEN
                        fn.addPermission('MyPermission', {
                            principal: new iam.ServicePrincipal('lambda.amazonaws.com'),
                        });
                        // THEN
                        assertions_1.Annotations.fromStack(stack).hasNoWarning('/Default/MyLambda', assertions_1.Match.stringLikeRegexp(warningMessage));
                    });
                    test('with currentVersion invoked first', () => {
                        // GIVEN
                        // Simulate a workflow where a user has created a currentVersion with the intent to invoke it later.
                        fn.currentVersion;
                        // WHEN
                        fn.addPermission('MyPermission', {
                            principal: new iam.ServicePrincipal('lambda.amazonaws.com'),
                        });
                        // THEN
                        assertions_1.Annotations.fromStack(stack).hasWarning('/Default/MyLambda', assertions_1.Match.stringLikeRegexp(warningMessage));
                    });
                    test('with currentVersion invoked after permissions created', () => {
                        // WHEN
                        fn.addPermission('MyPermission', {
                            principal: new iam.ServicePrincipal('lambda.amazonaws.com'),
                        });
                        // Simulate a workflow where a user has created a currentVersion after adding permissions to the function.
                        fn.currentVersion;
                        // THEN
                        assertions_1.Annotations.fromStack(stack).hasWarning('/Default/MyLambda', assertions_1.Match.stringLikeRegexp(warningMessage));
                    });
                    test('multiple currentVersion calls does not result in multiple warnings', () => {
                        // WHEN
                        fn.currentVersion;
                        fn.addPermission('MyPermission', {
                            principal: new iam.ServicePrincipal('lambda.amazonaws.com'),
                        });
                        fn.currentVersion;
                        // THEN
                        const warns = assertions_1.Annotations.fromStack(stack).findWarning('/Default/MyLambda', assertions_1.Match.stringLikeRegexp(warningMessage));
                        expect(warns).toHaveLength(1);
                    });
                });
            });
            test('permission on versions', () => {
                // GIVEN
                const version = new lambda.Version(stack, 'MyVersion', {
                    lambda: fn.currentVersion,
                });
                // WHEN
                version.addPermission('MyPermission', {
                    principal: new iam.ServicePrincipal('lambda.amazonaws.com'),
                });
                // THEN
                assertions_1.Annotations.fromStack(stack).hasNoWarning('/Default/MyVersion', assertions_1.Match.stringLikeRegexp(warningMessage));
            });
            test('permission on latest version', () => {
                // WHEN
                fn.latestVersion.addPermission('MyPermission', {
                    principal: new iam.ServicePrincipal('lambda.amazonaws.com'),
                });
                // THEN
                // cannot add permissions on latest version, so no warning necessary
                assertions_1.Annotations.fromStack(stack).hasNoWarning('/Default/MyLambda/$LATEST', assertions_1.Match.stringLikeRegexp(warningMessage));
            });
            test('function.addAlias', () => {
                // WHEN
                fn.addAlias('prod');
                // THEN
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Alias', {
                    Name: 'prod',
                    FunctionName: { Ref: 'MyLambdaCCE802FB' },
                    FunctionVersion: { 'Fn::GetAtt': ['MyLambdaCurrentVersionE7A382CCe2d14849ae02766d3abd365a8a0f12ae', 'Version'] },
                });
            });
            describe('permission on alias', () => {
                test('of current version', () => {
                    // GIVEN
                    const version = new lambda.Version(stack, 'MyVersion', {
                        lambda: fn.currentVersion,
                    });
                    const alias = new lambda.Alias(stack, 'MyAlias', {
                        aliasName: 'alias',
                        version,
                    });
                    // WHEN
                    alias.addPermission('MyPermission', {
                        principal: new iam.ServicePrincipal('lambda.amazonaws.com'),
                    });
                    // THEN
                    assertions_1.Annotations.fromStack(stack).hasNoWarning('/Default/MyAlias', assertions_1.Match.stringLikeRegexp(warningMessage));
                });
                test('of latest version', () => {
                    // GIVEN
                    const alias = new lambda.Alias(stack, 'MyAlias', {
                        aliasName: 'alias',
                        version: fn.latestVersion,
                    });
                    // WHEN
                    alias.addPermission('MyPermission', {
                        principal: new iam.ServicePrincipal('lambda.amazonaws.com'),
                    });
                    // THEN
                    assertions_1.Annotations.fromStack(stack).hasNoWarning('/Default/MyAlias', assertions_1.Match.stringLikeRegexp(warningMessage));
                });
            });
        });
    });
    test('Lambda code can be read from a local directory via an asset', () => {
        // GIVEN
        const app = new cdk.App({
            context: {
                [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
            },
        });
        const stack = new cdk.Stack(app);
        new lambda.Function(stack, 'MyLambda', {
            code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
            handler: 'index.handler',
            runtime: lambda.Runtime.PYTHON_3_9,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Code: {
                S3Bucket: {
                    Ref: 'AssetParameters9678c34eca93259d11f2d714177347afd66c50116e1e08996eff893d3ca81232S3Bucket1354C645',
                },
                S3Key: {
                    'Fn::Join': ['', [
                            { 'Fn::Select': [0, { 'Fn::Split': ['||', { Ref: 'AssetParameters9678c34eca93259d11f2d714177347afd66c50116e1e08996eff893d3ca81232S3VersionKey5D873FAC' }] }] },
                            { 'Fn::Select': [1, { 'Fn::Split': ['||', { Ref: 'AssetParameters9678c34eca93259d11f2d714177347afd66c50116e1e08996eff893d3ca81232S3VersionKey5D873FAC' }] }] },
                        ]],
                },
            },
            Handler: 'index.handler',
            Role: {
                'Fn::GetAtt': [
                    'MyLambdaServiceRole4539ECB6',
                    'Arn',
                ],
            },
            Runtime: 'python3.9',
        });
    });
    test('default function with SQS DLQ when client sets deadLetterQueueEnabled to true and functionName defined by client', () => {
        const stack = new cdk.Stack();
        new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            functionName: 'OneFunctionToRuleThemAll',
            deadLetterQueueEnabled: true,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [
                    {
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: {
                            Service: 'lambda.amazonaws.com',
                        },
                    },
                ],
                Version: '2012-10-17',
            },
            ManagedPolicyArns: [
                {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {
                                Ref: 'AWS::Partition',
                            },
                            ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                        ],
                    ],
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'sqs:SendMessage',
                        Effect: 'Allow',
                        Resource: {
                            'Fn::GetAtt': [
                                'MyLambdaDeadLetterQueue399EEA2D',
                                'Arn',
                            ],
                        },
                    },
                ],
                Version: '2012-10-17',
            },
            PolicyName: 'MyLambdaServiceRoleDefaultPolicy5BBC6F68',
            Roles: [
                {
                    Ref: 'MyLambdaServiceRole4539ECB6',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
            Properties: {
                Code: {
                    ZipFile: 'foo',
                },
                Handler: 'index.handler',
                Role: {
                    'Fn::GetAtt': [
                        'MyLambdaServiceRole4539ECB6',
                        'Arn',
                    ],
                },
                Runtime: 'nodejs14.x',
                DeadLetterConfig: {
                    TargetArn: {
                        'Fn::GetAtt': [
                            'MyLambdaDeadLetterQueue399EEA2D',
                            'Arn',
                        ],
                    },
                },
                FunctionName: 'OneFunctionToRuleThemAll',
            },
            DependsOn: [
                'MyLambdaServiceRoleDefaultPolicy5BBC6F68',
                'MyLambdaServiceRole4539ECB6',
            ],
        });
    });
    test('default function with SQS DLQ when client sets deadLetterQueueEnabled to true and functionName not defined by client', () => {
        const stack = new cdk.Stack();
        new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            deadLetterQueueEnabled: true,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SQS::Queue', {
            MessageRetentionPeriod: 1209600,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            DeadLetterConfig: {
                TargetArn: {
                    'Fn::GetAtt': [
                        'MyLambdaDeadLetterQueue399EEA2D',
                        'Arn',
                    ],
                },
            },
        });
    });
    test('default function with SQS DLQ when client sets deadLetterQueueEnabled to false', () => {
        const stack = new cdk.Stack();
        new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            deadLetterQueueEnabled: false,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Code: {
                ZipFile: 'foo',
            },
            Handler: 'index.handler',
            Role: {
                'Fn::GetAtt': [
                    'MyLambdaServiceRole4539ECB6',
                    'Arn',
                ],
            },
            Runtime: 'nodejs14.x',
        });
    });
    test('default function with SQS DLQ when client provides Queue to be used as DLQ', () => {
        const stack = new cdk.Stack();
        const dlQueue = new sqs.Queue(stack, 'DeadLetterQueue', {
            queueName: 'MyLambda_DLQ',
            retentionPeriod: cdk.Duration.days(14),
        });
        new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            deadLetterQueue: dlQueue,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'sqs:SendMessage',
                        Effect: 'Allow',
                        Resource: {
                            'Fn::GetAtt': [
                                'DeadLetterQueue9F481546',
                                'Arn',
                            ],
                        },
                    },
                ],
                Version: '2012-10-17',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            DeadLetterConfig: {
                TargetArn: {
                    'Fn::GetAtt': [
                        'DeadLetterQueue9F481546',
                        'Arn',
                    ],
                },
            },
        });
    });
    test('default function with SQS DLQ when client provides Queue to be used as DLQ and deadLetterQueueEnabled set to true', () => {
        const stack = new cdk.Stack();
        const dlQueue = new sqs.Queue(stack, 'DeadLetterQueue', {
            queueName: 'MyLambda_DLQ',
            retentionPeriod: cdk.Duration.days(14),
        });
        new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            deadLetterQueueEnabled: true,
            deadLetterQueue: dlQueue,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'sqs:SendMessage',
                        Effect: 'Allow',
                        Resource: {
                            'Fn::GetAtt': [
                                'DeadLetterQueue9F481546',
                                'Arn',
                            ],
                        },
                    },
                ],
                Version: '2012-10-17',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            DeadLetterConfig: {
                TargetArn: {
                    'Fn::GetAtt': [
                        'DeadLetterQueue9F481546',
                        'Arn',
                    ],
                },
            },
        });
    });
    test('error when default function with SQS DLQ when client provides Queue to be used as DLQ and deadLetterQueueEnabled set to false', () => {
        const stack = new cdk.Stack();
        const dlQueue = new sqs.Queue(stack, 'DeadLetterQueue', {
            queueName: 'MyLambda_DLQ',
            retentionPeriod: cdk.Duration.days(14),
        });
        expect(() => new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            deadLetterQueueEnabled: false,
            deadLetterQueue: dlQueue,
        })).toThrow(/deadLetterQueue defined but deadLetterQueueEnabled explicitly set to false/);
    });
    test('default function with SNS DLQ when client provides Topic to be used as DLQ', () => {
        const stack = new cdk.Stack();
        const dlTopic = new sns.Topic(stack, 'DeadLetterTopic');
        new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            deadLetterTopic: dlTopic,
        });
        const template = assertions_1.Template.fromStack(stack);
        template.hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: assertions_1.Match.arrayWith([
                    {
                        Action: 'sns:Publish',
                        Effect: 'Allow',
                        Resource: {
                            Ref: 'DeadLetterTopicC237650B',
                        },
                    },
                ]),
            },
        });
        template.hasResourceProperties('AWS::Lambda::Function', {
            DeadLetterConfig: {
                TargetArn: {
                    Ref: 'DeadLetterTopicC237650B',
                },
            },
        });
    });
    test('error when default function with SNS DLQ when client provides Topic to be used as DLQ and deadLetterQueueEnabled set to false', () => {
        const stack = new cdk.Stack();
        const dlTopic = new sns.Topic(stack, 'DeadLetterTopic');
        expect(() => new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            deadLetterQueueEnabled: false,
            deadLetterTopic: dlTopic,
        })).toThrow(/deadLetterQueue and deadLetterTopic cannot be specified together at the same time/);
    });
    test('error when default function with SNS DLQ when client provides Topic to be used as DLQ and deadLetterQueueEnabled set to true', () => {
        const stack = new cdk.Stack();
        const dlTopic = new sns.Topic(stack, 'DeadLetterTopic');
        expect(() => new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            deadLetterQueueEnabled: true,
            deadLetterTopic: dlTopic,
        })).toThrow(/deadLetterQueue and deadLetterTopic cannot be specified together at the same time/);
    });
    test('error when both topic and queue are presented as DLQ', () => {
        const stack = new cdk.Stack();
        const dlQueue = new sqs.Queue(stack, 'DLQ');
        const dlTopic = new sns.Topic(stack, 'DeadLetterTopic');
        expect(() => new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            deadLetterQueue: dlQueue,
            deadLetterTopic: dlTopic,
        })).toThrow(/deadLetterQueue and deadLetterTopic cannot be specified together at the same time/);
    });
    test('default function with Active tracing', () => {
        const stack = new cdk.Stack();
        new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            tracing: lambda.Tracing.ACTIVE,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: [
                            'xray:PutTraceSegments',
                            'xray:PutTelemetryRecords',
                        ],
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
            PolicyName: 'MyLambdaServiceRoleDefaultPolicy5BBC6F68',
            Roles: [
                {
                    Ref: 'MyLambdaServiceRole4539ECB6',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
            Properties: {
                Code: {
                    ZipFile: 'foo',
                },
                Handler: 'index.handler',
                Role: {
                    'Fn::GetAtt': [
                        'MyLambdaServiceRole4539ECB6',
                        'Arn',
                    ],
                },
                Runtime: 'nodejs14.x',
                TracingConfig: {
                    Mode: 'Active',
                },
            },
            DependsOn: [
                'MyLambdaServiceRoleDefaultPolicy5BBC6F68',
                'MyLambdaServiceRole4539ECB6',
            ],
        });
    });
    test('default function with PassThrough tracing', () => {
        const stack = new cdk.Stack();
        new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            tracing: lambda.Tracing.PASS_THROUGH,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: [
                            'xray:PutTraceSegments',
                            'xray:PutTelemetryRecords',
                        ],
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
            PolicyName: 'MyLambdaServiceRoleDefaultPolicy5BBC6F68',
            Roles: [
                {
                    Ref: 'MyLambdaServiceRole4539ECB6',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
            Properties: {
                Code: {
                    ZipFile: 'foo',
                },
                Handler: 'index.handler',
                Role: {
                    'Fn::GetAtt': [
                        'MyLambdaServiceRole4539ECB6',
                        'Arn',
                    ],
                },
                Runtime: 'nodejs14.x',
                TracingConfig: {
                    Mode: 'PassThrough',
                },
            },
            DependsOn: [
                'MyLambdaServiceRoleDefaultPolicy5BBC6F68',
                'MyLambdaServiceRole4539ECB6',
            ],
        });
    });
    test('default function with Disabled tracing', () => {
        const stack = new cdk.Stack();
        new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            tracing: lambda.Tracing.DISABLED,
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
        assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
            Properties: {
                Code: {
                    ZipFile: 'foo',
                },
                Handler: 'index.handler',
                Role: {
                    'Fn::GetAtt': [
                        'MyLambdaServiceRole4539ECB6',
                        'Arn',
                    ],
                },
                Runtime: 'nodejs14.x',
            },
            DependsOn: [
                'MyLambdaServiceRole4539ECB6',
            ],
        });
    });
    test('runtime and handler set to FROM_IMAGE are set to undefined in CloudFormation', () => {
        const stack = new cdk.Stack();
        new lambda.Function(stack, 'MyLambda', {
            code: lambda.Code.fromAssetImage(path.join(__dirname, 'docker-lambda-handler')),
            handler: lambda.Handler.FROM_IMAGE,
            runtime: lambda.Runtime.FROM_IMAGE,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Runtime: assertions_1.Match.absent(),
            Handler: assertions_1.Match.absent(),
            PackageType: 'Image',
        });
    });
    describe('grantInvoke', () => {
        test('adds iam:InvokeFunction', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const role = new iam.Role(stack, 'Role', {
                assumedBy: new iam.AccountPrincipal('1234'),
            });
            const fn = new lambda.Function(stack, 'Function', {
                code: lambda.Code.fromInline('xxx'),
                handler: 'index.handler',
                runtime: lambda.Runtime.NODEJS_14_X,
            });
            // WHEN
            fn.grantInvoke(role);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Action: 'lambda:InvokeFunction',
                            Effect: 'Allow',
                            Resource: [
                                { 'Fn::GetAtt': ['Function76856677', 'Arn'] },
                                { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['Function76856677', 'Arn'] }, ':*']] },
                            ],
                        },
                    ],
                },
            });
        });
        test('with a service principal', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const fn = new lambda.Function(stack, 'Function', {
                code: lambda.Code.fromInline('xxx'),
                handler: 'index.handler',
                runtime: lambda.Runtime.NODEJS_14_X,
            });
            const service = new iam.ServicePrincipal('apigateway.amazonaws.com');
            // WHEN
            fn.grantInvoke(service);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
                Action: 'lambda:InvokeFunction',
                FunctionName: {
                    'Fn::GetAtt': [
                        'Function76856677',
                        'Arn',
                    ],
                },
                Principal: 'apigateway.amazonaws.com',
            });
        });
        test('with an account principal', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const fn = new lambda.Function(stack, 'Function', {
                code: lambda.Code.fromInline('xxx'),
                handler: 'index.handler',
                runtime: lambda.Runtime.NODEJS_14_X,
            });
            const account = new iam.AccountPrincipal('123456789012');
            // WHEN
            fn.grantInvoke(account);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
                Action: 'lambda:InvokeFunction',
                FunctionName: {
                    'Fn::GetAtt': [
                        'Function76856677',
                        'Arn',
                    ],
                },
                Principal: '123456789012',
            });
        });
        test('with an arn principal', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const fn = new lambda.Function(stack, 'Function', {
                code: lambda.Code.fromInline('xxx'),
                handler: 'index.handler',
                runtime: lambda.Runtime.NODEJS_14_X,
            });
            const account = new iam.ArnPrincipal('arn:aws:iam::123456789012:role/someRole');
            // WHEN
            fn.grantInvoke(account);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
                Action: 'lambda:InvokeFunction',
                FunctionName: {
                    'Fn::GetAtt': [
                        'Function76856677',
                        'Arn',
                    ],
                },
                Principal: 'arn:aws:iam::123456789012:role/someRole',
            });
        });
        test('with an organization principal', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const fn = new lambda.Function(stack, 'Function', {
                code: lambda.Code.fromInline('xxx'),
                handler: 'index.handler',
                runtime: lambda.Runtime.NODEJS_14_X,
            });
            const org = new iam.OrganizationPrincipal('my-org-id');
            // WHEN
            fn.grantInvoke(org);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
                Action: 'lambda:InvokeFunction',
                FunctionName: {
                    'Fn::GetAtt': [
                        'Function76856677',
                        'Arn',
                    ],
                },
                Principal: '*',
                PrincipalOrgID: 'my-org-id',
            });
        });
        test('can be called twice for the same service principal', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const fn = new lambda.Function(stack, 'Function', {
                code: lambda.Code.fromInline('xxx'),
                handler: 'index.handler',
                runtime: lambda.Runtime.NODEJS_14_X,
            });
            const service = new iam.ServicePrincipal('elasticloadbalancing.amazonaws.com');
            // WHEN
            fn.grantInvoke(service);
            fn.grantInvoke(service);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
                Action: 'lambda:InvokeFunction',
                FunctionName: {
                    'Fn::GetAtt': [
                        'Function76856677',
                        'Arn',
                    ],
                },
                Principal: 'elasticloadbalancing.amazonaws.com',
            });
        });
        test('with an imported role (in the same account)', () => {
            // GIVEN
            const stack = new cdk.Stack(undefined, undefined, {
                env: { account: '123456789012' },
            });
            const fn = new lambda.Function(stack, 'Function', {
                code: lambda.Code.fromInline('xxx'),
                handler: 'index.handler',
                runtime: lambda.Runtime.NODEJS_14_X,
            });
            // WHEN
            fn.grantInvoke(iam.Role.fromRoleArn(stack, 'ForeignRole', 'arn:aws:iam::123456789012:role/someRole'));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'lambda:InvokeFunction',
                            Effect: 'Allow',
                            Resource: [
                                { 'Fn::GetAtt': ['Function76856677', 'Arn'] },
                                { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['Function76856677', 'Arn'] }, ':*']] },
                            ],
                        },
                    ],
                },
                Roles: ['someRole'],
            });
        });
        test('with an imported role (from a different account)', () => {
            // GIVEN
            const stack = new cdk.Stack(undefined, undefined, {
                env: { account: '3333' },
            });
            const fn = new lambda.Function(stack, 'Function', {
                code: lambda.Code.fromInline('xxx'),
                handler: 'index.handler',
                runtime: lambda.Runtime.NODEJS_14_X,
            });
            // WHEN
            fn.grantInvoke(iam.Role.fromRoleArn(stack, 'ForeignRole', 'arn:aws:iam::123456789012:role/someRole'));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
                Action: 'lambda:InvokeFunction',
                FunctionName: {
                    'Fn::GetAtt': [
                        'Function76856677',
                        'Arn',
                    ],
                },
                Principal: 'arn:aws:iam::123456789012:role/someRole',
            });
        });
        test('on an imported function (same account)', () => {
            // GIVEN
            const stack = new cdk.Stack(undefined, undefined, {
                env: { account: '123456789012' },
            });
            const fn = lambda.Function.fromFunctionArn(stack, 'Function', 'arn:aws:lambda:us-east-1:123456789012:function:MyFn');
            // WHEN
            fn.grantInvoke(new iam.ServicePrincipal('elasticloadbalancing.amazonaws.com'));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
                Action: 'lambda:InvokeFunction',
                FunctionName: 'arn:aws:lambda:us-east-1:123456789012:function:MyFn',
                Principal: 'elasticloadbalancing.amazonaws.com',
            });
        });
        test('on an imported function (unresolved account)', () => {
            const stack = new cdk.Stack();
            const fn = lambda.Function.fromFunctionArn(stack, 'Function', 'arn:aws:lambda:us-east-1:123456789012:function:MyFn');
            expect(() => fn.grantInvoke(new iam.ServicePrincipal('elasticloadbalancing.amazonaws.com'))).toThrow(/Cannot modify permission to lambda function/);
        });
        test('on an imported function (unresolved account & w/ allowPermissions)', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const fn = lambda.Function.fromFunctionAttributes(stack, 'Function', {
                functionArn: 'arn:aws:lambda:us-east-1:123456789012:function:MyFn',
                sameEnvironment: true,
            });
            // WHEN
            fn.grantInvoke(new iam.ServicePrincipal('elasticloadbalancing.amazonaws.com'));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
                Action: 'lambda:InvokeFunction',
                FunctionName: 'arn:aws:lambda:us-east-1:123456789012:function:MyFn',
                Principal: 'elasticloadbalancing.amazonaws.com',
            });
        });
        test('on an imported function (different account)', () => {
            // GIVEN
            const stack = new cdk.Stack(undefined, undefined, {
                env: { account: '111111111111' },
            });
            const fn = lambda.Function.fromFunctionArn(stack, 'Function', 'arn:aws:lambda:us-east-1:123456789012:function:MyFn');
            // THEN
            expect(() => {
                fn.grantInvoke(new iam.ServicePrincipal('elasticloadbalancing.amazonaws.com'));
            }).toThrow(/Cannot modify permission to lambda function/);
        });
        test('on an imported function (different account & w/ skipPermissions', () => {
            // GIVEN
            const stack = new cdk.Stack(undefined, undefined, {
                env: { account: '111111111111' },
            });
            const fn = lambda.Function.fromFunctionAttributes(stack, 'Function', {
                functionArn: 'arn:aws:lambda:us-east-1:123456789012:function:MyFn',
                skipPermissions: true,
            });
            // THEN
            expect(() => {
                fn.grantInvoke(new iam.ServicePrincipal('elasticloadbalancing.amazonaws.com'));
            }).not.toThrow();
        });
    });
    test('Can use metricErrors on a lambda Function', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const fn = new lambda.Function(stack, 'Function', {
            code: lambda.Code.fromInline('xxx'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        // THEN
        expect(stack.resolve(fn.metricErrors())).toEqual({
            dimensions: { FunctionName: { Ref: 'Function76856677' } },
            namespace: 'AWS/Lambda',
            metricName: 'Errors',
            period: cdk.Duration.minutes(5),
            statistic: 'Sum',
        });
    });
    test('addEventSource calls bind', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const fn = new lambda.Function(stack, 'Function', {
            code: lambda.Code.fromInline('xxx'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        let bindTarget;
        class EventSourceMock {
            bind(target) {
                bindTarget = target;
            }
        }
        // WHEN
        fn.addEventSource(new EventSourceMock());
        // THEN
        expect(bindTarget).toEqual(fn);
    });
    test('layer is baked into the function version', () => {
        // GIVEN
        const stack = new cdk.Stack(undefined, 'TestStack');
        const bucket = new s3.Bucket(stack, 'Bucket');
        const code = new lambda.S3Code(bucket, 'ObjectKey');
        const fn = new lambda.Function(stack, 'fn', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline('exports.main = function() { console.log("DONE"); }'),
            handler: 'index.main',
        });
        const fnHash = function_hash_1.calculateFunctionHash(fn);
        // WHEN
        const layer = new lambda.LayerVersion(stack, 'LayerVersion', {
            code,
            compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
        });
        fn.addLayers(layer);
        const newFnHash = function_hash_1.calculateFunctionHash(fn);
        expect(fnHash).not.toEqual(newFnHash);
    });
    test('with feature flag, layer version is baked into function version', () => {
        // GIVEN
        const app = new cdk.App({ context: { [cxapi.LAMBDA_RECOGNIZE_LAYER_VERSION]: true } });
        const stack = new cdk.Stack(app, 'TestStack');
        const bucket = new s3.Bucket(stack, 'Bucket');
        const code = new lambda.S3Code(bucket, 'ObjectKey');
        const layer = new lambda.LayerVersion(stack, 'LayerVersion', {
            code,
            compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
        });
        // function with layer
        const fn = new lambda.Function(stack, 'fn', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline('exports.main = function() { console.log("DONE"); }'),
            handler: 'index.main',
            layers: [layer],
        });
        const fnHash = function_hash_1.calculateFunctionHash(fn);
        // use escape hatch to change the content of the layer
        // this simulates updating the layer code which changes the version.
        const cfnLayer = layer.node.defaultChild;
        const newCode = (new lambda.S3Code(bucket, 'NewObjectKey')).bind(layer);
        cfnLayer.content = {
            s3Bucket: newCode.s3Location.bucketName,
            s3Key: newCode.s3Location.objectKey,
            s3ObjectVersion: newCode.s3Location.objectVersion,
        };
        const newFnHash = function_hash_1.calculateFunctionHash(fn);
        expect(fnHash).not.toEqual(newFnHash);
    });
    test('using an incompatible layer', () => {
        // GIVEN
        const stack = new cdk.Stack(undefined, 'TestStack');
        const layer = lambda.LayerVersion.fromLayerVersionAttributes(stack, 'TestLayer', {
            layerVersionArn: 'arn:aws:...',
            compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
        });
        // THEN
        expect(() => new lambda.Function(stack, 'Function', {
            layers: [layer],
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromInline('exports.main = function() { console.log("DONE"); }'),
            handler: 'index.main',
        })).toThrow(/nodejs16.x is not in \[nodejs14.x\]/);
    });
    test('using more than 5 layers', () => {
        // GIVEN
        const stack = new cdk.Stack(undefined, 'TestStack');
        const layers = new Array(6).fill(lambda.LayerVersion.fromLayerVersionAttributes(stack, 'TestLayer', {
            layerVersionArn: 'arn:aws:...',
            compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
        }));
        // THEN
        expect(() => new lambda.Function(stack, 'Function', {
            layers,
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline('exports.main = function() { console.log("DONE"); }'),
            handler: 'index.main',
        })).toThrow(/Unable to add layer:/);
    });
    test('environment variables work in China', () => {
        // GIVEN
        const stack = new cdk.Stack(undefined, undefined, { env: { region: 'cn-north-1' } });
        // WHEN
        new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS,
            environment: {
                SOME: 'Variable',
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Environment: {
                Variables: {
                    SOME: 'Variable',
                },
            },
        });
    });
    test('environment variables work in an unspecified region', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS,
            environment: {
                SOME: 'Variable',
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Environment: {
                Variables: {
                    SOME: 'Variable',
                },
            },
        });
    });
    test('support reserved concurrent executions', () => {
        const stack = new cdk.Stack();
        new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS,
            reservedConcurrentExecutions: 10,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            ReservedConcurrentExecutions: 10,
        });
    });
    test('its possible to specify event sources upon creation', () => {
        // GIVEN
        const stack = new cdk.Stack();
        let bindCount = 0;
        class EventSource {
            bind(_fn) {
                bindCount++;
            }
        }
        // WHEN
        new lambda.Function(stack, 'fn', {
            code: lambda.Code.fromInline('boom'),
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.bam',
            events: [
                new EventSource(),
                new EventSource(),
            ],
        });
        // THEN
        expect(bindCount).toEqual(2);
    });
    test('Provided Runtime returns the right values', () => {
        const rt = lambda.Runtime.PROVIDED;
        expect(rt.name).toEqual('provided');
        expect(rt.supportsInlineCode).toEqual(false);
    });
    test('specify log retention', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS,
            logRetention: logs.RetentionDays.ONE_MONTH,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
            LogGroupName: {
                'Fn::Join': [
                    '',
                    [
                        '/aws/lambda/',
                        {
                            Ref: 'MyLambdaCCE802FB',
                        },
                    ],
                ],
            },
            RetentionInDays: 30,
        });
    });
    test('imported lambda with imported security group and allowAllOutbound set to false', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const fn = lambda.Function.fromFunctionAttributes(stack, 'fn', {
            functionArn: 'arn:aws:lambda:us-east-1:123456789012:function:my-function',
            securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
                allowAllOutbound: false,
            }),
        });
        // WHEN
        fn.connections.allowToAnyIpv4(ec2.Port.tcp(443));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
            GroupId: 'sg-123456789',
        });
    });
    test('with event invoke config', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lambda.Function(stack, 'fn', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            onFailure: {
                bind: () => ({ destination: 'on-failure-arn' }),
            },
            onSuccess: {
                bind: () => ({ destination: 'on-success-arn' }),
            },
            maxEventAge: cdk.Duration.hours(1),
            retryAttempts: 0,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
            FunctionName: {
                Ref: 'fn5FF616E3',
            },
            Qualifier: '$LATEST',
            DestinationConfig: {
                OnFailure: {
                    Destination: 'on-failure-arn',
                },
                OnSuccess: {
                    Destination: 'on-success-arn',
                },
            },
            MaximumEventAgeInSeconds: 3600,
            MaximumRetryAttempts: 0,
        });
    });
    test('throws when calling configureAsyncInvoke on already configured function', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const fn = new lambda.Function(stack, 'fn', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            maxEventAge: cdk.Duration.hours(1),
        });
        // THEN
        expect(() => fn.configureAsyncInvoke({ retryAttempts: 0 })).toThrow(/An EventInvokeConfig has already been configured/);
    });
    test('event invoke config on imported lambda', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const fn = lambda.Function.fromFunctionAttributes(stack, 'fn', {
            functionArn: 'arn:aws:lambda:us-east-1:123456789012:function:my-function',
        });
        // WHEN
        fn.configureAsyncInvoke({
            retryAttempts: 1,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
            FunctionName: 'my-function',
            Qualifier: '$LATEST',
            MaximumRetryAttempts: 1,
        });
    });
    cdk_build_tools_1.testDeprecated('add a version with event invoke config', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const fn = new lambda.Function(stack, 'fn', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        // WHEN
        fn.addVersion('1', 'sha256', 'desc', undefined, {
            retryAttempts: 0,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
            FunctionName: {
                Ref: 'fn5FF616E3',
            },
            Qualifier: {
                'Fn::GetAtt': [
                    'fnVersion197FA813F',
                    'Version',
                ],
            },
            MaximumRetryAttempts: 0,
        });
    });
    test('check edge compatibility with env vars that can be removed', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const fn = new lambda.Function(stack, 'fn', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        fn.addEnvironment('KEY', 'value', { removeInEdge: true });
        // WHEN
        fn._checkEdgeCompatibility();
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Environment: assertions_1.Match.absent(),
        });
    });
    test('check edge compatibility with env vars that cannot be removed', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const fn = new lambda.Function(stack, 'fn', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            environment: {
                KEY: 'value',
            },
        });
        fn.addEnvironment('OTHER_KEY', 'other_value', { removeInEdge: true });
        // THEN
        expect(() => fn._checkEdgeCompatibility()).toThrow(/The function Default\/fn contains environment variables \[KEY\] and is not compatible with Lambda@Edge/);
    });
    test('add incompatible layer', () => {
        // GIVEN
        const stack = new cdk.Stack(undefined, 'TestStack');
        const bucket = new s3.Bucket(stack, 'Bucket');
        const code = new lambda.S3Code(bucket, 'ObjectKey');
        const func = new lambda.Function(stack, 'myFunc', {
            runtime: lambda.Runtime.PYTHON_3_7,
            handler: 'index.handler',
            code,
        });
        const layer = new lambda.LayerVersion(stack, 'myLayer', {
            code,
            compatibleRuntimes: [lambda.Runtime.NODEJS],
        });
        // THEN
        expect(() => func.addLayers(layer)).toThrow(/This lambda function uses a runtime that is incompatible with this layer/);
    });
    test('add compatible layer', () => {
        // GIVEN
        const stack = new cdk.Stack(undefined, 'TestStack');
        const bucket = new s3.Bucket(stack, 'Bucket');
        const code = new lambda.S3Code(bucket, 'ObjectKey');
        const func = new lambda.Function(stack, 'myFunc', {
            runtime: lambda.Runtime.PYTHON_3_7,
            handler: 'index.handler',
            code,
        });
        const layer = new lambda.LayerVersion(stack, 'myLayer', {
            code,
            compatibleRuntimes: [lambda.Runtime.PYTHON_3_7],
        });
        // THEN
        // should not throw
        expect(() => func.addLayers(layer)).not.toThrow();
    });
    test('add compatible layer for deep clone', () => {
        // GIVEN
        const stack = new cdk.Stack(undefined, 'TestStack');
        const bucket = new s3.Bucket(stack, 'Bucket');
        const code = new lambda.S3Code(bucket, 'ObjectKey');
        const runtime = lambda.Runtime.PYTHON_3_7;
        const func = new lambda.Function(stack, 'myFunc', {
            runtime,
            handler: 'index.handler',
            code,
        });
        const clone = _.cloneDeep(runtime);
        const layer = new lambda.LayerVersion(stack, 'myLayer', {
            code,
            compatibleRuntimes: [clone],
        });
        // THEN
        // should not throw
        expect(() => func.addLayers(layer)).not.toThrow();
    });
    test('empty inline code is not allowed', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN/THEN
        expect(() => new lambda.Function(stack, 'fn', {
            handler: 'foo',
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline(''),
        })).toThrow(/Lambda inline code cannot be empty/);
    });
    test('logGroup is correctly returned', () => {
        const stack = new cdk.Stack();
        const fn = new lambda.Function(stack, 'fn', {
            handler: 'foo',
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline('foo'),
        });
        const logGroup = fn.logGroup;
        expect(logGroup.logGroupName).toBeDefined();
        expect(logGroup.logGroupArn).toBeDefined();
    });
    test('dlq is returned when provided by user and is Queue', () => {
        const stack = new cdk.Stack();
        const dlQueue = new sqs.Queue(stack, 'DeadLetterQueue', {
            queueName: 'MyLambda_DLQ',
            retentionPeriod: cdk.Duration.days(14),
        });
        const fn = new lambda.Function(stack, 'fn', {
            handler: 'foo',
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline('foo'),
            deadLetterQueue: dlQueue,
        });
        const deadLetterQueue = fn.deadLetterQueue;
        const deadLetterTopic = fn.deadLetterTopic;
        expect(deadLetterTopic).toBeUndefined();
        expect(deadLetterQueue).toBeDefined();
        expect(deadLetterQueue).toBeInstanceOf(sqs.Queue);
    });
    test('dlq is returned when provided by user and is Topic', () => {
        const stack = new cdk.Stack();
        const dlTopic = new sns.Topic(stack, 'DeadLetterQueue', {
            topicName: 'MyLambda_DLQ',
        });
        const fn = new lambda.Function(stack, 'fn', {
            handler: 'foo',
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline('foo'),
            deadLetterTopic: dlTopic,
        });
        const deadLetterQueue = fn.deadLetterQueue;
        const deadLetterTopic = fn.deadLetterTopic;
        expect(deadLetterQueue).toBeUndefined();
        expect(deadLetterTopic).toBeDefined();
        expect(deadLetterTopic).toBeInstanceOf(sns.Topic);
    });
    test('dlq is returned when setup by cdk and is Queue', () => {
        const stack = new cdk.Stack();
        const fn = new lambda.Function(stack, 'fn', {
            handler: 'foo',
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline('foo'),
            deadLetterQueueEnabled: true,
        });
        const deadLetterQueue = fn.deadLetterQueue;
        const deadLetterTopic = fn.deadLetterTopic;
        expect(deadLetterTopic).toBeUndefined();
        expect(deadLetterQueue).toBeDefined();
        expect(deadLetterQueue).toBeInstanceOf(sqs.Queue);
    });
    test('dlq is undefined when not setup', () => {
        const stack = new cdk.Stack();
        const fn = new lambda.Function(stack, 'fn', {
            handler: 'foo',
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline('foo'),
        });
        const deadLetterQueue = fn.deadLetterQueue;
        const deadLetterTopic = fn.deadLetterTopic;
        expect(deadLetterQueue).toBeUndefined();
        expect(deadLetterTopic).toBeUndefined();
    });
    test('one and only one child LogRetention construct will be created', () => {
        const stack = new cdk.Stack();
        const fn = new lambda.Function(stack, 'fn', {
            handler: 'foo',
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline('foo'),
            logRetention: logs.RetentionDays.FIVE_DAYS,
        });
        // Call logGroup a few times. If more than one instance of LogRetention was created,
        // the second call will fail on duplicate constructs.
        fn.logGroup;
        fn.logGroup;
        fn.logGroup;
    });
    test('fails when inline code is specified on an incompatible runtime', () => {
        const stack = new cdk.Stack();
        expect(() => new lambda.Function(stack, 'fn', {
            handler: 'foo',
            runtime: lambda.Runtime.PROVIDED,
            code: lambda.Code.fromInline('foo'),
        })).toThrow(/Inline source not allowed for/);
    });
    test('multiple calls to latestVersion returns the same version', () => {
        const stack = new cdk.Stack();
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const version1 = fn.latestVersion;
        const version2 = fn.latestVersion;
        const expectedArn = {
            'Fn::Join': ['', [
                    { 'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'] },
                    ':$LATEST',
                ]],
        };
        expect(version1).toEqual(version2);
        expect(stack.resolve(version1.functionArn)).toEqual(expectedArn);
        expect(stack.resolve(version2.functionArn)).toEqual(expectedArn);
    });
    test('default function with kmsKeyArn, environmentEncryption passed as props', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const key = new kms.Key(stack, 'EnvVarEncryptKey', {
            description: 'sample key',
        });
        // WHEN
        new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            environment: {
                SOME: 'Variable',
            },
            environmentEncryption: key,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Environment: {
                Variables: {
                    SOME: 'Variable',
                },
            },
            KmsKeyArn: {
                'Fn::GetAtt': [
                    'EnvVarEncryptKey1A7CABDB',
                    'Arn',
                ],
            },
        });
    });
    describe('profiling group', () => {
        test('default function with CDK created Profiling Group', () => {
            const stack = new cdk.Stack();
            new lambda.Function(stack, 'MyLambda', {
                code: new lambda.InlineCode('foo'),
                handler: 'index.handler',
                runtime: lambda.Runtime.PYTHON_3_9,
                profiling: true,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeGuruProfiler::ProfilingGroup', {
                ProfilingGroupName: 'MyLambdaProfilingGroupC5B6CCD8',
                ComputePlatform: 'AWSLambda',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'codeguru-profiler:ConfigureAgent',
                                'codeguru-profiler:PostAgentProfile',
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': ['MyLambdaProfilingGroupEC6DE32F', 'Arn'],
                            },
                        },
                    ],
                    Version: '2012-10-17',
                },
                PolicyName: 'MyLambdaServiceRoleDefaultPolicy5BBC6F68',
                Roles: [
                    {
                        Ref: 'MyLambdaServiceRole4539ECB6',
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
                Environment: {
                    Variables: {
                        AWS_CODEGURU_PROFILER_GROUP_ARN: { 'Fn::GetAtt': ['MyLambdaProfilingGroupEC6DE32F', 'Arn'] },
                        AWS_CODEGURU_PROFILER_ENABLED: 'TRUE',
                    },
                },
            });
        });
        test('default function with client provided Profiling Group', () => {
            const stack = new cdk.Stack();
            new lambda.Function(stack, 'MyLambda', {
                code: new lambda.InlineCode('foo'),
                handler: 'index.handler',
                runtime: lambda.Runtime.PYTHON_3_9,
                profilingGroup: new aws_codeguruprofiler_1.ProfilingGroup(stack, 'ProfilingGroup'),
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'codeguru-profiler:ConfigureAgent',
                                'codeguru-profiler:PostAgentProfile',
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': ['ProfilingGroup26979FD7', 'Arn'],
                            },
                        },
                    ],
                    Version: '2012-10-17',
                },
                PolicyName: 'MyLambdaServiceRoleDefaultPolicy5BBC6F68',
                Roles: [
                    {
                        Ref: 'MyLambdaServiceRole4539ECB6',
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
                Environment: {
                    Variables: {
                        AWS_CODEGURU_PROFILER_GROUP_ARN: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:', { Ref: 'AWS::Partition' }, ':codeguru-profiler:', { Ref: 'AWS::Region' },
                                    ':', { Ref: 'AWS::AccountId' }, ':profilingGroup/', { Ref: 'ProfilingGroup26979FD7' },
                                ],
                            ],
                        },
                        AWS_CODEGURU_PROFILER_ENABLED: 'TRUE',
                    },
                },
            });
        });
        test('default function with client provided Profiling Group but profiling set to false', () => {
            const stack = new cdk.Stack();
            new lambda.Function(stack, 'MyLambda', {
                code: new lambda.InlineCode('foo'),
                handler: 'index.handler',
                runtime: lambda.Runtime.PYTHON_3_9,
                profiling: false,
                profilingGroup: new aws_codeguruprofiler_1.ProfilingGroup(stack, 'ProfilingGroup'),
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', assertions_1.Match.not({
                Environment: {
                    Variables: {
                        AWS_CODEGURU_PROFILER_GROUP_ARN: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:', { Ref: 'AWS::Partition' }, ':codeguru-profiler:', { Ref: 'AWS::Region' },
                                    ':', { Ref: 'AWS::AccountId' }, ':profilingGroup/', { Ref: 'ProfilingGroup26979FD7' },
                                ],
                            ],
                        },
                        AWS_CODEGURU_PROFILER_ENABLED: 'TRUE',
                    },
                },
            }));
        });
        test('default function with profiling enabled and client provided env vars', () => {
            const stack = new cdk.Stack();
            expect(() => new lambda.Function(stack, 'MyLambda', {
                code: new lambda.InlineCode('foo'),
                handler: 'index.handler',
                runtime: lambda.Runtime.PYTHON_3_9,
                profiling: true,
                environment: {
                    AWS_CODEGURU_PROFILER_GROUP_ARN: 'profiler_group_arn',
                    AWS_CODEGURU_PROFILER_ENABLED: 'yes',
                },
            })).toThrow(/AWS_CODEGURU_PROFILER_GROUP_ARN and AWS_CODEGURU_PROFILER_ENABLED must not be set when profiling options enabled/);
        });
        test('default function with client provided Profiling Group and client provided env vars', () => {
            const stack = new cdk.Stack();
            expect(() => new lambda.Function(stack, 'MyLambda', {
                code: new lambda.InlineCode('foo'),
                handler: 'index.handler',
                runtime: lambda.Runtime.PYTHON_3_9,
                profilingGroup: new aws_codeguruprofiler_1.ProfilingGroup(stack, 'ProfilingGroup'),
                environment: {
                    AWS_CODEGURU_PROFILER_GROUP_ARN: 'profiler_group_arn',
                    AWS_CODEGURU_PROFILER_ENABLED: 'yes',
                },
            })).toThrow(/AWS_CODEGURU_PROFILER_GROUP_ARN and AWS_CODEGURU_PROFILER_ENABLED must not be set when profiling options enabled/);
        });
        test('throws an error when used with an unsupported runtime', () => {
            const stack = new cdk.Stack();
            expect(() => new lambda.Function(stack, 'MyLambda', {
                code: new lambda.InlineCode('foo'),
                handler: 'index.handler',
                runtime: lambda.Runtime.NODEJS_14_X,
                profilingGroup: new aws_codeguruprofiler_1.ProfilingGroup(stack, 'ProfilingGroup'),
                environment: {
                    AWS_CODEGURU_PROFILER_GROUP_ARN: 'profiler_group_arn',
                    AWS_CODEGURU_PROFILER_ENABLED: 'yes',
                },
            })).toThrow(/not supported by runtime/);
        });
    });
    describe('lambda.Function timeout', () => {
        test('should be a cdk.Duration when defined', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const { timeout } = new lambda.Function(stack, 'MyFunction', {
                handler: 'foo',
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
                timeout: cdk.Duration.minutes(2),
            });
            // THEN
            expect(timeout).toEqual(cdk.Duration.minutes(2));
        });
        test('should be optional', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const { timeout } = new lambda.Function(stack, 'MyFunction', {
                handler: 'foo',
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
            });
            // THEN
            expect(timeout).not.toBeDefined();
        });
    });
    describe('currentVersion', () => {
        // see test.function-hash.ts for more coverage for this
        test('logical id of version is based on the function hash', () => {
            // GIVEN
            const stack1 = new cdk.Stack();
            const fn1 = new lambda.Function(stack1, 'MyFunction', {
                handler: 'foo',
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
                environment: {
                    FOO: 'bar',
                },
            });
            const stack2 = new cdk.Stack();
            const fn2 = new lambda.Function(stack2, 'MyFunction', {
                handler: 'foo',
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
                environment: {
                    FOO: 'bear',
                },
            });
            // WHEN
            new cdk.CfnOutput(stack1, 'CurrentVersionArn', {
                value: fn1.currentVersion.functionArn,
            });
            new cdk.CfnOutput(stack2, 'CurrentVersionArn', {
                value: fn2.currentVersion.functionArn,
            });
            // THEN
            const template1 = assertions_1.Template.fromStack(stack1).toJSON();
            const template2 = assertions_1.Template.fromStack(stack2).toJSON();
            // these functions are different in their configuration but the original
            // logical ID of the version would be the same unless the logical ID
            // includes the hash of function's configuration.
            expect(template1.Outputs.CurrentVersionArn.Value).not.toEqual(template2.Outputs.CurrentVersionArn.Value);
        });
    });
    describe('filesystem', () => {
        test('mount efs filesystem', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'Vpc', {
                maxAzs: 3,
                natGateways: 1,
            });
            const fs = new efs.FileSystem(stack, 'Efs', {
                vpc,
            });
            const accessPoint = fs.addAccessPoint('AccessPoint');
            // WHEN
            new lambda.Function(stack, 'MyFunction', {
                vpc,
                handler: 'foo',
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
                filesystem: lambda.FileSystem.fromEfsAccessPoint(accessPoint, '/mnt/msg'),
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
                FileSystemConfigs: [
                    {
                        Arn: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {
                                        Ref: 'AWS::Partition',
                                    },
                                    ':elasticfilesystem:',
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    ':',
                                    {
                                        Ref: 'AWS::AccountId',
                                    },
                                    ':access-point/',
                                    {
                                        Ref: 'EfsAccessPointE419FED9',
                                    },
                                ],
                            ],
                        },
                        LocalMountPath: '/mnt/msg',
                    },
                ],
            });
        });
        test('throw error mounting efs with no vpc', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'Vpc', {
                maxAzs: 3,
                natGateways: 1,
            });
            const fs = new efs.FileSystem(stack, 'Efs', {
                vpc,
            });
            const accessPoint = fs.addAccessPoint('AccessPoint');
            // THEN
            expect(() => {
                new lambda.Function(stack, 'MyFunction', {
                    handler: 'foo',
                    runtime: lambda.Runtime.NODEJS_14_X,
                    code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
                    filesystem: lambda.FileSystem.fromEfsAccessPoint(accessPoint, '/mnt/msg'),
                });
            }).toThrow();
        });
        test('verify deps when mounting efs', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'Vpc', {
                maxAzs: 3,
                natGateways: 1,
            });
            const securityGroup = new ec2.SecurityGroup(stack, 'LambdaSG', {
                vpc,
                allowAllOutbound: false,
            });
            const fs = new efs.FileSystem(stack, 'Efs', {
                vpc,
            });
            const accessPoint = fs.addAccessPoint('AccessPoint');
            // WHEN
            new lambda.Function(stack, 'MyFunction', {
                vpc,
                handler: 'foo',
                securityGroups: [securityGroup],
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromAsset(path.join(__dirname, 'handler.zip')),
                filesystem: lambda.FileSystem.fromEfsAccessPoint(accessPoint, '/mnt/msg'),
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
                DependsOn: [
                    'EfsEfsMountTarget195B2DD2E',
                    'EfsEfsMountTarget2315C927F',
                    'EfsEfsSecurityGroupfromLambdaSG20491B2F751D',
                    'LambdaSGtoEfsEfsSecurityGroupFCE2954020499719694A',
                    'MyFunctionServiceRoleDefaultPolicyB705ABD4',
                    'MyFunctionServiceRole3C357FF2',
                    'VpcPrivateSubnet1DefaultRouteBE02A9ED',
                    'VpcPrivateSubnet1RouteTableAssociation70C59FA6',
                    'VpcPrivateSubnet2DefaultRoute060D2087',
                    'VpcPrivateSubnet2RouteTableAssociationA89CAD56',
                ],
            });
        });
    });
    describe('code config', () => {
        class MyCode extends lambda.Code {
            constructor(config) {
                super();
                this.config = config;
                this.isInline = 'inlineCode' in config;
            }
            bind(_scope) {
                return this.config;
            }
        }
        test('only one of inline, s3 or imageConfig are allowed', () => {
            const stack = new cdk.Stack();
            expect(() => new lambda.Function(stack, 'Fn1', {
                code: new MyCode({}),
                handler: 'index.handler',
                runtime: lambda.Runtime.GO_1_X,
            })).toThrow(/lambda.Code must specify exactly one of/);
            expect(() => new lambda.Function(stack, 'Fn2', {
                code: new MyCode({
                    inlineCode: 'foo',
                    image: { imageUri: 'bar' },
                }),
                handler: 'index.handler',
                runtime: lambda.Runtime.GO_1_X,
            })).toThrow(/lambda.Code must specify exactly one of/);
            expect(() => new lambda.Function(stack, 'Fn3', {
                code: new MyCode({
                    image: { imageUri: 'baz' },
                    s3Location: { bucketName: 's3foo', objectKey: 's3bar' },
                }),
                handler: 'index.handler',
                runtime: lambda.Runtime.GO_1_X,
            })).toThrow(/lambda.Code must specify exactly one of/);
            expect(() => new lambda.Function(stack, 'Fn4', {
                code: new MyCode({ inlineCode: 'baz', s3Location: { bucketName: 's3foo', objectKey: 's3bar' } }),
                handler: 'index.handler',
                runtime: lambda.Runtime.GO_1_X,
            })).toThrow(/lambda.Code must specify exactly one of/);
        });
        test('handler must be FROM_IMAGE when image asset is specified', () => {
            const stack = new cdk.Stack();
            expect(() => new lambda.Function(stack, 'Fn1', {
                code: lambda.Code.fromAssetImage('test/docker-lambda-handler'),
                handler: lambda.Handler.FROM_IMAGE,
                runtime: lambda.Runtime.FROM_IMAGE,
            })).not.toThrow();
            expect(() => new lambda.Function(stack, 'Fn2', {
                code: lambda.Code.fromAssetImage('test/docker-lambda-handler'),
                handler: 'index.handler',
                runtime: lambda.Runtime.FROM_IMAGE,
            })).toThrow(/handler must be.*FROM_IMAGE/);
        });
        test('runtime must be FROM_IMAGE when image asset is specified', () => {
            const stack = new cdk.Stack();
            expect(() => new lambda.Function(stack, 'Fn1', {
                code: lambda.Code.fromAssetImage('test/docker-lambda-handler'),
                handler: lambda.Handler.FROM_IMAGE,
                runtime: lambda.Runtime.FROM_IMAGE,
            })).not.toThrow();
            expect(() => new lambda.Function(stack, 'Fn2', {
                code: lambda.Code.fromAssetImage('test/docker-lambda-handler'),
                handler: lambda.Handler.FROM_IMAGE,
                runtime: lambda.Runtime.GO_1_X,
            })).toThrow(/runtime must be.*FROM_IMAGE/);
        });
        test('imageUri is correctly configured', () => {
            const stack = new cdk.Stack();
            new lambda.Function(stack, 'Fn1', {
                code: new MyCode({
                    image: {
                        imageUri: 'ecr image uri',
                    },
                }),
                handler: lambda.Handler.FROM_IMAGE,
                runtime: lambda.Runtime.FROM_IMAGE,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
                Code: {
                    ImageUri: 'ecr image uri',
                },
                ImageConfig: assertions_1.Match.absent(),
            });
        });
        test('imageConfig is correctly configured', () => {
            const stack = new cdk.Stack();
            new lambda.Function(stack, 'Fn1', {
                code: new MyCode({
                    image: {
                        imageUri: 'ecr image uri',
                        cmd: ['cmd', 'param1'],
                        entrypoint: ['entrypoint', 'param2'],
                        workingDirectory: '/some/path',
                    },
                }),
                handler: lambda.Handler.FROM_IMAGE,
                runtime: lambda.Runtime.FROM_IMAGE,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
                ImageConfig: {
                    Command: ['cmd', 'param1'],
                    EntryPoint: ['entrypoint', 'param2'],
                    WorkingDirectory: '/some/path',
                },
            });
        });
    });
    describe('code signing config', () => {
        test('default', () => {
            const stack = new cdk.Stack();
            const signingProfile = new signer.SigningProfile(stack, 'SigningProfile', {
                platform: signer.Platform.AWS_LAMBDA_SHA384_ECDSA,
            });
            const codeSigningConfig = new lambda.CodeSigningConfig(stack, 'CodeSigningConfig', {
                signingProfiles: [signingProfile],
            });
            new lambda.Function(stack, 'MyLambda', {
                code: new lambda.InlineCode('foo'),
                handler: 'index.handler',
                runtime: lambda.Runtime.NODEJS_14_X,
                codeSigningConfig,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
                CodeSigningConfigArn: {
                    'Fn::GetAtt': [
                        'CodeSigningConfigD8D41C10',
                        'CodeSigningConfigArn',
                    ],
                },
            });
        });
    });
    test('error when layers set in a container function', () => {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'Bucket');
        const code = new lambda.S3Code(bucket, 'ObjectKey');
        const layer = new lambda.LayerVersion(stack, 'Layer', {
            code,
        });
        expect(() => new lambda.DockerImageFunction(stack, 'MyLambda', {
            code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, 'docker-lambda-handler')),
            layers: [layer],
        })).toThrow(/Layers are not supported for container image functions/);
    });
    cdk_build_tools_1.testDeprecated('specified architectures is recognized', () => {
        const stack = new cdk.Stack();
        new lambda.Function(stack, 'MyFunction', {
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            architectures: [lambda.Architecture.ARM_64],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Architectures: ['arm64'],
        });
    });
    test('specified architecture is recognized', () => {
        const stack = new cdk.Stack();
        new lambda.Function(stack, 'MyFunction', {
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            architecture: lambda.Architecture.ARM_64,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Architectures: ['arm64'],
        });
    });
    cdk_build_tools_1.testDeprecated('both architectures and architecture are not recognized', () => {
        const stack = new cdk.Stack();
        expect(() => new lambda.Function(stack, 'MyFunction', {
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            architecture: lambda.Architecture.ARM_64,
            architectures: [lambda.Architecture.X86_64],
        })).toThrow(/architecture or architectures must be specified/);
    });
    cdk_build_tools_1.testDeprecated('Only one architecture allowed', () => {
        const stack = new cdk.Stack();
        expect(() => new lambda.Function(stack, 'MyFunction', {
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            architectures: [lambda.Architecture.X86_64, lambda.Architecture.ARM_64],
        })).toThrow(/one architecture must be specified/);
    });
    test('Architecture is properly readable from the function', () => {
        const stack = new cdk.Stack();
        const fn = new lambda.Function(stack, 'MyFunction', {
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            architecture: lambda.Architecture.ARM_64,
        });
        expect(fn.architecture?.name).toEqual('arm64');
    });
    test('Error when function name is longer than 64 chars', () => {
        const stack = new cdk.Stack();
        expect(() => new lambda.Function(stack, 'MyFunction', {
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            functionName: 'a'.repeat(65),
        })).toThrow(/Function name can not be longer than 64 characters/);
    });
    test('Error when function name contains invalid characters', () => {
        const stack = new cdk.Stack();
        [' ', '\n', '\r', '[', ']', '<', '>', '$'].forEach(invalidChar => {
            expect(() => {
                new lambda.Function(stack, `foo${invalidChar}`, {
                    code: new lambda.InlineCode('foo'),
                    handler: 'index.handler',
                    runtime: lambda.Runtime.NODEJS_14_X,
                    functionName: `foo${invalidChar}`,
                });
            }).toThrow(/can contain only letters, numbers, hyphens, or underscores with no spaces./);
        });
    });
    test('No error when function name is Tokenized and Unresolved', () => {
        const stack = new cdk.Stack();
        expect(() => {
            const realFunctionName = 'a'.repeat(141);
            const tokenizedFunctionName = cdk.Token.asString(new cdk.Intrinsic(realFunctionName));
            new lambda.Function(stack, 'foo', {
                code: new lambda.InlineCode('foo'),
                handler: 'index.handler',
                runtime: lambda.Runtime.NODEJS_14_X,
                functionName: tokenizedFunctionName,
            });
        }).not.toThrow();
    });
    test('Error when function description is longer than 256 chars', () => {
        const stack = new cdk.Stack();
        expect(() => new lambda.Function(stack, 'MyFunction', {
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            description: 'a'.repeat(257),
        })).toThrow(/Function description can not be longer than 256 characters/);
    });
    test('No error when function name is Tokenized and Unresolved', () => {
        const stack = new cdk.Stack();
        expect(() => {
            const realFunctionDescription = 'a'.repeat(257);
            const tokenizedFunctionDescription = cdk.Token.asString(new cdk.Intrinsic(realFunctionDescription));
            new lambda.Function(stack, 'foo', {
                code: new lambda.InlineCode('foo'),
                handler: 'index.handler',
                runtime: lambda.Runtime.NODEJS_14_X,
                description: tokenizedFunctionDescription,
            });
        }).not.toThrow();
    });
    describe('FunctionUrl', () => {
        test('addFunctionUrl creates a function url with default options', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const fn = new lambda.Function(stack, 'MyLambda', {
                code: new lambda.InlineCode('hello()'),
                handler: 'index.hello',
                runtime: lambda.Runtime.NODEJS_14_X,
            });
            // WHEN
            fn.addFunctionUrl();
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Url', {
                AuthType: 'AWS_IAM',
                TargetFunctionArn: {
                    'Fn::GetAtt': [
                        'MyLambdaCCE802FB',
                        'Arn',
                    ],
                },
            });
        });
        test('addFunctionUrl creates a function url with all options', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const fn = new lambda.Function(stack, 'MyLambda', {
                code: new lambda.InlineCode('hello()'),
                handler: 'index.hello',
                runtime: lambda.Runtime.NODEJS_14_X,
            });
            // WHEN
            fn.addFunctionUrl({
                authType: lambda.FunctionUrlAuthType.NONE,
                cors: {
                    allowCredentials: true,
                    allowedOrigins: ['https://example.com'],
                    allowedMethods: [lambda.HttpMethod.GET],
                    allowedHeaders: ['X-Custom-Header'],
                    maxAge: cdk.Duration.seconds(300),
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Url', {
                AuthType: 'NONE',
                TargetFunctionArn: {
                    'Fn::GetAtt': [
                        'MyLambdaCCE802FB',
                        'Arn',
                    ],
                },
                Cors: {
                    AllowCredentials: true,
                    AllowHeaders: [
                        'X-Custom-Header',
                    ],
                    AllowMethods: [
                        'GET',
                    ],
                    AllowOrigins: [
                        'https://example.com',
                    ],
                    MaxAge: 300,
                },
            });
        });
        test('grantInvokeUrl: adds appropriate permissions', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const role = new iam.Role(stack, 'Role', {
                assumedBy: new iam.AccountPrincipal('1234'),
            });
            const fn = new lambda.Function(stack, 'MyLambda', {
                code: new lambda.InlineCode('hello()'),
                handler: 'index.hello',
                runtime: lambda.Runtime.NODEJS_14_X,
            });
            fn.addFunctionUrl();
            // WHEN
            fn.grantInvokeUrl(role);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Action: 'lambda:InvokeFunctionUrl',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'MyLambdaCCE802FB',
                                    'Arn',
                                ],
                            },
                        },
                    ],
                },
            });
        });
    });
    test('called twice for the same service principal but with different conditions', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const fn = new lambda.Function(stack, 'Function', {
            code: lambda.Code.fromInline('xxx'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const sourceArnA = 'some-arn-a';
        const sourceArnB = 'some-arn-b';
        const service = 's3.amazonaws.com';
        const conditionalPrincipalA = new iam.PrincipalWithConditions(new iam.ServicePrincipal(service), {
            ArnLike: {
                'aws:SourceArn': sourceArnA,
            },
            StringEquals: {
                'aws:SourceAccount': stack.account,
            },
        });
        const conditionalPrincipalB = new iam.PrincipalWithConditions(new iam.ServicePrincipal(service), {
            ArnLike: {
                'aws:SourceArn': sourceArnB,
            },
            StringEquals: {
                'aws:SourceAccount': stack.account,
            },
        });
        // WHEN
        fn.grantInvoke(conditionalPrincipalA);
        fn.grantInvoke(conditionalPrincipalB);
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 2);
        assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Permission', {
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {
                    'Fn::GetAtt': [
                        'Function76856677',
                        'Arn',
                    ],
                },
                Principal: service,
                SourceAccount: {
                    Ref: 'AWS::AccountId',
                },
                SourceArn: sourceArnA,
            },
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Permission', {
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {
                    'Fn::GetAtt': [
                        'Function76856677',
                        'Arn',
                    ],
                },
                Principal: service,
                SourceAccount: {
                    Ref: 'AWS::AccountId',
                },
                SourceArn: sourceArnB,
            },
        });
    });
    test('adds ADOT instrumentation to a ZIP Lambda function', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Base', {
            env: { account: '111111111111', region: 'us-west-2' },
        });
        // WHEN
        new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            adotInstrumentation: {
                layerVersion: lambda.AdotLayerVersion.fromJavaSdkLayerVersion(adot_layers_1.AdotLambdaLayerJavaSdkVersion.V1_19_0),
                execWrapper: lambda.AdotLambdaExecWrapper.REGULAR_HANDLER,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Layers: ['arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1'],
            Environment: {
                Variables: {
                    AWS_LAMBDA_EXEC_WRAPPER: '/opt/otel-handler',
                },
            },
        });
    });
    test('adds ADOT instrumentation to a container image Lambda function', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Base', {
            env: { account: '111111111111', region: 'us-west-2' },
        });
        // WHEN
        expect(() => new lambda.DockerImageFunction(stack, 'MyLambda', {
            code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, 'docker-lambda-handler')),
            adotInstrumentation: {
                layerVersion: lambda.AdotLayerVersion.fromJavaSdkLayerVersion(adot_layers_1.AdotLambdaLayerJavaSdkVersion.V1_19_0),
                execWrapper: lambda.AdotLambdaExecWrapper.REGULAR_HANDLER,
            },
        })).toThrow(/ADOT Lambda layer can't be configured with container image package type/);
    });
});
test('throws if ephemeral storage size is out of bound', () => {
    const stack = new cdk.Stack();
    expect(() => new lambda.Function(stack, 'MyLambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'bar',
        runtime: lambda.Runtime.NODEJS_14_X,
        ephemeralStorageSize: core_1.Size.mebibytes(511),
    })).toThrow(/Ephemeral storage size must be between 512 and 10240 MB/);
});
test('set ephemeral storage to desired size', () => {
    const stack = new cdk.Stack();
    new lambda.Function(stack, 'MyLambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'bar',
        runtime: lambda.Runtime.NODEJS_14_X,
        ephemeralStorageSize: core_1.Size.mebibytes(1024),
    });
    assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
        Properties: {
            Code: { ZipFile: 'foo' },
            Handler: 'bar',
            Runtime: 'nodejs14.x',
            EphemeralStorage: {
                Size: 1024,
            },
        },
    });
});
test('ephemeral storage allows unresolved tokens', () => {
    const stack = new cdk.Stack();
    expect(() => {
        new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'bar',
            runtime: lambda.Runtime.NODEJS_14_X,
            ephemeralStorageSize: core_1.Size.mebibytes(core_1.Lazy.number({ produce: () => 1024 })),
        });
    }).not.toThrow();
});
test('FunctionVersionUpgrade adds new description to function', () => {
    const app = new cdk.App({ context: { [cxapi.LAMBDA_RECOGNIZE_LAYER_VERSION]: true } });
    const stack = new cdk.Stack(app);
    new lambda.Function(stack, 'MyLambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'bar',
        runtime: lambda.Runtime.NODEJS_14_X,
        description: 'my description',
    });
    core_1.Aspects.of(stack).add(new lambda.FunctionVersionUpgrade(cxapi.LAMBDA_RECOGNIZE_LAYER_VERSION));
    assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
        Properties: {
            Code: { ZipFile: 'foo' },
            Handler: 'bar',
            Runtime: 'nodejs14.x',
            Description: 'my description version-hash:54f18c47346ed84843c2dac547de81fa',
        },
    });
});
test('function using a reserved environment variable', () => {
    const stack = new cdk.Stack();
    expect(() => new lambda.Function(stack, 'MyLambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.PYTHON_3_9,
        environment: {
            AWS_REGION: 'ap-southeast-2',
        },
    })).toThrow(/AWS_REGION environment variable is reserved/);
});
test('set SnapStart to desired value', () => {
    const stack = new cdk.Stack();
    new lambda.CfnFunction(stack, 'MyLambda', {
        code: {
            zipFile: 'java11-test-function.zip',
        },
        functionName: 'MyCDK-SnapStart-Function',
        handler: 'example.Handler::handleRequest',
        role: 'testRole',
        runtime: 'java11',
        snapStart: { applyOn: 'PublishedVersions' },
    });
    assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
        Properties: {
            Code: { ZipFile: 'java11-test-function.zip' },
            Handler: 'example.Handler::handleRequest',
            Runtime: 'java11',
            SnapStart: {
                ApplyOn: 'PublishedVersions',
            },
        },
    });
});
function newTestLambda(scope) {
    return new lambda.Function(scope, 'MyLambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'bar',
        runtime: lambda.Runtime.PYTHON_3_9,
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb24udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZ1bmN0aW9uLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0Isb0RBQW1FO0FBQ25FLHdFQUErRDtBQUMvRCx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsMENBQTBDO0FBQzFDLHNDQUFzQztBQUN0Qyw4Q0FBOEM7QUFDOUMsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyw4REFBMEQ7QUFDMUQscUNBQXFDO0FBQ3JDLHdDQUFvRDtBQUNwRCx5Q0FBeUM7QUFFekMsNEJBQTRCO0FBQzVCLGlDQUFpQztBQUNqQyxvREFBbUU7QUFDbkUsd0RBQTZEO0FBRTdELFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7UUFDNUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDckMsSUFBSSxFQUFFLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7WUFDbEMsT0FBTyxFQUFFLGVBQWU7WUFDeEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztTQUNwQyxDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBZ0IsRUFBRTtZQUNoRSx3QkFBd0IsRUFDeEI7Z0JBQ0UsU0FBUyxFQUNQLENBQUM7d0JBQ0MsTUFBTSxFQUFFLGdCQUFnQjt3QkFDeEIsTUFBTSxFQUFFLE9BQU87d0JBQ2YsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLHNCQUFzQixFQUFFO3FCQUMvQyxDQUFDO2dCQUNKLE9BQU8sRUFBRSxZQUFZ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Z0M7WUFDekMsT0FBTyxFQUFFLFFBQVE7WUFDakIsU0FBUyxFQUFFO2dCQUNULE9BQU8sRUFBRSxtQkFBbUI7YUFDN0I7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBUyxhQUFhLENBQUMsS0FBMkI7SUFDaEQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtRQUM1QyxJQUFJLEVBQUUsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztRQUNsQyxPQUFPLEVBQUUsS0FBSztRQUNkLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7S0FDbkMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBBbm5vdGF0aW9ucywgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBQcm9maWxpbmdHcm91cCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlZ3VydXByb2ZpbGVyJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVmcyBmcm9tICdAYXdzLWNkay9hd3MtZWZzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCAqIGFzIGxvZ3MgZnJvbSAnQGF3cy1jZGsvYXdzLWxvZ3MnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIHNpZ25lciBmcm9tICdAYXdzLWNkay9hd3Mtc2lnbmVyJztcbmltcG9ydCAqIGFzIHNucyBmcm9tICdAYXdzLWNkay9hd3Mtc25zJztcbmltcG9ydCAqIGFzIHNxcyBmcm9tICdAYXdzLWNkay9hd3Mtc3FzJztcbmltcG9ydCB7IHRlc3REZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEFzcGVjdHMsIExhenksIFNpemUgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgKiBhcyBjb25zdHJ1Y3RzIGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBBZG90TGFtYmRhTGF5ZXJKYXZhU2RrVmVyc2lvbiB9IGZyb20gJy4uL2xpYi9hZG90LWxheWVycyc7XG5pbXBvcnQgeyBjYWxjdWxhdGVGdW5jdGlvbkhhc2ggfSBmcm9tICcuLi9saWIvZnVuY3Rpb24taGFzaCc7XG5cbmRlc2NyaWJlKCdmdW5jdGlvbicsICgpID0+IHtcbiAgdGVzdCgnZGVmYXVsdCBmdW5jdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnZm9vJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDpcbiAgICAgIHtcbiAgICAgICAgU3RhdGVtZW50OlxuICAgICAgICAgIFt7XG4gICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ2xhbWJkYS5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgIH1dLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgTWFuYWdlZFBvbGljeUFybnM6XG4gICAgICAgIFt7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzppYW06OmF3czpwb2xpY3kvc2VydmljZS1yb2xlL0FXU0xhbWJkYUJhc2ljRXhlY3V0aW9uUm9sZSddXSB9XSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgIFByb3BlcnRpZXM6XG4gICAgICB7XG4gICAgICAgIENvZGU6IHsgWmlwRmlsZTogJ2ZvbycgfSxcbiAgICAgICAgSGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBSb2xlOiB7ICdGbjo6R2V0QXR0JzogWydNeUxhbWJkYVNlcnZpY2VSb2xlNDUzOUVDQjYnLCAnQXJuJ10gfSxcbiAgICAgICAgUnVudGltZTogJ25vZGVqczE0LngnLFxuICAgICAgfSxcbiAgICAgIERlcGVuZHNPbjogWydNeUxhbWJkYVNlcnZpY2VSb2xlNDUzOUVDQjYnXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkcyBwb2xpY3kgcGVybWlzc2lvbnMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdmb28nKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgaW5pdGlhbFBvbGljeTogW25ldyBpYW0uUG9saWN5U3RhdGVtZW50KHsgYWN0aW9uczogWycqJ10sIHJlc291cmNlczogWycqJ10gfSldLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDpcbiAgICAgIHtcbiAgICAgICAgU3RhdGVtZW50OlxuICAgICAgICAgIFt7XG4gICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ2xhbWJkYS5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgIH1dLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgTWFuYWdlZFBvbGljeUFybnM6XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICAgIFt7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzppYW06OmF3czpwb2xpY3kvc2VydmljZS1yb2xlL0FXU0xhbWJkYUJhc2ljRXhlY3V0aW9uUm9sZSddXSB9XSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJyonLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgUG9saWN5TmFtZTogJ015TGFtYmRhU2VydmljZVJvbGVEZWZhdWx0UG9saWN5NUJCQzZGNjgnLFxuICAgICAgUm9sZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlZjogJ015TGFtYmRhU2VydmljZVJvbGU0NTM5RUNCNicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgUHJvcGVydGllczoge1xuICAgICAgICBDb2RlOiB7IFppcEZpbGU6ICdmb28nIH0sXG4gICAgICAgIEhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgUm9sZTogeyAnRm46OkdldEF0dCc6IFsnTXlMYW1iZGFTZXJ2aWNlUm9sZTQ1MzlFQ0I2JywgJ0FybiddIH0sXG4gICAgICAgIFJ1bnRpbWU6ICdub2RlanMxNC54JyxcbiAgICAgIH0sXG4gICAgICBEZXBlbmRzT246IFsnTXlMYW1iZGFTZXJ2aWNlUm9sZURlZmF1bHRQb2xpY3k1QkJDNkY2OCcsICdNeUxhbWJkYVNlcnZpY2VSb2xlNDUzOUVDQjYnXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgaWYgaW5saW5lIGNvZGUgaXMgdXNlZCBmb3IgYW4gaW52YWxpZCBydW50aW1lJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2ZvbycpLFxuICAgICAgaGFuZGxlcjogJ2JhcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5ET1RORVRfQ09SRV8yLFxuICAgIH0pKS50b1Rocm93KCk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdhZGRQZXJtaXNzaW9ucycsICgpID0+IHtcbiAgICB0ZXN0KCdjYW4gYmUgdXNlZCB0byBhZGQgcGVybWlzc2lvbnMgdG8gdGhlIExhbWJkYSBmdW5jdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgZm4gPSBuZXdUZXN0TGFtYmRhKHN0YWNrKTtcblxuICAgICAgZm4uYWRkUGVybWlzc2lvbignUzNQZXJtaXNzaW9uJywge1xuICAgICAgICBhY3Rpb246ICdsYW1iZGE6KicsXG4gICAgICAgIHByaW5jaXBhbDogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdzMy5hbWF6b25hd3MuY29tJyksXG4gICAgICAgIHNvdXJjZUFjY291bnQ6IHN0YWNrLmFjY291bnQsXG4gICAgICAgIHNvdXJjZUFybjogJ2Fybjphd3M6czM6OjpteV9idWNrZXQnLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgICBTZXJ2aWNlOiAnbGFtYmRhLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgICAgTWFuYWdlZFBvbGljeUFybnM6XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgICAgICBbeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6aWFtOjphd3M6cG9saWN5L3NlcnZpY2Utcm9sZS9BV1NMYW1iZGFCYXNpY0V4ZWN1dGlvblJvbGUnXV0gfV0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgQ29kZToge1xuICAgICAgICAgICAgWmlwRmlsZTogJ2ZvbycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBIYW5kbGVyOiAnYmFyJyxcbiAgICAgICAgICBSb2xlOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015TGFtYmRhU2VydmljZVJvbGU0NTM5RUNCNicsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJ1bnRpbWU6ICdweXRob24zLjknLFxuICAgICAgICB9LFxuICAgICAgICBEZXBlbmRzT246IFtcbiAgICAgICAgICAnTXlMYW1iZGFTZXJ2aWNlUm9sZTQ1MzlFQ0I2JyxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlBlcm1pc3Npb24nLCB7XG4gICAgICAgIEFjdGlvbjogJ2xhbWJkYToqJyxcbiAgICAgICAgRnVuY3Rpb25OYW1lOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnTXlMYW1iZGFDQ0U4MDJGQicsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBQcmluY2lwYWw6ICdzMy5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgU291cmNlQWNjb3VudDoge1xuICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgfSxcbiAgICAgICAgU291cmNlQXJuOiAnYXJuOmF3czpzMzo6Om15X2J1Y2tldCcsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBzdXBwbHkgcHJpbmNpcGFsT3JnSUQgdmlhIHBlcm1pc3Npb24gcHJvcGVydHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGZuID0gbmV3VGVzdExhbWJkYShzdGFjayk7XG4gICAgICBjb25zdCBvcmcgPSBuZXcgaWFtLk9yZ2FuaXphdGlvblByaW5jaXBhbCgnby14eHh4eHh4eHh4Jyk7XG4gICAgICBjb25zdCBhY2NvdW50ID0gbmV3IGlhbS5BY2NvdW50UHJpbmNpcGFsKCcxMjM0NTY3ODkwMTInKTtcblxuICAgICAgZm4uYWRkUGVybWlzc2lvbignUzNQZXJtaXNzaW9uJywge1xuICAgICAgICBhY3Rpb246ICdsYW1iZGE6KicsXG4gICAgICAgIHByaW5jaXBhbDogYWNjb3VudCxcbiAgICAgICAgb3JnYW5pemF0aW9uSWQ6IG9yZy5vcmdhbml6YXRpb25JZCxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlBlcm1pc3Npb24nLCB7XG4gICAgICAgIEFjdGlvbjogJ2xhbWJkYToqJyxcbiAgICAgICAgRnVuY3Rpb25OYW1lOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnTXlMYW1iZGFDQ0U4MDJGQicsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBQcmluY2lwYWw6IGFjY291bnQuYWNjb3VudElkLFxuICAgICAgICBQcmluY2lwYWxPcmdJRDogb3JnLm9yZ2FuaXphdGlvbklkLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdmYWlscyBpZiB0aGUgcHJpbmNpcGFsIGlzIG5vdCBhIHNlcnZpY2UsIGFjY291bnQsIGFybiwgb3Igb3JnYW5pemF0aW9uIHByaW5jaXBhbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgZm4gPSBuZXdUZXN0TGFtYmRhKHN0YWNrKTtcblxuICAgICAgZXhwZWN0KCgpID0+IGZuLmFkZFBlcm1pc3Npb24oJ0YxJywgeyBwcmluY2lwYWw6IG5ldyBpYW0uQ2Fub25pY2FsVXNlclByaW5jaXBhbCgnb3JnJykgfSkpXG4gICAgICAgIC50b1Rocm93KC9JbnZhbGlkIHByaW5jaXBhbCB0eXBlIGZvciBMYW1iZGEgcGVybWlzc2lvbiBzdGF0ZW1lbnQvKTtcblxuICAgICAgZm4uYWRkUGVybWlzc2lvbignUzEnLCB7IHByaW5jaXBhbDogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdteS1zZXJ2aWNlJykgfSk7XG4gICAgICBmbi5hZGRQZXJtaXNzaW9uKCdTMicsIHsgcHJpbmNpcGFsOiBuZXcgaWFtLkFjY291bnRQcmluY2lwYWwoJ2FjY291bnQnKSB9KTtcbiAgICAgIGZuLmFkZFBlcm1pc3Npb24oJ1MzJywgeyBwcmluY2lwYWw6IG5ldyBpYW0uQXJuUHJpbmNpcGFsKCdteTphcm4nKSB9KTtcbiAgICAgIGZuLmFkZFBlcm1pc3Npb24oJ1M0JywgeyBwcmluY2lwYWw6IG5ldyBpYW0uT3JnYW5pemF0aW9uUHJpbmNpcGFsKCdteTpvcmcnKSB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FwcGxpZXMgc291cmNlIGFjY291bnQvQVJOIGNvbmRpdGlvbnMgaWYgdGhlIHByaW5jaXBhbCBoYXMgY29uZGl0aW9ucycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgZm4gPSBuZXdUZXN0TGFtYmRhKHN0YWNrKTtcbiAgICAgIGNvbnN0IHNvdXJjZUFjY291bnQgPSAnc29tZS1hY2NvdW50JztcbiAgICAgIGNvbnN0IHNvdXJjZUFybiA9ICdzb21lLWFybic7XG4gICAgICBjb25zdCBzZXJ2aWNlID0gJ215LXNlcnZpY2UnO1xuICAgICAgY29uc3QgcHJpbmNpcGFsID0gbmV3IGlhbS5QcmluY2lwYWxXaXRoQ29uZGl0aW9ucyhuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoc2VydmljZSksIHtcbiAgICAgICAgQXJuTGlrZToge1xuICAgICAgICAgICdhd3M6U291cmNlQXJuJzogc291cmNlQXJuLFxuICAgICAgICB9LFxuICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAnYXdzOlNvdXJjZUFjY291bnQnOiBzb3VyY2VBY2NvdW50LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGZuLmFkZFBlcm1pc3Npb24oJ1MxJywgeyBwcmluY2lwYWw6IHByaW5jaXBhbCB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpQZXJtaXNzaW9uJywge1xuICAgICAgICBBY3Rpb246ICdsYW1iZGE6SW52b2tlRnVuY3Rpb24nLFxuICAgICAgICBGdW5jdGlvbk5hbWU6IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdNeUxhbWJkYUNDRTgwMkZCJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIFByaW5jaXBhbDogc2VydmljZSxcbiAgICAgICAgU291cmNlQWNjb3VudDogc291cmNlQWNjb3VudCxcbiAgICAgICAgU291cmNlQXJuOiBzb3VyY2VBcm4sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FwcGxpZXMgc291cmNlIGFybiBjb25kaXRpb24gaWYgcHJpbmNpcGFsIGhhcyBjb25kaXRpb25zJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBmbiA9IG5ld1Rlc3RMYW1iZGEoc3RhY2spO1xuICAgICAgY29uc3Qgc291cmNlQXJuID0gJ3NvbWUtYXJuJztcbiAgICAgIGNvbnN0IHNlcnZpY2UgPSAnbXktc2VydmljZSc7XG4gICAgICBjb25zdCBwcmluY2lwYWwgPSBuZXcgaWFtLlByaW5jaXBhbFdpdGhDb25kaXRpb25zKG5ldyBpYW0uU2VydmljZVByaW5jaXBhbChzZXJ2aWNlKSwge1xuICAgICAgICBBcm5MaWtlOiB7XG4gICAgICAgICAgJ2F3czpTb3VyY2VBcm4nOiBzb3VyY2VBcm4sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgZm4uYWRkUGVybWlzc2lvbignUzEnLCB7IHByaW5jaXBhbDogcHJpbmNpcGFsIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlBlcm1pc3Npb24nLCB7XG4gICAgICAgIEFjdGlvbjogJ2xhbWJkYTpJbnZva2VGdW5jdGlvbicsXG4gICAgICAgIEZ1bmN0aW9uTmFtZToge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ015TGFtYmRhQ0NFODAyRkInLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgUHJpbmNpcGFsOiBzZXJ2aWNlLFxuICAgICAgICBTb3VyY2VBcm46IHNvdXJjZUFybixcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYXBwbGllcyBwcmluY2lwYWwgb3JnIGlkIGNvbmRpdGlvbnMgaWYgdGhlIHByaW5jaXBhbCBoYXMgY29uZGl0aW9ucycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgZm4gPSBuZXdUZXN0TGFtYmRhKHN0YWNrKTtcbiAgICAgIGNvbnN0IHByaW5jaXBhbE9yZ0lkID0gJ29yZy14eHh4eHh4eHh4JztcbiAgICAgIGNvbnN0IHNlcnZpY2UgPSAnbXktc2VydmljZSc7XG4gICAgICBjb25zdCBwcmluY2lwYWwgPSBuZXcgaWFtLlByaW5jaXBhbFdpdGhDb25kaXRpb25zKG5ldyBpYW0uU2VydmljZVByaW5jaXBhbChzZXJ2aWNlKSwge1xuICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAnYXdzOlByaW5jaXBhbE9yZ0lEJzogcHJpbmNpcGFsT3JnSWQsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgZm4uYWRkUGVybWlzc2lvbignUzEnLCB7IHByaW5jaXBhbDogcHJpbmNpcGFsIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlBlcm1pc3Npb24nLCB7XG4gICAgICAgIEFjdGlvbjogJ2xhbWJkYTpJbnZva2VGdW5jdGlvbicsXG4gICAgICAgIEZ1bmN0aW9uTmFtZToge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ015TGFtYmRhQ0NFODAyRkInLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgUHJpbmNpcGFsOiBzZXJ2aWNlLFxuICAgICAgICBQcmluY2lwYWxPcmdJRDogcHJpbmNpcGFsT3JnSWQsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2ZhaWxzIGlmIHRoZSBwcmluY2lwYWwgaGFzIGNvbmRpdGlvbnMgdGhhdCBhcmUgbm90IHN1cHBvcnRlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgZm4gPSBuZXdUZXN0TGFtYmRhKHN0YWNrKTtcblxuICAgICAgZXhwZWN0KCgpID0+IGZuLmFkZFBlcm1pc3Npb24oJ0YxJywge1xuICAgICAgICBwcmluY2lwYWw6IG5ldyBpYW0uUHJpbmNpcGFsV2l0aENvbmRpdGlvbnMobmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdteS1zZXJ2aWNlJyksIHtcbiAgICAgICAgICBBcm5FcXVhbHM6IHtcbiAgICAgICAgICAgICdhd3M6U291cmNlQXJuJzogJ3NvdXJjZS1hcm4nLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgfSkpLnRvVGhyb3coL1ByaW5jaXBhbFdpdGhDb25kaXRpb25zIGhhZCB1bnN1cHBvcnRlZCBjb25kaXRpb25zIGZvciBMYW1iZGEgcGVybWlzc2lvbiBzdGF0ZW1lbnQvKTtcbiAgICAgIGV4cGVjdCgoKSA9PiBmbi5hZGRQZXJtaXNzaW9uKCdGMicsIHtcbiAgICAgICAgcHJpbmNpcGFsOiBuZXcgaWFtLlByaW5jaXBhbFdpdGhDb25kaXRpb25zKG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbXktc2VydmljZScpLCB7XG4gICAgICAgICAgU3RyaW5nTGlrZToge1xuICAgICAgICAgICAgJ2F3czpTb3VyY2VBY2NvdW50JzogJ3NvdXJjZS1hY2NvdW50JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIH0pKS50b1Rocm93KC9QcmluY2lwYWxXaXRoQ29uZGl0aW9ucyBoYWQgdW5zdXBwb3J0ZWQgY29uZGl0aW9ucyBmb3IgTGFtYmRhIHBlcm1pc3Npb24gc3RhdGVtZW50Lyk7XG4gICAgICBleHBlY3QoKCkgPT4gZm4uYWRkUGVybWlzc2lvbignRjMnLCB7XG4gICAgICAgIHByaW5jaXBhbDogbmV3IGlhbS5QcmluY2lwYWxXaXRoQ29uZGl0aW9ucyhuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ215LXNlcnZpY2UnKSwge1xuICAgICAgICAgIEFybkxpa2U6IHtcbiAgICAgICAgICAgICdzMzpEYXRhQWNjZXNzUG9pbnRBcm4nOiAnZGF0YS1hY2Nlc3MtcG9pbnQtYXJuJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIH0pKS50b1Rocm93KC9QcmluY2lwYWxXaXRoQ29uZGl0aW9ucyBoYWQgdW5zdXBwb3J0ZWQgY29uZGl0aW9ucyBmb3IgTGFtYmRhIHBlcm1pc3Npb24gc3RhdGVtZW50Lyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdmYWlscyBpZiB0aGUgcHJpbmNpcGFsIGhhcyBjb25kaXRpb24gY29tYmluYXRpb25zIHRoYXQgYXJlIG5vdCBzdXBwb3J0ZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGZuID0gbmV3VGVzdExhbWJkYShzdGFjayk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiBmbi5hZGRQZXJtaXNzaW9uKCdGMicsIHtcbiAgICAgICAgcHJpbmNpcGFsOiBuZXcgaWFtLlByaW5jaXBhbFdpdGhDb25kaXRpb25zKG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbXktc2VydmljZScpLCB7XG4gICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAnYXdzOlNvdXJjZUFjY291bnQnOiAnc291cmNlLWFjY291bnQnLFxuICAgICAgICAgICAgJ2F3czpQcmluY2lwYWxPcmdJRCc6ICdwcmluY2lwYWwtb3JnLWlkJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIEFybkxpa2U6IHtcbiAgICAgICAgICAgICdhd3M6U291cmNlQXJuJzogJ3NvdXJjZS1hcm4nLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgfSkpLnRvVGhyb3coL1ByaW5jaXBhbFdpdGhDb25kaXRpb25zIGhhZCB1bnN1cHBvcnRlZCBjb25kaXRpb24gY29tYmluYXRpb25zIGZvciBMYW1iZGEgcGVybWlzc2lvbiBzdGF0ZW1lbnQvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ0JZT1JvbGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnU29tZVJvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxuICAgICAgfSk7XG4gICAgICByb2xlLmFkZFRvUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHsgYWN0aW9uczogWydjb25maXJtOml0c3RoZXNhbWUnXSwgcmVzb3VyY2VzOiBbJyonXSB9KSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0Z1bmN0aW9uJywge1xuICAgICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ3Rlc3QnKSxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LnRlc3QnLFxuICAgICAgICByb2xlLFxuICAgICAgICBpbml0aWFsUG9saWN5OiBbXG4gICAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoeyBhY3Rpb25zOiBbJ2lubGluZTppbmxpbmUnXSwgcmVzb3VyY2VzOiBbJyonXSB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBmbi5hZGRUb1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoeyBhY3Rpb25zOiBbJ2V4cGxpY2l0OmV4cGxpY2l0J10sIHJlc291cmNlczogWycqJ10gfSkpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7IEFjdGlvbjogJ2NvbmZpcm06aXRzdGhlc2FtZScsIEVmZmVjdDogJ0FsbG93JywgUmVzb3VyY2U6ICcqJyB9LFxuICAgICAgICAgICAgeyBBY3Rpb246ICdpbmxpbmU6aW5saW5lJywgRWZmZWN0OiAnQWxsb3cnLCBSZXNvdXJjZTogJyonIH0sXG4gICAgICAgICAgICB7IEFjdGlvbjogJ2V4cGxpY2l0OmV4cGxpY2l0JywgRWZmZWN0OiAnQWxsb3cnLCBSZXNvdXJjZTogJyonIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmcm9tRnVuY3Rpb25Bcm4nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjazIgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgaW1wb3J0ZWQgPSBsYW1iZGEuRnVuY3Rpb24uZnJvbUZ1bmN0aW9uQXJuKHN0YWNrMiwgJ0ltcG9ydGVkJywgJ2Fybjphd3M6bGFtYmRhOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6ZnVuY3Rpb246UHJvY2Vzc0tpbmVzaXNSZWNvcmRzJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGltcG9ydGVkLmZ1bmN0aW9uQXJuKS50b0VxdWFsKCdhcm46YXdzOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOlByb2Nlc3NLaW5lc2lzUmVjb3JkcycpO1xuICAgIGV4cGVjdChpbXBvcnRlZC5mdW5jdGlvbk5hbWUpLnRvRXF1YWwoJ1Byb2Nlc3NLaW5lc2lzUmVjb3JkcycpO1xuICB9KTtcblxuICB0ZXN0KCdGdW5jdGlvbi5mcm9tRnVuY3Rpb25OYW1lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgaW1wb3J0ZWQgPSBsYW1iZGEuRnVuY3Rpb24uZnJvbUZ1bmN0aW9uTmFtZShzdGFjaywgJ0ltcG9ydGVkJywgJ215LWZ1bmN0aW9uJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoaW1wb3J0ZWQuZnVuY3Rpb25Bcm4pKS50b1N0cmljdEVxdWFsKHtcbiAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAnYXJuOicsXG4gICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICc6bGFtYmRhOicsXG4gICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICc6JyxcbiAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgJzpmdW5jdGlvbjpteS1mdW5jdGlvbicsXG4gICAgICBdXSxcbiAgICB9KTtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShpbXBvcnRlZC5mdW5jdGlvbk5hbWUpKS50b1N0cmljdEVxdWFsKHtcbiAgICAgICdGbjo6U2VsZWN0JzogWzYsIHtcbiAgICAgICAgJ0ZuOjpTcGxpdCc6IFsnOicsIHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAnOmxhbWJkYTonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgICAnOmZ1bmN0aW9uOm15LWZ1bmN0aW9uJyxcbiAgICAgICAgICBdXSxcbiAgICAgICAgfV0sXG4gICAgICB9XSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0Z1bmN0aW9uLmZyb21GdW5jdGlvbkF0dHJpYnV0ZXMoKScsICgpID0+IHtcbiAgICBsZXQgc3RhY2s6IGNkay5TdGFjaztcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdCYXNlJywge1xuICAgICAgICBlbnY6IHsgYWNjb3VudDogJzExMTExMTExMTExMScsIHJlZ2lvbjogJ3N0YWNrLXJlZ2lvbicgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2ZvciBhIGZ1bmN0aW9uIGluIGEgZGlmZmVyZW50IGFjY291bnQgYW5kIHJlZ2lvbicsICgpID0+IHtcbiAgICAgIGxldCBmdW5jOiBsYW1iZGEuSUZ1bmN0aW9uO1xuXG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgZnVuYyA9IGxhbWJkYS5GdW5jdGlvbi5mcm9tRnVuY3Rpb25BdHRyaWJ1dGVzKHN0YWNrLCAnaUZ1bmMnLCB7XG4gICAgICAgICAgZnVuY3Rpb25Bcm46ICdhcm46YXdzOmxhbWJkYTpmdW5jdGlvbi1yZWdpb246MjIyMjIyMjIyMjIyOmZ1bmN0aW9uOmZ1bmN0aW9uLW5hbWUnLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KFwidGhlIGZ1bmN0aW9uJ3MgcmVnaW9uIGlzIHRha2VuIGZyb20gdGhlIEFSTlwiLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChmdW5jLmVudi5yZWdpb24pLnRvQmUoJ2Z1bmN0aW9uLXJlZ2lvbicpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoXCJ0aGUgZnVuY3Rpb24ncyBhY2NvdW50IGlzIHRha2VuIGZyb20gdGhlIEFSTlwiLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChmdW5jLmVudi5hY2NvdW50KS50b0JlKCcyMjIyMjIyMjIyMjInKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnYWRkUGVybWlzc2lvbnMnLCAoKSA9PiB7XG4gICAgdGVzdCgnaW1wb3J0ZWQgRnVuY3Rpb24gdy8gcmVzb2x2ZWQgYWNjb3VudCBhbmQgZnVuY3Rpb24gYXJuJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnSW1wb3J0cycsIHtcbiAgICAgICAgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLCByZWdpb246ICd1cy1lYXN0LTEnIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgaUZ1bmMgPSBsYW1iZGEuRnVuY3Rpb24uZnJvbUZ1bmN0aW9uQXR0cmlidXRlcyhzdGFjaywgJ2lGdW5jJywge1xuICAgICAgICBmdW5jdGlvbkFybjogJ2Fybjphd3M6bGFtYmRhOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6ZnVuY3Rpb246QmFzZUZ1bmN0aW9uJyxcbiAgICAgIH0pO1xuICAgICAgaUZ1bmMuYWRkUGVybWlzc2lvbignaUZ1bmMnLCB7XG4gICAgICAgIHByaW5jaXBhbDogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdjbG91ZGZvcm1hdGlvbi5hbWF6b25hd3MuY29tJyksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6TGFtYmRhOjpQZXJtaXNzaW9uJywgMSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpbXBvcnRlZCBGdW5jdGlvbiB3LyB1bnJlc29sdmVkIGFjY291bnQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdJbXBvcnRzJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGlGdW5jID0gbGFtYmRhLkZ1bmN0aW9uLmZyb21GdW5jdGlvbkF0dHJpYnV0ZXMoc3RhY2ssICdpRnVuYycsIHtcbiAgICAgICAgZnVuY3Rpb25Bcm46ICdhcm46YXdzOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOkJhc2VGdW5jdGlvbicsXG4gICAgICB9KTtcbiAgICAgIGlGdW5jLmFkZFBlcm1pc3Npb24oJ2lGdW5jJywge1xuICAgICAgICBwcmluY2lwYWw6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnY2xvdWRmb3JtYXRpb24uYW1hem9uYXdzLmNvbScpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkxhbWJkYTo6UGVybWlzc2lvbicsIDApO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaW1wb3J0ZWQgRnVuY3Rpb24gdy8gdW5yZXNvbHZlZCBhY2NvdW50ICYgYWxsb3dQZXJtaXNzaW9ucyBzZXQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdJbXBvcnRzJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGlGdW5jID0gbGFtYmRhLkZ1bmN0aW9uLmZyb21GdW5jdGlvbkF0dHJpYnV0ZXMoc3RhY2ssICdpRnVuYycsIHtcbiAgICAgICAgZnVuY3Rpb25Bcm46ICdhcm46YXdzOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOkJhc2VGdW5jdGlvbicsXG4gICAgICAgIHNhbWVFbnZpcm9ubWVudDogdHJ1ZSwgLy8gc2luY2UgdGhpcyBpcyBmYWxzZSwgYnkgZGVmYXVsdCwgZm9yIGVudiBhZ25vc3RpYyBzdGFja3NcbiAgICAgIH0pO1xuICAgICAgaUZ1bmMuYWRkUGVybWlzc2lvbignaUZ1bmMnLCB7XG4gICAgICAgIHByaW5jaXBhbDogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdjbG91ZGZvcm1hdGlvbi5hbWF6b25hd3MuY29tJyksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6TGFtYmRhOjpQZXJtaXNzaW9uJywgMSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpbXBvcnRlZCBGdW5jdGlvbiB3L2RpZmZlcmVudCBhY2NvdW50JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnQmFzZScsIHtcbiAgICAgICAgZW52OiB7IGFjY291bnQ6ICcxMTExMTExMTExMTEnIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgaUZ1bmMgPSBsYW1iZGEuRnVuY3Rpb24uZnJvbUZ1bmN0aW9uQXR0cmlidXRlcyhzdGFjaywgJ2lGdW5jJywge1xuICAgICAgICBmdW5jdGlvbkFybjogJ2Fybjphd3M6bGFtYmRhOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6ZnVuY3Rpb246QmFzZUZ1bmN0aW9uJyxcbiAgICAgIH0pO1xuICAgICAgaUZ1bmMuYWRkUGVybWlzc2lvbignaUZ1bmMnLCB7XG4gICAgICAgIHByaW5jaXBhbDogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdjbG91ZGZvcm1hdGlvbi5hbWF6b25hd3MuY29tJyksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6TGFtYmRhOjpQZXJtaXNzaW9uJywgMCk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnYW5ub3RhdGlvbnMgb24gZGlmZmVyZW50IElGdW5jdGlvbnMnLCAoKSA9PiB7XG4gICAgICBsZXQgc3RhY2s6IGNkay5TdGFjaztcbiAgICAgIGxldCBmbjogbGFtYmRhLkZ1bmN0aW9uO1xuICAgICAgbGV0IHdhcm5pbmdNZXNzYWdlOiBzdHJpbmc7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgd2FybmluZ01lc3NhZ2UgPSAnQVdTIExhbWJkYSBoYXMgY2hhbmdlZCB0aGVpciBhdXRob3JpemF0aW9uIHN0cmF0ZWd5JztcbiAgICAgICAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktbGFtYmRhLWhhbmRsZXInKSksXG4gICAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzksXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGRlc2NyaWJlKCdwZXJtaXNzaW9ucyBvbiBmdW5jdGlvbnMnLCAoKSA9PiB7XG4gICAgICAgIHRlc3QoJ3dpdGhvdXQgbGFtYmRhOkludm9rZUZ1bmN0aW9uJywgKCkgPT4ge1xuICAgICAgICAgIC8vIFdIRU5cbiAgICAgICAgICBmbi5hZGRQZXJtaXNzaW9uKCdNeVBlcm1pc3Npb24nLCB7XG4gICAgICAgICAgICBhY3Rpb246ICdsYW1iZGEuR2V0RnVuY3Rpb24nLFxuICAgICAgICAgICAgcHJpbmNpcGFsOiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBTaW11bGF0ZSBhIHdvcmtmbG93IHdoZXJlIGEgdXNlciBoYXMgY3JlYXRlZCBhIGN1cnJlbnRWZXJzaW9uIHdpdGggdGhlIGludGVudCB0byBpbnZva2UgaXQgbGF0ZXIuXG4gICAgICAgICAgZm4uY3VycmVudFZlcnNpb247XG5cbiAgICAgICAgICAvLyBUSEVOXG4gICAgICAgICAgQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5oYXNOb1dhcm5pbmcoJy9EZWZhdWx0L015TGFtYmRhJywgTWF0Y2guc3RyaW5nTGlrZVJlZ2V4cCh3YXJuaW5nTWVzc2FnZSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgnd2l0aCBsYW1iZGE6SW52b2tlRnVuY3Rpb24nLCAoKSA9PiB7XG4gICAgICAgICAgdGVzdCgnd2l0aG91dCBpbnZva2luZyBjdXJyZW50VmVyc2lvbicsICgpID0+IHtcbiAgICAgICAgICAgIC8vIFdIRU5cbiAgICAgICAgICAgIGZuLmFkZFBlcm1pc3Npb24oJ015UGVybWlzc2lvbicsIHtcbiAgICAgICAgICAgICAgcHJpbmNpcGFsOiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gVEhFTlxuICAgICAgICAgICAgQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5oYXNOb1dhcm5pbmcoJy9EZWZhdWx0L015TGFtYmRhJywgTWF0Y2guc3RyaW5nTGlrZVJlZ2V4cCh3YXJuaW5nTWVzc2FnZSkpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGVzdCgnd2l0aCBjdXJyZW50VmVyc2lvbiBpbnZva2VkIGZpcnN0JywgKCkgPT4ge1xuICAgICAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgICAgIC8vIFNpbXVsYXRlIGEgd29ya2Zsb3cgd2hlcmUgYSB1c2VyIGhhcyBjcmVhdGVkIGEgY3VycmVudFZlcnNpb24gd2l0aCB0aGUgaW50ZW50IHRvIGludm9rZSBpdCBsYXRlci5cbiAgICAgICAgICAgIGZuLmN1cnJlbnRWZXJzaW9uO1xuXG4gICAgICAgICAgICAvLyBXSEVOXG4gICAgICAgICAgICBmbi5hZGRQZXJtaXNzaW9uKCdNeVBlcm1pc3Npb24nLCB7XG4gICAgICAgICAgICAgIHByaW5jaXBhbDogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFRIRU5cbiAgICAgICAgICAgIEFubm90YXRpb25zLmZyb21TdGFjayhzdGFjaykuaGFzV2FybmluZygnL0RlZmF1bHQvTXlMYW1iZGEnLCBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKHdhcm5pbmdNZXNzYWdlKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0ZXN0KCd3aXRoIGN1cnJlbnRWZXJzaW9uIGludm9rZWQgYWZ0ZXIgcGVybWlzc2lvbnMgY3JlYXRlZCcsICgpID0+IHtcbiAgICAgICAgICAgIC8vIFdIRU5cbiAgICAgICAgICAgIGZuLmFkZFBlcm1pc3Npb24oJ015UGVybWlzc2lvbicsIHtcbiAgICAgICAgICAgICAgcHJpbmNpcGFsOiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gU2ltdWxhdGUgYSB3b3JrZmxvdyB3aGVyZSBhIHVzZXIgaGFzIGNyZWF0ZWQgYSBjdXJyZW50VmVyc2lvbiBhZnRlciBhZGRpbmcgcGVybWlzc2lvbnMgdG8gdGhlIGZ1bmN0aW9uLlxuICAgICAgICAgICAgZm4uY3VycmVudFZlcnNpb247XG5cbiAgICAgICAgICAgIC8vIFRIRU5cbiAgICAgICAgICAgIEFubm90YXRpb25zLmZyb21TdGFjayhzdGFjaykuaGFzV2FybmluZygnL0RlZmF1bHQvTXlMYW1iZGEnLCBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKHdhcm5pbmdNZXNzYWdlKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0ZXN0KCdtdWx0aXBsZSBjdXJyZW50VmVyc2lvbiBjYWxscyBkb2VzIG5vdCByZXN1bHQgaW4gbXVsdGlwbGUgd2FybmluZ3MnLCAoKSA9PiB7XG4gICAgICAgICAgICAvLyBXSEVOXG4gICAgICAgICAgICBmbi5jdXJyZW50VmVyc2lvbjtcblxuICAgICAgICAgICAgZm4uYWRkUGVybWlzc2lvbignTXlQZXJtaXNzaW9uJywge1xuICAgICAgICAgICAgICBwcmluY2lwYWw6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbGFtYmRhLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmbi5jdXJyZW50VmVyc2lvbjtcblxuICAgICAgICAgICAgLy8gVEhFTlxuICAgICAgICAgICAgY29uc3Qgd2FybnMgPSBBbm5vdGF0aW9ucy5mcm9tU3RhY2soc3RhY2spLmZpbmRXYXJuaW5nKCcvRGVmYXVsdC9NeUxhbWJkYScsIE1hdGNoLnN0cmluZ0xpa2VSZWdleHAod2FybmluZ01lc3NhZ2UpKTtcbiAgICAgICAgICAgIGV4cGVjdCh3YXJucykudG9IYXZlTGVuZ3RoKDEpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdwZXJtaXNzaW9uIG9uIHZlcnNpb25zJywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCB2ZXJzaW9uID0gbmV3IGxhbWJkYS5WZXJzaW9uKHN0YWNrLCAnTXlWZXJzaW9uJywge1xuICAgICAgICAgIGxhbWJkYTogZm4uY3VycmVudFZlcnNpb24sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgdmVyc2lvbi5hZGRQZXJtaXNzaW9uKCdNeVBlcm1pc3Npb24nLCB7XG4gICAgICAgICAgcHJpbmNpcGFsOiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5oYXNOb1dhcm5pbmcoJy9EZWZhdWx0L015VmVyc2lvbicsIE1hdGNoLnN0cmluZ0xpa2VSZWdleHAod2FybmluZ01lc3NhZ2UpKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdwZXJtaXNzaW9uIG9uIGxhdGVzdCB2ZXJzaW9uJywgKCkgPT4ge1xuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGZuLmxhdGVzdFZlcnNpb24uYWRkUGVybWlzc2lvbignTXlQZXJtaXNzaW9uJywge1xuICAgICAgICAgIHByaW5jaXBhbDogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIC8vIGNhbm5vdCBhZGQgcGVybWlzc2lvbnMgb24gbGF0ZXN0IHZlcnNpb24sIHNvIG5vIHdhcm5pbmcgbmVjZXNzYXJ5XG4gICAgICAgIEFubm90YXRpb25zLmZyb21TdGFjayhzdGFjaykuaGFzTm9XYXJuaW5nKCcvRGVmYXVsdC9NeUxhbWJkYS8kTEFURVNUJywgTWF0Y2guc3RyaW5nTGlrZVJlZ2V4cCh3YXJuaW5nTWVzc2FnZSkpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2Z1bmN0aW9uLmFkZEFsaWFzJywgKCkgPT4ge1xuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGZuLmFkZEFsaWFzKCdwcm9kJyk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkFsaWFzJywge1xuICAgICAgICAgIE5hbWU6ICdwcm9kJyxcbiAgICAgICAgICBGdW5jdGlvbk5hbWU6IHsgUmVmOiAnTXlMYW1iZGFDQ0U4MDJGQicgfSxcbiAgICAgICAgICBGdW5jdGlvblZlcnNpb246IHsgJ0ZuOjpHZXRBdHQnOiBbJ015TGFtYmRhQ3VycmVudFZlcnNpb25FN0EzODJDQ2UyZDE0ODQ5YWUwMjc2NmQzYWJkMzY1YThhMGYxMmFlJywgJ1ZlcnNpb24nXSB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgncGVybWlzc2lvbiBvbiBhbGlhcycsICgpID0+IHtcbiAgICAgICAgdGVzdCgnb2YgY3VycmVudCB2ZXJzaW9uJywgKCkgPT4ge1xuICAgICAgICAgIC8vIEdJVkVOXG4gICAgICAgICAgY29uc3QgdmVyc2lvbiA9IG5ldyBsYW1iZGEuVmVyc2lvbihzdGFjaywgJ015VmVyc2lvbicsIHtcbiAgICAgICAgICAgIGxhbWJkYTogZm4uY3VycmVudFZlcnNpb24sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29uc3QgYWxpYXMgPSBuZXcgbGFtYmRhLkFsaWFzKHN0YWNrLCAnTXlBbGlhcycsIHtcbiAgICAgICAgICAgIGFsaWFzTmFtZTogJ2FsaWFzJyxcbiAgICAgICAgICAgIHZlcnNpb24sXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBXSEVOXG4gICAgICAgICAgYWxpYXMuYWRkUGVybWlzc2lvbignTXlQZXJtaXNzaW9uJywge1xuICAgICAgICAgICAgcHJpbmNpcGFsOiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBUSEVOXG4gICAgICAgICAgQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5oYXNOb1dhcm5pbmcoJy9EZWZhdWx0L015QWxpYXMnLCBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKHdhcm5pbmdNZXNzYWdlKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3QoJ29mIGxhdGVzdCB2ZXJzaW9uJywgKCkgPT4ge1xuICAgICAgICAgIC8vIEdJVkVOXG4gICAgICAgICAgY29uc3QgYWxpYXMgPSBuZXcgbGFtYmRhLkFsaWFzKHN0YWNrLCAnTXlBbGlhcycsIHtcbiAgICAgICAgICAgIGFsaWFzTmFtZTogJ2FsaWFzJyxcbiAgICAgICAgICAgIHZlcnNpb246IGZuLmxhdGVzdFZlcnNpb24sXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBXSEVOXG4gICAgICAgICAgYWxpYXMuYWRkUGVybWlzc2lvbignTXlQZXJtaXNzaW9uJywge1xuICAgICAgICAgICAgcHJpbmNpcGFsOiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBUSEVOXG4gICAgICAgICAgQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5oYXNOb1dhcm5pbmcoJy9EZWZhdWx0L015QWxpYXMnLCBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKHdhcm5pbmdNZXNzYWdlKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0xhbWJkYSBjb2RlIGNhbiBiZSByZWFkIGZyb20gYSBsb2NhbCBkaXJlY3RvcnkgdmlhIGFuIGFzc2V0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xuICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktbGFtYmRhLWhhbmRsZXInKSksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM185LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICBDb2RlOiB7XG4gICAgICAgIFMzQnVja2V0OiB7XG4gICAgICAgICAgUmVmOiAnQXNzZXRQYXJhbWV0ZXJzOTY3OGMzNGVjYTkzMjU5ZDExZjJkNzE0MTc3MzQ3YWZkNjZjNTAxMTZlMWUwODk5NmVmZjg5M2QzY2E4MTIzMlMzQnVja2V0MTM1NEM2NDUnLFxuICAgICAgICB9LFxuICAgICAgICBTM0tleToge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgeyAnRm46OlNlbGVjdCc6IFswLCB7ICdGbjo6U3BsaXQnOiBbJ3x8JywgeyBSZWY6ICdBc3NldFBhcmFtZXRlcnM5Njc4YzM0ZWNhOTMyNTlkMTFmMmQ3MTQxNzczNDdhZmQ2NmM1MDExNmUxZTA4OTk2ZWZmODkzZDNjYTgxMjMyUzNWZXJzaW9uS2V5NUQ4NzNGQUMnIH1dIH1dIH0sXG4gICAgICAgICAgICB7ICdGbjo6U2VsZWN0JzogWzEsIHsgJ0ZuOjpTcGxpdCc6IFsnfHwnLCB7IFJlZjogJ0Fzc2V0UGFyYW1ldGVyczk2NzhjMzRlY2E5MzI1OWQxMWYyZDcxNDE3NzM0N2FmZDY2YzUwMTE2ZTFlMDg5OTZlZmY4OTNkM2NhODEyMzJTM1ZlcnNpb25LZXk1RDg3M0ZBQycgfV0gfV0gfSxcbiAgICAgICAgICBdXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBIYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBSb2xlOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdNeUxhbWJkYVNlcnZpY2VSb2xlNDUzOUVDQjYnLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIFJ1bnRpbWU6ICdweXRob24zLjknLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdkZWZhdWx0IGZ1bmN0aW9uIHdpdGggU1FTIERMUSB3aGVuIGNsaWVudCBzZXRzIGRlYWRMZXR0ZXJRdWV1ZUVuYWJsZWQgdG8gdHJ1ZSBhbmQgZnVuY3Rpb25OYW1lIGRlZmluZWQgYnkgY2xpZW50JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdmb28nKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgZnVuY3Rpb25OYW1lOiAnT25lRnVuY3Rpb25Ub1J1bGVUaGVtQWxsJyxcbiAgICAgIGRlYWRMZXR0ZXJRdWV1ZUVuYWJsZWQ6IHRydWUsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgIFNlcnZpY2U6ICdsYW1iZGEuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgICBNYW5hZ2VkUG9saWN5QXJuczogW1xuICAgICAgICB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJzppYW06OmF3czpwb2xpY3kvc2VydmljZS1yb2xlL0FXU0xhbWJkYUJhc2ljRXhlY3V0aW9uUm9sZScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnc3FzOlNlbmRNZXNzYWdlJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdNeUxhbWJkYURlYWRMZXR0ZXJRdWV1ZTM5OUVFQTJEJyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICAgIFBvbGljeU5hbWU6ICdNeUxhbWJkYVNlcnZpY2VSb2xlRGVmYXVsdFBvbGljeTVCQkM2RjY4JyxcbiAgICAgIFJvbGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdNeUxhbWJkYVNlcnZpY2VSb2xlNDUzOUVDQjYnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgIENvZGU6IHtcbiAgICAgICAgICBaaXBGaWxlOiAnZm9vJyxcbiAgICAgICAgfSxcbiAgICAgICAgSGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBSb2xlOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnTXlMYW1iZGFTZXJ2aWNlUm9sZTQ1MzlFQ0I2JyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIFJ1bnRpbWU6ICdub2RlanMxNC54JyxcbiAgICAgICAgRGVhZExldHRlckNvbmZpZzoge1xuICAgICAgICAgIFRhcmdldEFybjoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeUxhbWJkYURlYWRMZXR0ZXJRdWV1ZTM5OUVFQTJEJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIEZ1bmN0aW9uTmFtZTogJ09uZUZ1bmN0aW9uVG9SdWxlVGhlbUFsbCcsXG4gICAgICB9LFxuICAgICAgRGVwZW5kc09uOiBbXG4gICAgICAgICdNeUxhbWJkYVNlcnZpY2VSb2xlRGVmYXVsdFBvbGljeTVCQkM2RjY4JyxcbiAgICAgICAgJ015TGFtYmRhU2VydmljZVJvbGU0NTM5RUNCNicsXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdkZWZhdWx0IGZ1bmN0aW9uIHdpdGggU1FTIERMUSB3aGVuIGNsaWVudCBzZXRzIGRlYWRMZXR0ZXJRdWV1ZUVuYWJsZWQgdG8gdHJ1ZSBhbmQgZnVuY3Rpb25OYW1lIG5vdCBkZWZpbmVkIGJ5IGNsaWVudCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnZm9vJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGRlYWRMZXR0ZXJRdWV1ZUVuYWJsZWQ6IHRydWUsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTUVM6OlF1ZXVlJywge1xuICAgICAgTWVzc2FnZVJldGVudGlvblBlcmlvZDogMTIwOTYwMCxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICBEZWFkTGV0dGVyQ29uZmlnOiB7XG4gICAgICAgIFRhcmdldEFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ015TGFtYmRhRGVhZExldHRlclF1ZXVlMzk5RUVBMkQnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RlZmF1bHQgZnVuY3Rpb24gd2l0aCBTUVMgRExRIHdoZW4gY2xpZW50IHNldHMgZGVhZExldHRlclF1ZXVlRW5hYmxlZCB0byBmYWxzZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnZm9vJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGRlYWRMZXR0ZXJRdWV1ZUVuYWJsZWQ6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgIENvZGU6IHtcbiAgICAgICAgWmlwRmlsZTogJ2ZvbycsXG4gICAgICB9LFxuICAgICAgSGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgUm9sZToge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnTXlMYW1iZGFTZXJ2aWNlUm9sZTQ1MzlFQ0I2JyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBSdW50aW1lOiAnbm9kZWpzMTQueCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RlZmF1bHQgZnVuY3Rpb24gd2l0aCBTUVMgRExRIHdoZW4gY2xpZW50IHByb3ZpZGVzIFF1ZXVlIHRvIGJlIHVzZWQgYXMgRExRJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgZGxRdWV1ZSA9IG5ldyBzcXMuUXVldWUoc3RhY2ssICdEZWFkTGV0dGVyUXVldWUnLCB7XG4gICAgICBxdWV1ZU5hbWU6ICdNeUxhbWJkYV9ETFEnLFxuICAgICAgcmV0ZW50aW9uUGVyaW9kOiBjZGsuRHVyYXRpb24uZGF5cygxNCksXG4gICAgfSk7XG5cbiAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2ZvbycpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBkZWFkTGV0dGVyUXVldWU6IGRsUXVldWUsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ3NxczpTZW5kTWVzc2FnZScsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnRGVhZExldHRlclF1ZXVlOUY0ODE1NDYnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgIERlYWRMZXR0ZXJDb25maWc6IHtcbiAgICAgICAgVGFyZ2V0QXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnRGVhZExldHRlclF1ZXVlOUY0ODE1NDYnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RlZmF1bHQgZnVuY3Rpb24gd2l0aCBTUVMgRExRIHdoZW4gY2xpZW50IHByb3ZpZGVzIFF1ZXVlIHRvIGJlIHVzZWQgYXMgRExRIGFuZCBkZWFkTGV0dGVyUXVldWVFbmFibGVkIHNldCB0byB0cnVlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgZGxRdWV1ZSA9IG5ldyBzcXMuUXVldWUoc3RhY2ssICdEZWFkTGV0dGVyUXVldWUnLCB7XG4gICAgICBxdWV1ZU5hbWU6ICdNeUxhbWJkYV9ETFEnLFxuICAgICAgcmV0ZW50aW9uUGVyaW9kOiBjZGsuRHVyYXRpb24uZGF5cygxNCksXG4gICAgfSk7XG5cbiAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2ZvbycpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBkZWFkTGV0dGVyUXVldWVFbmFibGVkOiB0cnVlLFxuICAgICAgZGVhZExldHRlclF1ZXVlOiBkbFF1ZXVlLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzcXM6U2VuZE1lc3NhZ2UnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0RlYWRMZXR0ZXJRdWV1ZTlGNDgxNTQ2JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICBEZWFkTGV0dGVyQ29uZmlnOiB7XG4gICAgICAgIFRhcmdldEFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0RlYWRMZXR0ZXJRdWV1ZTlGNDgxNTQ2JyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlcnJvciB3aGVuIGRlZmF1bHQgZnVuY3Rpb24gd2l0aCBTUVMgRExRIHdoZW4gY2xpZW50IHByb3ZpZGVzIFF1ZXVlIHRvIGJlIHVzZWQgYXMgRExRIGFuZCBkZWFkTGV0dGVyUXVldWVFbmFibGVkIHNldCB0byBmYWxzZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGRsUXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnRGVhZExldHRlclF1ZXVlJywge1xuICAgICAgcXVldWVOYW1lOiAnTXlMYW1iZGFfRExRJyxcbiAgICAgIHJldGVudGlvblBlcmlvZDogY2RrLkR1cmF0aW9uLmRheXMoMTQpLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnZm9vJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGRlYWRMZXR0ZXJRdWV1ZUVuYWJsZWQ6IGZhbHNlLFxuICAgICAgZGVhZExldHRlclF1ZXVlOiBkbFF1ZXVlLFxuICAgIH0pKS50b1Rocm93KC9kZWFkTGV0dGVyUXVldWUgZGVmaW5lZCBidXQgZGVhZExldHRlclF1ZXVlRW5hYmxlZCBleHBsaWNpdGx5IHNldCB0byBmYWxzZS8pO1xuICB9KTtcblxuICB0ZXN0KCdkZWZhdWx0IGZ1bmN0aW9uIHdpdGggU05TIERMUSB3aGVuIGNsaWVudCBwcm92aWRlcyBUb3BpYyB0byBiZSB1c2VkIGFzIERMUScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGRsVG9waWMgPSBuZXcgc25zLlRvcGljKHN0YWNrLCAnRGVhZExldHRlclRvcGljJyk7XG5cbiAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2ZvbycpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBkZWFkTGV0dGVyVG9waWM6IGRsVG9waWMsXG4gICAgfSk7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ3NuczpQdWJsaXNoJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgIFJlZjogJ0RlYWRMZXR0ZXJUb3BpY0MyMzc2NTBCJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSksXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgRGVhZExldHRlckNvbmZpZzoge1xuICAgICAgICBUYXJnZXRBcm46IHtcbiAgICAgICAgICBSZWY6ICdEZWFkTGV0dGVyVG9waWNDMjM3NjUwQicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlcnJvciB3aGVuIGRlZmF1bHQgZnVuY3Rpb24gd2l0aCBTTlMgRExRIHdoZW4gY2xpZW50IHByb3ZpZGVzIFRvcGljIHRvIGJlIHVzZWQgYXMgRExRIGFuZCBkZWFkTGV0dGVyUXVldWVFbmFibGVkIHNldCB0byBmYWxzZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGRsVG9waWMgPSBuZXcgc25zLlRvcGljKHN0YWNrLCAnRGVhZExldHRlclRvcGljJyk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdmb28nKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgZGVhZExldHRlclF1ZXVlRW5hYmxlZDogZmFsc2UsXG4gICAgICBkZWFkTGV0dGVyVG9waWM6IGRsVG9waWMsXG4gICAgfSkpLnRvVGhyb3coL2RlYWRMZXR0ZXJRdWV1ZSBhbmQgZGVhZExldHRlclRvcGljIGNhbm5vdCBiZSBzcGVjaWZpZWQgdG9nZXRoZXIgYXQgdGhlIHNhbWUgdGltZS8pO1xuICB9KTtcblxuICB0ZXN0KCdlcnJvciB3aGVuIGRlZmF1bHQgZnVuY3Rpb24gd2l0aCBTTlMgRExRIHdoZW4gY2xpZW50IHByb3ZpZGVzIFRvcGljIHRvIGJlIHVzZWQgYXMgRExRIGFuZCBkZWFkTGV0dGVyUXVldWVFbmFibGVkIHNldCB0byB0cnVlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgZGxUb3BpYyA9IG5ldyBzbnMuVG9waWMoc3RhY2ssICdEZWFkTGV0dGVyVG9waWMnKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2ZvbycpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBkZWFkTGV0dGVyUXVldWVFbmFibGVkOiB0cnVlLFxuICAgICAgZGVhZExldHRlclRvcGljOiBkbFRvcGljLFxuICAgIH0pKS50b1Rocm93KC9kZWFkTGV0dGVyUXVldWUgYW5kIGRlYWRMZXR0ZXJUb3BpYyBjYW5ub3QgYmUgc3BlY2lmaWVkIHRvZ2V0aGVyIGF0IHRoZSBzYW1lIHRpbWUvKTtcbiAgfSk7XG5cbiAgdGVzdCgnZXJyb3Igd2hlbiBib3RoIHRvcGljIGFuZCBxdWV1ZSBhcmUgcHJlc2VudGVkIGFzIERMUScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGRsUXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnRExRJyk7XG4gICAgY29uc3QgZGxUb3BpYyA9IG5ldyBzbnMuVG9waWMoc3RhY2ssICdEZWFkTGV0dGVyVG9waWMnKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2ZvbycpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBkZWFkTGV0dGVyUXVldWU6IGRsUXVldWUsXG4gICAgICBkZWFkTGV0dGVyVG9waWM6IGRsVG9waWMsXG4gICAgfSkpLnRvVGhyb3coL2RlYWRMZXR0ZXJRdWV1ZSBhbmQgZGVhZExldHRlclRvcGljIGNhbm5vdCBiZSBzcGVjaWZpZWQgdG9nZXRoZXIgYXQgdGhlIHNhbWUgdGltZS8pO1xuICB9KTtcblxuICB0ZXN0KCdkZWZhdWx0IGZ1bmN0aW9uIHdpdGggQWN0aXZlIHRyYWNpbmcnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2ZvbycpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICB0cmFjaW5nOiBsYW1iZGEuVHJhY2luZy5BQ1RJVkUsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAneHJheTpQdXRUcmFjZVNlZ21lbnRzJyxcbiAgICAgICAgICAgICAgJ3hyYXk6UHV0VGVsZW1ldHJ5UmVjb3JkcycsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgUG9saWN5TmFtZTogJ015TGFtYmRhU2VydmljZVJvbGVEZWZhdWx0UG9saWN5NUJCQzZGNjgnLFxuICAgICAgUm9sZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlZjogJ015TGFtYmRhU2VydmljZVJvbGU0NTM5RUNCNicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgUHJvcGVydGllczoge1xuICAgICAgICBDb2RlOiB7XG4gICAgICAgICAgWmlwRmlsZTogJ2ZvbycsXG4gICAgICAgIH0sXG4gICAgICAgIEhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgUm9sZToge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ015TGFtYmRhU2VydmljZVJvbGU0NTM5RUNCNicsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBSdW50aW1lOiAnbm9kZWpzMTQueCcsXG4gICAgICAgIFRyYWNpbmdDb25maWc6IHtcbiAgICAgICAgICBNb2RlOiAnQWN0aXZlJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBEZXBlbmRzT246IFtcbiAgICAgICAgJ015TGFtYmRhU2VydmljZVJvbGVEZWZhdWx0UG9saWN5NUJCQzZGNjgnLFxuICAgICAgICAnTXlMYW1iZGFTZXJ2aWNlUm9sZTQ1MzlFQ0I2JyxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RlZmF1bHQgZnVuY3Rpb24gd2l0aCBQYXNzVGhyb3VnaCB0cmFjaW5nJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdmb28nKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgdHJhY2luZzogbGFtYmRhLlRyYWNpbmcuUEFTU19USFJPVUdILFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgJ3hyYXk6UHV0VHJhY2VTZWdtZW50cycsXG4gICAgICAgICAgICAgICd4cmF5OlB1dFRlbGVtZXRyeVJlY29yZHMnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICAgIFBvbGljeU5hbWU6ICdNeUxhbWJkYVNlcnZpY2VSb2xlRGVmYXVsdFBvbGljeTVCQkM2RjY4JyxcbiAgICAgIFJvbGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdNeUxhbWJkYVNlcnZpY2VSb2xlNDUzOUVDQjYnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgQ29kZToge1xuICAgICAgICAgIFppcEZpbGU6ICdmb28nLFxuICAgICAgICB9LFxuICAgICAgICBIYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIFJvbGU6IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdNeUxhbWJkYVNlcnZpY2VSb2xlNDUzOUVDQjYnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgUnVudGltZTogJ25vZGVqczE0LngnLFxuICAgICAgICBUcmFjaW5nQ29uZmlnOiB7XG4gICAgICAgICAgTW9kZTogJ1Bhc3NUaHJvdWdoJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBEZXBlbmRzT246IFtcbiAgICAgICAgJ015TGFtYmRhU2VydmljZVJvbGVEZWZhdWx0UG9saWN5NUJCQzZGNjgnLFxuICAgICAgICAnTXlMYW1iZGFTZXJ2aWNlUm9sZTQ1MzlFQ0I2JyxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RlZmF1bHQgZnVuY3Rpb24gd2l0aCBEaXNhYmxlZCB0cmFjaW5nJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdmb28nKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgdHJhY2luZzogbGFtYmRhLlRyYWNpbmcuRElTQUJMRUQsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlBvbGljeScsIDApO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgUHJvcGVydGllczoge1xuICAgICAgICBDb2RlOiB7XG4gICAgICAgICAgWmlwRmlsZTogJ2ZvbycsXG4gICAgICAgIH0sXG4gICAgICAgIEhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgUm9sZToge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ015TGFtYmRhU2VydmljZVJvbGU0NTM5RUNCNicsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBSdW50aW1lOiAnbm9kZWpzMTQueCcsXG4gICAgICB9LFxuICAgICAgRGVwZW5kc09uOiBbXG4gICAgICAgICdNeUxhbWJkYVNlcnZpY2VSb2xlNDUzOUVDQjYnLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncnVudGltZSBhbmQgaGFuZGxlciBzZXQgdG8gRlJPTV9JTUFHRSBhcmUgc2V0IHRvIHVuZGVmaW5lZCBpbiBDbG91ZEZvcm1hdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldEltYWdlKHBhdGguam9pbihfX2Rpcm5hbWUsICdkb2NrZXItbGFtYmRhLWhhbmRsZXInKSksXG4gICAgICBoYW5kbGVyOiBsYW1iZGEuSGFuZGxlci5GUk9NX0lNQUdFLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuRlJPTV9JTUFHRSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICBSdW50aW1lOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgIEhhbmRsZXI6IE1hdGNoLmFic2VudCgpLFxuICAgICAgUGFja2FnZVR5cGU6ICdJbWFnZScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdncmFudEludm9rZScsICgpID0+IHtcbiAgICB0ZXN0KCdhZGRzIGlhbTpJbnZva2VGdW5jdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFByaW5jaXBhbCgnMTIzNCcpLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBmbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGdW5jdGlvbicsIHtcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgneHh4JyksXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgZm4uZ3JhbnRJbnZva2Uocm9sZSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnbGFtYmRhOkludm9rZUZ1bmN0aW9uJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogW1xuICAgICAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ0Z1bmN0aW9uNzY4NTY2NzcnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgICB7ICdGbjo6Sm9pbic6IFsnJywgW3sgJ0ZuOjpHZXRBdHQnOiBbJ0Z1bmN0aW9uNzY4NTY2NzcnLCAnQXJuJ10gfSwgJzoqJ11dIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggYSBzZXJ2aWNlIHByaW5jaXBhbCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0Z1bmN0aW9uJywge1xuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCd4eHgnKSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnYXBpZ2F0ZXdheS5hbWF6b25hd3MuY29tJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGZuLmdyYW50SW52b2tlKHNlcnZpY2UpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlBlcm1pc3Npb24nLCB7XG4gICAgICAgIEFjdGlvbjogJ2xhbWJkYTpJbnZva2VGdW5jdGlvbicsXG4gICAgICAgIEZ1bmN0aW9uTmFtZToge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0Z1bmN0aW9uNzY4NTY2NzcnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgUHJpbmNpcGFsOiAnYXBpZ2F0ZXdheS5hbWF6b25hd3MuY29tJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCBhbiBhY2NvdW50IHByaW5jaXBhbCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0Z1bmN0aW9uJywge1xuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCd4eHgnKSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgYWNjb3VudCA9IG5ldyBpYW0uQWNjb3VudFByaW5jaXBhbCgnMTIzNDU2Nzg5MDEyJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGZuLmdyYW50SW52b2tlKGFjY291bnQpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlBlcm1pc3Npb24nLCB7XG4gICAgICAgIEFjdGlvbjogJ2xhbWJkYTpJbnZva2VGdW5jdGlvbicsXG4gICAgICAgIEZ1bmN0aW9uTmFtZToge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0Z1bmN0aW9uNzY4NTY2NzcnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgUHJpbmNpcGFsOiAnMTIzNDU2Nzg5MDEyJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCBhbiBhcm4gcHJpbmNpcGFsJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnRnVuY3Rpb24nLCB7XG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ3h4eCcpLFxuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBhY2NvdW50ID0gbmV3IGlhbS5Bcm5QcmluY2lwYWwoJ2Fybjphd3M6aWFtOjoxMjM0NTY3ODkwMTI6cm9sZS9zb21lUm9sZScpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBmbi5ncmFudEludm9rZShhY2NvdW50KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpQZXJtaXNzaW9uJywge1xuICAgICAgICBBY3Rpb246ICdsYW1iZGE6SW52b2tlRnVuY3Rpb24nLFxuICAgICAgICBGdW5jdGlvbk5hbWU6IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdGdW5jdGlvbjc2ODU2Njc3JyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIFByaW5jaXBhbDogJ2Fybjphd3M6aWFtOjoxMjM0NTY3ODkwMTI6cm9sZS9zb21lUm9sZScsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggYW4gb3JnYW5pemF0aW9uIHByaW5jaXBhbCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0Z1bmN0aW9uJywge1xuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCd4eHgnKSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgb3JnID0gbmV3IGlhbS5Pcmdhbml6YXRpb25QcmluY2lwYWwoJ215LW9yZy1pZCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBmbi5ncmFudEludm9rZShvcmcpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlBlcm1pc3Npb24nLCB7XG4gICAgICAgIEFjdGlvbjogJ2xhbWJkYTpJbnZva2VGdW5jdGlvbicsXG4gICAgICAgIEZ1bmN0aW9uTmFtZToge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0Z1bmN0aW9uNzY4NTY2NzcnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgUHJpbmNpcGFsOiAnKicsXG4gICAgICAgIFByaW5jaXBhbE9yZ0lEOiAnbXktb3JnLWlkJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGJlIGNhbGxlZCB0d2ljZSBmb3IgdGhlIHNhbWUgc2VydmljZSBwcmluY2lwYWwnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBmbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGdW5jdGlvbicsIHtcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgneHh4JyksXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2VsYXN0aWNsb2FkYmFsYW5jaW5nLmFtYXpvbmF3cy5jb20nKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgZm4uZ3JhbnRJbnZva2Uoc2VydmljZSk7XG4gICAgICBmbi5ncmFudEludm9rZShzZXJ2aWNlKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpQZXJtaXNzaW9uJywge1xuICAgICAgICBBY3Rpb246ICdsYW1iZGE6SW52b2tlRnVuY3Rpb24nLFxuICAgICAgICBGdW5jdGlvbk5hbWU6IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdGdW5jdGlvbjc2ODU2Njc3JyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIFByaW5jaXBhbDogJ2VsYXN0aWNsb2FkYmFsYW5jaW5nLmFtYXpvbmF3cy5jb20nLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIGFuIGltcG9ydGVkIHJvbGUgKGluIHRoZSBzYW1lIGFjY291bnQpJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwge1xuICAgICAgICBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnRnVuY3Rpb24nLCB7XG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ3h4eCcpLFxuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGZuLmdyYW50SW52b2tlKGlhbS5Sb2xlLmZyb21Sb2xlQXJuKHN0YWNrLCAnRm9yZWlnblJvbGUnLCAnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL3NvbWVSb2xlJykpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnbGFtYmRhOkludm9rZUZ1bmN0aW9uJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogW1xuICAgICAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ0Z1bmN0aW9uNzY4NTY2NzcnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgICB7ICdGbjo6Sm9pbic6IFsnJywgW3sgJ0ZuOjpHZXRBdHQnOiBbJ0Z1bmN0aW9uNzY4NTY2NzcnLCAnQXJuJ10gfSwgJzoqJ11dIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIFJvbGVzOiBbJ3NvbWVSb2xlJ10sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggYW4gaW1wb3J0ZWQgcm9sZSAoZnJvbSBhIGRpZmZlcmVudCBhY2NvdW50KScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2sodW5kZWZpbmVkLCB1bmRlZmluZWQsIHtcbiAgICAgICAgZW52OiB7IGFjY291bnQ6ICczMzMzJyB9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCBmbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGdW5jdGlvbicsIHtcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgneHh4JyksXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgZm4uZ3JhbnRJbnZva2UoaWFtLlJvbGUuZnJvbVJvbGVBcm4oc3RhY2ssICdGb3JlaWduUm9sZScsICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvc29tZVJvbGUnKSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6UGVybWlzc2lvbicsIHtcbiAgICAgICAgQWN0aW9uOiAnbGFtYmRhOkludm9rZUZ1bmN0aW9uJyxcbiAgICAgICAgRnVuY3Rpb25OYW1lOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnRnVuY3Rpb243Njg1NjY3NycsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBQcmluY2lwYWw6ICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvc29tZVJvbGUnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdvbiBhbiBpbXBvcnRlZCBmdW5jdGlvbiAoc2FtZSBhY2NvdW50KScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2sodW5kZWZpbmVkLCB1bmRlZmluZWQsIHtcbiAgICAgICAgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGZuID0gbGFtYmRhLkZ1bmN0aW9uLmZyb21GdW5jdGlvbkFybihzdGFjaywgJ0Z1bmN0aW9uJywgJ2Fybjphd3M6bGFtYmRhOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6ZnVuY3Rpb246TXlGbicpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBmbi5ncmFudEludm9rZShuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2VsYXN0aWNsb2FkYmFsYW5jaW5nLmFtYXpvbmF3cy5jb20nKSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6UGVybWlzc2lvbicsIHtcbiAgICAgICAgQWN0aW9uOiAnbGFtYmRhOkludm9rZUZ1bmN0aW9uJyxcbiAgICAgICAgRnVuY3Rpb25OYW1lOiAnYXJuOmF3czpsYW1iZGE6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpmdW5jdGlvbjpNeUZuJyxcbiAgICAgICAgUHJpbmNpcGFsOiAnZWxhc3RpY2xvYWRiYWxhbmNpbmcuYW1hem9uYXdzLmNvbScsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ29uIGFuIGltcG9ydGVkIGZ1bmN0aW9uICh1bnJlc29sdmVkIGFjY291bnQpJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBmbiA9IGxhbWJkYS5GdW5jdGlvbi5mcm9tRnVuY3Rpb25Bcm4oc3RhY2ssICdGdW5jdGlvbicsICdhcm46YXdzOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOk15Rm4nKTtcblxuICAgICAgZXhwZWN0KFxuICAgICAgICAoKSA9PiBmbi5ncmFudEludm9rZShuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2VsYXN0aWNsb2FkYmFsYW5jaW5nLmFtYXpvbmF3cy5jb20nKSksXG4gICAgICApLnRvVGhyb3coL0Nhbm5vdCBtb2RpZnkgcGVybWlzc2lvbiB0byBsYW1iZGEgZnVuY3Rpb24vKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ29uIGFuIGltcG9ydGVkIGZ1bmN0aW9uICh1bnJlc29sdmVkIGFjY291bnQgJiB3LyBhbGxvd1Blcm1pc3Npb25zKScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGZuID0gbGFtYmRhLkZ1bmN0aW9uLmZyb21GdW5jdGlvbkF0dHJpYnV0ZXMoc3RhY2ssICdGdW5jdGlvbicsIHtcbiAgICAgICAgZnVuY3Rpb25Bcm46ICdhcm46YXdzOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOk15Rm4nLFxuICAgICAgICBzYW1lRW52aXJvbm1lbnQ6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgZm4uZ3JhbnRJbnZva2UobmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlbGFzdGljbG9hZGJhbGFuY2luZy5hbWF6b25hd3MuY29tJykpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlBlcm1pc3Npb24nLCB7XG4gICAgICAgIEFjdGlvbjogJ2xhbWJkYTpJbnZva2VGdW5jdGlvbicsXG4gICAgICAgIEZ1bmN0aW9uTmFtZTogJ2Fybjphd3M6bGFtYmRhOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6ZnVuY3Rpb246TXlGbicsXG4gICAgICAgIFByaW5jaXBhbDogJ2VsYXN0aWNsb2FkYmFsYW5jaW5nLmFtYXpvbmF3cy5jb20nLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdvbiBhbiBpbXBvcnRlZCBmdW5jdGlvbiAoZGlmZmVyZW50IGFjY291bnQpJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwge1xuICAgICAgICBlbnY6IHsgYWNjb3VudDogJzExMTExMTExMTExMScgfSwgLy8gRGlmZmVyZW50IGFjY291bnRcbiAgICAgIH0pO1xuICAgICAgY29uc3QgZm4gPSBsYW1iZGEuRnVuY3Rpb24uZnJvbUZ1bmN0aW9uQXJuKHN0YWNrLCAnRnVuY3Rpb24nLCAnYXJuOmF3czpsYW1iZGE6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpmdW5jdGlvbjpNeUZuJyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIGZuLmdyYW50SW52b2tlKG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZWxhc3RpY2xvYWRiYWxhbmNpbmcuYW1hem9uYXdzLmNvbScpKTtcbiAgICAgIH0pLnRvVGhyb3coL0Nhbm5vdCBtb2RpZnkgcGVybWlzc2lvbiB0byBsYW1iZGEgZnVuY3Rpb24vKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ29uIGFuIGltcG9ydGVkIGZ1bmN0aW9uIChkaWZmZXJlbnQgYWNjb3VudCAmIHcvIHNraXBQZXJtaXNzaW9ucycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2sodW5kZWZpbmVkLCB1bmRlZmluZWQsIHtcbiAgICAgICAgZW52OiB7IGFjY291bnQ6ICcxMTExMTExMTExMTEnIH0sIC8vIERpZmZlcmVudCBhY2NvdW50XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGZuID0gbGFtYmRhLkZ1bmN0aW9uLmZyb21GdW5jdGlvbkF0dHJpYnV0ZXMoc3RhY2ssICdGdW5jdGlvbicsIHtcbiAgICAgICAgZnVuY3Rpb25Bcm46ICdhcm46YXdzOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOk15Rm4nLFxuICAgICAgICBza2lwUGVybWlzc2lvbnM6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgZm4uZ3JhbnRJbnZva2UobmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlbGFzdGljbG9hZGJhbGFuY2luZy5hbWF6b25hd3MuY29tJykpO1xuICAgICAgfSkubm90LnRvVGhyb3coKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQ2FuIHVzZSBtZXRyaWNFcnJvcnMgb24gYSBsYW1iZGEgRnVuY3Rpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBmbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGdW5jdGlvbicsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ3h4eCcpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoZm4ubWV0cmljRXJyb3JzKCkpKS50b0VxdWFsKHtcbiAgICAgIGRpbWVuc2lvbnM6IHsgRnVuY3Rpb25OYW1lOiB7IFJlZjogJ0Z1bmN0aW9uNzY4NTY2NzcnIH0gfSxcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9MYW1iZGEnLFxuICAgICAgbWV0cmljTmFtZTogJ0Vycm9ycycsXG4gICAgICBwZXJpb2Q6IGNkay5EdXJhdGlvbi5taW51dGVzKDUpLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkRXZlbnRTb3VyY2UgY2FsbHMgYmluZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0Z1bmN0aW9uJywge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgneHh4JyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIGxldCBiaW5kVGFyZ2V0O1xuXG4gICAgY2xhc3MgRXZlbnRTb3VyY2VNb2NrIGltcGxlbWVudHMgbGFtYmRhLklFdmVudFNvdXJjZSB7XG4gICAgICBwdWJsaWMgYmluZCh0YXJnZXQ6IGxhbWJkYS5JRnVuY3Rpb24pIHtcbiAgICAgICAgYmluZFRhcmdldCA9IHRhcmdldDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXSEVOXG4gICAgZm4uYWRkRXZlbnRTb3VyY2UobmV3IEV2ZW50U291cmNlTW9jaygpKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoYmluZFRhcmdldCkudG9FcXVhbChmbik7XG4gIH0pO1xuXG4gIHRlc3QoJ2xheWVyIGlzIGJha2VkIGludG8gdGhlIGZ1bmN0aW9uIHZlcnNpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2sodW5kZWZpbmVkLCAnVGVzdFN0YWNrJyk7XG4gICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuICAgIGNvbnN0IGNvZGUgPSBuZXcgbGFtYmRhLlMzQ29kZShidWNrZXQsICdPYmplY3RLZXknKTtcblxuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ2ZuJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdleHBvcnRzLm1haW4gPSBmdW5jdGlvbigpIHsgY29uc29sZS5sb2coXCJET05FXCIpOyB9JyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXgubWFpbicsXG4gICAgfSk7XG5cbiAgICBjb25zdCBmbkhhc2ggPSBjYWxjdWxhdGVGdW5jdGlvbkhhc2goZm4pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGxheWVyID0gbmV3IGxhbWJkYS5MYXllclZlcnNpb24oc3RhY2ssICdMYXllclZlcnNpb24nLCB7XG4gICAgICBjb2RlLFxuICAgICAgY29tcGF0aWJsZVJ1bnRpbWVzOiBbbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1hdLFxuICAgIH0pO1xuXG4gICAgZm4uYWRkTGF5ZXJzKGxheWVyKTtcblxuICAgIGNvbnN0IG5ld0ZuSGFzaCA9IGNhbGN1bGF0ZUZ1bmN0aW9uSGFzaChmbik7XG5cbiAgICBleHBlY3QoZm5IYXNoKS5ub3QudG9FcXVhbChuZXdGbkhhc2gpO1xuICB9KTtcblxuICB0ZXN0KCd3aXRoIGZlYXR1cmUgZmxhZywgbGF5ZXIgdmVyc2lvbiBpcyBiYWtlZCBpbnRvIGZ1bmN0aW9uIHZlcnNpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCh7IGNvbnRleHQ6IHsgW2N4YXBpLkxBTUJEQV9SRUNPR05JWkVfTEFZRVJfVkVSU0lPTl06IHRydWUgfSB9KTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnVGVzdFN0YWNrJyk7XG4gICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuICAgIGNvbnN0IGNvZGUgPSBuZXcgbGFtYmRhLlMzQ29kZShidWNrZXQsICdPYmplY3RLZXknKTtcbiAgICBjb25zdCBsYXllciA9IG5ldyBsYW1iZGEuTGF5ZXJWZXJzaW9uKHN0YWNrLCAnTGF5ZXJWZXJzaW9uJywge1xuICAgICAgY29kZSxcbiAgICAgIGNvbXBhdGlibGVSdW50aW1lczogW2xhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YXSxcbiAgICB9KTtcblxuICAgIC8vIGZ1bmN0aW9uIHdpdGggbGF5ZXJcbiAgICBjb25zdCBmbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdmbicsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZXhwb3J0cy5tYWluID0gZnVuY3Rpb24oKSB7IGNvbnNvbGUubG9nKFwiRE9ORVwiKTsgfScpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4Lm1haW4nLFxuICAgICAgbGF5ZXJzOiBbbGF5ZXJdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZm5IYXNoID0gY2FsY3VsYXRlRnVuY3Rpb25IYXNoKGZuKTtcblxuICAgIC8vIHVzZSBlc2NhcGUgaGF0Y2ggdG8gY2hhbmdlIHRoZSBjb250ZW50IG9mIHRoZSBsYXllclxuICAgIC8vIHRoaXMgc2ltdWxhdGVzIHVwZGF0aW5nIHRoZSBsYXllciBjb2RlIHdoaWNoIGNoYW5nZXMgdGhlIHZlcnNpb24uXG4gICAgY29uc3QgY2ZuTGF5ZXIgPSBsYXllci5ub2RlLmRlZmF1bHRDaGlsZCBhcyBsYW1iZGEuQ2ZuTGF5ZXJWZXJzaW9uO1xuICAgIGNvbnN0IG5ld0NvZGUgPSAobmV3IGxhbWJkYS5TM0NvZGUoYnVja2V0LCAnTmV3T2JqZWN0S2V5JykpLmJpbmQobGF5ZXIpO1xuICAgIGNmbkxheWVyLmNvbnRlbnQgPSB7XG4gICAgICBzM0J1Y2tldDogbmV3Q29kZS5zM0xvY2F0aW9uIS5idWNrZXROYW1lLFxuICAgICAgczNLZXk6IG5ld0NvZGUuczNMb2NhdGlvbiEub2JqZWN0S2V5LFxuICAgICAgczNPYmplY3RWZXJzaW9uOiBuZXdDb2RlLnMzTG9jYXRpb24hLm9iamVjdFZlcnNpb24sXG4gICAgfTtcblxuICAgIGNvbnN0IG5ld0ZuSGFzaCA9IGNhbGN1bGF0ZUZ1bmN0aW9uSGFzaChmbik7XG5cbiAgICBleHBlY3QoZm5IYXNoKS5ub3QudG9FcXVhbChuZXdGbkhhc2gpO1xuICB9KTtcblxuICB0ZXN0KCd1c2luZyBhbiBpbmNvbXBhdGlibGUgbGF5ZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2sodW5kZWZpbmVkLCAnVGVzdFN0YWNrJyk7XG4gICAgY29uc3QgbGF5ZXIgPSBsYW1iZGEuTGF5ZXJWZXJzaW9uLmZyb21MYXllclZlcnNpb25BdHRyaWJ1dGVzKHN0YWNrLCAnVGVzdExheWVyJywge1xuICAgICAgbGF5ZXJWZXJzaW9uQXJuOiAnYXJuOmF3czouLi4nLFxuICAgICAgY29tcGF0aWJsZVJ1bnRpbWVzOiBbbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1hdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnRnVuY3Rpb24nLCB7XG4gICAgICBsYXllcnM6IFtsYXllcl0sXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTZfWCxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2V4cG9ydHMubWFpbiA9IGZ1bmN0aW9uKCkgeyBjb25zb2xlLmxvZyhcIkRPTkVcIik7IH0nKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5tYWluJyxcbiAgICB9KSkudG9UaHJvdygvbm9kZWpzMTYueCBpcyBub3QgaW4gXFxbbm9kZWpzMTQueFxcXS8pO1xuICB9KTtcblxuICB0ZXN0KCd1c2luZyBtb3JlIHRoYW4gNSBsYXllcnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2sodW5kZWZpbmVkLCAnVGVzdFN0YWNrJyk7XG4gICAgY29uc3QgbGF5ZXJzID0gbmV3IEFycmF5KDYpLmZpbGwobGFtYmRhLkxheWVyVmVyc2lvbi5mcm9tTGF5ZXJWZXJzaW9uQXR0cmlidXRlcyhzdGFjaywgJ1Rlc3RMYXllcicsIHtcbiAgICAgIGxheWVyVmVyc2lvbkFybjogJ2Fybjphd3M6Li4uJyxcbiAgICAgIGNvbXBhdGlibGVSdW50aW1lczogW2xhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YXSxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGdW5jdGlvbicsIHtcbiAgICAgIGxheWVycyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZXhwb3J0cy5tYWluID0gZnVuY3Rpb24oKSB7IGNvbnNvbGUubG9nKFwiRE9ORVwiKTsgfScpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4Lm1haW4nLFxuICAgIH0pKS50b1Rocm93KC9VbmFibGUgdG8gYWRkIGxheWVyOi8pO1xuICB9KTtcblxuICB0ZXN0KCdlbnZpcm9ubWVudCB2YXJpYWJsZXMgd29yayBpbiBDaGluYScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwgeyBlbnY6IHsgcmVnaW9uOiAnY24tbm9ydGgtMScgfSB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2ZvbycpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgU09NRTogJ1ZhcmlhYmxlJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgIEVudmlyb25tZW50OiB7XG4gICAgICAgIFZhcmlhYmxlczoge1xuICAgICAgICAgIFNPTUU6ICdWYXJpYWJsZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlbnZpcm9ubWVudCB2YXJpYWJsZXMgd29yayBpbiBhbiB1bnNwZWNpZmllZCByZWdpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2ZvbycpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgU09NRTogJ1ZhcmlhYmxlJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgIEVudmlyb25tZW50OiB7XG4gICAgICAgIFZhcmlhYmxlczoge1xuICAgICAgICAgIFNPTUU6ICdWYXJpYWJsZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzdXBwb3J0IHJlc2VydmVkIGNvbmN1cnJlbnQgZXhlY3V0aW9ucycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnZm9vJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlMsXG4gICAgICByZXNlcnZlZENvbmN1cnJlbnRFeGVjdXRpb25zOiAxMCxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICBSZXNlcnZlZENvbmN1cnJlbnRFeGVjdXRpb25zOiAxMCxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaXRzIHBvc3NpYmxlIHRvIHNwZWNpZnkgZXZlbnQgc291cmNlcyB1cG9uIGNyZWF0aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBsZXQgYmluZENvdW50ID0gMDtcblxuICAgIGNsYXNzIEV2ZW50U291cmNlIGltcGxlbWVudHMgbGFtYmRhLklFdmVudFNvdXJjZSB7XG4gICAgICBwdWJsaWMgYmluZChfZm46IGxhbWJkYS5JRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgYmluZENvdW50Kys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdmbicsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2Jvb20nKSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmJhbScsXG4gICAgICBldmVudHM6IFtcbiAgICAgICAgbmV3IEV2ZW50U291cmNlKCksXG4gICAgICAgIG5ldyBFdmVudFNvdXJjZSgpLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoYmluZENvdW50KS50b0VxdWFsKDIpO1xuICB9KTtcblxuICB0ZXN0KCdQcm92aWRlZCBSdW50aW1lIHJldHVybnMgdGhlIHJpZ2h0IHZhbHVlcycsICgpID0+IHtcbiAgICBjb25zdCBydCA9IGxhbWJkYS5SdW50aW1lLlBST1ZJREVEO1xuXG4gICAgZXhwZWN0KHJ0Lm5hbWUpLnRvRXF1YWwoJ3Byb3ZpZGVkJyk7XG4gICAgZXhwZWN0KHJ0LnN1cHBvcnRzSW5saW5lQ29kZSkudG9FcXVhbChmYWxzZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NwZWNpZnkgbG9nIHJldGVudGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnZm9vJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlMsXG4gICAgICBsb2dSZXRlbnRpb246IGxvZ3MuUmV0ZW50aW9uRGF5cy5PTkVfTU9OVEgsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6TG9nUmV0ZW50aW9uJywge1xuICAgICAgTG9nR3JvdXBOYW1lOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnL2F3cy9sYW1iZGEvJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnTXlMYW1iZGFDQ0U4MDJGQicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgUmV0ZW50aW9uSW5EYXlzOiAzMCxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaW1wb3J0ZWQgbGFtYmRhIHdpdGggaW1wb3J0ZWQgc2VjdXJpdHkgZ3JvdXAgYW5kIGFsbG93QWxsT3V0Ym91bmQgc2V0IHRvIGZhbHNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBmbiA9IGxhbWJkYS5GdW5jdGlvbi5mcm9tRnVuY3Rpb25BdHRyaWJ1dGVzKHN0YWNrLCAnZm4nLCB7XG4gICAgICBmdW5jdGlvbkFybjogJ2Fybjphd3M6bGFtYmRhOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6ZnVuY3Rpb246bXktZnVuY3Rpb24nLFxuICAgICAgc2VjdXJpdHlHcm91cDogZWMyLlNlY3VyaXR5R3JvdXAuZnJvbVNlY3VyaXR5R3JvdXBJZChzdGFjaywgJ1NHJywgJ3NnLTEyMzQ1Njc4OScsIHtcbiAgICAgICAgYWxsb3dBbGxPdXRib3VuZDogZmFsc2UsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBmbi5jb25uZWN0aW9ucy5hbGxvd1RvQW55SXB2NChlYzIuUG9ydC50Y3AoNDQzKSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwRWdyZXNzJywge1xuICAgICAgR3JvdXBJZDogJ3NnLTEyMzQ1Njc4OScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGggZXZlbnQgaW52b2tlIGNvbmZpZycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdmbicsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnZm9vJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIG9uRmFpbHVyZToge1xuICAgICAgICBiaW5kOiAoKSA9PiAoeyBkZXN0aW5hdGlvbjogJ29uLWZhaWx1cmUtYXJuJyB9KSxcbiAgICAgIH0sXG4gICAgICBvblN1Y2Nlc3M6IHtcbiAgICAgICAgYmluZDogKCkgPT4gKHsgZGVzdGluYXRpb246ICdvbi1zdWNjZXNzLWFybicgfSksXG4gICAgICB9LFxuICAgICAgbWF4RXZlbnRBZ2U6IGNkay5EdXJhdGlvbi5ob3VycygxKSxcbiAgICAgIHJldHJ5QXR0ZW1wdHM6IDAsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpFdmVudEludm9rZUNvbmZpZycsIHtcbiAgICAgIEZ1bmN0aW9uTmFtZToge1xuICAgICAgICBSZWY6ICdmbjVGRjYxNkUzJyxcbiAgICAgIH0sXG4gICAgICBRdWFsaWZpZXI6ICckTEFURVNUJyxcbiAgICAgIERlc3RpbmF0aW9uQ29uZmlnOiB7XG4gICAgICAgIE9uRmFpbHVyZToge1xuICAgICAgICAgIERlc3RpbmF0aW9uOiAnb24tZmFpbHVyZS1hcm4nLFxuICAgICAgICB9LFxuICAgICAgICBPblN1Y2Nlc3M6IHtcbiAgICAgICAgICBEZXN0aW5hdGlvbjogJ29uLXN1Y2Nlc3MtYXJuJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBNYXhpbXVtRXZlbnRBZ2VJblNlY29uZHM6IDM2MDAsXG4gICAgICBNYXhpbXVtUmV0cnlBdHRlbXB0czogMCxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIHdoZW4gY2FsbGluZyBjb25maWd1cmVBc3luY0ludm9rZSBvbiBhbHJlYWR5IGNvbmZpZ3VyZWQgZnVuY3Rpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBmbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdmbicsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnZm9vJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIG1heEV2ZW50QWdlOiBjZGsuRHVyYXRpb24uaG91cnMoMSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGZuLmNvbmZpZ3VyZUFzeW5jSW52b2tlKHsgcmV0cnlBdHRlbXB0czogMCB9KSkudG9UaHJvdygvQW4gRXZlbnRJbnZva2VDb25maWcgaGFzIGFscmVhZHkgYmVlbiBjb25maWd1cmVkLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2V2ZW50IGludm9rZSBjb25maWcgb24gaW1wb3J0ZWQgbGFtYmRhJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgZm4gPSBsYW1iZGEuRnVuY3Rpb24uZnJvbUZ1bmN0aW9uQXR0cmlidXRlcyhzdGFjaywgJ2ZuJywge1xuICAgICAgZnVuY3Rpb25Bcm46ICdhcm46YXdzOmxhbWJkYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZ1bmN0aW9uOm15LWZ1bmN0aW9uJyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBmbi5jb25maWd1cmVBc3luY0ludm9rZSh7XG4gICAgICByZXRyeUF0dGVtcHRzOiAxLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RXZlbnRJbnZva2VDb25maWcnLCB7XG4gICAgICBGdW5jdGlvbk5hbWU6ICdteS1mdW5jdGlvbicsXG4gICAgICBRdWFsaWZpZXI6ICckTEFURVNUJyxcbiAgICAgIE1heGltdW1SZXRyeUF0dGVtcHRzOiAxLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnYWRkIGEgdmVyc2lvbiB3aXRoIGV2ZW50IGludm9rZSBjb25maWcnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBmbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdmbicsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnZm9vJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBmbi5hZGRWZXJzaW9uKCcxJywgJ3NoYTI1NicsICdkZXNjJywgdW5kZWZpbmVkLCB7XG4gICAgICByZXRyeUF0dGVtcHRzOiAwLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RXZlbnRJbnZva2VDb25maWcnLCB7XG4gICAgICBGdW5jdGlvbk5hbWU6IHtcbiAgICAgICAgUmVmOiAnZm41RkY2MTZFMycsXG4gICAgICB9LFxuICAgICAgUXVhbGlmaWVyOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdmblZlcnNpb24xOTdGQTgxM0YnLFxuICAgICAgICAgICdWZXJzaW9uJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBNYXhpbXVtUmV0cnlBdHRlbXB0czogMCxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2hlY2sgZWRnZSBjb21wYXRpYmlsaXR5IHdpdGggZW52IHZhcnMgdGhhdCBjYW4gYmUgcmVtb3ZlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ2ZuJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdmb28nKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIH0pO1xuICAgIGZuLmFkZEVudmlyb25tZW50KCdLRVknLCAndmFsdWUnLCB7IHJlbW92ZUluRWRnZTogdHJ1ZSB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBmbi5fY2hlY2tFZGdlQ29tcGF0aWJpbGl0eSgpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICBFbnZpcm9ubWVudDogTWF0Y2guYWJzZW50KCksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NoZWNrIGVkZ2UgY29tcGF0aWJpbGl0eSB3aXRoIGVudiB2YXJzIHRoYXQgY2Fubm90IGJlIHJlbW92ZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBmbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdmbicsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnZm9vJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIEtFWTogJ3ZhbHVlJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgZm4uYWRkRW52aXJvbm1lbnQoJ09USEVSX0tFWScsICdvdGhlcl92YWx1ZScsIHsgcmVtb3ZlSW5FZGdlOiB0cnVlIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBmbi5fY2hlY2tFZGdlQ29tcGF0aWJpbGl0eSgpKS50b1Rocm93KC9UaGUgZnVuY3Rpb24gRGVmYXVsdFxcL2ZuIGNvbnRhaW5zIGVudmlyb25tZW50IHZhcmlhYmxlcyBcXFtLRVlcXF0gYW5kIGlzIG5vdCBjb21wYXRpYmxlIHdpdGggTGFtYmRhQEVkZ2UvKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkIGluY29tcGF0aWJsZSBsYXllcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsICdUZXN0U3RhY2snKTtcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jyk7XG4gICAgY29uc3QgY29kZSA9IG5ldyBsYW1iZGEuUzNDb2RlKGJ1Y2tldCwgJ09iamVjdEtleScpO1xuXG4gICAgY29uc3QgZnVuYyA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdteUZ1bmMnLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM183LFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgY29kZSxcbiAgICB9KTtcbiAgICBjb25zdCBsYXllciA9IG5ldyBsYW1iZGEuTGF5ZXJWZXJzaW9uKHN0YWNrLCAnbXlMYXllcicsIHtcbiAgICAgIGNvZGUsXG4gICAgICBjb21wYXRpYmxlUnVudGltZXM6IFtsYW1iZGEuUnVudGltZS5OT0RFSlNdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBmdW5jLmFkZExheWVycyhsYXllcikpLnRvVGhyb3coXG4gICAgICAvVGhpcyBsYW1iZGEgZnVuY3Rpb24gdXNlcyBhIHJ1bnRpbWUgdGhhdCBpcyBpbmNvbXBhdGlibGUgd2l0aCB0aGlzIGxheWVyLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCBjb21wYXRpYmxlIGxheWVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKTtcbiAgICBjb25zdCBjb2RlID0gbmV3IGxhbWJkYS5TM0NvZGUoYnVja2V0LCAnT2JqZWN0S2V5Jyk7XG5cbiAgICBjb25zdCBmdW5jID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ215RnVuYycsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzcsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlLFxuICAgIH0pO1xuICAgIGNvbnN0IGxheWVyID0gbmV3IGxhbWJkYS5MYXllclZlcnNpb24oc3RhY2ssICdteUxheWVyJywge1xuICAgICAgY29kZSxcbiAgICAgIGNvbXBhdGlibGVSdW50aW1lczogW2xhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzddLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIC8vIHNob3VsZCBub3QgdGhyb3dcbiAgICBleHBlY3QoKCkgPT4gZnVuYy5hZGRMYXllcnMobGF5ZXIpKS5ub3QudG9UaHJvdygpO1xuICB9KTtcblxuICB0ZXN0KCdhZGQgY29tcGF0aWJsZSBsYXllciBmb3IgZGVlcCBjbG9uZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsICdUZXN0U3RhY2snKTtcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jyk7XG4gICAgY29uc3QgY29kZSA9IG5ldyBsYW1iZGEuUzNDb2RlKGJ1Y2tldCwgJ09iamVjdEtleScpO1xuXG4gICAgY29uc3QgcnVudGltZSA9IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzc7XG4gICAgY29uc3QgZnVuYyA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdteUZ1bmMnLCB7XG4gICAgICBydW50aW1lLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgY29kZSxcbiAgICB9KTtcbiAgICBjb25zdCBjbG9uZSA9IF8uY2xvbmVEZWVwKHJ1bnRpbWUpO1xuICAgIGNvbnN0IGxheWVyID0gbmV3IGxhbWJkYS5MYXllclZlcnNpb24oc3RhY2ssICdteUxheWVyJywge1xuICAgICAgY29kZSxcbiAgICAgIGNvbXBhdGlibGVSdW50aW1lczogW2Nsb25lXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICAvLyBzaG91bGQgbm90IHRocm93XG4gICAgZXhwZWN0KCgpID0+IGZ1bmMuYWRkTGF5ZXJzKGxheWVyKSkubm90LnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgdGVzdCgnZW1wdHkgaW5saW5lIGNvZGUgaXMgbm90IGFsbG93ZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU4vVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnZm4nLCB7XG4gICAgICBoYW5kbGVyOiAnZm9vJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnJyksXG4gICAgfSkpLnRvVGhyb3coL0xhbWJkYSBpbmxpbmUgY29kZSBjYW5ub3QgYmUgZW1wdHkvKTtcbiAgfSk7XG5cbiAgdGVzdCgnbG9nR3JvdXAgaXMgY29ycmVjdGx5IHJldHVybmVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ2ZuJywge1xuICAgICAgaGFuZGxlcjogJ2ZvbycsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgIH0pO1xuICAgIGNvbnN0IGxvZ0dyb3VwID0gZm4ubG9nR3JvdXA7XG4gICAgZXhwZWN0KGxvZ0dyb3VwLmxvZ0dyb3VwTmFtZSkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QobG9nR3JvdXAubG9nR3JvdXBBcm4pLnRvQmVEZWZpbmVkKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RscSBpcyByZXR1cm5lZCB3aGVuIHByb3ZpZGVkIGJ5IHVzZXIgYW5kIGlzIFF1ZXVlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgZGxRdWV1ZSA9IG5ldyBzcXMuUXVldWUoc3RhY2ssICdEZWFkTGV0dGVyUXVldWUnLCB7XG4gICAgICBxdWV1ZU5hbWU6ICdNeUxhbWJkYV9ETFEnLFxuICAgICAgcmV0ZW50aW9uUGVyaW9kOiBjZGsuRHVyYXRpb24uZGF5cygxNCksXG4gICAgfSk7XG5cbiAgICBjb25zdCBmbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdmbicsIHtcbiAgICAgIGhhbmRsZXI6ICdmb28nLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdmb28nKSxcbiAgICAgIGRlYWRMZXR0ZXJRdWV1ZTogZGxRdWV1ZSxcbiAgICB9KTtcbiAgICBjb25zdCBkZWFkTGV0dGVyUXVldWUgPSBmbi5kZWFkTGV0dGVyUXVldWU7XG4gICAgY29uc3QgZGVhZExldHRlclRvcGljID0gZm4uZGVhZExldHRlclRvcGljO1xuXG4gICAgZXhwZWN0KGRlYWRMZXR0ZXJUb3BpYykudG9CZVVuZGVmaW5lZCgpO1xuXG4gICAgZXhwZWN0KGRlYWRMZXR0ZXJRdWV1ZSkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QoZGVhZExldHRlclF1ZXVlKS50b0JlSW5zdGFuY2VPZihzcXMuUXVldWUpO1xuICB9KTtcblxuICB0ZXN0KCdkbHEgaXMgcmV0dXJuZWQgd2hlbiBwcm92aWRlZCBieSB1c2VyIGFuZCBpcyBUb3BpYycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGRsVG9waWMgPSBuZXcgc25zLlRvcGljKHN0YWNrLCAnRGVhZExldHRlclF1ZXVlJywge1xuICAgICAgdG9waWNOYW1lOiAnTXlMYW1iZGFfRExRJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ2ZuJywge1xuICAgICAgaGFuZGxlcjogJ2ZvbycsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgZGVhZExldHRlclRvcGljOiBkbFRvcGljLFxuICAgIH0pO1xuICAgIGNvbnN0IGRlYWRMZXR0ZXJRdWV1ZSA9IGZuLmRlYWRMZXR0ZXJRdWV1ZTtcbiAgICBjb25zdCBkZWFkTGV0dGVyVG9waWMgPSBmbi5kZWFkTGV0dGVyVG9waWM7XG5cbiAgICBleHBlY3QoZGVhZExldHRlclF1ZXVlKS50b0JlVW5kZWZpbmVkKCk7XG5cbiAgICBleHBlY3QoZGVhZExldHRlclRvcGljKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChkZWFkTGV0dGVyVG9waWMpLnRvQmVJbnN0YW5jZU9mKHNucy5Ub3BpYyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RscSBpcyByZXR1cm5lZCB3aGVuIHNldHVwIGJ5IGNkayBhbmQgaXMgUXVldWUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnZm4nLCB7XG4gICAgICBoYW5kbGVyOiAnZm9vJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICBkZWFkTGV0dGVyUXVldWVFbmFibGVkOiB0cnVlLFxuICAgIH0pO1xuICAgIGNvbnN0IGRlYWRMZXR0ZXJRdWV1ZSA9IGZuLmRlYWRMZXR0ZXJRdWV1ZTtcbiAgICBjb25zdCBkZWFkTGV0dGVyVG9waWMgPSBmbi5kZWFkTGV0dGVyVG9waWM7XG5cbiAgICBleHBlY3QoZGVhZExldHRlclRvcGljKS50b0JlVW5kZWZpbmVkKCk7XG5cbiAgICBleHBlY3QoZGVhZExldHRlclF1ZXVlKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChkZWFkTGV0dGVyUXVldWUpLnRvQmVJbnN0YW5jZU9mKHNxcy5RdWV1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RscSBpcyB1bmRlZmluZWQgd2hlbiBub3Qgc2V0dXAnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnZm4nLCB7XG4gICAgICBoYW5kbGVyOiAnZm9vJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgfSk7XG4gICAgY29uc3QgZGVhZExldHRlclF1ZXVlID0gZm4uZGVhZExldHRlclF1ZXVlO1xuICAgIGNvbnN0IGRlYWRMZXR0ZXJUb3BpYyA9IGZuLmRlYWRMZXR0ZXJUb3BpYztcblxuICAgIGV4cGVjdChkZWFkTGV0dGVyUXVldWUpLnRvQmVVbmRlZmluZWQoKTtcbiAgICBleHBlY3QoZGVhZExldHRlclRvcGljKS50b0JlVW5kZWZpbmVkKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ29uZSBhbmQgb25seSBvbmUgY2hpbGQgTG9nUmV0ZW50aW9uIGNvbnN0cnVjdCB3aWxsIGJlIGNyZWF0ZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnZm4nLCB7XG4gICAgICBoYW5kbGVyOiAnZm9vJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICBsb2dSZXRlbnRpb246IGxvZ3MuUmV0ZW50aW9uRGF5cy5GSVZFX0RBWVMsXG4gICAgfSk7XG5cbiAgICAvLyBDYWxsIGxvZ0dyb3VwIGEgZmV3IHRpbWVzLiBJZiBtb3JlIHRoYW4gb25lIGluc3RhbmNlIG9mIExvZ1JldGVudGlvbiB3YXMgY3JlYXRlZCxcbiAgICAvLyB0aGUgc2Vjb25kIGNhbGwgd2lsbCBmYWlsIG9uIGR1cGxpY2F0ZSBjb25zdHJ1Y3RzLlxuICAgIGZuLmxvZ0dyb3VwO1xuICAgIGZuLmxvZ0dyb3VwO1xuICAgIGZuLmxvZ0dyb3VwO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyB3aGVuIGlubGluZSBjb2RlIGlzIHNwZWNpZmllZCBvbiBhbiBpbmNvbXBhdGlibGUgcnVudGltZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBleHBlY3QoKCkgPT4gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ2ZuJywge1xuICAgICAgaGFuZGxlcjogJ2ZvbycsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QUk9WSURFRCxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgIH0pKS50b1Rocm93KC9JbmxpbmUgc291cmNlIG5vdCBhbGxvd2VkIGZvci8pO1xuICB9KTtcblxuICB0ZXN0KCdtdWx0aXBsZSBjYWxscyB0byBsYXRlc3RWZXJzaW9uIHJldHVybnMgdGhlIHNhbWUgdmVyc2lvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdoZWxsbygpJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGVsbG8nLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG5cbiAgICBjb25zdCB2ZXJzaW9uMSA9IGZuLmxhdGVzdFZlcnNpb247XG4gICAgY29uc3QgdmVyc2lvbjIgPSBmbi5sYXRlc3RWZXJzaW9uO1xuXG4gICAgY29uc3QgZXhwZWN0ZWRBcm4gPSB7XG4gICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnTXlMYW1iZGFDQ0U4MDJGQicsICdBcm4nXSB9LFxuICAgICAgICAnOiRMQVRFU1QnLFxuICAgICAgXV0sXG4gICAgfTtcbiAgICBleHBlY3QodmVyc2lvbjEpLnRvRXF1YWwodmVyc2lvbjIpO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHZlcnNpb24xLmZ1bmN0aW9uQXJuKSkudG9FcXVhbChleHBlY3RlZEFybik7XG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUodmVyc2lvbjIuZnVuY3Rpb25Bcm4pKS50b0VxdWFsKGV4cGVjdGVkQXJuKTtcbiAgfSk7XG5cbiAgdGVzdCgnZGVmYXVsdCBmdW5jdGlvbiB3aXRoIGttc0tleUFybiwgZW52aXJvbm1lbnRFbmNyeXB0aW9uIHBhc3NlZCBhcyBwcm9wcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGtleToga21zLklLZXkgPSBuZXcga21zLktleShzdGFjaywgJ0VudlZhckVuY3J5cHRLZXknLCB7XG4gICAgICBkZXNjcmlwdGlvbjogJ3NhbXBsZSBrZXknLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnZm9vJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFNPTUU6ICdWYXJpYWJsZScsXG4gICAgICB9LFxuICAgICAgZW52aXJvbm1lbnRFbmNyeXB0aW9uOiBrZXksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgIEVudmlyb25tZW50OiB7XG4gICAgICAgIFZhcmlhYmxlczoge1xuICAgICAgICAgIFNPTUU6ICdWYXJpYWJsZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgS21zS2V5QXJuOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdFbnZWYXJFbmNyeXB0S2V5MUE3Q0FCREInLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3Byb2ZpbGluZyBncm91cCcsICgpID0+IHtcbiAgICB0ZXN0KCdkZWZhdWx0IGZ1bmN0aW9uIHdpdGggQ0RLIGNyZWF0ZWQgUHJvZmlsaW5nIEdyb3VwJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdmb28nKSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM185LFxuICAgICAgICBwcm9maWxpbmc6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUd1cnVQcm9maWxlcjo6UHJvZmlsaW5nR3JvdXAnLCB7XG4gICAgICAgIFByb2ZpbGluZ0dyb3VwTmFtZTogJ015TGFtYmRhUHJvZmlsaW5nR3JvdXBDNUI2Q0NEOCcsXG4gICAgICAgIENvbXB1dGVQbGF0Zm9ybTogJ0FXU0xhbWJkYScsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdjb2RlZ3VydS1wcm9maWxlcjpDb25maWd1cmVBZ2VudCcsXG4gICAgICAgICAgICAgICAgJ2NvZGVndXJ1LXByb2ZpbGVyOlBvc3RBZ2VudFByb2ZpbGUnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ015TGFtYmRhUHJvZmlsaW5nR3JvdXBFQzZERTMyRicsICdBcm4nXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG4gICAgICAgIFBvbGljeU5hbWU6ICdNeUxhbWJkYVNlcnZpY2VSb2xlRGVmYXVsdFBvbGljeTVCQkM2RjY4JyxcbiAgICAgICAgUm9sZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdNeUxhbWJkYVNlcnZpY2VSb2xlNDUzOUVDQjYnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgICAgRW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBWYXJpYWJsZXM6IHtcbiAgICAgICAgICAgIEFXU19DT0RFR1VSVV9QUk9GSUxFUl9HUk9VUF9BUk46IHsgJ0ZuOjpHZXRBdHQnOiBbJ015TGFtYmRhUHJvZmlsaW5nR3JvdXBFQzZERTMyRicsICdBcm4nXSB9LFxuICAgICAgICAgICAgQVdTX0NPREVHVVJVX1BST0ZJTEVSX0VOQUJMRUQ6ICdUUlVFJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdkZWZhdWx0IGZ1bmN0aW9uIHdpdGggY2xpZW50IHByb3ZpZGVkIFByb2ZpbGluZyBHcm91cCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnZm9vJyksXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOSxcbiAgICAgICAgcHJvZmlsaW5nR3JvdXA6IG5ldyBQcm9maWxpbmdHcm91cChzdGFjaywgJ1Byb2ZpbGluZ0dyb3VwJyksXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdjb2RlZ3VydS1wcm9maWxlcjpDb25maWd1cmVBZ2VudCcsXG4gICAgICAgICAgICAgICAgJ2NvZGVndXJ1LXByb2ZpbGVyOlBvc3RBZ2VudFByb2ZpbGUnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ1Byb2ZpbGluZ0dyb3VwMjY5NzlGRDcnLCAnQXJuJ10sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgICBQb2xpY3lOYW1lOiAnTXlMYW1iZGFTZXJ2aWNlUm9sZURlZmF1bHRQb2xpY3k1QkJDNkY2OCcsXG4gICAgICAgIFJvbGVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnTXlMYW1iZGFTZXJ2aWNlUm9sZTQ1MzlFQ0I2JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICAgIEVudmlyb25tZW50OiB7XG4gICAgICAgICAgVmFyaWFibGVzOiB7XG4gICAgICAgICAgICBBV1NfQ09ERUdVUlVfUFJPRklMRVJfR1JPVVBfQVJOOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6Y29kZWd1cnUtcHJvZmlsZXI6JywgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgICAgICc6JywgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSwgJzpwcm9maWxpbmdHcm91cC8nLCB7IFJlZjogJ1Byb2ZpbGluZ0dyb3VwMjY5NzlGRDcnIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBBV1NfQ09ERUdVUlVfUFJPRklMRVJfRU5BQkxFRDogJ1RSVUUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2RlZmF1bHQgZnVuY3Rpb24gd2l0aCBjbGllbnQgcHJvdmlkZWQgUHJvZmlsaW5nIEdyb3VwIGJ1dCBwcm9maWxpbmcgc2V0IHRvIGZhbHNlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdmb28nKSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM185LFxuICAgICAgICBwcm9maWxpbmc6IGZhbHNlLFxuICAgICAgICBwcm9maWxpbmdHcm91cDogbmV3IFByb2ZpbGluZ0dyb3VwKHN0YWNrLCAnUHJvZmlsaW5nR3JvdXAnKSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlBvbGljeScsIDApO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywgTWF0Y2gubm90KHtcbiAgICAgICAgRW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBWYXJpYWJsZXM6IHtcbiAgICAgICAgICAgIEFXU19DT0RFR1VSVV9QUk9GSUxFUl9HUk9VUF9BUk46IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzpjb2RlZ3VydS1wcm9maWxlcjonLCB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgICAgICAgJzonLCB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnOnByb2ZpbGluZ0dyb3VwLycsIHsgUmVmOiAnUHJvZmlsaW5nR3JvdXAyNjk3OUZENycgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEFXU19DT0RFR1VSVV9QUk9GSUxFUl9FTkFCTEVEOiAnVFJVRScsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2RlZmF1bHQgZnVuY3Rpb24gd2l0aCBwcm9maWxpbmcgZW5hYmxlZCBhbmQgY2xpZW50IHByb3ZpZGVkIGVudiB2YXJzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnZm9vJyksXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOSxcbiAgICAgICAgcHJvZmlsaW5nOiB0cnVlLFxuICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgIEFXU19DT0RFR1VSVV9QUk9GSUxFUl9HUk9VUF9BUk46ICdwcm9maWxlcl9ncm91cF9hcm4nLFxuICAgICAgICAgIEFXU19DT0RFR1VSVV9QUk9GSUxFUl9FTkFCTEVEOiAneWVzJyxcbiAgICAgICAgfSxcbiAgICAgIH0pKS50b1Rocm93KC9BV1NfQ09ERUdVUlVfUFJPRklMRVJfR1JPVVBfQVJOIGFuZCBBV1NfQ09ERUdVUlVfUFJPRklMRVJfRU5BQkxFRCBtdXN0IG5vdCBiZSBzZXQgd2hlbiBwcm9maWxpbmcgb3B0aW9ucyBlbmFibGVkLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdkZWZhdWx0IGZ1bmN0aW9uIHdpdGggY2xpZW50IHByb3ZpZGVkIFByb2ZpbGluZyBHcm91cCBhbmQgY2xpZW50IHByb3ZpZGVkIGVudiB2YXJzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnZm9vJyksXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOSxcbiAgICAgICAgcHJvZmlsaW5nR3JvdXA6IG5ldyBQcm9maWxpbmdHcm91cChzdGFjaywgJ1Byb2ZpbGluZ0dyb3VwJyksXG4gICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgQVdTX0NPREVHVVJVX1BST0ZJTEVSX0dST1VQX0FSTjogJ3Byb2ZpbGVyX2dyb3VwX2FybicsXG4gICAgICAgICAgQVdTX0NPREVHVVJVX1BST0ZJTEVSX0VOQUJMRUQ6ICd5ZXMnLFxuICAgICAgICB9LFxuICAgICAgfSkpLnRvVGhyb3coL0FXU19DT0RFR1VSVV9QUk9GSUxFUl9HUk9VUF9BUk4gYW5kIEFXU19DT0RFR1VSVV9QUk9GSUxFUl9FTkFCTEVEIG11c3Qgbm90IGJlIHNldCB3aGVuIHByb2ZpbGluZyBvcHRpb25zIGVuYWJsZWQvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBhbiBlcnJvciB3aGVuIHVzZWQgd2l0aCBhbiB1bnN1cHBvcnRlZCBydW50aW1lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBleHBlY3QoKCkgPT4gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2ZvbycpLFxuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICBwcm9maWxpbmdHcm91cDogbmV3IFByb2ZpbGluZ0dyb3VwKHN0YWNrLCAnUHJvZmlsaW5nR3JvdXAnKSxcbiAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBBV1NfQ09ERUdVUlVfUFJPRklMRVJfR1JPVVBfQVJOOiAncHJvZmlsZXJfZ3JvdXBfYXJuJyxcbiAgICAgICAgICBBV1NfQ09ERUdVUlVfUFJPRklMRVJfRU5BQkxFRDogJ3llcycsXG4gICAgICAgIH0sXG4gICAgICB9KSkudG9UaHJvdygvbm90IHN1cHBvcnRlZCBieSBydW50aW1lLyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdsYW1iZGEuRnVuY3Rpb24gdGltZW91dCcsICgpID0+IHtcbiAgICB0ZXN0KCdzaG91bGQgYmUgYSBjZGsuRHVyYXRpb24gd2hlbiBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCB7IHRpbWVvdXQgfSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUZ1bmN0aW9uJywge1xuICAgICAgICBoYW5kbGVyOiAnZm9vJyxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnaGFuZGxlci56aXAnKSksXG4gICAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5taW51dGVzKDIpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCh0aW1lb3V0KS50b0VxdWFsKGNkay5EdXJhdGlvbi5taW51dGVzKDIpKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Nob3VsZCBiZSBvcHRpb25hbCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgeyB0aW1lb3V0IH0gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlGdW5jdGlvbicsIHtcbiAgICAgICAgaGFuZGxlcjogJ2ZvbycsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2hhbmRsZXIuemlwJykpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCh0aW1lb3V0KS5ub3QudG9CZURlZmluZWQoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2N1cnJlbnRWZXJzaW9uJywgKCkgPT4ge1xuICAgIC8vIHNlZSB0ZXN0LmZ1bmN0aW9uLWhhc2gudHMgZm9yIG1vcmUgY292ZXJhZ2UgZm9yIHRoaXNcbiAgICB0ZXN0KCdsb2dpY2FsIGlkIG9mIHZlcnNpb24gaXMgYmFzZWQgb24gdGhlIGZ1bmN0aW9uIGhhc2gnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sxID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgZm4xID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjazEsICdNeUZ1bmN0aW9uJywge1xuICAgICAgICBoYW5kbGVyOiAnZm9vJyxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnaGFuZGxlci56aXAnKSksXG4gICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgRk9POiAnYmFyJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc3RhY2syID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgZm4yID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjazIsICdNeUZ1bmN0aW9uJywge1xuICAgICAgICBoYW5kbGVyOiAnZm9vJyxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnaGFuZGxlci56aXAnKSksXG4gICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgRk9POiAnYmVhcicsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2sxLCAnQ3VycmVudFZlcnNpb25Bcm4nLCB7XG4gICAgICAgIHZhbHVlOiBmbjEuY3VycmVudFZlcnNpb24uZnVuY3Rpb25Bcm4sXG4gICAgICB9KTtcbiAgICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrMiwgJ0N1cnJlbnRWZXJzaW9uQXJuJywge1xuICAgICAgICB2YWx1ZTogZm4yLmN1cnJlbnRWZXJzaW9uLmZ1bmN0aW9uQXJuLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvbnN0IHRlbXBsYXRlMSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjazEpLnRvSlNPTigpO1xuICAgICAgY29uc3QgdGVtcGxhdGUyID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrMikudG9KU09OKCk7XG5cbiAgICAgIC8vIHRoZXNlIGZ1bmN0aW9ucyBhcmUgZGlmZmVyZW50IGluIHRoZWlyIGNvbmZpZ3VyYXRpb24gYnV0IHRoZSBvcmlnaW5hbFxuICAgICAgLy8gbG9naWNhbCBJRCBvZiB0aGUgdmVyc2lvbiB3b3VsZCBiZSB0aGUgc2FtZSB1bmxlc3MgdGhlIGxvZ2ljYWwgSURcbiAgICAgIC8vIGluY2x1ZGVzIHRoZSBoYXNoIG9mIGZ1bmN0aW9uJ3MgY29uZmlndXJhdGlvbi5cbiAgICAgIGV4cGVjdCh0ZW1wbGF0ZTEuT3V0cHV0cy5DdXJyZW50VmVyc2lvbkFybi5WYWx1ZSkubm90LnRvRXF1YWwodGVtcGxhdGUyLk91dHB1dHMuQ3VycmVudFZlcnNpb25Bcm4uVmFsdWUpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZmlsZXN5c3RlbScsICgpID0+IHtcblxuICAgIHRlc3QoJ21vdW50IGVmcyBmaWxlc3lzdGVtJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnLCB7XG4gICAgICAgIG1heEF6czogMyxcbiAgICAgICAgbmF0R2F0ZXdheXM6IDEsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZnMgPSBuZXcgZWZzLkZpbGVTeXN0ZW0oc3RhY2ssICdFZnMnLCB7XG4gICAgICAgIHZwYyxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgYWNjZXNzUG9pbnQgPSBmcy5hZGRBY2Nlc3NQb2ludCgnQWNjZXNzUG9pbnQnKTtcbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUZ1bmN0aW9uJywge1xuICAgICAgICB2cGMsXG4gICAgICAgIGhhbmRsZXI6ICdmb28nLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdoYW5kbGVyLnppcCcpKSxcbiAgICAgICAgZmlsZXN5c3RlbTogbGFtYmRhLkZpbGVTeXN0ZW0uZnJvbUVmc0FjY2Vzc1BvaW50KGFjY2Vzc1BvaW50LCAnL21udC9tc2cnKSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBGaWxlU3lzdGVtQ29uZmlnczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFybjoge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzplbGFzdGljZmlsZXN5c3RlbTonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzphY2Nlc3MtcG9pbnQvJyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnRWZzQWNjZXNzUG9pbnRFNDE5RkVEOScsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgTG9jYWxNb3VudFBhdGg6ICcvbW50L21zZycsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3cgZXJyb3IgbW91bnRpbmcgZWZzIHdpdGggbm8gdnBjJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnLCB7XG4gICAgICAgIG1heEF6czogMyxcbiAgICAgICAgbmF0R2F0ZXdheXM6IDEsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZnMgPSBuZXcgZWZzLkZpbGVTeXN0ZW0oc3RhY2ssICdFZnMnLCB7XG4gICAgICAgIHZwYyxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgYWNjZXNzUG9pbnQgPSBmcy5hZGRBY2Nlc3NQb2ludCgnQWNjZXNzUG9pbnQnKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015RnVuY3Rpb24nLCB7XG4gICAgICAgICAgaGFuZGxlcjogJ2ZvbycsXG4gICAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdoYW5kbGVyLnppcCcpKSxcbiAgICAgICAgICBmaWxlc3lzdGVtOiBsYW1iZGEuRmlsZVN5c3RlbS5mcm9tRWZzQWNjZXNzUG9pbnQoYWNjZXNzUG9pbnQsICcvbW50L21zZycpLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3ZlcmlmeSBkZXBzIHdoZW4gbW91bnRpbmcgZWZzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnLCB7XG4gICAgICAgIG1heEF6czogMyxcbiAgICAgICAgbmF0R2F0ZXdheXM6IDEsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHNlY3VyaXR5R3JvdXAgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdMYW1iZGFTRycsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBhbGxvd0FsbE91dGJvdW5kOiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBmcyA9IG5ldyBlZnMuRmlsZVN5c3RlbShzdGFjaywgJ0VmcycsIHtcbiAgICAgICAgdnBjLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBhY2Nlc3NQb2ludCA9IGZzLmFkZEFjY2Vzc1BvaW50KCdBY2Nlc3NQb2ludCcpO1xuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015RnVuY3Rpb24nLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgaGFuZGxlcjogJ2ZvbycsXG4gICAgICAgIHNlY3VyaXR5R3JvdXBzOiBbc2VjdXJpdHlHcm91cF0sXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2hhbmRsZXIuemlwJykpLFxuICAgICAgICBmaWxlc3lzdGVtOiBsYW1iZGEuRmlsZVN5c3RlbS5mcm9tRWZzQWNjZXNzUG9pbnQoYWNjZXNzUG9pbnQsICcvbW50L21zZycpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgICAgRGVwZW5kc09uOiBbXG4gICAgICAgICAgJ0Vmc0Vmc01vdW50VGFyZ2V0MTk1QjJERDJFJyxcbiAgICAgICAgICAnRWZzRWZzTW91bnRUYXJnZXQyMzE1QzkyN0YnLFxuICAgICAgICAgICdFZnNFZnNTZWN1cml0eUdyb3VwZnJvbUxhbWJkYVNHMjA0OTFCMkY3NTFEJyxcbiAgICAgICAgICAnTGFtYmRhU0d0b0Vmc0Vmc1NlY3VyaXR5R3JvdXBGQ0UyOTU0MDIwNDk5NzE5Njk0QScsXG4gICAgICAgICAgJ015RnVuY3Rpb25TZXJ2aWNlUm9sZURlZmF1bHRQb2xpY3lCNzA1QUJENCcsXG4gICAgICAgICAgJ015RnVuY3Rpb25TZXJ2aWNlUm9sZTNDMzU3RkYyJyxcbiAgICAgICAgICAnVnBjUHJpdmF0ZVN1Ym5ldDFEZWZhdWx0Um91dGVCRTAyQTlFRCcsXG4gICAgICAgICAgJ1ZwY1ByaXZhdGVTdWJuZXQxUm91dGVUYWJsZUFzc29jaWF0aW9uNzBDNTlGQTYnLFxuICAgICAgICAgICdWcGNQcml2YXRlU3VibmV0MkRlZmF1bHRSb3V0ZTA2MEQyMDg3JyxcbiAgICAgICAgICAnVnBjUHJpdmF0ZVN1Ym5ldDJSb3V0ZVRhYmxlQXNzb2NpYXRpb25BODlDQUQ1NicsXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2NvZGUgY29uZmlnJywgKCkgPT4ge1xuICAgIGNsYXNzIE15Q29kZSBleHRlbmRzIGxhbWJkYS5Db2RlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBpc0lubGluZTogYm9vbGVhbjtcbiAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29uZmlnOiBsYW1iZGEuQ29kZUNvbmZpZykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmlzSW5saW5lID0gJ2lubGluZUNvZGUnIGluIGNvbmZpZztcbiAgICAgIH1cblxuICAgICAgcHVibGljIGJpbmQoX3Njb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCk6IGxhbWJkYS5Db2RlQ29uZmlnIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRlc3QoJ29ubHkgb25lIG9mIGlubGluZSwgczMgb3IgaW1hZ2VDb25maWcgYXJlIGFsbG93ZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgZXhwZWN0KCgpID0+IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGbjEnLCB7XG4gICAgICAgIGNvZGU6IG5ldyBNeUNvZGUoe30pLFxuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLkdPXzFfWCxcbiAgICAgIH0pKS50b1Rocm93KC9sYW1iZGEuQ29kZSBtdXN0IHNwZWNpZnkgZXhhY3RseSBvbmUgb2YvKTtcblxuICAgICAgZXhwZWN0KCgpID0+IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGbjInLCB7XG4gICAgICAgIGNvZGU6IG5ldyBNeUNvZGUoe1xuICAgICAgICAgIGlubGluZUNvZGU6ICdmb28nLFxuICAgICAgICAgIGltYWdlOiB7IGltYWdlVXJpOiAnYmFyJyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5HT18xX1gsXG4gICAgICB9KSkudG9UaHJvdygvbGFtYmRhLkNvZGUgbXVzdCBzcGVjaWZ5IGV4YWN0bHkgb25lIG9mLyk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnRm4zJywge1xuICAgICAgICBjb2RlOiBuZXcgTXlDb2RlKHtcbiAgICAgICAgICBpbWFnZTogeyBpbWFnZVVyaTogJ2JheicgfSxcbiAgICAgICAgICBzM0xvY2F0aW9uOiB7IGJ1Y2tldE5hbWU6ICdzM2ZvbycsIG9iamVjdEtleTogJ3MzYmFyJyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5HT18xX1gsXG4gICAgICB9KSkudG9UaHJvdygvbGFtYmRhLkNvZGUgbXVzdCBzcGVjaWZ5IGV4YWN0bHkgb25lIG9mLyk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnRm40Jywge1xuICAgICAgICBjb2RlOiBuZXcgTXlDb2RlKHsgaW5saW5lQ29kZTogJ2JheicsIHMzTG9jYXRpb246IHsgYnVja2V0TmFtZTogJ3MzZm9vJywgb2JqZWN0S2V5OiAnczNiYXInIH0gfSksXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuR09fMV9YLFxuICAgICAgfSkpLnRvVGhyb3coL2xhbWJkYS5Db2RlIG11c3Qgc3BlY2lmeSBleGFjdGx5IG9uZSBvZi8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaGFuZGxlciBtdXN0IGJlIEZST01fSU1BR0Ugd2hlbiBpbWFnZSBhc3NldCBpcyBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgZXhwZWN0KCgpID0+IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGbjEnLCB7XG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldEltYWdlKCd0ZXN0L2RvY2tlci1sYW1iZGEtaGFuZGxlcicpLFxuICAgICAgICBoYW5kbGVyOiBsYW1iZGEuSGFuZGxlci5GUk9NX0lNQUdFLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5GUk9NX0lNQUdFLFxuICAgICAgfSkpLm5vdC50b1Rocm93KCk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnRm4yJywge1xuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXRJbWFnZSgndGVzdC9kb2NrZXItbGFtYmRhLWhhbmRsZXInKSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5GUk9NX0lNQUdFLFxuICAgICAgfSkpLnRvVGhyb3coL2hhbmRsZXIgbXVzdCBiZS4qRlJPTV9JTUFHRS8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncnVudGltZSBtdXN0IGJlIEZST01fSU1BR0Ugd2hlbiBpbWFnZSBhc3NldCBpcyBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgZXhwZWN0KCgpID0+IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGbjEnLCB7XG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldEltYWdlKCd0ZXN0L2RvY2tlci1sYW1iZGEtaGFuZGxlcicpLFxuICAgICAgICBoYW5kbGVyOiBsYW1iZGEuSGFuZGxlci5GUk9NX0lNQUdFLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5GUk9NX0lNQUdFLFxuICAgICAgfSkpLm5vdC50b1Rocm93KCk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnRm4yJywge1xuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXRJbWFnZSgndGVzdC9kb2NrZXItbGFtYmRhLWhhbmRsZXInKSxcbiAgICAgICAgaGFuZGxlcjogbGFtYmRhLkhhbmRsZXIuRlJPTV9JTUFHRSxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuR09fMV9YLFxuICAgICAgfSkpLnRvVGhyb3coL3J1bnRpbWUgbXVzdCBiZS4qRlJPTV9JTUFHRS8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaW1hZ2VVcmkgaXMgY29ycmVjdGx5IGNvbmZpZ3VyZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0ZuMScsIHtcbiAgICAgICAgY29kZTogbmV3IE15Q29kZSh7XG4gICAgICAgICAgaW1hZ2U6IHtcbiAgICAgICAgICAgIGltYWdlVXJpOiAnZWNyIGltYWdlIHVyaScsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGhhbmRsZXI6IGxhbWJkYS5IYW5kbGVyLkZST01fSU1BR0UsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLkZST01fSU1BR0UsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgICAgQ29kZToge1xuICAgICAgICAgIEltYWdlVXJpOiAnZWNyIGltYWdlIHVyaScsXG4gICAgICAgIH0sXG4gICAgICAgIEltYWdlQ29uZmlnOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaW1hZ2VDb25maWcgaXMgY29ycmVjdGx5IGNvbmZpZ3VyZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0ZuMScsIHtcbiAgICAgICAgY29kZTogbmV3IE15Q29kZSh7XG4gICAgICAgICAgaW1hZ2U6IHtcbiAgICAgICAgICAgIGltYWdlVXJpOiAnZWNyIGltYWdlIHVyaScsXG4gICAgICAgICAgICBjbWQ6IFsnY21kJywgJ3BhcmFtMSddLFxuICAgICAgICAgICAgZW50cnlwb2ludDogWydlbnRyeXBvaW50JywgJ3BhcmFtMiddLFxuICAgICAgICAgICAgd29ya2luZ0RpcmVjdG9yeTogJy9zb21lL3BhdGgnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgICBoYW5kbGVyOiBsYW1iZGEuSGFuZGxlci5GUk9NX0lNQUdFLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5GUk9NX0lNQUdFLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICAgIEltYWdlQ29uZmlnOiB7XG4gICAgICAgICAgQ29tbWFuZDogWydjbWQnLCAncGFyYW0xJ10sXG4gICAgICAgICAgRW50cnlQb2ludDogWydlbnRyeXBvaW50JywgJ3BhcmFtMiddLFxuICAgICAgICAgIFdvcmtpbmdEaXJlY3Rvcnk6ICcvc29tZS9wYXRoJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnY29kZSBzaWduaW5nIGNvbmZpZycsICgpID0+IHtcbiAgICB0ZXN0KCdkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHNpZ25pbmdQcm9maWxlID0gbmV3IHNpZ25lci5TaWduaW5nUHJvZmlsZShzdGFjaywgJ1NpZ25pbmdQcm9maWxlJywge1xuICAgICAgICBwbGF0Zm9ybTogc2lnbmVyLlBsYXRmb3JtLkFXU19MQU1CREFfU0hBMzg0X0VDRFNBLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGNvZGVTaWduaW5nQ29uZmlnID0gbmV3IGxhbWJkYS5Db2RlU2lnbmluZ0NvbmZpZyhzdGFjaywgJ0NvZGVTaWduaW5nQ29uZmlnJywge1xuICAgICAgICBzaWduaW5nUHJvZmlsZXM6IFtzaWduaW5nUHJvZmlsZV0sXG4gICAgICB9KTtcblxuICAgICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2ZvbycpLFxuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICBjb2RlU2lnbmluZ0NvbmZpZyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBDb2RlU2lnbmluZ0NvbmZpZ0Fybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0NvZGVTaWduaW5nQ29uZmlnRDhENDFDMTAnLFxuICAgICAgICAgICAgJ0NvZGVTaWduaW5nQ29uZmlnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Vycm9yIHdoZW4gbGF5ZXJzIHNldCBpbiBhIGNvbnRhaW5lciBmdW5jdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jyk7XG4gICAgY29uc3QgY29kZSA9IG5ldyBsYW1iZGEuUzNDb2RlKGJ1Y2tldCwgJ09iamVjdEtleScpO1xuXG4gICAgY29uc3QgbGF5ZXIgPSBuZXcgbGFtYmRhLkxheWVyVmVyc2lvbihzdGFjaywgJ0xheWVyJywge1xuICAgICAgY29kZSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgbGFtYmRhLkRvY2tlckltYWdlRnVuY3Rpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Eb2NrZXJJbWFnZUNvZGUuZnJvbUltYWdlQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2RvY2tlci1sYW1iZGEtaGFuZGxlcicpKSxcbiAgICAgIGxheWVyczogW2xheWVyXSxcbiAgICB9KSkudG9UaHJvdygvTGF5ZXJzIGFyZSBub3Qgc3VwcG9ydGVkIGZvciBjb250YWluZXIgaW1hZ2UgZnVuY3Rpb25zLyk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdzcGVjaWZpZWQgYXJjaGl0ZWN0dXJlcyBpcyByZWNvZ25pemVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUZ1bmN0aW9uJywge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcblxuICAgICAgYXJjaGl0ZWN0dXJlczogW2xhbWJkYS5BcmNoaXRlY3R1cmUuQVJNXzY0XSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICBBcmNoaXRlY3R1cmVzOiBbJ2FybTY0J10sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NwZWNpZmllZCBhcmNoaXRlY3R1cmUgaXMgcmVjb2duaXplZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlGdW5jdGlvbicsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG5cbiAgICAgIGFyY2hpdGVjdHVyZTogbGFtYmRhLkFyY2hpdGVjdHVyZS5BUk1fNjQsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgQXJjaGl0ZWN0dXJlczogWydhcm02NCddLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnYm90aCBhcmNoaXRlY3R1cmVzIGFuZCBhcmNoaXRlY3R1cmUgYXJlIG5vdCByZWNvZ25pemVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlGdW5jdGlvbicsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG5cbiAgICAgIGFyY2hpdGVjdHVyZTogbGFtYmRhLkFyY2hpdGVjdHVyZS5BUk1fNjQsXG4gICAgICBhcmNoaXRlY3R1cmVzOiBbbGFtYmRhLkFyY2hpdGVjdHVyZS5YODZfNjRdLFxuICAgIH0pKS50b1Rocm93KC9hcmNoaXRlY3R1cmUgb3IgYXJjaGl0ZWN0dXJlcyBtdXN0IGJlIHNwZWNpZmllZC8pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnT25seSBvbmUgYXJjaGl0ZWN0dXJlIGFsbG93ZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUZ1bmN0aW9uJywge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcblxuICAgICAgYXJjaGl0ZWN0dXJlczogW2xhbWJkYS5BcmNoaXRlY3R1cmUuWDg2XzY0LCBsYW1iZGEuQXJjaGl0ZWN0dXJlLkFSTV82NF0sXG4gICAgfSkpLnRvVGhyb3coL29uZSBhcmNoaXRlY3R1cmUgbXVzdCBiZSBzcGVjaWZpZWQvKTtcbiAgfSk7XG5cbiAgdGVzdCgnQXJjaGl0ZWN0dXJlIGlzIHByb3Blcmx5IHJlYWRhYmxlIGZyb20gdGhlIGZ1bmN0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015RnVuY3Rpb24nLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdmb28nKSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgYXJjaGl0ZWN0dXJlOiBsYW1iZGEuQXJjaGl0ZWN0dXJlLkFSTV82NCxcbiAgICB9KTtcbiAgICBleHBlY3QoZm4uYXJjaGl0ZWN0dXJlPy5uYW1lKS50b0VxdWFsKCdhcm02NCcpO1xuICB9KTtcblxuICB0ZXN0KCdFcnJvciB3aGVuIGZ1bmN0aW9uIG5hbWUgaXMgbG9uZ2VyIHRoYW4gNjQgY2hhcnMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUZ1bmN0aW9uJywge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGZ1bmN0aW9uTmFtZTogJ2EnLnJlcGVhdCg2NSksXG4gICAgfSkpLnRvVGhyb3coL0Z1bmN0aW9uIG5hbWUgY2FuIG5vdCBiZSBsb25nZXIgdGhhbiA2NCBjaGFyYWN0ZXJzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ0Vycm9yIHdoZW4gZnVuY3Rpb24gbmFtZSBjb250YWlucyBpbnZhbGlkIGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgWycgJywgJ1xcbicsICdcXHInLCAnWycsICddJywgJzwnLCAnPicsICckJ10uZm9yRWFjaChpbnZhbGlkQ2hhciA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCBgZm9vJHtpbnZhbGlkQ2hhcn1gLCB7XG4gICAgICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdmb28nKSxcbiAgICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgICAgZnVuY3Rpb25OYW1lOiBgZm9vJHtpbnZhbGlkQ2hhcn1gLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL2NhbiBjb250YWluIG9ubHkgbGV0dGVycywgbnVtYmVycywgaHlwaGVucywgb3IgdW5kZXJzY29yZXMgd2l0aCBubyBzcGFjZXMuLyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ05vIGVycm9yIHdoZW4gZnVuY3Rpb24gbmFtZSBpcyBUb2tlbml6ZWQgYW5kIFVucmVzb2x2ZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGNvbnN0IHJlYWxGdW5jdGlvbk5hbWUgPSAnYScucmVwZWF0KDE0MSk7XG4gICAgICBjb25zdCB0b2tlbml6ZWRGdW5jdGlvbk5hbWUgPSBjZGsuVG9rZW4uYXNTdHJpbmcobmV3IGNkay5JbnRyaW5zaWMocmVhbEZ1bmN0aW9uTmFtZSkpO1xuXG4gICAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnZm9vJywge1xuICAgICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2ZvbycpLFxuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICBmdW5jdGlvbk5hbWU6IHRva2VuaXplZEZ1bmN0aW9uTmFtZSxcbiAgICAgIH0pO1xuICAgIH0pLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ0Vycm9yIHdoZW4gZnVuY3Rpb24gZGVzY3JpcHRpb24gaXMgbG9uZ2VyIHRoYW4gMjU2IGNoYXJzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlGdW5jdGlvbicsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBkZXNjcmlwdGlvbjogJ2EnLnJlcGVhdCgyNTcpLFxuICAgIH0pKS50b1Rocm93KC9GdW5jdGlvbiBkZXNjcmlwdGlvbiBjYW4gbm90IGJlIGxvbmdlciB0aGFuIDI1NiBjaGFyYWN0ZXJzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ05vIGVycm9yIHdoZW4gZnVuY3Rpb24gbmFtZSBpcyBUb2tlbml6ZWQgYW5kIFVucmVzb2x2ZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGNvbnN0IHJlYWxGdW5jdGlvbkRlc2NyaXB0aW9uID0gJ2EnLnJlcGVhdCgyNTcpO1xuICAgICAgY29uc3QgdG9rZW5pemVkRnVuY3Rpb25EZXNjcmlwdGlvbiA9IGNkay5Ub2tlbi5hc1N0cmluZyhuZXcgY2RrLkludHJpbnNpYyhyZWFsRnVuY3Rpb25EZXNjcmlwdGlvbikpO1xuXG4gICAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnZm9vJywge1xuICAgICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2ZvbycpLFxuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICBkZXNjcmlwdGlvbjogdG9rZW5pemVkRnVuY3Rpb25EZXNjcmlwdGlvbixcbiAgICAgIH0pO1xuICAgIH0pLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdGdW5jdGlvblVybCcsICgpID0+IHtcbiAgICB0ZXN0KCdhZGRGdW5jdGlvblVybCBjcmVhdGVzIGEgZnVuY3Rpb24gdXJsIHdpdGggZGVmYXVsdCBvcHRpb25zJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnaGVsbG8oKScpLFxuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGVsbG8nLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBmbi5hZGRGdW5jdGlvblVybCgpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlVybCcsIHtcbiAgICAgICAgQXV0aFR5cGU6ICdBV1NfSUFNJyxcbiAgICAgICAgVGFyZ2V0RnVuY3Rpb25Bcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdNeUxhbWJkYUNDRTgwMkZCJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FkZEZ1bmN0aW9uVXJsIGNyZWF0ZXMgYSBmdW5jdGlvbiB1cmwgd2l0aCBhbGwgb3B0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2hlbGxvKCknKSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhlbGxvJyxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgZm4uYWRkRnVuY3Rpb25Vcmwoe1xuICAgICAgICBhdXRoVHlwZTogbGFtYmRhLkZ1bmN0aW9uVXJsQXV0aFR5cGUuTk9ORSxcbiAgICAgICAgY29yczoge1xuICAgICAgICAgIGFsbG93Q3JlZGVudGlhbHM6IHRydWUsXG4gICAgICAgICAgYWxsb3dlZE9yaWdpbnM6IFsnaHR0cHM6Ly9leGFtcGxlLmNvbSddLFxuICAgICAgICAgIGFsbG93ZWRNZXRob2RzOiBbbGFtYmRhLkh0dHBNZXRob2QuR0VUXSxcbiAgICAgICAgICBhbGxvd2VkSGVhZGVyczogWydYLUN1c3RvbS1IZWFkZXInXSxcbiAgICAgICAgICBtYXhBZ2U6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDMwMCksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpVcmwnLCB7XG4gICAgICAgIEF1dGhUeXBlOiAnTk9ORScsXG4gICAgICAgIFRhcmdldEZ1bmN0aW9uQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnTXlMYW1iZGFDQ0U4MDJGQicsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBDb3JzOiB7XG4gICAgICAgICAgQWxsb3dDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgICBBbGxvd0hlYWRlcnM6IFtcbiAgICAgICAgICAgICdYLUN1c3RvbS1IZWFkZXInLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgQWxsb3dNZXRob2RzOiBbXG4gICAgICAgICAgICAnR0VUJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIEFsbG93T3JpZ2luczogW1xuICAgICAgICAgICAgJ2h0dHBzOi8vZXhhbXBsZS5jb20nLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgTWF4QWdlOiAzMDAsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2dyYW50SW52b2tlVXJsOiBhZGRzIGFwcHJvcHJpYXRlIHBlcm1pc3Npb25zJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50UHJpbmNpcGFsKCcxMjM0JyksXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2hlbGxvKCknKSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhlbGxvJyxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICB9KTtcbiAgICAgIGZuLmFkZEZ1bmN0aW9uVXJsKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGZuLmdyYW50SW52b2tlVXJsKHJvbGUpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ2xhbWJkYTpJbnZva2VGdW5jdGlvblVybCcsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdNeUxhbWJkYUNDRTgwMkZCJyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FsbGVkIHR3aWNlIGZvciB0aGUgc2FtZSBzZXJ2aWNlIHByaW5jaXBhbCBidXQgd2l0aCBkaWZmZXJlbnQgY29uZGl0aW9ucycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0Z1bmN0aW9uJywge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgneHh4JyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcbiAgICBjb25zdCBzb3VyY2VBcm5BID0gJ3NvbWUtYXJuLWEnO1xuICAgIGNvbnN0IHNvdXJjZUFybkIgPSAnc29tZS1hcm4tYic7XG4gICAgY29uc3Qgc2VydmljZSA9ICdzMy5hbWF6b25hd3MuY29tJztcbiAgICBjb25zdCBjb25kaXRpb25hbFByaW5jaXBhbEEgPSBuZXcgaWFtLlByaW5jaXBhbFdpdGhDb25kaXRpb25zKG5ldyBpYW0uU2VydmljZVByaW5jaXBhbChzZXJ2aWNlKSwge1xuICAgICAgQXJuTGlrZToge1xuICAgICAgICAnYXdzOlNvdXJjZUFybic6IHNvdXJjZUFybkEsXG4gICAgICB9LFxuICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICdhd3M6U291cmNlQWNjb3VudCc6IHN0YWNrLmFjY291bnQsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IGNvbmRpdGlvbmFsUHJpbmNpcGFsQiA9IG5ldyBpYW0uUHJpbmNpcGFsV2l0aENvbmRpdGlvbnMobmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKHNlcnZpY2UpLCB7XG4gICAgICBBcm5MaWtlOiB7XG4gICAgICAgICdhd3M6U291cmNlQXJuJzogc291cmNlQXJuQixcbiAgICAgIH0sXG4gICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgJ2F3czpTb3VyY2VBY2NvdW50Jzogc3RhY2suYWNjb3VudCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgZm4uZ3JhbnRJbnZva2UoY29uZGl0aW9uYWxQcmluY2lwYWxBKTtcbiAgICBmbi5ncmFudEludm9rZShjb25kaXRpb25hbFByaW5jaXBhbEIpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkxhbWJkYTo6UGVybWlzc2lvbicsIDIpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6TGFtYmRhOjpQZXJtaXNzaW9uJywge1xuICAgICAgUHJvcGVydGllczoge1xuICAgICAgICBBY3Rpb246ICdsYW1iZGE6SW52b2tlRnVuY3Rpb24nLFxuICAgICAgICBGdW5jdGlvbk5hbWU6IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdGdW5jdGlvbjc2ODU2Njc3JyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIFByaW5jaXBhbDogc2VydmljZSxcbiAgICAgICAgU291cmNlQWNjb3VudDoge1xuICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgfSxcbiAgICAgICAgU291cmNlQXJuOiBzb3VyY2VBcm5BLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6TGFtYmRhOjpQZXJtaXNzaW9uJywge1xuICAgICAgUHJvcGVydGllczoge1xuICAgICAgICBBY3Rpb246ICdsYW1iZGE6SW52b2tlRnVuY3Rpb24nLFxuICAgICAgICBGdW5jdGlvbk5hbWU6IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdGdW5jdGlvbjc2ODU2Njc3JyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIFByaW5jaXBhbDogc2VydmljZSxcbiAgICAgICAgU291cmNlQWNjb3VudDoge1xuICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgfSxcbiAgICAgICAgU291cmNlQXJuOiBzb3VyY2VBcm5CLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkcyBBRE9UIGluc3RydW1lbnRhdGlvbiB0byBhIFpJUCBMYW1iZGEgZnVuY3Rpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdCYXNlJywge1xuICAgICAgZW52OiB7IGFjY291bnQ6ICcxMTExMTExMTExMTEnLCByZWdpb246ICd1cy13ZXN0LTInIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdmb28nKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgYWRvdEluc3RydW1lbnRhdGlvbjoge1xuICAgICAgICBsYXllclZlcnNpb246IGxhbWJkYS5BZG90TGF5ZXJWZXJzaW9uLmZyb21KYXZhU2RrTGF5ZXJWZXJzaW9uKEFkb3RMYW1iZGFMYXllckphdmFTZGtWZXJzaW9uLlYxXzE5XzApLFxuICAgICAgICBleGVjV3JhcHBlcjogbGFtYmRhLkFkb3RMYW1iZGFFeGVjV3JhcHBlci5SRUdVTEFSX0hBTkRMRVIsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICBMYXllcnM6IFsnYXJuOmF3czpsYW1iZGE6dXMtd2VzdC0yOjkwMTkyMDU3MDQ2MzpsYXllcjphd3Mtb3RlbC1qYXZhLXdyYXBwZXItYW1kNjQtdmVyLTEtMTktMDoxJ10sXG4gICAgICBFbnZpcm9ubWVudDoge1xuICAgICAgICBWYXJpYWJsZXM6IHtcbiAgICAgICAgICBBV1NfTEFNQkRBX0VYRUNfV1JBUFBFUjogJy9vcHQvb3RlbC1oYW5kbGVyJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZHMgQURPVCBpbnN0cnVtZW50YXRpb24gdG8gYSBjb250YWluZXIgaW1hZ2UgTGFtYmRhIGZ1bmN0aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnQmFzZScsIHtcbiAgICAgIGVudjogeyBhY2NvdW50OiAnMTExMTExMTExMTExJywgcmVnaW9uOiAndXMtd2VzdC0yJyB9LFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGV4cGVjdChcbiAgICAgICgpID0+XG4gICAgICAgIG5ldyBsYW1iZGEuRG9ja2VySW1hZ2VGdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgICAgIGNvZGU6IGxhbWJkYS5Eb2NrZXJJbWFnZUNvZGUuZnJvbUltYWdlQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2RvY2tlci1sYW1iZGEtaGFuZGxlcicpKSxcbiAgICAgICAgICBhZG90SW5zdHJ1bWVudGF0aW9uOiB7XG4gICAgICAgICAgICBsYXllclZlcnNpb246IGxhbWJkYS5BZG90TGF5ZXJWZXJzaW9uLmZyb21KYXZhU2RrTGF5ZXJWZXJzaW9uKEFkb3RMYW1iZGFMYXllckphdmFTZGtWZXJzaW9uLlYxXzE5XzApLFxuICAgICAgICAgICAgZXhlY1dyYXBwZXI6IGxhbWJkYS5BZG90TGFtYmRhRXhlY1dyYXBwZXIuUkVHVUxBUl9IQU5ETEVSLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICkudG9UaHJvdygvQURPVCBMYW1iZGEgbGF5ZXIgY2FuJ3QgYmUgY29uZmlndXJlZCB3aXRoIGNvbnRhaW5lciBpbWFnZSBwYWNrYWdlIHR5cGUvKTtcbiAgfSk7XG59KTtcblxudGVzdCgndGhyb3dzIGlmIGVwaGVtZXJhbCBzdG9yYWdlIHNpemUgaXMgb3V0IG9mIGJvdW5kJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgZXhwZWN0KCgpID0+IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2ZvbycpLFxuICAgIGhhbmRsZXI6ICdiYXInLFxuICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIGVwaGVtZXJhbFN0b3JhZ2VTaXplOiBTaXplLm1lYmlieXRlcyg1MTEpLFxuICB9KSkudG9UaHJvdygvRXBoZW1lcmFsIHN0b3JhZ2Ugc2l6ZSBtdXN0IGJlIGJldHdlZW4gNTEyIGFuZCAxMDI0MCBNQi8pO1xufSk7XG5cbnRlc3QoJ3NldCBlcGhlbWVyYWwgc3RvcmFnZSB0byBkZXNpcmVkIHNpemUnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdmb28nKSxcbiAgICBoYW5kbGVyOiAnYmFyJyxcbiAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICBlcGhlbWVyYWxTdG9yYWdlU2l6ZTogU2l6ZS5tZWJpYnl0ZXMoMTAyNCksXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICBQcm9wZXJ0aWVzOlxuICAgIHtcbiAgICAgIENvZGU6IHsgWmlwRmlsZTogJ2ZvbycgfSxcbiAgICAgIEhhbmRsZXI6ICdiYXInLFxuICAgICAgUnVudGltZTogJ25vZGVqczE0LngnLFxuICAgICAgRXBoZW1lcmFsU3RvcmFnZToge1xuICAgICAgICBTaXplOiAxMDI0LFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdlcGhlbWVyYWwgc3RvcmFnZSBhbGxvd3MgdW5yZXNvbHZlZCB0b2tlbnMnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBleHBlY3QoKCkgPT4ge1xuICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnZm9vJyksXG4gICAgICBoYW5kbGVyOiAnYmFyJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgZXBoZW1lcmFsU3RvcmFnZVNpemU6IFNpemUubWViaWJ5dGVzKExhenkubnVtYmVyKHsgcHJvZHVjZTogKCkgPT4gMTAyNCB9KSksXG4gICAgfSk7XG4gIH0pLm5vdC50b1Rocm93KCk7XG59KTtcblxudGVzdCgnRnVuY3Rpb25WZXJzaW9uVXBncmFkZSBhZGRzIG5ldyBkZXNjcmlwdGlvbiB0byBmdW5jdGlvbicsICgpID0+IHtcbiAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5MQU1CREFfUkVDT0dOSVpFX0xBWUVSX1ZFUlNJT05dOiB0cnVlIH0gfSk7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xuICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdmb28nKSxcbiAgICBoYW5kbGVyOiAnYmFyJyxcbiAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICBkZXNjcmlwdGlvbjogJ215IGRlc2NyaXB0aW9uJyxcbiAgfSk7XG5cbiAgQXNwZWN0cy5vZihzdGFjaykuYWRkKG5ldyBsYW1iZGEuRnVuY3Rpb25WZXJzaW9uVXBncmFkZShjeGFwaS5MQU1CREFfUkVDT0dOSVpFX0xBWUVSX1ZFUlNJT04pKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgUHJvcGVydGllczpcbiAgICB7XG4gICAgICBDb2RlOiB7IFppcEZpbGU6ICdmb28nIH0sXG4gICAgICBIYW5kbGVyOiAnYmFyJyxcbiAgICAgIFJ1bnRpbWU6ICdub2RlanMxNC54JyxcbiAgICAgIERlc2NyaXB0aW9uOiAnbXkgZGVzY3JpcHRpb24gdmVyc2lvbi1oYXNoOjU0ZjE4YzQ3MzQ2ZWQ4NDg0M2MyZGFjNTQ3ZGU4MWZhJyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdmdW5jdGlvbiB1c2luZyBhIHJlc2VydmVkIGVudmlyb25tZW50IHZhcmlhYmxlJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgZXhwZWN0KCgpID0+IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUxhbWJkYScsIHtcbiAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2ZvbycpLFxuICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM185LFxuICAgIGVudmlyb25tZW50OiB7XG4gICAgICBBV1NfUkVHSU9OOiAnYXAtc291dGhlYXN0LTInLFxuICAgIH0sXG4gIH0pKS50b1Rocm93KC9BV1NfUkVHSU9OIGVudmlyb25tZW50IHZhcmlhYmxlIGlzIHJlc2VydmVkLyk7XG59KTtcblxudGVzdCgnc2V0IFNuYXBTdGFydCB0byBkZXNpcmVkIHZhbHVlJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgbmV3IGxhbWJkYS5DZm5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgIGNvZGU6IHtcbiAgICAgIHppcEZpbGU6ICdqYXZhMTEtdGVzdC1mdW5jdGlvbi56aXAnLFxuICAgIH0sXG4gICAgZnVuY3Rpb25OYW1lOiAnTXlDREstU25hcFN0YXJ0LUZ1bmN0aW9uJyxcbiAgICBoYW5kbGVyOiAnZXhhbXBsZS5IYW5kbGVyOjpoYW5kbGVSZXF1ZXN0JyxcbiAgICByb2xlOiAndGVzdFJvbGUnLFxuICAgIHJ1bnRpbWU6ICdqYXZhMTEnLFxuICAgIHNuYXBTdGFydDogeyBhcHBseU9uOiAnUHVibGlzaGVkVmVyc2lvbnMnIH0sXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICBQcm9wZXJ0aWVzOlxuICAgIHtcbiAgICAgIENvZGU6IHsgWmlwRmlsZTogJ2phdmExMS10ZXN0LWZ1bmN0aW9uLnppcCcgfSxcbiAgICAgIEhhbmRsZXI6ICdleGFtcGxlLkhhbmRsZXI6OmhhbmRsZVJlcXVlc3QnLFxuICAgICAgUnVudGltZTogJ2phdmExMScsXG4gICAgICBTbmFwU3RhcnQ6IHtcbiAgICAgICAgQXBwbHlPbjogJ1B1Ymxpc2hlZFZlcnNpb25zJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gbmV3VGVzdExhbWJkYShzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QpIHtcbiAgcmV0dXJuIG5ldyBsYW1iZGEuRnVuY3Rpb24oc2NvcGUsICdNeUxhbWJkYScsIHtcbiAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2ZvbycpLFxuICAgIGhhbmRsZXI6ICdiYXInLFxuICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzksXG4gIH0pO1xufVxuIl19