"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const lambda = require("@aws-cdk/aws-lambda");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const secretsmanager = require("../lib");
let app;
let stack;
beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app);
});
test('default secret', () => {
    // WHEN
    new secretsmanager.Secret(stack, 'Secret');
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
        GenerateSecretString: {},
    });
});
test('set removalPolicy to secret', () => {
    // WHEN
    new secretsmanager.Secret(stack, 'Secret', {
        removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResource('AWS::SecretsManager::Secret', {
        DeletionPolicy: 'Retain',
    });
});
test('secret with kms', () => {
    // GIVEN
    const key = new kms.Key(stack, 'KMS');
    // WHEN
    new secretsmanager.Secret(stack, 'Secret', { encryptionKey: key });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
        KeyPolicy: {
            Statement: assertions_1.Match.arrayWith([
                {
                    Effect: 'Allow',
                    Resource: '*',
                    Action: [
                        'kms:Decrypt',
                        'kms:Encrypt',
                        'kms:ReEncrypt*',
                        'kms:GenerateDataKey*',
                    ],
                    Principal: {
                        AWS: {
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
                                    ':root',
                                ],
                            ],
                        },
                    },
                    Condition: {
                        StringEquals: {
                            'kms:ViaService': {
                                'Fn::Join': [
                                    '',
                                    [
                                        'secretsmanager.',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        '.amazonaws.com',
                                    ],
                                ],
                            },
                        },
                    },
                },
                {
                    Effect: 'Allow',
                    Resource: '*',
                    Action: [
                        'kms:CreateGrant',
                        'kms:DescribeKey',
                    ],
                    Principal: {
                        AWS: {
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
                                    ':root',
                                ],
                            ],
                        },
                    },
                    Condition: {
                        StringEquals: {
                            'kms:ViaService': {
                                'Fn::Join': [
                                    '',
                                    [
                                        'secretsmanager.',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        '.amazonaws.com',
                                    ],
                                ],
                            },
                        },
                    },
                },
            ]),
            Version: '2012-10-17',
        },
    });
});
test('secret with generate secret string options', () => {
    // WHEN
    new secretsmanager.Secret(stack, 'Secret', {
        generateSecretString: {
            excludeUppercase: true,
            passwordLength: 20,
        },
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
        GenerateSecretString: {
            ExcludeUppercase: true,
            PasswordLength: 20,
        },
    });
});
test('templated secret string', () => {
    // WHEN
    new secretsmanager.Secret(stack, 'Secret', {
        generateSecretString: {
            secretStringTemplate: JSON.stringify({ username: 'username' }),
            generateStringKey: 'password',
        },
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
        GenerateSecretString: {
            SecretStringTemplate: '{"username":"username"}',
            GenerateStringKey: 'password',
        },
    });
});
describe('secretStringBeta1', () => {
    let user;
    let accessKey;
    beforeEach(() => {
        user = new iam.User(stack, 'User');
        accessKey = new iam.AccessKey(stack, 'MyKey', { user });
    });
    cdk_build_tools_1.testDeprecated('fromUnsafePlaintext allows specifying a plaintext string', () => {
        new secretsmanager.Secret(stack, 'Secret', {
            secretStringBeta1: secretsmanager.SecretStringValueBeta1.fromUnsafePlaintext('unsafeP@$$'),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
            GenerateSecretString: assertions_1.Match.absent(),
            SecretString: 'unsafeP@$$',
        });
    });
    cdk_build_tools_1.testDeprecated('toToken throws when provided an unsafe plaintext string', () => {
        expect(() => new secretsmanager.Secret(stack, 'Secret', {
            secretStringBeta1: secretsmanager.SecretStringValueBeta1.fromToken('unsafeP@$$'),
        })).toThrow(/appears to be plaintext/);
    });
    cdk_build_tools_1.testDeprecated('toToken allows referencing a construct attribute', () => {
        new secretsmanager.Secret(stack, 'Secret', {
            secretStringBeta1: secretsmanager.SecretStringValueBeta1.fromToken(accessKey.secretAccessKey.toString()),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
            GenerateSecretString: assertions_1.Match.absent(),
            SecretString: { 'Fn::GetAtt': ['MyKey6AB29FA6', 'SecretAccessKey'] },
        });
    });
    cdk_build_tools_1.testDeprecated('toToken allows referencing a construct attribute in nested JSON', () => {
        const secretString = secretsmanager.SecretStringValueBeta1.fromToken(JSON.stringify({
            key: accessKey.secretAccessKey.toString(),
            username: 'myUser',
        }));
        new secretsmanager.Secret(stack, 'Secret', {
            secretStringBeta1: secretString,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
            GenerateSecretString: assertions_1.Match.absent(),
            SecretString: {
                'Fn::Join': [
                    '',
                    [
                        '{"key":"',
                        {
                            'Fn::GetAtt': [
                                'MyKey6AB29FA6',
                                'SecretAccessKey',
                            ],
                        },
                        '","username":"myUser"}',
                    ],
                ],
            },
        });
    });
    cdk_build_tools_1.testDeprecated('toToken throws if provided a resolved token', () => {
        // NOTE - This is actually not desired behavior, but the simple `!Token.isUnresolved`
        // check is the simplest and most consistent to implement. Covering this edge case of
        // a resolved Token representing a Ref/Fn::GetAtt is out of scope for this initial pass.
        const secretKey = stack.resolve(accessKey.secretAccessKey);
        expect(() => new secretsmanager.Secret(stack, 'Secret', {
            secretStringBeta1: secretsmanager.SecretStringValueBeta1.fromToken(secretKey),
        })).toThrow(/appears to be plaintext/);
    });
    cdk_build_tools_1.testDeprecated('throws if both generateSecretString and secretStringBeta1 are provided', () => {
        expect(() => new secretsmanager.Secret(stack, 'Secret', {
            generateSecretString: {
                generateStringKey: 'username',
                secretStringTemplate: JSON.stringify({ username: 'username' }),
            },
            secretStringBeta1: secretsmanager.SecretStringValueBeta1.fromToken(accessKey.secretAccessKey.toString()),
        })).toThrow(/Cannot specify/);
    });
});
describe('secretStringValue', () => {
    test('can reference an IAM user access key', () => {
        const user = new iam.User(stack, 'User');
        const accessKey = new iam.AccessKey(stack, 'MyKey', { user });
        new secretsmanager.Secret(stack, 'Secret', {
            secretStringValue: accessKey.secretAccessKey,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
            GenerateSecretString: assertions_1.Match.absent(),
            SecretString: { 'Fn::GetAtt': ['MyKey6AB29FA6', 'SecretAccessKey'] },
        });
    });
});
test('grantRead', () => {
    // GIVEN
    const secret = new secretsmanager.Secret(stack, 'Secret');
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountRootPrincipal() });
    // WHEN
    secret.grantRead(role);
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Version: '2012-10-17',
            Statement: [{
                    Action: [
                        'secretsmanager:GetSecretValue',
                        'secretsmanager:DescribeSecret',
                    ],
                    Effect: 'Allow',
                    Resource: { Ref: 'SecretA720EF05' },
                }],
        },
    });
});
test('Error when grantRead with different role and no KMS', () => {
    // GIVEN
    const testStack = new cdk.Stack(app, 'TestStack', {
        env: {
            account: '123456789012',
        },
    });
    const secret = new secretsmanager.Secret(testStack, 'Secret');
    const role = iam.Role.fromRoleArn(testStack, 'RoleFromArn', 'arn:aws:iam::111111111111:role/SomeRole');
    // THEN
    expect(() => {
        secret.grantRead(role);
    }).toThrowError('KMS Key must be provided for cross account access to Secret');
});
test('grantRead with KMS Key', () => {
    // GIVEN
    const key = new kms.Key(stack, 'KMS');
    const secret = new secretsmanager.Secret(stack, 'Secret', { encryptionKey: key });
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountRootPrincipal() });
    // WHEN
    secret.grantRead(role);
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Version: '2012-10-17',
            Statement: [{
                    Action: [
                        'secretsmanager:GetSecretValue',
                        'secretsmanager:DescribeSecret',
                    ],
                    Effect: 'Allow',
                    Resource: { Ref: 'SecretA720EF05' },
                }],
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
        KeyPolicy: {
            Statement: assertions_1.Match.arrayWith([
                {
                    Action: 'kms:Decrypt',
                    Condition: {
                        StringEquals: {
                            'kms:ViaService': {
                                'Fn::Join': [
                                    '',
                                    [
                                        'secretsmanager.',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        '.amazonaws.com',
                                    ],
                                ],
                            },
                        },
                    },
                    Effect: 'Allow',
                    Principal: {
                        AWS: {
                            'Fn::GetAtt': [
                                'Role1ABCC5F0',
                                'Arn',
                            ],
                        },
                    },
                    Resource: '*',
                },
            ]),
            Version: '2012-10-17',
        },
    });
});
test('grantRead cross account', () => {
    // GIVEN
    const key = new kms.Key(stack, 'KMS');
    const secret = new secretsmanager.Secret(stack, 'Secret', { encryptionKey: key });
    const principal = new iam.AccountPrincipal('1234');
    // WHEN
    secret.grantRead(principal, ['FOO', 'bar']).assertSuccess();
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::ResourcePolicy', {
        ResourcePolicy: {
            Statement: [
                {
                    Action: [
                        'secretsmanager:GetSecretValue',
                        'secretsmanager:DescribeSecret',
                    ],
                    Effect: 'Allow',
                    Condition: {
                        'ForAnyValue:StringEquals': {
                            'secretsmanager:VersionStage': [
                                'FOO',
                                'bar',
                            ],
                        },
                    },
                    Principal: {
                        AWS: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {
                                        Ref: 'AWS::Partition',
                                    },
                                    ':iam::1234:root',
                                ],
                            ],
                        },
                    },
                    Resource: {
                        Ref: 'SecretA720EF05',
                    },
                },
            ],
            Version: '2012-10-17',
        },
        SecretId: {
            Ref: 'SecretA720EF05',
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
        KeyPolicy: {
            Statement: assertions_1.Match.arrayWith([{
                    Action: 'kms:Decrypt',
                    Condition: {
                        StringEquals: {
                            'kms:ViaService': {
                                'Fn::Join': [
                                    '',
                                    [
                                        'secretsmanager.',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        '.amazonaws.com',
                                    ],
                                ],
                            },
                        },
                    },
                    Effect: 'Allow',
                    Principal: {
                        AWS: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {
                                        Ref: 'AWS::Partition',
                                    },
                                    ':iam::1234:root',
                                ],
                            ],
                        },
                    },
                    Resource: '*',
                }]),
            Version: '2012-10-17',
        },
    });
});
test('grantRead with version label constraint', () => {
    // GIVEN
    const key = new kms.Key(stack, 'KMS');
    const secret = new secretsmanager.Secret(stack, 'Secret', { encryptionKey: key });
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountRootPrincipal() });
    // WHEN
    secret.grantRead(role, ['FOO', 'bar']);
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Version: '2012-10-17',
            Statement: [{
                    Action: [
                        'secretsmanager:GetSecretValue',
                        'secretsmanager:DescribeSecret',
                    ],
                    Effect: 'Allow',
                    Resource: { Ref: 'SecretA720EF05' },
                    Condition: {
                        'ForAnyValue:StringEquals': {
                            'secretsmanager:VersionStage': ['FOO', 'bar'],
                        },
                    },
                }],
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
        KeyPolicy: {
            Statement: assertions_1.Match.arrayWith([{
                    Action: 'kms:Decrypt',
                    Condition: {
                        StringEquals: {
                            'kms:ViaService': {
                                'Fn::Join': [
                                    '',
                                    [
                                        'secretsmanager.',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        '.amazonaws.com',
                                    ],
                                ],
                            },
                        },
                    },
                    Effect: 'Allow',
                    Principal: {
                        AWS: {
                            'Fn::GetAtt': [
                                'Role1ABCC5F0',
                                'Arn',
                            ],
                        },
                    },
                    Resource: '*',
                }]),
            Version: '2012-10-17',
        },
    });
});
test('grantWrite', () => {
    // GIVEN
    const secret = new secretsmanager.Secret(stack, 'Secret', {});
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountRootPrincipal() });
    // WHEN
    secret.grantWrite(role);
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Version: '2012-10-17',
            Statement: [{
                    Action: [
                        'secretsmanager:PutSecretValue',
                        'secretsmanager:UpdateSecret',
                    ],
                    Effect: 'Allow',
                    Resource: { Ref: 'SecretA720EF05' },
                }],
        },
    });
});
test('grantWrite with kms', () => {
    // GIVEN
    const key = new kms.Key(stack, 'KMS');
    const secret = new secretsmanager.Secret(stack, 'Secret', { encryptionKey: key });
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountRootPrincipal() });
    // WHEN
    secret.grantWrite(role);
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Version: '2012-10-17',
            Statement: [{
                    Action: [
                        'secretsmanager:PutSecretValue',
                        'secretsmanager:UpdateSecret',
                    ],
                    Effect: 'Allow',
                    Resource: { Ref: 'SecretA720EF05' },
                }],
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
        KeyPolicy: {
            Statement: assertions_1.Match.arrayWith([{
                    Action: [
                        'kms:Encrypt',
                        'kms:ReEncrypt*',
                        'kms:GenerateDataKey*',
                    ],
                    Condition: {
                        StringEquals: {
                            'kms:ViaService': {
                                'Fn::Join': [
                                    '',
                                    [
                                        'secretsmanager.',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        '.amazonaws.com',
                                    ],
                                ],
                            },
                        },
                    },
                    Effect: 'Allow',
                    Principal: {
                        AWS: {
                            'Fn::GetAtt': [
                                'Role1ABCC5F0',
                                'Arn',
                            ],
                        },
                    },
                    Resource: '*',
                }]),
        },
    });
});
test('secretValue', () => {
    // GIVEN
    const key = new kms.Key(stack, 'KMS');
    const secret = new secretsmanager.Secret(stack, 'Secret', { encryptionKey: key });
    // WHEN
    new cdk.CfnResource(stack, 'FakeResource', {
        type: 'CDK::Phony::Resource',
        properties: {
            value: secret.secretValue,
        },
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('CDK::Phony::Resource', {
        value: {
            'Fn::Join': ['', [
                    '{{resolve:secretsmanager:',
                    { Ref: 'SecretA720EF05' },
                    ':SecretString:::}}',
                ]],
        },
    });
});
describe('secretName', () => {
    test('selects the first two parts of the resource name when the name is auto-generated', () => {
        stack = new cdk.Stack();
        const secret = new secretsmanager.Secret(stack, 'Secret');
        new cdk.CfnOutput(stack, 'MySecretName', {
            value: secret.secretName,
        });
        const resourceName = { 'Fn::Select': [6, { 'Fn::Split': [':', { Ref: 'SecretA720EF05' }] }] };
        assertions_1.Template.fromStack(stack).hasOutput('MySecretName', {
            Value: {
                'Fn::Join': ['-', [
                        { 'Fn::Select': [0, { 'Fn::Split': ['-', resourceName] }] },
                        { 'Fn::Select': [1, { 'Fn::Split': ['-', resourceName] }] },
                    ]],
            },
        });
    });
    test('is simply the first segment when the provided secret name has no hyphens', () => {
        stack = new cdk.Stack();
        const secret = new secretsmanager.Secret(stack, 'Secret', { secretName: 'mySecret' });
        new cdk.CfnOutput(stack, 'MySecretName', {
            value: secret.secretName,
        });
        const resourceName = { 'Fn::Select': [6, { 'Fn::Split': [':', { Ref: 'SecretA720EF05' }] }] };
        assertions_1.Template.fromStack(stack).hasOutput('MySecretName', {
            Value: { 'Fn::Select': [0, { 'Fn::Split': ['-', resourceName] }] },
        });
    });
    function assertSegments(secret, segments) {
        new cdk.CfnOutput(stack, 'MySecretName', {
            value: secret.secretName,
        });
        const resourceName = { 'Fn::Select': [6, { 'Fn::Split': [':', { Ref: 'SecretA720EF05' }] }] };
        const secretNameSegments = [];
        for (let i = 0; i < segments; i++) {
            secretNameSegments.push({ 'Fn::Select': [i, { 'Fn::Split': ['-', resourceName] }] });
        }
        assertions_1.Template.fromStack(stack).hasOutput('MySecretName', {
            Value: { 'Fn::Join': ['-', secretNameSegments] },
        });
    }
    test('selects the 2 parts of the resource name when the secret name is provided', () => {
        stack = new cdk.Stack();
        const secret = new secretsmanager.Secret(stack, 'Secret', { secretName: 'my-secret' });
        assertSegments(secret, 2);
    });
    test('selects the 3 parts of the resource name when the secret name is provided', () => {
        stack = new cdk.Stack();
        const secret = new secretsmanager.Secret(stack, 'Secret', { secretName: 'my-secret-hyphenated' });
        assertSegments(secret, 3);
    });
    test('selects the 4 parts of the resource name when the secret name is provided', () => {
        stack = new cdk.Stack();
        const secret = new secretsmanager.Secret(stack, 'Secret', { secretName: 'my-secret-with-hyphens' });
        assertSegments(secret, 4);
    });
    test('uses existing Tokens as secret names as-is', () => {
        stack = new cdk.Stack();
        const secret1 = new secretsmanager.Secret(stack, 'Secret1');
        const secret2 = new secretsmanager.Secret(stack, 'Secret2', {
            secretName: secret1.secretName,
        });
        new cdk.CfnOutput(stack, 'MySecretName1', {
            value: secret1.secretName,
        });
        new cdk.CfnOutput(stack, 'MySecretName2', {
            value: secret2.secretName,
        });
        const outputs = assertions_1.Template.fromStack(stack).findOutputs('*');
        expect(outputs.MySecretName1).toEqual(outputs.MySecretName2);
    });
});
cdk_build_tools_1.testDeprecated('import by secretArn', () => {
    // GIVEN
    const secretArn = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret-f3gDy9';
    // WHEN
    const secret = secretsmanager.Secret.fromSecretArn(stack, 'Secret', secretArn);
    // THEN
    expect(secret.secretArn).toBe(secretArn);
    expect(secret.secretFullArn).toBe(secretArn);
    expect(secret.secretName).toBe('MySecret');
    expect(secret.encryptionKey).toBeUndefined();
    expect(stack.resolve(secret.secretValue)).toEqual(`{{resolve:secretsmanager:${secretArn}:SecretString:::}}`);
    expect(stack.resolve(secret.secretValueFromJson('password'))).toEqual(`{{resolve:secretsmanager:${secretArn}:SecretString:password::}}`);
});
test('import by secretArn throws if ARN is malformed', () => {
    // GIVEN
    const arnWithoutResourceName = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret';
    // WHEN
    expect(() => secretsmanager.Secret.fromSecretAttributes(stack, 'Secret1', {
        secretPartialArn: arnWithoutResourceName,
    })).toThrow(/invalid ARN format/);
});
cdk_build_tools_1.testDeprecated('import by secretArn supports secret ARNs without suffixes', () => {
    // GIVEN
    const arnWithoutSecretsManagerSuffix = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret';
    // WHEN
    const secret = secretsmanager.Secret.fromSecretArn(stack, 'Secret', arnWithoutSecretsManagerSuffix);
    // THEN
    expect(secret.secretArn).toBe(arnWithoutSecretsManagerSuffix);
    expect(secret.secretName).toBe('MySecret');
});
cdk_build_tools_1.testDeprecated('import by secretArn does not strip suffixes unless the suffix length is six', () => {
    // GIVEN
    const arnWith5CharacterSuffix = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:github-token';
    const arnWith6CharacterSuffix = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:github-token-f3gDy9';
    const arnWithMultiple6CharacterSuffix = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:github-token-f3gDy9-acb123';
    // THEN
    expect(secretsmanager.Secret.fromSecretArn(stack, 'Secret5', arnWith5CharacterSuffix).secretName).toEqual('github-token');
    expect(secretsmanager.Secret.fromSecretArn(stack, 'Secret6', arnWith6CharacterSuffix).secretName).toEqual('github-token');
    expect(secretsmanager.Secret.fromSecretArn(stack, 'Secret6Twice', arnWithMultiple6CharacterSuffix).secretName).toEqual('github-token-f3gDy9');
});
test('import by secretArn supports tokens for ARNs', () => {
    // GIVEN
    const stackA = new cdk.Stack(app, 'StackA');
    const stackB = new cdk.Stack(app, 'StackB');
    const secretA = new secretsmanager.Secret(stackA, 'SecretA');
    // WHEN
    const secretB = secretsmanager.Secret.fromSecretCompleteArn(stackB, 'SecretB', secretA.secretArn);
    new cdk.CfnOutput(stackB, 'secretBSecretName', { value: secretB.secretName });
    // THEN
    expect(secretB.secretArn).toBe(secretA.secretArn);
    assertions_1.Template.fromStack(stackB).hasOutput('secretBSecretName', {
        Value: { 'Fn::Select': [6, { 'Fn::Split': [':', { 'Fn::ImportValue': 'StackA:ExportsOutputRefSecretA188F281703FC8A52' }] }] },
    });
});
cdk_build_tools_1.testDeprecated('import by secretArn guesses at complete or partial ARN', () => {
    // GIVEN
    const secretArnWithSuffix = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret-f3gDy9';
    const secretArnWithoutSuffix = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret';
    // WHEN
    const secretWithCompleteArn = secretsmanager.Secret.fromSecretArn(stack, 'SecretWith', secretArnWithSuffix);
    const secretWithoutCompleteArn = secretsmanager.Secret.fromSecretArn(stack, 'SecretWithout', secretArnWithoutSuffix);
    // THEN
    expect(secretWithCompleteArn.secretFullArn).toEqual(secretArnWithSuffix);
    expect(secretWithoutCompleteArn.secretFullArn).toBeUndefined();
});
test('fromSecretCompleteArn', () => {
    // GIVEN
    const secretArn = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret-f3gDy9';
    // WHEN
    const secret = secretsmanager.Secret.fromSecretCompleteArn(stack, 'Secret', secretArn);
    // THEN
    expect(secret.secretArn).toBe(secretArn);
    expect(secret.secretFullArn).toBe(secretArn);
    expect(secret.secretName).toBe('MySecret');
    expect(secret.encryptionKey).toBeUndefined();
    expect(stack.resolve(secret.secretValue)).toEqual(`{{resolve:secretsmanager:${secretArn}:SecretString:::}}`);
    expect(stack.resolve(secret.secretValueFromJson('password'))).toEqual(`{{resolve:secretsmanager:${secretArn}:SecretString:password::}}`);
});
test('fromSecretCompleteArn - grants', () => {
    // GIVEN
    const secretArn = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret-f3gDy9';
    const secret = secretsmanager.Secret.fromSecretCompleteArn(stack, 'Secret', secretArn);
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountRootPrincipal() });
    // WHEN
    secret.grantRead(role);
    secret.grantWrite(role);
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Version: '2012-10-17',
            Statement: [{
                    Action: [
                        'secretsmanager:GetSecretValue',
                        'secretsmanager:DescribeSecret',
                    ],
                    Effect: 'Allow',
                    Resource: secretArn,
                },
                {
                    Action: [
                        'secretsmanager:PutSecretValue',
                        'secretsmanager:UpdateSecret',
                    ],
                    Effect: 'Allow',
                    Resource: secretArn,
                }],
        },
    });
});
test('fromSecretCompleteArn - can be assigned to a property with type number', () => {
    // GIVEN
    const secretArn = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret-f3gDy9';
    const secret = secretsmanager.Secret.fromSecretCompleteArn(stack, 'Secret', secretArn);
    // WHEN
    new lambda.Function(stack, 'MyFunction', {
        code: lambda.Code.fromInline('foo'),
        handler: 'bar',
        runtime: lambda.Runtime.NODEJS,
        memorySize: cdk.Token.asNumber(secret.secretValueFromJson('LambdaFunctionMemorySize')),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        MemorySize: `{{resolve:secretsmanager:${secretArn}:SecretString:LambdaFunctionMemorySize::}}`,
    });
});
test('fromSecretPartialArn', () => {
    // GIVEN
    const secretArn = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret';
    // WHEN
    const secret = secretsmanager.Secret.fromSecretPartialArn(stack, 'Secret', secretArn);
    // THEN
    expect(secret.secretArn).toBe(secretArn);
    expect(secret.secretFullArn).toBeUndefined();
    expect(secret.secretName).toBe('MySecret');
    expect(secret.encryptionKey).toBeUndefined();
    expect(stack.resolve(secret.secretValue)).toEqual(`{{resolve:secretsmanager:${secretArn}:SecretString:::}}`);
    expect(stack.resolve(secret.secretValueFromJson('password'))).toEqual(`{{resolve:secretsmanager:${secretArn}:SecretString:password::}}`);
});
test('fromSecretPartialArn - grants', () => {
    // GIVEN
    const secretArn = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret';
    const secret = secretsmanager.Secret.fromSecretPartialArn(stack, 'Secret', secretArn);
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountRootPrincipal() });
    // WHEN
    secret.grantRead(role);
    secret.grantWrite(role);
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Version: '2012-10-17',
            Statement: [{
                    Action: [
                        'secretsmanager:GetSecretValue',
                        'secretsmanager:DescribeSecret',
                    ],
                    Effect: 'Allow',
                    Resource: `${secretArn}-??????`,
                },
                {
                    Action: [
                        'secretsmanager:PutSecretValue',
                        'secretsmanager:UpdateSecret',
                    ],
                    Effect: 'Allow',
                    Resource: `${secretArn}-??????`,
                }],
        },
    });
});
describe('fromSecretAttributes', () => {
    test('import by attributes', () => {
        // GIVEN
        const encryptionKey = new kms.Key(stack, 'KMS');
        const secretArn = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret-f3gDy9';
        // WHEN
        const secret = secretsmanager.Secret.fromSecretAttributes(stack, 'Secret', {
            secretCompleteArn: secretArn, encryptionKey,
        });
        // THEN
        expect(secret.secretArn).toBe(secretArn);
        expect(secret.secretFullArn).toBe(secretArn);
        expect(secret.secretName).toBe('MySecret');
        expect(secret.encryptionKey).toBe(encryptionKey);
        expect(stack.resolve(secret.secretValue)).toBe(`{{resolve:secretsmanager:${secretArn}:SecretString:::}}`);
        expect(stack.resolve(secret.secretValueFromJson('password'))).toBe(`{{resolve:secretsmanager:${secretArn}:SecretString:password::}}`);
    });
    cdk_build_tools_1.testDeprecated('throws if secretArn and either secretCompleteArn or secretPartialArn are provided', () => {
        const secretArn = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret-f3gDy9';
        const error = /cannot use `secretArn` with `secretCompleteArn` or `secretPartialArn`/;
        expect(() => secretsmanager.Secret.fromSecretAttributes(stack, 'Secret', {
            secretArn,
            secretCompleteArn: secretArn,
        })).toThrow(error);
        expect(() => secretsmanager.Secret.fromSecretAttributes(stack, 'Secret', {
            secretArn,
            secretPartialArn: secretArn,
        })).toThrow(error);
    });
    test('throws if no ARN is provided', () => {
        expect(() => secretsmanager.Secret.fromSecretAttributes(stack, 'Secret', {})).toThrow(/must use only one of `secretCompleteArn` or `secretPartialArn`/);
    });
    test('throws if both complete and partial ARNs are provided', () => {
        const secretArn = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret-f3gDy9';
        expect(() => secretsmanager.Secret.fromSecretAttributes(stack, 'Secret', {
            secretPartialArn: secretArn,
            secretCompleteArn: secretArn,
        })).toThrow(/must use only one of `secretCompleteArn` or `secretPartialArn`/);
    });
    test('throws if secretCompleteArn is not complete', () => {
        expect(() => secretsmanager.Secret.fromSecretAttributes(stack, 'Secret', {
            secretCompleteArn: 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret',
        })).toThrow(/does not appear to be complete/);
    });
    test('parses environment from secretArn', () => {
        // GIVEN
        const secretAccount = '222222222222';
        // WHEN
        const secret = secretsmanager.Secret.fromSecretAttributes(stack, 'Secret', {
            secretCompleteArn: `arn:aws:secretsmanager:eu-west-1:${secretAccount}:secret:MySecret-f3gDy9`,
        });
        // THEN
        expect(secret.env.account).toBe(secretAccount);
    });
});
cdk_build_tools_1.testDeprecated('import by secret name', () => {
    // GIVEN
    const secretName = 'MySecret';
    // WHEN
    const secret = secretsmanager.Secret.fromSecretName(stack, 'Secret', secretName);
    // THEN
    expect(secret.secretArn).toBe(secretName);
    expect(secret.secretName).toBe(secretName);
    expect(secret.secretFullArn).toBeUndefined();
    expect(stack.resolve(secret.secretValue)).toBe(`{{resolve:secretsmanager:${secretName}:SecretString:::}}`);
    expect(stack.resolve(secret.secretValueFromJson('password'))).toBe(`{{resolve:secretsmanager:${secretName}:SecretString:password::}}`);
});
cdk_build_tools_1.testDeprecated('import by secret name with grants', () => {
    // GIVEN
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountRootPrincipal() });
    const secret = secretsmanager.Secret.fromSecretName(stack, 'Secret', 'MySecret');
    // WHEN
    secret.grantRead(role);
    secret.grantWrite(role);
    // THEN
    const expectedSecretReference = {
        'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':secretsmanager:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':secret:MySecret*',
            ]],
    };
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Version: '2012-10-17',
            Statement: [{
                    Action: [
                        'secretsmanager:GetSecretValue',
                        'secretsmanager:DescribeSecret',
                    ],
                    Effect: 'Allow',
                    Resource: expectedSecretReference,
                },
                {
                    Action: [
                        'secretsmanager:PutSecretValue',
                        'secretsmanager:UpdateSecret',
                    ],
                    Effect: 'Allow',
                    Resource: expectedSecretReference,
                }],
        },
    });
});
test('import by secret name v2', () => {
    // GIVEN
    const secretName = 'MySecret';
    // WHEN
    const secret = secretsmanager.Secret.fromSecretNameV2(stack, 'Secret', secretName);
    // THEN
    expect(secret.secretArn).toBe(`arn:${stack.partition}:secretsmanager:${stack.region}:${stack.account}:secret:MySecret`);
    expect(secret.secretName).toBe(secretName);
    expect(secret.secretFullArn).toBeUndefined();
    expect(stack.resolve(secret.secretValue)).toEqual({
        'Fn::Join': ['', [
                '{{resolve:secretsmanager:arn:',
                { Ref: 'AWS::Partition' },
                ':secretsmanager:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':secret:MySecret:SecretString:::}}',
            ]],
    });
});
test('import by secret name v2 with grants', () => {
    // GIVEN
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountRootPrincipal() });
    const secret = secretsmanager.Secret.fromSecretNameV2(stack, 'Secret', 'MySecret');
    // WHEN
    secret.grantRead(role);
    secret.grantWrite(role);
    // THEN
    const expectedSecretReference = {
        'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':secretsmanager:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':secret:MySecret-??????',
            ]],
    };
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Version: '2012-10-17',
            Statement: [{
                    Action: [
                        'secretsmanager:GetSecretValue',
                        'secretsmanager:DescribeSecret',
                    ],
                    Effect: 'Allow',
                    Resource: expectedSecretReference,
                },
                {
                    Action: [
                        'secretsmanager:PutSecretValue',
                        'secretsmanager:UpdateSecret',
                    ],
                    Effect: 'Allow',
                    Resource: expectedSecretReference,
                }],
        },
    });
});
test('can attach a secret with attach()', () => {
    // GIVEN
    const secret = new secretsmanager.Secret(stack, 'Secret');
    // WHEN
    secret.attach({
        asSecretAttachmentTarget: () => ({
            targetId: 'target-id',
            targetType: secretsmanager.AttachmentTargetType.DOCDB_DB_INSTANCE,
        }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::SecretTargetAttachment', {
        SecretId: {
            Ref: 'SecretA720EF05',
        },
        TargetId: 'target-id',
        TargetType: 'AWS::DocDB::DBInstance',
    });
});
test('throws when trying to attach a target multiple times to a secret', () => {
    // GIVEN
    const secret = new secretsmanager.Secret(stack, 'Secret');
    const target = {
        asSecretAttachmentTarget: () => ({
            targetId: 'target-id',
            targetType: secretsmanager.AttachmentTargetType.DOCDB_DB_INSTANCE,
        }),
    };
    secret.attach(target);
    // THEN
    expect(() => secret.attach(target)).toThrow(/Secret is already attached to a target/);
});
test('add a rotation schedule to an attached secret', () => {
    // GIVEN
    const secret = new secretsmanager.Secret(stack, 'Secret');
    const attachedSecret = secret.attach({
        asSecretAttachmentTarget: () => ({
            targetId: 'target-id',
            targetType: secretsmanager.AttachmentTargetType.DOCDB_DB_INSTANCE,
        }),
    });
    const rotationLambda = new lambda.Function(stack, 'Lambda', {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromInline('export.handler = event => event;'),
        handler: 'index.handler',
    });
    // WHEN
    attachedSecret.addRotationSchedule('RotationSchedule', {
        rotationLambda,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
        SecretId: {
            Ref: 'SecretAttachment2E1B7C3B',
        },
    });
});
test('throws when specifying secretStringTemplate but not generateStringKey', () => {
    expect(() => new secretsmanager.Secret(stack, 'Secret', {
        generateSecretString: {
            secretStringTemplate: JSON.stringify({ username: 'username' }),
        },
    })).toThrow(/`secretStringTemplate`.+`generateStringKey`/);
});
test('throws when specifying generateStringKey but not secretStringTemplate', () => {
    expect(() => new secretsmanager.Secret(stack, 'Secret', {
        generateSecretString: {
            generateStringKey: 'password',
        },
    })).toThrow(/`secretStringTemplate`.+`generateStringKey`/);
});
test('equivalence of SecretValue and Secret.fromSecretAttributes', () => {
    // GIVEN
    const secretArn = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret-f3gDy9';
    // WHEN
    const imported = secretsmanager.Secret.fromSecretAttributes(stack, 'Imported', { secretCompleteArn: secretArn }).secretValueFromJson('password');
    const value = cdk.SecretValue.secretsManager(secretArn, { jsonField: 'password' });
    // THEN
    expect(stack.resolve(imported)).toEqual(stack.resolve(value));
});
test('can add to the resource policy of a secret', () => {
    // GIVEN
    const secret = new secretsmanager.Secret(stack, 'Secret');
    // WHEN
    secret.addToResourcePolicy(new iam.PolicyStatement({
        actions: ['secretsmanager:GetSecretValue'],
        resources: ['*'],
        principals: [new iam.ArnPrincipal('arn:aws:iam::123456789012:user/cool-user')],
    }));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::ResourcePolicy', {
        ResourcePolicy: {
            Statement: [
                {
                    Action: 'secretsmanager:GetSecretValue',
                    Effect: 'Allow',
                    Principal: {
                        AWS: 'arn:aws:iam::123456789012:user/cool-user',
                    },
                    Resource: '*',
                },
            ],
            Version: '2012-10-17',
        },
        SecretId: {
            Ref: 'SecretA720EF05',
        },
    });
});
test('fails if secret policy has no actions', () => {
    // GIVEN
    stack = new cdk.Stack(app, 'my-stack');
    const secret = new secretsmanager.Secret(stack, 'Secret');
    // WHEN
    secret.addToResourcePolicy(new iam.PolicyStatement({
        resources: ['*'],
        principals: [new iam.ArnPrincipal('arn')],
    }));
    // THEN
    expect(() => app.synth()).toThrow(/A PolicyStatement must specify at least one \'action\' or \'notAction\'/);
});
test('fails if secret policy has no IAM principals', () => {
    // GIVEN
    stack = new cdk.Stack(app, 'my-stack');
    const secret = new secretsmanager.Secret(stack, 'Secret');
    // WHEN
    secret.addToResourcePolicy(new iam.PolicyStatement({
        resources: ['*'],
        actions: ['secretsmanager:*'],
    }));
    // THEN
    expect(() => app.synth()).toThrow(/A PolicyStatement used in a resource-based policy must specify at least one IAM principal/);
});
test('with replication regions', () => {
    // WHEN
    const secret = new secretsmanager.Secret(stack, 'Secret', {
        replicaRegions: [{ region: 'eu-west-1' }],
    });
    secret.addReplicaRegion('eu-central-1', kms.Key.fromKeyArn(stack, 'Key', 'arn:aws:kms:eu-central-1:123456789012:key/my-key-id'));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
        ReplicaRegions: [
            { Region: 'eu-west-1' },
            {
                KmsKeyId: 'arn:aws:kms:eu-central-1:123456789012:key/my-key-id',
                Region: 'eu-central-1',
            },
        ],
    });
});
describe('secretObjectValue', () => {
    test('can be used with a mixture of plain text and SecretValue', () => {
        const user = new iam.User(stack, 'User');
        const accessKey = new iam.AccessKey(stack, 'MyKey', { user });
        new secretsmanager.Secret(stack, 'Secret', {
            secretObjectValue: {
                username: cdk.SecretValue.unsafePlainText('username'),
                password: accessKey.secretAccessKey,
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
            GenerateSecretString: assertions_1.Match.absent(),
            SecretString: {
                'Fn::Join': [
                    '',
                    [
                        '{"username":"username","password":"',
                        { 'Fn::GetAtt': ['MyKey6AB29FA6', 'SecretAccessKey'] },
                        '"}',
                    ],
                ],
            },
        });
    });
    test('can be used with a mixture of plain text and SecretValue, with feature flag', () => {
        const featureStack = new cdk.Stack();
        featureStack.node.setContext('@aws-cdk/core:checkSecretUsage', true);
        const user = new iam.User(featureStack, 'User');
        const accessKey = new iam.AccessKey(featureStack, 'MyKey', { user });
        new secretsmanager.Secret(featureStack, 'Secret', {
            secretObjectValue: {
                username: cdk.SecretValue.unsafePlainText('username'),
                password: accessKey.secretAccessKey,
            },
        });
        assertions_1.Template.fromStack(featureStack).hasResourceProperties('AWS::SecretsManager::Secret', {
            GenerateSecretString: assertions_1.Match.absent(),
            SecretString: {
                'Fn::Join': [
                    '',
                    [
                        '{"username":"username","password":"',
                        { 'Fn::GetAtt': ['MyKey6AB29FA6', 'SecretAccessKey'] },
                        '"}',
                    ],
                ],
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjcmV0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZWNyZXQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLDhDQUE4QztBQUM5Qyw4REFBMEQ7QUFDMUQscUNBQXFDO0FBQ3JDLHlDQUF5QztBQUV6QyxJQUFJLEdBQVksQ0FBQztBQUNqQixJQUFJLEtBQWdCLENBQUM7QUFDckIsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNwQixLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRTtJQUMxQixPQUFPO0lBQ1AsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUUzQyxPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsNkJBQTZCLEVBQUU7UUFDN0Usb0JBQW9CLEVBQUUsRUFBRTtLQUN6QixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUU7SUFDdkMsT0FBTztJQUNQLElBQUksY0FBYyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1FBQ3pDLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU07S0FDeEMsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyw2QkFBNkIsRUFBRTtRQUNuRSxjQUFjLEVBQUUsUUFBUTtLQUN6QixDQUFDLENBQUM7QUFDTCxDQUFD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QUUsUUFBUSxFQUFFO1lBQ2hELGlCQUFpQixFQUFFO2dCQUNqQixRQUFRLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDO2dCQUNyRCxRQUFRLEVBQUUsU0FBUyxDQUFDLGVBQWU7YUFDcEM7U0FDRixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw2QkFBNkIsRUFBRTtZQUNwRixvQkFBb0IsRUFBRSxrQkFBSyxDQUFDLE1BQU0sRUFBRTtZQUNwQyxZQUFZLEVBQUU7Z0JBQ1osVUFBVSxFQUFFO29CQUNWLEVBQUU7b0JBQ0Y7d0JBQ0UscUNBQXFDO3dCQUNyQyxFQUFFLFlBQVksRUFBRSxDQUFDLGVBQWUsRUFBRSxpQkFBaUIsQ0FBQyxFQUFFO3dCQUN0RCxJQUFJO3FCQUNMO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBzZWNyZXRzbWFuYWdlciBmcm9tICcuLi9saWInO1xuXG5sZXQgYXBwOiBjZGsuQXBwO1xubGV0IHN0YWNrOiBjZGsuU3RhY2s7XG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XG59KTtcblxudGVzdCgnZGVmYXVsdCBzZWNyZXQnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VjcmV0c01hbmFnZXI6OlNlY3JldCcsIHtcbiAgICBHZW5lcmF0ZVNlY3JldFN0cmluZzoge30sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3NldCByZW1vdmFsUG9saWN5IHRvIHNlY3JldCcsICgpID0+IHtcbiAgLy8gV0hFTlxuICBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnU2VjcmV0Jywge1xuICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LlJFVEFJTixcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OlNlY3JldHNNYW5hZ2VyOjpTZWNyZXQnLCB7XG4gICAgRGVsZXRpb25Qb2xpY3k6ICdSZXRhaW4nLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdzZWNyZXQgd2l0aCBrbXMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnS01TJyk7XG5cbiAgLy8gV0hFTlxuICBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnU2VjcmV0JywgeyBlbmNyeXB0aW9uS2V5OiBrZXkgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICBLZXlQb2xpY3k6IHtcbiAgICAgIFN0YXRlbWVudDogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAge1xuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgICAgICdrbXM6RW5jcnlwdCcsXG4gICAgICAgICAgICAna21zOlJlRW5jcnlwdConLFxuICAgICAgICAgICAgJ2ttczpHZW5lcmF0ZURhdGFLZXkqJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgQVdTOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOmlhbTo6JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6cm9vdCcsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgIFN0cmluZ0VxdWFsczoge1xuICAgICAgICAgICAgICAna21zOlZpYVNlcnZpY2UnOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICdzZWNyZXRzbWFuYWdlci4nLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAna21zOkNyZWF0ZUdyYW50JyxcbiAgICAgICAgICAgICdrbXM6RGVzY3JpYmVLZXknLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICBBV1M6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6aWFtOjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzpyb290JyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAgICdrbXM6VmlhU2VydmljZSc6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ3NlY3JldHNtYW5hZ2VyLicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICcuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdKSxcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdzZWNyZXQgd2l0aCBnZW5lcmF0ZSBzZWNyZXQgc3RyaW5nIG9wdGlvbnMnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcsIHtcbiAgICBnZW5lcmF0ZVNlY3JldFN0cmluZzoge1xuICAgICAgZXhjbHVkZVVwcGVyY2FzZTogdHJ1ZSxcbiAgICAgIHBhc3N3b3JkTGVuZ3RoOiAyMCxcbiAgICB9LFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNlY3JldHNNYW5hZ2VyOjpTZWNyZXQnLCB7XG4gICAgR2VuZXJhdGVTZWNyZXRTdHJpbmc6IHtcbiAgICAgIEV4Y2x1ZGVVcHBlcmNhc2U6IHRydWUsXG4gICAgICBQYXNzd29yZExlbmd0aDogMjAsXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgndGVtcGxhdGVkIHNlY3JldCBzdHJpbmcnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcsIHtcbiAgICBnZW5lcmF0ZVNlY3JldFN0cmluZzoge1xuICAgICAgc2VjcmV0U3RyaW5nVGVtcGxhdGU6IEpTT04uc3RyaW5naWZ5KHsgdXNlcm5hbWU6ICd1c2VybmFtZScgfSksXG4gICAgICBnZW5lcmF0ZVN0cmluZ0tleTogJ3Bhc3N3b3JkJyxcbiAgICB9LFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNlY3JldHNNYW5hZ2VyOjpTZWNyZXQnLCB7XG4gICAgR2VuZXJhdGVTZWNyZXRTdHJpbmc6IHtcbiAgICAgIFNlY3JldFN0cmluZ1RlbXBsYXRlOiAne1widXNlcm5hbWVcIjpcInVzZXJuYW1lXCJ9JyxcbiAgICAgIEdlbmVyYXRlU3RyaW5nS2V5OiAncGFzc3dvcmQnLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdzZWNyZXRTdHJpbmdCZXRhMScsICgpID0+IHtcbiAgbGV0IHVzZXI6IGlhbS5Vc2VyO1xuICBsZXQgYWNjZXNzS2V5OiBpYW0uQWNjZXNzS2V5O1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdVc2VyJyk7XG4gICAgYWNjZXNzS2V5ID0gbmV3IGlhbS5BY2Nlc3NLZXkoc3RhY2ssICdNeUtleScsIHsgdXNlciB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2Zyb21VbnNhZmVQbGFpbnRleHQgYWxsb3dzIHNwZWNpZnlpbmcgYSBwbGFpbnRleHQgc3RyaW5nJywgKCkgPT4ge1xuICAgIG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQoc3RhY2ssICdTZWNyZXQnLCB7XG4gICAgICBzZWNyZXRTdHJpbmdCZXRhMTogc2VjcmV0c21hbmFnZXIuU2VjcmV0U3RyaW5nVmFsdWVCZXRhMS5mcm9tVW5zYWZlUGxhaW50ZXh0KCd1bnNhZmVQQCQkJyksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTZWNyZXRzTWFuYWdlcjo6U2VjcmV0Jywge1xuICAgICAgR2VuZXJhdGVTZWNyZXRTdHJpbmc6IE1hdGNoLmFic2VudCgpLFxuICAgICAgU2VjcmV0U3RyaW5nOiAndW5zYWZlUEAkJCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCd0b1Rva2VuIHRocm93cyB3aGVuIHByb3ZpZGVkIGFuIHVuc2FmZSBwbGFpbnRleHQgc3RyaW5nJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnU2VjcmV0Jywge1xuICAgICAgc2VjcmV0U3RyaW5nQmV0YTE6IHNlY3JldHNtYW5hZ2VyLlNlY3JldFN0cmluZ1ZhbHVlQmV0YTEuZnJvbVRva2VuKCd1bnNhZmVQQCQkJyksXG4gICAgfSkpLnRvVGhyb3coL2FwcGVhcnMgdG8gYmUgcGxhaW50ZXh0Lyk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCd0b1Rva2VuIGFsbG93cyByZWZlcmVuY2luZyBhIGNvbnN0cnVjdCBhdHRyaWJ1dGUnLCAoKSA9PiB7XG4gICAgbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcsIHtcbiAgICAgIHNlY3JldFN0cmluZ0JldGExOiBzZWNyZXRzbWFuYWdlci5TZWNyZXRTdHJpbmdWYWx1ZUJldGExLmZyb21Ub2tlbihhY2Nlc3NLZXkuc2VjcmV0QWNjZXNzS2V5LnRvU3RyaW5nKCkpLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VjcmV0c01hbmFnZXI6OlNlY3JldCcsIHtcbiAgICAgIEdlbmVyYXRlU2VjcmV0U3RyaW5nOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgIFNlY3JldFN0cmluZzogeyAnRm46OkdldEF0dCc6IFsnTXlLZXk2QUIyOUZBNicsICdTZWNyZXRBY2Nlc3NLZXknXSB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgndG9Ub2tlbiBhbGxvd3MgcmVmZXJlbmNpbmcgYSBjb25zdHJ1Y3QgYXR0cmlidXRlIGluIG5lc3RlZCBKU09OJywgKCkgPT4ge1xuICAgIGNvbnN0IHNlY3JldFN0cmluZyA9IHNlY3JldHNtYW5hZ2VyLlNlY3JldFN0cmluZ1ZhbHVlQmV0YTEuZnJvbVRva2VuKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGtleTogYWNjZXNzS2V5LnNlY3JldEFjY2Vzc0tleS50b1N0cmluZygpLFxuICAgICAgdXNlcm5hbWU6ICdteVVzZXInLFxuICAgIH0pKTtcbiAgICBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnU2VjcmV0Jywge1xuICAgICAgc2VjcmV0U3RyaW5nQmV0YTE6IHNlY3JldFN0cmluZyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNlY3JldHNNYW5hZ2VyOjpTZWNyZXQnLCB7XG4gICAgICBHZW5lcmF0ZVNlY3JldFN0cmluZzogTWF0Y2guYWJzZW50KCksXG4gICAgICBTZWNyZXRTdHJpbmc6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICd7XCJrZXlcIjpcIicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdNeUtleTZBQjI5RkE2JyxcbiAgICAgICAgICAgICAgICAnU2VjcmV0QWNjZXNzS2V5JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXCIsXCJ1c2VybmFtZVwiOlwibXlVc2VyXCJ9JyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ3RvVG9rZW4gdGhyb3dzIGlmIHByb3ZpZGVkIGEgcmVzb2x2ZWQgdG9rZW4nLCAoKSA9PiB7XG4gICAgLy8gTk9URSAtIFRoaXMgaXMgYWN0dWFsbHkgbm90IGRlc2lyZWQgYmVoYXZpb3IsIGJ1dCB0aGUgc2ltcGxlIGAhVG9rZW4uaXNVbnJlc29sdmVkYFxuICAgIC8vIGNoZWNrIGlzIHRoZSBzaW1wbGVzdCBhbmQgbW9zdCBjb25zaXN0ZW50IHRvIGltcGxlbWVudC4gQ292ZXJpbmcgdGhpcyBlZGdlIGNhc2Ugb2ZcbiAgICAvLyBhIHJlc29sdmVkIFRva2VuIHJlcHJlc2VudGluZyBhIFJlZi9Gbjo6R2V0QXR0IGlzIG91dCBvZiBzY29wZSBmb3IgdGhpcyBpbml0aWFsIHBhc3MuXG4gICAgY29uc3Qgc2VjcmV0S2V5ID0gc3RhY2sucmVzb2x2ZShhY2Nlc3NLZXkuc2VjcmV0QWNjZXNzS2V5KTtcbiAgICBleHBlY3QoKCkgPT4gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcsIHtcbiAgICAgIHNlY3JldFN0cmluZ0JldGExOiBzZWNyZXRzbWFuYWdlci5TZWNyZXRTdHJpbmdWYWx1ZUJldGExLmZyb21Ub2tlbihzZWNyZXRLZXkpLFxuICAgIH0pKS50b1Rocm93KC9hcHBlYXJzIHRvIGJlIHBsYWludGV4dC8pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgndGhyb3dzIGlmIGJvdGggZ2VuZXJhdGVTZWNyZXRTdHJpbmcgYW5kIHNlY3JldFN0cmluZ0JldGExIGFyZSBwcm92aWRlZCcsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcsIHtcbiAgICAgIGdlbmVyYXRlU2VjcmV0U3RyaW5nOiB7XG4gICAgICAgIGdlbmVyYXRlU3RyaW5nS2V5OiAndXNlcm5hbWUnLFxuICAgICAgICBzZWNyZXRTdHJpbmdUZW1wbGF0ZTogSlNPTi5zdHJpbmdpZnkoeyB1c2VybmFtZTogJ3VzZXJuYW1lJyB9KSxcbiAgICAgIH0sXG4gICAgICBzZWNyZXRTdHJpbmdCZXRhMTogc2VjcmV0c21hbmFnZXIuU2VjcmV0U3RyaW5nVmFsdWVCZXRhMS5mcm9tVG9rZW4oYWNjZXNzS2V5LnNlY3JldEFjY2Vzc0tleS50b1N0cmluZygpKSxcbiAgICB9KSkudG9UaHJvdygvQ2Fubm90IHNwZWNpZnkvKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3NlY3JldFN0cmluZ1ZhbHVlJywgKCkgPT4ge1xuICB0ZXN0KCdjYW4gcmVmZXJlbmNlIGFuIElBTSB1c2VyIGFjY2VzcyBrZXknLCAoKSA9PiB7XG4gICAgY29uc3QgdXNlciA9IG5ldyBpYW0uVXNlcihzdGFjaywgJ1VzZXInKTtcbiAgICBjb25zdCBhY2Nlc3NLZXkgPSBuZXcgaWFtLkFjY2Vzc0tleShzdGFjaywgJ015S2V5JywgeyB1c2VyIH0pO1xuXG4gICAgbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcsIHtcbiAgICAgIHNlY3JldFN0cmluZ1ZhbHVlOiBhY2Nlc3NLZXkuc2VjcmV0QWNjZXNzS2V5LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VjcmV0c01hbmFnZXI6OlNlY3JldCcsIHtcbiAgICAgIEdlbmVyYXRlU2VjcmV0U3RyaW5nOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgIFNlY3JldFN0cmluZzogeyAnRm46OkdldEF0dCc6IFsnTXlLZXk2QUIyOUZBNicsICdTZWNyZXRBY2Nlc3NLZXknXSB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG50ZXN0KCdncmFudFJlYWQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQoc3RhY2ssICdTZWNyZXQnKTtcbiAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7IGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpIH0pO1xuXG4gIC8vIFdIRU5cbiAgc2VjcmV0LmdyYW50UmVhZChyb2xlKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICBTdGF0ZW1lbnQ6IFt7XG4gICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICdzZWNyZXRzbWFuYWdlcjpHZXRTZWNyZXRWYWx1ZScsXG4gICAgICAgICAgJ3NlY3JldHNtYW5hZ2VyOkRlc2NyaWJlU2VjcmV0JyxcbiAgICAgICAgXSxcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBSZXNvdXJjZTogeyBSZWY6ICdTZWNyZXRBNzIwRUYwNScgfSxcbiAgICAgIH1dLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ0Vycm9yIHdoZW4gZ3JhbnRSZWFkIHdpdGggZGlmZmVyZW50IHJvbGUgYW5kIG5vIEtNUycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgdGVzdFN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdUZXN0U3RhY2snLCB7XG4gICAgZW52OiB7XG4gICAgICBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyxcbiAgICB9LFxuICB9KTtcbiAgY29uc3Qgc2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldCh0ZXN0U3RhY2ssICdTZWNyZXQnKTtcbiAgY29uc3Qgcm9sZSA9IGlhbS5Sb2xlLmZyb21Sb2xlQXJuKHRlc3RTdGFjaywgJ1JvbGVGcm9tQXJuJywgJ2Fybjphd3M6aWFtOjoxMTExMTExMTExMTE6cm9sZS9Tb21lUm9sZScpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IHtcbiAgICBzZWNyZXQuZ3JhbnRSZWFkKHJvbGUpO1xuICB9KS50b1Rocm93RXJyb3IoJ0tNUyBLZXkgbXVzdCBiZSBwcm92aWRlZCBmb3IgY3Jvc3MgYWNjb3VudCBhY2Nlc3MgdG8gU2VjcmV0Jyk7XG59KTtcblxudGVzdCgnZ3JhbnRSZWFkIHdpdGggS01TIEtleScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdLTVMnKTtcbiAgY29uc3Qgc2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcsIHsgZW5jcnlwdGlvbktleToga2V5IH0pO1xuICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHsgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCkgfSk7XG5cbiAgLy8gV0hFTlxuICBzZWNyZXQuZ3JhbnRSZWFkKHJvbGUpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIFN0YXRlbWVudDogW3tcbiAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJyxcbiAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6RGVzY3JpYmVTZWNyZXQnLFxuICAgICAgICBdLFxuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFJlc291cmNlOiB7IFJlZjogJ1NlY3JldEE3MjBFRjA1JyB9LFxuICAgICAgfV0sXG4gICAgfSxcbiAgfSk7XG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktNUzo6S2V5Jywge1xuICAgIEtleVBvbGljeToge1xuICAgICAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICB7XG4gICAgICAgICAgQWN0aW9uOiAna21zOkRlY3J5cHQnLFxuICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAgICdrbXM6VmlhU2VydmljZSc6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ3NlY3JldHNtYW5hZ2VyLicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICcuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgQVdTOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdSb2xlMUFCQ0M1RjAnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgIH0sXG4gICAgICBdKSxcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdncmFudFJlYWQgY3Jvc3MgYWNjb3VudCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdLTVMnKTtcbiAgY29uc3Qgc2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcsIHsgZW5jcnlwdGlvbktleToga2V5IH0pO1xuICBjb25zdCBwcmluY2lwYWwgPSBuZXcgaWFtLkFjY291bnRQcmluY2lwYWwoJzEyMzQnKTtcblxuICAvLyBXSEVOXG4gIHNlY3JldC5ncmFudFJlYWQocHJpbmNpcGFsLCBbJ0ZPTycsICdiYXInXSkuYXNzZXJ0U3VjY2VzcygpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VjcmV0c01hbmFnZXI6OlJlc291cmNlUG9saWN5Jywge1xuICAgIFJlc291cmNlUG9saWN5OiB7XG4gICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJyxcbiAgICAgICAgICAgICdzZWNyZXRzbWFuYWdlcjpEZXNjcmliZVNlY3JldCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAnRm9yQW55VmFsdWU6U3RyaW5nRXF1YWxzJzoge1xuICAgICAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6VmVyc2lvblN0YWdlJzogW1xuICAgICAgICAgICAgICAgICdGT08nLFxuICAgICAgICAgICAgICAgICdiYXInLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgQVdTOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOmlhbTo6MTIzNDpyb290JyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICBSZWY6ICdTZWNyZXRBNzIwRUYwNScsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgfSxcbiAgICBTZWNyZXRJZDoge1xuICAgICAgUmVmOiAnU2VjcmV0QTcyMEVGMDUnLFxuICAgIH0sXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktNUzo6S2V5Jywge1xuICAgIEtleVBvbGljeToge1xuICAgICAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoW3tcbiAgICAgICAgQWN0aW9uOiAna21zOkRlY3J5cHQnLFxuICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAgICdrbXM6VmlhU2VydmljZSc6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICdzZWNyZXRzbWFuYWdlci4nLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJy5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgIEFXUzoge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnOmlhbTo6MTIzNDpyb290JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgIH1dKSxcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdncmFudFJlYWQgd2l0aCB2ZXJzaW9uIGxhYmVsIGNvbnN0cmFpbnQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnS01TJyk7XG4gIGNvbnN0IHNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQoc3RhY2ssICdTZWNyZXQnLCB7IGVuY3J5cHRpb25LZXk6IGtleSB9KTtcbiAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7IGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpIH0pO1xuXG4gIC8vIFdIRU5cbiAgc2VjcmV0LmdyYW50UmVhZChyb2xlLCBbJ0ZPTycsICdiYXInXSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgU3RhdGVtZW50OiBbe1xuICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6R2V0U2VjcmV0VmFsdWUnLFxuICAgICAgICAgICdzZWNyZXRzbWFuYWdlcjpEZXNjcmliZVNlY3JldCcsXG4gICAgICAgIF0sXG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgUmVzb3VyY2U6IHsgUmVmOiAnU2VjcmV0QTcyMEVGMDUnIH0sXG4gICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICdGb3JBbnlWYWx1ZTpTdHJpbmdFcXVhbHMnOiB7XG4gICAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6VmVyc2lvblN0YWdlJzogWydGT08nLCAnYmFyJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH1dLFxuICAgIH0sXG4gIH0pO1xuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICBLZXlQb2xpY3k6IHtcbiAgICAgIFN0YXRlbWVudDogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgIEFjdGlvbjogJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAna21zOlZpYVNlcnZpY2UnOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnc2VjcmV0c21hbmFnZXIuJyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICcuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICBBV1M6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnUm9sZTFBQkNDNUYwJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICB9XSksXG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnZ3JhbnRXcml0ZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcsIHt9KTtcbiAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7IGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpIH0pO1xuXG4gIC8vIFdIRU5cbiAgc2VjcmV0LmdyYW50V3JpdGUocm9sZSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgU3RhdGVtZW50OiBbe1xuICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6UHV0U2VjcmV0VmFsdWUnLFxuICAgICAgICAgICdzZWNyZXRzbWFuYWdlcjpVcGRhdGVTZWNyZXQnLFxuICAgICAgICBdLFxuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFJlc291cmNlOiB7IFJlZjogJ1NlY3JldEE3MjBFRjA1JyB9LFxuICAgICAgfV0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnZ3JhbnRXcml0ZSB3aXRoIGttcycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdLTVMnKTtcbiAgY29uc3Qgc2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcsIHsgZW5jcnlwdGlvbktleToga2V5IH0pO1xuICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHsgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCkgfSk7XG5cbiAgLy8gV0hFTlxuICBzZWNyZXQuZ3JhbnRXcml0ZShyb2xlKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICBTdGF0ZW1lbnQ6IFt7XG4gICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICdzZWNyZXRzbWFuYWdlcjpQdXRTZWNyZXRWYWx1ZScsXG4gICAgICAgICAgJ3NlY3JldHNtYW5hZ2VyOlVwZGF0ZVNlY3JldCcsXG4gICAgICAgIF0sXG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgUmVzb3VyY2U6IHsgUmVmOiAnU2VjcmV0QTcyMEVGMDUnIH0sXG4gICAgICB9XSxcbiAgICB9LFxuICB9KTtcbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpLZXknLCB7XG4gICAgS2V5UG9saWN5OiB7XG4gICAgICBTdGF0ZW1lbnQ6IE1hdGNoLmFycmF5V2l0aChbe1xuICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAna21zOkVuY3J5cHQnLFxuICAgICAgICAgICdrbXM6UmVFbmNyeXB0KicsXG4gICAgICAgICAgJ2ttczpHZW5lcmF0ZURhdGFLZXkqJyxcbiAgICAgICAgXSxcbiAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAna21zOlZpYVNlcnZpY2UnOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnc2VjcmV0c21hbmFnZXIuJyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICcuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICBBV1M6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnUm9sZTFBQkNDNUYwJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICB9XSksXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnc2VjcmV0VmFsdWUnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnS01TJyk7XG4gIGNvbnN0IHNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQoc3RhY2ssICdTZWNyZXQnLCB7IGVuY3J5cHRpb25LZXk6IGtleSB9KTtcblxuICAvLyBXSEVOXG4gIG5ldyBjZGsuQ2ZuUmVzb3VyY2Uoc3RhY2ssICdGYWtlUmVzb3VyY2UnLCB7XG4gICAgdHlwZTogJ0NESzo6UGhvbnk6OlJlc291cmNlJyxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICB2YWx1ZTogc2VjcmV0LnNlY3JldFZhbHVlLFxuICAgIH0sXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0NESzo6UGhvbnk6OlJlc291cmNlJywge1xuICAgIHZhbHVlOiB7XG4gICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgJ3t7cmVzb2x2ZTpzZWNyZXRzbWFuYWdlcjonLFxuICAgICAgICB7IFJlZjogJ1NlY3JldEE3MjBFRjA1JyB9LFxuICAgICAgICAnOlNlY3JldFN0cmluZzo6On19JyxcbiAgICAgIF1dLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdzZWNyZXROYW1lJywgKCkgPT4ge1xuICB0ZXN0KCdzZWxlY3RzIHRoZSBmaXJzdCB0d28gcGFydHMgb2YgdGhlIHJlc291cmNlIG5hbWUgd2hlbiB0aGUgbmFtZSBpcyBhdXRvLWdlbmVyYXRlZCcsICgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IHNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQoc3RhY2ssICdTZWNyZXQnKTtcbiAgICBuZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ015U2VjcmV0TmFtZScsIHtcbiAgICAgIHZhbHVlOiBzZWNyZXQuc2VjcmV0TmFtZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc291cmNlTmFtZSA9IHsgJ0ZuOjpTZWxlY3QnOiBbNiwgeyAnRm46OlNwbGl0JzogWyc6JywgeyBSZWY6ICdTZWNyZXRBNzIwRUYwNScgfV0gfV0gfTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzT3V0cHV0KCdNeVNlY3JldE5hbWUnLCB7XG4gICAgICBWYWx1ZToge1xuICAgICAgICAnRm46OkpvaW4nOiBbJy0nLCBbXG4gICAgICAgICAgeyAnRm46OlNlbGVjdCc6IFswLCB7ICdGbjo6U3BsaXQnOiBbJy0nLCByZXNvdXJjZU5hbWVdIH1dIH0sXG4gICAgICAgICAgeyAnRm46OlNlbGVjdCc6IFsxLCB7ICdGbjo6U3BsaXQnOiBbJy0nLCByZXNvdXJjZU5hbWVdIH1dIH0sXG4gICAgICAgIF1dLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaXMgc2ltcGx5IHRoZSBmaXJzdCBzZWdtZW50IHdoZW4gdGhlIHByb3ZpZGVkIHNlY3JldCBuYW1lIGhhcyBubyBoeXBoZW5zJywgKCkgPT4ge1xuICAgIHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3Qgc2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcsIHsgc2VjcmV0TmFtZTogJ215U2VjcmV0JyB9KTtcbiAgICBuZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ015U2VjcmV0TmFtZScsIHtcbiAgICAgIHZhbHVlOiBzZWNyZXQuc2VjcmV0TmFtZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc291cmNlTmFtZSA9IHsgJ0ZuOjpTZWxlY3QnOiBbNiwgeyAnRm46OlNwbGl0JzogWyc6JywgeyBSZWY6ICdTZWNyZXRBNzIwRUYwNScgfV0gfV0gfTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzT3V0cHV0KCdNeVNlY3JldE5hbWUnLCB7XG4gICAgICBWYWx1ZTogeyAnRm46OlNlbGVjdCc6IFswLCB7ICdGbjo6U3BsaXQnOiBbJy0nLCByZXNvdXJjZU5hbWVdIH1dIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGFzc2VydFNlZ21lbnRzKHNlY3JldDogc2VjcmV0c21hbmFnZXIuU2VjcmV0LCBzZWdtZW50czogbnVtYmVyKSB7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdNeVNlY3JldE5hbWUnLCB7XG4gICAgICB2YWx1ZTogc2VjcmV0LnNlY3JldE5hbWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXNvdXJjZU5hbWUgPSB7ICdGbjo6U2VsZWN0JzogWzYsIHsgJ0ZuOjpTcGxpdCc6IFsnOicsIHsgUmVmOiAnU2VjcmV0QTcyMEVGMDUnIH1dIH1dIH07XG4gICAgY29uc3Qgc2VjcmV0TmFtZVNlZ21lbnRzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWdtZW50czsgaSsrKSB7XG4gICAgICBzZWNyZXROYW1lU2VnbWVudHMucHVzaCh7ICdGbjo6U2VsZWN0JzogW2ksIHsgJ0ZuOjpTcGxpdCc6IFsnLScsIHJlc291cmNlTmFtZV0gfV0gfSk7XG4gICAgfVxuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNPdXRwdXQoJ015U2VjcmV0TmFtZScsIHtcbiAgICAgIFZhbHVlOiB7ICdGbjo6Sm9pbic6IFsnLScsIHNlY3JldE5hbWVTZWdtZW50c10gfSxcbiAgICB9KTtcbiAgfVxuXG4gIHRlc3QoJ3NlbGVjdHMgdGhlIDIgcGFydHMgb2YgdGhlIHJlc291cmNlIG5hbWUgd2hlbiB0aGUgc2VjcmV0IG5hbWUgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qgc2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcsIHsgc2VjcmV0TmFtZTogJ215LXNlY3JldCcgfSk7XG4gICAgYXNzZXJ0U2VnbWVudHMoc2VjcmV0LCAyKTtcbiAgfSk7XG5cbiAgdGVzdCgnc2VsZWN0cyB0aGUgMyBwYXJ0cyBvZiB0aGUgcmVzb3VyY2UgbmFtZSB3aGVuIHRoZSBzZWNyZXQgbmFtZSBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBzZWNyZXQgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnU2VjcmV0JywgeyBzZWNyZXROYW1lOiAnbXktc2VjcmV0LWh5cGhlbmF0ZWQnIH0pO1xuICAgIGFzc2VydFNlZ21lbnRzKHNlY3JldCwgMyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NlbGVjdHMgdGhlIDQgcGFydHMgb2YgdGhlIHJlc291cmNlIG5hbWUgd2hlbiB0aGUgc2VjcmV0IG5hbWUgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qgc2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcsIHsgc2VjcmV0TmFtZTogJ215LXNlY3JldC13aXRoLWh5cGhlbnMnIH0pO1xuICAgIGFzc2VydFNlZ21lbnRzKHNlY3JldCwgNCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3VzZXMgZXhpc3RpbmcgVG9rZW5zIGFzIHNlY3JldCBuYW1lcyBhcy1pcycsICgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IHNlY3JldDEgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnU2VjcmV0MScpO1xuICAgIGNvbnN0IHNlY3JldDIgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnU2VjcmV0MicsIHtcbiAgICAgIHNlY3JldE5hbWU6IHNlY3JldDEuc2VjcmV0TmFtZSxcbiAgICB9KTtcbiAgICBuZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ015U2VjcmV0TmFtZTEnLCB7XG4gICAgICB2YWx1ZTogc2VjcmV0MS5zZWNyZXROYW1lLFxuICAgIH0pO1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnTXlTZWNyZXROYW1lMicsIHtcbiAgICAgIHZhbHVlOiBzZWNyZXQyLnNlY3JldE5hbWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBvdXRwdXRzID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5maW5kT3V0cHV0cygnKicpO1xuICAgIGV4cGVjdChvdXRwdXRzLk15U2VjcmV0TmFtZTEpLnRvRXF1YWwob3V0cHV0cy5NeVNlY3JldE5hbWUyKTtcbiAgfSk7XG59KTtcblxudGVzdERlcHJlY2F0ZWQoJ2ltcG9ydCBieSBzZWNyZXRBcm4nLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHNlY3JldEFybiA9ICdhcm46YXdzOnNlY3JldHNtYW5hZ2VyOmV1LXdlc3QtMToxMTExMTExMTExMTE6c2VjcmV0Ok15U2VjcmV0LWYzZ0R5OSc7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBzZWNyZXQgPSBzZWNyZXRzbWFuYWdlci5TZWNyZXQuZnJvbVNlY3JldEFybihzdGFjaywgJ1NlY3JldCcsIHNlY3JldEFybik7XG5cbiAgLy8gVEhFTlxuICBleHBlY3Qoc2VjcmV0LnNlY3JldEFybikudG9CZShzZWNyZXRBcm4pO1xuICBleHBlY3Qoc2VjcmV0LnNlY3JldEZ1bGxBcm4pLnRvQmUoc2VjcmV0QXJuKTtcbiAgZXhwZWN0KHNlY3JldC5zZWNyZXROYW1lKS50b0JlKCdNeVNlY3JldCcpO1xuICBleHBlY3Qoc2VjcmV0LmVuY3J5cHRpb25LZXkpLnRvQmVVbmRlZmluZWQoKTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc2VjcmV0LnNlY3JldFZhbHVlKSkudG9FcXVhbChge3tyZXNvbHZlOnNlY3JldHNtYW5hZ2VyOiR7c2VjcmV0QXJufTpTZWNyZXRTdHJpbmc6Ojp9fWApO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzZWNyZXQuc2VjcmV0VmFsdWVGcm9tSnNvbigncGFzc3dvcmQnKSkpLnRvRXF1YWwoYHt7cmVzb2x2ZTpzZWNyZXRzbWFuYWdlcjoke3NlY3JldEFybn06U2VjcmV0U3RyaW5nOnBhc3N3b3JkOjp9fWApO1xufSk7XG5cbnRlc3QoJ2ltcG9ydCBieSBzZWNyZXRBcm4gdGhyb3dzIGlmIEFSTiBpcyBtYWxmb3JtZWQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IGFybldpdGhvdXRSZXNvdXJjZU5hbWUgPSAnYXJuOmF3czpzZWNyZXRzbWFuYWdlcjpldS13ZXN0LTE6MTExMTExMTExMTExOnNlY3JldCc7XG5cbiAgLy8gV0hFTlxuICBleHBlY3QoKCkgPT4gc2VjcmV0c21hbmFnZXIuU2VjcmV0LmZyb21TZWNyZXRBdHRyaWJ1dGVzKHN0YWNrLCAnU2VjcmV0MScsIHtcbiAgICBzZWNyZXRQYXJ0aWFsQXJuOiBhcm5XaXRob3V0UmVzb3VyY2VOYW1lLFxuICB9KSkudG9UaHJvdygvaW52YWxpZCBBUk4gZm9ybWF0Lyk7XG59KTtcblxudGVzdERlcHJlY2F0ZWQoJ2ltcG9ydCBieSBzZWNyZXRBcm4gc3VwcG9ydHMgc2VjcmV0IEFSTnMgd2l0aG91dCBzdWZmaXhlcycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgYXJuV2l0aG91dFNlY3JldHNNYW5hZ2VyU3VmZml4ID0gJ2Fybjphd3M6c2VjcmV0c21hbmFnZXI6ZXUtd2VzdC0xOjExMTExMTExMTExMTpzZWNyZXQ6TXlTZWNyZXQnO1xuXG4gIC8vIFdIRU5cbiAgY29uc3Qgc2VjcmV0ID0gc2VjcmV0c21hbmFnZXIuU2VjcmV0LmZyb21TZWNyZXRBcm4oc3RhY2ssICdTZWNyZXQnLCBhcm5XaXRob3V0U2VjcmV0c01hbmFnZXJTdWZmaXgpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KHNlY3JldC5zZWNyZXRBcm4pLnRvQmUoYXJuV2l0aG91dFNlY3JldHNNYW5hZ2VyU3VmZml4KTtcbiAgZXhwZWN0KHNlY3JldC5zZWNyZXROYW1lKS50b0JlKCdNeVNlY3JldCcpO1xufSk7XG5cbnRlc3REZXByZWNhdGVkKCdpbXBvcnQgYnkgc2VjcmV0QXJuIGRvZXMgbm90IHN0cmlwIHN1ZmZpeGVzIHVubGVzcyB0aGUgc3VmZml4IGxlbmd0aCBpcyBzaXgnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IGFybldpdGg1Q2hhcmFjdGVyU3VmZml4ID0gJ2Fybjphd3M6c2VjcmV0c21hbmFnZXI6ZXUtd2VzdC0xOjExMTExMTExMTExMTpzZWNyZXQ6Z2l0aHViLXRva2VuJztcbiAgY29uc3QgYXJuV2l0aDZDaGFyYWN0ZXJTdWZmaXggPSAnYXJuOmF3czpzZWNyZXRzbWFuYWdlcjpldS13ZXN0LTE6MTExMTExMTExMTExOnNlY3JldDpnaXRodWItdG9rZW4tZjNnRHk5JztcbiAgY29uc3QgYXJuV2l0aE11bHRpcGxlNkNoYXJhY3RlclN1ZmZpeCA9ICdhcm46YXdzOnNlY3JldHNtYW5hZ2VyOmV1LXdlc3QtMToxMTExMTExMTExMTE6c2VjcmV0OmdpdGh1Yi10b2tlbi1mM2dEeTktYWNiMTIzJztcblxuICAvLyBUSEVOXG4gIGV4cGVjdChzZWNyZXRzbWFuYWdlci5TZWNyZXQuZnJvbVNlY3JldEFybihzdGFjaywgJ1NlY3JldDUnLCBhcm5XaXRoNUNoYXJhY3RlclN1ZmZpeCkuc2VjcmV0TmFtZSkudG9FcXVhbCgnZ2l0aHViLXRva2VuJyk7XG4gIGV4cGVjdChzZWNyZXRzbWFuYWdlci5TZWNyZXQuZnJvbVNlY3JldEFybihzdGFjaywgJ1NlY3JldDYnLCBhcm5XaXRoNkNoYXJhY3RlclN1ZmZpeCkuc2VjcmV0TmFtZSkudG9FcXVhbCgnZ2l0aHViLXRva2VuJyk7XG4gIGV4cGVjdChzZWNyZXRzbWFuYWdlci5TZWNyZXQuZnJvbVNlY3JldEFybihzdGFjaywgJ1NlY3JldDZUd2ljZScsIGFybldpdGhNdWx0aXBsZTZDaGFyYWN0ZXJTdWZmaXgpLnNlY3JldE5hbWUpLnRvRXF1YWwoJ2dpdGh1Yi10b2tlbi1mM2dEeTknKTtcbn0pO1xuXG50ZXN0KCdpbXBvcnQgYnkgc2VjcmV0QXJuIHN1cHBvcnRzIHRva2VucyBmb3IgQVJOcycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2tBID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFja0EnKTtcbiAgY29uc3Qgc3RhY2tCID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFja0InKTtcbiAgY29uc3Qgc2VjcmV0QSA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQoc3RhY2tBLCAnU2VjcmV0QScpO1xuXG4gIC8vIFdIRU5cbiAgY29uc3Qgc2VjcmV0QiA9IHNlY3JldHNtYW5hZ2VyLlNlY3JldC5mcm9tU2VjcmV0Q29tcGxldGVBcm4oc3RhY2tCLCAnU2VjcmV0QicsIHNlY3JldEEuc2VjcmV0QXJuKTtcbiAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2tCLCAnc2VjcmV0QlNlY3JldE5hbWUnLCB7IHZhbHVlOiBzZWNyZXRCLnNlY3JldE5hbWUgfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3Qoc2VjcmV0Qi5zZWNyZXRBcm4pLnRvQmUoc2VjcmV0QS5zZWNyZXRBcm4pO1xuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2tCKS5oYXNPdXRwdXQoJ3NlY3JldEJTZWNyZXROYW1lJywge1xuICAgIFZhbHVlOiB7ICdGbjo6U2VsZWN0JzogWzYsIHsgJ0ZuOjpTcGxpdCc6IFsnOicsIHsgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdTdGFja0E6RXhwb3J0c091dHB1dFJlZlNlY3JldEExODhGMjgxNzAzRkM4QTUyJyB9XSB9XSB9LFxuICB9KTtcbn0pO1xuXG50ZXN0RGVwcmVjYXRlZCgnaW1wb3J0IGJ5IHNlY3JldEFybiBndWVzc2VzIGF0IGNvbXBsZXRlIG9yIHBhcnRpYWwgQVJOJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzZWNyZXRBcm5XaXRoU3VmZml4ID0gJ2Fybjphd3M6c2VjcmV0c21hbmFnZXI6ZXUtd2VzdC0xOjExMTExMTExMTExMTpzZWNyZXQ6TXlTZWNyZXQtZjNnRHk5JztcbiAgY29uc3Qgc2VjcmV0QXJuV2l0aG91dFN1ZmZpeCA9ICdhcm46YXdzOnNlY3JldHNtYW5hZ2VyOmV1LXdlc3QtMToxMTExMTExMTExMTE6c2VjcmV0Ok15U2VjcmV0JztcblxuICAvLyBXSEVOXG4gIGNvbnN0IHNlY3JldFdpdGhDb21wbGV0ZUFybiA9IHNlY3JldHNtYW5hZ2VyLlNlY3JldC5mcm9tU2VjcmV0QXJuKHN0YWNrLCAnU2VjcmV0V2l0aCcsIHNlY3JldEFybldpdGhTdWZmaXgpO1xuICBjb25zdCBzZWNyZXRXaXRob3V0Q29tcGxldGVBcm4gPSBzZWNyZXRzbWFuYWdlci5TZWNyZXQuZnJvbVNlY3JldEFybihzdGFjaywgJ1NlY3JldFdpdGhvdXQnLCBzZWNyZXRBcm5XaXRob3V0U3VmZml4KTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChzZWNyZXRXaXRoQ29tcGxldGVBcm4uc2VjcmV0RnVsbEFybikudG9FcXVhbChzZWNyZXRBcm5XaXRoU3VmZml4KTtcbiAgZXhwZWN0KHNlY3JldFdpdGhvdXRDb21wbGV0ZUFybi5zZWNyZXRGdWxsQXJuKS50b0JlVW5kZWZpbmVkKCk7XG59KTtcblxudGVzdCgnZnJvbVNlY3JldENvbXBsZXRlQXJuJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzZWNyZXRBcm4gPSAnYXJuOmF3czpzZWNyZXRzbWFuYWdlcjpldS13ZXN0LTE6MTExMTExMTExMTExOnNlY3JldDpNeVNlY3JldC1mM2dEeTknO1xuXG4gIC8vIFdIRU5cbiAgY29uc3Qgc2VjcmV0ID0gc2VjcmV0c21hbmFnZXIuU2VjcmV0LmZyb21TZWNyZXRDb21wbGV0ZUFybihzdGFjaywgJ1NlY3JldCcsIHNlY3JldEFybik7XG5cbiAgLy8gVEhFTlxuICBleHBlY3Qoc2VjcmV0LnNlY3JldEFybikudG9CZShzZWNyZXRBcm4pO1xuICBleHBlY3Qoc2VjcmV0LnNlY3JldEZ1bGxBcm4pLnRvQmUoc2VjcmV0QXJuKTtcbiAgZXhwZWN0KHNlY3JldC5zZWNyZXROYW1lKS50b0JlKCdNeVNlY3JldCcpO1xuICBleHBlY3Qoc2VjcmV0LmVuY3J5cHRpb25LZXkpLnRvQmVVbmRlZmluZWQoKTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc2VjcmV0LnNlY3JldFZhbHVlKSkudG9FcXVhbChge3tyZXNvbHZlOnNlY3JldHNtYW5hZ2VyOiR7c2VjcmV0QXJufTpTZWNyZXRTdHJpbmc6Ojp9fWApO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzZWNyZXQuc2VjcmV0VmFsdWVGcm9tSnNvbigncGFzc3dvcmQnKSkpLnRvRXF1YWwoYHt7cmVzb2x2ZTpzZWNyZXRzbWFuYWdlcjoke3NlY3JldEFybn06U2VjcmV0U3RyaW5nOnBhc3N3b3JkOjp9fWApO1xufSk7XG5cbnRlc3QoJ2Zyb21TZWNyZXRDb21wbGV0ZUFybiAtIGdyYW50cycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc2VjcmV0QXJuID0gJ2Fybjphd3M6c2VjcmV0c21hbmFnZXI6ZXUtd2VzdC0xOjExMTExMTExMTExMTpzZWNyZXQ6TXlTZWNyZXQtZjNnRHk5JztcbiAgY29uc3Qgc2VjcmV0ID0gc2VjcmV0c21hbmFnZXIuU2VjcmV0LmZyb21TZWNyZXRDb21wbGV0ZUFybihzdGFjaywgJ1NlY3JldCcsIHNlY3JldEFybik7XG4gIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywgeyBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKSB9KTtcblxuICAvLyBXSEVOXG4gIHNlY3JldC5ncmFudFJlYWQocm9sZSk7XG4gIHNlY3JldC5ncmFudFdyaXRlKHJvbGUpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIFN0YXRlbWVudDogW3tcbiAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJyxcbiAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6RGVzY3JpYmVTZWNyZXQnLFxuICAgICAgICBdLFxuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFJlc291cmNlOiBzZWNyZXRBcm4sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6UHV0U2VjcmV0VmFsdWUnLFxuICAgICAgICAgICdzZWNyZXRzbWFuYWdlcjpVcGRhdGVTZWNyZXQnLFxuICAgICAgICBdLFxuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFJlc291cmNlOiBzZWNyZXRBcm4sXG4gICAgICB9XSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdmcm9tU2VjcmV0Q29tcGxldGVBcm4gLSBjYW4gYmUgYXNzaWduZWQgdG8gYSBwcm9wZXJ0eSB3aXRoIHR5cGUgbnVtYmVyJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzZWNyZXRBcm4gPSAnYXJuOmF3czpzZWNyZXRzbWFuYWdlcjpldS13ZXN0LTE6MTExMTExMTExMTExOnNlY3JldDpNeVNlY3JldC1mM2dEeTknO1xuICBjb25zdCBzZWNyZXQgPSBzZWNyZXRzbWFuYWdlci5TZWNyZXQuZnJvbVNlY3JldENvbXBsZXRlQXJuKHN0YWNrLCAnU2VjcmV0Jywgc2VjcmV0QXJuKTtcblxuICAvLyBXSEVOXG4gIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUZ1bmN0aW9uJywge1xuICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgIGhhbmRsZXI6ICdiYXInLFxuICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKUyxcbiAgICBtZW1vcnlTaXplOiBjZGsuVG9rZW4uYXNOdW1iZXIoc2VjcmV0LnNlY3JldFZhbHVlRnJvbUpzb24oJ0xhbWJkYUZ1bmN0aW9uTWVtb3J5U2l6ZScpKSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgIE1lbW9yeVNpemU6IGB7e3Jlc29sdmU6c2VjcmV0c21hbmFnZXI6JHtzZWNyZXRBcm59OlNlY3JldFN0cmluZzpMYW1iZGFGdW5jdGlvbk1lbW9yeVNpemU6On19YCxcbiAgfSk7XG59KTtcblxudGVzdCgnZnJvbVNlY3JldFBhcnRpYWxBcm4nLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHNlY3JldEFybiA9ICdhcm46YXdzOnNlY3JldHNtYW5hZ2VyOmV1LXdlc3QtMToxMTExMTExMTExMTE6c2VjcmV0Ok15U2VjcmV0JztcblxuICAvLyBXSEVOXG4gIGNvbnN0IHNlY3JldCA9IHNlY3JldHNtYW5hZ2VyLlNlY3JldC5mcm9tU2VjcmV0UGFydGlhbEFybihzdGFjaywgJ1NlY3JldCcsIHNlY3JldEFybik7XG5cbiAgLy8gVEhFTlxuICBleHBlY3Qoc2VjcmV0LnNlY3JldEFybikudG9CZShzZWNyZXRBcm4pO1xuICBleHBlY3Qoc2VjcmV0LnNlY3JldEZ1bGxBcm4pLnRvQmVVbmRlZmluZWQoKTtcbiAgZXhwZWN0KHNlY3JldC5zZWNyZXROYW1lKS50b0JlKCdNeVNlY3JldCcpO1xuICBleHBlY3Qoc2VjcmV0LmVuY3J5cHRpb25LZXkpLnRvQmVVbmRlZmluZWQoKTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc2VjcmV0LnNlY3JldFZhbHVlKSkudG9FcXVhbChge3tyZXNvbHZlOnNlY3JldHNtYW5hZ2VyOiR7c2VjcmV0QXJufTpTZWNyZXRTdHJpbmc6Ojp9fWApO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzZWNyZXQuc2VjcmV0VmFsdWVGcm9tSnNvbigncGFzc3dvcmQnKSkpLnRvRXF1YWwoYHt7cmVzb2x2ZTpzZWNyZXRzbWFuYWdlcjoke3NlY3JldEFybn06U2VjcmV0U3RyaW5nOnBhc3N3b3JkOjp9fWApO1xufSk7XG5cbnRlc3QoJ2Zyb21TZWNyZXRQYXJ0aWFsQXJuIC0gZ3JhbnRzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzZWNyZXRBcm4gPSAnYXJuOmF3czpzZWNyZXRzbWFuYWdlcjpldS13ZXN0LTE6MTExMTExMTExMTExOnNlY3JldDpNeVNlY3JldCc7XG4gIGNvbnN0IHNlY3JldCA9IHNlY3JldHNtYW5hZ2VyLlNlY3JldC5mcm9tU2VjcmV0UGFydGlhbEFybihzdGFjaywgJ1NlY3JldCcsIHNlY3JldEFybik7XG4gIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywgeyBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKSB9KTtcblxuICAvLyBXSEVOXG4gIHNlY3JldC5ncmFudFJlYWQocm9sZSk7XG4gIHNlY3JldC5ncmFudFdyaXRlKHJvbGUpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIFN0YXRlbWVudDogW3tcbiAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJyxcbiAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6RGVzY3JpYmVTZWNyZXQnLFxuICAgICAgICBdLFxuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFJlc291cmNlOiBgJHtzZWNyZXRBcm59LT8/Pz8/P2AsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6UHV0U2VjcmV0VmFsdWUnLFxuICAgICAgICAgICdzZWNyZXRzbWFuYWdlcjpVcGRhdGVTZWNyZXQnLFxuICAgICAgICBdLFxuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFJlc291cmNlOiBgJHtzZWNyZXRBcm59LT8/Pz8/P2AsXG4gICAgICB9XSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnZnJvbVNlY3JldEF0dHJpYnV0ZXMnLCAoKSA9PiB7XG4gIHRlc3QoJ2ltcG9ydCBieSBhdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgZW5jcnlwdGlvbktleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnS01TJyk7XG4gICAgY29uc3Qgc2VjcmV0QXJuID0gJ2Fybjphd3M6c2VjcmV0c21hbmFnZXI6ZXUtd2VzdC0xOjExMTExMTExMTExMTpzZWNyZXQ6TXlTZWNyZXQtZjNnRHk5JztcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzZWNyZXQgPSBzZWNyZXRzbWFuYWdlci5TZWNyZXQuZnJvbVNlY3JldEF0dHJpYnV0ZXMoc3RhY2ssICdTZWNyZXQnLCB7XG4gICAgICBzZWNyZXRDb21wbGV0ZUFybjogc2VjcmV0QXJuLCBlbmNyeXB0aW9uS2V5LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzZWNyZXQuc2VjcmV0QXJuKS50b0JlKHNlY3JldEFybik7XG4gICAgZXhwZWN0KHNlY3JldC5zZWNyZXRGdWxsQXJuKS50b0JlKHNlY3JldEFybik7XG4gICAgZXhwZWN0KHNlY3JldC5zZWNyZXROYW1lKS50b0JlKCdNeVNlY3JldCcpO1xuICAgIGV4cGVjdChzZWNyZXQuZW5jcnlwdGlvbktleSkudG9CZShlbmNyeXB0aW9uS2V5KTtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzZWNyZXQuc2VjcmV0VmFsdWUpKS50b0JlKGB7e3Jlc29sdmU6c2VjcmV0c21hbmFnZXI6JHtzZWNyZXRBcm59OlNlY3JldFN0cmluZzo6On19YCk7XG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc2VjcmV0LnNlY3JldFZhbHVlRnJvbUpzb24oJ3Bhc3N3b3JkJykpKS50b0JlKGB7e3Jlc29sdmU6c2VjcmV0c21hbmFnZXI6JHtzZWNyZXRBcm59OlNlY3JldFN0cmluZzpwYXNzd29yZDo6fX1gKTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ3Rocm93cyBpZiBzZWNyZXRBcm4gYW5kIGVpdGhlciBzZWNyZXRDb21wbGV0ZUFybiBvciBzZWNyZXRQYXJ0aWFsQXJuIGFyZSBwcm92aWRlZCcsICgpID0+IHtcbiAgICBjb25zdCBzZWNyZXRBcm4gPSAnYXJuOmF3czpzZWNyZXRzbWFuYWdlcjpldS13ZXN0LTE6MTExMTExMTExMTExOnNlY3JldDpNeVNlY3JldC1mM2dEeTknO1xuXG4gICAgY29uc3QgZXJyb3IgPSAvY2Fubm90IHVzZSBgc2VjcmV0QXJuYCB3aXRoIGBzZWNyZXRDb21wbGV0ZUFybmAgb3IgYHNlY3JldFBhcnRpYWxBcm5gLztcbiAgICBleHBlY3QoKCkgPT4gc2VjcmV0c21hbmFnZXIuU2VjcmV0LmZyb21TZWNyZXRBdHRyaWJ1dGVzKHN0YWNrLCAnU2VjcmV0Jywge1xuICAgICAgc2VjcmV0QXJuLFxuICAgICAgc2VjcmV0Q29tcGxldGVBcm46IHNlY3JldEFybixcbiAgICB9KSkudG9UaHJvdyhlcnJvcik7XG4gICAgZXhwZWN0KCgpID0+IHNlY3JldHNtYW5hZ2VyLlNlY3JldC5mcm9tU2VjcmV0QXR0cmlidXRlcyhzdGFjaywgJ1NlY3JldCcsIHtcbiAgICAgIHNlY3JldEFybixcbiAgICAgIHNlY3JldFBhcnRpYWxBcm46IHNlY3JldEFybixcbiAgICB9KSkudG9UaHJvdyhlcnJvcik7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBpZiBubyBBUk4gaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHNlY3JldHNtYW5hZ2VyLlNlY3JldC5mcm9tU2VjcmV0QXR0cmlidXRlcyhzdGFjaywgJ1NlY3JldCcsIHt9KSkudG9UaHJvdygvbXVzdCB1c2Ugb25seSBvbmUgb2YgYHNlY3JldENvbXBsZXRlQXJuYCBvciBgc2VjcmV0UGFydGlhbEFybmAvKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIGlmIGJvdGggY29tcGxldGUgYW5kIHBhcnRpYWwgQVJOcyBhcmUgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc2VjcmV0QXJuID0gJ2Fybjphd3M6c2VjcmV0c21hbmFnZXI6ZXUtd2VzdC0xOjExMTExMTExMTExMTpzZWNyZXQ6TXlTZWNyZXQtZjNnRHk5JztcbiAgICBleHBlY3QoKCkgPT4gc2VjcmV0c21hbmFnZXIuU2VjcmV0LmZyb21TZWNyZXRBdHRyaWJ1dGVzKHN0YWNrLCAnU2VjcmV0Jywge1xuICAgICAgc2VjcmV0UGFydGlhbEFybjogc2VjcmV0QXJuLFxuICAgICAgc2VjcmV0Q29tcGxldGVBcm46IHNlY3JldEFybixcbiAgICB9KSkudG9UaHJvdygvbXVzdCB1c2Ugb25seSBvbmUgb2YgYHNlY3JldENvbXBsZXRlQXJuYCBvciBgc2VjcmV0UGFydGlhbEFybmAvKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIGlmIHNlY3JldENvbXBsZXRlQXJuIGlzIG5vdCBjb21wbGV0ZScsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gc2VjcmV0c21hbmFnZXIuU2VjcmV0LmZyb21TZWNyZXRBdHRyaWJ1dGVzKHN0YWNrLCAnU2VjcmV0Jywge1xuICAgICAgc2VjcmV0Q29tcGxldGVBcm46ICdhcm46YXdzOnNlY3JldHNtYW5hZ2VyOmV1LXdlc3QtMToxMTExMTExMTExMTE6c2VjcmV0Ok15U2VjcmV0JyxcbiAgICB9KSkudG9UaHJvdygvZG9lcyBub3QgYXBwZWFyIHRvIGJlIGNvbXBsZXRlLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3BhcnNlcyBlbnZpcm9ubWVudCBmcm9tIHNlY3JldEFybicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHNlY3JldEFjY291bnQgPSAnMjIyMjIyMjIyMjIyJztcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzZWNyZXQgPSBzZWNyZXRzbWFuYWdlci5TZWNyZXQuZnJvbVNlY3JldEF0dHJpYnV0ZXMoc3RhY2ssICdTZWNyZXQnLCB7XG4gICAgICBzZWNyZXRDb21wbGV0ZUFybjogYGFybjphd3M6c2VjcmV0c21hbmFnZXI6ZXUtd2VzdC0xOiR7c2VjcmV0QWNjb3VudH06c2VjcmV0Ok15U2VjcmV0LWYzZ0R5OWAsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHNlY3JldC5lbnYuYWNjb3VudCkudG9CZShzZWNyZXRBY2NvdW50KTtcbiAgfSk7XG59KTtcblxudGVzdERlcHJlY2F0ZWQoJ2ltcG9ydCBieSBzZWNyZXQgbmFtZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc2VjcmV0TmFtZSA9ICdNeVNlY3JldCc7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBzZWNyZXQgPSBzZWNyZXRzbWFuYWdlci5TZWNyZXQuZnJvbVNlY3JldE5hbWUoc3RhY2ssICdTZWNyZXQnLCBzZWNyZXROYW1lKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChzZWNyZXQuc2VjcmV0QXJuKS50b0JlKHNlY3JldE5hbWUpO1xuICBleHBlY3Qoc2VjcmV0LnNlY3JldE5hbWUpLnRvQmUoc2VjcmV0TmFtZSk7XG4gIGV4cGVjdChzZWNyZXQuc2VjcmV0RnVsbEFybikudG9CZVVuZGVmaW5lZCgpO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzZWNyZXQuc2VjcmV0VmFsdWUpKS50b0JlKGB7e3Jlc29sdmU6c2VjcmV0c21hbmFnZXI6JHtzZWNyZXROYW1lfTpTZWNyZXRTdHJpbmc6Ojp9fWApO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzZWNyZXQuc2VjcmV0VmFsdWVGcm9tSnNvbigncGFzc3dvcmQnKSkpLnRvQmUoYHt7cmVzb2x2ZTpzZWNyZXRzbWFuYWdlcjoke3NlY3JldE5hbWV9OlNlY3JldFN0cmluZzpwYXNzd29yZDo6fX1gKTtcbn0pO1xuXG50ZXN0RGVwcmVjYXRlZCgnaW1wb3J0IGJ5IHNlY3JldCBuYW1lIHdpdGggZ3JhbnRzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHsgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCkgfSk7XG4gIGNvbnN0IHNlY3JldCA9IHNlY3JldHNtYW5hZ2VyLlNlY3JldC5mcm9tU2VjcmV0TmFtZShzdGFjaywgJ1NlY3JldCcsICdNeVNlY3JldCcpO1xuXG4gIC8vIFdIRU5cbiAgc2VjcmV0LmdyYW50UmVhZChyb2xlKTtcbiAgc2VjcmV0LmdyYW50V3JpdGUocm9sZSk7XG5cbiAgLy8gVEhFTlxuICBjb25zdCBleHBlY3RlZFNlY3JldFJlZmVyZW5jZSA9IHtcbiAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICdhcm46JyxcbiAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAnOnNlY3JldHNtYW5hZ2VyOicsXG4gICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgJzonLFxuICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICc6c2VjcmV0Ok15U2VjcmV0KicsXG4gICAgXV0sXG4gIH07XG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICBTdGF0ZW1lbnQ6IFt7XG4gICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICdzZWNyZXRzbWFuYWdlcjpHZXRTZWNyZXRWYWx1ZScsXG4gICAgICAgICAgJ3NlY3JldHNtYW5hZ2VyOkRlc2NyaWJlU2VjcmV0JyxcbiAgICAgICAgXSxcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBSZXNvdXJjZTogZXhwZWN0ZWRTZWNyZXRSZWZlcmVuY2UsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6UHV0U2VjcmV0VmFsdWUnLFxuICAgICAgICAgICdzZWNyZXRzbWFuYWdlcjpVcGRhdGVTZWNyZXQnLFxuICAgICAgICBdLFxuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFJlc291cmNlOiBleHBlY3RlZFNlY3JldFJlZmVyZW5jZSxcbiAgICAgIH1dLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2ltcG9ydCBieSBzZWNyZXQgbmFtZSB2MicsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc2VjcmV0TmFtZSA9ICdNeVNlY3JldCc7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBzZWNyZXQgPSBzZWNyZXRzbWFuYWdlci5TZWNyZXQuZnJvbVNlY3JldE5hbWVWMihzdGFjaywgJ1NlY3JldCcsIHNlY3JldE5hbWUpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KHNlY3JldC5zZWNyZXRBcm4pLnRvQmUoYGFybjoke3N0YWNrLnBhcnRpdGlvbn06c2VjcmV0c21hbmFnZXI6JHtzdGFjay5yZWdpb259OiR7c3RhY2suYWNjb3VudH06c2VjcmV0Ok15U2VjcmV0YCk7XG4gIGV4cGVjdChzZWNyZXQuc2VjcmV0TmFtZSkudG9CZShzZWNyZXROYW1lKTtcbiAgZXhwZWN0KHNlY3JldC5zZWNyZXRGdWxsQXJuKS50b0JlVW5kZWZpbmVkKCk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHNlY3JldC5zZWNyZXRWYWx1ZSkpLnRvRXF1YWwoe1xuICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgJ3t7cmVzb2x2ZTpzZWNyZXRzbWFuYWdlcjphcm46JyxcbiAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAnOnNlY3JldHNtYW5hZ2VyOicsXG4gICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgJzonLFxuICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICc6c2VjcmV0Ok15U2VjcmV0OlNlY3JldFN0cmluZzo6On19JyxcbiAgICBdXSxcbiAgfSk7XG59KTtcblxudGVzdCgnaW1wb3J0IGJ5IHNlY3JldCBuYW1lIHYyIHdpdGggZ3JhbnRzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHsgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCkgfSk7XG4gIGNvbnN0IHNlY3JldCA9IHNlY3JldHNtYW5hZ2VyLlNlY3JldC5mcm9tU2VjcmV0TmFtZVYyKHN0YWNrLCAnU2VjcmV0JywgJ015U2VjcmV0Jyk7XG5cbiAgLy8gV0hFTlxuICBzZWNyZXQuZ3JhbnRSZWFkKHJvbGUpO1xuICBzZWNyZXQuZ3JhbnRXcml0ZShyb2xlKTtcblxuICAvLyBUSEVOXG4gIGNvbnN0IGV4cGVjdGVkU2VjcmV0UmVmZXJlbmNlID0ge1xuICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgJ2FybjonLFxuICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICc6c2VjcmV0c21hbmFnZXI6JyxcbiAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAnOicsXG4gICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgJzpzZWNyZXQ6TXlTZWNyZXQtPz8/Pz8/JyxcbiAgICBdXSxcbiAgfTtcbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIFN0YXRlbWVudDogW3tcbiAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJyxcbiAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6RGVzY3JpYmVTZWNyZXQnLFxuICAgICAgICBdLFxuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFJlc291cmNlOiBleHBlY3RlZFNlY3JldFJlZmVyZW5jZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICdzZWNyZXRzbWFuYWdlcjpQdXRTZWNyZXRWYWx1ZScsXG4gICAgICAgICAgJ3NlY3JldHNtYW5hZ2VyOlVwZGF0ZVNlY3JldCcsXG4gICAgICAgIF0sXG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgUmVzb3VyY2U6IGV4cGVjdGVkU2VjcmV0UmVmZXJlbmNlLFxuICAgICAgfV0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnY2FuIGF0dGFjaCBhIHNlY3JldCB3aXRoIGF0dGFjaCgpJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzZWNyZXQgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnU2VjcmV0Jyk7XG5cbiAgLy8gV0hFTlxuICBzZWNyZXQuYXR0YWNoKHtcbiAgICBhc1NlY3JldEF0dGFjaG1lbnRUYXJnZXQ6ICgpID0+ICh7XG4gICAgICB0YXJnZXRJZDogJ3RhcmdldC1pZCcsXG4gICAgICB0YXJnZXRUeXBlOiBzZWNyZXRzbWFuYWdlci5BdHRhY2htZW50VGFyZ2V0VHlwZS5ET0NEQl9EQl9JTlNUQU5DRSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTZWNyZXRzTWFuYWdlcjo6U2VjcmV0VGFyZ2V0QXR0YWNobWVudCcsIHtcbiAgICBTZWNyZXRJZDoge1xuICAgICAgUmVmOiAnU2VjcmV0QTcyMEVGMDUnLFxuICAgIH0sXG4gICAgVGFyZ2V0SWQ6ICd0YXJnZXQtaWQnLFxuICAgIFRhcmdldFR5cGU6ICdBV1M6OkRvY0RCOjpEQkluc3RhbmNlJyxcbiAgfSk7XG59KTtcblxudGVzdCgndGhyb3dzIHdoZW4gdHJ5aW5nIHRvIGF0dGFjaCBhIHRhcmdldCBtdWx0aXBsZSB0aW1lcyB0byBhIHNlY3JldCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcpO1xuICBjb25zdCB0YXJnZXQgPSB7XG4gICAgYXNTZWNyZXRBdHRhY2htZW50VGFyZ2V0OiAoKSA9PiAoe1xuICAgICAgdGFyZ2V0SWQ6ICd0YXJnZXQtaWQnLFxuICAgICAgdGFyZ2V0VHlwZTogc2VjcmV0c21hbmFnZXIuQXR0YWNobWVudFRhcmdldFR5cGUuRE9DREJfREJfSU5TVEFOQ0UsXG4gICAgfSksXG4gIH07XG4gIHNlY3JldC5hdHRhY2godGFyZ2V0KTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCgoKSA9PiBzZWNyZXQuYXR0YWNoKHRhcmdldCkpLnRvVGhyb3coL1NlY3JldCBpcyBhbHJlYWR5IGF0dGFjaGVkIHRvIGEgdGFyZ2V0Lyk7XG59KTtcblxudGVzdCgnYWRkIGEgcm90YXRpb24gc2NoZWR1bGUgdG8gYW4gYXR0YWNoZWQgc2VjcmV0JywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzZWNyZXQgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnU2VjcmV0Jyk7XG4gIGNvbnN0IGF0dGFjaGVkU2VjcmV0ID0gc2VjcmV0LmF0dGFjaCh7XG4gICAgYXNTZWNyZXRBdHRhY2htZW50VGFyZ2V0OiAoKSA9PiAoe1xuICAgICAgdGFyZ2V0SWQ6ICd0YXJnZXQtaWQnLFxuICAgICAgdGFyZ2V0VHlwZTogc2VjcmV0c21hbmFnZXIuQXR0YWNobWVudFRhcmdldFR5cGUuRE9DREJfREJfSU5TVEFOQ0UsXG4gICAgfSksXG4gIH0pO1xuICBjb25zdCByb3RhdGlvbkxhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdMYW1iZGEnLCB7XG4gICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZXhwb3J0LmhhbmRsZXIgPSBldmVudCA9PiBldmVudDsnKSxcbiAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgYXR0YWNoZWRTZWNyZXQuYWRkUm90YXRpb25TY2hlZHVsZSgnUm90YXRpb25TY2hlZHVsZScsIHtcbiAgICByb3RhdGlvbkxhbWJkYSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTZWNyZXRzTWFuYWdlcjo6Um90YXRpb25TY2hlZHVsZScsIHtcbiAgICBTZWNyZXRJZDoge1xuICAgICAgUmVmOiAnU2VjcmV0QXR0YWNobWVudDJFMUI3QzNCJywgLy8gVGhlIHNlY3JldCByZXR1cm5lZCBieSB0aGUgYXR0YWNobWVudCwgbm90IHRoZSBzZWNyZXQgaXRzZWxmLlxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3Rocm93cyB3aGVuIHNwZWNpZnlpbmcgc2VjcmV0U3RyaW5nVGVtcGxhdGUgYnV0IG5vdCBnZW5lcmF0ZVN0cmluZ0tleScsICgpID0+IHtcbiAgZXhwZWN0KCgpID0+IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQoc3RhY2ssICdTZWNyZXQnLCB7XG4gICAgZ2VuZXJhdGVTZWNyZXRTdHJpbmc6IHtcbiAgICAgIHNlY3JldFN0cmluZ1RlbXBsYXRlOiBKU09OLnN0cmluZ2lmeSh7IHVzZXJuYW1lOiAndXNlcm5hbWUnIH0pLFxuICAgIH0sXG4gIH0pKS50b1Rocm93KC9gc2VjcmV0U3RyaW5nVGVtcGxhdGVgLitgZ2VuZXJhdGVTdHJpbmdLZXlgLyk7XG59KTtcblxudGVzdCgndGhyb3dzIHdoZW4gc3BlY2lmeWluZyBnZW5lcmF0ZVN0cmluZ0tleSBidXQgbm90IHNlY3JldFN0cmluZ1RlbXBsYXRlJywgKCkgPT4ge1xuICBleHBlY3QoKCkgPT4gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcsIHtcbiAgICBnZW5lcmF0ZVNlY3JldFN0cmluZzoge1xuICAgICAgZ2VuZXJhdGVTdHJpbmdLZXk6ICdwYXNzd29yZCcsXG4gICAgfSxcbiAgfSkpLnRvVGhyb3coL2BzZWNyZXRTdHJpbmdUZW1wbGF0ZWAuK2BnZW5lcmF0ZVN0cmluZ0tleWAvKTtcbn0pO1xuXG50ZXN0KCdlcXVpdmFsZW5jZSBvZiBTZWNyZXRWYWx1ZSBhbmQgU2VjcmV0LmZyb21TZWNyZXRBdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzZWNyZXRBcm4gPSAnYXJuOmF3czpzZWNyZXRzbWFuYWdlcjpldS13ZXN0LTE6MTExMTExMTExMTExOnNlY3JldDpNeVNlY3JldC1mM2dEeTknO1xuXG4gIC8vIFdIRU5cbiAgY29uc3QgaW1wb3J0ZWQgPSBzZWNyZXRzbWFuYWdlci5TZWNyZXQuZnJvbVNlY3JldEF0dHJpYnV0ZXMoc3RhY2ssICdJbXBvcnRlZCcsIHsgc2VjcmV0Q29tcGxldGVBcm46IHNlY3JldEFybiB9KS5zZWNyZXRWYWx1ZUZyb21Kc29uKCdwYXNzd29yZCcpO1xuICBjb25zdCB2YWx1ZSA9IGNkay5TZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcihzZWNyZXRBcm4sIHsganNvbkZpZWxkOiAncGFzc3dvcmQnIH0pO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUoaW1wb3J0ZWQpKS50b0VxdWFsKHN0YWNrLnJlc29sdmUodmFsdWUpKTtcbn0pO1xuXG50ZXN0KCdjYW4gYWRkIHRvIHRoZSByZXNvdXJjZSBwb2xpY3kgb2YgYSBzZWNyZXQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQoc3RhY2ssICdTZWNyZXQnKTtcblxuICAvLyBXSEVOXG4gIHNlY3JldC5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICBhY3Rpb25zOiBbJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJ10sXG4gICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5Bcm5QcmluY2lwYWwoJ2Fybjphd3M6aWFtOjoxMjM0NTY3ODkwMTI6dXNlci9jb29sLXVzZXInKV0sXG4gIH0pKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNlY3JldHNNYW5hZ2VyOjpSZXNvdXJjZVBvbGljeScsIHtcbiAgICBSZXNvdXJjZVBvbGljeToge1xuICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246ICdzZWNyZXRzbWFuYWdlcjpHZXRTZWNyZXRWYWx1ZScsXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgQVdTOiAnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjp1c2VyL2Nvb2wtdXNlcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICB9LFxuICAgIFNlY3JldElkOiB7XG4gICAgICBSZWY6ICdTZWNyZXRBNzIwRUYwNScsXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnZmFpbHMgaWYgc2VjcmV0IHBvbGljeSBoYXMgbm8gYWN0aW9ucycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ215LXN0YWNrJyk7XG4gIGNvbnN0IHNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQoc3RhY2ssICdTZWNyZXQnKTtcblxuICAvLyBXSEVOXG4gIHNlY3JldC5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFyblByaW5jaXBhbCgnYXJuJyldLFxuICB9KSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoKCkgPT4gYXBwLnN5bnRoKCkpLnRvVGhyb3coL0EgUG9saWN5U3RhdGVtZW50IG11c3Qgc3BlY2lmeSBhdCBsZWFzdCBvbmUgXFwnYWN0aW9uXFwnIG9yIFxcJ25vdEFjdGlvblxcJy8pO1xufSk7XG5cbnRlc3QoJ2ZhaWxzIGlmIHNlY3JldCBwb2xpY3kgaGFzIG5vIElBTSBwcmluY2lwYWxzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnbXktc3RhY2snKTtcbiAgY29uc3Qgc2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcpO1xuXG4gIC8vIFdIRU5cbiAgc2VjcmV0LmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgIHJlc291cmNlczogWycqJ10sXG4gICAgYWN0aW9uczogWydzZWNyZXRzbWFuYWdlcjoqJ10sXG4gIH0pKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCgoKSA9PiBhcHAuc3ludGgoKSkudG9UaHJvdygvQSBQb2xpY3lTdGF0ZW1lbnQgdXNlZCBpbiBhIHJlc291cmNlLWJhc2VkIHBvbGljeSBtdXN0IHNwZWNpZnkgYXQgbGVhc3Qgb25lIElBTSBwcmluY2lwYWwvKTtcbn0pO1xuXG50ZXN0KCd3aXRoIHJlcGxpY2F0aW9uIHJlZ2lvbnMnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgY29uc3Qgc2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcsIHtcbiAgICByZXBsaWNhUmVnaW9uczogW3sgcmVnaW9uOiAnZXUtd2VzdC0xJyB9XSxcbiAgfSk7XG4gIHNlY3JldC5hZGRSZXBsaWNhUmVnaW9uKCdldS1jZW50cmFsLTEnLCBrbXMuS2V5LmZyb21LZXlBcm4oc3RhY2ssICdLZXknLCAnYXJuOmF3czprbXM6ZXUtY2VudHJhbC0xOjEyMzQ1Njc4OTAxMjprZXkvbXkta2V5LWlkJykpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VjcmV0c01hbmFnZXI6OlNlY3JldCcsIHtcbiAgICBSZXBsaWNhUmVnaW9uczogW1xuICAgICAgeyBSZWdpb246ICdldS13ZXN0LTEnIH0sXG4gICAgICB7XG4gICAgICAgIEttc0tleUlkOiAnYXJuOmF3czprbXM6ZXUtY2VudHJhbC0xOjEyMzQ1Njc4OTAxMjprZXkvbXkta2V5LWlkJyxcbiAgICAgICAgUmVnaW9uOiAnZXUtY2VudHJhbC0xJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3NlY3JldE9iamVjdFZhbHVlJywgKCkgPT4ge1xuICB0ZXN0KCdjYW4gYmUgdXNlZCB3aXRoIGEgbWl4dHVyZSBvZiBwbGFpbiB0ZXh0IGFuZCBTZWNyZXRWYWx1ZScsICgpID0+IHtcbiAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnVXNlcicpO1xuICAgIGNvbnN0IGFjY2Vzc0tleSA9IG5ldyBpYW0uQWNjZXNzS2V5KHN0YWNrLCAnTXlLZXknLCB7IHVzZXIgfSk7XG4gICAgbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcsIHtcbiAgICAgIHNlY3JldE9iamVjdFZhbHVlOiB7XG4gICAgICAgIHVzZXJuYW1lOiBjZGsuU2VjcmV0VmFsdWUudW5zYWZlUGxhaW5UZXh0KCd1c2VybmFtZScpLFxuICAgICAgICBwYXNzd29yZDogYWNjZXNzS2V5LnNlY3JldEFjY2Vzc0tleSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTZWNyZXRzTWFuYWdlcjo6U2VjcmV0Jywge1xuICAgICAgR2VuZXJhdGVTZWNyZXRTdHJpbmc6IE1hdGNoLmFic2VudCgpLFxuICAgICAgU2VjcmV0U3RyaW5nOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAne1widXNlcm5hbWVcIjpcInVzZXJuYW1lXCIsXCJwYXNzd29yZFwiOlwiJyxcbiAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ015S2V5NkFCMjlGQTYnLCAnU2VjcmV0QWNjZXNzS2V5J10gfSxcbiAgICAgICAgICAgICdcIn0nLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYmUgdXNlZCB3aXRoIGEgbWl4dHVyZSBvZiBwbGFpbiB0ZXh0IGFuZCBTZWNyZXRWYWx1ZSwgd2l0aCBmZWF0dXJlIGZsYWcnLCAoKSA9PiB7XG4gICAgY29uc3QgZmVhdHVyZVN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGZlYXR1cmVTdGFjay5ub2RlLnNldENvbnRleHQoJ0Bhd3MtY2RrL2NvcmU6Y2hlY2tTZWNyZXRVc2FnZScsIHRydWUpO1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoZmVhdHVyZVN0YWNrLCAnVXNlcicpO1xuICAgIGNvbnN0IGFjY2Vzc0tleSA9IG5ldyBpYW0uQWNjZXNzS2V5KGZlYXR1cmVTdGFjaywgJ015S2V5JywgeyB1c2VyIH0pO1xuICAgIG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQoZmVhdHVyZVN0YWNrLCAnU2VjcmV0Jywge1xuICAgICAgc2VjcmV0T2JqZWN0VmFsdWU6IHtcbiAgICAgICAgdXNlcm5hbWU6IGNkay5TZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ3VzZXJuYW1lJyksXG4gICAgICAgIHBhc3N3b3JkOiBhY2Nlc3NLZXkuc2VjcmV0QWNjZXNzS2V5LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhmZWF0dXJlU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTZWNyZXRzTWFuYWdlcjo6U2VjcmV0Jywge1xuICAgICAgR2VuZXJhdGVTZWNyZXRTdHJpbmc6IE1hdGNoLmFic2VudCgpLFxuICAgICAgU2VjcmV0U3RyaW5nOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAne1widXNlcm5hbWVcIjpcInVzZXJuYW1lXCIsXCJwYXNzd29yZFwiOlwiJyxcbiAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ015S2V5NkFCMjlGQTYnLCAnU2VjcmV0QWNjZXNzS2V5J10gfSxcbiAgICAgICAgICAgICdcIn0nLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19