"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const kms = require("../lib");
const lib_1 = require("../lib");
const ADMIN_ACTIONS = [
    'kms:Create*',
    'kms:Describe*',
    'kms:Enable*',
    'kms:List*',
    'kms:Put*',
    'kms:Update*',
    'kms:Revoke*',
    'kms:Disable*',
    'kms:Get*',
    'kms:Delete*',
    'kms:TagResource',
    'kms:UntagResource',
    'kms:ScheduleKeyDeletion',
    'kms:CancelKeyDeletion',
];
test('default key', () => {
    const stack = new cdk.Stack();
    new kms.Key(stack, 'MyKey');
    assertions_1.Template.fromStack(stack).hasResource('AWS::KMS::Key', {
        Properties: {
            KeyPolicy: {
                Statement: [
                    {
                        Action: 'kms:*',
                        Effect: 'Allow',
                        Principal: {
                            AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
                        },
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        },
        DeletionPolicy: 'Retain',
        UpdateReplacePolicy: 'Retain',
    });
});
test('default with no retention', () => {
    const stack = new cdk.Stack();
    new kms.Key(stack, 'MyKey', { removalPolicy: cdk.RemovalPolicy.DESTROY });
    assertions_1.Template.fromStack(stack).hasResource('AWS::KMS::Key', { DeletionPolicy: 'Delete', UpdateReplacePolicy: 'Delete' });
});
describe('key policies', () => {
    test('can specify a default key policy', () => {
        const stack = new cdk.Stack();
        const policy = new iam.PolicyDocument();
        const statement = new iam.PolicyStatement({ resources: ['*'], actions: ['kms:Put*'] });
        statement.addArnPrincipal('arn:aws:iam::111122223333:root');
        policy.addStatements(statement);
        new kms.Key(stack, 'MyKey', { policy });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: [
                    {
                        Action: 'kms:Put*',
                        Effect: 'Allow',
                        Principal: {
                            AWS: 'arn:aws:iam::111122223333:root',
                        },
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('can append to the default key policy', () => {
        const stack = new cdk.Stack();
        const statement = new iam.PolicyStatement({ resources: ['*'], actions: ['kms:Put*'] });
        statement.addArnPrincipal('arn:aws:iam::111122223333:root');
        const key = new kms.Key(stack, 'MyKey');
        key.addToResourcePolicy(statement);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: [
                    {
                        Action: 'kms:*',
                        Effect: 'Allow',
                        Principal: {
                            AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
                        },
                        Resource: '*',
                    },
                    {
                        Action: 'kms:Put*',
                        Effect: 'Allow',
                        Principal: {
                            AWS: 'arn:aws:iam::111122223333:root',
                        },
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('decrypt', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const key = new kms.Key(stack, 'Key');
        const user = new iam.User(stack, 'User');
        // WHEN
        key.grantDecrypt(user);
        // THEN
        // Key policy should be unmodified by the grant.
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: [
                    {
                        Action: 'kms:*',
                        Effect: 'Allow',
                        Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] } },
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'kms:Decrypt',
                        Effect: 'Allow',
                        Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('encrypt', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const key = new kms.Key(stack, 'Key');
        const user = new iam.User(stack, 'User');
        // WHEN
        key.grantEncrypt(user);
        // THEN
        // Key policy should be unmodified by the grant.
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: [
                    {
                        Action: 'kms:*',
                        Effect: 'Allow',
                        Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] } },
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: ['kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
                        Effect: 'Allow',
                        Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('grant for a principal in a dependent stack works correctly', () => {
        const app = new cdk.App();
        const principalStack = new cdk.Stack(app, 'PrincipalStack');
        const principal = new iam.Role(principalStack, 'Role', {
            assumedBy: new iam.AnyPrincipal(),
        });
        const keyStack = new cdk.Stack(app, 'KeyStack');
        const key = new kms.Key(keyStack, 'Key');
        principalStack.addDependency(keyStack);
        key.grantEncrypt(principal);
        assertions_1.Template.fromStack(principalStack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: [
                            'kms:Encrypt',
                            'kms:ReEncrypt*',
                            'kms:GenerateDataKey*',
                        ],
                        Effect: 'Allow',
                        Resource: {
                            'Fn::ImportValue': 'KeyStack:ExportsOutputFnGetAttKey961B73FDArn5A860C43',
                        },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('grant for a principal in a different region', () => {
        const app = new cdk.App();
        const principalStack = new cdk.Stack(app, 'PrincipalStack', { env: { region: 'testregion1' } });
        const principal = new iam.Role(principalStack, 'Role', {
            assumedBy: new iam.AnyPrincipal(),
            roleName: 'MyRolePhysicalName',
        });
        const keyStack = new cdk.Stack(app, 'KeyStack', { env: { region: 'testregion2' } });
        const key = new kms.Key(keyStack, 'Key');
        key.grantEncrypt(principal);
        assertions_1.Template.fromStack(keyStack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: assertions_1.Match.arrayWith([
                    {
                        Action: [
                            'kms:Encrypt',
                            'kms:ReEncrypt*',
                            'kms:GenerateDataKey*',
                        ],
                        Effect: 'Allow',
                        Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':role/MyRolePhysicalName']] } },
                        Resource: '*',
                    },
                ]),
                Version: '2012-10-17',
            },
        });
        assertions_1.Template.fromStack(principalStack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: [
                            'kms:Encrypt',
                            'kms:ReEncrypt*',
                            'kms:GenerateDataKey*',
                        ],
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('grant for a principal in a different account', () => {
        const app = new cdk.App();
        const principalStack = new cdk.Stack(app, 'PrincipalStack', { env: { account: '0123456789012' } });
        const principal = new iam.Role(principalStack, 'Role', {
            assumedBy: new iam.AnyPrincipal(),
            roleName: 'MyRolePhysicalName',
        });
        const keyStack = new cdk.Stack(app, 'KeyStack', { env: { account: '111111111111' } });
        const key = new kms.Key(keyStack, 'Key');
        key.grantEncrypt(principal);
        assertions_1.Template.fromStack(keyStack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: assertions_1.Match.arrayWith([{
                        Action: [
                            'kms:Encrypt',
                            'kms:ReEncrypt*',
                            'kms:GenerateDataKey*',
                        ],
                        Effect: 'Allow',
                        Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::0123456789012:role/MyRolePhysicalName']] } },
                        Resource: '*',
                    }]),
                Version: '2012-10-17',
            },
        });
        assertions_1.Template.fromStack(principalStack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: [
                            'kms:Encrypt',
                            'kms:ReEncrypt*',
                            'kms:GenerateDataKey*',
                        ],
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('grant for an immutable role', () => {
        const app = new cdk.App();
        const principalStack = new cdk.Stack(app, 'PrincipalStack', { env: { account: '0123456789012' } });
        const principal = new iam.Role(principalStack, 'Role', {
            assumedBy: new iam.AnyPrincipal(),
            roleName: 'MyRolePhysicalName',
        });
        const keyStack = new cdk.Stack(app, 'KeyStack', { env: { account: '111111111111' } });
        const key = new kms.Key(keyStack, 'Key');
        principalStack.addDependency(keyStack);
        key.grantEncrypt(principal.withoutPolicyUpdates());
        assertions_1.Template.fromStack(keyStack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: assertions_1.Match.arrayWith([{
                        Action: 'kms:*',
                        Effect: 'Allow',
                        Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::111111111111:root']] } },
                        Resource: '*',
                    },
                    {
                        Action: [
                            'kms:Encrypt',
                            'kms:ReEncrypt*',
                            'kms:GenerateDataKey*',
                        ],
                        Effect: 'Allow',
                        Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::0123456789012:root']] } },
                        Resource: '*',
                    }]),
                Version: '2012-10-17',
            },
        });
    });
    test('additional key admins can be specified (with imported/immutable principal)', () => {
        const stack = new cdk.Stack();
        const adminRole = iam.Role.fromRoleArn(stack, 'Admin', 'arn:aws:iam::123456789012:role/TrustedAdmin');
        new kms.Key(stack, 'MyKey', { admins: [adminRole] });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: [
                    {
                        Action: 'kms:*',
                        Effect: 'Allow',
                        Principal: {
                            AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
                        },
                        Resource: '*',
                    },
                    {
                        Action: ADMIN_ACTIONS,
                        Effect: 'Allow',
                        Principal: {
                            AWS: 'arn:aws:iam::123456789012:role/TrustedAdmin',
                        },
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('additional key admins can be specified (with owned/mutable principal)', () => {
        const stack = new cdk.Stack();
        const adminRole = new iam.Role(stack, 'AdminRole', {
            assumedBy: new iam.AccountRootPrincipal(),
        });
        new kms.Key(stack, 'MyKey', { admins: [adminRole] });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                // Unmodified - default key policy
                Statement: [
                    {
                        Action: 'kms:*',
                        Effect: 'Allow',
                        Principal: {
                            AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
                        },
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: ADMIN_ACTIONS,
                        Effect: 'Allow',
                        Resource: { 'Fn::GetAtt': ['MyKey6AB29FA6', 'Arn'] },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
});
test('key with some options', () => {
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'MyKey', {
        enableKeyRotation: true,
        enabled: false,
        pendingWindow: cdk.Duration.days(7),
    });
    cdk.Tags.of(key).add('tag1', 'value1');
    cdk.Tags.of(key).add('tag2', 'value2');
    cdk.Tags.of(key).add('tag3', '');
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
        Enabled: false,
        EnableKeyRotation: true,
        PendingWindowInDays: 7,
        Tags: [
            {
                Key: 'tag1',
                Value: 'value1',
            },
            {
                Key: 'tag2',
                Value: 'value2',
            },
            {
                Key: 'tag3',
                Value: '',
            },
        ],
    });
});
test('setting pendingWindow value to not in allowed range will throw', () => {
    const stack = new cdk.Stack();
    expect(() => new kms.Key(stack, 'MyKey', { enableKeyRotation: true, pendingWindow: cdk.Duration.days(6) }))
        .toThrow('\'pendingWindow\' value must between 7 and 30 days. Received: 6');
});
(0, cdk_build_tools_1.describeDeprecated)('trustAccountIdentities is deprecated', () => {
    test('setting trustAccountIdentities to false will throw (when the defaultKeyPolicies feature flag is enabled)', () => {
        const stack = new cdk.Stack();
        expect(() => new kms.Key(stack, 'MyKey', { trustAccountIdentities: false }))
            .toThrow('`trustAccountIdentities` cannot be false if the @aws-cdk/aws-kms:defaultKeyPolicies feature flag is set');
    });
});
test('addAlias creates an alias', () => {
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'MyKey', {
        enableKeyRotation: true,
        enabled: false,
    });
    const alias = key.addAlias('alias/xoo');
    expect(alias.aliasName).toBeDefined();
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::KMS::Alias', 1);
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Alias', {
        AliasName: 'alias/xoo',
        TargetKeyId: {
            'Fn::GetAtt': [
                'MyKey6AB29FA6',
                'Arn',
            ],
        },
    });
});
test('can run multiple addAlias', () => {
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'MyKey', {
        enableKeyRotation: true,
        enabled: false,
    });
    const alias1 = key.addAlias('alias/alias1');
    const alias2 = key.addAlias('alias/alias2');
    expect(alias1.aliasName).toBeDefined();
    expect(alias2.aliasName).toBeDefined();
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::KMS::Alias', 2);
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Alias', {
        AliasName: 'alias/alias1',
        TargetKeyId: {
            'Fn::GetAtt': [
                'MyKey6AB29FA6',
                'Arn',
            ],
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Alias', {
        AliasName: 'alias/alias2',
        TargetKeyId: {
            'Fn::GetAtt': [
                'MyKey6AB29FA6',
                'Arn',
            ],
        },
    });
});
test('keyId resolves to a Ref', () => {
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'MyKey');
    new cdk.CfnOutput(stack, 'Out', {
        value: key.keyId,
    });
    assertions_1.Template.fromStack(stack).hasOutput('Out', {
        Value: { Ref: 'MyKey6AB29FA6' },
    });
});
test('fails if key policy has no actions', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const key = new kms.Key(stack, 'MyKey');
    key.addToResourcePolicy(new iam.PolicyStatement({
        resources: ['*'],
        principals: [new iam.ArnPrincipal('arn')],
    }));
    expect(() => app.synth()).toThrow(/A PolicyStatement must specify at least one \'action\' or \'notAction\'/);
});
test('fails if key policy has no IAM principals', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const key = new kms.Key(stack, 'MyKey');
    key.addToResourcePolicy(new iam.PolicyStatement({
        resources: ['*'],
        actions: ['kms:*'],
    }));
    expect(() => app.synth()).toThrow(/A PolicyStatement used in a resource-based policy must specify at least one IAM principal/);
});
describe('imported keys', () => {
    test('throw an error when providing something that is not a valid key ARN', () => {
        const stack = new cdk.Stack();
        expect(() => {
            kms.Key.fromKeyArn(stack, 'Imported', 'arn:aws:kms:us-east-1:123456789012:key');
        }).toThrow(/KMS key ARN must be in the format 'arn:aws:kms:<region>:<account>:key\/<keyId>', got: 'arn:aws:kms:us-east-1:123456789012:key'/);
    });
    test('can have aliases added to them', () => {
        const app = new cdk.App();
        const stack2 = new cdk.Stack(app, 'Stack2');
        const myKeyImported = kms.Key.fromKeyArn(stack2, 'MyKeyImported', 'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012');
        // addAlias can be called on imported keys.
        myKeyImported.addAlias('alias/hello');
        expect(myKeyImported.keyId).toEqual('12345678-1234-1234-1234-123456789012');
        assertions_1.Template.fromStack(stack2).templateMatches({
            Resources: {
                MyKeyImportedAliasB1C5269F: {
                    Type: 'AWS::KMS::Alias',
                    Properties: {
                        AliasName: 'alias/hello',
                        TargetKeyId: 'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012',
                    },
                },
            },
        });
    });
});
describe('fromCfnKey()', () => {
    let stack;
    let cfnKey;
    let key;
    beforeEach(() => {
        stack = new cdk.Stack();
        cfnKey = new kms.CfnKey(stack, 'CfnKey', {
            keyPolicy: {
                Statement: [
                    {
                        Action: 'kms:*',
                        Effect: 'Allow',
                        Principal: {
                            AWS: cdk.Fn.join('', [
                                'arn:',
                                cdk.Aws.PARTITION,
                                ':iam::',
                                cdk.Aws.ACCOUNT_ID,
                                ':root',
                            ]),
                        },
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
        key = kms.Key.fromCfnKey(cfnKey);
    });
    test("correctly resolves the 'keyId' property", () => {
        expect(stack.resolve(key.keyId)).toStrictEqual({
            Ref: 'CfnKey',
        });
    });
    test("correctly resolves the 'keyArn' property", () => {
        expect(stack.resolve(key.keyArn)).toStrictEqual({
            'Fn::GetAtt': ['CfnKey', 'Arn'],
        });
    });
    test('preserves the KMS Key resource', () => {
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: [
                    {
                        Action: 'kms:*',
                        Effect: 'Allow',
                        Principal: {
                            AWS: {
                                'Fn::Join': ['', [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':iam::',
                                        { Ref: 'AWS::AccountId' },
                                        ':root',
                                    ]],
                            },
                        },
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::KMS::Key', 1);
    });
    describe("calling 'addToResourcePolicy()' on the returned Key", () => {
        let addToResourcePolicyResult;
        beforeEach(() => {
            addToResourcePolicyResult = key.addToResourcePolicy(new iam.PolicyStatement({
                actions: ['kms:action'],
                resources: ['*'],
                principals: [new iam.AnyPrincipal()],
            }));
        });
        test("the AddToResourcePolicyResult returned has 'statementAdded' set to 'true'", () => {
            expect(addToResourcePolicyResult.statementAdded).toBeTruthy();
        });
        test('preserves the mutating call in the resulting template', () => {
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
                KeyPolicy: {
                    Statement: [
                        {
                            Action: 'kms:*',
                            Effect: 'Allow',
                            Principal: {
                                AWS: {
                                    'Fn::Join': ['', [
                                            'arn:',
                                            { Ref: 'AWS::Partition' },
                                            ':iam::',
                                            { Ref: 'AWS::AccountId' },
                                            ':root',
                                        ]],
                                },
                            },
                            Resource: '*',
                        },
                        {
                            Action: 'kms:action',
                            Effect: 'Allow',
                            Principal: { AWS: '*' },
                            Resource: '*',
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
        });
    });
    describe('calling fromCfnKey() again', () => {
        beforeEach(() => {
            key = kms.Key.fromCfnKey(cfnKey);
        });
        describe('and using it for grantDecrypt() on a Role', function () {
            beforeEach(() => {
                const role = new iam.Role(stack, 'Role', {
                    assumedBy: new iam.AnyPrincipal(),
                });
                key.grantDecrypt(role);
            });
            test('creates the correct IAM Policy', () => {
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: 'kms:Decrypt',
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': ['CfnKey', 'Arn'],
                                },
                            },
                        ],
                    },
                });
            });
            test('correctly mutates the Policy of the underlying CfnKey', () => {
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
                    KeyPolicy: {
                        Statement: [
                            {
                                Action: 'kms:*',
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': ['', [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':iam::',
                                                { Ref: 'AWS::AccountId' },
                                                ':root',
                                            ]],
                                    },
                                },
                                Resource: '*',
                            },
                            {
                                Action: 'kms:Decrypt',
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'],
                                    },
                                },
                                Resource: '*',
                            },
                        ],
                        Version: '2012-10-17',
                    },
                });
            });
        });
    });
    describe("called with a CfnKey that has an 'Fn::If' passed as the KeyPolicy", () => {
        beforeEach(() => {
            cfnKey = new kms.CfnKey(stack, 'CfnKey2', {
                keyPolicy: cdk.Fn.conditionIf('AlwaysTrue', {
                    Statement: [
                        {
                            Action: 'kms:action1',
                            Effect: 'Allow',
                            Principal: '*',
                            Resource: '*',
                        },
                    ],
                    Version: '2012-10-17',
                }, {
                    Statement: [
                        {
                            Action: 'kms:action2',
                            Effect: 'Allow',
                            Principal: '*',
                            Resource: '*',
                        },
                    ],
                    Version: '2012-10-17',
                }),
            });
        });
        test('throws a descriptive exception', () => {
            expect(() => {
                kms.Key.fromCfnKey(cfnKey);
            }).toThrow(/Could not parse the PolicyDocument of the passed AWS::KMS::Key/);
        });
    });
    describe("called with a CfnKey that has an 'Fn::If' passed as the Statement of a KeyPolicy", () => {
        beforeEach(() => {
            cfnKey = new kms.CfnKey(stack, 'CfnKey2', {
                keyPolicy: {
                    Statement: cdk.Fn.conditionIf('AlwaysTrue', [
                        {
                            Action: 'kms:action1',
                            Effect: 'Allow',
                            Principal: '*',
                            Resource: '*',
                        },
                    ], [
                        {
                            Action: 'kms:action2',
                            Effect: 'Allow',
                            Principal: '*',
                            Resource: '*',
                        },
                    ]),
                    Version: '2012-10-17',
                },
            });
        });
        test('throws a descriptive exception', () => {
            expect(() => {
                kms.Key.fromCfnKey(cfnKey);
            }).toThrow(/Could not parse the PolicyDocument of the passed AWS::KMS::Key/);
        });
    });
    describe("called with a CfnKey that has an 'Fn::If' passed as one of the statements of a KeyPolicy", () => {
        beforeEach(() => {
            cfnKey = new kms.CfnKey(stack, 'CfnKey2', {
                keyPolicy: {
                    Statement: [
                        cdk.Fn.conditionIf('AlwaysTrue', {
                            Action: 'kms:action1',
                            Effect: 'Allow',
                            Principal: '*',
                            Resource: '*',
                        }, {
                            Action: 'kms:action2',
                            Effect: 'Allow',
                            Principal: '*',
                            Resource: '*',
                        }),
                    ],
                    Version: '2012-10-17',
                },
            });
        });
        test('throws a descriptive exception', () => {
            expect(() => {
                kms.Key.fromCfnKey(cfnKey);
            }).toThrow(/Could not parse the PolicyDocument of the passed AWS::KMS::Key/);
        });
    });
    describe("called with a CfnKey that has an 'Fn::If' passed for the Action in one of the statements of a KeyPolicy", () => {
        beforeEach(() => {
            cfnKey = new kms.CfnKey(stack, 'CfnKey2', {
                keyPolicy: {
                    Statement: [
                        {
                            Action: cdk.Fn.conditionIf('AlwaysTrue', 'kms:action1', 'kms:action2'),
                            Effect: 'Allow',
                            Principal: '*',
                            Resource: '*',
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
        });
        test('throws a descriptive exception', () => {
            expect(() => {
                key = kms.Key.fromCfnKey(cfnKey);
            }).toThrow(/Could not parse the PolicyDocument of the passed AWS::KMS::Key/);
        });
    });
});
describe('addToResourcePolicy allowNoOp and there is no policy', () => {
    // eslint-disable-next-line jest/expect-expect
    test('succeed if set to true (default)', () => {
        const stack = new cdk.Stack();
        const key = kms.Key.fromKeyArn(stack, 'Imported', 'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012');
        key.addToResourcePolicy(new iam.PolicyStatement({ resources: ['*'], actions: ['*'] }));
    });
    test('fails if set to false', () => {
        const stack = new cdk.Stack();
        const key = kms.Key.fromKeyArn(stack, 'Imported', 'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012');
        expect(() => {
            key.addToResourcePolicy(new iam.PolicyStatement({ resources: ['*'], actions: ['*'] }), /* allowNoOp */ false);
        }).toThrow('Unable to add statement to IAM resource policy for KMS key: "arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012"');
    });
});
describe('key specs and key usages', () => {
    test('both usage and spec are specified', () => {
        const stack = new cdk.Stack();
        new kms.Key(stack, 'Key', { keySpec: kms.KeySpec.ECC_SECG_P256K1, keyUsage: kms.KeyUsage.SIGN_VERIFY });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeySpec: 'ECC_SECG_P256K1',
            KeyUsage: 'SIGN_VERIFY',
        });
    });
    test('only key usage is specified', () => {
        const stack = new cdk.Stack();
        new kms.Key(stack, 'Key', { keyUsage: kms.KeyUsage.ENCRYPT_DECRYPT });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeyUsage: 'ENCRYPT_DECRYPT',
        });
    });
    test('only key spec is specified', () => {
        const stack = new cdk.Stack();
        new kms.Key(stack, 'Key', { keySpec: kms.KeySpec.RSA_4096 });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeySpec: 'RSA_4096',
        });
    });
    test.each(generateInvalidKeySpecKeyUsageCombinations())('invalid combinations of key specs and key usages (%s)', ({ keySpec, keyUsage }) => {
        const stack = new cdk.Stack();
        expect(() => new kms.Key(stack, 'Key1', { keySpec, keyUsage }))
            .toThrow(`key spec \'${keySpec}\' is not valid with usage \'${keyUsage.toString()}\'`);
    });
    test('invalid combinations of default key spec and key usage SIGN_VERIFY', () => {
        const stack = new cdk.Stack();
        expect(() => new kms.Key(stack, 'Key1', { keyUsage: lib_1.KeyUsage.SIGN_VERIFY }))
            .toThrow('key spec \'SYMMETRIC_DEFAULT\' is not valid with usage \'SIGN_VERIFY\'');
    });
    test('fails if key rotation enabled on asymmetric key', () => {
        const stack = new cdk.Stack();
        expect(() => new kms.Key(stack, 'Key', { enableKeyRotation: true, keySpec: kms.KeySpec.RSA_3072 }))
            .toThrow('key rotation cannot be enabled on asymmetric keys');
    });
});
describe('Key.fromKeyArn()', () => {
    let stack;
    beforeEach(() => {
        const app = new cdk.App();
        stack = new cdk.Stack(app, 'Base', {
            env: { account: '111111111111', region: 'stack-region' },
        });
    });
    describe('for a key in a different account and region', () => {
        let key;
        beforeEach(() => {
            key = kms.Key.fromKeyArn(stack, 'iKey', 'arn:aws:kms:key-region:222222222222:key:key-name');
        });
        test("the key's region is taken from the ARN", () => {
            expect(key.env.region).toBe('key-region');
        });
        test("the key's account is taken from the ARN", () => {
            expect(key.env.account).toBe('222222222222');
        });
    });
});
describe('HMAC', () => {
    let stack;
    beforeEach(() => {
        stack = new cdk.Stack();
    });
    test.each([
        [lib_1.KeySpec.HMAC_224, 'HMAC_224'],
        [lib_1.KeySpec.HMAC_256, 'HMAC_256'],
        [lib_1.KeySpec.HMAC_384, 'HMAC_384'],
        [lib_1.KeySpec.HMAC_512, 'HMAC_512'],
    ])('%s is not valid for default usage', (keySpec) => {
        expect(() => new kms.Key(stack, 'Key1', { keySpec }))
            .toThrow(`key spec \'${keySpec}\' is not valid with usage \'ENCRYPT_DECRYPT\'`);
    });
    test.each([
        [lib_1.KeySpec.HMAC_224, 'HMAC_224'],
        [lib_1.KeySpec.HMAC_256, 'HMAC_256'],
        [lib_1.KeySpec.HMAC_384, 'HMAC_384'],
        [lib_1.KeySpec.HMAC_512, 'HMAC_512'],
    ])('%s can not be used with key rotation', (keySpec) => {
        expect(() => new kms.Key(stack, 'Key', {
            keySpec,
            keyUsage: lib_1.KeyUsage.GENERATE_VERIFY_MAC,
            enableKeyRotation: true,
        })).toThrow('key rotation cannot be enabled on HMAC keys');
    });
    test.each([
        [lib_1.KeySpec.HMAC_224, 'HMAC_224'],
        [lib_1.KeySpec.HMAC_256, 'HMAC_256'],
        [lib_1.KeySpec.HMAC_384, 'HMAC_384'],
        [lib_1.KeySpec.HMAC_512, 'HMAC_512'],
    ])('%s can be used for KMS key creation', (keySpec, expected) => {
        new kms.Key(stack, 'Key', {
            keySpec,
            keyUsage: lib_1.KeyUsage.GENERATE_VERIFY_MAC,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeySpec: expected,
            KeyUsage: 'GENERATE_VERIFY_MAC',
        });
    });
    test('grant generate mac policy', () => {
        const key = new kms.Key(stack, 'Key', {
            keySpec: lib_1.KeySpec.HMAC_256,
            keyUsage: lib_1.KeyUsage.GENERATE_VERIFY_MAC,
        });
        const user = new iam.User(stack, 'User');
        key.grantGenerateMac(user);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: [
                    {
                        Action: 'kms:*',
                        Effect: 'Allow',
                        Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] } },
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'kms:GenerateMac',
                        Effect: 'Allow',
                        Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('grant verify mac policy', () => {
        const key = new kms.Key(stack, 'Key', {
            keySpec: lib_1.KeySpec.HMAC_256,
            keyUsage: lib_1.KeyUsage.GENERATE_VERIFY_MAC,
        });
        const user = new iam.User(stack, 'User');
        key.grantVerifyMac(user);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: [
                    {
                        Action: 'kms:*',
                        Effect: 'Allow',
                        Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] } },
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'kms:VerifyMac',
                        Effect: 'Allow',
                        Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('grant generate mac policy for imported key', () => {
        const keyArn = 'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012';
        const key = kms.Key.fromKeyArn(stack, 'Key', keyArn);
        const user = new iam.User(stack, 'User');
        key.grantGenerateMac(user);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'kms:GenerateMac',
                        Effect: 'Allow',
                        Resource: keyArn,
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('grant verify mac policy for imported key', () => {
        const keyArn = 'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012';
        const key = kms.Key.fromKeyArn(stack, 'Key', keyArn);
        const user = new iam.User(stack, 'User');
        key.grantVerifyMac(user);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'kms:VerifyMac',
                        Effect: 'Allow',
                        Resource: keyArn,
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
});
describe('SM2', () => {
    let stack;
    beforeEach(() => {
        stack = new cdk.Stack();
    });
    test('can be used for KMS key creation', () => {
        new kms.Key(stack, 'Key1', {
            keySpec: lib_1.KeySpec.SM2,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeySpec: 'SM2',
        });
    });
});
function generateInvalidKeySpecKeyUsageCombinations() {
    // Copied from Key class
    const denyLists = {
        [lib_1.KeyUsage.ENCRYPT_DECRYPT]: [
            lib_1.KeySpec.ECC_NIST_P256,
            lib_1.KeySpec.ECC_NIST_P384,
            lib_1.KeySpec.ECC_NIST_P521,
            lib_1.KeySpec.ECC_SECG_P256K1,
            lib_1.KeySpec.HMAC_224,
            lib_1.KeySpec.HMAC_256,
            lib_1.KeySpec.HMAC_384,
            lib_1.KeySpec.HMAC_512,
        ],
        [lib_1.KeyUsage.SIGN_VERIFY]: [
            lib_1.KeySpec.SYMMETRIC_DEFAULT,
            lib_1.KeySpec.HMAC_224,
            lib_1.KeySpec.HMAC_256,
            lib_1.KeySpec.HMAC_384,
            lib_1.KeySpec.HMAC_512,
        ],
        [lib_1.KeyUsage.GENERATE_VERIFY_MAC]: [
            lib_1.KeySpec.RSA_2048,
            lib_1.KeySpec.RSA_3072,
            lib_1.KeySpec.RSA_4096,
            lib_1.KeySpec.ECC_NIST_P256,
            lib_1.KeySpec.ECC_NIST_P384,
            lib_1.KeySpec.ECC_NIST_P521,
            lib_1.KeySpec.ECC_SECG_P256K1,
            lib_1.KeySpec.SYMMETRIC_DEFAULT,
            lib_1.KeySpec.SM2,
        ],
    };
    const testCases = [];
    for (const keySpec in lib_1.KeySpec) {
        for (const keyUsage in lib_1.KeyUsage) {
            if (denyLists[keyUsage].includes(keySpec)) {
                testCases.push({
                    keySpec: keySpec,
                    keyUsage: keyUsage,
                    toString: () => `${keySpec} can not be used for ${keyUsage}`,
                });
            }
        }
    }
    // Sorting for debugging purposes to see if test cases match deny list
    testCases.sort((a, b) => a.keyUsage.localeCompare(b.keyUsage));
    return testCases;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJrZXkudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMsOERBQThEO0FBQzlELHFDQUFxQztBQUNyQyw4QkFBOEI7QUFDOUIsZ0NBQTJDO0FBRTNDLE1BQU0sYUFBYSxHQUFhO0lBQzlCLGFBQWE7SUFDYixlQUFlO0lBQ2YsYUFBYTtJQUNiLFdBQVc7SUFDWCxVQUFVO0lBQ1YsYUFBYTtJQUNiLGFBQWE7SUFDYixjQUFjO0lBQ2QsVUFBVTtJQUNWLGFBQWE7SUFDYixpQkFBaUI7SUFDakIsbUJBQW1CO0lBQ25CLHlCQUF5QjtJQUN6Qix1QkFBdUI7Q0FDeEIsQ0FBQztBQUVGLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO0lBQ3ZCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzlCLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFNUIscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBRTtRQUNyRCxVQUFVLEVBQUU7WUFDVixTQUFTLEVBQUU7Z0JBQ1QsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE1BQU0sRUFBRSxPQUFPO3dCQUNmLE1BQU0sRUFBRSxPQUFPO3dCQUNmLFNBQVMsRUFBRTs0QkFDVCxHQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFO3lCQUM3Rzt3QkFDRCxRQUFRLEVBQUUsR0FBRztxQkFDZDtpQkFDRjtnQkFDRCxPQUFPLEVBQUUsWUFBWTthQUN0QjtT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LGFBQWE7WUFDckIsYUFBTyxDQUFDLGFBQWE7WUFDckIsYUFBTyxDQUFDLGFBQWE7WUFDckIsYUFBTyxDQUFDLGVBQWU7WUFDdkIsYUFBTyxDQUFDLGlCQUFpQjtZQUN6QixhQUFPLENBQUMsR0FBRztTQUNaO0tBQ0YsQ0FBQztJQUNGLE1BQU0sU0FBUyxHQUF1RSxFQUFFLENBQUM7SUFDekYsS0FBSyxNQUFNLE9BQU8sSUFBSSxhQUFPLEVBQUU7UUFDN0IsS0FBSyxNQUFNLFFBQVEsSUFBSSxjQUFRLEVBQUU7WUFDL0IsSUFBSSxTQUFTLENBQUMsUUFBb0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFrQixDQUFDLEVBQUU7Z0JBQ2hFLFNBQVMsQ0FBQyxJQUFJLENBQUM7b0JBQ2IsT0FBTyxFQUFFLE9BQWtCO29CQUMzQixRQUFRLEVBQUUsUUFBb0I7b0JBQzlCLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLE9BQU8sd0JBQXdCLFFBQVEsRUFBRTtpQkFDN0QsQ0FBQyxDQUFDO2FBQ0o7U0FDRjtLQUNGO0lBQ0Qsc0VBQXNFO0lBQ3RFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUMvRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBkZXNjcmliZURlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMga21zIGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBLZXlTcGVjLCBLZXlVc2FnZSB9IGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IEFETUlOX0FDVElPTlM6IHN0cmluZ1tdID0gW1xuICAna21zOkNyZWF0ZSonLFxuICAna21zOkRlc2NyaWJlKicsXG4gICdrbXM6RW5hYmxlKicsXG4gICdrbXM6TGlzdConLFxuICAna21zOlB1dConLFxuICAna21zOlVwZGF0ZSonLFxuICAna21zOlJldm9rZSonLFxuICAna21zOkRpc2FibGUqJyxcbiAgJ2ttczpHZXQqJyxcbiAgJ2ttczpEZWxldGUqJyxcbiAgJ2ttczpUYWdSZXNvdXJjZScsXG4gICdrbXM6VW50YWdSZXNvdXJjZScsXG4gICdrbXM6U2NoZWR1bGVLZXlEZWxldGlvbicsXG4gICdrbXM6Q2FuY2VsS2V5RGVsZXRpb24nLFxuXTtcblxudGVzdCgnZGVmYXVsdCBrZXknLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBuZXcga21zLktleShzdGFjaywgJ015S2V5Jyk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpLTVM6OktleScsIHtcbiAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICBLZXlQb2xpY3k6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAna21zOionLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgIEFXUzogeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6aWFtOjonLCB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnOnJvb3QnXV0gfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBEZWxldGlvblBvbGljeTogJ1JldGFpbicsXG4gICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ1JldGFpbicsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2RlZmF1bHQgd2l0aCBubyByZXRlbnRpb24nLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBuZXcga21zLktleShzdGFjaywgJ015S2V5JywgeyByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6S01TOjpLZXknLCB7IERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJywgVXBkYXRlUmVwbGFjZVBvbGljeTogJ0RlbGV0ZScgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2tleSBwb2xpY2llcycsICgpID0+IHtcbiAgdGVzdCgnY2FuIHNwZWNpZnkgYSBkZWZhdWx0IGtleSBwb2xpY3knLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgcG9saWN5ID0gbmV3IGlhbS5Qb2xpY3lEb2N1bWVudCgpO1xuICAgIGNvbnN0IHN0YXRlbWVudCA9IG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHsgcmVzb3VyY2VzOiBbJyonXSwgYWN0aW9uczogWydrbXM6UHV0KiddIH0pO1xuICAgIHN0YXRlbWVudC5hZGRBcm5QcmluY2lwYWwoJ2Fybjphd3M6aWFtOjoxMTExMjIyMjMzMzM6cm9vdCcpO1xuICAgIHBvbGljeS5hZGRTdGF0ZW1lbnRzKHN0YXRlbWVudCk7XG5cbiAgICBuZXcga21zLktleShzdGFjaywgJ015S2V5JywgeyBwb2xpY3kgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICAgIEtleVBvbGljeToge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdrbXM6UHV0KicsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgQVdTOiAnYXJuOmF3czppYW06OjExMTEyMjIyMzMzMzpyb290JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBhcHBlbmQgdG8gdGhlIGRlZmF1bHQga2V5IHBvbGljeScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBzdGF0ZW1lbnQgPSBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7IHJlc291cmNlczogWycqJ10sIGFjdGlvbnM6IFsna21zOlB1dConXSB9KTtcbiAgICBzdGF0ZW1lbnQuYWRkQXJuUHJpbmNpcGFsKCdhcm46YXdzOmlhbTo6MTExMTIyMjIzMzMzOnJvb3QnKTtcblxuICAgIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnTXlLZXknKTtcbiAgICBrZXkuYWRkVG9SZXNvdXJjZVBvbGljeShzdGF0ZW1lbnQpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpLZXknLCB7XG4gICAgICBLZXlQb2xpY3k6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAna21zOionLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgIEFXUzogeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6aWFtOjonLCB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnOnJvb3QnXV0gfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAna21zOlB1dConLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgIEFXUzogJ2Fybjphd3M6aWFtOjoxMTExMjIyMjMzMzM6cm9vdCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdkZWNyeXB0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdLZXknKTtcbiAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnVXNlcicpO1xuXG4gICAgLy8gV0hFTlxuICAgIGtleS5ncmFudERlY3J5cHQodXNlcik7XG5cbiAgICAvLyBUSEVOXG4gICAgLy8gS2V5IHBvbGljeSBzaG91bGQgYmUgdW5tb2RpZmllZCBieSB0aGUgZ3JhbnQuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpLZXknLCB7XG4gICAgICBLZXlQb2xpY3k6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAna21zOionLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7IEFXUzogeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6aWFtOjonLCB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnOnJvb3QnXV0gfSB9LFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdrbXM6RGVjcnlwdCcsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogeyAnRm46OkdldEF0dCc6IFsnS2V5OTYxQjczRkQnLCAnQXJuJ10gfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlbmNyeXB0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdLZXknKTtcbiAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnVXNlcicpO1xuXG4gICAgLy8gV0hFTlxuICAgIGtleS5ncmFudEVuY3J5cHQodXNlcik7XG5cbiAgICAvLyBUSEVOXG4gICAgLy8gS2V5IHBvbGljeSBzaG91bGQgYmUgdW5tb2RpZmllZCBieSB0aGUgZ3JhbnQuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpLZXknLCB7XG4gICAgICBLZXlQb2xpY3k6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAna21zOionLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7IEFXUzogeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6aWFtOjonLCB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnOnJvb3QnXV0gfSB9LFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFsna21zOkVuY3J5cHQnLCAna21zOlJlRW5jcnlwdConLCAna21zOkdlbmVyYXRlRGF0YUtleSonXSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiB7ICdGbjo6R2V0QXR0JzogWydLZXk5NjFCNzNGRCcsICdBcm4nXSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dyYW50IGZvciBhIHByaW5jaXBhbCBpbiBhIGRlcGVuZGVudCBzdGFjayB3b3JrcyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBwcmluY2lwYWxTdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnUHJpbmNpcGFsU3RhY2snKTtcbiAgICBjb25zdCBwcmluY2lwYWwgPSBuZXcgaWFtLlJvbGUocHJpbmNpcGFsU3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFueVByaW5jaXBhbCgpLFxuICAgIH0pO1xuXG4gICAgY29uc3Qga2V5U3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ0tleVN0YWNrJyk7XG4gICAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoa2V5U3RhY2ssICdLZXknKTtcblxuICAgIHByaW5jaXBhbFN0YWNrLmFkZERlcGVuZGVuY3koa2V5U3RhY2spO1xuXG4gICAga2V5LmdyYW50RW5jcnlwdChwcmluY2lwYWwpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHByaW5jaXBhbFN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgJ2ttczpFbmNyeXB0JyxcbiAgICAgICAgICAgICAgJ2ttczpSZUVuY3J5cHQqJyxcbiAgICAgICAgICAgICAgJ2ttczpHZW5lcmF0ZURhdGFLZXkqJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkltcG9ydFZhbHVlJzogJ0tleVN0YWNrOkV4cG9ydHNPdXRwdXRGbkdldEF0dEtleTk2MUI3M0ZEQXJuNUE4NjBDNDMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdncmFudCBmb3IgYSBwcmluY2lwYWwgaW4gYSBkaWZmZXJlbnQgcmVnaW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3QgcHJpbmNpcGFsU3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1ByaW5jaXBhbFN0YWNrJywgeyBlbnY6IHsgcmVnaW9uOiAndGVzdHJlZ2lvbjEnIH0gfSk7XG4gICAgY29uc3QgcHJpbmNpcGFsID0gbmV3IGlhbS5Sb2xlKHByaW5jaXBhbFN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BbnlQcmluY2lwYWwoKSxcbiAgICAgIHJvbGVOYW1lOiAnTXlSb2xlUGh5c2ljYWxOYW1lJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGtleVN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdLZXlTdGFjaycsIHsgZW52OiB7IHJlZ2lvbjogJ3Rlc3RyZWdpb24yJyB9IH0pO1xuICAgIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KGtleVN0YWNrLCAnS2V5Jyk7XG5cbiAgICBrZXkuZ3JhbnRFbmNyeXB0KHByaW5jaXBhbCk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soa2V5U3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICAgIEtleVBvbGljeToge1xuICAgICAgICBTdGF0ZW1lbnQ6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICdrbXM6RW5jcnlwdCcsXG4gICAgICAgICAgICAgICdrbXM6UmVFbmNyeXB0KicsXG4gICAgICAgICAgICAgICdrbXM6R2VuZXJhdGVEYXRhS2V5KicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7IEFXUzogeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6aWFtOjonLCB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnOnJvbGUvTXlSb2xlUGh5c2ljYWxOYW1lJ11dIH0gfSxcbiAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSksXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHByaW5jaXBhbFN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgJ2ttczpFbmNyeXB0JyxcbiAgICAgICAgICAgICAgJ2ttczpSZUVuY3J5cHQqJyxcbiAgICAgICAgICAgICAgJ2ttczpHZW5lcmF0ZURhdGFLZXkqJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dyYW50IGZvciBhIHByaW5jaXBhbCBpbiBhIGRpZmZlcmVudCBhY2NvdW50JywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3QgcHJpbmNpcGFsU3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1ByaW5jaXBhbFN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzAxMjM0NTY3ODkwMTInIH0gfSk7XG4gICAgY29uc3QgcHJpbmNpcGFsID0gbmV3IGlhbS5Sb2xlKHByaW5jaXBhbFN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BbnlQcmluY2lwYWwoKSxcbiAgICAgIHJvbGVOYW1lOiAnTXlSb2xlUGh5c2ljYWxOYW1lJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGtleVN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdLZXlTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6ICcxMTExMTExMTExMTEnIH0gfSk7XG4gICAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoa2V5U3RhY2ssICdLZXknKTtcblxuICAgIGtleS5ncmFudEVuY3J5cHQocHJpbmNpcGFsKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhrZXlTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktNUzo6S2V5Jywge1xuICAgICAgS2V5UG9saWN5OiB7XG4gICAgICAgIFN0YXRlbWVudDogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAna21zOkVuY3J5cHQnLFxuICAgICAgICAgICAgJ2ttczpSZUVuY3J5cHQqJyxcbiAgICAgICAgICAgICdrbXM6R2VuZXJhdGVEYXRhS2V5KicsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUHJpbmNpcGFsOiB7IEFXUzogeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6aWFtOjowMTIzNDU2Nzg5MDEyOnJvbGUvTXlSb2xlUGh5c2ljYWxOYW1lJ11dIH0gfSxcbiAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICB9XSksXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHByaW5jaXBhbFN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgJ2ttczpFbmNyeXB0JyxcbiAgICAgICAgICAgICAgJ2ttczpSZUVuY3J5cHQqJyxcbiAgICAgICAgICAgICAgJ2ttczpHZW5lcmF0ZURhdGFLZXkqJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dyYW50IGZvciBhbiBpbW11dGFibGUgcm9sZScsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHByaW5jaXBhbFN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdQcmluY2lwYWxTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6ICcwMTIzNDU2Nzg5MDEyJyB9IH0pO1xuICAgIGNvbnN0IHByaW5jaXBhbCA9IG5ldyBpYW0uUm9sZShwcmluY2lwYWxTdGFjaywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQW55UHJpbmNpcGFsKCksXG4gICAgICByb2xlTmFtZTogJ015Um9sZVBoeXNpY2FsTmFtZScsXG4gICAgfSk7XG5cbiAgICBjb25zdCBrZXlTdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnS2V5U3RhY2snLCB7IGVudjogeyBhY2NvdW50OiAnMTExMTExMTExMTExJyB9IH0pO1xuICAgIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KGtleVN0YWNrLCAnS2V5Jyk7XG4gICAgcHJpbmNpcGFsU3RhY2suYWRkRGVwZW5kZW5jeShrZXlTdGFjayk7XG4gICAga2V5LmdyYW50RW5jcnlwdChwcmluY2lwYWwud2l0aG91dFBvbGljeVVwZGF0ZXMoKSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soa2V5U3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICAgIEtleVBvbGljeToge1xuICAgICAgICBTdGF0ZW1lbnQ6IE1hdGNoLmFycmF5V2l0aChbe1xuICAgICAgICAgIEFjdGlvbjogJ2ttczoqJyxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUHJpbmNpcGFsOiB7IEFXUzogeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6aWFtOjoxMTExMTExMTExMTE6cm9vdCddXSB9IH0sXG4gICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgJ2ttczpFbmNyeXB0JyxcbiAgICAgICAgICAgICdrbXM6UmVFbmNyeXB0KicsXG4gICAgICAgICAgICAna21zOkdlbmVyYXRlRGF0YUtleSonLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFByaW5jaXBhbDogeyBBV1M6IHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOmlhbTo6MDEyMzQ1Njc4OTAxMjpyb290J11dIH0gfSxcbiAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICB9XSksXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZGl0aW9uYWwga2V5IGFkbWlucyBjYW4gYmUgc3BlY2lmaWVkICh3aXRoIGltcG9ydGVkL2ltbXV0YWJsZSBwcmluY2lwYWwpJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFkbWluUm9sZSA9IGlhbS5Sb2xlLmZyb21Sb2xlQXJuKHN0YWNrLCAnQWRtaW4nLCAnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL1RydXN0ZWRBZG1pbicpO1xuICAgIG5ldyBrbXMuS2V5KHN0YWNrLCAnTXlLZXknLCB7IGFkbWluczogW2FkbWluUm9sZV0gfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICAgIEtleVBvbGljeToge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdrbXM6KicsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgQVdTOiB7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzppYW06OicsIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6cm9vdCddXSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IEFETUlOX0FDVElPTlMsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgQVdTOiAnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL1RydXN0ZWRBZG1pbicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhZGRpdGlvbmFsIGtleSBhZG1pbnMgY2FuIGJlIHNwZWNpZmllZCAod2l0aCBvd25lZC9tdXRhYmxlIHByaW5jaXBhbCknLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYWRtaW5Sb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnQWRtaW5Sb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCksXG4gICAgfSk7XG4gICAgbmV3IGttcy5LZXkoc3RhY2ssICdNeUtleScsIHsgYWRtaW5zOiBbYWRtaW5Sb2xlXSB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktNUzo6S2V5Jywge1xuICAgICAgS2V5UG9saWN5OiB7XG4gICAgICAgIC8vIFVubW9kaWZpZWQgLSBkZWZhdWx0IGtleSBwb2xpY3lcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAna21zOionLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgIEFXUzogeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6aWFtOjonLCB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnOnJvb3QnXV0gfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IEFETUlOX0FDVElPTlMsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogeyAnRm46OkdldEF0dCc6IFsnTXlLZXk2QUIyOUZBNicsICdBcm4nXSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbnRlc3QoJ2tleSB3aXRoIHNvbWUgb3B0aW9ucycsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnTXlLZXknLCB7XG4gICAgZW5hYmxlS2V5Um90YXRpb246IHRydWUsXG4gICAgZW5hYmxlZDogZmFsc2UsXG4gICAgcGVuZGluZ1dpbmRvdzogY2RrLkR1cmF0aW9uLmRheXMoNyksXG4gIH0pO1xuXG4gIGNkay5UYWdzLm9mKGtleSkuYWRkKCd0YWcxJywgJ3ZhbHVlMScpO1xuICBjZGsuVGFncy5vZihrZXkpLmFkZCgndGFnMicsICd2YWx1ZTInKTtcbiAgY2RrLlRhZ3Mub2Yoa2V5KS5hZGQoJ3RhZzMnLCAnJyk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpLZXknLCB7XG4gICAgRW5hYmxlZDogZmFsc2UsXG4gICAgRW5hYmxlS2V5Um90YXRpb246IHRydWUsXG4gICAgUGVuZGluZ1dpbmRvd0luRGF5czogNyxcbiAgICBUYWdzOiBbXG4gICAgICB7XG4gICAgICAgIEtleTogJ3RhZzEnLFxuICAgICAgICBWYWx1ZTogJ3ZhbHVlMScsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBLZXk6ICd0YWcyJyxcbiAgICAgICAgVmFsdWU6ICd2YWx1ZTInLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgS2V5OiAndGFnMycsXG4gICAgICAgIFZhbHVlOiAnJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdCgnc2V0dGluZyBwZW5kaW5nV2luZG93IHZhbHVlIHRvIG5vdCBpbiBhbGxvd2VkIHJhbmdlIHdpbGwgdGhyb3cnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBleHBlY3QoKCkgPT4gbmV3IGttcy5LZXkoc3RhY2ssICdNeUtleScsIHsgZW5hYmxlS2V5Um90YXRpb246IHRydWUsIHBlbmRpbmdXaW5kb3c6IGNkay5EdXJhdGlvbi5kYXlzKDYpIH0pKVxuICAgIC50b1Rocm93KCdcXCdwZW5kaW5nV2luZG93XFwnIHZhbHVlIG11c3QgYmV0d2VlbiA3IGFuZCAzMCBkYXlzLiBSZWNlaXZlZDogNicpO1xufSk7XG5cbmRlc2NyaWJlRGVwcmVjYXRlZCgndHJ1c3RBY2NvdW50SWRlbnRpdGllcyBpcyBkZXByZWNhdGVkJywgKCkgPT4ge1xuICB0ZXN0KCdzZXR0aW5nIHRydXN0QWNjb3VudElkZW50aXRpZXMgdG8gZmFsc2Ugd2lsbCB0aHJvdyAod2hlbiB0aGUgZGVmYXVsdEtleVBvbGljaWVzIGZlYXR1cmUgZmxhZyBpcyBlbmFibGVkKScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBleHBlY3QoKCkgPT4gbmV3IGttcy5LZXkoc3RhY2ssICdNeUtleScsIHsgdHJ1c3RBY2NvdW50SWRlbnRpdGllczogZmFsc2UgfSkpXG4gICAgICAudG9UaHJvdygnYHRydXN0QWNjb3VudElkZW50aXRpZXNgIGNhbm5vdCBiZSBmYWxzZSBpZiB0aGUgQGF3cy1jZGsvYXdzLWttczpkZWZhdWx0S2V5UG9saWNpZXMgZmVhdHVyZSBmbGFnIGlzIHNldCcpO1xuICB9KTtcbn0pO1xuXG50ZXN0KCdhZGRBbGlhcyBjcmVhdGVzIGFuIGFsaWFzJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdNeUtleScsIHtcbiAgICBlbmFibGVLZXlSb3RhdGlvbjogdHJ1ZSxcbiAgICBlbmFibGVkOiBmYWxzZSxcbiAgfSk7XG5cbiAgY29uc3QgYWxpYXMgPSBrZXkuYWRkQWxpYXMoJ2FsaWFzL3hvbycpO1xuICBleHBlY3QoYWxpYXMuYWxpYXNOYW1lKS50b0JlRGVmaW5lZCgpO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OktNUzo6QWxpYXMnLCAxKTtcbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpBbGlhcycsIHtcbiAgICBBbGlhc05hbWU6ICdhbGlhcy94b28nLFxuICAgIFRhcmdldEtleUlkOiB7XG4gICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgJ015S2V5NkFCMjlGQTYnLFxuICAgICAgICAnQXJuJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnY2FuIHJ1biBtdWx0aXBsZSBhZGRBbGlhcycsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnTXlLZXknLCB7XG4gICAgZW5hYmxlS2V5Um90YXRpb246IHRydWUsXG4gICAgZW5hYmxlZDogZmFsc2UsXG4gIH0pO1xuXG4gIGNvbnN0IGFsaWFzMSA9IGtleS5hZGRBbGlhcygnYWxpYXMvYWxpYXMxJyk7XG4gIGNvbnN0IGFsaWFzMiA9IGtleS5hZGRBbGlhcygnYWxpYXMvYWxpYXMyJyk7XG4gIGV4cGVjdChhbGlhczEuYWxpYXNOYW1lKS50b0JlRGVmaW5lZCgpO1xuICBleHBlY3QoYWxpYXMyLmFsaWFzTmFtZSkudG9CZURlZmluZWQoKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpLTVM6OkFsaWFzJywgMik7XG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktNUzo6QWxpYXMnLCB7XG4gICAgQWxpYXNOYW1lOiAnYWxpYXMvYWxpYXMxJyxcbiAgICBUYXJnZXRLZXlJZDoge1xuICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICdNeUtleTZBQjI5RkE2JyxcbiAgICAgICAgJ0FybicsXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OkFsaWFzJywge1xuICAgIEFsaWFzTmFtZTogJ2FsaWFzL2FsaWFzMicsXG4gICAgVGFyZ2V0S2V5SWQ6IHtcbiAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAnTXlLZXk2QUIyOUZBNicsXG4gICAgICAgICdBcm4nLFxuICAgICAgXSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdrZXlJZCByZXNvbHZlcyB0byBhIFJlZicsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnTXlLZXknKTtcblxuICBuZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ091dCcsIHtcbiAgICB2YWx1ZToga2V5LmtleUlkLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc091dHB1dCgnT3V0Jywge1xuICAgIFZhbHVlOiB7IFJlZjogJ015S2V5NkFCMjlGQTYnIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2ZhaWxzIGlmIGtleSBwb2xpY3kgaGFzIG5vIGFjdGlvbnMnLCAoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xuICBjb25zdCBrZXkgPSBuZXcga21zLktleShzdGFjaywgJ015S2V5Jyk7XG5cbiAga2V5LmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgIHJlc291cmNlczogWycqJ10sXG4gICAgcHJpbmNpcGFsczogW25ldyBpYW0uQXJuUHJpbmNpcGFsKCdhcm4nKV0sXG4gIH0pKTtcblxuICBleHBlY3QoKCkgPT4gYXBwLnN5bnRoKCkpLnRvVGhyb3coL0EgUG9saWN5U3RhdGVtZW50IG11c3Qgc3BlY2lmeSBhdCBsZWFzdCBvbmUgXFwnYWN0aW9uXFwnIG9yIFxcJ25vdEFjdGlvblxcJy8pO1xufSk7XG5cbnRlc3QoJ2ZhaWxzIGlmIGtleSBwb2xpY3kgaGFzIG5vIElBTSBwcmluY2lwYWxzJywgKCkgPT4ge1xuICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwKTtcbiAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdNeUtleScpO1xuXG4gIGtleS5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgIGFjdGlvbnM6IFsna21zOionXSxcbiAgfSkpO1xuXG4gIGV4cGVjdCgoKSA9PiBhcHAuc3ludGgoKSkudG9UaHJvdygvQSBQb2xpY3lTdGF0ZW1lbnQgdXNlZCBpbiBhIHJlc291cmNlLWJhc2VkIHBvbGljeSBtdXN0IHNwZWNpZnkgYXQgbGVhc3Qgb25lIElBTSBwcmluY2lwYWwvKTtcbn0pO1xuXG5kZXNjcmliZSgnaW1wb3J0ZWQga2V5cycsICgpID0+IHtcbiAgdGVzdCgndGhyb3cgYW4gZXJyb3Igd2hlbiBwcm92aWRpbmcgc29tZXRoaW5nIHRoYXQgaXMgbm90IGEgdmFsaWQga2V5IEFSTicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAga21zLktleS5mcm9tS2V5QXJuKHN0YWNrLCAnSW1wb3J0ZWQnLCAnYXJuOmF3czprbXM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjprZXknKTtcbiAgICB9KS50b1Rocm93KC9LTVMga2V5IEFSTiBtdXN0IGJlIGluIHRoZSBmb3JtYXQgJ2Fybjphd3M6a21zOjxyZWdpb24+OjxhY2NvdW50PjprZXlcXC88a2V5SWQ+JywgZ290OiAnYXJuOmF3czprbXM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjprZXknLyk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGhhdmUgYWxpYXNlcyBhZGRlZCB0byB0aGVtJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjazInKTtcbiAgICBjb25zdCBteUtleUltcG9ydGVkID0ga21zLktleS5mcm9tS2V5QXJuKHN0YWNrMiwgJ015S2V5SW1wb3J0ZWQnLFxuICAgICAgJ2Fybjphd3M6a21zOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6a2V5LzEyMzQ1Njc4LTEyMzQtMTIzNC0xMjM0LTEyMzQ1Njc4OTAxMicpO1xuXG4gICAgLy8gYWRkQWxpYXMgY2FuIGJlIGNhbGxlZCBvbiBpbXBvcnRlZCBrZXlzLlxuICAgIG15S2V5SW1wb3J0ZWQuYWRkQWxpYXMoJ2FsaWFzL2hlbGxvJyk7XG5cbiAgICBleHBlY3QobXlLZXlJbXBvcnRlZC5rZXlJZCkudG9FcXVhbCgnMTIzNDU2NzgtMTIzNC0xMjM0LTEyMzQtMTIzNDU2Nzg5MDEyJyk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2syKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15S2V5SW1wb3J0ZWRBbGlhc0IxQzUyNjlGOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6S01TOjpBbGlhcycsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgQWxpYXNOYW1lOiAnYWxpYXMvaGVsbG8nLFxuICAgICAgICAgICAgVGFyZ2V0S2V5SWQ6ICdhcm46YXdzOmttczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmtleS8xMjM0NTY3OC0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkwMTInLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnZnJvbUNmbktleSgpJywgKCkgPT4ge1xuICBsZXQgc3RhY2s6IGNkay5TdGFjaztcbiAgbGV0IGNmbktleToga21zLkNmbktleTtcbiAgbGV0IGtleToga21zLklLZXk7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY2ZuS2V5ID0gbmV3IGttcy5DZm5LZXkoc3RhY2ssICdDZm5LZXknLCB7XG4gICAgICBrZXlQb2xpY3k6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAna21zOionLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgIEFXUzogY2RrLkZuLmpvaW4oJycsIFtcbiAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgY2RrLkF3cy5QQVJUSVRJT04sXG4gICAgICAgICAgICAgICAgJzppYW06OicsXG4gICAgICAgICAgICAgICAgY2RrLkF3cy5BQ0NPVU5UX0lELFxuICAgICAgICAgICAgICAgICc6cm9vdCcsXG4gICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBrZXkgPSBrbXMuS2V5LmZyb21DZm5LZXkoY2ZuS2V5KTtcbiAgfSk7XG5cbiAgdGVzdChcImNvcnJlY3RseSByZXNvbHZlcyB0aGUgJ2tleUlkJyBwcm9wZXJ0eVwiLCAoKSA9PiB7XG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoa2V5LmtleUlkKSkudG9TdHJpY3RFcXVhbCh7XG4gICAgICBSZWY6ICdDZm5LZXknLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KFwiY29ycmVjdGx5IHJlc29sdmVzIHRoZSAna2V5QXJuJyBwcm9wZXJ0eVwiLCAoKSA9PiB7XG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoa2V5LmtleUFybikpLnRvU3RyaWN0RXF1YWwoe1xuICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ0NmbktleScsICdBcm4nXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncHJlc2VydmVzIHRoZSBLTVMgS2V5IHJlc291cmNlJywgKCkgPT4ge1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktNUzo6S2V5Jywge1xuICAgICAgS2V5UG9saWN5OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ2ttczoqJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICBBV1M6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgICAnOmlhbTo6JyxcbiAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgICAgICAgICAnOnJvb3QnLFxuICAgICAgICAgICAgICAgIF1dLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpLTVM6OktleScsIDEpO1xuICB9KTtcblxuICBkZXNjcmliZShcImNhbGxpbmcgJ2FkZFRvUmVzb3VyY2VQb2xpY3koKScgb24gdGhlIHJldHVybmVkIEtleVwiLCAoKSA9PiB7XG4gICAgbGV0IGFkZFRvUmVzb3VyY2VQb2xpY3lSZXN1bHQ6IGlhbS5BZGRUb1Jlc291cmNlUG9saWN5UmVzdWx0O1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBhZGRUb1Jlc291cmNlUG9saWN5UmVzdWx0ID0ga2V5LmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbJ2ttczphY3Rpb24nXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uQW55UHJpbmNpcGFsKCldLFxuICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgdGVzdChcInRoZSBBZGRUb1Jlc291cmNlUG9saWN5UmVzdWx0IHJldHVybmVkIGhhcyAnc3RhdGVtZW50QWRkZWQnIHNldCB0byAndHJ1ZSdcIiwgKCkgPT4ge1xuICAgICAgZXhwZWN0KGFkZFRvUmVzb3VyY2VQb2xpY3lSZXN1bHQuc3RhdGVtZW50QWRkZWQpLnRvQmVUcnV0aHkoKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3ByZXNlcnZlcyB0aGUgbXV0YXRpbmcgY2FsbCBpbiB0aGUgcmVzdWx0aW5nIHRlbXBsYXRlJywgKCkgPT4ge1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpLZXknLCB7XG4gICAgICAgIEtleVBvbGljeToge1xuICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdrbXM6KicsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgICAgQVdTOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICAgICAnOmlhbTo6JyxcbiAgICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpyb290JyxcbiAgICAgICAgICAgICAgICAgIF1dLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdrbXM6YWN0aW9uJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHsgQVdTOiAnKicgfSxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2NhbGxpbmcgZnJvbUNmbktleSgpIGFnYWluJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAga2V5ID0ga21zLktleS5mcm9tQ2ZuS2V5KGNmbktleSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnYW5kIHVzaW5nIGl0IGZvciBncmFudERlY3J5cHQoKSBvbiBhIFJvbGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFueVByaW5jaXBhbCgpLFxuICAgICAgICB9KTtcbiAgICAgICAga2V5LmdyYW50RGVjcnlwdChyb2xlKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdjcmVhdGVzIHRoZSBjb3JyZWN0IElBTSBQb2xpY3knLCAoKSA9PiB7XG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEFjdGlvbjogJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydDZm5LZXknLCAnQXJuJ10sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnY29ycmVjdGx5IG11dGF0ZXMgdGhlIFBvbGljeSBvZiB0aGUgdW5kZXJseWluZyBDZm5LZXknLCAoKSA9PiB7XG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktNUzo6S2V5Jywge1xuICAgICAgICAgIEtleVBvbGljeToge1xuICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBBY3Rpb246ICdrbXM6KicsXG4gICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICAgICAgQVdTOiB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICc6aWFtOjonLFxuICAgICAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJzpyb290JyxcbiAgICAgICAgICAgICAgICAgICAgXV0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEFjdGlvbjogJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgICAgICBBV1M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ1JvbGUxQUJDQzVGMCcsICdBcm4nXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZShcImNhbGxlZCB3aXRoIGEgQ2ZuS2V5IHRoYXQgaGFzIGFuICdGbjo6SWYnIHBhc3NlZCBhcyB0aGUgS2V5UG9saWN5XCIsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGNmbktleSA9IG5ldyBrbXMuQ2ZuS2V5KHN0YWNrLCAnQ2ZuS2V5MicsIHtcbiAgICAgICAga2V5UG9saWN5OiBjZGsuRm4uY29uZGl0aW9uSWYoXG4gICAgICAgICAgJ0Fsd2F5c1RydWUnLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQWN0aW9uOiAna21zOmFjdGlvbjEnLFxuICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICBQcmluY2lwYWw6ICcqJyxcbiAgICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQWN0aW9uOiAna21zOmFjdGlvbjInLFxuICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICBQcmluY2lwYWw6ICcqJyxcbiAgICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICB9LFxuICAgICAgICApLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3MgYSBkZXNjcmlwdGl2ZSBleGNlcHRpb24nLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBrbXMuS2V5LmZyb21DZm5LZXkoY2ZuS2V5KTtcbiAgICAgIH0pLnRvVGhyb3coL0NvdWxkIG5vdCBwYXJzZSB0aGUgUG9saWN5RG9jdW1lbnQgb2YgdGhlIHBhc3NlZCBBV1M6OktNUzo6S2V5Lyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKFwiY2FsbGVkIHdpdGggYSBDZm5LZXkgdGhhdCBoYXMgYW4gJ0ZuOjpJZicgcGFzc2VkIGFzIHRoZSBTdGF0ZW1lbnQgb2YgYSBLZXlQb2xpY3lcIiwgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgY2ZuS2V5ID0gbmV3IGttcy5DZm5LZXkoc3RhY2ssICdDZm5LZXkyJywge1xuICAgICAgICBrZXlQb2xpY3k6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IGNkay5Gbi5jb25kaXRpb25JZihcbiAgICAgICAgICAgICdBbHdheXNUcnVlJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEFjdGlvbjogJ2ttczphY3Rpb24xJyxcbiAgICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgUHJpbmNpcGFsOiAnKicsXG4gICAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBBY3Rpb246ICdrbXM6YWN0aW9uMicsXG4gICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgIFByaW5jaXBhbDogJyonLFxuICAgICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICksXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3MgYSBkZXNjcmlwdGl2ZSBleGNlcHRpb24nLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBrbXMuS2V5LmZyb21DZm5LZXkoY2ZuS2V5KTtcbiAgICAgIH0pLnRvVGhyb3coL0NvdWxkIG5vdCBwYXJzZSB0aGUgUG9saWN5RG9jdW1lbnQgb2YgdGhlIHBhc3NlZCBBV1M6OktNUzo6S2V5Lyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKFwiY2FsbGVkIHdpdGggYSBDZm5LZXkgdGhhdCBoYXMgYW4gJ0ZuOjpJZicgcGFzc2VkIGFzIG9uZSBvZiB0aGUgc3RhdGVtZW50cyBvZiBhIEtleVBvbGljeVwiLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBjZm5LZXkgPSBuZXcga21zLkNmbktleShzdGFjaywgJ0NmbktleTInLCB7XG4gICAgICAgIGtleVBvbGljeToge1xuICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgY2RrLkZuLmNvbmRpdGlvbklmKFxuICAgICAgICAgICAgICAnQWx3YXlzVHJ1ZScsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBBY3Rpb246ICdrbXM6YWN0aW9uMScsXG4gICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgIFByaW5jaXBhbDogJyonLFxuICAgICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBBY3Rpb246ICdrbXM6YWN0aW9uMicsXG4gICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgIFByaW5jaXBhbDogJyonLFxuICAgICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3MgYSBkZXNjcmlwdGl2ZSBleGNlcHRpb24nLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBrbXMuS2V5LmZyb21DZm5LZXkoY2ZuS2V5KTtcbiAgICAgIH0pLnRvVGhyb3coL0NvdWxkIG5vdCBwYXJzZSB0aGUgUG9saWN5RG9jdW1lbnQgb2YgdGhlIHBhc3NlZCBBV1M6OktNUzo6S2V5Lyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKFwiY2FsbGVkIHdpdGggYSBDZm5LZXkgdGhhdCBoYXMgYW4gJ0ZuOjpJZicgcGFzc2VkIGZvciB0aGUgQWN0aW9uIGluIG9uZSBvZiB0aGUgc3RhdGVtZW50cyBvZiBhIEtleVBvbGljeVwiLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBjZm5LZXkgPSBuZXcga21zLkNmbktleShzdGFjaywgJ0NmbktleTInLCB7XG4gICAgICAgIGtleVBvbGljeToge1xuICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246IGNkay5Gbi5jb25kaXRpb25JZignQWx3YXlzVHJ1ZScsICdrbXM6YWN0aW9uMScsICdrbXM6YWN0aW9uMicpLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFByaW5jaXBhbDogJyonLFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIGEgZGVzY3JpcHRpdmUgZXhjZXB0aW9uJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAga2V5ID0ga21zLktleS5mcm9tQ2ZuS2V5KGNmbktleSk7XG4gICAgICB9KS50b1Rocm93KC9Db3VsZCBub3QgcGFyc2UgdGhlIFBvbGljeURvY3VtZW50IG9mIHRoZSBwYXNzZWQgQVdTOjpLTVM6OktleS8pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnYWRkVG9SZXNvdXJjZVBvbGljeSBhbGxvd05vT3AgYW5kIHRoZXJlIGlzIG5vIHBvbGljeScsICgpID0+IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGplc3QvZXhwZWN0LWV4cGVjdFxuICB0ZXN0KCdzdWNjZWVkIGlmIHNldCB0byB0cnVlIChkZWZhdWx0KScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBrZXkgPSBrbXMuS2V5LmZyb21LZXlBcm4oc3RhY2ssICdJbXBvcnRlZCcsXG4gICAgICAnYXJuOmF3czprbXM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjprZXkvMTIzNDU2NzgtMTIzNC0xMjM0LTEyMzQtMTIzNDU2Nzg5MDEyJyk7XG5cbiAgICBrZXkuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7IHJlc291cmNlczogWycqJ10sIGFjdGlvbnM6IFsnKiddIH0pKTtcblxuICB9KTtcblxuICB0ZXN0KCdmYWlscyBpZiBzZXQgdG8gZmFsc2UnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qga2V5ID0ga21zLktleS5mcm9tS2V5QXJuKHN0YWNrLCAnSW1wb3J0ZWQnLFxuICAgICAgJ2Fybjphd3M6a21zOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6a2V5LzEyMzQ1Njc4LTEyMzQtMTIzNC0xMjM0LTEyMzQ1Njc4OTAxMicpO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGtleS5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHsgcmVzb3VyY2VzOiBbJyonXSwgYWN0aW9uczogWycqJ10gfSksIC8qIGFsbG93Tm9PcCAqLyBmYWxzZSk7XG4gICAgfSkudG9UaHJvdygnVW5hYmxlIHRvIGFkZCBzdGF0ZW1lbnQgdG8gSUFNIHJlc291cmNlIHBvbGljeSBmb3IgS01TIGtleTogXCJhcm46YXdzOmttczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmtleS8xMjM0NTY3OC0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkwMTJcIicpO1xuXG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdrZXkgc3BlY3MgYW5kIGtleSB1c2FnZXMnLCAoKSA9PiB7XG4gIHRlc3QoJ2JvdGggdXNhZ2UgYW5kIHNwZWMgYXJlIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcga21zLktleShzdGFjaywgJ0tleScsIHsga2V5U3BlYzoga21zLktleVNwZWMuRUNDX1NFQ0dfUDI1NksxLCBrZXlVc2FnZToga21zLktleVVzYWdlLlNJR05fVkVSSUZZIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpLZXknLCB7XG4gICAgICBLZXlTcGVjOiAnRUNDX1NFQ0dfUDI1NksxJyxcbiAgICAgIEtleVVzYWdlOiAnU0lHTl9WRVJJRlknLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdvbmx5IGtleSB1c2FnZSBpcyBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IGttcy5LZXkoc3RhY2ssICdLZXknLCB7IGtleVVzYWdlOiBrbXMuS2V5VXNhZ2UuRU5DUllQVF9ERUNSWVBUIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpLZXknLCB7XG4gICAgICBLZXlVc2FnZTogJ0VOQ1JZUFRfREVDUllQVCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ29ubHkga2V5IHNwZWMgaXMgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBrbXMuS2V5KHN0YWNrLCAnS2V5JywgeyBrZXlTcGVjOiBrbXMuS2V5U3BlYy5SU0FfNDA5NiB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktNUzo6S2V5Jywge1xuICAgICAgS2V5U3BlYzogJ1JTQV80MDk2JyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdC5lYWNoKGdlbmVyYXRlSW52YWxpZEtleVNwZWNLZXlVc2FnZUNvbWJpbmF0aW9ucygpKSgnaW52YWxpZCBjb21iaW5hdGlvbnMgb2Yga2V5IHNwZWNzIGFuZCBrZXkgdXNhZ2VzICglcyknLCAoeyBrZXlTcGVjLCBrZXlVc2FnZSB9KSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IGttcy5LZXkoc3RhY2ssICdLZXkxJywgeyBrZXlTcGVjLCBrZXlVc2FnZSB9KSlcbiAgICAgIC50b1Rocm93KGBrZXkgc3BlYyBcXCcke2tleVNwZWN9XFwnIGlzIG5vdCB2YWxpZCB3aXRoIHVzYWdlIFxcJyR7a2V5VXNhZ2UudG9TdHJpbmcoKX1cXCdgKTtcbiAgfSk7XG5cbiAgdGVzdCgnaW52YWxpZCBjb21iaW5hdGlvbnMgb2YgZGVmYXVsdCBrZXkgc3BlYyBhbmQga2V5IHVzYWdlIFNJR05fVkVSSUZZJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBrbXMuS2V5KHN0YWNrLCAnS2V5MScsIHsga2V5VXNhZ2U6IEtleVVzYWdlLlNJR05fVkVSSUZZIH0pKVxuICAgICAgLnRvVGhyb3coJ2tleSBzcGVjIFxcJ1NZTU1FVFJJQ19ERUZBVUxUXFwnIGlzIG5vdCB2YWxpZCB3aXRoIHVzYWdlIFxcJ1NJR05fVkVSSUZZXFwnJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIGlmIGtleSByb3RhdGlvbiBlbmFibGVkIG9uIGFzeW1tZXRyaWMga2V5JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBrbXMuS2V5KHN0YWNrLCAnS2V5JywgeyBlbmFibGVLZXlSb3RhdGlvbjogdHJ1ZSwga2V5U3BlYzoga21zLktleVNwZWMuUlNBXzMwNzIgfSkpXG4gICAgICAudG9UaHJvdygna2V5IHJvdGF0aW9uIGNhbm5vdCBiZSBlbmFibGVkIG9uIGFzeW1tZXRyaWMga2V5cycpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnS2V5LmZyb21LZXlBcm4oKScsICgpID0+IHtcbiAgbGV0IHN0YWNrOiBjZGsuU3RhY2s7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnQmFzZScsIHtcbiAgICAgIGVudjogeyBhY2NvdW50OiAnMTExMTExMTExMTExJywgcmVnaW9uOiAnc3RhY2stcmVnaW9uJyB9LFxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZm9yIGEga2V5IGluIGEgZGlmZmVyZW50IGFjY291bnQgYW5kIHJlZ2lvbicsICgpID0+IHtcbiAgICBsZXQga2V5OiBrbXMuSUtleTtcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAga2V5ID0ga21zLktleS5mcm9tS2V5QXJuKFxuICAgICAgICBzdGFjayxcbiAgICAgICAgJ2lLZXknLFxuICAgICAgICAnYXJuOmF3czprbXM6a2V5LXJlZ2lvbjoyMjIyMjIyMjIyMjI6a2V5OmtleS1uYW1lJyxcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KFwidGhlIGtleSdzIHJlZ2lvbiBpcyB0YWtlbiBmcm9tIHRoZSBBUk5cIiwgKCkgPT4ge1xuICAgICAgZXhwZWN0KGtleS5lbnYucmVnaW9uKS50b0JlKCdrZXktcmVnaW9uJyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KFwidGhlIGtleSdzIGFjY291bnQgaXMgdGFrZW4gZnJvbSB0aGUgQVJOXCIsICgpID0+IHtcbiAgICAgIGV4cGVjdChrZXkuZW52LmFjY291bnQpLnRvQmUoJzIyMjIyMjIyMjIyMicpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnSE1BQycsICgpID0+IHtcbiAgbGV0IHN0YWNrOiBjZGsuU3RhY2s7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChbXG4gICAgW0tleVNwZWMuSE1BQ18yMjQsICdITUFDXzIyNCddLFxuICAgIFtLZXlTcGVjLkhNQUNfMjU2LCAnSE1BQ18yNTYnXSxcbiAgICBbS2V5U3BlYy5ITUFDXzM4NCwgJ0hNQUNfMzg0J10sXG4gICAgW0tleVNwZWMuSE1BQ181MTIsICdITUFDXzUxMiddLFxuICBdKSgnJXMgaXMgbm90IHZhbGlkIGZvciBkZWZhdWx0IHVzYWdlJywgKGtleVNwZWM6IEtleVNwZWMpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gbmV3IGttcy5LZXkoc3RhY2ssICdLZXkxJywgeyBrZXlTcGVjIH0pKVxuICAgICAgLnRvVGhyb3coYGtleSBzcGVjIFxcJyR7a2V5U3BlY31cXCcgaXMgbm90IHZhbGlkIHdpdGggdXNhZ2UgXFwnRU5DUllQVF9ERUNSWVBUXFwnYCk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChbXG4gICAgW0tleVNwZWMuSE1BQ18yMjQsICdITUFDXzIyNCddLFxuICAgIFtLZXlTcGVjLkhNQUNfMjU2LCAnSE1BQ18yNTYnXSxcbiAgICBbS2V5U3BlYy5ITUFDXzM4NCwgJ0hNQUNfMzg0J10sXG4gICAgW0tleVNwZWMuSE1BQ181MTIsICdITUFDXzUxMiddLFxuICBdKSgnJXMgY2FuIG5vdCBiZSB1c2VkIHdpdGgga2V5IHJvdGF0aW9uJywgKGtleVNwZWM6IEtleVNwZWMpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gbmV3IGttcy5LZXkoc3RhY2ssICdLZXknLCB7XG4gICAgICBrZXlTcGVjLFxuICAgICAga2V5VXNhZ2U6IEtleVVzYWdlLkdFTkVSQVRFX1ZFUklGWV9NQUMsXG4gICAgICBlbmFibGVLZXlSb3RhdGlvbjogdHJ1ZSxcbiAgICB9KSkudG9UaHJvdygna2V5IHJvdGF0aW9uIGNhbm5vdCBiZSBlbmFibGVkIG9uIEhNQUMga2V5cycpO1xuICB9KTtcblxuICB0ZXN0LmVhY2goW1xuICAgIFtLZXlTcGVjLkhNQUNfMjI0LCAnSE1BQ18yMjQnXSxcbiAgICBbS2V5U3BlYy5ITUFDXzI1NiwgJ0hNQUNfMjU2J10sXG4gICAgW0tleVNwZWMuSE1BQ18zODQsICdITUFDXzM4NCddLFxuICAgIFtLZXlTcGVjLkhNQUNfNTEyLCAnSE1BQ181MTInXSxcbiAgXSkoJyVzIGNhbiBiZSB1c2VkIGZvciBLTVMga2V5IGNyZWF0aW9uJywgKGtleVNwZWM6IEtleVNwZWMsIGV4cGVjdGVkOiBzdHJpbmcpID0+IHtcbiAgICBuZXcga21zLktleShzdGFjaywgJ0tleScsIHtcbiAgICAgIGtleVNwZWMsXG4gICAgICBrZXlVc2FnZTogS2V5VXNhZ2UuR0VORVJBVEVfVkVSSUZZX01BQyxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICAgIEtleVNwZWM6IGV4cGVjdGVkLFxuICAgICAgS2V5VXNhZ2U6ICdHRU5FUkFURV9WRVJJRllfTUFDJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZ3JhbnQgZ2VuZXJhdGUgbWFjIHBvbGljeScsICgpID0+IHtcbiAgICBjb25zdCBrZXkgPSBuZXcga21zLktleShzdGFjaywgJ0tleScsIHtcbiAgICAgIGtleVNwZWM6IEtleVNwZWMuSE1BQ18yNTYsXG4gICAgICBrZXlVc2FnZTogS2V5VXNhZ2UuR0VORVJBVEVfVkVSSUZZX01BQyxcbiAgICB9KTtcbiAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnVXNlcicpO1xuXG4gICAga2V5LmdyYW50R2VuZXJhdGVNYWModXNlcik7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICAgIEtleVBvbGljeToge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdrbXM6KicsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHsgQVdTOiB7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzppYW06OicsIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6cm9vdCddXSB9IH0sXG4gICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ2ttczpHZW5lcmF0ZU1hYycsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogeyAnRm46OkdldEF0dCc6IFsnS2V5OTYxQjczRkQnLCAnQXJuJ10gfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdncmFudCB2ZXJpZnkgbWFjIHBvbGljeScsICgpID0+IHtcbiAgICBjb25zdCBrZXkgPSBuZXcga21zLktleShzdGFjaywgJ0tleScsIHtcbiAgICAgIGtleVNwZWM6IEtleVNwZWMuSE1BQ18yNTYsXG4gICAgICBrZXlVc2FnZTogS2V5VXNhZ2UuR0VORVJBVEVfVkVSSUZZX01BQyxcbiAgICB9KTtcbiAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnVXNlcicpO1xuXG4gICAga2V5LmdyYW50VmVyaWZ5TWFjKHVzZXIpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpLZXknLCB7XG4gICAgICBLZXlQb2xpY3k6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAna21zOionLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7IEFXUzogeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6aWFtOjonLCB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnOnJvb3QnXV0gfSB9LFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdrbXM6VmVyaWZ5TWFjJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiB7ICdGbjo6R2V0QXR0JzogWydLZXk5NjFCNzNGRCcsICdBcm4nXSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dyYW50IGdlbmVyYXRlIG1hYyBwb2xpY3kgZm9yIGltcG9ydGVkIGtleScsICgpID0+IHtcbiAgICBjb25zdCBrZXlBcm4gPSAnYXJuOmF3czprbXM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjprZXkvMTIzNDU2NzgtMTIzNC0xMjM0LTEyMzQtMTIzNDU2Nzg5MDEyJztcbiAgICBjb25zdCBrZXkgPSBrbXMuS2V5LmZyb21LZXlBcm4oXG4gICAgICBzdGFjayxcbiAgICAgICdLZXknLFxuICAgICAga2V5QXJuLFxuICAgICk7XG4gICAgY29uc3QgdXNlciA9IG5ldyBpYW0uVXNlcihzdGFjaywgJ1VzZXInKTtcblxuICAgIGtleS5ncmFudEdlbmVyYXRlTWFjKHVzZXIpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdrbXM6R2VuZXJhdGVNYWMnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IGtleUFybixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdncmFudCB2ZXJpZnkgbWFjIHBvbGljeSBmb3IgaW1wb3J0ZWQga2V5JywgKCkgPT4ge1xuICAgIGNvbnN0IGtleUFybiA9ICdhcm46YXdzOmttczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmtleS8xMjM0NTY3OC0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkwMTInO1xuICAgIGNvbnN0IGtleSA9IGttcy5LZXkuZnJvbUtleUFybihcbiAgICAgIHN0YWNrLFxuICAgICAgJ0tleScsXG4gICAgICBrZXlBcm4sXG4gICAgKTtcbiAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnVXNlcicpO1xuXG4gICAga2V5LmdyYW50VmVyaWZ5TWFjKHVzZXIpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdrbXM6VmVyaWZ5TWFjJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiBrZXlBcm4sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ1NNMicsICgpID0+IHtcbiAgbGV0IHN0YWNrOiBjZGsuU3RhY2s7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBiZSB1c2VkIGZvciBLTVMga2V5IGNyZWF0aW9uJywgKCkgPT4ge1xuICAgIG5ldyBrbXMuS2V5KHN0YWNrLCAnS2V5MScsIHtcbiAgICAgIGtleVNwZWM6IEtleVNwZWMuU00yLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpLZXknLCB7XG4gICAgICBLZXlTcGVjOiAnU00yJyxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuXG5mdW5jdGlvbiBnZW5lcmF0ZUludmFsaWRLZXlTcGVjS2V5VXNhZ2VDb21iaW5hdGlvbnMoKSB7XG4gIC8vIENvcGllZCBmcm9tIEtleSBjbGFzc1xuICBjb25zdCBkZW55TGlzdHMgPSB7XG4gICAgW0tleVVzYWdlLkVOQ1JZUFRfREVDUllQVF06IFtcbiAgICAgIEtleVNwZWMuRUNDX05JU1RfUDI1NixcbiAgICAgIEtleVNwZWMuRUNDX05JU1RfUDM4NCxcbiAgICAgIEtleVNwZWMuRUNDX05JU1RfUDUyMSxcbiAgICAgIEtleVNwZWMuRUNDX1NFQ0dfUDI1NksxLFxuICAgICAgS2V5U3BlYy5ITUFDXzIyNCxcbiAgICAgIEtleVNwZWMuSE1BQ18yNTYsXG4gICAgICBLZXlTcGVjLkhNQUNfMzg0LFxuICAgICAgS2V5U3BlYy5ITUFDXzUxMixcbiAgICBdLFxuICAgIFtLZXlVc2FnZS5TSUdOX1ZFUklGWV06IFtcbiAgICAgIEtleVNwZWMuU1lNTUVUUklDX0RFRkFVTFQsXG4gICAgICBLZXlTcGVjLkhNQUNfMjI0LFxuICAgICAgS2V5U3BlYy5ITUFDXzI1NixcbiAgICAgIEtleVNwZWMuSE1BQ18zODQsXG4gICAgICBLZXlTcGVjLkhNQUNfNTEyLFxuICAgIF0sXG4gICAgW0tleVVzYWdlLkdFTkVSQVRFX1ZFUklGWV9NQUNdOiBbXG4gICAgICBLZXlTcGVjLlJTQV8yMDQ4LFxuICAgICAgS2V5U3BlYy5SU0FfMzA3MixcbiAgICAgIEtleVNwZWMuUlNBXzQwOTYsXG4gICAgICBLZXlTcGVjLkVDQ19OSVNUX1AyNTYsXG4gICAgICBLZXlTcGVjLkVDQ19OSVNUX1AzODQsXG4gICAgICBLZXlTcGVjLkVDQ19OSVNUX1A1MjEsXG4gICAgICBLZXlTcGVjLkVDQ19TRUNHX1AyNTZLMSxcbiAgICAgIEtleVNwZWMuU1lNTUVUUklDX0RFRkFVTFQsXG4gICAgICBLZXlTcGVjLlNNMixcbiAgICBdLFxuICB9O1xuICBjb25zdCB0ZXN0Q2FzZXM6IHsga2V5U3BlYzogS2V5U3BlYywga2V5VXNhZ2U6IEtleVVzYWdlLCB0b1N0cmluZzogKCkgPT4gc3RyaW5nIH1bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGtleVNwZWMgaW4gS2V5U3BlYykge1xuICAgIGZvciAoY29uc3Qga2V5VXNhZ2UgaW4gS2V5VXNhZ2UpIHtcbiAgICAgIGlmIChkZW55TGlzdHNba2V5VXNhZ2UgYXMgS2V5VXNhZ2VdLmluY2x1ZGVzKGtleVNwZWMgYXMgS2V5U3BlYykpIHtcbiAgICAgICAgdGVzdENhc2VzLnB1c2goe1xuICAgICAgICAgIGtleVNwZWM6IGtleVNwZWMgYXMgS2V5U3BlYyxcbiAgICAgICAgICBrZXlVc2FnZToga2V5VXNhZ2UgYXMgS2V5VXNhZ2UsXG4gICAgICAgICAgdG9TdHJpbmc6ICgpID0+IGAke2tleVNwZWN9IGNhbiBub3QgYmUgdXNlZCBmb3IgJHtrZXlVc2FnZX1gLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gU29ydGluZyBmb3IgZGVidWdnaW5nIHB1cnBvc2VzIHRvIHNlZSBpZiB0ZXN0IGNhc2VzIG1hdGNoIGRlbnkgbGlzdFxuICB0ZXN0Q2FzZXMuc29ydCgoYSwgYikgPT4gYS5rZXlVc2FnZS5sb2NhbGVDb21wYXJlKGIua2V5VXNhZ2UpKTtcbiAgcmV0dXJuIHRlc3RDYXNlcztcbn1cbiJdfQ==